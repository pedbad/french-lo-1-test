import './LearningObjectMenu.scss';
import React from 'react';

export class LearningObjectMenu extends React.Component {
	render = () => {
		// console.log("LearningObjectMenu render");
		const {
			currentLearningObject = 0,
			languageCode,
			learningObjects
		} = this.props;
		const renderedMenu = [];
		if (learningObjects !== undefined) {
			// const nLearningObjects = learningObjects.length;
			const { href } = window.location;
			const [baseURL] = href.split('?');
			learningObjects.forEach((learningObject, index) => {
				renderedMenu.push(
					<li
						className={`menu-item ${currentLearningObject === index ? 'highlight' : ''}`}
						key={`menu-item-${index}`}>
						<a
							href={`${baseURL}?lang=${languageCode}&lo=${learningObject.file}`}
							onClick={() => this.selectLearningObject(index)}
						>{index <= 14 ? index + 1 : index === 15 ? 'Demo' : "Answer"}</a>
					</li>
				);
			}
			);
		}
		return (
			<ul id={`learningObjectMenu`} className={`lo-menu`}>
				{renderedMenu}
			</ul>
		);
	};
}

