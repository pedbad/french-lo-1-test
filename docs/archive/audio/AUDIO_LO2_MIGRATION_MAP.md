# LO2 Audio Migration Map (Phase 1)

This file is the LO2 mapping + execution record, following the LO1 audio refactor pattern.
Phase 2 has now been executed for all existing refs (75 files copied + rewritten), and the initial missing-source blockers were resolved via fallback files.

## Scope

- Config source: `src/lo-config/about-me.json`
- Custom component sources:
  - `src/components/custom/grammar/about-me-grammar.jsx`
  - `src/components/custom/pronunciation/about-me-pronunciation.jsx`

## Summary

- Unique legacy audio references found: **78**
- Missing legacy source files initially found: **3** (now resolved via fallback)
- Proposed LO2 target root: `public/audio/lo2/...`

### Proposed target buckets (initial migration snapshot)

- `audio/lo2/exercises/dropdowns4/`: 4 files
- `audio/lo2/grammar/grammar-and-usage/`: 24 files
- `audio/lo2/misc/`: 3 files
- `audio/lo2/pronunciation/demystify/`: 22 files
- `audio/lo2/vocabulary/`: 25 files

## 2026-02-26 Realignment (post-migration drift fix)

To reduce naming drift and align folder names with LO2 section/component semantics:

- `audio/lo2/misc/...` -> `audio/lo2/monologues/monologues1/...`
- `audio/lo2/exercises/dropdowns4/...` -> `audio/lo2/exercises/selectExercise2/...`

Note:
- The detailed table below preserves the initial migration snapshot and therefore still references legacy bucket labels.

## Execution status (2026-02-18)

- Phase 2 complete for existing refs:
  - 75 files copied to `public/audio/lo2/...`
  - LO2 refs rewritten in:
    - `src/lo-config/about-me.json`
    - `src/components/custom/grammar/about-me-grammar.jsx`
    - `src/components/custom/pronunciation/about-me-pronunciation.jsx`
- Initial unresolved refs are listed in the blocker section below (now resolved).

## Blockers (Initial Missing Source Files, Now Resolved)

These refs are present in LO2 source but corresponding files are not found in `public/sounds/fr` (or decoded equivalent):

- `sounds/fr/Je m'appelle.mp3`
- `sounds/fr/Je m&apos;appelle.mp3`
- `sounds/fr/Salut.mp3`

Resolution applied:
- `sounds/fr/Salut.mp3` -> `audio/lo2/pronunciation/demystify/016-salut.mp3` (fallback seeded from `audio/lo1/vocabulary/004-salut.mp3`)
- `sounds/fr/Je m&apos;appelle.mp3` -> `audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3` (fallback seeded from `audio/lo1/vocabulary/022-je-mappelle.mp3`)
- `sounds/fr/Je m'appelle.mp3` -> `audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3` (same fallback)

## Detailed mapping (old -> new)

