# Future LO Refactor Checklist

Use this checklist for each new LO (LO4 onward) to avoid architecture and styling drift.

## 1) Audio Migration

- [ ] Inventory all LO-specific audio refs in config + custom components.
- [ ] Migrate refs from `sounds/fr/...` to `audio/loX/...` section folders.
- [ ] Use ASCII-safe, sequence-based filenames (`001-...`, `002-...`).
- [ ] Verify all migrated refs resolve to existing files.
- [ ] Delete only legacy `public/sounds/fr` files with no remaining `src` references.
- [ ] Record migration map + blockers (`AUDIO_LOX_MIGRATION_MAP.md`, `LOX_AUDIO_BLOCKERS.md`).

## 2) Section Architecture Parity

- [ ] Ensure top-level sections follow shared app architecture (`Group`/`Section` patterns).
- [ ] Avoid monolithic `Explanation` blobs for complex grammar/pronunciation content.
- [ ] Use shared `instructionsLayout` + shared section image where applicable.
- [ ] Add `informationHTML`/`informationTextHTML` intro alerts where used in LO1/LO2.

## 3) Grammar Consistency

- [ ] Grammar uses `Group` + numbered accordion articles.
- [ ] Each article has appropriate `infoTextHTML` blue alert copy.
- [ ] Keep content in JSX custom components when structure is complex.
- [ ] Use semantic emphasis (`<strong>`, `<em>`) and tokenized styles.

## 4) Pronunciation Consistency

- [ ] Align title format with shared standard (`Pronunciation Focus — ...`).
- [ ] Use shared pronunciation section architecture: `component: "Group"` + `displayAsTabs: true`.
- [ ] Avoid monolithic LO-specific pronunciation blocks (for example single large `LOxDemystify` renderers) once a refactor starts.
- [ ] Keep even single-topic pronunciation sections inside the tabs shell for cross-LO consistency.
- [ ] Include per-tab instructional alert copy.
- [ ] Ensure list/audio presentation matches prior LO UX patterns (stacked one-item-per-line where needed, same `AudioClip` behavior, including the shared compact orange hover/focus rollover).
- [ ] Avoid per-LO inline visual hacks in pronunciation content (`float`, inline border styles, ad-hoc spacing); use shared classes/tokens.

## 5) Exercise Semantics + Naming

- [ ] Prefer behavior-based component names (`InlineChoiceGroup`, `SelectExercise`, `DraggableFillGaps`, etc.).
- [ ] Keep exercise ids/folders aligned with semantic component naming.
- [ ] Prefer lesson-owned image assets under `public/img/loX/exercises/...` over generic shared folders when the images are specific to one LO.
- [ ] Confirm global controls consistency (`Check answers`, `Show answer`, `Reset`) where applicable.
- [ ] Preserve expected keyboard behavior (for example Enter to check when supported).
- [ ] Prefer Tailwind/shadcn-style card/tile implementation in JSX first; add shared CSS only for the narrow effects utilities cannot express cleanly.

## 6) Table System Consistency

- [ ] Use shared shadcn table primitives (`src/components/ui/table.jsx`) rather than raw HTML tables.
- [ ] Apply table variants (for example `variant="learning"`) for shared look/feel.
- [ ] Remove redundant per-component table CSS only after variant adoption.

## 7) Accessibility + Semantics

- [ ] Run WAVE checks and resolve high-signal alerts.
- [ ] Fix "possible heading" cases with semantic headings or size/weight adjustments.
- [ ] Ensure labels/ids are valid and unique.
- [ ] Preserve keyboard focus and screen-reader behavior after refactors.

## 8) Regression + Build Validation

- [ ] `yarn build` passes.
- [ ] Manually verify key LO interactions (audio, dialogs, exercises, responsive breakpoints).
- [ ] Confirm no unwanted changes to other LOs.

## 9) Documentation Sync (No Drift)

- [ ] Update `CHANGES.md` with concrete scope and file paths.
- [ ] Update `README.md` for architecture/status changes.
- [ ] Update relevant TODO/CHECKLIST docs for the section being refactored.
