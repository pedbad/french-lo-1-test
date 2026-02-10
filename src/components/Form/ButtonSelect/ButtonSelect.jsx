import React from "react";

export class ButtonSelect extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = ({
			expanded: false,
		});

		// this.handleClick = this.handleClick.bind(this);
	}

	handleClick = () => {
		this.setState({
			expanded: !this.state.expanded
		});
	};

	closeMenu = () => {
		this.setState({
			expanded: false,
		});
	};

	render() {
		const { children, className = '', id = '', title = '' } = this.props;
		const { expanded } = this.state;
		return (
			<button
				className={`${className} button-select ${expanded ? 'expanded' : ''}`}
				id={`${id ? id : ''}`}
				title={`${title ? title : ''}`}
				onClick={this.handleClick}
				onMouseLeave={this.closeMenu}
			>
				{children}
			</button >
		);
	}
};