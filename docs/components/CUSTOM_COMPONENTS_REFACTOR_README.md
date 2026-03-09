# Custom Components Refactor README

## Scope
This document defines a safe, staged refactor plan for custom French learning-object components, with current focus on:

- `/Users/ped/Sites/french/french-lo-1/src/components/custom/registry.js`

Goal: reduce monolithic structure, improve maintainability, and enforce DRY reuse without breaking existing LO behavior.

## Current Status (2026-03-05)

- Phase 1 extraction is complete for active LO config-mapped components (LO1-LO15 in current index/config usage).
- Runtime source of truth is now `src/components/custom/registry.js`.
- Active custom components now live in:
  - `src/components/custom/grammar/*.jsx`
  - `src/components/custom/pronunciation/*.jsx`
  - `src/components/custom/misc/*.jsx`
- LO-specific exercise components are now grouped under:
  - `src/components/exercises/current-location/*.jsx`
- Legacy monolith has been retired; custom runtime keys are owned by `src/components/custom/*`.

## Current Issues

1. Monolithic file growth
- `CustomComponents_FR.jsx` mixes many learning objects (LO1, LO2, LO3, LO4, etc.) in one file.
- This increases merge conflicts, review complexity, and regression risk.

2. Repeated UI/content patterns
- Similar structures are re-implemented repeatedly:
  - Info/instruction callouts
  - Grammar/pronunciation section layouts
  - Table/list patterns
  - Exercise control patterns (check/reset/show answer)

3. Content and layout tightly coupled
- Long inline JSX mixes static content/data and layout logic.
- Harder to test, harder to update text safely, and harder to trace differences between LOs.

4. Naming/style drift risk
- Button labels and minor UI conventions can drift (`Show answer` vs custom variants).
- Similar sections sometimes diverge in spacing/structure if built ad hoc.

5. Harder onboarding and debugging
- New contributors must scan a very large file to find one specific LO block.
- Small fixes require navigating unrelated components.

## Refactor Goals

1. Modular architecture by LO and section.
2. Shared reusable building blocks for repeated patterns.
3. Strong consistency for exercise controls and instructional cues.
4. Minimal regression risk using staged, backwards-compatible rollout.
5. Better testability and traceability.

## Proposed Target Structure

```text
src/components/custom/
  index.js                      # barrel exports used by app/config resolver
  registry.js                   # runtime map for custom component keys
  grammar/
  pronunciation/
  misc/
  shared/                       # optional next-phase reusable blocks
  data/                         # optional next-phase extracted static datasets
```

## Migration Plan (Staged)

### Phase 1: File split only (no behavior changes)
- Status: completed for active LO1-LO15 custom mappings.

### Phase 2: Shared block extraction
- Status: pending
- Extract duplicated patterns into `shared/` components:
  - instruction/info blocks
  - table wrappers
  - common audio-linked list rendering
  - reusable exercise action row
- Use existing design tokens and utility classes (no SCSS reintroduction).

### Phase 3: Data/content separation
- Status: pending
- Move static row/list data to `data/` files.
- Keep render components focused on layout and interaction logic.

### Phase 4: Contract hardening
- Status: in progress (naming and registry hardening underway)
- Normalize conventions:
  - action labels: `Check answers`, `Show answer`, `Reset`
  - icon cue syntax in instruction text
  - spacing/layout conventions per section type
- Add lint/test checks where practical.

## Safety Constraints

1. Do not break existing config-to-component mapping.
2. Preserve audio path behavior and playback logic.
3. Keep LO outputs visually equivalent during Phase 1.
4. Use small commits per phase and verify each LO incrementally.

## Verification Checklist

- [x] `yarn build` passes.
- [x] Critical LO pages render without runtime errors.
- [x] Config keys still resolve to correct components.
- [x] Instruction callouts/icons still render correctly.
- [x] Exercise buttons and labels remain consistent.
- [x] Audio playback works as before.
- [x] Remove remaining legacy exports from `CustomComponents_FR.jsx` after dead-key audit.

## Risks and Mitigations

1. Export/name mismatch
- Mitigation: keep legacy names in barrel exports until full migration is complete.

2. Visual drift during shared extraction
- Mitigation: only extract after Phase 1, and compare LO screenshots/flows.

3. Hidden coupling in inline content
- Mitigation: move content gradually, section-by-section, with focused QA.

## Suggested First Execution Step

Start with Phase 1 only:
- split by LO file,
- keep current behavior untouched,
- commit small and verify with `yarn build`.

This gives immediate maintainability improvements with minimal risk.
