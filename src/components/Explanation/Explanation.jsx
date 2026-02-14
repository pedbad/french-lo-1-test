import './Explanation.scss';
// import {
// 	resolveAsset,
// 	speak,
// } from '../../utility';
import DOMPurify from "dompurify";
import { Panel } from "./Panel";
import React from 'react';

export class Explanation extends React.PureComponent {
	// This was intended as a way to allow custom content to be included in a config.json file.
	// However, it's hard to work with a single line of HTML and although I've used it elsewhere too, dangerouslySetInnerHTML
	// is not a recommended practise. So as an alternative, I created CustomComponents where a custom component can be made as a more
	// readable JSX content with images and individual styling, it can still be accessed by using a config.json tag such as:
	// "customComponent1": {
	// 	"component": "LO9Grammar", // There must be a CustomComponet with this name present. "LO9" is the learning object, "Grammar" aludes to the section within the page.
	// 	"id": "LO9Grammar", // Good practise to have the ID match the component name
	// 	"titleText": "Grammar and Usage"
	// },

	constructor(props) {
		super(props);
	}

	render = () => {
		const { config } = this.props;
		const {
			content = [],
			htmlContent,
			id
		} = config;
		const contents = [];
		if (content.length) {
			for (let i = 0; i < content.length; i++) {
				contents.push(
					<Panel id={`${id}-${i}`} content={content[i]} key={`${id}-Panel${i}`}></Panel>
				);
			}
		}
		return (
			<div
				className={`explanation-container container`}
				id={id || undefined}
				key={`${id}PhraseTable`}
			>
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

				{contents}
			</div>
		);
	};
}
