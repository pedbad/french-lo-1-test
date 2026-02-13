const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export const captureFlipPositions = (ids = [], getElement = () => null) => {
	const before = new Map();
	ids.forEach((id) => {
		const element = getElement(id);
		if (!element) return;
		before.set(id, element.getBoundingClientRect());
	});
	return before;
};

export const playFlipAnimation = ({
	before = new Map(),
	duration = 360,
	easing = DEFAULT_EASING,
	fromOpacity,
	getElement = () => null,
	ids = [],
	stagger = 0,
	toOpacity = 1,
}) => {
	if (typeof window === "undefined") return;
	if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

	requestAnimationFrame(() => {
		ids.forEach((id, index) => {
			const element = getElement(id);
			const first = before.get(id);
			if (!element || !first) return;

			const last = element.getBoundingClientRect();
			const dx = first.left - last.left;
			const dy = first.top - last.top;
			if (dx === 0 && dy === 0) return;

			const fromFrame = { transform: `translate(${dx}px, ${dy}px)` };
			const toFrame = { transform: "translate(0, 0)" };
			if (typeof fromOpacity === "number") fromFrame.opacity = fromOpacity;
			if (typeof toOpacity === "number") toFrame.opacity = toOpacity;

			element.animate(
				[fromFrame, toFrame],
				{
					delay: stagger > 0 ? index * stagger : 0,
					duration,
					easing,
				}
			);
		});
	});
};

