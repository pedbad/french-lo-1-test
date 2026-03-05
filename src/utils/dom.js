let programmaticScrollTimeout;

export const scrollToElement = (element) => {
	if (!element) return;

	const mainMenu = document.getElementById('mainMenu');
	if (!mainMenu) return;

	// Start with the full mainMenu height (works correctly on desktop).
	let mainMenuHeight = mainMenu.offsetHeight;

	// If the mobile dropdown is open, subtract its height to keep only fixed header offset.
	const mobileMenu = mainMenu.querySelector('.mobile-menu');
	if (mobileMenu && mobileMenu.offsetHeight > 0) {
		mainMenuHeight -= mobileMenu.offsetHeight;
	}

	const rect = element.getBoundingClientRect();
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

	const extraOffset = 16;
	const top = Math.max(0, rect.top + scrollTop - mainMenuHeight - extraOffset);
	const left = rect.left + scrollLeft;

	window.__programmaticScroll = true;
	if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);

	window.scrollTo({
		behavior: 'smooth',
		left,
		top,
	});

	programmaticScrollTimeout = setTimeout(() => {
		window.__programmaticScroll = false;
	}, 2000);
};

export const handleModalLinkClick = (e, options = {}) => {
	e.preventDefault();

	const linkEl =
		options.linkEl ||
		(e.currentTarget instanceof Element ? e.currentTarget : null) ||
		(e.target instanceof Element ? e.target.closest('a[href]') : null);
	if (!linkEl) return;
	const href = linkEl.getAttribute('href') || '';
	const explicitTarget = (linkEl.getAttribute('data-modal-target') || '').trim();

	const rawAfterHash = href.split('#').pop() || '';
	const parsedTarget = rawAfterHash.replace(/^[.#]+/, '').trim();
	const targetId = explicitTarget || parsedTarget;
	if (!targetId) return;

	const { mode = 'modal', findModalLinkContent, showModalLinkDialog } = options;

	if (mode === 'scroll') {
		const targetEl =
			document.getElementById(`${targetId}-heading`) ||
			document.getElementById(targetId) ||
			document.querySelector(`.modal-link-target[data-modal-target="${targetId}"]`);
		if (targetEl) scrollToElement(targetEl);
		return;
	}

	if (
		typeof findModalLinkContent !== 'function' ||
		typeof showModalLinkDialog !== 'function'
	) {
		return;
	}

	const { title, contentHTML, content } = findModalLinkContent(targetId);
	showModalLinkDialog(title, contentHTML, content);
};
