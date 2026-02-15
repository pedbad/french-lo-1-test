# Future Projects Blueprint (React + Bun + Tailwind + shadcn + Lucide)

## Reusable Master Prompt

Use this prompt when starting a new project:

```text
Create a new production-ready React app using Bun, Tailwind CSS, shadcn/ui, and Lucide icons.

Non-negotiable architecture:
1. Use Bun for install/dev/build/test scripts.
2. Use Tailwind as the only styling system. Do not use SCSS/SASS.
3. Implement strict single source of truth for design:
   - Keep one semantic token contract in `src/styles/tokens.css`.
   - Keep locale/brand color palette overrides in `src/styles/themes/theme-<locale>.css`.
   - Tailwind and shadcn consume semantic tokens only.
   - No hardcoded color/font-size/font-family values outside token files.
4. Must support light and dark mode from day one using class-based theme switching.
5. Ensure token parity across light/dark (no ad hoc per-component overrides).
   - Include locale/brand theming from day one via `data-theme` on the root element.
6. Set up shadcn so components are easy to theme and extend via cva variants.
7. Add a cn utility and class-variance-authority pattern for all reusable custom components.
8. Add accessibility defaults:
   - visible focus states
   - keyboard support
   - prefers-reduced-motion support
   - semantic landmarks/headings (`<main>`, `<nav>`, `<section>` with headings)
   - native interactive elements first (`button`, `a`, `input`) before ARIA role fallbacks
9. Add guardrails:
   - ESLint + Prettier
   - pre-commit hooks
   - CI checks
   - style guard script that fails on new hardcoded typography/colors outside token files
   - fail CI if any .scss/.sass files are added
   - fail CI on accessibility gate failures (lint + automated checks)
10. Add docs:
   - THEME_ARCHITECTURE.md
   - COMPONENT_GUIDELINES.md
   - CONTRIBUTING.md
11. Provide a starter set of token-driven components (Button, Card, Input, Badge, Alert, Dialog) and example custom variants.

Output required:
- exact setup commands
- final directory structure
- key config files
- guard scripts
- docs
- short checklist for adding new components safely
```

## Out-of-the-Box GitHub Actions CI (Default)

Use this as the default workflow in new repos (`.github/workflows/ci.yml`):

```yaml
name: PR Quality Gates

on:
  pull_request:
  workflow_dispatch:

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Ensure origin/main exists for branch guards
        run: git fetch --no-tags origin main:refs/remotes/origin/main

      - name: Build
        run: yarn build

      - name: Lint
        run: yarn lint

      - name: Typography guard (branch)
        run: yarn check:typography:branch

      - name: Color guard (branch)
        run: yarn check:color:branch

      - name: A11y guard (branch)
        run: yarn check:a11y:branch
```

If the project uses Bun instead of Yarn, keep the same job shape and swap commands to:
- install: `bun install --frozen-lockfile`
- run scripts: `bun run <script>`

## Additional Prevention Defaults (Recommended)

Add these from day one to avoid late cleanup projects:

1. Protect `main` with required status checks for CI workflows.
2. Add `CODEOWNERS` for design tokens, accessibility-critical components, and build config.
3. Add a PR template that requires:
   - keyboard test confirmation
   - screen-reader smoke check confirmation
   - before/after screenshots for UI changes
4. Add Playwright + axe smoke tests for key pages/states in CI.
5. Add visual regression snapshots for top-level routes and core components.
6. Add a path hygiene guard (ASCII-only names, no spaces) for `public/` assets.
7. Add dependency update automation (Dependabot or Renovate) with weekly cadence.
8. Add security scanning (CodeQL and `npm audit`/`yarn audit`) on schedule.
9. Add branch-level "no new debt" checks (warnings/error budgets must not increase).
10. Add a release checklist workflow for production preview validation (build + preview + smoke checks).
11. Keep developer fixtures in a separate dev-only sandbox page (do not render hidden debug DOM in the production app tree).

## What To Avoid In Future Projects

Use this as a hard "do not repeat" list.

1. Do not start with mixed styling ownership (Tailwind + broad SCSS) without strict boundaries.
2. Do not add new `.scss/.sass` files once Tailwind/token architecture is chosen.
3. Do not add new SCSS imports in component files (`.jsx/.tsx/.js/.ts`).
4. Do not rely on high-specificity legacy selectors that fight utility classes.
5. Do not keep global app styling hidden in `App.scss`; keep global/base rules in `src/index.css` (`@layer base`).
6. Do not encode component variants in Sass interpolation patterns when `cn()`/`cva` should handle variants.
7. Do not leave animations scattered across many SCSS files; centralize keyframes/tokens in Tailwind config or layered global CSS.
8. Do not allow new hardcoded typography/color literals outside token files.
9. Do not skip branch protection + required CI checks for guard scripts.
10. Do not start refactors without visual and accessibility regression checks in the PR definition of done.
11. Do not keep debug/sample scaffolding hidden in production markup; isolate it in a dev-only sandbox entrypoint.

