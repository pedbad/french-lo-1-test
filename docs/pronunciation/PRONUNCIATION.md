# Pronunciation Architecture Notes

## Current State

Pronunciation sections now share the same **section architecture**:
- `Group` + `displayAsTabs: true` in config
- rendered through the shared tabs path in `src/App.jsx`

This is true for LO1, LO2, and LO3.

LO4 is currently the outlier:
- `src/learningObjectConfigurations/fr/4.json` uses `component: "LO4Demystify"` for the whole pronunciation section.
- It bypasses the shared Group+Tabs shell and increases drift risk.

However, LO1 and LO2 still use different **tab body components**:
- LO1 tab bodies: `LO1Demystify1`, `LO1Demystify2`, `LO1Demystify3`, `LO1Demystify4`
- LO2 tab bodies: `LO2Pronunciation1`, `LO2Pronunciation2`

So the shell is shared, but content implementation is still LO-specific.

## Why This Is Better Than Before

- LO2 no longer uses a monolithic pronunciation block.
- LO1 and LO2 now follow the same tabs interaction model.
- Section title consistency is improved (`Pronunciation Focus — Demystifying French Pronunciation`).
- Styling drift risk is reduced at the container/tabs level.

## Remaining Flaws

1. No shared tab content component:
- Each LO pronunciation topic is still handwritten JSX.
- Layout/content behavior can drift again between LOs.

2. Mixed content authoring patterns:
- Some topics are structured JSX.
- Legacy sections in other LOs may still rely on large HTML strings.

3. Higher maintenance cost:
- Repeated patterns (intro text, audio example rows, notes) are duplicated.
- Small UX updates must be repeated in multiple LO-specific components.

4. Harder QA consistency:
- A11y and typography issues can recur in one LO while fixed in another.

## Long-Term Proposal (Recommended)

Introduce one shared pronunciation topic renderer:
- Example name: `PronunciationTopic`

### Proposed model
- Keep tabs shell in `Group + displayAsTabs`.
- Replace LO-specific tab-body JSX with config-driven content objects.
- `PronunciationTopic` renders:
  - topic heading
  - instructional paragraph(s)
  - example groups (one-per-line list or grid)
  - optional note blocks
  - `AudioClip` items from config paths

### Benefits
- One source of truth for tab-body layout behavior.
- Faster future LO authoring (content-only updates in config).
- Lower drift risk for spacing, semantics, and accessibility.
- Easier global enhancements (for example list formatting, responsiveness, analytics hooks).

## Suggested Migration Strategy

1. Define a typed config schema for pronunciation topics:
- `title`
- `intro`
- `exampleGroups[]`
- `notes[]`
- `items[]` (`label`, `soundFile`, optional `emphasis`)

2. Build `PronunciationTopic` and keep it backward-compatible:
- Continue supporting existing LO-specific components during migration.

3. Pilot in LO2 first:
- Recreate `LO2Pronunciation1/2` via the new shared renderer.
- Confirm visual parity and audio behavior.

4. Migrate LO1 topics next:
- Move `LO1Demystify1..4` to config-driven data.

5. Roll out to remaining LOs with pronunciation sections.

## LO4 Alignment Plan (Proposed)

1. Move LO4 pronunciation section to shared architecture in config:
- `component: "Group"`
- `displayAsTabs: true`
- section title remains `Pronunciation Focus — Demystifying French Pronunciation`

2. Split current LO4 pronunciation content into tab topics:
- `1. The nasal sound "in / ain"`
- `2. Related spellings and examples` (for `aim/ein/im/ym/yn/eim`)
- `3. Final "en / ens" forms`

3. Provide per-tab instructional `Info` copy matching LO1–LO3 rhythm.

4. Replace long inline comma chains with stacked audio lines where readability benefits.

5. Remove inline visual styling in pronunciation body content and rely on shared tokenized classes.

6. Validate parity:
- desktop/mobile tab behavior
- audio playback behavior (single-active global policy)
- heading/spacing consistency with LO1–LO3.

## Practical Guidance

- Short term: continue using current architecture (shared tabs shell + LO-specific bodies) for quick edits.
- Medium/long term: prioritize shared tab-body renderer to remove remaining drift and reduce maintenance.
