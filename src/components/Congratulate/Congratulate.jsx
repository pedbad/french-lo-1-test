import './Congratulate.scss';
import React from 'react';

export class Congratulate extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render = () => {
		const {
			className,
			content,
			enabled,
			hideDialog,
		} = this.props;

		if (enabled) {
			return (
				<div className={`dialog-mask ${className}`}>
					<dialog id='congratulate' className={`${className} ring ring-1 shadow-xs`}>
						<button className={`close`} onClick={hideDialog} >X</button>
						{content}
					</dialog>
				</div>
			);
		};
	};
}

