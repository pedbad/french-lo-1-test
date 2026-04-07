# Changes Summary (Session)

This file summarizes the work completed in this repo during the session. It includes case-sensitivity fixes, content cleanup, theming unification, banner updates, and asset/logo updates. Paths are repo-relative.

## 2026-04-07 - LO6 Exercise Refactor + SelectExercise Row Shuffle

- Completed the LO6 `Family, friends & neighbours` exercise modernization:
  - `src/lo-config/family-friends-and-neighbours.json`
  - Exercise 2 is now a single mixed `InlineChoiceGroup` (`Double ll: y or l?`) with:
    - two side-by-side reference texts
    - one shared `© Jacqueline Rosen`
    - `sampleSize: 8`
    - `shuffleItems: true`
  - Exercise 3 (`Practise the verb avoir`) now uses `InlineChoiceGroup` with shared blue instruction copy and shuffled practice on load/reset
  - Exercise 4 (`Practise the possessives`) now uses `InlineChoiceGroup` with shared blue instruction copy, `sampleSize: 8`, and shuffled practice on load/reset
  - Exercise 5 (`Jeanne's Family`) now uses `SelectExercise` with inline-rendered select choices instead of drag/drop
- Extended `SelectExercise` to support optional row-order shuffling and sampling:
  - `src/components/exercises/SelectExercise/SelectExercise.jsx`
  - added prepared-item handling so `shuffleItems: true` can randomize row order on first load and on `Reset`
  - `sampleSize` is now also honored by `SelectExercise` when configured
  - existing per-row option shuffling remains intact
- Applied the new `SelectExercise` row shuffle behavior to LO6 `Jeanne's Family`:
  - `src/lo-config/family-friends-and-neighbours.json`
  - rows now reshuffle on first load, browser refresh, and `Reset`
  - each row still keeps the full 10-ending answer bank to preserve the original difficulty
- Refined shared exercise layout parity:
  - `src/components/exercises/InlineChoiceGroup/InlineChoiceGroup.jsx`
  - tightened audio-to-word spacing to better match earlier inline-choice exercises
- Reworked lesson-owned image placement and memory-card rendering:
  - `src/lo-config/house-and-home.json`
    - LO5 Exercise 1 room images now live under `public/img/lo5/exercises/rooms/`
  - `src/lo-config/opinions-matter.json`
    - LO7 memory-game images now live under `public/img/lo7/exercises/vocabulary/`
  - `src/components/exercises/MemoryMatchGame/Card/Card.jsx`
  - `src/components/exercises/MemoryMatchGame/MemoryMatchGame.jsx`
    - memory cards now use Tailwind/shadcn-style card visuals in JSX
    - removed the old separate back-face card layer and matched-pairs sidebar
    - board now presents the cards as a single square grid
  - `src/index.css`
    - retained only the small shared CSS needed for special image-size overrides
- Styling rule reinforced for future work:
  - prefer Tailwind and shadcn-style primitives first
  - avoid introducing custom CSS unless Tailwind/shadcn cannot express the effect cleanly
  - only drop to shared CSS for the parts Tailwind does not cover well
- Validation:
  - `yarn build`
  - `yarn build:with-debug`

## 2026-04-02 - Shared Compact Audio Hover Consistency

- Unified compact circular audio icon hover/focus behavior in the shared audio styling:
  - `src/index.css`
  - compact `AudioClip` buttons used in exercises now inherit the same orange rollover treatment already expected in grammar/vocabulary contexts
  - applied at the shared selector level so `SelectExercise`, `InlineChoiceGroup`, `Sortable`, `DraggableFillGaps`, `LineMatch`, and other exercise surfaces do not need per-component hover overrides
- Synced docs to record the shared interaction contract:
  - `README.md`
  - `AGENTS.md`
  - `docs/process/FUTURE_LO_REFACTOR_CHECKLIST.md`

## 2026-04-01 - LineMatch Component (Initial Build Steps)

- Added planning docs for the new connector-style matching exercise:
  - `docs/components/LINEMATCH_DESIGN.md`
  - `docs/components/LINEMATCH_CHECKLIST.md`
- Added new exercise component scaffold and registry wiring:
  - `src/components/exercises/LineMatch/LineMatch.jsx`
  - `src/components/exercises/LineMatch/index.js`
  - `src/components/exercises/index.js`
  - `src/App.jsx`
- Implemented the first two build slices:
  - static two-column desktop scaffold with square image tiles sized to match existing sortable card proportions
  - mobile dropdown/select fallback with the same sampled image set
- Implemented the interaction state model before line rendering:
  - sampled item round generation
  - randomized right-side word bank
  - active source tracking
  - current desktop connection mapping
- Wired LO5 Exercise 1 to the new component:
  - `src/lo-config/house-and-home.json`
  - replaced the first exercise's `DraggableFillGaps` config with `LineMatch`
  - preserved teacher-authored title/instruction text and reused the same room image/audio bank
- Added standard exercise controls and scoring to `LineMatch`:
  - progress indicator with shared `ProgressDots`
  - `Check answers`, `Reset`, and `Show answer` buttons using shared exercise button styles
  - correct matches remain and turn green
  - incorrect matches are cleared on check
  - mobile dropdown answers are validated/reset through the same control row
- Updated shared icon button behavior:
  - `src/components/IconButton/IconButton.jsx`
  - forwards `disabled` to the underlying button so exercise actions can be properly gated
- Purpose:
  - replace LO5 Exercise 1's overly long drag/drop interaction with a more structured connector-matching pattern
  - keep mobile interaction simpler and lower-friction than desktop

## 2026-04-02 - LineMatch Interaction Refinement

- Refined the new `LineMatch` exercise interaction and feedback:
  - desktop matching now works in both directions
    - picture -> word
    - word -> picture
  - entire picture wrappers are clickable as source selectors
  - entire word-bank rows are clickable as targets, while the word/audio area remains audio-only
  - connected circles now fill so used vs unused connection points are easier to distinguish
  - incorrect desktop connections now use a short recoil animation on `Check answers` instead of disappearing instantly
- Refined desktop layout and visual alignment:
  - removed extra `Pictures` / `Word Bank` headings
  - moved left-side status text inside the image wrapper
  - added English helper labels on the left by default using `localLanguage`
  - normalized left/right row heights so picture rows and word-bank rows align more predictably
  - reduced image tile size and tuned hover/cursor states on both columns
- Refined mobile fallback behavior:
  - simplified each mobile row to audio icon + image + select box
  - removed the extra mobile word-bank tiles and redundant heading/instruction text
  - added per-row correct/incorrect feedback icons to match earlier LO exercise conventions
  - fixed mobile select value handling for items whose internal `id` differs from the visible French label
- Refined LO5 config and instruction rendering:
  - `src/lo-config/house-and-home.json`
    - added `localLanguage` labels for LO5 room items used by `LineMatch`
    - updated the first exercise instruction copy to use the shared inline action icons and shorter audio guidance
  - `src/components/exercises/LineMatch/LineMatch.jsx`
    - now respects `suppressInfo` so exercise instructions are not duplicated inside accordions
  - `src/App.jsx`
    - ensured `LineMatch` resolves in the main section renderer as well as the tab renderer
- Validation:
  - `yarn build`

## 2026-04-02 - LO5 Completion + Debug/Docs Sync

- Completed the LO5 `House and Home` exercise refactor:
  - Exercise 1 remains the new `LineMatch` connector activity
  - Exercise 2 now uses a single `InlineChoiceGroup` with a 12-item pool, `sampleSize: 6`, and reshuffled practice on load/reset
  - Exercise 3 stays on `SelectExercise`, with corrected option parsing and shared instruction callout
  - Exercise 4 keeps `DraggableFillGaps`, removes redundant row audio, and now includes the shared blue instruction callout
- Synced repo docs to avoid drift:
  - `README.md`
    - added explicit mention of the new `LineMatch` activity and debug sandbox coverage
  - `AGENTS.md`
    - added `LineMatch` to the exercise UI conventions
- Updated debug sandbox structure summary support:
  - `src/debug/components/LearningObjectStructureSummary.jsx`
    - `LineMatch` now counts as an exercise component and accordion-by-default component
  - result: LO5 in `debug-sandbox.html` now reports the new activity type in its exercise/component summary
- Validation:
  - `yarn build`

## 2026-04-01 - Navigation Documentation Consolidation

- Added dedicated navigation docs under `docs/navigation/`:
  - `docs/navigation/NAV_TODO.md`
  - `docs/navigation/NAV_CHECKLIST.md`
  - `docs/navigation/NAV_CHANGES.md`
- Synced doc index and migration tracker links to avoid drift:
  - `docs/README.md`
  - `README.md`
  - `docs/components/NAVIGATION_REFACTOR_README.md`
- Purpose:
  - keep nav refactor rationale, checklist, and change log in one place
  - preserve parity-first approach for future nav split work

## 2026-03-10 - Layout Page-Shell Namespace (Batch A)

- Reorganized page-shell components under layout domain:
  - moved `src/components/MainMenu/**` -> `src/components/layout/page-shell/MainMenu/**`
  - moved `src/components/Footer/**` -> `src/components/layout/page-shell/Footer/**`
  - moved `src/components/HeroSection/**` -> `src/components/layout/page-shell/HeroSection/**`
  - moved `src/components/BackToTopButton/**` -> `src/components/layout/page-shell/BackToTopButton/**`
  - moved `src/components/LandingPage/**` -> `src/components/layout/page-shell/LandingPage/**`
- Updated layout barrel exports to new namespace:
  - `src/components/layout/index.js`
- Updated moved component imports to alias-based paths to avoid deep relative drift:
  - `src/components/layout/page-shell/MainMenu/MainMenu.jsx`
  - `src/components/layout/page-shell/Footer/Footer.jsx`
  - `src/components/layout/page-shell/HeroSection/HeroSection.jsx`
- Synced debug/docs path references:
  - `src/debug/components/DebugSvgAssets.jsx`
  - `README.md`
  - `docs/components/NAVIGATION_REFACTOR_README.md`
- Validation:
  - `yarn build`

## 2026-03-10 - App Domain-Barrel Imports (Batch B)

- Updated app runtime imports to use domain barrels directly (no root `./components` barrel dependency in App):
  - `src/App.jsx`
    - content from `@/components/content`
    - layout from `@/components/layout`
    - exercises from `@/components/exercises`
    - feedback from `@/components/feedback`
- Removed remaining root barrel usage in runtime component files (`from "@/components"` -> explicit domains):
  - `src/components/layout/page-shell/HeroSection/HeroSection.jsx`
  - `src/components/exercises/DraggableFillGaps/DraggableFillGapsRuntime.jsx`
  - `src/components/exercises/InlineChoiceGroup/InlineChoiceGroup.jsx`
  - `src/components/exercises/MemoryMatchGame/Card/Card.jsx`
  - `src/components/exercises/MemoryMatchGame/MemoryMatchGame.jsx`
  - `src/components/exercises/RadioQuiz/RadioQuiz.jsx`
  - `src/components/exercises/SelectExercise/SelectExercise.jsx`
  - `src/components/exercises/Sortable/Sortable.jsx`
  - `src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx`
  - `src/components/exercises/WordParts/WordParts.jsx`
- Validation:
  - `yarn build`
  - `yarn prepush:local`

## 2026-03-10 - Root Barrel Import Guard (Batch C2)

- Added lint guard to prevent runtime drift back to root `components` barrel imports:
  - `eslint.config.js`
    - added `no-restricted-imports` for:
      - `@/components`
      - `./components`
- Updated component architecture standard to match guard policy:
  - `docs/components/COMPONENT_TREE_STANDARD.md`
    - runtime import rule now requires domain barrels only
    - enforcement checklist now includes root-barrel prohibition

## 2026-03-10 - Unused Component Cleanup (Batch 3)

- Removed dead runtime exercise engines no longer referenced by LO config:
  - deleted `src/components/exercises/ReadAloud/**`
  - deleted `src/components/exercises/WordGrid/**`
- Removed unused legacy header component:
  - deleted `src/components/Header/**`
- Removed all remaining runtime/app/debug references for removed components:
  - `src/App.jsx`
  - `src/components/exercises/index.js`
  - `src/components/layout/index.js`
  - `src/debug/components/LearningObjectStructureSummary.jsx`
- Removed orphaned global CSS blocks tied only to deleted components:
  - `src/index.css`
    - removed `.read-aloud-container*` styles
    - removed `.word-grid-container*` styles
- Validation:
  - `yarn build`
  - `yarn prepush:local`

## 2026-03-10 - Component Structure Cleanup (Exercise Shared Helper)

- Moved shared exercise action-button variant helper out of root components folder:
  - `src/components/exerciseActionButtonVariants.js`
  - -> `src/components/exercises/shared/exerciseActionButtonVariants.js`
- Updated all exercise/debug imports to the new semantic path:
  - `src/components/exercises/DraggableFillGaps/DraggableFillGapsRuntime.jsx`
  - `src/components/exercises/InlineChoiceGroup/InlineChoiceGroup.jsx`
  - `src/components/exercises/SelectExercise/SelectExercise.jsx`
  - `src/components/exercises/SequenceOrder/SequenceOrder.jsx`
  - `src/components/exercises/Sortable/Sortable.jsx`
  - `src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx`
  - `src/components/exercises/WordParts/WordParts.jsx`
  - `src/components/exercises/current-location/nasal-rhyme-exercise.jsx`
  - `src/debug/DebugSandbox.jsx`
- Updated docs to keep component tree source-of-truth aligned:
  - `docs/components/COMPONENT_TREE_STANDARD.md`
  - `docs/process/TASKS_COMPLETED.md`
  - `docs/styling/SCSS_TO_TAILWIND_REFACTOR_PLAN.md`
  - `docs/styling/TAILWIND_MIGRATION_CHEATSHEET.md`
- Validation:
  - `yarn build` passes.

## 2026-03-10 - Unused Component Audit + Dead Code Removal (Batch 2)

- Removed unused custom misc demo component:
  - deleted `src/components/custom/misc/audio-clip-samples.jsx`
- Updated misc barrel to remove dead export:
  - `src/components/custom/misc/index.js`
    - removed `AudioClipSamples` export
- Removed dormant exercise engines not referenced by LO config or renderer:
  - deleted `src/components/exercises/ConnectFour/**`
  - deleted `src/components/exercises/CrossWord/**`
  - deleted `src/components/exercises/TreasureGrid/**`
- Updated exercise/domain inventories to remove deleted engines:
  - `src/components/exercises/index.js`
  - `src/debug/components/LearningObjectStructureSummary.jsx`
- Removed dead crossword-only global styles after component removal:
  - `src/index.css`
- Updated app root imports to remove unused component imports:
  - `src/App.jsx`
    - removed `AudioClip`, `Figure`, and `Header` from `./components` import list
- Updated architecture notes:
  - `README.md`
    - updated `custom/misc` examples to reflect active runtime components only
- Validation:
  - `yarn build` passes
  - `yarn lint` still reports existing baseline repo-wide indentation/style errors unrelated to this batch

## 2026-03-10 - Step 5 Quality Gate Stabilization

- Fixed lint **error** blockers so local pre-push can run to completion:
  - `src/App.jsx`
  - `src/components/Accordion/AccordionArticle.jsx`
  - `src/components/AudioClip/AudioClip.jsx`
  - `src/components/Footer/Footer.jsx`
  - `src/components/ModalLinkDialog/ModalLinkDialog.jsx`
  - `src/components/custom/pronunciation/first-contact-pronunciation.jsx`
  - `src/components/exercises/DraggableFillGaps/DraggableFillGapsRuntime.jsx`
  - `src/components/exercises/SequenceOrder/SequenceOrder.jsx`
  - `src/components/exercises/SortableWordCard/SortableWordCard.jsx`
  - `src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx`
  - `src/components/exercises/WordParts/WordParts.jsx`
  - `src/debug/components/LearningObjectStructureSummary.jsx`
- Updated audio unicode guard to support scoped checks (`--staged`, `--working`, `--against <ref>`) instead of always scanning the full legacy audio tree:
  - `scripts/audio-unicode-guard.mjs`
- Updated npm scripts so branch pre-push uses branch-scoped audio unicode check:
  - `package.json`
    - `check:audio-unicode` => staged mode
    - added `check:audio-unicode:branch`
    - `prepush:local` now uses `check:audio-unicode:branch`
- Validation:
  - `yarn prepush:local` passes end-to-end (lint warnings remain, no lint errors).

## 2026-03-10 - Component Tree Standard + Docs Drift Sync

- Added canonical component tree/naming contract:
  - `docs/components/COMPONENT_TREE_STANDARD.md`
- Updated README migration tracker links:
  - `README.md`
    - added `COMPONENT_TREE_STANDARD.md` as source-of-truth for folder and naming conventions
- Synced active architecture audit doc to current runtime (monolith retired, registry/domain split live):
  - `docs/components/COMPONENT_ARCHITECTURE_AUDIT.md`
    - updated current runtime source to `src/components/custom/registry.js`
    - updated target custom paths to `src/components/custom/{grammar,pronunciation,misc}`
    - marked monolithic `CustomComponents_FR.jsx` risk as resolved
- Synced active TODO docs to current component locations:
  - `docs/grammar/GRAMMAR_TODO.md`
  - `docs/grammar/GRAMMAR_TASK_CHECKLIST.md`
  - `docs/pronunciation/PRONUNCIATION_TODO.md`
  - `docs/audio/AUDIO_TODO.md`
- Synced active audio migration maps/blocker docs to current component locations:
  - `docs/audio/AUDIO_LO2_MIGRATION_MAP.md`
  - `docs/audio/AUDIO_LO3_MIGRATION_MAP.md`
  - `docs/audio/AUDIO_LO4_MIGRATION_MAP.md`
  - `docs/audio/LO2_AUDIO_BLOCKERS.md`
  - `docs/audio/LO4_AUDIO_BLOCKERS.md`

## 2026-03-10 - Remove Legacy `Form` Namespace (Dead Code)

- Removed unused legacy component namespace:
  - deleted `src/components/Form/**`
- Removed root barrel export for removed namespace:
  - `src/components/index.js`
    - removed `export * from './Form';`
- Validation:
  - scanned all LO configs in `src/lo-config/*.json` (no Form component keys in use)
  - scanned source imports/usages (no runtime imports from `src/components/Form`)
  - `yarn build` passes after deletion

## 2026-03-10 - Split Root Component Barrel into Domain Barrels

- Added domain barrel modules:
  - `src/components/content/index.js`
  - `src/components/layout/index.js`
  - `src/components/media/index.js`
  - `src/components/feedback/index.js`
- Refactored root barrel:
  - `src/components/index.js`
    - now exports domain barrels (`content`, `layout`, `media`, `feedback`) plus existing `custom` and `exercises` barrels
    - removed long per-component export list
