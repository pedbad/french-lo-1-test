# DropDowns to SelectExercise Checklist

## Discovery
- [x] Confirm current component in use is `DropDowns`.
- [x] Confirm current UI primitive is shadcn `Select`.
- [x] Inventory all LO usages of `DropDowns` (documented in `README.md`).

## New Component Scaffold
- [ ] Create `SelectExercise` component file under `src/components/SelectExercise/`.
- [ ] Export from:
  - [ ] `src/components/SelectExercise/index.js`
  - [ ] `src/components/index.js`
- [ ] Keep legacy `DropDowns` unchanged.

## Behavior Parity
- [ ] Port option parsing (`[...|*...]`) from `DropDowns`.
- [ ] Port scoring state:
  - [ ] `values`
  - [ ] `solved`
  - [ ] `nCorrect`
  - [ ] `failCount`
- [ ] Port actions:
  - [ ] Check answers
  - [ ] Show answers
  - [ ] Reset
- [ ] Preserve congratulations behavior and completion logic.

## Layout / UX
- [ ] Replace table structure with stacked list/card rows.
- [ ] Row pattern:
  - [ ] audio icon left + prompt text
  - [ ] full-width select beneath
  - [ ] right/wrong icon shown at appropriate state
- [ ] Keep blue info alert and existing action buttons.
- [ ] Ensure select controls span full width.

## Pilot Migration
- [ ] Switch LO2 `dropdowns4` in `src/learningObjectConfigurations/fr/2.json` to `component: "SelectExercise"`.
- [ ] Verify LO2 behavior and styling on desktop + mobile.

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
- [ ] Update `CHANGES.md` once pilot migration is implemented.
