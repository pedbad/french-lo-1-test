# LineMatch Checklist

## Discovery
- [x] Confirm LO5 Exercise 1 is the pilot target.
- [ ] Confirm source image bank and audio bank already exist.
- [ ] Confirm `sampleSize: 6` is the target interaction size.
- [x] Confirm mobile fallback should be dropdown/select, not connector drag.

## New Component Scaffold
- [x] Create `src/components/exercises/LineMatch/`.
- [x] Add `LineMatch.jsx`.
- [x] Add `index.js`.
- [x] Export from `src/components/exercises/index.js`.
- [x] Ensure `App.jsx` can resolve `component: "LineMatch"`.

## Config Contract
- [ ] Define final config shape for `items`, `sampleSize`, audio, labels, and images.
- [ ] Keep teacher-authored content unchanged.
- [ ] Keep LO5 wording stable while replacing only interaction format.

## Static Layout
- [x] Render 6 sampled picture rows on the left.
- [x] Render 6 randomized French word rows on the right.
- [x] Add visible connector source points.
- [x] Add visible circular drop targets.
- [x] Confirm layout works without drag logic first.

## Responsive Behavior
- [x] Desktop uses connector UI.
- [x] Mobile uses select/dropdown fallback.
- [x] Confirm breakpoint choice.
- [ ] Confirm no excessive scrolling on narrow screens.

## Interaction State
- [x] Track sampled item set.
- [x] Track randomized right-side bank.
- [x] Track active drag source.
- [x] Track current connections.
- [x] Track checked/correct state.

## Connector Drawing
- [ ] Draw active connector while dragging.
- [x] Draw fixed connector after drop.
- [x] Ensure connectors stay aligned on resize/reflow.
- [x] Confirm correct z-index and hit target behavior.

## Validation
- [x] Add `Check answers`.
- [x] Correct lines remain and turn green.
- [x] Incorrect lines recoil back.
- [x] Result text reports score clearly.
- [ ] Result updates are announced politely if needed.

## Actions
- [x] Add `Reset`.
- [x] Add `Show answer`.
- [ ] `Show answer` should not trigger celebration side effects.
- [ ] Reset clears state predictably.

## Audio
- [x] Right-side French words support audio playback.
- [x] One-audio-at-a-time rule remains intact.

## LO5 Migration
- [x] Replace LO5 Exercise 1 config from `DraggableFillGaps` to `LineMatch`.
- [ ] Preserve image set and vocabulary items.
- [ ] Preserve title and teacher-authored instructional copy unless explicitly changed.

## QA
- [x] Desktop test: connect, re-connect, check, reset, show answer.
- [x] Mobile test: dropdown fallback, check, reset, show answer.
- [ ] Confirm no regressions in other LO5 exercises.
- [x] Run `yarn build`.

## Documentation
- [x] Add design doc.
- [x] Add checklist doc.
- [x] Update `CHANGES.md` once implementation begins.
