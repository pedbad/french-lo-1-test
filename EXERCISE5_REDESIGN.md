# Exercise 5 Redesign (V1 Spec)

## Goal
Replace the current drag-to-slots mechanic with a clearer listening-order interaction.

## Learning Task
Learner listens to one audio sequence and reconstructs the spoken word order.

## Interaction Model

### Desktop / Large screens (>= 1000px)
- Two zones:
  - `Word Bank` (left): unordered items.
  - `Your Sequence` (right): ordered items.
- Primary action: click a token to move it between zones.
- In `Your Sequence`, token appends to end by default.
- Optional enhancement later: drag between zones (not required for V1).

### Mobile / Small screens (< 1000px)
- Single `Your Sequence` list view.
- Tokens in sequence can be reordered using explicit controls:
  - `Move up`
  - `Move down`
- No drag required.

## Controls
- `Play audio` (or sequence player)
- `Check answers`
- `Reset`
- `Show answer`

## Scoring / Validation
- Exact sequence match against answer key.
- `Check answers` returns:
  - `correctCount`
  - `isComplete`
- If all correct:
  - success state shown.
- If `Show answer` was used:
  - no success reward animation/effect.

## State Model (V1)
- `wordBank: string[]`
- `userSequence: string[]`
- `correctSequence: string[]`
- `usedShowAnswer: boolean`
- `checkResult: { correctCount: number; isComplete: boolean } | null`

## Edge Cases
- Duplicate words in sequence:
  - store tokens as objects with stable IDs (`id`, `label`), not plain strings.
- Partial sequence on check:
  - count missing as incorrect.
- Reset:
  - restore original word bank and clear checks.

## Accessibility
- All actions keyboard accessible.
- Reorder buttons have clear labels:
  - `Move "X" up`
  - `Move "X" down`
- Announce check result via `aria-live`.

## Content Guidance (Instruction Copy)
Use explicit instruction text:
"Listen to the full audio, then build the exact word order in Your Sequence. On desktop, move words between Word Bank and Your Sequence. On mobile, use Move up/Move down to reorder. Then check your answers."

## Implementation Plan (Small Steps)
1. Create a new component (e.g. `SequenceOrder`) without deleting `Blanks`.
2. Implement desktop two-zone click-to-move behavior.
3. Implement mobile up/down reorder mode.
4. Wire to existing LO1 Exercise 5 data.
5. Add check/reset/show-answer logic.
6. Add accessibility labels and `aria-live` result text.
7. Replace Exercise 5 config `component` once parity is confirmed.

