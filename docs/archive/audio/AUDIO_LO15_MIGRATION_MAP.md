# LO15 Audio Migration Map

## Scope

Lesson:
- `Planning a holiday`

Updated source files:
- `src/lo-config/planning-a-holiday.json`
- `src/components/custom/grammar/planning-a-holiday-grammar.jsx`
- `src/components/custom/grammar/index.js`

## Summary

LO15 audio has been migrated from legacy shared `sounds/fr/...` paths to
lesson-owned `audio/lo15/...` folders.

This pass also moved the transport exercise images from legacy
`images/memory-transport/...` references to lesson-owned `img/lo15/...`
references.

## New LO15 Audio Structure

- `public/audio/lo15/dialogues/phraseTable1/...` (4 files)
- `public/audio/lo15/dialogues/phraseTable2/...` (7 files)
- `public/audio/lo15/vocabulary/...` (27 files)
- `public/audio/lo15/grammar/weather/...` (10 files)
- `public/audio/lo15/grammar/aller-near-future/...` (11 files)
- `public/audio/lo15/exercises/memoryMatchGame1/...` (12 files)
- `public/audio/lo15/exercises/draggableFillGaps1/...` (8 files)
- `public/audio/lo15/exercises/selectExercise1/...` (11 files)
- `public/audio/lo15/exercises/dictationExercise1/...` (6 files)
- `public/audio/lo15/exercises/draggableFillGaps2/...` (4 files)

Total: 100 LO15-owned audio files.

## New LO15 Image Structure

- `public/img/lo15/planning-a-holiday.svg`
- `public/img/lo15/exercises/transport/...` (12 files)

## Migration Notes

- New target filenames are ASCII-safe and sequence-based.
- Dialogue, vocabulary, and exercise refs now resolve from
  `public/audio/lo15/...`.
- Grammar audio is grouped by topic:
  - `weather`
  - `aller-near-future`
- Several legacy refs required normalization-aware matching because the source
  files used decomposed accents or spaces before punctuation.
- `Il pleut` and `Il neige` were copied from migrated LO5 grammar audio because
  exact LO15 legacy source files were not present.
- `Comment ça va` and the `aller` conjugation forms were copied from migrated
  LO12 grammar audio so the LO15 grammar section remains self-contained.
- The legacy shared `public/sounds/fr/...` folder was removed after confirming
  no runtime references remain.
- Legacy shared `public/images/...` assets remain in place until image
  references are fully audited.

## Validation

- `rg -n 'sounds/fr|images/memory-transport|MakingArrangements2Grammar|making-arrangements-2' src/lo-config/planning-a-holiday.json src/components/custom/grammar`
- Targeted Node existence check for all `audio/lo15/...` refs in LO15 config and grammar.
- Targeted Node existence check for all `img/lo15/...` refs in LO15 config.
- `find public/audio/lo15 -type f | wc -l`
- `find public/img/lo15/exercises/transport -type f | wc -l`
- `rg -n '(?:/)?sounds/fr' src index.html package.json vite.config.* --glob '!dist/**'`
- `yarn build`
