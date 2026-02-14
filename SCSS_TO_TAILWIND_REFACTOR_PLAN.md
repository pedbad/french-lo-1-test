# SCSS to Tailwind Refactor Plan

Last updated: 2026-02-14  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Why This Refactor (Modern React + shadcn Approach)

Moving toward **central tokens + Tailwind utilities + minimal SCSS** is the more modern approach for React + shadcn/ui apps.

This is not "change for change's sake". It improves consistency, reduces styling drift, and makes component behavior easier to reason about in one place.

It follows modern React best practices.

### Evidence from official docs

1. shadcn/ui is open code, not a black-box package library.

- It is positioned as a way to build your own component library with editable source code in your repo.
- Source: [shadcn/ui Introduction](https://ui.shadcn.com/docs)

2. shadcn components are styled with Tailwind.

- Manual installation docs require Tailwind setup as part of component usage.
- Source: [Manual Installation](https://ui.shadcn.com/docs/installation/manual)

3. The recommended theming model is CSS variables + Tailwind utilities.

- Theming docs recommend CSS variables (`cssVariables: true`) and semantic tokens such as `background`/`foreground`.
- Source: [Theming](https://ui.shadcn.com/docs/theming)

4. Vite setup is centered on Tailwind in `index.css`.

- Vite install docs place Tailwind in `src/index.css` as the base styling entrypoint.
- Source: [Vite Installation](https://ui.shadcn.com/docs/installation/vite)

5. Tailwind is utility-first by design.

- The Tailwind docs explicitly define utility-first styling as the core model.
- Source: [Tailwind CSS](https://tailwindcss.com/)

## Practical Summary for Legacy SCSS Developers

- SCSS is not "wrong"; it is just no longer the primary style engine in this architecture.
- In this codebase, SCSS should be a temporary bridge for legacy components and edge cases.
- New work should default to:
  1. semantic design tokens in `src/index.css`
  2. Tailwind utilities in JSX
  3. shadcn component composition/variants for reusable patterns

## Current Baseline

- SCSS files in `src`: 49
- SCSS imports in JSX/JS: 48
- baseline started at: 54 SCSS files / 53 SCSS imports

These counts give us a measurable baseline for reduction.

## Refactor Principles

1. No visual regressions.
2. No behavior regressions (focus, keyboard, animation, responsive layout).
3. Token-first styling only (no new hardcoded typography/colors).
4. Incremental merges in small batches.
5. Add guardrails before deep refactors.

## Pitfalls and Refinements (Integrated)

These are accepted refinements from peer review, adapted to this repo:

1. CSS specificity/cascade can cause mixed SCSS + Tailwind conflicts during migration.
- Action: verify and preserve deterministic layer order in `src/index.css` (`@layer base`, `@layer components`, `@layer utilities`).
- Action: avoid broad `!important`; if needed, use temporary targeted migration classes and remove them once legacy selectors are deleted.

2. Dynamic SCSS class composition does not map 1:1 to utility classes.
- Action: use `cn()`/`clsx` + variant logic (`cva` where appropriate) for conditional styles.
- Action: avoid stringly-typed class concatenation when replacing SCSS variant patterns.

3. Global SCSS dependencies must be extracted before deleting `App.scss`.
- Action: audit global selectors (body/html defaults, link defaults, print rules, utility hooks) and move them to `@layer base` in `src/index.css`.

4. CSS Modules risk check.
- Current state: no `import styles from "*.module.scss"` usage in React components was detected.
- Impact: migration is primarily removing plain `import './Component.scss'` patterns, not CSS-module class rewrites.

5. Animations/keyframes need explicit migration decisions.
- Action: inventory SCSS keyframes and decide per case:
  - move to Tailwind `theme.extend.keyframes/animation`, or
  - keep as tokenized CSS in `src/index.css` under controlled layers.

6. Guard implementation should match current tooling.
- This repo uses `.githooks/pre-commit` + custom shell guards (not Husky).
- Action: implement `scripts/check-scss-guard.sh` with:
  - `--staged`: fail if new `.scss/.sass` files are added in staged diff
  - `--against <branch>`: fail if branch introduces new `.scss/.sass` files or new SCSS imports
- Action: wire into pre-commit and CI after initial script verification.

7. Developer migration speed improves with a pattern cheatsheet.
- Action: add `TAILWIND_MIGRATION_CHEATSHEET.md` mapping frequent SCSS patterns to Tailwind/tokenized equivalents.

## Clear Baby-Step Task List

### Phase 0: Guardrails First

- [x] Stabilize cascade/layer order for mixed migration state.
  - implemented explicit layer order in `src/index.css`: `@layer base, components, utilities`
  - documented temporary conflict-resolution strategy (minimal/removable overrides; avoid broad `!important`)
- [x] Add `scripts/check-scss-guard.sh` to fail when new `.scss` or `.sass` files are introduced.
- [x] Extend SCSS guard to fail when new SCSS imports are introduced in JSX/TSX/JS/TS.
- [x] Add package scripts:
  - `yarn check:scss`
  - `yarn check:scss:branch`
- [x] Add SCSS guard to:
  - `.githooks/pre-commit`
  - `.github/workflows/pr-quality.yml`
- [x] Keep existing typography/color/a11y guards required in pre-commit and CI.
- [ ] Do not enable global ESLint `no-restricted-imports` for `*.scss` yet (would fail current baseline); use diff-based guard until migration nears completion.

### Phase 1: Quick Win SCSS Removals (Small Files)

- [ ] Migrate and remove:
  - [x] `src/components/Attribution/Attribution.scss`
  - [x] `src/components/IconButton/IconButton.scss`
  - [x] `src/components/TopButton/TopButton.scss`
  - [x] `src/components/Explanation/Panel/Panel.scss`
  - [x] `src/components/Form/FieldSet/FieldSet.scss`
- [ ] Validate each removal with:
  - `yarn build`
  - focused UI smoke check for touched components

### Phase 1.5: Migration Cheatsheet

- [x] Create `TAILWIND_MIGRATION_CHEATSHEET.md` with common conversions, for example:
  - SCSS mixins (`flex-center`, etc.) -> utility combinations
  - SCSS variables -> semantic tokens
  - variant modifiers -> `cn()`/`cva` patterns
  - shared keyframe/animation patterns

### Phase 2: Utility Consolidation in Shared Patterns

- [ ] Move reusable visual patterns from SCSS into tokenized utility patterns:
  - [x] extracted duplicated exercise control button responsive sizing/label visibility into shared classes:
    - `exercise-icon-button`
    - `exercise-icon-button-label`
  - [x] extracted duplicated progress divider/control row patterns into shared classes:
    - `exercise-divider`
    - `exercise-actions-row`
  - [x] extracted shared help/control wrapper patterns into shared classes:
    - `exercise-help`
    - `exercise-help-wrap`
    - `exercise-help-end`
    - `exercise-help-hints`
    - `exercise-help-actions`
  - [x] applied these shared classes across:
    - `src/components/Sortable/Sortable.jsx`
    - `src/components/SequenceOrder/SequenceOrder.jsx`
    - `src/components/Blanks/Blanks.jsx`
    - `src/components/DropDowns/DropDowns.jsx`
    - `src/components/WordParts/WordParts.jsx`
  - button styles
  - card shells
  - spacing/layout helpers
- [ ] Keep minimal compatibility SCSS only where utility extraction is not yet practical.
  - [x] removed duplicated help-wrapper styling from:
    - `src/App.scss` (`.help.help-blanks` block)
    - `src/components/Blanks/Blanks.scss` (`.help` wrapper block)
    - `src/components/DropDowns/DropDowns.scss` (`.help` wrapper block)
    - `src/components/WordParts/WordParts.scss` (`.help` wrapper block)
- [ ] For dynamic style branches, standardize on `cn()` + tokenized utility variants.
  - [x] migrated dynamic `show` class toggles to `cn()` in:
    - `src/components/Blanks/Blanks.jsx`
    - `src/components/DropDowns/DropDowns.jsx`
    - `src/components/WordParts/WordParts.jsx`

### Phase 3: High-Impact File Migration (One at a Time)

- [ ] `src/App.scss` (largest global layer)
  - prerequisite: migrate remaining global/reset/base rules to `src/index.css` (`@layer base`)
- [ ] `src/components/Footer/Footer.scss`
- [ ] `src/components/Blanks/Blanks.scss`
- [ ] `src/components/CustomComponents_FR/CustomComponents_FR.scss`

Rule: one major file per PR, with before/after screenshots.

### Phase 4: Legacy Styles Module Rationalization

- [ ] Reduce dependence on:
  - `src/styles/_mixins.module.scss`
  - `src/styles/_variables.module.scss`
  - `src/styles/_colours.module.scss`
  - `src/styles/_media-queries.scss`
- [ ] Replace with tokenized utilities and small Tailwind-friendly helper classes where needed.
- [ ] Migrate or centralize retained `@keyframes` rules (Tailwind config or `index.css` layers).

### Phase 5: Completion Criteria

- [ ] SCSS file count reduced from 54 to an agreed target (for example <= 15).
- [ ] New components ship with zero SCSS.
- [ ] No new SCSS imports added during migration.
- [ ] CI and local guard checks remain green.

## Per-PR Definition of Done

- [ ] No new hardcoded typography/color values outside token files.
- [ ] Component states still accessible via keyboard.
- [ ] Responsive behavior preserved at mobile/tablet/desktop.
- [ ] Light/dark mode parity validated for touched UI.
- [ ] Before/after screenshots captured for visual regression review.
- [ ] `yarn build` passes.
- [ ] Relevant guard checks pass.

## Tracking

Track progress in:

- `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`

Recommended cadence:

1. 1-2 quick-win components per PR
2. 1 high-impact SCSS file per larger PR
3. Weekly metric update: SCSS file count + SCSS import count
