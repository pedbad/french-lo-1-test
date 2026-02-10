import './Dialog.scss';
import React from 'react';

export class Dialog extends React.PureComponent {
	render() {
		const {
			className = '',
			handleAffirm,
			handleClear,
			id,
			message,
			theme = 'home',
			type = 'clear',
		} = this.props;

		return (
			<dialog
				className={`${className} dialog ${type} ${theme}`}
				{...id ? { id: id } : {}}
			>
				<div
					className={`background`}
					key={`background`}
				/>
				<div
					className={`dialog-box`}
					key={`dialog-box`}
				>
					<div key={`dialog-box-message`}>{message}</div>
					<footer>
						{type === 'clear' ?
							<button
								key='dialog-button-clear'
								onClick={handleClear}
							>OK</button> : null}
						{type === 'yesno' ?
							<div
								className='button-group'
								key='button-group'
							>
								<button
									id='dialogButtonNo'
									key='dialog-button-no'
									onClick={handleClear}
								>No</button>
								<button
									id='dialogButtonYes'
									key='dialog-button-yes'
									onClick={handleAffirm}
								>Yes</button>
							</div> : null}
					</footer>
				</div>
			</dialog>
		);
	}
}