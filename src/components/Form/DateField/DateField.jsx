import './DateField.scss';
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
			<div className={`date-field row ${className} ${value === '' ? 'unset' : ''} ${disabled ? 'disabled' : ''}`}>
				{label ? <label htmlFor={id}>{label}{required ? <sup>*</sup> : ""}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label> : ''}
				<input
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