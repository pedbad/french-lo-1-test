import React from "react";
import { AnswerTable } from "../AnswerTable";

// Semantic wrapper: prompt -> typed transformed target form.
// Uses the existing AnswerTable runtime to avoid behavior drift during migration.
export class TypedTransformExercise extends React.PureComponent {
	render = () => <AnswerTable {...this.props} />;
}

