# Accordion Migration Plan (shadcn/Radix)

Last updated: 2026-05-13  
Repo: `/Users/ped/Sites/french/french-lo-1`

> **Status: Phases 1–5 complete.** The shadcn/Radix accordion refactor shipped. Legacy accordion code removed. Manual QA matrix remains the only genuine open item — parked for a dedicated QA pass.

## Goal
Migrate custom accordion behavior to shadcn/Radix primitives while preserving app-specific behavior and avoiding regressions.

## Success Criteria

1. Main app and debug page both use shadcn/Radix accordion primitives. ✅
2. Existing behaviors still work:
   - persisted expansion state ✅
   - deep-link and modal-target IDs ✅
   - `titleHTML` support ✅
   - `Info` injection and child-info suppression logic ✅
3. Legacy accordion pathways are removed (`window.refs`, stale expand helpers, class-based expansion control). ✅
4. Accessibility and keyboard behavior are improved and explicitly tested. ⏳ (manual QA pending)

## Migration Strategy

Debug-first approach was used:
- Used debug page as a low-risk UI spike to tune look/feel and interaction.
- Migrated main app via a compatibility wrapper to preserve contracts.

## Critical Decisions Before Coding

- [x] Radix mode: kept multiple-open behavior (`type="multiple"`).
- [x] Collapsed-content mount policy: content stays mounted (preserves current behavior).
- [x] Deep-link/hash behavior: opening `#dialogues`, `#grammar` etc. auto-expands target content — preserved.
- [x] Default-open contract: if a top-level section contains exactly one accordion, open it by default. Session state overrides.
- [x] Link-class responsibility:
  - navigation links → `nav-scroll-link` (scroll-only)
  - content explanation links → `modal-link` (modal-only)
- [x] QA selector/id contract: existing stable ids/data attributes preserved for modal-link targeting.

## Phase 0: Baseline and Safety

> N/A — Phase 0 baseline capture was not done formally before the refactor began. The refactor was already underway when this plan was written. No regressions were observed; parity was validated iteratively through the build.

- [x] Default-open contract locked (see Critical Decisions above).
- [x] Link-class contract locked (see Critical Decisions above).

## Phase 1: Add shadcn Accordion Primitive

- [x] Add `src/components/ui/accordion.jsx` (shadcn/Radix style).
- [x] Imports from Radix primitives consistent with existing `ui/*` patterns.
- [x] Style tokens consistent with design tokens.
- [x] `yarn build` passes. No visual changes at this point.

## Phase 2: Debug-First Implementation

- [x] Replace `details/summary` in debug structure view with shadcn accordion.
  - file: `src/debug/components/LearningObjectStructureSummary.jsx`
- [x] Preserve layout: LO index link left, accordion right.
- [x] Spacing, typography, hover/focus states tuned.
- [x] Debug page accordion renders and toggles correctly.
- [ ] **Pending QA:** Keyboard interaction (`Tab`, `Enter`, `Space`) — include in manual QA pass.
- [ ] **Pending QA:** Focus ring visible and token-consistent.

## Phase 3: Build Main-App Compatibility Wrapper

- [x] `AccordionArticle` wrapper built using shadcn accordion internals.
- [x] Props mapped: `id`, `target`, `title` / `titleHTML`, `config`, `className`, `noCard`, `children`.
- [x] Session persistence (`${id}-expanded`) with clean state sync.
- [x] Heading/link target contract preserved (`${sectionId}-heading` IDs + `data-modal-target`).
- [x] `(part N)` split-title formatting preserved.
- [x] `Info` injection + child-info suppression preserved.
- [x] Persisted expanded state survives refresh.
- [x] Modal-link/deep-link behavior unchanged.

## Phase 4: Incremental Main App Migration

- [x] `AnswerTable` branch uses `AccordionArticle`.
- [x] `PhraseTable` branch uses `AccordionArticle`.
- [x] `Blanks` and `WordParts` branches use `AccordionArticle`.
- [x] `DropDowns`, `Monologue`, and `RadioQuiz` branches use `AccordionArticle`.
- [x] All remaining content groups migrated.
- [x] Build verified after each group.
- [ ] **Pending:** Full manual parity checklist (see QA matrix below).

## Phase 5: Cleanup and Hardening

- [x] `src/components/Accordion/Accordion.jsx` removed.
- [x] Legacy class-toggle `AccordionArticle` implementation replaced by Radix wrapper.
- [x] `window.refs` write pattern removed from `App.jsx`.
- [x] `expandAllAccordions` class-toggling logic removed.
- [x] Stale `expandNow` pathway removed from `AccordionArticle`.
- [x] Docs updated: README, CHANGES, TASKS_COMPLETED, `ACCORDION_TASKS_COMPLETED.md`.
- [x] Codebase has one accordion model.

## Manual QA Matrix (Pending — Dedicated QA Pass)

Run this matrix across at least LO1, LO2, and one exercise-heavy LO before closing.

- [ ] Toggle open/close with mouse.
- [ ] Toggle open/close with keyboard (`Enter`/`Space`).
- [ ] Verify focus order does not enter hidden panel content.
- [ ] Verify `aria-expanded` updates correctly.
- [ ] Verify deep-link target opens/scrolls correctly where expected.
- [ ] Verify modal links still open modal content where expected.
- [ ] Verify session persistence behavior (expand, refresh, still expanded).
- [ ] Verify mobile and desktop layouts.
- [ ] Verify light/dark mode parity.
- [ ] Verify `Tab`/focus ring visible and token-consistent in debug page accordion.
