# Accordion Issues and Architecture Drift

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Purpose
Document why the current accordion implementation is a maintenance risk, where it drifts from the current shadcn/Radix architecture, and what must be preserved during refactor.

## Current State (What Exists Today)

1. Main app accordion is custom:
   - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/Accordion.jsx`
   - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
2. Debug page accordion-like UI is native `details/summary`:
   - `/Users/ped/Sites/french/french-lo-1-test/src/debug/components/LearningObjectStructureSummary.jsx`
3. No shadcn accordion primitive currently exists in:
   - `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/`

## Why This Is Architecture Drift

The project standard has moved to:
- shadcn primitives in `src/components/ui`
- tokenized styling in `src/index.css`
- predictable utility/component composition

Accordion is an exception. It remains a bespoke stateful system with custom DOM/CSS behavior. This creates a second UI behavior model in the codebase.

## What The Custom Accordion Is Doing (Special Behavior To Preserve)

1. Per-panel persistence in session storage (`${id}-expanded`).
2. Dynamic content-height animation using `--radix-accordion-content-height`.
3. Deep-link/modal targeting via `modal-link-*` IDs and `data-modal-target`.
4. Support for text and HTML titles (`title` and `titleHTML`).
5. Optional title formatting for `(part N)` suffix.
6. Optional `Info` injection from `config` and suppression of duplicated child info.
7. Optional card shell behavior (`noCard` vs card-wrapped content).
8. JSON-driven recursive rendering for Group/Section trees in `App.jsx`.

## Problems and Risks

### 1) Component-model inconsistency
- App uses custom accordion semantics while the rest of UI uses shadcn primitives.
- Cost: higher onboarding and slower refactors because developers must learn bespoke behavior.

### 2) Accessibility risk from CSS-only collapse model
- Closed panels are hidden by `max-height: 0` and `overflow: hidden` instead of primitive-managed visibility.
- Risk: hidden controls can remain in tab/focus order depending on browser and content.

### 3) Legacy/unused pathways increase complexity
- `expandNow` path exists but is not actively wired by current render flow.
- `window.refs` population and `expandAllAccordions` class-toggling are legacy patterns.
- `expandAllAccordions` queries `div.arrow` while the icon is rendered as `svg.arrow`.
- Cost: dead logic and false confidence during debugging.

### 4) Dual source of accordion semantics
- Main app: custom React state + class toggles.
- Debug: native `details/summary`.
- Cost: UX and keyboard behavior differ between surfaces.

### 5) Harder long-term design-system alignment
- As shadcn/Radix evolves, this custom accordion will not inherit primitive fixes, docs patterns, or standard behavior by default.

### 6) Legacy link-class overload (now corrected)
- Historically, top navigation links and modal-content links both used `.modal-link`.
- This overloaded one class with two interaction models (scroll vs modal), increasing confusion and regression risk.
- Contract moving forward:
  - navigation links use `nav-scroll-link` and are scroll-only
  - content links use `modal-link` and are modal-only

## Why This Matters

Without refactor, accordion remains a high-churn exception in a repo that otherwise consolidated around a single styling/component architecture.

This is exactly the kind of drift that causes:
- regressions in interactive behavior
- a11y inconsistencies
- expensive UI maintenance over time

## Target End State

1. App and debug accordions both use shadcn/Radix accordion primitives.
2. Existing business behavior is preserved (session persistence, deep-link IDs, info injection).
3. Legacy accordion-only pathways are removed.
4. Accordion behavior is covered by a clear test checklist (keyboard, deep-links, modal links, responsive, theme parity).

## On Debug-First Migration

Debug-first is a good plan, with one caveat:
- It should be treated as a UI/interaction spike, not full proof of production readiness.

Why:
- Debug accordion content is simpler and does not fully exercise recursive Group/Section rendering in `App.jsx`.
- We still need explicit production migration tests for deep-link and config-driven behavior.

Recommended approach:
1. Build and tune shadcn accordion in debug first.
2. Then migrate main app with a compatibility wrapper that preserves current contracts.
