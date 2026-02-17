import React from "react";

export const InstructionCallout = ({
	children,
	className = "",
}) => {
	if (!children) return null;

	return (
		<div className={`instructions instruction-callout ${className}`.trim()}>
			<div className="instruction-callout-content">{children}</div>
		</div>
	);
};
