# Accordion Migration Tasks Completed

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1`

## Objective
Track completed work for migrating accordion behavior to shadcn/Radix primitives with no behavior regressions.

## Completed

- [x] Created accordion issue analysis:
  - `/Users/ped/Sites/french/french-lo-1/ACCORDION_ISSUES.md`
- [x] Created detailed migration plan with baby steps, test matrix, and timeline:
  - `/Users/ped/Sites/french/french-lo-1/ACCORDION_CHANGES_TODO.md`
- [x] Added accordion migration tracking file:
  - `/Users/ped/Sites/french/french-lo-1/ACCORDION_TASKS_COMPLETED.md`
- [x] Wired accordion plan visibility into core docs:
  - `/Users/ped/Sites/french/french-lo-1/README.md`
  - `/Users/ped/Sites/french/french-lo-1/CHANGES.md`
  - `/Users/ped/Sites/french/french-lo-1/TASKS_COMPLETED.md`
- [x] Clarified link interaction contract to remove legacy overload:
  - top navigation now uses `nav-scroll-link` (scroll-only)
  - content explanation links keep `modal-link` (modal-only)
- [x] Added Radix accordion dependency and shadcn accordion primitive:
  - dependency: `@radix-ui/react-accordion`
  - component: `/Users/ped/Sites/french/french-lo-1/src/components/ui/accordion.jsx`
- [x] Migrated debug structure view to shadcn accordion:
  - `/Users/ped/Sites/french/french-lo-1/src/debug/components/LearningObjectStructureSummary.jsx`
  - replaced native `details/summary` usage while keeping row layout (LO link left, structure accordion right)
- [x] Added main-app compatibility wrapper scaffold:
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`
  - preserves core contracts (`id`, `target`, `title/titleHTML`, `config`, `noCard`, session persistence)
- [x] Started incremental main-app wiring using the compatibility wrapper:
  - `/Users/ped/Sites/french/french-lo-1/src/App.jsx` now uses `AccordionArticle` for the `AnswerTable` branch as a low-risk pilot.
- [x] Expanded pilot wiring to the `PhraseTable` expandable branch:
  - `/Users/ped/Sites/french/french-lo-1/src/App.jsx` now uses `AccordionArticle` for expandable `PhraseTable` rendering.
- [x] Expanded pilot wiring to exercise-heavy branches:
  - `/Users/ped/Sites/french/french-lo-1/src/App.jsx` now uses `AccordionArticle` for `Blanks` and `WordParts`.
- [x] Expanded pilot wiring to additional interactive branches:
  - `/Users/ped/Sites/french/french-lo-1/src/App.jsx` now uses `AccordionArticle` for `DropDowns`, `Monologue`, and `RadioQuiz`.
- [x] Completed main-app accordion cutover to wrapper:
  - all expandable branches in `/Users/ped/Sites/french/french-lo-1/src/App.jsx` now use `AccordionArticle`.
- [x] Removed legacy accordion/dead pathways:
  - deleted `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/Accordion.jsx`
  - removed legacy class-toggle `AccordionArticle` implementation (replaced by current Radix wrapper at the same canonical path)
  - removed `window.refs` write pattern and `expandAllAccordions` from `/Users/ped/Sites/french/french-lo-1/src/App.jsx`
  - removed stale `expandNow` path from `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`
- [x] Completed naming + semantic cleanup:
  - renamed wrapper component from `AppAccordionArticle` to `AccordionArticle`
  - updated wrapper root element from `<section>` to `<article>`
- [x] Completed heading and wrapper semantic hardening:
  - added `semanticAs` override in `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx` so structural group wrappers can render as `<section>` while leaf accordion items remain `<article>`
  - updated group accordion call sites in `/Users/ped/Sites/french/french-lo-1/src/App.jsx` to pass `semanticAs="section"`
  - changed accordion trigger heading from `<h2>` to `<h3>` in `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx` and updated matching selectors in `/Users/ped/Sites/french/french-lo-1/src/index.css`
- [x] Unified chevron visual contract across app/debug:
  - shared `.accordion-chevron` class in `/Users/ped/Sites/french/french-lo-1/src/index.css`
  - applied in `/Users/ped/Sites/french/french-lo-1/src/components/ui/accordion.jsx`
  - applied in `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`
- [x] Added single-accordion default-open behavior in app render path:
  - top-level sections now count accordion items recursively.
  - sections with exactly one accordion open by default.
  - persisted session state still overrides default behavior, so user choice is preserved.

## In Progress

- [ ] Phase 0 baseline capture for accordion parity (screenshots/video + manual checklist artifacts).
- [ ] Final cross-LO regression pass (LO1 + additional LOs).

## Pending

- [ ] Complete manual parity checklist evidence capture and archive.

## Notes

- Debug-first migration is the approved first implementation step.
- Debug-first is complete; production cutover is complete; final manual parity evidence capture remains recommended because main app accordion behavior is config-driven and complex.
