import React from "react";
import { resolveAsset } from "@/utils/assets";

const TORTOISE_ICON_BASE_CLASS =
	"h-[1.5rem] w-[1.5rem] min-[420px]:h-[1.625rem] min-[420px]:w-[1.625rem] sm:h-[2.25rem] sm:w-[2.25rem]";

const TortoiseProgressIcon = ({ filled, iconSrc, index, shouldDance, instanceId }) => {
	const filterId = `progress-tortoise-${instanceId}-${filled ? "filled" : "outline"}-${index}`;
	const danceClasses = shouldDance
		? " motion-safe:animate-[progress-tortoise-dance_3s_ease-in-out_1_both] motion-safe:will-change-transform motion-reduce:animate-none"
		: "";

	return (
		<svg
			aria-hidden="true"
			className={`${TORTOISE_ICON_BASE_CLASS} transition-opacity duration-[1500ms] ease-in-out${danceClasses}`}
			style={{
				color: "var(--ex-neutral)",
				opacity: filled ? 1 : 0.35,
				transformOrigin: "50% 65%",
			}}
			viewBox="0 0 19 19"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				{filled ? (
					<filter id={filterId}>
						<feFlood floodColor="currentColor" result="fillColor" />
						<feComposite in="fillColor" in2="SourceAlpha" operator="in" result="filledShape" />
						<feMerge>
							<feMergeNode in="filledShape" />
						</feMerge>
					</filter>
				) : (
					<filter id={filterId}>
						<feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="outer" />
						<feComposite in="outer" in2="SourceAlpha" operator="xor" result="outline" />
						<feFlood floodColor="currentColor" result="strokeColor" />
						<feComposite in="strokeColor" in2="outline" operator="in" result="strokeOnly" />
						<feMerge>
							<feMergeNode in="strokeOnly" />
						</feMerge>
					</filter>
				)}
			</defs>
			<image
				filter={`url(#${filterId})`}
				height="19"
				href={iconSrc}
				preserveAspectRatio="xMidYMid meet"
				width="19"
			/>
		</svg>
	);
};

export const ProgressDots = ({ correct = 0, total = 0 }) => {
	const safeTotal = Math.max(0, Number(total) || 0);
	const safeCorrect = Math.min(safeTotal, Math.max(0, Number(correct) || 0));
	const shouldDance = safeTotal > 0 && safeCorrect === safeTotal;
	const tortoiseIcon = resolveAsset("img/common/custom-icons/tortoise.svg");
	const instanceId = React.useId().replace(/:/g, "");

	return (
		<div className="flex items-center gap-2">
			<div className="flex max-w-full flex-wrap items-center gap-1.5 min-[420px]:gap-2">
				{Array.from({ length: safeTotal }).map((_, index) => {
					const filled = index < safeCorrect;
					return (
						<span
							key={`progress-dot-${index}`}
							className="flex items-center justify-center"
							aria-hidden="true"
						>
							<TortoiseProgressIcon
								filled={filled}
								iconSrc={tortoiseIcon}
								index={index}
								instanceId={instanceId}
								shouldDance={shouldDance}
							/>
						</span>
					);
				})}
				<div
					className="m-0 ml-1 shrink-0 max-[380px]:basis-full max-[380px]:ml-0 max-[380px]:mt-1"
					role="status"
					aria-live="polite"
				>
					{safeCorrect} correct out of {safeTotal}
				</div>
			</div>
		</div>
	);
};
