# Navigation Refactor Checklist

Use this checklist when executing the nav split.

## Pre-Refactor

- [x] Confirm current nav behavior in desktop and mobile.
- [x] Confirm only one primary nav landmark exists.
- [x] Confirm current `MainMenu` source path:
  - `src/components/layout/page-shell/MainMenu/MainMenu.jsx`

## Phase 1: Data/Logic Split

- [x] Extract nav entry mapping to `navEntries.js` (pure helper).
- [x] Extract highlight logic to `useMainMenuHighlight.js` (or helper module).
- [x] Keep behavior parity (no feature changes).

## Phase 2: Render Split

- [x] Create `MainMenuDesktopNav.jsx`.
- [x] Create `MainMenuMobilePanel.jsx`.
- [x] Create `MainMenuActions.jsx`.
- [x] Keep `MainMenu.jsx` as orchestrator only.

## Accessibility

- [x] One primary `<nav aria-label="Main navigation">` — verified via a11y tree snapshot.
- [x] Mobile container is `role="region"` not a duplicate nav landmark — verified.
- [x] `Escape` closes mobile panel — verified via keydown dispatch test.
- [x] Hamburger toggle keeps `aria-controls` + `aria-expanded` — verified.

## Behavior Regression Checks

- [x] Scroll highlight logic intact in `useMainMenuHighlight.js`.
- [x] Nav click remains scroll-only — `nav-scroll-link` class on all anchors.
- [x] Mobile menu opens/closes correctly — verified.
- [x] Resize to ≥1200px closes mobile panel — verified via resize + event dispatch test.

## Build/Quality

- [x] `yarn build` passes.
- [ ] `yarn prepush:local` passes (pre-existing lint failures unrelated to nav split).
- [x] No new lint errors introduced in the `MainMenu` split.

## Documentation

- [x] Update `docs/navigation/NAV_CHANGES.md`.
- [x] Update `CHANGES.md`.
- [x] Architecture unchanged — `docs/process/FUTURE_PROJECTS.md` needs no update.
