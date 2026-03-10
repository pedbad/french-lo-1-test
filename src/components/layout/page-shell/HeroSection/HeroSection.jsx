import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, InstructionCallout } from "@/components/content";
import { BackToTopButton } from "@/components/layout";
import DOMPurify from "dompurify";
import React from "react";
import { applyInstructionTypographyToHTML, INSTRUCTION_TEXT_CLASS, InstructionsMedia } from "@/components/Section/instructions-media";
import { resolveAsset } from "@/utils/assets";
import { Separator } from "@/components/ui/separator";

const splitDisplayTitle = (value) => {
	if (typeof value !== "string") return null;

	const title = value.trim();
	if (!title) return null;

	const splitPatterns = [
		/:\s+/,
		/\s+—\s+/,
		/\s+–\s+/,
		/\s+\|\s+/,
		/\s+-\s+/,
	];

	for (const pattern of splitPatterns) {
		const match = title.match(pattern);
		if (!match || match.index === undefined) continue;

		const { index } = match;
		const [separator] = match;
		const main = title.slice(0, index).trim();
		const sub = title.slice(index + separator.length).trim();
		if (!main || !sub) continue;

		return { main, sub };
	}

	return null;
};

export const HeroSection = ({
	id,
	target,
	title,
	titleHTML,
	config,
	children,
	semanticAs = "section",
}) => {
	const {
		informationText,
		informationTextHTML,
		instructionsText,
		instructionsTextHTML,
		instructionsLayout,
		stackInfo = false,
		transparentCard = false,
	} = config || {};
	const headingId = target ? `${target}-heading` : `section-title-${id}`;
	const RootTag = semanticAs === "div" ? "div" : "section";
	const rootAriaProps = RootTag === "section" ? { "aria-labelledby": headingId } : {};
	const hasInfo = Boolean(informationText || informationTextHTML);
	const hasInstructions = Boolean(instructionsLayout || instructionsText || instructionsTextHTML);
	const sideBySide = hasInfo && !stackInfo;
	const splitInfoImage = stackInfo && Boolean(instructionsLayout?.image);
	const rawInstructionsHTML = instructionsTextHTML || instructionsText || "";
	const safeInstructionsHTML = rawInstructionsHTML
		? applyInstructionTypographyToHTML(DOMPurify.sanitize(rawInstructionsHTML))
		: "";
	const splitTitle = !titleHTML ? splitDisplayTitle(title) : null;
	const renderedTitle = titleHTML ? (
		<span
			dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(titleHTML) }}
		/>
	) : splitTitle ? (
		<>
			<span className="title-main">
				{splitTitle.main} —
			</span>
			<span className="title-sub">
				{splitTitle.sub}
			</span>
		</>
	) : (
		title
	);
	const inlineInstructionNode = rawInstructionsHTML ? (
		<div
			className={`html section mt-0 ${INSTRUCTION_TEXT_CLASS}`}
			style={{ margin: 0 }}
			dangerouslySetInnerHTML={{ __html: safeInstructionsHTML }}
		/>
	) : null;

	return (
		<RootTag {...rootAriaProps} className="section hero-section" id={id}>
			<Card
				className={`w-full sortable mt-6 ${
					transparentCard ? "bg-transparent border-0 shadow-none" : ""
				}`}
			>
				<CardHeader className="px-6 pb-4 pt-6">
					<header>
						<CardTitle className="text-base [&_h2]:m-0">
							<h2
								className="modal-link-target"
								data-modal-target={target || undefined}
								id={headingId}
							>
								{renderedTitle}
							</h2>
						</CardTitle>
						{instructionsLayout ? (
							<InstructionsMedia
								{...instructionsLayout}
								image={splitInfoImage ? undefined : instructionsLayout.image}
								instructionTextClass={INSTRUCTION_TEXT_CLASS}
							/>
						) : inlineInstructionNode ? (
							<InstructionCallout>
								{inlineInstructionNode}
							</InstructionCallout>
						) : null}
						{hasInstructions ? <Separator className="my-3" /> : null}
					</header>
				</CardHeader>
				<CardContent
					className={`grid gap-6 ${sideBySide ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-8" : ""}`}
				>
					<div className="flex flex-col gap-6">
						{hasInfo && stackInfo && !splitInfoImage ? (
							<Info
								id={`info-${id}`}
								informationText={informationText}
								informationTextHTML={informationTextHTML}
							/>
						) : null}
						{splitInfoImage ? (
							<div className="intro-split grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
								<div className="self-start">
									<Info
										id={`info-${id}`}
										informationText={informationText}
										informationTextHTML={informationTextHTML}
									/>
								</div>
								<figure className="intro-split-image flex w-full max-w-[520px] flex-col items-center gap-3 self-start rounded-2xl border border-border/60 bg-surface-elevated/70 px-4 pb-4 pt-0 shadow-sm">
									<img
										src={resolveAsset(instructionsLayout.image.src)}
										alt={instructionsLayout.image.alt || ""}
										className="h-auto w-full object-contain"
										loading="lazy"
									/>
									{instructionsLayout.image.caption ? (
										<figcaption className="text-sm text-muted-foreground text-center">
											{instructionsLayout.image.caption}
										</figcaption>
									) : null}
								</figure>
							</div>
						) : null}
						{children}
						<BackToTopButton />
					</div>
					{sideBySide ? (
						<div className="w-full">
							<Info
								id={`info-${id}`}
								informationText={informationText}
								informationTextHTML={informationTextHTML}
							/>
						</div>
					) : null}
				</CardContent>
			</Card>
		</RootTag>
	);
};
