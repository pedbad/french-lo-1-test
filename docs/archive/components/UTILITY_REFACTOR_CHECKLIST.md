# Utility Refactor Checklist

> **This is a reusable process template**, not a tracker for a single ongoing task. Copy and fill in for each utility refactor batch. The specific task it was created for — dead utility cleanup (`audioConcat.js`, `mouse.js`) — is complete as of 2026-05.

## Planning

- [ ] Scope is limited to one concern/module at a time.
- [ ] Current behavior is documented before edits.
- [ ] Expected consumer files are listed.

## Code Changes

- [ ] New module file added under `src/utils/` (if applicable).
- [ ] Functions moved without semantic changes.
- [x] Compatibility layer handled appropriately for migration stage (preserved when needed, removed when complete).
- [ ] No new duplicate helper logic introduced.

## Consumer Migration

- [ ] Imports updated only for the targeted batch.
- [ ] No unresolved imports remain.
- [ ] No circular import introduced.

## Verification

- [ ] `yarn build` passes.
- [ ] `yarn lint` passes.
- [ ] Audio behavior still enforces single-active playback.
- [ ] Modal links and scroll behaviors unchanged.
- [ ] Exercise check/diff visuals unchanged.

## Documentation

- [ ] `README.md` migration trackers updated.
- [ ] `CHANGES.md` includes a dated entry.
- [ ] This checklist and TODO reflect new progress status.

---

## Completed Batches

### Dead utility deletion (2026-05)
- Deleted `src/utils/audioConcat.js` — confirmed zero consumers, was leftover audio-stitching prototype.
- Deleted `src/utils/mouse.js` — confirmed zero consumers, was leftover mouse-tracking experiment.
- `yarn build` verified clean after both deletions.
