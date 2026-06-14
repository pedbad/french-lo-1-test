/**
 * Shared scoring helpers for the "blank-grading" exercise family (RadioQuiz,
 * SelectExercise, InlineChoiceGroup, InlineTypedGapExercise,
 * TextEntryExerciseRuntime, LineMatch).
 *
 * These six all model grading as a `checkedResults` map (blank/row key -> boolean
 * correct) plus `hasChecked` and a derived `nCorrect`. The grading FUNCTION
 * (option-index vs normalized-typed vs identity match) differs per exercise and
 * stays in each caller — only the three shared fields, the count derivation, and
 * the "commit a check" shape live here.
 *
 * NOTE: this is a pure-function module, not a stateful hook. The scoring fields
 * must remain inside each exercise's single merge reducer so that a check updates
 * atomically alongside `values` / `diffResults` / `showExplanation`; lifting them
 * into a separate `useState`/`useReducer` store would split those updates across
 * two renders and risk desync on grade-critical code. (The sequence/placement
 * exercises — WordOrder, PhraseReorder, DraggableFillGaps — use a different
 * `failCount`/`complete` model and intentionally do NOT use these helpers.)
 */

/**
 * Fresh baseline for the scoring fields. A FACTORY (not a shared constant) so
 * each reset gets its own `checkedResults` object — a shared constant would hand
 * every exercise the same mutable map.
 * @returns {{ checkedResults: object, hasChecked: boolean, nCorrect: number }}
 */
export const getInitialScoringState = () => ({
  checkedResults: {},
  hasChecked: false,
  nCorrect: 0,
});

/**
 * Number of correct blanks/rows in a checkedResults map.
 * @param {Record<string|number, boolean>} [checkedResults]
 * @returns {number}
 */
export const countCorrect = (checkedResults = {}) =>
  Object.values(checkedResults).filter(Boolean).length;

/**
 * The "commit a check" patch shared by every blank-grading check handler:
 * record the per-blank results, mark checked, and derive nCorrect. Callers spread
 * any exercise-specific siblings (diffResults, showExplanation, values, …)
 * alongside it.
 * @param {Record<string|number, boolean>} checkedResults
 * @returns {{ checkedResults: object, hasChecked: true, nCorrect: number }}
 */
export const commitCheck = (checkedResults) => ({
  checkedResults,
  hasChecked: true,
  nCorrect: countCorrect(checkedResults),
});
