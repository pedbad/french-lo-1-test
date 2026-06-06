import { resolveAsset } from './assets';
import AudioManager from '../audio/AudioManager';

/**
 * Play a one-off audio link (row/vocabulary clicks).
 *
 * Routes through the AudioManager singleton so it participates in the global
 * single-active-audio policy: starting this clip pauses any other playing
 * audio (other clips, sequence controller, registered <audio> elements).
 *
 * @param {string} soundFile - asset path resolved via resolveAsset()
 */
export const playAudioLink = (soundFile) => {
  AudioManager.play(resolveAsset(soundFile));
};
