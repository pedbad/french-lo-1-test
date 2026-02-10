import './RadioC.scss';
import {
	Info,
} from '../..';
import React from 'react';

export class RadioC extends React.PureComponent {

	render() {
		const {
			className = '',
			disabled:allDisabled = false,
			diskRight = true,
			error = '',
			handleChange,
			id,
			info,
			label = '',
			radios = [],
			sameRow = false,
			title,
			value,
		} = this.props;

		const renderedRadios = [];
		radios.forEach((radio, i) => {
			let { disabled = false } = radio;
			if (allDisabled) disabled = true;
			renderedRadios.push(
				<div
					className={`
						${!sameRow ? 'radio-row row' : ''}
						radio radio${i + 1}
						${diskRight ? 'disk-right' : 'disk-left'}
						${radio.value === value ? 'checked' : ''}
						${disabled ? 'disabled' : ''}
					`}
					disabled={disabled ? true : null}
					key={`${id}${i}`}
					onClick={() => {
						if (!disabled)handleChange(id, radio.value);
					}}
				>
					<label>{radio.name}:</label>
					<div
						className={`
						radio-device
						${radio.value === value ? 'checked' : ''}
						${disabled ? 'disabled' : ''}
						`}
						{...title ? { title: title } : {}}
					></div>
				</div>
			);
		});

		return (
			<div
				className={`
					radio-container
					${allDisabled ? 'disabled' : ''}
					${label !== '' ? 'labelled' : ''}
					${sameRow ? 'same-row radio-row row' : ''} 
					radios${radios.length}
					${error ? 'error' : ''}
					${className}
					`}

				{...id ? { id: id } : {}}

			>
				{label ? <label>{label}{info ? <Info
					infoTitle={info.title}
					infoMessage={info.message}
				/> : ""}:</label> : ''}
				{renderedRadios}
				{error !== '' ? <div className="error">{error}</div> : null}
			</div>
		);
	}
}