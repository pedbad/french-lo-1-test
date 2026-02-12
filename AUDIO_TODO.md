# Audio Playback TODO

## Problem Summary

Audio playback responsibility is currently spread across multiple places:

- `AudioClip` starts ad-hoc `new Audio(...)` clips.
- `SequenceAudioController` manages its own `<audio>` element.
- `playAudioLink` in `src/utility.js` starts additional ad-hoc `new Audio(...)` clips.
- Native `<audio controls>` elements can also play directly.

Because these paths are independent, multiple clips can play at the same time.  
This caused overlap bugs where users could trigger several audio clips concurrently.

## Temporary Fix Implemented

As a short-term stabilization, a utility-based global audio stop mechanism was added in `src/utility.js`:

- `trackFloatingAudio(audio)`: tracks non-DOM `new Audio(...)` instances.
- `stopAllAudioPlayback(exceptAudio)`: pauses all active audio (DOM `<audio>` + tracked floating audio), except the one about to play.

This helper is now called from all key playback entry points:

- `src/components/AudioClip/AudioClip.jsx`
- `src/components/SequenceAudioController/SequenceAudioController.jsx`
- `playAudioLink` in `src/utility.js`

Result: only one audio clip should remain active at a time.

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
