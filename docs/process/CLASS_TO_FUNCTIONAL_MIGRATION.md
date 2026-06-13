# Class → Functional Component Migration

> **Status:** Phases 1–4 done (Phases 1–3 merged to `main`; Phase 4 on
> `refactor/phase4-nonscoring-exercises`). All leaf/presentational + content
> components, the audio infrastructure, the root `App.jsx`, and the two non-scoring
> exercises are now functional. **Phase 5 COMPLETE (11/11)** — all scoring wrappers
> functional. **Migration effectively complete** — the only remaining class is
> `ExerciseErrorBoundary` in `debug/ExerciseShowcase.jsx`, a React error boundary that
> intentionally stays a class (no functional equivalent; the showcase page itself is
> functional). Remaining work is Phase 6 (consolidate). (Phase 5 was originally 12 targets;
> `ClozeTypingExercise` was deleted as dead code (PR #17) rather than converted, so
> the live scope was 11, all done.) This is a standalone initiative, not part of
> the DRY pass that produced AudioManager, `parseSentence`, `answerNormalize`,
> `ExerciseFooter`, and `ResultIcon` (those were done earlier).

## Why

The codebase has **~57 class components**. Most remaining duplication and friction
traces back to them:

- **Config-reset boilerplate** — 8 exercises repeat a `componentDidUpdate(prevProps)`
  block that resets state when `config` changes. In function components this is a
  `key` prop on the parent (remount) or a small `useEffect` — written once, not 8×.
- **`useExerciseAudio()` is blocked** — the shared audio state + handlers
  (`activeRowIndex`, `masterPlayState`, `rowAudioStatus`, `rowProgress`, plus the
  `handleMaster*` handlers) live in `this.state` across 5+ exercises. A hook can only
  consolidate them once those components are functional.
- **Lifecycle scatter** — `componentDidMount` / `componentWillUnmount` pairs for
  listener setup/teardown are easy to get out of sync; `useEffect` cleanup co-locates them.
- **Testability** — logic trapped in class methods + `this.state` is harder to unit
  test than hooks/pure functions.

The project coding standard (`rules/react/coding-style.md`) already says:
> Class components are forbidden in new code. Convert legacy class components to
> function components when touching them for non-trivial changes.

This doc turns "when touching them" into a deliberate, ordered plan.

## Why NOT to rush it

- 57 components is large; a big-bang rewrite is high risk.
- Several are **scoring-critical** (SelectExercise, InlineChoiceGroup, InlineTypedGap,
  TextEntry, RadioQuiz, LineMatch) — a subtle state bug = wrong grades, silently.
- Class lifecycle → hooks is not mechanical: `setState` callbacks, `this.x` instance
  fields (refs, timers, `blanksMeta`, `nToSolve`), and `componentDidUpdate` guards all
  need careful translation.

**Strategy: incremental, leaf-first, test-backed. One component (or one tight cluster)
per PR. Never convert a scoring exercise without verifying grades before/after.**

---

## Hard-won gotchas (from the DRY pass — apply these every time)

1. **`no-undef` is the safety net.** A `<Foo />` with no import is valid *syntax*
   (esbuild/vite compile it) but throws at runtime → blank page. ESLint `no-undef`
   catches it. **Run `yarn lint` before every commit** — it caught this class of bug
   three times in the DRY pass.
2. **Don't anchor edits on exact import strings.** ESLint `sort-imports` reorders
   named imports (`{ a, b }` → `{ b, a }`) and multi-name imports vary. Script-based
   inserts that match a literal import line silently no-op when the order differs.
   Verify the import *line* exists after editing, not just the symbol.
3. **`vite`/`esbuild` parse-OK ≠ correct.** It does not check references or behaviour.
   Lint + tests + a real render are the gates.
4. **Test-first for any logic move.** Capture current behaviour in a test (it should
   pass against the OLD code), then refactor, then confirm still green. See
   `src/utils/exerciseParsing.test.js` and `src/utils/answerNormalize.test.js`.
5. **Scoring/visual code needs a human browser check.** Unit tests cover logic;
   they do not prove the exercise still grades and renders right. Spot-check the LO.

---

## Conversion checklist (per component)

For each class component:

- [ ] Read the whole component; list `this.state`, instance fields (`this.xRef`,
      `this.blanksMeta`, `this.nToSolve`, timers), and every lifecycle method.
- [ ] If it has scoring/parse logic, ensure it already routes through the shared utils
      (`exerciseParsing`, `answerNormalize`) — extract first if not.
- [ ] Convert state: each `this.state` field → `useState` (or `useReducer` if 3+
      interdependent fields, which most exercises have — prefer `useReducer`).
- [ ] Convert instance fields that don't trigger render → `useRef`
      (refs, timers, `blanksMeta`, `nToSolve`, `rowAudioRefs`).
- [ ] `componentDidMount` + `componentWillUnmount` → one `useEffect(() => { … return cleanup }, [])`.
- [ ] `componentDidUpdate(prevProps)` config-reset → prefer a `key={config-id}` on the
      parent (clean remount) over a reset `useEffect`. Document which approach per component.
- [ ] `setState(updater, callback)` → move the callback logic to a `useEffect` keyed on
      the changed state, or call it after the state-derived value is recomputed.
- [ ] Event handlers → `useCallback` ONLY where identity matters (memoized child / effect dep);
      otherwise plain functions (see `rules/react/hooks.md`).
- [ ] Replace `this.props` destructure in render with params; `this.state` reads with hook values.
- [ ] `yarn lint` clean (0 errors), `yarn test:run` green.
- [ ] **Browser-verify the LO(s) that use it** — render, interaction, and (if scoring) grading.
- [ ] Commit one component/cluster at a time with a clear message.

---

## Recommended order (low risk → high risk)

### Phase 1 — Leaf / presentational (safest, no scoring)
Pure display or simple-state; convert first to build confidence + patterns.

- [x] `IconButton/IconButton.jsx`
- [x] `Info/Info.jsx`
- [x] `Section/Section.jsx`
- [x] `Explanation/Explanation.jsx`
- [x] `Explanation/Panel/Panel.jsx`
- [x] `AudioClip/CircularAudioProgressAnimatedSpeakerDisplay.jsx`
- [x] `MemoryMatchGame/Card/Card.jsx`
- [x] `DraggableFillGaps/DraggableWordTile/DraggableWordTile.jsx`
- [x] ~~`TypedAnswerField/TypedAnswerField.jsx`~~ — converted earlier, then **deleted
      as dead code** (PR #19): its only mount was the runtime `useGlobalActions=false`
      branch, removed once `ClozeTypingExercise` was gone.
- [x] `layout/page-shell/Footer/Footer.jsx`
- [x] `layout/page-shell/MainMenu/MainMenu.jsx`
- [x] `debug/components/LearningObjectMenu.jsx`

### Phase 2 — Content components (LO grammar / pronunciation)
Mostly render config + audio links (`playAudioLink`). Repetitive but low-state.
Convert in batches by LO; verify each LO page renders.

- [x] `custom/grammar/*-grammar.jsx` (15 files)
- [x] `custom/pronunciation/*-pronunciation.jsx` (11 files)

> **Phase 2 done** (branch `refactor/phase2-content-components`): all 26 converted
> `PureComponent` → `memo(function …)`, behavior-preserving. 3 grammar files
> (`family-friends`, `free-time`, `phoning-in-france`) had stateless `handleRowClick`/
> `handleCardClick`/`handleCardKeyDown` class fields → moved to in-body `const`.
> No state/lifecycle existed. `eslint --fix` reindented bodies (class→top-level dedent).
> Gates: `yarn lint` 0 errors, `yarn test:run` 39 green, all 15 LO pages render clean
> (phoning-in-france map SVG + 113 audio links verified post-accordion-expand).
> One commit per LO batch.

### Phase 3 — Audio infrastructure (medium risk)
Already route through AudioManager; covered by `AudioManager.test.js`. Convert and
re-run the audio suite + manual playback check.

- [x] `AudioClip/AudioClip.jsx` (class hierarchy: AudioClip → CircularAudioProgress →
      CircularAudioProgressAnimatedSpeaker / LinkAudioProgress — converted the inheritance
      chain to composition + a `useAudioClip` hook)
- [x] `SequenceAudioController/SequenceAudioController.jsx`
- [x] `PhraseTable/PhraseTable.jsx`
- [x] `App.jsx` (root — converted last; routing/config-load/modal-link delegation/dark
      → effects + refs; render tree byte-identical)

> **Phase 3 done.** Targets 1–3 (AudioClip chain + `useAudioClip`, PhraseTable,
> SequenceAudioController) merged via PR #5 (squash `ade14ea`); root `App.jsx` merged
> via PR #6 (squash `12c0472`). Gates each step: `yarn lint` 0 errors, `yarn test:run`
> 39/39, all 15 LO routes browser-verified (routing, `?lo`, URL normalize, modal-link
> dialog, deep-link, dark + persistence, tabs, PhraseTable + audio). No class components
> remain in the audio infra or root — the 16 left are all Phase 4/5/6 exercises + debug.

### Phase 4 — Exercises WITHOUT scoring (medium risk)
- [x] `WordSpotExercise/WordSpotExercise.jsx` (reveal-only)
- [x] `MemoryMatchGame/MemoryMatchGame.jsx` (self-marking)

> **Phase 4 done** (branch `refactor/phase4-nonscoring-exercises`). Both
> `PureComponent` → function, behavior-preserving.
> **WordSpot:** config is read-only (no `componentDidUpdate` existed) so
> `id`/`items`/`cheatText`/`htmlContent` derive from props; only
> `complete`/`failCount`/`nPlaced` are `useState`. Render-time `this.nToSolve` →
> `useRef`, assigned during render. Handlers → in-body `const`.
> **MemoryMatch:** 8-field state → `useReducer` (merge reducer) with a lazy
> initializer so `getShuffledDeck` runs once per mount. `this.cardRefs` →
> `useRef(Map)`. Timers tracked in a ref + cleared on unmount via `useEffect`
> cleanup, with a `mountedRef` guard on the deferred `setState`s (StrictMode-safe).
> `setState(callback)` show-answers FLIP → `useLayoutEffect` keyed on `cards` via
> a `pendingFlipRef`. Methods → in-body `const`; pure `getSolvedCards` hoisted to
> module scope.
> Gates: `yarn lint` 0 errors, `yarn test:run` 39/39. Browser-verified:
> WordSpot (`first-contact`) click-to-spot + error + reset; MemoryMatch
> (`free-time`) flip → match → mismatch flip-back (1250ms) → show-answers (FLIP) →
> reset. Zero console errors.

### Phase 5 — Scoring exercises (HIGH risk — one per PR, browser-verify grades)
> **✅ COMPLETE — all 11 scoring exercises converted (PR #8–#21).** Scope was
> originally 12; `ClozeTypingExercise` was deleted (PR #17) rather than converted.
> The `nasal-rhyme` entry below was already functional. The only remaining class in the
> codebase is `ExerciseErrorBoundary` inside `debug/ExerciseShowcase.jsx` — a React
> error boundary (`getDerivedStateFromError`), which has no functional/hook equivalent
> and stays a class by design. **Not pending conversion.**
Each was grade-verified before/after. These share the config-reset + audio-state
patterns; converting them unlocks `useExerciseAudio()` (Phase 6).

- [x] `RadioQuiz/RadioQuiz.jsx` — useReducer merge + lazy init; config-reset via
      prev-config ref effect (key-remount deferred to Phase 6); `setState`
      callbacks → direct `onComplete`/`onReset` calls (no DOM dependency).
      Grade-verified in browser (LO13 daily-routine): correct ✓ / wrong ✗ +
      explanation / re-choose clears row result / reset / show-answers 12/12.
- [x] `SelectExercise/SelectExercise.jsx` — useReducer merge + lazy init
      (reducer also takes function patches for the audio progress handlers);
      config read from props, not spread into state; config-reset via
      prev-config ref effect (also clears `blanksMeta`/`nToSolve`/`rowAudioRefs`);
      `blanksMeta`/`nToSolve` rebuilt during render via refs (class parity);
      pure helpers hoisted to module scope. Grade-verified in browser
      (house-and-home rows+inline, making-arrangements inline-passage+seqAudio
      and rows-block+shuffle, daily-routine sampleSize): correct ✓ / wrong ✗ /
      re-choose clears row result / reset / show-answers — all match class
      baseline, zero console errors. PR #9.
- [x] `InlineChoiceGroup/InlineChoiceGroup.jsx` — useReducer merge + lazy init
      (function patches for choice edits / reset / row audio status / master
      audio progress); config read from props, not spread into state;
      config-reset via prev-config ref effect (also clears
      `blanksMeta`/`nToSolve`/`rowAudioRefs`); `blanksMeta`/`nToSolve` rebuilt
      during render via refs; `prepareExerciseItems` hoisted to module scope;
      dead `getCorrectCountFromValues` removed. Grade-verified in browser
      (family-friends ×3 instances incl. multi-blank rows, sampleSize +
      shuffleItems): correct ✓ / wrong ✗ / show-answers / reset re-samples /
      re-choose-after-check invalidates only edited blank / keyboard nav /
      row audio — all match class baseline, zero console errors. PR #10.
- [x] `InlineTypedGapExercise/InlineTypedGapExercise.jsx` — typed gaps. Plain
      function (caller renders uniformly `<Component config={value} />`, no
      unstable props, no memo). useReducer merge + lazy init (`getResetState`);
      `componentDidUpdate` config-reset → prev-config ref effect (full reset +
      clear `rowAudioRefs`); render-derived `blanksMeta`/`nToSolve` rebuilt each
      render + mirrored into refs for handlers (SelectExercise #9 pattern);
      `rowAudioRefs`/`sequenceRef` → refs; audio handlers → reducer
      function-patches; `React.Fragment` → named `Fragment`, no React default
      import. Scoring unchanged (`normalizeAnswer` / `parseSentence` +
      `parseInputBlank` / `highlightTextDiff`). Grade-verified in browser
      (inlineTypedGapExercise2): correct ✓ / wrong ✗ + diff / trailing-space
      tolerated, case+accents strict / edit-after-check clears that blank /
      reset / show-answers fills all + marks correct, zero console errors. PR #15.
- [x] `TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx` — shared
      typed-response **table** runtime; not registered directly, rendered via JSX
      by its wrappers. (At conversion there were three — `TypedTransformExercise`,
      `DictationExercise`, `ClozeTypingExercise`; Cloze was later removed (PR #17)
      and the now-dead `useGlobalActions=false` branch stripped (PR #18), leaving
      two live wrappers + a single graded-table path.) Plain function; useReducer merge
      (function-patch + null/undefined bail-out) + lazy `getResetState(config)`
      seeding `...config` + check fields; `componentDidUpdate` config-reset →
      prev-config ref effect (full reset, does **not** clear `audioTriggerRefs`,
      matching the class). `audioTriggerRefs` instance field → `useRef({})` —
      no audio state, no listeners, no timers, no render-time ref mirroring
      (handlers read `state.phrases` directly). `reducer`/`getResetState`/
      `extractExpectedAnswer` hoisted to module scope; `isAnswerCorrect` kept
      in-body (reads `comparisonOptions`). Scoring unchanged: strict = plain
      `trim()` compare; dictation routes through `normalizeForDictation`; diff
      via `highlightTextDiff` — no util work (field extraction ≠
      grade-normalization). Unused `IconButton` import dropped; named hook
      imports only. Grade-verified in browser (origins-and-languages): strict
      (typedTransformExercise3) correct ✓ / wrong ✗ + diff + nCorrect /
      edit-after-check clears that row's checkedResult, keeps diff; dictation
      (dictationExercise5) punctuation-insignificant ✓ / accent-strict ✗ /
      show-answers fills all 8/8 / reset clears, zero console errors. PR #16.
- [x] `LineMatch/LineMatch.jsx` — useReducer merge + lazy init
      (`getResetState`); reducer **bails out (returns same state ref) on a
      null/undefined patch** to preserve the class's `setState(prev => null)`
      no-op for the viewport + connector-layout measurements — without it the
      measure-after-every-render effect would loop forever. Config-reset via
      prev-config ref effect; instance fields → refs (`desktopStageRef`,
      `resizeObserver`, measure/recoil rAF ids, source/target node `Map`s);
      mount/unmount → one StrictMode-safe effect (resize listener +
      `ResizeObserver`); `componentDidUpdate` measure fall-through → no-dep
      effect (converges via the bail-out); recoil `setState(updater, callback)`
      → imperative `startRecoilAnimation` after dispatch; pure helpers hoisted
      to module scope; unused `IconButton` import dropped. Grading unchanged
      (identity match). Grade-verified in browser — desktop 1440px
      (connectors/refs/recoil): correct 6/6 + green connectors / wrong 0/6 +
      recoil animates then clears / show-answers / re-match steals target +
      invalidates both rows; mobile 375px (Select): all-correct 6/6 / flip one
      wrong 5/6 — zero console errors. PR #11.
- [x] `WordOrderExercise/WordOrderExercise.jsx` — useReducer merge + lazy
      init (`getInitialState`); reducer carries the LineMatch function-patch +
      null/undefined bail-out (returns same state ref). `this.cardRefs` Map →
      `useRef(null)` seeded to a `Map`. **No `componentDidMount/DidUpdate/
      WillUnmount`** → no config-reset effect added (WordSpot-style exception).
      FLIP: the three `setState(updater, callback)` handlers (drop, reset,
      show-answer) stash `{ before, options }` in a `pendingFlipRef` and
      dispatch; a `useLayoutEffect` keyed on `userTokens` reads it post-commit
      (pre-paint), calls `playFlipAnimation`, then clears it — the
      `MemoryMatchGame.jsx` pattern. `handleDrop` computes the swap from
      committed state so the pending FLIP is stashed only when `userTokens`
      actually changes (avoids a stale `before` on no-op drops). Scoring
      (sequence-equality, identity match) + render markup unchanged; no util
      extracted. Grade-verified in browser (`first-contact`, listeningOrder1/2):
      correct order 8/8 complete / wrong order 1/8 partial + `failedChecks`
      increments / reset reshuffles / show-answer snaps to expected — FLIP
      smooth, zero console errors. PR #12.
- [x] `PhraseReorderExercise/PhraseReorderExercise.jsx` — reorder phrase rows
      (HTML5 drag + touch-pointer reorder + FLIP). `useReducer` merge + lazy
      init (`getInitialState`); reducer carries the function-patch + null
      bail-out. `getInitialLang2` / `swapById` hoisted to pure module-scope
      helpers (used by lazy init, `reset`, `autoSolve`, and the config-reset
      effect). `this.cardRefs` Map → `useRef(null)` seeded to a `Map`;
      `this.pointerId` → `useRef`. FLIP: single `pendingFlipRef` +
      `useLayoutEffect` keyed on `lang2Items`; **only `reset` and `autoSolve`
      stash** a pending FLIP — `handleDrop`/`handlePointerUp` reorder without
      stashing so the effect bails (matches the class, no `setState` callback
      there). **HAS `componentDidUpdate` config-reset** (unlike WordOrder) →
      `prevConfigRef` compare effect (RadioQuiz/LineMatch pattern), re-seeds +
      clears on `config` identity change. Scoring (sequence-equality, identity
      match) + render markup unchanged; no util extracted; dropped never-wired
      dead `shuffleLang2`. Grade-verified in browser (`first-contact`,
      listeningOrder3, single-column): correct 4/4 complete / wrong 1/4 partial
      + `failCount` increments / 2 fails → Show answers / autoSolve snaps +
      FLIP (no leftover transforms) / reset reshuffles — zero console errors.
      PR #13.
- [x] `DraggableFillGaps/DraggableFillGapsRuntime.jsx` — **DONE** (functional).
      Heaviest Phase 5 file (1159 lines). Constructor + 4 `blanksType` branches →
      module `getInitialState(config)` lazy seed; `useReducer` merge reducer
      (function-patch + null bail-out) seeding `...config` + audio fields;
      `assignedCount` mirrors the `tileAssignments` ref. Non-render instance
      fields → refs (geometry cache, answer map, drag scratch, DOM refs, rAF +
      timeout ids). Audio state (`activeRowIndex`/`masterPlayState`/`rowProgress`
      via `SequenceAudioController`) as function-patches (SelectExercise-style).
      Mount effect cleans up BOTH listeners (the class's anonymous `touchmove`
      listener was never removed — latent leak fixed, still behaviour-preserving);
      StrictMode-safe via re-armed `mountedRef`. `componentDidUpdate` config-reset
      → `prevConfigRef` compare effect clearing geometry + re-measure only (does
      NOT reset answer state — matches class). Pointer drag stays imperative
      (DOM transforms + refs); positional `tileKey===targetKey` scoring unchanged
      (self-contained, no util extracted). Grade-verified in browser
      (`first-contact`, 3 phrases instances): correct drops → 5/5 complete /
      hint-mode wrong drop → rejected + invalid-drop hint / 2 fails → Show answer →
      autoSolve snaps tiles to targets + complete / reset returns tiles home +
      clears assignments / hints toggle — zero console errors. PR #14.
- [x] `DictationExercise/DictationExercise.jsx` — thin wrapper around the
      (now functional, single-path) runtime; trivial class→function swap.
      `React.PureComponent` + `render = () =>` → plain function spreading props to
      `TextEntryExerciseRuntime` (`audioClipClassName="super-compact-speaker"`,
      `audioColumnPosition="left"`, `comparisonOptions={{ comparisonMode: "dictation" }}`).
      No state/lifecycle/refs; React default import dropped; `TODO(component-split)`
      preserved. Grade-verified in browser (`origins-and-languages`,
      `#dictationExercise5`): correct answer **without trailing period** → `--edu-affirm`
      (dictation routes through `normalizeForDictation` — punctuation/quote-insensitive,
      accent-sensitive; distinct from TypedTransform's strict trim path) / wrong →
      `--destructive`; zero console errors. **Final Phase 5 wrapper → 11/11, Phase 5
      COMPLETE.** PR #21.
- [x] `TypedTransformExercise/TypedTransformExercise.jsx` — thin wrapper; trivial
      swap. `React.PureComponent` + `render = () =>` → plain function spreading
      props to `TextEntryExerciseRuntime` (fixed `audioClipClassName` /
      `audioColumnPosition`). No state/lifecycle/refs; React default import dropped.
      Grade behaviour lives in the functional runtime (PR #16) — grade-verified in
      browser (`origins-and-languages`, `#typedTransformExercise3`): exact correct →
      `--edu-affirm` / trailing-space correct → `--edu-affirm` (strict trims) / wrong
      → `--destructive`; zero console errors. PR #20.
- [x] ~~`ClozeTypingExercise/ClozeTypingExercise.jsx`~~ — **REMOVED** (PR #17),
      not converted: dead in production (zero LO configs). Was a thin wrapper.
- [x] `exercises/current-location/nasal-rhyme-exercise.jsx` — already functional
      (converted earlier; was wrongly listed under `custom/`). Not class-based.

### Phase 6 — Consolidate (the payoff)
Once exercises are functional:

- [x] **Extract `useExerciseAudio()`** — shared `activeRowIndex` / `masterPlayState` /
      `rowProgress` state + 4 `handleMaster*` handlers + pure patch-builders, with
      10 unit tests (PR #22). NOTE: `rowAudioStatus` (per-row click path) is a
      SEPARATE concern and intentionally stays in each caller, NOT in the hook.
  - Adoption (one caller per session, mechanical mirror of PR #22):
    - [x] `SelectExercise` (PR #22, `6c04514`).
    - [x] `InlineChoiceGroup` (PR #23, `94c6171`) — −50/+15; grade-verified
          (`family-friends`, `#inlineChoiceGroup2`): correct → `--edu-affirm`,
          wrong → `--destructive`, zero console errors. No production LO sets
          `useSequenceAudioController` for it, so the master path is exercised by
          the hook unit tests + the identical SelectExercise adoption.
    - [x] `DraggableFillGapsRuntime` (PR #24, `c7ffa70`) — −44/+14; had ONLY the
          3 master fields (NO `rowAudioStatus`), so the whole audio block moved to
          the hook cleanly. Grade-verified (`first-contact`, `#draggableFillGaps2`
          phrases): 3 rows + 3 speakers + SequenceAudioController render, row-speaker
          click drives the active-row highlight via the hook handlers, zero console
          errors. Note: the hook's `stoppedPatch` snaps the stopped row's progress
          bar to full on stop where the inline handler reset it to 0 — deliberate
          normalization to the shared behavior; cosmetic, grading unaffected.
    - [x] `InlineTypedGapExercise` — **DOES NOT FIT the hook; left as-is, no code
          change** (inspected, decision documented). Three divergences from the
          shared hook make adoption a behavior change, not a mechanical refactor:
          1. `handleMasterStopped` does a *conditional* clear
             (`activeRowIndex === rowIndex ? -1 : prev`) keyed on whether the
             stopped row is still active, and it neither writes `masterPlayState`
             nor snaps `rowProgress` to full — whereas the hook's `stoppedPatch`
             does all three unconditionally.
          2. `handleMasterTrackChange` no-ops when `rowIndex` is undefined; the
             hook falls back to `activeRowIndex: -1`.
          3. The master fields (`activeRowIndex`/`masterPlayState`/`rowProgress`)
             are reset *jointly* with the scoring/`values`/`rowAudioStatus` state
             in both `getResetState` and the manual `handleReset` (the Reset
             button). The hook only self-resets on config identity and exposes no
             manual reset, so adopting it would stop the Reset button from clearing
             the master-audio state. Forcing the hook here would regress the
             stopped-handler semantics and the Reset path; not worth it.
- [ ] Replace config-reset `componentDidUpdate` with `key`-based remount on the
      exercise host, deleting the 8 reset blocks (retire the hook's internal
      config reset at the same time).
- [ ] Extract any remaining shared exercise state (`useExerciseScoring`?) if a clean
      seam appears once components are hooks.

---

## Acceptance criteria

- [ ] No `extends React.Component` / `PureComponent` remain in `src/` (except where a
      class is genuinely required, e.g. an Error Boundary — document any exception).
- [ ] `yarn lint` clean, `yarn test:run` green throughout (no phase left red).
- [ ] Every scoring exercise grade-verified in-browser after its conversion.
- [ ] `useExerciseAudio()` extracted; config-reset duplication removed.
- [ ] No visual or behavioural regressions across the LO set (320/768/1024/1440 +
      light/dark per `rules/web/testing.md`).

## Effort estimate (rough)

| Phase | Components | Est. |
|-------|-----------|------|
| 1 Leaf/presentational | 12 | 0.5–1 day |
| 2 Content (grammar/pron) | 26 | 1–2 days (batched, repetitive) |
| 3 Audio infra | 4 | 1 day (AudioClip hierarchy is fiddly) |
| 4 Non-scoring exercises | 2 | 0.5 day ✓ |
| 5 Scoring exercises | 12 | 3–5 days (one-per-PR + grade verify) |
| 6 Consolidate (hook + key reset) | — | 1 day |
| **Total** | **~57** | **7–10 days** |

Best done incrementally across many sessions, not in one pass. Each phase is
independently shippable and leaves the app green.
