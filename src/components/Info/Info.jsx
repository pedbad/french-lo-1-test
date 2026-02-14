import DOMPurify from "dompurify";
import { Info as InfoIcon } from "lucide-react";
import React from 'react';

const INFO_CONTAINER_CLASS = "information relative mt-1 flex items-start gap-[0.4rem] rounded-[0.6rem] border-2 border-[rgb(var(--color-primary-400)/1)] bg-[rgb(var(--color-primary-50)/1)] p-[12px_16px] text-[var(--primary)]";
const INFO_CONTENT_TEXT_CLASS = "info-content text-sm leading-[var(--line-height-body)] [&_li]:text-sm [&_li]:leading-[var(--line-height-body)] [&_h3]:mt-0 [&_h3]:text-base [&_h3]:leading-[var(--line-height-app)] [&_h4]:mt-0 [&_h4]:text-sm";
const INFO_CONTENT_SPACING_CLASS = "[&_li]:mt-[0.3rem]";
const INFO_ICON_CLASS = "info-icon mt-[-0.1em] inline-flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--font-size-base)]";
const INFO_ICON_SVG_CLASS = "info-icon__svg h-[1.4em] w-[1.4em] text-[var(--background)] [stroke-width:3.4] [&_circle]:hidden";

export class Info extends React.PureComponent {
	// constructor(props) {
	// 	super(props);

	// 	this.state = ({
	// 		showInfo: false,
	// 	});

	// }

	render = () => {

		const {
			children,
			id,
			informationText,
			informationTextHTML,
		} = this.props;
		const infoId = id ? `${id}-Info` : undefined;
		// console.log("informationText", informationText);
		// console.log("informationTextHTML", informationTextHTML);
		// console.log("children", children);

		// return (
		// 	<>
		{/* <button
					alt='i'
					className={`button-info`}
					onClick={() => this.setState({ showInfo: true })}
					title={'More information'}
				>i</button> */}
		const infoIcon = (
			<span aria-hidden="true" className={INFO_ICON_CLASS}>
				<InfoIcon className={INFO_ICON_SVG_CLASS} />
			</span>
		);

		if (informationTextHTML) {
			return (
				<div
					className={INFO_CONTAINER_CLASS}
					id={infoId}
				>
					{infoIcon}
					<div className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(informationTextHTML) }}/>
				</div>
			);
		} else if (informationText) {
			return (
				<div
					className={INFO_CONTAINER_CLASS}
					id={infoId}
				>
					{infoIcon}
					<div className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
						{informationText ? informationText : null}
					</div>
				</div>
			);
		} else if (children) {
			return (
				<div
					className={INFO_CONTAINER_CLASS}
					id={infoId}
				>
					{infoIcon}
					<div className={`${INFO_CONTENT_TEXT_CLASS} ${INFO_CONTENT_SPACING_CLASS}`}>
						{children}
					</div>
				</div>
			);

		} else {
			// return (
			// 	<h1>INFO ERROR!</h1>
			// );
		}
	};
}
