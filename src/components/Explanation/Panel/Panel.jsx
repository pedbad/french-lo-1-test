import './Panel.scss';
import DOMPurify from "dompurify";
import React from 'react';
import { resolveAssetHTML } from '../../../utility.js';

export class Panel extends React.PureComponent {

	render = () => {

		const {
			content,
			id,
		} = this.props;


		return (
			<div
				className={`panel`}
				dangerouslySetInnerHTML={{ __html: resolveAssetHTML(content) }}
				id={`${id ? `${id}Panel` : ''}`}
				key={`${id}PhraseTable`}
			>
			</div>
		);
	};
}
