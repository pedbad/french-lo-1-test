# AnswerTable Refactor TODO (Semantic Naming + Variant Split)

## Why this refactor
- `AnswerTable` is too generic and hides multiple pedagogical activity types.
- In practice, this component is used for different learner interactions:
  - listen + type what you hear (dictation)
  - prompt + type transformed answer
  - sentence with embedded typed gaps (cloze typing)
- We need behavior-first names in config so LO authors can tell activity intent immediately.

## What "cloze" means here
- A cloze activity is a sentence-completion task where one or more missing words are typed by the learner.
- In current config shape, this usually appears as bracketed answer slots in text (for example `[answer]`) rendered as input checks.
- This is different from full dictation: cloze gives sentence context + specific gap targets.

## Proposed semantic naming model

Primary names:
- `DictationExercise`
  - learner listens and types the full phrase/sentence.
- `TypedTransformExercise`
  - learner converts a shown prompt to the target form (for example masculine -> feminine).
- `ClozeTypingExercise`
  - learner fills one or more typed gaps inside sentence context.

Legacy compatibility:
- Keep `AnswerTable` as a temporary compatibility alias during migration.
- Under the hood, shared logic can remain DRY in a common internal base module.

## Suggested treatment for lighter variants
- Do not create one component per LO.
- Use a shared semantic component with light config variants instead:
  - `variant: "compact"` (short rows, fewer controls, minimal chrome)
  - `variant: "standard"` (default full row layout)
  - `variant: "guided"` (extra helper copy and stronger feedback)
- Keep behavior semantic first, visual style as a variant option.

## Proposed migration phases
1. Inventory + classify all current `AnswerTable` usages by behavior mode.
2. Introduce new semantic wrappers/components without removing `AnswerTable`.
3. Migrate LO activities one-by-one in config:
- `component: "AnswerTable"` -> semantic component name
- preserve content/audio first; no pedagogical rewrite in same step
4. QA each migrated activity (desktop/mobile/a11y/audio/check/reset behavior).
5. Deprecate/remove generic `AnswerTable` usage only after full rollout.

## Initial classification target (high-level)
- LO3 exercise 3 -> `TypedTransformExercise` (implemented).
- LO3 exercise 4 -> `TypedTransformExercise` (implemented).
- LO3 exercise 5 -> `DictationExercise` (implemented).
- Other LOs to classify explicitly before renaming.

## Naming recommendation for your current concern
- For the listening-typing pattern you described:
  - use `DictationExercise` (best semantic fit).

## Current status update
- All three semantic wrappers are now in code and wired:
  - `TypedTransformExercise`
  - `DictationExercise`
  - `ClozeTypingExercise`
- All wrappers delegate to shared `TextEntryExerciseRuntime` (formerly called `AnswerTableRuntime` in early planning).
- Behavior split in runtime:
  - `TypedTransformExercise`: strict compare + global controls + inline prompt audio option.
  - `DictationExercise`: dictation compare normalization + global controls + left audio icon.
  - `ClozeTypingExercise`: strict compare + per-row inline gap rendering (no global controls bar).
- Migration is complete: zero `AnswerTable` usages remain in any LO JSON config.
- `AnswerTable` alias has been fully removed from `App.jsx`.
- Three-layer DRY architecture is documented with ASCII diagram in README.
- Remaining open items (see checklist):
  - mobile layout parity QA for migrated activities.
  - accessibility smoke check (labels / focus / keyboard order).
