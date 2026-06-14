/**
 * Unit tests for the AudioManager singleton.
 *
 * Isolation strategy:
 * - AudioManager is a default-exported singleton (`export default new AudioManager()`),
 *   so a plain import would share state across tests. We call `vi.resetModules()` and
 *   re-import a fresh instance in `beforeEach` for full isolation.
 * - jsdom has no real media playback, so we replace the global `Audio` constructor
 *   with a controllable `FakeAudio` that lets tests fire `ended`/`error` events on demand.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

class FakeAudio {
  constructor(src) {
    this.src = src;
    this.paused = true;
    this.ended = false;
    this.volume = 1;
    this.currentTime = 0;
    this._listeners = {};
    this.play = vi.fn(() => {
      this.paused = false;
      return Promise.resolve();
    });
    this.pause = vi.fn(() => {
      this.paused = true;
    });
    FakeAudio.instances.push(this);
  }

  addEventListener(event, cb) {
    (this._listeners[event] ||= []).push(cb);
  }

  // Test helper: fire a registered event.
  _fire(event) {
    (this._listeners[event] || []).forEach((cb) => cb());
  }
}
FakeAudio.instances = [];

let AudioManager;

beforeEach(async () => {
  FakeAudio.instances = [];
  vi.stubGlobal('Audio', FakeAudio);
  vi.resetModules();
  AudioManager = (await import('./AudioManager')).default;
});

describe('AudioManager.play', () => {
  it('starts a clip and reports it active', () => {
    // Act
    AudioManager.play('clip-a.mp3', { id: 'a' });

    // Assert
    expect(AudioManager.getActiveId()).toBe('a');
    expect(AudioManager.isPlaying()).toBe(true);
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0].play).toHaveBeenCalledOnce();
  });

  it('stops the previous clip when a new one starts (exclusive mode default)', () => {
    // Arrange
    AudioManager.play('clip-a.mp3', { id: 'a' });
    const [first] = FakeAudio.instances;

    // Act
    AudioManager.play('clip-b.mp3', { id: 'b' });

    // Assert
    expect(first.pause).toHaveBeenCalled();
    expect(AudioManager.getActiveId()).toBe('b');
    expect(FakeAudio.instances).toHaveLength(2);
  });

  it('applies the current volume to a newly created clip', () => {
    // Arrange
    AudioManager.setVolume(0.5);

    // Act
    AudioManager.play('clip.mp3');

    // Assert
    expect(FakeAudio.instances[0].volume).toBe(0.5);
  });

  it('fires the onEnded callback and clears active state when playback ends', () => {
    // Arrange
    const onEnded = vi.fn();
    AudioManager.play('clip.mp3', { id: 'a', onEnded });

    // Act
    FakeAudio.instances[0]._fire('ended');

    // Assert
    expect(onEnded).toHaveBeenCalledOnce();
    expect(AudioManager.getActiveId()).toBeNull();
    expect(AudioManager.isPlaying()).toBe(false);
  });

  it('fires the onError callback and clears active state on error', () => {
    // Arrange
    const onError = vi.fn();
    AudioManager.play('bad.mp3', { id: 'a', onError });

    // Act
    FakeAudio.instances[0]._fire('error');

    // Assert
    expect(onError).toHaveBeenCalledOnce();
    expect(AudioManager.getActiveId()).toBeNull();
  });

  it('leaves no orphaned playing clips after rapid successive play calls', () => {
    // Act
    AudioManager.play('a.mp3', { id: 'a' });
    AudioManager.play('b.mp3', { id: 'b' });
    AudioManager.play('c.mp3', { id: 'c' });

    // Assert: only the last clip is playing, all prior are paused
    const playing = FakeAudio.instances.filter((a) => !a.paused);
    expect(playing).toHaveLength(1);
    expect(playing[0].src).toContain('c.mp3');
    expect(AudioManager.getActiveId()).toBe('c');
  });
});

describe('AudioManager.pause / stop / resume', () => {
  it('pause only pauses when the id matches the active clip', () => {
    // Arrange
    AudioManager.play('a.mp3', { id: 'a' });
    const [audio] = FakeAudio.instances;

    // Act: wrong id -> no-op
    AudioManager.pause('other');
    expect(audio.pause).not.toHaveBeenCalled();

    // Act: matching id -> pauses
    AudioManager.pause('a');
    expect(audio.pause).toHaveBeenCalled();
  });

  it('stop pauses, resets currentTime, and clears active state', () => {
    // Arrange
    AudioManager.play('a.mp3', { id: 'a' });
    const [audio] = FakeAudio.instances;
    audio.currentTime = 12;

    // Act
    AudioManager.stop('a');

    // Assert
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.currentTime).toBe(0);
    expect(AudioManager.getActiveId()).toBeNull();
  });

  it('resume replays the active clip without creating a new Audio instance', () => {
    // Arrange
    AudioManager.play('a.mp3', { id: 'a' });
    const [audio] = FakeAudio.instances;
    AudioManager.pause('a');
    audio.play.mockClear();

    // Act
    AudioManager.resume('a');

    // Assert
    expect(audio.play).toHaveBeenCalledOnce();
    expect(FakeAudio.instances).toHaveLength(1); // no new instance
  });
});

describe('AudioManager.stopAll + registered elements', () => {
  it('pauses the active clip and all registered DOM elements', () => {
    // Arrange
    AudioManager.play('a.mp3', { id: 'a' });
    const [active] = FakeAudio.instances;
    const el = { pause: vi.fn(), paused: false, ended: false, volume: 1 };
    AudioManager.registerElement(el);

    // Act
    AudioManager.stopAll();

    // Assert
    expect(active.pause).toHaveBeenCalled();
    expect(el.pause).toHaveBeenCalled();
    expect(AudioManager.getActiveId()).toBeNull();
  });

  it('keeps the excepted element playing', () => {
    // Arrange
    const keep = { pause: vi.fn(), paused: false, ended: false, volume: 1 };
    const drop = { pause: vi.fn(), paused: false, ended: false, volume: 1 };
    AudioManager.registerElement(keep);
    AudioManager.registerElement(drop);

    // Act
    AudioManager.stopAll({ except: keep });

    // Assert
    expect(keep.pause).not.toHaveBeenCalled();
    expect(drop.pause).toHaveBeenCalled();
  });

  it('unregisterElement removes an element from stopAll tracking', () => {
    // Arrange
    const el = { pause: vi.fn(), paused: false, ended: false, volume: 1 };
    AudioManager.registerElement(el);
    AudioManager.unregisterElement(el);

    // Act
    AudioManager.stopAll();

    // Assert
    expect(el.pause).not.toHaveBeenCalled();
  });
});

describe('AudioManager.setVolume', () => {
  it('clamps volume to the 0..1 range', () => {
    AudioManager.setVolume(5);
    expect(AudioManager.getVolume()).toBe(1);

    AudioManager.setVolume(-3);
    expect(AudioManager.getVolume()).toBe(0);

    AudioManager.setVolume(0.3);
    expect(AudioManager.getVolume()).toBe(0.3);
  });

  it('applies volume to the active clip and registered elements', () => {
    // Arrange
    AudioManager.play('a.mp3', { id: 'a' });
    const [active] = FakeAudio.instances;
    const el = { pause: vi.fn(), paused: true, ended: false, volume: 1 };
    AudioManager.registerElement(el);

    // Act
    AudioManager.setVolume(0.25);

    // Assert
    expect(active.volume).toBe(0.25);
    expect(el.volume).toBe(0.25);
  });
});

describe('AudioManager.subscribe', () => {
  it('notifies subscribers on state change and stops after unsubscribe', () => {
    // Arrange
    const listener = vi.fn();
    const unsubscribe = AudioManager.subscribe(listener);

    // Act
    AudioManager.play('a.mp3', { id: 'a' });
    const callsAfterPlay = listener.mock.calls.length;
    expect(callsAfterPlay).toBeGreaterThan(0);
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ activeId: 'a', isPlaying: true })
    );

    // Act: tear down, further changes must not notify
    unsubscribe();
    AudioManager.stopAll();

    // Assert
    expect(listener.mock.calls.length).toBe(callsAfterPlay);
  });
});
