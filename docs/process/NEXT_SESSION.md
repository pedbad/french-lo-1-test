# Next session handover — Bundle splitting (JS 950 KB → smaller initial load)

Continue work in `/Users/ped/Sites/french/french-lo-1-test` (branch: main).

TASK: Reduce the initial JS bundle. `yarn build` currently emits
`dist/src/main.js` at **950.37 KB (gzip 254.65 KB)** and warns "Some chunks are
larger than 500 kB". Goal: kill that warning and cut initial-load JS via vendor
chunk-splitting and/or route/component lazy-loading. ONE PR (next # is 34), then
stop.

RENDER-CRITICAL: this changes how the app loads. **Browser verify is required**
(preview tools) — not optional. Build + tests + lint are necessary but not
sufficient.

READ FIRST: `git status && git pull --ff-only`. Confirm "up to date with
origin/main" (NOT "ahead N") before branching. Branch e.g. `perf/bundle-split`.

## STATE (verify with git)
- main green: PR #33 merged (squash `fe28cdb`, ESLint 42→0 warnings).
- `yarn lint` → 0 errors / 0 warnings. `yarn test:run` → 95/95. `yarn build` →
  clean except the >500 KB chunk advisory (that advisory IS the target).
- Build output today: `dist/src/main.js` 950.37 KB (gzip 254.65),
  `dist/src/main.css` 268.89 KB (gzip 38.66), `dist/index.html` 2.15 KB.
- App.jsx is 868 lines and holds `renderComponent` / `wrapInShell` /
  `EXERCISE_REGISTRY` — the natural code-split seam for lazy exercises.

## KEY FACTS FROM vite.config.js (already read — don't re-derive)
- `build.rollupOptions.output` is ALREADY customized with FIXED filenames (no
  content hash): `entryFileNames`/`chunkFileNames` = `src/[name].js`,
  `assetFileNames` = `src/[name].[ext]`. → `manualChunks` goes inside this
  existing `output` block. New vendor chunks will be emitted as `src/<name>.js`.
  NOTE the no-hash scheme is intentional (server-embedded deploy); keep it.
  Watch for chunk-name collisions when adding many manualChunks (give explicit
  stable names).
- `base` is env-driven: `VITE_BASE_PATH || './'`. Prod server builds use
  `build:server` (`/projects/french-basic/`) and `build:live`
  (`/french/french-basic/`). Lazy/dynamic-import chunk URLs resolve against
  `base` — VERIFY lazy chunks load under a non-root base, not just `./`.
- Debug pages (`debug-sandbox.html` etc.) are ALREADY excluded from prod unless
  `VITE_INCLUDE_DEBUG=true`. So the 950 KB is the real app — debug is NOT the
  culprit. Don't chase it.
- A `generateSlugRoutes` closeBundle plugin copies `dist/index.html` into each
  LO slug dir. Whatever the entry HTML references (modulepreload + entry) must
  stay correct after splitting — re-check `dist/index.html` after build.

## HEAVY DEPENDENCIES (candidates — confirm before splitting)
react 19 + react-dom · `motion` ^12 (large; framer-motion successor) ·
10× `@radix-ui/react-*` · `dompurify` ^3 · `lucide-react` · `@headlessui/react`
· `class-variance-authority` / `clsx` / `tailwind-merge`.

## RECOMMENDED APPROACH (smallest-risk first)
0. **MEASURE FIRST — do not guess.** Add `rollup-plugin-visualizer` as a
   devDep, wire it into the build temporarily (or run a one-off), open the
   treemap, and identify the actual top contributors. Remove the temp wiring
   before the PR (or gate it behind an env flag). Reason: `motion`/radix sizes
   are assumptions until measured.
1. **manualChunks vendor split (low risk, no app-code change).** In
   `rollupOptions.output.manualChunks`, peel react/react-dom, radix, motion,
   dompurify into named chunks. This parallelizes loading + improves caching and
   usually clears the >500 KB warning, but does NOT reduce total eager bytes.
2. **Lazy-load real byte savings (higher value).** `React.lazy` +
   `<Suspense>` for exercise components keyed off `EXERCISE_REGISTRY` so a given
   learning object only downloads the exercise types it uses. Dynamically
   `import()` `motion` / animation-heavy code paths if they aren't needed on
   first paint. This is where initial JS actually drops.
   - Cleaner if App.jsx render module is extracted to `src/render/` first
     (backlog item B in FUTURE_PROJECTS) — OPTIONAL, decide based on churn.
3. Re-run `yarn build`; confirm warning gone and main entry chunk shrunk.

## GOTCHAS (from prior sessions)
- **config-protection hook**: it BLOCKED editing `eslint.config.js` last session
  ("fix source instead of weakening config"). It MAY also block `vite.config.js`.
  Adding `manualChunks` is a LEGITIMATE build-config change — if blocked, the
  hook's own message sanctions: "disable the config-protection hook temporarily."
  Do that only for the vite.config.js edit; don't weaken lint config.
- **GateGuard fact-force**: fires on first Bash, first edit of EACH new file
  path, and doc edits. Present facts (importers via grep, public symbols, data
  I/O, verbatim instruction), then RETRY the same op. It clears per-path on the
  retry. Recovery: `ECC_GATEGUARD=off` or add
  `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS`.
- Pre-commit guards (typography/color/a11y/SCSS/image) run on commit — pass on
  clean code.
- Attribution disabled (no Co-Authored-By) — matches repo history.
- Session may boot CAVEMAN MODE (terse replies); code/commits/PRs stay normal.
  "stop caveman" to disable.

## GATES (this PR)
- `yarn build` → no >500 KB chunk warning; main entry chunk meaningfully
  smaller; `dist/index.html` still valid.
- `yarn test:run` → 95/95. `yarn lint` → 0/0.
- **Browser verify (required, render-critical):** preview_start, load the app,
  confirm a learning object renders, exercises mount (Suspense fallback resolves,
  no console errors / failed chunk requests), check network panel shows the new
  chunks loading. Test under a non-root base if feasible.
- Branch → commit → PR to main → squash-merge
  (`gh pr merge 34 --squash --delete-branch`).

## AFTER THIS / BACKLOG (none mandated) — docs/process/FUTURE_PROJECTS.md
- B. App.jsx render module extraction → `src/render/` (~330 lines; only this
  gets App.jsx under 800). Render-critical. May pair naturally with lazy split.
- A. data-loading hook `useLearningObject`. Render-critical.
- CSS cascade-layer migration (~321 unlayered rules; big/risky).
- Render-path test coverage.

## COST NOTE
Prior session (the #33 lint cleanup) ended at ~$89 with heavy context. START
THIS IN A FRESH SESSION with this file as the opening prompt. Measure → split →
verify → PR. Keep context lean.
