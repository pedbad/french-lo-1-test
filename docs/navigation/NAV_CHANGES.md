# Navigation Changes Log

This file tracks navigation-specific architecture decisions and refactor progress.

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
