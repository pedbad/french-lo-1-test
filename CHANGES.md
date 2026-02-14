# Changes Summary (Session)

This file summarizes the work completed in this repo during the session. It includes case-sensitivity fixes, content cleanup, theming unification, banner updates, and asset/logo updates. Paths are repo-relative.

## 1) Case Sensitivity (Linux-safe)
- Renamed `src/Components` -> `src/components`.
- Updated all imports to use `src/components` casing.

## 2) Content Cleanup (French-only focus)
Removed non-French language content and assets.

### Removed learning object configs
- Deleted `src/learningObjectConfigurations/de/`
- Deleted `src/learningObjectConfigurations/sp/`
- Deleted `src/config-uae-1.json`
- Deleted `src/config-ukraine-1.json`
- Removed `src/index-sp.json`

### Removed language-specific component sets
- Deleted `src/components/CustomComponents_SP/`
- Removed `AllCustomComponentsSP` import/usages and export from app wiring.

### Removed non-French sounds/images
- Deleted `public/sounds/de/`
- Deleted `public/sounds/sp/`
- Deleted `public/sounds/ukraine/`
- Deleted `public/sounds/arabic-cyclist.mp3`
- Removed non-French images (e.g., UAE, Berlin, Kyiv, flags, etc.).

## 3) Theming Unification (Single source of truth)
Standardized styling on shadcn tokens and reduced hardcoded colors.

### New semantic tokens + helpers
- Added in `src/index.css`:
  - `--ped-affirm`, `--ped-warn`, `--ped-neg`, `--ped-neutral`, `--ped-accent`
  - `.ped-affirm`, `.ped-warn`, `.ped-neg`, `.ped-neutral`, `.ped-accent`

### New custom theme tokens (single source of truth)
- Added in `src/index.css`:
  - `--page-background` (light + dark override)
  - `--hero-title-color` (light + dark override)
  - `--footer-background` (light + dark override)

### Removed skin aliasing
- Deleted `src/styles/_skin.module.scss` and removed its import.
- Removed `--lo-*` alias variables and replaced usage with shadcn tokens.

### Updated component styling to tokens
Multiple SCSS/JSX files were updated to use `var(--foreground)`, `var(--primary)`, `var(--destructive)`, `var(--border)`, etc., instead of hardcoded colors. Key files include:
- `src/App.scss`
- `src/styles/_mixins.module.scss`
- `src/styles/_media-queries.scss`
- `src/styles/_colours.module.scss`
- `src/components/Blanks/*.scss`
- `src/components/Congratulate/Congratulate.scss`
- `src/components/DropDowns/DropDowns.scss`
- `src/components/WordGrid/WordGrid.scss`
- `src/components/TreasureGrid/TreasureGrid.scss`
- `src/components/MemoryMatchGame/*.scss`
- `src/components/WordParts/WordParts.scss`
- `src/components/Jigsaw/*.scss`
- `src/components/LandingPage/LandingPage.scss`
- `src/components/LearningObjectMenu/LearningObjectMenu.scss`
- `src/components/ErrorLog/ErrorLog.scss`
- `src/components/Info/Info.scss`
- `src/components/Form/*/*.scss`
- `src/components/ReadAloud/ReadAloud.scss`
- `src/components/Sortable/Sortable.scss`
- `src/components/Footer/Footer.scss`
- `src/components/Header/Header.scss`
- `src/components/CrossWord/CrossWord.scss`
- `src/components/Monologue/Monologue.scss`
- `src/components/AudioClip/AudioClip.scss`
- `src/components/CustomComponents_FR/CustomComponents_FR.scss`

### Small utility changes
- `src/mouseUtility.js` default debug marker uses `hsl(var(--destructive))`.
- `src/components/Flag/Flag.jsx` now reads theme tokens for canvas shading (with fallbacks).

## 4) SVG and Icon Theming
Converted many icon SVGs to `currentColor` so they inherit CSS color.

### Updated
- `public/images/arrow.svg`
- `public/images/downArrow.svg`
- `public/images/icons/*.svg`
- `src/components/ErrorLog/*.svg`
- `src/components/AudioClip/speaker.svg`

## 5) Footer + Social Logos (currentColor)
- Social icons are now inline SVGs in `src/components/Social/Social.jsx` with CSS-driven color.
- Footer logos (LC/CC/eLearning) use `currentColor` and inherit color from CSS.
- UC language centre PNGs now use only black assets; dark mode inverts via CSS.

