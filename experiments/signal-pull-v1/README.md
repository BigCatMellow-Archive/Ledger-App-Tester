# Signal + Pull V1

- State: isolated functional prototype
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

- five seeded material signals;
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
- local save-status truth with explicit external-save status.

## Important boundaries

This is not a production schema.

The prototype does **not** yet include:

- migration/import of real Ledger data;
- external event observation;
- email/calendar integration;
- cloud synchronization;
- production reminder delivery;
- AI ranking;
- a final vocabulary;
- a final visual identity.

The fixed anchor date and synthetic content are test fixtures, not product behavior.

## Verification

See [RESULT.md](RESULT.md).

The exact committed `index.html`, `style.css`, and `app.js` were fetched back from GitHub and matched the locally tested files by character length + FNV-1a fingerprint.
