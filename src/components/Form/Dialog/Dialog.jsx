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
				className={`${className} dialog ${type} ${theme} fixed inset-0 z-[999] m-0 flex h-full w-full cursor-not-allowed items-center justify-center border-0 bg-transparent p-0`}
				{...id ? { id: id } : {}}
			>
				<div
					className="background absolute inset-0 m-0 h-full w-full"
					key={`background`}
				/>
				<div
					className="dialog-box absolute z-[1000] w-[600px] border-4 border-solid border-[var(--border)] bg-[var(--card)]"
					key={`dialog-box`}
				>
					<div className="p-4" key={`dialog-box-message`}>{message}</div>
					<footer className="m-[1vh] flex justify-end">
						{type === 'clear' ?
							<button
								key='dialog-button-clear'
								onClick={handleClear}
							>OK</button> : null}
						{type === 'yesno' ?
							<div
								className='button-group p-4'
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
