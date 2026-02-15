import { Button } from "@/components/ui/button";
import React from 'react';

export class TopButton extends React.PureComponent {
	render = () => {
		return (
			<div className="top-button-container flex justify-end">
				<Button
					aria-label="Back to top"
					className="cursor-pointer rounded-full"
					size="icon"
					onClick={() => {
						scrollTo({ behavior: 'smooth', left: 0, top: 0 });
					}}
				>
					<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
						<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"></path>
					</svg>
				</Button>
			</div>
		);
	};
}
