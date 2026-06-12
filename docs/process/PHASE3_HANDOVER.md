# Phase 3 Handover — Audio Infrastructure Migration

> **For a fresh Claude Code session.** Class → functional migration, Phase 3.
> Plan/checklist: [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).
> Phases 1 & 2 done + merged to `main`. This doc scopes Phase 3.

## Progress (Phase 3)

Branch `refactor/phase3-audio-infra` (PR open). Targets 1–3 done + verified:

- ✅ **AudioClip chain** (`d48cbf3`) — flattened to composition + `useAudioClip`
  hook (`src/components/AudioClip/useAudioClip.js`); `CircularAudioProgress`,
  `CircularAudioProgressAnimatedSpeaker`, `LinkAudioProgress` now thin
  functional components; `AudioClip` is a dispatcher; native `<audio>` paths →
  internal `NativeAudioClip`.
- ✅ **PhraseTable** (`00bf701`) — `tableSort`→`useState`, `originalPhrases`→
  `useMemo`, sort helpers → module-level, config read from props.
- ✅ **SequenceAudioController** (`b4c19c2`) — `forwardRef` fn; 9 state →
  `useReducer` merge; refs for off-DOM audio/durations/isScrubbing +
  `stateRef`/`propsRef` mirrors; `toggle`/`playItem` via `useImperativeHandle`.
