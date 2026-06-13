# Exercise Component Guide

A reference for every exercise component in the app. Each entry covers what the learner does, the pedagogical purpose, key config props, and implementation notes for developers.

Components are grouped by interaction type. All live under `src/components/exercises/` unless noted.

---

## Typed-response exercises (three-layer architecture)

These three components share a single runtime (`TextEntryExerciseRuntime`) and differ only by props. See the three-layer architecture diagram in `README.md`.

---

### `DictationExercise`

**What the learner does:** Listens to an audio clip and types the full phrase or sentence they hear.

**Pedagogical purpose:** Develops listening comprehension, spelling, and recall. Learner must reproduce the target language without visual support.

**Key behaviour:**
- Comparison is accent-strict but punctuation/spacing-tolerant (apostrophes, commas, trailing periods are normalised)
- Audio icon positioned on the left of each row
- Global Check / Show answers / Reset controls at the bottom
- Per-row diff feedback after checking (inserted/deleted highlighting)
- Enter key submits the focused row

**Config example:**
```json
{
  "component": "DictationExercise",
  "id": "dictationExercise1",
  "phrases": [
    ["", "[Bonjour, comment allez-vous ?]", "audio/lo1/exercises/phrase1.mp3"]
  ]
}
```

---

### `TypedTransformExercise`

**What the learner does:** Sees a prompt (e.g. the masculine form of an adjective) and types the transformed target form (e.g. the feminine form).

**Pedagogical purpose:** Practises morphological transformations — adjective agreement, verb conjugation, gender changes, etc. The prompt gives context; the learner must apply a grammatical rule.

**Key behaviour:**
- Comparison is strict (exact trim match)
- Optional inline audio alongside the prompt
- Gender header icons (Mars/Venus) for masculine/feminine columns
- Global Check / Show answers / Reset controls
- Per-row diff feedback after checking

**Config example:**
```json
{
  "component": "TypedTransformExercise",
  "id": "typedTransformExercise1",
  "header": ["Masculine", "Feminine"],
  "phrases": [
    ["grand", "[grande]"]
  ]
}
```

## Choice / selection exercises

---

### `InlineChoiceGroup`

**What the learner does:** Sees a sentence with one or more blank slots and selects the correct option by clicking a button from a small visible set.

**Pedagogical purpose:** Practises form selection where all options are visible simultaneously — good for short forms, grammatical categories, or high-frequency choices where the learner benefits from seeing the full option set at once.

**Key behaviour:**
- Options always visible as buttons (not hidden in a dropdown)
- Optional shuffled subset on load/reset (`shuffleItems`, `sampleSize`)
- Row-level audio icon (left-positioned)
- Per-row immediate feedback on selection
- Optional passage/poem layout mode

---

### `SelectExercise`

**What the learner does:** Sees a sentence or prompt and selects the correct answer from a dropdown/select menu.

**Pedagogical purpose:** Practises form selection where hiding options reduces visual clutter — better for longer option lists or contexts where the learner should recall the form before scanning alternatives.

**Key behaviour:**
- Options hidden in a native select element until opened
- Optional shuffled row order (`shuffleItems`, `sampleSize`)
- Optional `inline-passage` layout mode for poem/continuous text contexts (with accent strips and attribution lines)
- Global Check / Show answers / Reset controls

---

### `RadioQuiz`

**What the learner does:** Reads a question or prompt and selects one answer from a set of radio-button options.

**Pedagogical purpose:** Multiple-choice comprehension or discrimination. Best for questions with clearly distinct distractors where the learner evaluates each option.

**Key behaviour:**
- One answer selectable per question
- Immediate or deferred feedback depending on config
- Table layout with question and option columns

---

## Drag-and-drop exercises

---

### `DraggableFillGaps`

**What the learner does:** Drags word or phrase tiles from a bank into blank slots within a sentence or passage.

**Pedagogical purpose:** Practises word-level recall and sentence structure. The tile bank provides the target words; the learner decides correct placement without needing to spell from memory.

**Key behaviour:**
- Tiles dragged from a source bank to target slots
- Optional audio per row or passage
- Check / Hints / Reset controls
- Mobile touch support

> **Previous name:** `Blanks` (renamed — the old name described the slots, not the learner interaction)

---

### `PhraseReorderExercise`

**What the learner does:** Drags whole phrase-pair rows into the correct order. Each row shows the target-language phrase; the learner arranges rows to match a correct sequence.

**Pedagogical purpose:** Practises sequencing and recall at the phrase/sentence level. Used for ordering dialogues, steps in a process, or matched phrase pairs.

**Key behaviour:**
- Entire rows are the drag units (not individual words)
- Language 1 column fixed; language 2 column is shuffled and draggable
- Pointer events support for touch/mobile drag
- Animated flip transitions on reorder and reset
- Check answers / Show answer / Reset controls

> **Previous name:** `Sortable` (renamed — the old name was too generic and described implementation, not the interaction)

