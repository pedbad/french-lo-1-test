import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TopButton } from "..";
import DOMPurify from "dompurify";
import React from "react";
import { INSTRUCTION_TEXT_CLASS, InstructionsMedia } from "../Section/instructions-media";
import { resolveAsset } from "../../utility";

export const HeroSection = ({
	id,
	target,
	title,
	titleHTML,
	config,
	children,
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
	const headingId = target ? `modal-link-${target}` : `section-title-${id}`;
	const hasInfo = Boolean(informationText || informationTextHTML);
	const sideBySide = hasInfo && !stackInfo;
	const splitInfoImage = stackInfo && Boolean(instructionsLayout?.image);

	return (
		<div className="section hero-section" id={id}>
			<Card
				className={`w-full sortable mt-6 ${
					transparentCard ? "bg-transparent border-0 shadow-none" : ""
				}`}
			>
				<CardHeader className="px-6 pb-4 pt-6">
					<CardTitle className="text-base [&_h2]:m-0">
						<h2
							className="modal-link-target"
							data-modal-target={target || undefined}
							id={headingId}
						>
							{titleHTML ? (
								<span
									dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(titleHTML) }}
								/>
							) : (
								title
							)}
						</h2>
					</CardTitle>
				</CardHeader>
				<CardContent
					className={`grid gap-6 ${sideBySide ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-8" : ""}`}
				>
					<div className="flex flex-col gap-6">
						{instructionsLayout ? (
							<InstructionsMedia
								{...instructionsLayout}
								image={splitInfoImage ? undefined : instructionsLayout.image}
								instructionTextClass={INSTRUCTION_TEXT_CLASS}
							/>
						) : (
							<div className="w-full">
								{instructionsText ? (
									<p className={INSTRUCTION_TEXT_CLASS} style={{ margin: 0 }}>
										{instructionsText}
									</p>
								) : null}
								{instructionsTextHTML ? (
									<div
										className={INSTRUCTION_TEXT_CLASS}
										style={{ margin: 0 }}
										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(instructionsTextHTML) }}
									/>
								) : null}
							</div>
						)}
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
						<TopButton />
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
		</div>
	);
};