## 6) Banner + Layout adjustments
- Banner title uses `h2` (keeps lesson title as the main `h1`).
- Banner title aligned top-left.
- Banner height uses responsive `min-height: clamp(...)` to reduce cropping.
- Banner title size increased and uses `--hero-title-color`.
- Intro section layout updated so the intro paragraph is full width, with the “After completing…” info and image aligned side-by-side on large screens and stacked below `l` (960px).
- `#imagePlaceholder` resized and made responsive on smaller screens.

## 7) Background tones
- Light mode body background uses `--page-background` token (forced at the body level).
- `--color-surface-base` updated to the new warm palette.

## 8) Accordion UI refinements
- Hover and expanded header background uses `--accordion-mist` and titles are forced readable via `--accordion-hover-text`.
- Card content border restored with `border-t-0` and `rounded-t-none` to visually join the header.
- Content border color tuned via CSS (no line under open panels).
- Open/close animation uses max-height transitions with `--radix-accordion-content-height` and reduced motion support.
- Chevron spacing adjusted.

## 9) Vite Static Copy Fix
- Removed Spanish static-copy target from `vite.config.js`.

## 10) CSS Build Fix
- Removed the bottom `@layer base` block from `src/index.css` that used `@apply border-border outline-ring/50;` which was causing a dev-server 500.

## 11) Tooltips (shadcn/Radix)
- Added a shadcn-style Tooltip wrapper at `src/components/ui/tooltip.jsx` using Radix Tooltip and Tailwind tokens.
- Wrapped the app in `TooltipProvider` in `src/App.jsx` for consistent tooltip behavior.
- Replaced native `title` tooltips for vocabulary sort buttons with shadcn tooltips in `src/components/PhraseTable/PhraseTable.jsx`.
- Dialogue audio icons now reuse the same tooltip wrapper + footer-green surface so every audio trigger displays the shadcn-styled hover.

## 17) Dialogue Row Audio + Anchor Highlight (+ Typography + Grammar Layout)
- `src/components/PhraseTable/PhraseTable.jsx` now lets users click anywhere in a phrase row to replay its audio clip, matching the speaker button behavior for faster review.
- Anchored sections now reliably open + flash: `handleSpecialLinkClick` follows `.accordion-article` even after the semantic `<section>` switch, and the target gets a `.flash-target` class that animates with a warm `--ped-warn` glow.
- Inline `.special-anchor` links (normal + visited) use the same `oklch(0.646 0.222 41.116)` orange as the highlight in both global and `.can-speak` contexts so the link visually matches its destination.
- Added typography tokens (`--body-font-size`, `--body-line-height`) and applied them to paragraphs, list items, and table cells via `#content :where(...)` selectors so accordions, tables, and Info blocks share the same intro-scale body text.
- Grammar section image layout is now driven by React/Tailwind components instead of inline JSON styles, keeping the instructions card responsive without hard-coded padding.
- Defined a Tailwind-backed type scale (CSS variables + `theme.extend.fontSize`) so nav, accordion headers, and other components can use `text-sm/base/lg` utilities instead of hardcoded pixel sizes, making font tweaks centralized.
- Next typography pass: introduce CSS vars for the `2xl`/`3xl` sizes, remove redundant aliases, and swap remaining SCSS font-size declarations for Tailwind utilities so the entire UI draws from the same scale.
- Added a dedicated `HeroSection` layout for Introduction + Grammar so their instruction text and illustration live inside the card content with aligned top baselines.

## 12) Semantics: Sections
- Replaced the Introduction wrapper with a `<section>` in `src/App.jsx`.
- Switched top-level learning object blocks to `<section>` by updating `src/components/Accordion/AccordionArticle.jsx`.

## 13) Semantics: Heading cleanup
- Removed unnecessary `<span>` wrappers around plain-text section titles (kept only for `titleHTML`).

## 14) Semantics: Anchor placement
- Moved `special-anchor-target` ids/classes onto the `<h2>` element instead of wrapping it in a `<span>`.

## 15) Separators (shadcn/Radix)
- Added shadcn-style Separator component at `src/components/ui/separator.jsx`.
- Replaced instruction dividers with `Separator` in `src/components/Section/Section.jsx` and `src/components/PhraseTable/PhraseTable.jsx`.

## 16) Audio Path Normalization
- Fixed French audio playback by normalizing asset paths to NFD in `resolveAsset`, matching decomposed accent filenames on disk.

