import { cn } from "@/lib/utils";
import {
	Info,
} from '../..';
import React from 'react';

export class RadioC extends React.PureComponent {

	render() {
		const {
			className = '',
			disabled:allDisabled = false,
			diskRight = true,
			error = '',
			handleChange,
			id,
			info,
			label = '',
			radios = [],
			sameRow = false,
			title,
			value,
		} = this.props;

		const sameRowColumns = sameRow ? Math.max(1, radios.length + (label ? 1 : 0)) : 1;
		const sameRowContainerStyle = sameRow ? {
			gridTemplateColumns: `repeat(${sameRowColumns}, minmax(0, 1fr))`,
		} : undefined;

		const renderedRadios = [];
		radios.forEach((radio, i) => {
			let { disabled = false } = radio;
			if (allDisabled) disabled = true;
			const checked = radio.value === value;
			renderedRadios.push(
				<button
					aria-pressed={checked}
					className={cn(
						"radio rounded-md border border-transparent px-2 py-1 text-left transition-colors",
						"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
						sameRow ? "flex items-center justify-center gap-2" : "flex items-center justify-between gap-3",
						!diskRight && "flex-row-reverse justify-end",
						checked && "bg-[color-mix(in_oklab,var(--chart-2)_16%,transparent)]",
						disabled && "cursor-not-allowed opacity-60"
					)}
					disabled={disabled}
					type="button"
					key={`${id}${i}`}
					onClick={() => {
						if (!disabled) handleChange(id, radio.value);
					}}
				>
					<span className="text-sm">{`${radio.name}:`}</span>
					<div
						className={cn(
							"radio-device flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--foreground)]",
							disabled && "border-[var(--muted-foreground)]"
						)}
						{...title ? { title: title } : {}}
					>
						{checked ? (
							<span
								className={cn(
									"h-2.5 w-2.5 rounded-full bg-[var(--foreground)]",
									disabled && "bg-[var(--muted-foreground)]"
								)}
							/>
						) : null}
					</div>
				</button>
			);
		});

		return (
			<div
				className={cn(
					"radio-container",
					sameRow ? "grid items-center gap-4 overflow-y-hidden transition-[padding,max-height] duration-500" : "grid grid-cols-1 gap-1",
					sameRow && !error && "max-h-[50px]",
					className
				)}
				style={sameRowContainerStyle}

				{...id ? { id: id } : {}}

			>
				{label ? (
					<label className={cn("inline-flex items-center gap-2 px-1 text-sm font-medium", sameRow ? "py-0" : "py-1")}>
						{`${label}:`}
						{info ? (
							<Info
								infoTitle={info.title}
								infoMessage={info.message}
							/>
						) : null}
					</label>
				) : null}
				{renderedRadios}
				{error !== '' ? (
					<div
						className="error text-sm text-[var(--destructive)]"
						style={sameRow ? { gridColumn: `1 / ${sameRowColumns + 1}` } : undefined}
					>
						{error}
					</div>
				) : null}
			</div>
		);
	}
}
