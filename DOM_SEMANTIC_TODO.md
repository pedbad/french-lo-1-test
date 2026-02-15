# DOM Semantic Refactor TODO

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Objective
Implement semantic structure:
1. `<main>`
2. top-level thematic `<section id="dialogues|vocabulary|grammar|pronunciation|exercises">`
3. accordion leaf items rendered as `<article>`

without breaking existing styles, nav scroll behavior, modal-link behavior, or accessibility.

## Current Bad Structure (Reference)
Current rendered top-level wrapper is:

```html
<div class="accordion" id="accordion1">...</div>
```

Why this must change:
1. Name implies a single accordion widget.
2. It actually wraps all major thematic regions.
3. It prevents clean semantic landmarks under `<main>`.

Current page-top semantic risks:
1. Hero content currently sits outside `main`.

## Phase 0: Contracts Lock
- [ ] Confirm final top-level section IDs:
  - `dialogues`
  - `vocabulary`
  - `grammar`
  - `pronunciation`
  - `exercises`
- [ ] Confirm nav contract during migration:
  - keep `#modal-link-*` compatibility while introducing section IDs.
- [ ] Confirm accordion semantics rule:
  - leaf item = `article`
  - grouping wrapper = `section`

## Phase 1: Top-Level Section Semantics
- [ ] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/Section.jsx` root from `div.section` to `section.section`.
- [ ] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/HeroSection/HeroSection.jsx` root from `div.section` to `section.section`.
- [ ] Replace legacy `<div class="accordion" id="accordion1">` thematic wrapper in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` with a semantic section container:
  - either direct section siblings under `main`
  - or neutral wrapper naming (not `accordion1`)
- [ ] Ensure LO top-level blocks use stable IDs matching nav targets.
- [ ] Keep page title markup unchanged:
  - `<h1><span class="title-main">First Contact —</span><span class="title-sub">greetings, farewells and social niceties</span></h1>`
- [ ] Ensure each top-level section uses semantic header content:
  - title `h2` and section instructions inside `<section><header>...</header></section>`.
- [ ] Keep all existing classes (`section`, etc.) to avoid style regressions.

## Phase 1.5: Header/Nav/Hero Semantics (Responsive-safe)
- [x] Keep one primary nav landmark for the main menu:
  - retain Radix/shadcn nav as the semantic `<nav>`.
  - change mobile dropdown wrapper from `<nav>` to non-nav container (`div` or `div[role="region"]`) while keeping the same responsive UX.
- [x] Preserve responsive behavior exactly:
  - desktop inline menu at large breakpoints.
  - hamburger + mobile panel at small breakpoints.
- [x] Add keyboard skip navigation:
  - add a `Skip to main content` link targeting `#content`.
  - style it to appear on keyboard focus only.
- [x] Improve mobile-menu accessibility wiring:
  - add `aria-controls` on the mobile menu toggle.
  - support `Escape` key to close the mobile menu panel.
- [ ] Move hero into semantic page-content flow under `main` (intro section), or make hero decorative if kept outside content.
- [x] Enforce heading order:
  - replaced hero `<h2>` with non-heading text in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` so no heading appears before page `<h1>`.
- [ ] Keep nav/scroll behavior unchanged for users while semantics improve.

## Phase 2: Nav + Scroll Compatibility
- [ ] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx` to support section-ID targeting.
- [ ] Keep backward compatibility for old `#modal-link-*` anchors during transition.
- [ ] Verify highlight logic still marks active section correctly on scroll.

## Phase 3: Accordion Panel Semantics
- [x] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`:
  - render leaf items as `article`.
  - keep `.accordion-article` class stable.
- [ ] Add a wrapper/group override so structural containers remain `section` where needed.
- [ ] Keep existing heading/link IDs (`modal-link-*`) unless explicitly migrated together with nav.

## Phase 4: JS Selector Hardening
- [ ] Update container lookup in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - include `article` in `closest(...)` fallback used for modal content extraction.
- [ ] Search and update other selectors that assume `div`/`section` only.

## Phase 5: Heading Hierarchy Cleanup
- [ ] Verify heading levels:
  - top page title: `h1`
  - top-level sections: `h2`
  - accordion item titles: `h3`
- [ ] Remove heading-level jumps introduced by wrappers.

## Phase 6: Validation and Regression Pass
- [ ] Run `yarn build`.
- [ ] Run local guard scripts (`yarn prepush:local`).
- [ ] Run semantic/accessibility checklist in `DOM_SEMANTIC_CHECKLIST.md`.
- [ ] Validate W3C DOM excerpt for landmark/section structure.

## Done Criteria
- [ ] `main > section` structure is present for top-level nav areas.
- [ ] Accordion leaf panels are semantic `article`.
- [ ] No nav scroll/highlight regressions.
- [ ] No modal-link regressions.
- [ ] No style drift between debug/app accordions.
