# LO4 Audio Migration Blockers

## Status
- Blocker count: **0**
- Migration scope: complete for LO4 audio refs in:
  - `src/lo-config/current-location.json`
  - `src/components/custom/pronunciation/current-location-pronunciation.jsx`
  - `src/components/exercises/current-location/nasal-rhyme-exercise.jsx`

## Notes
- During legacy cleanup, three files in `public/sounds/fr` were intentionally retained because they are still referenced outside LO4:
  - `sounds/fr/aimer.mp3`
  - `sounds/fr/jardin.mp3`
  - `sounds/fr/peinture.mp3`
