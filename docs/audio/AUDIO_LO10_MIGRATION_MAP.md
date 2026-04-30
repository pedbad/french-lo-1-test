# LO10 Audio Migration Map

## Scope

Lesson:
- `Making Arrangements`

Updated source files:
- `src/lo-config/making-arrangements.json`
- `src/components/custom/grammar/making-arrangements-grammar.jsx`
- `src/components/custom/pronunciation/making-arrangements-pronunciation.jsx`

## Summary

LO10 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned
`audio/lo10/...` folders.

This pass completes the structural modernization started in the same lesson:
- `introImage` + `introHTML` + `informationHTML`
- grouped grammar articles
- tabbed pronunciation items
- lesson-owned audio folders for dialogues, vocabulary, grammar, pronunciation, and exercises

## New LO10 Audio Structure

- `public/audio/lo10/dialogues/phraseTable1/...`
- `public/audio/lo10/dialogues/phraseTable2/...`
- `public/audio/lo10/dialogues/phraseTable3/...`
- `public/audio/lo10/dialogues/phraseTable4/...`
- `public/audio/lo10/vocabulary/...`
- `public/audio/lo10/grammar/vouloir/...`
- `public/audio/lo10/grammar/preposition-a/...`
- `public/audio/lo10/pronunciation/ui-sound/...`
- `public/audio/lo10/exercises/selectExercise1/...`
- `public/audio/lo10/exercises/draggableFillGaps1/...`
- `public/audio/lo10/exercises/selectExercise3/...`
- `public/audio/lo10/exercises/dictationExercise4/...`

## Migration Notes

- 114 LO10-owned audio files were copied into `public/audio/lo10/...`.
- New target filenames are ASCII-safe and sequence-based.
- Most LO10 refs resolved directly from `public/sounds/fr/...`, but some legacy filenames required normalization-aware matching because of:
  - accented filename normalization differences
  - spaces before punctuation
  - mixed apostrophe/quote variants
- This pass also used a small number of controlled fallback sources to clear pre-existing broken LO10 refs:
  - `public/audio/lo10/dialogues/phraseTable2/004-oh-excusez-moi-au-revoir-madame.mp3`
    - seeded from `public/audio/lo9/dialogues/phraseTable2/004-oh-excusez-moi-au-revoir-madame.mp3`
  - `public/audio/lo10/dialogues/phraseTable3/009-d-accord-a-ce-soir.mp3`
    - seeded from `public/audio/lo9/dialogues/phraseTable3/009-daccord-a-ce-soir.mp3`
  - `public/audio/lo10/dialogues/phraseTable4/002-oui-je-veux-bien-a-quelle-heure.mp3`
    - seeded from `public/audio/lo9/dialogues/phraseTable3/007-oui-je-veux-bien-a-quelle-heure.mp3`
  - `public/audio/lo10/exercises/dictationExercise4/009-d-accord-a-plus.mp3`
    - seeded from `public/sounds/fr/À plus tard ! À plus !.mp3`
  - `public/audio/lo10/pronunciation/ui-sound/001-aujourdhui.mp3`
    - seeded from `public/audio/lo1/vocabulary/031-aujourdhui.mp3`
- Follow-up cleanup is complete: the later repo-wide cleanup removed `public/sounds/fr`
  after confirming no runtime references remained. Historical source refs stay in
  this map for traceability.

## Validation

- `rg -n 'sounds/fr|audio/lo1/|audio/lo9/' src/lo-config/making-arrangements.json src/components/custom/grammar/making-arrangements-grammar.jsx src/components/custom/pronunciation/making-arrangements-pronunciation.jsx`
- `find public/audio/lo10 -type f | wc -l`
- `yarn build`
