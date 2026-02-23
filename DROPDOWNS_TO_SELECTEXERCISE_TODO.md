# DropDowns to SelectExercise TODO

## Goal
- Introduce a new exercise component named `SelectExercise`.
- Migrate targeted activities away from legacy `DropDowns` (table-based layout) without breaking existing LOs.

## Why This Refactor
- Current `DropDowns` uses table layout for interactive form behavior, which is not ideal semantically or responsively.
- `DropDowns` is heavily reused across many LOs, so direct replacement is high-risk.
- A new component allows incremental migration per-LO/per-activity with low regression risk.

## Current Architecture
- Existing shared component: `src/components/DropDowns/DropDowns.jsx`
- Current primitive in use: shadcn `Select` (`src/components/ui/select.jsx`)
- Existing action controls to preserve:
  - Check answers
  - Show answers
  - Reset
  - Info alert block
  - Right/wrong indicators

## Target Architecture
- New component: `SelectExercise`
- Semantic layout:
  - list/card rows (not table)
  - audio icon on left + prompt text
  - full-width select control below
  - correctness icon after checking
- Keep existing parser logic for bracketed options (`[opt|*winner|opt]`) and scoring behavior.

## Migration Strategy
1. Build `SelectExercise` as a separate component (no `DropDowns` changes initially).
2. Reuse logic from `DropDowns`:
- parse options
- state (`values`, `solved`, `nCorrect`, `failCount`)
- auto-solve/reset/check behavior
3. Implement new stacked responsive renderer using shadcn `Select`.
4. Wire one pilot activity first (LO2 `dropdowns4`) by changing only config `component`.
5. Validate behavior + accessibility + responsive UI.
6. Migrate additional LO activities gradually based on QA priority.

## Non-goals (initial pass)
- Bulk replacement of all `DropDowns` usages in one commit.
- Removing `DropDowns` before all migrations are complete.

## Risks
- Parsing/scoring regressions if logic is partially duplicated.
- Visual drift if action buttons and info blocks are re-implemented inconsistently.
- Inconsistent keyboard behavior if select states diverge from current implementation.

## Recommended Safeguards
- Keep `DropDowns` intact until full migration is completed and signed off.
- Use config-only switch (`component: "SelectExercise"`) per activity.
- Add side-by-side test checklist for old/new behavior parity.
