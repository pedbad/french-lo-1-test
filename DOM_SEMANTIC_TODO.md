# DOM Semantic Refactor TODO

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Objective
Implement semantic structure:
1. `<main>`
2. top-level thematic `<section id="dialogues|vocabulary|grammar|pronunciation|exercises">`
3. accordion leaf items rendered as `<article>`

without breaking existing styles, nav scroll behavior, modal-link behavior, or accessibility.

## Historical Bad Structure (Now Removed)
Previous rendered top-level wrapper was:

```html
<div class="accordion" id="accordion1">...</div>
```

Why this had to change:
1. Name implies a single accordion widget.
2. It actually wraps all major thematic regions.
3. It prevents clean semantic landmarks under `<main>`.

Current page-top semantic risks:
1. No unresolved hero-heading or nav-landmark issues in phase 1.5.
2. Hero remains outside `main` by design because it is decorative page chrome (not core instructional content).

## Phase 0: Contracts Lock
- [x] Confirm final top-level section IDs:
  - `dialogues`
  - `vocabulary`
  - `grammar`
  - `pronunciation`
  - `exercises`
- [x] Confirm nav contract during migration:
  - top nav uses semantic section hashes only.
  - no backward-compatibility shim for legacy `#modal-link-*` nav hashes (explicit project decision).
- [x] Confirm accordion semantics rule:
  - leaf item = `article`
  - grouping wrapper = `section`

## Phase 1: Top-Level Section Semantics
- [x] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/Section.jsx` root from `div.section` to `section.section`.
- [x] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/HeroSection/HeroSection.jsx` root from `div.section` to `section.section`.
- [x] Replace legacy `<div class="accordion" id="accordion1">` thematic wrapper in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` with direct top-level section siblings under `main`.
- [x] Ensure LO top-level blocks use stable IDs matching nav targets.
- [x] Keep page title markup unchanged:
  - `<h1><span class="title-main">First Contact —</span><span class="title-sub">greetings, farewells and social niceties</span></h1>`
- [x] Ensure each top-level section uses semantic header content:
  - title `h2` and section instructions inside `<section><header>...</header></section>`.
- [x] Keep all existing classes (`section`, etc.) to avoid style regressions.

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
- [x] Classify hero semantics explicitly:
  - keep hero outside `main` as decorative page chrome for this app.
  - keep hero non-heading text + decorative image semantics (`p.hero-title`, `alt=""`, `aria-hidden="true"`).
- [x] Enforce heading order:
  - replaced hero `<h2>` with non-heading text in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` so no heading appears before page `<h1>`.
- [x] Keep nav/scroll behavior unchanged for users while semantics improve.

## Phase 2: Nav + Scroll Compatibility
- [x] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx` to support section-ID targeting.
- [x] Remove old `#modal-link-*` nav-hash compatibility (explicitly not required for this project).
- [ ] Verify highlight logic still marks active section correctly on scroll.

## Phase 3: Accordion Panel Semantics
- [x] Update `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`:
  - render leaf items as `article`.
  - keep `.accordion-article` class stable.
- [x] Add a wrapper/group override so structural containers remain `section` where needed.
- [x] Migrate section heading IDs away from legacy `modal-link-*` naming to semantic `${sectionId}-heading`.

## Phase 4: JS Selector Hardening
- [x] Update container lookup in `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx`:
  - include `article` in `closest(...)` fallback used for modal content extraction.
- [ ] Search and update other selectors that assume `div`/`section` only.

## Phase 5: Heading Hierarchy Cleanup
- [x] Verify heading levels:
  - top page title: `h1`
  - top-level sections: `h2`
  - accordion item titles: `h3`
- [ ] Remove heading-level jumps introduced by wrappers.

## Phase 6: Validation and Regression Pass
- [x] Run `yarn build`.
- [x] Run branch guard scripts (`yarn check:typography:branch`, `yarn check:color:branch`, `yarn check:a11y:branch`, `yarn check:scss:branch`, `yarn check:audio-unicode`).
- [ ] Run local guard scripts (`yarn prepush:local`).
- [ ] Run semantic/accessibility checklist in `DOM_SEMANTIC_CHECKLIST.md`.
- [ ] Validate W3C DOM excerpt for landmark/section structure.

## Done Criteria
- [x] `main > section` structure is present for top-level nav areas.
- [x] Accordion leaf panels are semantic `article`.
- [ ] No nav scroll/highlight regressions.
- [ ] No modal-link regressions.
- [ ] No style drift between debug/app accordions.
