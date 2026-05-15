# AnswerTable Refactor Checklist

## Discovery and Classification
- [x] Find every `component: "AnswerTable"` usage in `src/lo-config/*.json`.
- [x] Classify each usage as one of:
  - [x] `DictationExercise`
  - [x] `TypedTransformExercise`
  - [x] `ClozeTypingExercise`
- [x] Record per-activity notes:
  - [x] has row audio
  - [x] has header row
  - [x] uses compact input behavior
- Note: zero `AnswerTable` usages remain across all LO JSON configs. All have been migrated.

## Semantic API Definition
- [x] Define public component names and props contract (documented in README three-layer section).
- [x] Keep `AnswerTable` as compatibility alias during transition (now fully removed — no longer needed).
- [x] Define style variants (`compact` / `standard` / `guided`) without behavior drift.

## Implementation
- [x] Create `DictationExercise` component wrapper.
- [x] Create `TypedTransformExercise` component wrapper.
- [x] Create `ClozeTypingExercise` component wrapper.
- [x] Keep shared parsing/validation/audio logic in one internal module for DRY behavior.
- [x] Wire new components in:
  - [x] `src/components/exercises/index.js`
  - [x] `src/App.jsx` render switch paths (both inline and accordion-wrapped)

## Incremental Migration
- [x] Migrate LO3 exercise 3 to semantic component name.
- [x] Migrate LO3 exercise 4 to semantic component name.
- [x] Migrate LO3 exercise 5 listening task to semantic component name (`DictationExercise`).
- [x] Migrate remaining LOs one activity at a time — complete. Zero `AnswerTable` configs remain.

## QA for each migrated activity
- [x] Desktop layout parity.
- [ ] Mobile layout parity.
- [x] Input behavior and check flow.
- [x] Reset/show-answer behavior parity.
- [x] Audio playback behavior parity (single-active audio).
- [ ] Accessibility smoke check (labels/focus/keyboard order).

## Documentation and Guardrails
- [x] Update `README.md` with new semantic component names, mapping, and three-layer architecture diagram.
- [x] Update `CHANGES.md` per migration batch.
- [x] Add final mapping table (`legacy -> semantic`) — see README "Typed-response exercise architecture" section.
- [x] Remove/deprecate `AnswerTable` — alias fully removed from `App.jsx`; zero config usages remain.
