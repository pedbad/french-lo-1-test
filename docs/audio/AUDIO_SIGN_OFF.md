# Audio Sign-Off

Single reference for all outstanding audio work — missing files, wrong-content re-records, and teacher review requests. Used by both the development team (to track runtime gaps) and the media editor (to know what to record or replace).

## Status labels

- `Missing` — file is already wired in code but does not exist on disk; the app silently produces no audio until this is resolved
- `Re-record (wrong content)` — file exists but audio does not match the displayed text or has a pronunciation error
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

---

## LO7 — Opinions Matter

### Re-record (wrong content / quality)

- `public/audio/lo7/vocabulary/007-basket-basketball.mp3`
  - Section: **Vocabulary**
  - `basket` is fine, but `basketball` sounds wrong; the first `a` is not pronounced correctly.

---

## LO9 / LO10 — Shared dialogue file

### Re-record (wrong speaker mix)

- `public/audio/lo9/dialogues/02/004-oh-excusez-moi-au-revoir-madame.mp3`
- `public/audio/lo9/exercises/02-select/004-oh-excusez-moi-au-revoir-madame.mp3`
- `public/audio/lo10/dialogues/02/004-oh-excusez-moi-au-revoir-madame.mp3`
  - All three copies of this clip sound like two different men speaking. Should be consistent voice throughout.

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
  - Currently sounds like _oh_; should sound like _ooh_ (the French _ou_ vowel).

- `public/audio/lo12/pronunciation/005-rue.mp3`
  - Section: **Pronunciation Focus** (the _u_ sound)
  - Extra "la" sound audible before _rue_; vowel sounds like _ou_ rather than the French _u_.

### New recording (files do not exist)

- `public/audio/lo12/exercises/03-inline-choice/041-bout.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - The exercise plays this clip; student selects between _bu_ and _bout_.
  - Record: _bout_. LC confirmed previous draft was completely wrong (sounded like English "about").

- `public/audio/lo12/exercises/03-inline-choice/043-roue.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - The exercise plays this clip; student selects between _rue_ and _roue_.
  - Record: _roue_. The final _e_ must be silent. LC confirmed previous draft had wrong pronunciation.

---

## LO13 — Daily Routine

### Re-record (pronunciation error)

- `public/audio/lo13/exercises/01-select/025-tu-te-maquilles-aujourdhui.mp3`
  - Section: **Exercises → 1. Practise the reflexive verbs**, item 025
  - Text: _Tu te maquilles aujourd'hui ?_
  - Odd s/z sound audible before _aujourd'hui_ — the final _s_ of _maquilles_ should not be pronounced. LC confirmed.

---

## LO14 — Studying at University

### Re-record (wrong pronunciation)

- `public/audio/lo14/dialogues/01/001-qu-est-ce-que-tu-fais-comme-etudes.mp3`
  - Section: **Dialogues → Talking about your studies**, row 1
  - Text: _Qu'est-ce que tu fais comme études ?_
  - Pronunciation of _qu'est-ce que_ is not natural — should sound like _kess kuh_. LC confirmed. (Previously also flagged as wrong speaker — re-record as female voice with correct pronunciation.)

### New recording (file does not exist)

- `public/audio/lo14/grammar/pouvoir/011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3`
  - Section: **Grammar → 3. Using pouvoir with an infinitive** — example row 2
  - Text to record: _Vous pouvez ouvrir la fenêtre, s'il vous plaît ?_

---

## LO15 — Planning a Holiday

### Re-record (wrong content)

- `public/audio/lo15/exercises/03-select/012-cest-moi-qui-cuisine.mp3`
  - Section: **Exercises → 3. Adèle's holiday activities**, item 12
  - Current file starts mid-sentence. All other items in this exercise begin with _Quand je suis en vacances_.
  - Re-record as: _Quand je suis en vacances, c'est moi qui cuisine._

---

---

## File Tree — All Outstanding Recordings

Drop each completed file into the exact folder path shown. No code changes needed unless noted.