---

### `WordOrderExercise`

**What the learner does:** Drags individual word tokens into the correct order to build a grammatically correct sentence.

**Pedagogical purpose:** Practises sentence construction and word order rules. Tokens are displayed shuffled; the learner reconstructs the target sequence.

**Key behaviour:**
- Individual word tokens are the drag units (not whole rows)
- Vertical layout on mobile; horizontal grid on desktop (1200px+)
- Optional audio to play before arranging
- Animated flip transitions on reorder, reset, and show-answer
- Check answers / Show answer / Reset controls

> **Previous name:** `SequenceOrder` (renamed — "sequence" and "order" were redundant; the new name clarifies the unit being ordered is individual words)

---

### `LineMatch`

**What the learner does:** Connects items in the left column to matching items in the right column by drawing a line (desktop) or selecting from a dropdown (mobile).

**Pedagogical purpose:** Practises associative recall — matching pictures to words, words to definitions, or prompts to responses.

**Key behaviour:**
- Connector-style SVG line drawing on desktop
- Select/dropdown fallback on mobile
- Picture-to-word or word-to-word matching
- Check / Reset controls

---

## Listening / audio exercises

---

### `WordSpotExercise`

**What the learner does:** Listens to an audio clip for each sentence, then clicks the specific word(s) in the sentence that contain the target pronunciation feature.

**Pedagogical purpose:** Develops phonological awareness and listening discrimination. The learner identifies target sounds or features in context rather than in isolation.

**Key behaviour:**
- Target words marked with `[brackets]` in config text
- Clicking the correct word highlights it (correct); clicking a non-target marks an error
- Show answers button appears after 2 errors
- Progress dots track revealed targets
- Audio clip per row

> **Previous name:** `WordParts` (renamed — the old name implied word-building or morphology, not a listening click exercise)

---

### `InlineTypedGapExercise`

**What the learner does:** Listens to sentences played in sequence and types the missing word(s) for each sentence as it plays.

**Pedagogical purpose:** Combines listening comprehension with spelling/recall. Each sentence is played (with optional whole-passage audio), and the learner types gaps inline within the displayed text.

**Key behaviour:**
- Sequential audio controller (play all or individual sentences)
- Inline typed input per gap within the sentence display
- Per-row immediate or deferred feedback
- Check / Show answers / Reset controls
- Circular audio progress indicator for whole-passage playback

---

## Memory / game exercises

---

### `MemoryMatchGame`

**What the learner does:** Flips cards to find matching pairs (e.g. a French word and its English translation, or a word and a picture).

**Pedagogical purpose:** Practises vocabulary recall through spaced repetition within a session. The game mechanic encourages repeated exposure before pairs are found.

**Key behaviour:**
- Grid of face-down cards; two flipped at a time
- Optional audio on match
- Lesson-owned images preferred under `public/img/loX/exercises/`
- Card sizing expressed in Tailwind utilities; back face uses badge-style question mark
- Matched pairs remain face-up

---

## Word-level / morphology exercises

---

### `WordParts` *(deprecated alias)*

Alias for `WordSpotExercise`. Do not use in new config — use `WordSpotExercise` instead.

---

## Shared infrastructure (not used directly in config)

---

### `TextEntryExerciseRuntime`
**Location:** `src/components/exercises/TextEntryExerciseRuntime/`

The shared runtime used by `DictationExercise` and `TypedTransformExercise`. Contains all common logic: input state, check/show/reset handlers, diff highlighting, audio column positioning, progress dots, header rendering, and Enter-key submit. Not used directly in config. (Formerly also served `ClozeTypingExercise` via a `useGlobalActions=false` inline-gap branch; both removed — PRs #17/#18.)

### `ProgressDots`
Visual progress indicator (dot row). Used across multiple exercise types to show correct/total counts.

### `SortableWordCard`
Draggable card primitive used by `PhraseReorderExercise` and `WordOrderExercise`. Handles drag styling, drop-target highlighting, and animated flip transitions.

### `SequenceAudioController`
Sequential audio playback controller used by `InlineTypedGapExercise`. Manages play-all and per-sentence audio state with circular progress display.

---

## Naming conventions

All exercise component names follow behavior-first semantics — the name describes what the **learner does**, not the implementation:

| Pattern | Examples |
|---|---|
| `*Exercise` | `DictationExercise`, `TypedTransformExercise`, `WordSpotExercise`, `WordOrderExercise` |
| `*Group` | `InlineChoiceGroup` |
| `*Game` | `MemoryMatchGame` |
| `*Match` | `LineMatch` |
| `*Quiz` | `RadioQuiz` |
| `Draggable*` | `DraggableFillGaps` |
| `*Reorder*` | `PhraseReorderExercise` |

Avoid generic or implementation-describing names (`Blanks`, `Sortable`, `SequenceOrder`, `WordParts`, `Monologue`). All such legacy names are kept as deprecated aliases until fully removed.
