import { TextEntryExerciseRuntime } from "../TextEntryExerciseRuntime/TextEntryExerciseRuntime";
import React from "react";

// Semantic wrapper: prompt -> typed transformed target form.
// Kept on shared runtime for parity; planned divergence is isolated below.
export class TypedTransformExercise extends React.PureComponent {
	// TODO(component-split): keep transformed-form tolerant matching here
	// (for example agreement variants) without affecting DictationExercise.
	render = () => (
		<TextEntryExerciseRuntime
			{...this.props}
			audioClipClassName="super-compact-speaker"
			audioColumnPosition="left"
			useGlobalActions={true}
		/>
	);
}
