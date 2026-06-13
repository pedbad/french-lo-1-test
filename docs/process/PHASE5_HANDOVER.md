# Phase 5 Handover — Scoring Exercises (HIGH RISK)

> **For a fresh Claude Code session.** Class → functional migration, Phase 5.
> Plan/checklist: [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).
> Phases 1–4 done + merged to `main`. This doc scopes Phase 5 (12 scoring components).
>
> **Phase 5 is the high-risk phase.** Every component grades the learner. A subtle
> state bug = wrong grades, silently. **One component per PR. Grade-verify in the
> browser BEFORE and AFTER each conversion.** Do not batch.

## Current state (verified)

- **Phases 1–4** merged to `main`: 12 leaf (PR #3), 26 content (PR #4), audio infra +
  `App.jsx` (PR #5, #6), 2 non-scoring exercises WordSpot + MemoryMatch (PR #7, `6d92367`).
- **Phase 5 progress: 8/12 done** — RadioQuiz (PR #8, `aec43a7`),
  SelectExercise (PR #9, `abc4abe`), InlineChoiceGroup (PR #10),
  LineMatch (PR #11, `4dc2382`), WordOrderExercise (PR #12, `a3033a5`),
  PhraseReorderExercise (PR #13), DraggableFillGaps (PR #14) and
  InlineTypedGapExercise (PR #15, `30f9654`) converted + squash-merged.
  Conversion notes in the migration tracker checkboxes.
- `main` clean + green: `yarn lint` 0 errors, `yarn test:run` 39/39.
- **8 class components remain** (`grep -rln "extends React" src/`):
  - **7 scoring exercises** = remaining Phase 5 scope (below).
  - **`src/debug/ExerciseShowcase.jsx`** — debug-only, NOT part of Phase 5 scoring
    scope. Convert opportunistically.
- `exercises/current-location/nasal-rhyme-exercise.jsx` is **already functional** —
  the migration doc previously listed it under `custom/` as pending; corrected.

## Phase 5 scope (12 targets — ONE PER PR)

Branch per component, e.g. `refactor/phase5-radioquiz` off `main`. Suggested order
**low → high grading complexity** (convert simple-scoring first to re-establish the
pattern, then the parse-heavy ones):

1. ~~`RadioQuiz/RadioQuiz.jsx`~~ — **DONE** (PR #8). Pattern reference for the rest:
   useReducer merge + lazy init, prev-config ref reset effect, direct callback calls.
2. ~~`SelectExercise/SelectExercise.jsx`~~ — **DONE** (PR #9). Adds to the pattern:
   function patches in the merge reducer for audio progress handlers; render-time
   `blanksMeta`/`nToSolve` refs.
3. ~~`InlineChoiceGroup/InlineChoiceGroup.jsx`~~ — **DONE** (PR #10). Same
   pattern as SelectExercise; dead `getCorrectCountFromValues` removed.
4. ~~`LineMatch/LineMatch.jsx`~~ — **DONE** (PR #11). match pairs (drag/line);
   refs + geometry. Adds to the pattern: reducer **bails out on null patches**
   (returns same state ref) to preserve `setState(prev => null)` no-ops for the
   viewport/connector measurements; `ResizeObserver` + rAF measurement in a
   StrictMode-safe mount effect; `componentDidUpdate` measure fall-through → a
   no-dep effect; recoil rAF animation triggered imperatively after dispatch.
5. ~~`WordOrderExercise/WordOrderExercise.jsx`~~ — **DONE** (PR #12). reorder;
   DnD + sequence check. Adds to the pattern: three `setState(updater, callback)`
   FLIP handlers (drop/reset/show-answer) → `pendingFlipRef` (`{ before, options }`)
   + a `useLayoutEffect` keyed on `userTokens`; `handleDrop` computes the swap
   from committed state so the pending FLIP is only stashed on a real reorder.
   NO `componentDidUpdate` → no config-reset effect (WordSpot-style exception).
6. ~~`PhraseReorderExercise/PhraseReorderExercise.jsx`~~ — **DONE** (PR #13).
   reorder phrase rows (HTML5 drag + touch-pointer + FLIP). `pendingFlipRef` +
   `useLayoutEffect` keyed on `lang2Items`; only `reset` + `autoSolve` stash a
   FLIP (drop/pointerUp reorder without it, matching the class). HAS
   `componentDidUpdate` config-reset → `prevConfigRef` compare effect (the
   WordOrder exception reversed). `getInitialLang2` / `swapById` hoisted to pure
   module helpers.
7. ~~`DraggableFillGaps/DraggableFillGapsRuntime.jsx`~~ — **DONE** (PR #14). DnD
   into gaps; imperative absolute-position pointer drag. Constructor → module
   `getInitialState`; instance fields (geometry cache, answer map, drag scratch,
   rAF/timeout ids) → refs; audio state as reducer function-patches;
   `componentDidUpdate` config-reset → `prevConfigRef` compare effect (geometry
   clear + re-measure only). Anonymous `touchmove` leak fixed in mount cleanup.
8. ~~`InlineTypedGapExercise/InlineTypedGapExercise.jsx`~~ — **DONE** (PR #15).
   typed gaps; scoring routes through `answerNormalize` + `exerciseParsing` +
   `exerciseDiff` (verified, no util work). Plain function; useReducer merge +
   lazy `getResetState`; render-derived `blanksMeta`/`nToSolve` mirrored to refs;
   `componentDidUpdate` config-reset → prev-config ref effect; audio handlers →
   reducer function-patches.
9. `TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx` — free text entry.
   **← NEXT** (VERIFY its scoring utils before converting.)
10. `ClozeTypingExercise/ClozeTypingExercise.jsx` — cloze typing.
11. `TypedTransformExercise/TypedTransformExercise.jsx` — typed transform.
12. `DictationExercise/DictationExercise.jsx` — audio dictation; audio-state heavy.

> Confirm count + order against `grep -rln "extends React" src/` at session start;
> some may already share the audio-state pattern that Phase 6 will hoist.

## Conversion recipe (carried from Phases 1–4 — apply every time)

Read the whole component first; list `this.state`, instance fields, lifecycle methods.

- **Scoring/parse logic**: confirm it routes through the shared utils
  (`src/utils/exerciseParsing.js`, `src/utils/answerNormalize.js`). If not, **extract
  to a util + unit-test FIRST** (test passes against OLD class code), THEN convert.
  This is the safety net for grade correctness.
- **State**: 3+ interdependent fields → `useReducer` (merge reducer:
  `(s, patch) => ({ ...s, ...patch })`). Lazy init (`useReducer(reducer, props, init)`)
  for anything computed once (shuffles, parsed blanks). Independent scalars → `useState`.
- **Instance fields that don't render** (`this.xRef`, `this.blanksMeta`, `this.nToSolve`,
  timers, `rowAudioRefs`) → `useRef`. For a `Map`: `const r = useRef(null); if (r.current === null) r.current = new Map();`
- **`componentDidMount` + `componentWillUnmount`** → one `useEffect(() => { …; return cleanup }, [])`.
  **StrictMode is ON** (`src/main.jsx`) — effects double-fire in dev; make setup +
  cleanup idempotent. Track timer ids in a ref, clear on unmount, guard deferred
  `setState`s with a `mountedRef` (see `MemoryMatchGame.jsx`).
- **`componentDidUpdate(prevProps)` config-reset** (8 exercises have this) → prefer a
  `key={config-id}` on the parent host for a clean remount over a reset `useEffect`.
  Document which you chose. **NOTE the WordSpot exception:** it had NO
  `componentDidUpdate`, so config never reset — don't add a reset where none existed.
  Check each component's actual behavior before assuming.
- **`setState(updater, callback)`** → move callback logic to a `useEffect` keyed on the
  changed state, OR (for post-DOM animation like FLIP) a `useLayoutEffect` + a
  `pendingRef` flag (proven in `MemoryMatchGame.handleShowAnswers`).
- **Handlers** → in-body `const`. `useCallback` ONLY when identity matters (memoized
  child / effect dep) — otherwise plain functions.
- **Render**: `this.props` destructure → params; `this.state` reads → hook values.
- **No `React` default import** — SWC automatic JSX runtime. Import named hooks only
  (`import { useReducer, useRef } from "react"`). Match `Card.jsx` / Phase 4 files.

## Gotchas (hard-won, Phases 1–4)

- **GateGuard fact-force** fires on first Bash of a session, first edit of each new
  file path, and doc edits. Present the requested facts + retry, or run with
  `ECC_GATEGUARD=off` / add `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS`.
- **`no-undef` is the blank-page safety net** — a `<Foo />` with no import compiles but
  throws at runtime. **`yarn lint` before every commit.**
- **Don't anchor edits on exact import strings** — `sort-imports` reorders named imports.
- **`eslint --fix` reindents** class-body → top-level dedent: `yarn eslint --fix <file>`.
- Pre-commit hooks run typography/color/a11y/SCSS/image guards — they passed clean in
  Phase 4; keep changes behavior-preserving and they stay green.

## Gates (every component, every PR)

1. `yarn lint` → 0 errors; `yarn test:run` → 39/39 (more if you added util tests).
2. **Grade-verify in browser** — dev server `french-dev` via `preview_start` (port
   **5174**). Find LOs: `grep -rl "<ComponentName>" src/lo-config/`. Navigate
   `?lo=<slug>` (URL normalizes to `/<slug>/`), expand accordions
   (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
   loop 5–8× for nested), then:
   - Submit a **correct** answer → confirms it grades as correct (score/✓ shows).
   - Submit a **wrong** answer → confirms it grades as wrong (✗ / no score).
   - Reset / show-answers / retry paths.
   - **Zero console errors.**
   Compare grading behavior against the OLD class on `main` if in doubt.
3. One commit (or one PR, tidy commits); PR to `main`; squash-merge (matches Phases 1–4).
   Update the Phase 5 checkbox in
   [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md) per component.

## After Phase 5

`ExerciseShowcase.jsx` (debug) is the last class. Then **Phase 6 — Consolidate** (the
payoff): extract `useExerciseAudio()` (shared `activeRowIndex` / `masterPlayState` /
`rowAudioStatus` / `rowProgress` + `handleMaster*` across 5+ callers — only possible
once these are functional), and replace the 8 config-reset `componentDidUpdate` blocks
with `key`-based remount.

## Cost note

Phase 5 is large (12 components). **One component per session** keeps context tight and
cost bounded — the App.jsx (Phase 3) and multi-component sessions ran high ($50+).
Don't try to convert several in one session.
