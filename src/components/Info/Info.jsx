import DOMPurify from "dompurify";
import { CircleAlert, CircleCheck, CircleX, Info as InfoIcon } from "lucide-react";
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { injectAudioCueIntoHTML, splitTextByAudioCueKeyword } from "../instructionCues";
import { AudioCueIcon } from "../AudioCueIcon";

const INFO_CONTAINER_CLASS = "information mt-1 flex items-start gap-[0.45rem]";
const INFO_CONTENT_TEXT_CLASS = "info-content text-[var(--font-size-xl)] leading-[var(--line-height-body)] [&_div]:!text-[var(--font-size-xl)] [&_div]:!leading-[var(--line-height-body)] [&_p]:!m-0 [&_p]:!text-[var(--font-size-xl)] [&_p]:!leading-[var(--line-height-body)] [&_li]:!text-[var(--font-size-xl)] [&_li]:!leading-[var(--line-height-body)] [&_h3]:!m-0 [&_h3]:!mb-[0.35rem] [&_h3]:!text-[var(--font-size-xl)] [&_h3]:!leading-[var(--line-height-app)] [&_h3]:!font-semibold [&_h4]:!m-0 [&_h4]:!mb-[0.3rem] [&_h4]:!text-[var(--font-size-xl)] [&_h4]:!leading-[var(--line-height-app)]";
const INFO_CONTENT_SPACING_CLASS = "[&_li]:mt-[0.3rem]";
const INFO_TITLE_CLASS = "mb-1 text-[var(--font-size-xl)] leading-[var(--line-height-app)] font-semibold";
const INFO_ICON_CLASS = "info-icon self-start mt-[0.16em] inline-flex h-[1.55em] w-[1.55em] shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--font-size-base)] leading-none";
const INFO_ICON_SVG_CLASS = "info-icon__svg h-[1.4em] w-[1.4em] text-[var(--background)] [stroke-width:3.4] [&_circle]:hidden";

const INFO_VARIANTS = new Set(["default", "info", "warning", "success", "danger"]);
const PARAGRAPH_OPEN_TAG_PATTERN = /<p(\s[^>]*)?>/gi;
const PARAGRAPH_CLOSE_TAG_PATTERN = /<\/p>/gi;
const INFO_INLINE_TEXT_STYLE = {
	fontSize: "var(--font-size-xl)",
	lineHeight: "var(--line-height-body)",
};

const normalizeAlertHtml = (rawHtml) =>
	rawHtml
		.replace(PARAGRAPH_OPEN_TAG_PATTERN, "<div$1>")
		.replace(PARAGRAPH_CLOSE_TAG_PATTERN, "</div>");

const applyInfoTypographyToHTML = (rawHtml = "") => {
	const normalizedHtml = normalizeAlertHtml(rawHtml);
	if (typeof DOMParser === "undefined") return normalizedHtml;
	const doc = new DOMParser().parseFromString(normalizedHtml, "text/html");
	doc.querySelectorAll("div, p, li, h3, h4").forEach((node) => {
		node.style.fontSize = "var(--font-size-xl)";
		node.style.lineHeight = "var(--line-height-body)";
	});
	doc.querySelectorAll("h3, h4").forEach((node) => {
		node.style.marginTop = "0";
		node.style.marginBottom = "0.35rem";
		node.style.fontWeight = "600";
	});
	return doc.body.innerHTML;
};

export class Info extends React.PureComponent {
	// constructor(props) {
	// 	super(props);

	// 	this.state = ({
	// 		showInfo: false,
	// 	});

	// }

	render = () => {

		const {
			alertType,
			children,
			id,
			infoMessage,
			infoTitle,
			informationText,
			informationTextHTML,
			type,
			variant,
		} = this.props;
		const infoId = id ? `${id}-Info` : undefined;

		const requestedVariant = alertType || type || variant || "info";
		const resolvedVariant = INFO_VARIANTS.has(requestedVariant) ? requestedVariant : "info";
		const Icon = resolvedVariant === "danger"
			? CircleX
			: resolvedVariant === "warning"
				? CircleAlert
				: resolvedVariant === "success"
					? CircleCheck
					: InfoIcon;

		const infoIcon = (
			<span aria-hidden="true" className={INFO_ICON_CLASS}>
				<Icon className={INFO_ICON_SVG_CLASS} />
			</span>
		);

		let content = null;
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
		if (informationTextHTML) {
			const sanitizedHtml = DOMPurify.sanitize(informationTextHTML);
			const htmlWithAudioCue = injectAudioCueIntoHTML(sanitizedHtml);
			const normalizedHtml = applyInfoTypographyToHTML(htmlWithAudioCue);
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} style={INFO_INLINE_TEXT_STYLE} dangerouslySetInnerHTML={{ __html: normalizedHtml }}/>
			);
		} else if (informationText) {
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} style={INFO_INLINE_TEXT_STYLE}>
					{renderTextWithAudioCue(informationText)}
				</AlertDescription>
			);
		} else if (infoTitle || infoMessage) {
			content = (
				<div className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
					{infoTitle ? <AlertTitle className={INFO_TITLE_CLASS}>{infoTitle}</AlertTitle> : null}
					{infoMessage ? (
						<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} style={INFO_INLINE_TEXT_STYLE}>
							{renderTextWithAudioCue(infoMessage)}
						</AlertDescription>
					) : null}
				</div>
			);
		} else if (children) {
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} style={INFO_INLINE_TEXT_STYLE}>
					{children}
				</AlertDescription>
			);
		}

		if (!content) return null;

		return (
			<Alert className={INFO_CONTAINER_CLASS} id={infoId} variant={resolvedVariant}>
				{infoIcon}
				{content}
			</Alert>
		);
	};
}