| Legacy ref | Proposed LO2 ref | Bucket(s) seen | Exists |
|---|---|---|---|
| `sounds/fr/monsieur-tondereau-est-journaliste-non-il-est-bibliothecaire.mp3` | `audio/lo2/exercises/dropdowns4/001-monsieur-tondereau-est-journaliste-non-il-est-bibliothecaire.mp3` | `exercises/dropdowns4` | yes |
| `sounds/fr/que-faites-vous-dans-la-vie-je-suis-professeur-de-geographie.mp3` | `audio/lo2/exercises/dropdowns4/002-que-faites-vous-dans-la-vie-je-suis-professeur-de-geographie.mp3` | `exercises/dropdowns4` | yes |
| `sounds/fr/salut-les-enfants-tout-va-bien-moi-oui-ca-va-mais-teri-est-malade-depuis-hier.mp3` | `audio/lo2/exercises/dropdowns4/003-salut-les-enfants-tout-va-bien-moi-oui-ca-va-mais-teri-est-malade-depuis-hier.mp3` | `exercises/dropdowns4` | yes |
| `sounds/fr/tu-es-archiviste-ah-non-je-suis-etudiante-en-histoire.mp3` | `audio/lo2/exercises/dropdowns4/004-tu-es-archiviste-ah-non-je-suis-etudiante-en-histoire.mp3` | `exercises/dropdowns4` | yes |
| `sounds/fr/elle est.mp3` | `audio/lo2/grammar/grammar-and-usage/001-elle-est.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/elles sont.mp3` | `audio/lo2/grammar/grammar-and-usage/002-elles-sont.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/il est.mp3` | `audio/lo2/grammar/grammar-and-usage/003-il-est.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/ils sont.mp3` | `audio/lo2/grammar/grammar-and-usage/004-ils-sont.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/je suis.mp3` | `audio/lo2/grammar/grammar-and-usage/005-je-suis.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/l'.mp3` | `audio/lo2/grammar/grammar-and-usage/006-l.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/l'appartement.mp3` | `audio/lo2/grammar/grammar-and-usage/007-l-appartement.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/l'école.mp3` | `audio/lo2/grammar/grammar-and-usage/008-l-ecole.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/l'homme.mp3` | `audio/lo2/grammar/grammar-and-usage/009-l-homme.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/la nuit.mp3` | `audio/lo2/grammar/grammar-and-usage/010-la-nuit.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/la professeure.mp3` | `audio/lo2/grammar/grammar-and-usage/011-la-professeure.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/la.mp3` | `audio/lo2/grammar/grammar-and-usage/012-la.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/le jour.mp3` | `audio/lo2/grammar/grammar-and-usage/013-le-jour.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/le professeur.mp3` | `audio/lo2/grammar/grammar-and-usage/014-le-professeur.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/le.mp3` | `audio/lo2/grammar/grammar-and-usage/015-le.mp3` | `grammar/grammar-and-usage`, `pronunciation/demystify` | yes |
| `sounds/fr/nous sommes.mp3` | `audio/lo2/grammar/grammar-and-usage/016-nous-sommes.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/tu es.mp3` | `audio/lo2/grammar/grammar-and-usage/017-tu-es.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/un homme.mp3` | `audio/lo2/grammar/grammar-and-usage/018-un-homme.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/un métier.mp3` | `audio/lo2/grammar/grammar-and-usage/019-un-metier.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/un.mp3` | `audio/lo2/grammar/grammar-and-usage/020-un.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/une femme.mp3` | `audio/lo2/grammar/grammar-and-usage/021-une-femme.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/une profession.mp3` | `audio/lo2/grammar/grammar-and-usage/022-une-profession.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/une.mp3` | `audio/lo2/grammar/grammar-and-usage/023-une.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/vous êtes.mp3` | `audio/lo2/grammar/grammar-and-usage/024-vous-etes.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/Bonjour ! Je m'appelle Jacqueline. Je suis divorcée. Je suis prof de maths.mp3` | `audio/lo2/misc/001-bonjour-je-m-appelle-jacqueline-je-suis-divorcee-je-suis-prof-de-maths.mp3` | `misc` | yes |
| `sounds/fr/Bonsoir ! Je m'appelle Olivier Durand. Je suis marié avec Alex depuis trois ans et je suis bibliothécaire.mp3` | `audio/lo2/misc/002-bonsoir-je-m-appelle-olivier-durand-je-suis-marie-avec-alex-depuis-trois-ans-et-je-suis-bibliothecaire.mp3` | `misc` | yes |
| `sounds/fr/Salut, je suis Sylvain. Je suis célibataire. Je suis étudiant en géographie.mp3` | `audio/lo2/misc/003-salut-je-suis-sylvain-je-suis-celibataire-je-suis-etudiant-en-geographie.mp3` | `misc` | yes |
| `sounds/fr/appelez.mp3` | `audio/lo2/pronunciation/demystify/001-appelez.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/ce.mp3` | `audio/lo2/pronunciation/demystify/002-ce.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/de.mp3` | `audio/lo2/pronunciation/demystify/003-de.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/gâteaux.mp3` | `audio/lo2/pronunciation/demystify/004-gateaux.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/grand.mp3` | `audio/lo2/pronunciation/demystify/005-grand.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/Je m'appelle.mp3` | `audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3` | `pronunciation/demystify` | yes (fallback) |
| `sounds/fr/Je m&apos;appelle.mp3` | `audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3` | `pronunciation/demystify` | yes (fallback) |
| `sounds/fr/je.mp3` | `audio/lo2/pronunciation/demystify/008-je.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/long.mp3` | `audio/lo2/pronunciation/demystify/009-long.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/maths.mp3` | `audio/lo2/pronunciation/demystify/010-maths.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/me.mp3` | `audio/lo2/pronunciation/demystify/011-me.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/ne.mp3` | `audio/lo2/pronunciation/demystify/012-ne.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/pas.mp3` | `audio/lo2/pronunciation/demystify/013-pas.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/petit.mp3` | `audio/lo2/pronunciation/demystify/014-petit.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/rond.mp3` | `audio/lo2/pronunciation/demystify/015-rond.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/Salut.mp3` | `audio/lo2/pronunciation/demystify/016-salut.mp3` | `pronunciation/demystify` | yes (fallback) |
| `sounds/fr/se.mp3` | `audio/lo2/pronunciation/demystify/017-se.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/te.mp3` | `audio/lo2/pronunciation/demystify/018-te.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/thé.mp3` | `audio/lo2/pronunciation/demystify/019-the.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/théologie.mp3` | `audio/lo2/pronunciation/demystify/020-theologie.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/Thomas.mp3` | `audio/lo2/pronunciation/demystify/021-thomas.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/trop.mp3` | `audio/lo2/pronunciation/demystify/022-trop.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/administrateur, administratrice.mp3` | `audio/lo2/vocabulary/001-administrateur-administratrice.mp3` | `vocabulary` | yes |
| `sounds/fr/archiviste.mp3` | `audio/lo2/vocabulary/002-archiviste.mp3` | `vocabulary` | yes |
| `sounds/fr/avocat, avocate.mp3` | `audio/lo2/vocabulary/003-avocat-avocate.mp3` | `vocabulary` | yes |
| `sounds/fr/bibliothécaire.mp3` | `audio/lo2/vocabulary/004-bibliothecaire.mp3` | `pronunciation/demystify`, `vocabulary` | yes |
| `sounds/fr/célibataire.mp3` | `audio/lo2/vocabulary/005-celibataire.mp3` | `pronunciation/demystify`, `vocabulary` | yes |
| `sounds/fr/chercheur, chercheuse.mp3` | `audio/lo2/vocabulary/006-chercheur-chercheuse.mp3` | `vocabulary` | yes |
| `sounds/fr/depuis.mp3` | `audio/lo2/vocabulary/007-depuis.mp3` | `pronunciation/demystify`, `vocabulary` | yes |
| `sounds/fr/divorcé.mp3` | `audio/lo2/vocabulary/008-divorce.mp3` | `vocabulary` | yes |
| `sounds/fr/doctorant, doctorante.mp3` | `audio/lo2/vocabulary/009-doctorant-doctorante.mp3` | `vocabulary` | yes |
| `sounds/fr/élève.mp3` | `audio/lo2/vocabulary/010-eleve.mp3` | `vocabulary` | yes |
| `sounds/fr/être.mp3` | `audio/lo2/vocabulary/011-etre.mp3` | `grammar/grammar-and-usage`, `vocabulary` | yes |
| `sounds/fr/étudiant, étudiante.mp3` | `audio/lo2/vocabulary/012-etudiant-etudiante.mp3` | `vocabulary` | yes |
| `sounds/fr/fiancé.mp3` | `audio/lo2/vocabulary/013-fiance.mp3` | `vocabulary` | yes |
| `sounds/fr/hier.mp3` | `audio/lo2/vocabulary/014-hier.mp3` | `vocabulary` | yes |
| `sounds/fr/informaticien, informaticienne.mp3` | `audio/lo2/vocabulary/015-informaticien-informaticienne.mp3` | `vocabulary` | yes |
| `sounds/fr/malade.mp3` | `audio/lo2/vocabulary/016-malade.mp3` | `vocabulary` | yes |
| `sounds/fr/marié.mp3` | `audio/lo2/vocabulary/017-marie.mp3` | `vocabulary` | yes |
| `sounds/fr/médecin.mp3` | `audio/lo2/vocabulary/018-medecin.mp3` | `vocabulary` | yes |
| `sounds/fr/pacsé.mp3` | `audio/lo2/vocabulary/019-pacse.mp3` | `vocabulary` | yes |
| `sounds/fr/professeur, professeure, prof.mp3` | `audio/lo2/vocabulary/020-professeur-professeure-prof.mp3` | `vocabulary` | yes |
| `sounds/fr/Que fais-tu (dans la vie).mp3` | `audio/lo2/vocabulary/021-que-fais-tu-dans-la-vie.mp3` | `vocabulary` | yes |
| `sounds/fr/Que faites-vous (dans la vie).mp3` | `audio/lo2/vocabulary/022-que-faites-vous-dans-la-vie.mp3` | `vocabulary` | yes |
| `sounds/fr/Quel est ton métier Quel est votre métier.mp3` | `audio/lo2/vocabulary/023-quel-est-ton-metier-quel-est-votre-metier.mp3` | `vocabulary` | yes |
| `sounds/fr/Quelle est ta profession Quelle est votre profession.mp3` | `audio/lo2/vocabulary/024-quelle-est-ta-profession-quelle-est-votre-profession.mp3` | `vocabulary` | yes |
| `sounds/fr/séparé.mp3` | `audio/lo2/vocabulary/025-separe.mp3` | `vocabulary` | yes |

## Notes

- Naming uses ASCII-safe slugified filenames and 3-digit stable prefixes (`001-...`).
- Shared clips used in multiple LO2 contexts are assigned a single canonical LO2 target path in this phase.
- Blockers were resolved with controlled fallbacks; no LO2 blocker refs remain.

Generated: 2026-02-18
