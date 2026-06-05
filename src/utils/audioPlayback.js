import { resolveAsset } from './assets';
import AudioManager from '../audio/AudioManager';

export const playAudioLink = (soundFile) => {
  AudioManager.play(resolveAsset(soundFile));
};

// ---------------------------------------------------------------------------
// Deprecated shims — kept so any missed callers surface via console.warn.
// Remove once AudioClip and SequenceAudioController migrations are confirmed.
// ---------------------------------------------------------------------------

export const trackFloatingAudio = (_audio) => {
  console.warn('trackFloatingAudio is deprecated — use AudioManager directly');
};

export const stopAllAudioPlayback = () => {
  console.warn('stopAllAudioPlayback is deprecated — use AudioManager.stopAll()');
  AudioManager.stopAll();
};
