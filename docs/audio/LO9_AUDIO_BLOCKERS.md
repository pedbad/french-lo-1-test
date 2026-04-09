# LO9 Audio Migration Blockers

## Status

No blockers in the current LO9 migration pass.

## Notes

- LO9 audio refs in config, grammar, and pronunciation now resolve under `public/audio/lo9/...`.
- The migration required handling legacy filename drift in `public/sounds/fr`, especially:
  - spaces before punctuation
  - accent-normalized filename variants
  - mixed leading-slash vs non-leading-slash source refs
- Legacy cleanup is intentionally deferred:
  - shared `public/sounds/fr/...` assets may still be used by other lessons
  - old shared files should only be removed after a full cross-repo reference check
