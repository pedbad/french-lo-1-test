import React from 'react';

const HEADER_TEXT_CLASS = "leading-[calc(var(--font-size-sm)*3)]";
const HEADER_CONTAINER_CLASS = "header-main-surface block w-full text-center text-primary-foreground m-0";
const HEADER_TITLE_CLASS = "m-0";

export class Header extends React.PureComponent {

	render = () => {
		return (
			<header className={`${HEADER_CONTAINER_CLASS} ${HEADER_TEXT_CLASS}`}>
				<h1 className={HEADER_TITLE_CLASS}>Cambridge University Language Centre Learning Objects</h1>
			</header>
		);
	};
}
