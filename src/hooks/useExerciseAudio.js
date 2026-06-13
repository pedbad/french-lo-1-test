import { useEffect, useReducer, useRef } from "react";

/**
 * Shared master-player audio state for exercises driven by SequenceAudioController.
 *
 * Extracted (Phase 6) from the per-component reducers of SelectExercise,
 * InlineChoiceGroup, and DraggableFillGapsRuntime, which each duplicated this
 * exact 3-field state + 4 `handleMaster*` handler set. NOTE: the per-row click
 * audio path (`rowAudioStatus` + `rowAudioRefs` + `handleRowAudioStatusChange`)
 * is a DIFFERENT concern and stays in each caller — only the master-player
 * (sequence controller) state lives here.
 *
 * Owns its own config-identity reset so callers can drop the master fields from
 * their reset state. Phase 6b key-based remount will make that reset redundant.
 */

export const INITIAL_AUDIO_STATE = {
  activeRowIndex: -1,
  masterPlayState: "stopped",
  rowProgress: {},
};

// Merge reducer: each dispatch is a partial patch; a function patch receives the
// latest state (the progress/stopped handlers can fire faster than renders flush).
export const audioReducer = (state, patch) => ({
  ...state,
  ...(typeof patch === "function" ? patch(state) : patch),
});

const rowIndexOf = (playlistIndex, playlist) =>
  playlist[playlistIndex]?.rowIndex ?? -1;

/**
 * Patch for a track change: highlight the row whose clip just became active.
 * @returns {{ activeRowIndex: number }}
 */
export const trackChangePatch = (playlistIndex, playlist) => ({
  activeRowIndex: rowIndexOf(playlistIndex, playlist),
});

/**
 * Patch for a time update: record currentTime/duration for the active row.
 * Returns null when the clip maps to no row (caller skips the dispatch).
 * @returns {((prev: object) => object) | null}
 */
export const timePatch = (playlistIndex, currentTime, duration, playlist) => {
  const rowIndex = rowIndexOf(playlistIndex, playlist);
  if (rowIndex < 0) return null;
  return (prev) => ({
    rowProgress: {
      ...prev.rowProgress,
      [rowIndex]: { currentTime, duration },
    },
  });
};

/**
 * Patch for playback stop: clear the active row, mark stopped, and snap the
 * stopped row's progress to full (currentTime = duration) so its bar reads 100%.
 * @returns {(prev: object) => object}
 */
export const stoppedPatch = (playlistIndex, playlist) => {
  const rowIndex = rowIndexOf(playlistIndex, playlist);
  return (prev) => ({
    activeRowIndex: -1,
    masterPlayState: "stopped",
    rowProgress:
      rowIndex >= 0
        ? {
          ...prev.rowProgress,
          [rowIndex]: {
            currentTime: prev.rowProgress[rowIndex]?.duration || 0,
            duration: prev.rowProgress[rowIndex]?.duration || 0,
          },
        }
        : prev.rowProgress,
  });
};

export function useExerciseAudio(config) {
  const [audio, dispatch] = useReducer(audioReducer, INITIAL_AUDIO_STATE);

  // Config-identity reset (replaces the master-field portion of each caller's
  // prevConfigRef/componentDidUpdate reset). Mount is a no-op via the ref compare.
  const prevConfigRef = useRef(config);
  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      dispatch(INITIAL_AUDIO_STATE);
    }
  }, [config]);

  const handleMasterTrackChange = (playlistIndex, playlist) => {
    dispatch(trackChangePatch(playlistIndex, playlist));
  };

  const handleMasterPlayStateChange = (playState) => {
    dispatch({ masterPlayState: playState });
  };

  const handleMasterTime = (playlistIndex, currentTime, duration, playlist) => {
    const patch = timePatch(playlistIndex, currentTime, duration, playlist);
    if (patch) dispatch(patch);
  };

  const handleMasterStopped = (playlistIndex, playlist) => {
    dispatch(stoppedPatch(playlistIndex, playlist));
  };

  return {
    activeRowIndex: audio.activeRowIndex,
    masterPlayState: audio.masterPlayState,
    rowProgress: audio.rowProgress,
    handleMasterTrackChange,
    handleMasterPlayStateChange,
    handleMasterTime,
    handleMasterStopped,
  };
}
