# Accordion Issues and Architecture Drift

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Purpose
Document why the current accordion implementation is a maintenance risk, where it drifts from the current shadcn/Radix architecture, and what must be preserved during refactor.

## Current State (What Exists Today)

1. Main app accordion path now uses:
   - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
   - wired globally from `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`
2. Debug structure summary uses shadcn/Radix accordion:
   - `/Users/ped/Sites/french/french-lo-1-test/src/debug/components/LearningObjectStructureSummary.jsx`
   - shared primitive in `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/accordion.jsx`
3. Legacy custom accordion files were removed:
   - deleted `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/Accordion.jsx`
   - deleted legacy class-toggle `AccordionArticle` implementation (replaced by current Radix wrapper at the same canonical path)
4. Legacy dead paths were removed:
   - removed `window.refs` pattern in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`
   - removed `expandAllAccordions` class-toggle helper from `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`
   - removed stale `expandNow` path from `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`

## Why This Is Architecture Drift

The project standard has moved to:
- shadcn primitives in `src/components/ui`
- tokenized styling in `src/index.css`
- predictable utility/component composition

The major drift risk has been removed (no more legacy custom accordion model in production flow). The remaining architectural nuance is that app accordion behavior is handled in `AccordionArticle` while debug uses the shared `ui/accordion` wrapper directly.

## What The Custom Accordion Is Doing (Special Behavior To Preserve)

1. Per-panel persistence in session storage (`${id}-expanded`).
2. Dynamic content-height animation using `--radix-accordion-content-height`.
3. Deep-link/modal targeting via semantic heading IDs (`${sectionId}-heading`) and `data-modal-target`.
4. Support for text and HTML titles (`title` and `titleHTML`).
5. Optional title formatting for `(part N)` suffix.
6. Optional `Info` injection from `config` and suppression of duplicated child info.
7. Optional card shell behavior (`noCard` vs card-wrapped content).
8. JSON-driven recursive rendering for Group/Section trees in `App.jsx`.

## Problems and Risks

### 1) Residual wrapper split (app vs ui primitive)
- App uses a compatibility wrapper (`AccordionArticle`) with direct Radix primitives.
- Debug uses the shared shadcn-style wrapper (`src/components/ui/accordion.jsx`).
- Cost: two implementation surfaces still exist, even though behavior is now aligned.

### 2) Accessibility risk from CSS-only collapse model
- Closed panels are hidden by `max-height: 0` and `overflow: hidden` instead of primitive-managed visibility.
- Risk: hidden controls can remain in tab/focus order depending on browser and content.

### 3) Legacy pathway status (resolved)
- `window.refs`, `expandAllAccordions`, and stale `expandNow` logic were removed.
- This significantly reduced hidden coupling and dead-control paths.

### 4) Historical dual-source issue (resolved)
- Main app no longer uses legacy class-toggle accordion.
- Debug no longer uses native `details/summary`.
- Both now rely on Radix accordion behavior.

### 5) Harder long-term design-system alignment
- As shadcn/Radix evolves, this custom accordion will not inherit primitive fixes, docs patterns, or standard behavior by default.

### 6) Legacy link-class overload (now corrected)
- Historically, top navigation links and modal-content links both used `.modal-link`.
- This overloaded one class with two interaction models (scroll vs modal), increasing confusion and regression risk.
- Contract moving forward:
  - navigation links use `nav-scroll-link` and are scroll-only
  - content links use `modal-link` and are modal-only

## Why This Matters

The highest-risk refactor work is complete. Remaining work is hardening and evidence capture (manual parity matrix across multiple LOs and keyboard/screen-reader checks).

This is exactly the kind of drift that causes:
- regressions in interactive behavior
- a11y inconsistencies
- expensive UI maintenance over time

## Target End State

1. App and debug accordions both use Radix accordion primitives.
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
