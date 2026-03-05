import React from 'react';

export class LearningObjectMenu extends React.Component {
	getLearningObjectLabel = (learningObject, index) => {
		const slug = String(learningObject?.slug ?? '');
		const friendlyTitle = learningObject?.titleShort || learningObject?.title || '';
		if (slug === 'demo') {
			return { badge: 'Demo', title: friendlyTitle || 'Sample components' };
		}
		if (slug === 'answer-table-test') {
			return { badge: 'Answer', title: friendlyTitle || 'Answer table test' };
		}
		return { badge: `LO ${String(index + 1).padStart(2, '0')}`, title: friendlyTitle || `Learning Object ${index + 1}` };
	};

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
			learningObjects
		} = this.props;
		const renderedMenu = [];
		if (learningObjects !== undefined) {
			const defaultAppHrefBase = `${window.location.origin}${import.meta.env.BASE_URL}`;
			const baseURL = appHrefBase || defaultAppHrefBase;
			const basePath = new URL(baseURL).pathname;
			learningObjects.forEach((learningObject, index) => {
				const { badge, title } = this.getLearningObjectLabel(learningObject, index);
				const loPath = `${basePath}${basePath.endsWith('/') ? '' : '/'}${encodeURIComponent(learningObject.slug)}/`;
				renderedMenu.push(
					<li
						className={`menu-item m-1 indent-0 rounded-lg no-underline ${currentLearningObject === index ? 'highlight' : ''}`}
						key={`menu-item-${index}`}>
						<a
							aria-label={`Open ${badge}: ${title}`}
							className="inline-flex min-h-16 w-56 flex-col justify-center rounded-lg border border-[color-mix(in_oklab,var(--primary)_75%,var(--foreground))] bg-[var(--primary)] px-3 py-2 text-left text-[var(--primary-foreground)] no-underline shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] visited:text-[var(--primary-foreground)]"
							href={loPath}
							onClick={() => this.selectLearningObject(index)}
						>
							<span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] opacity-85">{badge}</span>
							<span className="mt-1 text-sm font-bold leading-tight">{title}</span>
						</a>
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
