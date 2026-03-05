export const isTouchChrome = () => {
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	const ua = navigator.userAgent;
	const { vendor } = navigator;

	const isChrome = /Chrome/.test(ua) && /Google Inc/.test(vendor);
	const isEdge = /Edg\//.test(ua); // Detect Edge explicitly

	return isTouchDevice && isChrome && !isEdge;
};
