import { useCallback, useEffect, useRef, useState } from 'react';
import AudioManager from '../../audio/AudioManager';
import { resolveAsset } from '../../utils/assets';

/**
 * Shared playback state + controls for the AudioManager-driven clip variants
 * (super-compact ring, animated speaker, and link). Holds status/progress/
 * duration, wires the AudioManager external-stop subscription, attaches the
 * media listeners to the off-DOM Audio element, and exposes a click handler.
 *
 * @param {string} soundFile           Asset path resolved via resolveAsset.
 * @param {object} [options]
 * @param {string} [options.id]        Stable clip id (falls back to soundFile).
 * @param {(status: string) => void} [options.onStatusChange]
 * @returns {{ status: string, progress: number, duration: number, handleClick: (e?: Event) => void }}
 */
export function useAudioClip(soundFile, { id, onStatusChange } = {}) {
  const clipId = id || soundFile;

  const [status, setStatusState] = useState('stopped');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [soundFileAudio, setSoundFileAudio] = useState(null);

  // Latest status for the subscribe callback and click switch without
  // re-subscribing or going stale inside closures.
  const statusRef = useRef(status);
  statusRef.current = status;

  const setStatus = useCallback(
    (nextStatus) => {
      setStatusState(nextStatus);
      if (typeof onStatusChange === 'function') {
        onStatusChange(nextStatus);
      }
    },
    [onStatusChange]
  );

  // Subscribe to AudioManager so an external stop (another clip starting)
  // resets local status. Without this, status stays 'playing' after an
  // external stop and handleClick would call pause() instead of playSound().
  useEffect(() => {
    const unsubscribe = AudioManager.subscribe((managerState) => {
      if (
        managerState.activeId !== clipId &&
        (statusRef.current === 'playing' || statusRef.current === 'paused')
      ) {
        setStatus('stopped');
        setProgress(0);
      }
    });
    return unsubscribe;
  }, [clipId, setStatus]);

  // Media listeners on the off-DOM Audio element created by AudioManager.play.
  useEffect(() => {
    if (!soundFileAudio) return undefined;
    const handleMetadataLoaded = () => setDuration(soundFileAudio.duration);
    const handleTimeUpdate = () => setProgress(soundFileAudio.currentTime);
    soundFileAudio.addEventListener('loadedmetadata', handleMetadataLoaded);
    soundFileAudio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      soundFileAudio.removeEventListener('loadedmetadata', handleMetadataLoaded);
      soundFileAudio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [soundFileAudio]);

  const playSound = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const audio = AudioManager.play(resolveAsset(soundFile), {
        id: clipId,
        onEnded: () => {
          setStatus('stopped');
          setProgress(0);
        },
      });
      setSoundFileAudio(audio);
      setStatus('playing');
    },
    [soundFile, clipId, setStatus]
  );

  const pause = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setStatus('paused');
      AudioManager.pause(clipId);
    },
    [clipId, setStatus]
  );

  const handleClick = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      switch (statusRef.current) {
        case 'stopped':
          playSound(e);
          break;
        case 'paused':
          setStatus('playing');
          if (!soundFileAudio || !AudioManager.getActiveId()) {
            playSound(e);
          } else {
            AudioManager.resume(clipId);
          }
          break;
        case 'playing':
          pause(e);
          break;
        default:
          break;
      }
    },
    [playSound, pause, soundFileAudio, clipId, setStatus]
  );

  return { status, progress, duration, handleClick };
}
