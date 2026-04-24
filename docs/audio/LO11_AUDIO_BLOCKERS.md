# LO11 Audio Migration Blockers

## Status

No blockers in the current LO11 migration pass.

## Notes

- LO11 audio refs in config and grammar now resolve under `public/audio/lo11/...`.
- The migration cleared the pre-existing broken LO11 refs by resolving legacy filename drift in
  `public/sounds/fr`, especially:
  - Unicode normalization differences in accented filenames
  - spaces before punctuation
  - mixed apostrophe and quote variants
- No LO11 pronunciation audio was migrated in this pass because the current repo does not
  contain authored pronunciation content for this lesson.
- Legacy cleanup is intentionally deferred:
  - shared `public/sounds/fr/...` assets may still be used by other lessons
  - old shared files should only be removed after a full cross-repo reference check
