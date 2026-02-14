# Tasks Completed Tracker

Last updated: 2026-02-13
Repo: `/Users/ped/Sites/french/french-lo-1-test`

This checklist tracks migration progress toward one source of truth (tokens + Tailwind/shadcn utilities) and reduced SCSS ownership.

## Typography

- [x] Canonical font tokens aligned to brand fonts in `src/index.css`
  - `--font-sans` => OpenSans
  - `--font-heading` => Feijoa
  - `--font-mono` => JetBrains Mono
- [x] Tailwind font mapping aligned to tokens in `tailwind.config.js`
- [x] Typography guard script and local hook are active
  - `scripts/check-typography-guard.sh`
  - `.githooks/pre-commit`
  - `yarn prepush:local`
  - policy: literal `font-size`/`line-height` blocked; tokenized `font-family: var(--font-...)` allowed
- [x] Small App typography batch 1 complete
  - Global body base size moved to token var (`var(--font-size-sm)`) in `src/App.scss`
- [x] Small App typography batch 2 complete
  - Global `h1..h6` size block moved from hardcoded rem to token-based expressions in `src/App.scss`
- [~] Migrate remaining SCSS `font-family` ownership into utility/token path
  - App baseline font-family declarations in `src/App.scss` now tokenized (`var(--font-sans)`, `var(--font-heading)`)
- [ ] Continue removing hardcoded `font-size/line-height/font-family` from remaining SCSS hotspots
  - Priority: `src/App.scss`, `src/components/PhraseTable/PhraseTable.scss`
  - Note: `src/components/MainMenu/MainMenu.scss` has been verified as tokenized for typography sizing.
  - completed: mobile accordion heading `line-height: 1.2` replaced with `var(--line-height-2xl)` in `src/components/Accordion/Accordion.scss`
  - completed: accordion title inline style `lineHeight: "1.2"` replaced with `var(--line-height-2xl)` in `src/components/Accordion/AccordionArticle.jsx`
  - completed: `_mixins.module.scss` literal `font-size/line-height` values replaced with token expressions in shared mixins
  - completed: `_mixins.module.scss` literal `font-family` (`Times New Roman`) replaced with tokenized `var(--font-heading)`

## Color

- [x] Canonical color strategy documented (`COLOR_AUDIT.md`, `COLOR_MIGRATION.md`, `COLOR_PLAN.md`)
- [x] Core token foundations present in `src/index.css`
- [x] Tailwind token mapping in `tailwind.config.js`
- [ ] Add color guard script
  - `scripts/check-color-guard.sh`
  - `scripts/color-allowlist.txt`
- [ ] Add `check:color` to package scripts and include in local pre-push flow
- [ ] Migrate high-impact literal color hotspots
  - Priority: `src/App.scss`, `src/components/MainMenu/MainMenu.scss`, `src/components/AudioClip/AudioClip.scss`

## Audio

- [x] Single-active audio playback rule implemented across app
- [x] LO1 listening exercises refactored to `listeningOrder1/2/3`
- [x] LO1 exercise audio migration to `public/audio/lo1/exercises/...` underway
- [x] ASCII-safe naming policy documented and in use for migrated files
- [ ] Complete migration of remaining legacy `public/sounds/fr/...` references to `public/audio/lo1/...`

## Accessibility / HTML Validity

- [x] Audit and phased plan documented in `HTML_ACCESSIBILITY_ISSUES.md`
- [ ] Phase 1: remove invalid `name` attributes and empty IDs
- [ ] Phase 2: fix duplicate IDs and ID generation consistency
- [ ] Phase 3: improve interactive semantics (accordion/button patterns)
- [ ] Phase 4: ARIA cleanup (remove invalid aria usage, keep only needed labels)
- [ ] Phase 5: SVG/image attribute/path cleanup and validation retest

## Next Recommended Baby Step

- [x] Typography batch 3: converted remaining small hardcoded text in `src/App.scss` (`figcaption`, `.footnote`) to token-based values.
- [x] Typography batch 4: converted PhraseTable hardcoded text sizing to token-based values in `src/components/PhraseTable/PhraseTable.scss`.
- [~] Typography batch 5: continue `src/App.scss` cleanup (remaining hardcoded `line-height`/clamp text hotspots) with visual parity checks.
  - completed: heading `line-height` and heading margin factors tokenized via `--line-height-2xl`
  - completed: additional App line-height literals replaced with token expressions (`.app`, WordParts table text, responsive WordParts text, desktop paragraph line-height)
  - completed: `#SpeechSynthesisError` hardcoded `40px/60px` replaced with tokenized size/line-height
  - completed: mobile `.title-main` / `.title-sub` `em` sizes replaced with token expressions
  - completed: desktop xl hero `h1` `3rem` literal replaced with token expression
  - completed: responsive hero clamps (`2.2/3rem` and `2.4/3.5rem`) replaced with token-based clamp expressions
  - completed: main hero/title clamps (`4/5.75rem`, `2.4/3.1rem`, `1.6/2.1rem`) replaced with token-based clamp expressions
