# Ledger Import V1

- Date: 2026-09-22
- State: TESTER BRIDGE / PREVIEW-BEFORE-APPLY
- Parent roadmap: [../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md](../../docs/LEDGER-ORGANIZATION-ROADMAP-2026-09-22.md)
- Source: incumbent Ledger snapshot shape
- Destination: Signal + Pull tester state
- Production impact: none
- Preserved V4: `archive/v4-chronicle-2026-09-22`

## Purpose

Let the clean-sheet candidate be tested against incumbent-shaped data without making the incumbent schema the new product architecture.

The source snapshot is treated as evidence and provenance. Conversion may reduce automation when the source is ambiguous, but it may not invent consequential certainty.

## Core rule

> Missing structure becomes an explicit ambiguity/manual-review condition, not fabricated automation.

Examples:

- free-text Ledger dependency text does **not** become a fake dependency ID;
- no review date is invented when the source has none;
- project membership becomes optional `scope` metadata, not mandatory navigation;
- notes/journal/worklog remain supporting provenance rather than becoming attention items by default.

## Mapping

| Ledger source | Signal + Pull test representation |
| --- | --- |
| ordinary OPEN item | OPEN / NEXT |
| DONE item | DONE / QUIET |
| most recently touched ACTIVE item | ACTIVE / NOW + Focus |
| additional ACTIVE items | OPEN / INBOX for explicit triage, source ACTIVE status preserved in provenance |
| BLOCKED or free-text dependency item | WAITING / manual review; no automatic wake invented |
| NOTE item | supporting provenance, not commitment |
| project title | optional scope metadata |
| project framing / notes / journal / worklog | supporting provenance |
| source item ID/status/kind/phase | retained in `source` metadata |

## Source preservation

Every converted commitment retains:

- source system;
- source item ID;
- source project ID;
- source kind;
- source status;
- source phase;
- rich source execution context.

The converter itself does not mutate the source object.

## Multiple ACTIVE items

Ledger may contain multiple ACTIVE items. Signal + Pull has one explicit Focus.

The import policy is:

1. most recently touched ACTIVE item becomes Focus;
2. other source-ACTIVE items are placed in Inbox for explicit triage;
3. their original ACTIVE status remains preserved in source provenance;
4. the conversion report calls this out.

This avoids silently hiding parallel active work and avoids pretending that Signal + Pull has multiple Focus owners.

## UI safety

The Signal + Pull Reliability view now offers:

**Preview Ledger snapshot**

The selected file is:

1. parsed;
2. validated as Ledger-shaped data;
3. converted in memory;
4. summarized with counts and conversion warnings.

Nothing is applied during preview.

Applying requires a separate explicit action. Before replacement, the current Signal + Pull state is serialized into:

`signal-pull-v1-pre-ledger-import-backup`

The selected Ledger file and preserved V4 branch are not modified.

## Reproducible tests

### Converter

`node experiments/ledger-import-v1/ledger-import.test.js`

Covers source validation, non-mutation, traceability, ACTIVE/OPEN/BLOCKED/DONE mapping, multiple-active triage, no fabricated dependency automation, provenance preservation, and duplicate source IDs.

Current result:

`14 / 14 PASS`

### UI contract

`node experiments/ledger-import-v1/ui-contract.test.js`

Covers:

- converter script load order;
- preview hooks;
- preview does not replace current state;
- preview performs no storage write;
- invalid Ledger data leaves current state untouched;
- invalid JSON leaves current state untouched;
- apply creates pre-import backup first;
- apply persists only after conversion + SignalStateIO validation.

Current result:

`12 / 12 PASS`

## What remains unproven

- conversion quality against the user's actual current Ledger snapshot;
- localStorage size behavior with a very large real snapshot;
- whether supporting provenance needs a dedicated work-detail presentation;
- whether manual-review imports create too much Inbox/Waiting cleanup;
- whether some Ledger project framing should become first-class context rather than provenance;
- production migration.

## Next evidence

After merge, use a real exported Ledger snapshot in the tester and compare the same workload through:

- preserved V4 Chronicle;
- Signal + Pull converted view.

The comparison should focus on re-entry speed, missed/hidden work anxiety, metadata cleanup cost, and whether project context is still available when needed.
