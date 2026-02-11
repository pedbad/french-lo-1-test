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

const highlightClass =
	"rounded-md bg-amber-300/90 px-1 text-base sm:text-lg font-semibold text-amber-950 ring-2 ring-amber-400/80 animate-highlight-flash";

const applyHighlightClasses = (html = "") => {
	const withClasses = html
		.replace(/class=(['"])modal-highlight\1/g, `class="${highlightClass}"`)
		.replace(/data-highlight=(['"])true\1/g, `class="${highlightClass}"`);
	return withClasses.replace(/\bmodal-highlight\b/g, "");
};

export const ModalLinkDialog = ({ open, title, contentHTML, onClose }) => {
	const safeHTML = contentHTML
		? DOMPurify.sanitize(applyHighlightClasses(contentHTML))
		: "";

	return (
		<Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
			<DialogContent className="modal-link-dialog max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-base sm:text-lg">
						{title || "More information"}
					</DialogTitle>
				</DialogHeader>
				<div
					className="space-y-3 text-base leading-relaxed text-foreground sm:text-lg"
					dangerouslySetInnerHTML={{ __html: safeHTML }}
				/>
				<div className="flex justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
