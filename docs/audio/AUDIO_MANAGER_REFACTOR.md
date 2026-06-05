# AudioManager Refactor Plan

## Current State

Audio playback is split across three independent paths:

| Path | File | Pattern |
|------|------|---------|
| Inline clips | `src/components/AudioClip/AudioClip.jsx` | `new Audio(...).play()` |
| Sequence playback | `src/components/SequenceAudioController/SequenceAudioController.jsx` | Own `<audio>` DOM element |
| Row/link audio | `src/utils/audioPlayback.js` → `playAudioLink` | `new Audio(...).play()` |

A temporary fix exists: `stopAllAudioPlayback()` + `trackFloatingAudio()` in
`src/utils/audioPlayback.js` enforces single-audio policy by convention — callers
must remember to call it. State lives on `window.__floatingAudios` (global, not
managed, not testable).

**This works but is fragile.** Policy enforcement is opt-in. No central source of
truth for active clip. Future features (global mute, queueing, analytics, progress
tracking) are hard to add cleanly.

---

## Goal

Replace the distributed convention with a single `AudioManager` that owns all
playback. Every audio action routes through it. Components become consumers, not
owners.

---

## Architecture Decision: Singleton Module + React Hook

- **`AudioManager`** — plain JS singleton class. Owns state, enforces policy, no
  React dependency. Works from utilities (`playAudioLink`) as well as components.
- **`useAudio` hook** — thin React wrapper over the manager for components that
  need reactive state (isPlaying, activeClipId, progress).

This avoids a Provider wrapping the entire app while still giving components
reactive updates where needed.

---

## File Map

```
src/
├── audio/
│   ├── AudioManager.js          ← new: singleton class
│   ├── useAudio.js              ← new: React hook wrapper
│   └── AudioManager.test.js    ← new: unit tests
├── utils/
│   └── audioPlayback.js        ← update: delegate to AudioManager; keep shim
├── components/
│   ├── AudioClip/
│   │   └── AudioClip.jsx       ← update: use AudioManager (+ optional class→fn)
│   └── SequenceAudioController/
│       └── SequenceAudioController.jsx  ← update: use AudioManager (+ optional class→fn)
```

---

## AudioManager API (proposed)

```js
// Playback
AudioManager.play(source, { id, exclusive = true, onEnded, onError })
AudioManager.pause(id?)          // pause specific clip or current active
AudioManager.stop(id?)           // stop + reset specific or current active
AudioManager.stopAll()           // stop everything

// Registration (for DOM <audio> elements that need tracking)
AudioManager.registerElement(audioEl)
AudioManager.unregisterElement(audioEl)

// Volume
AudioManager.setVolume(0–1)
AudioManager.getVolume()

// State query (for non-reactive code)
AudioManager.getActiveId()
AudioManager.isPlaying()

// Subscription (for useAudio hook)
AudioManager.subscribe(listener)   // returns unsubscribe fn
```

---

## Phase 1 — Create AudioManager Core

**Files:** `src/audio/AudioManager.js`

- Port `stopAllAudioPlayback` + `trackFloatingAudio` logic into the class.
- Internal state: `activeAudio`, `activeId`, `registeredElements` (Set), `volume`.
- Implement `play`, `pause`, `stop`, `stopAll`, `registerElement`, `unregisterElement`,
  `setVolume`, `subscribe`.
- Exclusive mode on by default (new `play()` stops current).
- Export a singleton instance: `export default new AudioManager()`.

**Does not touch any component yet.**

---

## Phase 2 — Create useAudio Hook

**Files:** `src/audio/useAudio.js`

```js
// Returns reactive state from AudioManager
const { isPlaying, activeId, volume } = useAudio()

// Returns controls scoped to a specific clip id
const { play, pause, stop, isActive } = useAudio(clipId)
```

- Subscribes to AudioManager in `useEffect`, tears down on unmount.
- Lightweight — just maps manager events to React state.

---

## Phase 3 — Migrate Callers

### 3a. `playAudioLink` in `audioPlayback.js`

Replace:
```js
const soundFileAudio = new Audio(resolveAsset(soundFile));
trackFloatingAudio(soundFileAudio);
stopAllAudioPlayback(soundFileAudio);
soundFileAudio.play().catch(() => {});
```

With:
```js
AudioManager.play(resolveAsset(soundFile));
```

Keep `trackFloatingAudio` and `stopAllAudioPlayback` as deprecated shims with a
`console.warn` so any remaining callers are visible.

### 3b. `AudioClip.jsx`

- Replace direct `new Audio()` + `stopAllAudioPlayback` calls with
  `AudioManager.play(src, { id })`.
- Use `useAudio(id)` or class-level subscription for play/pause/progress state.
- **Recommended**: convert class component → functional while touching it —
  rule: convert when making non-trivial changes. This qualifies.

### 3c. `SequenceAudioController.jsx`

