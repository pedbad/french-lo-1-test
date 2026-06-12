import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef } from "react";
import AudioManager from "../../audio/AudioManager";

const INITIAL_STATE = {
  clipDuration: 0,
  clipTime: 0, // current track time
  currentIndex: 0,
  masterDuration: 0,
  masterTime: 0, // overall sequence time
  playSequence: false,
  playState: "stopped", // "playing" | "paused" | "stopped"
  scrubTime: null, // transient UI-only MASTER time while scrubbing
  volume: 1,
};

// Mirrors this.setState semantics: accepts a patch object or an updater fn.
function mergeState(state, action) {
  const patch = typeof action === "function" ? action(state) : action;
  return { ...state, ...patch };
}

export const SequenceAudioController = forwardRef(function SequenceAudioController(props, ref) {
  const [state, setState] = useReducer(mergeState, INITIAL_STATE);

  // Live mirrors so the once-attached audio listeners and imperative methods
  // always read the latest state/props (class methods read this.state live).
  const stateRef = useRef(state);
  stateRef.current = state;
  const propsRef = useRef(props);
  propsRef.current = props;

  // Off-DOM Audio instance so validators do not flag hidden HTML5 media
  // elements that are implementation details only.
  const audioRef = useRef(null);
  if (audioRef.current === null) audioRef.current = new Audio();

  // Not in state: avoids rerenders while we fill it / during pointer interactions.
  const durationsRef = useRef([]); // seconds per track (index -> number)
  const isScrubbingRef = useRef(false);

  /* ---------- Events up to DraggableFillGaps ---------- */

  const emitPlayState = (value) => {
    if (propsRef.current.onPlayStateChange) propsRef.current.onPlayStateChange(value);
  };

  const emitTrackChange = (index) => {
    if (propsRef.current.onTrackChange) propsRef.current.onTrackChange(index);
  };

  const emitStopped = () => {
    if (propsRef.current.onStopped) propsRef.current.onStopped(stateRef.current.currentIndex);
  };

  /* ---------- Helpers for master timeline ---------- */

  const getMasterTime = (index, clipTime) => {
    let t = 0;
    for (let i = 0; i < index; i++) t += durationsRef.current[i] || 0;
    return t + (clipTime || 0);
  };

  const computeMasterDuration = () => {
    const { sources = [] } = propsRef.current;
    let sum = 0;
    for (let i = 0; i < sources.length; i++) sum += durationsRef.current[i] || 0;
    return sum;
  };

  const hasUnknownDurations = () => {
    const { sources = [] } = propsRef.current;
    for (let i = 0; i < sources.length; i++) {
      if (!(durationsRef.current[i] > 0)) return true; // 0, NaN, undefined
    }
    return false;
  };

  /**
   * IMPORTANT:
   * If any durations are still unknown (0), the raw computed masterDuration
   * will be too small and the scrubber may "hit the end" early.
   * So while there are unknowns, we *never shrink* masterDuration.
   */
  const getSafeMasterDuration = () => {
    const sum = computeMasterDuration();
    if (!hasUnknownDurations()) return sum;

    // While incomplete, keep the best (largest) duration we've ever had.
    return Math.max(stateRef.current.masterDuration || 0, sum || 0);
  };

  // Map a master time (seconds) to { index, offset }
  const locateMasterTime = (masterTime) => {
    const { sources = [] } = propsRef.current;
    let t = masterTime;

    for (let i = 0; i < sources.length; i++) {
      const d = durationsRef.current[i] || 0;

      // if duration unknown (0), treat as "current bucket" to avoid NaNs
      if (d <= 0) return { index: i, offset: Math.max(0, t) };

      if (t <= d || i === sources.length - 1) {
        return { index: i, offset: Math.max(0, Math.min(t, d)) };
      }

      t -= d;
    }
    return { index: 0, offset: 0 };
  };

  /* ---------- Duration preload (optional) ---------- */

  const preloadDurations = () => {
    const { sources = [] } = propsRef.current;
    if (!sources.length) return;

    const loads = sources.map((src, i) => {
      return new Promise((resolve) => {
        const a = new Audio();
        a.preload = "metadata";
        a.src = src;

        const done = () => {
          const d = Number.isFinite(a.duration) ? a.duration : 0;
          durationsRef.current[i] = d;
          resolve(d);
        };

        a.addEventListener("loadedmetadata", done, { once: true });
        a.addEventListener("error", () => resolve(0), { once: true });
      });
    });

    Promise.all(loads).then(() => {
      const sum = durationsRef.current.reduce((acc, d) => acc + (d || 0), 0);

      // Never allow preload to shrink an already-better duration
      setState((prev) => ({
        masterDuration: Math.max(prev.masterDuration || 0, sum || 0),
      }));
    });
  };

  /* ---------- Public API (called by DraggableFillGaps) ---------- */

  const playItem = (index, opts = {}) => {
    const { sources = [] } = propsRef.current;
    const src = sources[index];
    if (!src) return;

    const { playSequence = false, offset = 0 } = opts;

    const audio = audioRef.current;
    audio.src = src;
    audio.load();

    const start = () => {
      try {
        audio.currentTime = offset || 0;
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // ignore
      }

      const shouldPlay = opts.autoplay !== false;
      if (shouldPlay) {
        AudioManager.stopAll({ except: audio });
        audio.play().catch(console.error);
      }

      const d = Number.isFinite(audio.duration)
        ? audio.duration
        : durationsRef.current[index] || 0;

      durationsRef.current[index] = d;

      const masterDuration = getSafeMasterDuration();
      const masterTime = getMasterTime(index, audio.currentTime);
      const playState = shouldPlay ? "playing" : "paused";

      setState({
        clipDuration: d,
        clipTime: audio.currentTime,
        currentIndex: index,
        masterDuration,
        masterTime,
        playSequence,
        playState,
      });
      emitPlayState(playState);

      emitTrackChange(index);
    };

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      start();
    } else {
      audio.addEventListener("loadedmetadata", start, { once: true });
    }
  };

  // Seek in master timeline (overall sequence)
  const seekMaster = (masterTime) => {
    const { playState, playSequence } = stateRef.current;
    const { index, offset } = locateMasterTime(masterTime);
    const autoplay = playState === "playing";

    playItem(index, { autoplay, offset, playSequence });
  };

  /* ---------- Master control ---------- */

  const toggleMasterPlay = () => {
    const audio = audioRef.current;
    const { playState } = stateRef.current;

    if (playState === "paused") {
      AudioManager.stopAll({ except: audio });
      audio.play();
      setState({ playSequence: true, playState: "playing" });
      emitPlayState("playing");
      return;
    }

    if (playState === "stopped") {
      playItem(0, { playSequence: true });
      return;
    }

    audio.pause();
    setState({ playState: "paused" });
    emitPlayState("paused");
  };

  const toggle = () => {
    const { playState } = stateRef.current;
    const audio = audioRef.current;

    if (playState === "playing") {
      audio.pause();
      setState({ playState: "paused" });
      emitPlayState("paused");
    } else if (playState === "paused") {
      AudioManager.stopAll({ except: audio });
      audio.play();
      setState({ playState: "playing" });
      emitPlayState("playing");
    } else {
      toggleMasterPlay();
    }
  };

  const setVolume = (volume) => {
    audioRef.current.volume = volume;
    setState({ volume });
  };

  /* ---------- Internal handlers ---------- */

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    const { currentIndex } = stateRef.current;

    const d = Number.isFinite(audio.duration) ? audio.duration : 0;
    durationsRef.current[currentIndex] = d;

    const masterDuration = getSafeMasterDuration();
    const masterTime = getMasterTime(currentIndex, audio.currentTime);

    setState({
      clipDuration: d,
      masterDuration,
      masterTime,
    });
  };

  const handleTimeUpdate = () => {
    if (isScrubbingRef.current) return; // ✅ critical: stop flicker + stop tile jump

    const audio = audioRef.current;
    const { currentIndex } = stateRef.current;

    const clipTime = audio.currentTime;
    const clipDuration = audio.duration || 0;

    const masterTime = getMasterTime(currentIndex, clipTime);
    const masterDuration = getSafeMasterDuration();

    setState({
      clipDuration,
      clipTime,
      masterDuration,
      masterTime,
    });

    if (propsRef.current.onTimeUpdate) {
      propsRef.current.onTimeUpdate(
        currentIndex,
        clipTime,
        clipDuration,
        masterTime,
        masterDuration
      );
    }
  };

  const handleEnded = () => {
    const { pauseSeconds = 0, sources = [] } = propsRef.current;
    const { currentIndex, playSequence } = stateRef.current;

    if (!playSequence) {
      setState({ playState: "stopped" });
      emitPlayState("stopped");
      emitStopped();
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= sources.length) {
      setState({ playState: "stopped" });
      emitStopped();
      return;
    }

    setTimeout(() => {
      playItem(nextIndex, { playSequence: true });
    }, pauseSeconds * 1000);
  };

  /* ---------- Scrubber (Pointer events = mouse + touch, no duplication) ---------- */

  const startScrub = (e) => {
    e.stopPropagation();
    isScrubbingRef.current = true;

    // Capture pointer so we still get the up event if the user drags off the control
    // eslint-disable-next-line eqeqeq
    if (e.currentTarget && e.pointerId != null) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* empty */
      }
    }

    // initialise scrub to current masterTime
    setState((prev) => ({ scrubTime: prev.masterTime }));
  };

  const moveScrub = (e) => {
    e.stopPropagation();
  };

  const changeScrub = (e) => {
    e.stopPropagation();
    const t = parseFloat(e.target.value);
    if (!Number.isFinite(t)) return;

    // UI-only while dragging
    setState({ scrubTime: t });
  };

  const endScrub = (e) => {
    e.stopPropagation();

    // eslint-disable-next-line eqeqeq
    if (e.currentTarget && e.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch { /* empty */ }
    }

    isScrubbingRef.current = false;

    const commitTime = stateRef.current.scrubTime;
    setState({ scrubTime: null });

    // commit AFTER state clears scrubTime
    queueMicrotask(() => {
      // eslint-disable-next-line eqeqeq
      if (commitTime != null) {
        seekMaster(commitTime);
      }
    });
  };

  /* ---------- Lifecycle ---------- */

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Register so AudioManager.stopAll() can reach this off-DOM audio element.
    AudioManager.registerElement(audio);

    preloadDurations();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      AudioManager.unregisterElement(audio);
      audio.pause();
      audio.src = "";
    };
    // Mount-once: handlers read refs, so they never need to re-attach.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Public API consumed by DraggableFillGaps via ref.
  useImperativeHandle(ref, () => ({ toggle, playItem }));

  /* ---------- Render ---------- */

  const { masterTime, masterDuration, scrubTime, playState, volume } = state;

  const displayTime = scrubTime !== null ? scrubTime : masterTime;
  const sliderAccentStyle = { accentColor: "var(--footer-background)" };

  return (
    <div
      className="sequence-audio-controller relative mt-4 w-full rounded-[0.6rem] border border-[var(--border)] bg-[color-mix(in_oklab,var(--muted)_82%,var(--card)_18%)] p-2"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="controls grid min-w-0 grid-cols-[0.1fr_2fr_0.1fr_1fr] [grid-template-rows:1fr] [grid-auto-flow:row] items-center gap-x-2 text-[var(--foreground)]">
        <button
          aria-label={playState === "playing" ? "Pause audio" : "Play audio"}
          className={`play-pause justify-self-end cursor-pointer text-base`}
          onClick={toggleMasterPlay}
        >
          {playState === "playing" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
              <path d="M.682.003H7v19.994H.682ZM13 .003h6.318v19.994H13z" style={{ fill: "currentColor" }} />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 14 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M12.8378 7.01827L2.19005 0.21473C1.32492 -0.337792 0 0.198383 0 1.56498V15.1688C0 16.3948 1.23114 17.1337 2.19005 16.519L12.8378 9.71877C13.7876 9.11394 13.7906 7.62311 12.8378 7.01827Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <input
          aria-label="Audio progress"
          className={`play-scrubber min-w-0 w-full`}
          type="range"
          min="0"
          max={masterDuration || 0}
          step="0.01"
          value={displayTime}
          onPointerDown={startScrub}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onChange={changeScrub}
          style={sliderAccentStyle}
        />

        <svg className={`volume-icon justify-self-end`} width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.001 20">
          <path
            className="vol1"
            d="M98.024 132.952h3.269v2.513h-3.269z"
            style={{ fill: "currentColor", opacity: volume > 0.2 ? 1 : volume + 0.1 }}
            transform="translate(-95.102 -119.3)"
          />
          <path
            className="vol2"
            d="M102.427 130.321h3.531v5.143h-3.531z"
            style={{ fill: "currentColor", opacity: volume > 0.4 ? 1 : volume + 0.1 }}
            transform="translate(-95.102 -119.3)"
          />
          <path
            className="vol2"
            d="M107.025 127.282h3.4v8.182h-3.4z"
            style={{ fill: "currentColor", opacity: volume > 0.6 ? 1 : volume + 0.1 }}
            transform="translate(-95.102 -119.3)"
          />
          <path
            className="vol3"
            d="M111.428 124.535h3.662v10.929h-3.662z"
            style={{ fill: "currentColor", opacity: volume > 0.8 ? 1 : volume + 0.1 }}
            transform="translate(-95.102 -119.3)"
          />
        </svg>

        <input
          aria-label="Audio volume"
          className={`volume-slider min-w-0 w-full`}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          style={sliderAccentStyle}
        />
      </div>
    </div>
  );
});
