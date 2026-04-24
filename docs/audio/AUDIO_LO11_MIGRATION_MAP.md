# LO11 Audio Migration Map

## Scope

Lesson:
- `Out and about: going to a café`

Updated source files:
- `src/lo-config/going-to-a-cafe.json`
- `src/components/custom/grammar/going-to-a-cafe-grammar.jsx`

## Summary

LO11 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned
`audio/lo11/...` folders.

This pass modernizes the lesson to match the current LO8-LO10 contract where source
material exists:
- `introImage` + `introHTML` + `informationHTML`
- grouped grammar articles
- section-level instructional copy for dialogues, vocabulary, grammar, and exercises
- lesson-owned audio folders for dialogues, vocabulary, grammar, and exercises

Note:
- no pronunciation section was added in this pass because there is no authored LO11
  pronunciation source content in the current repo to migrate without inventing new
  pedagogy

## New LO11 Audio Structure

- `public/audio/lo11/dialogues/phraseTable1/...`
- `public/audio/lo11/dialogues/phraseTable2/...`
- `public/audio/lo11/dialogues/phraseTable3/...`
- `public/audio/lo11/vocabulary/...`
- `public/audio/lo11/grammar/conditional-vouloir/...`
- `public/audio/lo11/grammar/prendre/...`
- `public/audio/lo11/grammar/flavours-with-a/...`
- `public/audio/lo11/grammar/disjunctive-pronouns/...`
- `public/audio/lo11/exercises/draggableFillGaps1/...`
- `public/audio/lo11/exercises/selectExercise1/...`
- `public/audio/lo11/exercises/selectExercise2/...`
- `public/audio/lo11/exercises/inlineChoiceGroup3/...`

## Migration Notes

- 115 LO11-owned audio files were copied into `public/audio/lo11/...`.
- New target filenames are ASCII-safe and sequence-based.
- The migration covered both:
  - learner-facing LO11 config audio
  - the refactored café grammar component audio
- Several previously broken LO11 refs were resolved during migration via normalization-aware
  matching against `public/sounds/fr/...`, including filename drift caused by:
  - accented filename normalization differences
  - spacing before punctuation
  - mixed apostrophe/quote variants
- This pass did not delete legacy shared assets from `public/sounds/fr`.
  - cleanup should happen only after confirming no remaining `src` references from other lessons

## Validation

- `rg -n 'sounds/fr' src/lo-config/going-to-a-cafe.json src/components/custom/grammar/going-to-a-cafe-grammar.jsx`
- `find public/audio/lo11 -type f | wc -l`
- `yarn build`
