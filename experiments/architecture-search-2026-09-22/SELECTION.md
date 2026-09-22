# Clean-Sheet Architecture Search — Comparison and Selection

- Date: 2026-09-22
- State: CONCEPT SEARCH COMPLETE / SELECTED DIRECTION READY FOR ISOLATED PROTOTYPE
- Parent roadmap: [../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md)
- Mechanics baseline: [../attention-engine-v1/RESULT.md](../attention-engine-v1/RESULT.md)
- Mode: AIDB MODE C / CLEAN SHEET
- Incumbent: Ledger V4 Chronicle, preserved separately on `archive/v4-chronicle-2026-09-22`
- Important limitation: the four concept slots were separated by architecture thesis but produced in one operator session, so they are not fully blinded/independent. Selection therefore requires an explicit skeptical challenge and remains subject to fresh independent review during Phase 6.

## Preservation contract

### MUST PRESERVE

Only the outcomes currently supported by research/evidence:

- reliable cognitive offloading;
- bounded active attention;
- explainable resurfacing;
- safe waiting/quiet work;
- cheap interruption and re-entry;
- material-delta recovery;
- provenance/history on demand;
- visible save/recovery/resurfacing truth;
- human override/authority;
- accessibility and useful mobile/keyboard paths.

### MUST NOT ASSUME

- project-first navigation;
- task as the only work primitive;
- Chronicle/timeline;
- Control Tower/dashboard;
- sidebar/tabs;
- current status enum;
- current composition, typography, color, component tree, or mobile behavior.

## Shared fixture

Each concept represents the same overloaded situation:

- 100 unfinished/retained commitments;
- 5 attention-worthy conditions in the initial fixture;
- active capacity 3;
- 30 waiting/parked commitments safely quiet;
- one valid return point;
- one due-soon item;
- one newly unblocked item;
- one expired waiting review;
- one material change since last seen.

## Concept A — Dispatcher

Primary idea:

> Treat attention as an operational dispatch queue: surfaced exceptions on the left, current operation and next eligible work on the right.

Strengths:

- fastest direct path from “why now?” to action;
- excellent reason visibility;
- naturally supports bounded active capacity;
- queue semantics fit repeated administrative work.

Observed rendered behavior:

- desktop at 1440×1000: no horizontal overflow; attention queue and current-operation rail fit in one viewport;
- phone at 390×844: no horizontal overflow; page height 1380px;
- mobile defect: the current operation comes after the full signal list, so resuming known deep work is less immediate than it should be.

Primary risk:

- can become transactional/clerical and make the user's life feel like a ticket queue;
- likely encourages continuous triage even when no triage is needed.

## Concept B — Horizons

Primary idea:

> Arrange commitments by when they should exist in attention: Now / Soon / Waiting / Later.

Strengths:

- easiest mental model;
- clearly separates current attention from quiet work;
- waiting/resurfacing semantics are visible without project-first navigation;
- calm and readable.

Observed rendered behavior:

- desktop at 1440×1000: no horizontal overflow; page height 1005px;
- phone at 390×844: no horizontal overflow; page height 1625px;
- responsive structure remains understandable as sequential temporal bands.

Primary risk:

- forces unlike commitments into a time metaphor even when the trigger is dependency/event/context rather than time;
- “Soon” can become a disguised backlog;
- visually exposing Waiting/Later by default weakens the promise that quiet work can leave attention.

## Concept C — Mission Board

Primary idea:

> Organize around objectives and the operations/dependencies that advance them.

Strengths:

- strongest causal model;
- dependencies and work-in-progress fit naturally;
- excellent for long-running complex initiatives;
- clear distinction between objectives and operations.

Observed rendered behavior:

- desktop at 1440×1000: no horizontal overflow; all three structural regions remain visible;
- phone at 390×844: no horizontal overflow; page height 1533px;
- mobile retains hierarchy but becomes a long management narrative before reaching all signals.

Primary risk:

- requires the user to maintain an objective hierarchy;
- poorly matched to small administrative obligations that are real but do not deserve a “mission”;
- could replace task-management overhead with strategy-modeling overhead.

## Concept D — Signal Desk

Primary idea:

> The default desk contains only **material changes that require a decision**, plus a separate bounded working set. Everything else remains quiet until it produces a signal or the user deliberately retrieves it.

Strengths:

