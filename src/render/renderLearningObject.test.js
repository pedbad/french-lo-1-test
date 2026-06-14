import { Suspense } from "react";
import { describe, expect, it } from "vitest";

import {
  AccordionArticle,
  Explanation,
  Info,
  PhraseTable,
  Section,
} from "@/components/content";
import { Tabs } from "@/components/ui/tabs";

import { EXERCISE_REGISTRY, getLazyCustomComponent } from "./lazyRegistry";
import { createRenderer } from "./renderLearningObject";

// Unit coverage for the config-driven render dispatch extracted out of App.jsx
// in PR #37 (createRenderer). These assertions inspect the React elements the
// dispatch pushes into `articles` (and returns from renderComponentForTab)
// WITHOUT rendering — the same closure-free, element-inspection style used by
// lazyRegistry.test.js. They finally cover the branches that were unreachable
// while the dispatch lived inside the App component closure: the HIDE-prefix
// skip, the accordion vs static shell choice, the legacy Section double-suffix
// id, the Group accordion/tabs split, and the lazy custom fallthrough.

const REACT_FRAGMENT = Symbol.for("react.fragment");

// A registry exercise key guaranteed to exist (asserted in lazyRegistry.test.js).
const REGISTRY_KEY = "RadioQuiz";

const CTX = {
  currentLearningObject: "1",
  languageCode: "fr",
  configGen: 7,
};

// Fresh renderer per call so the per-instance auto-id counter starts at 0,
// matching the old per-render ref reset.
const makeRenderer = (overrides = {}) =>
  createRenderer({ ...CTX, ...overrides });

const render = (value, forcedTargetId = null, renderContext = {}) => {
  const articles = [];
  makeRenderer().renderComponent(value, articles, forcedTargetId, renderContext);
  return articles;
};

describe("createRenderer.renderComponent — HIDE prefix", () => {
  it("renders nothing for a HIDE-prefixed component key", () => {
    const articles = render({ component: "HIDEGrammar", id: "x" });
    expect(articles).toHaveLength(0);
  });

  it("treats HIDE as a literal prefix, not a substring", () => {
    // "ShowHIDE" does not start with HIDE → falls through to custom, not skipped.
    const articles = render({ component: "ShowHIDE", id: "x" });
    expect(articles).toHaveLength(1);
  });
});

describe("createRenderer.renderComponent — registry exercises", () => {
  it("wraps a registry exercise in an accordion with the compound -Accordion id", () => {
    const value = { component: REGISTRY_KEY, id: "q1" };
    const [article] = render(value);

    expect(article.type).toBe(AccordionArticle);
    expect(article.props.id).toBe("LO1-q1-Accordion");
    expect(article.key).toBe("LO1-q1-Accordion");
  });

  it("places the lazy exercise inside a configGen-keyed Suspense boundary", () => {
    const value = { component: REGISTRY_KEY, id: "q1" };
    const [article] = render(value);

    const boundary = article.props.children;
    expect(boundary.type).toBe(Suspense);
    expect(boundary.key).toBe("LO1-q1-7");

    const exercise = boundary.props.children;
    expect(exercise.type).toBe(EXERCISE_REGISTRY[REGISTRY_KEY]);
    expect(exercise.key).toBe("LO1-q1-7");
    expect(exercise.props.config).toBe(value);
  });

  it("forces the accordion shell even when the node sets expandable:false", () => {
    const [article] = render({ component: REGISTRY_KEY, id: "q1", expandable: false });
    expect(article.type).toBe(AccordionArticle);
  });
});

describe("createRenderer.renderComponent — Explanation", () => {
  it("uses the accordion shell by default with an Explanation child", () => {
    const value = { component: "Explanation", id: "e1" };
    const [article] = render(value);

    expect(article.type).toBe(AccordionArticle);
    expect(article.props.id).toBe("LO1-e1-Accordion");
    expect(article.props.children.type).toBe(Explanation);
  });

  it("falls back to the static Section shell when expandable:false", () => {
    const [article] = render({ component: "Explanation", id: "e1", expandable: false });

    expect(article.type).toBe(Section);
    expect(article.props.id).toBe("LO1-e1-Section");
  });

  it("marks a top-level static shell as a section and a forced-target one as a div", () => {
    const [topLevel] = render({ component: "Explanation", id: "e1", expandable: false });
    expect(topLevel.props.semanticAs).toBe("section");

    const [nested] = render(
      { component: "Explanation", id: "e1", expandable: false },
      "forced-target",
    );
    expect(nested.props.semanticAs).toBe("div");
    expect(nested.props.target).toBe("forced-target");
  });
});

describe("createRenderer.renderComponent — PhraseTable", () => {
  it("threads the languageCode into the PhraseTable child", () => {
    const value = { component: "PhraseTable", id: "p1" };
    const [article] = render(value);

    const child = article.props.children;
    expect(child.type).toBe(PhraseTable);
    expect(child.props.languageCode).toBe("fr");
    expect(child.props.config).toBe(value);
  });
});

