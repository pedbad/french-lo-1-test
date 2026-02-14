import { Button } from "@/components/ui/button";
import React from 'react';

/**
 * IconButton renders a themed icon button using the shadcn Button component.
 * Props:
 * - children: optional label/content
 * - className: extra classes
 * - id: DOM id
 * - onClick: click handler
 * - size: forwarded to the Button
 * - theme: which icon to render (back | reset | eye | shuffle | natural | alphabetic | reverse | sun | moon)
 * - title: native tooltip title (avoid when using shadcn Tooltip)
 * - ariaLabel: accessibility label for icon-only buttons
 * - variant: OPTIONAL shadcn button variant (e.g. "ghost")
 *
 * If `variant` is omitted, the underlying Button uses its default variant,
 * so existing buttons (like Reset) keep their current appearance.
 */
export class IconButton extends React.PureComponent {
	render = () => {
		const {
			children,
			className,
			id,
			onClick,
			size,
			theme = 'none',
			title,
			ariaLabel,
			variant, // ✅ optional variant, does NOT change defaults elsewhere
		} = this.props;

		let svgContent;
		let extraClasses = '';

		switch (theme) {
			case 'back': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m12 8-4 4 4 4" />
						<path d="M16 12H8" />
					</svg>
				);
				break;
			}
			case 'reset': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						stroke="currentColor"
					>
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
						<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
						<path d="M16 16h5v5" />
					</svg>
				);
				// extraClasses = 'w-full';
				break;
			}
			case 'eye': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
						<circle cx="12" cy="12" r="3"></circle>
					</svg>
				);
				// extraClasses = 'w-full';
				break;
			}
			case 'shuffle': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m18 14 4 4-4 4"></path>
						<path d="m18 2 4 4-4 4"></path>
						<path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"></path>
						<path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"></path>
						<path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"></path>
					</svg>
				);
				// extraClasses = 'w-full';
				break;
			}
			case 'natural': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m12 2 10 5-10 5L2 7Z" />
						<path d="m2 17 10 5 10-5" />
						<path d="m2 12 10 5 10-5" />
					</svg>
				);
				break;
			}
			case 'pause': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 5.518 5.518"
						// fill="currentColor"
					>
						<path
							d="M95.811 120.052h1.129v4.015h-1.129zM98.012 120.052h1.129v4.015h-1.129z"
						/>
					</svg>
				);
				break;
			}
			case 'play': {
				svgContent = (
					<svg xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 5.518 5.518"
						// fill="currentColor"
					>
						<path
							d="m98.604 119.736-2.252 1.3-2.252 1.3v-5.2l2.252 1.3z"/>
					</svg>
				);
				break;
			}
			case 'alphabetic': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m3 16 4 4 4-4" />
						<path d="M7 20V4" />
						<path d="M20 8h-5" />
						<path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
						<path d="M15 14h5l-5 6h5" />
					</svg>
				);
				break;
			}
			case 'reverse': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m3 8 4-4 4 4" />
						<path d="M7 4v16" />
						<path d="M20 8h-5" />
						<path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
						<path d="M15 14h5l-5 6h5" />
					</svg>
				);
				break;
			}
			case 'sun': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="4" />
						<line x1="12" y1="2" x2="12" y2="4" />
						<line x1="12" y1="20" x2="12" y2="22" />
						<line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
						<line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
						<line x1="2" y1="12" x2="4" y2="12" />
						<line x1="20" y1="12" x2="22" y2="12" />
						<line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
						<line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
					</svg>
				);
				extraClasses = 'rounded-full cursor-pointer';
				break;
			}
			case 'moon': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				);
				extraClasses = 'rounded-full cursor-pointer';
				break;
			}
			case 'question': {
				svgContent = (
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24" fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
				);
				break;
			}
			case 'check': {
				svgContent = (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
				);
				break;
			}
			default: {
				break;
			}
		}

		return (
			<Button
				id={id || undefined}
				size={size}
				variant={variant} // ✅ only affects places where you explicitly pass it
				className={`icon-button cursor-pointer [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current ${className ? className : ''} ${extraClasses}`}
				onClick={onClick}
				title={title}
				aria-label={ariaLabel || title}
			>
				{svgContent}
				{children}
			</Button>
		);
	};
}
