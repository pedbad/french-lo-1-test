# Next Session — Handover Prompt

> Copy the block below into a new session. The App.jsx refactor series is
> **complete** (PRs #28–#31); there is no queued work. This is a clean-state
> handover plus optional future directions. Full series record:
> [APP_REFACTOR_HANDOVER.md](./APP_REFACTOR_HANDOVER.md).

```
Continue work in /Users/ped/Sites/french/french-lo-1-test (branch: main).

CONTEXT: App.jsx DRY/modularity refactor series is COMPLETE (PRs #28–#31, all
merged). No queued work. This prompt = clean-state handover + OPTIONAL future
directions only. Do NOT start any code change unless I explicitly pick one below.

READ FIRST: git status && git pull --ff-only. Then src/App.jsx if working on it.
GIT HABIT: confirm `git status` shows "up to date with origin/main" (not
"ahead N") BEFORE branching. If ahead, push first. (A past session bundled a
local-only commit into a squash.)

=== STATE (verify with git, don't trust blindly) ===
- main green: yarn lint 0 errors (42 cosmetic warnings pre-existing),
  yarn test:run 95/95, yarn build clean. Tree clean on main.
- Last merged: PR #31 "lift modalContentMap to data module + extract
  useModalLinks hook" (squash 896dd70). NEXT PR # is 32.
- App.jsx: 1495 → 960 lines over the 4-PR series.

=== SERIES RESULT (done, do not redo) ===
- PR #28 (6f2779a) — pure LO config helpers → src/lib/loConfig.js (+36 tests).
- PR #29 (6d6013f) — removed dead languageCode no-op switch in render paths.
- PR #30 (baff813) — wrapInShell helper collapses renderComponent's 7-branch
  wrapper. Module-level in App.jsx. EXACT id/key suffixes per branch
  (-Accordion / -Section / -Group-Accordion / -Group-Section / -Section-Section)
  drive sessionStorage accordion state + #hash deep links — DO NOT change them.
  Section case's double -Section-Section is intentional.
- PR #31 (896dd70) — src/lib/modalContent.jsx (MODAL_CONTENT_MAP) +
  src/hooks/useModalLinks.js (findModalLinkContent, normalizeModalLinkAnchors,
  capture-phase click delegation; config mirrored to internal ref). App calls
  useModalLinks({ config: state.config, showModalLinkDialog }).
- Note (both #30 & #31): some branches preserved verbatim but never reached by
  current LO data — wrapInShell's -Group-Accordion (no LO has expandable
  non-tabs/tabs Group), and findModalLinkContent's config-scan/DOM-fallback (all
  LO modal links resolve via static map or custom components). Keep them; don't
  "dead-code" them without checking all 15 lo-config/*.json first.

=== KEY FILES ===
- src/App.jsx (960) — still holds: loadConfig/loadIndex + mount useEffect
  (route/scroll/index+config load), renderComponent + renderComponentForTab
  (~280 lines, the render switch), wrapInShell, and the page-render JSX
  (intro/hero/landing). Sole remaining class = ExerciseErrorBoundary (by design).
- src/lib/loConfig.js (+ .test.js), src/lib/modalContent.jsx,
  src/hooks/useModalLinks.js, src/utils/exerciseScoring.js (shipped PR #27).
- 15 LOs in src/lo-config/ (first-contact, about-me, going-to-a-cafe, …).

=== OPTIONAL FUTURE DIRECTIONS (none mandated — I must pick one) ===
App.jsx is 960 lines, still over the 800 guideline. If we continue, candidate
extractions (each its OWN PR, smallest-risk-first, behavior-preserving):
  A. Data-loading hook — lift loadConfig/loadIndex + the mount data-load effect
     into useLearningObject (or similar). RENDER-CRITICAL (config drives whole
     page). Watch: configGenRef remount, mountedRef StrictMode guard,
     normalizeLearningObjectUrl, shared-settings fetch order.
  B. Render module — move renderComponent/renderComponentForTab/wrapInShell +
     EXERCISE_REGISTRY into src/render/ (or a hook). Biggest line win (~330).
     RENDER-CRITICAL; preserve all id/key suffixes + configGen keys exactly.
  C. Intro/hero/landing JSX → presentational components. Lower risk.
Each is render-critical → full browser verify (below). Confirm the split is
wanted before doing it; App.jsx works fine as-is.

=== GATES (any code PR) ===
- yarn eslint --fix <touched files>; yarn lint -> 0 errors; yarn test:run ->
  95/95 (+ any new); yarn build clean (authoritative over dev console).
- RENDER-CRITICAL PRs: preview_stop -> preview_start (french-dev, port 5174).
  Browser-verify several LOs: location.href='/?lo=<slug>'; expand accordions
  (document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())
  looped ~8x w/ ~350ms waits); confirm pages render, tabs render, exercises grade
  (correct=--edu-affirm oklch(0.6 0.118 184.704),
   wrong=--destructive oklch(0.577 0.245 27.325)), modal links open right dialog,
  accordion state persists across reload (sessionStorage), #hash deep link
  opens+scrolls, ZERO console errors. Test a tabs-Group LO (first-contact,
  about-me), an accordion/Group-Section LO (going-to-a-cafe, daily-routine), and
  modal links (about-me subject-pronouns; house-and-home toilettes-note).
  daily-routine has a RadioQuiz for grading-color checks.
- Branch per item; commit + PR to main; squash-merge
  (gh pr merge N --squash --delete-branch). NEXT PR # is 32.

=== GOTCHAS ===
- GateGuard fact-forces on: first Bash, first edit of EACH new file path, doc
  edits, destructive git. Present required facts, then RETRY same op. Recovery:
  ECC_GATEGUARD=off or add hook id to ECC_DISABLED_HOOKS.
- no-unused-vars is ERROR (varsIgnorePattern ^[A-Z_]) but destructured fn
  params fall under args, NOT vars — a Capitalized component as a destructured
  param default trips it (hit in PR #30). Use a lowercase param + local
  `const Foo = param || Default` then <Foo/> in JSX.
- sort-imports + eslint --fix + prettier reorder/reindent — re-check import lines
  after editing; don't anchor later edits on exact import strings.
- StrictMode ON — mount effects double-fire in dev; keep setup/cleanup idempotent.
- Pre-commit hooks: typography/color/a11y/SCSS/image guards — pass on clean code.
- Attribution disabled (no Co-Authored-By in commits) — matches repo history.

=== COST ===
ONE PR per session, then stop. Browser-verify loops are the cost driver on
render-critical PRs — budget for it. Last session ran ~$90 doing 2 PRs.

=== PARKED / OPTIONAL ===
- useExerciseScoring: src/utils/exerciseScoring.js ALREADY shipped (PR #27).
- LC base template brainstorm: docs/process/FUTURE_PROJECTS.md.
- Full handover detail: docs/process/APP_REFACTOR_HANDOVER.md (status: COMPLETE).
```
