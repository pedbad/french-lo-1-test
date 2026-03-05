# Custom Components Refactor README

## Scope
This document defines a safe, staged refactor plan for custom French learning-object components, with current focus on:

- `/Users/ped/Sites/french/french-lo-1/src/components/CustomComponents_FR/CustomComponents_FR.jsx`

Goal: reduce monolithic structure, improve maintainability, and enforce DRY reuse without breaking existing LO behavior.

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
src/components/custom/fr/
  index.js                      # barrel exports used by app/config resolver
  lo1.jsx
  lo2.jsx
  lo3.jsx
  lo4.jsx
  shared/
    InfoInstructionBlock.jsx
    PronunciationTabPanel.jsx
    LearningTableBlock.jsx
    ExerciseActionRow.jsx
    AudioLinkedList.jsx
  data/
    lo1/
      grammar.js
      pronunciation.js
    lo2/
      grammar.js
      pronunciation.js
    lo3/
      grammar.js
      pronunciation.js
    lo4/
      grammar.js
      pronunciation.js
```

## Migration Plan (Staged)

### Phase 1: File split only (no behavior changes)
- Move LO-specific components out of `CustomComponents_FR.jsx` into per-LO files.
- Keep existing component names and exports.
- Add a barrel (`index.js`) to preserve import contract.
- Expected impact: maintainability gain, near-zero UX change risk.

### Phase 2: Shared block extraction
- Extract duplicated patterns into `shared/` components:
  - instruction/info blocks
  - table wrappers
  - common audio-linked list rendering
  - reusable exercise action row
- Use existing design tokens and utility classes (no SCSS reintroduction).

### Phase 3: Data/content separation
- Move static row/list data to `data/` files.
- Keep render components focused on layout and interaction logic.

### Phase 4: Contract hardening
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

- [ ] `yarn build` passes.
- [ ] Critical LO pages render without runtime errors.
- [ ] Config keys still resolve to correct components.
- [ ] Instruction callouts/icons still render correctly.
- [ ] Exercise buttons and labels remain consistent.
- [ ] Audio playback works as before.

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
