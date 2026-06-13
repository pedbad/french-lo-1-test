import { useReducer } from "react";

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
 * State reset on config change is handled by the App-level key-based remount
 * (Phase 6b): the host re-keys each exercise on every config load, so this hook
 * carries no internal config-identity reset.
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

export function useExerciseAudio() {
  const [audio, dispatch] = useReducer(audioReducer, INITIAL_AUDIO_STATE);

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
