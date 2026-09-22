# Signal + Pull V1 — Prototype Result

- Date: 2026-09-22
- State: PHASE 3 FUNCTIONAL PROTOTYPE PASS / RELIABILITY HARDENING NEXT
- Scope: isolated tester prototype with synthetic data
- Selected architecture: Signal + Pull

## Result

The prototype successfully exercised the selected architecture on desktop and phone viewports.

### Interaction checks — PASS

- initial synthetic state produced exactly 5 material signals;
- no horizontal overflow at 1440px desktop width;
- no horizontal overflow at 390px phone width;
- no erroneous 1970 date rendering;
- dependency-completed signal could be pulled into Focus;
- Focus received programmatic heading focus after navigation;
- return point could be edited and saved;
- pausing Focus for two days removed it from immediate signals;
- expired waiting review could be deferred for two days;
- Capture created a new `OPEN / INBOX` commitment rather than activating it;
- Holdings contained the full population after capture;
- Holdings search filtered correctly;
- forced quiet unfinished work without a wake/disposition path produced a visible warning;
- after neutralizing all material triggers, Signals truthfully showed zero signals and “Nothing needs attention”;
- no JavaScript page errors were observed;
- native keyboard Tab navigation landed on an interactive element;
- the same interaction sequence passed at desktop and phone viewport sizes.

## Defects caught during rendered/interaction testing

### 1. Expired waiting review showed a 1970 date

Root cause: “waiting review due” matched a generic `due` branch before the review-specific description.

Correction: review reasons are handled before due-date reasons.

### 2. Released dependency could immediately re-signal after pause

Root cause: pulling a waiting item did not clear a dependency that had already completed.

Correction: Pull clears released dependencies; Pause/Park also clear obsolete waiting references before assigning the new wake rule.

### 3. Focus opened at the old scroll position on mobile

Root cause: switching views retained the Signal-list scroll offset beneath the sticky header.

Correction: view transitions reset scroll to the top before focusing the destination heading.

### 4. Active Focus claimed it had no wake path

Root cause: Holdings-style wake validation was reused for an actively carried commitment.

Correction: active/NOW work reports `Active — no wake rule required`.

These defects reinforce the value of actual rendered interaction testing rather than selecting the concept from rationale alone.

## Exact committed-byte verification

After commit, the branch files were fetched back from GitHub and compared to the locally tested sources:

| File | Character length | FNV-1a |
| --- | ---: | --- |
| `index.html` | 4137 | `f02c5efd` |
| `style.css` | 7140 | `c3fa5acc` |
| `app.js` | 16767 | `3a62358f` |

All matched exactly.

## What this prototype supports

The architecture now demonstrates the intended separation:

```text
quiet holdings
    ↓ material trigger
signal
    ↓ explicit pull
focus
    ↓ complete / pause / park
quiet holdings
```

The default surface is **not** an inventory. It is a set of material changes and decisions.

## What remains unproven

### Reliability

The strongest unresolved issue is still the most important one:

> Can the user trust the system enough to stop mentally tracking quiet commitments?

The prototype exposes local/external save status, but it does not yet prove:

- cross-browser/device recovery;
- durable external synchronization;
- real event-trigger observation;
- notification delivery;
- missed-trigger detection;
- import/recovery from incumbent Ledger data.

### Maintenance cost

The prototype reduces visible inventory, but real use must establish whether wake rules, waiting state, return points, and disposition metadata cost less effort than they save.

### Signal quality

The seeded fixture proves deterministic behavior against known conditions. It does not yet prove an acceptable false-positive/false-negative rate with real work.

## Decision

`CONTINUE` to reliability hardening.

Do not integrate this into the production Ledger repo yet. Keep V4 available for direct comparison while the tester explores the new model.
