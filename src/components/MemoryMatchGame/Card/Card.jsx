import './Card.scss';
import { AudioClip } from '../..';
import React from 'react';

export class Card extends React.PureComponent {

	render = () => {

		const {
			card,
			className,
			handleClick,
			id,
		} = this.props;

		return (
			<div
				key={id}
				className={`card ${className}`}
				onClick={() => handleClick(card)}
				title={`Click to flip`}
			>
				<div className={`card-contents-container`}>

					{card.type === 'text' ? (
						<div>{card.content}</div>
					) : (
						<div
							className={`card-image-container`}
							style={{ backgroundImage: `url(${card.image})` }}
						/>
						// <div
						// 	className={`card-image-container`}
						// 	style={{ backgroundImage: `url(${resolveAsset(card.image)})` }}
						// >{`url(${resolveAsset(card.image)})`}</div>
					)}
					{card.type === 'text' && card.audio ? <AudioClip className={`super-compact`} soundFile={`${card.audio}`} /> : null}
				</div>
				<div className={`card-back`}>
					<span className="text-muted-foreground text-xl font-bold">?</span>
				</div>
			</div>
		);
	};
}
