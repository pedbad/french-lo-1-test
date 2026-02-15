import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';

const TOP_SENTINEL_ID = "top-scroll-sentinel";

const ensureTopSentinel = () => {
	let sentinel = document.getElementById(TOP_SENTINEL_ID);
	if (sentinel) return sentinel;

	sentinel = document.createElement("div");
	sentinel.id = TOP_SENTINEL_ID;
	sentinel.setAttribute("aria-hidden", "true");
	sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;";
	document.body.prepend(sentinel);

	return sentinel;
};

export function TopButton() {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const sentinel = ensureTopSentinel();

		if (!("IntersectionObserver" in window)) {
			const updateFromScroll = () => setShowButton(window.scrollY > 120);
			updateFromScroll();
			window.addEventListener("scroll", updateFromScroll, { passive: true });
			return () => window.removeEventListener("scroll", updateFromScroll);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				// Show button once top sentinel has moved out of view.
				setShowButton(!entry.isIntersecting);
			},
			{
				root: null,
				threshold: 0,
				rootMargin: "-96px 0px 0px 0px",
			}
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
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
