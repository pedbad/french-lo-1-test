import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from 'react';

export function TopButton() {
	const containerRef = useRef(null);
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const node = containerRef.current;
		if (!node) return undefined;

		if (!("IntersectionObserver" in window)) {
			setShowButton(true);
			return undefined;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowButton(entry.isIntersecting);
			},
			{
				root: null,
				threshold: 0.15,
				rootMargin: "0px 0px -8% 0px",
			}
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="top-button-container mt-3 flex justify-end"
		>
			<Button
				aria-label="Back to top"
				className={`cursor-pointer rounded-full transition-all ease-out hover:-translate-y-0.5 ${showButton ? "opacity-100 translate-y-0 duration-[1200ms]" : "pointer-events-none opacity-0 translate-y-1 duration-300"}`}
				size="icon"
				tabIndex={showButton ? 0 : -1}
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
}
