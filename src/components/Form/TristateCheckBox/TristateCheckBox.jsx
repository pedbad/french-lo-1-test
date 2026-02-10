import './TristateCheckBox.scss';
import React from 'react';

export class TristateCheckBox extends React.PureComponent {
	render() {
		const {
			className = '',
			disabled = false,
			handleChange,
			id,
			title = '',
			value = false
		} = this.props;
		let newValue = value;
		if (newValue !== 3) newValue = !value;
		// console.log("TristateCheckBox newValue", newValue, typeof (newValue));
		// console.log("TristateCheckBox disabled", disabled, typeof disabled, id, title);

		return (
			<div
				id={id}
				className={`
					${className} 
					tristate-checkbox
					${disabled ? 'disabled' : ''}
					${value === 3 ? 'readonly' : ''} 
					${value === false ? 'unchecked' : 'checked'}
				`}
				onClick={(e) => {
					e.stopPropagation();
					if (value !== 3 && !disabled) handleChange(id, newValue);
				}}
				title={title}
			/>
		);
	}
}