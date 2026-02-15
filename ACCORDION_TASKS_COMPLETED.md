# Accordion Migration Tasks Completed

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Objective
Track completed work for migrating accordion behavior to shadcn/Radix primitives with no behavior regressions.

## Completed

- [x] Created accordion issue analysis:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_ISSUES.md`
- [x] Created detailed migration plan with baby steps, test matrix, and timeline:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_CHANGES_TODO.md`
- [x] Added accordion migration tracking file:
  - `/Users/ped/Sites/french/french-lo-1-test/ACCORDION_TASKS_COMPLETED.md`
- [x] Wired accordion plan visibility into core docs:
  - `/Users/ped/Sites/french/french-lo-1-test/README.md`
  - `/Users/ped/Sites/french/french-lo-1-test/CHANGES.md`
  - `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`
- [x] Clarified link interaction contract to remove legacy overload:
  - top navigation now uses `nav-scroll-link` (scroll-only)
  - content explanation links keep `modal-link` (modal-only)

## In Progress

- [ ] Phase 0 baseline capture for accordion parity (screenshots/video + manual checklist artifacts).

## Pending

- [ ] Add shadcn accordion primitive at `src/components/ui/accordion.jsx`.
- [ ] Migrate debug accordion (`LearningObjectStructureSummary.jsx`) from `details/summary` to shadcn accordion.
- [ ] Build compatibility wrapper for main app accordion semantics.
- [ ] Migrate `App.jsx` accordion usage incrementally to wrapper.
- [ ] Remove legacy/dead accordion pathways.
- [ ] Final regression pass and docs closeout.

## Notes

- Debug-first migration is the approved first implementation step.
- Debug-first is necessary but not sufficient; production parity validation remains required because main app accordion behavior is config-driven and more complex.
