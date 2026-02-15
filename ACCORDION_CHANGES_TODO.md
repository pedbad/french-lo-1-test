# Accordion Migration Plan (shadcn/Radix)

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Goal
Migrate custom accordion behavior to shadcn/Radix primitives while preserving app-specific behavior and avoiding regressions.

## Success Criteria

1. Main app and debug page both use shadcn/Radix accordion primitives.
2. Existing behaviors still work:
   - persisted expansion state
   - deep-link and modal-target IDs
   - `titleHTML` support
   - `Info` injection and child-info suppression logic
3. Legacy accordion pathways are removed (`window.refs`, stale expand helpers, class-based expansion control).
4. Accessibility and keyboard behavior are improved and explicitly tested.

## Migration Strategy

Debug-first is approved:
- Use debug page as a low-risk UI spike to tune look/feel and interaction.
- Then migrate main app via a compatibility wrapper to preserve contracts.

## Critical Decisions Before Coding

- [ ] Decide Radix mode parity up front:
  - keep multiple-open behavior (`type="multiple"`) or move to single-open (`type="single"`, `collapsible`).
- [ ] Decide collapsed-content mount policy:
  - keep content mounted (current custom behavior) or unmount hidden panel content for stricter focus isolation.
- [ ] Lock deep-link/hash behavior contract:
  - document whether opening `/...#modal-link-*` must auto-expand the target section.
- [x] Lock link-class responsibility contract:
  - navigation links use `nav-scroll-link` (scroll-only)
  - content explanation links use `modal-link` (modal-only)
- [ ] Lock QA selector/id contract:
  - keep existing stable ids/data attributes used by tests and modal-link targeting.

## Detailed Baby Steps (Testable)

## Phase 0: Baseline and Safety

- [ ] Create accordion baseline test checklist in this file (manual matrix below).
- [ ] Capture before screenshots/video for:
  - desktop open/close behavior
  - mobile behavior
  - dark mode behavior
  - deep-link to section behavior
- [ ] Confirm current modal-link target contract:
  - heading ID format `modal-link-${target}`
  - target marker `data-modal-target`
  - nav links must not use `modal-link`; they should use `nav-scroll-link`

Acceptance checks:
- [ ] Baseline artifacts are attached/linked in PR.
- [ ] Current behavior documented for parity comparison.

## Phase 1: Add shadcn Accordion Primitive

- [x] Add `/Users/ped/Sites/french/french-lo-1-test/src/components/ui/accordion.jsx` (shadcn/Radix style).
- [x] Ensure imports are from Radix primitives and consistent with existing `ui/*` patterns.
- [x] Keep style tokens consistent with current design tokens.

Acceptance checks:
- [x] `yarn build` passes.
- [x] No visual changes in production app yet.

## Phase 2: Debug-First Implementation

- [x] Replace `details/summary` in debug structure view with shadcn accordion.
  - file: `/Users/ped/Sites/french/french-lo-1-test/src/debug/components/LearningObjectStructureSummary.jsx`
- [x] Preserve current layout: LO index link left, accordion right.
- [ ] Tune spacing, typography, hover/focus states to desired UX.
- [ ] Validate keyboard navigation and screen-reader labels in debug page.

Acceptance checks:
- [ ] Debug page accordion renders and toggles correctly.
- [ ] Keyboard interaction works (`Tab`, `Enter`, `Space`).
- [ ] Focus ring visible and token-consistent.

## Phase 3: Build Main-App Compatibility Wrapper

- [x] Create `AppAccordionArticle` wrapper using shadcn accordion internals.
- [x] Map old props to new internals:
  - `id`
  - `target`
  - `title` / `titleHTML`
  - `config`
  - `className`
  - `noCard`
  - `children`
- [x] Preserve session persistence (`${id}-expanded`) with clean state sync.
- [x] Preserve heading/link target contract (`modal-link-*`, `data-modal-target`).
- [x] Preserve `(part N)` split-title formatting.
- [x] Preserve `Info` injection + child-info suppression.

Acceptance checks:
- [ ] Wrapper can render one migrated panel with parity.
- [ ] Persisted expanded state survives refresh.
- [ ] Modal-link/deep-link behavior unchanged.

## Phase 4: Incremental Main App Migration

- [ ] Replace current custom `AccordionArticle` usage in `App.jsx` with wrapper.
- [x] Start with one low-risk pilot path in `App.jsx`:
  - `AnswerTable` branch now uses `AppAccordionArticle`.
- [x] Expand pilot to high-visibility content path:
  - expandable `PhraseTable` branch now uses `AppAccordionArticle`.
- [x] Expand pilot to exercise-heavy paths:
  - `Blanks` and `WordParts` branches now use `AppAccordionArticle`.
- [x] Expand pilot to additional interactive content paths:
  - `DropDowns`, `Monologue`, and `RadioQuiz` branches now use `AppAccordionArticle`.
- [ ] Migrate by groups to reduce risk:
  - Group A: static text/content sections
  - Group B: phrase/explanation sections
  - Group C: exercise-heavy sections
- [ ] After each group migration:
  - run build
  - run guard scripts
  - run manual parity checklist

Acceptance checks:
- [ ] No regression in LO1 and at least two additional LOs.
- [ ] No duplicate IDs introduced.
- [ ] No accessibility guard regressions.

## Phase 5: Cleanup and Hardening

- [ ] Remove obsolete custom accordion files or reduce them to thin adapters:
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/Accordion.jsx`
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
- [ ] Remove dead paths:
  - `window.refs` write pattern in `App.jsx`
  - `expandAllAccordions` class toggling logic if unused
  - stale `expandNow` pathway if not needed
- [ ] Update docs:
  - README
  - CHANGES
  - TASKS_COMPLETED
  - `ACCORDION_TASKS_COMPLETED.md`

Acceptance checks:
- [ ] Codebase has one accordion model.
- [ ] Legacy dead code removed.
- [ ] Docs reflect final architecture.

## Manual Test Matrix (Per Migration Batch)

- [ ] Toggle open/close with mouse.
- [ ] Toggle open/close with keyboard (`Enter`/`Space`).
- [ ] Verify focus order does not enter hidden panel content.
- [ ] Verify `aria-expanded` updates correctly.
- [ ] Verify deep-link target opens/scrolls correctly where expected.
- [ ] Verify modal links still open modal content where expected.
- [ ] Verify session persistence behavior.
- [ ] Verify mobile and desktop layouts.
- [ ] Verify light/dark mode parity.

## Suggested Timeline (Conservative)

- Day 1: Phase 0 + Phase 1
- Day 2: Phase 2 (debug migration and tuning)
- Day 3: Phase 3 (compatibility wrapper)
- Day 4-5: Phase 4 (incremental app migration)
- Day 6: Phase 5 (cleanup, docs, final QA)

Total: ~6 working days (can compress to 3-4 days if no regressions appear).

## Risks to Watch

1. Deep-link and modal-link contract breakage (`modal-link-*` IDs).
2. Hidden-focus regressions during transition.
3. Group/Section recursive render edge cases from JSON configs.
4. Visual parity drift in dense exercise sections.
