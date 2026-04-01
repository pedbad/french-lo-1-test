# Navigation Refactor Checklist

Use this checklist when executing the nav split.

## Pre-Refactor

- [ ] Confirm current nav behavior in desktop and mobile.
- [ ] Confirm only one primary nav landmark exists.
- [ ] Confirm current `MainMenu` source path:
  - `src/components/layout/page-shell/MainMenu/MainMenu.jsx`

## Phase 1: Data/Logic Split

- [ ] Extract nav entry mapping to `navEntries.js` (pure helper).
- [ ] Extract highlight logic to `useMainMenuHighlight.js` (or helper module).
- [ ] Keep behavior parity (no feature changes).

## Phase 2: Render Split

- [ ] Create `MainMenuDesktopNav.jsx`.
- [ ] Create `MainMenuMobilePanel.jsx`.
- [ ] Create `MainMenuActions.jsx`.
- [ ] Keep `MainMenu.jsx` as orchestrator only.

## Accessibility

- [ ] Keep one primary `<nav aria-label="Main navigation">`.
- [ ] Mobile container is not a duplicate primary nav landmark.
- [ ] `Escape` closes mobile panel.
- [ ] Hamburger toggle keeps `aria-controls` + `aria-expanded`.

## Behavior Regression Checks

- [ ] Scroll highlight updates correctly per section.
- [ ] Nav click remains scroll-only.
- [ ] Mobile menu opens/closes correctly.
- [ ] Resize desktop<->mobile state transitions are stable.

## Build/Quality

- [ ] `yarn build` passes.
- [ ] `yarn prepush:local` passes.
- [ ] No new lint errors introduced.

## Documentation

- [ ] Update `docs/navigation/NAV_CHANGES.md`.
- [ ] Update `CHANGES.md`.
- [ ] If architecture rules changed, sync `docs/process/FUTURE_PROJECTS.md`.
