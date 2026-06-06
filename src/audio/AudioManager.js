class AudioManager {
  constructor() {
    this._activeAudio = null;
    this._activeId = null;
    this._registeredElements = new Set();
    this._volume = 1;
    this._listeners = new Set();
  }

  // ---------------------------------------------------------------------------
  // Playback
  // ---------------------------------------------------------------------------

  play(source, { id = null, exclusive = true, onEnded, onError } = {}) {
    if (exclusive) this.stopAll();

    const audio = new Audio(source);
    audio.volume = this._volume;

    audio.addEventListener('ended', () => {
      if (this._activeAudio === audio) {
        this._activeAudio = null;
        this._activeId = null;
        this._notify();
      }
      if (onEnded) onEnded();
    }, { once: true });

    audio.addEventListener('error', () => {
      if (this._activeAudio === audio) {
        this._activeAudio = null;
        this._activeId = null;
        this._notify();
      }
      if (onError) onError();
    }, { once: true });

    this._activeAudio = audio;
    this._activeId = id;

    // Start playback BEFORE notifying: HTMLMediaElement.play() sets .paused
    // synchronously, so subscribers see isPlaying: true at the moment a clip starts.
    audio.play().catch(() => {});
    this._notify();
    return audio;
  }

  pause(id = null) {
    if (id && id !== this._activeId) return;
    if (this._activeAudio) {
      this._activeAudio.pause();
      this._notify();
    }
  }

  // Resume the current paused _activeAudio without creating a new Audio instance.
  // Stops DOM <audio> elements and registered elements first (they are not _activeAudio).
  resume(id = null) {
    if (id && id !== this._activeId) return;
    if (!this._activeAudio) return;
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((el) => el.pause());
    }
    this._registeredElements.forEach((el) => el.pause());
    this._activeAudio.play().catch(() => {});
    this._notify();
  }

  stop(id = null) {
    if (id && id !== this._activeId) return;
    if (this._activeAudio) {
      this._activeAudio.pause();
      this._activeAudio.currentTime = 0;
      this._activeAudio = null;
      this._activeId = null;
      this._notify();
    }
  }

  // except: optionally skip one DOM element (used by compact <audio> onPlay handler).
  stopAll({ except = null } = {}) {
    if (this._activeAudio && this._activeAudio !== except) {
      this._activeAudio.pause();
      this._activeAudio = null;
      this._activeId = null;
    }
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((el) => {
        if (el !== except) el.pause();
      });
    }
    this._registeredElements.forEach((el) => {
      if (el !== except) el.pause();
    });
    this._notify();
  }

  // ---------------------------------------------------------------------------
  // DOM <audio> element registration
  // Used by SequenceAudioController which manages its own <audio> element.
  // ---------------------------------------------------------------------------

  registerElement(audioEl) {
    if (audioEl) this._registeredElements.add(audioEl);
  }

  unregisterElement(audioEl) {
    this._registeredElements.delete(audioEl);
  }

  // ---------------------------------------------------------------------------
  // Volume
  // ---------------------------------------------------------------------------

  setVolume(value) {
    this._volume = Math.max(0, Math.min(1, value));
    if (this._activeAudio) this._activeAudio.volume = this._volume;
    this._registeredElements.forEach((el) => {
      el.volume = this._volume;
    });
    this._notify();
  }

  getVolume() {
    return this._volume;
  }

  // ---------------------------------------------------------------------------
  // State query (non-reactive)
  // ---------------------------------------------------------------------------

  getActiveId() {
    return this._activeId;
  }

  isPlaying() {
    if (this._activeAudio) {
      return !this._activeAudio.paused && !this._activeAudio.ended;
    }
    for (const el of this._registeredElements) {
      if (!el.paused && !el.ended) return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // Subscription (used by useAudio hook)
  // ---------------------------------------------------------------------------

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const state = {
      activeId: this._activeId,
      isPlaying: this.isPlaying(),
      volume: this._volume,
    };
    this._listeners.forEach((fn) => fn(state));
  }
}

export default new AudioManager();
