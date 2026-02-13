# Future Projects Blueprint (React + Bun + Tailwind + shadcn + Lucide)

## Reusable Master Prompt

Use this prompt when starting a new project:

```text
Create a new production-ready React app using Bun, Tailwind CSS, shadcn/ui, and Lucide icons.

Non-negotiable architecture:
1. Use Bun for install/dev/build/test scripts.
2. Use Tailwind as the only styling system. Do not use SCSS/SASS.
3. Implement strict single source of truth for design:
   - All typography/color/radius/shadow/motion tokens live in one token file (for example: src/styles/tokens.css).
   - Tailwind and shadcn consume those tokens.
   - No hardcoded color/font-size/font-family values outside token files.
4. Must support light and dark mode from day one using class-based theme switching.
5. Ensure token parity across light/dark (no ad hoc per-component overrides).
6. Set up shadcn so components are easy to theme and extend via cva variants.
7. Add a cn utility and class-variance-authority pattern for all reusable custom components.
8. Add accessibility defaults:
   - visible focus states
   - keyboard support
   - prefers-reduced-motion support
9. Add guardrails:
   - ESLint + Prettier
   - pre-commit hooks
   - CI checks
   - style guard script that fails on new hardcoded typography/colors outside token files
   - fail CI if any .scss/.sass files are added
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
      tokens.css            # single source of truth tokens
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

## Asset Placement Rules

- Use `public/media/audio` and `public/media/video` for large runtime files referenced by URL.
- Use `src/assets/svg` for SVGs imported into React components.
- Use `public/media/images` for CMS/config-driven image paths.
- Use `src/assets/fonts` for app fonts that are versioned and tokenized.
- Keep file names ASCII-safe (no accents/spaces) for cross-platform reliability.

## Light/Dark Mode Rules

- Theme controlled by root class (`.dark`) + token overrides.
- Do not hardcode component-level light/dark hex values.
- All component colors must come from semantic tokens.
- Add theme toggle only as class switch; never inline style swaps.

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
5. Verify keyboard focus and reduced motion.
6. Run guard checks and CI before merge.

## Copy-Only Prompt (Short)

```text
Create a new React project using Bun + Tailwind CSS + shadcn/ui + Lucide.

Must-haves:
- No SCSS/SASS. Tailwind-only styling.
- Single source of truth tokens in src/styles/tokens.css for colors, typography, spacing, radius, shadows, and motion.
- Tailwind and shadcn consume these tokens.
- Light/dark mode from day one (class-based .dark), with token parity.
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
