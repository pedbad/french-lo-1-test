# LO13 Audio Blockers

## Status

Open blockers remain in LO13 exercise 1.

## Missing LO13 exercise 1 audio

LO13 exercise 1 `Practise the reflexive verbs` now has the same long-player plus
per-row-audio contract as later lessons, but the required lesson-owned recordings
do not yet exist:

- `public/audio/lo13/exercises/016-reflexive-verbs-full-audio.mp3`
- Record the full playlist in the same sentence order as files `017` to `028` below.
- `public/audio/lo13/exercises/017-je-me-reveille-a-huit-heures.mp3`
- `public/audio/lo13/exercises/018-je-mhabille-avant-de-prendre-mon-petit-dejeuner.mp3`
- `public/audio/lo13/exercises/019-adele-se-leve-vers-dix-heures.mp3`
- `public/audio/lo13/exercises/020-vous-vous-levez-a-quelle-heure.mp3`
- `public/audio/lo13/exercises/021-nous-nous-reposons-pendant-le-week-end.mp3`
- `public/audio/lo13/exercises/022-je-me-detends-pendant-les-vacances.mp3`
- `public/audio/lo13/exercises/023-les-enfants-se-couchent-vers-neuf-heures.mp3`
- `public/audio/lo13/exercises/024-patrick-se-couche-a-minuit.mp3`
- `public/audio/lo13/exercises/025-tu-te-maquilles-aujourdhui.mp3`
- `public/audio/lo13/exercises/026-tu-tappelles-comment.mp3`
- `public/audio/lo13/exercises/027-et-ta-soeur-elle-sappelle-comment.mp3`
- `public/audio/lo13/exercises/028-la-tour-eiffel-se-trouve-a-paris.mp3`

## Resolved legacy filename drift

These `daily-routine` refs were already broken before the migration pass and were
resolved by matching the authored source files in `public/sounds/fr` despite
Unicode normalization and punctuation differences:

- `sounds/fr/Ça dépend! En semaine, je me lève à sept heures, mais le week-end, je me lève vers neuf heures et demie. Et toi.mp3`
- `sounds/fr/Ça va mais nous sommes un peu fatigués. Notre fille a neuf semaines et elle se réveille trois fois la nuit. Nous ne dormons pas bien!.mp3`
- `sounds/fr/Quelle horreur! Mais vous vous reposez pendant la journée, j'imagine.mp3`
- `sounds/fr/À la cantine Ah non, on ne mange pas bien à la cantine! Je déjeune au café en face de la bibliothèque. Tu veux déjeuner avec moi.mp3`
- `sounds/fr/Vers minuit et demi Oh là là! Je me couche à neuf heures et demie. Le soir, je suis toujours très fatigué.mp3`
- `sounds/fr/Oui, ça va très bien! À tout à l'heure!.mp3`

## Notes

- LO13 audio refs in config, grammar, and the `DailyRoutineASummersDay` custom component otherwise resolve under `public/audio/lo13/...`.
- LO13 exercise 1 now includes placeholder refs for one full playlist audio file plus 12 row-level clips so it can match the LO12 exercise pattern once recordings are delivered.
- The grammar example clip for `je m'appelle` was copied from `public/audio/lo1/vocabulary/022-je-mappelle.mp3` into `public/audio/lo13/grammar/020-je-mappelle.mp3` so LO13 is self-contained.
- Follow-up cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain. Historical legacy filenames above are kept
  only as migration notes.
