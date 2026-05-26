# Image Migration Plan (`public/images` -> `public/img`)

## Status: COMPLETE

`public/images/` has been fully deleted. All active assets now live under `public/img/`.

## Goal

Create a clean, scalable image layout like audio migration:

- LO-specific folders (`lo1`, `lo2`, ...)
- shared/common folders for cross-LO assets
- strict naming policy (ASCII-safe, no spaces, lowercase)

This lets us add new designer assets safely without reintroducing path bugs.

## Target Structure

```text
public/img/
|- common/                        (app-shell assets, cross-language)
|  |- branding/
|  |- footer/
|  |- custom-icons/               (designer SVGs used as CSS mask-images — NOT Lucide)
|  (common/icons/, common/flags/, common/ui/ removed — never used)
|- shared/                        (French course content used across multiple LOs)
|  |- grammar.svg
|  |- self-study.svg
|  (shared/icons/ moved to common/custom-icons/)
|- lo1/
|- lo2/
|- lo3/
|- lo4/
|- lo5/
|- lo6/
|- lo7/
|- lo8/
|- lo9/
|- lo10/
|- lo11/
|- lo12/
|- lo13/
|- lo14/
|- lo15/
```

## Mapping Rules

- Use `common/` for assets used by app shell/UI:
  - banner, footer logos, app-wide icons.
- Use `shared/` for reusable learning datasets across multiple LOs:
  - memory cards, transport/animals/food/rooms sets.
- Use `loX/` only when asset is truly LO-specific.

## Naming Rules (mandatory)

- ASCII-only (`a-z`, `0-9`, `-`, `_`, `.`).
- lowercase only.
- no spaces.
- no accented characters.
- stable extension and lowercase extension.

Example conversions:

- `Language-Centre/Horizontal/Reversed colour/ucam_language_centre_h_rev_col.png`
  -> `img/common/footer/ucam-language-centre-h-reversed-colour.png`
- `First_contact.png`
  -> `img/lo1/intro/first-contact.png`

## Safety Strategy (no broken screens)

1. Copy-first migration:
   - copy asset to `public/img/...`
   - update references in same commit
   - validate screen
   - then remove legacy file.
2. Never bulk-move all files in one change.
3. Migrate by feature area:
   - app chrome assets first (hero/footer/icons)
   - then LO1 assets
   - then shared memory sets
   - then LO2..LO15.

## Guardrails Added

- New script: `scripts/check-image-path-guard.sh`
  - blocks new files added under `public/images/`
  - validates new `public/img/` filenames (ASCII, lowercase, no spaces)
  - blocks newly added legacy path references (`images/` or `/images/`) in source diffs
- Hook integration:
  - `.githooks/pre-commit` now runs `yarn -s check:image-path`
  - `package.json` adds:
    - `check:image-path`
    - `check:image-path:branch`
  - `prepush:local` now includes `yarn check:image-path:branch`

## Migration Complete

All batches done. `public/images/` deleted. Active icons migrated to `public/img/shared/icons/`.
CSS paths in `src/index.css` and JS refs in `DebugSvgAssets.jsx` and `ProgressDots.jsx` updated accordingly.

