import {
	Info,
} from '../..';
import React from 'react';

export class DateField extends React.PureComponent {

	render() {
		const {
			className = '',
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
			required,
			step,
			tabindex = 0,
			value = '',
		} = this.props;

		return (
			<div className={`date-field row [grid-template-areas:"label_device"] ${className} ${value === '' ? 'unset' : ''} ${disabled ? 'disabled' : ''}`}>
				{label ? <label htmlFor={id}>{label}{required ? <sup>*</sup> : ""}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label> : ''}
				<input
					className="w-full max-w-[170px] self-end justify-self-end [grid-area:device] h-[38px] text-[var(--font-size-sm)] p-[8px_4px] disabled:cursor-not-allowed"
					disabled={disabled}
					id={id}
					max={max}
					min={min}
					onBlur={handleBlur}
					onChange={(e) => handleChange(id, e.target.value)}
					required={required ? "required" : ""}
					step={step ? step : ""}
					tabIndex={tabindex}
					type={'date'}
					value={value}
				/>
				<div className="error">{error}</div>
			</div >
		);
	}
}
