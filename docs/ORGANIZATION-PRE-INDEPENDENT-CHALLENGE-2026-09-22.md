# Organization Project — Pre-Independent Challenge

- Date: 2026-09-22
- State: IMPLEMENTER ADVERSARIAL PASS / NOT INDEPENDENT REVIEW
- Incumbent preserved: `archive/v4-chronicle-2026-09-22`
- Current candidate: `experiments/signal-pull-v1/`
- Authority: defect-finding only; this document cannot approve the implementer's own work

## Purpose

Challenge Signal + Pull before handing it to a genuinely fresh reviewer.

This pass deliberately does **not** assume that the clean-sheet direction is better because it is newer or because it passed its own fixtures.

## Descriptive comparison

| Dimension | Preserved V4 Chronicle | Signal + Pull V1 |
| --- | --- | --- |
| Primary entry | Project | Material system state / signals |
| Current work | Resume checkpoint inside project | Separate Focus |
| Historical context | Chronicle prominent | History/provenance secondary |
| Cross-project orientation | Project switching required | System-level material signals |
| Quiet unfinished work | Still visible through project queues/state | Intentionally absent from default desk; Holdings remains inspectable |
| Waiting | Task/dependency state inside project | Wake/disposition contract is a first-class integrity concern |
| Failure risk | More visible inventory/noise | Higher consequence if resurfacing is wrong |
| Capture | Project/task oriented | Inbox intake separated from activation |
| Trust requirement | High | Higher, because quiet state is deliberately hidden |

Neither column is a verdict. They optimize different costs.

## Defects found in the pre-review pass

### 1. Unchanged current Focus was being counted as a material signal

The same active return point was represented as:

- current carried work; and
- a Signal solely because it was pinned/active.

That violated the selected architecture's distinction between **working set** and **material change**.

Correction:

- Current Focus now has its own persistent strip on the Signals surface.
- `user pinned` and `active return point` alone no longer generate material signals.
- A Focus item still signals if it also develops a real material condition such as overdue, stale return point, or material change.

### 2. Plain Inbox capture generated one signal per captured item

This could turn low-friction capture into immediate triage pressure and recreate attention overload.

Correction:

- `untriaged` alone no longer generates a material signal.
- Inbox count remains visible.
- Inbox can be opened directly through Holdings.
- An Inbox item still signals if another material condition fires, such as entering a due window.

### Mechanical safeguard

A new `signal-policy.js` owns the material-signal exclusion rule.

Reproduced checks:

- `signal-policy.test.js`: 7/7 PASS;
- `signal-contract.test.js`: 9/9 PASS.

The CI reliability workflow now runs both tests.

## Remaining substantive risks

### Trigger correctness

The strongest product risk remains unchanged:

> Quiet work is safe only if its wake/disposition model is correct enough.

Current synthetic fixtures prove deterministic mechanics, not real-world event observation.

### Metadata maintenance

Signal + Pull can fail its parent outcome if users must constantly maintain:

- review dates;
- dispositions;
- dependency links;
- return points;
- parking dates.

Real use must establish that this metadata costs less attention than it saves.

### External recovery

Local corruption handling is now materially safer, but the existing one-way GitHub snapshot is not sufficient for clean-browser restore or conflict-safe multi-device continuity.

### Synthetic-time limitation

The prototype uses a frozen anchor date for reproducible testing. Real-time scheduling behavior has not been productized.

### Inbox triage

Separating Inbox from Signals prevents capture noise, but a real system still needs a low-cost way to prevent Inbox from becoming a forgotten pile. A batch/review trigger may be needed; this has not been proven.

### Notification/external-event observation

The prototype can model a dependency completion or review date. It does not yet prove reliable observation/delivery outside the browser.

### Real-data migration

No incumbent Ledger migration has been attempted. This is deliberately deferred until architecture confidence is higher.

### Human factors beyond synthetic fixtures

Desktop/phone paths were tested, but sustained real-life usage, accessibility with assistive technology, and maintenance behavior remain unproven.

## Implementer conclusion

The candidate is coherent enough for independent evaluation, but it is **not approved by this pass**.

A fresh reviewer should be specifically encouraged to prefer V4 or request another architecture if Signal + Pull's hidden-state trust burden outweighs its reduction in visible inventory.
