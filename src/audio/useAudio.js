import { useEffect, useState, useCallback } from 'react';
import AudioManager from './AudioManager';

/**
 * useAudio()          — global state: { isPlaying, activeId, volume }
 * useAudio(clipId)    — scoped: adds { isActive, play, pause, stop }
 */
export function useAudio(clipId = null) {
  const [state, setState] = useState(() => ({
    isPlaying: AudioManager.isPlaying(),
    activeId: AudioManager.getActiveId(),
    volume: AudioManager.getVolume(),
  }));

  useEffect(() => {
    const unsubscribe = AudioManager.subscribe(setState);
    return unsubscribe;
  }, []);

  const play = useCallback(
    (source, opts = {}) => AudioManager.play(source, { id: clipId, ...opts }),
    [clipId]
  );

  const pause = useCallback(() => AudioManager.pause(clipId), [clipId]);
  const stop = useCallback(() => AudioManager.stop(clipId), [clipId]);

  return {
    ...state,
    isActive: clipId !== null && state.activeId === clipId,
    play,
    pause,
    stop,
  };
}
