# Ledger V3 — MAPS_L Bootstrap

- State: `APPROVED_FOR_AUTONOMOUS_EXECUTION`
- Authorization date: `2026-09-14`
- Method: MAPS_L `PROJECT_BOOTSTRAP` + AIDB Design Council
- Human checkpoint: `none`
- Release target: `BigCatMellow-Archive/Ledger-App-Tester` GitHub Pages

## Inspect reality

Checked facts:

- Ledger stores its working state under `ledger-notes-roadmaps-v2`.
- The state already contains projects, tasks/items, work history, journal entries, roadmap framing, links, subtasks, task notations, status, timestamps, and sync-compatible JSON.
- GitHub auto-sync is independent enough to retain if the same storage key/schema remains.
- Prior redesigns improved visual language but remained constrained by the existing DOM/CSS/module architecture.
- Live visual testing exposed layout coupling between old task modules and new presentation.
- The tester repository is explicitly authorized as a test ground; the user asked for bootstrap → roadmap → build → live without an independent-review gate in this step.

## Product truth

### User

A person managing several ongoing projects over time, often returning after interruption rather than completing the work in one sitting.

### Primary job

> Ledger helps a returning project owner recover **where the work stands, what matters now, what changed, and why**, then take or record the next useful action without reconstructing context from memory.

### Supporting jobs

- capture an idea/task before it is lost;
- move tasks through open / active / done / blocked states;
- preserve task-specific notes, subtasks, dependencies, proof, and links;
- keep project notes and a chronological journal;
- retain a work-history trail;
- preserve roadmap framing and project boundaries;
- back up the same durable state through the existing sync path.

## Design tradeoff policy

When these goals conflict, prefer:

1. **re-entry clarity over decorative spaciousness**;
2. **current work over project branding**;
3. **visible meaning over fake minimalism**;
4. **task scanning over ornamental composition**;
5. **distinctive expression over generic SaaS conventions only where basic interaction remains familiar**;
6. **continuous information relationships over card-based enclosure**;
7. **mobile reachability over desktop geometry preservation**;
8. **existing data compatibility over preserving the existing UI implementation**.

## Definition of DONE

Finished result:

- the live tester uses a new page structure, new CSS system, and new interaction/render layer written for Ledger V3;
- it reads/writes the existing Ledger storage schema rather than migrating or discarding user data;
- returning to a project immediately exposes a useful **return point**, active work, next work, and recent context;
- notes, journal, roadmap framing, archive/history, task details, subtasks, and links remain usable;
- project switching, capture, editing, status changes, work logging, export/import, theme, and sync access remain available;
- desktop and mobile are intentionally recomposed rather than simply resized;
- mobile persistent actions are large enough for thumb use and do not cover content;
- the visual system is recognizably Ledger-specific with the product name removed.

Final proof for this tester step:

1. syntax/static smoke checks pass;
2. a representative fixture renders successfully at desktop and phone viewport sizes;
3. the rendered artifact has no obvious clipping/overlap in the primary view;
4. main is updated and GitHub Pages starts deploying the exact merge commit.

A separate independent design review is deliberately excluded from this test iteration by human instruction.

## Permission envelope

Authorized:

- redesign/rewrite `index.html` and Ledger front-end presentation/interaction code;
- add/replace CSS and JS needed for the new UI;
- preserve and normalize the existing storage schema in-place;
- create bootstrap/design/roadmap evidence;
- use AIDB council lenses during shaping and correction;
- create commits/PRs and merge to `main` when the proof above passes;
- trigger the normal GitHub Pages deployment by merging to `main`.

Explicitly excluded:

- changing the real production Ledger repository;
- changing GitHub token/credential semantics;
- paid services or model/API spend;
- destructive migration of existing local data;
- changing sync repository permissions or external GitHub account state beyond the existing user-initiated sync behavior.

Highest-risk unknown:

> Can a genuinely new UI architecture preserve the useful depth of the current data model without recreating the same clutter or silently dropping legacy fields?

This must be answered in the first implementation wave, not deferred until polish.
