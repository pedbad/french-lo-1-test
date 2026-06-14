# App.jsx Refactor — Handover

> **Status:** analysis DONE (read-only). No code changed yet. Execute the PRs below
> smallest-risk-first, one PR each, each leaving `main` green.

## Task

Refactor `src/App.jsx` (1495 lines) for DRY + modularity. It mixes 4 concerns and
repeats the same render-wrapper block 5×. Goal: shrink under the 800-line rule and
remove duplication, behavior-preserving.

## State (verify with git — don't trust blindly)

- `main` green: `yarn lint` 0 errors (42 cosmetic warnings pre-existing),
  `yarn test:run` 49/49, `yarn build` clean. Tree should be clean on `main`.
- Class→functional migration COMPLETE (Phase 6 done). Last merged: PR #26
  "Phase 6b key-based remount" (squash `c8acec0`). Sole remaining class =
  `ExerciseErrorBoundary` (error boundary, by design).
- App.jsx already uses a `configGen` counter (App state) woven into the
  `<RegisteredExercise>` key at both mount sites (tab ~888, accordion ~972).
  **DO NOT remove or disturb it** — it is the Phase 6b remount mechanism.

## The analysis (targets)

### DRY offenders
1. `renderComponent` switch repeats the "`expandable ? AccordionArticle : Section`"
   block 5× with identical `config/id/key/target/title/titleHTML` props — Explanation
   (~979), PhraseTable (~1161), Group-non-tabs (~1026), Group-tabs (~1088, via IIFE),
   default/Custom (~1234). ~150 lines.
2. `GroupSectionComponent = heroSection ? HeroSection : Section` duplicated
   (~1043 + ~1105).
3. **DEAD no-op branch:** `switch(languageCode){ case "fr": …; default: … }` at ~913
   and ~1225 — both branches identical (`AllCustomComponentsFR[component]`).
   Migration-era cruft.

### Modularity (App.jsx mixes 4 concerns)
4. ~280 lines of PURE config helpers (lines ~59–336): `normaliseContentItems`,
   `normalizeInstructionSchemaNode`, `injectSharedExerciseDefaults`,
   `resolveLearningObjectParam`, `getLearningObjectPathParam`,
   `normalizeLearningObjectUrl`, `countAccordionsInComponent`, `splitDisplayTitle`,
   `normalizeSlug`, `hasNonEmptyInstructionValue`. No React → belongs in
   `src/lib/loConfig.js`, unit-testable.
5. `modalContentMap` (~434–493) — hardcoded LO-specific content (`Grammar1Body`,
   subject-pronouns, toilettes) embedded in root component. Belongs in a data module +
   a `useModalLinks` hook (the modal delegation effect ~770–812 +
   `findModalLinkContent` + `normalizeModalLinkAnchors` ride along).
6. `renderComponentForTab` (~868) duplicates the registry/Explanation/PhraseTable/custom
   dispatch from `renderComponent` — could be one renderer parameterized "wrapped vs bare".

### Migration leftovers
- #3 above is the real one.
- `prevConfigRef` (~401) still serves the first-load deep-link falsy→truthy trigger
  (different job from `configGen`) — leave it.
- `mountedRef` (~395) still needed (async setState / StrictMode guard) — leave it.

## Recommended PR order (one PR each)

1. **`src/lib/loConfig.js`** — mechanical move of the ~280 lines of pure helpers (#4)
   + unit tests (mirror `src/utils/*.test.js`, vitest). Near-zero render risk.
   **START HERE.**
2. **Kill the dead `languageCode` no-op switch** (#3). Trivial, pure simplification.
3. **`wrapInShell({ value, compoundID, targetId, expandable, semanticAs, children })`**
   helper to collapse the render switch (#1, #2). RENDER-CRITICAL → full browser verify
   across LOs + breakpoints after.
4. **Lift `modalContentMap` → data module + `useModalLinks`** (#5).

Items 3 and 4 are higher risk (touch every LO page / modal-link behavior) — do them
last, with browser verification.

## Gates (every PR)

- `yarn eslint --fix` touched files; `yarn lint` → 0 errors; `yarn test:run` → 49/49
  (+ any new); `yarn build` clean (authoritative over dev console).
- For render-affecting PRs (3, 4): restart preview (`preview_stop`→`preview_start`,
  `french-dev`, port 5174) at session start (long-lived server holds stale HMR ghosts).
  Browser-verify: `location.href='/?lo=<slug>'`, expand accordions
  (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
  loop ~8× w/ ~350ms waits), confirm LO pages render, exercises grade
  (correct = `--edu-affirm` `oklch(0.6 0.118 184.704)`, wrong = `--destructive`
  `oklch(0.577 0.245 27.325)`), zero console errors. Find LOs: `grep src/lo-config/`.
- Branch per item, commit + PR to main, squash-merge
  (`gh pr merge N --squash --delete-branch`). Next PR # is 27.

## Gotchas

- **GateGuard fact-force** fires on first Bash + first edit of EACH new file path +
  doc edits: present the 4 facts (importers / public API / data fields / instruction
  verbatim) then RETRY the same op. When 2 parallel edits hit a NEW file, one is
  blocked + one passes; retry the blocked one (path now cleared). Or run with
  `ECC_GATEGUARD=off` / add `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS`.
- **`no-undef`** is the blank-page safety net — `yarn lint` before every commit
  (catches a `<Foo/>` with a dropped import). ESLint `no-unused-vars` is ERROR (no
  `argsIgnorePattern`) so remove now-unused imports/params manually; `varsIgnorePattern`
  is `^[A-Z_]`.
- **`sort-imports` + `eslint --fix`** reindent/reorder — don't anchor edits on exact
  import strings; verify the import LINE after editing.
- **StrictMode ON** — mount effects double-fire in dev; keep setup/cleanup idempotent.
- **Pre-commit hooks** run typography/color/a11y/SCSS/image guards — pass on clean
  code, block on violations.

## Parked / optional (not this task)

- **`useExerciseScoring` extraction** (last Phase 6 checkbox in
  `CLASS_TO_FUNCTIONAL_MIGRATION.md`): EVALUATED, not implemented. Clean seam exists
  ONLY in the blank-grading family (6 of 9 scoring exercises: RadioQuiz, SelectExercise,
  InlineChoiceGroup, InlineTypedGap, TextEntry, LineMatch — all share
  `{ checkedResults, hasChecked, nCorrect }` + `Object.values(...).filter(Boolean).length`
  + edit-after-check invalidate). Correct form is a PURE utils module
  (`src/utils/exerciseScoring.js`: `INITIAL_SCORING_STATE`, `countCorrect`,
  `commitCheck`) NOT a stateful hook — the fields must stay in each exercise's single
  merge reducer for atomic check updates. Sequence family (WordOrder, PhraseReorder,
  DraggableFillGaps) does NOT fit. Marginal value (small shared surface, grade-critical
  code) — decide whether worth it.
- **LC base template brainstorm:** `docs/process/FUTURE_PROJECTS.md`.

## Cost note

Previous session ran very high (~$250+). Keep next session to ONE PR (start with
`loConfig.js`) and stop. Don't batch.
