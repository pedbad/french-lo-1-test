# HTML & Accessibility Issues Audit

## Scope
This audit is based on your validator output from the Vite dev-rendered page.

Important: that output includes **many false positives/noise** from Tailwind v4, SCSS module internals, and Vite-injected `<style>` tags. We should validate built HTML (`yarn build && yarn preview`) and then fix only real app markup/a11y issues.

## What Is Noise (Do Not Triage First)
These are mostly tooling/validator-compatibility issues, not app defects:
- `@layer`, `@property` unknown at-rules (Tailwind v4 CSS features)
- CSS custom property color parsing like `var(--...) is not a color value`
- SCSS module internals like `:export` blocks
- `style type="text/css"` warnings from injected dev styles
- Chrome extension script warnings in page source

## Real Issues To Fix (Actionable)

### P0 / High
1. Duplicate IDs across repeated components
- Examples: `undefined-Info`, `LO1-...-Section`, `congratulate`, empty `id=""` on buttons.
- Impact: broken label/control associations, invalid DOM, unstable JS behavior.

2. Invalid/obsolete attributes on non-form elements
- `name` used on `div`, `h2`, `span`.
- Impact: invalid HTML and fragile selector/link behavior.

3. Interactive semantics on non-interactive elements
- `header role="button"` patterns for accordion triggers.
- Impact: keyboard/screen-reader behavior risk.

4. Invalid/overused ARIA
- `aria-label` on elements that should not have it (e.g., generic spans/divs).
- Impact: accessibility tree noise and possible WCAG failures.

### P1 / Medium
5. Invalid SVG/image attributes and path issues
- `alt` on inline `svg` (invalid)
- image `src` with spaces in path segments
- Impact: validator errors, brittle URL handling.

6. Structural heading/section consistency
- Some `<section>` elements lacking proper heading structure.
- Impact: weaker screen-reader navigation.

7. Minor HTML validity warnings
- unnecessary `role="main"` on `<main>`
- title on unsupported elements in some contexts

## Quick Wins Completed (2026-02-14)
1. Semantic emphasis tags in rendered JSX
- Replaced legacy presentational tags in active rendered JSX content:
  - `<b>` -> `<strong>`
  - `<i>` -> `<em>`
- Rationale: keeps emphasis semantic and improves assistive-technology interpretation with no UI behavior change.

2. Inline spacing around audio-link sentence content
- In LO1 Grammar 2 ("tu vs vous"), replaced whitespace-dependent spacing with explicit React spaces (`{' '}`) around inline `AudioClip` components.
- Rationale: avoids collapsed/ambiguous spacing when inline components render as wrappers (`span`/inline-flex).

## Likely Root Causes
- Legacy component patterns mixed with newer shadcn/Tailwind patterns.
- Reusable components generating IDs from optional props (falling back to invalid/duplicate values).
- Prior implementation used `name` attributes for anchor targets instead of `id` + hash links.
- Non-semantic wrappers (`div/span`) used for interactive controls and audio triggers.

## Fix Plan (Phased)

### Phase 1: Stop invalid IDs and names (quick stability win)
- Remove all `id=""` outputs.
- Remove invalid `name` attributes from non-form elements.
- Generate deterministic unique IDs for repeated components using React `useId` + suffix.
- Ensure accordion content/trigger IDs are paired and unique.

Estimated time: **2-3 hours**

### Phase 2: Fix interactive semantics
- Replace clickable `header` patterns with semantic button inside heading:
  - `<h3><button ... aria-expanded ... aria-controls ...></button></h3>`
- Ensure keyboard behavior uses native button handling (Enter/Space).

Estimated time: **2-3 hours**

### Phase 3: ARIA cleanup
- Remove ARIA where native semantics already exist.
- Keep `aria-label` only on actual interactive controls when visible label is missing.
- For icon-only controls, ensure accessible names are present.

Estimated time: **1.5-2.5 hours**

### Phase 4: SVG/image/path cleanup
- Remove `alt` from inline SVG and use `aria-hidden="true"` unless meaningful.
- If SVG is meaningful, add `<title>` + `role="img"` correctly.
- Rename image paths to avoid spaces and update references.

Estimated time: **1-2 hours**

### Phase 5: Landmarks/headings pass
- Ensure each major section has consistent heading levels.
- Remove redundant landmark roles.

Estimated time: **1-1.5 hours**

## Total Estimated Time
- **7.5 to 12 hours** (including retest/fixes)
- If we include extra regression checks across LO1 interactions: **+2 to 3 hours**

## Testing Plan

### 1) Build-time checks
- `yarn lint`
- `yarn build`

### 2) Automated accessibility checks
- Run axe (browser extension or Playwright + axe) on key pages/states:
  - initial load
  - each accordion section expanded
  - each exercise interaction state (before/after check answers)
  - light and dark mode

### 3) HTML validation (correct way)
- Validate **production-rendered HTML** from `yarn preview`, not Vite dev source.
- Re-run validator after each phase to confirm error count drops.

### 4) Keyboard and SR smoke tests
- Keyboard-only pass:
  - Tab order visible and logical
  - Enter/Space activates controls
  - focus does not get trapped
- Screen reader quick pass (VoiceOver/NVDA):
  - headings list makes sense
  - accordion states announced
  - icon-only buttons have names

### 5) Regression checks
- Audio playback controls still function.
- Accordion open/close behavior unchanged.
- Modal links and anchor jumps still work.
- No visual regressions in footer/nav/exercise controls.

## Suggested Execution Order In Repo
1. Fix shared components first (`Accordion`, `Info`, button wrappers).
2. Then fix repeated content renderers in `CustomComponents_FR`.
3. Then fix config-driven ID generation in LO JSON render path.
4. Run full retest and update `CHANGES.md` with accessibility section.

## Definition of Done
- No duplicate IDs.
- No empty IDs.
- No invalid `name` attributes on non-form elements.
- Accordion controls are semantic buttons with valid ARIA wiring.
- Inline SVGs use valid accessibility attributes.
- Validator output reduced to expected modern-CSS/tooling noise only.
- Keyboard and screen-reader smoke tests pass.
