# Ranking V1 — Result

- Date: 2026-09-22
- State: PHASE 5 COMPLETE / AI RANKING NOT EARNED
- Parent roadmap: [../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md)
- Scope: ordering of commitments that are **already surfaced** by the attention engine

## Critical distinction

This experiment exposed an important authority boundary:

> **Surfacing decides what the user must be able to see. Ranking only decides presentation order among already-visible items.**

Signal + Pull's attention engine owns surfacing. Ranking does not get permission to hide an overdue item, suppress an integrity defect, or remove a material signal.

That materially lowers both the value and the justified authority of ranking.

## Frozen scenarios

Nine scenarios encode explicit local operator intent, including:

- stale manual priority after an item becomes overdue;
- equal-risk personal preference;
- choosing to continue active deep work before a low-consequence material change;
- integrity defect versus preferred routine work;
- due-soon versus waiting-review ordering;
- user choice among two material signals;
- deliberately deferring an overdue item while keeping it visible;
- eligibility before ranking;
- one partial preference without fully ranking the list.

These fixtures are diagnostic examples, not a universal model of human priorities.

## Methods

### Deterministic

Uses current material reasons only.

### Manual

Explicit user order wins when present; unspecified work falls back to deterministic ordering.

### Guarded hybrid

A small hard-guard set (integrity defect, due now or overdue, dependency reference missing) outranks user order; user order controls the remainder.

## Reproduced result

| Method | Stated top-choice matches | Pairwise disagreements | Guard violations | User-order values |
| --- | ---: | ---: | ---: | ---: |
| Deterministic | 5 / 9 | 6 / 16 | 0 | 0 |
| Manual | 7 / 9 | 3 / 16 | 3 | 19 |
| Guarded hybrid | 8 / 9 | 1 / 16 | 0 | 19 |

All ranked outputs carried an inspectable explanation.

## What the numbers do **not** mean

The table is not a product score.

The manual/hybrid methods receive explicit preference metadata in the fixtures, so better agreement with stated preference is expected. The maintenance count matters: those gains came with 19 user-order values across nine small scenarios.

More importantly, ranking disagreements are not missed commitments here. All material items remain surfaced.

## Challenge finding

The added adversarial fixture is decisive:

> An overdue obligation must remain visible, but the user has consciously chosen to finish a valid current focus first.

Deterministic ordering puts the overdue item first.

Manual ordering respects the explicit choice.

The guarded hybrid also puts the overdue item first because its hard guard treats the deadline as ranking authority.

That is the wrong abstraction.

**Overdue can justify guaranteed visibility without justifying forced first position.**

The same distinction applies more broadly:

~~~text
MATERIAL STATE
→ determines whether an item must surface

PRESENTATION ORDER
→ may suggest what to inspect first

HUMAN ACTION
→ remains the user's choice
~~~

## Product decision

### Keep

- deterministic ordering as a transparent default;
- explainable "why now" reasons;
- guaranteed surfacing rules outside the ranking layer;
- ability to Pull/Resume **any** visible signal;
- explicit current Focus / user pin;
- eligibility filtering before ranking.

### Do not add now

- persistent full manual priority order;
- hard ranking rules that convert material state into hidden authority;
- AI ranking.

### Why AI ranking is not earned

The demonstrated deterministic shortcoming is modest: some visible items appear in an order different from local operator preference.

The user can already choose any visible signal directly.

An AI ranker would therefore add:

- opaque or semi-opaque inference;
- correction burden;
- evaluation burden;
- new failure modes;
- pressure to learn personal preference;

without solving a demonstrated missed-work problem.

If the Signal Desk regularly grows so large that ordering becomes a serious burden, the first question should be whether **signal quality is too noisy**, not whether a smarter ranker can sort the noise.

## Lowest-cost preference mechanism worth retaining

If real use later shows repeated ordering friction, prefer an ephemeral/explicit control such as:

~~~text
Pull this next
Pin current focus
Handle this after current
~~~

over maintaining a durable ordinal priority for every commitment.

This changes current intent without creating a stale priority database.

## Phase decision

**STOP the ranking escalation here.**

Deterministic ranking remains the baseline convenience layer.

AI ranking is not authorized by evidence from this phase. Reopen only if real tester use produces a measurable ordering problem that direct selection / lightweight explicit preference cannot solve.
