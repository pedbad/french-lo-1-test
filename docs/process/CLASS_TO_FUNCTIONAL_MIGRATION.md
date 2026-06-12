# Class → Functional Component Migration

> **Status:** Phases 1–4 done (Phases 1–3 merged to `main`; Phase 4 on
> `refactor/phase4-nonscoring-exercises`). All leaf/presentational + content
> components, the audio infrastructure, the root `App.jsx`, and the two non-scoring
> exercises are now functional. **13 class components remain** — Phase 5 (12 scoring
> exercises) + `debug/ExerciseShowcase.jsx`, and Phase 6 (consolidate). This is a standalone initiative, not part of
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
- [x] `TypedAnswerField/TypedAnswerField.jsx`
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
> 12 class components left to convert (the `nasal-rhyme` entry below is already
> functional). `debug/ExerciseShowcase.jsx` is a 13th remaining class but is
> debug-only — convert opportunistically, not part of Phase 5 scoring scope.
Each must be grade-verified before/after. These share the config-reset + audio-state
patterns; converting them unlocks `useExerciseAudio()`.

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
- [ ] `InlineChoiceGroup/InlineChoiceGroup.jsx`
- [ ] `InlineTypedGapExercise/InlineTypedGapExercise.jsx`
- [ ] `TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx`
- [ ] `LineMatch/LineMatch.jsx`
- [ ] `WordOrderExercise/WordOrderExercise.jsx`
- [ ] `PhraseReorderExercise/PhraseReorderExercise.jsx`
- [ ] `DraggableFillGaps/DraggableFillGapsRuntime.jsx`
- [ ] `DictationExercise/DictationExercise.jsx`
- [ ] `ClozeTypingExercise/ClozeTypingExercise.jsx`
- [ ] `TypedTransformExercise/TypedTransformExercise.jsx`
- [x] `exercises/current-location/nasal-rhyme-exercise.jsx` — already functional
      (converted earlier; was wrongly listed under `custom/`). Not class-based.

### Phase 6 — Consolidate (the payoff)
Once exercises are functional:

- [ ] Extract `useExerciseAudio()` — shared `activeRowIndex` / `masterPlayState` /
      `rowAudioStatus` / `rowProgress` state + `handleMaster*` handlers (5+ callers).
- [ ] Replace config-reset `componentDidUpdate` with `key`-based remount on the
      exercise host, deleting the 8 reset blocks.
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
