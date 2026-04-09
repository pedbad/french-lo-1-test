# LO9 Audio Migration Map

## Scope

Lesson:
- `Phoning in France`

Updated source files:
- `src/lo-config/phoning-in-france.json`
- `src/components/custom/grammar/phoning-in-france-grammar.jsx`
- `src/components/custom/pronunciation/phoning-in-france-pronunciation.jsx`

## Summary

LO9 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned
`audio/lo9/...` folders.

This pass also moved LO9 onto the newer lesson section contract:
- `introImage` + `introHTML` + `informationHTML`
- grouped grammar articles
- tabbed pronunciation items
- lesson-owned audio folders for dialogues, vocabulary, grammar, pronunciation, and exercises

## New LO9 Audio Structure

- `public/audio/lo9/dialogues/phraseTable1/...`
- `public/audio/lo9/dialogues/phraseTable2/...`
- `public/audio/lo9/dialogues/phraseTable3/...`
- `public/audio/lo9/vocabulary/...`
- `public/audio/lo9/grammar/telephone-regions/...`
- `public/audio/lo9/grammar/bien-for-confirmation/...`
- `public/audio/lo9/pronunciation/numbers/...`
- `public/audio/lo9/pronunciation/final-consonants/...`
- `public/audio/lo9/exercises/typedTransformExercise1/...`
- `public/audio/lo9/exercises/selectExercise1/...`
- `public/audio/lo9/exercises/draggableFillGaps1/...`

## Migration Notes

- 85 LO9-owned audio files were copied into `public/audio/lo9/...`.
- New target filenames are ASCII-safe and sequence-based.
- Legacy filename drift in `public/sounds/fr` included punctuation/spacing variants.
  - migration was resolved copy-first rather than renaming legacy shared files in place
- This pass did not delete legacy shared assets from `public/sounds/fr`.
  - cleanup should happen only after confirming no remaining `src` references from other lessons

## Validation

- `rg -n 'sounds/fr' src/lo-config/phoning-in-france.json src/components/custom/grammar/phoning-in-france-grammar.jsx src/components/custom/pronunciation/phoning-in-france-pronunciation.jsx`
- `find public/audio/lo9 -type f | wc -l`
- `yarn build`
