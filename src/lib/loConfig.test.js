import { afterEach, describe, expect, it } from "vitest";

import {
  countAccordionsInComponent,
  getLearningObjectPathParam,
  hasNonEmptyInstructionValue,
  injectSharedExerciseDefaults,
  normaliseContentItems,
  normalizeInstructionSchemaNode,
  normalizeLearningObjectUrl,
  normalizeSlug,
  resolveLearningObjectParam,
  splitDisplayTitle,
} from "./loConfig";

describe("splitDisplayTitle", () => {
  it("splits on a colon followed by whitespace", () => {
    expect(splitDisplayTitle("Greetings: first contact")).toEqual({
      main: "Greetings",
      sub: "first contact",
    });
  });

  it("splits on a spaced em dash", () => {
    expect(splitDisplayTitle("Greetings — first contact")).toEqual({
      main: "Greetings",
      sub: "first contact",
    });
  });

  it("does not split hyphenated words with no surrounding spaces", () => {
    expect(splitDisplayTitle("café-crème")).toBeNull();
  });

  it("returns null for non-strings and empty input", () => {
    expect(splitDisplayTitle(null)).toBeNull();
    expect(splitDisplayTitle(42)).toBeNull();
    expect(splitDisplayTitle("   ")).toBeNull();
  });

  it("returns null when one side of the separator is empty", () => {
    expect(splitDisplayTitle("Greetings: ")).toBeNull();
  });
});

describe("hasNonEmptyInstructionValue", () => {
  it("is true only for non-blank strings", () => {
    expect(hasNonEmptyInstructionValue("hello")).toBe(true);
    expect(hasNonEmptyInstructionValue("   ")).toBe(false);
    expect(hasNonEmptyInstructionValue("")).toBe(false);
    expect(hasNonEmptyInstructionValue(null)).toBe(false);
    expect(hasNonEmptyInstructionValue(0)).toBe(false);
  });
});

describe("normalizeSlug", () => {
  it("lowercases, trims, and converts spaces/underscores to hyphens", () => {
    expect(normalizeSlug("  First_Contact Now ")).toBe("first-contact-now");
  });

  it("coerces non-strings and defaults to an empty string", () => {
    expect(normalizeSlug()).toBe("");
    expect(normalizeSlug(12)).toBe("12");
  });
});

describe("normaliseContentItems", () => {
  it("passes through new-format config objects", () => {
    const items = [{ id: "a", component: "Explanation" }];
    expect(normaliseContentItems(items)).toEqual(items);
  });

  it("unwraps old-format single-key wrappers and backfills id from the key", () => {
    const result = normaliseContentItems([
      { item1: { component: "PhraseTable" } },
    ]);
    expect(result).toEqual([{ component: "PhraseTable", id: "item1" }]);
  });

  it("keeps an existing id when unwrapping old-format wrappers", () => {
    const result = normaliseContentItems([
      { wrapperKey: { id: "real", component: "PhraseTable" } },
    ]);
    expect(result).toEqual([{ id: "real", component: "PhraseTable" }]);
  });

  it("drops nulls and unrecognised shapes", () => {
    expect(normaliseContentItems([null, {}, { a: 1, b: 2 }])).toEqual([]);
  });

  it("defaults to an empty array", () => {
    expect(normaliseContentItems()).toEqual([]);
  });
});

describe("normalizeInstructionSchemaNode", () => {
  it("aliases infoTextHTML to informationTextHTML when the latter is blank", () => {
    const node = { infoTextHTML: "<p>hi</p>" };
    expect(normalizeInstructionSchemaNode(node).informationTextHTML).toBe(
      "<p>hi</p>",
    );
  });

  it("does not overwrite an existing informationText value", () => {
    const node = { informationText: "keep", infoText: "drop" };
    expect(normalizeInstructionSchemaNode(node).informationText).toBe("keep");
  });

  it("recurses into nested objects and arrays", () => {
    const node = { child: { infoText: "deep" }, list: [{ infoText: "li" }] };
    const result = normalizeInstructionSchemaNode(node);
    expect(result.child.informationText).toBe("deep");
    expect(result.list[0].informationText).toBe("li");
  });

  it("returns primitives unchanged", () => {
    expect(normalizeInstructionSchemaNode("x")).toBe("x");
    expect(normalizeInstructionSchemaNode(null)).toBeNull();
  });
});

describe("injectSharedExerciseDefaults", () => {
  const shared = {
    cheatText: "Reveal",
    showHintsText: "Hint",
    listenDescriptionText: "Listen",
  };

  it("injects shared defaults into nodes with a component, without overwriting", () => {
    const node = { component: "RadioQuiz", cheatText: "Own" };
    const result = injectSharedExerciseDefaults(node, shared);
    expect(result.cheatText).toBe("Own");
    expect(result.showHintsText).toBe("Hint");
    expect(result.listenDescriptionText).toBe("Listen");
  });

  it("does not add exercise defaults to non-component nodes", () => {
    const node = { title: "Section A" };
    expect(injectSharedExerciseDefaults(node, shared)).toEqual({
      title: "Section A",
    });
  });

  it("recurses into nested content and arrays", () => {
    const node = { content: [{ component: "LineMatch" }] };
    const result = injectSharedExerciseDefaults(node, shared);
    expect(result.content[0].cheatText).toBe("Reveal");
  });
});

