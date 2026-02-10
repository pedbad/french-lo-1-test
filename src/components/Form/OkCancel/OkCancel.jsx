import './OkCancel.scss';
import React from 'react';

export class OkCancel extends React.PureComponent {

	render() {
		const { handleOk, handleCancel } = this.props;

		return (
			<div className='button-group ok-cancel'>
				<button
					id='ok'
					onClick={handleOk}
				>OK</button>
				<button
					id='cancel'
					onClick={handleCancel}
				>Cancel</button>
			</div>
		);
	}
}


