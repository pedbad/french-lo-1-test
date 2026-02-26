# LO3 Audio Migration Map

## Scope
- `src/learningObjectConfigurations/fr/3.json`
- `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO3Grammar`, `LO3Demystify`)

## Summary
- Unique legacy refs: **140**
- Copied successfully: **140**
- Missing source files: **0**
- New root: `public/audio/lo3/...`

## 2026-02-26 Exercise Folder Realignment (post-migration)

The original LO3 exercise bucket names (`dropdowns*`, `AnswerTable*`) were legacy names.
They have now been realigned to match active semantic components and sequential file naming.

- `audio/lo3/exercises/dropdowns2/...` -> `audio/lo3/exercises/inlineChoiceGroup1/001-...`
- `audio/lo3/exercises/dropdowns1/...` -> `audio/lo3/exercises/inlineChoiceGroup2/001-...`
- `audio/lo3/exercises/AnswerTable1/...` (adjectives) -> `audio/lo3/exercises/typedTransformExercise3/001-...`
- `audio/lo3/exercises/AnswerTable1/...` (professions) -> `audio/lo3/exercises/typedTransformExercise4/001-...`
- `audio/lo3/exercises/AnswerTable2/...` -> `audio/lo3/exercises/dictationExercise5/001-...`

Legacy exercise folders removed:
- `public/audio/lo3/exercises/dropdowns1`
- `public/audio/lo3/exercises/dropdowns2`
- `public/audio/lo3/exercises/AnswerTable1`
- `public/audio/lo3/exercises/AnswerTable2`

Note:
- In the detailed historical table below, `Buckets seen` reflects the original migration snapshot and may still use legacy bucket labels.

## Detailed mapping (old -> new)

