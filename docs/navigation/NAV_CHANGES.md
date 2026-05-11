# Navigation Changes Log

This file tracks navigation-specific architecture decisions and refactor progress.

## 2026-05-08 - MainMenu Parity Split Started

Completed the first parity refactor pass for `MainMenu`:

- extracted config-to-nav mapping into `navEntries.js`
- extracted scroll highlight resolution into `useMainMenuHighlight.js`
- split desktop nav rendering into `MainMenuDesktopNav.jsx`
- split mobile panel rendering into `MainMenuMobilePanel.jsx`
- split theme/menu actions into `MainMenuActions.jsx`
- kept the existing mobile panel container rather than introducing shadcn `Sheet`

Validation:

- `yarn build` passes
- scoped lint for `src/components/layout/page-shell/MainMenu` passes
- full `yarn lint` still fails on existing unrelated lint errors outside the nav split, including ignored `.claude/worktrees` files and older exercise/debug files

Next:

- browser-check desktop and mobile menu parity
- keep shadcn `Sheet` as a later optional container hardening step

## 2026-04-01 - Navigation Docs Baseline Created

Added a dedicated navigation docs set to avoid plan drift:

- `docs/navigation/NAV_TODO.md`
- `docs/navigation/NAV_CHECKLIST.md`
- `docs/navigation/NAV_CHANGES.md`

Reason:

- We already agreed nav should be modularized, but the details were spread across docs.
- This centralizes the human rationale ("why this matters") and the execution checklist.

Current status:

- Decision is documented.
- Refactor implementation is pending (parity-first split planned).

## 2026-04-01 - Drift Guard Clarification

To reduce duplicate-plan drift:

- `docs/components/NAVIGATION_REFACTOR_README.md` is now explicitly technical-only.
- `docs/navigation/NAV_CHECKLIST.md` is the canonical checklist.
- `docs/navigation/NAV_CHANGES.md` is the canonical status log.
