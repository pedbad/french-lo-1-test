# Audio Playback TODO

## Problem Summary

Audio playback responsibility was spread across multiple places:

- `AudioClip` started ad-hoc `new Audio(...)` clips.
- `SequenceAudioController` managed its own `<audio>` element.
- `playAudioLink` in `src/utils/audioPlayback.js` started additional ad-hoc `new Audio(...)` clips.
- Native `<audio controls>` elements could also play directly.

Because these paths were independent, multiple clips could play at the same time.
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

## Temporary Fix (Superseded)

A utility-based stop mechanism was implemented in `src/utils/audioPlayback.js` as a short-term
stabilisation:

- `trackFloatingAudio(audio)` — tracked non-DOM `new Audio(...)` instances via `window.__floatingAudios`.
- `stopAllAudioPlayback(exceptAudio)` — paused all active audio, except the one about to play.

**This approach has been fully superseded by `AudioManager`.** The deprecated shims
(`trackFloatingAudio`, `stopAllAudioPlayback`) have been **removed** (`dee1696`) — every
playback path now routes through `AudioManager`. `audioPlayback.js` now exports only
`playAudioLink`, which delegates to `AudioManager.play`.

## AudioManager Refactor — COMPLETE ✓

The distributed convention has been replaced by a singleton `AudioManager` in `src/audio/AudioManager.js`.

All playback now routes through it. See `AUDIO_MANAGER_REFACTOR.md` for full architecture, API,
and remaining QA checklist (Phases 4–5).

### Acceptance Criteria — met

- [x] Exactly one clip plays at any time (exclusive mode is default).
- [x] All playback entry points go through `AudioManager`.
- [x] No direct unmanaged `new Audio(...).play()` calls remain in components.
- [x] Existing LO activities keep current UX behavior.

### Remaining work

- [x] Phase 4: Unit tests (`src/audio/AudioManager.test.js`) — 15 tests, `cc0674a`.
- [ ] Phase 5: Manual QA pass across LO1, LO6 — see refactor doc checklist.
- [x] Remove deprecated shims (`trackFloatingAudio`, `stopAllAudioPlayback`) — done `dee1696`.

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
