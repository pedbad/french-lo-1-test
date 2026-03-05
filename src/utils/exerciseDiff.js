import { resolveAsset } from './assets';

const renderTextAsPlainSpans = (text = '') =>
	`${text}`.split('').map((char) => `<span>${char}</span>`).join('');

const normalizeForDictationCompare = (text = '') => {
	return `${text}`
		.normalize('NFC')
		// Normalize apostrophe variants to straight apostrophe.
		.replace(/[’`´ʻʼ]/g, "'")
		// Ignore trivial punctuation differences.
		.replace(/[.,!?;:…]/g, ' ')
		.replace(/[«»“”„"]/g, ' ')
		// Ignore duplicate/extra whitespace.
		.replace(/\s+/g, ' ')
		.trim();
};

export const highlightTextDiff = (a, b, countCorrect, sounds = false, options = {}) => {
	const m = a.length;
	const n = b.length;
	const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
	const correctAudio = new Audio(resolveAsset('/sounds/ting.mp3'));
	const errorAudio = new Audio(resolveAsset('/sounds/error.mp3'));
	const { comparisonMode = 'strict' } = options;

	// Dictation mode: accept answers that only differ by punctuation/apostrophe/spacing.
	// Accents remain strict by design (no accent stripping).
	if (comparisonMode === 'dictation') {
		const normalizedA = normalizeForDictationCompare(a);
		const normalizedB = normalizeForDictationCompare(b);
		if (normalizedA === normalizedB) {
			if (sounds) correctAudio.play();
			countCorrect();
			return renderTextAsPlainSpans(a);
		}
	}

	// Fill LCS table
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (a[i - 1] === b[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1] + 1;
			} else {
				dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
			}
		}
	}

	// Backtrack to build diff
	let i = m;
	let j = n;
	const result = [];
	let correct = true;
	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
			result.unshift(`<span>${a[i - 1]}</span>`);
			i -= 1;
			j -= 1;
		} else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
			result.unshift(`<span class='inserted'>${b[j - 1]}</span>`);
			correct = false;
			j -= 1;
		} else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
			result.unshift(`<span class='deleted'>${a[i - 1]}</span>`);
			correct = false;
			i -= 1;
		}
	}
	if (correct) {
		if (sounds) correctAudio.play();
		countCorrect();
	} else {
		if (sounds) errorAudio.play();
	}

	return result.join('');
};
