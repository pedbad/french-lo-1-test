# LO8 Audio Migration Blockers

## Status

Migration-path blockers are resolved, but follow-up audio review items remain.

## Notes

- LO8 audio refs in config, grammar, and pronunciation now resolve under `public/audio/lo8/...`.
- LO8 memory-game image refs now resolve under `public/img/lo8/exercises/vocabulary/...`.
- Teacher-review audio follow-ups currently outstanding:
  - `public/audio/lo8/dialogues/dialogues2/001-quest-ce-que-tu-fais-le-weekend.mp3`
    - the final `d` in `week-end` is not clear enough
  - `public/audio/lo8/dialogues/dialogues3/003-je-joue-de-laccordeon-et-joue-du-piano-aussi.mp3`
    - should match the corrected displayed text with the second `je`
  - `public/audio/lo8/grammar/jouer-patterns/007-jouer-a-l.mp3`
    - `jouer à l'` sounds closer to `jouer à la`
- Follow-up audio cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain.
- Shared `public/images/memory/...` assets should only be removed after a full
  cross-repo reference check.
