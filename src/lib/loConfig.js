// Pure learning-object config helpers.
//
// Extracted verbatim from App.jsx so the config/URL/normalization logic is
// unit-testable and decoupled from the React render tree. No React, no JSX —
// the only browser globals touched are `window`/`document`, and every such
// helper guards with `typeof window === "undefined"` for SSR/test safety.

const splitDisplayTitle = (value) => {
  if (typeof value !== "string") return null;

  const title = value.trim();
  if (!title) return null;

  // Keep split rules explicit and conservative so hyphenated words
  // (for example "café-crème") are not treated as title separators.
  const splitPatterns = [
    /:\s+/, // "Main: sub"
    /\s+—\s+/, // "Main — sub"
    /\s+–\s+/, // "Main – sub"
    /\s+\|\s+/, // "Main | sub"
    /\s+-\s+/, // "Main - sub"
  ];

  for (const pattern of splitPatterns) {
    const match = title.match(pattern);
    if (!match || match.index === undefined) continue;

    const { index } = match;
    const [separator] = match;
    const main = title.slice(0, index).trim();
    const sub = title.slice(index + separator.length).trim();
    if (!main || !sub) continue;

    return { main, sub };
  }

  return null;
};

const hasNonEmptyInstructionValue = (value) =>
  typeof value === "string" && value.trim() !== "";

const normalizeSlug = (value = "") =>
  `${value}`
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

const normaliseContentItems = (content = []) => {
  // Supports BOTH:
  // 1) New format: [{ id, component, ... }, ...]
  // 2) Old format: [{ someKey: { id, component, ... } }, ...]
  // Also tolerates accidental nulls.
  return (content || [])
    .map((item) => {
      if (!item) return null;

      // New format: looks like a config object already
      if (item.component) return item;

      // Old format wrapper: { "item1": { component:"SomeComponent", ... } }
      const keys = Object.keys(item);
      const values = Object.values(item);
      if (keys.length === 1 && values.length === 1 && values[0]?.component) {
        const cfg = values[0];
        if (!cfg.id) cfg.id = keys[0];
        return cfg;
      }

      return null;
    })
    .filter(Boolean);
};

const normalizeInstructionSchemaNode = (node) => {
  if (Array.isArray(node)) {
    return node.map((item) => normalizeInstructionSchemaNode(item));
  }

  if (!node || typeof node !== "object") return node;

  const normalized = { ...node };

  // Legacy alias compatibility: infoText* -> informationText* (kept defensively;
  // no infoText* keys remain in config but guard against hand-authored files).
  if (
    !hasNonEmptyInstructionValue(normalized.informationTextHTML) &&
    hasNonEmptyInstructionValue(normalized.infoTextHTML)
  ) {
    normalized.informationTextHTML = normalized.infoTextHTML;
  }
  if (
    !hasNonEmptyInstructionValue(normalized.informationText) &&
    hasNonEmptyInstructionValue(normalized.infoText)
  ) {
    normalized.informationText = normalized.infoText;
  }

  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (value && typeof value === "object") {
      normalized[key] = normalizeInstructionSchemaNode(value);
    }
  });

  return normalized;
};

const injectSharedExerciseDefaults = (node, sharedSettings = {}) => {
  if (Array.isArray(node)) {
    return node.map((item) => injectSharedExerciseDefaults(item, sharedSettings));
  }
  if (!node || typeof node !== "object") return node;

  const result = { ...node };

  if (result.component) {
    const EXERCISE_KEYS = ["cheatText", "showHintsText", "listenDescriptionText"];
    for (const key of EXERCISE_KEYS) {
      if (!(key in result) && key in sharedSettings) {
        result[key] = sharedSettings[key];
      }
    }
  }

  Object.keys(result).forEach((key) => {
    if (result[key] && typeof result[key] === "object") {
      result[key] = injectSharedExerciseDefaults(result[key], sharedSettings);
    }
  });

  return result;
};

