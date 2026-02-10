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

By default the app is served under `/projects/richard/` in dev mode. Example:

```
http://localhost:5173/projects/richard/?lang=fr&lo=1
```

## Build app

```bash
yarn build
```

## Configuring the learning object

There is an **index-fr.json** file which lists the various learning object configuration files. It is used to construct a navigation menu.

The **learningObjectConfigurations/fr/\*.json** files define the component layout and phrases for each learning object.

## Styling

The app uses shadcn tokens for the base palette plus custom theme tokens in `src/index.css` as the single source of truth:

- `--page-background`
- `--hero-title-color`
- `--footer-background`

Typography is also normalized: root tokens (`--body-font-size`, `--body-line-height`) feed into shared selectors in `src/App.scss`, so accordion content, tables, Info blocks, etc. all match the introduction text scale for consistent readability.
- Section imagery (e.g., Grammar intro) is rendered via React components + Tailwind utilities, so JSON configs only describe content, not layout/styling.
- A shared type scale lives in `src/index.css` + `tailwind.config.js`, so font sizes/line heights can be tuned once and applied everywhere through Tailwind utilities instead of hardcoded pixels.
- Typography still has follow-up work (nav + SCSS audits), but the shared scale + hero adjustments lay the groundwork for replacing the remaining fixed sizes with Tailwind utilities.
- Remaining font-size inconsistencies (hardcoded px/rem) are being audited—Tailwind’s token-based scale plus new CSS vars for `2xl`/`3xl` will replace them gradually.
- Introduction + Grammar now use a dedicated hero-style Section so instruction text and imagery share the same baseline and card framing as the rest of the UI.
- Special anchors currently add a short delay before scrolling so accordion panels have time to expand; TODO: smooth that interaction so the highlight feels more immediate once we refactor the anchor logic.
- Modal links open a shadcn/Radix modal (no scrolling). The modal pulls content from existing `infoTextHTML`/`informationTextHTML` so there’s no duplication; optional `<span class='modal-highlight'>…</span>` in JSON triggers a Tailwind-based highlight animation inside the modal only.
- Inline audio icons are normalized via CSS variables in `src/components/AudioClip/AudioClip.scss` to keep size and baseline alignment consistent across paragraph text.
- The Introduction `HeroSection` can opt out of the default card styling via `transparentCard`, so it can sit directly on the page background (no white card or border) while other sections remain carded.
- The Info panel now uses the Lucide `Info` icon (via `lucide-react`) instead of a custom masked SVG.
- The favicon now uses the eLearning logo SVG (from the footer) via `public/favicon.svg`.
- Added PNG favicon assets (16/32) plus Apple/Android icons and a `site.webmanifest` for broader device support.
- Theme toggling now temporarily disables CSS transitions to prevent visible flicker (notably in tables) during light/dark switches.
- Modal links use the Lucide `message-square-warning` icon for the inline indicator.

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

## Semantics

Based on the render method in `src/App.jsx`, there is no `<main>` HTML element being used. The primary content areas are enclosed within `div` elements, such as `#hero` and `#content`.

Using a `<main>` element is a W3C-recommended practice for semantic HTML5. It marks the dominant content of the `<body>`, which is unique to that document. Its absence means the page does not fully leverage HTML5 semantics, impacting accessibility (screen readers use `<main>` as a landmark for navigation) and potentially SEO.

The `#content` element is a prime candidate to be replaced with `<main id="content">`.

Top-level learning object blocks (Introduction, Dialogues, Vocabulary, Grammar, Pronunciation, Exercises) should be rendered as `<section>` elements to improve semantic structure and landmark navigation.

Headings should avoid extra wrapper spans when the title is plain text; only `titleHTML` needs a wrapper for `dangerouslySetInnerHTML`.

Anchor ids/classes should live on the heading itself (e.g. the `<h2>`), not on an extra `<span>` wrapper.

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

## Separators (shadcn/Radix)

Divider lines now use the shadcn `Separator` component (`src/components/ui/separator.jsx`) so spacing and color are token-driven and consistent with the theme.

## Audio Path Fix (Accent Normalization)

Some French audio filenames on disk use decomposed accents (NFD), while JSON references used composed accents (NFC). This mismatch caused 404s and `NotSupportedError` in the browser. The fix normalizes asset paths to NFD inside `resolveAsset` so the requested URL matches the actual filenames.

## Badges

![Node](https://img.shields.io/badge/node-18.x-brightgreen)
![Vite](https://img.shields.io/badge/built%20with-vite-646cff.svg?logo=vite)
