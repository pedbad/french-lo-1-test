import { AnswerTableRuntime } from "../AnswerTable/AnswerTableRuntime";
import React from "react";

// Semantic wrapper: listen + transcribe.
// Kept on shared runtime for parity; planned divergence is isolated below.
export class DictationExercise extends React.PureComponent {
	// TODO(component-split): add dictation-specific normalization rules
	// (punctuation/accents policy) without changing TypedTransformExercise.
	render = () => (
		<AnswerTableRuntime
			{...this.props}
			audioClipClassName="super-compact-speaker"
			audioColumnPosition="left"
			comparisonOptions={{ comparisonMode: "dictation" }}
			useGlobalActions={true}
		/>
	);
}
