# Ledger V4 — Clean-Sheet Concept Search and Selection

- State: `CONCEPT SELECTED / IMPLEMENTATION AUTHORIZED`
- Date: `2026-09-14`
- Mode: `C / CLEAN SHEET`
- Method: MAPS_L bootstrap/orchestration + AIDB Design Council + AIDB Clean-Sheet Redesign Protocol
- Incumbent baseline: `main@c43b990b3214be8d96551469d957dcb62c05d736`
- AIDB protocol baseline: `BigCatMellow/Pilot_Projects@b1fa9ca87bf6e84a76165197734d585812fa0ced`
- Authority: tester-only redesign/build/live promotion previously authorized by the human owner

## Product job

Ledger helps a person returning to ongoing work recover:

1. where the work stands;
2. what changed;
3. what matters now;
4. what should happen next;
5. why prior decisions/actions happened;

then continue without reconstructing context from memory.

## MUST PRESERVE

- existing `ledger-notes-roadmaps-v2` durable state compatibility;
- projects, tasks/items, OPEN/ACTIVE/BLOCKED/DONE state;
- task notes, subtasks, execution context, dependencies, proof, links;
- project notes and journal;
- roadmap/project framing;
- work history / chronology;
- capture, edit, project switching, status changes, work logging, import/export, theme, sync access;
- safe corrupt-data recovery behavior;
- keyboard/touch accessibility and meaningful mobile use;
- existing GitHub sync/storage contract unless a separate authorized task changes it.

## MUST NOT ASSUME

The clean-sheet concepts may not inherit these merely because V3 has them:

- left project spine/sidebar;
- dominant project-heading page shell;
- `Return Point → Now → Next → Context → Archive` as fixed page regions;
- two-column work/context composition;
- task-ticket visual grammar;
- serif + navy + vermilion identity;
- persistent four-action mobile dock;
- V3 DOM/component hierarchy;
- V3 CSS/token architecture;
- V3 responsive representation;
- existing action placement.

Any reuse must be re-earned after alternatives exist.

## Incumbent behavior inventory

Abstracted from the current application without treating its layout as authority.

### Content

- projects;
- active/open/blocked/done work;
- project framing and boundaries;
- project notes;
- chronological journal entries;
- work-history events;
- task execution context, notes, subtasks, links, verification/proof fields;
- sync and recovery state.

### Core actions

- choose/create/edit project;
- capture task/note/detailed task;
- activate/block/complete/edit work;
- add notes/journal/work-history evidence;
- inspect archive/history;
- export/import;
- configure/use sync;
- recover after interruption or corrupt local state.

### Known incumbent strengths

- current work is visible;
- state schema is rich;
- continuity/re-entry is now an explicit product goal;
- mobile targets were hardened;
- task/context information can be preserved without migration.

### Known incumbent failures relevant to this pass

- project/sidebar + header + work list + context rail remained too close to earlier layouts;
- visual identity changed more than interaction/composition identity;
- mobile still behaved like a conventional stacked task app with persistent navigation;
- council critique improved one direction rather than exploring enough genuinely different directions.

# Independent concepts

The concept slots used the same product truth, behavior inventory, constraints, and AIDB rules. They were not required to preserve the incumbent composition.

## Concept A — Continuity Atlas

**Question:** What if Ledger opens as a cross-project re-entry map rather than a project page?

- IA: portfolio/home-first;
- navigation: project bands and direct resume/open actions, no persistent project sidebar;
- composition: large strongest-return-point region followed by horizontal project bands;
- interaction: choose work by re-entry value rather than first choosing a project page;
- surface grammar: atlas/register bands and strong project summaries;
- mobile: stacked project atlas, not sidebar-to-stack translation;
- signature: every project exposes `where left off + memory/risk + next work` at portfolio level.

**Primary strength:** best overview for someone juggling many dormant projects.

**Primary weakness:** risks becoming an information dashboard; long phone scroll and weaker deep-project identity.

## Concept B — Chronicle

**Question:** What if continuity is the primary organizing relationship and action priority is pinned inside it?

- IA: project chronology first, with current commitment pinned above the record;
- navigation: compact project switcher rather than structural sidebar;
- composition: chronological spine + pinned resume checkpoint + separate next-work queue;
- interaction: resume from checkpoint, then understand decisions/notes/proof in temporal context;
- surface grammar: dated entries, event marks, checkpoint treatment, editorial rhythm;
- mobile: one chronological stream with `Next` following it and a single capture action;
- signature: task state and project memory coexist in one temporal record without turning the log itself into the queue.

