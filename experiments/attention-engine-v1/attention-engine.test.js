'use strict';

const assert = require('node:assert/strict');
const {
  evaluateAttention,
  continuityPacket,
  captureCommitment,
  admitToNow,
  materialDelta,
  serializeState,
  deserializeState,
} = require('./attention-engine');
const {
  ANCHOR,
  atDays,
  base,
  buildHighVolumeFixture,
  buildStaleReturnPointFixture,
  buildMaterialEventsFixture,
} = require('./fixtures');

const results = [];
function test(name, fn) {
  try { fn(); results.push({ name, pass: true }); }
  catch (error) { results.push({ name, pass: false, error }); }
}

test('ORG-F01 high-volume global triage finds the five seeded attention-worthy commitments', () => {
  const commitments = buildHighVolumeFixture();
  assert.equal(commitments.length, 100);
  const out = evaluateAttention(commitments, { now: ANCHOR, dueSoonDays: 3 });
  const ids = new Set(out.needsAttention.map(x => x.commitment.id));
  for (const id of ['due-soon', 'newly-unblocked', 'waiting-review-expired', 'active-return-point', 'material-change']) {
    assert.ok(ids.has(id), `missing ${id}`);
  }
  assert.equal(out.needsAttention.length, 5);
  for (const item of out.needsAttention) assert.ok(item.reasons.length > 0);
});

test('ORG-F02 quiet backlog has no missing resurfacing/disposition paths', () => {
  const out = evaluateAttention(buildHighVolumeFixture(), { now: ANCHOR });
  assert.equal(out.missingDisposition.length, 0);
  assert.ok(out.waiting.length >= 15);
  assert.equal(out.parked.length, 15);
});

test('ORG-F03 interruption preserves a compact continuity packet', () => {
  const c = base('resume', {
    workState: 'ACTIVE',
    attentionState: 'NOW',
    returnPoint: {
      summary: 'Mapped the first three records.',
      nextAction: 'Validate record four.',
      unresolved: 'Need source confirmation.',
      updatedAt: atDays(-0.1),
    },
  });
  const packet = continuityPacket(c);
  assert.equal(packet.summary, 'Mapped the first three records.');
  assert.equal(packet.nextAction, 'Validate record four.');
  assert.equal(packet.unresolved, 'Need source confirmation.');
  assert.equal(packet.stale, false);
});

test('ORG-F04 waiting dependency completion resurfaces with an explicit reason', () => {
  const dep = base('dep', { workState: 'DONE', attentionState: 'QUIET' });
  const waiter = base('waiter', {
    attentionState: 'WAITING',
    waitingOn: ['dep'],
    disposition: 'Wake when dep completes',
  });
  const out = evaluateAttention([dep, waiter], { now: ANCHOR });
  const item = out.needsAttention.find(x => x.commitment.id === 'waiter');
  assert.ok(item);
  assert.ok(item.reasons.includes('dependency completed'));
});

test('ORG-F05 unchanged waiting work remains quiet before its review trigger', () => {
  const waiter = base('waiter', {
    attentionState: 'WAITING',
    reviewAt: atDays(4),
    disposition: 'Review later',
  });
  const out = evaluateAttention([waiter], { now: ANCHOR });
  assert.equal(out.needsAttention.length, 0);
  assert.equal(out.waiting.length, 1);
});

test('ORG-F06 stale return point is surfaced instead of treated as current', () => {
  const c = buildStaleReturnPointFixture();
  const out = evaluateAttention([c], { now: ANCHOR });
  const item = out.needsAttention[0];
  assert.equal(item.commitment.id, 'stale-return');
  assert.ok(item.reasons.includes('return point stale'));
  assert.equal(continuityPacket(c).stale, true);
});

test('ORG-F07 material delta keeps structured meaning and suppresses duplicate audit narration', () => {
  const delta = materialDelta(buildMaterialEventsFixture());
  assert.equal(delta.length, 3);
  assert.deepEqual(delta.map(x => x.kind).sort(), ['journal', 'note', 'proof']);
  assert.ok(delta.every(x => x.kind !== 'audit'));
});

