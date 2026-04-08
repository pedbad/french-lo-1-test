# LO8 Audio Migration Blockers

## Status

No blockers in the current LO8 migration pass.

## Notes

- LO8 audio refs in config, grammar, and pronunciation now resolve under `public/audio/lo8/...`.
- LO8 memory-game image refs now resolve under `public/img/lo8/exercises/vocabulary/...`.
- Legacy cleanup is intentionally deferred:
  - shared `public/sounds/fr/...` assets may still be used by other lessons
  - shared `public/images/memory/...` assets should only be removed after a full cross-repo reference check
