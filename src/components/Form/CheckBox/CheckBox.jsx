import {
	Info,
} from '../..';
import React from "react";
import {
	TristateCheckBox,
} from '..';

export class CheckBox extends React.PureComponent {

	render() {
		const {
			className = '',
			disabled = false,
			error = '',
			handleChange,
			id,
			info,
			label = '',
			optionlabel,
			required,
			title = '',
			value = false,
		} = this.props;

		return (
			<div
				className={`
					${className} 
					row
					checkbox-row
					${error ? 'error' : ''}
				`}
				onClick={(e) => {
					e.stopPropagation();
					if (!disabled)handleChange(id, !value);
				}}
			>
				{label ? <label
					htmlFor={id}
					onClick={(e) => {
						e.stopPropagation();
						if (!disabled)handleChange(id, !value);
					}}
				>{label}{required ? <sup>*</sup> : ""}{info ? <Info
						infoTitle={info.title}
						infoMessage={info.message}
					/> : ""}:</label> : ''}

				<div className={`${className} checkbox-container`}>
					{optionlabel ? <span className='optionlabel'>{optionlabel}:</span> : ''}
					<TristateCheckBox
						className={className}
						disabled={disabled}
						error={error}
						handleChange={handleChange}
						id={id}
						title={title}
						value={value}
					/>
				</div>
				{error ? <div className="error">{error}</div> : null}
			</div>
		);
	}
}