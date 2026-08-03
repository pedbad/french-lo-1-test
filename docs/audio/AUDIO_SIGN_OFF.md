# Audio Sign-Off

Single reference for all outstanding audio work — missing files, wrong-content re-records, and teacher review requests. Used by both the development team (to track runtime gaps) and the media editor (to know what to record or replace).

## Status labels

- `Missing` — file is already wired in code but does not exist on disk; the app silently produces no audio until this is resolved
- `Re-record (wrong content)` — file exists but audio does not match the displayed text or has a pronunciation error
- `Re-record (wrong speaker)` — file exists but the wrong voice was used
- `New recording` — file does not exist; needs to be recorded from scratch
- `Done` — resolved; move entry to the Resolved section at the bottom

---

_All outstanding audio items are resolved — active list is empty. See **Resolved** below._

---

## Resolved

- **LO13 Exercises — reflexive verbs** `public/audio/lo13/exercises/01-select/025-tu-te-maquilles-aujourdhui.mp3` — re-recorded (silent final s of *maquilles*), replaced & tested at `/daily-routine/#exercises` ✓

- **LO14 Dialogues — talking about studies** `public/audio/lo14/dialogues/01/001-qu-est-ce-que-tu-fais-comme-etudes.mp3` — re-recorded (female, natural *kess kuh*), replaced & tested at `/studying-at-university/` ✓

- **LO14 Grammar — pouvoir** `public/audio/lo14/grammar/pouvoir/011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3` — new recording added, tested at `/studying-at-university/` ✓

- **LO15 Exercises — Adèle item 12** `public/audio/lo15/exercises/03-select/012-cest-moi-qui-cuisine.mp3` — re-recorded to open with *"Quand je suis en vacances,…"*, replaced & tested at `/planning-a-holiday/#exercises` ✓

- **LO15 Exercises — Adèle items 9 & 10** `009-…randonnees-ensemble.mp3`, `010-…le-soir-mes-amis-ne-pas.mp3` — no change; Excel sign-off confirms teacher + editor accept existing website audio ✓

- **LO1 Pronunciation — the "oi" sound** `public/audio/lo1/pronunciation/oi-sound/004-bonsoir.mp3` — new recording added, plays at `/first-contact/#pronunciation`, no 404 ✓

- **LO6 Grammar and Usage** `public/audio/lo6/grammar/004-elles-ont.mp3` — re-recorded with natural liaison, replaced & tested at `/family-friends/#LO6-grammar2-Accordion` ✓

- **LO7 Exercises — Fill in the gaps** `public/audio/lo7/exercises/03-listening/001-lo7-dialogue-1.mp3` — re-recorded (sportif + cricket final t), replaced & tested at `/opinions-matter/#LO7-draggableFillGaps1-Accordion` ✓

- **LO7 Vocabulary** `public/audio/lo7/vocabulary/007-basket-basketball.mp3` — re-recorded, replaced & tested at `/opinions-matter/#vocabulary` ✓

- **LO9 dialogues + exercises** `public/audio/lo9/dialogues/02/004-oh-excusez-moi-au-revoir-madame.mp3` and `public/audio/lo9/exercises/02-select/004-oh-excusez-moi-au-revoir-madame.mp3` — no change; teacher confirmed existing website audio is fine ✓

- **LO10 Dialogues (02)** `public/audio/lo10/dialogues/02/004-oh-excusez-moi-au-revoir-madame.mp3` — replaced with voice-matched take; `002-bonjour-madame-c-est-bien-le-01-23-08-09-15.mp3` also refreshed. Tested at `/making-arrangements/` ✓

- **LO11 Vocabulary** `public/audio/lo11/vocabulary/015-vous-voulez-quelque-chose-a-manger.mp3` — no change; Richard + teacher confirmed existing question intonation is fine ✓

- **LO12 Pronunciation — "ou"** `public/audio/lo12/pronunciation/016-ou.mp3` — no change; Richard + teacher confirmed existing audio correct ✓

- **LO12 Exercise 5 — Which word do you hear** `041-bout` + `043-roue` added, and the whole LO12 `exercises/` tree refactored to the app-wide per-exercise convention: `01-select` / `02-select` / `03-select` / `04-dictation` / `05-inline-choice`, each self-contained, files renumbered `001…` (`git mv`, history preserved). Ex5 now plays `05-inline-choice/001-roue` (roue) … `008-bout` (bout). `005-rue` closed as orphan (never wired; page uses minimal pairs tu/pur/nu). All 30 config paths rewritten & verified on disk; unicode NFC clean ✓

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

