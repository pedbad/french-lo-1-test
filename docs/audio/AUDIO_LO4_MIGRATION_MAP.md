# LO4 Audio Migration Map

## Scope
- `src/lo-config/current-location.json`
- `src/components/custom/pronunciation/current-location-pronunciation.jsx`
- `src/components/exercises/current-location/nasal-rhyme-exercise.jsx`

## Summary
- Unique legacy refs: **61**
- Rewritten refs: **62**
- Missing source files during migration: **0**
- New root: `audio/lo4/...`

## Legacy Cleanup Result
- Deleted LO4 legacy source files from `public/sounds/fr` only when no remaining `src` reference existed.
- Deleted files: **59**
- Retained legacy files (still referenced outside LO4):
  - `sounds/fr/aimer.mp3`
  - `sounds/fr/jardin.mp3`
  - `sounds/fr/peinture.mp3`

## Detailed mapping (old -> new)

| Legacy ref | New ref |
|---|---|
| `/sounds/fr/Où habites-tu.mp3` | `/audio/lo4/dialogues/phraseTable1/001-o-u-habites-tuo-habites-tu.mp3` |
| `/sounds/fr/J'habite en Belgique.mp3` | `/audio/lo4/dialogues/phraseTable1/002-j-habite-en-belgique.mp3` |
| `/sounds/fr/Où exactement.mp3` | `/audio/lo4/dialogues/phraseTable1/003-o-u-exactemento-exactement.mp3` |
| `/sounds/fr/A Bruxelles Et toi.mp3` | `/audio/lo4/dialogues/phraseTable1/004-a-bruxelles-et-toi.mp3` |
| `/sounds/fr/J'habite à Cardiff au Pays de Galles.mp3` | `/audio/lo4/dialogues/phraseTable1/005-j-habite-a-cardiff-au-pays-de-gallesj-habite-cardiff-au-pays-de-galles.mp3` |
| `/sounds/fr/Où habitez-vous.mp3` | `/audio/lo4/dialogues/phraseTable1/006-o-u-habitez-vouso-habitez-vous.mp3` |
| `/sounds/fr/J'habite aux Etats Unis.mp3` | `/audio/lo4/dialogues/phraseTable1/007-j-habite-aux-etats-unis.mp3` |
| `/sounds/fr/Et moi, j'habite au Maroc.mp3` | `/audio/lo4/dialogues/phraseTable1/008-et-moi-j-habite-au-maroc.mp3` |
| `/sounds/fr/Où se trouve la cathédrale de Notre Dame.mp3` | `/audio/lo4/dialogues/phraseTable1/009-o-u-se-trouve-la-cath-edrale-de-notre-dameo-se-trouve-la-cath-drale-de-notre-dame.mp3` |
| `/sounds/fr/La cathédrale de Notre Dame se trouve à Paris.mp3` | `/audio/lo4/dialogues/phraseTable1/010-la-cath-edrale-de-notre-dame-se-trouve-a-parisla-cath-drale-de-notre-dame-se-trouve-paris.mp3` |
| `/sounds/fr/Tu habites au centre-ville.mp3` | `/audio/lo4/dialogues/phraseTable1/011-tu-habites-au-centre-ville.mp3` |
| `/sounds/fr/Non, j'habite dans un petit village à une heure d'ici.mp3` | `/audio/lo4/dialogues/phraseTable1/012-non-j-habite-dans-un-petit-village-a-une-heure-d-icinon-j-habite-dans-un-petit-village-une-heure-d-ici.mp3` |
| `/sounds/fr/habiter.mp3` | `/audio/lo4/vocabulary/vocabulary/001-habiter.mp3` |
| `/sounds/fr/où.mp3` | `/audio/lo4/vocabulary/vocabulary/002-o-uo.mp3` |
| `/sounds/fr/Où habites-tu Tu habites où.mp3` | `/audio/lo4/vocabulary/vocabulary/003-o-u-habites-tu-tu-habites-o-uo-habites-tu-tu-habites-o.mp3` |
| `/sounds/fr/Où habitez-vous Vous habitez où.mp3` | `/audio/lo4/vocabulary/vocabulary/004-o-u-habitez-vous-vous-habitez-o-uo-habitez-vous-vous-habitez-o.mp3` |
| `/sounds/fr/Où se trouve Lille Lille se trouve en France.mp3` | `/audio/lo4/vocabulary/vocabulary/005-o-u-se-trouve-lille-lille-se-trouve-en-franceo-se-trouve-lille-lille-se-trouve-en-france.mp3` |
| `/sounds/fr/Où es-tu né Où êtes-vous née.mp3` | `/audio/lo4/vocabulary/vocabulary/006-o-u-es-tu-n-e-uo-e-tes-vous-n-eeo-es-tu-n-o-tes-vous-n-e.mp3` |
| `/sounds/fr/Je suis née.mp3` | `/audio/lo4/vocabulary/vocabulary/007-je-suis-n-eeje-suis-n-e.mp3` |
| `/sounds/fr/au bord de la mer.mp3` | `/audio/lo4/vocabulary/vocabulary/008-au-bord-de-la-mer.mp3` |
| `/sounds/fr/à la campagne.mp3` | `/audio/lo4/vocabulary/vocabulary/009-a-la-campagne-la-campagne.mp3` |
| `/sounds/fr/à la montagne.mp3` | `/audio/lo4/vocabulary/vocabulary/010-a-la-montagne-la-montagne.mp3` |
| `/sounds/fr/au centre-ville.mp3` | `/audio/lo4/vocabulary/vocabulary/011-au-centre-ville.mp3` |
| `/sounds/fr/en banlieue.mp3` | `/audio/lo4/vocabulary/vocabulary/012-en-banlieue.mp3` |
| `/sounds/fr/dans un petit village dans un grand village.mp3` | `/audio/lo4/vocabulary/vocabulary/013-dans-un-petit-village-dans-un-grand-village.mp3` |
| `/sounds/fr/Dans une petite ville. Dans une grande ville.mp3` | `/audio/lo4/vocabulary/vocabulary/014-dans-une-petite-ville-dans-une-grande-ville.mp3` |
| `/sounds/fr/C'est près d'ici.mp3` | `/audio/lo4/vocabulary/vocabulary/015-c-est-pr-es-d-icic-est-pr-s-d-ici.mp3` |
| `/sounds/fr/C'est très loin d'ici.mp3` | `/audio/lo4/vocabulary/vocabulary/016-c-est-tr-es-loin-d-icic-est-tr-s-loin-d-ici.mp3` |
| `/sounds/fr/C'est à 15 minutes d'ici.mp3` | `/audio/lo4/vocabulary/vocabulary/017-c-est-a-15-minutes-d-icic-est-15-minutes-d-ici.mp3` |
| `/sounds/fr/C'est près de Cambridge.mp3` | `/audio/lo4/vocabulary/vocabulary/018-c-est-pr-es-de-cambridgec-est-pr-s-de-cambridge.mp3` |
| `/sounds/fr/C'est à 20 kilomètres de Paris.mp3` | `/audio/lo4/vocabulary/vocabulary/019-c-est-a-20-kilom-etres-de-parisc-est-20-kilom-tres-de-paris.mp3` |
| `/sounds/fr/dans une maison.mp3` | `/audio/lo4/vocabulary/vocabulary/020-dans-une-maison.mp3` |
| `/sounds/fr/dans un immeuble.mp3` | `/audio/lo4/vocabulary/vocabulary/021-dans-un-immeuble.mp3` |
| `/sounds/fr/dans un appartement.mp3` | `/audio/lo4/vocabulary/vocabulary/022-dans-un-appartement.mp3` |
| `/sounds/fr/en résidence universitaire.mp3` | `/audio/lo4/vocabulary/vocabulary/023-en-r-esidence-universitaireen-r-sidence-universitaire.mp3` |
| `/sounds/fr/en colocation.mp3` | `/audio/lo4/vocabulary/vocabulary/024-en-colocation.mp3` |
| `/sounds/fr/seule.mp3` | `/audio/lo4/vocabulary/vocabulary/025-seule.mp3` |
| `/sounds/fr/aimer.mp3` | `/audio/lo4/vocabulary/vocabulary/026-aimer.mp3` |
| `sounds/fr/ain.mp3` | `/audio/lo4/pronunciation/demystify/001-ain.mp3` |
| `sounds/fr/Singapour.mp3` | `/audio/lo4/pronunciation/demystify/002-singapour.mp3` |
| `sounds/fr/Inde.mp3` | `/audio/lo4/pronunciation/demystify/003-inde.mp3` |
| `sounds/fr/indien.mp3` | `/audio/lo4/pronunciation/demystify/004-indien.mp3` |
| `sounds/fr/Finlande.mp3` | `/audio/lo4/pronunciation/demystify/005-finlande.mp3` |
| `sounds/fr/jardin.mp3` | `/audio/lo4/pronunciation/demystify/006-jardin.mp3` |
| `sounds/fr/marocain.mp3` | `/audio/lo4/pronunciation/demystify/007-marocain.mp3` |
| `sounds/fr/faim.mp3` | `/audio/lo4/pronunciation/demystify/008-faim.mp3` |
| `sounds/fr/peinture.mp3` | `/audio/lo4/pronunciation/demystify/009-peinture.mp3` |
| `sounds/fr/impossible.mp3` | `/audio/lo4/pronunciation/demystify/010-impossible.mp3` |
| `sounds/fr/symbole.mp3` | `/audio/lo4/pronunciation/demystify/011-symbole.mp3` |
| `sounds/fr/lynx.mp3` | `/audio/lo4/pronunciation/demystify/012-lynx.mp3` |
| `sounds/fr/Reims.mp3` | `/audio/lo4/pronunciation/demystify/013-reims.mp3` |
| `sounds/fr/australien.mp3` | `/audio/lo4/pronunciation/demystify/014-australien.mp3` |
| `sounds/fr/européen.mp3` | `/audio/lo4/pronunciation/demystify/015-europ-eeneurop-en.mp3` |
| `sounds/fr/ghanéens.mp3` | `/audio/lo4/pronunciation/demystify/016-ghan-eensghan-ens.mp3` |
| `sounds/fr/indiens.mp3` | `/audio/lo4/pronunciation/demystify/017-indiens.mp3` |
| `sounds/fr/nonsense-rhyme.mp3` | `/audio/lo4/exercises/lo4exercise1/001-nonsense-rhyme.mp3` |
| `sounds/fr/Tu habites à la campagne.mp3` | `/audio/lo4/exercises/dropdowns4/001-tu-habites-a-la-campagnetu-habites-la-campagne.mp3` |
| `sounds/fr/Non, j'habite dans une grande ville.mp3` | `/audio/lo4/exercises/dropdowns4/002-non-j-habite-dans-une-grande-ville.mp3` |
| `sounds/fr/Nous habitons à deux minutes de l'université.mp3` | `/audio/lo4/exercises/dropdowns4/003-nous-habitons-a-deux-minutes-de-l-universit-enous-habitons-deux-minutes-de-l-universit.mp3` |
| `sounds/fr/Nous habitons dans un petit immeuble.mp3` | `/audio/lo4/exercises/dropdowns4/004-nous-habitons-dans-un-petit-immeuble.mp3` |
| `sounds/fr/L'immeuble se trouve en banlieue.mp3` | `/audio/lo4/exercises/dropdowns4/005-l-immeuble-se-trouve-en-banlieue.mp3` |
| `/sounds/fr/ain.mp3` | `/audio/lo4/pronunciation/demystify/001-ain.mp3` |

Generated: 2026-03-02
