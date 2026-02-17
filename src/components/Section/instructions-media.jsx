import DOMPurify from "dompurify";
import { injectAudioCueIntoHTML, splitTextByAudioCueKeyword } from "../instructionCues";
import { resolveAsset } from "../../utility";
import { AudioCueIcon } from "../AudioCueIcon";
import { InstructionCallout } from "../InstructionCallout";

export const INSTRUCTION_TEXT_CLASS = "text-[var(--font-size-xl)] leading-[var(--line-height-body)] [&_p]:!text-[var(--font-size-xl)] [&_p]:!leading-[var(--line-height-body)] [&_li]:!text-[var(--font-size-xl)] [&_li]:!leading-[var(--line-height-body)]";
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
		node.style.fontSize = "var(--font-size-xl)";
		node.style.lineHeight = "var(--line-height-body)";
	});
	return doc.body.innerHTML;
};

export const InstructionsMedia = ({
	paragraph,
	paragraphHTML,
	image = {},
	instructionTextClass = INSTRUCTION_TEXT_CLASS,
	stackOnDesktop = false,
}) => {
	const renderTextWithAudioCue = (value) => {
		const split = splitTextByAudioCueKeyword(value);
		if (!split) return value;
		return (
			<>
				{split.before}
				{split.keyword}
				{" "}
				<AudioCueIcon />
				{split.after}
			</>
		);
	};

	const safeParagraphHTML = paragraphHTML
		? applyInstructionTypographyToHTML(DOMPurify.sanitize(paragraphHTML))
		: "";

	const paragraphContent = paragraphHTML ? (
		<div
			className={`instructions-body ${instructionTextClass}`}
			style={{ margin: 0 }}
			dangerouslySetInnerHTML={{ __html: safeParagraphHTML }}
		/>
	) : paragraph ? (
		<div
			className={`instructions-body ${instructionTextClass}`}
			style={{
				margin: 0,
				fontSize: "var(--font-size-xl)",
				lineHeight: "var(--line-height-body)",
			}}
		>
			{renderTextWithAudioCue(paragraph)}
		</div>
	) : null;
	const paragraphNode = paragraphContent ? (
		<InstructionCallout className="md:flex-1">
			{paragraphContent}
		</InstructionCallout>
	) : null;

	const imageNode = image?.src ? (
		<figure className={`-mt-3 flex w-full max-w-[520px] flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated/70 p-4 shadow-sm md:-mt-10 ${stackOnDesktop ? "self-start" : "md:w-1/2 md:self-start"}`}>
			<img
				src={resolveAsset(image.src)}
				alt={image.alt || ""}
				className="h-auto w-[80%] object-contain"
				loading="lazy"
			/>
			{image.caption ? (
				<figcaption className="text-sm text-muted-foreground text-center">
					{image.caption}
				</figcaption>
			) : null}
		</figure>
	) : null;

	return (
		<div className={`instructions instructions-media flex flex-col items-center gap-5 text-foreground ${stackOnDesktop ? "" : "md:flex-row md:items-start md:gap-8"}`}>
			{paragraphNode}
			{imageNode}
		</div>
	);
};
