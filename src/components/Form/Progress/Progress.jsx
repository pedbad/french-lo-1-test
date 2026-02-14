import React from 'react';

const PROGRESS_TEXT_CLASS = "leading-[140%]";
const PROGRESS_INDICATOR_BASE_CLASS = "progress-indicator fixed left-1/2 top-1/2 z-[1000] mt-[60px] h-[26px] w-[200px] -translate-x-1/2 overflow-visible bg-[var(--muted)]";
const PROGRESS_BAR_CLASS = "progress-bar relative my-[2px] mx-[1px] h-[calc(100%-5px)] overflow-hidden rounded-[4px] shadow-[1px_0_4px_color-mix(in_oklab,var(--foreground)_40%,transparent)] transition-[width] duration-1000";
const PROGRESS_BAR_SHINE_STYLE = {
	background: "linear-gradient(0deg, color-mix(in oklab, var(--foreground) 20%, transparent) 0%, transparent 30%, transparent 40%, color-mix(in oklab, var(--background) 50%, transparent) 70%, transparent 100%)",
};
const PROGRESS_LABEL_CLASS = "absolute top-0 h-full w-full text-center font-bold [text-shadow:-1px_-1px_0_var(--background),-1px_1px_0_var(--background),1px_1px_0_var(--background),1px_-1px_0_var(--background)]";

export class Progress extends React.PureComponent {
	render() {
		const {
			className = '',
			id,
			count,
			step,
		} = this.props;

		return (
			(step >= 0) ?
				<div
					className={`${className} ${PROGRESS_INDICATOR_BASE_CLASS}`}
					{...id ? { id: id } : {}}
				>
					<div
						className={PROGRESS_BAR_CLASS}
						style={{ width: `${step * 100 / count}%` }} >
						<div className="progress-bar-background absolute left-0 top-0 h-full w-full" />
						<div className="absolute left-0 top-0 h-full w-full" style={PROGRESS_BAR_SHINE_STYLE} />
					</div>
					<span className={`${PROGRESS_LABEL_CLASS} ${PROGRESS_TEXT_CLASS}`}>{`${(step * 100 / count).toFixed(1)}%`}</span>
				</div > : null
		);
	}
}
