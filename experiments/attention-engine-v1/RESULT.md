# Attention Engine V1 — Experiment Result

- Date: 2026-09-22
- State: PHASE 1 PASS / CONTINUE TO CLEAN-SHEET ARCHITECTURE SEARCH
- Parent roadmap: [../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md)
- Scope: organization mechanics only; no UI/product-shape claim

## Result

The architecture-neutral attention engine passed all implemented non-visual organization fixtures:

```text
ORG-F01 through ORG-F13: PASS
negative lost-work guard: PASS

14 / 14 tests passed
```

Runtime used for reproduction:

```text
Node.js v22.16.0
node attention-engine.test.js
```

## Exact committed-byte verification

The GitHub branch copies were fetched after commit and compared against the locally executed files using byte length + FNV-1a 32-bit fingerprints.

| File | Length | FNV-1a |
| --- | ---: | --- |
| attention-engine.js | 10035 | d70cc8fa |
| fixtures.js | 3963 | 87685410 |
| attention-engine.test.js | 7917 | 28bf0bd7 |
| README.md | 1720 | 9602ed13 |

The GitHub-fetched fingerprints matched the locally executed files exactly.

## What passed

The experiment demonstrated that a small deterministic model can:

- surface exactly the five seeded attention-worthy commitments from a 100-item workload;
- keep 30 intentionally waiting/parked commitments quiet without losing their resurfacing paths;
- preserve a compact return point across interruption;
- resurface a waiting commitment when its dependency completes;
- keep unchanged waiting work quiet before review;
- detect a stale return point after underlying state changes;
- collapse duplicate audit narration behind higher-information material events;
- enforce a soft active-capacity boundary with explicit human override;
- order attention using inspectable deterministic reasons;
- capture new obligations into INBOX without falsely making them active;
- survive serialization round-trip while keeping local/external save state conceptually separate;
- truthfully return an empty attention set;
- recover deep-work continuity without requiring projects or Chronicle;
- detect unfinished quiet work that has no wake/disposition path.

## What this does not prove

A seeded rule engine can pass fixtures that were designed around the same conceptual model. Therefore this is **not** evidence that:

- `INBOX / NOW / NEXT / WAITING / PARKED` is the best vocabulary;
- commitments should be the final top-level object;
- deterministic reason weights are the right production ranking method;
- users will prefer this to the incumbent;
- a Control Tower is the correct home screen;
- projects/tasks should be retained;
- reminders/notifications should work a particular way;
- the one-way Ledger sync model is sufficient;
- the model reduces cognitive load in real use.

## Challenge

The strongest risk is **metadata displacement**:

> The system could reduce memory burden only by requiring the user to maintain attention state, review dates, dispositions, dependencies, and return points manually.

That would move the organization burden rather than remove it.

The architecture search must therefore test not only retrieval quality but **maintenance cost**:

```text
benefit = avoided remembering + faster re-entry + fewer misses
         - state-maintenance effort
         - false resurfacing/noise
         - correction cost
```

A simpler architecture wins if it produces nearly the same safety/continuity with substantially less maintenance.

## Decision

`CONTINUE` to the clean-sheet architecture search.

The underlying mechanics are coherent enough to justify testing multiple product shapes. Do not promote this schema or terminology yet.
