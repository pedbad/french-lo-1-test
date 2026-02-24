# DropDowns to SelectExercise Checklist

## Discovery
- [x] Confirm current component in use is `DropDowns`.
- [x] Confirm current UI primitive is shadcn `Select`.
- [x] Inventory all LO usages of `DropDowns` (documented in `README.md`).

## New Component Scaffold
- [x] Create `SelectExercise` component file under `src/components/SelectExercise/`.
- [ ] Export from:
  - [x] `src/components/SelectExercise/index.js`
  - [x] `src/components/index.js`
- [ ] Keep legacy `DropDowns` unchanged.

## Behavior Parity
- [x] Port option parsing (`[...|*...]`) from `DropDowns`.
- [ ] Port scoring state:
  - [x] `values`
  - [ ] `solved`
  - [ ] `nCorrect`
  - [ ] `failCount`
- [ ] Port actions:
  - [x] Check answers
  - [x] Show answers
  - [x] Reset
- [ ] Preserve congratulations behavior and completion logic.

## Layout / UX
- [x] Replace table structure with stacked list/card rows.
- [ ] Row pattern:
  - [x] audio icon left + prompt text
  - [x] full-width select beneath
  - [x] right/wrong icon shown at appropriate state
- [ ] Keep blue info alert and existing action buttons.
- [x] Ensure select controls span full width.
- [x] Prevent select width shrinking when status icons appear after check.
- [x] Align status icon vertically with select row.
- [x] Shuffle option order on first render and on reset.

## Pilot Migration
- [x] Switch LO2 `dropdowns4` in `src/learningObjectConfigurations/fr/2.json` to `component: "SelectExercise"`.
- [ ] Verify LO2 behavior and styling on desktop + mobile.

## LO3+ Manual Rollout
- [ ] Migrate LO3 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO4 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO5 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO6 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO7 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO8 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO9 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO10 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO11 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO12 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO13 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO14 dropdown exercises one-by-one and validate each before continuing.
- [ ] Migrate LO15 dropdown exercises one-by-one and validate each before continuing.

## Accessibility
- [ ] Ensure semantic structure is form/list oriented (not data table).
- [ ] Verify keyboard navigation through all selects and action buttons.
- [ ] Re-run WAVE checks on migrated exercise.

## Regression Checks
- [ ] Confirm non-migrated activities using `DropDowns` are unchanged.
- [ ] Confirm audio playback and one-audio-at-a-time behavior remains correct.

## Documentation
- [x] Add planning doc (`DROPDOWNS_TO_SELECTEXERCISE_TODO.md`).
- [x] Add migration checklist (`DROPDOWNS_TO_SELECTEXERCISE_CHECKLIST.md`).
- [x] Update `CHANGES.md` once pilot migration is implemented.
