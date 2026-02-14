import React from 'react';

export class Image extends React.PureComponent {

	render = () => {
		const {
			className = '',
			thumb,
			title,
		} = this.props;
		const {
			alt = title,
			src = thumb,
		} = this.props;

		return (
			<a
				className={`image-anchor ${className}`}
				href={src}
				target='_blank'
				rel="noreferrer">
				<img
					alt={alt}
					className={`image`}
					src={thumb}
					title={title}
					loading={`lazy`}
				/>
			</a>
		);
	};
}
