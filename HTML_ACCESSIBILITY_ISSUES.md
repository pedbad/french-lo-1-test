# HTML & Accessibility Issues Audit

## Scope

This audit is based on your validator output from the Vite dev-rendered page.

Important: that output includes **many false positives/noise** from Tailwind v4, SCSS module internals, and Vite-injected `<style>` tags. We should validate built HTML (`yarn build && yarn preview`) and then fix only real app markup/a11y issues.

## Completed Semantic Upgrades (Already Applied)

- Added semantic main landmark: the primary content wrapper now uses `<main id="content">` (replacing a generic container).
- Replaced legacy presentational inline tags in rendered JSX:
  - `<b>` -> `<strong>`
  - `<i>` -> `<em>`
- Replaced abbreviation table-like content with better semantics using abbreviation definitions (`<dl>`, `<dt>`, `<dd>`) in `CustomComponents_FR` (Abbreviations block).

## What Is Noise (Do Not Triage First)

These are mostly tooling/validator-compatibility issues, not app defects:

- `@layer`, `@property` unknown at-rules (Tailwind v4 CSS features)
- CSS custom property color parsing like `var(--...) is not a color value`
- SCSS module internals like `:export` blocks
- `style type="text/css"` warnings from injected dev styles
- Chrome extension script warnings in page source

## Why Specific Errors Were Wrong (and Why They Were Bad)

### Real defects that required fixes

1. Invalid flex alignment value: `align-items: space-between`

- Why wrong: `space-between` is not a valid value for `align-items`; it belongs to `justify-content`.
- Why bad: browsers ignore invalid declarations, so layout falls back unexpectedly (often `stretch`), causing misalignment and inconsistent spacing across breakpoints.
- Fix applied: replaced with `justify-content: space-between` in affected containers.

2. Invalid word-break value: `word-break: keep-word`

- Why wrong: `keep-word` is not a standard `word-break` value.
- Why bad: invalid declarations are dropped, so long tokens may overflow or wrap inconsistently depending on browser fallback behavior.
- Fix applied: replaced with validator-compliant `word-break: normal` while retaining `overflow-wrap` rules for long content.

3. Duplicate IDs (e.g. `congratulate`, `undefined-Info`)

- Why wrong: HTML requires document-unique IDs.
- Why bad: breaks deterministic targeting (`getElementById`, anchor jumps), can corrupt ARIA relationships (`aria-controls`, labels), and creates unstable behavior for scripts and assistive technology.
- Fix applied: ID generation now avoids undefined fallbacks and duplicate literals.

### Validator noise that is usually not a runtime defect

4. `var(--token) is not a color value`

- Why flagged: some validator profiles do not fully evaluate modern tokenized color systems (`var(...)`, `color-mix(...)`, modern color spaces) at parse time.
- Runtime reality: these are valid when tokens are defined in `:root`/theme scope and computed by the browser.
- Actual risk: if a token is missing at runtime, computed values can become invalid and the property may fall back or be dropped.

5. `style type="text/css"` warnings in dev output

- Why flagged: HTML5 does not require `type` for CSS.
- Why seen: Vite dev server injects transient style tags for HMR with attributes aimed at tooling.
- Runtime reality: not an app-authored production defect.

6. `script type="text/javascript"` with `chrome-extension://...`

- Why flagged: `type` is unnecessary and source is foreign to app code.
- Why seen: browser extension injection into the active tab.
- Runtime reality: not shipped by the repo build; validate in extension-free/incognito session.

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

3. Invalid non-form `name` attributes removed (Phase 1A)

- Removed legacy `name` attributes from non-form elements in:
  - `App`
  - `Section`
  - `HeroSection`
  - `AccordionArticle`
  - key modal-link targets in `CustomComponents_FR`
- Rationale: validator-compliant HTML (non-form elements should use `id` for fragment targets).

4. Empty `id=""` emission reduced at source

- `IconButton` now renders `id={id || undefined}` instead of `id={id || ''}`.
- Rationale: prevents invalid empty id values being emitted repeatedly by icon-only controls.

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

## Guardrails (Prevent Regressions)

The repo now includes a staged-diff a11y/HTML guard:

- Script: `scripts/check-a11y-guard.sh`
- Staged check: `yarn check:a11y`
- Branch check: `yarn check:a11y:branch`

What it blocks in newly added lines:

- `role="button"` on `<header>`
- `aria-label` on `<span>`
- `aria-label` on `<div>` without explicit non-generic role
- `title` on `<svg>`
- spaces in `<img src>` path segments
- repeated literal `id="..."` values inside added diff lines
- newly introduced duplicate literal `id="..."` values (staged index count increases vs `HEAD`)

Pre-commit hook now runs:

- `yarn -s check:typography`
- `yarn -s check:color`
- `yarn -s check:a11y`

How to use:

1. One-time hook setup: `bash scripts/setup-githooks.sh`
2. Stage files: `git add <files>`
3. Run guard manually: `yarn check:a11y`
4. Commit normally; pre-commit will run all three guards.

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

## Chrome Validation Workflow (Local)

Use this exact flow to validate production markup/CSS (not Vite dev-injected source).

1. Clean and rebuild:

```bash
rm -rf dist
yarn build
```

Why: this repo includes a `preserve-dist-index` build plugin that can restore an older `dist/index.html` when `dist/` already exists.

2. Start preview with a known local base path:

```bash
yarn preview --base /french-basic/
```

3. Use this preview URL in Chrome:

- `http://localhost:4173/french-basic/?lang=fr&lo=1`

4. Open Chrome incognito from bash with the preview URL:

```bash
open -na "Google Chrome" --args --incognito "http://localhost:4173/french-basic/?lang=fr&lo=1"
```

5. In Chrome DevTools, copy the rendered HTML:
1. Open DevTools (`Cmd+Option+I`)
1. Go to the Elements panel
1. Run this in Console to copy HTML with doctype in one step:
   `copy('<!DOCTYPE html>\n' + document.documentElement.outerHTML);`
1. Paste into a text editor and verify it starts with `<!DOCTYPE html>`.

1. Validate at W3C:

- URL: `https://validator.w3.org/nu/#textarea`
- Paste the HTML into the text area and click **Check**.

Notes:

- Localhost URLs cannot be fetched directly by W3C servers, so use copy/paste (`#textarea`) for local preview validation.
- If extension-related script noise appears, use incognito with extensions disabled in incognito permissions.
- If you still see injected cookie-banner CSS noise, validate with:
  `http://localhost:4173/french-basic/?lang=fr&lo=1&skipCookieControl=1`

How to verify:

1. `rm -rf dist && yarn build`
2. `yarn preview --base /french-basic/`
3. Open:
   `http://localhost:4173/french-basic/?lang=fr&lo=1&skipCookieControl=1`
4. Use incognito and ensure extensions are disabled for incognito.
5. Copy HTML with doctype and validate in:
   `https://validator.w3.org/nu/#textarea`
