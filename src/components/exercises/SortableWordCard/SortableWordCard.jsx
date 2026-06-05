import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import React from "react";

export const SortableWordCard = React.forwardRef(function SortableWordCard(props, ref) {
  const {
    className = "",
    direction = "horizontal",
    isDragging = false,
    isDropTarget = false,
    label = "",
    showIndex = false,
    size = "default",
    slotLabel = "",
    stacked = false,
    style,
    ...rest
  } = props;

  const isVertical = direction === "vertical";
  const Icon = isVertical ? ArrowUpDown : ArrowLeftRight;
  const isCompact = size === "compact";

  const isSquare = size === "square";

  const layoutClass = stacked
    ? isSquare
      ? "aspect-square min-h-[5rem] w-full flex-col justify-center gap-1 px-2 py-2 text-center min-[1400px]:min-h-[6.2rem]"
      : "min-h-[5.2rem] w-full flex-col justify-center gap-1 px-2 py-2 text-center"
    : isVertical
      ? "h-12 w-full justify-start gap-3 px-3 text-left"
      : isCompact
        ? "h-9 justify-center gap-1 px-2 text-center min-[1400px]:h-[3.2rem]"
        : "h-[3.2rem] justify-center gap-2 px-2 text-center";

  const iconClass = stacked
    ? "h-3.5 w-3.5"
    : isVertical
      ? "h-4 w-4"
      : isCompact
        ? "h-3.5 w-3.5 min-[1400px]:h-4 min-[1400px]:w-4"
        : "h-4 w-4";

  const textClass = stacked
    ? "text-[length:calc(var(--font-size-sm)*0.92)] min-[1400px]:text-[length:calc(var(--font-size-sm)*1.08)]"
    : isVertical
      ? "text-[length:calc(var(--font-size-sm)*0.98)]"
      : isCompact
        ? "text-[length:calc(var(--font-size-sm)*0.78)] min-[1400px]:text-[length:calc(var(--font-size-sm)*0.98)]"
        : "text-[length:calc(var(--font-size-sm)*0.98)]";

  const stateClass = isDragging
    ? "border-[var(--brand-primary)] bg-[color-mix(in_oklab,var(--brand-primary)_55%,var(--card))] opacity-95"
    : "border-[oklch(from_var(--brand-primary)_l_c_h_/_0.92)] bg-[color-mix(in_oklab,var(--brand-primary)_30%,var(--card))] hover:border-[var(--brand-primary)] hover:bg-[color-mix(in_oklab,var(--brand-primary)_55%,var(--card))]";
  const shadowClass = isDragging
    ? "shadow-none"
    : stacked
      ? "shadow-[0_6px_14px_color-mix(in_oklab,var(--ex-neutral)_20%,transparent)] hover:shadow-[0_10px_22px_color-mix(in_oklab,var(--ex-neutral)_28%,transparent)]"
      : "shadow-[0_2px_6px_color-mix(in_oklab,var(--ex-neutral)_14%,transparent)] hover:shadow-[0_4px_10px_color-mix(in_oklab,var(--ex-neutral)_22%,transparent)]";
  const cursorClass = isDragging ? "cursor-grabbing" : "cursor-pointer active:cursor-grabbing";

  const targetClass = isDropTarget
    ? "border-[var(--ex-active)] ring-2 ring-[color-mix(in_oklab,var(--ex-active)_58%,transparent)]"
    : "";

  const mergedStyle = isDropTarget
    ? { backgroundColor: "color-mix(in oklab, var(--ex-active) 55%, var(--card))", ...style }
    : style;

  return (
    <button
      className={`group relative flex items-center rounded-lg border transition-[background-color,border-color,box-shadow] duration-200 ${layoutClass} ${stateClass} ${shadowClass} ${cursorClass} ${targetClass} ${className}`}
      ref={ref}
      style={mergedStyle}
      type="button"
      {...rest}
    >
      {showIndex ? (
        <span className={`inline-flex items-center justify-center rounded-full border border-[oklch(from_var(--brand-primary)_l_c_h_/_0.45)] bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] font-semibold text-[var(--muted-foreground)] ${stacked ? "absolute left-1.5 top-1.5 h-5 min-w-5 px-1 text-[length:calc(var(--font-size-sm)*0.68)] min-[1400px]:h-6 min-[1400px]:min-w-6 min-[1400px]:text-[length:calc(var(--font-size-sm)*0.72)]" : "h-7 min-w-7 px-2 text-xs"}`}>
          {slotLabel}
        </span>
      ) : null}
      {stacked ? (
        <>
          <span className={`${textClass} font-semibold leading-tight text-[var(--foreground)]`}>
            {label}
          </span>
          <Icon className={`${iconClass} text-[oklch(from_var(--brand-primary)_l_c_h_/_0.95)] transition group-hover:text-[var(--brand-primary)]`} />
        </>
      ) : (
        <>
          <Icon className={`${iconClass} text-[oklch(from_var(--brand-primary)_l_c_h_/_0.95)] transition group-hover:text-[var(--brand-primary)]`} />
          <span className={`${textClass} font-semibold leading-tight text-[var(--foreground)]`}>
            {label}
          </span>
        </>
      )}
    </button>
  );
});
