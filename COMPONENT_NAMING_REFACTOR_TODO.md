# Component Naming Refactor TODO (Behavior-First Semantics)

## Goal
- Move exercise component naming to behavior-first semantics so config entries are self-descriptive and consistent across LOs.

## Problem
- Legacy names (for example `Blanks`) are too generic and do not clearly communicate interaction type.
- Similar interaction patterns are implemented under different historical names, increasing drift risk.

## Naming Contract
- Component names should describe learner interaction:
  - `InlineChoiceGroup` (inline single-choice per blank)
  - `SelectExercise` (select/dropdown choice per row)
  - `Sortable` / `ListeningOrder` (reorder-based tasks)
  - `Draggable*` / `Droppable*` for drag-target activities
- Avoid ambiguous names that hide UX behavior.

## Proposed Legacy-to-Semantic Mapping (draft)
- `Blanks` -> `DraggableFillGaps` (or split into explicit variants if behavior differs by mode)
- `DropDowns` -> keep as legacy alias; target replacements:
  - `InlineChoiceGroup` where choices should be always visible
  - `SelectExercise` where select UI is intended

## Rollout Strategy
1. Inventory all LO activity component usages.
2. Define final mapping names with examples for each interaction type.
3. Migrate one LO activity at a time (no bulk replacement).
4. Validate each migration:
- desktop/mobile layout parity
- keyboard + screen-reader behavior
- audio playback integration
- check/reset/show-answer flow
5. Keep legacy aliases temporarily to avoid breakage.
6. Remove deprecated names only after full LO coverage + QA sign-off.

## Current Status
- LO2:
  - `inlineChoiceGroup1` uses `InlineChoiceGroup` (practise verb forms).
  - `selectExercise2` uses `SelectExercise`.
- LO3:
  - `dropdowns2` migrated to `InlineChoiceGroup` to match LO2 verb-practice pattern.
- `InlineChoiceGroup` row audio icons are now left-first for exercise consistency.
- `Blanks` semantic migration completed across FR configs:
  - all `component: "Blanks"` entries migrated to `component: "DraggableFillGaps"` in `src/learningObjectConfigurations/fr/*.json` (including `demo.json`).
  - runtime fallback alias retained so legacy `Blanks` configs still render safely.

## Next Suggested Steps
1. Evaluate LO3 `dropdowns1` for `InlineChoiceGroup` vs `SelectExercise`.
2. Build full LO3+ inventory table (`LO`, `section`, `activity`, `current component`, `target component`).
3. Plan eventual alias removal (`Blanks` switch-case support) once no external legacy configs depend on it.
