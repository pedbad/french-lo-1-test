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
		style,
		...rest
	} = props;

	const isVertical = direction === "vertical";
	const Icon = isVertical ? ArrowUpDown : ArrowLeftRight;
	const isCompact = size === "compact";

	const layoutClass = isVertical
		? "h-12 w-full justify-start gap-3 px-3 text-left"
		: isCompact
			? "h-9 justify-center gap-1 px-2 text-center min-[1180px]:h-[3.2rem]"
			: "h-[3.2rem] justify-center gap-2 px-2 text-center";

	const iconClass = isVertical
		? "h-4 w-4"
		: isCompact
			? "h-3.5 w-3.5 min-[1180px]:h-4 min-[1180px]:w-4"
			: "h-4 w-4";

	const textClass = isVertical
		? "text-[0.98rem]"
		: isCompact
			? "text-[0.78rem] min-[1180px]:text-[0.98rem]"
			: "text-[0.98rem]";

	const stateClass = isDragging
		? "border-[rgb(var(--color-primary-400)_/_1)] bg-[rgb(var(--color-primary-300)_/_0.82)] opacity-95"
		: "border-[rgb(var(--color-primary-400)_/_0.92)] bg-[rgb(var(--color-primary-200)_/_0.78)] hover:border-[rgb(var(--color-primary-400)_/_1)] hover:bg-[rgb(var(--color-primary-300)_/_0.9)]";

	const targetClass = isDropTarget
		? "border-[var(--chart-5)] ring-2 ring-[color-mix(in_oklab,var(--chart-5)_58%,transparent)]"
		: "";

	const mergedStyle = isDropTarget
		? { backgroundColor: "color-mix(in oklab, var(--chart-5) 55%, var(--card))", ...style }
		: style;

	return (
		<button
			className={`group relative flex cursor-pointer items-center rounded-lg border transition ${layoutClass} ${stateClass} ${targetClass} ${className}`}
			ref={ref}
			style={mergedStyle}
			type="button"
			{...rest}
		>
			{showIndex ? (
				<span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[rgb(var(--color-primary-400)_/_0.45)] bg-[rgb(var(--color-primary-50)_/_0.8)] px-2 text-xs font-semibold text-[rgb(var(--color-text-secondary)_/_1)]">
					{slotLabel}
				</span>
			) : null}
			<Icon className={`${iconClass} text-[rgb(var(--color-primary-400)_/_0.95)] transition group-hover:text-[rgb(var(--color-primary-400)_/_1)]`} />
			<span className={`${textClass} font-semibold leading-tight text-[rgb(var(--color-text-primary)_/_1)]`}>
				{label}
			</span>
		</button>
	);
});

