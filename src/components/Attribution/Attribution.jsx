import './Attribution.scss';
import React from 'react';

const ATTRIBUTION_TEXT_CLASS = "text-[0.5rem]";

export class Attribution extends React.PureComponent {

	render = () => {
		const {
			children,
			className = '',
		} = this.props;

		return (
			<div
				className={`attribution ${ATTRIBUTION_TEXT_CLASS} ${className ? className : null}`}
			>
				{children}
			</div>
		);
	};
}
