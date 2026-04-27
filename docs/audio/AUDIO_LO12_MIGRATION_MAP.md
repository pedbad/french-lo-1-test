# LO12 Audio Migration Map

## Scope

Lesson:
- `Out and about: Shopping in the market`

Updated source files:
- `src/lo-config/shopping-in-the-market.json`
- `src/components/custom/grammar/shopping-in-the-market-grammar.jsx`
- `src/components/custom/pronunciation/shopping-in-the-market-pronunciation.jsx`

## Summary

LO12 audio has been migrated from legacy shared `sounds/fr/...` paths to lesson-owned `audio/lo12/...` folders.

This pass modernizes LO12 to match the current post-LO8 lesson contract:
- `introImage` + `introHTML` + `informationHTML`
- grouped grammar articles
- tabbed pronunciation items
- section-level instructional copy for dialogues, vocabulary, grammar, pronunciation, and exercises
- lesson-owned audio folders for dialogues, vocabulary, grammar, pronunciation, and exercises

## New LO12 Audio Structure

- `public/audio/lo12/dialogues/...` (16 files)
- `public/audio/lo12/vocabulary/...` (32 files)
- `public/audio/lo12/grammar/...` (32 files)
- `public/audio/lo12/pronunciation/...` (14 files)
- `public/audio/lo12/exercises/...` (40 files)

## Migration Notes

- 134 LO12-owned audio files are now present in `public/audio/lo12/...`.
- New target filenames are ASCII-safe and sequence-based.
- The migration covered learner-facing config audio plus lesson-owned grammar and pronunciation component audio.
- Pre-existing broken legacy filename refs were resolved during migration via normalization-aware source matching.
- The original teacher-authored pronunciation example set was restored after the initial migration pass.
- Four pronunciation exercise clips remain pending source discovery:
  - `bout`
  - `couteau`
  - `roue`
  - `jus`
- This pass did not delete legacy shared assets from `public/sounds/fr`.

## Validation

- `rg -n 'sounds/fr' src/lo-config/shopping-in-the-market.json src/components/custom/grammar/shopping-in-the-market-grammar.jsx src/components/custom/pronunciation/shopping-in-the-market-pronunciation.jsx`
- `find public/audio/lo12 -type f | wc -l`
- `yarn build`

## Resolved Source Matches

