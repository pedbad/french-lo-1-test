# Utility Refactor TODO

## Phase 0 - Baseline

- [ ] Inventory all exports in `src/utility.js`.
- [ ] Map every import site by function usage.
- [ ] Confirm no hidden utility usage from inline dynamic calls.

## Phase 1 - Extract Pure Modules (No Behavior Change)

- [ ] Create `src/utils/assets.js` and move:
  - [ ] `resolveAsset`
  - [ ] `resolveAssetHTML`
- [ ] Create `src/utils/network.js` and move:
  - [ ] `handleResponse`
  - [ ] `handleResponseCSV`
  - [ ] `handleResponseText`
- [ ] Create `src/utils/audioPlayback.js` and move:
  - [ ] `trackFloatingAudio`
  - [ ] `stopAllAudioPlayback`
  - [ ] `playAudioLink`
- [ ] Create `src/utils/dom.js` and move:
  - [ ] `scrollToElement`
  - [ ] `handleModalLinkClick`
- [ ] Create `src/utils/exerciseDiff.js` and move:
  - [ ] `highlightTextDiff`

## Phase 2 - Keep Compatibility

- [ ] Convert `src/utility.js` into compatibility exports from new modules.
- [ ] Keep existing import paths working while migration is in progress.

## Phase 3 - Incremental Callsite Migration

- [ ] Migrate `App.jsx` imports off `src/utility.js`.
- [ ] Migrate component imports batch-by-batch:
  - [ ] audio-related components
  - [ ] exercise components
  - [ ] navigation/modal components
  - [ ] debug components
- [ ] Validate each batch with build + smoke tests.

## Phase 4 - Audio Utility Consolidation

- [ ] Rename `src/audioutility.js` to `src/utils/audioConcat.js`.
- [ ] Update all imports (`ConcatenatedPlayList`).
- [ ] Add compatibility shim only if needed during transition.

## Phase 5 - Cleanup

- [ ] Remove dead/redundant exports from `src/utility.js`.
- [ ] Remove `src/utility.js` facade only after zero imports remain.
- [ ] Update docs and architecture references.

