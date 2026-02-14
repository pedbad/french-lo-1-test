import './Header.scss';
import React from 'react';

const HEADER_TEXT_CLASS = "leading-[calc(var(--font-size-sm)*3)]";

export class Header extends React.PureComponent {

	render = () => {
		return (
			<header className={`main-header ${HEADER_TEXT_CLASS}`}>
				<h1>Cambridge University Language Centre Learning Objects</h1>
			</header>
		);
	};
}