## Dev-Only Debug Sandbox Pattern (Best Practice)

Use this pattern by default:

1. Keep debug fixtures in a dedicated dev area (for example `src/debug/`) instead of `src/App` or route components used by production pages.
2. Use a separate sandbox entry page (for example `debug-sandbox.html`) and a dedicated entry script (for example `src/debug/sandbox-main.jsx`).
3. Add a hard runtime guard in sandbox entry code:
   - `if (!import.meta.env.DEV) throw new Error(...)`
4. Keep sandbox-only React components either:
   - nested/private inside the sandbox page component file, or
   - colocated under `src/debug/components/` (not exported from app component barrels).
5. Do not import sandbox components into production app trees (`src/App.*`, production routes, shared exports).
6. Naming convention:
   - React component names: PascalCase (`DebugSandbox`, `TypographySample`)
   - folders/paths: lowercase or kebab-case (`src/debug`, `src/debug/components`)

Why this is best practice:
- prevents validator noise from hidden debug DOM in production HTML
- keeps production markup deterministic and easier to maintain
- avoids debug component sprawl in core app component namespaces
- makes intent explicit: sandbox code is for developer diagnostics only

### What To Include In Debug Sandbox (Default Scope)

Include these by default in new projects:

1. Typography contract preview
   - heading/body/caption samples that consume the same global tokenized styles as production pages.
2. Token inventories
   - color token list with light/dark resolved values and swatches.
   - font token and `@font-face` inventory with used/unused status.
3. Asset diagnostics
   - SVG/image usage panel rendered in UI cards.
   - prefer manifest/snapshot input over browser-time source scanning for stability.
4. Navigation helpers for QA
   - index links to key pages/learning objects.
   - high-level structure summary (sections/accordions/component types).
5. Explicit diagnostics state
   - clear loading/error messages per panel so one failing panel does not blank the entire sandbox.

### What Not To Include In Debug Sandbox

1. No imports from production component barrels if direct imports are possible.
2. No hidden debug DOM inside production app trees (`App`, route pages, shared layout).
3. No analytics/telemetry side effects.
4. No write-path behavior (localStorage mutation, data writes) unless intentionally testing that behavior.

## Recommended Directory Structure

```text
project-root/
  public/
    media/
      audio/                # runtime-served audio files (no import processing needed)
      video/                # runtime-served video files
      images/               # static images used by content/config
      icons/                # static favicon/pwa/icon assets
  src/
    debug/                  # dev-only sandbox pages and fixtures (not imported by production app)
      components/           # optional sandbox-only components
      sandbox-main.tsx      # sandbox entry point
    app/
      providers/            # ThemeProvider, QueryProvider, etc.
      routes/               # route-level pages/layouts
    components/
      ui/                   # shadcn primitives (Button, Dialog, Tabs...)
      custom/               # your app-specific reusable components
      sections/             # larger page/feature sections
    features/               # feature modules (state, components, services)
      <feature-name>/
        components/
        hooks/
        lib/
        types.ts
    hooks/                  # shared hooks (useTheme, useMediaQuery...)
    lib/
      utils.ts              # cn(), helpers
      guards/               # style guard scripts/helpers if needed
      constants.ts
    services/
      api/                  # fetch clients/endpoints
      audio/                # playback helpers/managers
    styles/
      tokens.css            # semantic token contract
      themes/
        theme-french.css    # locale/brand palette overrides
        theme-spanish.css
        theme-russian.css
      base.css              # tailwind base imports + global utility glue
    assets/
      svg/                  # imported SVGs as modules/components
      fonts/                # self-hosted fonts if required
    types/
      global.d.ts
    main.tsx
    App.tsx
  scripts/
    check-style-guard.sh    # blocks hardcoded typo/color + blocks scss
  .githooks/
    pre-commit
  .github/
    workflows/
      ci.yml
  THEME_ARCHITECTURE.md
  COMPONENT_GUIDELINES.md
  CONTRIBUTING.md
  package.json
```

## Where Tokens Live (Simple Model)

Use this exact split so there is no confusion:

1. `src/styles/tokens.css`:
   Define the semantic token contract only (`--background`, `--foreground`, `--primary`, `--border`, typography tokens, spacing tokens).
2. `src/styles/themes/theme-<locale>.css`:
   Override token values for each locale/brand theme (French, Spanish, Russian).
3. `tailwind.config.ts` (or `.js`):
   Map Tailwind theme keys to CSS variables from `tokens.css` (for example `background: "var(--background)"`, `primary: "var(--primary)"`).
4. Components:
   Use Tailwind semantic utilities (`bg-background`, `text-foreground`, `border-border`, `text-primary`). Never use literal palette values in components.

Minimal example:

```css
/* src/styles/tokens.css */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}
```

