# Clean-Sheet Architecture Search — 2026-09-22

- Mode: **D / PRODUCT RETHINK inside tester authority**
- Incumbent: Ledger V4 Chronicle — evidence/reference only
- Old V4 preserved: branch `archive/v4-chronicle-2026-09-22`
- Parent model: [../../docs/LEDGER-ORGANIZATION-MODEL-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-MODEL-2026-09-22.md)
- Mechanics proof: [../attention-engine-v1/RESULT.md](../attention-engine-v1/RESULT.md)
- Production impact: none

## Preservation contract

### MUST PRESERVE

Only outcomes/capabilities currently justified by evidence:

- low-friction capture of obligations/context;
- reliable externalization so quiet work can leave working memory;
- a small current attention set;
- explicit reasons when work resurfaces;
- waiting/parked work that cannot silently disappear;
- interruption/re-entry support;
- material-delta recovery without forcing audit-log replay;
- provenance/history when needed;
- visible reliability/failure state;
- human authority and override.

### MUST NOT ASSUME

- project-first navigation;
- task as the primary object;
- Chronicle/timeline;
- Control Tower;
- sidebar/project tabs;
- current Ledger status vocabulary;
- current localStorage schema;
- cards, rails, or existing component grammar;
- global dashboard metrics;
- one screen per project;
- current mobile composition.

## Incumbent behavior inventory

Useful evidence abstracted from V4:

- captures work and notes;
- preserves rich execution context;
- supports OPEN / ACTIVE / BLOCKED / DONE;
- preserves journal/work history/proof;
- exposes a project-local return checkpoint;
- separates recent material Chronicle from fuller history;
- can recover corrupt local data instead of overwriting it.

Known pressure:

- cross-project orientation is weak;
- project-first navigation remains a cognitive prerequisite;
- Chronicle solves local continuity but not global triage;
- audit/history and re-entry signal must remain separate;
- current storage/sync truth is weaker than the trust implied by strong cognitive offloading.

## Shared content fixture

All concepts use the same core workload:

- 100 open/retained commitments;
- 5 attention-worthy changes:
  - due tomorrow;
  - waiting review expired;
  - dependency completed;
  - material state changed;
  - active return point;
- 15 waiting commitments;
- 15 deliberately parked commitments;
- current active capacity 1 / 3.

The concepts differ in how they represent the same truth.

---

# Concept A — Dispatcher

Artifact: [dispatcher.html](dispatcher.html)

## Thesis

Treat the system as a personal operations dispatcher.

```text
NEEDS ATTENTION
        ↓
CURRENT PULL
        ↓
QUIET QUEUE
```

The user does not first select a project. Work is pulled from a governed queue into a bounded active slot.

## Primary job / entry state

Immediately identify what deserves action and continue the current pull.

## Information architecture

- needs-attention queue;
- one dominant current pull;
- quiet waiting/parked queue;
- all other work behind search/holdings.

## Interaction model

- `Pull` moves eligible work toward active attention;
- current work exposes a return point;
- quiet work exposes its wake rule;
- capacity is visible before adding more active work.

## Strength

Fastest route from system-level orientation to concrete action.

## Main risk

It can still become a conventional task console with better queue semantics. It foregrounds inventory more than the research strictly requires.

---

# Concept B — Horizons

Artifact: [horizons.html](horizons.html)

## Thesis

Organize by **cognitive distance** rather than project:

```text
NOW → SOON → WAITING → LATER
```

Work moves closer when time, dependencies, review conditions, or material changes make it relevant.

## Primary job / entry state

Understand what is close enough to think about.

## Strength

Extremely legible relationship between active attention and deliberately quiet work. Mobile representation is naturally linear.

## Main risk

Time becomes too dominant. Some high-value work is important because of state, opportunity, or consequence rather than temporal proximity. Users may also feel pressure to classify everything into a horizon.

---

# Concept C — Mission Board

Artifact: [mission-board.html](mission-board.html)

## Thesis

Organize around **outcomes/objectives and dependency threads**, with tasks as supporting detail.

## Primary job / entry state

Understand which outcomes are currently being advanced and what blocks them.

## Strength

Best causal/coherence model for large purposeful projects. It resists task-list fragmentation and makes dependencies legible.

## Main risk

High maintenance cost. Many real administrative commitments are small, unrelated, or not worth elevating into a mission. Forcing mission assignment can become organization work instead of useful work.

---

# Concept D — Signal Desk

Artifact: [signal-desk.html](signal-desk.html)

## Thesis

Do not show the inventory by default.

Show only **material changes that alter what the user should know, decide, or do**.

```text
QUIET HOLDINGS
      ↓
something materially changes
      ↓
SIGNAL
      ↓
ACT / DECIDE / INSPECT / RESUME
```

A separate decision queue handles state transitions that require judgment.

## Primary job / entry state

Answer:

> What changed enough that I should care?

## Strength

Most directly aligned with cognitive offloading. It minimizes the temptation to repeatedly inspect stable work and allows the interface to become genuinely quiet.

## Main risk

Signal generation becomes safety-critical. A missed signal can hide important work; noisy signals recreate notification overload. The system must make holdings/wake rules auditable and make signal failure visible.

---

# Material-difference gate versus V4 Chronicle

Scale: `0` inherited, `1` adapted, `2` materially re-conceived.

