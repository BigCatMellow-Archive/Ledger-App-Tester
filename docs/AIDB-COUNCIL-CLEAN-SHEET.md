# Ledger Clean-Sheet UI — AIDB Design Council Record

- Record role: `DECISION / DESIGN DIRECTION`
- Primary information class: `TASK CONTEXT + FACT / KNOWLEDGE`
- Status: `ADOPTED FOR PROTOTYPE`
- Lifecycle: `ACTIVE`
- Authority: presentation/design direction for this bounded Ledger-App-Tester prototype only; does not change data, sync, storage, release, or merge authority
- Accountable owner: human project owner
- Canonical owner for this clean-sheet design pass: this file
- Parent / decision supported: user request to restart the Ledger UI from scratch using AIDB + MAPS_L team orchestration
- AIDB method: `Pilot_Projects/ai-design-bible/DESIGN-COUNCIL.md` on `aibd-design-council-mapsl`
- MAPS_L method: Orchestrated depth; bounded seats, operator reconciliation, independent challenge, implementation/review separation

## Objective

Rebuild Ledger's visual interface from a clean sheet while preserving its current browser data model, actions, task semantics, sync model, and existing JavaScript behavior.

Success is not "prettier." The new interface should be recognizably Ledger without relying on the wordmark, avoid generic AI/productivity defaults, remain fast to scan, and survive real content and narrow viewports.

## Recovered product truth

Ledger is a local-first working record for ongoing projects:

```text
capture → choose current work → execute → annotate → log evidence/history → archive → re-enter later
```

The primary repeated job is **resume a project and know what to work on now**.

The UI therefore needs stronger orientation and task hierarchy than a literal notebook metaphor.

## Independent council positions

### Distinctive — Creative Director

Reject both generic SaaS dashboard and literal vintage-notebook styling. Build identity from a strong composition: a persistent project index spine, large editorial project title, severe information rules, and one unmistakable active-work field. The application should resemble an authored publication/instrument rather than a component library demo.

### Coherent — Industrial / Systems

Use one geometry system: squared surfaces, continuous rules, stable columns, no decorative card grid. Separate three semantic layers: `INDEX`, `WORK`, `RECORD`. Every color and type role must belong to one of those layers. Prefer one page frame that can scale rather than many independent containers.

### Expressive — Brand / Editorial

Use typography to carry voice: serif display for project identity/editorial content; sans for working controls; mono for record/status/date. Use color as semantic material, not accent decoration. Proposed roles: cobalt/navy = index/structure, vermilion = current/action, ochre = annotation, moss = proof/completion, oxblood = alert.

### Useful — Product / Interaction

Current work must win. The screen should answer, in order: `Where am I?` → `What is active?` → `What is next?` → `What context do I need?` Frequent capture and project switching remain visible. Notes/journal/roadmap are supporting context, not equal peers to active work.

### Inclusive — Accessibility / Human Factors

Do not encode task state by color alone. Keep status words and stable placement. Minimum interactive targets remain touch-usable. Project rail must become a horizontally scrollable index on mobile rather than a tiny vertical rail. Dark mode needs separate contrast tuning. Avoid low-contrast editorial subtlety.

### Skeptic — Adversarial challenge

Challenge to the leading "register" direction: it can still become a dressed-up spreadsheet/notebook if every choice is a line, label, and mono caption. Strongest alternative is a warmer field-journal system with expressive paper modules and less institutional geometry. Risk: the selected direction may feel severe or corporate, especially when projects contain mostly notes rather than tasks.

### Realist — Implementation

Preserve all current IDs/data-action hooks and JS modules. Do not rewrite storage/render logic for a visual test. Replace the main stylesheet layer and static page composition; reuse existing behavioral modules. Avoid runtime DOM decoration as the primary design mechanism. New layout must degrade safely if optional sections are hidden by existing JS.

## Tension resolution

### Editorial expression vs operational scan speed

Use editorial type only at project/title/note-content scale. Repeated task rows use compact sans + mono status. This keeps authorship without making every row decorative.

### Register severity vs warmth

Use warm paper/surface values and a richer semantic palette rather than gray/white austerity. Keep rules dark but sparse. Notes receive ochre and serif treatment; proof/completion receives moss.

### Persistent project context vs mobile space

Desktop gets a vertical project index spine. Mobile transforms the same project index into a horizontal top strip. The information model remains constant; representation changes.

## Adopted direction — `INDEX / WORK / RECORD`

Ledger is presented as an **editorial operations register** with three visible layers:

```text
INDEX
projects / place / switching / global utility

WORK
project identity / active task / next tasks / capture

RECORD
roadmap context / notes / journal / archive / history
```

### Signature choices

1. A dark ink-blue project spine on desktop instead of pill tabs or floating navigation.
2. Active work marked by a vertical vermilion current-line and oversized `NOW` label, not a card.
3. Project title treated like an editorial folio headline with record metadata directly beneath it.
4. Semantic colors used as roles across the system, not decorative variation.
5. Square geometry and strong rules; almost no rounded cards.
6. Bottom navigation becomes a compact command bar integrated with the page edge, not glass/floating chrome.

## Color roles

Light:

```text
CANVAS      #D7D0C3
PAPER       #F5F0E6
INK         #171A1D
INDEX       #18324A
WORK        #D85C45
ANNOTATION  #C58A2B
PROOF       #687D4F
ALERT       #8B3137
RULE        #B8AC9A
```

Dark:

```text
CANVAS      #0E1216
PAPER       #171C20
INK         #F1E9DD
INDEX       #9CC0D8
WORK        #F07B64
ANNOTATION  #E3B45C
PROOF       #A3B985
ALERT       #E77B82
RULE        #48525A
```

## Typography roles

```text
DISPLAY / DOCUMENT  Source Serif 4 / Georgia fallback
WORK / CONTROL      IBM Plex Sans / system sans fallback
RECORD / META       IBM Plex Mono / ui-monospace fallback
```

## Anti-references

Do not produce:

- rounded card dashboard;
- floating glass nav;
- pill project tabs;
- pastel status confetti;
- giant marketing hero inside the application;
- fake paper/leather/tape skeuomorphism;
- every label in mono uppercase;
- hidden frequent actions;
- decorative icon tiles.

## Prototype boundary

Allowed in this pass:

- rewrite `index.html` composition while preserving required IDs/hooks;
- replace main visual CSS with a new clean-sheet stylesheet;
- simplify `theme.js` to theme behavior rather than runtime visual composition;
- retain existing functional JS modules and data model;
- reuse specialist behavioral CSS only where necessary for existing task-detail/link/workspace modules.

Not part of this pass:

- storage/data migration;
- sync redesign;
- new product features;
- task model changes;
- deleting existing behavior modules;
- production release beyond the tester repository.

## Review bar

The prototype should fail review if:

- it still reads as a generic productivity dashboard;
- `NOW` does not dominate `NEXT`;
- project switching is hard to understand;
- color roles are arbitrary or inaccessible;
- typography roles blur together;
- narrow/mobile layout merely shrinks desktop geometry;
- existing task/capture/project/history flows become unavailable;
- important state becomes color-only.