test('ORG-F08 active-capacity gate keeps new work out of NOW unless explicitly overridden', () => {
  const current = [1, 2, 3].map(i => base(`now-${i}`, { workState: 'ACTIVE', attentionState: 'NOW' }));
  const candidate = base('candidate');
  const blocked = admitToNow(candidate, current, { now: ANCHOR, limit: 3 });
  assert.equal(blocked.admitted, false);
  assert.equal(blocked.reason, 'active capacity reached');
  assert.equal(blocked.suggestedAttentionState, 'NEXT');
  const override = admitToNow(candidate, current, { now: ANCHOR, limit: 3, override: true });
  assert.equal(override.admitted, true);
  assert.equal(override.reason, 'user override');
});

test('ORG-F09 ordering is explainable through deterministic reasons', () => {
  const items = [
    base('pin', { userPinned: true }),
    base('due', { dueAt: atDays(1) }),
    base('review', { attentionState: 'WAITING', reviewAt: atDays(-1), disposition: 'Review' }),
  ];
  const out = evaluateAttention(items, { now: ANCHOR });
  assert.deepEqual(out.needsAttention.map(x => x.commitment.id), ['due', 'review', 'pin']);
  assert.ok(out.needsAttention.every(x => x.reasons.length));
});

test('ORG-F10 rapid capture can remain untriaged instead of becoming active', () => {
  const captured = Array.from({ length: 10 }, (_, i) =>
    captureCommitment({ id: `capture-${i}`, title: `Incoming ${i}` }, ANCHOR)
  );
  assert.ok(captured.every(c => c.attentionState === 'INBOX'));
  assert.ok(captured.every(c => c.workState === 'OPEN'));
});

test('ORG-F11 state serialization round-trip preserves attention and continuity truth', () => {
  const original = {
    commitments: [
      base('persist', {
        attentionState: 'WAITING',
        reviewAt: atDays(2),
        disposition: 'Review later',
        returnPoint: {
          summary: 'Paused safely.',
          nextAction: 'Continue.',
          unresolved: '',
          updatedAt: atDays(-1),
        },
      }),
    ],
    saveStatus: { local: 'saved', external: 'not-configured' },
  };
  const restored = deserializeState(serializeState(original));
  assert.deepEqual(restored, original);
  assert.notEqual(restored.saveStatus.local, restored.saveStatus.external);
});

test('ORG-F12 empty attention state can truthfully remain empty', () => {
  const items = [
    base('done', { workState: 'DONE', attentionState: 'QUIET' }),
    base('wait', { attentionState: 'WAITING', reviewAt: atDays(5), disposition: 'Review later' }),
    base('park', { attentionState: 'PARKED', parkedUntil: atDays(8), disposition: 'Wake later' }),
  ];
  const out = evaluateAttention(items, { now: ANCHOR });
  assert.equal(out.needsAttention.length, 0);
  assert.equal(out.now.length, 0);
  assert.equal(out.inbox.length, 0);
});

test('ORG-F13 deep-work continuity packet is independent of project/Chronicle architecture', () => {
  const c = {
    id: 'free-shape',
    title: 'Architecture-neutral deep work',
    workState: 'ACTIVE',
    attentionState: 'NOW',
    nextAction: 'Fallback next move',
    returnPoint: {
      summary: 'Established the governing constraint.',
      nextAction: 'Test the alternative representation.',
      unresolved: 'No project or Chronicle required.',
      updatedAt: atDays(-0.1),
    },
    materialChangedAt: atDays(-0.1),
  };
  const packet = continuityPacket(c);
  assert.equal(packet.nextAction, 'Test the alternative representation.');
  assert.match(packet.unresolved, /No project or Chronicle/);
});

test('negative guard: quiet unfinished work with no wake/disposition is detected', () => {
  const c = base('lost', { attentionState: 'WAITING', reviewAt: null, disposition: '', waitingOn: [] });
  const out = evaluateAttention([c], { now: ANCHOR });
  assert.equal(out.missingDisposition.length, 1);
  assert.equal(out.missingDisposition[0].id, 'lost');
});

for (const result of results) {
  if (result.pass) console.log(`PASS ${result.name}`);
  else {
    console.error(`FAIL ${result.name}`);
    console.error(result.error?.stack || result.error);
  }
}
const failed = results.filter(x => !x.pass);
console.log(`\n${results.length - failed.length}/${results.length} tests passed`);
if (failed.length) process.exit(1);
