import { describe, expect, it } from "vitest";

import {
  commitCheck,
  countCorrect,
  getInitialScoringState,
} from "./exerciseScoring";

describe("getInitialScoringState", () => {
  it("returns the empty unchecked baseline", () => {
    expect(getInitialScoringState()).toEqual({
      checkedResults: {},
      hasChecked: false,
      nCorrect: 0,
    });
  });

  it("returns a fresh checkedResults object on each call (no shared mutable ref)", () => {
    const a = getInitialScoringState();
    const b = getInitialScoringState();
    expect(a.checkedResults).not.toBe(b.checkedResults);
  });
});

describe("countCorrect", () => {
  it("counts truthy values", () => {
    expect(countCorrect({ 0: true, 1: false, 2: true })).toBe(2);
  });

  it("returns 0 for an empty map", () => {
    expect(countCorrect({})).toBe(0);
  });

  it("defaults to 0 when called with no argument", () => {
    expect(countCorrect()).toBe(0);
  });

  it("only counts boolean-true (ignores other falsy values)", () => {
    expect(countCorrect({ a: true, b: 0, c: "", d: null })).toBe(1);
  });
});

describe("commitCheck", () => {
  it("wraps results into a checked patch with derived nCorrect", () => {
    const checkedResults = { 0: true, 1: false, 2: true };
    expect(commitCheck(checkedResults)).toEqual({
      checkedResults,
      hasChecked: true,
      nCorrect: 2,
    });
  });

  it("preserves the same checkedResults reference (no copy)", () => {
    const checkedResults = { 0: true };
    expect(commitCheck(checkedResults).checkedResults).toBe(checkedResults);
  });

  it("handles an all-correct result set (count equals size)", () => {
    expect(commitCheck({ 0: true, 1: true })).toEqual({
      checkedResults: { 0: true, 1: true },
      hasChecked: true,
      nCorrect: 2,
    });
  });

  it("handles an empty result set", () => {
    expect(commitCheck({})).toEqual({
      checkedResults: {},
      hasChecked: true,
      nCorrect: 0,
    });
  });
});
