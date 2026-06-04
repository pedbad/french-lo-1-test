import React from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const highlightClass = "modal-highlight-flash font-semibold text-[var(--edu-accent)]";
const modalTitleClass = "text-base sm:text-lg max-[650px]:!text-[length:var(--font-size-lg)]";
const modalBodyClass = "space-y-3 text-base leading-relaxed text-foreground sm:text-lg [&_h2]:max-[650px]:!text-[length:var(--font-size-lg)] [&_h3]:max-[650px]:!text-[length:var(--font-size-lg)] [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1";
const PARAGRAPH_OPEN_TAG_PATTERN = /<p(\s[^>]*)?>/gi;
const PARAGRAPH_CLOSE_TAG_PATTERN = /<\/p>/gi;

const applyHighlightClasses = (html = "") => {
	const withClasses = html
		.replace(/class=(['"])modal-highlight\1/g, `class="${highlightClass}"`)
		.replace(/data-highlight=(['"])true\1/g, `class="${highlightClass}"`);
	return withClasses.replace(/\bmodal-highlight\b/g, "");
};

const normalizeParagraphTags = (html = "") =>
	html
		.replace(PARAGRAPH_OPEN_TAG_PATTERN, "<div$1>")
		.replace(PARAGRAPH_CLOSE_TAG_PATTERN, "</div>");

const normalizeParagraphElements = (node) => {
	if (node === null || node === undefined || typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
		return node;
	}
	if (Array.isArray(node)) {
		return node.map((child) => normalizeParagraphElements(child));
	}
	if (!React.isValidElement(node)) {
		return node;
	}

	const normalizedChildren = normalizeParagraphElements(node.props?.children);

	if (typeof node.type === "string" && node.type.toLowerCase() === "p") {
		const { ...restProps } = node.props || {};
		return (
			<div {...restProps}>
				{normalizedChildren}
			</div>
		);
	}

	return React.cloneElement(node, undefined, normalizedChildren);
};

export const ModalLinkDialog = ({ open, title, contentHTML, content, onClose }) => {
	const safeHTML = contentHTML
		? normalizeParagraphTags(DOMPurify.sanitize(applyHighlightClasses(contentHTML)))
		: "";
	const normalizedContent = content ? normalizeParagraphElements(content) : null;

	return (
		<Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
			<DialogContent className="modal-link-dialog max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className={modalTitleClass}>
						{title || "More information"}
					</DialogTitle>
				</DialogHeader>
				{normalizedContent ? (
					<div className={modalBodyClass}>
						{normalizedContent}
					</div>
				) : (
					<div
						className={modalBodyClass}
						dangerouslySetInnerHTML={{ __html: safeHTML }}
					/>
				)}
				<div className="flex justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary" className="btn-edu-warn">
							Close
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
