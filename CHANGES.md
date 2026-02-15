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

## 33) SCSS Removal Completed (One Source of Truth)
- Removed all remaining SCSS source files from `src/`:
  - `src/App.scss`
  - `src/styles/_colours.module.scss`
  - `src/styles/_media-queries.scss`
  - `src/styles/_mixins.module.scss`
  - `src/styles/_variables.module.scss`
- Removed final runtime SCSS import from `src/App.jsx` (`import "./App.scss";`).
- Migrated retained app-level/global CSS output into `src/index.css` to preserve behavior while consolidating ownership.
- Updated debug SVG source manifest references from `/src/App.scss` to `/src/index.css` in `src/debug/components/DebugSvgAssets.jsx`.
- Enforced zero-SCSS baseline in `scripts/check-scss-guard.sh`:
  - fails if any `.scss/.sass` exists under `src/`
  - fails on newly introduced SCSS imports in JS/TS files

Why this was important:
- One source of truth: tokens + Tailwind in `src/index.css` now drive global/custom component styling consistently.
- Better shadcn fit: shadcn/ui is utility/token-first; this architecture removes mixed-system friction.
- Easier maintenance: fewer cascade surprises, clearer diffs, faster refactors, and safer theme/token changes.
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

## 41) Sortable Info-to-Content Spacing Tweak
- Updated `src/components/Sortable/Sortable.jsx`:
  - increased spacing between the blue info panel and the sortable item container from `space-y-1` to `space-y-3`.
- Why: the previous gap was visually too tight in the last exercise; this restores consistent breathing room with the other accordion exercises.

## 42) Typography Batch 5.4 (Desktop Hero XL Tokenization)
- Updated `src/App.scss` (`@include respond-above(xl)`, `#hero h1`):
  - font-size from hardcoded `3rem` -> `calc(var(--font-size-3xl) * 0.75)`
- Why: removes the remaining literal size in that breakpoint and keeps desktop hero scaling tied to the shared typography token system.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 43) Typography Batch 5.5 (Accordion Mobile Line-Height Tokenization)
- Updated `src/components/Accordion/Accordion.scss` (`@media (max-width: 640px)`):
  - heading `line-height` from hardcoded `1.2` -> `var(--line-height-2xl)` (with existing `!important`)
- Why: removes one more hardcoded typography literal and keeps mobile accordion heading rhythm aligned with shared line-height tokens.
- Updated `TASKS_COMPLETED.md` to record this completed sub-step.

## 44) Typography Batch 5.6 (Responsive Hero Clamp Tokenization)
- Updated `src/App.scss` hero heading rules in responsive breakpoints:
  - `@include respond-above(s)`: `clamp(2.2rem, 4vw, 3rem)` -> `clamp(calc(var(--font-size-3xl) * 0.55), 4vw, calc(var(--font-size-3xl) * 0.75))`
  - `@include respond-above(m)`: `clamp(2.4rem, 4vw, 3.5rem)` -> `clamp(calc(var(--font-size-3xl) * 0.6), 4vw, calc(var(--font-size-3xl) * 0.875))`
- Why: keeps responsive hero sizing anchored to shared typography tokens while preserving the existing viewport behavior.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 45) Typography Batch 5.7 (Accordion Title Inline Line-Height Tokenization)
- Updated `src/components/Accordion/AccordionArticle.jsx` title style objects:
  - `lineHeight: "1.2"` -> `lineHeight: "var(--line-height-2xl)"`
  - applied in both plain-title and HTML-title render branches.
- Why: removes remaining hardcoded inline line-height in accordion titles and aligns title rhythm with shared typography tokens.
- Updated `TASKS_COMPLETED.md` to record this completed sub-step.

## 46) Typography Batch 5.8 (Core Hero Clamp Tokenization)
- Updated `src/App.scss` remaining hero/title clamp literals:
  - `.hero-title`: `clamp(4rem, 7.25vw, 5.75rem)` -> `clamp(var(--font-size-3xl), 7.25vw, calc(var(--font-size-3xl) * 1.4375))`
  - mobile `.hero-title`: `clamp(2.4rem, 7.5vw, 3.1rem)` -> `clamp(calc(var(--font-size-3xl) * 0.6), 7.5vw, calc(var(--font-size-3xl) * 0.775))`
  - mobile `#content h1`: `clamp(1.6rem, 5.2vw, 2.1rem)` -> `clamp(calc(var(--font-size-3xl) * 0.4), 5.2vw, calc(var(--font-size-3xl) * 0.525))`
- Why: this removes the remaining hardcoded `rem` values from the primary hero/title typography path and keeps scale tuning anchored to `--font-size-3xl`.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 47) Sortable Spacing Follow-up (Post-debug)
- Updated `src/components/Sortable/Sortable.jsx` sortable list wrapper:
  - added `mt-2` to the `mx-auto w-[80%]` container below the blue info panel.
- Why: increases separation between the instruction/info box and the sortable card container for the final listening exercise, after visual verification.

## 48) Typography Batch 5.9 (Shared Mixins Tokenization)
- Updated `src/styles/_mixins.module.scss` to remove remaining literal typography values in shared mixins:
  - `line-height: 2rem` -> `line-height: calc(var(--font-size-sm) * 2)`
  - `font-size: 1rem` -> `font-size: var(--font-size-sm)` (two locations)
  - `line-height: 20px` -> `line-height: calc(var(--font-size-sm) * 1.25)`
  - `font-size: 16px` -> `font-size: var(--font-size-sm)`
  - `font-size: 0.7rem` -> `font-size: calc(var(--font-size-sm) * 0.7)`
- Why: these mixins are reused across components, so tokenizing here reduces repeated literal typography and improves consistency at shared-style entry points.
- Updated `TASKS_COMPLETED.md` with this completed step.

