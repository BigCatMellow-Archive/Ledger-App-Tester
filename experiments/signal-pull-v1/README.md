# Signal + Pull V1

- State: isolated functional prototype / reliability contract hardened
- Parent selection: [../architecture-search/README.md](../architecture-search/README.md)
- Mechanics evidence: [../attention-engine-v1/RESULT.md](../attention-engine-v1/RESULT.md)
- Incumbent V4 archive branch: `archive/v4-chronicle-2026-09-22`
- Production impact: none

## Purpose

Test the selected clean-sheet architecture without inheriting Ledger's project-first UI or storage contract.

The prototype implements three different jobs:

```text
SIGNALS
What changed enough to deserve awareness, judgment, or action?

FOCUS
What is the one commitment I am actively carrying, and where do I resume?

HOLDINGS
What exists outside attention, why is it quiet, and how will it return?
```

Capture is deliberately separate from commitment. New obligations enter `INBOX`; they do not become active merely because they were recorded.

## Run

Open `index.html` from a static web server or the repository's GitHub Pages path.

The experiment seeds a fixed 100-commitment workload anchored to `2026-09-22T13:30:00Z` so the behavior is reproducible.

## Implemented behavior

- four seeded material-change signals on the default desk;
- current Focus shown separately from material signals;
- Inbox count/retrieval shown separately so low-friction capture does not flood the Signal desk;
- deterministic “why now” reasons;
- pull/resume into one Focus surface;
- active-capacity guard;
- editable return point;
- complete / pause / park transitions;
- waiting-review decisions;
- dependency completion wake-up;
- material-change signal;
- searchable Holdings with all commitments;
- warning for quiet unfinished work with no wake/disposition path;
- truthful zero-signal state;
- low-friction Inbox capture;
- local save-status truth with explicit external-save status;
- dedicated Reliability view separating local durability, external recovery, quiet-work integrity, and snapshot format;
- validated Signal + Pull JSON snapshot export/import;
- preview-before-apply import of incumbent Ledger snapshots through the tested Ledger Import V1 bridge;
- corruption recovery that preserves raw unreadable data and blocks normal editing instead of silently reseeding;
- regression tests for snapshot format and app recovery behavior.

## Important boundaries

This is not a production schema.

The prototype does **not** yet include:

- production migration of real Ledger data;
- real remote pull/restore or stale-writer conflict protection;
- external event observation;
- email/calendar integration;
- cloud synchronization;
- production reminder delivery;
- AI ranking;
- a final vocabulary;
- a final visual identity.

The fixed anchor date and synthetic content are test fixtures, not product behavior.

## Verification

See [RESULT.md](RESULT.md) for the functional prototype, [RELIABILITY.md](RELIABILITY.md) for the reliability contract, and [../ledger-import-v1/RESULT.md](../ledger-import-v1/RESULT.md) for the incumbent Ledger conversion bridge.

Reproducible reliability checks:

```text
node state-io.test.js
node reliability-contract.test.js
node signal-policy.test.js
node signal-contract.test.js
```

The reliability branch passed 6/6 snapshot-format tests and 8/8 app corruption/import contract tests. The pre-independent challenge then passed 7/7 material-signal policy tests and 9/9 Focus/Inbox separation checks. `.github/workflows/test-signal-pull-reliability.yml` preserves these as regression checks.

The current production Ledger one-way GitHub snapshot is documented as backup evidence, not sufficient clean-browser restore or multi-device synchronization.
