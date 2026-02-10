import './Info.scss';
import DOMPurify from "dompurify";
import React from 'react';

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
		const infoIcon = <span className="info-icon" aria-hidden="true" />;

		if (informationTextHTML) {
			return (
				<div
					className={`information`}
					id={`${id}-Info`}
				>
					{infoIcon}
					<div className={`info-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(informationTextHTML) }}/>
				</div>
			);
		} else if (informationText) {
			return (
				<div
					className={`information`}
					id={`${id}-Info`}
				>
					{infoIcon}
					<div className={`info-content`}>
						{informationText ? informationText : null}
					</div>
				</div>
			);
		} else if (children) {
			return (
				<div
					className={`information`}
					id={`${id}-Info`}
				>
					{infoIcon}
					<div className={`info-content`}>
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
