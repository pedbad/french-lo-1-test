import DOMPurify from "dompurify";
import { resolveAsset } from "../../utility";

export const INSTRUCTION_TEXT_CLASS = "text-sm leading-[var(--body-line-height)]";

export const InstructionsMedia = ({
	paragraph,
	paragraphHTML,
	image = {},
	instructionTextClass = INSTRUCTION_TEXT_CLASS,
	stackOnDesktop = false,
}) => {
	const paragraphNode = paragraphHTML ? (
		<div
			className={`${instructionTextClass} md:flex-1`}
			style={{ margin: 0 }}
			dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraphHTML) }}
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
