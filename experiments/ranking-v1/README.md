# Ranking V1 — deterministic vs user-authored vs hybrid

- Date: 2026-09-22
- State: fixed experiment
- Parent roadmap: `docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md`
- Product baseline: Signal + Pull V1
- AI ranking: deliberately **not included** in the first comparison

## Question

Does adding explicit user preference materially improve the deterministic Signal + Pull ordering enough to justify its maintenance cost, and can a small hybrid preserve hard safety/integrity guards when manual preference becomes stale?

This is not an attempt to discover a universal ranking of human obligations.

Each fixture contains an explicit **operator intent** and expected local order. That fixture statement is the comparison authority for that scenario.

## Methods

### A — Deterministic

Current-state reasons only:

- integrity defect;
- overdue/due state;
- stale return point;
- waiting review;
- dependency release;
- material change;
- active return point;
- ordinary eligibility.

No user ordering metadata.

### B — User-authored

Explicit `userOrder` wins when present. Unspecified items fall back to deterministic ordering.

This tests how much direct control can help, but deliberately exposes the stale-priority failure mode.

### C — Hybrid

Only a very small set of **hard guards** outrank user order:

- integrity defect;
- due now / overdue;
- dependency reference missing.

Everything else allows explicit user order to act as a tie-break/override before deterministic fallback.

This is intentionally conservative. It does not treat “due in three days” or “material change” as absolute authority over a user's current focus.

## Metrics

The experiment reports:

- top-choice match against stated fixture intent;
- pairwise order disagreements;
- hard-guard violations;
- number of user-order metadata values required;
- explanation completeness.

These are scenario diagnostics, not universal productivity scores.

## Run

`node ranking.test.js`

## Decision rule

Do **not** proceed to AI ranking merely because a model could rank the list.

AI ranking earns a later experiment only if:

1. deterministic routing leaves a material gap;
2. optional user preference cannot close it cheaply;
3. the hybrid still requires burdensome manual maintenance or performs poorly on representative scenarios;
4. a model can be evaluated against a real target without hiding its reasoning/authority.

If hybrid closes the demonstrated gap with small, inspectable metadata, stop there until real-use evidence says otherwise.
