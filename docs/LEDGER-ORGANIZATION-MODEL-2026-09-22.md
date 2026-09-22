# Ledger Organization Model — Attention-State Management

- Date: 2026-09-22
- State: WORKING MODEL / PROTOTYPE INPUT
- Depends on: [LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md](LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md)
- Incumbent reference: Ledger V4 Chronicle — evidence/test harness only, not an architecture to preserve
- Authority: model for evaluation only; does not authorize production schema/UI changes

## Clean-sheet premise

The target is the best system we can justify from evidence, not “Ledger plus improvements.” Existing Ledger concepts may be kept, transformed, or discarded. Familiarity, prior implementation effort, and current screen structure are not preservation arguments.

Preserve only outcomes that survive evaluation: reliable offloading, attention control, re-entry, resurfacing, material context, provenance, and human authority.

## Product job

The system should help a person with many simultaneous commitments:

1. capture obligations without needing to remember them;
2. know which small subset deserves attention now;
3. know which items are safely waiting, blocked, scheduled, or parked;
4. recover interrupted work quickly;
5. notice when previously quiet work becomes relevant again;
6. preserve enough history/evidence to explain current state;
7. avoid forcing the user to reconstruct the whole system from memory.

The intended outcome is not “zero mental effort.” The system should offload tracking and reconstruction so the person can spend cognition on judgment and execution.

## Key distinction: work state is not attention state

Do not force all organization into one status enum.

Existing Ledger work states such as the following are one incumbent representation, not a required future schema:

```text
OPEN
ACTIVE
BLOCKED
DONE
```

describe the work object.

A separate **attention state** describes whether and why that object currently deserves cognitive attention.

Candidate attention states:

```text
INBOX
NOW
NEXT
WAITING
REVIEW
PARKED
QUIET
```

These are conceptual until tested.

Examples:

| Work state | Attention state | Meaning |
| --- | --- | --- |
| OPEN | INBOX | captured but not yet triaged |
| ACTIVE | NOW | currently being worked |
| OPEN | NEXT | eligible when capacity exists |
| OPEN | WAITING | cannot/should not be acted on until a trigger |
| BLOCKED | REVIEW | blocker needs active resolution |
| OPEN | PARKED | deliberately dormant until review/trigger |
| DONE | QUIET | complete; retained for history, not attention |

A project may have many OPEN items and only one or two in NOW.

## The commitment object

A useful commitment/work object should be able to answer these questions/fields when material. The object itself does not have to be called a task or live under a project:

```text
identity
project
work state
attention state
owner / responsibility
next concrete action
return point
dependency / waiting-on
resurfacing trigger
due / time constraint
last material change
why this is in attention now
proof / acceptance
links / source
history provenance
```

Not every item needs every field. Progressive disclosure remains required.

## Attention transition model

The important behavior is movement, not the labels themselves.

```text
CAPTURE
  ↓
INBOX
  ↓ triage
NEXT / WAITING / PARKED
  ↓ capacity / event / time / decision
NOW
  ↓ pause
RETURN POINT + NEXT / WAITING
  ↓ completion
DONE → QUIET

WAITING / PARKED
  ↓ trigger fires or material state changes
REVIEW / NEXT

ANY NON-DONE STATE
  ↓ unexpected change / stale assumption / conflict
REVIEW
```

The system must not silently move an item into or out of attention without retaining an explainable reason.

## Resurfacing contract

A commitment is safely offloaded only if the system knows how it comes back.

Candidate resurfacing trigger classes:

### Time

Examples:
- specific date/time;
- after N days;
- periodic review;
- due-date approach.

### Dependency

Examples:
- task X completes;
- blocker removed;
- required input becomes available.

### External / human event

Examples:
- reply received;
- person confirms;
- shipment arrives;
- meeting occurs.

Where Ledger cannot observe the event automatically, it should still preserve the intended trigger and review policy rather than pretending it can.

### Material change

Examples:
- project status changed;
- underlying assumption changed;
- new information invalidates the return point.

### Staleness

Examples:
- waiting item has not been reviewed in its expected interval;
- active item has remained unresolved beyond a user-defined threshold.

### Explicit user signal

Examples:
- pin now;
- wake tomorrow;
- review Friday;
- keep parked until manually reopened.

## “Why now” contract

Every automatically surfaced object should expose a concise reason.

Examples:

```text
WHY NOW
- waiting review due today
- dependency completed
- due in 2 days
- active return point
- new material change since last visit
- user pinned
- stale for 14 days
```

Avoid:

```text
Priority score: 87
```

unless the score is supplemental and its inputs are inspectable.

The first baseline should use deterministic, explicit rules. AI-assisted ranking should be tested only after the rule/state model proves useful.

## Active-capacity model

The system should distinguish:

```text
TOTAL OPEN COMMITMENTS
≠
CURRENT WORK IN PROGRESS
```

Candidate rule:

> The active attention set is deliberately bounded. When it is full, new work normally goes to NEXT, WAITING, or PARKED unless the user explicitly displaces current work.

Do not hard-code a universal number from working-memory research. The appropriate active limit is an empirical product question.

The UI may eventually:
- show current active count;
- allow a configurable soft limit;
- warn rather than block;
- make displacement explicit when a new urgent item enters NOW.

## Candidate architecture A — Control Tower

### Job

Answer, across all projects:

> What currently needs me, why, and what can I safely ignore?

It is not a business-intelligence dashboard.

### Candidate information architecture

