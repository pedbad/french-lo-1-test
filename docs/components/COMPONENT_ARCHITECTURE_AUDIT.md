# Component Architecture Audit

## Purpose
This document is the canonical audit for component directory organization, naming consistency, and single-source-of-truth alignment.

It is intended to prevent architecture drift while we continue LO-by-LO refactoring.

## Current Runtime Model (as implemented)

1. Shared reusable components are rendered directly from config keys in `src/lo-config/*.json`.
2. `src/App.jsx` resolves known component keys via explicit switch cases.
3. Unknown keys are resolved through the custom registry:
   - `AllCustomComponentsFR[component]`
   - source: `src/components/custom/registry.js`

This means the app currently has two delivery paths:
- reusable shared engines (`PhraseTable`, `InlineChoiceGroup`, `SelectExercise`, `DraggableFillGaps`, etc.)
- custom one-off FR blocks (`LOxGrammarY`, `LOxPronunciationY`, etc.)

## Audit Findings

### 1) Monolithic custom file risk (resolved)
- The former monolith `src/components/CustomComponents_FR/CustomComponents_FR.jsx` has been retired.
- Custom content is now split by domain:
  - `src/components/custom/grammar/*.jsx`
  - `src/components/custom/pronunciation/*.jsx`
  - `src/components/custom/misc/*.jsx`
- Registry remains explicit in `src/components/custom/registry.js`.

### 2) Naming drift
- Legacy and semantic names coexist:
  - modern semantic names now dominate (`DraggableFillGaps`, `SelectExercise`, `TypedTransformExercise`, `DictationExercise`)
  - residual references to legacy names still exist mainly in historical docs/changelogs
- Risk:
  - config ambiguity
  - slower onboarding
  - reintroduction of deprecated patterns

### 3) Registry fallback allows drift
- Custom namespace fallback makes it easy to add new one-off component names in config.
- Risk:
  - single source of truth weakens
  - architecture becomes config-key driven by ad hoc custom classes

### 4) Legacy/dead component surface
- Some directories/components appear legacy or demo-only and are not part of current learner runtime flows.
- Risk:
  - maintenance overhead
  - confusion about authoritative paths

### 5) Good baseline already in place
- shadcn primitives are centralized in `src/components/ui/*`.
- App styling has moved to Tailwind + tokenized `src/index.css` (no SCSS source-of-truth in app components).

This is the correct foundation; remaining drift is mostly structural/naming and custom-content organization.

## Target Architecture (single source of truth)

### A) Reusable components by behavior
- `src/components/exercises/*` for reusable exercise engines
- `src/components/content/*` for reusable content renderers (tables/monologues/sections)
- `src/components/ui/*` for shadcn primitives only

### B) Custom French authored blocks by domain
- `src/components/custom/grammar/*`
- `src/components/custom/pronunciation/*`
- `src/components/custom/misc/*`
- `src/components/custom/registry.js` as explicit registry map

### C) Config contract
- JSON remains content/data first.
- Components are parameterized for behavior differences where feasible.
- New one-off custom keys require explicit registry review.

## Migration Plan (low risk, phased)

### Phase 1 - Non-breaking structural split
- Status: completed.
- `CustomComponents_FR.jsx` split by domain files.
- `App.jsx` wired to `src/components/custom/registry.js`.

### Phase 2 - Naming convergence
- Migrate config keys from legacy names to semantic names:
  - `DropDowns` -> `SelectExercise` or `InlineChoiceGroup` as appropriate
  - `Blanks` -> `DraggableFillGaps`
  - generic `AnswerTable` -> semantic wrappers where behavior differs
- Keep compatibility aliases only where still required by active config.

### Phase 3 - Remove dead/legacy paths
- Remove unused component directories after usage confirmation.
- Clean barrel exports in `src/components/index.js`.
- Add CI guard to reject unknown config component keys unless registered.

## Guardrails

1. No behavior changes in structural split commits.
2. Validate each phase with `yarn build` and LO smoke checks.
3. Update docs (`README.md`, `CHANGES.md`, tracker docs) in same PR to avoid drift.
4. Prefer parameterized shared components over adding new custom one-offs.

## Decision Rule for Future Work

When adding/changing functionality:

1. Can this be solved by existing shared component + config params?
2. If no, can shared component be extended without LO-specific branching?
3. If still no, add a scoped custom component in domain folder and register explicitly.

Do not add new monolithic custom blocks.
