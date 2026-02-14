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
		const isChecked = value !== false;
		const isReadonly = value === 3;
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
					relative h-4 w-4 rounded-[3px] border-2 border-[var(--foreground)] bg-[var(--background)] cursor-pointer
					${isChecked
			? `checked bg-[var(--foreground)]
						   before:content-[''] before:absolute before:block before:bg-[var(--background)]
						   before:w-[calc(16px*2/3)] before:h-[calc(16px/6)] before:-rotate-45 before:top-1 before:left-[2px]
						   after:content-[''] after:absolute after:block after:bg-[var(--background)]
						   after:w-[calc(16px/3)] after:h-[calc(16px/6)] after:rotate-45 after:top-[5px] after:left-0`
			: 'unchecked'}
					${disabled ? 'disabled' : ''}
					${isReadonly ? 'readonly cursor-not-allowed bg-transparent border-transparent' : ''}
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
