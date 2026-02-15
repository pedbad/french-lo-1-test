import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DOMPurify from "dompurify";
import {Info} from '..';
import React from 'react';

const ACCORDION_TITLE_TEXT_CLASS = "text-[var(--font-size-base)]";
const ACCORDION_TITLE_STYLE = {
	fontSize: "calc(var(--font-size-lg) * 1.215)",
	lineHeight: "var(--line-height-2xl)",
	marginBottom: 0,
	marginTop: 0,
};

export class AccordionArticle extends React.PureComponent {

	constructor(props) {
		super(props);
		this.contentRef = React.createRef();

		let {
			expandedByDefault: expanded = false,
		} = this.props;

		const {
			id,
		} = this.props;

		if (sessionStorage.getItem(`${id}-expanded`)) expanded = JSON.parse(sessionStorage.getItem(`${id}-expanded`));

		this.state = ({
			expanded: expanded, // Set up from sessionStorage
			id: id,
		});

		// this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.expandNow !== prevProps.expandNow) {
			this.expand();
		}
		this.syncContentHeight();
	};

	componentDidMount = () => {
		this.syncContentHeight();
	};

	syncContentHeight = () => {
		if (!this.contentRef?.current) return;
		this.contentRef.current.style.setProperty(
			'--radix-accordion-content-height',
			`${this.contentRef.current.scrollHeight}px`,
		);
	};

	expand = () => {
		const {
			id,
		} = this.state;

		sessionStorage.setItem(`${id}-expanded`, JSON.stringify(true));
		this.setState({
			expanded: true
		});
	};

	toggleExpanded = () => {
		let {
			expanded,
		} = this.state;
		const {
			id,
		} = this.state;
		expanded = !expanded;
		sessionStorage.setItem(`${id}-expanded`, JSON.stringify(expanded));
		this.setState({
			expanded: expanded
		});
		if ("vibrate" in navigator) {
			window.navigator.vibrate(100);
		}
	};

	renderSplitTitle = (rawTitle) => {
		if (typeof rawTitle !== "string") return rawTitle;
		const renderPartSuffix = (text) => {
			if (typeof text !== "string") return text;
			const match = text.match(/\s*\(part\s*(\d+)\)$/i);
			if (!match) return text;
			const partNumber = match[1];
			const partText = `(part ${partNumber})`;
			const baseText = text.replace(/\s*\(part\s*\d+\)$/i, "").trimEnd();
			return (
				<>
					{baseText}
					{" "}
					<span className="accordion-title-part">{partText}</span>
				</>
			);
		};
		return renderPartSuffix(rawTitle);
	};

	render = () => {
		const {
			children,
			className,
			info,
			noCard = false,
			target,
			title = '',
			titleHTML = '',
			config,
		} = this.props;

		const {
			expanded,
			id,
		} = this.state;

		let headingContent = (
			<>
				{this.renderSplitTitle(title)}
				{info ? <Info infoTitle={info.infoTitle} infoMessage={info.infoMessage} /> : null}
			</>
		);

		if (titleHTML !== '') {
			headingContent = (
				<>
					<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(titleHTML) }} />
					{info ? <Info infoTitle={info.infoTitle} infoMessage={info.infoMessage} /> : null}
				</>
			);
		}

		const contentId = `${id}-content`;
		const headingId = target ? `modal-link-${target}` : `section-title-${id}`;
		const { informationText, informationTextHTML } = config || {};
		const hasInfo = Boolean(informationText || informationTextHTML);
		const shouldSuppressChildInfo = Boolean(informationText || informationTextHTML);
		const renderedChildren = shouldSuppressChildInfo
			? React.Children.map(children, (child) =>
				React.isValidElement(child) ? React.cloneElement(child, { suppressInfo: true }) : child
			)
			: children;

		return (
			<section
				className={`accordion-article ${expanded ? 'expanded' : ''} ${className ? className : ''}`}
				data-state={expanded ? 'open' : 'closed'}
				id={`${id}`}
				key={`article${id}`}
				aria-labelledby={headingId}
			>
				<header>
					<h2
						className={`modal-link-target ${ACCORDION_TITLE_TEXT_CLASS}`}
						data-modal-target={target || undefined}
						id={headingId}
						style={ACCORDION_TITLE_STYLE}
					>
						<button
							type="button"
							className="accordion-trigger"
							onClick={this.toggleExpanded}
							title={`${expanded ? 'Click to close' : 'Click to expand'}`}
							aria-expanded={expanded}
							aria-controls={contentId}
						>
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24" height="24"
								viewBox="0 0 24 24" fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="arrow accordion-chevron"
							>
								<path d="m6 9 6 6 6-6"></path>
							</svg>
							<span className="accordion-trigger-label">{headingContent}</span>
						</button>
					</h2>
				</header>
				{noCard ?
					<div
						ref={this.contentRef}
						id={contentId}
						className={`content ${expanded ? 'animate-accordion-down' : ''}`}
						data-state={expanded ? 'open' : 'closed'}
					>
						{hasInfo ? (
							<Info
								id={`info-${id}`}
								informationText={informationText}
								informationTextHTML={informationTextHTML}
							/>
						) : null}
						{renderedChildren}
					</div>
					:
					<Card
						ref={this.contentRef}
						id={contentId}
						className={`content w-full sortable mt-2 border border-t-0 rounded-t-none ${expanded ? 'animate-accordion-down' : ''}`}
						data-state={expanded ? 'open' : 'closed'}
					>
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
				}
			</section >
		);
	};
}
