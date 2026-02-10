import './Header.scss';
import React from 'react';

export class Header extends React.PureComponent {

	render = () => {
		return (
			<header className={`main-header`}>
				<h1>Cambridge University Language Centre Learning Objects</h1>
			</header>
		);
	};
}

