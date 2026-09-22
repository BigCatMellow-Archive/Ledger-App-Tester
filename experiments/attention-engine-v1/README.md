# Attention Engine V1

Clean-sheet, UI-independent experiment for the organization research in:

- `docs/LEDGER-ORGANIZATION-RESEARCH-2026-09-22.md`
- `docs/LEDGER-ORGANIZATION-MODEL-2026-09-22.md`
- `docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md`

## Purpose

Test whether the underlying organization mechanics work **before** choosing a product shape.

This experiment deliberately does not depend on:

- Ledger projects;
- Ledger task storage;
- Chronicle;
- the proposed Control Tower;
- a particular visual layout.

It models neutral `commitment` objects and asks whether deterministic rules can:

- surface attention-worthy work;
- keep waiting/parked work quiet without losing it;
- explain why an item resurfaced;
- preserve a compact return point;
- detect stale return points;
- bound active work;
- keep material delta separate from audit narration;
- detect unfinished quiet work with no resurfacing/disposition path.

## Run

`node attention-engine.test.js`

The suite maps to non-visual roadmap fixtures `ORG-F01` through `ORG-F13`, plus one negative lost-work guard.

`ORG-F14` mobile representation and `ORG-F15` keyboard repeated-path behavior remain UI-phase fixtures and are intentionally not claimed here.

## Files

- `attention-engine.js` — deterministic classifier/routing functions.
- `fixtures.js` — fixed synthetic high-volume data anchored to 2026-09-22.
- `attention-engine.test.js` — reproducible fixture checks.

## Non-goals

- final schema;
- final vocabulary;
- final ranking policy;
- AI prioritization;
- production migration;
- notifications;
- visual design.

A passing engine only proves the organization mechanics are coherent enough to justify a clean-sheet architecture search.
