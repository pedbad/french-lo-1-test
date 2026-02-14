import {
	Image,
} from '../../components';
import React from 'react';

export class Figure extends React.PureComponent {

	render = () => {
		const {
			className = '',
			src,
			thumb,
			title,
		} = this.props;

		return (
			<figure className={`figure ${className.replace('frame', '')}`}>
				<Image
					className={`frame ${className}`}
					src={src}
					title={title}
					thumb={thumb}
				/>
				{title !== '' ? <figcaption>{title}</figcaption> : null}
			</figure>
		);
	};
}
