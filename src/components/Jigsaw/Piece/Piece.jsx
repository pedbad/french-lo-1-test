import React from 'react';
import {resolveAsset} from '../../../utility';

const PIECE_SLOT_COUNT = 20;

export class Piece extends React.PureComponent {

	render = () => {

		const {
			className,
			correctImage,
			correctSet = false,
			correctx,
			correcty,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			incorrectImage,
			index,
			x,
			y
		} = this.props;

		const normalizedIndex = ((index - 1) % PIECE_SLOT_COUNT) + 1;
		const pieceSlotClass = `piece-slot-${normalizedIndex}`;

		const styles = {};
		if (x !== undefined) styles.left = `${x}px`;
		if (y !== undefined) styles.top = `${y}px`;
		if (correctSet) {
			styles.backgroundImage = `url(${resolveAsset(correctImage)})`;
		} else {
			styles.backgroundImage = `url(${resolveAsset(incorrectImage)})`;
		}

		// console.log("styles", styles);

		return (
			<div
				className={`piece ${pieceSlotClass} ${correctSet ? 'correct-set' : ''} ${className ? className : ''} ${index}`}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={styles}
				correctx={correctx}
				correcty={correcty}
			></div>
		);
	};
}
