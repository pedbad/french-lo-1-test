import './Info.scss';
import DOMPurify from "dompurify";
import { Info as InfoIcon } from "lucide-react";
import React from 'react';

const INFO_CONTENT_TEXT_CLASS = "info-content text-sm leading-[var(--line-height-body)] [&_li]:text-sm [&_li]:leading-[var(--line-height-body)] [&_h3]:mt-0 [&_h3]:text-base [&_h3]:leading-[var(--line-height-app)] [&_h4]:mt-0 [&_h4]:text-sm";

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
			<span className="info-icon text-[var(--font-size-base)]" aria-hidden="true">
				<InfoIcon className="info-icon__svg" />
			</span>
		);

		if (informationTextHTML) {
			return (
				<div
					className="information"
					id={infoId}
				>
					{infoIcon}
					<div className={INFO_CONTENT_TEXT_CLASS} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(informationTextHTML) }}/>
				</div>
			);
		} else if (informationText) {
			return (
				<div
					className="information"
					id={infoId}
				>
					{infoIcon}
					<div className={INFO_CONTENT_TEXT_CLASS}>
						{informationText ? informationText : null}
					</div>
				</div>
			);
		} else if (children) {
			return (
				<div
					className="information"
					id={infoId}
				>
					{infoIcon}
					<div className={INFO_CONTENT_TEXT_CLASS}>
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