```text
CONTROL TOWER

NEEDS ATTENTION
- exceptions / changes / expired waiting / review

NOW
- bounded active commitments and return points

NEXT
- eligible work when capacity opens

WAITING
- externally or conditionally held work + next review/trigger

PARKED
- intentionally dormant work + wake condition

RECENT MATERIAL CHANGE
- compressed cross-project delta

PROJECTS
- compact summaries with return point + attention state
```

Sections should collapse/vanish when empty. Counts are secondary to actionable state.

### Global project summary

Each project should be capable of producing a small operational summary:

```text
PROJECT
current state
current commitment / return point
why it needs attention, if any
next eligible action
waiting/blocker summary
last material change
```

This is conceptually close to the earlier Continuity Atlas, but it should be generated from the attention model rather than become a second manually maintained dashboard.

## Candidate deep-work continuity surface

The incumbent Chronicle demonstrates one way to solve local continuity, but its structure is not frozen. The required job is: restore the smallest useful working context and make continuation obvious.

One incumbent-shaped option is:

```text
PROJECT IDENTITY
→ RESUME CHECKPOINT
→ MATERIAL CHRONICLE
→ NEXT QUEUE
→ FULL HISTORY ON DEMAND
```

If this architecture survives evaluation, its global and deep-work surfaces should not duplicate one another.

But clean-sheet alternatives must also be generated. Examples worth testing include:

- **Dynamic queue / dispatcher:** commitments flow through eligibility, waiting, and active lanes with no project-first home.
- **Temporal horizons:** Now / Soon / Waiting / Later organized primarily by time and trigger, with projects as metadata.
- **Mission board:** current objectives and dependencies are primary; tasks are generated/supporting detail.
- **Event-driven workspace:** the home surface is material change + decisions needed; quiet work remains absent until a trigger fires.
- **Hybrid graph:** people, commitments, dependencies, and contexts are first-class relationships rather than nested project/task folders.

These are starting hypotheses, not a required five-concept quota. A better structure discovered during research/prototyping may replace them.

## Checkpoint / return-point contract

A return point should be cheap enough to create whenever work is paused.

Candidate minimum:

```text
I stopped after:
<material state/result>

Next move:
<one concrete action>

Unresolved / waiting:
<only if material>

State may be stale if:
<only if material>
```

The system may prefill from current task state, but user-authored correction must remain easy.

A checkpoint is not a journal entry and should not require narrative prose.

## Waiting contract

WAITING is a first-class operational state, not a note.

A waiting commitment should normally preserve:

```text
waiting on
expected / next-review condition
what happens when it arrives
how to tell if it is overdue/stale
```

The system should distinguish:

- waiting normally;
- waiting review due;
- dependency changed;
- waiting item can now proceed;
- waiting item no longer relevant.

## Material delta

When returning after time away, the system should derive:

```text
what materially changed
what became complete
what became blocked/unblocked
what now needs attention
what prior return point is stale
```

This is separate from raw history.

Default surfaces should not show low-level mutation records when the structured current object already communicates the useful truth.

## Reliability / trust contract

Because successful cognitive offloading can reduce internal maintenance, the system must show enough truth that a user can decide whether it is safe to rely on it.

Required areas to evaluate before strong offloading claims:

### Save truth

The user can tell whether a material change is:
- unsaved;
- saved locally;
- exported/synced;
- failed.

### Recovery truth

The user can recover or explicitly detect inability to recover after:
- browser restart;
- local corruption;
- import/export;
- sync failure.

### Resurfacing truth

A user can inspect:
- which items have future triggers;
- when/why they will be reviewed;
- items with no trigger;
- failed or overdue review conditions.

### No silent disappearance

A commitment should not leave all default attention surfaces without one of:
- completion;
- waiting trigger;
- parked/review rule;
- explicit dismissal/disposition.

## Automation boundary

Automation can:
- detect deterministic dates and states;
- route based on explicit rules;
- calculate staleness;
- show changes;
- suggest the next eligible item;
- summarize material history with provenance.

Automation should not silently:
- invent obligations;
- mark work complete;
- suppress attention-worthy items;
- reinterpret user priority;
- create durable reminders without showing them;
- change resurfacing policy without user-visible state.

## Candidate invariants

1. **One current truth:** attention views are derived from canonical commitment state, not separately maintained copies.
2. **Every surfaced item has a reason.**
3. **Every safely hidden unfinished item has a disposition or resurfacing path.**
4. **NOW is bounded; OPEN is not.**
5. **Global orientation and deep-work continuity are distinct user jobs, but their final representation is unconstrained.**
6. **Material delta is not audit history.**
7. **Waiting state is reviewable and can become stale.**
8. **A paused active item retains a return point.**
9. **Automation cannot become hidden authority.**
10. **Reliability failures must be visible, because memory may have been offloaded to the system.**

## Questions that remain deliberately unresolved

- final attention-state vocabulary;
- default WIP limit, if any;
- whether WAITING and PARKED are work states, attention states, or projections;
- exact ranking/tie-breaking rules inside NEXT;
- notification channel;
- cross-device synchronization architecture;
- whether reminders are local, cloud-backed, or both;
- whether there should be a global Control Tower at all;
- whether project/task hierarchy should survive at all;
- whether time, events, objectives, dependencies, people, contexts, or commitments should be the primary navigation axis;
- whether one surface or multiple scales best support global orientation and deep work;
- whether AI adds measurable value over deterministic rules.

These questions should be resolved by fixtures/prototypes rather than by preference alone.
