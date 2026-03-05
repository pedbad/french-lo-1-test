# Exercise 5 Redesign (Horizontal Sortable Cards)

## Goal
Replace the current drag-to-slots mechanics with a single, clear left/right sortable interaction.

## Final Interaction Pattern
- Show numbered positions (`1..8`) in a row.
- Below, show the same number of jumbled word cards in a horizontal row.
- Learner drags cards left/right to reorder.
- As a card moves, neighboring cards shift to make space (sortable behavior).
- Learner checks the final order against the audio sequence.

## Learner Task
1. Play/listen to the full audio sequence.
2. Reorder the jumbled cards left-to-right to match the spoken order.
3. Click `Check answers`.
4. Use `Reset` to retry or `Show answer` to reveal the correct order.

## Controls
- `Play audio`
- `Check answers`
- `Reset`
- `Show answer`

## Scoring
- Exact position matching against the canonical sequence.
- Result text:
  - `{correct} out of {total} in the correct position`
  - Perfect state: `{total} out of {total} correct. Perfect order.`

## Show Answer Rule
- If `Show answer` is used:
  - sequence is set to the canonical order.
  - success-reward effects (if added later) must be suppressed.

## Accessibility
- Keep all action buttons keyboard accessible.
- Result text announced via `aria-live="polite"`.
- Drag interaction remains pointer-first for V1.
- Optional V2: add keyboard reorder shortcuts for each card.

## Technical Notes (Current Implementation)
- Component: `SequenceOrder`
- No SCSS added; styling is utility-class based in JSX.
- Exercise 5 config now points to `component: "SequenceOrder"`.

