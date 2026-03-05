# Pronunciation TODO (LO Unification)

## Scope
- Focus area: Pronunciation sections across French LOs (`src/learningObjectConfigurations/fr/*.json`)
- Priority baseline: LO1 and LO2 parity first
- Primary implementation files:
  - `src/learningObjectConfigurations/fr/1.json`
  - `src/learningObjectConfigurations/fr/2.json`
  - `src/App.jsx` (Group + Tabs rendering path)
  - `src/components/CustomComponents_FR/CustomComponents_FR.jsx`

## Problem Statement
- Pronunciation architecture is inconsistent:
  - LO1 uses `Group` + `displayAsTabs: true` with structured child items.
  - LO2 currently uses a monolithic custom component (`LO2Demystify`) with one large content block.
- Visual and spacing drift appears because different rendering paths are used.
- Content structure is inconsistent (structured JSX vs large HTML string).
- Title drift existed across LOs (`Pronunciation Focus` vs `Demystifying French Pronunciation`, plus typo in LO12).

## Target Outcomes
- One architecture pattern for pronunciation sections (LO1-style tabs pipeline).
- Single rendering path for both single-topic and multi-topic pronunciation sections.
- Consistent pedagogic title pattern:
  - Main: `Pronunciation Focus`
  - Subtitle: `Demystifying French Pronunciation`
- LO2 tab labels and structure aligned with LO1 style conventions.

## Recommended LO2 Structure (LO1-aligned)
- Keep pronunciation section in tab architecture even when there is one item.
- Refactor LO2 pronunciation into 2 tab items:
  1. `1. Silent letters at the end of a word`
  2. `2. The French "th"`
- Naming recommendation:
  - Yes, use `The French "th"` for consistency with LO1’s `The French "r"` pattern.

## Why This Is Better
- Removes architecture drift and reduces styling regressions.
- Makes future LOs predictable: one section model supports 1, 2, or 4+ tabs.
- Improves maintainability and accessibility QA (same DOM shape and interaction model).

## Risks / Watchouts
- Refactoring from large HTML blocks to structured JSX can unintentionally alter spacing.
- Legacy inline audio links may behave differently than `AudioClip` components if mixed.
- Tab migration can change mobile behavior if trigger labels are too long.

## Non-goals (this pass)
- Full pedagogical rewrite of pronunciation text across all LOs.
- Broad rewrite of non-pronunciation sections.

## Suggested Implementation Order
1. Complete LO1/LO2 pronunciation architecture parity first.
2. Move LO2 to `Group + displayAsTabs` with two child pronunciation items.
3. Convert LO2 pronunciation content into structured JSX components (avoid monolithic HTML string).
4. Normalize audio interaction to `AudioClip`.
5. Roll forward to other LOs only after LO1/LO2 parity is stable.

## Cross-LO Styling Consistency (current status)
- Emphasis token parity is now enforced at section level for grammar + pronunciation containers.
- Pronunciation inline emphasis (`em`/`strong`) now follows the same amber emphasis source used in grammar, reducing visual drift between LO1/LO2/LO3.
