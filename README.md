# French Learning Object (React + Vite)

This is a React + Vite app for French learning objects. It uses Tailwind CSS v4 and shadcn tokens for styling.

# 🚀 Getting Started

## Install Node + Yarn

- Install Node: https://nodejs.org/en/download/
- Install Yarn: https://classic.yarnpkg.com/lang/en/docs/install/

## Install dependencies

```bash
yarn install
```

## Run app

```bash
yarn dev
```

By default the app is served from the current path (portable base). Example:

```
http://localhost:5173/first-contact/
```

Runtime LO routing is now slug-path based and French-only for this app:

- canonical LO URLs: `/first-contact/`, `/about-me/`, ...
- no `?lang=` parameter is required or read at runtime
- index/config sources are fixed to:
  - `src/index-fr.json`
  - `src/lo-config/*.json`

## Dev-Only Debug Sandbox

Debug/sample UI has been moved out of the production app tree into a dedicated sandbox page.

Why:
- Hidden debug markup in `App.jsx` still ships in rendered DOM and appears in copied HTML validation payloads.
- This creates validator noise and makes production markup harder to reason about.
- A dedicated sandbox keeps developer test fixtures available without polluting user-facing HTML.

How to use:

```bash
yarn dev
```

Then open:

```
http://localhost:5173/debug-sandbox.html
```

Base-path behavior (`vite.config.js`):
- default: `VITE_BASE_PATH` unset -> `base: './'` (portable deploy; folder name does not matter)
- optional override: set `VITE_BASE_PATH` (for example `/projects/french-basic/`) when environment requires fixed mount path.

Examples:

```bash
# portable build (recommended default)
yarn build

# fixed-path build (optional)
VITE_BASE_PATH=/projects/french-basic/ yarn build

# fixed-path build via package script (recommended for server deploys)
yarn build:server
```

Files:
- `/Users/ped/Sites/french/french-lo-1/debug-sandbox.html`
- `/Users/ped/Sites/french/french-lo-1/src/debug/sandbox-main.jsx`
- `/Users/ped/Sites/french/french-lo-1/src/debug/DebugSandbox.jsx`

### Build behavior

- `yarn build`:
  - builds the main app only (no debug page in `dist`)
- `yarn build:server`:
  - builds the main app for `/projects/french-basic/` mount path
  - emits absolute asset URLs that are safe for slug-route deep links on Apache
- `yarn build:with-debug`:
  - builds main app + debug page in `dist/debug-sandbox.html`
  - debug entry is enabled via `VITE_INCLUDE_DEBUG=true`
- `yarn build:server:with-debug`:
  - builds main app + debug page for `/projects/french-basic/`
  - includes `dist/debug-sandbox.html` for server-side diagnostics

Sandbox includes:
- LO navigation links for all French Basic learning objects.
- Full app color-token inventory (token names + light/dark resolved values + swatches).
  - Includes source-reference status (`Used` / `Unused`) based on `var(--token)` usage in `src/` (excluding `src/debug/`), shown with outlined shadcn `Badge` pills for stronger contrast.
- Full app font-token and `@font-face` inventory with `Used` / `Unused` status.
- SVG asset inventory rendered in shadcn `Card` components, with per-asset preview, source-file references, and found/missing status.
  - Implemented as a manifest snapshot (not browser-time source scanning) to keep debug sandbox loading stable across Vite/base-path differences.
- A per-LO structure summary (sections, accordion titles, and exercise component types) for quick content QA.
  - UI pattern: each LO renders as one row with the index link first and its structure accordion immediately next to it.
  - Structure panels now use the shared shadcn/Radix accordion primitive (`src/components/ui/accordion.jsx`) instead of native `details/summary`.
  - Accordion content uses ordered lists (`ol`) with item counts (for example exercise entries) to make auditing easier.
  - Data is loaded via runtime JSON fetch (matching app config loading) to keep debug entry stable with Vite base-path handling.

Debug sandbox guardrails:
- Panels should fail independently (show local error text) so one broken diagnostic module does not blank the page.
- Prefer direct component imports in debug code over app-wide barrels to reduce module-graph coupling.
- Keep debug inventories deterministic (manifest/snapshot) when runtime source scanning is unstable in dev.

Troubleshooting (stale Vite HMR overlay after asset deletes):
- If you see an ENOENT overlay for an old file that was already removed, restart dev with a forced scan:

```bash
yarn dev --force
```

- If it persists, clear Vite cache and restart:

```bash
rm -rf node_modules/.vite
yarn dev --force
```

## Build app

```bash
yarn build
```

## Apache Routing + SEO (Current Project)

This project now uses canonical slug-path URLs for learning objects, for example:

- `/first-contact/`
- `/about-me/`

Why:
- cleaner, human-readable URLs
- better crawl/index behavior than query-only routing
- clearer canonical route strategy for SEO

Apache requirement:
- for SPA slug routes, Apache must rewrite unknown paths to `index.html`
- static assets (`src/*.js`, `src/*.css`, `img/*`, `audio/*`, JSON files) must be excluded from rewrite

Use `.htaccess` in the deploy folder. This repo now ships a ready-to-deploy file at:

- `/Users/ped/Sites/french/french-lo-1/public/.htaccess`

`Vite` copies `public/.htaccess` into `dist/.htaccess` during build, so DevOps can deploy it as-is.

