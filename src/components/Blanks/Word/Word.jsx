import './Word.scss';
import React from 'react';

const BLANK_WORD_TEXT_CLASS = "text-[1.2rem] leading-[1.4rem]";

export class Word extends React.PureComponent {

	render = () => {

		const {
			children,
			className,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			index,
			x,
			y,
		} = this.props;

		const styles = {};
		if (x !== undefined)styles.left = `${x}px`;
		if (y !== undefined)styles.top = `${y}px`;

		// word${index} must be the first class
		return (
			<div
				className={`word${index} word ${className ? className : ''} `}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={styles}
				><span className={BLANK_WORD_TEXT_CLASS}>{children}</span></div>
			);
		};
}
