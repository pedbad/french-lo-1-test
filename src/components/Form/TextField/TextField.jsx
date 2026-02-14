import {
	Info,
} from '../..';
import React from 'react';

export class TextField extends React.PureComponent {

	constructor(props) {
		super(props);
		// this.select = this.select.bind(this);
		// this.setSelectionRange = this.setSelectionRange.bind(this);

		const {
			parentRef
		} = this.props;

		this.inputRef = parentRef ? parentRef : React.createRef();
	}

	render() {
		const {
			autocomplete = '',
			children,
			className = '',
			copyButton = false,
			disabled,
			error,
			handleBlur = () => {
				// This is intentional
			},
			handleChange,
			id,
			info,
			label,
			max,
			min,
			name,
			placeholder,
			readOnly = false,
			required,
			step,
			style,
			tabindex = 0,
			type,
			value = '',
		} = this.props;

		const isLocked = disabled || readOnly;
		const inputClassName = `text-field w-full h-[38px] self-end [grid-area:device] text-[var(--font-size-sm)] p-[8px_4px] ${isLocked ? 'cursor-not-allowed bg-transparent border-0 outline-none' : ''}`;
		return (
			<div className={`
				text-field-row
				row
				[&>button]:[grid-area:buttons] [&>button]:self-center [&>button]:justify-self-center
				[&>.copy-button]:justify-self-center [&>.paste-button]:[grid-area:buttons]
				${copyButton ? 'with-button' : ''}
				${label === '' || label === undefined ? 'without-label' : ''}
				${className} 
				${value === '' ? 'unset' : ''} 
				${isLocked ? 'disabled' : ''}
				${error ? 'error' : ''}
			`}>
				{label ? <label htmlFor={id}>{label}{required ? <sup>*</sup> : ""}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label> : ''}
				{(autocomplete !== '') ?
					<input
						autoComplete={autocomplete}
						className={inputClassName}
						disabled={disabled}
						editable={readOnly ? 'false' : 'true'}
						id={id}
						max={max}
						min={min}
						name={name}
						onBlur={handleBlur}
						onChange={(e) => handleChange(id, e.target.value)}
						placeholder={placeholder}
						ref={this.inputRef}
						required={required ? "required" : ""}
						step={step}
						style={style}
						tabIndex={tabindex}
						type={type || 'text'}
						value={value}
					/>
					:
					<input
						className={inputClassName}
						editable={readOnly ? 'false' : 'true'}
						disabled={disabled}
						id={id}
						max={max}
						min={min}
						onBlur={handleBlur}
						onChange={(e) => handleChange(id, e.target.value)}
						placeholder={placeholder}
						ref={this.inputRef}
						required={required ? "required" : ""}
						step={step}
						style={style}
						tabIndex={tabindex}
						type={type || 'text'}
						value={value}
					/>
				}
				{children}
				<div className="error">{error}</div>
			</div >
		);
	}

	select = () => {
		const inputRef = this.inputRef.current;
		inputRef.select();
	};

	setSelectionRange = (from, to) => {
		const inputRef = this.inputRef.current;
		// structureCopyInput.value = structure;
		inputRef.setSelectionRange(from, to);
	};

	selectAll = () => {
		this.select();
		this.setSelectionRange(0, 99999);
	};

}