## 49) Typography Batch 5.10 (Shared Mixins Font-Family Tokenization)
- Updated `src/styles/_mixins.module.scss` (`.button-info` inside `@mixin comparison`):
  - `font-family: "Times New Roman", Times, serif` -> `font-family: var(--font-heading)`
- Why: removes a remaining hardcoded SCSS font-family and keeps family selection aligned with the token source of truth.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 50) Typography Batch 5.11 (CrossWord Inline Font-Size Tokenization)
- Updated `src/components/CrossWord/CrossWord.jsx` inline styles:
  - clue-number marker `fontSize: 10` -> `fontSize: 'calc(var(--font-size-sm) * 0.625)'`
  - cell input `fontSize: 16` -> `fontSize: 'var(--font-size-sm)'`
- Why: removes remaining hardcoded inline typography literals in CrossWord and aligns its text sizing with shared token scale.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 51) Typography Batch 5.12 (Residual Literal Cleanup)
- Removed an unused Sass typography literal variable from `src/styles/_variables.module.scss`:
  - deleted `$header-footer-font-size: 0.8rem` (no usages in repo)
- Removed stale commented literal typography examples from `src/App.scss`:
  - deleted old commented `h2` lines with `line-height: 2em` and `font-size: 1.6em`
- Why: clears remaining literal typography references/drift points so tokenized rules are the only active source.
- Updated `TASKS_COMPLETED.md` with this cleanup step.

## 52) Typography Batch 5.13 (Accordion Title Style Consolidation)
- Updated `src/components/Accordion/AccordionArticle.jsx`:
  - extracted duplicated inline title typography object into a shared `ACCORDION_TITLE_STYLE` constant.
  - both plain-title and HTML-title branches now use `style={ACCORDION_TITLE_STYLE}`.
- Why: keeps tokenized accordion title typography defined once, reducing drift risk between render branches.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 53) Footer Social Links Row Added
- Updated `src/components/Footer/Footer.jsx`:
  - added a new `footer-social-links` row under the existing square logo row.
  - footer now renders links through a dedicated `FooterSocialLinks` component.
  - added `rel="noopener noreferrer"` to external `target="_blank"` links in the footer.
- Added `src/components/Footer/FooterSocialLinks.jsx`:
  - componentized Facebook, X, YouTube, LinkedIn, and Instagram links.
  - uses Lucide icons where available and a custom inline SVG for X brand parity.
- Updated `src/components/Footer/Footer.scss`:
  - refactored `.square-logos` to a column layout with `.square-logos-row` + `.footer-social-links`.
  - set social icon sizing/alignment for mobile and right-aligned placement under eLearning on desktop.
- Why: places social links where users expect them (footer brand area) while preserving responsive layout and external-link safety.

## 54) Typography Batch 5.14 (Footer + Congratulate Tailwind Tokenization)
- Updated `src/components/Congratulate/Congratulate.jsx`:
  - `CONGRATULATE_TEXT_CLASS` tokenized from hardcoded px values:
    - `text-[40px]` -> `text-[calc(var(--font-size-base)*2.174)]`
    - `leading-[60px]` -> `leading-[calc(var(--font-size-base)*3.261)]`
    - `md:text-[80px]` -> `md:text-[calc(var(--font-size-base)*4.348)]`
    - `md:leading-[90px]` -> `md:leading-[calc(var(--font-size-base)*4.891)]`
- Updated `src/components/Footer/Footer.jsx`:
  - license text line-height from hardcoded `leading-[26px]` -> `leading-[calc(var(--font-size-base)*1.413)]`
- Why: removes remaining hardcoded Tailwind typography literals in JSX and keeps sizing tied to token scale while preserving current visual ratios.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 55) Typography Batch 5.15 (Regional Map Label Tokenization)
- Updated `src/components/CustomComponents_FR/CustomComponents_FR.scss` (`#RegionalTelephoneMap`):
  - `--regional-map-label-size: 74.6667px` -> `calc(var(--font-size-base) * 4.058)`
  - `--regional-map-label-size-small: 40px` -> `calc(var(--font-size-base) * 2.174)`
- Why: removes remaining component-level px typography literals and ties SVG label sizing to the shared type token scale, while preserving current visual ratios.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 56) Typography Batch 5.16 (Font-Face Ownership Split)
- Added `/Users/ped/Sites/french/french-lo-1-test/src/styles/fonts.css` as the dedicated font registry:
  - moved all `@font-face` declarations from `src/App.scss` into this file
  - added `font-display: swap` to each face for better loading behavior
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/main.jsx`:
  - imports `./styles/fonts.css` before `./index.css`
- Updated `/Users/ped/Sites/french/french-lo-1-test/scripts/check-typography-guard.sh`:
  - keeps strict `font-family` guard everywhere
  - allows literal `font-family` only in `src/styles/fonts.css` (for `@font-face`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md` guardrails to document that narrow exception.
- Why: separates font-asset loading from component styling while preserving token-based font usage as the single source for typography application.

## 57) Typography Batch 5.17 (Dark-Mode Token De-duplication)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - removed duplicate dark-mode typography token assignments (`--font-size-*`, `--line-height-*`, `--body-line-height`) from `.dark`.
  - typography tokens now remain defined once in `:root` and are shared by both themes.
- Why: reduces token drift risk and reinforces one source of truth for typography scale across light/dark mode.

## 58) Typography Batch 5.18 (Semantic Line-Height Tokens)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css` typography tokens:
  - added semantic line-height tokens:
    - `--line-height-body`
    - `--line-height-body-tight`
    - `--line-height-body-loose`
    - `--line-height-app`
    - `--line-height-wordparts`
    - `--line-height-wordparts-mobile`
  - kept `--body-line-height` as backward-compatible alias to `--line-height-body`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.scss`:
  - replaced ad-hoc arithmetic line-height expressions with semantic token usage in:
    - `.app`
    - `#content .abbreviations`
    - `#content :where(p, li, td, th, figcaption, caption)`
    - WordParts table text (desktop + mobile)
    - intro paragraph block
    - medium-breakpoint paragraph rhythm
