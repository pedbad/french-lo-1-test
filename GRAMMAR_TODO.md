# Grammar TODO (LO2 Unification)

## Scope
- Learning object: LO2 (`?lang=fr&lo=2`)
- Primary section: Grammar and Usage
- Current grammar config source: `src/learningObjectConfigurations/fr/2.json`
- Current grammar implementation source: `src/components/CustomComponents_FR/CustomComponents_FR.jsx` (`LO2Grammar`)

## Problem Statement
- LO2 grammar currently renders as one monolithic custom component while LO1 grammar uses grouped structured sections.
- LO2 grammar semantics are inconsistent with current accessibility targets (for example pseudo headings via `<p><strong>...`).
- LO2 modal links for subject pronouns currently open incomplete modal content because fallback lookup captures only the heading anchor context.
- LO2 grammar and pronunciation content includes mixed legacy patterns that can drift from the current standardized `AudioClip` interaction style.

## Target Outcomes
- LO2 grammar should match LO1 section architecture and visual rhythm.
- LO2 grammar headings/content should use semantic structure aligned with accessibility checks.
- Subject-pronoun modal links should open full explanatory content, not heading-only fallback snippets.
- Audio interactions in grammar-related content should be consistent with standardized speaker/button behavior.

## Proposed Refactor Strategy
1. Config architecture alignment:
- Move LO2 grammar config from single `LO2Grammar` entry to a `Group` with focused grammar sub-items.
- Keep LO2 pedagogical order:
  - `1. Verbs in French`
  - `2. Grammatical genders`
  - `3. Subject pronouns`

2. Component decomposition:
- Split `LO2Grammar` into focused components (for example `LO2Grammar1`, `LO2Grammar2`, `LO2Grammar3`).
- Keep content ownership in React components (avoid regressing to large raw HTML strings).

3. Accessibility semantics pass:
- Replace pseudo headings with true heading elements.
- Ensure table semantics are explicit for conjugation structures.
- Keep existing language-learning emphasis and inline audio behavior intact.

4. Modal link reliability:
- Add explicit modal content mapping for `subject-pronouns` in app modal resolver path.
- Use React-rendered modal content so highlight styling and inline components remain consistent.

5. Audio consistency pass:
- Audit LO2 grammar + pronunciation content for legacy inline audio-link patterns.
- Prefer `AudioClip` for consistent behavior and centralized playback controls.

## Risks
- Shared component/style changes can unintentionally affect other LOs.
- Modal-link behavior spans multiple section/component patterns; fallback logic changes need careful regression testing.
- Any grammar table semantic changes may impact styling and spacing if selectors are currently structure-dependent.

## Non-goals (for this pass)
- Full rewrite of LO2 pronunciation pedagogy text.
- Cross-LO grammar content rewrite.
- Broad migration of all LO custom components in one step.

## Suggested implementation order
1. Introduce LO2 grammar config structure changes first (no behavior change yet).
2. Implement decomposed LO2 grammar components and wire them.
3. Add subject-pronoun explicit modal mapping.
4. Run accessibility validation pass.
5. Run visual parity pass against LO1 grammar sections.

