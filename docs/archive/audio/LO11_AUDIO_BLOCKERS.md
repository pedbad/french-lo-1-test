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
- Follow-up cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain. Historical legacy filenames above are kept
  only as migration notes.