Default content:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /projects/french-basic/

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]
```

### Apache Troubleshooting (if slug URLs still 404)

If landing page works but `/first-contact/` returns 404:

1. Ensure `.htaccess` is in the same directory as deployed `index.html` (`/projects/french-basic/`).
2. Verify `.htaccess` is being applied:
   - add a temporary invalid line like `THIS_SHOULD_BREAK`
   - reload `/projects/french-basic/`
   - if you do **not** get HTTP 500, Apache is ignoring `.htaccess` (likely `AllowOverride None`)
3. If `.htaccess` is ignored, use VirtualHost/Directory rewrite config instead:

```apache
<Directory /var/www/html/projects/french-basic>
  AllowOverride None
  Require all granted
  Options -MultiViews
  RewriteEngine On
  RewriteBase /projects/french-basic/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /projects/french-basic/index.html [L]
</Directory>
```

4. Re-test these URLs:
   - `/projects/french-basic/`
   - `/projects/french-basic/first-contact/`
   - `/projects/french-basic/src/lo-config/first-contact.json`

No-rewrite fallback URL (temporary):
- `/projects/french-basic/?lo=first-contact`

Full deployment checklist is in:
- `/Users/ped/Sites/french/french-lo-1/docs/deployment/DEPLOTMENT.MD`

## Future Projects: Avoiding `.htaccess` for New Language Series

If you want to ship a Spanish LO series without server rewrites, choose one of these architectures from day one:

1. Pre-rendered/static route files (recommended if SEO matters and hosting is static-only)
- Build real HTML per route (`/es/first-contact/index.html`, etc.).
- No runtime SPA fallback rewrite needed.
- Best no-rewrite SEO option.

2. Query routing only (`/?lo=first-contact`)
- No rewrite needed.
- Lower SEO quality than path routes.

3. Hash routing (`/#/first-contact`)
- No rewrite needed.
- Usually weakest SEO/readability tradeoff.

Pragmatic recommendation for future multilingual projects:
- use a framework with file-based static generation (for example Next.js static export, Astro, or another SSG pipeline)
- generate per-language/per-LO route files at build time
- host as plain static files with no rewrite dependency

## Typography Guardrails

To prevent new hardcoded typography drifting back into SCSS/JSX, this repo includes a typography guard script.

Current policy:
- Blocks `font-size` with literal `px/rem/em` values in new lines.
- Blocks `line-height` with literal `px/rem/em` values in new lines.
- Allows `font-family` only when tokenized, e.g. `font-family: var(--font-sans);`.
- Blocks literal `font-family` declarations in new lines.
- Exception: allows literal `font-family` only in `src/styles/fonts.css` for `@font-face` registration.

### One-time setup (local pre-commit hook)

```bash
bash scripts/setup-githooks.sh
```

This configures git to use `.githooks/` in this repo, where pre-commit runs:

```bash
yarn -s check:typography
yarn -s check:color
yarn -s check:a11y
yarn -s check:scss
yarn -s check:image-path
```

### Manual checks

Check staged changes:

```bash
yarn check:typography
```

Check all changes introduced by your branch vs `origin/main`:

```bash
yarn check:typography:branch
```

Lint only changed JS/TS files (avoids blocking on historical repo-wide lint baseline):

```bash
yarn lint:changed
```

Lint only staged JS/TS files:

```bash
yarn lint:changed:staged
```

Run the recommended local pre-push gate:

```bash
yarn prepush:local
```

## Color Guardrails

To prevent literal color drift back into components, this repo includes a color guard script.

Current policy:
- Blocks added hex colors (for example `#fff`, `#ffcc00`) outside allowlisted files.
- Blocks added named colors (`black`, `white`, `red`, etc.) outside allowlisted files.
- Blocks added color functions without token indirection (for example `rgb(...)`, `oklch(...)` without `var(--...)`).
- Allows tokenized color usage via `var(--...)`.
- Allowlist is file-scoped via `scripts/color-allowlist.txt` (currently `src/index.css`).

### Manual checks

Check staged changes:

```bash
yarn check:color
```

Check all changes introduced by your branch vs `origin/main`:

```bash
yarn check:color:branch
```

## Image Path Guardrails

To prevent legacy path drift and filename/path issues, this repo includes an image path guard.

Current policy:
- Blocks new files added under `public/images/` (legacy location).
- Validates new files under `public/img/`:
  - ASCII-only paths
  - lowercase only
  - no spaces
  - allowed extensions: `png`, `jpg`, `jpeg`, `svg`, `webp`, `gif`, `avif`
- Blocks newly added source references to legacy paths (`images/` or `/images/`) in staged diffs.

Manual checks:

```bash
yarn check:image-path
yarn check:image-path:branch
```

Image migration docs:
- `/Users/ped/Sites/french/french-lo-1/docs/styling/IMAGE_MIGRATION_PLAN.md`
- `/Users/ped/Sites/french/french-lo-1/public/img/README.md`

## Accessibility & HTML Guardrails

To prevent common W3C/a11y validation regressions from being introduced, this repo includes an accessibility/HTML guard script.

Current policy (added lines only):
- Blocks `role="button"` on `<header>`.
- Blocks `aria-label` on `<span>`.
- Blocks `aria-label` on `<div>` without an explicit non-generic role.
- Blocks `title` attributes on `<svg>`.
- Blocks `<img src>` values containing spaces in path segments.
- Blocks repeated literal `id="..."` values within added diff lines.
- Blocks newly introduced duplicate literal `id="..."` attributes (compares staged index vs `HEAD` counts and fails when duplicates increase).