- ✅ **App.jsx** (`12c0472`, PR #6) — root class → function component. State →
  `useReducer` (merge reducer); instance fields → refs (`autoComponentIdCounter`
  render-reset, delegation flag + handlers, `sharedSettings`, + `mountedRef`/
  `prevConfigRef`/`configRef` guards); 3 lifecycle methods → mount effect (`[]`,
  cleanup removes delegated listeners), no-dep modal-link re-scan, `config`-keyed
  deep-link; pure helpers hoisted to module scope; dead `selectLearningObject`
  removed. Render tree byte-identical. All 15 LOs browser-verified, 0 console errors.

> **Phase 3 COMPLETE** — all 4 targets merged to `main`. Class-to-functional
> migration Phases 1–3 done; Phases 4–6 (exercises + consolidate) remain. See
> [`CLASS_TO_FUNCTIONAL_MIGRATION.md`](./CLASS_TO_FUNCTIONAL_MIGRATION.md).

Each step: `yarn lint` 0 errors, `yarn test:run` 39/39, browser-verified.

## Current state (verified)

- **Phase 1** (12 leaf/presentational) — merged, PR #3.
- **Phase 2** (26 grammar/pronunciation content components) — merged, PR #4, squash commit `4324729`.
- `main` is clean and green: `yarn lint` 0 errors, `yarn test:run` 39/39 pass.
- Targets 1–3 above on branch `refactor/phase3-audio-infra`.

## Phase 3 scope (4 targets, medium risk)

These route through `AudioManager` and are covered by `src/audio/AudioManager.test.js`.
Convert + re-run the audio suite **and** do a manual playback check after each step.

### The class map

```
AudioClip → React.PureComponent          state: status, progress | ref: audioRef
                                          lifecycle: didMount/willUnmount (_setup/_teardownExternalStopListener)
                                          audio: playSound, pause, notePlaying, setPlaybackStatus
  ↳ CircularAudioProgress → AudioClip     state: duration, progress | ref: circleRef
                                          lifecycle: didMount/didUpdate/willUnmount (media listeners on soundFileAudio)
                                          audio: handleMetadataLoaded, handleTimeUpdate, updateCircleOffset
      ↳ CircularAudioProgressAnimatedSpeaker → CircularAudioProgress
                                          render() ONLY → delegates to CircularAudioProgressAnimatedSpeakerDisplay child
                                          (Display child already functional — converted in Phase 1)
      ↳ LinkAudioProgress → CircularAudioProgress
                                          state: duration, progress | ref: linkRef | lifecycle: didUpdate only (reattach listeners)
  KEY: subclasses override render() ONLY — no super.method() calls. Clean to flatten to composition.

SequenceAudioController → React.Component  state(9): clipDuration, clipTime, currentIndex, masterDuration,
                                          masterTime, playSequence, playState, scrubTime, volume
                                          instance (non-state): audioRef = off-DOM Audio(), durations[], isScrubbing flag
                                          lifecycle: didMount (register w/ AudioManager + preloadDurations), willUnmount (cleanup)
                                          audio: playItem, seekMaster, toggleMasterPlay, toggle, setVolume,
                                          handleLoadedMetadata, handleTimeUpdate, handleEnded, startScrub, changeScrub, endScrub
                                          NOTE: not imported by App.jsx/PhraseTable — find its consumer before converting.

PhraseTable → React.PureComponent          state: ...config spread, tableSort | instance: originalPhrases (detached copy)
                                          lifecycle: none | audio: playAudioLink(soundFile) from handleRowClick
                                          renders <AudioClip className="super-compact-speaker"> children

App → React.Component (ROOT — do LAST, carefully)
                                          state(6): dark, languageCode, showModalLinkDialog, modalLinkDialogTitle,
                                          modalLinkDialogContentHTML, modalLinkDialogContent
                                          instance: autoComponentIdCounter, modalLinkDelegationSetup,
                                          handleDelegatedModalLinkClick, handleDelegatedModalTargetClick, sharedSettings
                                          lifecycle: didMount (routes + config load), didUpdate (hash deep link), willUnmount (modal cleanup)
                                          audio: none directly; indirect via renderComponent → PhraseTable → AudioClip
```

### Consumers
- `AudioClip` → rendered by `PhraseTable` (table cells) + by Phase-2 grammar/pron components (`className="link"`). High blast radius — verify broadly.
- `PhraseTable` → imported in `App.jsx`, rendered in `renderComponent`.
- `SequenceAudioController` → consumer NOT yet located. `grep -rl SequenceAudioController src/` first.
- `App` → root, not imported.

## Recommended order (leaf-up, coupled chain in one PR)

1. **The AudioClip chain in ONE PR** (it's coupled inheritance):
   `LinkAudioProgress` + `CircularAudioProgressAnimatedSpeaker` → `CircularAudioProgress` → `AudioClip` base.
   Flatten inheritance to composition + a shared audio hook (e.g. `useAudioClip(soundFile)` holding
   status/progress/duration + the media-listener `useEffect` + AudioManager external-stop wiring).
   `AnimatedSpeaker` and `Link` variants become thin functional components that consume the hook and
   render their own markup (no class extension).
2. `PhraseTable` (depends on AudioClip; `playAudioLink` handler → in-body fn; `originalPhrases` → `useRef`;
   `tableSort` → `useState`; config-reset, if any, → `key` on parent or derive).
3. `SequenceAudioController` (9 state → `useReducer`; `audioRef`/`durations`/`isScrubbing` → `useRef`;
   mount/unmount AudioManager register/cleanup → one `useEffect(()=>{...; return cleanup}, [])`).
4. `App.jsx` LAST (root; routing + modal-link delegation in effects; `autoComponentIdCounter`/delegation
   flags → `useRef`; deep-link `didUpdate` → effect keyed on hash). Affects everything — verify all LOs.

## Gates (every step)
- `yarn lint` → 0 errors (autofix indent with `yarn eslint --fix <paths>`; Phase 2 needed this — class-body
  indent is one level too deep once dedented to top-level functions).
- `yarn test:run` → green (esp. `AudioManager.test.js`).
- Browser: dev server on **5173** (NOT the 5174 in `.claude/launch.json`). Manual playback check —
  click an `AudioClip`, confirm play/pause + progress ring animates; for SequenceAudioController test
  master play/scrub. Use `preview_eval` + accordion-expand pattern from Phase 2.
- One commit per logical unit; PR to `main`, squash-merge (matches Phase 1/2).

## Gotchas
- **GateGuard fact-force** fires on first Bash of a fresh context AND on first edit of each new file path,
  and on doc edits. Present the requested facts + retry, or run with `ECC_GATEGUARD=off`.
- **TDD Guard plugin disabled** (out of credit) — no test-first enforcement; still write/keep tests green.
- `no-undef` is the safety net for missing imports (blank-page bug). Lint before every commit.
- Don't anchor edits on exact import strings — `sort-imports` reorders named imports.
- `CircularAudioProgressAnimatedSpeakerDisplay` is ALREADY functional (Phase 1) — don't reconvert; just wire to it.
- Pure-render check passed for Phase 2; Phase 3 has REAL state/lifecycle/refs/listeners — translate carefully,
  this is not find-replace.

## Cost note
Phase 2 session ended at ~$70 (high). Phase 3 is the trickiest non-scoring phase — budget for a focused
session and consider delegating the coupled-chain edit to a builder subagent once the hook design is fixed.
