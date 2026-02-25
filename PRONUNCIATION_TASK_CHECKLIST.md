# Pronunciation Task Checklist (LO1/LO2 First)

## Baseline Audit
- [ ] Capture before/after screenshots for LO1 and LO2 pronunciation (desktop + mobile).
- [ ] Confirm current LO2 behavior and spacing differences against LO1.
- [ ] Confirm existing audio coverage for each planned LO2 tab item.

## Section Titles
- [x] Normalize pronunciation section title to:
  - `Pronunciation Focus — Demystifying French Pronunciation`
- [x] Ensure subtitle after em dash renders in muted style (section heading subtitle treatment).
- [x] Remove legacy typo variants (for example `Pronuciation`).

## Architecture Alignment
- [ ] Refactor LO2 pronunciation config from monolithic component to `Group`.
- [ ] Enable `displayAsTabs: true` for LO2 pronunciation.
- [ ] Keep LO2 pronunciation inside the same shared Group/Tabs rendering path used by LO1.
- [ ] Ensure single-tab pronunciation sections still use tabs shell for future consistency.

## LO2 Content Split (LO1-style)
- [ ] Add LO2 pronunciation tab item 1:
  - [ ] Title: `1. Silent letters at the end of a word`
  - [ ] Content migrated from current LO2 demystify block.
- [ ] Add LO2 pronunciation tab item 2:
  - [ ] Title: `2. The French "th"`
  - [ ] Content migrated from current LO2 demystify block.

## Audio Interaction Consistency
- [ ] Replace legacy inline audio-link markup with `AudioClip` components in LO2 pronunciation.
- [ ] Verify one-audio-at-a-time behavior remains correct.
- [ ] Verify no broken audio paths after refactor.

## Accessibility / Semantics
- [ ] Confirm semantic headings are used in tab content (no pseudo-heading paragraphs).
- [ ] Verify tab labels remain readable on small screens.
- [ ] Re-run WAVE checks on LO2 pronunciation and log any remaining issues.

## QA / Regression
- [ ] Verify LO1 pronunciation behavior is unchanged.
- [ ] Verify LO2 pronunciation now matches LO1 layout and interaction rhythm.
- [ ] Run build verification: `yarn build`.

## Documentation
- [ ] Update `CHANGES.md` after LO2 pronunciation refactor is complete.
- [ ] Update `README.md` architecture notes if pronunciation path changes are finalized.

## Cross-LO Visual Parity
- [x] Align pronunciation emphasis color treatment with grammar via shared tokenized CSS scope.
