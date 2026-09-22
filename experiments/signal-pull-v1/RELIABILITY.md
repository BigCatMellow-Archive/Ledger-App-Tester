# Signal + Pull V1 — Reliability Hardening

- Date: 2026-09-22
- State: TESTER RELIABILITY CONTRACT HARDENED / EXTERNAL RECOVERY GAP EXPLICIT
- Parent result: [RESULT.md](RESULT.md)
- Scope: local-state integrity, snapshot recovery, quiet-work integrity, and external-recovery decision

## Why this phase exists

Signal + Pull is more dependent on reliability than a normal task list.

If the product succeeds, the user will stop mentally maintaining quiet commitments. That means silent data loss, missed resurfacing, or fake “synced” confidence becomes more damaging—not less.

The reliability contract therefore distinguishes:

```text
LOCAL SAVE
is this browser's current state durable here?

EXTERNAL SNAPSHOT
did a copy reach somewhere else?

RESTORE
can a clean/new browser reconstruct current state?

MULTI-DEVICE CONCURRENCY
can two writers avoid silently overwriting each other?

RESURFACING INTEGRITY
can unfinished quiet work disappear without a wake/disposition path?
```

These are not interchangeable.

## Defect found

The initial Signal + Pull prototype used:

```js
try {
  return JSON.parse(localStorage...)
} catch {
  return seedState()
}
```

That is unacceptable for cognitive offloading.

A corrupted local record could be silently replaced by the synthetic/default state, after which a normal save could overwrite the only remaining local evidence.

## Correction

Unreadable local state now:

1. preserves the exact raw browser record;
2. blocks normal editing;
3. exposes the parse/structure error;
4. offers **Download raw backup**;
5. offers import of a known-good snapshot;
6. allows explicit fixture reset only as a deliberate user action.

It never silently converts corruption into an empty/default working state.

## Snapshot contract

A new `state-io.js` module owns:

- snapshot version;
- structural validation;
- duplicate-ID rejection;
- commitment normalization;
- date normalization;
- deterministic serialization;
- validated parsing.

Import validates **before** replacing current state.

Export uses the same validated serializer used by persistence.

## Reliability surface

The prototype now exposes a dedicated Reliability view with separate truth for:

- local browser state;
- external recovery;
- quiet-work integrity;
- snapshot format/version;
- export;
- import;
- explicit fixture reset.

The default synthetic state correctly reports:

```text
local: saved
external: not configured
```

It does not claim that an external restore path exists.

## Reproducible checks

### Snapshot IO

`node state-io.test.js`

Covers:

- valid snapshot parsing;
- invalid JSON rejection;
- missing commitments rejection;
- duplicate commitment-ID rejection;
- serialize/parse round trip;
- invalid date normalization.

Result on the exact branch source:

```text
6 / 6 PASS
```

### App reliability contract

`node reliability-contract.test.js`

This test reads the actual committed `app.js` and exercises its startup/import logic with controlled storage.

Covers:

- empty storage seeds without writing over anything;
- valid snapshot loads;
- corrupt snapshot blocks and preserves exact raw data;
- corrupt startup performs no replacement write;
- browser storage read failure degrades visibly to memory-only state;
- valid import replaces state only after validation and persists it;
- invalid import leaves current state untouched;
- export/persistence use the validated serializer;
- corrupt startup never opens the normal Signal surface.

Result on the exact branch source:

```text
8 / 8 PASS
```

### Regression safeguard

`.github/workflows/test-signal-pull-reliability.yml` runs on Signal + Pull changes and performs:

- JavaScript syntax checks;
- snapshot IO tests;
- corruption/import contract tests.

## Current Ledger GitHub sync decision

The current production Ledger documentation was rechecked on 2026-09-22.

Its GitHub path is explicitly **one-way**:

```text
browser Ledger
     ↓
GitHub ledger.json snapshot
```

A clean/new browser does not automatically pull that snapshot. Two browser states are not merged, and a later writer can replace the remote snapshot.

### Verdict

**One-way GitHub snapshot is useful backup evidence, but it is not sufficient for the trust level implied by “safe to forget.”**

It does not currently prove:

- clean-browser restore;
- cross-device continuity;
- stale-writer protection;
- conflict detection;
- authoritative latest-state recovery.

## Minimum external recovery architecture worth testing later

Do not jump directly to general multi-device merge/CRDT complexity.

A smaller safe model is:

```text
REMOTE SNAPSHOT LINEAGE
snapshot version
revision / remote SHA
writtenAt
device/browser identity
        ↓
PULL / RESTORE
new browser can reconstruct state
        ↓
COMPARE BEFORE PUSH
remote revision must equal the writer's last-known revision
        ↓
CONFLICT
if remote changed, stop and ask for explicit resolution
```

Required properties:

1. **Restore exists.** A clean browser can fetch and validate a remote snapshot.
2. **Remote revision is explicit.** Each local writer knows which remote version it last saw.
3. **No silent last-write-wins.** If another device changed remote state, pushing stops with a conflict.
4. **Conflict is preserved.** Neither local nor remote state is destroyed merely to resolve the disagreement.
5. **Snapshot validation precedes restore.** Corrupt/unknown remote data cannot silently become canonical.
6. **Git history may remain backup history**, but repository history is not itself the synchronization protocol.
7. **Single-writer/single-lineage is acceptable initially.** Full field-level multi-device merging should be justified by real need, not built preemptively.

This is deliberately smaller than a full collaborative database and materially safer than the existing one-way push model.

## Quiet-work integrity

The existing Holdings guard remains part of the reliability contract:

> unfinished quiet work with no review date, parked-until date, dependency, or explicit disposition is a system defect.

The Reliability surface exposes the defect count separately from ordinary signals.

## Residual limits

Tester reliability is now materially stronger, but the following are not proven:

- browser file-download UI on every target platform;
- real GitHub pull/restore;
- stale-writer conflict UX;
- notification delivery;
- automatic observation of external events;
- long-term maintenance burden with real personal data.

Therefore the product should still **not** claim universal “safe to forget” durability.

## Phase decision

Local-state integrity and recoverability are strong enough to continue product experimentation.

External recovery remains a named production-level dependency, with a bounded architecture direction instead of a hidden assumption.
