import './Attribution.scss';
import React from 'react';

export class Attribution extends React.PureComponent {

	render = () => {
		const {
			children,
			className = '',
		} = this.props;

		return (
			<div
				className={`attribution ${className ? className : null}`}
			>
				{children}
			</div>
		);
	};
}
