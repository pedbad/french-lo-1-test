import {
	Info,
} from '../..';
import React from "react";

export class TextArea extends React.PureComponent {
	render() {
		const {
			changeParentValue,
			className,
			disabled = false,
			error,
			id,
			info,
			label,
			name,
			placeholder,
			required,
			value,
		} = this.props;
		return (
			<div className={`
				text-area-row 
				row
				${className} 
				${disabled ? 'disabled' : ''}
				${error ? 'error' : ''}
			`}>
				<label htmlFor={id}>{label}{required ? <sup>*</sup> : ""}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label>
				<textarea name={name} id={id} onChange={changeParentValue} placeholder={placeholder} required={required ? "required" : ""} value={value}></textarea>
				<div className="error">{error}</div>
			</div >
		);
	}
}