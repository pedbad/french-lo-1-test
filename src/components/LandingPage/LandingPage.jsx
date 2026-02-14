import React from 'react';

export class LandingPage extends React.Component{

	render = () => {
		const {
			languageCode,
			learningObjects = []
		} = this.props;
		// console.log("LandingPage learningObjects", learningObjects.length);
		const { href } = window.location;
		const [baseURL] = href.split('?');
		if (learningObjects.length > 0) {
			const cards = []; // [];
			learningObjects.forEach((learningObject, index) => {
				cards.push(
					<li
						className="flex h-[300px] w-[300px] rounded-[20px] border border-[rgb(var(--color-border-subtle)/1)] bg-[linear-gradient(180deg,var(--primary)_0%,var(--destructive)_100%)] hover:bg-[linear-gradient(180deg,var(--destructive)_0%,var(--primary)_100%)]"
						key={`card-${index}`}>
						<a
							className="flex h-full w-full flex-col items-center justify-between p-5 text-center !no-underline"
							href={`${baseURL}?lang=${languageCode}&lo=${learningObject.file}`}
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
