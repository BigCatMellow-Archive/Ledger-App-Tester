'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;
const ANCHOR = new Date('2026-09-22T13:30:00.000Z');

function atDays(delta) {
  return new Date(ANCHOR.getTime() + delta * DAY_MS).toISOString();
}
function base(id, overrides = {}) {
  return {
    id,
    title: `Commitment ${id}`,
    scope: `scope-${String(Number(id.replace(/\D/g, '') || 0) % 25).padStart(2, '0')}`,
    workState: 'OPEN',
    attentionState: 'NEXT',
    createdAt: atDays(-30),
    updatedAt: atDays(-1),
    lastSeenAt: atDays(-1),
    materialChangedAt: atDays(-1),
    nextAction: 'Continue',
    ...overrides,
  };
}
function buildHighVolumeFixture() {
  const commitments = [];
  commitments.push(base('dep-done', {
    title: 'Dependency that completed',
    workState: 'DONE',
    attentionState: 'QUIET',
    updatedAt: atDays(-0.1),
  }));
  commitments.push(base('due-soon', {
    title: 'Prepare time-sensitive packet',
    dueAt: atDays(1),
  }));
  commitments.push(base('newly-unblocked', {
    title: 'Resume work after dependency',
    attentionState: 'WAITING',
    waitingOn: ['dep-done'],
    disposition: 'Wake when dependency completes',
  }));
  commitments.push(base('waiting-review-expired', {
    title: 'Follow up on unanswered request',
    attentionState: 'WAITING',
    reviewAt: atDays(-1),
    disposition: 'Review if no response',
  }));
  commitments.push(base('active-return-point', {
    title: 'Current deep work',
    workState: 'ACTIVE',
    attentionState: 'NOW',
    userPinned: true,
    returnPoint: {
      summary: 'Validated the first two cases.',
      nextAction: 'Run the edge-case fixture.',
      unresolved: 'Need to verify stale dependency behavior.',
      updatedAt: atDays(-0.2),
    },
  }));
  commitments.push(base('material-change', {
    title: 'Policy changed while away',
    lastSeenAt: atDays(-3),
    materialChangedAt: atDays(-0.5),
  }));
  for (let i = 1; i <= 15; i++) {
    commitments.push(base(`waiting-${i}`, {
      attentionState: 'WAITING',
      reviewAt: atDays(5 + i),
      disposition: 'Review on scheduled date',
    }));
  }
  for (let i = 1; i <= 15; i++) {
    commitments.push(base(`parked-${i}`, {
      attentionState: 'PARKED',
      parkedUntil: atDays(10 + i),
      disposition: 'Wake at parked-until date',
    }));
  }
  while (commitments.length < 100) {
    const i = commitments.length + 1;
    commitments.push(base(`routine-${i}`, {
      title: `Routine eligible work ${i}`,
      attentionState: 'NEXT',
      updatedAt: atDays(-0.5),
      lastSeenAt: atDays(-0.5),
      materialChangedAt: atDays(-0.5),
    }));
  }
  return commitments;
}
function buildStaleReturnPointFixture() {
  return base('stale-return', {
    title: 'Return point invalidated by later change',
    workState: 'ACTIVE',
    attentionState: 'NOW',
    returnPoint: {
      summary: 'Ready to submit old version.',
      nextAction: 'Submit the old version.',
      unresolved: '',
      updatedAt: atDays(-2),
    },
    materialChangedAt: atDays(-1),
    lastSeenAt: atDays(-2),
  });
}
function buildMaterialEventsFixture() {
  return [
    { id: 'a1', materialKey: 'journal-1', kind: 'audit', title: 'Journal entry added', when: atDays(-1) },
    { id: 'j1', materialKey: 'journal-1', kind: 'journal', title: 'Actual journal content', when: atDays(-1), body: 'Meaningful context' },
    { id: 'a2', materialKey: 'note-1', kind: 'audit', title: 'Note updated', when: atDays(-0.8) },
    { id: 'n1', materialKey: 'note-1', kind: 'note', title: 'Actual note content', when: atDays(-0.8), body: 'Useful note' },
    { id: 'a3', materialKey: 'task-1', kind: 'audit', title: 'Task completed', when: atDays(-0.6) },
    { id: 'p1', materialKey: 'task-1', kind: 'proof', title: 'Completed with proof', when: atDays(-0.6), body: 'Verified output' },
  ];
}
module.exports = {
  ANCHOR: ANCHOR.toISOString(),
  atDays,
  base,
  buildHighVolumeFixture,
  buildStaleReturnPointFixture,
  buildMaterialEventsFixture,
};