- Validation:
  - existing imports from `@/components` and `./components` preserved
  - `yarn build` passes

## 2026-03-10 - Unused Component Audit + Dead Code Removal (Batch 1)

- Audited LO config usage (`src/lo-config/*.json`) and runtime imports for dead components.
- Removed dead components with no runtime/config usage:
  - `src/components/Attribution/**`
  - `src/components/Mockney/**`
  - `src/components/Social/**`
  - `src/components/AudioClip/ConcatenatedPlayList.jsx`
- Removed stale exports/imports tied to deleted components:
  - `src/components/feedback/index.js`
    - removed `Attribution`, `Mockney`, `Social` exports
  - `src/components/AudioClip/index.js`
    - removed `ConcatenatedPlaylist` export
  - `src/components/custom/grammar/going-to-a-cafe-grammar.jsx`
    - removed unused `Attribution` import
- Notes:
  - `ConcatenatedPlaylist` had no runtime usage and a stale export-path mismatch (`ConcatenatedPlayList.jsx` filename vs `./ConcatenatedPlaylist` export target), so deletion prevents future path/case drift.
- Validation:
  - `yarn build` passes after deletion.

## 2026-03-09 - Legacy Exercise Wrapper Cleanup (Runtime + Structure)

- Removed unused legacy wrapper/component paths:
  - `src/components/DropDowns/DropDowns.jsx`
  - `src/components/DropDowns/index.js`
  - `src/components/CustomComponents_FR/index.js`
  - `src/components/AnswerTable/AnswerTable.jsx`
  - `src/components/AnswerTable/index.js`
- Updated barrel exports:
  - `src/components/index.js`
    - removed legacy exports for `DropDowns` and `AnswerTable`
    - pointed custom exports to `src/components/custom`
- Validation:
  - `yarn build` passes.

## 2026-03-09 - `Blanks` Runtime Moved Under `DraggableFillGaps`

- Moved draggable fill-gaps runtime from legacy path into semantic component folder:
  - `src/components/Blanks/Blanks.jsx` -> `src/components/DraggableFillGaps/DraggableFillGapsRuntime.jsx`
  - `src/components/Blanks/DraggableWordTile/*` -> `src/components/DraggableFillGaps/DraggableWordTile/*`
- Updated wrapper and exports:
  - `src/components/DraggableFillGaps/DraggableFillGaps.jsx`
  - `src/components/index.js`
- Updated debug icon source manifests to match moved files:
  - `src/debug/components/DebugSvgAssets.jsx`
- Validation:
  - `yarn build` passes.

## 2026-03-09 - Shared Typed Runtime Renamed to `TextEntryExerciseRuntime`

- Replaced legacy-named typed runtime path/class with semantic shared runtime:
  - `src/components/AnswerTable/AnswerTableRuntime.jsx` -> `src/components/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx`
- Updated semantic wrappers to use the new runtime:
  - `src/components/TypedTransformExercise/TypedTransformExercise.jsx`
  - `src/components/DictationExercise/DictationExercise.jsx`
- Added runtime barrel:
  - `src/components/TextEntryExerciseRuntime/index.js`
- Updated debug structure inventory to remove stale `AnswerTable` and `DropDowns` labels:
  - `src/debug/components/LearningObjectStructureSummary.jsx`
- Validation:
  - `yarn build` passes.

## 2026-03-09 - Legacy `Blanks` Alias Removed from App Runtime

- Removed runtime `component: "Blanks"` fallback from:
  - `src/App.jsx`
- Canonical drag/drop fill config component is now:
  - `component: "DraggableFillGaps"`
- Updated remaining internal comments/references:
  - `src/components/SequenceAudioController/SequenceAudioController.jsx`
  - `src/index.css`
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Server Deploy Packaging: Apache Rewrite File + Build Scripts

- Added Apache SPA rewrite file to project public assets:
  - `public/.htaccess`
- Added server-targeted package scripts:
  - `build:server` (`VITE_BASE_PATH=/projects/french-basic/ vite build`)
  - `build:server:with-debug` (`VITE_BASE_PATH=/projects/french-basic/ VITE_INCLUDE_DEBUG=true vite build`)
- Updated deployment docs in:
  - `README.md`
    - documented new server scripts
    - documented that `public/.htaccess` is copied to `dist/.htaccess`
    - retained Apache rewrite troubleshooting guidance
- Validation:
  - `yarn build:server:with-debug` passes
  - `dist/.htaccess` is present after build
  - `dist/debug-sandbox.html` is present after debug build

## 2026-03-05 - Canonical Component Architecture Audit Added

- Added canonical component architecture audit:
  - `docs/components/COMPONENT_ARCHITECTURE_AUDIT.md`
- Audit covers:
  - current runtime component resolution model
  - monolithic `CustomComponents_FR` risk and naming drift (`Blanks`/`DraggableFillGaps`, `DropDowns`/`SelectExercise`)
  - single-source-of-truth risks caused by custom fallback growth
  - target directory structure for shared components vs domain-scoped custom FR content
  - phased low-risk migration plan and guardrails
- Updated tracker links in:
  - `README.md` (`Migration Trackers` section)

## 2026-03-06 - Custom Component Keys Migrated to Semantic Names (LO1-LO15)

- Replaced numeric custom component keys in LO config with semantic names across:
  - `src/lo-config/first-contact.json`
  - `src/lo-config/about-me.json`
  - `src/lo-config/origins-and-languages.json`
  - `src/lo-config/current-location.json`
  - `src/lo-config/house-and-home.json`
  - `src/lo-config/family-friends-and-neighbours.json`
  - `src/lo-config/opinions-matter.json`
  - `src/lo-config/free-time.json`
  - `src/lo-config/phoning-in-france.json`
  - `src/lo-config/making-arrangements.json`
  - `src/lo-config/going-to-a-cafe.json`
  - `src/lo-config/shopping-in-the-market.json`
  - `src/lo-config/daily-routine.json`
  - `src/lo-config/studying-at-university.json`
  - `src/lo-config/making-arrangements-2.json`
  - `src/lo-config/demo.json`
- Updated custom registry/barrel aliases to semantic exports:
  - `src/components/custom/grammar/index.js`
  - `src/components/custom/pronunciation/index.js`
  - `src/components/custom/exercises/index.js`
  - `src/components/custom/misc/index.js`
- Result:
  - active config no longer references `LO*` / `L*` numeric custom component ids
  - runtime mapping remains stable through alias exports from domain modules
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Semantic ID Cleanup in LO Config + Legacy Composite Removal

- Renamed remaining legacy-style LO config ids to semantic ids:
  - `src/lo-config/current-location.json`
    - `LO4Exercise1` -> `currentLocationNasalRhymeExercise`
  - `src/lo-config/daily-routine.json`
    - `L13ASummersDay` -> `dailyRoutineASummersDay`
  - `src/lo-config/demo.json`
    - `LO9Grammar` -> `phoningInFranceGrammarDemo`
    - `L13ASummersDay` -> `dailyRoutineASummersDay`
    - `L13SummersDayRadioQuiz` -> `dailyRoutineASummersDayRadioQuiz`
- Removed unused legacy composite custom components:
  - deleted `src/components/custom/grammar/legacy-composite-grammar.jsx`
  - removed `OriginsAndLanguagesPronunciationLegacyComposite` from `src/components/custom/pronunciation/origins-and-languages-pronunciation.jsx`
- Validation:
  - `yarn build` passes.

## 2026-03-06 - LO Config Wrapper-Key Normalization (Batch 1)

- Renamed remaining legacy/generic wrapper keys and aligned their `id` values to semantic names in:
  - `src/lo-config/first-contact.json`
    - `phrases2` -> `draggableFillGaps2`
    - `phrases3` -> `draggableFillGaps3`
    - `phrases4` -> `draggableFillGaps4`
  - `src/lo-config/current-location.json`
    - `explanation4` -> `hiddenExplanation2`
  - `src/lo-config/demo.json`
    - `explanation4` -> `explanationSemanticsDemo`
    - `phrases3` -> `draggableFillGapsPhrasesDemo`
- Scope:
  - naming-only cleanup (no component type/behavior changes).
- Validation:
  - `yarn build` passes.

## 2026-03-06 - LO5+ Wrapper-Key Normalization (Batch 2)

- Normalized legacy exercise wrapper keys/ids in LO5+ configs to behavior-based names while keeping component types unchanged.
- Applied to:
  - `src/lo-config/house-and-home.json`
  - `src/lo-config/family-friends-and-neighbours.json`
  - `src/lo-config/opinions-matter.json`
  - `src/lo-config/free-time.json`
  - `src/lo-config/phoning-in-france.json`
  - `src/lo-config/making-arrangements.json`
  - `src/lo-config/going-to-a-cafe.json`
  - `src/lo-config/shopping-in-the-market.json`
  - `src/lo-config/daily-routine.json`
  - `src/lo-config/studying-at-university.json`
  - `src/lo-config/making-arrangements-2.json`
- Key migrations in this batch:
  - `dropdowns*` -> `selectExercise*` (ids aligned)
  - `wordsIntoSlots*` -> `draggableFillGaps*` (ids aligned)
  - `phrases*` (DraggableFillGaps wrappers in exercises) -> `draggableFillGaps*` (ids aligned)
  - `memorycards*` -> `memoryMatchGame*` (ids aligned)
  - `pictureTable1` -> `draggableFillGapsPictures1` (id aligned)
  - `custom1` (Daily Routine exercise wrapper) -> `dailyRoutineASummersDayExercise`
- Follow-up fix included:
  - resolved duplicate wrapper/id collision in `making-arrangements-2.json` by renaming the second draggable wrapper to `draggableFillGaps2`.
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Final Generic Wrapper Cleanup (Batch 3)

- Normalized remaining generic exercise/demo wrapper keys and ids:
  - `answerTable*` -> `typedTransformExercise*` (or `dictationExercise*` where activity copy is “type/listen and write”)
  - `monologues1` (AnswerTable exercise wrappers) -> `dictationExercise4`
  - `groupTable1` -> `draggableFillGapsGroupTable1`
  - `radio2` -> `radioQuiz2`
  - `group2` (exercise/demo grouping wrapper) -> semantic group ids (`participlesGroup`, `wordGridGroup`)
  - `memorycards*` -> `memoryMatchGame*` (demo)
  - `dropdowns1` -> `selectExercise1` (demo)
  - `wordsIntoSlots*` -> `draggableFillGaps*` (demo)
- Applied to:
  - `src/lo-config/phoning-in-france.json`
  - `src/lo-config/shopping-in-the-market.json`
  - `src/lo-config/studying-at-university.json`
  - `src/lo-config/making-arrangements.json`
  - `src/lo-config/making-arrangements-2.json`
  - `src/lo-config/demo.json`
  - `src/lo-config/answer-table-test.json`
- Scope:
  - naming-only cleanup in config wrappers/ids; no runtime component logic changes.
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Component Value Migration (Batch 4)

- Replaced legacy config component values across FR configs:
  - `DropDowns` -> `SelectExercise`
  - `AnswerTable` -> `TypedTransformExercise` (transform/table tasks)
  - `AnswerTable` -> `DictationExercise` (listen-and-type dictation tasks)
- Applied in:
  - `src/lo-config/answer-table-test.json`
  - `src/lo-config/daily-routine.json`
  - `src/lo-config/demo.json`
  - `src/lo-config/family-friends-and-neighbours.json`
  - `src/lo-config/free-time.json`
  - `src/lo-config/going-to-a-cafe.json`
  - `src/lo-config/house-and-home.json`
  - `src/lo-config/making-arrangements.json`
  - `src/lo-config/making-arrangements-2.json`
  - `src/lo-config/opinions-matter.json`
  - `src/lo-config/phoning-in-france.json`
  - `src/lo-config/shopping-in-the-market.json`
  - `src/lo-config/studying-at-university.json`
- Notes:
  - naming/typing cleanup only in config; no runtime logic changes.
  - compatibility switch-cases remain in `App.jsx` for safe fallback while external legacy configs may still exist.
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Remove Legacy App Component Aliases (Batch 5)

- Removed legacy runtime switch-case aliases in `src/App.jsx` for:
  - `AnswerTable`
  - `DropDowns`
- Canonical exercise components now used directly:
  - `SelectExercise`
  - `TypedTransformExercise`
  - `DictationExercise`
- Notes:
  - aligns runtime with completed FR config migration; reduces architecture drift and alias maintenance burden.
- Validation:
  - `yarn build` passes.

## 2026-03-06 - Added Changed-File Lint Workflow

- Added changed-file lint helper script:
  - `scripts/lint-changed.sh`
  - supports:
    - `--against <ref>` (default `origin/main`)
    - `--staged`
- Added package scripts:
  - `lint:changed`
  - `lint:changed:staged`
- Updated `README.md` manual checks to document changed-file lint commands.
- Goal:
  - enforce lint on touched files while global historical lint baseline is still being burned down.

## 2026-03-05 - Custom Component Extraction Completed for Active LOs

- Completed Phase 1 extraction of active custom LO components out of monolithic:
  - source monolith (legacy): `src/components/CustomComponents_FR/CustomComponents_FR.jsx`
  - new source-of-truth domains:
    - `src/components/custom/grammar/*.jsx`
    - `src/components/custom/pronunciation/*.jsx`
    - `src/components/custom/exercises/*.jsx`
    - `src/components/custom/misc/*.jsx`
- Extracted and rewired active config-mapped keys for LO1-LO15 usage:
  - grammar: `LO1Grammar1/2`, `LO2Grammar1/2/3`, `LO3Grammar1/2/3`, `LO4Grammar1`, `LO5Grammar`, `LO6Grammar`, `LO7Grammar`, `LO8Grammar`, `LO9Grammar`, `L10Grammar`, `L11Grammar`, `L12Grammar`, `L13Grammar`, `L14Grammar`, `L15Grammar`
  - pronunciation: `LO1Demystify1-4`, `LO2Pronunciation1/2`, `LO3Pronunciation1/2/3`, `LO4Pronunciation1/2/3`, `LO5Demystify`, `LO6Demystify`, `LO7Demystify`, `LO8Demystify`, `LO9Demystify`, `L10Demystify`, `L12Demystify`
  - misc/exercise: `L13ASummersDay`, `LO4EX1`
- Registry updates:
  - `src/components/custom/registry.js` now composes `grammar + pronunciation + exercises + misc` as the runtime custom component map.
- Compatibility:
  - `src/components/CustomComponents_FR/index.js` still re-exports from `@/components/custom`.
  - legacy monolith file `src/components/CustomComponents_FR/CustomComponents_FR.jsx` removed after final extraction.
- Validation:
  - `yarn build` passes.
  - `yarn eslint src/components/custom --ext js,jsx` passes with warnings only (no errors).

## 2026-03-05 - Utility Refactor Phase 1 (Module Extraction + Compatibility Facade)

- Added focused utility modules:
  - `src/utils/assets.js`
  - `src/utils/network.js`
  - `src/utils/dom.js`
  - `src/utils/audioPlayback.js`
  - `src/utils/exerciseDiff.js`
  - `src/utils/audioConcat.js`
- Converted `src/utility.js` to a compatibility facade that re-exports extracted functions while keeping remaining legacy helpers unchanged.
- Migrated concatenated playlist import to canonical module path:
  - `src/components/AudioClip/ConcatenatedPlayList.jsx` now imports from `src/utils/audioConcat.js`
- Added compatibility shim:
  - `src/audioutility.js` now re-exports from `src/utils/audioConcat.js` to avoid breaking older imports during transition.
- Validation:
  - `yarn build` passes after extraction.

## 2026-03-05 - Utility Refactor Phase 3 Batch (Callsite Migration)

- Migrated extracted-domain imports away from `src/utility.js` into focused modules across app/components:
  - `src/utils/assets.js`
  - `src/utils/network.js`
  - `src/utils/dom.js`
  - `src/utils/audioPlayback.js`
  - `src/utils/exerciseDiff.js`
- Updated callsites in:
  - `src/App.jsx`
  - `src/components/AudioClip/AudioClip.jsx`
  - `src/components/AnswerTable/AnswerTableRuntime.jsx`
  - `src/components/PhraseTable/PhraseTable.jsx`
  - `src/components/MainMenu/MainMenu.jsx`
  - `src/components/Monologue/Monologue.jsx`
  - `src/components/ReadAloud/ReadAloud.jsx`
  - `src/components/RadioQuiz/RadioQuiz.jsx`
  - `src/components/SequenceAudioController/SequenceAudioController.jsx`
  - and resolveAsset consumer components/debug modules.
- Remaining `src/utility.js` imports are now limited to non-extracted legacy helpers (`shuffleArray`, `copyObject`, `isTouchChrome`, `speak`).
- Validation:
  - `yarn build` passes after migration batch.

## 2026-03-05 - Utility Refactor Phase 3 Completion (Legacy Helpers Extracted)

- Extracted remaining helper domains from `src/utility.js`:
  - `src/utils/collections.js` (`copyObject`, `shuffleArray`)
  - `src/utils/device.js` (`isTouchChrome`)
  - `src/utils/speech.js` (`speak`)
- Updated app/component imports to use focused modules directly:
  - `src/App.jsx`
  - `src/components/Mockney/Mockney.jsx`
  - `src/components/ConnectFour/ConnectFour.jsx`
  - `src/components/Blanks/Blanks.jsx`
  - `src/components/SequenceOrder/SequenceOrder.jsx`
- `src/utility.js` now re-exports these helpers from focused modules (compatibility facade remains intact).
- Validation:
  - `yarn build` passes after final extraction batch.

## 2026-03-05 - Utility Refactor Finalization (Legacy Utility Files Removed)

- Removed legacy compatibility utility files after migration completion:
  - `src/utility.js`
  - `src/audioutility.js`
- Verified there are no remaining runtime imports to these paths.
- Utility source of truth is now fully under `src/utils/*`.
- Validation:
  - `yarn build` passes after legacy file removal.

## 2026-03-05 - Utility Refactor Planning Docs Added

- Added utility refactor planning/documentation set:
  - `docs/components/UTILITY_REFACTOR_README.md`
  - `docs/components/UTILITY_REFACTOR_TODO.md`
  - `docs/components/UTILITY_REFACTOR_CHECKLIST.md`
- Scope covered in docs:
  - current split analysis (`utility.js` vs `audioutility.js` vs `utils/*`)
  - target module structure under `src/utils/`
  - compatibility-facade strategy for safe migration
  - phased execution and per-batch verification gates
- Updated tracker links in:
  - `README.md` (Migration Trackers section)

## 2026-03-05 - LO Config Content Notation Standardization

- Standardized learner-facing compact notation across all LO config files in:
  - `src/lo-config/*.json`
- Standard applied:
  - gender-inclusive compact forms now use `(e)` (replacing `.e`)
  - optional plural notation now uses `(s)` without leading spacing (replacing `word (s)`)
