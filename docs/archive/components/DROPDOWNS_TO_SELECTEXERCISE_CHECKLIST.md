# DropDowns to SelectExercise Checklist

> **Status: Migration complete (2026-05).** All LOs migrated. `DropDowns` component deleted. This checklist is archived — use it as a record of what was done.

## Discovery
- [x] Confirm current component in use is `DropDowns`.
- [x] Confirm current UI primitive is shadcn `Select`.
- [x] Inventory all LO usages of `DropDowns` (documented in `README.md`).

## New Component Scaffold
- [x] Create `SelectExercise` component file under `src/components/SelectExercise/`.
- [x] Export from:
  - [x] `src/components/SelectExercise/index.js`
  - [x] `src/components/index.js`
- [x] Legacy `DropDowns` component deleted after full migration.

## Behavior Parity
- [x] Port option parsing (`[...|*...]`) from `DropDowns`.
- [x] Port scoring state:
  - [x] `values`
  - [x] `solved`
  - [x] `nCorrect`
  - [x] `failCount`
- [x] Port actions:
  - [x] Check answers
  - [x] Show answers
  - [x] Reset
- [x] Preserve congratulations behavior and completion logic.

## Layout / UX
- [x] Replace table structure with stacked list/card rows.
- [x] Row pattern:
  - [x] audio icon left + prompt text
  - [x] full-width select beneath
  - [x] right/wrong icon shown at appropriate state
- [x] Keep blue info alert and existing action buttons.
- [x] Ensure select controls span full width.
- [x] Prevent select width shrinking when status icons appear after check.
- [x] Align status icon vertically with select row.
- [x] Shuffle option order on first render and on reset.

## Pilot Migration
- [x] Switch LO2 final exercise (`dropdowns4`, now `selectExercise2`) in `src/lo-config/about-me.json` to `component: "SelectExercise"`.
- [x] Verify LO2 behavior and styling on desktop + mobile.

## LO3+ Manual Rollout
- [x] Migrate LO3 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO4 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO5 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO6 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO7 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO8 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO9 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO10 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO11 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO12 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO13 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO14 dropdown exercises one-by-one and validate each before continuing.
- [x] Migrate LO15 dropdown exercises one-by-one and validate each before continuing.

## Accessibility
- [x] Ensure semantic structure is form/list oriented (not data table).
- [x] Verify keyboard navigation through all selects and action buttons.
- [x] Re-run WAVE checks on migrated exercise.

## Regression Checks
- [x] No remaining activities use `DropDowns` — component deleted.
- [x] Confirm audio playback and one-audio-at-a-time behavior remains correct.

## Documentation
- [x] Add planning doc (`DROPDOWNS_TO_SELECTEXERCISE_TODO.md`).
- [x] Add migration checklist (`DROPDOWNS_TO_SELECTEXERCISE_CHECKLIST.md`).
- [x] Update `CHANGES.md` once pilot migration is implemented.
