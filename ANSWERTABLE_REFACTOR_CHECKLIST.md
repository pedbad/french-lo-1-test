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
- [ ] Keep `AnswerTable` as compatibility alias during transition.
- [ ] Define style variants (`compact` / `standard` / `guided`) without behavior drift.

## Implementation
- [ ] Create `DictationExercise` component wrapper.
- [ ] Create `TypedTransformExercise` component wrapper.
- [ ] Create `ClozeTypingExercise` component wrapper.
- [ ] Keep shared parsing/validation/audio logic in one internal module for DRY behavior.
- [ ] Wire new components in:
  - [ ] `src/components/index.js`
  - [ ] `src/App.jsx` render switch paths

## Incremental Migration
- [ ] Migrate LO3 exercise 3 to semantic component name.
- [ ] Migrate LO3 exercise 4 to semantic component name.
- [ ] Migrate remaining LOs one activity at a time (no bulk rename).

## QA for each migrated activity
- [ ] Desktop layout parity.
- [ ] Mobile layout parity.
- [ ] Input behavior and check flow.
- [ ] Reset/show-answer behavior parity.
- [ ] Audio playback behavior parity (single-active audio).
- [ ] Accessibility smoke check (labels/focus/keyboard order).

## Documentation and Guardrails
- [ ] Update `README.md` with new semantic component names and mapping.
- [ ] Update `CHANGES.md` per migration batch.
- [ ] Add final mapping table (`legacy -> semantic`) after all migrations complete.
- [ ] Remove/deprecate `AnswerTable` only when zero config usages remain.
