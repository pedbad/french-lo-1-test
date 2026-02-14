import React, { PureComponent } from 'react';

const TREASURE_GRID_MESSAGE_TEXT_CLASS = "text-[calc(var(--font-size-sm)*1.2)] font-bold";

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
			<div className="mx-auto max-w-[600px] p-4 text-center">
				<h2>Translation Treasure Grid</h2>
				<p>Follow the translation trail to find the treasure! Start at "chat".</p>
				<div className="mx-auto my-4 grid grid-cols-5 gap-2">
					{gridData.map((row, rIdx) =>
						row.map((cell, cIdx) => (
							<div
								key={`${rIdx}-${cIdx}`}
								className={`cursor-pointer select-none rounded-[6px] border-2 border-[var(--border)] bg-[var(--muted)] p-[0.8rem] transition-all duration-200 ease-in-out hover:bg-[var(--accent)] ${this.isInPath(rIdx, cIdx) ? 'selected border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_25%,var(--card))] font-bold' : ''}`}
								onClick={() => this.handleClick(rIdx, cIdx)}
							>
								{cell}
							</div>
						))
					)}
				</div>
				{this.state.message && <p className={`mt-4 text-[var(--foreground)] ${TREASURE_GRID_MESSAGE_TEXT_CLASS}`}>{this.state.message}</p>}
			</div>
			);
		};
}
