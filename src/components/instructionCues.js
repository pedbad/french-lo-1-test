const AUDIO_CUE_PATTERN = /\b(audio\s+clips?|listen|audio)\b/i;
const INLINE_AUDIO_CUE_HTML = '<svg class="inline-audio-svg" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';

const stripTags = (value = "") => value.replace(/<[^>]*>/g, " ");

export const instructionMentionsAudio = (value = "") => {
  if (typeof value !== "string") return false;
  return AUDIO_CUE_PATTERN.test(stripTags(value));
};

export const splitTextByAudioCueKeyword = (value = "") => {
  if (typeof value !== "string") return null;
  const match = value.match(AUDIO_CUE_PATTERN);
  if (!match || typeof match.index !== "number") return null;
  const [keyword] = match;
  const keywordStart = match.index;
  const keywordEnd = keywordStart + keyword.length;
  return {
    before: value.slice(0, keywordStart),
    keyword,
    after: value.slice(keywordEnd),
  };
};

export const injectAudioCueIntoHTML = (rawHtml = "") => {
  if (typeof rawHtml !== "string" || !rawHtml.trim()) return rawHtml;
  if (rawHtml.includes("inline-audio-svg")) return rawHtml;
  if (!instructionMentionsAudio(rawHtml)) return rawHtml;

  if (typeof DOMParser === "undefined") {
    return rawHtml.replace(AUDIO_CUE_PATTERN, `$& ${INLINE_AUDIO_CUE_HTML}`);
  }

  const doc = new DOMParser().parseFromString(rawHtml, "text/html");
  if (doc.querySelector(".inline-audio-svg")) return rawHtml;

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node.nodeValue || "";
    const split = splitTextByAudioCueKeyword(text);
    if (split) {
      const parent = node.parentNode;
      if (!parent) return rawHtml;

      if (split.before) parent.insertBefore(doc.createTextNode(split.before), node);
      const cueContainer = doc.createElement("span");
      cueContainer.innerHTML = INLINE_AUDIO_CUE_HTML.trim();
      const cue = cueContainer.firstElementChild;
      if (!cue) return rawHtml;
      parent.insertBefore(doc.createTextNode(`${split.keyword} `), node);
      parent.insertBefore(cue, node);
      if (split.after) parent.insertBefore(doc.createTextNode(split.after), node);
      parent.removeChild(node);
      return doc.body.innerHTML;
    }
    node = walker.nextNode();
  }

  return rawHtml;
};
