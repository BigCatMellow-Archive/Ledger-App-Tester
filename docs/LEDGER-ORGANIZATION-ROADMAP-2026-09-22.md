# Ledger Organization Project — MAPS_L Roadmap and Evaluation Fixtures

- Date: 2026-09-22
- State: WORKING ROADMAP / RESEARCH PHASE COMPLETE
- Research owner: [LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md](LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md)
- Model owner: [LEDGER-ORGANIZATION-MODEL-2026-09-22.md](LEDGER-ORGANIZATION-MODEL-2026-09-22.md)
- Method: MAPS_L project bootstrap + AI Design Bible high-volume/context/state rules
- Production authority: none from this document. Work remains tester-first until separately promoted.

## Parent outcome

Create and validate an organization model for Ledger that helps one person manage high-volume multi-project work without requiring constant mental tracking or repeated context reconstruction.

## Definition of DONE

The organization project is ready for production consideration only when all of the following are true:

- a fixed model distinguishes durable work state from current attention state;
- unfinished work can be intentionally quiet without becoming lost;
- waiting/parked work has inspectable resurfacing/disposition behavior;
- active work can be paused with a usable return point;
- a cross-project attention surface can identify seeded attention-worthy work in high-volume fixtures without requiring project-by-project inspection;
- the project-local Chronicle remains usable and is not duplicated by the global layer;
- “why now” is explainable for automatically surfaced work;
- material-delta behavior is separated from exhaustive history;
- save/recovery/resurfacing failure states are visible in the tested prototype;
- a fresh evaluator can reproduce the key scenarios from durable fixtures and state whether they pass.

### Final proof

Run the fixed evaluation fixtures below against the tester prototype using seeded data, record pass/fail evidence, and complete an independent review focused on:

- missed commitments;
- false or noisy attention;
- unsafe disappearance;
- stale/wrong return points;
- unexplained routing;
- recovery/data-loss risk;
- Chronicle regression;
- accessibility/keyboard behavior;
- mobile representation.

## Boundaries

### In scope

- organization research;
- formal attention-state model;
- deterministic resurfacing model;
- synthetic fixture dataset;
- tester-only Control Tower prototype;
- integration with existing V4 Chronicle;
- evaluation and challenge;
- storage/recovery truth needed to support the prototype honestly.

### Not currently in scope

- production promotion;
- destructive migration of real user data;
- opaque AI priority ranking;
- email/calendar integrations;
- automatic external side effects;
- notifications outside the tester;
- replacing Chronicle;
- a full project-management suite;
- organization-wide/team resource planning.

### Effort reconsideration trigger

Reconsider the model before adding complexity if a deterministic state/trigger system cannot outperform a simple project list + Chronicle on the fixed fixtures, or if maintaining resurfacing metadata creates more user work than it removes.

## Current facts checked

### VERIFIED

- V4 Chronicle exists in the tester and is the current experimental front door.
- Chronicle has a resume checkpoint, material chronology, Next rail, project switcher, and separate full history path.
- Ledger data already contains rich task context including dependencies, status, notes, acceptance/proof, links, work logs, journal, and project framing.
- AI Design Bible has high-volume research and normalized rules for truthful state, multi-item scope, and context re-entry.
- MAPS_L provides project bootstrap, task lifecycle, information lifecycle, evidence/review, and continuation methods.
- No current Control Tower/attention model was found in the tester docs/code search.

## Working hypotheses

- H1: global attention management and local project continuity are distinct product jobs.
- H2: deterministic attention/resurfacing rules will provide most of the value before AI ranking is needed.
- H3: separating OPEN population from bounded NOW population will reduce perceived overload.
- H4: WAITING becomes safer when every quiet item has an inspectable wake/review contract.
- H5: a compact cross-project material delta will support re-entry better than global activity history.
- H6: reliability visibility will materially affect whether users are comfortable offloading commitments to Ledger.

## Fixed evaluation fixtures

Thresholds below are **candidate prototype gates**, not claims about universal human-performance standards.

### ORG-F01 — High-volume global triage

Seed:
- 25 projects;
- 100 unfinished commitments;
- 5 intentionally attention-worthy items:
  - one due soon;
  - one newly unblocked;
  - one waiting review expired;
  - one pinned active return point;
  - one material project change.

Pass:
- all 5 are reachable from the first global attention surface without opening 25 projects;
- each has a visible reason;
- no item must rely on hidden score meaning;
- intentionally quiet work is still discoverable through an explicit secondary route.

Fail:
- any seeded attention item is invisible;
- the user must scan the complete 100-item population;
- global history noise obscures the attention set.

