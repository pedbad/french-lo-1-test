import './FieldSet.scss';
import React from 'react';

export class FieldSet extends React.PureComponent {
	render() {
		const {
			children,
			className = ''
		} = this.props;
		return (
			<fieldset className={`form-group ${className}`} >
				{children}
			</fieldset >
		);
	}
}