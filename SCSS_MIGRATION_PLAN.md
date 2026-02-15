# SCSS Migration Plan: Single Source of Truth (Tailwind + Tokens)

## Status
SCSS removal is complete in app source (`0` SCSS files and `0` SCSS imports under `src`).

## Goal
Preserve single-source styling through `src/index.css` tokens + Tailwind/shadcn utilities, and prevent SCSS reintroduction.

Note:
- This file keeps the original full migration backlog for historical context.
- Live completion status and current SCSS counts are tracked in `/Users/ped/Sites/french/french-lo-1-test/TASKS_COMPLETED.md`.

## Systematic migration steps (baby steps)
1. Pick one component and mark its SCSS as “migrate now.”
2. Identify tokens used in its SCSS and map any missing values into `tailwind.config.js` or `src/index.css`.
3. Replace SCSS selectors with Tailwind utilities co-located in JSX.
4. If a pattern repeats, extract a small `@apply` utility (avoid large, generic utilities).
5. Remove the component SCSS file and re-verify visuals.
6. Repeat, batch by batch.

## Best-practice rules during migration
1. Do not add new SCSS for migrated components.
2. Use tokens for colors, spacing, radii, type size, and line-height.
3. Prefer Tailwind utilities in JSX; use `@apply` only for repeated patterns.
4. Keep DOM semantics intact while migrating styles.
5. Delete SCSS once parity is reached.

## Component-by-component plan
1. `src/components/Accordion/Accordion.scss` — Move header/content spacing, hover/expanded colors, and animation timing into Tailwind classes on the Accordion and header elements.
2. `src/components/AnswerTable/AnswerTable.scss` — Convert table borders, cell padding, and typography to Tailwind table utilities.
3. `src/components/Attribution/Attribution.scss` — Inline spacing and muted text into Tailwind and remove SCSS.
4. `src/components/AudioClip/AudioClip.scss` — Convert icon size, alignment, and color to Tailwind utilities or tokenized `@apply` classes.
5. `src/components/Blanks/Blanks.scss` — Migrate layout, spacing, and feedback colors to Tailwind; keep game logic in JS only.
6. `src/components/Blanks/Word/Word.scss` — Move word styling to Tailwind classes in the Word component.
7. `src/components/Congratulate/Congratulate.scss` — Convert modal layout, spacing, and tone to Tailwind and remove SCSS.
8. `src/components/ConnectFour/ConnectFour.scss` — Migrate grid sizing, chips, and colors to Tailwind; map sizes to tokens if needed.
9. `src/components/CrossWord/CrossWord.scss` — Move grid and cell styling to Tailwind; convert colors to tokens.
10. `src/components/CustomComponents_FR/CustomComponents_FR.scss` — Move layout/spacing for custom French sections into Tailwind classes in JSX.
11. `src/components/DropDowns/DropDowns.scss` — Replace dropdown layouts and selection states with Tailwind utilities.
12. `src/components/ErrorLog/ErrorLog.scss` — Convert typography, borders, and spacing to Tailwind.
13. `src/components/Explanation/Explanation.scss` — Move content spacing and typography into Tailwind; remove SCSS.
14. `src/components/Explanation/Panel/Panel.scss` — Convert panel padding/background to Tailwind and remove SCSS.
15. `src/components/Figure/Figure.scss` — Replace figure layout rules with Tailwind utilities.
16. `src/components/Flag/Flag.scss` — Move any sizing/positioning to Tailwind; keep theme colors tokenized.
17. `src/components/Footer/Footer.scss` — Convert layout, spacing, and theming to Tailwind classes.
18. `src/components/Form/DateField/DateField.scss` — Use Tailwind form utilities, map colors to tokens, delete SCSS.
19. `src/components/Form/Dialog/Dialog.scss` — Use shadcn dialog classes and Tailwind for spacing and sizing.
20. `src/components/Form/FieldSet/FieldSet.scss` — Convert fieldset spacing/labels to Tailwind utilities.
21. `src/components/Form/OkCancel/OkCancel.scss` — Move button group layout to Tailwind.
22. `src/components/Form/Progress/Progress.scss` — Use Tailwind progress styles and tokens for color.
23. `src/components/Form/RadioC/RadioC.scss` — Convert radio styles to Tailwind or shadcn components.
24. `src/components/Form/Select/Select.scss` — Replace with shadcn select styles or Tailwind classes.
25. `src/components/Form/TextField/TextField.scss` — Use Tailwind input styles and tokens.
26. `src/components/Form/TristateCheckBox/TristateCheckBox.scss` — Convert checkbox visuals to Tailwind or shadcn.
27. `src/components/Header/Header.scss` — Move header layout, spacing, and colors to Tailwind utilities.
28. `src/components/IconButton/IconButton.scss` — Inline icon sizing, padding, and hover states in Tailwind or a small `@apply` helper.
29. `src/components/Image/Image.scss` — Replace image layout rules with Tailwind classes.
30. `src/components/Info/Info.scss` — Convert info panel to Tailwind utilities; keep tokenized colors.
31. `src/components/Jigsaw/Jigsaw.scss` — Move layout and tile styling to Tailwind; keep game logic separate.
32. `src/components/Jigsaw/Piece/Piece.scss` — Convert piece styling to Tailwind.
33. `src/components/LandingPage/LandingPage.scss` — Migrate layout and typography to Tailwind utilities.
34. `src/components/LearningObjectMenu/LearningObjectMenu.scss` — Move menu layout, hover, and active states to Tailwind.
35. `src/components/MainMenu/MainMenu.scss` — Convert navigation layout and colors to Tailwind.
36. `src/components/MemoryMatchGame/Card/Card.scss` — Move card visuals and spacing to Tailwind.
37. `src/components/MemoryMatchGame/MemoryMatchGame.scss` — Convert game grid and text styles to Tailwind.
38. `src/components/Mockney/Mockney.scss` — Replace layout rules with Tailwind utilities.
39. `src/components/Monologue/Monologue.scss` — Move layout and typography to Tailwind.
40. `src/components/PhraseTable/PhraseTable.scss` — Convert table spacing, hover styles, and text size to Tailwind utilities.
41. `src/components/RadioQuiz/RadioQuiz.scss` — Migrate quiz layout and states to Tailwind.
42. `src/components/ReadAloud/ReadAloud.scss` — Convert layout and typography to Tailwind.
43. `src/components/SequenceAudioController/SequenceAudioController.scss` — Replace layout and spacing with Tailwind classes.
44. `src/components/Social/Social.scss` — Convert layout and icon spacing to Tailwind utilities.
45. `src/components/Sortable/Sortable.scss` — Move layout, borders, and color states to Tailwind utilities.
46. `src/components/TopButton/TopButton.scss` — Convert button positioning and style to Tailwind.
47. `src/components/TreasureGrid/TreasureGrid.scss` — Convert grid and tile styles to Tailwind.
48. `src/components/WordGrid/WordGrid.scss` — Replace layout/spacing/typography with Tailwind utilities.
49. `src/components/WordParts/WordParts.scss` — Move layout and feedback styles into Tailwind utilities; keep animations in CSS only if needed.

