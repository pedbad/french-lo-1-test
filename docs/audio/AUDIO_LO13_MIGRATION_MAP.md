# LO13 Audio Migration Map

## Scope

Lesson:
- `Daily routine`

Updated source files:
- `src/lo-config/daily-routine.json`
- `src/components/custom/grammar/daily-routine-grammar.jsx`
- `src/components/custom/misc/daily-routine-poem.jsx`

## Summary

LO13 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned `audio/lo13/...` folders.

This pass updates the current LO13 implementation so its existing dialogues, vocabulary, grammar, and exercise audio now follow the same lesson-owned audio pattern as the refactored later lessons.

## New LO13 Audio Structure

- `public/audio/lo13/dialogues/...` (14 files)
- `public/audio/lo13/vocabulary/...` (29 files)
- `public/audio/lo13/grammar/...` (27 files)
- `public/audio/lo13/exercises/...` (15 files)

## Migration Notes

- 85 LO13-owned audio files are now present in `public/audio/lo13/...`.
- New target filenames are ASCII-safe and sequence-based.
- The migration covered learner-facing config audio plus lesson-owned grammar and exercise-component audio.
- Six pre-existing broken legacy filename refs were resolved during migration via normalization-aware source matching against `public/sounds/fr/...`.
- One grammar illustration clip (`je m'appelle`) was copied from the already migrated LO1 audio tree so LO13 no longer depends on `audio/lo1/...`.
- This pass did not delete legacy shared assets from `public/sounds/fr`.

## Validation

- `rg -n 'sounds/fr|audio/lo1/' src/lo-config/daily-routine.json src/components/custom/grammar/daily-routine-grammar.jsx src/components/custom/misc/daily-routine-poem.jsx`
- `find public/audio/lo13 -type f | wc -l`
- `yarn build`

## Resolved Source Matches

These legacy refs were already broken before migration and were resolved by matching the authored source files with normalization and punctuation drift:

| Legacy ref | Source file used | New ref |
| --- | --- | --- |
| `sounds/fr/Ça dépend! En semaine, je me lève à sept heures, mais le week-end, je me lève vers neuf heures et demie. Et toi.mp3` | `sounds/fr/Ça dépend ! En semaine, je me lève à sept heures, mais le week-end, je me lève vers neuf heures et demie. Et toi.mp3` | `audio/lo13/dialogues/phraseTable1/002-ca-depend-en-semaine-je-me-leve-a-sept-heures-mais-le-week-end-je-me-leve-vers-neuf-heures-et-demie-et-toi.mp3` |
| `sounds/fr/Vers minuit et demi Oh là là! Je me couche à neuf heures et demie. Le soir, je suis toujours très fatigué.mp3` | `sounds/fr/Vers minuit et demi Oh là là ! Je me couche à neuf heures et demie. Le soir, je suis toujours très fatigué.mp3` | `audio/lo13/dialogues/phraseTable1/005-vers-minuit-et-demi-oh-la-la-je-me-couche-a-neuf-heures-et-demie-le-soir-je-suis-toujours-tres-fatigue.mp3` |
| `sounds/fr/Ça va mais nous sommes un peu fatigués. Notre fille a neuf semaines et elle se réveille trois fois la nuit. Nous ne dormons pas bien!.mp3` | `sounds/fr/Ça va mais nous sommes un peu fatigués. Notre fille a neuf semaines et elle se réveille trois fois la nuit. Nous ne dormons pas bien !.mp3` | `audio/lo13/dialogues/phraseTable2/002-ca-va-mais-nous-sommes-un-peu-fatigues-notre-fille-a-neuf-semaines-et-elle-se-reveille-trois-fois-la-nuit-nous-ne-dormons-pas-bien.mp3` |
| `sounds/fr/Quelle horreur! Mais vous vous reposez pendant la journée, j'imagine.mp3` | `sounds/fr/Quelle horreur ! Mais vous vous reposez pendant la journée, j'imagine.mp3` | `audio/lo13/dialogues/phraseTable2/003-quelle-horreur-mais-vous-vous-reposez-pendant-la-journee-jimagine.mp3` |
| `sounds/fr/À la cantine Ah non, on ne mange pas bien à la cantine! Je déjeune au café en face de la bibliothèque. Tu veux déjeuner avec moi.mp3` | `sounds/fr/À la cantine Ah non, on ne mange pas bien à la cantine ! Je déjeune au café en face de la bibliothèque. Tu veux déjeuner avec moi.mp3` | `audio/lo13/dialogues/phraseTable3/002-a-la-cantine-ah-non-on-ne-mange-pas-bien-a-la-cantine-je-dejeune-au-cafe-en-face-de-la-bibliotheque-tu-veux-dejeuner-avec-moi.mp3` |
| `sounds/fr/Oui, ça va très bien! À tout à l'heure!.mp3` | `sounds/fr/Oui, ça va très bien ! À tout à l'heure !.mp3` | `audio/lo13/dialogues/phraseTable3/005-oui-ca-va-tres-bien-a-tout-a-lheure.mp3` |

## Cross-LO Reuse

| New ref | Source file used | Note |
| --- | --- | --- |
| `audio/lo13/grammar/020-je-mappelle.mp3` | `audio/lo1/vocabulary/022-je-mappelle.mp3` | Existing migrated clip copied into the LO13 grammar folder so the lesson is self-contained. |