Why these checks matter:
- `role="button"` on non-button containers can degrade keyboard and screen-reader behavior.
- generic `aria-label` misuse on `span`/`div` adds accessibility noise and can violate HTML/ARIA conformance.
- duplicate literal IDs break anchor/ARIA/control targeting and produce unstable DOM behavior.
- bad image URL paths (spaces) can break asset loading depending on environment/encoding.
- SVG/title misuse is frequently validator-invalid when applied in the wrong place.

### Manual checks

Check staged changes:

```bash
yarn check:a11y
```

Check all changes introduced by your branch vs `origin/main`:

```bash
yarn check:a11y:branch
```

Typical workflow:

```bash
# one-time
bash scripts/setup-githooks.sh

# per change
git add <files>
yarn check:a11y
git commit -m "..."
```

Validator triage guidance:
- Fix first: invalid values (for example `align-items: space-between`, `word-break: keep-word`) and duplicate IDs.
- Usually noise in dev-source validation: Vite-injected `style type="text/css"` warnings, extension-injected scripts, and some `var(--token)` color parsing errors.
- Always re-check on production output (`yarn build && yarn preview`) in a clean browser profile.

## SelectExercise Migration Status

- Legacy `DropDowns` usage has been fully migrated in active FR configs.
- Canonical select interaction component is:
  - `src/components/SelectExercise/SelectExercise.jsx`
- Legacy `DropDowns` wrapper/component files were removed on 2026-03-09.
- Contract:
  - use `component: "SelectExercise"` in LO config
  - keep new behavior/config options in `SelectExercise` (single source of truth)

Table semantics policy (important):
- use flex/grid for layout and spacing.
- use `<table>` only when data is genuinely tabular.
- data tables must include semantic headers (`<th scope="...">`) and a caption.
- if a legacy layout table cannot be removed immediately, mark it `role="presentation"` as an interim mitigation.
- when reviewing WAVE output, `chrome-extension://...` table icons are scanner overlays, not app DOM.

Migration cascade policy:
- explicit layer order is declared in `src/index.css`: `@layer base, components, utilities`

Manual migration policy (status):
- LO2 pilot is complete on `SelectExercise`.
- FR config migration is now complete:
  - `DropDowns` -> `SelectExercise`
  - `AnswerTable` -> `TypedTransformExercise` or `DictationExercise` (based on activity type)
- Runtime legacy aliases for `DropDowns` and `AnswerTable` have now been removed from `App.jsx`.

## Exercise Component Naming & Semantic Refactor Plan

Current issue:
- some legacy exercise component names describe implementation details instead of learner interaction patterns (for example `Blanks`), which causes architecture drift and harder onboarding.

Direction:
- standardize exercise component names to behavior-first semantics (what learners do), not historical internals.
- keep config compatibility during migration with phased aliases, then remove deprecated names once all LOs are migrated.

Naming principles:
- prefer names like `InlineChoiceGroup`, `SelectExercise`, `DraggableFillGaps`, `ListeningOrder`, `Sortable` over generic/ambiguous names.
- avoid umbrella names that hide interaction intent (for example `Blanks` when activity is drag/drop fill).
- each component name should make expected UX clear from config alone.

Migration method:
1. inventory all exercise component usages across LO configs.
2. define target semantic names + mapping table (`legacy -> semantic`).
3. migrate one activity at a time with QA (desktop/mobile/a11y/audio).
4. document each migration in `CHANGES.md` and keep TODO/checklist trackers current.
5. only remove legacy aliases after full rollout.

Latest applied step:
- LO3 Exercise 1 (`dropdowns2`) now uses `InlineChoiceGroup` to match LO2 “Practise the verb”.
- `InlineChoiceGroup` row audio icon order is now left-first for consistency with the exercise layout standard.
- LO4 Exercise 2 (`dropdowns3`) now uses `InlineChoiceGroup` as `inlineChoiceGroup3`:
  - options are visible inline (better fit for short forms: `à`, `au`, `en`, `aux`, `dans le`)
  - rows use full sentence prompts (removed standalone prefix row)
  - added accordion-level instruction alert text with shared icon cues
  - enabled opt-in randomized practice via config:
    - `shuffleItems: true`
    - `sampleSize: 8`
  - behavior: a fresh random 8-item subset is shown on initial load and on reset.
- LO4 Exercise 3 (`dropdowns4`) now uses `SelectExercise` as `selectExercise3`:
  - aligns interaction model with LO2 “Answering Questions”
  - keeps audio-on-left + full-width select layout consistency
  - uses shared instruction icon cues for Check/Show/Reset flow.
- `InlineChoiceGroup` now supports optional randomized subset config (backward compatible):
  - `shuffleItems` (boolean, default false)
  - `sampleSize` (number, optional; if set, first N items from shuffled/ordered set are used)
  - `sampleOnReset` (boolean, optional, default true when `sampleSize` is set)
  - if omitted, existing exercises keep prior behavior (no shuffle/sampling).
- LO3 exercises 3/4/5 now use semantic names for typed-table activities:
  - `TypedTransformExercise` (adjectives/professions)
  - `DictationExercise` (listening + typing)
  - both currently run through shared `TextEntryExerciseRuntime` for low-risk migration parity.
  - `TypedTransformExercise` now uses global controls (`Check answers`, `Reset`, `Show answers`) with:
    - Enter-key submit support in input fields
    - preserved per-row diff feedback (`inserted`/`deleted`) after check
    - inline audio + masculine term layout (no separate listen column)
    - header icons (`Mars` / `Venus`) for masculine/feminine columns
  - `DictationExercise` now also uses global controls (`Check answers`, `Reset`, `Show answers`) with:
    - Enter-key submit support in input fields
    - left-side compact speaker icon
    - dictation normalization mode (punctuation/apostrophe/spacing tolerant, accents strict)
    - trimmed leading/trailing whitespace on check
    - stable row layout (fixed status slot and non-jittering input width)
