# Utility Refactor README

## Purpose

Define a safe, low-risk refactor plan for utility code so we reduce drift between utility concerns and keep ownership clear under `src/utils/*`.

## Current Problem

Legacy utilities mixed multiple concerns in one file, which reduced ownership clarity and increased regression risk.

At the same time, newer focused helpers already exist in `src/utils/*`, which creates split conventions and makes ownership unclear.

## Refactor Goal

Move to a clear utility module architecture:

- `src/utils/assets.js`
- `src/utils/network.js`
- `src/utils/dom.js`
- `src/utils/audioPlayback.js`
- `src/utils/exerciseDiff.js`
- `src/utils/audioConcat.js`
- keep `src/utils/reorderAnimation.js`

## Current Status

- Phase 1 extraction implemented.
- Phase 3 import migration completed for all extracted helper domains.
- Legacy compatibility files removed:
  - `src/utility.js`
  - `src/audioutility.js`

## Safety Strategy

1. Extract by concern with behavior-preserving moves only.
2. Use compatibility facades only as temporary migration bridges.
3. Migrate imports incrementally, file-by-file.
4. Remove facade exports only after all call sites are updated and verified.

## Non-Goals (for phase 1)

- no behavior redesign
- no API shape changes for consumers
- no broad naming changes beyond focused module extraction

## Quality Gates

- `yarn build`
- `yarn lint`
- `yarn check:typography:branch`
- `yarn check:color:branch`
- `yarn check:a11y:branch`