describe("resolveLearningObjectParam", () => {
  const learningObjects = [
    { slug: "first-contact", title: "First contact", titleShort: "FC" },
    { slug: "numbers", title: "Numbers" },
  ];

  it("resolves a 1-based numeric id to its entry", () => {
    expect(resolveLearningObjectParam("1", learningObjects)).toEqual({
      configKey: "first-contact",
      loId: 1,
      slug: "first-contact",
      title: "First contact",
      titleShort: "FC",
    });
  });

  it("resolves a slug to its entry (1-based loId)", () => {
    expect(resolveLearningObjectParam("numbers", learningObjects)).toMatchObject(
      { loId: 2, configKey: "numbers", title: "Numbers", titleShort: "" },
    );
  });

  it("returns null for empty input, unknown slug, and out-of-range id", () => {
    expect(resolveLearningObjectParam("", learningObjects)).toBeNull();
    expect(resolveLearningObjectParam("missing", learningObjects)).toBeNull();
    expect(resolveLearningObjectParam("9", learningObjects)).toBeNull();
  });
});

describe("getLearningObjectPathParam", () => {
  const learningObjects = [{ slug: "first-contact" }];

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("returns the last path segment when it matches a known slug", () => {
    window.history.replaceState({}, "", "/first-contact/");
    expect(getLearningObjectPathParam(learningObjects)).toBe("first-contact");
  });

  it("returns an empty string when the last segment is not a known slug", () => {
    window.history.replaceState({}, "", "/unknown/");
    expect(getLearningObjectPathParam(learningObjects)).toBe("");
  });

  it("returns an empty string at the root path", () => {
    window.history.replaceState({}, "", "/");
    expect(getLearningObjectPathParam(learningObjects)).toBe("");
  });
});

describe("normalizeLearningObjectUrl", () => {
  const learningObjects = [{ slug: "first-contact" }, { slug: "numbers" }];

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("appends the resolved slug when no LO segment is present", () => {
    window.history.replaceState({}, "", "/");
    normalizeLearningObjectUrl({
      currentLoPathRaw: "",
      learningObjects,
      resolvedSlug: "first-contact",
    });
    expect(window.location.pathname).toBe("/first-contact/");
  });

  it("replaces the existing LO segment in place", () => {
    window.history.replaceState({}, "", "/first-contact/");
    normalizeLearningObjectUrl({
      currentLoPathRaw: "first-contact",
      learningObjects,
      resolvedSlug: "numbers",
    });
    expect(window.location.pathname).toBe("/numbers/");
  });

  it("strips the legacy ?lo query param", () => {
    window.history.replaceState({}, "", "/?lo=2");
    normalizeLearningObjectUrl({
      currentLoPathRaw: "",
      learningObjects,
      resolvedSlug: "numbers",
    });
    expect(window.location.pathname).toBe("/numbers/");
    expect(window.location.search).toBe("");
  });

  it("is a no-op without a resolved slug", () => {
    window.history.replaceState({}, "", "/first-contact/");
    normalizeLearningObjectUrl({
      currentLoPathRaw: "first-contact",
      learningObjects,
      resolvedSlug: "",
    });
    expect(window.location.pathname).toBe("/first-contact/");
  });
});

describe("countAccordionsInComponent", () => {
  it("counts a single expandable leaf as one accordion", () => {
    expect(
      countAccordionsInComponent({ component: "Explanation", expandable: true }),
    ).toBe(1);
  });

  it("counts a non-expandable leaf as zero", () => {
    expect(
      countAccordionsInComponent({ component: "PhraseTable", expandable: false }),
    ).toBe(0);
  });

  it("ignores HIDE-prefixed and empty components", () => {
    expect(countAccordionsInComponent({ component: "HIDEThing" })).toBe(0);
    expect(countAccordionsInComponent({ component: "  " })).toBe(0);
    expect(countAccordionsInComponent(null)).toBe(0);
  });

  it("sums a non-tabs Group wrapper plus its expandable children", () => {
    const group = {
      component: "Group",
      expandable: true,
      content: [
        { component: "Explanation", expandable: true },
        { component: "PhraseTable", expandable: true },
      ],
    };
    expect(countAccordionsInComponent(group)).toBe(3);
  });

  it("counts a tabs Group as only its own wrapper (children render bare)", () => {
    const group = {
      component: "Group",
      expandable: true,
      displayAsTabs: true,
      content: [
        { component: "Explanation", expandable: true },
        { component: "PhraseTable", expandable: true },
      ],
    };
    expect(countAccordionsInComponent(group)).toBe(1);
  });

  it("counts a Section as the sum of its children only (no own wrapper)", () => {
    const section = {
      component: "Section",
      expandable: true,
      content: [{ component: "Explanation", expandable: true }],
    };
    expect(countAccordionsInComponent(section)).toBe(1);
  });
});
