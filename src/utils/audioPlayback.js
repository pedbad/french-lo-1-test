import { resolveAsset } from './assets';

// Tracks Audio objects created with `new Audio(...)` (not attached to DOM),
// so they can be paused when another clip starts.
const getFloatingAudioSet = () => {
  if (typeof window === 'undefined') return null;
  if (!window.__floatingAudios) window.__floatingAudios = new Set();
  return window.__floatingAudios;
};

export const trackFloatingAudio = (audio) => {
  const floatingAudios = getFloatingAudioSet();
  if (!floatingAudios || !audio) return;
  floatingAudios.add(audio);
  audio.addEventListener('ended', () => floatingAudios.delete(audio), { once: true });
  audio.addEventListener('error', () => floatingAudios.delete(audio), { once: true });
};

// Enforces a global "single active audio" policy:
// pause every currently playing DOM <audio> and every tracked floating Audio,
// except the one we are about to play (if provided).
export const stopAllAudioPlayback = (exceptAudio = null) => {
  if (typeof document !== 'undefined') {
    document.querySelectorAll('audio').forEach((audioEl) => {
      if (audioEl === exceptAudio) return;
      audioEl.pause();
    });
  }

  const floatingAudios = getFloatingAudioSet();
  if (!floatingAudios) return;

  floatingAudios.forEach((audio) => {
    if (audio === exceptAudio) return;
    audio.pause();
  });
};

export const playAudioLink = (soundFile) => {
  const soundFileAudio = new Audio(resolveAsset(soundFile));
  // Ensure row-link playback also participates in single-audio behavior.
  trackFloatingAudio(soundFileAudio);
  stopAllAudioPlayback(soundFileAudio);
  soundFileAudio.play().catch(() => {});
};
