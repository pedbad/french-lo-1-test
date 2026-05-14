# LO8 Audio Migration Map

## Scope

Lesson:
- `Free Time`

Updated source files:
- `src/lo-config/free-time.json`
- `src/components/custom/grammar/free-time-grammar.jsx`
- `src/components/custom/pronunciation/free-time-pronunciation.jsx`

## Summary

LO8 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned
`audio/lo8/...` folders.

The migration also moved LO8 memory-game image refs away from generic `images/memory/...`
paths and into lesson-owned `img/lo8/exercises/vocabulary/...`.

## New LO8 Audio Structure

- `public/audio/lo8/dialogues/dialogues1/...`
- `public/audio/lo8/dialogues/dialogues2/...`
- `public/audio/lo8/dialogues/dialogues3/...`
- `public/audio/lo8/dialogues/dialogues4/...`
- `public/audio/lo8/vocabulary/...`
- `public/audio/lo8/grammar/adjective-agreement/...`
- `public/audio/lo8/grammar/faire-and-partitives/...`
- `public/audio/lo8/grammar/jouer-patterns/...`
- `public/audio/lo8/grammar/noun-endings/...`
- `public/audio/lo8/pronunciation/tion-sound/...`
- `public/audio/lo8/exercises/memoryMatchGame1/...`
- `public/audio/lo8/exercises/selectExercise1/...`
- `public/audio/lo8/exercises/selectExercise2/...`
- `public/audio/lo8/exercises/selectExercise3/...`
- `public/audio/lo8/exercises/draggableFillGaps1/...`

## Image Structure

- `public/img/lo8/exercises/vocabulary/...`

## Migration Notes

- The LO8 config now uses the newer section architecture:
  - grouped grammar articles
  - tabbed pronunciation items
  - lesson-owned audio/image paths
- New target filenames are ASCII-safe and sequence-based.
- This pass was copy-first:
  - migrated lesson-owned assets were copied into new LO8 folders
  - legacy shared source assets were not deleted in this pass

## Validation

- `yarn build`
- targeted ESLint pass on the changed LO8 source files
