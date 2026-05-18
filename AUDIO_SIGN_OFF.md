# Audio Sign-Off

Single reference for all outstanding audio work — missing files, wrong-content re-records, and teacher review requests. Used by both the development team (to track runtime gaps) and the media editor (to know what to record or replace).

## Status labels

- `Missing` — file is already wired in code but does not exist on disk; the app silently produces no audio until this is resolved
- `Re-record (wrong content)` — file exists but audio does not match the displayed text
- `Re-record (wrong speaker)` — file exists but the wrong voice was used
- `New recording` — file does not exist; needs to be recorded from scratch
- `Done` — resolved; move entry to the Resolved section at the bottom

---

## LO5 — House and Home

### Re-record (wrong content / quality)

- `public/audio/lo5/monologues/monologues1/003-country-house-monologue.mp3`
  - Section: **Dialogues → Monologue 1**
  - The spoken adjectives may sound like masculine `grand` instead of feminine `grande` in `une grande maison` and `une grande cuisine`.

- `public/audio/lo5/exercises/selectExercise2/003-mme-leserre-est-tres-curieuse.mp3`
  - Section: **Exercises → Exercise 2**
  - In `Leserre`, the `s` sounds like `z` and should sound like `s`.

---

## LO6 — Family, Friends and Neighbours

### Re-record (wrong content / quality)

- `public/audio/lo6/grammar/elles-ont.mp3`
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

- `public/audio/lo7/vocabulary/basket-basketball.mp3`
  - Section: **Vocabulary**
  - `basket` is fine, but `basketball` sounds wrong; the first `a` is not pronounced correctly.

- `public/audio/lo7/exercises/articles/vous-preferez-la-france-ou-la-suisse.mp3`
  - Section: **Exercises — articles**
  - The intonation is not right for a question where the speaker is choosing between two options.

- `public/audio/lo7/exercises/listening/lo7-dialogue-1.mp3`
  - Section: **Exercises — listening**
  - The speaker says `sportive`; it should be `sportif`. The final `t` in `cricket` is also missing.

### New recording

- `public/audio/lo7/exercises/poem/sept-couleurs-magiques.mp3`
  - Section: **Exercises — poem**
  - Full poem audio for `Sept Couleurs Magiques`.

---

## LO8 — Free Time

### Re-record (wrong content / quality)

- `public/audio/lo8/dialogues/dialogues2/001-quest-ce-que-tu-fais-le-weekend.mp3`
  - Section: **Dialogues 2**
  - The final `d` in `week-end` is not clear enough.

- `public/audio/lo8/dialogues/dialogues3/003-je-joue-de-laccordeon-et-joue-du-piano-aussi.mp3`
  - Section: **Dialogues 3**
  - Audio should match the corrected displayed text: `Je joue de l'accordeon et je joue du piano aussi.`

- ~~`public/audio/lo8/grammar/jouer-patterns/007-jouer-a-l.mp3`~~
  - **Resolved (2026-05-18)** — audio clip removed from the grammar component. *jouer à l'* now displays as plain text with no audio link, as the form is unnatural in isolation. No re-record needed.

---

## LO9 — Phoning in France

### Re-record (wrong speaker — use male voice)

- `public/audio/lo9/dialogues/phraseTable2/004-oh-excusez-moi-au-revoir-madame.mp3`
  - Section: **Dialogues → A wrong number**, row 4
  - Text: `Oh ! Excusez-moi ! Au revoir Madame !`
  - Currently female speaker. Should be male (the caller who dialled the wrong number).

- `public/audio/lo9/exercises/selectExercise1/004-oh-excusez-moi-au-revoir-madame.mp3`
  - Section: **Exercises → 2. Talking on the phone**, dialogue 1, row 4
  - Text: `Oh ! Excusez-moi ! Au revoir Madame !`
  - Currently female speaker. Should be male. Note: the same clip is reused for both dialogues in this exercise — separate recordings may be needed if the two instances must sound distinct.

### Missing (wired in code, file not yet recorded)

- `public/audio/lo9/grammar/telephone-regions/007-mobile-06-07.mp3`
  - Section: **Grammar and Usage → 1. Telephone numbers in France** (map legend, `06 / 07 Mobile (nationwide)` entry)
  - Content to record: *zéro six, zéro sept*
  - The legend button is already wired and will activate as soon as this file exists.

---

## LO10 — Making Arrangements

### Re-record (wrong speaker — use male voice)

- `public/audio/lo10/dialogues/phraseTable2/004-oh-excusez-moi-au-revoir-madame.mp3`
  - Section: **Dialogues → A wrong number**, row 4
  - Text: `Oh ! Excusez-moi ! Au revoir Madame !`
  - Currently female speaker. Should be male (the caller who dialled the wrong number).

### Re-record (wrong content)

- `public/audio/lo10/exercises/dictationExercise4/009-d-accord-a-plus.mp3`
  - Section: **Exercises → 4. Type what you hear**, last line
  - Displayed text: `D'accord. À plus`
  - Current audio says: *À plus tard. À plus* — does not match.
  - Should say: *D'accord. À plus*

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

