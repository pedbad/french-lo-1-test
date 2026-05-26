# Image Asset Root (`public/img`)

This directory is the new image source-of-truth for migrated assets.

## Why this exists

- `public/images` contains legacy structure and mixed naming conventions.
- We already saw reliability issues from path encoding and filename normalization in media assets.
- New work should not increase legacy path debt.

## Directory contract

- `common/`: app-shell assets used across all languages and all LOs — infrastructure, not content.
  - `branding/` — banner and app-level brand assets.
  - `footer/` — organisation logos (LC, CC, eLearning, UCAM) in light and dark variants.
  - `custom-icons/` — bespoke designer SVGs used as CSS mask-images for exercise buttons (eye, reset, check, volume, book, tortoise, etc.). **Distinct from Lucide React components** — these are static files loaded via `mask-image` in `src/index.css`.
- `shared/`: reusable French course content used by multiple LOs (section images).
  - `grammar.svg`, `self-study.svg` — section header images referenced in LO JSON configs.
- `lo1` ... `lo15`: assets specific to a single learning object.

> **Note:** `common/flags/`, `common/icons/`, and `common/ui/` have been removed. Flags are no longer used. The custom designer icons that were previously under `shared/icons/` now live in `common/custom-icons/` where they belong semantically.

## Naming contract (required)

- ASCII-only paths and filenames.
- Lowercase only.
- No spaces.
- Prefer kebab-case for multi-word names.
- Allowed extensions: `png`, `jpg`, `jpeg`, `svg`, `webp`, `gif`, `avif`.

Examples:

- Good: `public/img/common/branding/fr-banner.svg`
- Good: `public/img/lo1/vocabulary/first-contact-card.png`
- Bad: `public/img/common/branding/First Contact Banner.svg`
- Bad: `public/img/lo1/vocabulary/ça-va.png`

## Migration approach

1. Copy asset from `public/images/...` to `public/img/...` with normalized name.
2. Update all source references to `img/...` (or `/img/...`) in the same commit.
3. Run `yarn build` and spot-check relevant LO screens.
4. Remove legacy file from `public/images/...` only after references are clean.
