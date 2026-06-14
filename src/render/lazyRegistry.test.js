import { Suspense } from "react";
import { describe, expect, it } from "vitest";

import {
  EXERCISE_REGISTRY,
  getLazyCustomComponent,
  resolveCustomExport,
  resolveExerciseExport,
  withLazyBoundary,
} from "./lazyRegistry";

// Unit coverage for the lazy code-split seams introduced when the exercise and
// custom registries were moved behind React.lazy (PR #34). These are the
// module-scope, closure-free pieces of the render path: the export-resolution
// mappers, the registry shape, the memoised custom-component factory, and the
// Suspense wrapper. The accordion-wrapping branches and the HIDE-prefix skip
// live inside the App component closure (renderComponent / renderComponentForTab)
// and are out of reach until that dispatch is extracted from App.jsx.

const REACT_LAZY = Symbol.for("react.lazy");

const FakeComp = () => null;

describe("resolveExerciseExport", () => {
  it("maps the named export onto the React.lazy { default } shape", () => {
    const module = { FakeComp, Other: () => null };
    expect(resolveExerciseExport(module, "FakeComp")).toEqual({ default: FakeComp });
  });

  it("yields an undefined default when the named export is absent", () => {
    expect(resolveExerciseExport({}, "Missing")).toEqual({ default: undefined });
  });
});

describe("resolveCustomExport", () => {
  it("resolves a registered custom component by key", () => {
    const module = { AllCustomComponentsFR: { Grammar1Body: FakeComp } };
    expect(resolveCustomExport(module, "Grammar1Body")).toEqual({ default: FakeComp });
  });

  it("falls back to a 'not implemented' notice for an unknown key", () => {
    const module = { AllCustomComponentsFR: {} };
    const { default: Fallback } = resolveCustomExport(module, "Nope");

    expect(typeof Fallback).toBe("function");

    const element = Fallback();
    expect(element.type).toBe("p");
    expect([].concat(element.props.children).join("")).toBe(
      "Component Nope not implemented",
    );
  });
});

describe("EXERCISE_REGISTRY", () => {
  const EXPECTED_KEYS = [
    "TypedTransformExercise",
    "DictationExercise",
    "DraggableFillGaps",
    "SelectExercise",
    "InlineChoiceGroup",
    "InlineTypedGapExercise",
    "LineMatch",
    "MemoryMatchGame",
    "RadioQuiz",
    "WordOrderExercise",
    "PhraseReorderExercise",
    "WordSpotExercise",
  ];

  it("registers exactly the expected exercise keys", () => {
    expect(Object.keys(EXERCISE_REGISTRY).sort()).toEqual([...EXPECTED_KEYS].sort());
  });

  it("registers every entry as a code-split React.lazy component", () => {
    for (const [key, value] of Object.entries(EXERCISE_REGISTRY)) {
      expect(value.$$typeof, key).toBe(REACT_LAZY);
    }
  });
});

describe("getLazyCustomComponent", () => {
  it("returns a React.lazy component for a key", () => {
    expect(getLazyCustomComponent("Grammar1Body").$$typeof).toBe(REACT_LAZY);
  });

  it("memoises one stable lazy type per key", () => {
    expect(getLazyCustomComponent("Grammar1Body")).toBe(
      getLazyCustomComponent("Grammar1Body"),
    );
  });

  it("returns distinct lazy types for distinct keys", () => {
    expect(getLazyCustomComponent("Grammar1Body")).not.toBe(
      getLazyCustomComponent("Grammar2Body"),
    );
  });
});

describe("withLazyBoundary", () => {
  it("wraps the node in a keyed Suspense boundary with a fallback", () => {
    const node = "child-node";
    const element = withLazyBoundary(node, "slot-key");

    expect(element.type).toBe(Suspense);
    expect(element.key).toBe("slot-key");
    expect(element.props.children).toBe(node);
    // fallback is the loading placeholder element (an accessible status region).
    expect(element.props.fallback.props.role).toBe("status");
  });
});
