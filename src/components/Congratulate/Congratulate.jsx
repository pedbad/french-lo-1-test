import './Congratulate.scss';
import React from 'react';

const CONGRATULATE_TEXT_CLASS = "text-[40px] leading-[60px] md:text-[80px] md:leading-[90px]";

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
					<dialog id='congratulate' className={`${className} ${CONGRATULATE_TEXT_CLASS} ring ring-1 shadow-xs`}>
						<button className={`close`} onClick={hideDialog} >X</button>
						{content}
					</dialog>
				</div>
			);
		};
	};
}