const resolveLearningObjectParam = (loParamRaw, learningObjects = []) => {
  if (!loParamRaw) return null;

  const numericLoId = parseInt(loParamRaw, 10);
  if (Number.isInteger(numericLoId) && numericLoId >= 1) {
    const entry = learningObjects[numericLoId - 1];
    if (!entry) return null;
    const entrySlug = entry.slug ? normalizeSlug(entry.slug) : "";
    if (!entrySlug) return null;
    return {
      configKey: entrySlug,
      loId: numericLoId,
      slug: entry.slug || entrySlug,
      title: entry.title,
      titleShort: entry.titleShort || "",
    };
  }

  const normalizedTarget = normalizeSlug(loParamRaw);
  const index = learningObjects.findIndex((entry) => {
    const entrySlug = entry?.slug ? normalizeSlug(entry.slug) : "";
    return entrySlug !== "" && entrySlug === normalizedTarget;
  });
  if (index < 0) return null;

  const entry = learningObjects[index];
  const entrySlug = entry.slug ? normalizeSlug(entry.slug) : normalizedTarget;
  return {
    configKey: entrySlug,
    loId: index + 1,
    slug: entry.slug || normalizedTarget,
    title: entry.title,
    titleShort: entry.titleShort || "",
  };
};

const getLearningObjectPathParam = (learningObjects = []) => {
  if (typeof window === "undefined") return "";
  const pathSegments = window.location.pathname
    .split("/")
    .filter(Boolean);
  if (!pathSegments.length) return "";

  const lastSegment = decodeURIComponent(pathSegments[pathSegments.length - 1]);
  const target = normalizeSlug(lastSegment);
  const slugSet = new Set(
    (learningObjects || [])
      .map((entry) => normalizeSlug(entry?.slug || ""))
      .filter(Boolean),
  );
  return slugSet.has(target) ? lastSegment : "";
};

const normalizeLearningObjectUrl = ({
  currentLoPathRaw = "",
  learningObjects = [],
  resolvedSlug = "",
}) => {
  if (typeof window === "undefined" || !resolvedSlug) return;

  const targetSlug = normalizeSlug(resolvedSlug);
  if (!targetSlug) return;

  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const slugSet = new Set(
    (learningObjects || [])
      .map((entry) => normalizeSlug(entry?.slug || ""))
      .filter(Boolean),
  );

  if (currentLoPathRaw && pathSegments.length > 0) {
    pathSegments[pathSegments.length - 1] = resolvedSlug;
  } else {
    pathSegments.push(resolvedSlug);
  }

  if (url.searchParams.has("lo")) {
    url.searchParams.delete("lo");
  }

  // If current path already contains an LO slug, ensure we keep only the
  // resolved slug segment instead of accumulating nested /slug/slug/ paths.
  if (!currentLoPathRaw && pathSegments.length > 1) {
    const penultimateIndex = pathSegments.length - 2;
    const penultimateIsSlug = slugSet.has(
      normalizeSlug(pathSegments[penultimateIndex]),
    );
    if (penultimateIsSlug) {
      pathSegments.splice(penultimateIndex, 1);
    }
  }

  const targetPathname = `/${pathSegments.join("/")}/`;
  const targetSearch = url.search;
  const targetHash = url.hash;

  if (
    targetPathname === window.location.pathname &&
    targetSearch === window.location.search &&
    targetHash === window.location.hash
  ) {
    return;
  }

  window.history.replaceState(
    {},
    "",
    `${targetPathname}${targetSearch}${targetHash}`,
  );
};

const countAccordionsInComponent = (value) => {
  if (!value || typeof value !== "object") return 0;

  const { component, expandable = true } = value;
  if (typeof component !== "string" || component.trim() === "") return 0;
  if (component.startsWith("HIDE")) return 0;

  // Count expandable nodes exactly as the renderer creates accordion wrappers.
  // We use this to auto-open section content only when there is a single
  // accordion in the whole top-level section.
  switch (component) {
    case "Group": {
      const { content: groupContent = [], displayAsTabs = false } = value;
      const groupItems = normaliseContentItems(groupContent);
      if (displayAsTabs) {
        // Tab children render as bare content; only group wrapper can be accordion.
        return expandable ? 1 : 0;
      }
      const childCount = groupItems.reduce(
        (sum, item) => sum + countAccordionsInComponent(item),
        0,
      );
      return (expandable ? 1 : 0) + childCount;
    }
    case "Section": {
      const { content: sectionContent = [] } = value;
      const sectionItems = normaliseContentItems(sectionContent);
      return sectionItems.reduce(
        (sum, item) => sum + countAccordionsInComponent(item),
        0,
      );
    }
    case "Explanation":
    case "PhraseTable":
      return expandable ? 1 : 0;
    default:
      return expandable ? 1 : 0;
  }
};

export {
  splitDisplayTitle,
  hasNonEmptyInstructionValue,
  normalizeSlug,
  normaliseContentItems,
  normalizeInstructionSchemaNode,
  injectSharedExerciseDefaults,
  resolveLearningObjectParam,
  getLearningObjectPathParam,
  normalizeLearningObjectUrl,
  countAccordionsInComponent,
};
