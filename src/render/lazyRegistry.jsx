import { lazy, Suspense } from "react";

// Lazy code-split registry for the render path.
//
// Exercises and custom (grammar / pronunciation) components used to be carried
// eagerly in the initial bundle. They are now each behind React.lazy so a
// learning object only downloads the exercise types and custom components it
// actually renders (PR #34). The lazy types are created once at module scope
// (stable identity) and every render site wraps them in their own <Suspense>
// boundary via withLazyBoundary. This module is closure-free so the seams can
// be unit-tested in isolation; the dispatch that consumes them lives in App.jsx.

// Pull the named export `name` off a resolved exercise module into the
// { default } shape React.lazy expects. Factored out as a pure function so the
// name→export mapping can be unit-tested without driving the lazy loader.
export const resolveExerciseExport = (module, name) => ({ default: module[name] });

export const lazyExercise = (loader, name) =>
  lazy(() => loader().then((m) => resolveExerciseExport(m, name)));

// Exercises rendered uniformly as <Component config={value} />. To add another
// such exercise, register it here — no new switch case. Each entry is its own
// async chunk loaded on demand.
export const EXERCISE_REGISTRY = {
  TypedTransformExercise: lazyExercise(
    () => import("@/components/exercises/TypedTransformExercise"),
    "TypedTransformExercise",
  ),
  DictationExercise: lazyExercise(
    () => import("@/components/exercises/DictationExercise"),
    "DictationExercise",
  ),
  DraggableFillGaps: lazyExercise(
    () => import("@/components/exercises/DraggableFillGaps"),
    "DraggableFillGaps",
  ),
  SelectExercise: lazyExercise(
    () => import("@/components/exercises/SelectExercise"),
    "SelectExercise",
  ),
  InlineChoiceGroup: lazyExercise(
    () => import("@/components/exercises/InlineChoiceGroup"),
    "InlineChoiceGroup",
  ),
  InlineTypedGapExercise: lazyExercise(
    () => import("@/components/exercises/InlineTypedGapExercise"),
    "InlineTypedGapExercise",
  ),
  LineMatch: lazyExercise(
    () => import("@/components/exercises/LineMatch"),
    "LineMatch",
  ),
  MemoryMatchGame: lazyExercise(
    () => import("@/components/exercises/MemoryMatchGame"),
    "MemoryMatchGame",
  ),
  RadioQuiz: lazyExercise(
    () => import("@/components/exercises/RadioQuiz"),
    "RadioQuiz",
  ),
  WordOrderExercise: lazyExercise(
    () => import("@/components/exercises/WordOrderExercise"),
    "WordOrderExercise",
  ),
  PhraseReorderExercise: lazyExercise(
    () => import("@/components/exercises/PhraseReorderExercise"),
    "PhraseReorderExercise",
  ),
  WordSpotExercise: lazyExercise(
    () => import("@/components/exercises/WordSpotExercise"),
    "WordSpotExercise",
  ),
};

// Custom components are resolved by string key from LO config. They are the
// single largest slice of app code, so the whole custom registry is deferred
// into one async chunk loaded the first time any custom component renders.

// Resolve a custom component by key from the loaded custom registry into the
// { default } shape React.lazy expects, falling back to the same "not
// implemented" notice the eager switch used to render. Pure so the
// key→component (and missing-key) mapping can be unit-tested in isolation.
export const resolveCustomExport = (module, name) => ({
  default:
    module.AllCustomComponentsFR[name] ||
    (() => <p>Component {name} not implemented</p>),
});

// getLazyCustomComponent memoises one React.lazy type per key (stable
// identity); a missing key resolves to the "not implemented" notice.
const lazyCustomComponentCache = {};
export const getLazyCustomComponent = (name) => {
  if (!lazyCustomComponentCache[name]) {
    lazyCustomComponentCache[name] = lazy(() =>
      import("@/components/custom").then((m) => resolveCustomExport(m, name)),
    );
  }
  return lazyCustomComponentCache[name];
};

// Wrap a lazily-loaded element in its own Suspense boundary so a still-loading
// chunk never blanks out neighbouring content. The loading placeholder is
// per-component, so only the resolving slot shows it — surrounding accordion
// headers and other sections stay in place.
export const withLazyBoundary = (node, key) => (
  <Suspense
    fallback={
      <div className="lazy-component-loading" role="status" aria-live="polite">
        <span className="sr-only">Loading…</span>
      </div>
    }
    key={key}
  >
    {node}
  </Suspense>
);
