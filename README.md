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

By default the app is served under `/french-basic/`. Example:

```
http://localhost:5173/french-basic/?lang=fr&lo=1
```

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
http://localhost:5173/projects/french-basic/debug-sandbox.html
```

Note: this repo currently sets `base: '/projects/french-basic/'` in `/Users/ped/Sites/french/french-lo-1-test/vite.config.js`, so local dev/preview URLs must include that prefix unless you explicitly override base for preview.

Files:
- `/Users/ped/Sites/french/french-lo-1-test/debug-sandbox.html`
- `/Users/ped/Sites/french/french-lo-1-test/src/debug/sandbox-main.jsx`
- `/Users/ped/Sites/french/french-lo-1-test/src/debug/DebugSandbox.jsx`

Sandbox includes:
- LO navigation links for all French Basic learning objects.
- Full app color-token inventory (token names + light/dark resolved values + swatches).
  - Includes source-reference status (`Used` / `Unused`) based on `var(--token)` usage in `src/` (excluding `src/debug/`), shown with outlined shadcn `Badge` pills for stronger contrast.
- Full app font-token and `@font-face` inventory with `Used` / `Unused` status.
- SVG asset inventory rendered in shadcn `Card` components, with per-asset preview, source-file references, and found/missing status.
  - Implemented as a manifest snapshot (not browser-time source scanning) to keep debug sandbox loading stable across Vite/base-path differences.
- A per-LO structure summary (sections, accordion titles, and exercise component types) for quick content QA.
  - UI pattern: each LO renders as one row with the index link first and its structure accordion immediately next to it.
  - Accordion content uses ordered lists (`ol`) with item counts (for example exercise entries) to make auditing easier.
  - Data is loaded via runtime JSON fetch (matching app config loading) to keep debug entry stable with Vite base-path handling.

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

Migration cascade policy (while SCSS still exists):
- explicit layer order is declared in `src/index.css`: `@layer base, components, utilities`
- keep new tokenized app styles in `@layer components` or `@layer utilities` (utilities last)
- avoid broad `!important`; use small temporary targeted overrides only during migration and remove them once legacy selectors are deleted

## SCSS Drift Guard

To prevent refactor backsliding while legacy SCSS is being removed, this repo includes:
- script: `/Users/ped/Sites/french/french-lo-1-test/scripts/check-scss-guard.sh`

Policy:
- blocks newly added `.scss` / `.sass` files
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
- `/Users/ped/Sites/french/french-lo-1-test/.github/workflows/pr-quality.yml`

It runs on every pull request and enforces:
- `yarn build`
- `yarn lint`
- `yarn check:typography:branch`
- `yarn check:color:branch`
- `yarn check:a11y:branch`

For future projects, copy the reusable CI baseline from:
- `/Users/ped/Sites/french/french-lo-1-test/FUTURE_PROJECTS.md` (section: **Out-of-the-Box GitHub Actions CI (Default)**)

## Migration Trackers

The active migration/audit trackers are:

- `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` (live checklist)
- `/Users/ped/Sites/french/french-lo-1-test/TYPOGRAPHY_PLAN.md`
- `/Users/ped/Sites/french/french-lo-1-test/COLOR_PLAN.md`
- `/Users/ped/Sites/french/french-lo-1-test/HTML_ACCESSIBILITY_ISSUES.md`
- `/Users/ped/Sites/french/french-lo-1-test/FONTS_PROBLEM.md` (build asset duplication root-cause note)
- `/Users/ped/Sites/french/french-lo-1-test/FUTURE_PROJECTS.md` (new-project blueprint + copy-only setup prompt)

Recommended before push:

```bash
yarn prepush:local
```

## Configuring the learning object

There is an **index-fr.json** file which lists the various learning object configuration files. It is used to construct a navigation menu.

The **learningObjectConfigurations/fr/\*.json** files define the component layout and phrases for each learning object.

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
- Inline audio icons are normalized via CSS variables/rules in `src/index.css` to keep size and baseline alignment consistent across paragraph text.
- The Introduction `HeroSection` can opt out of the default card styling via `transparentCard`, so it can sit directly on the page background (no white card or border) while other sections remain carded.
- The Info panel now uses the Lucide `Info` icon (via `lucide-react`) instead of a custom masked SVG.
- The favicon now uses the eLearning logo SVG (from the footer) via `public/favicon.svg`.
- Added PNG favicon assets (16/32) plus Apple/Android icons and a `site.webmanifest` for broader device support.
- Theme toggling now temporarily disables CSS transitions to prevent visible flicker (notably in tables) during light/dark switches.
- Modal links use the Lucide `message-square-warning` icon for the inline indicator.
- WordParts now shows a circle-based progress row and inline icon guidance for Show answer/Reset.
- Hero banner now renders as a semantic `<img>` (`images/fr_banner.svg`) inside `#hero` instead of a CSS background image. The hero uses a `16:9` aspect ratio with `object-fit: contain` so the full banner artwork remains visible across screen sizes (no `cover` cropping), while the title remains layered above the image.