- Replace self-managed `<audio>` element with AudioManager sequence mode.
- `AudioManager.play()` should support an `onEnded` callback for chaining.
- **Recommended**: convert class component → functional while touching it.

---

## Phase 4 — Tests

**File:** `src/audio/AudioManager.test.js`

Required test cases:
- [ ] Playing a new clip stops the previous (exclusive mode)
- [ ] `stopAll()` pauses all registered elements and floating audio
- [ ] DOM `<audio>` elements registered via `registerElement` are included in stopAll
- [ ] `unregisterElement` removes element from tracking
- [ ] `subscribe` receives state change events; unsubscribe tears down cleanly
- [ ] Rapid successive `play()` calls don't leave orphaned audio
- [ ] Component unmount cleans up (no memory leaks)
- [ ] Sequence handoff: `onEnded` callback fires and can trigger next clip

---

## Phase 5 — QA Pass

Test manually across these LOs and scenarios:

- [ ] LO1 — pronunciation clips (AudioClip)
- [ ] LO1 — sequence audio controller (SequenceAudioController)
- [ ] LO6 — row audio links (playAudioLink)
- [ ] Rapid click spam on same clip — no overlap
- [ ] Rapid click spam on different clips — only last plays
- [ ] Navigate away during playback — audio stops cleanly
- [ ] Light/dark theme switch during playback — no interruption
- [ ] Mobile (375px) — controls accessible and functional
- [ ] `yarn prepush:local` — green before shipping

---

## What We Are NOT Doing (scope boundary)

- **Global mute UI** — AudioManager will support `setVolume(0)` internally, but no
  UI control is in scope for this refactor.
- **Queue mode** — architecture will allow it, but no implementation now.
- **Analytics hooks** — can be added to AudioManager later; not in scope.
- **All class → functional conversions** — only AudioClip and SequenceAudioController
  if they are touched in Phase 3. Other class components are out of scope.

---

## Estimated Effort

| Phase | Work | Estimate |
|-------|------|----------|
| 1 | AudioManager class | 0.5 day |
| 2 | useAudio hook | 0.25 day |
| 3 | Migrate 3 callers | 0.5–1 day |
| 4 | Tests | 0.5 day |
| 5 | QA | 0.5 day |
| **Total** | | **2–2.75 days** |

Add ~1 day if converting AudioClip + SequenceAudioController to functional components.

---

## Checklist

### Phase 1 — AudioManager Core
- [ ] Create `src/audio/AudioManager.js`
- [ ] Implement `play(source, opts)` with exclusive mode default
- [ ] Implement `pause`, `stop`, `stopAll`
- [ ] Implement `registerElement` / `unregisterElement`
- [ ] Implement `setVolume` / `getVolume`
- [ ] Implement `subscribe` / unsubscribe pattern
- [ ] Port logic from `trackFloatingAudio` + `stopAllAudioPlayback`
- [ ] Export singleton instance

### Phase 2 — useAudio Hook
- [ ] Create `src/audio/useAudio.js`
- [ ] Subscribe to manager on mount, unsubscribe on unmount
- [ ] Expose `isPlaying`, `activeId`, `volume` reactive state
- [ ] Expose `play`, `pause`, `stop` controls scoped to clip id

### Phase 3 — Migrate Callers
- [ ] `audioPlayback.js`: replace `new Audio` + helpers with `AudioManager.play()`
- [ ] Mark `trackFloatingAudio` / `stopAllAudioPlayback` as deprecated shims
- [ ] `AudioClip.jsx`: replace direct playback with AudioManager
- [ ] `AudioClip.jsx`: convert class → functional component (recommended)
- [ ] `SequenceAudioController.jsx`: replace self-managed `<audio>` with AudioManager
- [ ] `SequenceAudioController.jsx`: convert class → functional component (recommended)
- [ ] Verify no `new Audio(...).play()` calls remain outside AudioManager

### Phase 4 — Tests
- [ ] Exclusive mode test (new play stops previous)
- [ ] `stopAll` test (DOM + floating)
- [ ] `registerElement` / `unregisterElement` tests
- [ ] `subscribe` / unsubscribe lifecycle test
- [ ] Rapid play spam test (no orphans)
- [ ] Unmount cleanup test
- [ ] Sequence `onEnded` handoff test

### Phase 5 — QA
- [ ] LO1 pronunciation clips work
- [ ] LO1 sequence audio controller works
- [ ] LO6 row audio links work
- [ ] Rapid click spam — no overlap
- [ ] Navigate away — audio stops
- [ ] Theme switch during playback — no interruption
- [ ] Mobile 375px — controls accessible
- [ ] `yarn prepush:local` green

### Final
- [ ] Remove deprecated shims (`trackFloatingAudio`, `stopAllAudioPlayback`) once all callers confirmed migrated
- [ ] Update `AUDIO_TODO.md` to mark refactor complete
- [ ] Commit with conventional commit message `refactor: introduce AudioManager for centralised playback`
