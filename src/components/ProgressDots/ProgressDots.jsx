import React from "react";

export const ProgressDots = ({ correct = 0, total = 0 }) => {
	const safeTotal = Math.max(0, Number(total) || 0);
	const safeCorrect = Math.min(safeTotal, Math.max(0, Number(correct) || 0));

	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
				{Array.from({ length: safeTotal }).map((_, index) => {
					const filled = index < safeCorrect;
					return (
						<span
							key={`progress-dot-${index}`}
							className={`h-[1.125rem] w-[1.125rem] sm:h-[1.5rem] sm:w-[1.5rem] rounded-full border ${
								filled
									? "bg-[var(--chart-2)] border-[var(--chart-2)]"
									: "bg-transparent border-[color-mix(in_oklab,var(--foreground)_35%,transparent)]"
							}`}
							aria-hidden="true"
						/>
					);
				})}
			</div>
			<p className="m-0" aria-live="polite">{safeCorrect} correct out of {safeTotal}</p>
		</div>
	);
};