## 17) Modal Links → Modal (shadcn)
- Added a shadcn/Radix Dialog modal for modal links so clicks open contextual explanations instead of scrolling.
- Content is pulled from existing config `infoTextHTML`/`informationTextHTML` (single source of truth).
- Highlighting uses Tailwind classes in the modal; JSON can mark terms with `<span class='modal-highlight'>…</span>` without affecting in-page rendering.
- Removed the back-to-link button and scroll-back logic.

## 18) Modal Link Content Refactor (CustomComponents)
- Modal content for key grammar links (`tuvous`, `toi`, `madame`, `mademoiselle`) now renders the same React bodies from `src/components/CustomComponents_FR/CustomComponents_FR.jsx`, so the modal shows the intended copy and audio clips work.
- The modal dialog now accepts React content explicitly (in addition to HTML strings) because `AudioClip` components cannot render via `dangerouslySetInnerHTML`.
- Modal highlight animation now fades out after flashing (no lingering highlight).

## 18) Inline Audio Icon Consistency
- Normalized inline audio icon size and baseline alignment via `--audio-inline-size` and `--audio-inline-offset` in `src/components/AudioClip/AudioClip.scss`.

## 19) Introduction Card Styling Exception
- The Introduction `HeroSection` now supports a `transparentCard` flag, used for the intro only.
- This removes the white card background, border, and shadow so the Introduction sits on the main page background while other sections keep the default card styling.

## 20) Info Panel Typography
- Reduced info panel list text to `--font-size-sm` (~16px) and set the lead line (`h3`) slightly larger with `--font-size-base`.

## 21) Info Panel Icon
- Switched the Info panel icon to Lucide's `Info` (`lucide-react`) and removed the custom SVG mask.
- Updated the Lucide info icon styling to render as a filled black circle with a white "i".

## 22) Favicon
- Added `public/favicon.svg` using the eLearning logo from the footer and updated `index.html` to reference it.
- Generated PNG favicon assets (16/32), Apple touch icon, Android icons, and `public/site.webmanifest`.

## 23) Theme Toggle Smoothness
- Added a short `no-theme-transition` class during light/dark toggles to suppress CSS transitions and prevent table-row flicker.

## 24) Modal Link Icon
- Modal links now use the Lucide `message-square-warning` indicator icon.

## 25) Modal Link Naming
- Renamed `special-anchor`/`special-anchor-target` to `modal-link`/`modal-link-target` across configs, styles, and handlers.

## 26) WordParts Progress + Guidance
- Added circle-based progress indicators to WordParts and adjusted sizing/spacing for mobile.
- Updated the WordParts instructions to mention Show answer/Reset with inline icons.

## 27) Audio Playback Exclusivity (Single Active Clip)
- Fixed overlapping playback so only one audio clip can play at a time across the app.
- Added global helpers in `src/utility.js`:
  - `trackFloatingAudio` to track `new Audio(...)` instances.
  - `stopAllAudioPlayback` to pause all other active DOM/floating audio before new playback.
- Wired single-audio behavior into:
  - `src/components/AudioClip/AudioClip.jsx` (custom clip playback and native audio play events).
  - `src/components/SequenceAudioController/SequenceAudioController.jsx` (sequence play/resume).
  - `playAudioLink` in `src/utility.js` (row-link fallback playback).

## 27) Hero Banner Rendering (Non-cropping SVG)
- Replaced the hero CSS background banner with an explicit `<img>` in `src/App.jsx` (`src="images/fr_banner.svg"`), including `loading="eager"` and `fetchPriority="high"` for above-the-fold rendering.
- Updated `#hero` styles in `src/App.scss` to use `aspect-ratio: 16 / 9` and a positioned `.hero-image` with `object-fit: contain` and `object-position: center bottom`.
- Why: the previous `background-size: cover` implementation could crop banner artwork on narrower/wider viewports. The new setup preserves the entire SVG composition across responsive breakpoints while keeping the title overlay in place.

## 28) LO1 Listening Exercise Refactor (5/6/7)
- Renamed legacy exercise keys/ids in `src/learningObjectConfigurations/fr/1.json`:
  - `wordsIntoSlots5` -> `listeningOrder1`
  - `wordsIntoSlots6` -> `listeningOrder2`
  - `sortable1` -> `listeningOrder3`
- Added reusable draggable card UI component:
  - `src/components/SortableWordCard/SortableWordCard.jsx`
