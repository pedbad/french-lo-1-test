# Phase 6 Handover — Consolidate

> For a fresh Claude Code session. Class → functional migration, **Phase 6**.
> Plan/checklist: [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).
> Phase 5 (recipe/gotchas/gates, still applies): [`PHASE5_HANDOVER.md`](./PHASE5_HANDOVER.md).

Continue the class→functional migration (branch: `main`).

> **SESSION UPDATE (2026-06-14):** ALL ITEMS DONE — **Phase 6 COMPLETE.** Item 3
> (Phase 6b key-remount) shipped in PR #26; items 1, 2, 4 landed earlier. Recap:
> - **1.** `DraggableFillGapsRuntime` adopted `useExerciseAudio()` — PR #24 (`c7ffa70`).
> - **2.** `InlineTypedGapExercise` — inspected, **does NOT fit** the hook (conditional
>   `handleMasterStopped`, no-op `handleMasterTrackChange`, joint reset with scoring
>   state). No code change; documented in the tracker.
> - **4.** Discovered a class the original `grep extends React` MISSED:
>   `CurrentLocationNasalRhymeExercise` (a `PureComponent`, bare import). Converted to
>   a function — PR #25 (`ab544c5`). `ExerciseErrorBoundary` is now genuinely the sole
>   remaining class; migration marked COMPLETE in the tracker (error-boundary exception).
> - **3. DONE (PR #26).** Added a monotonic `configGen` counter to App state
>   (`configGenRef`), bumped inside the single `loadConfig` setState (the one that
>   swaps the `config` object), woven into the `<RegisteredExercise>` key at both
>   sites (App.jsx ~881 tab `${id}-${configGen}`, ~961 accordion
>   `${compoundID}-${configGen}`). A plain `key={compoundID}` would NOT catch a
>   same-LO reload (config object swaps but `currentLearningObject`/`compoundID`
>   stays the same) — the counter changes on EVERY load, matching the old effect
>   trigger. Deleted the 8 `prevConfigRef` reset blocks and retired the hook's
>   internal reset (dropped its now-unused `config` param + the 3 call sites). 7/8
>   effects did a full reset (== remount); DraggableFillGaps was partial
>   geometry-only (remount is a clean superset). WordSpot/MemoryMatch had no reset
>   effect — the generic key is safe (only changes when a config actually loads).
>   Gates green (lint 0 / test 49 / build clean). Browser: read the live React key
>   back as `LO13-selectExercise1-2` (configGen woven in, =2 after the StrictMode
>   dev double-load = one bump per loadConfig); SelectExercise grades
>   `--edu-affirm`/`--destructive` + Reset still clears; LineMatch mount measurement
>   still fires; zero console errors. NOTE: there is no user-facing same-LO reload
>   gesture in the app today (LO switches are full-page nav, nav links are in-page
>   scrolls) — the StrictMode dev double-load is the only runtime same-LO
>   config-identity change, which `configGen` handles; the counter also future-proofs
>   any later reload/settings/language feature.

**READ FIRST:** `PHASE5_HANDOVER.md` (recipe/gotchas/gates — still apply) +
`CLASS_TO_FUNCTIONAL_MIGRATION.md` (Phase 6 section). Then: `git pull --ff-only`.

## State (as of this handover)

main green at `98415d3` — build clean, lint 0 errors, `test:run` 49/49, clean tree.

**Phase 6a done:** `useExerciseAudio()` extracted (PR #22) + adopted in
`SelectExercise` (PR #22, `6c04514`) and `InlineChoiceGroup` (PR #23, `94c6171`).
The hook owns master-player audio (`activeRowIndex` / `masterPlayState` /
`rowProgress` + 4 `handleMaster*` handlers + pure patch-builders
`trackChangePatch`/`timePatch`/`stoppedPatch`; 10 unit tests in
`src/hooks/useExerciseAudio.test.js`). It self-resets on config identity.

**`rowAudioStatus` (per-row click path) is a SEPARATE concern — stays in each
caller, NOT in the hook.**

## This session — all 4 remaining items (batched, user opted in)

NOT one-per-session this time. Order below; each its own commit + PR +
squash-merge (except item 2/4 may be doc-only).

### 1. `DraggableFillGapsRuntime.jsx` — adopt `useExerciseAudio()`

- Has ONLY the 3 master fields (NO `rowAudioStatus`). Mirror PR #23: import the
  hook, drop `activeRowIndex`/`masterPlayState`/`rowProgress` from reset state +
  reducer destructure, delete its inline `handleMaster*` handlers, consume from
  `useExerciseAudio(config)`.
- READ the file first — its shape differs (imperative absolute-position pointer
  drag; constructor → module `getInitialState`; geometry/answer-map/drag-scratch
  refs; `componentDidUpdate` config-reset → `prevConfigRef` effect that also
  clears + re-measures geometry). Copy verbatim, don't assume.
- VERIFY the missing `rowAudioStatus` field doesn't break — it never read it.
- Branch: `refactor/phase6-draggablefillgaps`.

### 2. `InlineTypedGapExercise.jsx` — OUTLIER, inspect FIRST

- Per-row TOGGLE model (`activeRowIndex === rowIndex ? -1 : rowIndex`), NOT the
  master-player handler set. Likely does NOT fit this hook. Inspect, decide,
  **DOCUMENT** the decision in the Phase 6 section of the migration tracker — do
  NOT force the hook on it. "Doesn't fit, here's why" is a valid outcome (1 short
  para). Only branch + PR if there's an actual code change.

### 3. Phase 6b — key-based remount (the heavy item)

- Replace the config-reset `componentDidUpdate → prevConfigRef` effects
  (8 exercises) with `key={config-id}` remount on the exercise host (grep where
  exercise components get mounted from LO config — likely `App.jsx` or the
  exercise renderer).
- Delete the per-component reset blocks (`prevConfigRef` + reset `useEffect`).
- Retire `useExerciseAudio`'s internal config-identity reset (the
  `prevConfigRef`/`useEffect` block in `src/hooks/useExerciseAudio.js`, ~lines
  85–91) at the same time — key-remount makes it redundant.
- **WordSpot exception:** it had NO `componentDidUpdate`, never reset — don't add
  a key where config never reset if it changes behavior. Check each component.
- Riskiest item (touches host + 8 components). Grade-verify a sample of scoring
  exercises after.
- Branch: `refactor/phase6b-key-remount`.

### 4. `ExerciseShowcase.jsx` — LAST CLASS (debug, opportunistic, doc-only)

- `grep -rln "extends React" src/` = only hit: `ExerciseErrorBoundary` (React
  error boundary, `getDerivedStateFromError`). Error boundaries have NO
  functional/hook equivalent — it MUST stay a class. **NOT a conversion task.**
- Confirm it's the sole remaining class, confirm the showcase page itself is
  already functional, and update the migration tracker acceptance criteria to
  mark class-migration **COMPLETE** with this documented exception. Doc-only.

## Gates (every PR)

1. `yarn eslint --fix <files>`; `yarn lint` → 0 errors; `yarn test:run` → 49/49
   (more if util tests added); `yarn build` clean (authoritative over dev console).
2. **Browser grade-verify** via `preview_start` (`french-dev`, port **5174**).
   - ⚠️ RESTART preview (`preview_stop` → `preview_start`) at session start — the
     long-lived server holds stale HMR ghosts.
   - Find LOs: `grep -rl "<Component>" src/lo-config/`. Navigate
     `location.href='/?lo=<slug>'`, expand accordions
     (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
     loop ~8× w/ ~350ms waits). Scope every `preview_eval` to the exercise root by id.
   - Grade colors: correct = `--edu-affirm` (`oklch(0.6 0.118 184.704)`), wrong =
     `--destructive` (`oklch(0.577 0.245 27.325)`). Zero console errors.
   - NOTE: configs with `shuffleItems:true` reshuffle on Reset — capture winners
     AFTER reset, or set all groups to one option index and check for a mix of
     affirm/destructive borders.
3. PR to `main`; squash-merge (`gh pr merge N --squash --delete-branch`). Update
   the Phase 6 checkboxes in `CLASS_TO_FUNCTIONAL_MIGRATION.md` per item.

## Gotchas (carried from Phase 5)

- **GateGuard fact-force** fires on first Bash, first edit of each new file path,
  and doc edits. Present the requested facts + retry, or run with
  `ECC_GATEGUARD=off` / add `pre:edit-write:gateguard-fact-force` to
  `ECC_DISABLED_HOOKS`.
- **`no-undef` = blank-page safety net** — a `<Foo />` with no import compiles but
  throws at runtime. `yarn lint` before every commit.
- **Don't anchor edits on exact import strings** — `sort-imports` reorders them;
  `eslint --fix` also reindents.
- **StrictMode is ON** — effects double-fire in dev; keep setup/cleanup idempotent.
- `yarn build` is authoritative over the dev console. Do NOT delete `dist/` —
  wrong layer, doesn't help.

## Cost

4 items in one session = higher burn (prior single-caller sessions hit $50–80).
Item 3 (key-remount) is the heavy one — budget context for it. If running low,
ship 1 + 2 + 4 (mechanical/doc) and leave 3 for its own session.

## Parked

LC base template brainstorm — `docs/process/FUTURE_PROJECTS.md`. Resume after Phase 6.
