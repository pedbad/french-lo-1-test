# LO4 Audio Migration Blockers

## Status
- Blocker count: **0**
- Migration scope: complete for LO4 audio refs in:
  - `src/lo-config/current-location.json`
  - `src/components/custom/pronunciation/current-location-pronunciation.jsx`
  - `src/components/exercises/current-location/nasal-rhyme-exercise.jsx`

## Notes
- During the original LO4 cleanup, three files in `public/sounds/fr` were intentionally retained because they were still referenced outside LO4 at that time:
  - `sounds/fr/aimer.mp3`
  - `sounds/fr/jardin.mp3`
  - `sounds/fr/peinture.mp3`
- Follow-up cleanup is complete: those remaining legacy files were removed in the
  repo-wide `public/sounds/fr` cleanup after runtime refs reached zero.
