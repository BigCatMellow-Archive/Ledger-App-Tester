# Roadmap: Ledger V3 from-scratch UI

- State: `DONE`
- Authorization revision/date: `2026-09-14 user instruction: bootstrap → roadmap → build → live`
- Default autonomous execution: `YES`
- Completed: `2026-09-14`

## Current reality

- Bootstrap/product truth: see `docs/LEDGER-V3-BOOTSTRAP.md`.
- Durable Ledger state remains `ledger-notes-roadmaps-v2`.
- Existing auto-sync continues to consume the same state directly.
- The former layered V2 page architecture has been replaced on the tester by a new V3 semantic UI and owned V3 CSS/JS system.
- Live V3 merge commit: `498a20e33b814859a0d84084fa742c0d0ccacfb2`.

## Definition of DONE

- Finished result: a live Ledger tester whose UI architecture was designed and implemented from zero around re-entry, active work, continuity, and recordkeeping rather than around the old DOM.
- Final proof: representative desktop + mobile render inspection, core state smoke checks, merge to `main`, and successful Pages deployment for the exact merge SHA.
- Proof operator: orchestration operator for this testing iteration.
- Result: **PASSED**.

## Execution permission envelope

- Authorized objective: replace the tester UI with the V3 design end-to-end.
- In-scope decisions/actions: product shaping inside the approved job, AIDB council synthesis, front-end architecture, responsive design, data-compatible interactions, local rendering/smoke checks, commits/PR/merge, Pages deploy.
- In scope: `index.html`, new V3 CSS/JS, documentation, reuse of compatible sync behavior.
- Explicitly excluded: production Ledger repository changes, credential-policy changes, paid services, destructive data migration.
- Preauthorized external/destructive/irreversible action used: merge this tester branch to this tester repo's `main` after proof.
- Human checkpoints: `none`.
- Human reauthorization boundary remained un-crossed.

## Backward plan — completed

1. **DONE:** Pages successfully deployed a `main` commit containing the browser-checked V3 UI.
2. V3 was squash-merged after desktop/mobile fixture rendering and core state smoke checks passed.
3. The new implementation preserved project/task/note/journal/history data and essential actions without retaining the former page DOM architecture.
4. The council selected a product-specific direction from the bootstrapped product truth.
5. The project began from the layered V2 tester while preserving the known storage/sync contract.

## Council challenge and selected direction

The design council challenged whether Ledger should primarily behave like a task manager, notebook, project record, timeline, or continuity tool.

### Selected direction — `RETURN POINT`

Ledger is a continuity instrument. Every project view is organized to answer:

1. **Where was I?** — last meaningful change + time + project state.
2. **What is live now?** — active work with enough context to resume.
3. **What should I pick up next?** — ordered open queue.
4. **What do I need to remember?** — project brief, notes, journal, task annotations.
5. **What already happened?** — archive and chronological work record.

Visual identity is generated from the continuous working record: stable alignment, chronology, annotations, task-state relationships, deliberate editorial typography, and semantic color. It deliberately avoids faux-paper skeuomorphism, card soup, and generic dashboard composition.

### Material challenge

A timeline-first interface could make continuity more literal by combining tasks, notes, and history into one chronological stream.

Resolution: chronology remains an important secondary record, but it does not own the primary layout because chronology alone weakens action priority. Active and next work retain stable spatial ownership.

## First wave

- [x] `V3-001` — recover product/data/design truth and authorize the bootstrap.
- [x] `V3-002` — select RETURN POINT after council challenge.
- [x] `V3-003` — implement new semantic page shell and visual system with representative fixture.
- [x] `V3-004` — implement schema-compatible project/task/note/journal/history actions.
- [x] `V3-005` — render desktop/mobile fixture and correct visible failures.
- [x] `V3-006` — merge to `main` and verify Pages deployment.

## Phase 0 — Foundation

- [x] Define DONE and permission envelope.
- [x] Recover storage/sync contracts.
- [x] Choose product-specific design concept.

## Phase 1 — Delivery

- [x] Replace page structure rather than layering another stylesheet over V2.
- [x] Build one owned V3 UI system with stable `v3.css` / `v3.js` entrypoints and split maintainable modules.
- [x] Preserve project/task/journal/worklog/roadmap/link/subtask/notation fields.
- [x] Support current/open/done state transitions, capture, editing, history, import/export, undo, theme, and corrupt-data recovery.
- [x] Build deliberate desktop and mobile representations.

## Phase 2 — Integration and final proof

- [x] Browser-render representative fixture at desktop and phone sizes.
- [x] Exercise the split runtime as separate scripts rather than only as a combined development bundle.
- [x] Correct visible hierarchy/control issues found during rendered inspection.
- [x] Verify persistent mobile dock targets at `90 × 68 px` each on a `360 px` viewport.
- [x] Smoke-test capture, project switching/editing, task editing/status, notes, journal, theme, and mobile capture behavior with no console/page errors in the tested fixture.
- [x] Merge PR #6 to `main`.
- [x] Confirm GitHub Pages run `34852248243` completed successfully for exact merge SHA `498a20e33b814859a0d84084fa742c0d0ccacfb2`.

## Final checkpoint

- Type: `INTERNAL`
- Evidence reviewed: bootstrapped product truth; AIDB council challenge; V3 source architecture; desktop/mobile Chromium renders; split-runtime interaction smoke checks; PR #6 merge state; exact-SHA Pages deployment.
- Decision: `CONTINUE → COMPLETE`
- Reason: the approved tester objective and defined final proof passed without crossing the permission envelope.
- Remaining work: future changes are new tester iterations driven by live use/visual evidence, not unfinished V3 bootstrap work.