**Primary strength:** strongest match to Ledger's continuity/recordkeeping identity while preserving an obvious next action.

**Primary weakness:** chronology can overpower action priority if the resume checkpoint and next queue are not kept dominant.

## Concept C — Focus Console

**Question:** What if Ledger is primarily a commitment console rather than a record page?

- IA: current commitment first;
- navigation: command/search + secondary project switcher;
- composition: one dominant focus object, steps, then up-next/memory;
- interaction: keyboard/command and current-commitment driven;
- surface grammar: high-contrast operational console;
- mobile: horizontal project strip + huge current commitment + single capture FAB;
- signature: almost all visual energy is reserved for the one thing being worked now.

**Primary strength:** fastest re-entry to immediate action and the largest departure from incumbent composition.

**Primary weakness:** underrepresents Ledger's rich historical/contextual record and can collapse toward generic power-user productivity tooling.

# Material-difference gate

Scale:

- `0` substantially inherited
- `1` meaningfully adapted
- `2` materially re-conceived

| Dimension | Incumbent V3 | A — Atlas | B — Chronicle | C — Focus |
| --- | --- | ---: | ---: | ---: |
| A. Information architecture | project page / work-context split | 2 | 2 | 2 |
| B. Navigation model | persistent project spine + mobile dock | 2 | 2 | 2 |
| C. Spatial composition | header + work column + context rail | 2 | 2 | 2 |
| D. Interaction placement/model | row/task actions inside project page | 2 | 2 | 2 |
| E. Surface/component grammar | registers/tickets/context sections | 2 | 2 | 2 |
| F. Typography hierarchy/voice | editorial serif/sans/mono | 1 | 2 | 2 |
| G. Color role system | warm paper/navy/work red | 1 | 1 | 2 |
| H. Mobile representation | stacked project page + persistent dock | 2 | 2 | 2 |
| **Materially re-conceived (`2`)** | — | **6/8** | **7/8** | **8/8** |

All three pass the Mode-C difference floor. Difference alone does not select the winner.

# Council comparison

## Distinctive

- A is product-specific through cross-project continuity.
- B is most unmistakably a **Ledger**: time, evidence, decisions, current commitment, and future work form one visual language.
- C is striking but risks feeling like a developer/command productivity tool with Ledger data inside it.

Preference: **B**.

## Coherent

- A's atlas logic explains overview well but becomes weaker inside deep project work.
- B has one generative relationship—**time + checkpoint**—that explains hierarchy, chronology, event marks, history, notes, and current work.
- C is internally coherent but places too much product meaning into one current commitment.

Preference: **B**.

## Expressive

- A has strong large-scale information composition.
- B gives typography, chronology, date marks, event types, and color semantic work without faux-paper skeuomorphism.
- C has the highest contrast but the narrowest emotional/register range.

Preference: **B**.

## Useful

- A wins cross-project triage.
- B wins returning to a specific project because the pinned checkpoint protects action priority while the timeline restores why/how the project got here.
- C wins immediate execution but loses too much context from the first view.

Preference: **B**, with checkpoint/Next dominance as a hard invariant.

## Inclusive

All three can satisfy ordinary semantic/keyboard/touch requirements. B needs care that small chronological metadata does not become micro-text and that color is never the only event distinction.

No concept rejected.

## Skeptic

Strongest attack on B:

> A timeline can become a beautiful activity feed that makes users read history before doing work.

Required response:

- checkpoint remains first actionable object;
- `Next` queue remains separately scannable;
- chronology is selectively material, not every low-level event;
- primary actions use familiar controls;
- phone view must not bury `Next` behind an unbounded history stream.

Skeptic resemblance test:

> With branding, fonts, and color removed, is B still basically V3?

**No.** V3 is spatially organized around a persistent project index and parallel work/context regions. B is organized around a chronological spine with a pinned checkpoint and separate queue; it removes the incumbent sidebar, parallel context rail, task-ticket register, and mobile dock.

## Realist

B can preserve the current state schema because chronology can be projected from existing `workLogs`, journal, notes, task timestamps/status, and project framing without changing those underlying records.

