# Future LO Refactor Checklist

Use this checklist for each new LO (LO4 onward) to avoid architecture and styling drift.

## 1) Audio Migration

- [ ] Inventory all LO-specific audio refs in config + custom components.
- [ ] Migrate refs from `sounds/fr/...` to `audio/loX/...` section folders.
- [ ] Use ASCII-safe, sequence-based filenames (`001-...`, `002-...`).
- [ ] Verify all migrated refs resolve to existing files.
- [ ] If a legacy source folder exists, delete only files with no remaining runtime references; this project-wide `public/sounds/fr` tree has already been removed.
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

### 7a) LO1 (first-contact) — Visual and Accessibility Reference Standard

**LO1 is the approved style and UX source of truth as of 2026-05-21.** When auditing or building a new LO, verify each pattern below matches LO1. If a deliberate deviation is needed, document the reason explicitly — do not silently let it drift.

#### Grammar accordion
- [ ] Content `h3` headings inside accordion cards are visually hidden (kept in DOM for screen readers/WAVE) via the visually-hidden CSS pattern:
  ```css
  #content #grammar .accordion-card-content > div > h3:first-child { /* visually-hidden pattern */ }
  ```
  Rationale: the accordion header itself renders as an `h3`, so the content `h3` would duplicate it visually but must remain for screen readers.
- [ ] Accordion content area uses `padding: 1.25rem 1.5rem`.
- [ ] Prominent statement blocks (e.g. `#tuvous`) use `display: block; font-size: var(--font-size-xl); font-weight: 500`.

#### Pronunciation tabs
- [ ] Every tab panel has an `h3` heading with an `AudioClip` inline — pattern: `<h3>N. Label "<AudioClip>word</AudioClip>"</h3>`.
- [ ] The `h3` is styled down via `.pronunciation-panel h3` (`font-size: var(--font-size-lg)`, compact `border-bottom`).
- [ ] No `<strong>` wrapper inside `AudioClip` inside an `h3` — this breaks the green colour via CSS specificity.

#### Info boxes
- [ ] Light mode: blue border/background (primary palette) — this is intentional, not an error.
- [ ] Dark mode: muted teal ghost style — background via `color-mix(in oklab, var(--card) 88%, var(--chart-2) 12%)`, faint teal border, teal icon.

#### Exercise action buttons
- [ ] Light mode: solid filled (colours: ped-warn = amber, chart-2 = teal, chart-3 = amber-gold).
- [ ] Dark mode: ghost/outline style — transparent fill, coloured border + text.
- [ ] `--ped-warn` is pinned to `var(--chart-5)` inside `.dark` to prevent shadcn's dark-mode remap of `chart-1` to blue from bleeding into warn semantics.

#### Instruction / intro text
- [ ] `InstructionCallout` uses `--font-size-lg` (1.35 rem), set via `INSTRUCTION_TEXT_CLASS` and `applyInstructionTypographyToHTML` in `src/components/Section/instructions-media.jsx`.
- [ ] Do not use `--font-size-xl` for instruction callouts — confirmed too large.

#### WAVE compliance
- [ ] Zero "possible heading" alerts — `WordSpotExercise` phrase wrappers must be `<div>`, not `<p>`.
- [ ] Grammar `h3` duplication handled by the visually-hidden pattern above (not by removing the heading from the DOM).
- [ ] Pronunciation tab `h3` headings present and visible (tab button labels are not heading elements and do not count).

#### Abbreviations reference box
- [ ] `.abbreviations dl` styled as a reference/aside box: `border-left` accent, muted background, small-caps `dt` label.

> **Drift warning:** if any LO deviates from any pattern above, add a comment in the relevant component or config file explaining the reason, and note it in `CHANGES.md`. Silent drift without documentation is not acceptable.

## 8) Regression + Build Validation

- [ ] `yarn build` passes.
- [ ] Manually verify key LO interactions (audio, dialogs, exercises, responsive breakpoints).
- [ ] Confirm no unwanted changes to other LOs.

## 9) Documentation Sync (No Drift)

- [ ] Update `CHANGES.md` with concrete scope and file paths.
- [ ] Update `README.md` for architecture/status changes.
- [ ] Update relevant TODO/CHECKLIST docs for the section being refactored.
