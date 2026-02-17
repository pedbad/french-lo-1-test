import DOMPurify from "dompurify";
import { CircleAlert, CircleCheck, CircleX, Info as InfoIcon } from "lucide-react";
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const INFO_CONTAINER_CLASS = "information mt-1 flex items-start gap-[0.4rem]";
const INFO_CONTENT_TEXT_CLASS = "info-content text-[calc(var(--font-size-base)*1.14)] leading-[var(--line-height-body)] [&_li]:text-[calc(var(--font-size-base)*1.14)] [&_li]:leading-[var(--line-height-body)] [&_h3]:mt-0 [&_h3]:text-[calc(var(--font-size-base)*1.24)] [&_h3]:leading-[var(--line-height-app)] [&_h4]:mt-0 [&_h4]:text-[calc(var(--font-size-base)*1.14)]";
const INFO_CONTENT_SPACING_CLASS = "[&_li]:mt-[0.3rem]";
const INFO_ICON_CLASS = "info-icon mt-[-0.1em] inline-flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--font-size-base)]";
const INFO_ICON_SVG_CLASS = "info-icon__svg h-[1.4em] w-[1.4em] text-[var(--background)] [stroke-width:3.4] [&_circle]:hidden";

const INFO_VARIANTS = new Set(["default", "info", "warning", "success", "danger"]);
const PARAGRAPH_OPEN_TAG_PATTERN = /<p(\s[^>]*)?>/gi;
const PARAGRAPH_CLOSE_TAG_PATTERN = /<\/p>/gi;

const normalizeAlertHtml = (rawHtml) =>
	rawHtml
		.replace(PARAGRAPH_OPEN_TAG_PATTERN, "<div$1>")
		.replace(PARAGRAPH_CLOSE_TAG_PATTERN, "</div>");

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
		if (informationTextHTML) {
			const sanitizedHtml = DOMPurify.sanitize(informationTextHTML);
			const normalizedHtml = normalizeAlertHtml(sanitizedHtml);
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} dangerouslySetInnerHTML={{ __html: normalizedHtml }}/>
			);
		} else if (informationText) {
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
					{informationText}
				</AlertDescription>
			);
		} else if (infoTitle || infoMessage) {
			content = (
				<div className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
					{infoTitle ? <AlertTitle>{infoTitle}</AlertTitle> : null}
					{infoMessage ? <AlertDescription>{infoMessage}</AlertDescription> : null}
				</div>
			);
		} else if (children) {
			content = (
				<AlertDescription className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
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