| New ref | Source file used |
| --- | --- |
| `audio/lo12/dialogues/001-quest-ce-que-tu-fais-aujourdhui.mp3` | `sounds/fr/Qu'est-ce que tu fais aujourd'hui.mp3` |
| `audio/lo12/dialogues/002-je-fais-mes-courses.mp3` | `sounds/fr/Je fais mes courses.mp3` |
| `audio/lo12/dialogues/003-tu-vas-au-supermarche.mp3` | `sounds/fr/Tu vas au supermarché.mp3` |
| `audio/lo12/dialogues/004-non-je-vais-au-marche-ce-nest-pas-loin-de-chez-moi.mp3` | `sounds/fr/Non, je vais au marché. Ce n'est pas loin de chez moi.mp3` |
| `audio/lo12/dialogues/005-cest-bien.mp3` | `sounds/fr/C'est bien !.mp3` |
| `audio/lo12/dialogues/006-oui-cest-pratique-et-le-jeudi-je-vais-au-grand-marche-au-centre-ville-jachete-so.mp3` | `sounds/fr/Oui, c'est pratique. Et le jeudi, je vais au grand marché au centre-ville. J'achète souvent du fromage et du jambon là-bas. Il y a beaucoup de choix. Et il y a très bon fleuriste aussi.mp3` |
| `audio/lo12/dialogues/007-tu-as-de-la-chance-si-nous-voulons-du-pain-marc-va-a-la-boulangerie-au-bout-de-l.mp3` | `sounds/fr/Tu as de la chance ! Si nous voulons du pain Marc va à la boulangerie au bout de la rue, mais il n'y a pas de marché près de chez nous. Le samedi matin, Marc et moi allons au supermarché.mp3` |
| `audio/lo12/dialogues/008-madame-bonjour-vous-desirez.mp3` | `sounds/fr/Madame, bonjour ! Vous désirez.mp3` |
| `audio/lo12/dialogues/009-donnez-moi-deux-kilos-de-pommes-de-terre-sil-vous-plait.mp3` | `sounds/fr/Donnez-moi deux kilos de pommes de terre, s'il vous plaît.mp3` |
| `audio/lo12/dialogues/010-avec-ca.mp3` | `sounds/fr/Avec ça.mp3` |
| `audio/lo12/dialogues/011-trois-poireaux-oui-et-deux-poivrons-un-poivron-jaune-et-un-poivron-rouge.mp3` | `sounds/fr/Trois poireaux, oui... et deux poivrons, un poivron jaune et un poivron rouge.mp3` |
| `audio/lo12/dialogues/012-voila-cest-tout.mp3` | `sounds/fr/Voilà ! C'est tout.mp3` |
| `audio/lo12/dialogues/013-les-melons-cest-combien.mp3` | `sounds/fr/Les melons, c'est combien.mp3` |
| `audio/lo12/dialogues/014-les-melons-cest-3-euros-la-piece.mp3` | `sounds/fr/Les melons, c'est 3 euros la pièce.mp3` |
| `audio/lo12/dialogues/015-je-vais-prendre-un-melon-et-puis-cest-tout.mp3` | `sounds/fr/Je vais prendre un melon, et puis c'est tout !.mp3` |
| `audio/lo12/dialogues/016-bien-ca-fait-10-euros-50-sil-vous-plait-madame.mp3` | `sounds/fr/Bien ! Ça fait 10 euros 50 s'il vous plaît Madame !.mp3` |
| `audio/lo12/exercises/001-amel-va-a-la-piscine.mp3` | `sounds/fr/Amel va à la piscine.mp3` |
| `audio/lo12/exercises/002-mes-voisins-vont-au-supermarche.mp3` | `sounds/fr/Mes voisins vont au supermarché.mp3` |
| `audio/lo12/exercises/003-tu-vas-a-la-boulangerie.mp3` | `sounds/fr/Tu vas à la boulangerie.mp3` |
| `audio/lo12/exercises/004-ma-mere-et-moi-allons-au-marche.mp3` | `sounds/fr/Ma mère et moi allons au marché.mp3` |
| `audio/lo12/exercises/005-mon-frere-et-son-fils-vont-a-la-bibliotheque.mp3` | `sounds/fr/Mon frère et son fils vont à la bibliothèque.mp3` |
| `audio/lo12/exercises/006-je-vais-au-centre-sportif.mp3` | `sounds/fr/Je vais au centre sportif.mp3` |
| `audio/lo12/exercises/007-thomas-et-louise-vous-allez-au-centre-ville.mp3` | `sounds/fr/Thomas et Louise, vous allez au centre-ville.mp3` |
| `audio/lo12/exercises/008-elles-vont-a-lepicerie.mp3` | `sounds/fr/Elles vont à l'épicerie.mp3` |
| `audio/lo12/exercises/009-je-vais-a-la-boucherie.mp3` | `sounds/fr/Je vais à la boucherie.mp3` |
| `audio/lo12/exercises/010-elle-va-chez-le-marchand-de-fruits-et-legumes.mp3` | `sounds/fr/Elle va chez le marchand de fruits et légumes.mp3` |
| `audio/lo12/exercises/011-ils-vont-a-la-poissonnerie.mp3` | `sounds/fr/Ils vont à la poissonnerie.mp3` |
| `audio/lo12/exercises/012-il-va-chez-la-fleuriste.mp3` | `sounds/fr/Il va chez la fleuriste.mp3` |
| `audio/lo12/exercises/013-trois-bouteilles-de-vin-rouge.mp3` | `sounds/fr/trois bouteilles de vin rouge.mp3` |
| `audio/lo12/exercises/014-cinq-bouteilles-deau-minerale.mp3` | `sounds/fr/cinq bouteilles d'eau minérale.mp3` |
| `audio/lo12/exercises/015-300-grammes-de-fromage.mp3` | `sounds/fr/300 grammes de fromage.mp3` |
| `audio/lo12/exercises/016-200-grammes-de-jambon.mp3` | `sounds/fr/200 grammes de jambon.mp3` |
| `audio/lo12/exercises/017-une-barquette-de-framboises.mp3` | `sounds/fr/une barquette de framboises.mp3` |
| `audio/lo12/exercises/018-une-bouteille-dhuile-dolives.mp3` | `sounds/fr/une bouteille d'huile d'olives.mp3` |
| `audio/lo12/exercises/019-de-la-salade.mp3` | `sounds/fr/de la salade.mp3` |
| `audio/lo12/exercises/020-des-oignons.mp3` | `sounds/fr/des oignons.mp3` |
| `audio/lo12/exercises/021-du-lait.mp3` | `sounds/fr/du lait.mp3` |
| `audio/lo12/exercises/022-du-cafe.mp3` | `sounds/fr/du café.mp3` |
| `audio/lo12/exercises/023-du-jus-dorange.mp3` | `sounds/fr/du jus d'orange.mp3` |
| `audio/lo12/exercises/024-je-voudrais-un-kilo-de-pommes-de-terre-et-un-demi-kilo-de-carottes.mp3` | `sounds/fr/Je voudrais un kilo de pommes de terre et un demi-kilo de carottes.mp3` |
| `audio/lo12/exercises/025-200-grammes-dabricots-sil-vous-plait.mp3` | `sounds/fr/200 grammes d'abricots s'il vous plaît.mp3` |
| `audio/lo12/exercises/026-daccord.mp3` | `sounds/fr/d'accord.mp3` |
| `audio/lo12/exercises/027-et-une-barquette-de-cerises.mp3` | `sounds/fr/Et une barquette de cerises.mp3` |
| `audio/lo12/exercises/028-cest-tout.mp3` | `sounds/fr/C'est tout.mp3` |
| `audio/lo12/exercises/029-non-donnez-moi-trois-poireaux-et-un-poivron-rouge.mp3` | `sounds/fr/Non, donnez-moi trois poireaux et un poivron rouge.mp3` |
| `audio/lo12/exercises/030-voila-male.mp3` | `sounds/fr/Voilà ! (male).mp3` |
| `audio/lo12/exercises/031-les-melons-cest-combien-la-piece.mp3` | `sounds/fr/Les melons, c'est combien la pièce.mp3` |
| `audio/lo12/exercises/032-2euros50-la-piece-madame.mp3` | `sounds/fr/2€50 la pièce Madame.mp3` |
| `audio/lo12/exercises/033-un-melon-sil-vous-plait.mp3` | `sounds/fr/Un melon s'il vous plaît.mp3` |
| `audio/lo12/exercises/034-cest-tout-merci.mp3` | `sounds/fr/C'est tout merci !.mp3` |
| `audio/lo12/exercises/035-lo12ex4.mp3` | `sounds/fr/LO12EX4.mp3` |
| `audio/lo12/exercises/036-chou.mp3` | `sounds/fr/chou.mp3` |
| `audio/lo12/exercises/037-bu.mp3` | `sounds/fr/bu.mp3` |
| `audio/lo12/exercises/038-bouteille.mp3` | `sounds/fr/bouteille.mp3` |
| `audio/lo12/exercises/039-jour.mp3` | `sounds/fr/jour.mp3` |
| `audio/lo12/exercises/040-le-loup.mp3` | `sounds/fr/le loup.mp3` |
| `audio/lo12/grammar/001-je-vais.mp3` | `sounds/fr/je vais.mp3` |
| `audio/lo12/grammar/002-tu-vas.mp3` | `sounds/fr/tu vas.mp3` |
| `audio/lo12/grammar/003-il-va-elle-va.mp3` | `sounds/fr/il va, elle va.mp3` |
| `audio/lo12/grammar/004-nous-allons.mp3` | `sounds/fr/nous allons.mp3` |
| `audio/lo12/grammar/005-vous-allez.mp3` | `sounds/fr/vous allez.mp3` |
| `audio/lo12/grammar/006-ils-vont-elles-vont.mp3` | `sounds/fr/ils vont, elles vont.mp3` |
| `audio/lo12/grammar/007-aller.mp3` | `sounds/fr/aller.mp3` |
| `audio/lo12/grammar/008-je-vais-en-ville.mp3` | `sounds/fr/Je vais en ville.mp3` |
| `audio/lo12/grammar/009-melanie-va-au-marche-le-mardi.mp3` | `sounds/fr/Mélanie va au marché le mardi.mp3` |
| `audio/lo12/grammar/010-comment-ca-va.mp3` | `audio/lo1/vocabulary/018-comment-ca-va.mp3` |
| `audio/lo12/grammar/011-vous-allez-bien.mp3` | `sounds/fr/Vous allez bien.mp3` |
| `audio/lo12/grammar/012-du-fromage.mp3` | `sounds/fr/du fromage.mp3` |
| `audio/lo12/grammar/013-de-la-biere.mp3` | `sounds/fr/de la bière.mp3` |
| `audio/lo12/grammar/014-des-cerises.mp3` | `sounds/fr/des cerises.mp3` |
| `audio/lo12/grammar/015-un-kilo-de-pommes.mp3` | `sounds/fr/un kilo de pommes.mp3` |
| `audio/lo12/grammar/016-une-barquette-de-fraises.mp3` | `sounds/fr/une barquette de fraises.mp3` |
| `audio/lo12/grammar/017-une-tasse-de-the.mp3` | `sounds/fr/une tasse de thé.mp3` |
| `audio/lo12/grammar/018-du.mp3` | `sounds/fr/du.mp3` |
| `audio/lo12/grammar/019-de-la.mp3` | `sounds/fr/de la.mp3` |
| `audio/lo12/grammar/020-des.mp3` | `sounds/fr/des.mp3` |
| `audio/lo12/grammar/021-de.mp3` | `sounds/fr/de.mp3` |
| `audio/lo12/grammar/022-des-couteaux.mp3` | `sounds/fr/des couteaux.mp3` |
| `audio/lo12/grammar/023-des-gateaux.mp3` | `sounds/fr/des gâteaux.mp3` |
| `audio/lo12/grammar/024-des-poireaux.mp3` | `sounds/fr/des poireaux.mp3` |
| `audio/lo12/grammar/025-chou-choux.mp3` | `sounds/fr/chou, choux.mp3` |
| `audio/lo12/grammar/026-poireau-poireaux.mp3` | `sounds/fr/poireau, poireaux.mp3` |
| `audio/lo12/grammar/027-de-leau.mp3` | `sounds/fr/de l'eau.mp3` |
| `audio/lo12/grammar/028-200-grammes-damandes.mp3` | `sounds/fr/200 grammes d'amandes.mp3` |
| `audio/lo12/grammar/029-de-l.mp3` | `sounds/fr/de l'.mp3` |
| `audio/lo12/grammar/030-d.mp3` | `sounds/fr/d'.mp3` |
| `audio/lo12/grammar/031-je-nai-pas-de-pain.mp3` | `sounds/fr/Je n'ai pas de pain.mp3` |
| `audio/lo12/grammar/032-il-ne-veut-pas-deau-minerale.mp3` | `sounds/fr/Il ne veut pas d'eau minérale.mp3` |
| `audio/lo12/pronunciation/001-tu.mp3` | `sounds/fr/tu.mp3` |
| `audio/lo12/pronunciation/002-une-bulle.mp3` | `sounds/fr/une bulle.mp3` |
| `audio/lo12/pronunciation/003-legume.mp3` | `sounds/fr/légume.mp3` |
| `audio/lo12/pronunciation/004-pur.mp3` | `sounds/fr/pur.mp3` |
| `audio/lo12/pronunciation/005-rue.mp3` | `sounds/fr/rue.mp3` |
| `audio/lo12/pronunciation/006-vue.mp3` | `sounds/fr/vue.mp3` |
| `audio/lo12/pronunciation/007-tout.mp3` | `sounds/fr/tout.mp3` |
| `audio/lo12/pronunciation/008-nous.mp3` | `sounds/fr/nous.mp3` |
| `audio/lo12/pronunciation/009-nu.mp3` | `sounds/fr/nu.mp3` |
| `audio/lo12/pronunciation/010-vous.mp3` | `sounds/fr/vous.mp3` |
| `audio/lo12/pronunciation/011-pour.mp3` | `sounds/fr/pour.mp3` |
| `audio/lo12/pronunciation/012-doux.mp3` | `sounds/fr/doux.mp3` |
| `audio/lo12/pronunciation/013-poule.mp3` | `sounds/fr/poule.mp3` |
| `audio/lo12/pronunciation/014-pull.mp3` | `sounds/fr/pull.mp3` |
| `audio/lo12/vocabulary/001-faire-les-courses.mp3` | `sounds/fr/faire les courses.mp3` |
| `audio/lo12/vocabulary/002-boucherie.mp3` | `sounds/fr/boucherie.mp3` |
| `audio/lo12/vocabulary/003-boulangerie.mp3` | `sounds/fr/boulangerie.mp3` |
| `audio/lo12/vocabulary/004-epicerie.mp3` | `sounds/fr/épicerie.mp3` |
| `audio/lo12/vocabulary/005-fleuriste.mp3` | `sounds/fr/fleuriste.mp3` |
| `audio/lo12/vocabulary/006-marchand-de-fruits-et-legumes.mp3` | `sounds/fr/marchand de fruits et légumes.mp3` |
| `audio/lo12/vocabulary/007-marche.mp3` | `sounds/fr/marché.mp3` |
| `audio/lo12/vocabulary/008-poissonnerie.mp3` | `sounds/fr/poissonnerie.mp3` |
| `audio/lo12/vocabulary/009-supermarche.mp3` | `sounds/fr/supermarché.mp3` |
| `audio/lo12/vocabulary/010-kilo-demi-kilo.mp3` | `sounds/fr/kilo, demi-kilo.mp3` |
| `audio/lo12/vocabulary/011-barquette-de-framboises.mp3` | `sounds/fr/barquette de framboises.mp3` |
| `audio/lo12/vocabulary/012-piece.mp3` | `sounds/fr/pièce.mp3` |
| `audio/lo12/vocabulary/013-les-pommes-de-terre-cest-combien-le-kilo.mp3` | `sounds/fr/Les pommes de terre, c'est combien le kilo.mp3` |
| `audio/lo12/vocabulary/014-les-concombres-cest-combien-la-piece.mp3` | `sounds/fr/Les concombres, c'est combien la pièce.mp3` |
| `audio/lo12/vocabulary/015-cest-tout-oui-cest-tout.mp3` | `sounds/fr/C'est tout Oui, c'est tout.mp3` |
| `audio/lo12/vocabulary/016-avec-ca-avec-ceci.mp3` | `sounds/fr/Avec ça Avec ceci.mp3` |
| `audio/lo12/vocabulary/017-donnez-moi.mp3` | `sounds/fr/Donnez-moi.mp3` |
| `audio/lo12/vocabulary/018-ca-fait.mp3` | `sounds/fr/Ça fait.mp3` |
| `audio/lo12/vocabulary/019-carotte.mp3` | `sounds/fr/carotte.mp3` |
| `audio/lo12/vocabulary/020-concombre.mp3` | `sounds/fr/concombre.mp3` |
| `audio/lo12/vocabulary/021-oignon.mp3` | `sounds/fr/oignon.mp3` |
| `audio/lo12/vocabulary/022-pain.mp3` | `sounds/fr/pain.mp3` |
| `audio/lo12/vocabulary/023-poivron.mp3` | `sounds/fr/poivron.mp3` |
| `audio/lo12/vocabulary/024-salade.mp3` | `sounds/fr/salade.mp3` |
| `audio/lo12/vocabulary/025-cerise.mp3` | `sounds/fr/cerise.mp3` |
| `audio/lo12/vocabulary/026-citron.mp3` | `sounds/fr/citron.mp3` |
| `audio/lo12/vocabulary/027-fraise.mp3` | `sounds/fr/fraise.mp3` |
| `audio/lo12/vocabulary/028-framboise.mp3` | `sounds/fr/framboise.mp3` |
| `audio/lo12/vocabulary/029-huile-dolives.mp3` | `sounds/fr/huile d'olives.mp3` |
| `audio/lo12/vocabulary/030-melon.mp3` | `sounds/fr/melon.mp3` |
| `audio/lo12/vocabulary/031-pomme.mp3` | `sounds/fr/pomme.mp3` |
| `audio/lo12/vocabulary/032-fruit.mp3` | `sounds/fr/fruit.mp3` |