- legacy `Blanks` activities across FR configs (`LO1-LO15` + `demo`) now use semantic `DraggableFillGaps`.
- runtime compatibility alias has now been removed from `App`; use `DraggableFillGaps` as canonical naming.
- LO1 exercise audio folders for former `phrases2/3/4` are now aligned to semantic names:
  - `draggableFillGaps2`
  - `draggableFillGaps3`
  - `draggableFillGaps4`
- Config wrapper/id naming cleanup is now extended across LO5+ and demo for consistency:
  - `dropdowns*` -> `selectExercise*`
  - `wordsIntoSlots*` -> `draggableFillGaps*`
  - `memorycards*` -> `memoryMatchGame*`
  - `answerTable*` -> `typedTransformExercise*` (or `dictationExercise*` for type-what-you-hear activities)
  - `groupTable1` -> `draggableFillGapsGroupTable1`
  - `radio2` -> `radioQuiz2`
- LO3 exercise instruction alerts now follow the same placement contract as LO1/LO2:
  - use accordion-level `informationTextHTML` in config
  - do not render child-level `Info` blocks inside typed exercise runtime (prevents spacing drift)

## LO3 Navigation Gap Fix

- Root cause: LO3 contains a top-level section `phraseTable5` with `titleText: ""`.
- The nav builder previously included any config section with `component + id`, even when the computed label was empty.
- This produced a blank nav item (visual gap) between `Vocabulary` and `Grammar`.
- Fix implemented in `src/components/MainMenu/MainMenu.jsx`:
  - nav entries now filter out empty/whitespace labels after label resolution.
- Contract going forward:
  - any top-level section intended for nav must provide non-empty `menuText` or `titleText`.
  - sections with empty labels are intentionally excluded from top navigation.
- keep new tokenized app styles in `@layer components` or `@layer utilities` (utilities last)
- avoid broad `!important`; use small temporary targeted overrides only during migration and remove them once legacy selectors are deleted

## SCSS Drift Guard

To prevent refactor backsliding, this repo includes:
- script: `/Users/ped/Sites/french/french-lo-1/scripts/check-scss-guard.sh`

Policy:
- blocks any `.scss` / `.sass` files under `src/` (zero-SCSS baseline enforcement)
- blocks newly added SCSS/SASS imports in `.js/.jsx/.ts/.tsx`

Concrete examples:
- adding `src/components/NewCard/NewCard.scss` in a PR fails the guard
- adding `import './NewCard.scss'` in `NewCard.jsx` fails the guard

Manual checks:

```bash
yarn check:scss
yarn check:scss:branch
```

## CI Quality Gates (GitHub Actions)

This repo now includes a PR workflow at:
- `/Users/ped/Sites/french/french-lo-1/.github/workflows/pr-quality.yml`

It runs on every pull request and enforces:
- `yarn build`
- `yarn lint`
- `yarn check:typography:branch`
- `yarn check:color:branch`
- `yarn check:a11y:branch`

For future projects, copy the reusable CI baseline from:
- `/Users/ped/Sites/french/french-lo-1/docs/process/FUTURE_PROJECTS.md` (section: **Out-of-the-Box GitHub Actions CI (Default)**)

## Migration Trackers

The active migration/audit trackers are:

- `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` (live checklist)
- `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_ISSUES.md` (current accordion risk analysis)
- `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md` (step-by-step migration plan + timeline)
- `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md` (accordion-specific completion tracker)
- `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md` (semantic DOM target, risks, and compatibility strategy)
- `/Users/ped/Sites/french/french-lo-1/docs/components/ANSWERTABLE_REFACTOR_TODO.md` (semantic split plan for generic `AnswerTable` usages)
- `/Users/ped/Sites/french/french-lo-1/docs/components/ANSWERTABLE_REFACTOR_CHECKLIST.md` (stepwise migration/QA checklist for AnswerTable variants)
- `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md` (phased implementation plan for `main > section > article`)
- `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md` (validation checklist for structure, nav, a11y, and regressions)
- `/Users/ped/Sites/french/french-lo-1/docs/styling/TYPOGRAPHY_PLAN.md`
- `/Users/ped/Sites/french/french-lo-1/docs/styling/COLOR_PLAN.md`
- `/Users/ped/Sites/french/french-lo-1/docs/a11y/HTML_ACCESSIBILITY_ISSUES.md`
- `/Users/ped/Sites/french/french-lo-1/docs/a11y/TABLE_AUDIT_PASS.md` (table semantics audit checklist + WAVE triage notes)
- `/Users/ped/Sites/french/french-lo-1/docs/process/FUTURE_LO_REFACTOR_CHECKLIST.md` (cross-LO checklist for audio, architecture, consistency, a11y, and docs sync)
- `/Users/ped/Sites/french/french-lo-1/docs/styling/FONTS_PROBLEM.md` (build asset duplication root-cause note)
- `/Users/ped/Sites/french/french-lo-1/docs/process/FUTURE_PROJECTS.md` (new-project blueprint + copy-only setup prompt)
- `/Users/ped/Sites/french/french-lo-1/docs/process/JSON_CONFIG_REFACTOR_AUDIT.md` (runtime-based JSON key audit baseline + LO1 findings)
- `/Users/ped/Sites/french/french-lo-1/docs/components/COMPONENT_ARCHITECTURE_AUDIT.md` (canonical component architecture audit, drift risks, target structure, phased plan)
- `/Users/ped/Sites/french/french-lo-1/docs/components/UTILITY_REFACTOR_README.md` (utility module architecture plan and compatibility approach)
- `/Users/ped/Sites/french/french-lo-1/docs/components/UTILITY_REFACTOR_TODO.md` (phased utility extraction tasks)
- `/Users/ped/Sites/french/french-lo-1/docs/components/UTILITY_REFACTOR_CHECKLIST.md` (batch/PR verification checklist for utility refactor)

