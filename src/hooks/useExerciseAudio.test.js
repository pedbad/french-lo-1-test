import { describe, expect, it } from "vitest";

import {
  audioReducer,
  INITIAL_AUDIO_STATE,
  stoppedPatch,
  timePatch,
  trackChangePatch,
} from "./useExerciseAudio";

// Pure patch-builder + reducer tests (the grade-adjacent audio logic). The hook
// itself is a thin React wrapper around these; testing the builders keeps the
// safety net without a DOM/testing-library dependency.

const playlist = [
  { src: "a.mp3", rowIndex: 0 },
  { src: "b.mp3", rowIndex: 2 },
];

describe("audioReducer", () => {
  it("merges an object patch onto state", () => {
    const next = audioReducer(INITIAL_AUDIO_STATE, { masterPlayState: "playing" });
    expect(next.masterPlayState).toBe("playing");
    expect(next.activeRowIndex).toBe(-1);
  });

  it("applies a function patch against the latest state", () => {
    const next = audioReducer(
      { ...INITIAL_AUDIO_STATE, activeRowIndex: 1 },
      (prev) => ({ activeRowIndex: prev.activeRowIndex + 1 })
    );
    expect(next.activeRowIndex).toBe(2);
  });
});

describe("trackChangePatch", () => {
  it("maps the playlist index to its rowIndex", () => {
    expect(trackChangePatch(1, playlist)).toEqual({ activeRowIndex: 2 });
  });

  it("falls back to -1 for an unknown clip", () => {
    expect(trackChangePatch(9, playlist)).toEqual({ activeRowIndex: -1 });
  });
});

describe("timePatch", () => {
  it("records currentTime/duration under the active row", () => {
    const patch = timePatch(0, 1.5, 3, playlist);
    const next = patch({ rowProgress: {} });
    expect(next.rowProgress).toEqual({ 0: { currentTime: 1.5, duration: 3 } });
  });

  it("preserves other rows' progress", () => {
    const patch = timePatch(1, 0.5, 4, playlist);
    const next = patch({ rowProgress: { 0: { currentTime: 3, duration: 3 } } });
    expect(next.rowProgress[0]).toEqual({ currentTime: 3, duration: 3 });
    expect(next.rowProgress[2]).toEqual({ currentTime: 0.5, duration: 4 });
  });

  it("returns null when the clip maps to no row (caller skips dispatch)", () => {
    expect(timePatch(9, 1, 2, playlist)).toBeNull();
  });
});

describe("stoppedPatch", () => {
  it("clears the active row, marks stopped, and snaps progress to full", () => {
    const patch = stoppedPatch(0, playlist);
    const next = patch({
      activeRowIndex: 0,
      masterPlayState: "playing",
      rowProgress: { 0: { currentTime: 1, duration: 3 } },
    });
    expect(next.activeRowIndex).toBe(-1);
    expect(next.masterPlayState).toBe("stopped");
    expect(next.rowProgress[0]).toEqual({ currentTime: 3, duration: 3 });
  });

  it("snaps to 0/0 when the stopped row had no recorded duration", () => {
    const patch = stoppedPatch(1, playlist);
    const next = patch({ rowProgress: {} });
    expect(next.rowProgress[2]).toEqual({ currentTime: 0, duration: 0 });
  });

  it("leaves progress untouched when the clip maps to no row", () => {
    const patch = stoppedPatch(9, playlist);
    const prevProgress = { 0: { currentTime: 2, duration: 2 } };
    const next = patch({ rowProgress: prevProgress });
    expect(next.rowProgress).toBe(prevProgress);
    expect(next.activeRowIndex).toBe(-1);
    expect(next.masterPlayState).toBe("stopped");
  });
});
