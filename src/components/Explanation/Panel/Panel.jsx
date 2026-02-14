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
				className="panel mt-4 w-[calc(100%-2rem)] p-4"
				dangerouslySetInnerHTML={{ __html: resolveAssetHTML(content) }}
				id={id ? `${id}Panel` : undefined}
				key={`${id}PhraseTable`}
			>
			</div>
		);
	};
}
