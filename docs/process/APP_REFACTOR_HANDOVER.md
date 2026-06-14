# App.jsx Refactor — Handover

> **Status:** PRs #1 (loConfig) and #2 (dead `languageCode` switch) MERGED.
> Items #3–#4 remain. Execute smallest-risk-first, ONE PR each, each leaving
> `main` green. Don't batch. **This session = PR #3.**

## Task

Refactor `src/App.jsx` (now **1211 lines**, was 1495) for DRY + modularity. It
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
- Last merged: **PR #29** "remove dead languageCode no-op switch" (squash
  `6d6013f`). **Next PR # is 30.**
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

## Remaining targets (current App.jsx line anchors)

### PR #3 — `wrapInShell` helper to collapse the render switch. RENDER-CRITICAL.

`renderComponent` (starts **line 661**) repeats the
"`expandable ? AccordionArticle : HeroSection/Section`" wrapper block with
identical `config`/`id`/`key`/`target`/`title`/`titleHTML` props across:

- `EXERCISE_REGISTRY` dispatch **~684** (accordion-only, suffix `-Accordion`)
- Explanation case **line 703** (`-Accordion` / `-Section`)
- Group non-tabs **line 744** (`GroupSectionComponent` dup at 767/771;
  `-Group-Accordion` / `-Group-Section`)
- Group tabs IIFE **~820** (same `GroupSectionComponent` dup at 829/833;
  same `-Group-Accordion` / `-Group-Section`)
- PhraseTable case **line 885** (`-Accordion` / `-Section`)
- default/Custom case **line 947** (`-Accordion` / `-Section`)
- Section case **line 923** — NOTE: always `SectionComponent`, suffix is
  `-Section-Section` (DOUBLE — quirk, preserve exactly)

Extract one helper, e.g.

```
wrapInShell({ value, compoundID, targetId, expandable, semanticAs,
              autoExpandSingleAccordion, heroSection, className, groupTarget,
              title, titleHTML, children })
```

returning `AccordionArticle` (when expandable) else `HeroSection` (heroSection) /
`Section`. `GroupSectionComponent = heroSection ? HeroSection : Section`.

**CRITICAL: keep the EXACT id/key suffix per branch**
(`-Accordion` / `-Section` / `-Group-Accordion` / `-Group-Section` /
`-Section-Section`). They drive sessionStorage accordion open/closed state + deep
links; a changed id silently breaks persistence and `#hash` links. The Section
case's double `-Section-Section` suffix is intentional — do not "fix" it.
Also note: `AccordionArticle` uses `target={targetId}` for plain branches but
`target={groupId}` for Group branches — preserve which id each branch passes.

### PR #4 — Lift `modalContentMap` → data module + `useModalLinks` hook (#5).

`findModalLinkContent` (**line ~163**) hardcodes `modalContentMap`: LO-specific
JSX (`Grammar1Body`, subject-pronouns variants, `toilettes-note` `Info`). Move the
map to a data module; extract the modal-link delegation effect (in the mount
`useEffect`, ~480–525 region) + `findModalLinkContent` + `normalizeModalLinkAnchors`
(**line ~290**) into a `useModalLinks` hook. Touches modal-link behavior on every
LO — FULL browser verify after.

## Gates (every PR)

- `yarn eslint --fix` touched files; `yarn lint` → 0 errors; `yarn test:run` →
  95/95 (+ any new); `yarn build` clean (authoritative over dev console).
- For render PRs (3, 4): restart preview (`preview_stop` → `preview_start`,
  french-dev, port 5174) at session start. Browser-verify across several LOs:
  `location.href='/?lo=<slug>'`, expand accordions
  (`document.querySelectorAll('button[aria-expanded="false"]').forEach(b=>b.click())`,
  loop ~8× w/ ~350ms waits), confirm LO pages render, tabs render, exercises grade
  (correct=`--edu-affirm` `oklch(0.6 0.118 184.704)`, wrong=`--destructive`
  `oklch(0.577 0.245 27.325)`), zero console errors. 15 LOs in `src/lo-config/`
  (e.g. first-contact, about-me, going-to-a-cafe). Test at least one tabs-Group LO
  and one accordion-Group LO.
- **PR #3 extra:** verify accordion open/closed state PERSISTS across reload
  (sessionStorage) and a `#hash` deep link opens + scrolls the right section — the
  id-suffix regression risk lives here.
- Branch per item, commit + PR to main, squash-merge
  (`gh pr merge N --squash --delete-branch`). **Next PR # is 30.**

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

Keep each session to ONE PR and stop. Don't batch. This session = PR #3.

## Parked / optional (not this task)

- `useExerciseScoring`: `src/utils/exerciseScoring.js` ALREADY shipped (PR #27).
  Any "evaluated, not implemented" note elsewhere is STALE — git is truth.
- LC base template brainstorm: `docs/process/FUTURE_PROJECTS.md`.
