# Next session handover

Continue work in `/Users/ped/Sites/french/french-lo-1-test` (branch: main).

READ FIRST: `git status && git pull --ff-only`. Confirm "up to date with
origin/main" (NOT "ahead N") before branching.

## STATE (verify with git)

- main green at `0701f95`. Two PRs merged THIS session:
  - **#36** (`6fc345e`) — unit coverage for the lazy code-split seams PR #34
    introduced. Extracted the closure-free lazy machinery into
    `src/render/lazyRegistry.jsx` (so App.jsx stays component-only — in-place
    exports tripped `react-refresh/only-export-components`) and added
    `src/render/lazyRegistry.test.js` (+10 tests).
  - **#37** (`0701f95`) — extracted the config-driven render dispatch out of the
    App component closure into `src/render/renderLearningObject.jsx`. **App.jsx
    846 → ~450 lines — back under the 800 guideline.** Behaviour-identical
    (build output unchanged, `main.js` 474.71 kB).
- `yarn lint` → 0/0. `yarn test:run` → **105/105**. `yarn build` → clean (no
  chunk warning). All verified at session end. #37 also browser-verified on LO1.

## ARCHITECTURE NOW (don't re-derive)

- **`src/render/lazyRegistry.jsx`** — `resolveExerciseExport`, `lazyExercise`,
  `EXERCISE_REGISTRY` (12 lazy exercise types), `resolveCustomExport`,
  `getLazyCustomComponent` (memoised one lazy type per key), `withLazyBoundary`
  (per-component `<Suspense>` with an inline loading `<div role="status">`).
  Dynamic `import()` specifiers are `@/components/...` (alias = location-
  independent), so chunks are unchanged from #34. `motion` is a dep but UNUSED —
  don't split it.
- **`src/render/renderLearningObject.jsx`** — `wrapInShell` (the accordion /
  static-section shell) + a **`createRenderer(ctx)` factory** returning
  `{ renderComponent, renderComponentForTab }`. `ctx` is
  `{ currentLearningObject, languageCode, configGen }`. The per-render auto-id
  counter is a CLOSURE variable owned by the renderer instance (was an
  App-level `useRef` reset each render — identical behaviour: starts at 0 each
  pass, persists across the section loop). The dispatch is byte-for-byte the
  prior switch: registry exercise → accordion-wrapped lazy element; `Group` →
  sub-accordions or tabs (`displayAsTabs`); `Section` → static shell (note the
  legacy double `-Section-Section` id suffix — preserved exactly); `Explanation`
  / `PhraseTable` → special cases; `HIDE…` prefix → nothing; else → lazy custom
  component (missing key → "not implemented" notice). The `-Group-Accordion`
  branch is preserved but no current LO data-exercises it.
- **`src/App.jsx`** (~450 lines) — thin composition root: state reducer, mount
  effect (route normalize + index/shared-settings load + LO resolve + config
  load), `loadConfig`/`loadIndex`, modal-link hook wiring, dark toggle, hash
  deep-link effect, then the render body builds ONE renderer per pass
  (`createRenderer({ currentLearningObject, languageCode, configGen })`) and
  calls `renderer.renderComponent(...)` per top-level section. DO NOT disturb
  `configGen` (woven into exercise host keys = remount mechanism), `prevConfigRef`,
  or `mountedRef`. Sole remaining class = `ExerciseErrorBoundary` (by design).

## BACKLOG — ranked by ROI (none mandated; pick per budget)

1. **CSS cascade-layer migration** (BIG / risky — the main thing left).
   `src/index.css` still has ~321 ID-scoped, largely **unlayered** legacy rules
   (e.g. `#content :where(p,li,td…)`, `#content a`) that sit cascade-ABOVE
   Tailwind utilities, so a `text-*`/`bg-*` utility silently "does nothing" and
   only `!important` fixes it. Fix = wrap each offending rule in `@layer base`;
   utilities then win cleanly. Migrate incrementally, NOT in one PR. See
   `docs/process/TAILWIND_V4.md` for the debt table + fixes already applied.
   Style-only → browser-verify visually (no `!important` regressions), but
   cheaper than render-critical JS work.