| Legacy ref | New ref | Buckets seen | Copied |
|---|---|---|---|
| `sounds/fr/australien.mp3` | `audio/lo3/grammar/grammar-and-usage/001-australien.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/australienne.mp3` | `audio/lo3/grammar/grammar-and-usage/002-australienne.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/célibataire.mp3` | `audio/lo3/grammar/grammar-and-usage/003-celibataire.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/chanter.mp3` | `audio/lo3/grammar/grammar-and-usage/004-chanter.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/chinois.mp3` | `audio/lo3/grammar/grammar-and-usage/005-chinois.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/chinoise.mp3` | `audio/lo3/grammar/grammar-and-usage/006-chinoise.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/danser.mp3` | `audio/lo3/grammar/grammar-and-usage/007-danser.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/écouter.mp3` | `audio/lo3/pronunciation/demystify/008-ecouter.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/elle est mariée.mp3` | `audio/lo3/pronunciation/demystify/009-elle-est-mariee.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/elle parle.mp3` | `audio/lo3/grammar/grammar-and-usage/010-elle-parle.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/elle vient.mp3` | `audio/lo3/grammar/grammar-and-usage/011-elle-vient.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/elles chantent.mp3` | `audio/lo3/pronunciation/demystify/012-elles-chantent.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/elles parlent.mp3` | `audio/lo3/grammar/grammar-and-usage/013-elles-parlent.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/elles sont fatiguées.mp3` | `audio/lo3/pronunciation/demystify/014-elles-sont-fatiguees.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/elles viennent.mp3` | `audio/lo3/grammar/grammar-and-usage/015-elles-viennent.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/et.mp3` | `audio/lo3/pronunciation/demystify/016-et.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/étudiant.mp3` | `audio/lo3/grammar/grammar-and-usage/017-etudiant.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/étudiante.mp3` | `audio/lo3/grammar/grammar-and-usage/018-etudiante.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/habiter.mp3` | `audio/lo3/grammar/grammar-and-usage/019-habiter.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/il est américain.mp3` | `audio/lo3/pronunciation/demystify/020-il-est-americain.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/il est anglais.mp3` | `audio/lo3/pronunciation/demystify/021-il-est-anglais.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/il est français.mp3` | `audio/lo3/pronunciation/demystify/022-il-est-francais.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/il parle.mp3` | `audio/lo3/grammar/grammar-and-usage/023-il-parle.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/il vient.mp3` | `audio/lo3/grammar/grammar-and-usage/024-il-vient.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/ils dansent.mp3` | `audio/lo3/pronunciation/demystify/025-ils-dansent.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/ils parlent.mp3` | `audio/lo3/shared/026-ils-parlent.mp3` | `grammar/grammar-and-usage, pronunciation/demystify` | yes |
| `sounds/fr/ils viennent.mp3` | `audio/lo3/grammar/grammar-and-usage/027-ils-viennent.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/informaticien.mp3` | `audio/lo3/grammar/grammar-and-usage/028-informaticien.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/informaticienne.mp3` | `audio/lo3/grammar/grammar-and-usage/029-informaticienne.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/je parle.mp3` | `audio/lo3/grammar/grammar-and-usage/030-je-parle.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/je suis canadien.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/003-je-suis-canadien.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/je suis chinois.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/005-je-suis-chinois.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/je suis française.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/004-je-suis-francaise.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/je suis ghanéenne.mp3` | `audio/lo3/pronunciation/demystify/034-je-suis-ghaneenne.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/je suis marocaine.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/001-je-suis-marocaine.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/je suis mexicaine.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/002-je-suis-mexicaine.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/je suis sénégalaise.mp3` | `audio/lo3/exercises/inlineChoiceGroup1/006-je-suis-senegalaise.mp3` | `exercises/dropdowns2` | yes |
| `sounds/fr/Je viens d'Ecosse.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/006-je-viens-d-ecosse.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens d'Orléans.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/003-je-viens-d-orleans.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens de France.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/001-je-viens-de-france.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens de Suisse.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/002-je-viens-de-suisse.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens de Tunisie.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/005-je-viens-de-tunisie.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens Des États-Unis.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/008-je-viens-des-etats-unis.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens du Gabon.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/007-je-viens-du-gabon.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/Je viens du Maroc.mp3` | `audio/lo3/exercises/inlineChoiceGroup2/004-je-viens-du-maroc.mp3` | `exercises/dropdowns1` | yes |
| `sounds/fr/je viens.mp3` | `audio/lo3/grammar/grammar-and-usage/046-je-viens.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/journaliste.mp3` | `audio/lo3/grammar/grammar-and-usage/047-journaliste.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/les étudiants.mp3` | `audio/lo3/pronunciation/demystify/048-les-etudiants.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/les professeurs.mp3` | `audio/lo3/pronunciation/demystify/049-les-professeurs.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/marié.mp3` | `audio/lo3/grammar/grammar-and-usage/050-marie.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/mariée.mp3` | `audio/lo3/grammar/grammar-and-usage/051-mariee.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/médecin.mp3` | `audio/lo3/grammar/grammar-and-usage/052-medecin.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/nous parlons.mp3` | `audio/lo3/grammar/grammar-and-usage/053-nous-parlons.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/nous sommes fiancés.mp3` | `audio/lo3/pronunciation/demystify/054-nous-sommes-fiances.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/nous venons.mp3` | `audio/lo3/grammar/grammar-and-usage/055-nous-venons.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/parler.mp3` | `audio/lo3/grammar/grammar-and-usage/056-parler.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/regarder.mp3` | `audio/lo3/pronunciation/demystify/057-regarder.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/serbe.mp3` | `audio/lo3/grammar/grammar-and-usage/058-serbe.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/tu parles.mp3` | `audio/lo3/grammar/grammar-and-usage/059-tu-parles.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/tu viens.mp3` | `audio/lo3/grammar/grammar-and-usage/060-tu-viens.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/un grand homme.mp3` | `audio/lo3/pronunciation/demystify/061-un-grand-homme.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/un grand poète.mp3` | `audio/lo3/pronunciation/demystify/062-un-grand-poete.mp3` | `pronunciation/demystify` | yes |
| `sounds/fr/venir de.mp3` | `audio/lo3/grammar/grammar-and-usage/063-venir-de.mp3` | `grammar/grammar-and-usage` | yes |
| `sounds/fr/vous parlez.mp3` | `audio/lo3/shared/064-vous-parlez.mp3` | `grammar/grammar-and-usage, pronunciation/demystify` | yes |
| `sounds/fr/vous venez.mp3` | `audio/lo3/grammar/grammar-and-usage/065-vous-venez.mp3` | `grammar/grammar-and-usage` | yes |