- strongest expression of cognitive offloading;
- removes ordinary backlog from the default surface;
- clearly separates **working set** from **incoming material change**;
- naturally supports event/time/dependency/staleness resurfacing without forcing them into one hierarchy;
- no project-first navigation;
- mobile can put the working set first, then signals.

Rendered correction:

The initial artifact incorrectly repeated unchanged pinned deep work as an incoming signal even though the working-set rail already represented it. That violated the concept's own rule. The concept was corrected:

- current deep work stays in the working set;
- unchanged current state is not a signal;
- the signal count falls from 5 to 4;
- when capacity opens, the system should offer an explicit **pull next eligible** path rather than flooding routine next work onto the desk.

Observed rendered behavior after correction:

- desktop at 1440×1000: no horizontal overflow; page height 1001px;
- phone at 390×844: no horizontal overflow; page height 1391px;
- mobile presents system/working-set truth before material signals.

Primary risk:

- the concept is only safe if signal generation/resurfacing is trustworthy;
- a missed signal creates **invisible failure**, which is more dangerous than an obvious noisy backlog;
- the Quiet Store therefore requires an explicit integrity check for lost/dispositionless commitments.

## Material-difference gate

This is a clean-sheet guardrail, not a quality ranking.

| Dimension | Incumbent V4 | Dispatcher | Horizons | Mission Board | Signal Desk |
| --- | --- | ---: | ---: | ---: | ---: |
| Information architecture | project → checkpoint → chronicle + next | 2 | 2 | 2 | 2 |
| Navigation model | project switcher first | 2 | 2 | 2 | 2 |
| Spatial composition | project identity + timeline + rail | 2 | 2 | 2 | 2 |
| Interaction placement/model | task/project action oriented | 2 | 2 | 2 | 2 |
| Surface grammar | chronology/events + queue | 2 | 2 | 2 | 2 |
| Typography hierarchy/voice | editorial/sans V4 | 1 | 2 | 1 | 2 |
| Color-role system | incumbent warm semantic system | 1 | 1 | 2 | 1 |
| Mobile representation | bounded temporal project flow | 2 | 2 | 2 | 2 |
| Materially re-conceived | — | 6/8 | 7/8 | 7/8 | 7/8 |

All four pass the MODE-C difference floor.

## Council comparison

### Distinctive

- **Dispatcher:** product-specific enough, but resembles mature operational/ticketing systems.
- **Horizons:** memorable and calm, but the Now/Soon/Later structure is broadly reusable.
- **Mission Board:** distinctive, but can overstate the strategic importance of routine work.
- **Signal Desk:** most product-specific to the actual research insight: the system exists to keep ordinary commitments out of attention until reality produces a material reason.

### Coherent

- **Dispatcher:** one dispatch metaphor explains surfaced work and capacity, but quiet storage is secondary.
- **Horizons:** one time-horizon metaphor explains the whole surface, but stretches badly around non-time triggers.
- **Mission Board:** causal objective → operation → dependency model is coherent for complex work, less so for miscellaneous obligations.
- **Signal Desk:** one rule—**material signal or active working set**—explains what is visible and what is absent.

### Useful

- **Dispatcher:** strongest immediate triage speed.
- **Horizons:** strongest low-learning-cost overview.
- **Mission Board:** strongest dependency/program reasoning.
- **Signal Desk:** strongest reduction of attention burden while preserving current work and exceptions.

### Inclusive / cognitive

All concepts can meet ordinary accessibility requirements if implemented with native controls and clear focus behavior.

Specific cognitive burden:

- Dispatcher risks queue pressure.
- Horizons risks repeated horizon classification.
- Mission Board risks objective-model maintenance.
- Signal Desk risks hidden-state anxiety unless quiet-state integrity is inspectable.

### Skeptic

Strongest attack on Signal Desk:

> “You are hiding most of the user's commitments. If one wake condition is wrong or the engine fails, the product will confidently tell the user nothing needs attention while important work disappears.”

Required response:

1. every quiet unfinished commitment must have a disposition/resurfacing path;
2. a persistent integrity check must identify dispositionless quiet work;
3. save/sync/resurfacing failures must be visible;
4. Quiet Store must be inspectable on demand;
5. automatic signal reason/provenance must be visible;
6. the system must truthfully show uncertainty where external conditions cannot actually be observed;
7. an idle/capacity state must expose **Pull next eligible** so routine work does not become inaccessible.

If those fail, Signal Desk should be rejected.