### ORG-F02 — Safe quiet backlog

Seed:
- 40 open commitments;
- 30 are deliberately parked or waiting;
- every quiet item has either a trigger/review rule or explicit manual-only disposition.

Pass:
- quiet items do not crowd NOW/NEEDS ATTENTION;
- user can inspect why each quiet item is quiet and how it returns;
- a query identifies any unfinished item with no disposition/resurfacing path.

Fail:
- unfinished work can silently disappear from all normal views;
- parked/waiting items require memory to rediscover.

### ORG-F03 — Interruption and ready-to-resume

Sequence:
1. work actively on task A;
2. establish material progress;
3. pause because task B interrupts;
4. return later.

Pass:
- task A shows the last material state;
- a concrete next move is recoverable;
- unresolved/stale context is visible;
- resumption does not require replaying full Chronicle/history.

### ORG-F04 — Waiting changes while away

Seed:
- item waits on dependency D;
- D becomes complete while item is quiet.

Pass:
- waiting item re-enters a review/next attention state;
- “why now” identifies the dependency change;
- original waiting context remains inspectable.

### ORG-F05 — Waiting does not change

Seed:
- item waits on a condition with a future review date;
- no dependency/event change occurs.

Pass:
- item remains quiet before the review trigger;
- no recurring noise is generated;
- it remains discoverable in Waiting.

### ORG-F06 — Stale return point

Seed:
- project checkpoint says next action X;
- underlying task/dependency changes and X is no longer valid.

Pass:
- system does not present X as unquestionably current;
- stale/material-change state is visible;
- user can reach the change that invalidated the checkpoint.

### ORG-F07 — Material delta versus audit history

Seed:
- one user journal entry;
- one note edit;
- one task completion with proof;
- multiple automatic mutation/audit rows.

Pass:
- default re-entry delta shows the meaningful journal/note/completion result once;
- exhaustive mutation rows remain available in History/Audit;
- no duplicate “note changed” + note-content pair appears by default.

### ORG-F08 — Bounded active attention

Seed:
- active attention soft limit configured;
- NOW is at capacity;
- new eligible work appears.

Pass:
- new work does not silently increase active concurrency;
- system exposes the capacity conflict;
- user can explicitly defer, replace/displace, or override.

Fail:
- every eligible/urgent item automatically becomes NOW.

### ORG-F09 — Explainable ordering

Seed:
- several NEXT items differ by deadline, readiness, explicit pin, and context.

Pass:
- every promotion/ranking change can expose the contributing deterministic reason(s);
- user can override the outcome without corrupting underlying work state.

### ORG-F10 — Capture without immediate commitment

Sequence:
- rapidly capture 10 incoming obligations during interruption-heavy work.

Pass:
- capture is low-friction;
- items can remain INBOX/untriaged;
- capture does not force immediate full metadata or falsely make all items active.

### ORG-F11 — Restart / recovery truth

Sequence:
- create/change attention state and return point;
- simulate reload/restart;
- simulate unavailable/failed sync path where feasible.

Pass:
- local saved state returns correctly or failure is explicit;
- UI distinguishes local save truth from external snapshot/sync truth;
- no false “safe” state is shown.

### ORG-F12 — Empty attention state

Seed:
- all attention-worthy work is complete, future-triggered, or explicitly quiet.

Pass:
- Control Tower can truthfully show that nothing currently needs attention;
- it does not fill the screen with arbitrary work merely to avoid emptiness;
- user can still navigate to all projects/commitments.

### ORG-F13 — Chronicle preservation

Sequence:
- enter a project from Control Tower.

Pass:
- project opens into a coherent Chronicle/checkpoint/Next experience;
- Control Tower does not duplicate or replace the project's material chronology;
- returning globally preserves project state.

### ORG-F14 — Mobile re-entry

Run ORG-F01, F03, and F04 on target phone viewport.

Pass:
- Needs Attention and current return point are reachable without an unbounded history scroll;
- touch targets and text remain usable;
- global/project scale distinction remains understandable.

### ORG-F15 — Keyboard repeated path

Sequence:
- triage inbox;
- activate next item;
- pause with return point;
- move item to waiting;
- advance to next work.

Pass:
- essential path is keyboard-operable;
- focus remains predictable across state changes;
- shortcuts never act on hidden/unexplained scope.

## Phase 0 — Research and model