- Why: removes inline line-height math, clarifies intent by context, and keeps line-height tuning centralized in tokens.

## 59) Typography Batch 5.19 (Component Consumers to Semantic Line-Height Tokens)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Info/Info.jsx`:
  - migrated `INFO_CONTENT_TEXT_CLASS` line-height utilities from `var(--body-line-height)` to `var(--line-height-body)`.
  - replaced `[_h3]:leading-[1.4]` with tokenized `[_h3]:leading-[var(--line-height-app)]`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/instructions-media.jsx`:
  - migrated Tailwind utility and inline style line-heights from `var(--body-line-height)` to `var(--line-height-body)`.
  - updated HTML normalization helper to inject `var(--line-height-body)` for paragraph/list nodes.
- Why: completes consumer migration to semantic line-height tokens and reduces dependence on the backward-compat alias.

## 60) Typography Batch 5.20 (WordParts Tailwind Line-Height Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/WordParts/WordParts.jsx`:
  - `WORD_PARTS_TEXT_CLASS` line-height utilities:
    - `leading-[1.35]` -> `leading-[var(--line-height-wordparts-mobile)]`
    - added desktop tokenized line-height: `md:leading-[var(--line-height-wordparts)]`
- Why: removes remaining non-token Tailwind line-height literal and aligns WordParts text rhythm with semantic line-height tokens introduced in batch 5.18.

## 61) Typography Batch 5.21 (Exercise Constant Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Blanks/Blanks.jsx`:
  - tokenized `BLANKS_TARGET_BOARD_TEXT_CLASS` from `text-[1.2rem]`
  - tokenized flow/row line-height utilities:
    - `leading-[1.4em]` -> `leading-[var(--line-height-app)]`
    - `leading-[0.5rem]` / `sm:leading-[3.5rem]` -> tokenized `calc(var(--font-size-sm) * ...)`
    - `leading-[2.6rem]` -> tokenized `calc(var(--font-size-sm) * 2.6)`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Blanks/DraggableWordTile/DraggableWordTile.jsx`:
  - tokenized `BLANK_WORD_TEXT_CLASS` from `text-[1.2rem] leading-[1.4rem]`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/ReadAloud/ReadAloud.jsx`:
  - tokenized `READ_ALOUD_RECORD_BUTTON_TEXT_CLASS` from `text-[1.2rem]`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/TreasureGrid/TreasureGrid.jsx`:
  - tokenized `TREASURE_GRID_MESSAGE_TEXT_CLASS` from `text-[1.2rem]`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Jigsaw/Jigsaw.jsx`:
  - tokenized `JIGSAW_CLUE_TEXT_CLASS` (`1.4rem`) and `JIGSAW_TIME_TEXT_CLASS` (`2rem`)
  - tokenized `JIGSAW_CANVAS_TEXT_CLASS` line-height from `leading-[1.4em]` to `leading-[var(--line-height-app)]`
- Why: removes a concentrated group of remaining hardcoded typography literals from exercise components while preserving visual ratios through token expressions.

## 62) Typography Batch 5.22 (Tabs + DropDowns Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - tokenized tabs trigger text sizes:
    - `!text-[1.2rem]` -> `!text-[calc(var(--font-size-sm)*1.2)]`
    - `min-[1170px]:!text-[1.4rem]` -> `min-[1170px]:!text-[calc(var(--font-size-sm)*1.4)]`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/DropDowns/DropDowns.jsx`:
  - tokenized dropdown trigger typography:
    - `leading-[1.4rem]` -> `leading-[var(--line-height-app)]`
    - `md:text-[1.2rem]` -> `md:text-[calc(var(--font-size-sm)*1.2)]`
  - tokenized dropdown option medium text utility:
    - `md:text-[1.2rem]` -> `md:text-[calc(var(--font-size-sm)*1.2)]`
- Why: removes remaining hardcoded rem typography utilities from tabs/dropdown controls and aligns them with the shared token scale.

## 63) Typography Batch 5.23 (Header + Modal + Attribution Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Header/Header.jsx`:
  - tokenized `HEADER_TEXT_CLASS` line-height from `leading-[3rem]` -> `leading-[calc(var(--font-size-sm)*3)]`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/ModalLinkDialog/ModalLinkDialog.jsx`:
  - tokenized mobile title/body heading overrides:
    - `max-[650px]:!text-[1.35rem]` -> `max-[650px]:!text-[var(--font-size-lg)]` (title and nested `h2`/`h3`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Attribution/Attribution.jsx`:
  - tokenized `ATTRIBUTION_TEXT_CLASS` from `text-[0.5rem]` -> `text-[calc(var(--font-size-sm)*0.5)]`
- Why: removes another focused set of rem-based utility literals and keeps typography sizing aligned with shared tokens.

