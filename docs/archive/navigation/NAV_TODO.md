# Navigation TODO

## Problem In Human Terms

Right now the top navigation works, but too much responsibility lives in one place (`MainMenu.jsx`):

- desktop nav rendering
- mobile panel rendering
- nav entry building
- scroll highlight logic
- mobile open/close and keyboard handling

This makes small changes risky. A tweak for mobile can accidentally affect desktop highlight behavior, and vice versa.

## Why We Should Do This Later (Not As A Rush Patch)

This is a structural refactor, not a visual bug fix. The UI is currently stable, so we should do it in controlled parity batches with regression checks.

If we rush this:

- we can break highlight-on-scroll behavior
- we can break keyboard escape behavior in mobile menu
- we can introduce duplicate nav landmarks (a11y regression)

## Planned Refactor Direction

Move from monolith to modules under:

`src/components/layout/page-shell/MainMenu/`

- `MainMenu.jsx` (orchestrator only)
- `MainMenuDesktopNav.jsx`
- `MainMenuMobilePanel.jsx`
- `MainMenuActions.jsx`
- `navEntries.js`
- `useMainMenuHighlight.js`

## Non-Negotiables

1. No visual drift.
2. One primary nav landmark only.
3. Same keyboard/mobile behavior:
   - `Escape` closes mobile panel
   - `aria-controls` + `aria-expanded` stay correct
4. Top nav stays scroll-only (`nav-scroll-link` contract).

## Execution Plan (Safe Order)

1. Extract pure `navEntries` helper first.
2. Extract highlight lifecycle helper/hook next.
3. Split desktop/mobile renderers.
4. Keep `MainMenu.jsx` as composition layer.
5. Optional: move mobile panel container to shadcn `Sheet` (parity-only).

## References

- `docs/components/NAVIGATION_REFACTOR_README.md`
- `docs/process/FUTURE_PROJECTS.md` (`Responsive Navigation Pattern`)
