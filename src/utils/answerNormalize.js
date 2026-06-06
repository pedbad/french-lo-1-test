/**
 * Shared answer-normalization helpers for fill-in / dictation exercises.
 *
 * Two levels, by design:
 *  - normalizeAnswer      — "light": fold apostrophe variants, collapse whitespace, trim.
 *                           Used where punctuation IS significant to the answer.
 *  - normalizeForDictation — "full": light + treat sentence punctuation and quote
 *                           marks as insignificant (replaced with spaces, then collapsed).
 *
 * Both NFC-normalize but NEVER strip accents — French grading is accent-sensitive
 * (é ≠ e), so accents are preserved intentionally.
 */

/**
 * Light normalize: apostrophe variants → "'", whitespace collapsed, trimmed.
 * @param {string} value
 * @returns {string}
 */
export const normalizeAnswer = (value = "") => {
  return `${value}`
    .normalize("NFC")
    // Fold curly/back/acute apostrophe variants to a straight apostrophe.
    .replace(/[’`´ʻʼ]/g, "'")
    // Collapse runs of whitespace.
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Full normalize for dictation comparison: everything normalizeAnswer does, plus
 * sentence punctuation and quotation marks replaced with spaces so they don't
 * affect equality. Accents remain strict.
 * @param {string} text
 * @returns {string}
 */
export const normalizeForDictation = (text = "") => {
  return `${text}`
    .normalize("NFC")
    .replace(/[’`´ʻʼ]/g, "'")
    // Ignore trivial sentence punctuation differences.
    .replace(/[.,!?;:…]/g, " ")
    // Ignore quotation-mark differences (guillemets + curly quotes).
    .replace(/[«»“”„"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