- Why:
  - removes mixed editorial notation drift between LOs
  - improves consistency for learners and maintainers
  - makes automated QA/search for notation patterns reliable
- Examples normalized:
  - `marié.e` -> `marié(e)`
  - `né.e` -> `né(e)`
  - `horse (s)` -> `horse(s)`
  - `Enchanté.e` -> `Enchanté(e)`

## 2026-03-04 - Portable Build Base Path (Folder-Agnostic Deploys)

- Updated Vite base-path strategy in:
  - `vite.config.js`
- Change:
  - from fixed `base: '/projects/french-basic/'`
  - to configurable `base: process.env.VITE_BASE_PATH || './'`
- Result:
  - default builds are now path-agnostic and can be deployed under any directory name (for example `/french/`, `/fr/`, `/projects/french-basic/`) without rebuild-specific coupling.
  - environments that require a fixed mount path can still set `VITE_BASE_PATH` at build time.

- Documentation updates:
  - `README.md` now reflects portable default URLs and includes build examples for both portable and fixed-path modes.
  - `FUTURE_PROJECTS.md` updated to carry this base-path rule into new projects.

## 2026-03-05 - Slug-Path Canonical Routing + French-Only Runtime

- Updated runtime routing and loading in:
  - `src/App.jsx`
  - `src/components/LandingPage/LandingPage.jsx`
  - `src/debug/components/LearningObjectStructureSummary.jsx`
- Changes:
  - LO selection now resolves primarily from slug path URLs (for example `/first-contact/`), with legacy `?lo=` fallback support.
  - runtime no longer reads `?lang=`; language source is fixed for this app.
  - index/config fetch paths are fixed to French:
    - `src/index-fr.json`
    - `src/learningObjectConfigurations/fr/*.json`
  - debug LO summary fetch now uses base-aware asset resolution (`resolveAsset`) to avoid path drift under prefixed routes.

## 2026-03-05 - JSON Config Refactor Audit Baseline

- Added:
  - `docs/process/JSON_CONFIG_REFACTOR_AUDIT.md`
- Includes:
  - runtime consumption contract for JSON keys (`App.jsx` normalization behavior)
  - LO1 (`src/lo-config/1.json`) audit findings:
    - dead/legacy keys
    - alias key drift (`infoTextHTML` vs `informationTextHTML`)
    - content-style drift notes
  - reusable project-wide rules/checklist for auditing all remaining LO config files
- Updated:
  - `README.md` migration tracker links now include the JSON audit baseline doc.

## 2026-03-05 - JSON Mapping Decision (Anti-Drift)

- Decision documented in:
  - `docs/process/JSON_CONFIG_REFACTOR_AUDIT.md`
  - `README.md`
- Locked approach:
  - migrate LO config mapping to slug-only filenames (`src/lo-config/<slug>.json`)
  - no dual compatibility fallback (`file` + `slug`) during migration
  - each LO migration must be atomic: rename config file + update index mapping + smoke test in one pass.

## 2026-03-04 - LO4 Exercise 3 Migration to SelectExercise

- Migrated LO4 exercise 3 ("Where do you live?") from legacy `DropDowns` to `SelectExercise` in:
  - `src/learningObjectConfigurations/fr/4.json`
- Config updates:
  - key/id: `dropdowns4` -> `selectExercise3`
  - component: `"DropDowns"` -> `"SelectExercise"`
  - added `informationTextHTML` with shared icon-cue pattern (`Check answers`, `Show answer`, `Reset`)
- Result:
  - LO4 exercise flow now aligns with LO2 "Answering Questions" interaction model.
  - LO4 exercises no longer depend on `DropDowns`.

## 2026-03-04 - InlineChoiceGroup Optional Sampling/Shuffle + LO4 Exercise 2 Migration

- Added backward-compatible randomization contract to:
  - `src/components/InlineChoiceGroup/InlineChoiceGroup.jsx`
- New optional config fields:
  - `shuffleItems` (boolean; default behavior unchanged when omitted)
  - `sampleSize` (number; limits visible exercise rows to a subset)
  - `sampleOnReset` (boolean; defaults to refresh subset on reset when sampling is enabled)
- Runtime behavior:
  - if randomization fields are omitted, `InlineChoiceGroup` behavior is unchanged.
  - when enabled, subset/shuffle is applied on initial load and reset.

- Migrated LO4 exercise 2 to inline-choice interaction:
  - `src/learningObjectConfigurations/fr/4.json`
  - component switch: `DropDowns` -> `InlineChoiceGroup`
  - id/key update: `dropdowns3` -> `inlineChoiceGroup3`
  - added instructional alert text with shared check/eye/reset icon cues
  - normalized each row into full-sentence prompts (`Ma famille habite ...`) for inline-choice clarity
  - enabled config:
    - `shuffleItems: true`
    - `sampleSize: 8`

- Documentation sync:
  - updated `README.md` inventory and migration notes for LO4 exercise 2
  - documented `InlineChoiceGroup` optional randomization contract for future LO reuse

## 2026-03-03 - Shared Learning Table Variant + LO4 Grammar Table Alignment

- Added shared table variant support in:
  - `src/components/ui/table.jsx`
  - new variant: `learning`
- Updated PhraseTable to use shared learning variant:
  - `src/components/PhraseTable/PhraseTable.jsx`
- Updated LO4 grammar reference table to use the same shared learning variant:
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO4Grammar1`)
- Removed redundant PhraseTable-only table skin rules now covered by the shared variant:
  - `src/index.css`
  - removed duplicated rules for table top margin, row background, and row hover color in `.phrases-table-container ...`
- Result:
  - dialogue/vocabulary and LO4 grammar tables are now aligned through a shared shadcn table variant path, reducing per-section styling drift.

## 2026-03-03 - Future LO Refactor Master Checklist

- Added cross-LO process checklist:
  - `FUTURE_LO_REFACTOR_CHECKLIST.md`
- Checklist covers:
  - audio migration and cleanup safety
  - section architecture parity checks
  - grammar/pronunciation consistency checks
  - exercise semantic naming checks
  - table variant consistency checks
  - accessibility/regression/build validation
  - documentation sync (no drift)

## 2026-03-02 - LO4 Audio Migration + Legacy Cleanup

- Migrated LO4 legacy audio refs from `sounds/fr/...` to `audio/lo4/...` in:
  - `src/learningObjectConfigurations/fr/4.json`
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO4Demystify`, `LO4EX1`)
- Added LO4 migration map and blocker docs:
  - `AUDIO_LO4_MIGRATION_MAP.md`
  - `LO4_AUDIO_BLOCKERS.md`
- Migration summary:
  - 61 unique legacy refs mapped
  - 62 references rewritten (both `/sounds/fr/ain.mp3` and `sounds/fr/ain.mp3` forms)
  - 62 files copied to `public/audio/lo4/...`
  - 0 missing source files for LO4 migration scope
- Legacy cleanup:
  - deleted 59 LO4 legacy source files from `public/sounds/fr` that had no remaining references anywhere in `src`.
  - retained 3 shared files still referenced outside LO4:
    - `sounds/fr/aimer.mp3`
    - `sounds/fr/jardin.mp3`
    - `sounds/fr/peinture.mp3`

## 2026-02-26 - Typed Exercise Runtime Decoupling (Baby Step)

- Added shared runtime component:
  - `src/components/AnswerTable/AnswerTableRuntime.jsx`
- Kept `AnswerTable` as a thin compatibility wrapper over runtime:
  - `src/components/AnswerTable/AnswerTable.jsx`
- Updated semantic exercise wrappers to import runtime directly (not `AnswerTable`):
  - `src/components/TypedTransformExercise/TypedTransformExercise.jsx`
  - `src/components/DictationExercise/DictationExercise.jsx`
- Added explicit intent and split TODO markers in semantic wrappers/runtime to guide next phase (`TypedTransformExercise` vs `DictationExercise` behavior divergence) without changing current UX.

## 2026-02-26 - Dictation-Only Normalization (Behavior Divergence Step 1)

- Added optional comparison mode support to `highlightTextDiff` in `src/utility.js`.
- Implemented dictation normalization mode (used only by `DictationExercise`):
  - normalizes apostrophe variants
  - ignores trivial punctuation differences
  - ignores extra whitespace differences
  - keeps accents strict
- Wired comparison options through:
  - `src/components/AnswerTable/AnswerTableRuntime.jsx`
  - `src/components/Monologue/Monologue.jsx`
- Enabled dictation mode only in:
  - `src/components/DictationExercise/DictationExercise.jsx`
- `TypedTransformExercise` remains strict/unchanged.

## 2026-02-26 - `Blanks` -> `DraggableFillGaps` Semantic Rename (FR Configs)

- Added semantic wrapper component:
  - `src/components/DraggableFillGaps/DraggableFillGaps.jsx`
  - `src/components/DraggableFillGaps/index.js`
- Updated app render switches to support canonical `DraggableFillGaps` while keeping legacy `Blanks` alias for backward compatibility:
  - `src/App.jsx`
  - `src/components/index.js`
- Migrated all FR config usages from:
  - `"component": "Blanks"` -> `"component": "DraggableFillGaps"`
  - scope: `src/learningObjectConfigurations/fr/*.json` (including `demo.json`)
- Updated debug structure summary component categorization to include `DraggableFillGaps`:
  - `src/debug/components/LearningObjectStructureSummary.jsx`

## 2026-02-26 - LO1 Exercise Audio Folder Naming Alignment

- Aligned LO1 exercise audio folder names to semantic activity naming for `DraggableFillGaps`:
  - `public/audio/lo1/exercises/phrases2` -> `public/audio/lo1/exercises/draggableFillGaps2`
  - `public/audio/lo1/exercises/phrases3` -> `public/audio/lo1/exercises/draggableFillGaps3`
  - `public/audio/lo1/exercises/phrases4` -> `public/audio/lo1/exercises/draggableFillGaps4`
- Updated LO1 config audio references in:
  - `src/learningObjectConfigurations/fr/1.json`
- Result:
  - LO1 exercise folder naming now reflects active semantic component naming and avoids legacy key drift.

## 2026-02-26 - LO2 Audio/ID Drift Alignment (`misc` + `dropdowns4`)

- Realigned LO2 monologue audio bucket to section-based structure:
  - `public/audio/lo2/misc/...` -> `public/audio/lo2/monologues/monologues1/...`
- Realigned LO2 exercise audio bucket to semantic component naming:
  - `public/audio/lo2/exercises/dropdowns4/...` -> `public/audio/lo2/exercises/selectExercise2/...`
- Updated LO2 config references and ids in:
  - `src/learningObjectConfigurations/fr/2.json`
  - `monologues` now points to `audio/lo2/monologues/monologues1/...`
  - exercise ids updated:
    - `dropdowns3` -> `inlineChoiceGroup1`
    - `dropdowns4` -> `selectExercise2`
- Validation:
  - all `audio/lo2/...` references in LO2 config resolve to existing files.

## 2026-02-26 - LO3 Exercise Audio Convention Alignment (Semantic Folders + 001 Naming)

- Refactored LO3 exercise audio assets to align with current semantic component usage and sequential naming:
  - `public/audio/lo3/exercises/inlineChoiceGroup1`
  - `public/audio/lo3/exercises/inlineChoiceGroup2`
  - `public/audio/lo3/exercises/typedTransformExercise3`
  - `public/audio/lo3/exercises/typedTransformExercise4`
  - `public/audio/lo3/exercises/dictationExercise5`
- Renamed files in these folders to `001-...`, `002-...` sequence order per exercise.
- Updated all LO3 exercise audio refs in:
  - `src/learningObjectConfigurations/fr/3.json`
- Removed legacy LO3 exercise audio folders that no longer match active component names:
  - `public/audio/lo3/exercises/dropdowns1`
  - `public/audio/lo3/exercises/dropdowns2`
  - `public/audio/lo3/exercises/AnswerTable1`
  - `public/audio/lo3/exercises/AnswerTable2`
- Validation:
  - all `audio/lo3/exercises/...` refs in LO3 config resolve to existing files.

## 2026-02-25 - AnswerTable Semantic Wrapper Migration (LO3 Exercises 3/4/5)

- Added semantic exercise wrappers (no behavior change, DRY migration layer):
  - `src/components/TypedTransformExercise/TypedTransformExercise.jsx`
  - `src/components/TypedTransformExercise/index.js`
  - `src/components/DictationExercise/DictationExercise.jsx`
  - `src/components/DictationExercise/index.js`
- Wired new component names into app render paths:
  - `src/App.jsx` (tab and accordion switches)
  - `src/components/index.js` exports
- Migrated LO3 exercise config from generic `AnswerTable` names to semantic names:
  - `answerTable1.component` -> `TypedTransformExercise`
  - `answerTable2.component` -> `TypedTransformExercise`
  - `answerTable3.component` -> `DictationExercise`
- Prior low-risk structure split retained:
  - `3. Practise masculine and feminine forms: Adjectives`
  - `4. Practise masculine and feminine forms: Professions`
  - `5. Practise your listening skills`
- Important:
  - this step intentionally keeps shared runtime behavior through `AnswerTable` under the wrappers.
  - audio folder/path refactor remains a separate follow-up phase.

## 2026-02-25 - Cross-LO Exercise Heading Consistency Normalization (LO1-LO15)

- Standardized exercise heading formatting across LO configs (`src/learningObjectConfigurations/fr/1.json` to `15.json`, where applicable):
  - removed trailing full stops from `titleText` / `titleTextHTML` headings
  - normalized accidental double spaces in titles
  - normalized numbered prefixes to `N. ` format where legacy entries used `N ` (for example `3 Practise...` -> `3. Practise...`)
- LO2 alignment:
  - exercise headings are now numbered to match the established pattern used by other LOs.
- Scope intentionally limited to heading text fields for consistency; exercise behavior/components were not changed by this pass.

## 2026-02-25 - LO3 Exercise 1 Migration to InlineChoiceGroup + Naming Roadmap Docs

- Migrated LO3 Exercise 1 (`dropdowns2`) from `DropDowns` to `InlineChoiceGroup` in:
  - `src/learningObjectConfigurations/fr/3.json`
- Why:
  - aligns LO3 exercise behavior with LO2 “Practise the verb” interaction model (inline option buttons instead of select dropdown).
  - reduces drift between similar activity types.
- UI consistency update:
  - updated `src/components/InlineChoiceGroup/InlineChoiceGroup.jsx` so row audio icons render on the left side first for exercise parity.
- Documentation:
  - updated `README.md` with a new “Exercise Component Naming & Semantic Refactor Plan” section.
  - recorded migration strategy to move from legacy names (for example `Blanks`) to behavior-first semantic names through phased, QA-first rollout.

## 2026-02-25 - LO3 Grammar/Pronunciation Consistency Pass (LO1/LO2 Parity)

- Grammar and Usage (LO3) consistency updates:
  - moved the `médecin` exception note to a standalone `Info` warning alert positioned immediately after the related consonant-ending rule item (not at section end).
  - kept inline `AudioClip` playback inside the warning alert for `médecin`.
  - normalized inline spacing around emphasized tokens in JSX with explicit React spaces (`{' '}`) to prevent render drift such as `eis`/`neis`.
- Emphasis styling consistency (single source of truth):
  - updated `src/index.css` so both grammar and pronunciation sections share the same amber emphasis token behavior for inline emphasis in content (`em`/`strong`), while retaining `grammar-term-em` compatibility.
  - section scope is now consistent across LO1/LO2/LO3 grammar + pronunciation rendering paths.
- Documentation sync:
  - updated architecture/status docs to reflect parity hardening work and spacing/emphasis guardrails.

## 2026-02-24 - LO3 Nav Gap Fix + Dropdown Migration Documentation Sync

- Fixed LO3 top-nav visual gap between `Vocabulary` and `Grammar`.
  - Root cause: LO3 includes top-level `phraseTable5` with an empty label (`titleText: ""`), which created a blank nav entry.
  - Code fix: updated `src/components/MainMenu/MainMenu.jsx` to exclude nav entries whose resolved label is empty/whitespace.
- Documentation sync for SelectExercise migration:
  - Updated `README.md` with explicit manual migration policy for remaining `DropDowns` usages from LO3 onward.
  - Updated:
    - `DROPDOWNS_TO_SELECTEXERCISE_TODO.md`
    - `DROPDOWNS_TO_SELECTEXERCISE_CHECKLIST.md`
  - Added explicit requirement to manually migrate and QA each LO3+ dropdown exercise one-by-one (no bulk switch).

## 2026-02-24 - LO3 Audio Migration + Legacy Cleanup

- Migrated LO3 legacy audio refs from `sounds/fr/...` to `audio/lo3/...` in:
  - `src/learningObjectConfigurations/fr/3.json`
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO3Grammar`, `LO3Demystify`)
- Added LO3 migration map and blocker docs:
  - `AUDIO_LO3_MIGRATION_MAP.md`
  - `LO3_AUDIO_BLOCKERS.md`
- Migration summary:
  - 140 unique legacy refs mapped
  - 140 files copied to `public/audio/lo3/...`
  - 0 missing source files for LO3 migration scope
- Legacy cleanup:
  - deleted 121 LO3 legacy source files from `public/sounds/fr` that were no longer referenced anywhere in `src`.

## 2026-02-24 - LO2 SelectExercise Pilot + Option Shuffle

- Added new exercise component:
  - `src/components/SelectExercise/SelectExercise.jsx`
  - `src/components/SelectExercise/index.js`
  - exported in `src/components/index.js`
- Wired app renderer support in `src/App.jsx` for `component: "SelectExercise"` in both tab and accordion paths.
- Migrated only LO2 final exercise to pilot the new component:
  - `src/learningObjectConfigurations/fr/2.json`
  - `dropdowns4.component`: `"DropDowns"` -> `"SelectExercise"`
- New behavior in `SelectExercise`:
  - stacked card rows (audio left + French prompt + full-width select)
  - deferred validation flow (`Check answers`, `Reset`, `Show answers`)
  - per-row status icon slot with fixed width to prevent layout shift on check
  - option order shuffles on first load and reshuffles on reset
  - option order stays stable during checking/review

## 2026-02-20 - LO1/LO2 Grammar Architecture Drift Fix

- Identified root cause of visual/spacing drift in grammar:
  - LO1 grammar used config-driven `Group` architecture rendered by shared app accordion pipeline.
  - LO2 grammar used a monolithic custom component (`LO2Grammar`) with nested accordion rendering inside the component.
- Implemented architecture alignment for LO2:
  - updated `src/learningObjectConfigurations/fr/2.json` grammar section to `component: "Group"` with 3 child grammar items.
  - added focused LO2 grammar components in `src/components/CustomComponents_FR/CustomComponents_FR.jsx`:
    - `LO2Grammar1`
    - `LO2Grammar2`
    - `LO2Grammar3`
  - kept legacy `LO2Grammar` class in place for backward safety while new config uses split components.
- Added per-item blue instructional `Info` alerts for the 3 LO2 grammar accordions to match LO1 instructional pattern.
- Instruction rendering parity hardening:
  - `instructionsText` and `instructionsLayout.paragraph` now accept HTML content through the same sanitized rendering path as HTML fields.
  - centralized instruction-callout typography to reduce per-path drift.
- Added grammar-term emphasis class usage (`grammar-term-em`) and aligned LO1/LO2 key terms styling in instructional text.
- Documentation updated to prevent future architecture drift:
  - `README.md`
  - `GRAMMAR_TODO.md`
  - `GRAMMAR_TASK_CHECKLIST.md`
  - `FUTURE_PROJECTS.md`

## 2026-02-20 - LO2 Grammar Accordion Parity (Option 1)

- Implemented the agreed short-term architecture choice for LO2 Grammar:
  - switched `LO2Grammar` from direct shadcn accordion primitives to the existing `AccordionArticle` wrapper used by LO1.
- File updated:
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx`
- Result:
  - LO2 grammar now inherits the same accordion hover animation, open/close behavior, and card framing as LO1.
  - existing grammar content/audio links were preserved.
  - `subject-pronouns` targeting remains wired via `target="subject-pronouns"` on the third accordion item.