Implementation caution: do not fabricate chronological precision for legacy objects without timestamps. Undated context should remain clearly separate or use known project-level ordering.

# Selection

## Selected direction: **Concept B — Chronicle**

It wins because it makes the product's core truth—continuity across interruption—structural rather than decorative while retaining an explicit action hierarchy.

It is not selected because it is the most different. Concept C is more divergent. It is selected because B survives the difference gate **and** better represents the full Ledger product.

# Frozen concept contract

## Product job

Restore working context after absence and make the next useful action obvious while preserving the evidence of how the project arrived here.

## Core IA

```text
PROJECT SWITCH / GLOBAL CAPTURE
        ↓
PROJECT IDENTITY + STATUS
        ↓
RESUME CHECKPOINT  ← first actionable object
        ↓
CHRONICLE OF MATERIAL EVENTS
        ↘
         NEXT QUEUE  ← independently scannable/actionable
        ↓
ARCHIVE / FULL HISTORY / TOOLS on demand
```

## Desktop composition

- compact top project/global rail, not a side spine;
- project title and concise framing;
- visually dominant resume checkpoint;
- chronological spine owns the main reading column;
- next-work queue remains a narrower persistent companion region;
- notes/journal/decisions/proof appear as distinct event types inside chronology when materially useful;
- deep task editing remains a focused dialog/sheet rather than making every event dense.

## Mobile composition

- compact project switch row at top;
- project identity + resume checkpoint immediately visible;
- material chronology follows;
- `Next` remains reachable before chronology can become excessively long (bounded recent events + explicit full-history action);
- one prominent capture action; no four-tab persistent dock required;
- dialogs become full-width/bottom-sheet or full-screen as appropriate.

## Typography

- editorial display face for project/checkpoint narrative hierarchy;
- highly readable sans for actions/task content;
- mono/tabular treatment only for dates, sequence, and evidence metadata;
- no micro-text as a branding device.

## Color roles

- neutral warm/cool base chosen for legibility, not inherited beige;
- one primary current-action role;
- chronology event roles use restrained semantic accents;
- proof/success and alert remain distinct;
- date/event identity cannot depend on color alone.

Exact palette is intentionally not frozen until implementation contrast/state testing.

## Surface language

- chronology lines/markers and clear textual grouping;
- checkpoint may receive one exceptional framed treatment because it is the product's re-entry object;
- avoid card soup, repeated rounded containers, glass navigation, and badge-heavy status grammar.

## Hard invariants

1. chronology is not allowed to hide action priority;
2. resume checkpoint is first actionable object after project identity;
3. Next queue remains independently scannable;
4. only material events enter the default chronology;
5. no persistent left project sidebar in the selected design;
6. no V3 work/context two-column recreation;
7. no four-item persistent mobile dock;
8. mobile is a bounded temporal flow, not desktop columns stacked;
9. existing state/sync schema remains compatible;
10. final rendered implementation must still pass the clean-sheet difference audit.

## Allowed flexibility

- exact typefaces;
- exact palette;
- event marker geometry;
- desktop queue width;
- chronology density;
- breakpoint values;
- animation/motion if useful and reduced-motion safe.

## Rejected incumbent assumptions

- sidebar as project navigation owner;
- separate context rail as the primary home for project memory;
- Now/Next/Context/Archive section numbering;
- task-ticket visual grammar;
- persistent mobile command dock;
- current V3 token/palette system.

## Known risks

- chronology degenerating into activity-feed noise;
- older data lacking timestamps;
- action queue becoming visually secondary;
- dense project histories causing long phone pages;
- over-editorial typography reducing repeated-use speed.

# Prototype evidence

Standalone prototypes are stored under `concepts/v4/` on this branch.

Locally rendered with Chromium/Playwright before selection:

- A desktop: 1440px viewport; mobile: 390px;
- B desktop: 1440px; mobile: 390px;
- C desktop: 1440px; mobile: 390px;
- C initially exposed horizontal overflow on phone; concept CSS was corrected and re-rendered to exact 390px document width before comparison.

No concept was selected from prose alone.

# Next authorized action

Implement Chronicle in an isolated V4 application path using real representative Ledger data, smoke-test desktop/mobile interaction, rerun the material-difference/resemblance audit, then promote to the tester root only if the implemented result still qualifies as Mode C.
