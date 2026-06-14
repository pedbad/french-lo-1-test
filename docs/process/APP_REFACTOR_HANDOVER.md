# App.jsx Refactor — Handover

> **Status:** PR #1 (loConfig extraction) MERGED. Items 2–4 remain. Execute
> smallest-risk-first, ONE PR each, each leaving `main` green. Don't batch.

## Task

Refactor `src/App.jsx` (now **1227 lines**, was 1495) for DRY + modularity. It
mixes 4 concerns and repeats the same render-wrapper block 5×. Goal: shrink
toward the 800-line rule and remove duplication, behavior-preserving.

## Read first

- `src/App.jsx` in full.
- Then: `git status && git pull --ff-only`.
- **git habit:** last session had a LOCAL-ONLY commit on `main` that was never
  pushed, so a squash-merge silently bundled it into the PR. Before branching,
  confirm `git status` shows "up to date with origin/main" (not "ahead N"). If
  ahead, push first.

## State (verify with git — don't trust blindly)

- `main` green: `yarn lint` 0 errors (42 cosmetic warnings pre-existing),
  `yarn test:run` **95/95**, `yarn build` clean. Tree clean on `main`.
- Last merged: **PR #28** "extract pure LO config helpers to src/lib/loConfig.js"
  (squash `6f2779a`). **Next PR # is 29.**
- `src/lib/loConfig.js` holds the 10 pure config helpers + 36 unit tests
  (`src/lib/loConfig.test.js`). `App.jsx` imports 8 of them at lines ~40–49.
- `configGen` counter is woven into the `<RegisteredExercise>` key at both mount
  sites — DO NOT remove/disturb it (Phase 6b remount mechanism). `prevConfigRef`
  + `mountedRef` still needed — leave.
- Sole remaining class = `ExerciseErrorBoundary` (by design).

## Remaining targets (current App.jsx line anchors)

### PR #2 — Kill dead `languageCode` no-op switch (#3). TRIVIAL — do first.

Two identical dead switches: `switch (languageCode) { case "fr": X; default: X }`
where both branches are `AllCustomComponentsFR[component]`:

- `renderComponentForTab` default case: **lines 645–651**
- `renderComponent` default case: **lines 957–963**

Replace each with: `const CustomComponent = AllCustomComponentsFR[component];`.
`languageCode` / `state.languageCode` may then be unused in those scopes — check
and remove now-unused destructures (`no-unused-vars` is ERROR). Pure
simplification, no render change. Gates only; no browser needed.

### PR #3 — `wrapInShell` helper to collapse the render switch (#1, #2). RENDER-CRITICAL.

`renderComponent` (starts **line 669**) repeats the
"`expandable ? AccordionArticle : Section`" block 5× with identical
`config`/`id`/`key`/`target`/`title`/`titleHTML` props:

- Explanation case ~711
- Group non-tabs ~747 (incl. `GroupSectionComponent = heroSection ? HeroSection : Section` ~775)
- Group tabs IIFE ~837 (same `GroupSectionComponent` dup)
- PhraseTable case ~893
- default/Custom case ~957

Also `EXERCISE_REGISTRY` dispatch (~690) uses the same accordion wrapper.

Extract one helper, e.g.

```
wrapInShell({ value, compoundID, targetId, expandable, semanticAs,
              autoExpandSingleAccordion, heroSection, className, groupTarget,
              title, titleHTML, children })
```

returning `AccordionArticle` (expandable) else `HeroSection`/`Section`. **Keep the
EXACT id/key suffixes per branch** (`-Accordion` / `-Section` / `-Group-Accordion`
/ `-Group-Section`) — they drive sessionStorage accordion state + deep links, so a
changed id silently breaks open/closed persistence. FULL browser verify after.

### PR #4 — Lift `modalContentMap` → data module + `useModalLinks` hook (#5).

`findModalLinkContent` (**line 163**) hardcodes `modalContentMap` (**lines
165–223**): LO-specific JSX (`Grammar1Body`, subject-pronouns variants,
`toilettes-note` `Info`). Move the map to a data module; extract the modal-link
delegation effect (in the mount `useEffect`, ~480–525 region) +
`findModalLinkContent` + `normalizeModalLinkAnchors` (**line 290**) into a
`useModalLinks` hook. Touches modal-link behavior on every LO — FULL browser
verify after.

## Gates (every PR)

- `yarn eslint --fix` touched files; `yarn lint` → 0 errors; `yarn test:run` →
  95/95 (+ any new); `yarn build` clean (authoritative over dev console).
- For render PRs (3, 4): restart preview (`preview_stop` → `preview_start`,
  french-dev, port 5174) at session start. Browser-verify:
  `location.href='/?lo=<slug>'`, expand accordions
  (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
  loop ~8× w/ ~350ms waits), confirm LO pages render, exercises grade
  (correct=`--edu-affirm` `oklch(0.6 0.118 184.704)`, wrong=`--destructive`
  `oklch(0.577 0.245 27.325)`), zero console errors. 15 LOs in `src/lo-config/`
  (e.g. first-contact, about-me, going-to-a-cafe).
- Branch per item, commit + PR to main, squash-merge
  (`gh pr merge N --squash --delete-branch`). Next PR # is 29.

## Gotchas

- GateGuard fact-forces on: first Bash, first edit of EACH new file path, doc
  edits, AND destructive git (`reset --hard` re-fires every retry). Present the
  required facts then RETRY. For `reset --hard` that keeps re-firing, use
  `git checkout -B <branch> origin/<branch>` (equivalent, not gated) or run with
  `ECC_GATEGUARD=off`.
- `no-undef` = blank-page safety net; `no-unused-vars` is ERROR
  (`varsIgnorePattern ^[A-Z_]`) — remove now-unused imports/params/destructures
  manually.
- `sort-imports` + `eslint --fix` reorder/reindent — verify the import LINE after
  editing; don't anchor later edits on exact import strings.
- StrictMode ON — mount effects double-fire in dev; keep setup/cleanup idempotent.
- Pre-commit hooks: typography/color/a11y/SCSS/image guards — pass on clean code.

## Cost note

Keep each session to ONE PR and stop. Don't batch. Start with PR #2 (trivial).

## Parked / optional (not this task)

- `useExerciseScoring`: `src/utils/exerciseScoring.js` ALREADY shipped (PR #27).
  Any "evaluated, not implemented" note elsewhere is STALE — git is truth.
- LC base template brainstorm: `docs/process/FUTURE_PROJECTS.md`.