DOM semantics contract (current migration target):
- one primary nav landmark for the main IA (`header > nav`), while preserving responsive behavior
- mobile dropdown remains responsive but should not be a second primary `nav` for the same links (use a region/container)
- avoid heading-order inversion (`h2` before page `h1`)
- hero is intentionally decorative page chrome outside `main` in this app; keep hero text non-heading and hero image decorative (`alt=""`, `aria-hidden="true"`)
- top-level learning areas under `main` should be semantic `section` landmarks (`dialogues`, `vocabulary`, `grammar`, `pronunciation`, `exercises`)

Recommended before push:

```bash
yarn prepush:local
```

## Configuring the learning object

There is an **index-fr.json** file which lists the various learning object configuration files. It is used to construct a navigation menu.

The **lo-config/\*.json** files define the component layout and phrases for each learning object.

JSON mapping decision (to prevent drift):
- migrate to slug-only config mapping (`<slug>.json`) as each LO is touched
- do not keep dual fallback mapping (`file` + `slug`) during migration
- each LO migration should rename file + update index + test in one pass
- content notation standardization (applies to all `src/lo-config/*.json`):
  - gender-inclusive compact forms use `(e)` (example: `marié(e)`, `né(e)`)
  - optional plurals use `(s)` with no leading space (example: `horse(s)`)
  - do not use mixed legacy styles (`.e`, `word (s)`)

## Styling

The app uses shadcn tokens for the base palette plus custom theme tokens in `src/index.css` as the single source of truth:

- `--page-background`
- `--hero-title-color`
- `--footer-background`

Typography is also normalized: root tokens (for example `--font-size-base`, `--line-height-body`, and semantic variants like `--line-height-app`) feed into shared selectors in `src/index.css` (`@layer base`), so production pages and the dev debug sandbox inherit the same heading/body scale from one source of truth.
- Section imagery (e.g., Grammar intro) is rendered via React components + Tailwind utilities, so JSON configs only describe content, not layout/styling.
- A shared type scale lives in `src/index.css` + `tailwind.config.js`, so font sizes/line heights can be tuned once and applied everywhere through Tailwind utilities instead of hardcoded pixels.
- Typography migration is now complete for the current scope: runtime usage is tokenized, Tailwind size mappings are token-backed, and legacy `--body-line-height` usage has been removed in favor of semantic `--line-height-*` tokens.
- Remaining design-system work is now focused on color consolidation and accessibility/HTML validity phases.
- Introduction + Grammar now use a dedicated hero-style Section so instruction text and imagery share the same baseline and card framing as the rest of the UI.
- Special anchors currently add a short delay before scrolling so accordion panels have time to expand; TODO: smooth that interaction so the highlight feels more immediate once we refactor the anchor logic.
- Modal links open a shadcn/Radix modal (no scrolling). The modal now accepts **React content** (not just HTML strings) so inline `AudioClip` components can render and function. For core grammar modals (e.g. `tuvous`, `madame`), it renders the same React content used in `CustomComponents_FR.jsx` so audio clips work and there’s no duplicated copy. JSON `infoTextHTML` is still used for simpler modal text. Optional highlight styles are applied via CSS animation and fade out after flashing.
- Link interaction contract (explicit, to avoid legacy overload):
  - top navigation uses `nav-scroll-link` and is scroll-only
  - top navigation hashes are semantic section IDs (`#introduction`, `#dialogues`, `#vocabulary`, `#grammar`, `#pronunciation`, `#exercises`)
  - content explanation links use `modal-link` and are modal-only
  - section headings now use semantic IDs (`${sectionId}-heading`) instead of legacy `modal-link-*` naming
- Critical LO JSON modal-link rule (W3C/validator-safe):
  - do not author modal links as direct fragment hashes such as `<a class='modal-link' href='#tuvous'>...</a>`
  - author modal links as:
    - `href="#content"` (safe in-page anchor that always exists)
    - `data-modal-target="tuvous"` (actual modal content key)
  - required pattern example:
    - `<a class='modal-link' href='#content' data-modal-target='tuvous'>vous</a>`
  - why: direct hash links in LO JSON were a major source of "Broken same-page link" accessibility alerts when validator tools parsed raw HTML before JS behavior overrides.
  - note: runtime normalization in `App.initialiseModalLinks` is only a defensive fallback; source JSON must still use the safe pattern.
- Engineering rule: one class, one behavior.
  - do not reuse a single class for both modal and scroll interactions.
  - this reduces accidental regressions, keeps event wiring predictable, and makes future refactors/debugging faster.
