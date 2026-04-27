# LO12 Audio Migration Blockers

## Status

Open blockers remain in the LO12 pronunciation exercise.

## Missing LO12 pronunciation exercise audio

The original authored `u / ou` content has been restored, but these lesson-owned audio
targets do not yet have source files to copy from. They are currently referenced by
exercise 5:

- `public/audio/lo12/exercises/041-bout.mp3`
- `public/audio/lo12/exercises/042-couteau.mp3`
- `public/audio/lo12/exercises/043-roue.mp3`
- `public/audio/lo12/exercises/044-jus.mp3`

## Notes

- LO12 audio refs in config, grammar, and pronunciation otherwise resolve under `public/audio/lo12/...`.
- The original teacher-authored pronunciation examples were restored; temporary substitute words are no longer used.
- `u.mp3` and `ou.mp3` were copied into `public/audio/lo12/pronunciation/` so the restored pronunciation introduction remains functional.
- Legacy cleanup is intentionally deferred until cross-repo `src` references to `public/sounds/fr/...` are audited.
