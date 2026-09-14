# Ledger V4 — Final Incumbent-Resemblance Audit

- Record role: `EVIDENCE / REVIEW`
- Status: `CLEAN SHEET PASSED`
- Lifecycle: `ACTIVE`
- Mode: `C / CLEAN SHEET`
- Target implementation: `v4/chronicle.html` + `v4/chronicle*.js` + `v4/chronicle.css`
- Incumbent compared: live V3.1 at `c43b990b3214be8d96551469d957dcb62c05d736`
- Parent: [`LEDGER-V4-CLEAN-SHEET-SELECTION.md`](LEDGER-V4-CLEAN-SHEET-SELECTION.md)

## Question

Immediately before promotion, does the **rendered implementation** still qualify as a clean-sheet interface, or did implementation pressure collapse Chronicle back toward V3?

## Implemented difference scores

Scoring uses the AIDB clean-sheet protocol:

- `0` = substantially inherited
- `1` = meaningfully adapted
- `2` = materially re-conceived

| Dimension | V4 score | Evidence |
| --- | ---: | --- |
| A. Information architecture | **2** | V3 organized the project as Return Point → Now → Next → Context → Archive. V4 organizes it as Resume Checkpoint → material Chronicle → independent Next queue → compact project brief. Notes/journal/proof/work are event types rather than separate page regions. |
| B. Navigation model | **2** | V3 used a project spine on desktop and persistent four-action bottom dock on phone. V4 uses top project tabs on wide screens, a project switch surface on phone, and one floating Capture action rather than a bottom app dock. |
| C. Page/spatial composition | **2** | V3 was a left work column plus context column inside a persistent structural shell. V4 is a chronological spine paired with a narrow Next rail; the checkpoint is the dominant composition anchor. |
| D. Interaction placement/model | **2** | Resume/start/done actions live inside the checkpoint/queue relationship. Notes, journal, work and proof become chronology actions. Project switching and capture are represented differently on phone. |
| E. Component/surface grammar | **2** | Chronicle uses a timeline spine, dated material-event records, a shadow-offset checkpoint, compact queue rows and a single project brief. It does not reproduce V3's task-register/context-section grammar. |
| F. Typography hierarchy/voice | **2** | V3 used Newsreader + IBM Plex Sans/Mono. V4 deliberately uses Georgia/Times + Arial + Courier roles with different scale/composition behavior. |
| G. Color role system | **1** | Warm paper, red action, blue record, ochre note and green proof retain useful semantic lineage from AIDB/V3. Values and placement changed, but the role taxonomy is intentionally adapted rather than discarded. |
| H. Mobile/responsive representation | **2** | V3 primarily recomposed its sections vertically and retained a four-button persistent dock. V4 limits the Chronicle to four recent events, exposes Next separately, uses a project-switch control, and a single 66px Capture action. |

**Materially re-conceived:** `7 / 8` dimensions.  
**Total difference score:** `15 / 16`.

Mode-C gate: **PASS**.

## Skeptic question

> If the logo, colors, and fonts were removed, would a reasonable observer still say this is basically the old interface?

**Answer: No.**

The persistent sidebar/spine, Now/Next/Context/Archive page sequence, separate context stream, and mobile command dock are gone. The dominant object is now the checkpoint + chronological record relationship. Even stripped of branding, the layout and interaction hierarchy are materially different.

## Similarities intentionally retained

These are product/system continuity, not incumbent-layout inheritance:

- same durable Ledger state schema and storage key;
- same task/project/note/journal/work-history capabilities;
- same semantic color categories where they remain useful;
- standard buttons/dialogs/forms rather than novelty controls;
- existing GitHub auto-sync contract.

## Render / behavior evidence

The isolated V4 build was rendered in Chromium before promotion at desktop and 390px phone widths.

Observed:

- no horizontal overflow in primary desktop/mobile fixture;
- no JavaScript errors in the tested build;
- Capture opens and writes through the existing state model;
- task details open;
- project switching works on phone;
- mobile chronology is capped at four recent material events before `Open full history` so Next is not buried;
- mobile uses one large Capture control rather than reproducing the V3 dock.

The modular GitHub runtime is a source split of the same tested Chronicle script; the source files pass JavaScript syntax checks locally.

## Decision

`RESULT = CLEAN SHEET PASSED`

Chronicle may replace the tester root. The retained semantic-color lineage does not undermine clean-sheet classification because structure, navigation, composition, interaction placement, surface grammar, typography, and mobile representation were materially re-conceived.

If future implementation changes reintroduce the V3 structural shell or persistent mobile dock, rerun this audit rather than assuming V4 remains Mode C.
