import './TreasureGrid.scss';
import React, { PureComponent } from 'react';
import Colours from '../../styles/colours.module.scss';

const gridData = [
	["livre", "pomme", "maison", "chat", "ciel"],
	["apple", "sky", "house", "book", "cat"],
	["chien", "soleil", "voiture", "oiseau", "pain"],
	["car", "dog", "sun", "bread", "bird"],
	["mer", "fenêtre", "table", "arbre", "chaise"]
];



const correctPath = [
	[0, 3], // "chat"
	[1, 4], // "cat"
	[2, 0], // "chien"
	[3, 1] // "dog"
];

export class TreasureGrid extends PureComponent {
	constructor(props) {
		super(props);
		this.state = ({
			path: [],
			message: ''
		});
	}

	handleClick = (row, col) => {
		const newPath = [...this.state.path, [row, col]];

		const correct = correctPath.slice(0, newPath.length);
		const isMatch = newPath.every(([r, c], i) => correct[i] && correct[i][0] === r && correct[i][1] === c);

		if (!isMatch) {
			this.setState({ message: '❌ Incorrect path! Try again.' });
			setTimeout(() => {
				this.setState({ path: [], message: '' });
			}, 1000);
		} else {
			const msg = newPath.length === correctPath.length ? '🎉 You found the treasure path!' : '';
			this.setState({ path: newPath, message: msg });
		}
	};

	isInPath = (row, col) => {
		return this.state.path.some(([r, c]) => r === row && c === col);
	};

	render = () => {
		return (
			<div className="treasure-grid">
				<h2>Translation Treasure Grid</h2>
				<p>Follow the translation trail to find the treasure! Start at "chat".</p>
				<div className="grid">
					{gridData.map((row, rIdx) =>
						row.map((cell, cIdx) => (
							<div
								key={`${rIdx}-${cIdx}`}
								className={`cell ${this.isInPath(rIdx, cIdx) ? 'selected' : ''}`}
								onClick={() => this.handleClick(rIdx, cIdx)}
							>
								{cell}
							</div>
						))
					)}
				</div>
				{this.state.message && <p className="message">{this.state.message}</p>}
			</div>
		);
	};
}