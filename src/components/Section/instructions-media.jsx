import DOMPurify from "dompurify";
import { resolveAsset } from "../../utility";

export const INSTRUCTION_TEXT_CLASS = "text-[var(--font-size-xl)] leading-[var(--body-line-height)] [&_p]:!text-[var(--font-size-xl)] [&_p]:!leading-[var(--body-line-height)] [&_li]:!text-[var(--font-size-xl)] [&_li]:!leading-[var(--body-line-height)]";
export const applyInstructionTypographyToHTML = (html) => {
	if (typeof DOMParser === "undefined") {
		return html;
	}
	const doc = new DOMParser().parseFromString(html, "text/html");
	doc.querySelectorAll("p, li").forEach((node) => {
		node.style.fontSize = "var(--font-size-xl)";
		node.style.lineHeight = "var(--body-line-height)";
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
	const safeParagraphHTML = paragraphHTML
		? applyInstructionTypographyToHTML(DOMPurify.sanitize(paragraphHTML))
		: "";

	const paragraphNode = paragraphHTML ? (
		<div
			className={`${instructionTextClass} md:flex-1`}
			style={{ margin: 0 }}
			dangerouslySetInnerHTML={{ __html: safeParagraphHTML }}
		/>
	) : paragraph ? (
		<p className={`${instructionTextClass} md:flex-1`} style={{ margin: 0 }}>
			{paragraph}
		</p>
	) : null;

	const imageNode = image?.src ? (
		<figure className={`flex w-full max-w-[520px] flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated/70 p-4 shadow-sm ${stackOnDesktop ? "self-start" : "md:w-1/2 md:self-start"}`}>
			<img
				src={resolveAsset(image.src)}
				alt={image.alt || ""}
				className="h-auto w-full object-contain"
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
