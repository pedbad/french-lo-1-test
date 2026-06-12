# Phase 4 Handover — Non-Scoring Exercises

> **For a fresh Claude Code session.** Class → functional migration, Phase 4.
> Plan/checklist: [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).
> Phases 1–3 done + merged to `main`. This doc scopes Phase 4 (2 components).

## Current state (verified)

- **Phase 1** (12 leaf/presentational) — merged, PR #3.
- **Phase 2** (26 grammar/pronunciation content components) — merged, PR #4 (`4324729`).
- **Phase 3** (AudioClip chain + `useAudioClip`, PhraseTable, SequenceAudioController,
  root `App.jsx`) — merged, PR #5 (`ade14ea`) + PR #6 (`12c0472`).
- `main` is clean and green: `yarn lint` 0 errors, `yarn test:run` 39/39 pass.
- **16 class components remain**: Phase 4 (2, below), Phase 5 (13 scoring),
  plus `src/debug/ExerciseShowcase.jsx` (debug, not in the original plan).

## Phase 4 scope (2 targets, medium risk, NO scoring)

Branch `refactor/phase4-nonscoring-exercises` off `main`.

### 1. `src/components/exercises/WordSpotExercise/WordSpotExercise.jsx` (268 lines)

`extends React.PureComponent`.

- `state = { ...props.config, failCount: 0 }` → `useState`. Config is spread into
  state once at construct; there is **no `componentDidUpdate`**, so state never
  resets on config change today — preserve that. Prefer init-once
  `useState(() => ({ ...config, failCount: 0 }))`, OR derive config from props and
  keep only `failCount` in state — verify which reads mutate config-derived keys.
- **No lifecycle methods.**
- Instance field `this.nToSolve` is **assigned DURING render** (~line 213) and read
  by handlers (`autoSolve` etc.) — same pattern as App's render-time counter. Move
  to a `useRef`, assign during render. Confirm every read site.
- Class-field handlers → in-body `const`: `autoSolve`, `handlePartWordClick`,
  `handlePartWordError`, `handleReset`.
- Renders `<AudioClip className="super-compact-speaker" soundFile=… />` (Phase 3,
  already functional — keep the wiring).

### 2. `src/components/exercises/MemoryMatchGame/MemoryMatchGame.jsx` (280 lines)

`extends React.PureComponent`.

- `state` (8+ fields) = `{ ...config, beenFlipped: [], cards: getShuffledDeck(cards,
  nPairsToPlay), flipped: [], matched: [], nPairs: 0, nTries: 0, +timeReport set
  later }` → `useReducer` (merge reducer; ≥3 interdependent fields — the plan prefers
  `useReducer`). **`getShuffledDeck` must run ONCE** (lazy initializer), not every render.
- Instance `this.cardRefs = new Map()` → `useRef(new Map())`.
- **TIMERS:** `handleClick` fires `setTimeout(finishUp, 2000)` (Chrome `onended`
  fallback) + `setTimeout(flip-back, memoryCardTransitionTime)`, both call `setState`
  after delay. Guard against unmount: track timer ids in a ref + clear on unmount
  (`useEffect` cleanup), or a `mountedRef` guard. `AudioManager.play(…, { onEnded:
  finishUp })` — `finishUp` must be unmount-safe too.
- Methods → in-body `const`: `setCardRef`, `getSolvedCards`, `handleClick`,
  `handleReset`, `handleShowAnswers`.
- Self-marking game (no grade) but verify flip → match → win + timer fallback work.

## Gotchas (carried from Phase 1–3)

- **GateGuard fact-force** fires on first Bash of a fresh session, first edit of each
  new file path, and doc edits. Present the requested facts + retry, or run with
  `ECC_GATEGUARD=off`.
- **StrictMode is ON** (`src/main.jsx`) → effects double-fire in dev; make timer
  cleanup + any mount effect idempotent.
- `no-undef` is the missing-import safety net (blank-page bug). Lint before commit.
- Don't anchor edits on exact import strings — `sort-imports` reorders named imports.
- `eslint --fix` reindents class-body → top-level dedent: `yarn eslint --fix <file>`.

## Gates (every step)

- `yarn lint` → 0 errors; `yarn test:run` → 39/39.
- Browser: dev server `dev` via `preview_start` (port **5174**). Find the LOs that
  use each: `grep -rl "WordSpotExercise\|MemoryMatchGame" src/lo-config/`. Expand the
  accordion, then verify: WordSpot click-to-spot + reset + audio; MemoryMatch
  flip/match/win + timer fallback + reset + show-answers. **Zero console errors.**
- One commit per component (or one PR, two commits); PR to `main`; squash-merge
  (matches Phase 1/2/3). Update Phase 4 checkboxes in
  [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).

## After Phase 4

14 class components remain — Phase 5 (13 scoring exercises) + `ExerciseShowcase`
(debug). **Phase 5 is HIGH risk: one component per PR, grade-verify before/after each.**

## Cost note

Keep it focused — the App.jsx (Phase 3) session ran high.
