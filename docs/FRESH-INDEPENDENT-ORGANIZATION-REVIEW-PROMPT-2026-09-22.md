# Fresh Independent Organization Review Prompt — 2026-09-22

Act as a **fresh independent reviewer** for the organization-system research in `BigCatMellow-Archive/Ledger-App-Tester`.

Do not assume Signal + Pull is better because it is newer, cleaner, more novel, or has more tests.

## Authority and target

This is a tester/research review only. Do not modify or promote `BigCatMellow/Ledger-App`.

The preserved incumbent is available at branch:

`archive/v4-chronicle-2026-09-22`

The current candidate lives at:

`experiments/signal-pull-v1/`

## Read first

1. `docs/LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md`
2. `docs/LEDGER-ORGANIZATION-MODEL-2026-09-22.md`
3. `docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md`
4. `experiments/attention-engine-v1/RESULT.md`
5. `experiments/architecture-search/README.md`
6. `experiments/signal-pull-v1/README.md`
7. `experiments/signal-pull-v1/RESULT.md`
8. `experiments/signal-pull-v1/RELIABILITY.md`
9. `experiments/ranking-v1/RESULT.md`
10. `docs/ORGANIZATION-PRE-INDEPENDENT-CHALLENGE-2026-09-22.md`

Inspect the actual prototype/code and preserved V4 rather than trusting rationale.

## Reproduce

Run the fixed suite or equivalent exact checks:

- Attention Engine V1;
- Signal + Pull snapshot/recovery tests;
- Signal policy / Focus-Inbox separation tests;
- Ranking V1.

Inspect representative desktop and phone behavior.

## Challenge questions

Try to falsify these claims:

1. Quiet work can leave default attention without becoming lost.
2. Signal + Pull reduces cognitive tracking rather than moving the burden into metadata maintenance.
3. Capture can remain low-friction without Inbox becoming either noisy or forgotten.
4. Current Focus is recoverable without being duplicated as a signal.
5. A stale/wrong wake rule becomes detectable enough to avoid silent failure.
6. Material signals are selective enough to stay useful under real high-volume work.
7. Return points genuinely reduce re-entry work.
8. The Reliability surface communicates what is and is not recoverable truthfully.
9. Signal + Pull remains usable on phone and keyboard paths.
10. The clean-sheet architecture actually beats or complements V4 on the parent outcome rather than merely being different.
11. V4's visible project/chronology model may be safer or cognitively cheaper for some workloads.
12. A simpler system than either V4 or Signal + Pull could satisfy the evidence with less metadata/process.

## Required comparison

Compare at least:

- preserved V4 Chronicle;
- current Signal + Pull;
- a plausible simpler alternative if one is apparent.

Do not average them into a compromise by default.

## Review output

Return exactly one review state:

- `APPROVED` — evidence is sufficient for the tester research arc to be considered complete;
- `CHANGES_REQUESTED` — concrete correctable defects remain;
- `BLOCKED` — an unresolved dependency prevents a valid verdict.

Then provide:

- strongest evidence supporting the verdict;
- blocker/major/minor findings;
- any reproduced failures;
- whether the metadata-maintenance tradeoff appears justified;
- whether any claim should be narrowed;
- whether production promotion should remain explicitly separate.

A review is not independent if performed by the implementer/operator who produced the current substantive candidate.
