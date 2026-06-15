# Next session handover

Continue work in `/Users/ped/Sites/french/french-lo-1-test` (branch: main).

READ FIRST: `git status && git pull --ff-only`. Confirm "up to date with
origin/main" (NOT "ahead N") before branching.

## STATE (verify with git)

- main green at `fecdb0f`. Two PRs merged THIS session:
  - **#38** (`f628aeb`) — `createRenderer` unit tests. Pure element-inspection
    (no rendering / no testing-library), same style as `lazyRegistry.test.js`.
    New file `src/render/renderLearningObject.test.js`. Covers the branches that
    were unreachable while the dispatch lived in App's closure (deferred in #36):
    HIDE→empty / null, registry→accordion-wrapped configGen-keyed Suspense,
    Explanation accordion vs static `Section` (expandable:false), PhraseTable
    languageCode threading, Section double `-Section-Section` id, Group
    accordion vs Tabs, custom fallthrough → memoised lazy under `-custom`
    Suspense, auto-id counter. **+21 tests (105 → 126).**
  - **#39** (`fecdb0f`) — CSS cascade-layer, **targeted** (NOT the bulk
    migration the previous handover framed — see below). Wrapped 9
    bare-element-in-class `#content` rules in `@layer base`:
    `.information .info-content` element defaults (`ul` / `:is(p,div,li,h3,h4)` /
    `ul li` / `::before`), `.intro h2`, `.intro p`, `.section h2`. Selectors +
    declarations byte-identical (only the `@layer` wrapper + reindent). Visual
    no-op, verified on LO1 light + dark. Unlayered `#content` rule-blocks
    **75 → 66**. `docs/process/TAILWIND_V4.md` updated (Fixes Applied +
    pure-class vs bare-element-in-class debt split).
- `yarn lint` → 0/0. `yarn test:run` → **126/126** (8 files). `yarn build` →
  clean (no chunk warning), `main.js` **474.71 kB** (unchanged). All verified at
  session end.

## ARCHITECTURE (don't re-derive — stable since #37)

- **`src/render/lazyRegistry.jsx`** — `resolveExerciseExport`, `lazyExercise`,
  `EXERCISE_REGISTRY` (12 lazy exercise types), `resolveCustomExport`,
  `getLazyCustomComponent` (memoised one lazy type per key), `withLazyBoundary`
  (per-component `<Suspense>` + inline `<div role="status">` fallback). Dynamic
  `import()` specifiers are `@/components/...` (alias = location-independent),
  chunks unchanged from #34. `motion` is a dep but UNUSED — don't split it.
  Tests: `src/render/lazyRegistry.test.js`.
- **`src/render/renderLearningObject.jsx`** — `wrapInShell` (accordion /
  static-section shell) + `createRenderer(ctx)` factory returning
  `{ renderComponent, renderComponentForTab }`. `ctx` =
  `{ currentLearningObject, languageCode, configGen }`. Per-render auto-id
  counter is a CLOSURE var owned by the renderer instance (starts at 0 each
  pass). Dispatch: registry exercise → accordion-wrapped lazy element; `Group`
  → sub-accordions or tabs (`displayAsTabs`); `Section` → static shell (legacy
  double `-Section-Section` id suffix — preserved); `Explanation` /
  `PhraseTable` → special cases; `HIDE…` prefix → nothing; else → lazy custom
  (missing key → "not implemented" notice inside the lazy module). Tests:
  `src/render/renderLearningObject.test.js`.
- **`src/App.jsx`** (~450 lines, under 800) — thin composition root: state
  reducer, mount effect (route normalize + index/shared-settings load + LO
  resolve + config load), `loadConfig`/`loadIndex`, modal-link hook wiring,
  dark toggle, hash deep-link effect; render body builds ONE renderer per pass
  and calls `renderer.renderComponent(...)` per top-level section. DO NOT
  disturb `configGen` (woven into exercise host keys = remount mechanism),
  `prevConfigRef`, or `mountedRef`. Sole remaining class =
  `ExerciseErrorBoundary` (by design).

## BACKLOG — ranked by ROI (none mandated; pick per budget)

