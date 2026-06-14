# Next Session — Handover Prompt

> Copy the block below into a new session. The App.jsx refactor series is
> **complete** (PRs #27–#32). The next task is a small, cheap **ESLint warning
> cleanup** (42 warnings → 0). NOT render-critical — no browser verify needed.
> Full architecture record: [FUTURE_PROJECTS.md](./FUTURE_PROJECTS.md);
> series record: [APP_REFACTOR_HANDOVER.md](./APP_REFACTOR_HANDOVER.md).

```text
Continue work in /Users/ped/Sites/french/french-lo-1-test (branch: main).

TASK: Fix the 42 ESLint warnings (currently 0 errors, 42 warnings) → 0 warnings.
ONE PR, then stop. NOT render-critical (cosmetic/lint only) → NO browser verify
needed; gates are lint/test/build only.

READ FIRST: git status && git pull --ff-only. Confirm "up to date with
origin/main" (NOT "ahead N") before branching.
GIT HABIT: a past session bundled a local-only commit into a squash — if ahead,
push first.

=== STATE (verify with git) ===
- main green: PR #32 merged (squash bb22e60, page-JSX→components), docs commit
  eb700d1 (FUTURE_PROJECTS carry-forward). App.jsx 868 lines.
- yarn lint → 0 errors, 42 warnings. yarn test:run → 95/95. yarn build → clean.
- A local branch `chore/fix-lint-warnings` may already exist (created empty off
  main last session, no commits). Either `git switch` to it (then rebase on
  latest main) or delete + recreate. NEXT PR # is 33.

=== THE 42 WARNINGS (breakdown) ===
- prefer-destructuring (~19): AudioManager.test, AccordionArticle, RadioQuiz,
  instructionCues, DebugColorTokens, DebugFontTokens, loConfig, exerciseParsing
- no-mixed-spaces-and-tabs (10): AccordionArticle.jsx (8), regions-map.jsx (2)
- react-refresh/only-export-components (5): ui/badge, ui/button,
  ui/navigation-menu, ui/sidebar, Section/instructions-media
- sort-imports (3): useAudio.js, MemoryMatchGame.jsx, exerciseParsing.test.js
- no-multi-spaces (3): answerNormalize.test.js
- eqeqeq (2): PhraseTable.jsx:126, ExerciseFooter.jsx:73

=== FIX PLAN (smallest-risk order) ===
1. eqeqeq FIRST, MANUALLY (do NOT blind --fix these — see GOTCHA):
   - PhraseTable.jsx:126  `header[i] == null`
       → `header[i] === null || header[i] === undefined`
   - ExerciseFooter.jsx:73 `onCheck != null`
       → `onCheck !== null && onCheck !== undefined`
2. Then `yarn eslint --fix src/` — clears the auto-fixable bulk
   (prefer-destructuring, sort-imports, no-multi-spaces, no-mixed-spaces; the
   eqeqeq sites are already === after step 1 so --fix leaves them alone).
   NOTE: --fix reindents the no-mixed-spaces lines (whitespace only) and may
   reorder imports / reflow via prettier — re-check import lines after.
3. react-refresh (5, NOT auto-fixable):
   - 4 shadcn files (src/components/ui/badge|button|navigation-menu|sidebar):
     the cva-variants-co-exported-with-component pattern is intentional shadcn
     convention + a known false positive. Add an eslint.config.js override
     disabling `react-refresh/only-export-components` for `src/components/ui/**`
     (flat config — append a new block:
     `{ files: ['src/components/ui/**'], rules:
        { 'react-refresh/only-export-components': 'off' } }`).
   - 1 app file (Section/instructions-media.jsx): exports 2 helpers
     (INSTRUCTION_TEXT_CLASS, applyInstructionTypographyToHTML) + the
     InstructionsMedia component. Helpers imported by 3 files
     (Section.jsx, page-shell/HeroSection/HeroSection.jsx,
     debug/DebugSandbox.jsx). Cleanest: move the 2 helpers to a sibling
     non-component module (e.g. Section/instructionTypography.js) and update
     those 3 imports + instructions-media's own use. (Alternative minimal-churn:
     exempt the file via an eslint override — but prefer the move; it's the
     real fix and the rule is legit here.)

=== GOTCHA (critical) ===
- eqeqeq: both sites use the loose `== null` / `!= null` idiom that matches
  BOTH null AND undefined. eslint --fix rewrites to `=== null` / `!== null`,
  which DROPS the undefined case → behavior change (PhraseTable: undefined
  header cells lose sr-only "Audio" text; ExerciseFooter: check button renders
  even when onCheck is undefined). Expand explicitly (step 1) BEFORE --fix.

=== OTHER GOTCHAS (from prior sessions) ===
- GateGuard fact-forces on: first Bash, first edit of EACH new file path, doc
  edits. Present required facts (caller/importers, no-dup via glob, data I/O,
  verbatim instruction), then RETRY the same op. Recovery: ECC_GATEGUARD=off.
- no-unused-vars is ERROR (varsIgnorePattern ^[A-Z_]); destructured fn params
  fall under args not vars.
- sort-imports + --fix + prettier reflow imports — don't anchor later edits on
  exact import strings; re-read after --fix.
- Pre-commit hooks: typography/color/a11y/SCSS/image guards (pass on clean code).
- Attribution disabled (no Co-Authored-By) — matches repo history.
- Session may boot CAVEMAN MODE (terse replies); code/commits/PRs still normal.
  "stop caveman" to disable.

=== GATES (this PR) ===
- yarn eslint --fix <touched>; yarn lint → 0 errors AND 0 warnings (the goal);
  yarn test:run → 95/95; yarn build → clean.
- NO browser verify (not render-critical). Build is authoritative.
- Branch per item; commit + PR to main; squash-merge
  (gh pr merge N --squash --delete-branch). NEXT PR # is 33.

=== AFTER THIS / OPTIONAL FUTURE (none mandated) ===
App.jsx refactor series COMPLETE (#27–#32). Remaining optional, each own PR:
  A. data-loading hook (useLearningObject) — render-critical
  B. render module (renderComponent/wrapInShell/EXERCISE_REGISTRY → src/render/,
     ~330 lines, only this gets App.jsx under 800) — render-critical
  Higher-value separate workstreams: bundle splitting (950 KB JS, build warns
  >500 KB — best user impact), CSS cascade-layer migration (~321 unlayered
  rules, big/risky), render-path test coverage.
Full detail: docs/process/FUTURE_PROJECTS.md, docs/process/APP_REFACTOR_HANDOVER.md.

=== COST ===
This is the CHEAPEST item on the backlog — be efficient. One --fix pass +
~3 manual edits (2 eqeqeq + config override) + optional helper-move + gates +
PR. Should be well under $10 in a clean context. Don't over-investigate.
```
