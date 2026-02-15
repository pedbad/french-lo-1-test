import React from 'react';

const CONGRATULATE_TEXT_CLASS =
	"text-[calc(var(--font-size-base)*2.174)] leading-[calc(var(--font-size-base)*3.261)] md:text-[calc(var(--font-size-base)*4.348)] md:leading-[calc(var(--font-size-base)*4.891)]";

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
			id,
		} = this.props;
		const dialogId = id || undefined;

		if (enabled) {
			return (
				<div className={`dialog-mask ${className}`}>
					<dialog
						id={dialogId}
						className={`congratulate-dialog ${className} ${CONGRATULATE_TEXT_CLASS} ring ring-1 shadow-xs`}
					>
						<button type="button" className="close" onClick={hideDialog}>X</button>
						{content}
					</dialog>
				</div>
			);
		}

		return null;
	};
}
