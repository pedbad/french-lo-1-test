# Utility Refactor TODO

## Phase 0 - Baseline

- [x] Inventory all exports in legacy utility layers.
- [x] Map every import site by function usage.
- [x] Confirm no hidden utility usage from inline dynamic calls.

## Phase 1 - Extract Pure Modules (No Behavior Change)

- [x] Create `src/utils/assets.js` and move:
  - [x] `resolveAsset`
  - [x] `resolveAssetHTML`
- [x] Create `src/utils/network.js` and move:
  - [x] `handleResponse`
  - [x] `handleResponseCSV`
  - [x] `handleResponseText`
- [x] Create `src/utils/audioPlayback.js` and move:
  - [x] `trackFloatingAudio`
  - [x] `stopAllAudioPlayback`
  - [x] `playAudioLink`
- [x] Create `src/utils/dom.js` and move:
  - [x] `scrollToElement`
  - [x] `handleModalLinkClick`
- [x] Create `src/utils/exerciseDiff.js` and move:
  - [x] `highlightTextDiff`

## Phase 2 - Keep Compatibility

- [x] Convert `src/utility.js` into compatibility exports from new modules.
- [x] Keep existing import paths working while migration is in progress.

## Phase 3 - Incremental Callsite Migration

- [x] Migrate `App.jsx` imports off `src/utility.js` for extracted domains.
- [x] Migrate component imports batch-by-batch:
  - [x] audio-related components
  - [x] exercise components
  - [x] navigation/modal components
  - [x] debug components
- [x] Validate each batch with build + smoke tests.
- [x] Migrate remaining non-extracted helper imports (`shuffleArray`, `copyObject`, `isTouchChrome`, `speak`) after extracting them to focused modules.

## Phase 4 - Audio Utility Consolidation

- [x] Rename `src/audioutility.js` to `src/utils/audioConcat.js`.
- [x] Update all imports (`ConcatenatedPlayList`).
- [x] Add compatibility shim only if needed during transition.

## Phase 5 - Cleanup

- [x] Remove dead/redundant exports from legacy utility facades.
- [x] Remove `src/utility.js` facade only after zero imports remain.
- [x] Remove `src/audioutility.js` shim after zero imports remain.
- [x] Update docs and architecture references.
