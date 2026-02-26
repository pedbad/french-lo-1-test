import React from "react";
import { AnswerTable } from "../AnswerTable";

// Semantic wrapper: listen -> type what you hear.
// Uses the existing AnswerTable runtime to avoid behavior drift during migration.
export class DictationExercise extends React.PureComponent {
	render = () => <AnswerTable {...this.props} />;
}

