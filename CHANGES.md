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
