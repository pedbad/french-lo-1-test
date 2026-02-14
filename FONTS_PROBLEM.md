# Fonts Duplication Problem (Build Output)

Date: 2026-02-14  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Summary
There is not a source-level duplication of font files.  
The duplication is happening during build output in `dist/` due to redundant copy rules.

## Legacy file likely adding confusion
- `public/fonts.html` is an old font test page with separate `@font-face` definitions.
- It references `Feijoa-bold.otf` (lowercase `b`), while the real file is `Feijoa-Bold.otf`.

## What was observed
- Source fonts are correctly centralized in:
  - `/Users/ped/Sites/french/french-lo-1-test/public/fonts`
  - `/Users/ped/Sites/french/french-lo-1-test/src/styles/fonts.css`
- Build output contained duplicate trees:
  - `/Users/ped/Sites/french/french-lo-1-test/dist/fonts`
  - `/Users/ped/Sites/french/french-lo-1-test/dist/fonts/fonts`
- The same duplication pattern also appeared for other public assets:
  - `/Users/ped/Sites/french/french-lo-1-test/dist/images/images`
  - `/Users/ped/Sites/french/french-lo-1-test/dist/sounds/sounds`

## Root cause
`viteStaticCopy` in `/Users/ped/Sites/french/french-lo-1-test/vite.config.js` was explicitly copying `public/fonts`, `public/images`, and `public/sounds` into `dist/`.

Vite already copies the whole `public/` directory by default, so those plugin copy rules produced duplicate output paths.

## Impact
- Unnecessary larger build artifacts.
- Confusing directory layout for deployment/debugging.
- Risk of stale assets if one duplicate path changes and the other is referenced.

## Correct approach
- Keep `public/` asset handling to Vite default behavior.
- Use `viteStaticCopy` only for assets not already managed by `public/` (here, JSON files from `src/...`).

## Fix applied
- Removed redundant `viteStaticCopy` targets for:
  - `./public/fonts`
  - `./public/images`
  - `./public/sounds`
- Kept copy targets for:
  - `src/learningObjectConfigurations/fr/*.json`
  - `src/index*.json`

## Verification checklist
1. Run `yarn build`.
2. Confirm `dist/` does not contain:
   - `dist/fonts/fonts`
   - `dist/images/images`
   - `dist/sounds/sounds`
3. Confirm app still serves font files via `/fonts/...` from `public/`.

## Note on `public/fonts.html`
`/Users/ped/Sites/french/french-lo-1-test/public/fonts.html` appears to be a legacy test page and is not part of app runtime styling.  
Runtime font source of truth is `src/styles/fonts.css`.