1. **CSS cascade layers — FIX-ON-DEMAND ONLY, not a bulk task.** Ground truth
   (re-measured #39): **66** unlayered `#content` rule-blocks remain (the old
   "~321" figure was wrong). The dangerous *global* bare-element rules
   (`#content p/li/td`, `a`, `h1-h4`) were already layered in a prior session;
   the primary-content bare-element-in-class rules were layered in #39. What's
   left:
   - ~50 **pure class-scoped** rules (`.inline-icon*`, `.instruction-callout`,
     `.modal-link`, `.lo6-reference-*`, …) — a class selector can't hijack an
     arbitrary utility, so these are **low risk**.
   - exercise/LO-internal **bare-element-in-class** rules (radio2, doubleLl,
     lo6-reference, word-spot) — only matter if you add a utility to that
     element inside that component.
   **Per `docs/process/TAILWIND_V4.md`: do NOT pre-emptively bulk-layer these.**
   Layer one rule only when `yarn dev` + DevTools shows a real utility losing to
   it. There is no standing "CSS migration" PR to do.
2. **`docs/*.md` build-scan warning** (small, concrete). Tailwind v4 auto-scans
   `docs/**` and tries to compile the documented-broken
   `text-[var(--font-size-base)]` example → build warning
   `Unexpected token Delim('*')` (NOT emitted to dist). Fix: add
   `@source not "docs/**"` to `src/index.css` (or fence the offending examples
   so the scanner skips them). Quick, build-only verify. NOTE: `yarn build` was
   clean at this session's end — confirm the warning still occurs before chasing
   it; it may be intermittent / already mitigated.
3. **Per-topic custom split** (LOW ROI — skip unless asked). `custom.js` is one
   chunk (~7.6 KB) already deferred off initial load. Per-topic split needs an
   explicit key→loader map (enumeration churn / drift). Marginal.

## KEY FACTS / GOTCHAS (carried forward — all still valid)

- **Base + assets**: `base` is env-driven (`VITE_BASE_PATH || './'`). Prod:
  `build:server` = `/projects/french-basic/`, `build:live` =
  `/french/french-basic/`. ALWAYS fetch runtime assets through
  `resolveAsset(...)` (`src/utils/assets.js`) — a root-absolute fetch 404s under
  the non-root deploy bases (bug #35). Hosted at lcdev + lcitc under
  `/french/french-basic/`.
- **`vite preview` quirk (not a bug)**: under default `./` base, the slug URL
  rewrite makes `resolveAsset`'s relative `./src/...` resolve against `/<slug>/`,
  so config fetches 404 → SPA-fallback HTML → "Unexpected token '<'" console
  errors. Does NOT happen under the absolute server/live bases. The dev server
  (`french-dev`, port 5174) renders LOs natively and is the cheapest functional
  + visual check — load `/?lo=1&skipCookieControl=1`. For a prod base check use
  `french-preview-server` (4174, `VITE_BASE_PATH=/projects/french-basic/`).
- **`.claude/launch.json` is gitignored** — `french-dev` (5174),
  `french-preview` (4173), `french-preview-server` (4174) configs are LOCAL
  only. `french-dev` exists locally (used this session). Recreate if missing.
- **GateGuard fact-force**: fires on first Bash, first edit of EACH new file
  path, and doc edits. Present facts (importers via grep, public symbols, data
  I/O field names, verbatim instruction), then RETRY the same op. Recovery:
  `ECC_GATEGUARD=off`.
- **config-protection hook**: may block `vite.config.js` / `eslint.config.js`
  edits (not other files). Legitimate build-config changes are sanctioned by the
  hook's own message.
- **Pre-commit guards** (typography/color/a11y/SCSS/image) run on commit — pass
  on clean code. Pure `@layer` wrapping passed all of them (no value changes).
  Attribution disabled (no Co-Authored-By) — matches history.
- **CI**: a single `quality` GitHub Action check runs on the PR (~50s). Wait for
  it (`gh pr checks <n> --watch`) before
  `gh pr merge <n> --squash --delete-branch`. Doc-only handover commits have
  historically gone DIRECT to main (e.g. `e1845bb`), no PR.
- **Lint discipline**: `no-unused-vars` is ERROR (`varsIgnorePattern ^[A-Z_]`).
  Moving code between modules orphans imports — run `yarn eslint --fix` on
  touched files, then `yarn lint`. `prefer-destructuring` is a WARNING that
  `--fix` resolves. `sort-imports` reorders members; don't anchor edits on exact
  import strings.
- **CSS comments**: a `*/` token anywhere inside the comment body (e.g. writing
  `text-*` immediately followed by `/spacing`) closes the comment early and
  breaks the file. Word it out.
- Session may boot CAVEMAN MODE (terse replies); code/commits/PRs stay normal.
  "stop caveman" to disable.

## COST NOTE

This session ran **~$79** — the CSS browser-verification (dev server load +
light/dark screenshots + DOM computed-style checks) drove most of it, exactly as
the prior handover warned for style-only work. Item 1 above is now fix-on-demand
(no standing CSS work), item 2 is build-only (cheap, no browser). START A FRESH
SESSION for the next item.
