# Audio Sign-Off

Single reference for all outstanding audio work — missing files, wrong-content re-records, and teacher review requests. Used by both the development team (to track runtime gaps) and the media editor (to know what to record or replace).

## Status labels

- `Missing` — file is already wired in code but does not exist on disk; the app silently produces no audio until this is resolved
- `Re-record (wrong content)` — file exists but audio does not match the displayed text
- `Re-record (wrong speaker)` — file exists but the wrong voice was used
- `New recording` — file does not exist; needs to be recorded from scratch
- `Done` — resolved; move entry to the Resolved section at the bottom

---

## LO1 — First Contact

### Missing

- `public/audio/lo1/pronunciation/oi-sound/004-bonsoir.mp3`
  - Section: **Pronunciation — 3. The sound "oi"**
  - JSX links to this file with the text _bonsoir_, but the file does not exist.
    The folder contains `004-au-revoir.mp3` instead — record a new clip of _bonsoir_
    or confirm whether the existing `au-revoir` file should be used here instead
    (in which case a developer update to the JSX is needed).

### Orphaned file (review)

- `public/audio/lo1/pronunciation/silent-h/004-au-revoir.mp3`
  - This file is not referenced in any JSX or config. The same folder's JSX only
    references files `001`–`003` (homme, horrible, horizon). Delete if unneeded.

---

## LO6 — Family, Friends and Neighbours

### Re-record (wrong content / quality)

- `public/audio/lo6/grammar/004-elles-ont.mp3`
  - Section: **Grammar and Usage**
  - `elles ont` does not sound naturally linked; liaison should run the words together more clearly.

### New recording

- `public/audio/lo6/exercises/double-ll-rhyme-la-famille-de-camille.mp3`
  - Section: **Exercises — double-ll pronunciation**
  - Combined audio for the full `La famille de Camille` pronunciation-practice text.

- `public/audio/lo6/exercises/double-ll-rhyme-annabelle-a-une-petite-fille.mp3`
  - Section: **Exercises — double-ll pronunciation**
  - Combined audio for the full `Annabelle a une petite-fille` pronunciation-practice text.

---

## LO7 — Opinions Matter

### Re-record (wrong content / quality)

- `public/audio/lo7/vocabulary/007-basket-basketball.mp3`
  - Section: **Vocabulary**
  - `basket` is fine, but `basketball` sounds wrong; the first `a` is not pronounced correctly.

---

## LO15 — Planning a Holiday

### New recording

- `public/audio/lo15/exercises/03-select/010-quand-je-suis-en-vacances-le-soir-mes-amis-ne-pas.mp3`
  - Section: **Exercises → 3. Adèle's holiday activities**, item 10
  - Text to record: _Quand je suis en vacances, le soir mes amis ne cuisinent pas._
  - Note: include a short natural pause after _Quand je suis en vacances_ and **before** _le soir_ (i.e. _Quand je suis en vacances, [pause] le soir mes amis ne cuisinent pas._). Replaces the old `010` file which had wrong text and missing pauses.

- `public/audio/lo15/exercises/03-select/012-cest-moi-qui-cuisine.mp3`
  - Section: **Exercises → 3. Adèle's holiday activities**, item 11 (new)
  - Text to record: _C'est moi qui cuisine._

- `public/audio/lo15/exercises/03-select/009-quand-je-suis-en-vacances-mes-amis-et-moi-des-randonnees-ensemble.mp3`
  - Section: **Exercises → 3. Adèle's holiday activities**, item 9
  - Text to record: _Quand je suis en vacances, mes amis et moi faisons des randonnées ensemble._
  - Replaces the old `009` file which had _nous_ instead of _mes amis et moi_.

---

## LO14 — Studying at University

### Re-record (wrong speaker — use female voice)

- `public/audio/lo14/dialogues/01/001-qu-est-ce-que-tu-fais-comme-etudes.mp3`
  - Section: **Dialogues → Talking about your studies**, row 1
  - Text: `Qu'est-ce que tu fais comme études ?`
  - Currently male speaker. Should be female.

### New recording

- `public/audio/lo14/grammar/pouvoir/011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3`
  - Section: **Grammar → 3. Using pouvoir with an infinitive** — example row 2
  - Text to record: _Vous pouvez ouvrir la fenêtre, s'il vous plaît ?_

---

## LO11 — Going to a Café

### Re-record (wrong content / quality)

- `public/audio/lo11/vocabulary/015-vous-voulez-quelque-chose-a-manger.mp3`
  - Section: **Vocabulary**
  - Text: `Vous voulez quelque chose à manger ?`
  - Recorded as a statement; should have question intonation.

---

## LO12 — Shopping in the Market

### Re-record (wrong content / quality)

- `public/audio/lo12/pronunciation/016-ou.mp3`
  - Section: **Pronunciation Focus** (heading audio for _ou_)
  - Currently sounds like _oh_; should sound like _ooh_ (the French _ou_ vowel). Re-record.



### New recording

- `public/audio/lo12/grammar/033-je-nai-pas-de-fromage.mp3`
  - Section: **Grammar → 2. Partitives — negation table**, first row
  - Text to record: _Je n'ai pas de fromage._
  - This replaces the existing `du fromage / some cheese` positive example, which is being changed to a negative example to match the negation table context.

- `public/audio/lo12/exercises/041-bout.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - Question word for the _bu / bout_ listening pair. Record: _bout_
  - Exercise plays this clip; student selects between written options _bu_ and _bout_.

- `public/audio/lo12/exercises/043-roue.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - Question word for the _rue / roue_ listening pair. Record: _roue_
  - Exercise plays this clip; student selects between written options _rue_ and _roue_.

