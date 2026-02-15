import React from 'react';

export class LearningObjectMenu extends React.Component {
	selectLearningObject = (index) => {
		const { onSelectLearningObject } = this.props;
		if (typeof onSelectLearningObject === 'function') {
			onSelectLearningObject(index);
		}
	};

	render = () => {
		const {
			currentLearningObject = 0,
			appHrefBase,
			languageCode,
			learningObjects
		} = this.props;
		const renderedMenu = [];
		if (learningObjects !== undefined) {
			const defaultAppHrefBase = `${window.location.origin}${import.meta.env.BASE_URL}`;
			const baseURL = appHrefBase || defaultAppHrefBase;
			learningObjects.forEach((learningObject, index) => {
				renderedMenu.push(
					<li
						className={`menu-item m-1 indent-0 rounded-lg font-bold no-underline ${currentLearningObject === index ? 'highlight' : ''}`}
						key={`menu-item-${index}`}>
						<a
							className="inline-block h-full w-full box-border rounded-lg bg-[var(--primary)] px-4 py-2 text-center font-bold text-[var(--primary-foreground)] no-underline visited:text-[var(--primary-foreground)]"
							href={`${baseURL}?lang=${languageCode}&lo=${learningObject.file}`}
							onClick={() => this.selectLearningObject(index)}
						>{index <= 14 ? index + 1 : index === 15 ? 'Demo' : "Answer"}</a>
					</li>
				);
			});
		}
		return (
			<ul id={`learningObjectMenu`} className={`lo-menu mb-2 w-full flex-row flex-wrap items-center justify-evenly list-none p-0`}>
				{renderedMenu}
			</ul>
		);
	};
}
