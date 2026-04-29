# LO14 Audio Migration Map

## Scope

Lesson:
- `Studying at university`

Updated source files:
- `src/lo-config/studying-at-university.json`
- `src/components/custom/grammar/studying-at-university-grammar.jsx`

## Summary

LO14 audio has been migrated from legacy shared `sounds/fr/...` paths to
lesson-owned `audio/lo14/...` folders.

This pass updates the current LO14 implementation so its dialogues, vocabulary,
grammar, and exercise audio now follow the same lesson-owned audio pattern used
by the more recently refactored lessons.

## New LO14 Audio Structure

- `public/audio/lo14/dialogues/...` (16 files)
- `public/audio/lo14/vocabulary/...` (49 files)
- `public/audio/lo14/grammar/...` (28 files)
- `public/audio/lo14/exercises/...` (35 files)

## Migration Notes

- 128 LO14-owned audio files are now present in `public/audio/lo14/...`.
- New target filenames are ASCII-safe and sequence-based.
- Grammar audio is now grouped by topic:
  - `using-comme`
  - `devoir`
  - `pouvoir`
  - `participles`
- Exercise audio is grouped by activity id for easier traceability.
- All LO14 refs resolved against existing authored files in `public/sounds/fr/...`
  using normalization-aware matching, so this pass finished with no open audio
  blockers.

## Validation

- `rg -n 'sounds/fr' src/lo-config/studying-at-university.json src/components/custom/grammar/studying-at-university-grammar.jsx`
- `find public/audio/lo14 -type f | wc -l`
- `yarn build`
