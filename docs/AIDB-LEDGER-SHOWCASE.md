# Ledger — AIDB Showcase Design Direction

## Purpose

Ledger is being used as a concrete demonstration of the AI Design Bible (AIDB): not merely whether an agent can make a UI cleaner, but whether it can recover product truth, derive an authored visual concept, preserve familiar interaction, and build a coherent system that remains recognizable across states and viewport sizes.

## Product truth

Ledger is a browser-first working notebook for ongoing projects. Its core loop is:

```text
capture
→ classify
→ work
→ annotate
→ prove
→ archive
→ recover history
```

The user is not primarily managing dashboard metrics. They are maintaining a durable working record.

## Design philosophy

**Registered work.**

Ledger should feel like a living project register: part working notebook, part project folio, part field journal, part chronological record. It should not imitate a literal antique book. The concept is structural rather than decorative.

When visual polish conflicts with legibility or task throughput, prefer legibility and task throughput.

When generic app convention conflicts with Ledger identity, preserve familiar control behavior but make expression distinctive through composition, typography, indexing, rules, annotation, and record semantics.

When minimalism conflicts with useful context, preserve the context.

## Hard invariants

- familiar button, form, focus, dialog, and keyboard behavior;
- primary task and active project remain immediately identifiable;
- one scarce vermilion accent carries selection/current-work identity;
- project tabs behave as an index, not generic pills;
- the working page remains one continuous information surface rather than card soup;
- task state remains textually identifiable, never color-only;
- dark mode preserves hierarchy rather than simply inverting colors;
- mobile recomposes the register to one column without deleting essential context;
- existing Ledger data/storage semantics remain unchanged.

## Soft defaults

- editorial serif for document/project identity;
- neutral sans for action and working text;
- monospace for folio, date, state, and proof metadata;
- hard rules and alignment before borders/shadows;
- square or nearly square geometry for register surfaces;
- subtle ruled-paper rhythm, never faux-material texture;
- asymmetry when it communicates task priority.

## Generative freedoms

- folio numbering and project-count notation;
- margin marks for active/current work;
- register-style section labels;
- proof/history metadata language;
- alternate densities for desktop vs mobile;
- selective motion only when it explains state/spatial continuity.

## Explicit anti-patterns for this product

Avoid:

- rounded card grids as page architecture;
- pills for ordinary project navigation;
- equal visual weight for NOW and NEXT;
- decorative gradients as brand substitute;
- icon tiles above section headings;
- Inter/system-font-only autopilot;
- floating glass navigation;
- badge confetti;
- fake vintage props such as leather, torn paper, tape, coffee stains, or paperclips;
- hiding frequent actions behind hover or an overflow menu.

## Information hierarchy

```text
LEVEL 1
active project + current work

LEVEL 2
queued work + roadmap/project brief

LEVEL 3
notes + journal + task metadata

LEVEL 4
archive/history/supporting status
```

NOW receives more width and stronger accent than NEXT/OPEN on desktop. This is intentional; the two regions are not equally important.

## Visual grammar

### Project index

Projects are indexed folios. Tabs therefore use edge-index geometry: connected rectangular tabs, active top rule, and no generic pill treatment.

### Project folio

Each project receives a folio number, total count, mode, and last-worked metadata. This makes project identity and re-entry context visible without inventing dashboard statistics.

### Work register

Tasks are rows in a continuous register. Status occupies a stable left column. Titles and metadata align vertically for fast comparison. Hover/focus modifies the row without turning every task into a card.

### Notes

Notes are annotations, marked by a restrained diamond/margin signifier and editorial typography.

### Journal

Journal content remains chronological and document-like. Time/date metadata uses the record voice rather than the document voice.

### Roadmap

Roadmap framing reads as a project brief: strong top rule, labeled fields, stable label/value alignment. It is not represented as four equal dashboard cards.

### Archive

Completed work recedes visually and sits beyond a dashed register boundary. It remains inspectable rather than disappearing.

### Tool strip

Persistent navigation is a dark register tool strip with a single strong capture action. It is deliberately not floating translucent glass.

## AIDB mechanisms demonstrated

This implementation is intended to demonstrate these AIDB ideas in combination:

- purpose before representation;
- information organization before styling;
- visual hierarchy reflects task hierarchy;
- typography is interface structure;
- spacing/alignment before enclosure;
- cards are a grouping mechanism, not page architecture;
- accent scarcity;
- familiar interaction, distinctive expression;
- stable invariants + bounded freedom;
- product structure can become identity structure;
- one generative concept should explain multiple touchpoints;
- responsive design changes representation, not only pixel size;
- craft includes states, recovery, accessibility, and implementation integrity.

## Evaluation questions

A reviewer should ask:

1. If the word **Ledger** were removed, would the interface still feel product-specific?
2. Can the user identify the active project and current work before reading every label?
3. Does NOW clearly outrank NEXT/OPEN?
4. Can the visual system be explained from the product loop rather than from a UI trend?
5. Are controls still familiar even where composition is distinctive?
6. Does the interface avoid card soup and uniform rounded geometry?
7. Does typography communicate document / work / record roles?
8. Does mobile preserve identity while recomposing hierarchy?
9. Do empty, error, sync, archive, and modal states still belong to the same system?
10. Would another agent know what is invariant, what may vary, and why?

## Current implementation boundary

The showcase changes presentation and a small amount of DOM enhancement only. Ledger's underlying local data model, task semantics, GitHub sync model, and project storage behavior are intentionally unchanged.
