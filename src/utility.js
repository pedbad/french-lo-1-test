export { resolveAsset, resolveAssetHTML } from './utils/assets';
export { handleResponse, handleResponseCSV, handleResponseText } from './utils/network';
export { scrollToElement, handleModalLinkClick } from './utils/dom';
export { trackFloatingAudio, stopAllAudioPlayback, playAudioLink } from './utils/audioPlayback';
export { highlightTextDiff } from './utils/exerciseDiff';
export { copyObject, shuffleArray } from './utils/collections';
export { isTouchChrome } from './utils/device';
export { speak } from './utils/speech';

export const initialViewOffset = 24; // To reveal edge of card table

export const addNonDuplicateHeaders = (dataSet, headers) => {
	const flatHeaders = dataSet.headers.map((header) => JSON.stringify(header));
	headers.forEach((header) => {
		const flatHeader = JSON.stringify(header);
		const foundIndex = flatHeaders.indexOf(flatHeader);
		if (foundIndex === -1) dataSet.headers.push(header);
	});
};

export const appendScript = (scriptToAppend, DOMnode, callback) => {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.src = scriptToAppend;
	DOMnode.appendChild(script);
	script.onload = () => callback;
};

export const arrayIncludesObject = (seeking, arrayToSearch) => {
	// For an array of objects, checks if it includes the object in question
	return arrayToSearch.some((element) => {
		return JSON.stringify(seeking) === JSON.stringify(element);
	});
};

export const base64ToBlob = (base64String, contentType = '') => {
	const byteCharacters = atob(base64String);
	const byteArrays = [];

	for (let i = 0; i < byteCharacters.length; i += 1) {
		byteArrays.push(byteCharacters.charCodeAt(i));
	}

	const byteArray = new Uint8Array(byteArrays);
	return new Blob([byteArray], { type: contentType });
};

export const clearCanvas = (canvas) => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
};

export const getCardById = (id, dataSet) => {
	// Note - card - any card including stacked card or 'stack'
	const { rows: molecules = [], stacks = [] } = dataSet;
	const stack = stacks.find((item) => {
		return item.id === `${id}`;
	});
	if (stack) return stack;
	const molecule = molecules.find((item) => {
		return item.id === `${id}`;
	});
	return molecule;
};

export const getHighAndLow = (s1, s2) => {
	if (s1 < s2) return { high: s2, low: s1 };
	return { high: s1, low: s2 };
};

export const getMoleculeById = (id, dataSet) => {
	// Molecules only, no stacks
	const { rows } = dataSet;
	return rows.find((item) => {
		return item.id === id;
	});
};

export const getStackSelectedCount = (stack, molecules) => {
	let nMolecules = 0;
	let nSelected = 0;
	const { molecules: stackMolecules } = stack;
	stackMolecules.map((moleculeId) => {
		const { 0: m } = molecules.filter((item) => moleculeId === item.id);
		if (m) {
			nMolecules += 1;
			if (m.selected) nSelected += 1;
		}
		return false;
	});
	return (100 * nSelected) / nMolecules;
};

export const isAlphaNumeric = (str) => {
	let code;
	let i;
	let len;

	for (i = 0, len = str.length; i < len; i += 1) {
		code = str.charCodeAt(i);
		if (
			!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123) && // lower alpha (a-z)
			!(code === 95 || code === 45)
		) {
			return false;
		}
	}
	return true;
};

export const replaceSelectWithSpan = (selectElement) => {
	const selectedText = selectElement.options[selectElement.selectedIndex].text;
	const span = document.createElement('span');
	span.textContent = selectedText;
	selectElement.classList.forEach((cls) => span.classList.add(cls));

	// Replace the <select> in the DOM
	selectElement.parentNode.replaceChild(span, selectElement);
};

export const titleCase = (str) => {
	const splitStr = str.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i += 1) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
};

export const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> c) / 4)).toString(16),
	);
};
