# LO9 Audio Migration Blockers

## Status

No blockers in the current LO9 migration pass.

## Notes

- LO9 audio refs in config, grammar, and pronunciation now resolve under `public/audio/lo9/...`.
- The migration required handling legacy filename drift in `public/sounds/fr`, especially:
  - spaces before punctuation
  - accent-normalized filename variants
  - mixed leading-slash vs non-leading-slash source refs
- Follow-up cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain. Historical legacy filenames above are kept
  only as migration notes.