```
public/audio/
├── lo1/
│   └── pronunciation/
│       └── oi-sound/
│           └── 004-bonsoir.mp3                          ← NEW (or JSX fix)
├── lo6/
│   └── grammar/
│       └── 004-elles-ont.mp3                            ← RE-RECORD (liaison)
├── lo7/
│   └── vocabulary/
│       └── 007-basket-basketball.mp3                    ← RE-RECORD (basketball)
├── lo9/
│   ├── dialogues/02/
│   │   └── 004-oh-excusez-moi-au-revoir-madame.mp3     ← RE-RECORD (2 men)
│   └── exercises/02-select/
│       └── 004-oh-excusez-moi-au-revoir-madame.mp3     ← RE-RECORD (2 men)
├── lo10/
│   └── dialogues/02/
│       └── 004-oh-excusez-moi-au-revoir-madame.mp3     ← RE-RECORD (2 men)
├── lo11/
│   └── vocabulary/
│       └── 015-vous-voulez-quelque-chose-a-manger.mp3  ← RE-RECORD (intonation)
├── lo12/
│   ├── pronunciation/
│   │   ├── 005-rue.mp3                                  ← RE-RECORD (wrong vowel)
│   │   └── 016-ou.mp3                                   ← RE-RECORD (wrong vowel)
│   └── exercises/
│       └── 03-inline-choice/
│           ├── 041-bout.mp3                             ← NEW
│           └── 043-roue.mp3                             ← NEW
├── lo13/
│   └── exercises/01-select/
│       └── 025-tu-te-maquilles-aujourdhui.mp3           ← RE-RECORD (liaison error)
└── lo14/
    ├── dialogues/01/
    │   └── 001-qu-est-ce-que-tu-fais-comme-etudes.mp3  ← RE-RECORD (pron + speaker)
    └── grammar/pouvoir/
        └── 011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3  ← NEW
```

---

## Resolved

- **LO2 Grammar — Subject pronouns** `audio/lo2/grammar/grammar-and-usage/025-iel.mp3`
  - Was missing at runtime; file now exists.

- **LO5** `public/audio/lo5/exercises/03-select/003-mme-leserre-est-tres-curieuse.mp3` — added ✓

- **LO5** `public/audio/lo5/monologues/monologues1/003-country-house-monologue.mp3` — added ✓

- **LO6** `public/audio/lo6/exercises/double-ll-rhyme-la-famille-de-camille.mp3` — added ✓

- **LO6** `public/audio/lo6/exercises/double-ll-rhyme-annabelle-a-une-petite-fille.mp3` — added ✓

- **LO7 dialogue** `public/audio/lo7/dialogues/005-je-suis-tres-sportif-j-aime-beaucoup-le-rugby-et-le-foot-j-aime-aussi-le-squash-et-le-badminton.mp3` — added ✓

- **LO7 exercises** `public/audio/lo7/exercises/02-articles/011-vous-preferez-la-france-ou-la-suisse.mp3` — added ✓

- **LO7 poem** `public/audio/lo7/exercises/04-poem/sept-couleurs-magiques.mp3` — added ✓

- **LO7 grammar** `007-jouer-a-l.mp3` — audio clip removed from grammar component (code fix, no recording needed) ✓

- **LO8** `public/audio/lo8/dialogues/02/001-quest-ce-que-tu-fais-le-weekend.mp3` — added ✓

- **LO8** `public/audio/lo8/dialogues/03/003-je-joue-de-laccordeon-et-joue-du-piano-aussi.mp3` — added ✓

- **LO9 grammar** `public/audio/lo9/grammar/telephone-regions/007-mobile-06-07.mp3` — added ✓

- **LO10 dictation** `public/audio/lo10/exercises/04-dictation/009-d-accord-a-plus.mp3` — added ✓

- **LO12 dialogues** `006-oui-cest-pratique-et-le-jeudi-je-vais-au-grand-marche...mp3` — added ✓

- **LO12 dialogues** `007-tu-as-de-la-chance-si-nous-voulons-du-pain...mp3` — added ✓

- **LO12 grammar** `public/audio/lo12/grammar/033-je-nai-pas-de-fromage.mp3` — added ✓

- **LO13 reflexive verbs** `public/audio/lo13/exercises/01-select/017` through `028` (all except 025) — added ✓

- **LO14 pouvoir** `public/audio/lo14/grammar/pouvoir/010-je-peux-repondre-a-votre-question-tout-de-suite.mp3` — added ✓

- **LO15** `public/audio/lo15/exercises/03-select/009-quand-je-suis-en-vacances-mes-amis-et-moi-des-randonnees-ensemble.mp3` — added ✓

- **LO15** `public/audio/lo15/exercises/03-select/010-quand-je-suis-en-vacances-le-soir-mes-amis-ne-pas.mp3` — added ✓