- Inline audio icons are normalized via CSS variables/rules in `src/index.css` to keep size and baseline alignment consistent across paragraph text.
- The Introduction `HeroSection` can opt out of the default card styling via `transparentCard`, so it can sit directly on the page background (no white card or border) while other sections remain carded.
- The Info panel now uses the Lucide `Info` icon (via `lucide-react`) instead of a custom masked SVG.
- The favicon now uses the eLearning logo SVG (from the footer) via `public/favicon.svg`.
- Added PNG favicon assets (16/32) plus Apple/Android icons and a `site.webmanifest` for broader device support.
- Theme toggling now temporarily disables CSS transitions to prevent visible flicker (notably in tables) during light/dark switches.
- Modal links use the Lucide `message-square-warning` icon for the inline indicator.
- WordParts now shows a circle-based progress row and inline icon guidance for Show answer/Reset.
- Hero banner now renders as a semantic `<img>` (`img/common/branding/fr-banner.svg`) inside `#hero` instead of a CSS background image. The hero uses a `16:9` aspect ratio with `object-fit: contain` so the full banner artwork remains visible across screen sizes (no `cover` cropping), while the title remains layered above the image.

## TODO

### Instruction Schema Unification (in progress)

- Problem: instructional content is currently authored across overlapping keys (`instructions*`, `information*`, `info*` legacy), which render through different component paths and cause typography/layout drift.
- Tracking doc: `/Users/ped/Sites/french/french-lo-1/INFORMATION_CONFIG_ISSUES.MD`
- Target contract:
  - section intro prose/layout: `instructionsLayout`
  - boxed guidance/alert text: `informationTextHTML` (or `informationText`)
- Migration approach:
  1. runtime compatibility adapter (legacy -> canonical mapping)
  2. JSON config migration in batches
  3. pre-commit schema guard to block deprecated keys

### LO2 Grammar Unification (in progress)

- Problem summary:
  - LO1 Grammar uses grouped structured content and consistent section framing.
  - LO2 Grammar previously used a single monolithic custom component (`LO2Grammar`) with nested accordion rendering, which diverged from LO1’s group-based architecture and caused spacing/interaction drift.
  - Modal links for LO2 subject pronouns currently resolve only the heading text in modal fallback mode.
- Target:
  - align LO2 Grammar look/feel and behavior with LO1 section architecture.
  - preserve LO2-specific pedagogy and audio while improving a11y semantics.
