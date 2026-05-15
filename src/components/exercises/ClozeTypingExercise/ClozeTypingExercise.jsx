import { TextEntryExerciseRuntime } from "../TextEntryExerciseRuntime/TextEntryExerciseRuntime";
import React from "react";

// Semantic wrapper: sentence-completion (gap-fill) typed by the learner.
// "Cloze" is established EFL/MFL terminology for activities where one or
// more words are removed from a sentence and the learner types the missing
// word(s) — different from full dictation (no context) or typed transform
// (prompt -> target form conversion).
//
// This wrapper renders gaps inline inside each table row using the shared
// runtime's per-row TypedAnswerField path (useGlobalActions: false).
// Any cloze-specific behaviour — partial credit, multi-gap scoring,
// context-sensitive hint display — should be added here or via a flag
// passed to TextEntryExerciseRuntime, without touching DictationExercise
// or TypedTransformExercise.
export class ClozeTypingExercise extends React.PureComponent {
	// TODO(component-split): add cloze-specific features here:
	// - per-gap partial scoring
	// - context hints / reveal policy
	// without changing DictationExercise or TypedTransformExercise.
	render = () => (
		<TextEntryExerciseRuntime
			{...this.props}
			useGlobalActions={false}
		/>
	);
}
