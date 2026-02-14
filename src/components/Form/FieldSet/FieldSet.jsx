import React from 'react';

export class FieldSet extends React.PureComponent {
	render() {
		const {
			children,
			className = ''
		} = this.props;
		return (
			<fieldset className={`form-group m-0 flex w-full flex-row justify-end border-none p-0 ${className}`} >
				{children}
			</fieldset >
		);
	}
}
