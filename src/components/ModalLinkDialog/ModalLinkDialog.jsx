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

const highlightClass = "modal-highlight-flash font-semibold text-amber-950";
const modalTitleClass = "text-base sm:text-lg max-[650px]:!text-[var(--font-size-lg)]";
const modalBodyClass = "space-y-3 text-base leading-relaxed text-foreground sm:text-lg [&_h2]:max-[650px]:!text-[var(--font-size-lg)] [&_h3]:max-[650px]:!text-[var(--font-size-lg)]";

const applyHighlightClasses = (html = "") => {
	const withClasses = html
		.replace(/class=(['"])modal-highlight\1/g, `class="${highlightClass}"`)
		.replace(/data-highlight=(['"])true\1/g, `class="${highlightClass}"`);
	return withClasses.replace(/\bmodal-highlight\b/g, "");
};

export const ModalLinkDialog = ({ open, title, contentHTML, content, onClose }) => {
	const safeHTML = contentHTML
		? DOMPurify.sanitize(applyHighlightClasses(contentHTML))
		: "";

	return (
		<Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
			<DialogContent className="modal-link-dialog max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className={modalTitleClass}>
						{title || "More information"}
					</DialogTitle>
				</DialogHeader>
				{content ? (
					<div className={modalBodyClass}>
						{content}
					</div>
				) : (
					<div
						className={modalBodyClass}
						dangerouslySetInnerHTML={{ __html: safeHTML }}
					/>
				)}
				<div className="flex justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary" className="btn-ped-warn">
							Close
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
