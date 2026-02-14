import React from 'react';

export class OkCancel extends React.PureComponent {

	render() {
		const { handleOk, handleCancel } = this.props;

		return (
			<div className="w-full flex flex-row justify-end">
				<button
					className="max-w-[100px] m-2"
					id='ok'
					onClick={handleOk}
				>OK</button>
				<button
					className="max-w-[100px] mt-2 mb-2 ml-2 mr-0"
					id='cancel'
					onClick={handleCancel}
				>Cancel</button>
			</div>
		);
	}
}