- Updated `src/components/SequenceOrder/SequenceOrder.jsx`:
  - swap-on-drop only (no live reorder on hover)
  - drop-target highlight improvements
  - responsive behavior: compact horizontal below ~1180px, vertical below ~900px
  - vertical layout uses up/down icon; horizontal uses left/right icon
  - removed fallback `"Speech"` caption rendering
  - action buttons follow the same hidden/reveal pattern used in other exercises
- Updated `src/components/Sortable/Sortable.jsx`:
  - adopts shared `SortableWordCard` visual style (vertical card look)
  - controls now match other exercises (`Check answers`, `Show answer`, `Reset`)
  - added shared `ProgressDots`
  - progress updates on `Check answers` (not during drag)
  - removed row check/cross indicators and extra textual success/error feedback
  - improved drag/drop stability by using target tracking + swap-on-drop commit
- Updated exercise instruction copy in `src/learningObjectConfigurations/fr/1.json` for consistent guidance and inline icon usage.

## 29) LO1 Exercise 7 Audio Path Migration (Legacy -> audio/lo1)
- Exercise 7 (`listeningOrder3`) audio moved from legacy `sounds/fr/...` references to LO1 sectioned paths in `src/learningObjectConfigurations/fr/1.json`.
- Added new audio files under:
  - `public/audio/lo1/exercises/listeningOrder3/001-homme.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/002-hotel.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/003-hopital.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/004-horrible.mp3`
- Used ASCII-safe filenames (`hotel`, `hopital`) to avoid accented path issues.

## 30) Inline Check Icon Consistency
- Added `public/images/icons/circle-check.svg`.
- Updated `.inline-icon-check` in `src/App.scss` to use the same circular check glyph style as the `Check answers` button icon across instruction text.

## 31) Typography Batch (Token Ownership) + Task Tracker Docs
- Refactored global typography ownership in `src/App.scss`:
  - `body` now uses tokenized base size (`var(--font-size-sm)`)
- Converted global `h1..h6` sizing block in `src/App.scss` from hardcoded rem values to token-based expressions derived from `--font-size-3xl`, preserving the existing visual ratio ladder.
- Updated `README.md` with a `Migration Trackers` section linking active planning/audit documents.
- Added `TASKS_COMPLETED.md` as a live checklist for:
  - typography migration progress
  - color migration progress
  - audio migration progress
  - accessibility/HTML validity phases

## 32) Typography Guard Policy Adjustment (Transition-Friendly)
- Updated `scripts/check-typography-guard.sh` policy:
  - still blocks literal `font-size` with `px/rem/em`
  - still blocks literal `line-height` with `px/rem/em`
  - now allows tokenized `font-family` declarations (`font-family: var(--font-...)`)
  - still blocks literal `font-family` declarations
- Synced docs to prevent policy drift:
  - `README.md`
  - `TYPOGRAPHY_PLAN.md`
  - `TYPOGRAPHY_MIGRATION.md`
  - `TASKS_COMPLETED.md`

## 33) Typography Font-Family Tokenization + Future Project Blueprint
- Updated `src/App.scss` to use tokenized font-family declarations:
  - `body` -> `var(--font-sans)`
  - `h1..h4` -> `var(--font-heading)` with explicit weights
  - `h5..h6` -> `var(--font-sans)` with explicit weight
  - `figure figcaption` -> `var(--font-sans)`
- Added `FUTURE_PROJECTS.md` with:
  - reusable master prompt for new React + Bun + Tailwind + shadcn + Lucide projects
  - strict single-source-of-truth theming policy (no SCSS)
  - recommended modern directory structure (including audio/video/images/svg/fonts)
  - copy-only short prompt for quick reuse
- Updated docs tracker references in `README.md` and progress state in `TASKS_COMPLETED.md`.

## 34) Typography Batch 3 (Small Text Tokenization)
- Updated `src/App.scss`:
  - `figure figcaption` font-size from hardcoded `0.75rem` -> `var(--font-size-xs)`
  - `.footnote` font-size from hardcoded `0.8rem` -> `var(--font-size-xs)`
- Updated `TASKS_COMPLETED.md` to mark Typography batch 3 as complete.

## 35) Typography Batch 4 (PhraseTable Tokenization)
- Updated `src/components/PhraseTable/PhraseTable.scss`:
  - audio-row span size from hardcoded `120%` -> `calc(var(--font-size-base) * 1.2)`
  - mobile span size from hardcoded `1.12rem` -> `calc(var(--font-size-base) * 0.97)`
  - mobile line-height from hardcoded `1.2` -> `var(--line-height-2xl)`
