import {
	Info,
} from '../..';
import React from 'react';
export class Select extends React.Component {
	constructor(props) {
		super(props);

		this.state = ({
			value: this.props.value,
		});

		// this.renderSelect = this.renderSelect.bind(this);

		this.inputRef = React.createRef();
		// this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (e) => {
		const {
			handleChange,
			id,
			multiple = false,
		} = this.props;
		// console.log("Select handleChange", e.target);
		e.preventDefault();
		e.stopPropagation();
		if (multiple) {
			// console.log(e.target.options);
			handleChange(id, e.target.options);
		} else {
			// console.log(e.target.value);
			handleChange(id, e.target.value);
		}
	};

	renderSelect = () => {
		const {
			// handleChange,
			editable = false,
			id,
			multiple = false,
			options = [],
			value,
		} = this.props;
		const renderedOptions = [];
		options.forEach((option) => {
			const { disabled = false } = option;
			renderedOptions.push(
				<option
					key={`${id}${option.value}${option.name}`}
					value={option.value}
					disabled={disabled ? true : null}
				>{option.name}</option>
			);
		});
		const selectClassName = `${renderedOptions.length <= 1 ? 'hidden' : ''} ${editable ? 'select-editable absolute left-0 top-0 m-0 h-full w-full border-0 outline-none' : ''} ${multiple ? 'select-multiple relative block h-[calc(38px*3)] w-full self-end [grid-area:device] border border-[var(--border)] bg-[var(--background)] p-0 outline-none' : ''} ${!editable && !multiple ? 'w-full self-end [grid-area:device] text-base outline-none' : ''} text-base`;
		return (
			<select
				className={selectClassName}
				id={id}
				key={`select-${id}`}
				// onChange={(e) => {
				// 	// e.preventDefault();
				// 	// e.stopPropagation();
				// 	if (multiple) {
				// 		handleChange(id, e.target.options);
				// 	} else {
				// 		handleChange(id, e.target.value);
				// 	}
				// }}
				// onMouse
				// onMouseUp={this.handleChange}
				onChange={this.handleChange}
				multiple={multiple}
				value={value === null ? '' : value}
			>
				{renderedOptions}
			</select >
		);
	};

	render() {
		const {
			className,
			editable = false,
			error,
			handleBlur = () => { },
			handleChange,
			id,
			info,
			label,
			required,
			value,
		} = this.props;

		return (
			<div
				className={`
					select-row row
					${error ? 'error' : ''}
					${className ? className : ''}
				`}
				key={`select-row-${id}`}
			>
				{label ? <label htmlFor={id}>{label}{required ? <sup>*</sup> : ""}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label> : ''}
				{editable ?
					<div
						className="select-editable relative block h-[38px] w-full self-end [grid-area:device] overflow-hidden border border-[var(--border)] bg-[var(--background)] p-0"
						key={`select-editable-${id}`}
					>
						{this.renderSelect()}
						<input
							className="text-base outline-none absolute left-0 top-0 z-[2] h-full w-[calc(100%-18px)] border-0 p-[8px_0_8px_4px]"
							autoComplete="off"
							id={`selectInput${id}`}
							key={`select-input-${id}`}
							name='format'
							onBlur={(e) => {
								handleBlur(id, e.target.value);
							}}
							onChange={(e) => {
								handleChange(id, e.target.value);
							}}
							ref={this.inputRef}
							type='text'
							value={value}
						/>
					</div>
					:
					this.renderSelect()
				}
				<div className="error">{error}</div>
			</div >
		);
	}
}
