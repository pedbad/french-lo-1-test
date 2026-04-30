# Audio Playback TODO

## Problem Summary

Audio playback responsibility is currently spread across multiple places:

- `AudioClip` starts ad-hoc `new Audio(...)` clips.
- `SequenceAudioController` manages its own `<audio>` element.
- `playAudioLink` in `src/utils/audioPlayback.js` starts additional ad-hoc `new Audio(...)` clips.
- Native `<audio controls>` elements can also play directly.

Because these paths are independent, multiple clips can play at the same time.  
This caused overlap bugs where users could trigger several audio clips concurrently.

## LO2 Migration Status (Phase 1 + Phase 2 + Blocker Resolution)

- Mapping file created: `AUDIO_LO2_MIGRATION_MAP.md`
- Scope covered:
  - `src/lo-config/about-me.json`
  - `src/components/custom/grammar/about-me-grammar.jsx`
  - `src/components/custom/pronunciation/about-me-pronunciation.jsx`
- Result:
  - 78 unique legacy LO2 audio refs mapped to proposed `audio/lo2/...` targets.
  - Phase 2 executed for all existing refs:
    - 75 files copied to `public/audio/lo2/...`
    - LO2 refs rewritten from `sounds/fr/...` to `audio/lo2/...` in:
      - `src/lo-config/about-me.json`
      - `src/components/custom/grammar/about-me-grammar.jsx`
      - `src/components/custom/pronunciation/about-me-pronunciation.jsx`
  - Initial 3 missing refs were resolved using controlled fallback files:
    - `sounds/fr/Je m'appelle.mp3`
    - `sounds/fr/Je m&apos;appelle.mp3`
    - `sounds/fr/Salut.mp3`
  - Fallback targets created:
    - `public/audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3`
    - `public/audio/lo2/pronunciation/demystify/016-salut.mp3`
  - LO2 blocker count is now `0`.

## LO3 Migration Status (Phase 1 Complete)

- Scope covered:
  - `src/lo-config/origins-and-languages.json`
  - `src/components/custom/grammar/origins-and-languages-grammar.jsx`
  - `src/components/custom/pronunciation/origins-and-languages-pronunciation.jsx`
- Result:
  - 140 unique legacy LO3 refs mapped (`sounds/fr/...` -> `audio/lo3/...`)
  - 140 files copied to `public/audio/lo3/...`
  - LO3 migration blocker count: `0`
- Tracking docs:
  - `AUDIO_LO3_MIGRATION_MAP.md`
  - `LO3_AUDIO_BLOCKERS.md`
- Legacy cleanup performed:
  - removed 121 LO3 source files from `public/sounds/fr` that had no remaining references in `src`.

## LO4 Migration Status (Phase 1 Complete)

- Scope covered:
  - `src/lo-config/current-location.json`
  - `src/components/custom/pronunciation/current-location-pronunciation.jsx`
  - `src/components/exercises/current-location/nasal-rhyme-exercise.jsx`
- Result:
  - 61 unique legacy LO4 refs mapped (`sounds/fr/...` -> `audio/lo4/...`)
  - 62 references rewritten (includes both `sounds/fr/ain.mp3` and `/sounds/fr/ain.mp3` forms)
  - 62 files copied to `public/audio/lo4/...`
  - LO4 migration blocker count: `0`
- Tracking docs:
  - `AUDIO_LO4_MIGRATION_MAP.md`
  - `LO4_AUDIO_BLOCKERS.md`
- Legacy cleanup performed:
  - removed 59 LO4 legacy source files from `public/sounds/fr` that had no remaining references in `src`.
  - retained 3 shared legacy files during the original LO4 pass because they were
    still referenced outside LO4 at that time:
    - `sounds/fr/aimer.mp3`
    - `sounds/fr/jardin.mp3`
    - `sounds/fr/peinture.mp3`
  - follow-up repo-wide cleanup later removed the remaining `public/sounds/fr`
    tree after runtime refs reached zero.

## Temporary Fix Implemented

