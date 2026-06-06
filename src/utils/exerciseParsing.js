import { decodeHtmlEntities } from "@/utils/htmlUtils";

/**
 * Shared sentence parser for fill-blank exercises.
 *
 * Authored exercise text embeds blanks inside square brackets, e.g.
 *   "Je [suis|*es|est] étudiant."   (choice: * marks the correct option)
 *   "Je [mange::type here] du pain." (input: expected::placeholder)
 *
 * This walks the string once and produces an ordered array of render segments:
 *   - text segments  → { key, type: "text", value }  (HTML entities decoded)
 *   - blank segments → produced by the supplied `parseBlank` callback
 *
 * The skeleton owns the parts every exercise shares (regex walk, text slicing,
 * entity decoding, tail handling, blank-index bookkeeping). Each exercise
 * supplies only `parseBlank`, which decides what a blank means for it and what
 * metadata to record.
 *
 * @param {string} text - Authored sentence containing `[...]` blanks.
 * @param {object} opts
 * @param {number} [opts.startBlankIndex=0] - First blank index (lets callers
 *   continue numbering across multiple sentences in one exercise).
 * @param {Array}  [opts.blanksMeta] - Optional array the parser writes each
 *   blank's metadata into at its blankIndex (mutated in place when provided).
 * @param {(rawInner: string, blankIndex: number) => {meta: any, segment: object}} opts.parseBlank
 *   Per-blank handler. Receives the raw text inside the brackets and the current
 *   blank index; returns the metadata to store and the render segment to emit.
 * @returns {{ segments: object[], nextBlankIndex: number }}
 */
export function parseSentence(text, { startBlankIndex = 0, blanksMeta, parseBlank } = {}) {
  const segments = [];
  const regex = /\[([^\]]+)\]/g;
  let blankIndex = startBlankIndex;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        key: `text-${blankIndex}-${lastIndex}`,
        type: "text",
        value: decodeHtmlEntities(text.slice(lastIndex, match.index)),
      });
    }

    const { meta, segment } = parseBlank(match[1], blankIndex);
    if (blanksMeta) blanksMeta[blankIndex] = meta;
    segments.push(segment);

    blankIndex += 1;
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      key: `tail-${blankIndex}-${lastIndex}`,
      type: "text",
      value: decodeHtmlEntities(text.slice(lastIndex)),
    });
  }

  return { segments, nextBlankIndex: blankIndex };
}

/**
 * Blank handler for multiple-choice blanks: `[suis|*es|est]`.
 * The `*`-prefixed option is the winner. Options are trimmed and entity-decoded.
 *
 * @returns {{ meta: { options: string[], winner: number }, segment: object }}
 */
export function parseChoiceBlank(rawInner, blankIndex) {
  const options = rawInner.split("|").map((opt) => opt.trim());
  const winner = options.findIndex((opt) => opt.startsWith("*"));
  const cleanOptions = options.map((opt) =>
    decodeHtmlEntities(opt.startsWith("*") ? opt.substring(1) : opt)
  );

  return {
    meta: { options: cleanOptions, winner },
    segment: { blankIndex, key: `choice-${blankIndex}`, type: "choice" },
  };
}

/**
 * Blank handler for typed-answer blanks: `[expected::placeholder]`.
 * The raw token is entity-decoded before the `::` split. Width is the expected
 * length (min 6) plus 2 characters of padding.
 *
 * @returns {{ meta: { expected: string, placeholder: string, widthCh: number }, segment: object }}
 */
export function parseInputBlank(rawInner, blankIndex) {
  const rawToken = decodeHtmlEntities(rawInner.trim());
  const [rawExpected, rawPlaceholder] = rawToken.split("::");
  const expected = (rawExpected || "").trim();
  const placeholder = (rawPlaceholder || "").trim();

  return {
    meta: { expected, placeholder, widthCh: Math.max(expected.length, 6) + 2 },
    segment: { blankIndex, key: `input-${blankIndex}`, type: "input" },
  };
}
