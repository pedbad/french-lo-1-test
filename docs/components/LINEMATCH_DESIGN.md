# LineMatch Design

## Goal
Replace the current LO5 Exercise 1 draggable word activity with a clearer matching interaction that reduces scrolling and motor load, especially on desktop, while still preserving picture-to-word vocabulary matching.

## Why
- The current `DraggableFillGaps` activity shows too many items at once.
- On smaller screens, learners do too much scrolling before they can focus on the language task.
- Dragging word tiles adds interface friction that is not central to the pedagogy.
- The learning goal here is recognition and matching, not sentence building or sequence ordering.

## Pedagogical Purpose
This activity is a first-stage vocabulary recognition task.

The learner should:
- look at a room/house image
- identify the concept
- connect it with the correct French word
- optionally use audio for support

The activity should reinforce:
- image -> meaning mapping
- meaning -> French lexical item mapping
- audio support for pronunciation
- low-stakes recognition before later article/gender/description tasks

## Final Interaction Pattern

### Desktop / larger screens
- Show 6 pictures in a left column.
- Show the 6 matching French words in a right column.
- Randomize the order of the 6 right-side words.
- Keep the left image tiles visually aligned with the square `SortableWordCard` footprint used in `SequenceOrder`.
- Each left item has a source point.
- Each right item has a circular target point.
- Learner drags an elastic line from the left item to a right-side target.
- One connection per image.
- A right-side target can only accept one connection.

### Check behavior
- Learner clicks `Check answers`.
- Correct matches:
  - remain connected
  - line turns green
- Incorrect matches:
  - recoil back to the source
  - do not remain attached

### Reset behavior
- `Reset` clears all connections and checked state.
- New random sample and/or new order should be controlled explicitly by config/logic.

### Audio
- Audio should live with the right-side French word bank, not the image tiles.
- Each right-side French word should support audio playback.
- Audio remains secondary support, not the main task mechanic.

## Mobile Behavior
- Do not use the wire/connector UI on small screens.
- Use a simpler mobile fallback.
- Recommended fallback: `SelectExercise`-style dropdown per picture.

This means `LineMatch` is really a responsive hybrid:
- desktop/tablet landscape: connector matching
- mobile/narrow screens: dropdown matching

## Why This Is Better Than The Current Drag/Drop
- less scrolling
- less visual clutter
- lower motor burden
- clearer one-to-one matching model
- better suited to picture vocabulary
- easier to chunk into 6 items
- easier to validate quickly

## Scope For V1
V1 should stay deliberately narrow.

Include:
- 6 sampled items from a larger config bank
- desktop connector matching
- mobile dropdown fallback
- audio playback on word items
- check / reset / show answer
- correct/incorrect persistence rules

Do not include yet:
- animated bezier physics polish beyond simple recoil
- keyboard connector control
- partial scoring beyond correct count
- complex accessibility shortcuts beyond the mobile fallback

## Proposed Config Shape
High-level idea only:

```json
{
  "component": "LineMatch",
  "id": "lineMatch1",
  "titleText": "1. The Rooms of the House",
  "instructionsText": "Match each picture to the correct French word.",
  "informationTextHTML": "<p>...</p>",
  "sampleSize": 6,
  "mobileFallback": "SelectExercise",
  "items": [
    {
      "image": "/images/memory-rooms/balcony.jpg",
      "label": "balcon",
      "audio": "audio/lo5/..."
    }
  ]
}
```

## Naming
Preferred component name: `LineMatch`

Why:
- short
- matches the visible interaction
- still understandable if the line feels like an elastic connector

## Baby-Step Implementation Plan

### Step 1
Define the contract and checklist.

Output:
- this design doc
- checklist doc

### Step 2
Scaffold the component with static layout only.

Build:
- new `LineMatch` component folder
- left/right columns
- sample 6 items from config
- right-side randomized word bank with audio access
- left image tiles sized to match the square sortable-card footprint
- no dragging yet

Goal:
- validate data shape and visual layout first

### Step 3
Add responsive split.

Build:
- desktop layout for line matching
- mobile fallback branch using select controls

Goal:
- avoid building drag logic before the responsive structure is settled

### Step 4
Add connector state model.

Build:
- source item state
- target occupancy state
- active drag state
- completed connection state

Goal:
- confirm data model before drawing/animation complexity

### Step 5
Add line rendering.

Build:
- render an active line while dragging
- render fixed lines for completed matches

Goal:
- confirm visual connector system before validation logic

### Step 6
Add drop logic and target locking.

Build:
- attach source to target
- enforce one target per source and one source per target
- allow replacement or clear previous connection by rule

Goal:
- make the interaction usable before grading

### Step 7
Add `Check answers`.

Build:
- compare current connections against canonical answers
- keep correct lines
- recoil incorrect lines
- surface score/result text

Goal:
- add learning feedback only after interaction is stable

### Step 8
Add `Reset` and `Show answer`.

Build:
- reset state
- reveal correct connections
- suppress celebration side effects when showing answers

Goal:
- parity with existing exercise conventions

### Step 9
Wire LO5 Exercise 1 to `LineMatch`.

Build:
- swap LO5 config from current draggable activity
- preserve teacher vocabulary and images
- keep sample size at 6

Goal:
- controlled pilot rollout in one lesson only

### Step 10
Polish and verify.

Check:
- desktop usability
- mobile fallback usability
- audio behavior
- spacing
- check/reset/show-answer flows
- no regression in existing exercises
