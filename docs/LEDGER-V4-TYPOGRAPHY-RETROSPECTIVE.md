# Ledger V4 Typography Retrospective

Date: 2026-09-14

## Summary

Ledger V4 Chronicle successfully changed the product architecture, but the first typography pass exposed a readability failure: meaningful interface text had been allowed to fall into the 7–9px range. Switching the primary typeface to Inter made that compression easier to see rather than causing the underlying problem.

This is a successful feedback loop only if the mistake changes future design behavior. The durable lesson is: **small is not hierarchy**. Hierarchy should reduce prominence without reducing legibility.

## Outcome classification

- Chronicle clean-sheet architecture: successful
- Inter typeface migration: useful/successful
- Prior typography scale: failed readability objective
- Mobile smallest-text verification: insufficient before live feedback
- Corrective response: successful
- Process lesson: must be promoted into AIDB, not kept project-local

## Timeline and exact commits

1. `c7fd8ce219bcbc1d3294673c5a3766b83a5f089a` — `Load Inter typography layer in Chronicle`
   - Switched primary/display typography to Inter.
   - Kept monospace for metadata and record-oriented labels.
   - Preserved existing numeric type sizes.

2. Live visual feedback showed project-tab metadata, timestamps, event labels, queue states, utility labels, brief labels, and other supporting text were difficult to read, especially on mobile.

3. `784be8e7df7bb80426892ba045bdebd01cc470c4` — `Raise Chronicle typography readability floor`
   - Raised meaningful desktop metadata generally into the 10–11px+ range.
   - Raised meaningful mobile metadata generally into the 11–12px+ range.
   - Raised task/action/body text toward 14–16px where appropriate.
   - Set mobile form-control text to 16px.
   - Shifted hierarchy toward weight, spacing, case, position, and color rather than microscopic type.

## What actually failed

The problem was not simply "Inter is too small." The original Chronicle stylesheet had many intentional 7px, 8px, and 9px declarations. That scale was being used as a hierarchy mechanism. Inter's cleaner shapes exposed how fragile that decision already was.

A typeface change also changes perceived size, density, character width, x-height, rhythm, and line wrapping. Treating it as a cosmetic swap left the old scale assumptions unchallenged.

## Root causes

1. **Tiny type was used as hierarchy.** Secondary information was made physically difficult to read instead of merely less prominent.
2. **No semantic readability floor existed.** Individual selectors chose 7/8/9px values without a governing type-scale contract.
3. **Typeface change was treated as styling rather than layout.** The Inter migration did not automatically trigger a full typography regression pass.
4. **Mobile review focused on layout and touch size more than smallest meaningful text.** A large touch target can still be unusable if its label is too small to read.
5. **Rendered evidence came too late.** The code and design rationale looked internally consistent; the live screenshot made the real problem obvious.
6. **The current correction is partly an override layer.** `v4/inter.css` now repairs values originally declared in `v4/chronicle.css`, leaving duplicate truth that should eventually be consolidated into semantic type tokens.

## Durable rules learned

- **Small is not hierarchy.**
- **Hierarchy should reduce prominence, not legibility.**
- A typeface change invalidates prior type-scale assumptions until rendered evidence reconfirms them.
- Touch-target size and label legibility are independent checks.
- Meaningful text that requires squinting or zooming at normal phone scale is a design failure, even if it is technically visible.
- Mobile typography is a designed scale, not a shrunken desktop scale.
- Use semantic type tiers/tokens instead of scattered literal 7/8/9px declarations.
- Prefer weight, contrast, spacing, grouping, position, tracking, and case before shrinking text below a comfortable reading size.
- Screenshots and real rendered views are evidence; design intent is not proof.

## Current AIDB guardrails learned from this incident

These are project/design guardrails, not universal accessibility-law thresholds:

- meaningful desktop metadata: generally at least ~10–11px, preferably 11px+
- meaningful mobile metadata: generally at least ~11–12px
- body/task/action text: generally ~14–16px or larger according to role
- mobile inputs/selects/textareas: 16px

Numbers alone are not sufficient. Perceived size, contrast, font metrics, line-height, density, viewing distance, and device width still require rendered inspection.

## Typography regression checklist

After any major change to font family, optical size, weight system, tracking, or primary scale, render and inspect at minimum:

- project navigation names and counts
- sync/status text
- project metadata
- timestamps
- event-type labels
- task states
- task titles and helper text
- queue counts/actions
- project-brief labels
- buttons and utility actions
- dialog labels/help text
- form controls
- error/recovery messages

Run that check on desktop and at representative 360–390px mobile widths.

## Remaining technical debt

The readability fix currently lives primarily in the Inter override layer while older microscopic declarations remain in `v4/chronicle.css`. A future cleanup should create semantic type tokens and consolidate the effective values into one owner so the system does not rely on override order.

## Why this note exists

The goal of the tester is not to avoid mistakes. It is to make mistakes cheap, observable, and reusable. Recording the failed assumption and the correction makes room for future design work to spend attention on new questions instead of rediscovering the same readability problem.