- [x] Recover current Ledger V4 behavior and prior design decisions.
- [x] Recover AI Design Bible high-volume/context/state guidance.
- [x] Recover MAPS_L bootstrap/information/task lifecycle guidance.
- [x] Research control-room / dispatch / mission-control mechanisms.
- [x] Research warehouse dispatch / interleaving mechanisms.
- [x] Research newsroom assignment-desk mechanisms.
- [x] Research personal project information management.
- [x] Research interruption / ready-to-resume behavior.
- [x] Research cognitive offloading benefits and failure risks.
- [x] Challenge black-box priority and reminder-heavy approaches.
- [x] Define the working Ledger Organization Model.
- [x] Define fixed evaluation fixtures.

## Phase 1 — Data model experiment

Goal: test the model without committing to visual design.

- [ ] Create a synthetic fixture dataset covering ORG-F01 through ORG-F13.
- [ ] Define the smallest additive attention/resurfacing representation compatible with existing state.
- [ ] Prefer derived/projection state when possible over duplicating canonical truth.
- [ ] Implement a deterministic selector that can answer:
  - needs attention;
  - now;
  - next;
  - waiting;
  - parked;
  - why now;
  - missing resurfacing/disposition.
- [ ] Add unit-level tests for transitions and trigger evaluation.
- [ ] Run fixtures without building a polished UI.
- [ ] Challenge whether the state model adds enough value to proceed.

Checkpoint:
- **CONTINUE** only if the deterministic model can correctly route seeded scenarios without hidden state or manual duplication.

## Phase 2 — Control Tower prototype

Goal: prove global orientation while preserving Chronicle.

- [ ] Create a tester-only global Control Tower.
- [ ] Keep Chronicle as the project-local continuation surface.
- [ ] Add explicit “why now.”
- [ ] Add inspectable Waiting/Parked resurfacing state.
- [ ] Add cheap pause/return-point interaction.
- [ ] Add global material-delta projection.
- [ ] Avoid charts/metrics unless they solve a fixture.
- [ ] Verify desktop and mobile repeated paths.
- [ ] Run AI Design Bible visual/interaction/accessibility checks on rendered output.

Checkpoint:
- compare Control Tower + Chronicle against Chronicle-only baseline on the fixed fixtures.

## Phase 3 — Reliability hardening

Goal: make stronger cognitive offloading safe.

- [ ] Define visible local-save state.
- [ ] Define external snapshot/sync state separately.
- [ ] Detect commitments with no resurfacing/disposition.
- [ ] Test reload/corruption/import/export recovery paths.
- [ ] Determine whether one-way GitHub snapshot is sufficient for intended use.
- [ ] If not sufficient, research synchronization architecture separately rather than hiding the limitation.

Checkpoint:
- do not claim “safe to forget” until recovery and resurfacing failures are inspectable.

## Phase 4 — Ranking experiment

Only after deterministic routing passes.

Compare:

A. explicit rule/state ordering;
B. user-authored ordering;
C. hybrid suggestions;
D. AI ranking, only if there is a remaining measurable gap.

- [ ] Freeze identical fixture inputs.
- [ ] Compare missed attention items.
- [ ] Compare irrelevant surfaced items.
- [ ] Compare explanation quality.
- [ ] Compare correction/override cost.
- [ ] Reject AI ranking if added complexity does not produce a material improvement.

## Phase 5 — Independent review and promotion decision

- [ ] Fresh reviewer receives research, model, fixtures, and working tester.
- [ ] Reviewer attempts to falsify:
  - safe quiet-state claim;
  - resurfacing reliability;
  - global/local separation;
  - explainability;
  - storage/recovery trust;
  - accessibility/mobile repeated use.
- [ ] Correct review findings.
- [ ] Run final fixed fixture suite.
- [ ] Record residual limitations.
- [ ] Decide separately whether production promotion is warranted.

Production promotion is a distinct action and is not implied by passing the tester evaluation.

## Review questions

A reviewer should specifically ask:

1. Does this system actually reduce remembering, or merely move remembering into metadata maintenance?
2. Can any unfinished item become invisible without an explicit reason?
3. Can a wrong trigger keep important work quiet?
4. Does the Control Tower surface too much and recreate overload?
5. Does deterministic routing respect human judgment?
6. Does the current storage model justify the amount of trust the UI invites?
7. Are global attention and project chronology still cleanly separated?
8. Does the system still work when the user ignores it for a week?
9. Can the user understand the state after a reload or failure?
10. Is a simpler model sufficient?

## Current project decision

Proceed to **Phase 1 — Data model experiment** before changing the polished Ledger UI.

The next useful artifact is a synthetic fixture dataset plus a deterministic attention/resurfacing selector. This is intentionally chosen before visual design so the product model must prove itself independently of aesthetics.
