# Next session handover

Continue work in `/Users/ped/Sites/french/french-lo-1-test` (branch: main).

READ FIRST: `git status && git pull --ff-only`. Confirm "up to date with
origin/main" (NOT "ahead N") before branching.

## STATE (verify with git)

- main green at `f199d38`. Two PRs merged THIS session:
  - **#34** (`2b98ac3`) — bundle split: vendor `manualChunks` + `React.lazy`
    exercises/custom. Entry `main.js` **950.37 KB → 474.69 KB** (gzip 254.65 →
    103.11). The ">500 kB chunk" warning is GONE. No circular-chunk warning.
  - **#35** (`f199d38`) — fixed `fetch("/shared-settings.json")` →
    `fetch(resolveAsset("/shared-settings.json"))` so it resolves under the
    per-project base instead of 404ing at domain root.
- `yarn lint` → 0/0. `yarn test:run` → 95/95. `yarn build` → clean (no chunk
  warning). All verified at session end.
- App.jsx is now ~915 lines (lazy registries + Suspense helpers added). Still
  > 800 — the render-module extraction backlog item (below) is the only thing
  that gets it back under 800.

## WHAT THE BUNDLE SPLIT LOOKS LIKE NOW (don't re-derive)

- `vite.config.js` → `build.rollupOptions.output`:
  - `manualChunks(id)`: React + Radix + floating-ui + their deps go to ONE
    `react-vendor` chunk (kept together ON PURPOSE — splitting React from Radix
    produced a `Circular chunk` warning). `dompurify`, `lucide-react` (`icons`),
    and `clsx`/`cva`/`tailwind-merge` (`ui-utils`) are separate; everything else
    → `vendor`.
  - `chunkFileNames` is a FUNCTION (not a string): names code-split chunks after
    their parent directory (`src/DraggableFillGaps.js`, `src/custom.js`) so they
    don't collide on `index.js` under the hash-free scheme. Keep filenames
    hash-free (server-embedded deploy) — do not reintroduce `[hash]`.
- `src/App.jsx`: `EXERCISE_REGISTRY` entries are `lazyExercise(() => import(...))`;
  custom components resolve via `getLazyCustomComponent(name)` (one lazy
  `@/components/custom` chunk, memoised per key). Both render through
  `withLazyBoundary(node, key)` = per-component `<Suspense>` with
  `<LazyComponentFallback/>`. `motion` is a dependency but UNUSED in the bundle —
  do not waste time splitting it.
- Per-LO behaviour confirmed in browser: an LO downloads ONLY the exercise types
  it renders (LO1 pulled `DraggableFillGaps.js` + `WordOrderExercise.js`, not all
  twelve). `custom.js` loads on demand.

## BACKLOG — ranked by ROI (none mandated; pick per budget)

1. **Perf is mostly done.** The big wins are merged. Remaining items are
   maintainability/safety, not user-facing speed.
2. **Render-path test coverage** (MEDIUM value). `renderComponent` /
   `renderComponentForTab` / the lazy+Suspense dispatch in App.jsx have no unit
   tests, and #34 changed them. Add tests asserting: registry exercise →
   accordion-wrapped lazy element under Suspense; custom key → lazy resolve;
   `HIDE*` → nothing; missing key → "not implemented". Vitest + jsdom already
   configured (`src/**/*.{test,spec}.{js,jsx}`).
3. **App.jsx render-module extraction** (MEDIUM effort, maintainability only).
   Pull `renderComponent` / `renderComponentForTab` / `wrapInShell` /
   `EXERCISE_REGISTRY` / lazy helpers into `src/render/`. Only this gets App.jsx
   back under the 800-line ceiling. Render-critical → browser verify required.
4. **Per-topic custom split** (LOW ROI — skip unless asked). `custom.js` is one
   chunk for all grammar+pronunciation topics, but it's only ~7.5 KB and already
   deferred off initial load. Splitting per-topic needs an explicit
   key→loader map (enumeration churn + drift risk vs the current `import *`
   registry). Marginal win.
5. CSS cascade-layer migration (~321 unlayered rules; big/risky). See
   `docs/process/FUTURE_PROJECTS.md`.

## KEY FACTS / GOTCHAS (carried forward)

- **Base + assets**: `base` is env-driven (`VITE_BASE_PATH || './'`). Prod builds:
  `build:server` = `/projects/french-basic/`, `build:live` =
  `/french/french-basic/`. ALWAYS fetch runtime assets through
  `resolveAsset(...)` (`src/utils/assets.js`) — a root-absolute fetch 404s under
  the non-root deploy bases (that was bug #35). `index-fr.json`,
  `lo-config/*.json` (via `viteStaticCopy`) and `shared-settings.json` (via
  `public/`) all live UNDER the base.
- **`vite preview` quirk (not a bug)**: under the default `./` base, the slug URL
  rewrite (`normalizeLearningObjectUrl` → `replaceState` to `/<slug>/`) makes
  `resolveAsset`'s relative `./src/...` resolve against `/<slug>/`, so config
  fetches 404 → SPA-fallback HTML → "Unexpected token '<'" console errors. This
  does NOT happen under the absolute server/live bases. To browser-verify a prod
  build, use the `french-preview-server` launch config (serves with
  `VITE_BASE_PATH=/projects/french-basic/`) and navigate to
  `/projects/french-basic/?lo=1&skipCookieControl=1`. The dev server
  (`french-dev`, port 5174) renders LOs natively and is the easiest functional
  check.
- **`.claude/launch.json` is gitignored** — the `french-preview` (4173) and
  `french-preview-server` (4174) configs added this session are LOCAL only, not
  committed. Recreate if needed (`yarn preview` /
  `sh -c "VITE_BASE_PATH=... yarn preview"`).
- **GateGuard fact-force**: fires on first Bash, first edit of EACH new file
  path, and doc edits. Present facts (importers via grep, public symbols, data
  I/O field names, verbatim instruction), then RETRY the same op. Clears per-path
  on retry. Recovery: `ECC_GATEGUARD=off`.
- **config-protection hook**: may block `vite.config.js` / `eslint.config.js`
  edits. Legitimate build-config changes are sanctioned by the hook's own
  message ("disable the config-protection hook temporarily") — do that only for
  the specific file, don't weaken lint config. (It did NOT block the #34
  vite.config edits this session.)
- **Pre-commit guards** (typography/color/a11y/SCSS/image) run on commit — pass
  on clean code. Attribution disabled (no Co-Authored-By) — matches history.
- **CI**: a single `quality` GitHub Action check runs on the PR (~50s). Wait for
  it before `gh pr merge <n> --squash --delete-branch`.
- Session may boot CAVEMAN MODE (terse replies); code/commits/PRs stay normal.
  "stop caveman" to disable.

## COST NOTE

This session ran long (~$130, much of it the required render-critical browser
verification across dev + two prod bases). START A FRESH SESSION for the next
item. For render-critical changes, browser verify is REQUIRED — but verify
functional render on the dev server (5174) and reserve the prod server-base
preview (4174) for the final base-resolution check.
