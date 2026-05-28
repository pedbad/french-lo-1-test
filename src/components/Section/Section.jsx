// src/components/Accordion/Section.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BackToTopButton,
	Info,
	InstructionCallout
} from '..';
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";
import React from 'react';
import { applyInstructionTypographyToHTML, INSTRUCTION_TEXT_CLASS, InstructionsMedia } from "./instructions-media";

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

export class Section extends React.PureComponent {
	constructor(props) {
		super(props);

		let {
			expandedByDefault: expanded = false,
		} = this.props;

		const {
			id,
		} = this.props;

		if (sessionStorage.getItem(`${id}-expanded`)) expanded = JSON.parse(sessionStorage.getItem(`${id}-expanded`));
		// console.log(`${id} ${expanded}`);
		this.state = ({
			expanded: expanded, // Set up from sessionStorage and expandd by default
			id: id,
		});
	}

	doNowt = (e) => {
		// console.log("doNowt", e);
		e.preventDefault();
		e.stopPropagation();
	};

	render = () => {
		const {
			config,
			title = '',
			titleHTML = '',
			// info,
			className = '',
			children,
			target,
			semanticAs = 'section',
		} = this.props;

		const {
			// informationText,
			// informationTextHTML,
			instructionsText,
			instructionsTextHTML,
			instructionsLayout,
		} = config;
		const rawInstructionsHTML = instructionsTextHTML || instructionsText || "";
		const safeInstructionsTextHTML = rawInstructionsHTML
			? applyInstructionTypographyToHTML(DOMPurify.sanitize(rawInstructionsHTML))
			: "";
		const { informationText, informationTextHTML } = config;

		const {
			id,
		} = this.state;
		const headingId = target ? `${target}-heading` : `section-title-${id}`;
		const RootTag = semanticAs === "div" ? "div" : "section";
		const rootAriaProps = RootTag === "section" ? { "aria-labelledby": headingId } : {};
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
		const inlineInstructionNode = safeInstructionsTextHTML
			? (
				<div
					className={`html section mt-0 ${INSTRUCTION_TEXT_CLASS}`}
					style={{ margin: 0 }}
					dangerouslySetInnerHTML={{ __html: safeInstructionsTextHTML }}
				/>
			)
			: null;

		// console.log("target", target);

		const shouldSuppressChildInfo = Boolean(
			instructionsText ||
			instructionsTextHTML ||
			instructionsLayout ||
			informationText ||
			informationTextHTML
		);

		const enhancedChildren = React.Children.map(children, (child) => {
			if (React.isValidElement(child) && shouldSuppressChildInfo) {
				return React.cloneElement(child, { suppressInfo: true });
			}
			return child;
		});

		return (
			<RootTag
				{...rootAriaProps}
				className={`section ${className ? className : ''}`}
				id={`${id}`}
			>
				<Card className="w-full sortable mt-6">
					<CardHeader className="px-6 pb-4 pt-6">
						<header>
							<CardTitle className="text-base [&_h2]:m-0">{/* font-semibold">*/}
								<h2
									className="modal-link-target"
									data-modal-target={target || undefined}
									id={headingId}
								>
									{renderedTitle}
								</h2>

								{/* {title} */}
							</CardTitle>
							{/* <Info className={`text accordionarticle`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML}/> */}
							{instructionsLayout ? (
								<InstructionsMedia
									{...instructionsLayout}
									instructionTextClass={INSTRUCTION_TEXT_CLASS}
								/>
							) : inlineInstructionNode ? (
								<InstructionCallout>
									{inlineInstructionNode}
								</InstructionCallout>
							) : null}
							{(instructionsText || instructionsTextHTML || instructionsLayout) ? <Separator className="my-3" /> : null}
						</header>

					</CardHeader>

					<CardContent>

						<div key={`article-${id}`}>
							<div
								id={`content-${id}`}
								onClick={this.doNowt}
							>
								{(informationText || informationTextHTML) ? (
									<Info
										id={`info-${id}`}
										informationText={informationText}
										informationTextHTML={informationTextHTML}
									/>
								) : null}
								<div
									className={`pb-5 text-sm ${(informationText || informationTextHTML) ? "mt-2" : ""}`}
								>
									{enhancedChildren}
								</div>
							</div>
						</div>
						<BackToTopButton />
					</CardContent>
				</Card>
			</RootTag>
		);
	};
}