describe("createRenderer.renderComponent — Section", () => {
  it("renders a static Section with the legacy double -Section-Section id", () => {
    const value = { component: "Section", id: "s1", content: [] };
    const [article] = render(value);

    expect(article.type).toBe(Section);
    expect(article.props.id).toBe("LO1-s1-Section-Section");
  });

  it("recursively renders child content into the section", () => {
    const value = {
      component: "Section",
      id: "s1",
      content: [{ component: REGISTRY_KEY, id: "q1" }],
    };
    const [article] = render(value);

    const {children} = article.props;
    expect(Array.isArray(children)).toBe(true);
    expect(children).toHaveLength(1);
    expect(children[0].type).toBe(AccordionArticle);
    expect(children[0].props.id).toBe("LO1-q1-Accordion");
  });
});

describe("createRenderer.renderComponent — Group", () => {
  it("wraps non-tab children in a -Group-Accordion shell with the group class", () => {
    const value = {
      component: "Group",
      id: "g1",
      content: [{ component: "Explanation", id: "e1" }],
    };
    const [article] = render(value);

    expect(article.type).toBe(AccordionArticle);
    expect(article.props.id).toBe("LO1-g1-Group-Accordion");
    expect(article.props.className).toBe("group");

    const groupChildren = article.props.children;
    expect(Array.isArray(groupChildren)).toBe(true);
    expect(groupChildren[0].type).toBe(AccordionArticle);
  });

  it("renders a Tabs subtree when displayAsTabs is set", () => {
    const value = {
      component: "Group",
      id: "g1",
      displayAsTabs: true,
      content: [
        { component: "Explanation", id: "tab-a", titleText: "A" },
        { component: "PhraseTable", id: "tab-b", titleText: "B" },
      ],
    };
    const [article] = render(value);

    const tabs = article.props.children;
    expect(tabs.type).toBe(Tabs);
  });
});

describe("createRenderer.renderComponent — custom fallthrough", () => {
  it("renders an unknown key as a memoised lazy custom under a -custom Suspense", () => {
    const value = { component: "Grammar1Body", id: "c1" };
    const [article] = render(value);

    expect(article.type).toBe(AccordionArticle);

    const boundary = article.props.children;
    expect(boundary.type).toBe(Suspense);
    expect(boundary.key).toBe("LO1-c1-custom");

    const custom = boundary.props.children;
    expect(custom.type).toBe(getLazyCustomComponent("Grammar1Body"));
    expect(custom.props.config).toBe(value);
    expect(custom.props.id).toBe("c1");
  });
});

describe("createRenderer.renderComponent — auto id counter", () => {
  it("assigns incrementing auto ids to nodes without an explicit id", () => {
    const renderer = makeRenderer();
    const articles = [];
    renderer.renderComponent({ component: "Explanation" }, articles);
    renderer.renderComponent({ component: "Explanation" }, articles);

    expect(articles[0].props.id).toBe("LO1-auto-Explanation-1-Accordion");
    expect(articles[1].props.id).toBe("LO1-auto-Explanation-2-Accordion");
  });

  it("trims and prefers an explicit id over the auto counter", () => {
    const [article] = render({ component: "Explanation", id: "  spaced  " });
    expect(article.props.id).toBe("LO1-spaced-Accordion");
  });
});

describe("createRenderer.renderComponentForTab", () => {
  const forTab = (value) => makeRenderer().renderComponentForTab(value);

  it("returns a bare configGen-keyed Suspense for a registry exercise", () => {
    const value = { component: REGISTRY_KEY, id: "q1" };
    const node = forTab(value);

    expect(node.type).toBe(Suspense);
    expect(node.key).toBe("q1-7");
    expect(node.props.children.type).toBe(EXERCISE_REGISTRY[REGISTRY_KEY]);
  });

  it("returns an Info + Explanation fragment for Explanation", () => {
    const node = forTab({ component: "Explanation", id: "e1" });

    expect(node.type).toBe(REACT_FRAGMENT);
    const [info, explanation] = node.props.children;
    expect(info.type).toBe(Info);
    expect(explanation.type).toBe(Explanation);
  });

  it("returns a bare PhraseTable carrying the languageCode", () => {
    const node = forTab({ component: "PhraseTable", id: "p1" });

    expect(node.type).toBe(PhraseTable);
    expect(node.props.languageCode).toBe("fr");
  });

  it("returns null for a HIDE-prefixed key", () => {
    expect(forTab({ component: "HIDEGrammar", id: "x" })).toBeNull();
  });

  it("returns an Info + lazy-custom fragment for an unknown key", () => {
    const node = forTab({ component: "Grammar1Body", id: "c1" });

    expect(node.type).toBe(REACT_FRAGMENT);
    const [info, boundary] = node.props.children;
    expect(info.type).toBe(Info);
    expect(boundary.type).toBe(Suspense);
    expect(boundary.key).toBe("c1-custom");
    expect(boundary.props.children.type).toBe(getLazyCustomComponent("Grammar1Body"));
  });
});
