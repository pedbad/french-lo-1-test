# Image Migration Plan (`public/images` -> `public/img`)

## Goal

Create a clean, scalable image layout like audio migration:

- LO-specific folders (`lo1`, `lo2`, ...)
- shared/common folders for cross-LO assets
- strict naming policy (ASCII-safe, no spaces, lowercase)

This lets us add new designer assets safely without reintroducing path bugs.

## Current Audit Snapshot

Audit scope: source references in `src/`, LO JSON config, CSS, and debug inventory.

- Remaining files in `public/images`: `161`
- Largest groups:
  - `memory-food`: `37`
  - `memory-transport`: `31`
  - `memory`: `30`
  - `memory-animals`: `20`
  - `memory-rooms`: `12`
  - `icons`: `7`
  - plus singleton/shared branding + utility files

LO JSON files with image references:

- `1.json`: `3`
- `2.json`: `2`
- `5.json`: `13`
- `7.json`: `15`
- `8.json`: `15`
- `15.json`: `12`
- `demo.json`: `116`

Cross-LO repeated assets already exist (for example `memory-*`, `handshake.png`, `shh.jpg`), so a shared folder is required to avoid duplication.

## Target Structure

```text
public/img/
|- common/
|  |- branding/
|  |- footer/
|  |- icons/
|  |- flags/
|  |- ui/
|- shared/
|  |- memory/
|  |- memory-animals/
|  |- memory-food/
|  |- memory-rooms/
|  |- memory-transport/
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

## Next Recommended Migration Batch

1. Migrate app shell assets:
   - `images/fr_banner.svg`
   - `images/first-contact.svg`
   - `images/grammar.svg`
   - footer logo PNGs
   - icon mask assets currently read from `/images/icons/*`
2. Update:
   - `src/App.jsx`
   - `src/components/Footer/Footer.jsx`
   - `src/index.css`
   - `src/debug/components/DebugSvgAssets.jsx`
   - LO JSON refs that use those assets
3. Run:
   - `yarn build`
   - `yarn preview`
   - focused LO smoke test (`?lang=fr&lo=1`)

