# App.jsx Refactor — Handover

> **Status:** PRs #1 (loConfig), #2 (dead `languageCode` switch), and #3
> (`wrapInShell` helper) MERGED. Only item #4 remains. Execute smallest-risk-first,
> ONE PR each, each leaving `main` green. Don't batch. **This session = PR #4.**

## Task

Refactor `src/App.jsx` (now **1190 lines**, was 1495) for DRY + modularity. It
mixes 4 concerns and repeats the same render-wrapper block across branches. Goal:
shrink toward the 800-line rule and remove duplication, behavior-preserving.

## Read first

- `src/App.jsx` in full.
- Then: `git status && git pull --ff-only`.
- **git habit:** a prior session had a LOCAL-ONLY commit on `main` that was never
  pushed, so a squash-merge silently bundled it into the PR. Before branching,
  confirm `git status` shows "up to date with origin/main" (not "ahead N"). If
  ahead, push first.

## State (verify with git — don't trust blindly)

- `main` green: `yarn lint` 0 errors (42 cosmetic warnings pre-existing),
  `yarn test:run` **95/95**, `yarn build` clean. Tree clean on `main`.
- Last merged: **PR #30** "extract wrapInShell helper to collapse renderComponent
  switch" (squash `baff813`). **Next PR # is 31.**
- `src/lib/loConfig.js` holds 10 pure config helpers + 36 unit tests
  (`src/lib/loConfig.test.js`). `App.jsx` imports 8 of them at lines ~40–49.
- `configGen` counter is woven into the `<RegisteredExercise>` key at both mount
  sites (tab renderer line ~620, accordion line ~696) — DO NOT remove/disturb it
  (Phase 6b remount mechanism). `prevConfigRef` + `mountedRef` still needed —
  leave.
- Sole remaining class = `ExerciseErrorBoundary` (by design).

## Done this series

- **PR #28** (`6f2779a`) — extract pure LO config helpers to `src/lib/loConfig.js`.
- **PR #29** (`6d6013f`) — remove dead `languageCode` no-op switch in both render
  paths (every branch resolved the same `AllCustomComponentsFR[component]`).
  `languageCode` destructures kept (still used by PhraseTable props).
- **PR #30** (`baff813`) — extract module-level `wrapInShell({ value, expandable,
  target, accordionId, sectionId, accordionSemanticAs, sectionSemanticAs,
  sectionComponent, className, title, titleHTML, children })` helper; all 7
  renderComponent branches now route through it (net −21 lines, no behavior
  change). Each call site passes its exact id/key suffix verbatim; the Section
  case's double `-Section-Section` preserved. Verified: lint/test/build green +
  full browser pass (tabs-Group, Group→Section, `-Section-Section`, RadioQuiz
  grading colors, sessionStorage persistence, `#hash` deep link, zero console
  errors). Note: no LO config triggers the `-Group-Accordion` branch (all Groups
  are tabs or `expandable: false`); that path is preserved exactly but never
  data-exercised.

## Remaining targets (current App.jsx line anchors)

### PR #4 — Lift `modalContentMap` → data module + `useModalLinks` hook (#5).

`findModalLinkContent` (**line ~231**, `modalContentMap` at ~233) hardcodes
LO-specific JSX (`Grammar1Body`, subject-pronouns variants, `toilettes-note`
`Info`). Move the map to a data module; extract the modal-link delegation effect
(in the mount `useEffect`, ~582–640 region) + `findModalLinkContent` +
`normalizeModalLinkAnchors` (**line ~366**) into a `useModalLinks` hook. Touches
modal-link behavior on every LO — FULL browser verify after.

## Gates (every PR)

- `yarn eslint --fix` touched files; `yarn lint` → 0 errors; `yarn test:run` →
  95/95 (+ any new); `yarn build` clean (authoritative over dev console).
- For render PR #4: restart preview (`preview_stop` → `preview_start`,
  french-dev, port 5174) at session start. Browser-verify across several LOs:
  `location.href='/?lo=<slug>'`, expand accordions
  (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
  loop ~8× w/ ~350ms waits), confirm LO pages render, tabs render, exercises grade
  (correct=`--edu-affirm` `oklch(0.6 0.118 184.704)`, wrong=`--destructive`
  `oklch(0.577 0.245 27.325)`), zero console errors. 15 LOs in `src/lo-config/`
  (e.g. first-contact, about-me, going-to-a-cafe). For PR #4 specifically, click
  several modal links (`a.modal-link`) per LO and confirm the dialog opens with the
  right content; test an LO with subject-pronouns / `toilettes-note` links
  (about-me). daily-routine has a RadioQuiz for grading-color checks.
- Branch per item, commit + PR to main, squash-merge
  (`gh pr merge N --squash --delete-branch`). **Next PR # is 31.**

## Gotchas

- GateGuard fact-forces on: first Bash, first edit of EACH new file path, doc
  edits, AND destructive git (`reset --hard` re-fires every retry). Present the
  required facts then RETRY. For `reset --hard` that keeps re-firing, use
  `git checkout -B <branch> origin/<branch>` (equivalent, not gated) or run with
  `ECC_GATEGUARD=off`.
- `no-undef` = blank-page safety net; `no-unused-vars` is ERROR
  (`varsIgnorePattern ^[A-Z_]`) — if collapsing the switch orphans a destructure
  (e.g. `topLevelSemanticAs`), remove it manually.
- `sort-imports` + `eslint --fix` reorder/reindent — verify the import LINE after
  editing; don't anchor later edits on exact import strings.
- StrictMode ON — mount effects double-fire in dev; keep setup/cleanup idempotent.
- Pre-commit hooks: typography/color/a11y/SCSS/image guards — pass on clean code.

## Cost note

Keep each session to ONE PR and stop. Don't batch. This session = PR #4.

## Parked / optional (not this task)

- `useExerciseScoring`: `src/utils/exerciseScoring.js` ALREADY shipped (PR #27).
  Any "evaluated, not implemented" note elsewhere is STALE — git is truth.
- LC base template brainstorm: `docs/process/FUTURE_PROJECTS.md`.
