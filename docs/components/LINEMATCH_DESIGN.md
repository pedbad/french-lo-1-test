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

## Current Interaction Pattern

### Desktop / larger screens
- Show 6 pictures in a left column.
- Show the 6 matching French words in a right column.
- Randomize the order of the 6 right-side words.
- Keep the left image tiles compact and visually aligned with the existing exercise card scale.
- Each left item has a source point.
- Each right item has a circular target point.
- Learner can start from either side:
  - click a picture, then a word
  - or click a word, then a picture
- One connection per image.
- A right-side target can only accept one connection.
- Entire picture wrappers act as source hit areas.
- Entire word-bank rows act as target hit areas, except the word/audio area which remains audio-only.

### Check behavior
- Learner clicks `Check answers`.
- Correct matches:
  - remain connected
  - line turns green
- Incorrect matches:
  - recoil back to the source
  - do not remain attached
- Partial checking is allowed after the first completed match.

### Reset behavior
- `Reset` starts a fresh round.
- A new random sample and new word order are generated.

### Audio
- On desktop, audio lives with the right-side French word bank.
- On mobile, each image row includes an audio control before the image.
- Audio remains secondary support, not the main task mechanic.

## Mobile Behavior
- Do not use the wire/connector UI on small screens.
- Use a simpler built-in fallback row for each item:
  - audio icon
  - image
  - dropdown/select
  - correct/incorrect result icon after checking

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
V1 is now implemented as a deliberately narrow first release.

Implemented:
- 6 sampled items from a larger config bank
- desktop connector matching
- mobile dropdown fallback
- audio support on desktop word items and mobile image rows
- check / reset / show answer
- correct/incorrect persistence rules
- desktop recoil animation for wrong matches
- mobile per-row result icons

Still deferred:
- true live drag with a moving active line
- keyboard-first connector controls
- richer accessibility announcements beyond the current visual/mobile fallback behavior
- more physical elastic motion beyond the current simple recoil

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
      "localLanguage": "balcony",
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

## Implementation Notes

- The current connector model is click-to-connect, not true pointer-drag.
- The recoil effect is implemented with the existing SVG connector layer and a short timed animation.
- LO5 is the pilot rollout and keeps the teacher-authored vocabulary bank, images, and lesson structure.
- The left desktop status area doubles as lightweight support text by showing the English room label until the item becomes `Selected` or `Matched`.