```css
/* src/styles/themes/theme-french.css */
:root[data-theme="french"] {
  --background: oklch(0.976 0.023 90.7);
  --primary: oklch(0.612 0.130 160.6);
}

:root[data-theme="french"].dark {
  --background: oklch(0.145 0 0);
  --primary: oklch(0.922 0 0);
}
```

```ts
// runtime switch (app init or ThemeProvider)
document.documentElement.dataset.theme = localeThemeMap[locale];
document.documentElement.classList.toggle("dark", isDarkMode);
```

## Asset Placement Rules

- Use `public/media/audio` and `public/media/video` for large runtime files referenced by URL.
- Use `src/assets/svg` for SVGs imported into React components.
- Use `public/media/images` for CMS/config-driven image paths.
- Use `src/assets/fonts` for app fonts that are versioned and tokenized.
- Keep file names ASCII-safe (no accents/spaces) for cross-platform reliability.

## Light/Dark Mode Rules

- Theme controlled by root class (`.dark`) + token overrides.
- Locale/brand theme controlled by root data attribute (`[data-theme="french"]`, etc.).
- Do not hardcode component-level light/dark hex values.
- All component colors must come from semantic tokens.
- Add theme toggle only as class switch; never inline style swaps.

## Multi-Theme Rules (Locale/Brand)

- Do not create separate component CSS for each locale/theme.
- Keep one semantic token set in `tokens.css` (example: `--background`, `--foreground`, `--primary`, `--border`, `--muted`).
- Keep locale palettes in dedicated theme files only.
- Theme files should only override tokens, for example:

```css
:root[data-theme="french"] { --primary: ...; --background: ...; }
:root[data-theme="french"].dark { --primary: ...; --background: ...; }
```

- Select locale theme at runtime once, for example:

```ts
document.documentElement.dataset.theme = localeThemeMap[locale];
```

- Validate each locale theme for WCAG AA contrast (text, controls, focus ring, links).

## Component Extension Rules

- Never edit shadcn primitives directly for one-off styles.
- Wrap primitives in `src/components/custom/*` and expose variants with `cva`.
- Keep variants semantic (`primary`, `secondary`, `danger`, `subtle`) not palette names.
- Use only Tailwind classes + tokens (no inline hardcoded colors/sizes).

## Add-Component Checklist

1. Build from shadcn primitive or custom wrapper.
2. Add/confirm needed tokens first (if new visual role is needed).
3. Add variants with `cva`.
4. Verify light and dark mode parity.
5. Verify locale/brand theme parity (French/Spanish/Russian or equivalents).
6. Verify keyboard focus and reduced motion.
7. Run guard checks and CI before merge.
8. Run accessibility checks before merge:
   - eslint accessibility rules (for example `jsx-a11y`)
   - automated page checks (for example axe in Playwright/Cypress)
   - quick keyboard-only smoke test (Tab/Shift+Tab, Enter, Space, Esc where relevant)

## Accessibility Is Non-Negotiable

Treat accessibility as a build requirement, not a polish task:
1. Every page must ship with semantic landmarks and heading structure.
2. Every interactive control must be keyboard-operable and visibly focusable.
3. Every icon-only control must have an accessible name.
4. CI must fail if accessibility gates fail.

## Copy-Only Prompt (Short)

```text
Create a new React project using Bun + Tailwind CSS + shadcn/ui + Lucide.

Must-haves:
- No SCSS/SASS. Tailwind-only styling.
- Single source of truth semantic token contract in src/styles/tokens.css for colors, typography, spacing, radius, shadows, and motion.
- Locale/brand palette overrides live in src/styles/themes/theme-<locale>.css.
- Tailwind and shadcn consume semantic tokens only.
- Light/dark mode from day one (class-based .dark), with token parity.
- Locale/brand theming from day one via data-theme on the root element.
- No hardcoded color/font-size/font-family values outside token files.
- shadcn extension pattern: keep primitives in src/components/ui and build app variants in src/components/custom using cva + cn utility.
- Accessibility defaults: visible focus, keyboard support, prefers-reduced-motion support.

Set up guardrails:
- ESLint + Prettier
- pre-commit hooks
- CI pipeline
- style guard script that blocks:
  - hardcoded typography/color literals outside token files
  - any new .scss/.sass file

Use this directory layout:
- public/media/audio, public/media/video, public/media/images, public/media/icons
- src/components/ui, src/components/custom, src/features, src/hooks, src/services, src/lib, src/styles, src/assets/svg, src/assets/fonts

Deliverables:
1) setup commands
2) full folder structure
3) key config files
4) guard scripts
5) docs: THEME_ARCHITECTURE.md, COMPONENT_GUIDELINES.md, CONTRIBUTING.md
6) starter token-driven components (Button, Card, Input, Badge, Alert, Dialog)
7) short checklist for adding new components safely.
```