## Migration difficulty ranking (easiest first)

### Easiest (mostly layout/typography, low risk)
1. `src/components/Attribution/Attribution.scss`
2. `src/components/Figure/Figure.scss`
3. `src/components/Image/Image.scss`
4. `src/components/TopButton/TopButton.scss`
5. `src/components/Social/Social.scss`
6. `src/components/Explanation/Explanation.scss`
7. `src/components/Explanation/Panel/Panel.scss`
8. `src/components/Footer/Footer.scss`
9. `src/components/Header/Header.scss`
10. `src/components/ErrorLog/ErrorLog.scss`

### Easy–Medium (simple controls or small component skins)
1. `src/components/IconButton/IconButton.scss`
2. `src/components/Info/Info.scss`
3. `src/components/AnswerTable/AnswerTable.scss`
4. `src/components/AudioClip/AudioClip.scss`
5. `src/components/LandingPage/LandingPage.scss`
6. `src/components/LearningObjectMenu/LearningObjectMenu.scss`
7. `src/components/MainMenu/MainMenu.scss`
8. `src/components/Monologue/Monologue.scss`

### Medium (tables, repeated UI, interactive panels)
1. `src/components/PhraseTable/PhraseTable.scss`
2. `src/components/Accordion/Accordion.scss`
3. `src/components/ReadAloud/ReadAloud.scss`
4. `src/components/RadioQuiz/RadioQuiz.scss`
5. `src/components/Sortable/Sortable.scss`
6. `src/components/DropDowns/DropDowns.scss`
7. `src/components/WordParts/WordParts.scss`
8. `src/components/WordGrid/WordGrid.scss`
9. `src/components/Blanks/Blanks.scss`
10. `src/components/Blanks/Word/Word.scss`

### Hard (game-like layouts, grids, custom interactions)
1. `src/components/Jigsaw/Jigsaw.scss`
2. `src/components/Jigsaw/Piece/Piece.scss`
3. `src/components/MemoryMatchGame/MemoryMatchGame.scss`
4. `src/components/MemoryMatchGame/Card/Card.scss`
5. `src/components/TreasureGrid/TreasureGrid.scss`
6. `src/components/ConnectFour/ConnectFour.scss`
7. `src/components/CrossWord/CrossWord.scss`

### Special cases / likely stubborn
1. `src/components/CustomComponents_FR/CustomComponents_FR.scss`
2. `src/components/Flag/Flag.scss`
3. `src/components/Mockney/Mockney.scss`
4. `src/components/SequenceAudioController/SequenceAudioController.scss`

## Phased sprint order (suggested)
1. Sprint 1 (quick wins): Easiest bucket, plus `IconButton` and `Info` if time.
2. Sprint 2 (core UI): Main menus + layout scaffolding (`MainMenu`, `LearningObjectMenu`, `Header`, `Footer`).
3. Sprint 3 (learning flow): Accordion + PhraseTable + ReadAloud + RadioQuiz.
4. Sprint 4 (word activities): WordParts + WordGrid + Blanks (+ Word subcomponent).
5. Sprint 5 (games): MemoryMatchGame, Jigsaw, TreasureGrid, ConnectFour, CrossWord.
6. Sprint 6 (special cases): CustomComponents_FR, Flag, Mockney, SequenceAudioController.