| Dimension | Dispatcher | Horizons | Mission Board | Signal Desk |
| --- | ---: | ---: | ---: | ---: |
| Information architecture | 2 | 2 | 2 | 2 |
| Navigation model | 2 | 2 | 2 | 2 |
| Spatial composition | 2 | 2 | 2 | 2 |
| Interaction placement/model | 2 | 2 | 2 | 2 |
| Surface/component grammar | 2 | 2 | 2 | 2 |
| Typography hierarchy/voice | 2 | 2 | 2 | 2 |
| Color role system | 1 | 1 | 2 | 1 |
| Mobile representation | 2 | 2 | 2 | 2 |

All four pass the clean-sheet difference floor. This table is a difference guard, not a quality ranking.

## Render verification

Each concept was rendered from standalone HTML at:

- desktop: 1440 × 1000;
- phone: 390 × 844.

Deterministic checks on every render:

- no horizontal overflow at either viewport;
- one H1;
- no unlabeled/empty buttons.

The rendered artifacts, not the text descriptions, were used for the comparison below.

---

# Council-style comparison

## Distinctive

- **Dispatcher:** specific enough to the attention model, but visually/structurally close to operational work queues used elsewhere.
- **Horizons:** memorable and calm; the temporal metaphor strongly authors the product.
- **Mission Board:** highly authored, but can feel like strategic project management rather than a personal high-volume admin system.
- **Signal Desk:** strongest product-specific proposition: work remains invisible until it emits a meaningful signal.

## Useful

- **Dispatcher:** strongest immediate-action speed.
- **Horizons:** strongest quick sense of cognitive distance.
- **Mission Board:** strongest causal understanding of long objectives.
- **Signal Desk:** strongest global re-entry and exception handling with the lowest visible inventory.

## Coherent

All four have one generative organizing rule. Mission Board requires the most structure to maintain; Signal Desk requires the most reliable derivation machinery.

## Inclusive / cognitive burden

- Dispatcher makes state explicit but exposes more inventory.
- Horizons is easy to scan but can create classification burden.
- Mission Board is conceptually heavy for miscellaneous work.
- Signal Desk minimizes reading but requires users to trust that quiet holdings will resurface correctly.

## Skeptic

### Dispatcher attack

> Is this just a better to-do console?

Partly. The pull/capacity/wake behavior is new, but the visible queue remains familiar.

### Horizons attack

> Are we forcing every type of importance into a time metaphor?

Yes, potentially. This is the main reason not to select it as the sole architecture.

### Mission Board attack

> Are users now maintaining an organizational ontology instead of doing the work?

This risk is substantial for small/high-volume administrative commitments.

### Signal Desk attack

> If the signal engine misses something, did the interface make the omission harder to notice?

Yes. This is the most serious failure mode and must become a hard reliability test.

## Realist

- Dispatcher is easiest to implement from the tested engine.
- Horizons also maps easily to deterministic trigger state.
- Mission Board needs additional objective/dependency modeling not yet proven necessary.
- Signal Desk can be derived from the tested engine without preserving projects/tasks, but it requires a first-class signal lifecycle and an inspectable Holdings fallback.

---

# Selection

## Selected direction for the next isolated prototype: **Signal + Pull**

Do not average all four concepts.

Combine only two compatible ideas:

1. **Signal Desk owns system-level orientation.**
   - Default surface = material changes and decisions.
   - Stable inventory stays quiet.
   - Every signal says why it exists.

2. **Dispatcher contributes the explicit Pull / single-focus transition.**
   - Acting on a signal can pull one commitment into a focused work surface.
   - Active capacity remains bounded.
   - Pausing creates/updates a return point.

The result is **not** “Control Tower + Chronicle.”

Proposed shape:

```text
SIGNAL DESK
What changed / what needs judgment?
        ↓ ACT / PULL
FOCUS
One current commitment + return point + next move
        ↓ pause / wait / complete
QUIET HOLDINGS
Searchable/auditable; every unfinished item has a wake/disposition path
        ↑
signal engine
```

## Why this direction advances

It best matches the core research finding:

> The system should let the user safely stop thinking about stable commitments and bring them back only when their state becomes relevant.

It also addresses the metadata-maintenance challenge better than the alternatives: attention buckets should be **derived primarily from events/triggers**, not manually curated as a permanent taxonomy.

## Hard invariants for the selected prototype

1. Default home is not a project list or complete task inventory.
2. No automatically surfaced item appears without an inspectable reason.
3. Quiet unfinished work must remain inspectable through Holdings and must have a wake/disposition path.
4. Focus shows one current commitment rather than another dashboard.
5. Pausing Focus leaves a compact return point.
6. Signal dismissal changes an explicit state; it does not silently delete responsibility.
7. Material delta remains distinct from exhaustive audit history.
8. The user can override routing without losing canonical state.
9. The interface may be completely empty of signals when nothing needs attention.
10. A detected reliability gap must be surfaced as a signal about the system itself.

## Rejected assumptions

- project as navigation root;
- timeline as continuity owner;
- persistent global task list;
- manually maintained priority number;
- “show more information” as the solution to uncertainty.

## Known risks

- missed signal = hidden obligation;
- signal spam = recreated notification anxiety;
- trigger/wake setup may still impose metadata burden;
- one-focus model may feel restrictive for legitimate parallel work;
- users may distrust a quiet screen and repeatedly inspect Holdings;
- external integrations may eventually be needed to observe real trigger events.

## Next action

Build an isolated **Signal + Pull** prototype against the synthetic fixture before touching the incumbent V4 implementation.