2. **`createRenderer` unit tests** (LOW effort, now unblocked). #37 made the
   dispatch importable. Test `createRenderer(ctx).renderComponent(node, articles,
   id, {})` by inspecting the React elements pushed into `articles` — same
   element-inspection style as `src/render/lazyRegistry.test.js` (no rendering,
   no testing-library). Assert: `HIDE…` key → `articles` stays empty; registry
   exercise → accordion-wrapped Suspense element; custom key → lazy custom under
   Suspense; missing key → resolves to the "not implemented" notice. This
   finally covers the HIDE→nothing + accordion-wrap assertions deferred in #36.
3. **Per-topic custom split** (LOW ROI — skip unless asked). `custom.js` is one
   chunk (~7.6 KB) already deferred off initial load. Per-topic split needs an
   explicit key→loader map (enumeration churn / drift). Marginal.

## KEY FACTS / GOTCHAS (carried forward)

- **Base + assets**: `base` is env-driven (`VITE_BASE_PATH || './'`). Prod:
  `build:server` = `/projects/french-basic/`, `build:live` =
  `/french/french-basic/`. ALWAYS fetch runtime assets through `resolveAsset(...)`
  (`src/utils/assets.js`) — a root-absolute fetch 404s under the non-root deploy
  bases (that was bug #35). Hosted at lcdev + lcitc under
  `/french/french-basic/`.
- **`vite preview` quirk (not a bug)**: under default `./` base, the slug URL
  rewrite makes `resolveAsset`'s relative `./src/...` resolve against `/<slug>/`,
  so config fetches 404 → SPA-fallback HTML → "Unexpected token '<'" console
  errors. Does NOT happen under the absolute server/live bases. The dev server
  (`french-dev`, port 5174) renders LOs natively and is the easiest + cheapest
  functional check. For a prod base-resolution check use `french-preview-server`
  (4174, `VITE_BASE_PATH=/projects/french-basic/`) → navigate
  `/projects/french-basic/?lo=1&skipCookieControl=1`.
- **`.claude/launch.json` is gitignored** — `french-preview` (4173) and
  `french-preview-server` (4174) configs are LOCAL only. Recreate if needed.
- **GateGuard fact-force**: fires on first Bash, first edit of EACH new file
  path, and doc edits. Present facts (importers via grep, public symbols, data
  I/O field names, verbatim instruction), then RETRY the same op. Recovery:
  `ECC_GATEGUARD=off`.
- **config-protection hook**: may block `vite.config.js` / `eslint.config.js`
  edits (not other files). Legitimate build-config changes are sanctioned by the
  hook's own message.
- **Pre-commit guards** (typography/color/a11y/SCSS/image) run on commit — pass
  on clean code. Attribution disabled (no Co-Authored-By) — matches history.
- **CI**: a single `quality` GitHub Action check runs on the PR (~50s). Wait for
  it before `gh pr merge <n> --squash --delete-branch`. Doc-only handover commits
  have historically gone DIRECT to main (e.g. `e1845bb`), no PR.
- **Lint discipline**: `no-unused-vars` is ERROR (`varsIgnorePattern ^[A-Z_]`).
  Moving code between modules orphans imports — run `yarn eslint --fix` on touched
  files, then `yarn lint`. `sort-imports` reorders members; don't anchor edits on
  exact import strings.
- Session may boot CAVEMAN MODE (terse replies); code/commits/PRs stay normal.
  "stop caveman" to disable.

## COST NOTE

This session ran high (~$65+, much of it the required render-critical browser
verification for #37). START A FRESH SESSION for the next item. The CSS work
(item 1) is style-only — visual browser verify, cheaper than render-critical JS.
The `createRenderer` tests (item 2) are pure element-inspection — no browser
verify needed.