As a short-term stabilization, a utility-based global audio stop mechanism was added in `src/utils/audioPlayback.js`:

- `trackFloatingAudio(audio)`: tracks non-DOM `new Audio(...)` instances.
- `stopAllAudioPlayback(exceptAudio)`: pauses all active audio (DOM `<audio>` + tracked floating audio), except the one about to play.

This helper is now called from all key playback entry points:

- `src/components/AudioClip/AudioClip.jsx`
- `src/components/SequenceAudioController/SequenceAudioController.jsx`
- `playAudioLink` in `src/utils/audioPlayback.js`

Result: only one audio clip should remain active at a time.

## Data Contract Note: Phrase Rows With Audio Prefix

Some phrase/vocabulary rows are authored as:

- `[audioPath, frenchText, englishText]`

This impacts sorting logic if code naively uses column `0`.

- `0` is frequently a `.mp3` filename, not learner-visible vocabulary.
- Alphabetical sort must derive its key from the first non-audio text cell.

Current safeguard (implemented in `src/components/PhraseTable/PhraseTable.jsx`):

- audio cells are detected and excluded from sort-key selection
- sort key is the first non-audio string cell in the row
- normalization/collation remains accent-insensitive and locale-aware

Why this belongs in audio docs:

- audio metadata placement is the reason the sort bug happened
- if row schema changes in future LOs, this rule must remain explicit to avoid regressions

## Why This Is Temporary

The helper fixes behavior, but architecture is still distributed:

- Playback policy is still enforced by convention (call helper before play).
- State is not centralized (no single source of truth for active clip).
- Future features (queueing, priorities, global mute, analytics, background resume) will be harder to implement cleanly.

## Long-Term Refactor: Introduce `AudioManager`

Create a dedicated audio service/class (or React context-backed service) to centralize playback ownership.

### Suggested responsibilities

- Single owner of active playback session.
- Standard API, e.g.:
  - `play(source, options)`
  - `pauseCurrent()`
  - `stopAll()`
  - `registerElement(audioEl)`
  - `setGlobalVolume(value)`
- Eventing/state subscription for UI (`activeId`, `playState`, progress).
- Policy controls:
  - exclusive playback (default)
  - optional queue mode for sequence scenarios
  - category priorities (e.g., sequence vs one-off clip)

### Why this is better

- Consistency: one playback rule implemented once.
- Reliability: fewer edge-case regressions as app grows.
- Extensibility: easier to add global mute, resume, queue, telemetry.
- Testability: manager behavior can be unit-tested independently of UI components.

## Incremental Migration Plan

1. Create `src/audio/AudioManager.js` with current exclusivity logic.
2. Replace direct helper usage with manager API in:
   - `AudioClip`
   - `SequenceAudioController`
   - `playAudioLink` callers
3. Add small unit tests for manager behavior:
   - starting new clip pauses previous
   - DOM and floating audio both handled
   - exception clip remains playing
4. Remove legacy direct playback paths where possible.
5. Keep utility helper as compatibility shim until all callers are migrated.

## Acceptance Criteria for Refactor

- Exactly one clip plays at any time (unless explicit non-exclusive mode is enabled).
- All playback entry points go through `AudioManager`.
- No direct unmanaged `new Audio(...).play()` calls remain in components.
- Existing LO activities keep current UX behavior.

## Estimated Timeline

- Phase 1: Create manager + parity API (`play`, `stopAll`, registration, subscriptions)
  - Estimate: 0.5-1 day
- Phase 2: Migrate current callers (`AudioClip`, `SequenceAudioController`, `playAudioLink` paths)
  - Estimate: 0.5-1 day
- Phase 3: Add tests + edge-case hardening (rapid click spam, unmount cleanup, sequence handoff)
  - Estimate: 0.5-1 day
- Phase 4: QA pass across LO1 activities and regression verification in other LOs
  - Estimate: 0.5 day

Total estimated effort: **2-3.5 working days**.

If this also includes optional features (global mute UI, queue mode, analytics hooks), add **+1-2 days**.