## 64) Typography Batch 5.24 (Sortable + MemoryMatch Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/SortableWordCard/SortableWordCard.jsx`:
  - tokenized remaining rem-based text utilities in `textClass` variants (`0.78rem`, `0.92rem`, `0.98rem`, `1.08rem`)
  - tokenized stacked index badge text utilities (`0.68rem`, `0.72rem`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MemoryMatchGame/MemoryMatchGame.jsx`:
  - tokenized cards/matches responsive text utilities:
    - cards: `0.8rem`, `0.9rem`, `1rem`
    - matches: `0.6rem`, `0.7rem`, `0.8rem`
- Why: eliminates the next concentrated cluster of hardcoded rem typography utilities in exercise display components while preserving existing visual scale via token expressions.

## 65) Typography Batch 5.25 (Legacy Line-Height Alias Removal)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - removed legacy `--body-line-height` alias after migrating all consumers to semantic tokens (`--line-height-body`, etc.).
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md`:
  - refreshed typography token wording to reference current semantic token names.
- Why: completes line-height token migration and removes a compatibility alias that could reintroduce naming drift.

## 66) Typography Completion Pass (Tailwind Mapping + Tracker Closure)
- Updated `/Users/ped/Sites/french/french-lo-1-test/tailwind.config.js`:
  - replaced final legacy line-height reference `var(--body-line-height)` with `var(--line-height-body)`.
  - mapped `xs/sm/lg/xl` line-heights to semantic tokens (`--line-height-xs`, `--line-height-sm`, `--line-height-lg`, `--line-height-xl`) instead of inline numeric literals.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - added semantic line-height tokens used by Tailwind mapping:
    - `--line-height-xs`
    - `--line-height-sm`
    - `--line-height-lg`
    - `--line-height-xl`
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` and `/Users/ped/Sites/french/french-lo-1-test/README.md`:
  - marked typography stream complete for current scope and aligned wording with semantic token naming.
- Why: removes the last runtime dependency on a removed alias and closes the typography migration loop with a single tokenized line-height vocabulary.

## 67) Color Guardrails (Script + Package Wiring)
- Added `/Users/ped/Sites/french/french-lo-1-test/scripts/check-color-guard.sh`:
  - detects added literal color drift in style-like lines across `scss/css/jsx/tsx/js/ts` diffs.
  - blocks:
    - hex literals (`#fff`, `#ffcc00`, ...)
    - named colors (`black`, `white`, `red`, ...)
    - color functions without token indirection (`rgb(...)`, `oklch(...)`, etc. without `var(--...)`)
  - supports `--staged`, `--working`, and `--against <ref>` (matching typography guard workflow).
- Added `/Users/ped/Sites/french/french-lo-1-test/scripts/color-allowlist.txt`:
  - file-scoped allowlist for intentional literal color definitions.
  - seeded with `src/index.css` (token source).
- Updated `/Users/ped/Sites/french/french-lo-1-test/package.json` scripts:
  - added `check:color`
  - added `check:color:branch`
  - updated `prepush:local` to include `yarn check:color:branch`
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md`:
  - documented color guard policy and usage commands.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`:
  - marked color guard script + prepush wiring tasks complete.
- Why: mirrors typography guardrails to prevent new non-token color drift while continuing hotspot-by-hotspot migration.

## 68) Color Hotspot Migration (App/MainMenu/AudioClip) + Guard Compatibility Fix
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.scss`:
  - replaced remaining literal warning/link accent color `oklch(0.646 0.222 41.116)` with semantic token `var(--ped-warn)` for modal links.
  - replaced button text fallback `var(--primary-foreground, #fff)` with token-only `var(--primary-foreground)`.
  - replaced hover darkening mixes from `black` to tokenized `var(--foreground)` in `.btn-ped-warn`, `.btn-chart-2`, and `.btn-hero-title`.
  - replaced hero local custom property literal `oklch(0.398 0.07 227.392)` with semantic token `var(--chart-3)`.
  - updated `.modal-link`/`:visited` text-decoration color mixes to derive from `var(--ped-warn)` token.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.scss`:
  - replaced mobile toggle/menu separator literal `oklch(0 0 0 / 0.06)` with tokenized `color-mix(in oklab, var(--foreground) 6%, transparent)`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/AudioClip/AudioClip.scss`:
  - replaced hover literal accent `oklch(0.646 0.222 41.116)` with semantic `var(--ped-warn)`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/scripts/check-color-guard.sh`:
  - replaced Bash `mapfile` usage with a Bash-3-compatible read loop for macOS compatibility.
  - replaced HTML-comment skip regex with a Bash-3-safe string match.
- Why: removes the next high-impact cluster of literal color values in priority files while keeping visual behavior aligned to semantic tokens and ensuring the color guard works reliably on local macOS shells.

## 69) Footer Color Tokenization (Crest + Social Dark Palettes)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Footer/Footer.scss`:
  - replaced crest highlight `white` color-mix usage with semantic footer crest tokens.
  - replaced footer social icon foreground `oklch(1 0 0)` with `var(--footer-social-icon-fg)`.
  - replaced dark-mode social icon literal color/gradient/shadow values with token references:
    - base dark styles: `--footer-social-dark-*`
    - per-network variants: `--footer-social-facebook-*`, `--footer-social-x-*`, `--footer-social-youtube-*`, `--footer-social-linkedin-*`, `--footer-social-instagram-*`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - added centralized footer visual tokens:
    - crest shading tokens (`--footer-crest-*`)
    - social icon foreground token (`--footer-social-icon-fg`)
    - dark social variant tokens (`--footer-social-...`)
- Why: keeps current footer visuals intact while moving component-level literal color definitions into centralized token ownership, advancing the color single-source-of-truth model.

## 70) MainMenu Semantic Color Cleanup
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.scss`:
  - replaced `rgb(var(--color-text-secondary))` with semantic `var(--muted-foreground)` for nav links.
  - replaced hover `rgb(var(--color-text-primary))` with semantic `var(--foreground)` for nav links.
  - applied the same semantic replacements to mobile nav links.
- Why: moves MainMenu away from palette-channel color references toward semantic token usage, improving theme readability and consistency.

## 71) Docs Sync (AGENTS Guardrail Parity)
- Updated `/Users/ped/Sites/french/french-lo-1-test/AGENTS.md`:
  - added color guard policy details to match current workflow (`scripts/check-color-guard.sh`, `scripts/color-allowlist.txt`).
  - documented local quality gates (`check:typography`, `check:color`, branch checks, and `prepush:local`).
- Why: keeps onboarding/operator docs aligned so contributors follow the same token guardrails documented in README and task trackers.

## 72) Heading Separator Normalization (App Title)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - extracted title splitting into `splitDisplayTitle`.
  - normalized heading split logic to support both `:` and `—` as source separators.
  - preserved current rendered format (`title-main — title-sub`) and existing `title-main`/`title-sub` styling hooks.
- Why: avoids title formatting drift when content sources mix colon and em-dash conventions.

## 73) Heading Separator Coverage Expansion
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` (`splitDisplayTitle`):
  - expanded supported source separators to include:
    - `:`
    - `—` (em dash)
    - `–` (en dash)
    - `|` (pipe)
    - spaced hyphen (` - `)
  - kept matching conservative for dash separators (requires surrounding spaces) to avoid splitting hyphenated words.
- Why: improves resilience to mixed title punctuation while preventing accidental splits in normal hyphenated terms.

## 74) Build Asset De-duplication (Fonts/Images/Sounds)
- Added `/Users/ped/Sites/french/french-lo-1-test/FONTS_PROBLEM.md`:
  - documented the duplication issue, root cause, impact, and verification checklist for maintainers.
- Updated `/Users/ped/Sites/french/french-lo-1-test/vite.config.js`:
  - removed redundant `viteStaticCopy` targets for `public/fonts`, `public/images`, and `public/sounds`.
  - kept `viteStaticCopy` only for JSON files sourced from `src/...`.
- Verification:
  - fresh `yarn build` succeeds.
  - nested duplicate folders are no longer produced:
    - `dist/fonts/fonts` (removed)
    - `dist/images/images` (removed)
    - `dist/sounds/sounds` (removed)
- Why: Vite already copies `public/` assets by default; duplicating them via static-copy created redundant output and larger artifacts.

## 75) Audio Ordering TODO Documentation
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` (Audio section):
  - added a future TODO to formalize LO1 exercise/audio mapping so folder alphabetical order is not mistaken for render order.
  - captured follow-up actions:
    - document JSON render-order source (`exercises.content`)
    - add optional `audioFolder` + `order` metadata
    - add a validation script to verify folder/audio reference consistency.
- Why: prevents future drift/confusion during ongoing audio restructuring work.

## 76) Color Cleanup Batch (WordParts + MemoryMatch)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/WordParts/WordParts.scss`:
  - removed literal fallback from `var(--primary-foreground, #fff)` to token-only `var(--primary-foreground)`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MemoryMatchGame/MemoryMatchGame.scss`:
  - replaced Sass transparent helper from `rgba(#fff, 0)` to `transparent`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MemoryMatchGame/Card/Card.scss`:
  - replaced Sass transparent helper from `rgba(#fff, 0)` to `transparent`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` (Color section):
  - logged this low-risk fallback-literal cleanup as complete.
- Why: removes remaining color literal/fallback debt in active exercise styles while keeping visuals unchanged and token ownership clean.

## 77) Color Cleanup Batch (Flag Canvas Shading)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Flag/Flag.jsx`:
  - switched canvas shading from `--foreground/--background` with black/white fallback literals to semantic RGB channel tokens:
    - `--color-text-primary`
    - `--color-surface-base`
  - standardized shading color construction with `rgba(...)` using token channels.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` (Color section):
  - logged the Flag token-channel migration and added a follow-up decision item for remaining Sass utility literals in `_mixins.module.scss`.
- Why: removes a remaining literal fallback path and aligns dynamic canvas shading with the same semantic token system used elsewhere.

## 78) Color Cleanup Batch (Exercise Mixes + Shared Gradient)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Blanks/Blanks.scss`:
  - replaced warning hint background mix from `black` to semantic `var(--foreground)`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Blanks/DraggableWordTile/DraggableWordTile.jsx`:
  - replaced `white/black` mixes in Tailwind arbitrary color-mix utilities with semantic tokens:
    - `var(--background)`
    - `var(--foreground)`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/styles/_mixins.module.scss`:
  - updated shared `header-footer-background` mixin to use `var(--foreground)` instead of literal `black` in gradient edge mixes.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` (Color section):
  - recorded completion of this tokenization pass and narrowed the remaining follow-up to the Sass `contrast()` helper policy.
- Why: continues color unification by removing literal `black/white` mixes in active exercise styling and shared gradient utilities while preserving visual intent via semantic tokens.

## 79) Semantics + Inline Spacing Cleanup (`<b>/<i>` + AudioLink sentence spacing)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/CustomComponents_FR/CustomComponents_FR.jsx`:
  - replaced legacy presentational tags in rendered JSX content:
    - `<b>` -> `<strong>`
    - `<i>` -> `<em>`
  - fixed Grammar 2 ("tu vs vous") inline spacing to use explicit React spaces around inline `AudioClip` nodes:
    - `{' '}` between `Tu`, `and`, `vous`, and `both mean 'you'.`
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/ReadAloud/ReadAloud.jsx`:
  - replaced phrase wrapper `<b>` with semantic `<strong>`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - changed sample HTML string from `<b>HTML</b>` to `<strong>HTML</strong>`.
- Validation:
  - `yarn build` passes successfully after the semantic-tag migration and spacing fix.
- Why: improves semantic HTML/accessibility without changing behavior, and removes whitespace ambiguity around inline audio components.

## 80) Color Guard Tuning + Mixins Policy Closure
- Updated `/Users/ped/Sites/french/french-lo-1-test/scripts/check-color-guard.sh`:
  - reduced false positives in class scanning by removing generic `className=` context matching and relying on utility-style token detection (`text-`, `bg-`, `border-`, `from-`, `to-`, `via-`, etc.).
- Updated `/Users/ped/Sites/french/french-lo-1-test/scripts/color-allowlist.txt`:
  - clarified policy to keep allowlist limited to canonical token source files.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/styles/_mixins.module.scss`:
  - removed unused `contrast()` Sass helper that contained compile-time `white/black/#ffffff` literals.
  - replaced remaining `lightGray` literal with semantic token `var(--muted)` in `button-info`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`:
  - marked the last two color migration policy/guard tasks complete.
- Why: closes outstanding color migration governance work without expanding allowlists or retaining dead literal-color helper code.

## 81) Accessibility Phase 1A (Invalid `name` attrs + Empty ID emission)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - removed invalid `name` attribute from top modal-link target span (`id="modal-link-top"` retained).
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/Section.jsx`:
  - removed invalid `name` attribute from section heading target.
  - removed invalid `name` attribute from article wrapper div.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/HeroSection/HeroSection.jsx`:
  - removed invalid `name` attribute from hero heading target.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`:
  - removed invalid `name` attributes from accordion heading targets (title + titleHTML paths).
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/CustomComponents_FR/CustomComponents_FR.jsx`:
  - removed invalid non-form `name` attributes from modal-link spans/anchor (`madame`, `mademoiselle`, `tuvous`, `toi`, `subject-pronouns`).
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/IconButton/IconButton.jsx`:
  - changed `id={id || ''}` to `id={id || undefined}` so empty `id=""` is no longer emitted.
- Validation:
  - `yarn build` passes.
  - color guard still passes (`yarn -s check:color:branch`).
- Why: resolves high-noise HTML validity issues with minimal behavioral risk by removing invalid legacy attributes and preventing empty id output.

## 82) Docs Sync (Semantics + Accessibility-First Future Blueprint)
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md`:
  - mirrored semantic/a11y updates to reflect current state:
    - `<main id="content">` landmark in place
    - inline emphasis migration (`<strong>/<em>`)
    - abbreviations content using semantic definition-list markup (`<dl>/<dt>/<dd>`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/FUTURE_PROJECTS.md`:
  - strengthened accessibility-first rules for all new projects:
    - semantic landmarks/headings and proper interactive semantics from day one
    - explicit accessibility test gates (lint + automated checks + keyboard pass) before merge
    - accessibility treated as a non-negotiable quality gate, not a post-build cleanup task
- Why: prevents documentation drift and makes accessibility expectations explicit in both current-repo guidance and future project scaffolding.

## 83) Accordion Migration Planning Docs (Architecture Drift Control)
- Added accordion architecture/risk analysis:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_ISSUES.md`
- Added accordion migration execution plan (baby steps + test matrix + timeline):
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
- Added accordion-specific progress tracker:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md` migration tracker links to include all accordion docs.
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md` with a dedicated accordion migration section and explicit rationale.
- Decision captured:
  - use debug-first migration to tune shadcn/Radix accordion UX safely
  - then migrate main app accordion with parity checks for config-driven behavior and modal-link/deep-link contracts
- Why: the current accordion path is a design-system exception and long-term maintenance risk; planning docs make the refactor explicit, testable, and measurable.

## 84) Link Contract Split (Nav Scroll vs Modal Content)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx`:
  - replaced legacy `modal-link` class usage on top-nav anchors with `nav-scroll-link`.
  - top navigation remains explicitly scroll-only via `handleModalLinkClick(..., { mode: "scroll" })`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - `initialiseModalLinks()` now treats `.modal-link` as modal-only; removed legacy branch that switched behavior by checking `.nav`.
  - added code comments clarifying class responsibility and avoiding future overload.
- Updated documentation:
  - `/Users/ped/Sites/french/french-lo-1-test/README.md` now documents the explicit link contract.
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md` now includes link-class contract lock as a migration decision.
- Why: removes a confusing legacy naming pattern where one class (`modal-link`) represented two different interaction models (scroll + modal), reducing maintenance risk and accidental regressions.

## 85) Accordion Migration Start (shadcn Primitive + Debug Integration)
- Added dependency:
  - `@radix-ui/react-accordion` in `/Users/ped/Sites/french/french-lo-1-test/package.json`
- Added shadcn-style accordion primitive:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/accordion.jsx`
- Migrated debug structure summary from native `<details>/<summary>` to shadcn/Radix accordion:
  - `/Users/ped/Sites/french/french-lo-1-test/src/debug/components/LearningObjectStructureSummary.jsx`
  - preserved current row layout (LO link left, structure accordion right)
  - preserved ordered-list structure and section/exercise summary content
- Updated migration tracking docs:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
- Why: executes the approved debug-first migration step in a low-risk surface, validates shared primitive wiring, and reduces drift before main-app accordion cutover.

## 86) Accordion Main-App Wrapper Scaffold (Compatibility First)
- Added compatibility wrapper:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`
- Wrapper preserves existing app contracts while using Radix accordion internals:
  - `id`, `target`, `title/titleHTML`, `config`, `noCard`, `expandNow`, and children rendering contracts
  - session persistence via `${id}-expanded`
  - heading/deep-link compatibility (`modal-link-*`, `data-modal-target`)
  - `(part N)` title suffix split styling
  - info injection + child `suppressInfo` behavior
- Exported wrapper via:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/index.js`
- Why: prepares a low-risk migration path for incremental `App.jsx` adoption without forcing a full accordion cutover in one step.

## 87) Accordion Incremental Adoption Pilot (`AnswerTable`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - the `AnswerTable` render branch now uses `AppAccordionArticle` instead of the legacy `AccordionArticle`.
  - removed legacy `ref` handoff for that pilot path (function component wrapper is refless by design).
- Why: validates the incremental migration strategy on a low-risk path before expanding wrapper adoption to higher-traffic accordion branches.

## 88) Debug Accordion Visual Parity Tuning (Chevron + Hover/Open Skin)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/accordion.jsx`:
  - moved chevron to the left of heading text and increased icon size/contrast for clearer affordance.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/debug/components/LearningObjectStructureSummary.jsx`:
  - applied main-app style parity for accordion trigger hover/open states using `--accordion-mist` and `--accordion-hover-text`.
  - added slower color/shadow transitions (`duration-700`) to match the app’s intentional interaction feel.
- Why: improves clarity and consistency while keeping these visual tweaks scoped to the debug migration surface.

## 89) Accordion Incremental Adoption Batch 2 (`PhraseTable`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - migrated expandable `PhraseTable` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoff for this wrapper-driven branch.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Why: expands wrapper adoption to a high-visibility content path (dialogues/vocabulary) while preserving compatibility contracts before broader cutover.

## 90) Accordion Incremental Adoption Batch 3 (`Blanks` + `WordParts`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - migrated `Blanks` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `WordParts` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoffs for these wrapper-driven branches.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
- Why: extends the compatibility-wrapper rollout into exercise-heavy flows, reducing remaining legacy accordion surface while preserving behavior contracts.

## 91) Accordion Incremental Adoption Batch 4 (`DropDowns` + `Monologue` + `RadioQuiz`)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - migrated `DropDowns` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `Monologue` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `RadioQuiz` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoffs for these wrapper-driven branches.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
- Why: continues batch-by-batch migration of interactive sections to the compatibility wrapper while preserving deep-link, info-suppression, and persisted-expansion contracts.

## 92) Accordion Clickability Fix (Wrapper Interaction Regression)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`:
  - corrected Radix header/trigger structure using `AccordionPrimitive.Header asChild` around the `<h2>` heading target.
  - removed invalid nested heading structure that could interfere with trigger interaction.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - narrowed `.modal-link-target` click suppression to anchor elements only (`<a>`).
  - avoids preventing default on non-anchor heading targets used by accordion triggers.
- Why: fixes a migration regression where accordion headings could become non-clickable after wrapper adoption.

## 93) Accordion Collapse Animation Fix (Second-Click Did Not Close)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`:
  - removed `forceMount` from `AccordionPrimitive.Content` so Radix can manage open/close presence correctly.
  - switched content animation classes to state-based variants:
    - `data-[state=open]:animate-accordion-down`
    - `data-[state=closed]:animate-accordion-up`
- Why: `forceMount` kept wrapper content effectively always present, so close interactions could appear to reopen instead of collapsing.

## 94) Accordion Visual Parity Fix (Legacy + Wrapper Selector Alignment)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`:
  - tagged Radix item node with `accordion-item` to provide a stable CSS hook during incremental migration.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - expanded accordion selectors to target both DOM shapes:
    - legacy (`.accordion-article > header`, `.accordion-article > .content`)
    - wrapper/Radix (`.accordion-article .accordion-item > header`, `.accordion-article .accordion-item > .content`)
  - applied this to normal, hover, expanded, and mobile typography selectors.
- Why: migrated accordion sections (for example dialogues) were no longer matching direct-child legacy selectors, causing style drift versus non-migrated sections.

## 95) Accordion Chevron Single Source of Truth (App + Debug)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - introduced shared `.accordion-chevron` style for icon size, shrink behavior, color inheritance, and transform transition.
  - removed legacy hardcoded arrow width/height and side margins that were forcing app chevrons smaller than debug chevrons.
  - aligned app trigger spacing (`gap`) with debug accordion trigger spacing for visual consistency.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/accordion.jsx`:
  - switched debug accordion chevron to the shared `.accordion-chevron` class.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx` and `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`:
  - switched app accordion chevrons to use the same shared class.
- Why: keeps chevron styling in one place so debug and production accordions stay visually identical during and after migration.

## 96) Accordion Main-App Full Cutover + Legacy Removal
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - migrated all remaining expandable branches from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `window.refs` setup and deleted unused `expandAllAccordions` helper.
  - replaced top-level `<Accordion />` wrapper usage with a plain `.accordion` container div.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`:
  - removed stale `expandNow` pathway (no active callers remained).
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/index.js`:
  - removed exports of deleted legacy accordion components.
- Deleted legacy files:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/Accordion.jsx`
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
- Why: completes production cutover to one active accordion behavior path and removes dead legacy code that was creating architecture drift.

## 97) Accordion Docs Sync (No Drift)
- Updated migration/architecture trackers:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_ISSUES.md`
- Updated project-level status docs:
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
- Why: keeps task boards and architecture docs aligned with the actual codebase after full accordion cutover.

## 98) DOM Semantics Audit + Execution Docs (`main > section > article`)
- Added semantic architecture audit:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_AUDIT.md`
  - documents current DOM shape, target hierarchy, inconsistency points, and concrete style/JS regression risks.
- Added phased implementation plan:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - defines migration phases for section landmarks, nav/hash compatibility, article semantics, selector hardening, and heading hierarchy.
- Added regression checklist:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_CHECKLIST.md`
  - covers structure, nav behavior, accordion behavior, modal-link behavior, accessibility, visual parity, and quality gates.
- Updated tracker index in `/Users/ped/Sites/french/french-lo-1-test/README.md` to include these files.
- Why: makes semantic DOM refactor explicit, testable, and low-risk before changing markup.

## 99) DOM Semantics Docs Sync (Header/Nav/Hero + Responsive Landmark Rule)
- Expanded `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_AUDIT.md` with:
  - current page-top DOM snapshot (`header/nav/hero/main`) and identified semantic issues.
  - explicit statement that `div#accordion1.accordion` is a misleading top-level container.
  - full target structure that includes header, single primary nav landmark, intro section, and section/article hierarchy under `main`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`:
  - added a dedicated phase for responsive-safe header/nav/hero semantics.
  - clarified that mobile responsiveness is preserved while avoiding duplicate primary nav landmarks.
- Updated `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_CHECKLIST.md`:
  - added checks for one primary nav landmark, responsive mobile behavior, and hero/heading-order correctness.
- Updated `/Users/ped/Sites/french/french-lo-1-test/README.md`:
  - added explicit DOM semantics contract bullets to prevent implementation/doc drift.
- Why:
  - removes ambiguity around "single nav landmark" vs responsive UX.
  - locks heading/landmark expectations before DOM refactor implementation.

## 100) Mobile Nav Semantics + Skip Link (Accessibility-First DOM Prep)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx`:
  - changed mobile dropdown wrapper from `<nav>` to `<div role="region" aria-label="Main navigation mobile">` so the page has one primary nav landmark for the same IA.
  - added `aria-controls` on the menu toggle and `id` on the mobile panel for explicit control relationship.
  - added Escape-key close behavior for the mobile panel.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - added a keyboard skip link (`Skip to main content`) targeting `#content`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - added focus-visible skip-link styling so it remains hidden until keyboard focus.
- Updated task tracking docs:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Why:
  - improves screen-reader landmark clarity and keyboard navigation immediately.
  - reduces risk before broader semantic DOM restructuring.

## 101) Hero Heading Semantics Fix (`h2` -> non-heading text)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - replaced hero title `<h2 className="hero-title ...">` with `<p className="hero-title ...">`.
  - changed hero banner image to decorative semantics (`alt=""` + `aria-hidden="true"`).
- Updated semantic tracking docs:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Why:
  - removes heading-order ambiguity (no `h2` before page `h1`).
  - keeps visual hero text unchanged while improving document outline semantics.

## 102) Hero Typography Parity Fix (Feijoa Bold Restored)
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - added explicit hero-title typography rules after converting semantic tag from `h2` to `p`:
    - `font-family: "Feijoa Bold", var(--font-heading)`
    - `font-weight: 700`
    - `line-height: var(--line-height-2xl)`
- Updated `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`:
  - checked off visual parity restoration for hero title styling.
- Why:
  - preserves intended design while maintaining corrected semantic heading structure.

## 103) Accordion Wrapper Naming + Semantic Root Update
- Updated app accordion wrapper naming:
  - renamed component `AppAccordionArticle` -> `AccordionArticle`.
  - updated imports/usages in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`.
  - updated accordion barrel export in `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/index.js`.
- Updated wrapper file path:
  - moved `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AppAccordionArticle.jsx`
  - to `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`.
- Updated semantic root element in wrapper:
  - root changed from `<section>` to `<article>` while retaining `.accordion-article` class.
- Synced docs/trackers to avoid drift:
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_ISSUES.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
- Why:
  - clearer component naming and improved semantic HTML alignment for accordion content units.

## 104) Hero Semantics Contract Lock + Checklist Drift Fix
- Updated semantic DOM trackers to remove drift and lock final hero behavior:
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_CHECKLIST.md`
- Updated project docs to align with the same contract:
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Locked decision:
  - hero remains outside `main` intentionally as decorative page chrome.
  - hero text remains non-heading (`p.hero-title`) and hero image remains decorative (`alt=""`, `aria-hidden="true"`).
- Why:
  - avoids semantic-outline drift (`h2` before page `h1`) without forcing decorative page chrome into core content landmarks.
  - keeps accessibility/structure documentation consistent with actual implementation.

## 105) Semantic Section-ID Nav Cutover + Top-Level DOM Cleanup
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - removed legacy top-level wrapper `<div class="accordion" id="accordion1">`.
  - introduced semantic top-level section siblings directly under `main`:
    - `#introduction`, `#dialogues`, `#vocabulary`, `#grammar`, `#pronunciation`, `#exercises`.
  - removed hidden `#modal-link-top` anchor.
  - hardened modal fallback extraction container lookup to include `article`:
    - `closest("p, li, article, section, div")`.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx`:
  - nav links now use semantic section hashes (`#introduction`, `#dialogues`, etc.) instead of legacy `#modal-link-*`.
  - scroll-spy/highlight lookup now targets section IDs directly.
- Updated heading-ID strategy:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/Section.jsx`
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/HeroSection/HeroSection.jsx`
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
  - section headings now use semantic IDs (`${sectionId}-heading`) instead of legacy `modal-link-*` naming.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/index.css`:
  - accordion interaction selectors now scope from `#content` (no dependency on removed `.accordion` wrapper).
- Updated docs to avoid drift:
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/DOM_SEMANTIC_CHECKLIST.md`
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
- Why:
  - removes the misleading “one accordion” top wrapper from page-level structure.
  - establishes semantic section IDs as the single source of truth for navigation and scroll behavior.
  - eliminates legacy naming ambiguity (`modal-link-*`) for top-level content landmarks.

## 106) Nav Highlight/Scroll Precision Fix After Semantic-ID Migration
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx`:
  - default nav highlight now starts at `null` (prevents false `Introduction` highlight before section positions are available).
  - added config-change recalculation in `componentDidUpdate` so highlight state initializes correctly when LO config loads asynchronously.
  - section detection now resolves semantic heading anchors first (`${sectionId}-heading`) for tighter active-state accuracy.
- Updated `/Users/ped/Sites/french/french-lo-1-test/src/utility.js`:
  - reduced legacy oversized scroll fudge offset and replaced with tighter fixed-menu offset for cleaner section alignment.
  - scroll-mode target lookup now prefers heading anchors (`${sectionId}-heading`) before section IDs.
- Updated tracking docs:
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - focused lint run on touched files passes with no errors.
- Why:
  - fixes initial incorrect menu highlight state on first load.
  - improves scroll landing accuracy so target sections align cleanly under the fixed nav without leftover content from the previous section.


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
