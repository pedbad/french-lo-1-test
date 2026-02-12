import './DraggableWordTile.scss';
import { ArrowDownToLine } from "lucide-react";
import React from 'react';

const BLANK_WORD_TEXT_CLASS = "text-[1.2rem] leading-[1.4rem]";
const DROP_TARGET_ICON_CLASS = "pointer-events-none absolute inset-0 m-auto h-4 w-4 text-[color-mix(in_oklab,var(--chart-3)_65%,white)] opacity-70 z-0";
const DRAGGABLE_WORD_TILE_CLASS = [
	"inline-flex justify-center select-none transition-[left,top,box-shadow] duration-1000",
	"[&.draggable]:cursor-pointer",
	"[&.dragged]:absolute [&.dragged]:cursor-grab",
	"[&.dragged>span]:transition-[left,top,box-shadow] [&.dragged>span]:duration-1000",
	"[&.dragging]:absolute [&.dragging]:z-[11] [&.dragging]:cursor-grab",
	"[&.dragging]:transition-[left,top,box-shadow] [&.dragging]:duration-0",
	"[&.dragging>span]:shadow-none",
	"[&.dragging>span]:ring-2 [&.dragging>span]:ring-[color-mix(in_oklab,var(--chart-3)_55%,white)]",
	"[&.dragging>span]:transition-shadow [&.dragging>span]:duration-1000",
	"[&.placed]:absolute [&.placed]:cursor-default [&.placed]:pointer-events-none [&.placed]:!opacity-100",
	"[&.placed>span]:transition-[left,top] [&.placed>span]:duration-1000",
	"[&.returning]:transition-[left,top,box-shadow] [&.returning]:duration-1000",
	"[&.blank]:relative",
	"[&.blank>span]:relative [&.blank>span]:z-10",
	"[&.blank>span]:my-1 [&.blank>span]:mx-1",
	"[&.blank>span]:rounded-xl",
	"[&.blank>span]:border-0",
	"[&.blank>span]:border [&.blank>span]:border-[color-mix(in_oklab,var(--chart-3)_72%,black)]",
	"[&.blank>span]:px-2 [&.blank>span]:py-1",
	"sm:[&.blank>span]:px-4 sm:[&.blank>span]:py-[0.4rem]",
	"[&.blank>span]:font-bold [&.blank>span]:min-h-[1.4rem] [&.blank>span]:inline-block",
	"[&.blank>span]:bg-[var(--chart-3)]",
	"[&.blank>span]:text-[var(--primary-foreground)]",
	"[&.draggable>span]:shadow-[0_1px_2px_color-mix(in_oklab,var(--foreground)_18%,transparent)]",
	"[&.draggable>span]:transition-[box-shadow,filter,border-color] [&.draggable>span]:duration-200 [&.draggable>span]:ease-out",
	"[&.draggable>span:hover]:text-[var(--ped-warn)]",
	"[&.draggable>span:hover]:shadow-[0_4px_10px_color-mix(in_oklab,var(--foreground)_24%,transparent)]",
	"[&.draggable>span:hover]:border-[color-mix(in_oklab,var(--chart-3)_78%,white)]",
	"[&.draggable>span:active]:shadow-none",
].join(" ");

export class DraggableWordTile extends React.PureComponent {

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
		const isTarget = typeof className === "string" && className.split(/\s+/).includes("target");

		// word${index} must be the first class
		return (
			<div
				className={`word${index} word ${DRAGGABLE_WORD_TILE_CLASS} ${className ? className : ''} `}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={styles}
			>
				{isTarget ? <ArrowDownToLine aria-hidden="true" className={DROP_TARGET_ICON_CLASS} /> : null}
				<span className={BLANK_WORD_TEXT_CLASS}>{children}</span>
			</div>
			);
		};
}
