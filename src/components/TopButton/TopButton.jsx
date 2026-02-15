import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';

const VISIBILITY_OFFSET = 120;

const getScrollTop = () => {
	const scrollingElement = document.scrollingElement || document.documentElement;
	return Math.max(window.scrollY || 0, scrollingElement ? scrollingElement.scrollTop : 0);
};

export function TopButton() {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const topAnchor = document.querySelector("main h1, h1");
		let observer = null;
		const updateVisibility = () => {
			const scrollTop = getScrollTop();
			const anchorBottom = topAnchor ? topAnchor.getBoundingClientRect().bottom : Number.POSITIVE_INFINITY;
			setShowButton(scrollTop > VISIBILITY_OFFSET || anchorBottom < 0);
		};

		updateVisibility();

		if (topAnchor && "IntersectionObserver" in window) {
			observer = new IntersectionObserver(
				([entry]) => {
					const scrollTop = getScrollTop();
					setShowButton(scrollTop > VISIBILITY_OFFSET || !entry.isIntersecting);
				},
				{
					root: null,
					threshold: 0,
					rootMargin: `-${VISIBILITY_OFFSET}px 0px 0px 0px`,
				}
			);
			observer.observe(topAnchor);
		}

		window.addEventListener("scroll", updateVisibility, { passive: true });
		window.addEventListener("resize", updateVisibility);
		document.addEventListener("scroll", updateVisibility, true);

		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener("scroll", updateVisibility);
			window.removeEventListener("resize", updateVisibility);
			document.removeEventListener("scroll", updateVisibility, true);
		};
	}, []);

	return (
		<div
			className={`top-button-container flex justify-end overflow-hidden transition-all duration-300 ${showButton ? "mt-3 max-h-10 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
		>
			<Button
				aria-label="Back to top"
				className="cursor-pointer rounded-full transition-all duration-200 hover:-translate-y-0.5"
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
}
