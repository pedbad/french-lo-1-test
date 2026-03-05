# AnswerTable Refactor Checklist

## Discovery and Classification
- [ ] Find every `component: "AnswerTable"` usage in `src/learningObjectConfigurations/fr/*.json`.
- [ ] Classify each usage as one of:
  - [ ] `DictationExercise`
  - [ ] `TypedTransformExercise`
  - [ ] `ClozeTypingExercise`
- [ ] Record per-activity notes:
  - [ ] has row audio
  - [ ] has header row
  - [ ] uses compact input behavior

## Semantic API Definition
- [ ] Define public component names and props contract.
- [x] Keep `AnswerTable` as compatibility alias during transition.
- [x] Define style variants (`compact` / `standard` / `guided`) without behavior drift.

## Implementation
- [x] Create `DictationExercise` component wrapper.
- [x] Create `TypedTransformExercise` component wrapper.
- [ ] Create `ClozeTypingExercise` component wrapper.
- [x] Keep shared parsing/validation/audio logic in one internal module for DRY behavior.
- [ ] Wire new components in:
  - [x] `src/components/index.js`
  - [x] `src/App.jsx` render switch paths

## Incremental Migration
- [x] Migrate LO3 exercise 3 to semantic component name.
- [x] Migrate LO3 exercise 4 to semantic component name.
- [x] Migrate LO3 exercise 5 listening task to semantic component name (`DictationExercise`).
- [ ] Migrate remaining LOs one activity at a time (no bulk rename).

## QA for each migrated activity
- [x] Desktop layout parity.
- [ ] Mobile layout parity.
- [x] Input behavior and check flow.
- [x] Reset/show-answer behavior parity.
- [x] Audio playback behavior parity (single-active audio).
- [ ] Accessibility smoke check (labels/focus/keyboard order).

## Documentation and Guardrails
- [x] Update `README.md` with new semantic component names and mapping.
- [x] Update `CHANGES.md` per migration batch.
- [ ] Add final mapping table (`legacy -> semantic`) after all migrations complete.
- [ ] Remove/deprecate `AnswerTable` only when zero config usages remain.
