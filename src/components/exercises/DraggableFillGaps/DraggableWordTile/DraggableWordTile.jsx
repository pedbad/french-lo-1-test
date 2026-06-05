import { SquareDashedMousePointer } from "lucide-react";
import React from 'react';

const BLANK_WORD_TEXT_CLASS = "text-[length:calc(var(--font-size-sm)*1.05)] leading-[1.2] min-[420px]:text-[length:calc(var(--font-size-sm)*1.15)] sm:text-[length:calc(var(--font-size-sm)*1.2)]";
const DROP_TARGET_ICON_CLASS = "blanks-slot-icon pointer-events-none absolute inset-0 m-auto h-[1.05rem] w-[1.05rem] min-[420px]:h-[1.15rem] min-[420px]:w-[1.15rem] text-[color-mix(in_oklab,var(--ex-neutral)_54%,var(--muted-foreground))] opacity-70 z-0 transition-all duration-200";
const DRAGGABLE_WORD_TILE_CLASS = [
  "inline-flex justify-center select-none transition-[left,top,box-shadow] duration-1000",
  "[&.draggable]:cursor-pointer",
  "[&.dragged]:absolute [&.dragged]:cursor-grab",
  "[&.dragged>span]:transition-[left,top,box-shadow] [&.dragged>span]:duration-1000",
  "[&.dragging]:absolute [&.dragging]:z-[11] [&.dragging]:cursor-grab",
  "[&.dragging]:transition-[left,top,box-shadow] [&.dragging]:duration-0",
  "[&.dragging>span]:shadow-none",
  "[&.dragging>span]:ring-2 [&.dragging>span]:ring-[color-mix(in_oklab,var(--ex-neutral)_55%,var(--background))]",
  "[&.dragging>span]:transition-shadow [&.dragging>span]:duration-1000",
  "[&.placed]:absolute [&.placed]:cursor-default [&.placed]:pointer-events-none [&.placed]:!opacity-100",
  "[&.placed>span]:transition-[left,top] [&.placed>span]:duration-1000",
  "[&.returning]:transition-[left,top,box-shadow] [&.returning]:duration-1000",
  "[&.blank]:relative",
  "[&.blank>span]:relative [&.blank>span]:z-10",
  "[&.blank>span]:my-1 [&.blank>span]:mx-[3px]",
  "[&.blank>span]:rounded-full",
  "[&.blank>span]:border [&.blank>span]:border-[color-mix(in_oklab,var(--ex-neutral)_70%,var(--foreground))]",
  "[&.blank>span]:px-2.5 [&.blank>span]:py-1.5 min-[420px]:[&.blank>span]:px-3.5 min-[420px]:[&.blank>span]:py-1.5 sm:[&.blank>span]:px-4 sm:[&.blank>span]:py-[0.45rem]",
  "[&.blank>span]:font-semibold [&.blank>span]:min-h-[1.85rem] [&.blank>span]:inline-flex [&.blank>span]:items-center",
  "[&.blank>span]:bg-[color-mix(in_oklab,var(--ex-neutral)_72%,var(--card))]",
  "[&.blank>span]:text-[var(--primary-foreground)]",
  "[&.blank>span]:shadow-[0_2px_7px_color-mix(in_oklab,var(--ex-neutral)_22%,transparent)]",
  "[&.draggable>span]:transition-[transform,box-shadow,filter,border-color,background-color] [&.draggable>span]:duration-180 [&.draggable>span]:ease-out",
  "[&.draggable>span:hover]:translate-y-[-1px]",
  "[&.draggable>span:hover]:shadow-[0_8px_16px_color-mix(in_oklab,var(--ex-neutral)_26%,transparent)]",
  "[&.draggable>span:hover]:border-[color-mix(in_oklab,var(--ex-neutral)_76%,var(--background))]",
  "[&.draggable>span:hover]:bg-[color-mix(in_oklab,var(--ex-neutral)_78%,var(--card))]",
  "[&.draggable>span:active]:translate-y-0 [&.draggable>span:active]:scale-[0.985]",
  "[&.draggable>span:active]:shadow-[0_2px_6px_color-mix(in_oklab,var(--ex-neutral)_24%,transparent)]",
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
        {isTarget ? <SquareDashedMousePointer aria-hidden="true" className={DROP_TARGET_ICON_CLASS} /> : null}
        <span className={BLANK_WORD_TEXT_CLASS}>{children}</span>
      </div>
    );
  };
}
