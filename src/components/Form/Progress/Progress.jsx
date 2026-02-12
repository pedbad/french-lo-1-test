import './Progress.scss';
import React from 'react';

const PROGRESS_TEXT_CLASS = "leading-[140%]";

export class Progress extends React.PureComponent {
	render() {
		const {
			className = '',
			id,
			count,
			step,
		} = this.props;

		return (
			(step >= 0) ?
				<div
					className={`${className} progress-indicator`}
					{...id ? { id: id } : {}}
				>
					<div
						className={`progress-bar`}
						style={{ width: `${step * 100 / count}%` }} >
						<div className={`progress-bar-background`} />
					</div>
					<span className={PROGRESS_TEXT_CLASS}>{`${(step * 100 / count).toFixed(1)}%`}</span>
				</div > : null
		);
	}
}