- `public/audio/lo12/dialogues/006-oui-cest-pratique-et-le-jeudi-je-vais-au-grand-marche-au-centre-ville-jachete-so.mp3`
  - Section: **Dialogues → Talking about where you shop**, penultimate utterance
  - Text: `Oui, c'est pratique. Et le jeudi, je vais au grand marché au centre-ville. J'achète souvent du fromage et du jambon là-bas. Il y a beaucoup de choix. Et il y a un très bon fleuriste aussi.`
  - The word *un* sounds absent before *très bon fleuriste*. Re-record with *un* clearly audible.

- `public/audio/lo12/pronunciation/016-ou.mp3`
  - Section: **Pronunciation Focus** (heading audio for *ou*)
  - Currently sounds like *oh*; should sound like *ooh* (the French *ou* vowel). Re-record.

### Re-record (optional / low priority)

- `public/audio/lo12/dialogues/007-tu-as-de-la-chance-si-nous-voulons-du-pain-marc-va-a-la-boulangerie-au-bout-de-l.mp3`
  - Section: **Dialogues → Talking about where you shop**, last utterance
  - Text: `Tu as de la chance ! Si nous voulons du pain, Marc va à la boulangerie au bout de la rue...`
  - Teacher requests a very brief pause between *Si nous voulons du pain,* and *Marc*. Low priority.

### New recording

- `public/audio/lo12/grammar/033-je-nai-pas-de-fromage.mp3`
  - Section: **Grammar → 2. Partitives — negation table**, first row
  - Text to record: *Je n'ai pas de fromage.*
  - This replaces the existing `du fromage / some cheese` positive example, which is being changed to a negative example to match the negation table context.

- `public/audio/lo12/exercises/041-bout.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - Question word for the *bu / bout* listening pair. Record: *bout*
  - Exercise plays this clip; student selects between written options *bu* and *bout*.

- `public/audio/lo12/exercises/043-roue.mp3`
  - Section: **Exercises — 5. Which word do you hear?**
  - Question word for the *rue / roue* listening pair. Record: *roue*
  - Exercise plays this clip; student selects between written options *rue* and *roue*.

---

## LO13 — Daily Routine

### New recording

- `public/audio/lo13/exercises/016-reflexive-verbs-full-audio.mp3`
  - Section: **Exercises → 1. Practise the reflexive verbs** (full playlist clip)
  - Record the 12 completed sentences in the same order as files `017` to `028` below.

- `public/audio/lo13/exercises/017-je-me-reveille-a-huit-heures.mp3`
  - `Je me réveille à huit heures.`

- `public/audio/lo13/exercises/018-je-mhabille-avant-de-prendre-mon-petit-dejeuner.mp3`
  - `Je m'habille avant de prendre mon petit déjeuner.`

- `public/audio/lo13/exercises/019-adele-se-leve-vers-dix-heures.mp3`
  - `Adèle se lève vers dix heures.`

- `public/audio/lo13/exercises/020-vous-vous-levez-a-quelle-heure.mp3`
  - `Vous vous levez à quelle heure ?`

- `public/audio/lo13/exercises/021-nous-nous-reposons-pendant-le-week-end.mp3`
  - `Nous nous reposons pendant le week-end.`

- `public/audio/lo13/exercises/022-je-me-detends-pendant-les-vacances.mp3`
  - `Je me détends pendant les vacances.`

- `public/audio/lo13/exercises/023-les-enfants-se-couchent-vers-neuf-heures.mp3`
  - `Les enfants se couchent vers neuf heures.`

- `public/audio/lo13/exercises/024-patrick-se-couche-a-minuit.mp3`
  - `Patrick se couche à minuit.`

- `public/audio/lo13/exercises/025-tu-te-maquilles-aujourdhui.mp3`
  - `Tu te maquilles aujourd'hui ?`

- `public/audio/lo13/exercises/026-tu-tappelles-comment.mp3`
  - `Tu t'appelles comment ?`

- `public/audio/lo13/exercises/027-et-ta-soeur-elle-sappelle-comment.mp3`
  - `Et ta sœur, elle s'appelle comment ?`

- `public/audio/lo13/exercises/028-la-tour-eiffel-se-trouve-a-paris.mp3`
  - `La Tour Eiffel se trouve à Paris.`

### Investigate (resolved — no action needed)

- `public/audio/lo13/exercises/015-a-summers-day.mp3`
  - Section: **Exercises → 4. A summer's day**
  - Teacher initially reported no audio. File confirmed on disk (220 KB) and verified playing correctly. Likely a one-off playback glitch on teacher's device. No action needed.

---

## Resolved

- **LO2 Grammar — Subject pronouns** `audio/lo2/grammar/grammar-and-usage/025-iel.mp3`
  - Was missing at runtime; file now exists at `public/audio/lo2/grammar/grammar-and-usage/025-iel.mp3`.
