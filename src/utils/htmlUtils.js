/**
 * Decodes HTML entities in a string and returns plain text.
 *
 * Exercise data is authored in JSON/config files where special characters are
 * stored as HTML entities — e.g. "l&apos;école", "&eacute;l&egrave;ve", "a &lt; b".
 * Before comparing user answers or rendering text these entities must be resolved
 * to their real Unicode characters.
 *
 * Strategy:
 *  1. Fast-path  — no "&" in the string means no entities; return immediately.
 *  2. SSR path   — document is unavailable (server-side render / test env);
 *                  manually replace the most common entity (&apos;) only.
 *  3. Browser    — create an off-screen <textarea>, assign the encoded string to
 *                  innerHTML, then read .value. The browser's HTML parser decodes
 *                  all named, decimal, and hex entities in one pass with no
 *                  third-party dependency.
 *
 * @param {string} value - Raw string that may contain HTML entities.
 * @returns {string} Plain-text string with all entities resolved.
 *
 * @example
 * decodeHtmlEntities("l&apos;école")  // → "l'école"
 * decodeHtmlEntities("&lt;b&gt;")     // → "<b>"
 * decodeHtmlEntities("no entities")   // → "no entities"  (fast-path, no DOM)
 */
export const decodeHtmlEntities = (value = "") => {
  const text = `${value}`;

  // Fast-path: nothing to decode.
  if (!text.includes("&")) return text;

  // SSR / non-browser environment — handle the one entity that appears most
  // often in French language content (&apos; in contractions like l'école).
  if (typeof document === "undefined") {
    return text.replaceAll("&apos;", "'");
  }

  // Browser: delegate to the HTML parser via an off-screen textarea.
  // This covers all named entities (&eacute; → é), decimal (&#233; → é),
  // and hex (&#xE9; → é) without any regex maintenance burden.
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
