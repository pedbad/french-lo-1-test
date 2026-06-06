// Global Vitest setup.
//
// jsdom does not implement HTMLMediaElement playback (play/pause/load throw
// "Not implemented"). Tests that exercise real audio behaviour install their
// own controllable fake via the Audio constructor; this file only provides a
// safe no-op default so incidental media calls never crash a test.
import { vi } from 'vitest';

if (typeof window !== 'undefined' && window.HTMLMediaElement) {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.HTMLMediaElement.prototype.load = vi.fn();
}
