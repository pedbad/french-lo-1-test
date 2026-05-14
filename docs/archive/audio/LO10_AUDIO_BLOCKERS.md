# LO10 Audio Migration Blockers

## Status

No blockers in the current LO10 migration pass.

## Notes

- LO10 audio refs in config, grammar, and pronunciation now resolve under `public/audio/lo10/...`.
- The migration required resolving legacy filename drift in `public/sounds/fr`, especially:
  - Unicode normalization differences in accented filenames
  - spaces before punctuation
  - mixed apostrophe and quote variants
- Controlled fallback copies were used for a small number of previously broken LO10 refs:
  - one pronunciation clip was seeded from an existing LO1 migrated asset
  - two shared dialogue clips were seeded from existing LO9 migrated assets
  - one short closing line was seeded from a combined legacy `À plus tard ! / À plus !` recording
- Follow-up cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain. Historical legacy filenames above are kept
  only as migration notes.
