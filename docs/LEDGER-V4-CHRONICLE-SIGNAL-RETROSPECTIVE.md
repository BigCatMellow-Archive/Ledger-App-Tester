# Ledger V4 Chronicle Signal Retrospective

Date: 2026-09-14

## Summary

Ledger V4 Chronicle exposed a product-information failure: the front-page chronology was surfacing both the actual user-created material and the automatic audit event that described the same action.

Examples from the live tester included:

- `WORK — Journal entry: Test` immediately followed by `JOURNAL — Test`;
- `WORK — Note updated: Test` immediately followed by `NOTE — Test`;
- routine project/task mutation records competing visually with the context a returning user actually needed.

The result was technically complete but cognitively noisy.

The durable lesson is:

> **Audit completeness and re-entry usefulness are different information products.**

Chronicle should optimize for context recovery. History should preserve exhaustive mutation evidence.

## Failure classification

- audit recording: working as intended;
- Chronicle event aggregation: failed signal/noise objective;
- data loss: none;
- History surface: retained;
- corrective direction: separate audit events from curated re-entry events.

## Root cause

The initial `materialEvents()` implementation treated every `worklog` row as a material Chronicle event. But Ledger also creates structured objects for notes, journal entries, tasks, and completed proof.

This meant one user action could create two visible front-page records:

```text
user creates journal entry
        ↓
automatic audit worklog row
        +
structured journal entry
        ↓
both rendered in Chronicle
```

The system confused **recording that something happened** with **showing what is useful to remember later**.

## Correction

Commit:

`cd6b7a520633af48d886b43179c1379dec8f5b65` — `Separate Chronicle context from audit history`

The behavior is now:

### History

Keeps the exhaustive worklog, including automatic system mutations.

### Chronicle

Surfaces:

- explicit user-authored `Log work` entries;
- actual project notes;
- actual journal entries;
- completed task proof/context.

It suppresses automatic mutation summaries such as:

- captured item;
- project created/updated;
- task updated;
- task started/completed/reopened/blocked;
- note added/updated;
- journal entry added/updated;
- task deletion;
- other known system-generated audit rows.

New worklog rows now receive a source classification:

```text
source = system
source = manual
```

Explicit `Log work` entries use `manual`; ordinary product mutations use `system` by default.

Existing pre-classification data uses a conservative legacy prefix filter so the visible duplication is reduced without requiring a storage migration.

## Durable rules learned

- **Do not equate audit trail with activity feed.**
- **Do not equate activity feed with re-entry context.**
- When the actual structured object is already visible, avoid rendering a second event whose only purpose is to say that object was created or edited.
- Prefer the highest-information representation: show the note, not `Note added`; show the journal entry, not `Journal entry`; show completion proof, not a duplicate `Completed:` audit row.
- Preserve exhaustive history when useful, but move it behind an explicit History/Audit surface.
- Front-page chronology should have a stated inclusion rule, not simply concatenate every event source.
- Event source/category should be first-class data when different surfaces need different levels of detail.
- Legacy heuristic filtering is acceptable as a compatibility bridge, but future data should carry explicit classification.

## Product distinction

A useful three-layer model is:

```text
AUDIT
What exactly happened in the system?
Exhaustive, mechanically recorded, potentially noisy.

HISTORY
What happened over the life of the project?
Browsable record; may contain more detail than is needed right now.

RE-ENTRY / CHRONICLE
What will help me understand where I am and resume useful work?
Curated, high-signal, product-specific.
```

These can share underlying events without sharing the same presentation policy.

## Verification questions for future designs

For every proposed event on a re-entry/home surface ask:

1. Does this add information that is not already visible in a richer nearby object?
2. Will this still matter after the user has been away for a day or a week?
3. Is this context, or merely evidence that a button was pressed?
4. If removed from the front page, is the event still preserved somewhere appropriate?
5. Are repeated low-value mutations crowding out decisions, blockers, notes, proof, or explicit work summaries?

If an event only answers “what did I just click?”, it usually belongs in audit/history, not the primary re-entry surface.

## Remaining technical debt

The current correction lives in `chronicle-wire.js` as a compatibility layer that overrides earlier generic logging/render behavior. This is appropriate for the tester, but a production cleanup should move event source/category into the canonical worklog model and make Chronicle inclusion policy owned directly by the render/domain layer rather than an override.

## Why this note exists

The previous typography mistakes showed that rendered feedback can invalidate a seemingly coherent design decision. This incident shows the same principle at the information-architecture level: a feature can be technically correct and still create cognitive friction.

The tester should make these mistakes cheap. The system should make the lessons durable.
