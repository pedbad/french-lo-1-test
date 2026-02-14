# Tasks Completed Tracker

Last updated: 2026-02-14
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
- [x] Migrate remaining SCSS `font-family` ownership into utility/token path
  - App baseline font-family declarations in `src/App.scss` now tokenized (`var(--font-sans)`, `var(--font-heading)`)
  - `@font-face` declarations moved out of `src/App.scss` into dedicated `src/styles/fonts.css` (imported globally in `src/main.jsx`)
- [x] Continue removing hardcoded `font-size/line-height/font-family` from remaining SCSS hotspots
  - Full repo audit now shows no remaining literal SCSS/CSS `font-size` or `line-height` unit values (`px/rem/em`) in source.
  - Tailwind typography mapping now uses semantic line-height tokens (`--line-height-*`) only; legacy `--body-line-height` runtime reference removed.
  - Note: `src/components/MainMenu/MainMenu.scss` has been verified as tokenized for typography sizing.
  - completed: mobile accordion heading `line-height: 1.2` replaced with `var(--line-height-2xl)` in `src/components/Accordion/Accordion.scss`
  - completed: accordion title inline style `lineHeight: "1.2"` replaced with `var(--line-height-2xl)` in `src/components/Accordion/AccordionArticle.jsx`
  - completed: `_mixins.module.scss` literal `font-size/line-height` values replaced with token expressions in shared mixins
  - completed: `_mixins.module.scss` literal `font-family` (`Times New Roman`) replaced with tokenized `var(--font-heading)`
  - completed: `CrossWord.jsx` inline `fontSize` literals (`10`, `16`) replaced with token-based expressions
  - completed: removed unused Sass typography literal variable (`$header-footer-font-size: 0.8rem`) and stale commented literal examples in `App.scss`
  - completed: centralized accordion title typography inline style into `ACCORDION_TITLE_STYLE` constant to avoid duplicated token rules
  - completed: `Congratulate.jsx` and `Footer.jsx` Tailwind typography literals (`text-[40px]`, `leading-[60px]`, `md:text-[80px]`, `md:leading-[90px]`, `leading-[26px]`) replaced with token-based arbitrary values
  - completed: `CustomComponents_FR.scss` regional map label custom properties (`74.6667px`, `40px`) replaced with token-based expressions from `--font-size-base`
  - completed: typography guard now allows literal `font-family` only in `src/styles/fonts.css` for `@font-face`; guard remains strict elsewhere
  - completed: duplicate dark-mode typography token assignments removed from `src/index.css` so typography scale remains defined once in `:root`
  - completed: ad-hoc line-height arithmetic in `App.scss` replaced with semantic line-height tokens from `index.css` (`--line-height-app`, `--line-height-body-tight/loose`, `--line-height-wordparts*`)
  - completed: component consumers (`Info.jsx`, `instructions-media.jsx`) migrated from `--body-line-height` to `--line-height-body`; heading utility `leading-[1.4]` replaced with tokenized `--line-height-app`
  - completed: `WordParts.jsx` Tailwind line-height literal (`leading-[1.35]`) replaced with semantic tokens (`--line-height-wordparts-mobile`, `--line-height-wordparts`)
  - completed: grouped exercise constants tokenized in `Blanks.jsx`, `DraggableWordTile.jsx`, `ReadAloud.jsx`, `TreasureGrid.jsx`, and `Jigsaw.jsx` (`1.2rem`, `1.4rem`, `2rem`, `1.4em`, and related line-height literals)
  - completed: tabs/dropdowns utility literals tokenized in `App.jsx` and `DropDowns.jsx` (`1.2rem`, `1.4rem`, `1.4rem` line-height)
  - completed: `Header.jsx`, `ModalLinkDialog.jsx`, and `Attribution.jsx` utility rem literals tokenized (`3rem`, `1.35rem`, `0.5rem`)
  - completed: rem utility literals tokenized in `SortableWordCard.jsx` and `MemoryMatchGame.jsx` (sortable card scales + memory card/match responsive text scales)
  - completed: legacy `--body-line-height` alias removed from `index.css` after full consumer migration to semantic line-height tokens

## Color

- [x] Canonical color strategy documented (`COLOR_AUDIT.md`, `COLOR_MIGRATION.md`, `COLOR_PLAN.md`)
- [x] Core token foundations present in `src/index.css`
- [x] Tailwind token mapping in `tailwind.config.js`
- [x] Add color guard script
  - `scripts/check-color-guard.sh`
  - `scripts/color-allowlist.txt`
- [x] Add `check:color` to package scripts and include in local pre-push flow
- [ ] Tune color guard allowlist/patterns based on real-world false positives (keep list minimal)
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
- [x] Typography batch 5: continue `src/App.scss` cleanup (remaining hardcoded `line-height`/clamp text hotspots) with visual parity checks.
  - completed: heading `line-height` and heading margin factors tokenized via `--line-height-2xl`
  - completed: additional App line-height literals replaced with token expressions (`.app`, WordParts table text, responsive WordParts text, desktop paragraph line-height)
  - completed: `#SpeechSynthesisError` hardcoded `40px/60px` replaced with tokenized size/line-height
  - completed: mobile `.title-main` / `.title-sub` `em` sizes replaced with token expressions
  - completed: desktop xl hero `h1` `3rem` literal replaced with token expression
  - completed: responsive hero clamps (`2.2/3rem` and `2.4/3.5rem`) replaced with token-based clamp expressions
  - completed: main hero/title clamps (`4/5.75rem`, `2.4/3.1rem`, `1.6/2.1rem`) replaced with token-based clamp expressions
  - completed: `Congratulate.jsx` + `Footer.jsx` Tailwind px typography literals replaced with tokenized arbitrary values
  - completed: regional map SVG label custom properties in `CustomComponents_FR.scss` tokenized from px to `var(--font-size-base)` expressions
  - completed: font-face declarations extracted to `src/styles/fonts.css` (global import via `src/main.jsx`) with `font-display: swap`
  - completed: dark-mode typography token duplicates removed in `src/index.css` (`--font-size-*`, `--line-height-*`, `--body-line-height`)
  - completed: semantic line-height token pass in `index.css` and `App.scss` to replace inline `calc(var(--body-line-height) +/- ...)` usage
  - completed: downstream component migration (`Info.jsx`, `instructions-media.jsx`) to semantic `--line-height-body` token
  - completed: WordParts text utility class line-height migrated to semantic tokens
  - completed: exercise constant tokenization pass across Blanks/Jigsaw/ReadAloud/TreasureGrid components
  - completed: tabs trigger + dropdown utility text/line-height literals migrated to token expressions
  - completed: Header/ModalLinkDialog/Attribution utility rem literals migrated to token expressions
  - completed: SortableWordCard and MemoryMatchGame rem utility text scales migrated to token expressions
  - completed: legacy `--body-line-height` alias removed; semantic line-height tokens are now canonical
  - completed: `tailwind.config.js` line-height mappings now point to semantic tokens (`--line-height-body`, `--line-height-xs/sm/lg/xl`)
