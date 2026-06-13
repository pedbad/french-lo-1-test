# Phase 6b Handover — Key-Based Remount (the last item)

> For a fresh Claude Code session. Class → functional migration, **Phase 6b**.
> Plan/checklist: [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md) (Phase 6 section).
> Prior session log: [`PHASE6_HANDOVER.md`](./PHASE6_HANDOVER.md) (SESSION UPDATE block at top).

Continue the class→functional migration in `/Users/ped/Sites/french/french-lo-1-test`
(branch: `main`).

**ONE ITEM LEFT: Phase 6b — key-based remount.** Riskiest item (touches the host
`App.jsx` + 8 exercise components + the hook). Budget context for it; do nothing else.

**READ FIRST:** `CLASS_TO_FUNCTIONAL_MIGRATION.md` (Phase 6 section + the item-3 notes)
and `PHASE6_HANDOVER.md` (SESSION UPDATE block). Then: `git pull --ff-only`.

## State

`main` green at `a830bd8` — build clean, lint 0 errors, `test:run` 49/49, clean tree.
Class→functional conversion is COMPLETE (sole remaining class = `ExerciseErrorBoundary`,
an error boundary that stays a class by design). **Phase 6a DONE:** `useExerciseAudio()`
adopted in SelectExercise (#22), InlineChoiceGroup (#23), DraggableFillGaps (#24);
InlineTypedGap inspected — does NOT fit, left as-is. Only Phase 6b remains.

## The task

Replace the per-component config-reset effects with a key-based remount on the exercise
host, then delete the now-dead reset code.

### The trap (already diagnosed — do NOT skip)

A plain `key={config-id}` will NOT work. `App.jsx` `loadConfig` (~line 599) sets a FRESH
`config` object together with `currentLearningObject`. Reloading the SAME LO (language
toggle / settings change / re-nav) makes a new config object but keeps
`currentLearningObject` — so `compoundID` (`` `LO${currentLearningObject}-${id}` ``) is
UNCHANGED. The 8 `prevConfigRef` effects fire on that same-LO reload (config object
identity changed). A key built only from `compoundID` would NOT change on same-LO reload
→ no remount → stale answers/shuffles persist = **SILENT GRADE REGRESSION**.

### The fix

Add a config-generation counter to App state, bump it on every `loadConfig` setState,
and weave it into the `key` on `<RegisteredExercise>` at BOTH mount sites:

- `App.jsx` ~877 (tab path, bare): `` key={`${id}-${configGen}`} ``
- `App.jsx` ~961 (accordion path): `` key={`${compoundID}-${configGen}`} ``

`configGen` changes on every config load (same OR different LO) — exactly matching the
old effect trigger (config identity change). **Note** `App.jsx` already has an UNRELATED
`prevConfigRef` at ~398 (deep-link effect, falsy→truthy) — **DO NOT touch that one.**

### Then delete the per-component reset blocks

The `prevConfigRef` `useRef` + the reset `useEffect` in all 8:

- RadioQuiz, SelectExercise, PhraseReorderExercise, LineMatch,
  DraggableFillGapsRuntime, TextEntryExerciseRuntime, InlineChoiceGroup,
  InlineTypedGapExercise.

AND retire `useExerciseAudio`'s internal config-identity reset
(`src/hooks/useExerciseAudio.js` ~lines 85-91, the `prevConfigRef`/`useEffect` block) —
key-remount makes it redundant. Remove the now-unused `useRef` import if it leaves one
(no-undef / lint).

### Effect-body facts (verified)

7/8 effects do a FULL reset (`dispatch getResetState/getInitialState`) == exactly what
remount gives. The 8th, DraggableFillGaps, is PARTIAL (clears geometry cache +
re-measures only, no state reset) — a full remount is a clean superset (correct on a
real config change). LineMatch's effect also calls `stopRecoilAnimation()` + seeds
`isDesktopViewport` — a remount re-runs mount setup, so confirm its
ResizeObserver/connector measurement still fires on fresh mount.

### WordSpot / MemoryMatch exception

Neither is in the 8 (no reset effect — never reset on config change). Adding the generic
key to `<RegisteredExercise>` applies to them too, but it's SAFE: the key only changes
when a config actually loads (same as a real LO nav, which already remounts them via the
`AccordionArticle` key). It never forces a remount they wouldn't already get. Confirm no
behavior change.

## Gates (the PR)

1. `yarn eslint --fix` the touched files; `yarn lint` → 0 errors; `yarn test:run` →
   49/49; `yarn build` clean (authoritative over dev console).
2. **Browser grade-verify** via `preview_start` (`french-dev`, port **5174**).
   - ⚠️ RESTART preview (`preview_stop` → `preview_start`) at session start — the
     long-lived server holds stale HMR ghosts (you WILL see false vite-reload errors
     mid-edit; restart clears them).
   - **THE CRITICAL TEST:** load an LO, answer/interact with a scoring exercise, then
     trigger a SAME-LO config reload (language toggle, or whatever re-runs `loadConfig`
     with the same LO) and CONFIRM the exercise state resets to fresh.
   - Spot-check a few scoring exercises grade correctly after (correct = `--edu-affirm`
     `oklch(0.6 0.118 184.704)`, wrong = `--destructive` `oklch(0.577 0.245 27.325)`).
   - Zero console errors on a fresh server.
   - Find LOs: `grep -rl "<Component>" src/lo-config/`. Navigate
     `location.href='/?lo=<slug>'`, expand accordions
     (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
     loop ~8× w/ ~350ms waits). Scope every `preview_eval` to the exercise root by id.
     NOTE: `shuffleItems:true` configs reshuffle on reset — capture state AFTER reset.
3. Branch: `refactor/phase6b-key-remount`. Commit + PR to `main`, squash-merge
   (`gh pr merge N --squash --delete-branch`). Update the Phase 6b checkbox + acceptance
   criteria in `CLASS_TO_FUNCTIONAL_MIGRATION.md`, and the SESSION UPDATE block in
   `PHASE6_HANDOVER.md` (mark 6b done → **Phase 6 COMPLETE**).

## Gotchas (carried)

- **GateGuard fact-force** fires on first Bash + first edit of each new file path + doc
  edits. Present the requested facts + retry, or run with `ECC_GATEGUARD=off` / add
  `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS`.
- **`no-undef` = blank-page safety net** — a `<Foo />` with no import compiles but throws
  at runtime. `yarn lint` before commit.
- **`sort-imports` reorders named imports + `eslint --fix` reindents** — don't anchor
  edits on exact import strings.
- **StrictMode ON** — effects double-fire in dev; mount setup/cleanup must stay
  idempotent (matters for the LineMatch / DraggableFillGaps mount measurements after
  remount).

## Cost

Prior batched session hit ~$92. This is one focused item — keep it to 6b only.

## Parked

LC base template brainstorm — `docs/process/FUTURE_PROJECTS.md`. Resume after Phase 6
fully done.