- Architectural decision recorded in docs:
  - short-term: reuse `AccordionArticle` for parity and low risk.
  - long-term: build a shared shadcn-native `LessonAccordion` abstraction for cross-LO/future-project reuse.
  - docs updated: `GRAMMAR_TODO.md`, `GRAMMAR_TASK_CHECKLIST.md`, `README.md`, `FUTURE_PROJECTS.md`.

## 2026-02-20 - LO2 Grammar Unification Planning + Docs

- Completed a focused architectural review for LO2 Grammar to align design and behavior with LO1 patterns.
- Documented identified issues:
  - LO2 Grammar is monolithic (`LO2Grammar`) vs LO1 grouped structured grammar sections.
  - heading and table semantics in LO2 grammar content may trigger accessibility alerts.
  - LO2 subject-pronoun modal links currently resolve only heading fallback content instead of full explanatory body.
  - LO2 grammar/pronunciation audio interaction style needs consistency review against LO1 `AudioClip` patterns.
- Added planning docs:
  - `GRAMMAR_TODO.md`
  - `GRAMMAR_TASK_CHECKLIST.md`
- Updated `README.md` with a dedicated "LO2 Grammar Unification (planned)" section and links to grammar planning docs.
- Ran markdown drift check and fixed remaining stale absolute-path references for:
  - `README.md`
  - `TASKS_COMPLETED.md`

## 2026-02-18 - LO2 Monologues Instruction Copy Update

- Updated LO2 monologues section instruction text in:
  - `src/learningObjectConfigurations/fr/2.json`
- Removed legacy image-only instruction (`handshake.png`) and replaced it with clear instructional sentence copy aligned with the dialogues style:
  - "This section introduces a series of short monologues to show how to introduce oneself and describe personal situations and professions in French."

## 2026-02-18 - Single-Accordion Default Open + Docs Sync

- Updated accordion rendering in `src/App.jsx`:
  - added recursive accordion counting per top-level section.
  - if a section contains exactly one accordion, it now opens by default.
  - if a section contains multiple accordions, default remains collapsed.
  - existing session persistence still takes precedence (`<id>-expanded` in `sessionStorage`).
- Added in-code comments explaining:
  - why accordion count is recursive,
  - why default-open applies only to single-accordion sections,
  - and why persisted user state must override default.
- Synced docs to prevent drift:
  - `README.md`
  - `TASKS_COMPLETED.md`
  - `ACCORDION_TASKS_COMPLETED.md`
  - `FUTURE_PROJECTS.md` (carry-forward rule for future repos)

## 2026-02-18 - LO2 Audio Migration Phase 1 (Mapping)

- Added `AUDIO_LO2_MIGRATION_MAP.md` with a concrete old->new LO2 audio mapping plan.
- Mapping scope includes:
  - `src/learningObjectConfigurations/fr/2.json`
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO2Grammar`, `LO2Demystify`)
- Output:
  - 78 unique legacy `sounds/fr/...` refs mapped to proposed `audio/lo2/...` paths.
  - 3 missing source refs identified as blockers prior to copy/rewrite:
    - `sounds/fr/Je m'appelle.mp3`
    - `sounds/fr/Je m&apos;appelle.mp3`
    - `sounds/fr/Salut.mp3`

## 2026-02-18 - LO2 Audio Migration Phase 2 (Copy + Rewrite)

- Executed LO2 migration for all existing mapped audio refs.
- Copied 75 files into new LO2 structure under:
  - `public/audio/lo2/vocabulary/...`
  - `public/audio/lo2/grammar/grammar-and-usage/...`
  - `public/audio/lo2/pronunciation/demystify/...`
  - `public/audio/lo2/exercises/dropdowns4/...`
  - `public/audio/lo2/misc/...`
- Rewrote LO2 references from `sounds/fr/...` to `audio/lo2/...` in:
  - `src/learningObjectConfigurations/fr/2.json`
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (LO2Grammar/LO2Demystify blocks)
- Initial blockers were documented and then resolved in a follow-up pass (see next section).

## 2026-02-18 - LO2 Audio Blocker Resolution (Fallback Pass)

- Resolved the 3 LO2 blocker refs that had no exact legacy source files:
  - `sounds/fr/Je m'appelle.mp3`
  - `sounds/fr/Je m&apos;appelle.mp3`
  - `sounds/fr/Salut.mp3`
- Added fallback LO2 assets:
  - `public/audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3` (seeded from `public/audio/lo1/vocabulary/022-je-mappelle.mp3`)
  - `public/audio/lo2/pronunciation/demystify/016-salut.mp3` (seeded from `public/audio/lo1/vocabulary/004-salut.mp3`)
