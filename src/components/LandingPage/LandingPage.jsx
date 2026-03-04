import React from 'react';

export class LandingPage extends React.Component{

	buildLearningObjectURL = (learningObject, learningObjects = []) => {
		const pathSegments = window.location.pathname.split('/').filter(Boolean);
		const knownSlugs = new Set(
			learningObjects
				.map((entry) => `${entry?.slug || ''}`.trim().toLowerCase())
				.filter(Boolean),
		);
		if (pathSegments.length > 0) {
			const lastSegment = decodeURIComponent(pathSegments[pathSegments.length - 1]).trim().toLowerCase();
			if (knownSlugs.has(lastSegment)) {
				pathSegments.pop();
			}
		}

		const slug = `${learningObject?.slug || learningObject?.file || ''}`.trim();
		const basePath = `/${pathSegments.join('/')}${pathSegments.length ? '/' : '/'}`;
		return `${window.location.origin}${basePath}${encodeURIComponent(slug)}/`;
	};

	render = () => {
		const {
			learningObjects = []
		} = this.props;
		// console.log("LandingPage learningObjects", learningObjects.length);
		if (learningObjects.length > 0) {
			const cards = []; // [];
			learningObjects.forEach((learningObject, index) => {
				cards.push(
					<li
						className="flex h-[300px] w-[300px] rounded-[20px] border border-[rgb(var(--color-border-subtle)/1)] bg-[linear-gradient(180deg,var(--primary)_0%,var(--destructive)_100%)] hover:bg-[linear-gradient(180deg,var(--destructive)_0%,var(--primary)_100%)]"
						key={`card-${index}`}>
						<a
							className="flex h-full w-full flex-col items-center justify-between p-5 text-center !no-underline"
							href={this.buildLearningObjectURL(learningObject, learningObjects)}
							onClick={() => this.selectLearningObject(index)}
							target={`_blank`}
						>
							<h1 className="font-bold text-[var(--primary-foreground)]">{learningObject.title}</h1>
						</a>
					</li>
				);
			});

			return (
				<>
					<h1>Landing page!</h1>
					<p>Yada yada yada.</p>
					<ul className="landing-page flex flex-row flex-wrap justify-center gap-x-5 gap-y-5">
						{cards}
					</ul>
				</>
			);
		}
	};
}
