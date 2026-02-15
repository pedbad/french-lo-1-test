import { Card, CardContent } from "@/components/ui/card";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import DOMPurify from "dompurify";
import React from "react";

import { Info } from "..";

const ACCORDION_TITLE_TEXT_CLASS = "text-[var(--font-size-base)]";
const ACCORDION_TITLE_STYLE = {
	fontSize: "calc(var(--font-size-lg) * 1.215)",
	lineHeight: "var(--line-height-2xl)",
	marginBottom: 0,
	marginTop: 0,
};

const parsePersistedExpandedState = (id, fallback) => {
	if (!id || typeof window === "undefined") return fallback;

	try {
		const stored = window.sessionStorage.getItem(`${id}-expanded`);
		if (stored === null) return fallback;
		const parsed = JSON.parse(stored);
		return typeof parsed === "boolean" ? parsed : fallback;
	} catch {
		return fallback;
	}
};

const persistExpandedState = (id, expanded) => {
	if (!id || typeof window === "undefined") return;

	try {
		window.sessionStorage.setItem(`${id}-expanded`, JSON.stringify(expanded));
	} catch {
		// Ignore storage write failures (privacy mode/quota), keep UI responsive.
	}
};

const renderSplitTitle = (rawTitle) => {
	if (typeof rawTitle !== "string") return rawTitle;

	const match = rawTitle.match(/\s*\(part\s*(\d+)\)$/i);
	if (!match) return rawTitle;

	const partNumber = match[1];
	const partText = `(part ${partNumber})`;
	const baseText = rawTitle.replace(/\s*\(part\s*\d+\)$/i, "").trimEnd();
	return (
		<>
			{baseText}
			{" "}
			<span className="accordion-title-part">{partText}</span>
		</>
	);
};

export function AppAccordionArticle({
	children,
	className,
	config,
	expandedByDefault = false,
	expandNow,
	id,
	info,
	noCard = false,
	target,
	title = "",
	titleHTML = "",
}) {
	const [expanded, setExpanded] = React.useState(() =>
		parsePersistedExpandedState(id, expandedByDefault)
	);
	const contentRef = React.useRef(null);
	const previousExpandNow = React.useRef(expandNow);

	const syncContentHeight = React.useCallback(() => {
		if (!contentRef.current) return;
		contentRef.current.style.setProperty(
			"--radix-accordion-content-height",
			`${contentRef.current.scrollHeight}px`
		);
	}, []);

	React.useEffect(() => {
		syncContentHeight();
	});

	React.useEffect(() => {
		if (expandNow !== previousExpandNow.current) {
			setExpanded(true);
			persistExpandedState(id, true);
		}
		previousExpandNow.current = expandNow;
	}, [expandNow, id]);

	const handleValueChange = React.useCallback(
		(values) => {
			const isExpanded = values.includes(id);
			setExpanded(isExpanded);
			persistExpandedState(id, isExpanded);
		},
		[id]
	);

	const handleTriggerClick = React.useCallback(() => {
		if (typeof navigator !== "undefined" && "vibrate" in navigator) {
			window.navigator.vibrate(100);
		}
	}, []);

	const headingContent =
		titleHTML !== "" ? (
			<>
				<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(titleHTML) }} />
				{info ? <Info infoMessage={info.infoMessage} infoTitle={info.infoTitle} /> : null}
			</>
		) : (
			<>
				{renderSplitTitle(title)}
				{info ? <Info infoMessage={info.infoMessage} infoTitle={info.infoTitle} /> : null}
			</>
		);

	const contentId = `${id}-content`;
	const headingId = target ? `modal-link-${target}` : `section-title-${id}`;
	const { informationText, informationTextHTML } = config || {};
	const hasInfo = Boolean(informationText || informationTextHTML);
	const shouldSuppressChildInfo = hasInfo;
	const renderedChildren = shouldSuppressChildInfo
		? React.Children.map(children, (child) =>
			React.isValidElement(child) ? React.cloneElement(child, { suppressInfo: true }) : child
		)
		: children;

	return (
		<section
			aria-labelledby={headingId}
			className={`accordion-article ${expanded ? "expanded" : ""} ${className || ""}`}
			data-state={expanded ? "open" : "closed"}
			id={id}
			key={`article${id}`}
		>
			<AccordionPrimitive.Root
				className="accordion-radix-root"
				onValueChange={handleValueChange}
				type="multiple"
				value={expanded ? [id] : []}
			>
				<AccordionPrimitive.Item className="border-none" value={id}>
					<header>
						<AccordionPrimitive.Header asChild>
							<h2
								className={`modal-link-target ${ACCORDION_TITLE_TEXT_CLASS}`}
								data-modal-target={target || undefined}
								id={headingId}
								style={ACCORDION_TITLE_STYLE}
							>
								<AccordionPrimitive.Trigger
									aria-controls={contentId}
									className="accordion-trigger"
									onClick={handleTriggerClick}
									title={expanded ? "Click to close" : "Click to expand"}
								>
									<svg
										aria-hidden="true"
										className="arrow lucide lucide-chevron-down h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
										fill="none"
										height="24"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="m6 9 6 6 6-6" />
									</svg>
									<span className="accordion-trigger-label">{headingContent}</span>
								</AccordionPrimitive.Trigger>
							</h2>
						</AccordionPrimitive.Header>
					</header>

					<AccordionPrimitive.Content
						className="content overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
						id={contentId}
						ref={contentRef}
					>
						{noCard ? (
							<>
								{hasInfo ? (
									<Info
										id={`info-${id}`}
										informationText={informationText}
										informationTextHTML={informationTextHTML}
									/>
								) : null}
								{renderedChildren}
							</>
						) : (
							<Card className="w-full sortable mt-2 border border-t-0 rounded-t-none">
								<CardContent className="p-2 accordion-card-content">
									{hasInfo ? (
										<Info
											id={`info-${id}`}
											informationText={informationText}
											informationTextHTML={informationTextHTML}
										/>
									) : null}
									{renderedChildren}
								</CardContent>
							</Card>
						)}
					</AccordionPrimitive.Content>
				</AccordionPrimitive.Item>
			</AccordionPrimitive.Root>
		</section>
	);
}