## TODO

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
- Consider migrating the custom accordion (`src/components/Accordion/*`) to shadcn/Radix Accordion for easier future theming and consistency.
- Special anchors currently wait ~500 ms before scrolling so accordion panels can expand; smoothing that interaction (without the lag) remains a TODO.

### Additional guidance (agreed)

Yes, this is correct with one nuance: keep design tokens in `src/index.css` as CSS variables, and map them into Tailwind via `tailwind.config.js` so Tailwind remains the primary interface for consumption.

1. Tailwind for all new development: New UI components and features should be styled with Tailwind utilities.
2. Consolidate design tokens: Centralize colors, spacing, typography, and breakpoints in `tailwind.config.js` and CSS variables in `src/index.css`.
3. Phased migration of existing SCSS: As components are touched, refactor their styles from SCSS into Tailwind utilities in JSX.
4. Deprecate custom SCSS: Gradually shrink SCSS to only rare, complex cases that can’t be expressed with utilities.
5. Use `@apply` strategically: Acceptable during transition, but the long-term goal is co-located Tailwind classes in markup.

## TODO: Styling Consolidation
It’s bad because styling is split across SCSS and Tailwind, so changes require hunting in two systems, which slows updates and causes inconsistency; to fix it, we should migrate component styles into Tailwind utilities (or tokenized `@apply` classes), then delete legacy SCSS so tokens become the single, maintainable source of truth.

Proposed approach:
1. Inventory SCSS usage by component and tag each as migrate-now vs. legacy-keep.
2. For each migrate-now component, move layout/typography/spacing to Tailwind utilities and map any remaining values to tokens in `tailwind.config.js` or `src/index.css`.
3. Replace SCSS selectors with co-located Tailwind classes or shared `@apply` utilities (sparingly).
4. Remove the component’s SCSS once parity is reached and UI is visually verified.
5. Repeat in batches (start with high-traffic components: Accordion, PhraseTable, WordParts, Info).

Current SCSS footprint (49 files), grouped by area:
- Core UI/structure: `src/components/Accordion/Accordion.scss`, `src/components/AnswerTable/AnswerTable.scss`, `src/components/Attribution/Attribution.scss`, `src/components/Congratulate/Congratulate.scss`, `src/components/ErrorLog/ErrorLog.scss`, `src/components/Explanation/Explanation.scss`, `src/components/Explanation/Panel/Panel.scss`, `src/components/Figure/Figure.scss`, `src/components/Footer/Footer.scss`, `src/components/Header/Header.scss`, `src/components/IconButton/IconButton.scss`, `src/components/Image/Image.scss`, `src/components/Info/Info.scss`, `src/components/LandingPage/LandingPage.scss`, `src/components/LearningObjectMenu/LearningObjectMenu.scss`, `src/components/MainMenu/MainMenu.scss`, `src/components/Social/Social.scss`, `src/components/TopButton/TopButton.scss`
- Activities & exercises: `src/components/Blanks/Blanks.scss`, `src/components/Blanks/Word/Word.scss`, `src/components/ConnectFour/ConnectFour.scss`, `src/components/CrossWord/CrossWord.scss`, `src/components/DropDowns/DropDowns.scss`, `src/components/Jigsaw/Jigsaw.scss`, `src/components/Jigsaw/Piece/Piece.scss`, `src/components/MemoryMatchGame/MemoryMatchGame.scss`, `src/components/MemoryMatchGame/Card/Card.scss`, `src/components/Monologue/Monologue.scss`, `src/components/PhraseTable/PhraseTable.scss`, `src/components/RadioQuiz/RadioQuiz.scss`, `src/components/ReadAloud/ReadAloud.scss`, `src/components/Sortable/Sortable.scss`, `src/components/TreasureGrid/TreasureGrid.scss`, `src/components/WordGrid/WordGrid.scss`, `src/components/WordParts/WordParts.scss`
- Forms: `src/components/Form/DateField/DateField.scss`, `src/components/Form/Dialog/Dialog.scss`, `src/components/Form/FieldSet/FieldSet.scss`, `src/components/Form/OkCancel/OkCancel.scss`, `src/components/Form/Progress/Progress.scss`, `src/components/Form/RadioC/RadioC.scss`, `src/components/Form/Select/Select.scss`, `src/components/Form/TextField/TextField.scss`, `src/components/Form/TristateCheckBox/TristateCheckBox.scss`
- Media & audio: `src/components/AudioClip/AudioClip.scss`, `src/components/SequenceAudioController/SequenceAudioController.scss`
- Locale/flags/custom content: `src/components/CustomComponents_FR/CustomComponents_FR.scss`, `src/components/Flag/Flag.scss`, `src/components/Mockney/Mockney.scss`

## Semantics

Semantic baseline updates are in place:
- Primary content uses `<main id="content">` as the landmark container.
- Top-level learning object blocks are rendered as semantic sections.
- Inline emphasis in rendered JSX uses semantic tags:
  - `<strong>` instead of `<b>`
  - `<em>` instead of `<i>`
- Abbreviations content in `CustomComponents_FR` now uses semantic definition-list markup (`<dl>`, `<dt>`, `<dd>`) instead of table-like structure.

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