- Rewrote final LO2 occurrences in:
  - `src/learningObjectConfigurations/fr/2.json`
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO2Demystify`)
- Also patched one non-LO2 usage of `Je m'appelle.mp3` to canonical LO1 audio:
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx` line ~2203 now uses `audio/lo1/vocabulary/022-je-mappelle.mp3`.

## 2026-02-18 - Semantic Emphasis Token Styling

- Added named semantic-emphasis tokens in `src/index.css`:
  - `--emphasis-strong-color`
  - `--emphasis-em-color`
- Added base rules scoped to main content:
  - `main strong` uses `--emphasis-strong-color` + `font-weight: 700`
  - `main em` uses `--emphasis-em-color` + `font-style: italic`
- Why:
  - keeps emphasis styling consistent and token-driven;
  - preserves accessibility semantics (color is additive, not the only emphasis cue).

## 2026-02-18 - Semantic Emphasis Normalization (`<i>/<b>` -> `<em>/<strong>`)

- Completed a full FR learning-object content sweep to replace presentational emphasis tags with semantic tags:
  - `<i>` -> `<em>`
  - `<b>` -> `<strong>`
- Files updated:
  - `src/learningObjectConfigurations/fr/1.json`
  - `src/learningObjectConfigurations/fr/2.json`
  - `src/learningObjectConfigurations/fr/3.json`
  - `src/learningObjectConfigurations/fr/4.json`
  - `src/learningObjectConfigurations/fr/6.json`
  - `src/learningObjectConfigurations/fr/10.json`
  - `src/learningObjectConfigurations/fr/11.json`
  - `src/learningObjectConfigurations/fr/12.json`
  - `src/learningObjectConfigurations/fr/answer.json`
  - `src/learningObjectConfigurations/fr/demo.json`
- Why this was done:
  - semantic tags improve accessibility and screen-reader interpretation of emphasis;
  - HTML semantics are clearer and easier to maintain than purely presentational tags;
  - aligns authoring with project policy (`<strong>/<em>` only for inline emphasis).
- Verification:
  - codebase scan now returns no remaining `<i>/<b>` tags in `src` source files.

## 2026-02-18 - Image Migration Foundation (`public/img`)

- Added image migration architecture + rollout doc:
  - `IMAGE_MIGRATION_PLAN.md`
  - includes current image audit tally, target folder contract, phased migration sequence, and safety checks.
- Added new image root docs:
  - `public/img/README.md`
  - defines path and naming policy for all future image drops.
- Scaffolded new image structure:
  - `public/img/common/*`
  - `public/img/shared/*`
  - `public/img/lo1` ... `public/img/lo15`
- Added image guardrails:
  - new script `scripts/check-image-path-guard.sh`
  - blocks new assets in legacy `public/images/`
  - enforces ASCII/lowercase/no-spaces naming for new `public/img` assets
  - blocks newly added legacy path references (`images/`, `/images/`) in source diffs
- Hook + script integration:
  - `.githooks/pre-commit` now runs `yarn -s check:image-path`
  - `package.json` adds `check:image-path` + `check:image-path:branch`
  - `prepush:local` now includes `yarn check:image-path:branch`
- README/Future-project docs updated so guard and folder contract are first-class and reusable.

## 2026-02-18 - Footer Logo Image Migration (Batch 1)

- Migrated live footer logo assets from legacy `public/images` paths into new structure:
  - `public/img/common/footer/ucam-language-centre-horizontal-light.png`
  - `public/img/common/footer/ucam-language-centre-vertical-light.png`
  - `public/img/common/footer/ucam-language-centre-horizontal-dark.png`
  - `public/img/common/footer/ucam-language-centre-vertical-dark.png`
- Updated footer component references in:
  - `src/components/Footer/Footer.jsx`
- Removed path-space dependency from runtime asset URLs by leaving legacy `Language-Centre/.../Reversed colour/...` paths.
- Verified build success after path migration (`yarn build`).

## 2026-02-18 - Banner Image Migration (Batch 2)

- Migrated hero/banner SVG from legacy path:
  - `public/images/fr_banner.svg`
  - to `public/img/common/branding/fr-banner.svg`
- Updated references:
  - `src/App.jsx`
  - `src/debug/components/DebugSvgAssets.jsx`
- Verified build success after migration (`yarn build`).

## 2026-02-18 - Shared Grammar SVG Migration (Batch 3)

- Moved `grammar.svg` from legacy path to shared image root:
  - `public/images/grammar.svg` -> `public/img/shared/grammar.svg`
- Updated references:
  - `src/learningObjectConfigurations/fr/1.json`
  - `src/debug/components/DebugSvgAssets.jsx`
- This keeps the grammar artwork in a cross-LO shared location rather than LO-specific storage.

## 2026-02-18 - LO1 First-Contact SVG Migration (Batch 4)

- Moved LO1-specific `first-contact.svg` into the LO1 image folder:
  - `public/images/first-contact.svg` -> `public/img/lo1/first-contact.svg`
- Updated references:
  - `src/App.jsx` (introduction hero layout image)
  - `src/learningObjectConfigurations/fr/1.json` (LO1 exercises section image)
  - `src/debug/components/DebugSvgAssets.jsx`

## 2026-02-18 - LO2 Intro Image Contract (About Me)

- Fixed intro image behavior in `src/App.jsx`:
  - intro image is now config-driven via `settings.introImage` (supports string or object with `src/alt/caption`)
  - fallback remains LO1 default (`img/lo1/first-contact.svg`) when no intro image is configured
- Updated LO2 config:
  - `src/learningObjectConfigurations/fr/2.json` now sets:
    - `settings.introImage.src = "img/lo2/about-me.svg"`
    - `settings.introImage.alt = "About me themed illustration"`
- Result:
  - LO2 now uses its own LO2-scoped intro image instead of inheriting LO1 artwork.

## 2026-02-18 - LO2 Introduction Rewrite (Instructional Design)

- Rewrote LO2 intro content in `src/learningObjectConfigurations/fr/2.json` to align with the LO1 instructional pattern:
  - replaced generic one-line `settings.intro` text with:
    - `settings.introHTML` (clear lesson purpose + learner action framing)
    - `settings.informationHTML` (explicit outcomes as a "You will learn" list)
- Why:
  - makes objectives clearer to learners before content interaction
  - aligns LO2 onboarding UX with LO1 structure and readability
  - improves instructional specificity (what learners will do and what they should be able to use)

## 2026-02-18 - LO2 Vocabulary Instruction Alignment with LO1

- Updated LO2 vocabulary config in `src/learningObjectConfigurations/fr/2.json` to match LO1 instructional pattern:
  - added `instructionsTextHTML` for section-level framing (alphabetical + semantic views)
  - replaced simple one-line `informationTextHTML` with a structured "You will learn" outcomes list
- Result:
  - LO2 vocabulary now presents instructional guidance consistently with LO1.

## 2026-02-17 - Instruction Schema Drift: Phase 1 Start

- Added a dedicated analysis/migration document:
  - `INFORMATION_CONFIG_ISSUES.MD`
  - captures root cause, target naming strategy, phased migration plan, and checklist.
- Added explicit README TODO coverage for instruction schema unification so this work is visible alongside other architecture tasks.
- Started runtime compatibility normalization in `src/App.jsx`:
  - maps legacy `infoTextHTML`/`infoText` to canonical `informationTextHTML`/`informationText`
  - for `PhraseTable`, maps legacy `instructionsText*` to `informationText*` (and suppresses duplicate instruction fields) so instructional guidance renders through one alert path.

## 2026-02-17 - Vocabulary Alphabetical Sort Fix (PhraseTable)

- Fixed a functional bug in vocabulary sorting:
  - `Alphabetical` and reverse sort were comparing column `0`, which is often an audio filename (`.mp3`), not the visible French term.
  - Result: rows appeared unsorted or incorrectly sorted from a learner perspective.
- Implemented a stable row sort-key extractor in `src/components/PhraseTable/PhraseTable.jsx`:
  - ignore audio-path cells
  - use the first non-audio text cell as the comparison key (French term for LO1 vocabulary)
  - preserve existing accent-insensitive normalization + locale-aware collation
- Why this matters:
  - restores expected learner UX for vocabulary A→Z / Z→A
  - aligns sorting behavior with rendered content, not hidden media metadata
  - prevents regressions where media-path naming silently changes perceived sort order

## 2026-02-15 - Modal-Link Validator Contract Hardening

- Identified a recurring accessibility validation source:
  - LO JSON links authored as direct hashes (for example `href="#tuvous"`) were reported as "Broken same-page link".
- Standardized modal-link authoring contract:
  - use `href="#content"` + `data-modal-target="<id>"` for modal links in config-authored HTML.
  - keep top-nav semantic section hashes for scroll-only navigation.
- Added explicit documentation to prevent regressions:
  - `README.md`
  - `HTML_ACCESSIBILITY_ISSUES.md`
  - `SPECIAL_LINKS.md`
  - `FUTURE_PROJECTS.md`
- Clarified implementation rule:
  - runtime normalization in `App.initialiseModalLinks` is defensive fallback only; source JSON must use the validator-safe pattern directly.

## 2026-02-15 - Layout Table Validation Clarification + Policy

- Added explicit documentation that WAVE snippets containing `chrome-extension://.../table_layout.svg` are extension overlays, not app source DOM.
- Added project-wide rule:
  - flex/grid for layout
  - `<table>` only for true tabular data
  - data tables require `caption` + semantic `th scope` headers
  - legacy layout tables may use `role="presentation"` only as an interim step.
- Added this policy to:
  - `README.md`
  - `HTML_ACCESSIBILITY_ISSUES.md`
  - `FUTURE_PROJECTS.md`
  - `TASKS_COMPLETED.md`

## 2026-02-15 - Table Audit Reference Document

- Added `/Users/ped/Sites/french/french-lo-1/docs/a11y/TABLE_AUDIT_PASS.md`:
  - records how the final two WAVE issues were addressed (`Possible heading`, `Layout table`)
  - defines repeatable table audit checklist (classify data vs layout, semantic requirements, migration/mitigation rules, validation workflow)

## 1) Case Sensitivity (Linux-safe)
- Renamed `src/Components` -> `src/components`.
- Updated all imports to use `src/components` casing.

## 2) Content Cleanup (French-only focus)
Removed non-French language content and assets.

### Removed learning object configs
- Deleted `src/learningObjectConfigurations/de/`
- Deleted `src/learningObjectConfigurations/sp/`
- Deleted `src/config-uae-1.json`
- Deleted `src/config-ukraine-1.json`
- Removed `src/index-sp.json`

### Removed language-specific component sets
- Deleted `src/components/CustomComponents_SP/`
- Removed `AllCustomComponentsSP` import/usages and export from app wiring.

### Removed non-French sounds/images
- Deleted `public/sounds/de/`
- Deleted `public/sounds/sp/`
- Deleted `public/sounds/ukraine/`
- Deleted `public/sounds/arabic-cyclist.mp3`
- Removed non-French images (e.g., UAE, Berlin, Kyiv, flags, etc.).

## 3) Theming Unification (Single source of truth)
Standardized styling on shadcn tokens and reduced hardcoded colors.

### New semantic tokens + helpers
- Added in `src/index.css`:
  - `--ped-affirm`, `--ped-warn`, `--ped-neg`, `--ped-neutral`, `--ped-accent`
  - `.ped-affirm`, `.ped-warn`, `.ped-neg`, `.ped-neutral`, `.ped-accent`

### New custom theme tokens (single source of truth)
- Added in `src/index.css`:
  - `--page-background` (light + dark override)
  - `--hero-title-color` (light + dark override)
  - `--footer-background` (light + dark override)

### Removed skin aliasing
- Deleted `src/styles/_skin.module.scss` and removed its import.
- Removed `--lo-*` alias variables and replaced usage with shadcn tokens.

### Updated component styling to tokens
Multiple SCSS/JSX files were updated to use `var(--foreground)`, `var(--primary)`, `var(--destructive)`, `var(--border)`, etc., instead of hardcoded colors. Key files include:
- `src/App.scss`
- `src/styles/_mixins.module.scss`
- `src/styles/_media-queries.scss`
- `src/styles/_colours.module.scss`
- `src/components/Blanks/*.scss`
- `src/components/Congratulate/Congratulate.scss`
- `src/components/DropDowns/DropDowns.scss`
- `src/components/WordGrid/WordGrid.scss`
- `src/components/TreasureGrid/TreasureGrid.scss`
- `src/components/MemoryMatchGame/*.scss`
- `src/components/WordParts/WordParts.scss`
- `src/components/Jigsaw/*.scss`
- `src/components/LandingPage/LandingPage.scss`
- `src/components/LearningObjectMenu/LearningObjectMenu.scss`
- `src/components/ErrorLog/ErrorLog.scss`
- `src/components/Info/Info.scss`
- `src/components/Form/*/*.scss`
- `src/components/ReadAloud/ReadAloud.scss`
- `src/components/Sortable/Sortable.scss`
- `src/components/Footer/Footer.scss`
- `src/components/Header/Header.scss`
- `src/components/CrossWord/CrossWord.scss`
- `src/components/Monologue/Monologue.scss`
- `src/components/AudioClip/AudioClip.scss`
- `src/components/CustomComponents_FR/CustomComponents_FR.scss`

### Small utility changes
- `src/mouseUtility.js` default debug marker uses `hsl(var(--destructive))`.
- `src/components/Flag/Flag.jsx` now reads theme tokens for canvas shading (with fallbacks).

## 4) SVG and Icon Theming
Converted many icon SVGs to `currentColor` so they inherit CSS color.

### Updated
- `public/images/arrow.svg`
- `public/images/downArrow.svg`
- `public/images/icons/*.svg`
- `src/components/ErrorLog/*.svg`
- `src/components/AudioClip/speaker.svg`

## 5) Footer + Social Logos (currentColor)
- Social icons are now inline SVGs in `src/components/Social/Social.jsx` with CSS-driven color.
- Footer logos (LC/CC/eLearning) use `currentColor` and inherit color from CSS.
- UC language centre PNGs now use only black assets; dark mode inverts via CSS.

## 6) Banner + Layout adjustments
- Banner title uses `h2` (keeps lesson title as the main `h1`).
- Banner title aligned top-left.
- Banner height uses responsive `min-height: clamp(...)` to reduce cropping.
- Banner title size increased and uses `--hero-title-color`.
- Intro section layout updated so the intro paragraph is full width, with the “After completing…” info and image aligned side-by-side on large screens and stacked below `l` (960px).
- `#imagePlaceholder` resized and made responsive on smaller screens.

## 7) Background tones
- Light mode body background uses `--page-background` token (forced at the body level).
- `--color-surface-base` updated to the new warm palette.

## 8) Accordion UI refinements
- Hover and expanded header background uses `--accordion-mist` and titles are forced readable via `--accordion-hover-text`.
- Card content border restored with `border-t-0` and `rounded-t-none` to visually join the header.
- Content border color tuned via CSS (no line under open panels).
- Open/close animation uses max-height transitions with `--radix-accordion-content-height` and reduced motion support.
- Chevron spacing adjusted.

## 9) Vite Static Copy Fix
- Removed Spanish static-copy target from `vite.config.js`.

## 10) CSS Build Fix
- Removed the bottom `@layer base` block from `src/index.css` that used `@apply border-border outline-ring/50;` which was causing a dev-server 500.

## 11) Tooltips (shadcn/Radix)
- Added a shadcn-style Tooltip wrapper at `src/components/ui/tooltip.jsx` using Radix Tooltip and Tailwind tokens.
- Wrapped the app in `TooltipProvider` in `src/App.jsx` for consistent tooltip behavior.
- Replaced native `title` tooltips for vocabulary sort buttons with shadcn tooltips in `src/components/PhraseTable/PhraseTable.jsx`.
- Dialogue audio icons now reuse the same tooltip wrapper + footer-green surface so every audio trigger displays the shadcn-styled hover.

## 17) Dialogue Row Audio + Anchor Highlight (+ Typography + Grammar Layout)
- `src/components/PhraseTable/PhraseTable.jsx` now lets users click anywhere in a phrase row to replay its audio clip, matching the speaker button behavior for faster review.
- Anchored sections now reliably open + flash: `handleSpecialLinkClick` follows `.accordion-article` even after the semantic `<section>` switch, and the target gets a `.flash-target` class that animates with a warm `--ped-warn` glow.
- Inline `.special-anchor` links (normal + visited) use the same `oklch(0.646 0.222 41.116)` orange as the highlight in both global and `.can-speak` contexts so the link visually matches its destination.
- Added typography tokens (`--body-font-size`, `--body-line-height`) and applied them to paragraphs, list items, and table cells via `#content :where(...)` selectors so accordions, tables, and Info blocks share the same intro-scale body text.
- Grammar section image layout is now driven by React/Tailwind components instead of inline JSON styles, keeping the instructions card responsive without hard-coded padding.
- Defined a Tailwind-backed type scale (CSS variables + `theme.extend.fontSize`) so nav, accordion headers, and other components can use `text-sm/base/lg` utilities instead of hardcoded pixel sizes, making font tweaks centralized.
- Next typography pass: introduce CSS vars for the `2xl`/`3xl` sizes, remove redundant aliases, and swap remaining SCSS font-size declarations for Tailwind utilities so the entire UI draws from the same scale.
- Added a dedicated `HeroSection` layout for Introduction + Grammar so their instruction text and illustration live inside the card content with aligned top baselines.

## 12) Semantics: Sections
- Replaced the Introduction wrapper with a `<section>` in `src/App.jsx`.
- Switched top-level learning object blocks to `<section>` by updating `src/components/Accordion/AccordionArticle.jsx`.

## 13) Semantics: Heading cleanup
- Removed unnecessary `<span>` wrappers around plain-text section titles (kept only for `titleHTML`).

## 14) Semantics: Anchor placement
- Moved `special-anchor-target` ids/classes onto the `<h2>` element instead of wrapping it in a `<span>`.

## 15) Separators (shadcn/Radix)
- Added shadcn-style Separator component at `src/components/ui/separator.jsx`.
- Replaced instruction dividers with `Separator` in `src/components/Section/Section.jsx` and `src/components/PhraseTable/PhraseTable.jsx`.

## 16) Audio Path Normalization
- Fixed French audio playback by normalizing asset paths to NFD in `resolveAsset`, matching decomposed accent filenames on disk.

## 17) Modal Links → Modal (shadcn)
- Added a shadcn/Radix Dialog modal for modal links so clicks open contextual explanations instead of scrolling.
- Content is pulled from existing config `infoTextHTML`/`informationTextHTML` (single source of truth).
- Highlighting uses Tailwind classes in the modal; JSON can mark terms with `<span class='modal-highlight'>…</span>` without affecting in-page rendering.
- Removed the back-to-link button and scroll-back logic.

## 18) Modal Link Content Refactor (CustomComponents)
- Modal content for key grammar links (`tuvous`, `toi`, `madame`, `mademoiselle`) now renders the same React bodies from `src/components/CustomComponents_FR/CustomComponents_FR.jsx`, so the modal shows the intended copy and audio clips work.
- The modal dialog now accepts React content explicitly (in addition to HTML strings) because `AudioClip` components cannot render via `dangerouslySetInnerHTML`.
- Modal highlight animation now fades out after flashing (no lingering highlight).

## 18) Inline Audio Icon Consistency
- Normalized inline audio icon size and baseline alignment via `--audio-inline-size` and `--audio-inline-offset` in `src/components/AudioClip/AudioClip.scss`.

## 19) Introduction Card Styling Exception
- The Introduction `HeroSection` now supports a `transparentCard` flag, used for the intro only.
- This removes the white card background, border, and shadow so the Introduction sits on the main page background while other sections keep the default card styling.

## 20) Info Panel Typography
- Reduced info panel list text to `--font-size-sm` (~16px) and set the lead line (`h3`) slightly larger with `--font-size-base`.

## 21) Info Panel Icon
- Switched the Info panel icon to Lucide's `Info` (`lucide-react`) and removed the custom SVG mask.
- Updated the Lucide info icon styling to render as a filled black circle with a white "i".

## 22) Favicon
- Added `public/favicon.svg` using the eLearning logo from the footer and updated `index.html` to reference it.
- Generated PNG favicon assets (16/32), Apple touch icon, Android icons, and `public/site.webmanifest`.

## 23) Theme Toggle Smoothness
- Added a short `no-theme-transition` class during light/dark toggles to suppress CSS transitions and prevent table-row flicker.

## 24) Modal Link Icon
- Modal links now use the Lucide `message-square-warning` indicator icon.

## 25) Modal Link Naming
- Renamed `special-anchor`/`special-anchor-target` to `modal-link`/`modal-link-target` across configs, styles, and handlers.

## 26) WordParts Progress + Guidance
- Added circle-based progress indicators to WordParts and adjusted sizing/spacing for mobile.
- Updated the WordParts instructions to mention Show answer/Reset with inline icons.

## 27) Audio Playback Exclusivity (Single Active Clip)
- Fixed overlapping playback so only one audio clip can play at a time across the app.
- Added global helpers in `src/utility.js`:
  - `trackFloatingAudio` to track `new Audio(...)` instances.
  - `stopAllAudioPlayback` to pause all other active DOM/floating audio before new playback.
- Wired single-audio behavior into:
  - `src/components/AudioClip/AudioClip.jsx` (custom clip playback and native audio play events).
  - `src/components/SequenceAudioController/SequenceAudioController.jsx` (sequence play/resume).
  - `playAudioLink` in `src/utility.js` (row-link fallback playback).

## 27) Hero Banner Rendering (Non-cropping SVG)
- Replaced the hero CSS background banner with an explicit `<img>` in `src/App.jsx` (initially `src="images/fr_banner.svg"`, now migrated to `src="img/common/branding/fr-banner.svg"`), including `loading="eager"` and `fetchPriority="high"` for above-the-fold rendering.
- Updated `#hero` styles in `src/App.scss` to use `aspect-ratio: 16 / 9` and a positioned `.hero-image` with `object-fit: contain` and `object-position: center bottom`.
- Why: the previous `background-size: cover` implementation could crop banner artwork on narrower/wider viewports. The new setup preserves the entire SVG composition across responsive breakpoints while keeping the title overlay in place.

## 28) LO1 Listening Exercise Refactor (5/6/7)
- Renamed legacy exercise keys/ids in `src/learningObjectConfigurations/fr/1.json`:
  - `wordsIntoSlots5` -> `listeningOrder1`
  - `wordsIntoSlots6` -> `listeningOrder2`
  - `sortable1` -> `listeningOrder3`
- Added reusable draggable card UI component:
  - `src/components/SortableWordCard/SortableWordCard.jsx`
- Updated `src/components/SequenceOrder/SequenceOrder.jsx`:
  - swap-on-drop only (no live reorder on hover)
  - drop-target highlight improvements
  - responsive behavior: compact horizontal below ~1180px, vertical below ~900px
  - vertical layout uses up/down icon; horizontal uses left/right icon
  - removed fallback `"Speech"` caption rendering
  - action buttons follow the same hidden/reveal pattern used in other exercises
- Updated `src/components/Sortable/Sortable.jsx`:
  - adopts shared `SortableWordCard` visual style (vertical card look)
  - controls now match other exercises (`Check answers`, `Show answer`, `Reset`)
  - added shared `ProgressDots`
  - progress updates on `Check answers` (not during drag)
  - removed row check/cross indicators and extra textual success/error feedback
  - improved drag/drop stability by using target tracking + swap-on-drop commit
- Updated exercise instruction copy in `src/learningObjectConfigurations/fr/1.json` for consistent guidance and inline icon usage.

## 29) LO1 Exercise 7 Audio Path Migration (Legacy -> audio/lo1)
- Exercise 7 (`listeningOrder3`) audio moved from legacy `sounds/fr/...` references to LO1 sectioned paths in `src/learningObjectConfigurations/fr/1.json`.
- Added new audio files under:
  - `public/audio/lo1/exercises/listeningOrder3/001-homme.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/002-hotel.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/003-hopital.mp3`
  - `public/audio/lo1/exercises/listeningOrder3/004-horrible.mp3`
- Used ASCII-safe filenames (`hotel`, `hopital`) to avoid accented path issues.

## 30) Inline Check Icon Consistency
- Added `public/images/icons/circle-check.svg`.
- Updated `.inline-icon-check` in `src/App.scss` to use the same circular check glyph style as the `Check answers` button icon across instruction text.

## 31) Typography Batch (Token Ownership) + Task Tracker Docs
- Refactored global typography ownership in `src/App.scss`:
  - `body` now uses tokenized base size (`var(--font-size-sm)`)
- Converted global `h1..h6` sizing block in `src/App.scss` from hardcoded rem values to token-based expressions derived from `--font-size-3xl`, preserving the existing visual ratio ladder.
- Updated `README.md` with a `Migration Trackers` section linking active planning/audit documents.
- Added `TASKS_COMPLETED.md` as a live checklist for:
  - typography migration progress
  - color migration progress
  - audio migration progress
  - accessibility/HTML validity phases

## 32) Typography Guard Policy Adjustment (Transition-Friendly)
- Updated `scripts/check-typography-guard.sh` policy:
  - still blocks literal `font-size` with `px/rem/em`
  - still blocks literal `line-height` with `px/rem/em`

## 33) SCSS Removal Completed (One Source of Truth)
- Removed all remaining SCSS source files from `src/`:
  - `src/App.scss`
  - `src/styles/_colours.module.scss`
  - `src/styles/_media-queries.scss`
  - `src/styles/_mixins.module.scss`
  - `src/styles/_variables.module.scss`
- Removed final runtime SCSS import from `src/App.jsx` (`import "./App.scss";`).
- Migrated retained app-level/global CSS output into `src/index.css` to preserve behavior while consolidating ownership.
- Updated debug SVG source manifest references from `/src/App.scss` to `/src/index.css` in `src/debug/components/DebugSvgAssets.jsx`.
- Enforced zero-SCSS baseline in `scripts/check-scss-guard.sh`:
  - fails if any `.scss/.sass` exists under `src/`
  - fails on newly introduced SCSS imports in JS/TS files

Why this was important:
- One source of truth: tokens + Tailwind in `src/index.css` now drive global/custom component styling consistently.
- Better shadcn fit: shadcn/ui is utility/token-first; this architecture removes mixed-system friction.
- Easier maintenance: fewer cascade surprises, clearer diffs, faster refactors, and safer theme/token changes.
  - now allows tokenized `font-family` declarations (`font-family: var(--font-...)`)
  - still blocks literal `font-family` declarations
- Synced docs to prevent policy drift:
  - `README.md`
  - `TYPOGRAPHY_PLAN.md`
  - `TYPOGRAPHY_MIGRATION.md`
  - `TASKS_COMPLETED.md`

## 33) Typography Font-Family Tokenization + Future Project Blueprint
- Updated `src/App.scss` to use tokenized font-family declarations:
  - `body` -> `var(--font-sans)`
  - `h1..h4` -> `var(--font-heading)` with explicit weights
  - `h5..h6` -> `var(--font-sans)` with explicit weight
  - `figure figcaption` -> `var(--font-sans)`
- Added `FUTURE_PROJECTS.md` with:
  - reusable master prompt for new React + Bun + Tailwind + shadcn + Lucide projects
  - strict single-source-of-truth theming policy (no SCSS)
  - recommended modern directory structure (including audio/video/images/svg/fonts)
  - copy-only short prompt for quick reuse
- Updated docs tracker references in `README.md` and progress state in `TASKS_COMPLETED.md`.

## 34) Typography Batch 3 (Small Text Tokenization)
- Updated `src/App.scss`:
  - `figure figcaption` font-size from hardcoded `0.75rem` -> `var(--font-size-xs)`
  - `.footnote` font-size from hardcoded `0.8rem` -> `var(--font-size-xs)`
- Updated `TASKS_COMPLETED.md` to mark Typography batch 3 as complete.

## 35) Typography Batch 4 (PhraseTable Tokenization)
- Updated `src/components/PhraseTable/PhraseTable.scss`:
  - audio-row span size from hardcoded `120%` -> `calc(var(--font-size-base) * 1.2)`
  - mobile span size from hardcoded `1.12rem` -> `calc(var(--font-size-base) * 0.97)`
  - mobile line-height from hardcoded `1.2` -> `var(--line-height-2xl)`
- Updated `TASKS_COMPLETED.md`:
  - marked Typography batch 4 complete
  - noted `MainMenu.scss` is already tokenized for typography sizing.

## 36) Typography Batch 5 (App Heading Rhythm Tokens)
- Updated `src/App.scss` heading rhythm to token-based line-height usage:
  - `h1..h6` line-height from hardcoded `1.2` -> `var(--line-height-2xl)`
  - heading top-margin factors now use `var(--line-height-2xl)` instead of hardcoded `1.2`
- Updated `TASKS_COMPLETED.md` to mark Typography batch 5 as in progress with heading-rhythm work complete.

## 37) Typography Batch 5.1 (App Line-Height Token Expressions)
- Updated `src/App.scss` to replace additional hardcoded line-height literals with token expressions:
  - `.app` line-height from `1.4em` -> `calc(var(--body-line-height) - 0.3)`
  - WordParts table text line-height from `1.3` -> `calc(var(--body-line-height) - 0.4)`
  - responsive WordParts table text line-height from `1.35` -> `calc(var(--body-line-height) - 0.35)`
  - desktop paragraph line-height from `1.6em` -> `calc(var(--body-line-height) - 0.1)`
- Updated `TASKS_COMPLETED.md` with this batch progress under Typography batch 5.

## 38) Typography Batch 5.2 (Speech Overlay Tokenization)
- Updated `src/App.scss` in `#SpeechSynthesisError`:
  - font-size from hardcoded `40px` -> `var(--font-size-2xl)`
  - line-height from hardcoded `60px` -> `calc(var(--font-size-2xl) * 1.5)`
- Why: this keeps overlay typography aligned with the shared token scale, so future global size tuning applies consistently and avoids isolated px-based drift.
- Updated `TASKS_COMPLETED.md` with this sub-step under Typography batch 5.

## 39) Typography Batch 5.3 (Mobile Title Token Expressions)
- Updated `src/App.scss` mobile block (`@media (max-width: 650px)`):
  - `.title-main` font-size from hardcoded `1.6em` -> `calc(var(--font-size-sm) * 1.6)`
  - `.title-sub` font-size from hardcoded `0.9em` -> `calc(var(--font-size-sm) * 0.9)`
- Why: this removes local `em` literals and ties mobile title sizing back to typography tokens, so a future base scale change updates these values consistently.
- Updated `TASKS_COMPLETED.md` to reflect this sub-step under Typography batch 5.

## 40) Accordion Spacing Consistency (Sortable)
- Removed the `noCard={true}` special case for `Sortable` in `src/App.jsx`.
- Updated `src/components/Sortable/Sortable.jsx` to render content-only (no internal `Card`/`CardContent` shell).
- Why: accordion content spacing/card chrome now come from one owner (`AccordionArticle`) for all exercise types, so the final listening exercise matches the other accordion panels.

## 41) Sortable Info-to-Content Spacing Tweak
- Updated `src/components/Sortable/Sortable.jsx`:
  - increased spacing between the blue info panel and the sortable item container from `space-y-1` to `space-y-3`.
- Why: the previous gap was visually too tight in the last exercise; this restores consistent breathing room with the other accordion exercises.

## 42) Typography Batch 5.4 (Desktop Hero XL Tokenization)
- Updated `src/App.scss` (`@include respond-above(xl)`, `#hero h1`):
  - font-size from hardcoded `3rem` -> `calc(var(--font-size-3xl) * 0.75)`
- Why: removes the remaining literal size in that breakpoint and keeps desktop hero scaling tied to the shared typography token system.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 43) Typography Batch 5.5 (Accordion Mobile Line-Height Tokenization)
- Updated `src/components/Accordion/Accordion.scss` (`@media (max-width: 640px)`):
  - heading `line-height` from hardcoded `1.2` -> `var(--line-height-2xl)` (with existing `!important`)
- Why: removes one more hardcoded typography literal and keeps mobile accordion heading rhythm aligned with shared line-height tokens.
- Updated `TASKS_COMPLETED.md` to record this completed sub-step.

## 44) Typography Batch 5.6 (Responsive Hero Clamp Tokenization)
- Updated `src/App.scss` hero heading rules in responsive breakpoints:
  - `@include respond-above(s)`: `clamp(2.2rem, 4vw, 3rem)` -> `clamp(calc(var(--font-size-3xl) * 0.55), 4vw, calc(var(--font-size-3xl) * 0.75))`
  - `@include respond-above(m)`: `clamp(2.4rem, 4vw, 3.5rem)` -> `clamp(calc(var(--font-size-3xl) * 0.6), 4vw, calc(var(--font-size-3xl) * 0.875))`
- Why: keeps responsive hero sizing anchored to shared typography tokens while preserving the existing viewport behavior.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 45) Typography Batch 5.7 (Accordion Title Inline Line-Height Tokenization)
- Updated `src/components/Accordion/AccordionArticle.jsx` title style objects:
  - `lineHeight: "1.2"` -> `lineHeight: "var(--line-height-2xl)"`
  - applied in both plain-title and HTML-title render branches.
- Why: removes remaining hardcoded inline line-height in accordion titles and aligns title rhythm with shared typography tokens.
- Updated `TASKS_COMPLETED.md` to record this completed sub-step.

## 46) Typography Batch 5.8 (Core Hero Clamp Tokenization)
- Updated `src/App.scss` remaining hero/title clamp literals:
  - `.hero-title`: `clamp(4rem, 7.25vw, 5.75rem)` -> `clamp(var(--font-size-3xl), 7.25vw, calc(var(--font-size-3xl) * 1.4375))`
  - mobile `.hero-title`: `clamp(2.4rem, 7.5vw, 3.1rem)` -> `clamp(calc(var(--font-size-3xl) * 0.6), 7.5vw, calc(var(--font-size-3xl) * 0.775))`
  - mobile `#content h1`: `clamp(1.6rem, 5.2vw, 2.1rem)` -> `clamp(calc(var(--font-size-3xl) * 0.4), 5.2vw, calc(var(--font-size-3xl) * 0.525))`
- Why: this removes the remaining hardcoded `rem` values from the primary hero/title typography path and keeps scale tuning anchored to `--font-size-3xl`.
- Updated `TASKS_COMPLETED.md` under Typography batch 5 progress.

## 47) Sortable Spacing Follow-up (Post-debug)
- Updated `src/components/Sortable/Sortable.jsx` sortable list wrapper:
  - added `mt-2` to the `mx-auto w-[80%]` container below the blue info panel.
- Why: increases separation between the instruction/info box and the sortable card container for the final listening exercise, after visual verification.

## 48) Typography Batch 5.9 (Shared Mixins Tokenization)
- Updated `src/styles/_mixins.module.scss` to remove remaining literal typography values in shared mixins:
  - `line-height: 2rem` -> `line-height: calc(var(--font-size-sm) * 2)`
  - `font-size: 1rem` -> `font-size: var(--font-size-sm)` (two locations)
  - `line-height: 20px` -> `line-height: calc(var(--font-size-sm) * 1.25)`
  - `font-size: 16px` -> `font-size: var(--font-size-sm)`
  - `font-size: 0.7rem` -> `font-size: calc(var(--font-size-sm) * 0.7)`
- Why: these mixins are reused across components, so tokenizing here reduces repeated literal typography and improves consistency at shared-style entry points.
- Updated `TASKS_COMPLETED.md` with this completed step.

## 49) Typography Batch 5.10 (Shared Mixins Font-Family Tokenization)
- Updated `src/styles/_mixins.module.scss` (`.button-info` inside `@mixin comparison`):
  - `font-family: "Times New Roman", Times, serif` -> `font-family: var(--font-heading)`
- Why: removes a remaining hardcoded SCSS font-family and keeps family selection aligned with the token source of truth.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 50) Typography Batch 5.11 (CrossWord Inline Font-Size Tokenization)
- Updated `src/components/CrossWord/CrossWord.jsx` inline styles:
  - clue-number marker `fontSize: 10` -> `fontSize: 'calc(var(--font-size-sm) * 0.625)'`
  - cell input `fontSize: 16` -> `fontSize: 'var(--font-size-sm)'`
- Why: removes remaining hardcoded inline typography literals in CrossWord and aligns its text sizing with shared token scale.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 51) Typography Batch 5.12 (Residual Literal Cleanup)
- Removed an unused Sass typography literal variable from `src/styles/_variables.module.scss`:
  - deleted `$header-footer-font-size: 0.8rem` (no usages in repo)
- Removed stale commented literal typography examples from `src/App.scss`:
  - deleted old commented `h2` lines with `line-height: 2em` and `font-size: 1.6em`
- Why: clears remaining literal typography references/drift points so tokenized rules are the only active source.
- Updated `TASKS_COMPLETED.md` with this cleanup step.

## 52) Typography Batch 5.13 (Accordion Title Style Consolidation)
- Updated `src/components/Accordion/AccordionArticle.jsx`:
  - extracted duplicated inline title typography object into a shared `ACCORDION_TITLE_STYLE` constant.
  - both plain-title and HTML-title branches now use `style={ACCORDION_TITLE_STYLE}`.
- Why: keeps tokenized accordion title typography defined once, reducing drift risk between render branches.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 53) Footer Social Links Row Added
- Updated `src/components/Footer/Footer.jsx`:
  - added a new `footer-social-links` row under the existing square logo row.
  - footer now renders links through a dedicated `FooterSocialLinks` component.
  - added `rel="noopener noreferrer"` to external `target="_blank"` links in the footer.
- Added `src/components/Footer/FooterSocialLinks.jsx`:
  - componentized Facebook, X, YouTube, LinkedIn, and Instagram links.
  - uses Lucide icons where available and a custom inline SVG for X brand parity.
- Updated `src/components/Footer/Footer.scss`:
  - refactored `.square-logos` to a column layout with `.square-logos-row` + `.footer-social-links`.
  - set social icon sizing/alignment for mobile and right-aligned placement under eLearning on desktop.
- Why: places social links where users expect them (footer brand area) while preserving responsive layout and external-link safety.

## 54) Typography Batch 5.14 (Footer + Congratulate Tailwind Tokenization)
- Updated `src/components/Congratulate/Congratulate.jsx`:
  - `CONGRATULATE_TEXT_CLASS` tokenized from hardcoded px values:
    - `text-[40px]` -> `text-[calc(var(--font-size-base)*2.174)]`
    - `leading-[60px]` -> `leading-[calc(var(--font-size-base)*3.261)]`
    - `md:text-[80px]` -> `md:text-[calc(var(--font-size-base)*4.348)]`
    - `md:leading-[90px]` -> `md:leading-[calc(var(--font-size-base)*4.891)]`
- Updated `src/components/Footer/Footer.jsx`:
  - license text line-height from hardcoded `leading-[26px]` -> `leading-[calc(var(--font-size-base)*1.413)]`
- Why: removes remaining hardcoded Tailwind typography literals in JSX and keeps sizing tied to token scale while preserving current visual ratios.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 55) Typography Batch 5.15 (Regional Map Label Tokenization)
- Updated `src/components/CustomComponents_FR/CustomComponents_FR.scss` (`#RegionalTelephoneMap`):
  - `--regional-map-label-size: 74.6667px` -> `calc(var(--font-size-base) * 4.058)`
  - `--regional-map-label-size-small: 40px` -> `calc(var(--font-size-base) * 2.174)`
- Why: removes remaining component-level px typography literals and ties SVG label sizing to the shared type token scale, while preserving current visual ratios.
- Updated `TASKS_COMPLETED.md` with this completed sub-step.

## 56) Typography Batch 5.16 (Font-Face Ownership Split)
- Added `/Users/ped/Sites/french/french-lo-1/src/styles/fonts.css` as the dedicated font registry:
  - moved all `@font-face` declarations from `src/App.scss` into this file
  - added `font-display: swap` to each face for better loading behavior
- Updated `/Users/ped/Sites/french/french-lo-1/src/main.jsx`:
  - imports `./styles/fonts.css` before `./index.css`
- Updated `/Users/ped/Sites/french/french-lo-1/scripts/check-typography-guard.sh`:
  - keeps strict `font-family` guard everywhere
  - allows literal `font-family` only in `src/styles/fonts.css` (for `@font-face`)
- Updated `/Users/ped/Sites/french/french-lo-1/README.md` guardrails to document that narrow exception.
- Why: separates font-asset loading from component styling while preserving token-based font usage as the single source for typography application.

## 57) Typography Batch 5.17 (Dark-Mode Token De-duplication)
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - removed duplicate dark-mode typography token assignments (`--font-size-*`, `--line-height-*`, `--body-line-height`) from `.dark`.
  - typography tokens now remain defined once in `:root` and are shared by both themes.
- Why: reduces token drift risk and reinforces one source of truth for typography scale across light/dark mode.

## 58) Typography Batch 5.18 (Semantic Line-Height Tokens)
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css` typography tokens:
  - added semantic line-height tokens:
    - `--line-height-body`
    - `--line-height-body-tight`
    - `--line-height-body-loose`
    - `--line-height-app`
    - `--line-height-wordparts`
    - `--line-height-wordparts-mobile`
  - kept `--body-line-height` as backward-compatible alias to `--line-height-body`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.scss`:
  - replaced ad-hoc arithmetic line-height expressions with semantic token usage in:
    - `.app`
    - `#content .abbreviations`
    - `#content :where(p, li, td, th, figcaption, caption)`
    - WordParts table text (desktop + mobile)
    - intro paragraph block
    - medium-breakpoint paragraph rhythm
- Why: removes inline line-height math, clarifies intent by context, and keeps line-height tuning centralized in tokens.

## 59) Typography Batch 5.19 (Component Consumers to Semantic Line-Height Tokens)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Info/Info.jsx`:
  - migrated `INFO_CONTENT_TEXT_CLASS` line-height utilities from `var(--body-line-height)` to `var(--line-height-body)`.
  - replaced `[_h3]:leading-[1.4]` with tokenized `[_h3]:leading-[var(--line-height-app)]`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Section/instructions-media.jsx`:
  - migrated Tailwind utility and inline style line-heights from `var(--body-line-height)` to `var(--line-height-body)`.
  - updated HTML normalization helper to inject `var(--line-height-body)` for paragraph/list nodes.
- Why: completes consumer migration to semantic line-height tokens and reduces dependence on the backward-compat alias.

## 60) Typography Batch 5.20 (WordParts Tailwind Line-Height Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/WordParts/WordParts.jsx`:
  - `WORD_PARTS_TEXT_CLASS` line-height utilities:
    - `leading-[1.35]` -> `leading-[var(--line-height-wordparts-mobile)]`
    - added desktop tokenized line-height: `md:leading-[var(--line-height-wordparts)]`
- Why: removes remaining non-token Tailwind line-height literal and aligns WordParts text rhythm with semantic line-height tokens introduced in batch 5.18.

## 61) Typography Batch 5.21 (Exercise Constant Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Blanks/Blanks.jsx`:
  - tokenized `BLANKS_TARGET_BOARD_TEXT_CLASS` from `text-[1.2rem]`
  - tokenized flow/row line-height utilities:
    - `leading-[1.4em]` -> `leading-[var(--line-height-app)]`
    - `leading-[0.5rem]` / `sm:leading-[3.5rem]` -> tokenized `calc(var(--font-size-sm) * ...)`
    - `leading-[2.6rem]` -> tokenized `calc(var(--font-size-sm) * 2.6)`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Blanks/DraggableWordTile/DraggableWordTile.jsx`:
  - tokenized `BLANK_WORD_TEXT_CLASS` from `text-[1.2rem] leading-[1.4rem]`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/ReadAloud/ReadAloud.jsx`:
  - tokenized `READ_ALOUD_RECORD_BUTTON_TEXT_CLASS` from `text-[1.2rem]`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/TreasureGrid/TreasureGrid.jsx`:
  - tokenized `TREASURE_GRID_MESSAGE_TEXT_CLASS` from `text-[1.2rem]`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Jigsaw/Jigsaw.jsx`:
  - tokenized `JIGSAW_CLUE_TEXT_CLASS` (`1.4rem`) and `JIGSAW_TIME_TEXT_CLASS` (`2rem`)
  - tokenized `JIGSAW_CANVAS_TEXT_CLASS` line-height from `leading-[1.4em]` to `leading-[var(--line-height-app)]`
- Why: removes a concentrated group of remaining hardcoded typography literals from exercise components while preserving visual ratios through token expressions.

## 62) Typography Batch 5.22 (Tabs + DropDowns Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - tokenized tabs trigger text sizes:
    - `!text-[1.2rem]` -> `!text-[calc(var(--font-size-sm)*1.2)]`
    - `min-[1170px]:!text-[1.4rem]` -> `min-[1170px]:!text-[calc(var(--font-size-sm)*1.4)]`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/DropDowns/DropDowns.jsx`:
  - tokenized dropdown trigger typography:
    - `leading-[1.4rem]` -> `leading-[var(--line-height-app)]`
    - `md:text-[1.2rem]` -> `md:text-[calc(var(--font-size-sm)*1.2)]`
  - tokenized dropdown option medium text utility:
    - `md:text-[1.2rem]` -> `md:text-[calc(var(--font-size-sm)*1.2)]`
- Why: removes remaining hardcoded rem typography utilities from tabs/dropdown controls and aligns them with the shared token scale.

## 63) Typography Batch 5.23 (Header + Modal + Attribution Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Header/Header.jsx`:
  - tokenized `HEADER_TEXT_CLASS` line-height from `leading-[3rem]` -> `leading-[calc(var(--font-size-sm)*3)]`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/ModalLinkDialog/ModalLinkDialog.jsx`:
  - tokenized mobile title/body heading overrides:
    - `max-[650px]:!text-[1.35rem]` -> `max-[650px]:!text-[var(--font-size-lg)]` (title and nested `h2`/`h3`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Attribution/Attribution.jsx`:
  - tokenized `ATTRIBUTION_TEXT_CLASS` from `text-[0.5rem]` -> `text-[calc(var(--font-size-sm)*0.5)]`
- Why: removes another focused set of rem-based utility literals and keeps typography sizing aligned with shared tokens.

## 64) Typography Batch 5.24 (Sortable + MemoryMatch Utility Tokenization)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/SortableWordCard/SortableWordCard.jsx`:
  - tokenized remaining rem-based text utilities in `textClass` variants (`0.78rem`, `0.92rem`, `0.98rem`, `1.08rem`)
  - tokenized stacked index badge text utilities (`0.68rem`, `0.72rem`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MemoryMatchGame/MemoryMatchGame.jsx`:
  - tokenized cards/matches responsive text utilities:
    - cards: `0.8rem`, `0.9rem`, `1rem`
    - matches: `0.6rem`, `0.7rem`, `0.8rem`
- Why: eliminates the next concentrated cluster of hardcoded rem typography utilities in exercise display components while preserving existing visual scale via token expressions.

## 65) Typography Batch 5.25 (Legacy Line-Height Alias Removal)
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - removed legacy `--body-line-height` alias after migrating all consumers to semantic tokens (`--line-height-body`, etc.).
- Updated `/Users/ped/Sites/french/french-lo-1/README.md`:
  - refreshed typography token wording to reference current semantic token names.
- Why: completes line-height token migration and removes a compatibility alias that could reintroduce naming drift.

## 66) Typography Completion Pass (Tailwind Mapping + Tracker Closure)
- Updated `/Users/ped/Sites/french/french-lo-1/tailwind.config.js`:
  - replaced final legacy line-height reference `var(--body-line-height)` with `var(--line-height-body)`.
  - mapped `xs/sm/lg/xl` line-heights to semantic tokens (`--line-height-xs`, `--line-height-sm`, `--line-height-lg`, `--line-height-xl`) instead of inline numeric literals.
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - added semantic line-height tokens used by Tailwind mapping:
    - `--line-height-xs`
    - `--line-height-sm`
    - `--line-height-lg`
    - `--line-height-xl`
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` and `/Users/ped/Sites/french/french-lo-1/README.md`:
  - marked typography stream complete for current scope and aligned wording with semantic token naming.
- Why: removes the last runtime dependency on a removed alias and closes the typography migration loop with a single tokenized line-height vocabulary.

## 67) Color Guardrails (Script + Package Wiring)
- Added `/Users/ped/Sites/french/french-lo-1/scripts/check-color-guard.sh`:
  - detects added literal color drift in style-like lines across `scss/css/jsx/tsx/js/ts` diffs.
  - blocks:
    - hex literals (`#fff`, `#ffcc00`, ...)
    - named colors (`black`, `white`, `red`, ...)
    - color functions without token indirection (`rgb(...)`, `oklch(...)`, etc. without `var(--...)`)
  - supports `--staged`, `--working`, and `--against <ref>` (matching typography guard workflow).
- Added `/Users/ped/Sites/french/french-lo-1/scripts/color-allowlist.txt`:
  - file-scoped allowlist for intentional literal color definitions.
  - seeded with `src/index.css` (token source).
- Updated `/Users/ped/Sites/french/french-lo-1/package.json` scripts:
  - added `check:color`
  - added `check:color:branch`
  - updated `prepush:local` to include `yarn check:color:branch`
- Updated `/Users/ped/Sites/french/french-lo-1/README.md`:
  - documented color guard policy and usage commands.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`:
  - marked color guard script + prepush wiring tasks complete.
- Why: mirrors typography guardrails to prevent new non-token color drift while continuing hotspot-by-hotspot migration.

## 68) Color Hotspot Migration (App/MainMenu/AudioClip) + Guard Compatibility Fix
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.scss`:
  - replaced remaining literal warning/link accent color `oklch(0.646 0.222 41.116)` with semantic token `var(--ped-warn)` for modal links.
  - replaced button text fallback `var(--primary-foreground, #fff)` with token-only `var(--primary-foreground)`.
  - replaced hover darkening mixes from `black` to tokenized `var(--foreground)` in `.btn-ped-warn`, `.btn-chart-2`, and `.btn-hero-title`.
  - replaced hero local custom property literal `oklch(0.398 0.07 227.392)` with semantic token `var(--chart-3)`.
  - updated `.modal-link`/`:visited` text-decoration color mixes to derive from `var(--ped-warn)` token.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.scss`:
  - replaced mobile toggle/menu separator literal `oklch(0 0 0 / 0.06)` with tokenized `color-mix(in oklab, var(--foreground) 6%, transparent)`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/AudioClip/AudioClip.scss`:
  - replaced hover literal accent `oklch(0.646 0.222 41.116)` with semantic `var(--ped-warn)`.
- Updated `/Users/ped/Sites/french/french-lo-1/scripts/check-color-guard.sh`:
  - replaced Bash `mapfile` usage with a Bash-3-compatible read loop for macOS compatibility.
  - replaced HTML-comment skip regex with a Bash-3-safe string match.
- Why: removes the next high-impact cluster of literal color values in priority files while keeping visual behavior aligned to semantic tokens and ensuring the color guard works reliably on local macOS shells.

## 69) Footer Color Tokenization (Crest + Social Dark Palettes)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Footer/Footer.scss`:
  - replaced crest highlight `white` color-mix usage with semantic footer crest tokens.
  - replaced footer social icon foreground `oklch(1 0 0)` with `var(--footer-social-icon-fg)`.
  - replaced dark-mode social icon literal color/gradient/shadow values with token references:
    - base dark styles: `--footer-social-dark-*`
    - per-network variants: `--footer-social-facebook-*`, `--footer-social-x-*`, `--footer-social-youtube-*`, `--footer-social-linkedin-*`, `--footer-social-instagram-*`
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - added centralized footer visual tokens:
    - crest shading tokens (`--footer-crest-*`)
    - social icon foreground token (`--footer-social-icon-fg`)
    - dark social variant tokens (`--footer-social-...`)
- Why: keeps current footer visuals intact while moving component-level literal color definitions into centralized token ownership, advancing the color single-source-of-truth model.

## 70) MainMenu Semantic Color Cleanup
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.scss`:
  - replaced `rgb(var(--color-text-secondary))` with semantic `var(--muted-foreground)` for nav links.
  - replaced hover `rgb(var(--color-text-primary))` with semantic `var(--foreground)` for nav links.
  - applied the same semantic replacements to mobile nav links.
- Why: moves MainMenu away from palette-channel color references toward semantic token usage, improving theme readability and consistency.

## 71) Docs Sync (AGENTS Guardrail Parity)
- Updated `/Users/ped/Sites/french/french-lo-1/AGENTS.md`:
  - added color guard policy details to match current workflow (`scripts/check-color-guard.sh`, `scripts/color-allowlist.txt`).
  - documented local quality gates (`check:typography`, `check:color`, branch checks, and `prepush:local`).
- Why: keeps onboarding/operator docs aligned so contributors follow the same token guardrails documented in README and task trackers.

## 72) Heading Separator Normalization (App Title)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - extracted title splitting into `splitDisplayTitle`.
  - normalized heading split logic to support both `:` and `—` as source separators.
  - preserved current rendered format (`title-main — title-sub`) and existing `title-main`/`title-sub` styling hooks.
- Why: avoids title formatting drift when content sources mix colon and em-dash conventions.

## 73) Heading Separator Coverage Expansion
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx` (`splitDisplayTitle`):
  - expanded supported source separators to include:
    - `:`
    - `—` (em dash)
    - `–` (en dash)
    - `|` (pipe)
    - spaced hyphen (` - `)
  - kept matching conservative for dash separators (requires surrounding spaces) to avoid splitting hyphenated words.
- Why: improves resilience to mixed title punctuation while preventing accidental splits in normal hyphenated terms.

## 74) Build Asset De-duplication (Fonts/Images/Sounds)
- Added `/Users/ped/Sites/french/french-lo-1/docs/styling/FONTS_PROBLEM.md`:
  - documented the duplication issue, root cause, impact, and verification checklist for maintainers.
- Updated `/Users/ped/Sites/french/french-lo-1/vite.config.js`:
  - removed redundant `viteStaticCopy` targets for `public/fonts`, `public/images`, and `public/sounds`.
  - kept `viteStaticCopy` only for JSON files sourced from `src/...`.
- Verification:
  - fresh `yarn build` succeeds.
  - nested duplicate folders are no longer produced:
    - `dist/fonts/fonts` (removed)
    - `dist/images/images` (removed)
    - `dist/sounds/sounds` (removed)
- Why: Vite already copies `public/` assets by default; duplicating them via static-copy created redundant output and larger artifacts.

## 75) Audio Ordering TODO Documentation
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` (Audio section):
  - added a future TODO to formalize LO1 exercise/audio mapping so folder alphabetical order is not mistaken for render order.
  - captured follow-up actions:
    - document JSON render-order source (`exercises.content`)
    - add optional `audioFolder` + `order` metadata
    - add a validation script to verify folder/audio reference consistency.
- Why: prevents future drift/confusion during ongoing audio restructuring work.

## 76) Color Cleanup Batch (WordParts + MemoryMatch)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/WordParts/WordParts.scss`:
  - removed literal fallback from `var(--primary-foreground, #fff)` to token-only `var(--primary-foreground)`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MemoryMatchGame/MemoryMatchGame.scss`:
  - replaced Sass transparent helper from `rgba(#fff, 0)` to `transparent`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MemoryMatchGame/Card/Card.scss`:
  - replaced Sass transparent helper from `rgba(#fff, 0)` to `transparent`.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` (Color section):
  - logged this low-risk fallback-literal cleanup as complete.
- Why: removes remaining color literal/fallback debt in active exercise styles while keeping visuals unchanged and token ownership clean.

## 77) Color Cleanup Batch (Flag Canvas Shading)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Flag/Flag.jsx`:
  - switched canvas shading from `--foreground/--background` with black/white fallback literals to semantic RGB channel tokens:
    - `--color-text-primary`
    - `--color-surface-base`
  - standardized shading color construction with `rgba(...)` using token channels.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` (Color section):
  - logged the Flag token-channel migration and added a follow-up decision item for remaining Sass utility literals in `_mixins.module.scss`.
- Why: removes a remaining literal fallback path and aligns dynamic canvas shading with the same semantic token system used elsewhere.

## 78) Color Cleanup Batch (Exercise Mixes + Shared Gradient)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Blanks/Blanks.scss`:
  - replaced warning hint background mix from `black` to semantic `var(--foreground)`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Blanks/DraggableWordTile/DraggableWordTile.jsx`:
  - replaced `white/black` mixes in Tailwind arbitrary color-mix utilities with semantic tokens:
    - `var(--background)`
    - `var(--foreground)`
- Updated `/Users/ped/Sites/french/french-lo-1/src/styles/_mixins.module.scss`:
  - updated shared `header-footer-background` mixin to use `var(--foreground)` instead of literal `black` in gradient edge mixes.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` (Color section):
  - recorded completion of this tokenization pass and narrowed the remaining follow-up to the Sass `contrast()` helper policy.
- Why: continues color unification by removing literal `black/white` mixes in active exercise styling and shared gradient utilities while preserving visual intent via semantic tokens.

## 79) Semantics + Inline Spacing Cleanup (`<b>/<i>` + AudioLink sentence spacing)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/CustomComponents_FR/CustomComponents_FR.jsx`:
  - replaced legacy presentational tags in rendered JSX content:
    - `<b>` -> `<strong>`
    - `<i>` -> `<em>`
  - fixed Grammar 2 ("tu vs vous") inline spacing to use explicit React spaces around inline `AudioClip` nodes:
    - `{' '}` between `Tu`, `and`, `vous`, and `both mean 'you'.`
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/ReadAloud/ReadAloud.jsx`:
  - replaced phrase wrapper `<b>` with semantic `<strong>`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - changed sample HTML string from `<b>HTML</b>` to `<strong>HTML</strong>`.
- Validation:
  - `yarn build` passes successfully after the semantic-tag migration and spacing fix.
- Why: improves semantic HTML/accessibility without changing behavior, and removes whitespace ambiguity around inline audio components.

## 80) Color Guard Tuning + Mixins Policy Closure
- Updated `/Users/ped/Sites/french/french-lo-1/scripts/check-color-guard.sh`:
  - reduced false positives in class scanning by removing generic `className=` context matching and relying on utility-style token detection (`text-`, `bg-`, `border-`, `from-`, `to-`, `via-`, etc.).
- Updated `/Users/ped/Sites/french/french-lo-1/scripts/color-allowlist.txt`:
  - clarified policy to keep allowlist limited to canonical token source files.
- Updated `/Users/ped/Sites/french/french-lo-1/src/styles/_mixins.module.scss`:
  - removed unused `contrast()` Sass helper that contained compile-time `white/black/#ffffff` literals.
  - replaced remaining `lightGray` literal with semantic token `var(--muted)` in `button-info`.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`:
  - marked the last two color migration policy/guard tasks complete.
- Why: closes outstanding color migration governance work without expanding allowlists or retaining dead literal-color helper code.

## 81) Accessibility Phase 1A (Invalid `name` attrs + Empty ID emission)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - removed invalid `name` attribute from top modal-link target span (`id="modal-link-top"` retained).
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Section/Section.jsx`:
  - removed invalid `name` attribute from section heading target.
  - removed invalid `name` attribute from article wrapper div.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/HeroSection/HeroSection.jsx`:
  - removed invalid `name` attribute from hero heading target.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`:
  - removed invalid `name` attributes from accordion heading targets (title + titleHTML paths).
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/CustomComponents_FR/CustomComponents_FR.jsx`:
  - removed invalid non-form `name` attributes from modal-link spans/anchor (`madame`, `mademoiselle`, `tuvous`, `toi`, `subject-pronouns`).
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/IconButton/IconButton.jsx`:
  - changed `id={id || ''}` to `id={id || undefined}` so empty `id=""` is no longer emitted.
- Validation:
  - `yarn build` passes.
  - color guard still passes (`yarn -s check:color:branch`).
- Why: resolves high-noise HTML validity issues with minimal behavioral risk by removing invalid legacy attributes and preventing empty id output.

## 82) Docs Sync (Semantics + Accessibility-First Future Blueprint)
- Updated `/Users/ped/Sites/french/french-lo-1/README.md`:
  - mirrored semantic/a11y updates to reflect current state:
    - `<main id="content">` landmark in place
    - inline emphasis migration (`<strong>/<em>`)
    - abbreviations content using semantic definition-list markup (`<dl>/<dt>/<dd>`)
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/FUTURE_PROJECTS.md`:
  - strengthened accessibility-first rules for all new projects:
    - semantic landmarks/headings and proper interactive semantics from day one
    - explicit accessibility test gates (lint + automated checks + keyboard pass) before merge
    - accessibility treated as a non-negotiable quality gate, not a post-build cleanup task
- Why: prevents documentation drift and makes accessibility expectations explicit in both current-repo guidance and future project scaffolding.

## 83) Accordion Migration Planning Docs (Architecture Drift Control)
- Added accordion architecture/risk analysis:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_ISSUES.md`
- Added accordion migration execution plan (baby steps + test matrix + timeline):
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
- Added accordion-specific progress tracker:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
- Updated `/Users/ped/Sites/french/french-lo-1/README.md` migration tracker links to include all accordion docs.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md` with a dedicated accordion migration section and explicit rationale.
- Decision captured:
  - use debug-first migration to tune shadcn/Radix accordion UX safely
  - then migrate main app accordion with parity checks for config-driven behavior and modal-link/deep-link contracts
- Why: the current accordion path is a design-system exception and long-term maintenance risk; planning docs make the refactor explicit, testable, and measurable.

## 84) Link Contract Split (Nav Scroll vs Modal Content)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - replaced legacy `modal-link` class usage on top-nav anchors with `nav-scroll-link`.
  - top navigation remains explicitly scroll-only via `handleModalLinkClick(..., { mode: "scroll" })`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - `initialiseModalLinks()` now treats `.modal-link` as modal-only; removed legacy branch that switched behavior by checking `.nav`.
  - added code comments clarifying class responsibility and avoiding future overload.
- Updated documentation:
  - `/Users/ped/Sites/french/french-lo-1/README.md` now documents the explicit link contract.
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md` now includes link-class contract lock as a migration decision.
- Why: removes a confusing legacy naming pattern where one class (`modal-link`) represented two different interaction models (scroll + modal), reducing maintenance risk and accidental regressions.

## 85) Accordion Migration Start (shadcn Primitive + Debug Integration)
- Added dependency:
  - `@radix-ui/react-accordion` in `/Users/ped/Sites/french/french-lo-1/package.json`
- Added shadcn-style accordion primitive:
  - `/Users/ped/Sites/french/french-lo-1/src/components/ui/accordion.jsx`
- Migrated debug structure summary from native `<details>/<summary>` to shadcn/Radix accordion:
  - `/Users/ped/Sites/french/french-lo-1/src/debug/components/LearningObjectStructureSummary.jsx`
  - preserved current row layout (LO link left, structure accordion right)
  - preserved ordered-list structure and section/exercise summary content
- Updated migration tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/README.md`
- Why: executes the approved debug-first migration step in a low-risk surface, validates shared primitive wiring, and reduces drift before main-app accordion cutover.

## 86) Accordion Main-App Wrapper Scaffold (Compatibility First)
- Added compatibility wrapper:
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`
- Wrapper preserves existing app contracts while using Radix accordion internals:
  - `id`, `target`, `title/titleHTML`, `config`, `noCard`, `expandNow`, and children rendering contracts
  - session persistence via `${id}-expanded`
  - heading/deep-link compatibility (`modal-link-*`, `data-modal-target`)
  - `(part N)` title suffix split styling
  - info injection + child `suppressInfo` behavior
- Exported wrapper via:
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/index.js`
- Why: prepares a low-risk migration path for incremental `App.jsx` adoption without forcing a full accordion cutover in one step.

## 87) Accordion Incremental Adoption Pilot (`AnswerTable`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - the `AnswerTable` render branch now uses `AppAccordionArticle` instead of the legacy `AccordionArticle`.
  - removed legacy `ref` handoff for that pilot path (function component wrapper is refless by design).
- Why: validates the incremental migration strategy on a low-risk path before expanding wrapper adoption to higher-traffic accordion branches.

## 88) Debug Accordion Visual Parity Tuning (Chevron + Hover/Open Skin)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/ui/accordion.jsx`:
  - moved chevron to the left of heading text and increased icon size/contrast for clearer affordance.
- Updated `/Users/ped/Sites/french/french-lo-1/src/debug/components/LearningObjectStructureSummary.jsx`:
  - applied main-app style parity for accordion trigger hover/open states using `--accordion-mist` and `--accordion-hover-text`.
  - added slower color/shadow transitions (`duration-700`) to match the app’s intentional interaction feel.
- Why: improves clarity and consistency while keeping these visual tweaks scoped to the debug migration surface.

## 89) Accordion Incremental Adoption Batch 2 (`PhraseTable`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - migrated expandable `PhraseTable` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoff for this wrapper-driven branch.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Why: expands wrapper adoption to a high-visibility content path (dialogues/vocabulary) while preserving compatibility contracts before broader cutover.

## 90) Accordion Incremental Adoption Batch 3 (`Blanks` + `WordParts`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - migrated `Blanks` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `WordParts` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoffs for these wrapper-driven branches.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/README.md`
- Why: extends the compatibility-wrapper rollout into exercise-heavy flows, reducing remaining legacy accordion surface while preserving behavior contracts.

## 91) Accordion Incremental Adoption Batch 4 (`DropDowns` + `Monologue` + `RadioQuiz`)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - migrated `DropDowns` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `Monologue` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - migrated `RadioQuiz` rendering from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `ref` handoffs for these wrapper-driven branches.
- Updated migration trackers:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/README.md`
- Why: continues batch-by-batch migration of interactive sections to the compatibility wrapper while preserving deep-link, info-suppression, and persisted-expansion contracts.

## 92) Accordion Clickability Fix (Wrapper Interaction Regression)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`:
  - corrected Radix header/trigger structure using `AccordionPrimitive.Header asChild` around the `<h2>` heading target.
  - removed invalid nested heading structure that could interfere with trigger interaction.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - narrowed `.modal-link-target` click suppression to anchor elements only (`<a>`).
  - avoids preventing default on non-anchor heading targets used by accordion triggers.
- Why: fixes a migration regression where accordion headings could become non-clickable after wrapper adoption.

## 93) Accordion Collapse Animation Fix (Second-Click Did Not Close)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`:
  - removed `forceMount` from `AccordionPrimitive.Content` so Radix can manage open/close presence correctly.
  - switched content animation classes to state-based variants:
    - `data-[state=open]:animate-accordion-down`
    - `data-[state=closed]:animate-accordion-up`
- Why: `forceMount` kept wrapper content effectively always present, so close interactions could appear to reopen instead of collapsing.

## 94) Accordion Visual Parity Fix (Legacy + Wrapper Selector Alignment)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`:
  - tagged Radix item node with `accordion-item` to provide a stable CSS hook during incremental migration.
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - expanded accordion selectors to target both DOM shapes:
    - legacy (`.accordion-article > header`, `.accordion-article > .content`)
    - wrapper/Radix (`.accordion-article .accordion-item > header`, `.accordion-article .accordion-item > .content`)
  - applied this to normal, hover, expanded, and mobile typography selectors.
- Why: migrated accordion sections (for example dialogues) were no longer matching direct-child legacy selectors, causing style drift versus non-migrated sections.

## 95) Accordion Chevron Single Source of Truth (App + Debug)
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - introduced shared `.accordion-chevron` style for icon size, shrink behavior, color inheritance, and transform transition.
  - removed legacy hardcoded arrow width/height and side margins that were forcing app chevrons smaller than debug chevrons.
  - aligned app trigger spacing (`gap`) with debug accordion trigger spacing for visual consistency.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/ui/accordion.jsx`:
  - switched debug accordion chevron to the shared `.accordion-chevron` class.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx` and `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`:
  - switched app accordion chevrons to use the same shared class.
- Why: keeps chevron styling in one place so debug and production accordions stay visually identical during and after migration.

## 96) Accordion Main-App Full Cutover + Legacy Removal
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - migrated all remaining expandable branches from legacy `AccordionArticle` to `AppAccordionArticle`.
  - removed legacy `window.refs` setup and deleted unused `expandAllAccordions` helper.
  - replaced top-level `<Accordion />` wrapper usage with a plain `.accordion` container div.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`:
  - removed stale `expandNow` pathway (no active callers remained).
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/index.js`:
  - removed exports of deleted legacy accordion components.
- Deleted legacy files:
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/Accordion.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`
- Why: completes production cutover to one active accordion behavior path and removes dead legacy code that was creating architecture drift.

## 97) Accordion Docs Sync (No Drift)
- Updated migration/architecture trackers:
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_ISSUES.md`
- Updated project-level status docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/README.md`
- Why: keeps task boards and architecture docs aligned with the actual codebase after full accordion cutover.

## 98) DOM Semantics Audit + Execution Docs (`main > section > article`)
- Added semantic architecture audit:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md`
  - documents current DOM shape, target hierarchy, inconsistency points, and concrete style/JS regression risks.
- Added phased implementation plan:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - defines migration phases for section landmarks, nav/hash compatibility, article semantics, selector hardening, and heading hierarchy.
- Added regression checklist:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
  - covers structure, nav behavior, accordion behavior, modal-link behavior, accessibility, visual parity, and quality gates.
- Updated tracker index in `/Users/ped/Sites/french/french-lo-1/README.md` to include these files.
- Why: makes semantic DOM refactor explicit, testable, and low-risk before changing markup.

## 99) DOM Semantics Docs Sync (Header/Nav/Hero + Responsive Landmark Rule)
- Expanded `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md` with:
  - current page-top DOM snapshot (`header/nav/hero/main`) and identified semantic issues.
  - explicit statement that `div#accordion1.accordion` is a misleading top-level container.
  - full target structure that includes header, single primary nav landmark, intro section, and section/article hierarchy under `main`.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`:
  - added a dedicated phase for responsive-safe header/nav/hero semantics.
  - clarified that mobile responsiveness is preserved while avoiding duplicate primary nav landmarks.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`:
  - added checks for one primary nav landmark, responsive mobile behavior, and hero/heading-order correctness.
- Updated `/Users/ped/Sites/french/french-lo-1/README.md`:
  - added explicit DOM semantics contract bullets to prevent implementation/doc drift.
- Why:
  - removes ambiguity around "single nav landmark" vs responsive UX.
  - locks heading/landmark expectations before DOM refactor implementation.

## 100) Mobile Nav Semantics + Skip Link (Accessibility-First DOM Prep)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - changed mobile dropdown wrapper from `<nav>` to `<div role="region" aria-label="Main navigation mobile">` so the page has one primary nav landmark for the same IA.
  - added `aria-controls` on the menu toggle and `id` on the mobile panel for explicit control relationship.
  - added Escape-key close behavior for the mobile panel.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - added a keyboard skip link (`Skip to main content`) targeting `#content`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - added focus-visible skip-link styling so it remains hidden until keyboard focus.
- Updated task tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Why:
  - improves screen-reader landmark clarity and keyboard navigation immediately.
  - reduces risk before broader semantic DOM restructuring.

## 101) Hero Heading Semantics Fix (`h2` -> non-heading text)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - replaced hero title `<h2 className="hero-title ...">` with `<p className="hero-title ...">`.
  - changed hero banner image to decorative semantics (`alt=""` + `aria-hidden="true"`).
- Updated semantic tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Why:
  - removes heading-order ambiguity (no `h2` before page `h1`).
  - keeps visual hero text unchanged while improving document outline semantics.

## 102) Hero Typography Parity Fix (Feijoa Bold Restored)
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - added explicit hero-title typography rules after converting semantic tag from `h2` to `p`:
    - `font-family: "Feijoa Bold", var(--font-heading)`
    - `font-weight: 700`
    - `line-height: var(--line-height-2xl)`
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`:
  - checked off visual parity restoration for hero title styling.
- Why:
  - preserves intended design while maintaining corrected semantic heading structure.

## 103) Accordion Wrapper Naming + Semantic Root Update
- Updated app accordion wrapper naming:
  - renamed component `AppAccordionArticle` -> `AccordionArticle`.
  - updated imports/usages in `/Users/ped/Sites/french/french-lo-1/src/App.jsx`.
  - updated accordion barrel export in `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/index.js`.
- Updated wrapper file path:
  - moved `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AppAccordionArticle.jsx`
  - to `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`.
- Updated semantic root element in wrapper:
  - root changed from `<section>` to `<article>` while retaining `.accordion-article` class.
- Synced docs/trackers to avoid drift:
  - `/Users/ped/Sites/french/french-lo-1/README.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_ISSUES.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
- Why:
  - clearer component naming and improved semantic HTML alignment for accordion content units.

## 104) Hero Semantics Contract Lock + Checklist Drift Fix
- Updated semantic DOM trackers to remove drift and lock final hero behavior:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
- Updated project docs to align with the same contract:
  - `/Users/ped/Sites/french/french-lo-1/README.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Locked decision:
  - hero remains outside `main` intentionally as decorative page chrome.
  - hero text remains non-heading (`p.hero-title`) and hero image remains decorative (`alt=""`, `aria-hidden="true"`).
- Why:
  - avoids semantic-outline drift (`h2` before page `h1`) without forcing decorative page chrome into core content landmarks.
  - keeps accessibility/structure documentation consistent with actual implementation.

## 105) Semantic Section-ID Nav Cutover + Top-Level DOM Cleanup
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - removed legacy top-level wrapper `<div class="accordion" id="accordion1">`.
  - introduced semantic top-level section siblings directly under `main`:
    - `#introduction`, `#dialogues`, `#vocabulary`, `#grammar`, `#pronunciation`, `#exercises`.
  - removed hidden `#modal-link-top` anchor.
  - hardened modal fallback extraction container lookup to include `article`:
    - `closest("p, li, article, section, div")`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - nav links now use semantic section hashes (`#introduction`, `#dialogues`, etc.) instead of legacy `#modal-link-*`.
  - scroll-spy/highlight lookup now targets section IDs directly.
- Updated heading-ID strategy:
  - `/Users/ped/Sites/french/french-lo-1/src/components/Section/Section.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/components/HeroSection/HeroSection.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`
  - section headings now use semantic IDs (`${sectionId}-heading`) instead of legacy `modal-link-*` naming.
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - accordion interaction selectors now scope from `#content` (no dependency on removed `.accordion` wrapper).
- Updated docs to avoid drift:
  - `/Users/ped/Sites/french/french-lo-1/README.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_AUDIT.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_CHANGES_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
- Why:
  - removes the misleading “one accordion” top wrapper from page-level structure.
  - establishes semantic section IDs as the single source of truth for navigation and scroll behavior.
  - eliminates legacy naming ambiguity (`modal-link-*`) for top-level content landmarks.

## 106) Nav Highlight/Scroll Precision Fix After Semantic-ID Migration
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - default nav highlight now starts at `null` (prevents false `Introduction` highlight before section positions are available).
  - added config-change recalculation in `componentDidUpdate` so highlight state initializes correctly when LO config loads asynchronously.
  - section detection now resolves semantic heading anchors first (`${sectionId}-heading`) for tighter active-state accuracy.
- Updated `/Users/ped/Sites/french/french-lo-1/src/utility.js`:
  - reduced legacy oversized scroll fudge offset and replaced with tighter fixed-menu offset for cleaner section alignment.
  - scroll-mode target lookup now prefers heading anchors (`${sectionId}-heading`) before section IDs.
- Updated tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - focused lint run on touched files passes with no errors.
- Why:
  - fixes initial incorrect menu highlight state on first load.
  - improves scroll landing accuracy so target sections align cleanly under the fixed nav without leftover content from the previous section.

## 107) Disable Scroll Restoration On Refresh (Top-of-Page Contract)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - added explicit refresh/load scroll reset in `componentDidMount`:
    - `history.scrollRestoration = "manual"`
    - immediate `scrollTo(0,0)` plus one `requestAnimationFrame` follow-up `scrollTo(0,0)`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - removed obsolete global scroll-position tracking writes (`window.__lastKnownScrollPosition`).
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`:
  - documented contract clearly: only accordion open/closed state persists; page scroll position must not persist across refresh.
- Validation:
  - `yarn build` passes.
- Why:
  - browser native scroll restoration caused refresh to reopen mid-page context, conflicting with expected “start at top” behavior.
  - this keeps refresh behavior deterministic while preserving useful session persistence for accordion state.

## 108) DOM Semantics Hardening: Group Sections + Accordion Heading Levels
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Accordion/AccordionArticle.jsx`:
  - added `semanticAs` prop (`"article"` default) so the same wrapper can render semantic group containers as `<section>` when needed.
  - root element now uses `RootTag` (`article` or `section`).
  - accordion trigger heading changed from `<h2>` to `<h3>` to enforce `h1 -> h2 -> h3` hierarchy.
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - group accordion call sites now pass `semanticAs="section"` so structural wrappers are sections, not articles.
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - accordion title selectors migrated from `h2`-based selectors to `.accordion-title` selectors to preserve identical styling after heading-tag change.
- Updated tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/components/ACCORDION_TASKS_COMPLETED.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - branch guards pass:
    - `yarn check:typography:branch`
    - `yarn check:color:branch`
    - `yarn check:a11y:branch`
    - `yarn check:scss:branch`
    - `yarn check:audio-unicode`
  - `yarn prepush:local` is still blocked by existing repo-wide ESLint baseline errors outside this change set.
- Why:
  - restores correct semantic distinction between structural content regions (`section`) and standalone accordion entries (`article`).
  - removes heading-level inflation inside accordion items and improves document outline consistency for assistive tech.

## 109) DOM Semantics: Section Header Grouping (Title + Instructions)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/Section/Section.jsx`:
  - wrapped section heading (`h2`) and instruction block in a semantic `<header>` element.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/HeroSection/HeroSection.jsx`:
  - moved hero-section instruction rendering into a semantic `<header>` element alongside the section `h2`.
  - added `Separator` usage in the semantic header to preserve visual rhythm after moving instruction content.
- Updated tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - branch guards pass:
    - `yarn check:typography:branch`
    - `yarn check:color:branch`
    - `yarn check:a11y:branch`
    - `yarn check:scss:branch`
    - `yarn check:audio-unicode`
- Why:
  - ensures each section’s heading and intro/instructional context are grouped in semantic HTML5 structure.
  - improves section comprehension for assistive technology and makes top-level section outlines easier to audit.

## 110) DOM Semantics: Selector/Heading Cleanup Phase Closed
- Updated `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_TODO.md`:
  - marked JS selector hardening audit complete.
  - marked wrapper heading-jump cleanup complete.
- Updated `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`:
  - recorded completion of wrapper selector/heading hierarchy hardening.
- Validation notes:
  - selector audit found no additional wrapper selectors that required `article` support beyond existing `App.findModalLinkContent` fallback.
  - wrapper heading structure is now aligned as `h1 -> h2 -> h3`.
- Why:
  - closes remaining code-side DOM semantic tasks before final manual visual/accessibility regression verification.

## 111) Main Nav Parity Refactor (Desktop + Mobile)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/MainMenu/MainMenu.jsx`:
  - replaced separate desktop/mobile link construction with one shared `navEntries` source.
  - both desktop and mobile menus now render from the same IDs/hrefs/labels.
  - removed duplicate mobile-only hardcoded Introduction item.
- Updated tracking docs:
  - `/Users/ped/Sites/french/french-lo-1/docs/a11y/DOM_SEMANTIC_CHECKLIST.md`
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - branch guards pass:
    - `yarn check:typography:branch`
    - `yarn check:color:branch`
    - `yarn check:a11y:branch`
    - `yarn check:scss:branch`
    - `yarn check:audio-unicode`
- Why:
  - removes a known drift surface where desktop and mobile nav links could diverge over time.
  - guarantees both breakpoints use the same section targets and scroll-only interaction path.

## 112) Modal Link Reliability Fix (Delegated Wiring)
- Updated `/Users/ped/Sites/french/french-lo-1/src/App.jsx`:
  - replaced per-element `.modal-link` listener setup with delegated document click handlers.
  - this ensures modal links created after child-local re-renders are still handled.
  - added cleanup in `componentWillUnmount` for delegated listeners.
- Updated `/Users/ped/Sites/french/french-lo-1/src/utility.js`:
  - `handleModalLinkClick` now supports an explicit link element (`options.linkEl`) for delegation-safe href/target extraction.
- Updated tracking doc:
  - `/Users/ped/Sites/french/french-lo-1/docs/process/TASKS_COMPLETED.md`
- Validation:
  - `yarn build` passes.
  - targeted lint on changed files passes with no errors (`src/App.jsx`, `src/utility.js`).
  - branch guards pass:
    - `yarn check:typography:branch`
    - `yarn check:color:branch`
    - `yarn check:a11y:branch`
    - `yarn check:scss:branch`
    - `yarn check:audio-unicode`
- Why:
  - fixes intermittent behavior where some modal links worked and others failed after UI updates that re-created link DOM nodes without re-running direct listener attachment.

## 113) Sequence Audio Slider Color Alignment (Footer Green)
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/SequenceAudioController/SequenceAudioController.jsx`:
  - added shared slider style token: `accentColor: "var(--footer-background)"`.
  - applied to both range controls:
    - playback scrubber (`.play-scrubber`)
    - volume slider (`.volume-slider`)
  - lightly brightened the controller panel surface from `var(--muted)` to a subtle mix:
    - `color-mix(in oklab, var(--muted) 82%, var(--card) 18%)`
- Validation:
  - targeted lint on changed file passes.
  - `yarn build` passes.
- Why:
  - removes browser-default blue slider accent and aligns audio controls with your existing footer green token.
  - improves contrast/readability by softening the controller background without drifting from theme tokens.

## 114) Accordion Hover/Open States Tinted to Footer Green
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - changed `--accordion-mist` from neutral grey to a footer-green-tinted mix in light mode:
    - `color-mix(in oklab, var(--footer-background) 40%, var(--card))`
  - changed `--accordion-mist` in dark mode to a subtle green-tinted mix:
    - `color-mix(in oklab, var(--chart-2) 18%, var(--card))`
  - aligned `--accordion-hover-text` to `var(--foreground)` for safe contrast in both themes.
- Validation:
  - `yarn build` passes.
- Why:
  - replaces neutral grey hover/open accordions with the same green visual language used in footer branding while preserving readability.


# Files Deleted (partial but comprehensive)

## Language/Config
- `src/learningObjectConfigurations/de/`
- `src/learningObjectConfigurations/sp/`
- `src/config-uae-1.json`
- `src/config-ukraine-1.json`
- `src/index-sp.json`

## Components
- `src/components/CustomComponents_SP/`
- `src/styles/_skin.module.scss`

## Sounds
- `public/sounds/de/`
- `public/sounds/sp/`
- `public/sounds/ukraine/`
- `public/sounds/arabic-cyclist.mp3`

## Images (examples)
- UAE/Berlin/Kyiv/flags and other non-French assets removed.

## Logos removed (unused after inline/currentColor)
- `public/images/cc_logo_black.svg`
- `public/images/cc_logo_white.svg`
- `public/images/lc_logo_black.svg`
- `public/images/lc_logo_white.svg` (later re-added for CSS pipeline compatibility)
- `public/images/facebook_black.svg`
- `public/images/facebook_white.svg`
- `public/images/linkedin_black.svg`
- `public/images/linkedin_white.svg`
- `public/images/twitter-x-black.svg`
- `public/images/twitter-x-white.svg`
- `public/images/elearning.svg`
- `public/images/ucam_language_centre_h_white.png`
- `public/images/ucam_language_centre_v_white.png`


# Files Added
- `CHANGES.md` (this file)

# Notes
- The repo now assumes shadcn tokens are the single source of truth for theme values.
- If future language variants are added, keep `src/components` casing consistent and update copy targets in `vite.config.js`.

## 115) LO3 Typed Transform Exercises: Global Actions + Instruction Alerts
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/AnswerTable/AnswerTableRuntime.jsx`:
  - added optional global-control mode (`useGlobalActions`) for typed-response rows.
  - introduced shared exercise actions: `Check answers`, `Reset`, `Show answers`.
  - added per-row status icons (`CircleCheck`/`CircleX`) shown only after check on attempted rows.
  - initially added child-level `Info` alert rendering from `instructionsText` / `instructionsTextHTML` in global-control mode (later superseded by section 116 to keep LO1/LO2 placement parity).
  - kept legacy compact `Monologue` row behavior for non-global mode to avoid drift in existing activities.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/TypedTransformExercise/TypedTransformExercise.jsx`:
  - now enables `useGlobalActions` and keeps left audio speaker column for consistency.
- Updated `/Users/ped/Sites/french/french-lo-1/src/learningObjectConfigurations/fr/3.json`:
  - `typedTransformExercise3` and `typedTransformExercise4` now use instructional alert HTML copy.
  - added `cheatText: "Show answers"` for consistent global action labeling.
- Validation:
  - `yarn build` passes.
- Why:
  - aligns LO3 typed transform exercises with the same global interaction model used in other exercises.
  - avoids per-row check buttons and gives consistent instructional guidance in blue alert panels.

## 116) LO3 Exercise Alert Placement + Typed UX Parity Fixes
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/AnswerTable/AnswerTableRuntime.jsx`:
  - restored per-row diff rendering in global check mode (keeps inserted/deleted feedback visible).
  - added Enter-key submission (`Enter` / `NumpadEnter`) for typed inputs.
  - moved typed layout to two columns by inlining audio with the masculine term (removed separate listen column in typed mode).
  - added `Mars` / `Venus` header icons for masculine/feminine columns in typed mode.
  - removed child-level `Info` rendering so instruction alerts are sourced from accordion-level config (LO1/LO2 parity).
- Updated `/Users/ped/Sites/french/french-lo-1/src/index.css`:
  - added `.answer-table-container .comparison-result` style scope so diff colors/styles render correctly outside `.monologue-container`.
- Updated `/Users/ped/Sites/french/french-lo-1/src/learningObjectConfigurations/fr/3.json`:
  - exercises 1 and 2: added/normalized `informationTextHTML` instruction alerts.
  - exercises 3 and 4: migrated instruction copy from `instructionsTextHTML` to accordion-level `informationTextHTML`.
- Validation:
  - `yarn build` passes.
- Why:
  - removes spacing drift of blue instruction alerts in LO3 exercises.
  - keeps the new global action UX while preserving the earlier diff-based learning feedback.

## 117) LO3 Dictation Global Controls + Typed/Dictation Stability Pass
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/DictationExercise/DictationExercise.jsx`:
  - enabled global controls (`useGlobalActions`) for dictation rows.
  - aligned dictation audio icon placement to left-side compact speaker style.
- Updated `/Users/ped/Sites/french/french-lo-1/src/components/AnswerTable/AnswerTableRuntime.jsx`:
  - retained previous diff guidance while learner edits after check; icon/result clears until re-check.
  - trimmed leading/trailing whitespace before evaluation (internal spacing remains unchanged).
  - stabilized row layout to remove input width jiggering:
    - fixed table layout in global mode (`table-fixed`)
    - fixed status icon slot
    - reserved diff-feedback block height
    - fixed audio-cell sizing/alignment to input row baseline.
- Validation:
  - `yarn build` passes.
- Why:
  - removes confusing layout shifts during editing/re-check loops.
  - keeps guidance visible while learners self-correct.
  - aligns exercise 5 interaction model with exercises 3/4 global controls.
