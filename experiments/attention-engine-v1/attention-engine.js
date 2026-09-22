'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;

function toTime(value) {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}
function iso(value) {
  const t = toTime(value);
  return t === null ? null : new Date(t).toISOString();
}
function normalizeCommitment(raw) {
  const c = raw && typeof raw === 'object' ? raw : {};
  return {
    id: String(c.id || ''),
    title: String(c.title || '').trim(),
    scope: c.scope ? String(c.scope) : '',
    workState: String(c.workState || 'OPEN').toUpperCase(),
    attentionState: c.attentionState ? String(c.attentionState).toUpperCase() : '',
    createdAt: iso(c.createdAt),
    updatedAt: iso(c.updatedAt),
    dueAt: iso(c.dueAt),
    reviewAt: iso(c.reviewAt),
    parkedUntil: iso(c.parkedUntil),
    lastSeenAt: iso(c.lastSeenAt),
    materialChangedAt: iso(c.materialChangedAt),
    userPinned: !!c.userPinned,
    waitingOn: Array.isArray(c.waitingOn) ? c.waitingOn.map(String) : [],
    nextAction: String(c.nextAction || '').trim(),
    returnPoint: c.returnPoint && typeof c.returnPoint === 'object' ? {
      summary: String(c.returnPoint.summary || '').trim(),
      nextAction: String(c.returnPoint.nextAction || '').trim(),
      unresolved: String(c.returnPoint.unresolved || '').trim(),
      updatedAt: iso(c.returnPoint.updatedAt),
    } : null,
    staleAfterDays: Number.isFinite(c.staleAfterDays) ? c.staleAfterDays : null,
    disposition: c.disposition ? String(c.disposition) : '',
    manualOnly: !!c.manualOnly,
    metadata: c.metadata && typeof c.metadata === 'object' ? { ...c.metadata } : {},
  };
}
function dependencyMap(commitments) {
  const map = new Map();
  for (const c of commitments) map.set(c.id, c);
  return map;
}
function isDone(c) { return c.workState === 'DONE'; }
function hasFutureWake(c) {
  return !!(c.reviewAt || c.parkedUntil || c.waitingOn.length || c.manualOnly);
}
function quietDispositionProblem(c) {
  if (isDone(c)) return false;
  const quiet = ['WAITING', 'PARKED', 'QUIET'].includes(c.attentionState);
  return quiet && !hasFutureWake(c) && !c.disposition;
}
function dependencyStatus(c, byId) {
  if (!c.waitingOn.length) return { waiting: false, released: false, missing: [] };
  const missing = [];
  let allDone = true;
  for (const id of c.waitingOn) {
    const dep = byId.get(id);
    if (!dep) {
      missing.push(id);
      allDone = false;
      continue;
    }
    if (!isDone(dep)) allDone = false;
  }
  return { waiting: !allDone, released: allDone && missing.length === 0, missing };
}
function isReturnPointStale(c) {
  if (!c.returnPoint?.updatedAt || !c.materialChangedAt) return false;
  return toTime(c.materialChangedAt) > toTime(c.returnPoint.updatedAt);
}
function classifyCommitment(c, context) {
  const now = toTime(context.now) ?? Date.now();
  const dueSoonDays = Number.isFinite(context.dueSoonDays) ? context.dueSoonDays : 3;
  const byId = context.byId;
  const reasons = [];
  const dep = dependencyStatus(c, byId);

  if (isDone(c)) return { bucket: 'quiet', reasons: ['completed'], attention: false };
  if (c.userPinned) reasons.push('user pinned');

  if (c.dueAt) {
    const due = toTime(c.dueAt);
    if (due <= now) reasons.push('due now or overdue');
    else if (due - now <= dueSoonDays * DAY_MS) reasons.push(`due within ${dueSoonDays} days`);
  }
  if (c.reviewAt && toTime(c.reviewAt) <= now) reasons.push('waiting review due');
  if (dep.released && c.attentionState === 'WAITING') reasons.push('dependency completed');
  if (dep.missing.length) reasons.push('dependency reference missing');
  if (c.materialChangedAt && c.lastSeenAt && toTime(c.materialChangedAt) > toTime(c.lastSeenAt)) {
    reasons.push('material change since last seen');
  }
  if (isReturnPointStale(c)) reasons.push('return point stale');
  if (c.staleAfterDays !== null && c.updatedAt) {
    const staleAt = toTime(c.updatedAt) + c.staleAfterDays * DAY_MS;
    if (staleAt <= now) reasons.push(`stale for ${c.staleAfterDays}+ days`);
  }

  if (reasons.length) return { bucket: 'needsAttention', reasons, attention: true };
  if (c.attentionState === 'NOW' || c.workState === 'ACTIVE') {
    return { bucket: 'now', reasons: c.returnPoint ? ['active return point'] : ['active'], attention: true };
  }
  if (c.attentionState === 'INBOX') return { bucket: 'inbox', reasons: ['untriaged'], attention: true };
  if (c.attentionState === 'WAITING' || dep.waiting) {
    return { bucket: 'waiting', reasons: dep.waiting ? ['waiting on dependency'] : ['waiting'], attention: false };
  }
  if (c.attentionState === 'PARKED') {
    if (c.parkedUntil && toTime(c.parkedUntil) <= now) {
      return { bucket: 'needsAttention', reasons: ['parked wake time reached'], attention: true };
    }
    return { bucket: 'parked', reasons: ['deliberately parked'], attention: false };
  }
  if (c.attentionState === 'QUIET') return { bucket: 'quiet', reasons: ['explicitly quiet'], attention: false };
  return { bucket: 'next', reasons: ['eligible'], attention: false };
}
const REASON_WEIGHT = new Map([
  ['due now or overdue', 100],
  ['return point stale', 95],
  ['dependency reference missing', 90],
  ['waiting review due', 85],
  ['dependency completed', 80],
  ['material change since last seen', 75],
  ['user pinned', 70],
  ['active return point', 65],
  ['active', 60],
  ['untriaged', 50],
  ['eligible', 10],
]);
function reasonWeight(reason) {
  if (REASON_WEIGHT.has(reason)) return REASON_WEIGHT.get(reason);
  if (reason.startsWith('due within')) return 88;
  if (reason.startsWith('stale for')) return 55;
  if (reason === 'parked wake time reached') return 82;
  return 0;
}
function sortByAttention(a, b) {
  const aw = Math.max(...a.reasons.map(reasonWeight), 0);
  const bw = Math.max(...b.reasons.map(reasonWeight), 0);
  if (aw !== bw) return bw - aw;
  const ad = toTime(a.commitment.dueAt) ?? Number.POSITIVE_INFINITY;
  const bd = toTime(b.commitment.dueAt) ?? Number.POSITIVE_INFINITY;
  if (ad !== bd) return ad - bd;
  const au = toTime(a.commitment.updatedAt) ?? 0;
  const bu = toTime(b.commitment.updatedAt) ?? 0;
  if (au !== bu) return bu - au;
  return a.commitment.id.localeCompare(b.commitment.id);
}
function evaluateAttention(rawCommitments, options = {}) {
  const commitments = rawCommitments.map(normalizeCommitment);
  const byId = dependencyMap(commitments);
  const context = { now: options.now || new Date().toISOString(), dueSoonDays: options.dueSoonDays, byId };
  const result = { needsAttention: [], now: [], inbox: [], next: [], waiting: [], parked: [], quiet: [], missingDisposition: [], all: [] };

  for (const commitment of commitments) {
    const classified = classifyCommitment(commitment, context);
    const entry = { commitment, reasons: classified.reasons };
    result[classified.bucket].push(entry);
    result.all.push({ ...entry, bucket: classified.bucket });
    if (quietDispositionProblem(commitment)) result.missingDisposition.push(commitment);
  }
  for (const key of ['needsAttention', 'now', 'inbox', 'next', 'waiting', 'parked']) result[key].sort(sortByAttention);
  return result;
}
function continuityPacket(raw) {
  const c = normalizeCommitment(raw);
  return {
    id: c.id,
    title: c.title,
    state: c.workState,
    summary: c.returnPoint?.summary || '',
    nextAction: c.returnPoint?.nextAction || c.nextAction || '',
    unresolved: c.returnPoint?.unresolved || '',
    returnPointAt: c.returnPoint?.updatedAt || null,
    materialChangedAt: c.materialChangedAt,
    stale: isReturnPointStale(c),
  };
}
function captureCommitment(input, now) {
  const at = iso(now) || new Date().toISOString();
  return normalizeCommitment({
    id: input.id,
    title: input.title,
    scope: input.scope,
    workState: 'OPEN',
    attentionState: 'INBOX',
    createdAt: at,
    updatedAt: at,
    nextAction: input.nextAction || '',
    metadata: input.metadata || {},
  });
}
function admitToNow(rawCommitment, rawCommitments, options = {}) {
  const c = normalizeCommitment(rawCommitment);
  const limit = Number.isFinite(options.limit) ? options.limit : 3;
  const override = !!options.override;
  const evaluated = evaluateAttention(rawCommitments, { now: options.now });
  const currentNow = evaluated.now.length +
    evaluated.needsAttention.filter(x => x.commitment.workState === 'ACTIVE' || x.commitment.attentionState === 'NOW').length;

  if (currentNow >= limit && !override) {
    return { admitted: false, reason: 'active capacity reached', suggestedAttentionState: 'NEXT', currentNow, limit };
  }
  return {
    admitted: true,
    reason: override && currentNow >= limit ? 'user override' : 'capacity available',
    commitment: { ...c, workState: 'ACTIVE', attentionState: 'NOW' },
    currentNow: currentNow + 1,
    limit,
  };
}
function materialDelta(rawEvents) {
  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const best = new Map();
  const rank = { audit: 0, work: 1, note: 2, journal: 2, proof: 3, decision: 3 };
  for (const event of events) {
    if (!event || typeof event !== 'object') continue;
    const key = String(event.materialKey || event.id || '');
    if (!key) continue;
    const candidate = {
      id: String(event.id || key),
      materialKey: key,
      kind: String(event.kind || 'audit'),
      title: String(event.title || ''),
      when: iso(event.when),
      body: String(event.body || ''),
    };
    const prior = best.get(key);
    if (!prior || (rank[candidate.kind] ?? 0) > (rank[prior.kind] ?? 0)) best.set(key, candidate);
  }
  return [...best.values()]
    .filter(e => e.kind !== 'audit')
    .sort((a, b) => (toTime(b.when) ?? 0) - (toTime(a.when) ?? 0));
}
function serializeState(value) { return JSON.stringify(value); }
function deserializeState(value) { return JSON.parse(value); }

module.exports = {
  DAY_MS,
  normalizeCommitment,
  evaluateAttention,
  continuityPacket,
  captureCommitment,
  admitToNow,
  materialDelta,
  serializeState,
  deserializeState,
  isReturnPointStale,
};