### Realist

Implementation feasibility:

- the existing Attention Engine V1 already computes most Signal Desk inputs:
  - attention-worthy conditions;
  - working/active set;
  - waiting/parked quiet state;
  - missing-disposition guard;
  - deterministic “why now” reasons;
  - stale return-point detection.
- no current Ledger UI schema needs to be preserved for an isolated prototype;
- the largest unproven requirement is not rendering—it is state-maintenance cost and trustworthy signal lifecycle.

### Incumbent resemblance question

> If logo, fonts, and colors were removed, is Signal Desk still basically V4 Chronicle?

**No.**

V4 is entered through a project and organizes the page around that project's checkpoint/history/next work. Signal Desk is entered through **system-level material change and bounded active work**, with project/scope metadata secondary and no default chronology.

## Selection

### Selected direction: Signal Desk

It is selected because it most directly implements the research-backed parent outcome:

> allow the user to stop mentally tracking quiet commitments while keeping exceptions, changes, and current work visible.

It is **not** selected merely because it is most different. It has the highest failure consequence if resurfacing is unreliable, which becomes a hard prototype requirement rather than an ignored caveat.

## Frozen concept contract

### Product job

Maintain a trustworthy external model of commitments so the user spends attention on current work and material change rather than remembering the backlog.

### Core information architecture

```text
WORKING SET
what I am deliberately carrying now

SIGNAL DESK
what changed / became due / became eligible / became stale and needs a decision

QUIET STORE
unfinished work intentionally outside attention, each with a disposition/wake path

PULL NEXT
one explainable eligible commitment when capacity is available and the user asks for work

DETAIL / WORKSPACE
the context required to execute or resume one commitment

HISTORY / PROVENANCE
full evidence on demand, not the default workspace
```

### Navigation model

Primary navigation is **attention state and material signal**, not projects.

Projects/scopes/people/contexts may be filters or metadata.

### Desktop composition

- persistent compact working-set rail;
- dominant material-signal desk;
- system integrity/save state visible but restrained;
- Quiet Store and Pull Next available as explicit actions, not competing default columns.

### Mobile composition

- working set first;
- integrity/system state compact;
- material signals next;
- Quiet Store / Pull Next reachable without permanent bottom-tab clutter;
- deep work opens as a focused full-screen/sheet view.

### Signature choice

**Absence is meaningful.**

An item not on the desk is intentionally quiet, not forgotten. The product must be able to explain why it is quiet and how it will return.

### Hard invariants

1. Signal Desk is not an activity feed.
2. Unchanged current work does not generate a signal merely to stay visible.
3. Working set is bounded and separate from incoming signals.
4. Every signal has an inspectable reason and source/state basis.
5. Every unfinished quiet commitment has a wake/disposition path or appears as an integrity defect.
6. Quiet Store is inspectable on demand.
7. When capacity exists, routine eligible work appears only through explicit Pull Next or a material signal—not by flooding the desk.
8. Return points survive interruption and are marked stale when material state invalidates them.
9. History/provenance remains available but does not become the default surface.
10. Projects/tasks are not required as primary navigation or composition.
11. Automation cannot silently hide, complete, or redefine user obligations.
12. Save/recovery/resurfacing failure truth remains visible.

### Allowed flexibility

- final naming;
- exact signal ordering;
- exact WIP soft limit;
- typography/palette;
- whether working-set rail collapses;
- detail/workspace representation;
- filters/search representation;
- whether scopes/projects remain as optional grouping metadata.

### Rejected incumbent assumptions

- project-first entry;
- chronology as default context;
- Next queue permanently visible;
- project tabs as primary navigation;
- task status as the full organization model.

### Known risks

- missed signals become invisible failures;
- users may distrust hidden quiet work;
- manually maintaining wake/disposition metadata may cost more than it saves;
- signals can become notification spam if thresholds are weak;
- event-driven home may underserve deliberate planning unless Pull Next / search / Quiet Store are strong.

## Next implementation requirement

Build an isolated interactive Signal Desk prototype against the deterministic Attention Engine fixture before touching V4.

The prototype must specifically test the concept's weak points:

- resolve/defer a signal;
- pull next when capacity opens;
- inspect Quiet Store;
- show a lost-work integrity defect;
- resume from a return point;
- expose stale return point;
- show empty signal state truthfully;
- demonstrate mobile and keyboard paths.
