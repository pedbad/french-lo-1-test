# Utility Refactor README

## Purpose

Define a safe, low-risk refactor plan for utility code so we reduce drift between:

- `src/utility.js` (legacy catch-all)
- `src/audioutility.js` (audio concat helpers)
- `src/utils/reorderAnimation.js` (focused animation helpers)

## Current Problem

`src/utility.js` mixes multiple concerns:

- asset path resolution
- network response parsing
- modal/scroll DOM behavior
- audio playback lifecycle
- exercise diff/check logic

At the same time, newer focused helpers already exist in `src/utils/*`, which creates split conventions and makes ownership unclear.

## Refactor Goal

Move to a clear utility module architecture:

- `src/utils/assets.js`
- `src/utils/network.js`
- `src/utils/dom.js`
- `src/utils/audioPlayback.js`
- `src/utils/exerciseDiff.js`
- `src/utils/audioConcat.js` (rename of `src/audioutility.js`)
- keep `src/utils/reorderAnimation.js`

## Current Status

- Phase 1 extraction implemented.
- `src/utility.js` now acts as a compatibility facade for extracted modules.
- `src/audioutility.js` is now a compatibility shim re-exporting `src/utils/audioConcat.js`.
- Phase 3 import migration completed for all extracted helper domains.

## Safety Strategy

1. Extract by concern with behavior-preserving moves only.
2. Keep `src/utility.js` as compatibility facade via re-exports during migration.
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
