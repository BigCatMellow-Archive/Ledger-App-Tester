# Ledger V4 Typography Retrospective

Date: 2026-09-14

## Summary

Ledger V4 Chronicle successfully changed the product architecture, but the first typography pass exposed a readability failure: meaningful interface text had been allowed to fall into the 7–9px range. Switching the primary typeface to Inter made that compression easier to see rather than causing the underlying problem.

The first correction then exposed a second failure: raising text into the 10–11px range was still too conservative for this interface, and changing type size without revalidating the fixed timeline gutter made the Chronicle date/rule/dot geometry visibly drift apart.

This is a successful feedback loop only if both mistakes change future design behavior. The durable lessons are: **small is not hierarchy**, and **typography changes are layout changes**.

## Outcome classification

- Chronicle clean-sheet architecture: successful
- Inter typeface migration: useful/successful
- Original typography scale: failed readability objective
- First readability-floor correction: directionally correct but insufficient
- Timeline metadata geometry after type growth: regressed
- Mobile smallest-text verification: insufficient before live feedback
- Second corrective response: stronger and geometry-aware
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

4. A second live screenshot showed two remaining problems:
   - the 10–11px desktop floor was still visibly too small across supporting interface text;
   - the Chronicle timestamp column, vertical rule, and event dots no longer behaved as one coherent timeline after the type-size change.

5. `54f073ee85369ad63d9070b625fbdad681584757` — `Increase Chronicle type scale and repair timeline geometry`
   - Raised meaningful desktop metadata primarily into the 12–13px range.
   - Raised body/task copy to roughly 15–16px according to role.
   - Gave mobile metadata its own larger scale rather than inheriting desktop compression.
   - Widened the timestamp gutter.
   - Realigned the vertical timeline rule through checkpoint/event dot centers.
   - Moved Chronicle heading/more/empty offsets with the same gutter contract.
   - Added no-wrap/tabular-number handling for timeline timestamps.

## What actually failed

The problem was not simply "Inter is too small." The original Chronicle stylesheet had many intentional 7px, 8px, and 9px declarations. That scale was being used as a hierarchy mechanism. Inter's cleaner shapes exposed how fragile that decision already was.

The first correction also revealed a second class of mistake: typography was being treated as an isolated visual property. In Chronicle, timestamp size is coupled to a fixed-width grid column, dot coordinates, the vertical timeline rule, and the offset of adjacent content. Increasing text without adjusting that geometry moved one part of the system while leaving the rest behind.

A typeface or type-scale change changes perceived size, density, character width, x-height, rhythm, wrapping, and the amount of space required by metadata. Treating it as a cosmetic swap is therefore unsafe.

## Root causes

1. **Tiny type was used as hierarchy.** Secondary information was made physically difficult to read instead of merely less prominent.
2. **The first replacement floor was still optimized for compactness.** Moving from 7–9px to 10–11px solved the most extreme values without asking whether the result was actually comfortable at normal viewing distance.
3. **No semantic readability floor existed.** Individual selectors chose tiny literal values without a governing type-scale contract.
4. **Typeface/type-scale changes were treated as styling rather than layout.** The Inter migration and first enlargement did not automatically trigger a full geometry regression pass.
5. **Fixed metadata gutters were not coupled to their typography.** Timestamp width, rule position, dot position, and content offset had separate magic numbers.
6. **Mobile review focused on layout and touch size more than smallest meaningful text.** A large touch target can still be unusable if its label is too small to read.
7. **Rendered evidence came too late.** The code and design rationale looked internally consistent; the live screenshot made the real problems obvious.
8. **The current correction still lives partly in an override layer.** `v4/inter.css` repairs values originally declared in `v4/chronicle.css`, leaving duplicate truth that should eventually be consolidated into semantic type and timeline-layout tokens.

## Durable rules learned

- **Small is not hierarchy.**
- **Hierarchy should reduce prominence, not legibility.**
- **Typography changes are layout changes.**
- A typeface change invalidates prior type-scale assumptions until rendered evidence reconfirms them.
- Raising type size requires re-checking every fixed-width column, absolute-positioned marker, line, badge, and neighboring offset that depends on the old metrics.
- Fixed metadata geometry should be governed as a shared contract rather than independent magic numbers.
- Touch-target size and label legibility are independent checks.
- Meaningful text that requires squinting or zooming at normal viewing scale is a design failure, even if it is technically visible.
- Mobile typography is a designed scale, not a shrunken desktop scale.
- Use semantic type tiers/tokens instead of scattered literal 7/8/9px declarations.
- Prefer weight, contrast, spacing, grouping, position, tracking, and case before shrinking text below a comfortable reading size.
- Screenshots and real rendered views are evidence; design intent is not proof.
- A first correction can still be wrong. Re-review the rendered result rather than treating "improved" as "done."

## Current project guardrails learned from this incident

These are Ledger/AIDB design guardrails, not universal accessibility-law thresholds:

- meaningful desktop metadata: generally around 12–13px or larger for this product;
- meaningful mobile metadata: generally around 12.5–14px or larger for this product;
- body/task/action text: generally around 15–16px or larger according to role;
- mobile inputs/selects/textareas: 16px;
- fixed timeline metadata must remain on intended lines without collision or forced wrapping;
- timeline rule and markers must remain geometrically aligned after typography changes.

Numbers alone are not sufficient. Perceived size, contrast, font metrics, line-height, density, viewing distance, device width, wrapping, and neighboring geometry still require rendered inspection.

## Typography + geometry regression checklist

After any major change to font family, optical size, weight system, tracking, or primary scale, render and inspect at minimum:

- project navigation names and counts;
- sync/status text;
- project metadata;
- timestamps and date labels;
- event-type labels;
- task states;
- task titles and helper text;
- queue counts/actions;
- project-brief labels;
- buttons and utility actions;
- dialog labels/help text;
- form controls;
- error/recovery messages;
- fixed-width metadata columns;
- timeline rules, dots, badges, and absolute-positioned markers;
- wrapping/line breaks before and after each fixed gutter;
- alignment of headings/content whose offsets depend on those gutters.

Run that check on desktop and at representative 360–390px mobile widths. A screenshot should be reviewed at normal viewing scale, not only zoomed in.

## Remaining technical debt

The readability and geometry fixes currently live primarily in the Inter override layer while older microscopic declarations and timeline magic numbers remain in `v4/chronicle.css`. A future cleanup should create semantic type tokens plus shared timeline-gutter/marker variables and consolidate the effective values into one owner so the system does not rely on override order.

## Why this note exists

The goal of the tester is not to avoid mistakes. It is to make mistakes cheap, observable, and reusable. Recording the failed assumption, an insufficient first correction, the resulting geometry regression, and the second correction makes room for future design work to spend attention on new questions instead of rediscovering the same readability/layout coupling problem.