| `sounds/fr/Ah non, je ne suis pas française !.mp3` | `audio/lo3/dialogues/phraseTable3/066-ah-non-je-ne-suis-pas-francaise.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Ah non, je suis luxembourgeoise.mp3` | `audio/lo3/dialogues/phraseTable3/067-ah-non-je-suis-luxembourgeoise.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/algérien, algérienne, Algérie.mp3` | `audio/lo3/vocabulary/vocabulary/068-algerien-algerienne-algerie.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/allemand, allemande, Allemagne.mp3` | `audio/lo3/vocabulary/vocabulary/069-allemand-allemande-allemagne.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/américain américaine.mp3` | `audio/lo3/exercises/typedTransformExercise3/001-americain-americaine.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/américain, américaine, Etats-Unis.mp3` | `audio/lo3/vocabulary/vocabulary/071-americain-americaine-etats-unis.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/anglais, anglaise, Angleterre.mp3` | `audio/lo3/vocabulary/vocabulary/072-anglais-anglaise-angleterre.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/asiatique(m) asiatique(f).mp3` | `audio/lo3/exercises/typedTransformExercise3/002-asiatique-m-asiatique-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/australien, australienne, Australie.mp3` | `audio/lo3/vocabulary/vocabulary/074-australien-australienne-australie.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/belge, Belgique.mp3` | `audio/lo3/vocabulary/vocabulary/075-belge-belgique.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/brésilien brésilienne.mp3` | `audio/lo3/exercises/typedTransformExercise3/003-bresilien-bresilienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/britannique, Grande Bretagne.mp3` | `audio/lo3/vocabulary/vocabulary/077-britannique-grande-bretagne.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/canadien, canadienne, Canada.mp3` | `audio/lo3/vocabulary/vocabulary/078-canadien-canadienne-canada.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/célibataire(m) célibataire(f).mp3` | `audio/lo3/exercises/typedTransformExercise3/010-celibataire-m-celibataire-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/chinois, chinoise, Chine.mp3` | `audio/lo3/vocabulary/vocabulary/080-chinois-chinoise-chine.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/croate(m) croate(f).mp3` | `audio/lo3/exercises/typedTransformExercise3/004-croate-m-croate-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/D'où venez-vous Vous venez d'où.mp3` | `audio/lo3/vocabulary/phraseTable5/082-d-ou-venez-vous-vous-venez-d-ou.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/D'où venez-vous, Monsieur.mp3` | `audio/lo3/dialogues/phraseTable3/083-d-ou-venez-vous-monsieur.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/D'où viens-tu Tu viens d'où.mp3` | `audio/lo3/vocabulary/phraseTable5/084-d-ou-viens-tu-tu-viens-d-ou.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/danois danoise.mp3` | `audio/lo3/exercises/typedTransformExercise3/005-danois-danoise.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/dentiste(m) dentiste(f).mp3` | `audio/lo3/exercises/typedTransformExercise4/001-dentiste-m-dentiste-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/doctorant doctorante.mp3` | `audio/lo3/exercises/typedTransformExercise4/002-doctorant-doctorante.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/écossais, écossaise, Ecosse.mp3` | `audio/lo3/vocabulary/vocabulary/088-ecossais-ecossaise-ecosse.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/Elle parle anglais et un petit peu français.mp3` | `audio/lo3/exercises/dictationExercise5/005-elle-parle-anglais-et-un-petit-peu-francais.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Elle vient de Bristol.mp3` | `audio/lo3/exercises/dictationExercise5/004-elle-vient-de-bristol.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/espagnol, espagnole, Espagne.mp3` | `audio/lo3/vocabulary/vocabulary/091-espagnol-espagnole-espagne.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/Et les enfants.mp3` | `audio/lo3/dialogues/phraseTable3/092-et-les-enfants.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/étudiant étudiante.mp3` | `audio/lo3/exercises/typedTransformExercise4/003-etudiant-etudiante.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/fatigué fatiguée.mp3` | `audio/lo3/exercises/typedTransformExercise3/011-fatigue-fatiguee.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/français, française, France.mp3` | `audio/lo3/vocabulary/vocabulary/095-francais-francaise-france.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/gallois, galloise, Pays de Galles.mp3` | `audio/lo3/vocabulary/vocabulary/096-gallois-galloise-pays-de-galles.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/ghanéen, ghanéenne, Ghana.mp3` | `audio/lo3/vocabulary/vocabulary/097-ghaneen-ghaneenne-ghana.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/Ils sont bilingues. Ils parlent français et arabe.mp3` | `audio/lo3/dialogues/phraseTable3/098-ils-sont-bilingues-ils-parlent-francais-et-arabe.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/informaticien informaticienne.mp3` | `audio/lo3/exercises/typedTransformExercise4/004-informaticien-informaticienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/irlandais, irlandaise, irelande.mp3` | `audio/lo3/vocabulary/vocabulary/100-irlandais-irlandaise-irelande.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/italien italienne.mp3` | `audio/lo3/exercises/typedTransformExercise3/006-italien-italienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/Je parle anglais et français.mp3` | `audio/lo3/exercises/dictationExercise5/007-je-parle-anglais-et-francais.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Je parle anglais Je ne parle pas anglais.mp3` | `audio/lo3/vocabulary/phraseTable5/103-je-parle-anglais-je-ne-parle-pas-anglais.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/Je parle français. C'est tout.mp3` | `audio/lo3/dialogues/phraseTable3/104-je-parle-francais-c-est-tout.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Je suis belge. Je viens de Bruxelles. Tu viens d'où.mp3` | `audio/lo3/dialogues/phraseTable3/105-je-suis-belge-je-viens-de-bruxelles-tu-viens-d-ou.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Je suis bilingue.mp3` | `audio/lo3/exercises/dictationExercise5/006-je-suis-bilingue.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Je suis canadien et je viens de Montréal.mp3` | `audio/lo3/exercises/dictationExercise5/002-je-suis-canadien-et-je-viens-de-montreal.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Je suis marié avec Lucie.mp3` | `audio/lo3/exercises/dictationExercise5/001-je-suis-marie-avec-lucie.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Je suis professeur de maths et Lucie est avocate.mp3` | `audio/lo3/exercises/dictationExercise5/008-je-suis-professeur-de-maths-et-lucie-est-avocate.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/Je suis trilingue. Je parle français, arabe et un petit peu anglais.mp3` | `audio/lo3/dialogues/phraseTable3/110-je-suis-trilingue-je-parle-francais-arabe-et-un-petit-peu-anglais.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Je viens d'Espagne.mp3` | `audio/lo3/dialogues/phraseTable3/111-je-viens-d-espagne.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Je viens de  Je ne viens pas de.mp3` | `audio/lo3/vocabulary/phraseTable5/112-je-viens-de-je-ne-viens-pas-de.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/Je viens des Etats-Unis. Je suis américain. Ma femme est canadienne. Elle vient du Québec. Et vous, vous êtes suisse.mp3` | `audio/lo3/dialogues/phraseTable3/113-je-viens-des-etats-unis-je-suis-americain-ma-femme-est-canadienne-elle-vient-du-quebec-et-vous-vous-etes-suisse.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/journaliste(m) journaliste(f).mp3` | `audio/lo3/exercises/typedTransformExercise4/005-journaliste-m-journaliste-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/libanais, libanaise, Liban.mp3` | `audio/lo3/vocabulary/vocabulary/115-libanais-libanaise-liban.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/Lucie est anglaise.mp3` | `audio/lo3/exercises/dictationExercise5/003-lucie-est-anglaise.mp3` | `exercises/AnswerTable2` | yes |
| `sounds/fr/luxembourgeois, luxembourgeoise, Luxembourg.mp3` | `audio/lo3/vocabulary/vocabulary/117-luxembourgeois-luxembourgeoise-luxembourg.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/malade(m) malade(f).mp3` | `audio/lo3/exercises/typedTransformExercise3/012-malade-m-malade-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/marié mariée.mp3` | `audio/lo3/exercises/typedTransformExercise3/013-marie-mariee.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/marocain, marocaine, Maroc.mp3` | `audio/lo3/vocabulary/vocabulary/120-marocain-marocaine-maroc.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/mécanicien mécanicienne.mp3` | `audio/lo3/exercises/typedTransformExercise4/006-mecanicien-mecanicienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/médecin(m) médecin(f).mp3` | `audio/lo3/exercises/typedTransformExercise4/007-medecin-m-medecin-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/Non, je ne parle pas allemand.mp3` | `audio/lo3/dialogues/phraseTable3/123-non-je-ne-parle-pas-allemand.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/nord irlandais, nord irlandaise, Irelande du Nord.mp3` | `audio/lo3/vocabulary/vocabulary/124-nord-irlandais-nord-irlandaise-irelande-du-nord.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/parler.mp3` | `audio/lo3/vocabulary/phraseTable5/125-parler.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/pharmacien pharmacienne.mp3` | `audio/lo3/exercises/typedTransformExercise4/008-pharmacien-pharmacienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/portugais portugaise.mp3` | `audio/lo3/exercises/typedTransformExercise3/007-portugais-portugaise.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/Quelles langues parles-tu Tu parles quelles langues.mp3` | `audio/lo3/vocabulary/phraseTable5/128-quelles-langues-parles-tu-tu-parles-quelles-langues.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/Quelles langues parles-tu.mp3` | `audio/lo3/dialogues/phraseTable3/129-quelles-langues-parles-tu.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Quelles langues parlez-vous Vous parlez quelles langues.mp3` | `audio/lo3/vocabulary/phraseTable5/130-quelles-langues-parlez-vous-vous-parlez-quelles-langues.mp3` | `vocabulary/phraseTable5` | yes |
| `sounds/fr/Quelles langues parlez-vous.mp3` | `audio/lo3/dialogues/phraseTable3/131-quelles-langues-parlez-vous.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/russe(m) russe(f).mp3` | `audio/lo3/exercises/typedTransformExercise3/008-russe-m-russe-f.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/sénégalais, sénégalaise, Sénégal.mp3` | `audio/lo3/vocabulary/vocabulary/133-senegalais-senegalaise-senegal.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/suisse, Suisse.mp3` | `audio/lo3/vocabulary/vocabulary/134-suisse-suisse.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/Tu es de quelle nationalité.mp3` | `audio/lo3/dialogues/phraseTable3/135-tu-es-de-quelle-nationalite.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Tu es française.mp3` | `audio/lo3/dialogues/phraseTable3/136-tu-es-francaise.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/Tu parles allemand.mp3` | `audio/lo3/dialogues/phraseTable3/137-tu-parles-allemand.mp3` | `dialogues/phraseTable3` | yes |
| `sounds/fr/tunisien, tunisienne, Tunisie.mp3` | `audio/lo3/vocabulary/vocabulary/138-tunisien-tunisienne-tunisie.mp3` | `vocabulary/vocabulary` | yes |
| `sounds/fr/ukrainien, ukrainienne.mp3` | `audio/lo3/exercises/typedTransformExercise3/009-ukrainien-ukrainienne.mp3` | `exercises/AnswerTable1` | yes |
| `sounds/fr/venir de.mp3` | `audio/lo3/vocabulary/phraseTable5/140-venir-de.mp3` | `vocabulary/phraseTable5` | yes |

Generated: 2026-02-24