---

---

## Resolved

- **LO2 Grammar — Subject pronouns** `audio/lo2/grammar/grammar-and-usage/025-iel.mp3`
  - Was missing at runtime; file now exists at `public/audio/lo2/grammar/grammar-and-usage/025-iel.mp3`.

---

## File Tree — All Outstanding Recordings

Drop each completed file into the exact folder path shown. No code changes needed.

```
public/audio/
├── lo5/
│   ├── exercises/
│   │   └── selectExercise2/
│   │       └── 003-mme-leserre-est-tres-curieuse.mp3
│   └── monologues/
│       └── monologues1/
│           └── 003-country-house-monologue.mp3
├── lo6/
│   ├── exercises/
│   │   ├── double-ll-rhyme-annabelle-a-une-petite-fille.mp3
│   │   └── double-ll-rhyme-la-famille-de-camille.mp3
│   └── grammar/
│       └── 004-elles-ont.mp3
├── lo7/
│   ├── exercises/
│   │   ├── articles/
│   │   │   └── 011-vous-preferez-la-france-ou-la-suisse.mp3
│   │   ├── listening/
│   │   │   └── 001-lo7-dialogue-1.mp3
│   │   └── poem/
│   │       └── sept-couleurs-magiques.mp3
│   └── vocabulary/
│       └── 007-basket-basketball.mp3
├── lo8/
│   └── dialogues/
│       ├── phraseTable2/
│       │   └── 001-quest-ce-que-tu-fais-le-weekend.mp3
│       └── phraseTable3/
│           └── 003-je-joue-de-laccordeon-et-joue-du-piano-aussi.mp3
├── lo9/
│   ├── dialogues/
│   │   └── phraseTable2/
│   │       └── 004-oh-excusez-moi-au-revoir-madame.mp3
│   ├── exercises/
│   │   └── selectExercise1/
│   │       └── 004-oh-excusez-moi-au-revoir-madame.mp3
│   └── grammar/
│       └── telephone-regions/
│           └── 007-mobile-06-07.mp3
├── lo10/
│   ├── dialogues/
│   │   └── phraseTable2/
│   │       └── 004-oh-excusez-moi-au-revoir-madame.mp3
│   └── exercises/
│       └── dictationExercise4/
│           └── 009-d-accord-a-plus.mp3
├── lo11/
│   └── vocabulary/
│       └── 015-vous-voulez-quelque-chose-a-manger.mp3
├── lo12/
│   ├── dialogues/
│   │   ├── 006-oui-cest-pratique-et-le-jeudi-je-vais-au-grand-marche-au-centre-ville-jachete-so.mp3
│   │   └── 007-tu-as-de-la-chance-si-nous-voulons-du-pain-marc-va-a-la-boulangerie-au-bout-de-l.mp3
│   ├── exercises/
│   │   ├── 041-bout.mp3
│   │   └── 043-roue.mp3
│   ├── grammar/
│   │   └── 033-je-nai-pas-de-fromage.mp3
│   └── pronunciation/
│       └── 016-ou.mp3
├── lo13/
│   └── exercises/
│       ├── 016-reflexive-verbs-full-audio.mp3
│       ├── 017-je-me-reveille-a-huit-heures.mp3
│       ├── 018-je-mhabille-avant-de-prendre-mon-petit-dejeuner.mp3
│       ├── 019-adele-se-leve-vers-dix-heures.mp3
│       ├── 020-vous-vous-levez-a-quelle-heure.mp3
│       ├── 021-nous-nous-reposons-pendant-le-week-end.mp3
│       ├── 022-je-me-detends-pendant-les-vacances.mp3
│       ├── 023-les-enfants-se-couchent-vers-neuf-heures.mp3
│       ├── 024-patrick-se-couche-a-minuit.mp3
│       ├── 025-tu-te-maquilles-aujourdhui.mp3
│       ├── 026-tu-tappelles-comment.mp3
│       ├── 027-et-ta-soeur-elle-sappelle-comment.mp3
│       └── 028-la-tour-eiffel-se-trouve-a-paris.mp3
├── lo14/
│   ├── dialogues/
│   │   └── phraseTable1/
│   │       └── 001-qu-est-ce-que-tu-fais-comme-etudes.mp3
│   └── grammar/
│       └── pouvoir/
│           ├── 010-je-peux-repondre-a-votre-question-tout-de-suite.mp3
│           └── 011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3
└── lo15/
    └── exercises/
        └── selectExercise1/
            ├── 009-quand-je-suis-en-vacances-mes-amis-et-moi-des-randonnees-ensemble.mp3
            ├── 010-quand-je-suis-en-vacances-le-soir-mes-amis-ne-pas.mp3
            └── 012-cest-moi-qui-cuisine.mp3
```

AUDIO_CHECKLIST_COMPLETED

003-mme-leserre-est-tres-curieuse added to
public/audio/lo5/exercises/03-select/003-mme-leserre-est-tres-curieuse.mp3

018-je-mhabille-avant-de-prendre-mon-petit-dejeuner.mp3
019-adele-se-leve-vers-dix-heures.mp3
020-vous-vous-levez-a-quelle-heure.mp3
021-nous-nous-reposons-pendant-le-week-end.mp3
022-je-me-detends-pendant-les-vacances.mp3
023-les-enfants-se-couchent-vers-neuf-heures.mp3
024-patrick-se-couche-a-minuit.mp3

026-tu-tappelles-comment.mp3
027-et-ta-soeur-elle-sappelle-comment
028-la-tour-eiffel-se-trouve-a-paris.mp3

007-mobile-06-07 added to
/public/audio/lo9/grammar/telephone-regions
