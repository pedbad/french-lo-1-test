import './LandingPage.scss';
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
						className={`card`}
						key={`card-${index}`}>
						<a
							href={`${baseURL}?lang=${languageCode}&lo=${learningObject.file}`}
							onClick={() => this.selectLearningObject(index)}
							target={`_blank`}
						>
							<h1>{learningObject.title}</h1>
						</a>
					</li>
				);
			});

			return (
				<>
					<h1>Landing page!</h1>
					<p>Yada yada yada.</p>
					<ul className={`landing-page`}>
						{cards}
					</ul>
				</>
			);
		}
	};
}
