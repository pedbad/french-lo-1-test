import './Attribution.scss';
import React from 'react';

const ATTRIBUTION_TEXT_CLASS = "text-[calc(var(--font-size-sm)*0.5)]";

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
