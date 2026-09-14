# Roadmap: Ledger V3 from-scratch UI

- State: `WORKING`
- Authorization revision/date: `2026-09-14 user instruction: bootstrap → roadmap → build → live`
- Default autonomous execution: `YES`

## Current reality

- Checked facts: see `docs/LEDGER-V3-BOOTSTRAP.md`.
- Existing UI: functional but structurally constrained by layered legacy modules and successive visual overrides.
- Durable state: `ledger-notes-roadmaps-v2`; existing auto-sync reads the same state directly.
- Important assumption: preserving the state schema is sufficient to preserve the user's existing browser data and sync compatibility even if the UI implementation is replaced.

## Definition of DONE

- Finished result: a live Ledger tester whose UI architecture was designed and implemented from zero around re-entry, active work, continuity, and recordkeeping rather than around the old DOM.
- Final proof: representative desktop + mobile render inspection, core state smoke checks, merge to `main`, Pages deployment for the exact merge SHA.
- Who performs proof: orchestration operator for this testing iteration.

## Execution permission envelope

- Authorized objective: replace the tester UI with the V3 design end-to-end.
- In-scope decisions/actions: product shaping inside the approved job, AIDB council synthesis, front-end architecture, responsive design, data-compatible interactions, local rendering/smoke checks, commits/PR/merge, Pages deploy.
- In scope: `index.html`, new V3 CSS/JS, documentation, reuse of compatible sync behavior.
- Explicitly excluded: production Ledger repository changes, credential-policy changes, paid services, destructive data migration.
- Preauthorized external/destructive/irreversible actions: merge this tester branch to this tester repo's `main` after final proof; no other irreversible external action.
- Human reauthorization triggers: material expansion into production repo or sync/credential architecture.
- Human checkpoints: `none`.
- Effort limit: stop adding features once the current Ledger data capabilities are represented and the core V3 proof passes; later polish can follow live evidence.
- Highest-risk unknown: retaining deep task/project context without reproducing the old interface's visual clutter.

## Backward plan

1. Immediately before DONE: Pages is deploying a main commit containing a browser-checked V3 UI.
2. Before that: V3 is merged after desktop/mobile fixture rendering and core state smoke checks pass.
3. Before that: a single coherent UI implementation supports existing project/task/note/journal/history data and core actions.
4. Before that: a design direction is selected from the product truth and AIDB council challenge.
5. Current state: layered V2 clean-sheet UI is live; storage/sync behavior is known; V3 branch exists.

## Mission meeting / council challenge

- Required: `YES`, once before implementation.
- Questions:
  - Is Ledger fundamentally a task manager, notebook, project record, or continuity tool?
  - Which information must appear immediately after absence?
  - What should disappear from the primary view until requested?
  - How can the UI be unmistakably Ledger without fake paper/skeuomorphism?
  - What mobile representation preserves meaning and thumb reach?

### Independent design lenses

**Distinctive:** reject generic dashboard/card architecture and literal notebook nostalgia. Identity should come from continuity, chronology, annotations, and work-state relationships.

**Coherent:** use one generative concept and one token/spacing/type system. No pile of unrelated visual motifs.

**Expressive:** typography and color must distinguish *current work*, *record/context*, *annotation*, and *proof* rather than decorate regions.

**Useful:** optimize the first 10 seconds after returning: current project, return point, active work, next work, recent change.

**Inclusive:** visible labels, strong focus, non-color status cues, 44px+ controls, 60px+ persistent mobile navigation targets, readable secondary text.

**Skeptic:** the prior `INDEX / WORK / RECORD` direction over-invested in visual concept and under-invested in the re-entry job. Avoid another editorial shell around the same old list.

**Realist:** preserve storage schema and auto-sync, but do not preserve old DOM/modules merely because they already exist. Reimplement essential interactions cleanly.

### Selected direction

**RETURN POINT**

Ledger is a continuity instrument. Every project view should answer, in order:

1. **Where was I?** — last meaningful change + time + project state.
2. **What is live now?** — active work with enough context to resume.
3. **What should I pick up next?** — ordered open queue.
4. **What do I need to remember?** — project brief, notes, journal, task annotations.
5. **What already happened?** — archive and chronological work record.

Visual identity is generated from a **continuous working record**: stable alignment, date/time marks, margin annotations, task-state bars, and deliberate editorial typography. It must not become faux paper, card soup, or a giant display-title app screen.

### Strongest challenge to RETURN POINT

A timeline-first interface could make continuity even more literal and combine tasks, notes, and history in one chronological stream.

Resolution: reject as the primary structure because chronology alone weakens action priority. Preserve chronology as a secondary record while giving active/next work stable spatial ownership.

## First wave

- [x] `V3-001` — recover product/data/design truth and authorize the bootstrap.
- [x] `V3-002` — select RETURN POINT after council challenge.
- [ ] `V3-003` — implement new semantic page shell and visual system with representative demo fixture.
- [ ] `V3-004` — implement schema-compatible project/task/note/journal/history actions.
- [ ] `V3-005` — render desktop/mobile fixture and correct visible failures.
- [ ] `V3-006` — merge to `main` and verify Pages deployment.

## Phase 0 — Foundation

- [x] Define DONE and permission envelope.
- [x] Recover storage/sync contracts.
- [x] Choose product-specific design concept.

## Phase 1 — Delivery

- [ ] Replace page structure rather than layering another stylesheet over V2.
- [ ] Build one owned V3 stylesheet and one owned V3 application script.
- [ ] Preserve project/task/journal/worklog/roadmap/link/subtask/notation fields.
- [ ] Support current/open/done state transitions, capture, editing, and recovery.
- [ ] Build deliberate desktop and mobile representations.

## Phase 2 — Integration and final proof

- [ ] Browser-render representative fixture at desktop and phone sizes.
- [ ] Run JavaScript syntax/static checks.
- [ ] Correct visible clipping, overlap, reachability, and hierarchy defects.
- [ ] Merge to `main`.
- [ ] Confirm Pages run targets exact merge SHA.

## Checkpoint policy

Internal only for this tester iteration. Use `CONTINUE | CHANGE | CUT SCOPE | RESEARCH | STOP` based on evidence. No independent-review or human-approval gate is required before the authorized live merge.
