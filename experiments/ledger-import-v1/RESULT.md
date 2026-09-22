# Ledger Import V1 — Result

- Date: 2026-09-22
- State: CONVERSION + TESTER UI PASS / REAL-SNAPSHOT COMPARISON NEXT
- Parent roadmap: [../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md)
- Source architecture: incumbent Ledger
- Destination architecture: Signal + Pull
- Production impact: none

## Result

A conservative incumbent-shaped data bridge is now functional in the tester.

### Pure conversion

Exact branch tests:

`14 / 14 PASS`

Verified:

- source object is not mutated;
- every converted commitment retains source traceability;
- ordinary OPEN work receives no invented urgency;
- DONE work becomes quiet completed state;
- the most recently touched ACTIVE item becomes Focus;
- additional source-ACTIVE items are surfaced for explicit Inbox triage rather than silently remaining parallel Focus items;
- free-text dependencies produce manual-review state rather than fabricated structured dependencies/review dates;
- notes, journal, worklog, and project framing survive as supporting provenance;
- duplicate source IDs cannot create duplicate destination IDs.

### Preview/apply contract

Exact branch tests:

`12 / 12 PASS`

Verified:

- converter loads before the Signal + Pull app;
- selected Ledger data is converted in memory for preview;
- preview does not replace current Signal + Pull state;
- preview performs no storage write;
- invalid JSON does not alter current state;
- invalid Ledger-shaped data does not alter current state;
- apply first saves the current Signal + Pull snapshot to a separate pre-import backup key;
- converted state passes SignalStateIO normalization before persistence;
- only explicit Apply replaces the tester state.

## Full regression

PR #16 ran both existing GitHub Actions workflows successfully on the implementation head before this result record was added:

- **Test Signal + Pull reliability — success**
- **Test Organization Research Suite — success**

The full organization suite retains attention mechanics, snapshot/corruption behavior, signal policy, Focus/Inbox separation, ranking tests, and now the Ledger import tests.

## What the bridge deliberately does not do

It does not:

- modify the selected Ledger source file;
- modify the preserved V4 branch;
- migrate the production Ledger repo;
- invent dependency IDs;
- invent review/wake dates;
- infer that every project/note is an actionable commitment;
- treat project hierarchy as mandatory navigation;
- pretend multiple source ACTIVE items can all occupy one Focus.

## Main finding

The existing Ledger data model contains enough information to populate the clean-sheet candidate **without requiring the old interface architecture to survive**.

However, some of the most valuable new behavior—automatic resurfacing—cannot be reconstructed reliably from old free-text dependency fields. Those records correctly degrade to explicit manual review.

That is useful evidence:

> Better organization cannot always be backfilled from old data. Some future wake/resurfacing truth must be captured prospectively.

## Remaining test

The next meaningful test is not another synthetic fixture.

Use the **same real Ledger snapshot** in both:

1. preserved V4 Chronicle;
2. Signal + Pull conversion.

Compare:

- time to identify what needs attention;
- time to resume interrupted work;
- whether anything feels hidden;
- how much imported manual-review cleanup is required;
- whether project framing/context is still accessible when useful;
- whether the quiet default actually reduces mental load;
- whether V4 is preferable for some kinds of work.

Until that comparison happens, the bridge is technically verified but the clean-sheet candidate is still not proven better for the user's real workload.