- Updated `TASKS_COMPLETED.md`:
  - marked Typography batch 4 complete
  - noted `MainMenu.scss` is already tokenized for typography sizing.

## 36) Typography Batch 5 (App Heading Rhythm Tokens)
- Updated `src/App.scss` heading rhythm to token-based line-height usage:
  - `h1..h6` line-height from hardcoded `1.2` -> `var(--line-height-2xl)`
  - heading top-margin factors now use `var(--line-height-2xl)` instead of hardcoded `1.2`
- Updated `TASKS_COMPLETED.md` to mark Typography batch 5 as in progress with heading-rhythm work complete.

## 37) Typography Batch 5.1 (App Line-Height Token Expressions)
- Updated `src/App.scss` to replace additional hardcoded line-height literals with token expressions:
  - `.app` line-height from `1.4em` -> `calc(var(--body-line-height) - 0.3)`
  - WordParts table text line-height from `1.3` -> `calc(var(--body-line-height) - 0.4)`
  - responsive WordParts table text line-height from `1.35` -> `calc(var(--body-line-height) - 0.35)`
  - desktop paragraph line-height from `1.6em` -> `calc(var(--body-line-height) - 0.1)`
- Updated `TASKS_COMPLETED.md` with this batch progress under Typography batch 5.

## 38) Typography Batch 5.2 (Speech Overlay Tokenization)
- Updated `src/App.scss` in `#SpeechSynthesisError`:
  - font-size from hardcoded `40px` -> `var(--font-size-2xl)`
  - line-height from hardcoded `60px` -> `calc(var(--font-size-2xl) * 1.5)`
- Why: this keeps overlay typography aligned with the shared token scale, so future global size tuning applies consistently and avoids isolated px-based drift.
- Updated `TASKS_COMPLETED.md` with this sub-step under Typography batch 5.

## 39) Typography Batch 5.3 (Mobile Title Token Expressions)
- Updated `src/App.scss` mobile block (`@media (max-width: 650px)`):
  - `.title-main` font-size from hardcoded `1.6em` -> `calc(var(--font-size-sm) * 1.6)`
  - `.title-sub` font-size from hardcoded `0.9em` -> `calc(var(--font-size-sm) * 0.9)`
- Why: this removes local `em` literals and ties mobile title sizing back to typography tokens, so a future base scale change updates these values consistently.
- Updated `TASKS_COMPLETED.md` to reflect this sub-step under Typography batch 5.

## 40) Accordion Spacing Consistency (Sortable)
- Removed the `noCard={true}` special case for `Sortable` in `src/App.jsx`.
- Updated `src/components/Sortable/Sortable.jsx` to render content-only (no internal `Card`/`CardContent` shell).
- Why: accordion content spacing/card chrome now come from one owner (`AccordionArticle`) for all exercise types, so the final listening exercise matches the other accordion panels.


# Files Deleted (partial but comprehensive)

## Language/Config
- `src/learningObjectConfigurations/de/`
- `src/learningObjectConfigurations/sp/`
- `src/config-uae-1.json`
- `src/config-ukraine-1.json`
- `src/index-sp.json`

## Components
- `src/components/CustomComponents_SP/`
- `src/styles/_skin.module.scss`

## Sounds
- `public/sounds/de/`
- `public/sounds/sp/`
- `public/sounds/ukraine/`
- `public/sounds/arabic-cyclist.mp3`

## Images (examples)
- UAE/Berlin/Kyiv/flags and other non-French assets removed.

## Logos removed (unused after inline/currentColor)
- `public/images/cc_logo_black.svg`
- `public/images/cc_logo_white.svg`
- `public/images/lc_logo_black.svg`
- `public/images/lc_logo_white.svg` (later re-added for CSS pipeline compatibility)
- `public/images/facebook_black.svg`
- `public/images/facebook_white.svg`
- `public/images/linkedin_black.svg`
- `public/images/linkedin_white.svg`
- `public/images/twitter-x-black.svg`
- `public/images/twitter-x-white.svg`
- `public/images/elearning.svg`
- `public/images/ucam_language_centre_h_white.png`
- `public/images/ucam_language_centre_v_white.png`


# Files Added
- `CHANGES.md` (this file)

# Notes
- The repo now assumes shadcn tokens are the single source of truth for theme values.
- If future language variants are added, keep `src/components` casing consistent and update copy targets in `vite.config.js`.