- Key docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/grammar/GRAMMAR_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/grammar/GRAMMAR_TASK_CHECKLIST.md`
- Current implementation decision:
  - short-term (done): LO2 Grammar now follows the same top-level architecture pattern as LO1:
    - `grammar.component` is a `Group` in LO2 config.
    - grammar items are split into `LO2Grammar1/2/3`.
    - each item is rendered through the shared app accordion pipeline (`AccordionArticle`) rather than nested custom accordions.
  - long-term (planned): introduce a shared shadcn-native `LessonAccordion` abstraction, then migrate LO sections to this single reusable API.
- Next planned steps:
  1. complete heading/table semantics cleanup to reduce accessibility "possible heading" and table-structure issues.
  2. add explicit modal content mapping for `subject-pronouns` so modal opens full explanatory guidance (not heading-only fallback).
  3. run audio consistency pass to ensure LO2 grammar/pronunciation uses the same `AudioClip` interaction style as LO1 where feasible.
  4. keep architecture parity checks for every LO grammar refactor:
     - verify config shape parity (`Group` vs monolithic custom component)
     - verify rendering path parity (app-level accordion pipeline, not nested bespoke accordions)
     - verify instruction block parity (same callout component + typography tokens)

### LO3 Grammar/Pronunciation Consistency Hardening (in progress)

- Applied LO1/LO2 parity rules in LO3 custom grammar/pronunciation content:
  - keep warning `Info` alerts adjacent to the exact rule they qualify.
  - preserve inline `AudioClip` behavior inside alerts where pedagogically needed (for example `médecin` exception).
- Spacing anti-drift rule reinforced:
  - when JSX sentences mix inline elements (`<strong>`, `<em>`, `AudioClip`), use explicit React spaces (`{' '}`) to avoid merged words.
- Emphasis single source of truth extended:
  - `src/index.css` now scopes amber emphasis consistently across both grammar and pronunciation section containers, while still supporting `grammar-term-em`.

### Long-term direction: Tailwind as the primary source of truth

What this means:

- Design tokens continue to live as CSS variables in `src/index.css`, but Tailwind utilities become the primary way those tokens are consumed.
- Layout, spacing, typography, and most component styling move to Tailwind classes (or small `@apply` utilities where needed).
- SCSS becomes minimal or legacy-only until fully migrated.

Why it is feasible here:

- Tokens already exist in `src/index.css`.
- Tailwind is configured to map those tokens in `tailwind.config.js`.

### Proposed migration path

1. Define boundaries: new work uses Tailwind; SCSS only for legacy until migrated.
2. Tokenize everything: ensure colors/spacing/radii/typography are mapped to Tailwind config or CSS vars.
3. Migrate layout first: intro, menus, simple grids, page wrappers.
4. Migrate component skins: replace component SCSS with Tailwind utilities.
5. Remove unused SCSS once a component is fully migrated.

### Proposed near-term changes

- Intro section layout in `src/App.jsx`: replace `intro-layout` and `intro-secondary` layout rules with responsive Tailwind classes.
- New or refactored layout wrappers should default to Tailwind for flex/grid and breakpoints.
- Migrate the custom accordion (`src/components/Accordion/*`) to shadcn/Radix Accordion; execution is tracked in `ACCORDION_CHANGES_TODO.md` with a debug-first rollout before main-app migration.
  - current status: debug migration and main-app cutover are complete via `src/components/Accordion/AccordionArticle.jsx`.
  - legacy app accordion container (`src/components/Accordion/Accordion.jsx`) was removed, and dead pathways (`window.refs`, `expandAllAccordions`, stale `expandNow`) were deleted.
  - naming cleanup: wrapper was renamed from `AppAccordionArticle` to `AccordionArticle`; root semantic tag is now `<article>`.
  - single-accordion default-open rule: top-level sections that contain exactly one accordion item auto-open on first load; persisted session state (`<id>-expanded`) still overrides this default when present.
- Special anchors currently wait ~500 ms before scrolling so accordion panels can expand; smoothing that interaction (without the lag) remains a TODO.

### Additional guidance (agreed)

Yes, this is correct with one nuance: keep design tokens in `src/index.css` as CSS variables, and map them into Tailwind via `tailwind.config.js` so Tailwind remains the primary interface for consumption.

1. Tailwind for all new development: New UI components and features should be styled with Tailwind utilities.
2. Consolidate design tokens: Centralize colors, spacing, typography, and breakpoints in `tailwind.config.js` and CSS variables in `src/index.css`.
3. Phased migration of existing SCSS: As components are touched, refactor their styles from SCSS into Tailwind utilities in JSX.
4. Deprecate custom SCSS: Gradually shrink SCSS to only rare, complex cases that can’t be expressed with utilities.
5. Use `@apply` strategically: Acceptable during transition, but the long-term goal is co-located Tailwind classes in markup.

## TODO: Styling Consolidation
The SCSS removal migration is complete: app styling is now CSS + Tailwind only, with global/component rules centralized in `src/index.css` and tokens in one place.

Proposed approach:
1. Inventory SCSS usage by component and tag each as migrate-now vs. legacy-keep.
2. For each migrate-now component, move layout/typography/spacing to Tailwind utilities and map any remaining values to tokens in `tailwind.config.js` or `src/index.css`.
3. Replace SCSS selectors with co-located Tailwind classes or shared `@apply` utilities (sparingly).
4. Remove the component’s SCSS once parity is reached and UI is visually verified.
5. Repeat in batches (start with high-traffic components: Accordion, PhraseTable, WordParts, Info).

Current SCSS footprint:
- `0` `.scss/.sass` files in `src`
- `0` SCSS imports in JSX/JS/TS/TSX

## Semantics

Semantic baseline updates are in place:
- Primary content uses `<main id="content">` as the landmark container.
- Top-level learning object blocks are rendered as semantic sections.
- Inline emphasis in rendered JSX uses semantic tags:
  - `<strong>` instead of `<b>`
  - `<em>` instead of `<i>`
- Abbreviations content in `CustomComponents_FR` now uses semantic definition-list markup (`<dl>`, `<dt>`, `<dd>`) instead of table-like structure.

Semantic emphasis policy (required):
- Do not author new `<b>` or `<i>` in config-authored HTML or JSX.
- Use `<strong>` and `<em>` so emphasis is semantic (meaning-level), not only visual.
- Why this matters:
  - assistive tech can convey emphasis more reliably from semantic tags than presentational tags;
  - semantic HTML is more maintainable and validator-friendly across future refactors;
  - consistency avoids rendering drift between content blocks authored in different files.
- 2026-02-18 normalization pass: FR learning-object config content was swept to remove remaining `<b>/<i>` usage. See `CHANGES.md` for the exact file list.
- Styling token contract:
  - `--emphasis-strong-color` and `--emphasis-em-color` in `src/index.css`.
  - applied to `main strong` / `main em` as a subtle color accent.
  - accessibility rule: color is supplemental only; `<strong>` still relies on weight and `<em>` still relies on italic styling.

Top-level learning object blocks (Introduction, Dialogues, Vocabulary, Grammar, Pronunciation, Exercises) should be rendered as `<section>` elements to improve semantic structure and landmark navigation.

Headings should avoid extra wrapper spans when the title is plain text; only `titleHTML` needs a wrapper for `dangerouslySetInnerHTML`.

Anchor ids/classes should live on the heading itself (e.g. the `<h2>`), not on an extra `<span>` wrapper.

Inline emphasis in rendered JSX should use semantic tags (`<strong>`, `<em>`) rather than presentational (`<b>`, `<i>`).  
For text that includes inline React components (for example `AudioClip` inside a sentence), prefer explicit React spaces (`{' '}`) instead of relying on incidental whitespace so sentence spacing remains stable.

## Tailwind Notes

If the Card component's className had included an explicit Tailwind border color utility class like
`border-border` or `border-border-subtle`, then changing the corresponding CSS variables (`--border` or
`--color-border-subtle` in `src/index.css`) would indeed be the "correct Tailwind way" to manage that border
color.

## Tooltips (shadcn/Radix)

Native `title` tooltips are replaced with shadcn-style tooltips for consistent theming.

- Tooltip component lives in `src/components/ui/tooltip.jsx` and uses Tailwind tokens (`bg-popover`, `text-popover-foreground`, `border-border-subtle`).
- The app is wrapped once with `TooltipProvider` in `src/App.jsx`.
- Vocabulary sort buttons **and** dialogue audio icons both wrap their triggers with `<Tooltip>`/`<TooltipContent>` so every hover state shows the same pale-green tooltip surface.
- Deep-linking (`.special-anchor`) opens the right accordion section, scrolls to the `.special-anchor-target`, and flashes it with a warm semantic highlight so anchored sections are impossible to miss.
- `.special-anchor` links use the same orange tone as the highlight, making the relationship between link and destination obvious.

## Audio UX

- Rows inside PhraseTable/Dialogue sections now forward clicks to the same audio clip as the speaker icon, so learners can tap anywhere in the row to hear the pronunciation.
- Audio playback now follows a single-active rule: when a new clip starts, any currently playing clip is paused first (across `AudioClip`, row-link playback, and `SequenceAudioController`).

## LO3 Audio Migration Status

- LO3 audio refs have been migrated from legacy `sounds/fr/...` to `audio/lo3/...` in:
  - `/Users/ped/Sites/french/french-lo-1/src/lo-config/origins-and-languages.json`
  - `/Users/ped/Sites/french/french-lo-1/src/components/custom/grammar/origins-and-languages-grammar.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/components/custom/pronunciation/origins-and-languages-pronunciation.jsx`
- New LO3 root:
  - `public/audio/lo3/...`
- Migration record:
  - `/Users/ped/Sites/french/french-lo-1/docs/audio/AUDIO_LO3_MIGRATION_MAP.md`
- Blocker record:
  - `/Users/ped/Sites/french/french-lo-1/docs/audio/LO3_AUDIO_BLOCKERS.md`
- Legacy cleanup:
  - removed LO3 legacy files from `public/sounds/fr` only when no remaining `src` references required them.

## LO4 Audio Migration Status

- LO4 audio refs have been migrated from legacy `sounds/fr/...` to `audio/lo4/...` in:
  - `/Users/ped/Sites/french/french-lo-1/src/lo-config/current-location.json`
  - `/Users/ped/Sites/french/french-lo-1/src/components/custom/pronunciation/current-location-pronunciation.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/components/custom/exercises/current-location-exercises.jsx`
- New LO4 root:
  - `public/audio/lo4/...`
- Migration record:
  - `/Users/ped/Sites/french/french-lo-1/docs/audio/AUDIO_LO4_MIGRATION_MAP.md`
- Blocker record:
  - `/Users/ped/Sites/french/french-lo-1/docs/audio/LO4_AUDIO_BLOCKERS.md`
- Legacy cleanup:
  - removed 59 LO4 legacy files from `public/sounds/fr` only when no remaining `src` references required them.
  - retained `sounds/fr/aimer.mp3`, `sounds/fr/jardin.mp3`, and `sounds/fr/peinture.mp3` because they are still referenced by non-LO4 content.

## Shared Table Variants

- `src/components/ui/table.jsx` now supports reusable table variants.
- `variant="learning"` centralizes learner-facing table look/feel (top spacing + row background/hover treatment).
- Current adopters:
  - `src/components/PhraseTable/PhraseTable.jsx`
  - `src/components/custom/grammar/current-location-grammar.jsx` (`LO4Grammar1`)
- Goal: reduce per-section table CSS drift by moving repeated styling into the shared shadcn table layer.

## Custom Component Extraction Status

- Active LO custom components are now extracted by domain under `src/components/custom/`:
  - `grammar/` (LO1-LO15 grammar components)
  - `pronunciation/` (LO1-LO12 pronunciation components in use)
  - `exercises/` (for example `CurrentLocationNasalRhymeExercise`)
  - `misc/` (for example `DailyRoutineASummersDay`, `AudioClipSamples`)
- Runtime registry source of truth:
  - `src/components/custom/registry.js`
- Legacy `CustomComponents_FR` bridge has been removed.
- Import custom component exports from:
  - `src/components/custom/index.js`
- Former monolith `src/components/CustomComponents_FR/CustomComponents_FR.jsx` has been removed.
  - any remaining custom/legacy exports now live under `src/components/custom/*`.
- Legacy composite custom files have been removed; active runtime paths now use semantic component names and semantic LO config ids.

## Separators (shadcn/Radix)

Divider lines now use the shadcn `Separator` component (`src/components/ui/separator.jsx`) so spacing and color are token-driven and consistent with the theme.

## Audio Path Fix (Accent Normalization)

Major filename issue: JSON uses composed accents, while disk has decomposed forms (e.g. Ç, è), which can break URL matching.
should be no accents, apostrophes, commas, exclamation marks!
stable prefix ordering: 001-..., 002-...

Some French audio filenames on disk use decomposed accents (NFD), while JSON references used composed accents (NFC). This mismatch caused 404s and `NotSupportedError` in the browser. The fix normalizes asset paths to NFD inside `resolveAsset` so the requested URL matches the actual filenames.

## LO1 Exercise Refactor (Listening Order)

LO1 listening exercises were refactored for consistency, clearer naming, and safer audio paths:

- Exercise ids/keys were renamed to behavior-based names:
  - `listeningOrder1`
  - `listeningOrder2`
  - `listeningOrder3`
- Exercises 5 and 6 now use the shared `SequenceOrder` interaction with:
  - swap-on-drop behavior
  - responsive layout (compact horizontal on medium, vertical on small)
  - consistent action buttons (`Check answers`, `Show answer`, `Reset`)
  - shared circle progress dots
- Exercise 7 (`Sortable`) was updated to use the same draggable card visual style (shared `SortableWordCard`) while keeping per-item audio clips.
- Exercise 7 feedback was simplified:
  - removed row-level check/cross markers
  - removed extra bottom success/error message text
  - progress dots update on `Check answers` (not during drag)
- Exercise 7 audio moved off legacy `sounds/fr/...` paths and into LO1 sectioned audio:
  - `public/audio/lo1/exercises/listeningOrder3/001-homme.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/002-hotel.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/003-hopital.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/004-horrible.mp3`
- Filenames for this activity are ASCII-safe to avoid accented-path issues.

## Badges

![Node](https://img.shields.io/badge/node-18.x-brightgreen)
![Vite](https://img.shields.io/badge/built%20with-vite-646cff.svg?logo=vite)
