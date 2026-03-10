# Navigation Refactor README

## Scope
This document defines a low-risk refactor plan for the top navigation implementation in:

- `/Users/ped/Sites/french/french-lo-1/src/components/layout/page-shell/MainMenu/MainMenu.jsx`

Goal: keep current visual style and behavior while reducing complexity and improving maintainability, accessibility confidence, and testability.

## Current Implementation (Summary)

The current top nav is a hybrid:

1. shadcn/Radix primitives:
- `NavigationMenu` from `/Users/ped/Sites/french/french-lo-1/src/components/ui/navigation-menu.jsx`

2. Custom behavior logic:
- section highlight on scroll
- mobile menu open/close state
- breakpoint resize behavior
- escape-to-close handling
- nav click + scroll behavior

3. Styling:
- Tailwind utility classes + project token classes from `src/index.css`

## Why Refactor

1. `MainMenu.jsx` currently owns too many responsibilities.
2. nav data shaping and rendering are mixed with interaction logic.
3. desktop/mobile behavior is harder to reason about and test in one file.
4. future nav variants (new projects) risk copy-paste drift.

## Non-Negotiables

1. No visual drift from current production nav skin.
2. No behavior drift for:
- active section highlight
- smooth scroll behavior
- mobile panel toggle/close
- keyboard escape close
3. Keep one primary navigation landmark (do not introduce duplicate `<nav>` landmarks for same IA).

## Proposed Target Architecture

```text
src/components/layout/page-shell/MainMenu/
|- MainMenu.jsx                    # orchestrator/container only
|- MainMenuDesktopNav.jsx          # desktop list rendering
|- MainMenuMobilePanel.jsx         # mobile panel rendering
|- MainMenuActions.jsx             # theme toggle + hamburger trigger
|- navEntries.js                   # pure helper for nav entry shaping
|- useMainMenuHighlight.js         # scroll/resize highlight logic hook/helper
```

## Refactor Plan (Phased)

### Phase 1: Structural split only
- Extract render subcomponents from `MainMenu.jsx`.
- Keep existing class names and DOM hierarchy where possible.
- Keep all current behaviors untouched.

### Phase 2: Logic extraction
- Move nav entry shaping into `navEntries.js` (pure function).
- Move highlight lifecycle logic into `useMainMenuHighlight.js` (or equivalent helper).
- Keep current offsets/threshold behavior identical.

### Phase 3: Optional shadcn mobile container hardening
- Optional: migrate custom mobile panel wrapper to shadcn `Sheet` while preserving styling tokens and IA.
- Keep the same link contracts and section IDs.

### Phase 4: Test hardening
- Add focused tests for:
  - active highlight transitions
  - mobile open/close and escape key
  - nav click behavior (scroll-only links)

## Validation Checklist

- [ ] Desktop nav links match existing labels/order.
- [ ] Mobile panel opens/closes exactly as before.
- [ ] Active highlight updates correctly on scroll.
- [ ] Escape closes mobile panel.
- [ ] No duplicate nav landmarks introduced.
- [ ] `yarn build` passes.
- [ ] `yarn lint` passes.

## Notes for Future Projects

1. Use shadcn primitives for structure, not as a substitute for responsive behavior orchestration.
2. Keep nav orchestration logic in small dedicated helpers/hooks from day one.
3. Use one styling ownership path: tokenized Tailwind + shared utility classes only.
