import { injectAudioCueIntoHTML } from "../instructionCues";

// Shared instruction typography helpers. Kept in a non-component module so the
// component files (instructions-media.jsx, Section.jsx, HeroSection.jsx) can
// export only components and stay react-refresh / Fast Refresh friendly.

export const INSTRUCTION_TEXT_CLASS = "text-lg leading-[var(--line-height-body)] [&_p]:!text-lg [&_p]:!leading-[var(--line-height-body)] [&_li]:!text-lg [&_li]:!leading-[var(--line-height-body)]";

export const applyInstructionTypographyToHTML = (html) => {
  if (typeof DOMParser === "undefined") {
    return html;
  }
  const htmlWithCue = injectAudioCueIntoHTML(html);
  const doc = new DOMParser().parseFromString(htmlWithCue, "text/html");
  doc.querySelectorAll("p").forEach((node) => {
    const replacement = doc.createElement("div");
    Array.from(node.attributes).forEach((attr) => {
      replacement.setAttribute(attr.name, attr.value);
    });
    replacement.innerHTML = node.innerHTML;
    node.replaceWith(replacement);
  });
  doc.querySelectorAll("div, li").forEach((node) => {
    node.style.fontSize = "var(--font-size-lg)";
    node.style.lineHeight = "var(--line-height-body)";
  });
  return doc.body.innerHTML;
};
