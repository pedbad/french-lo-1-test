import { AnswerTableRuntime } from './AnswerTableRuntime';
import React from 'react';

export class AnswerTable extends React.PureComponent {
	render = () => <AnswerTableRuntime {...this.props} />;
}
