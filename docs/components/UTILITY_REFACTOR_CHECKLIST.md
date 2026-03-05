# Utility Refactor Checklist

Use this checklist for each utility refactor PR/batch.

## Planning

- [ ] Scope is limited to one concern/module at a time.
- [ ] Current behavior is documented before edits.
- [ ] Expected consumer files are listed.

## Code Changes

- [ ] New module file added under `src/utils/`.
- [ ] Functions moved without semantic changes.
- [ ] Compatibility exports preserved in `src/utility.js` (if migration not complete).
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

