import React, { PureComponent } from 'react';
import DOMPurify from "dompurify";

// Create a 2D grid filled with null values
const createEmptyGrid = (size) => {
	return Array.from({ length: size }, () => Array(size).fill(null));
};

// Place a word in the grid horizontally
const placeWordHorizontally = (grid, word, row, col) => {
	word.split('').forEach((char, i) => {
		grid[row][col + i] = char;
	});
};

// Place a word in the grid vertically
const placeWordVertically = (grid, word, row, col) => {
	word.split('').forEach((char, i) => {
		grid[row + i][col] = char;
	});
};

// Generate the crossword layout from given word pairs
const generateSimpleCrossword = (wordPairs) => {
	const gridSize = 20;
	const grid = createEmptyGrid(gridSize);
	const placements = [];

	const sortedPairs = [...wordPairs].sort((a, b) => b[0].length - a[0].length);
	const first = sortedPairs[0][0];
	const mid = Math.floor(gridSize / 2);
	const startCol = mid - Math.floor(first.length / 2);
	placeWordHorizontally(grid, first, mid, startCol);
	placements.push({ word: first, row: mid, col: startCol, dir: 'across' });

	const usedWords = [first];

	for (let i = 1; i < sortedPairs.length; i++) {
		const word = sortedPairs[i][0];
		let placed = false;

		for (const used of usedWords) {
			for (let j = 0; j < used.length; j++) {
				for (let k = 0; k < word.length; k++) {
					if (used[j] !== word[k]) continue;
					const usedPlacement = placements.find(p => p.word === used);
					if (!usedPlacement) continue;

					if (usedPlacement.dir === 'across') {
						const crossRow = usedPlacement.row - k;
						const crossCol = usedPlacement.col + j;
						if (crossRow < 0 || crossRow + word.length > gridSize) continue;

						let fits = true;
						for (let m = 0; m < word.length; m++) {
							const y = crossRow + m;
							const cell = grid[y][crossCol];
							if (cell !== null && cell !== word[m]) {
								fits = false;
								break;
							}
							if ((crossCol > 0 && grid[y][crossCol - 1] !== null) ||
								(crossCol < gridSize - 1 && grid[y][crossCol + 1] !== null)) {
								fits = false;
								break;
							}
						}
						if (crossRow > 0 && grid[crossRow - 1][crossCol] !== null) fits = false;
						if (crossRow + word.length < gridSize && grid[crossRow + word.length][crossCol] !== null) fits = false;

						if (fits) {
							placeWordVertically(grid, word, crossRow, crossCol);
							placements.push({ word, row: crossRow, col: crossCol, dir: 'down' });
							placed = true;
							break;
						}
					} else if (usedPlacement.dir === 'down') {
						const crossRow = usedPlacement.row + j;
						const crossCol = usedPlacement.col - k;
						if (crossCol < 0 || crossCol + word.length > gridSize) continue;

						let fits = true;
						for (let m = 0; m < word.length; m++) {
							const x = crossCol + m;
							const cell = grid[crossRow][x];
							if (cell !== null && cell !== word[m]) {
								fits = false;
								break;
							}
							// prevent vertical adjacency
							if ((crossRow > 0 && grid[crossRow - 1][x] !== null) ||
								(crossRow < gridSize - 1 && grid[crossRow + 1][x] !== null)) {
								fits = false;
								break;
							}
							// prevent horizontal adjacency at start and end
							if ((m === 0 && crossCol > 0 && grid[crossRow][crossCol - 1] !== null) ||
								(m === word.length - 1 && crossCol + word.length < gridSize && grid[crossRow][crossCol + word.length] !== null)) {
								fits = false;
								break;
							}
						}
						if (fits) {
							placeWordHorizontally(grid, word, crossRow, crossCol);
							placements.push({ word, row: crossRow, col: crossCol, dir: 'across' });
							placed = true;
							break;
						}
					}
				}
				if (placed) break;
			}
			if (placed) break;
		}

		if (!placed) {
			let retries = 3;
			while (!placed && retries-- > 0) {
				const randRow = Math.floor(Math.random() * (gridSize - word.length));
				const randCol = Math.floor(Math.random() * (gridSize - word.length));
				const horizontal = Math.random() > 0.5;
				let fits = true;
				for (let m = 0; m < word.length; m++) {
					const r = horizontal ? randRow : randRow + m;
					const c = horizontal ? randCol + m : randCol;
					if (grid[r][c] !== null) {
						fits = false;
						break;
					}
				}
				if (fits) {
					if (horizontal) {
						placeWordHorizontally(grid, word, randRow, randCol);
						placements.push({ word, row: randRow, col: randCol, dir: 'across' });
					} else {
						placeWordVertically(grid, word, randRow, randCol);
						placements.push({ word, row: randRow, col: randCol, dir: 'down' });
					}
					placed = true;
					break;
				}
			}

		} else {
			usedWords.push(word);
		}
	}

	let lastFilledRow = grid.length - 1;
	while (lastFilledRow >= 0 && grid[lastFilledRow].every(cell => cell === null)) {
		lastFilledRow--;
	}

	let lastFilledCol = grid[0].length - 1;
	while (lastFilledCol >= 0 && grid.every(row => row[lastFilledCol] === null)) {
		lastFilledCol--;
	}

	const trimmedGrid = grid.slice(0, lastFilledRow + 1).map(row => row.slice(0, lastFilledCol + 1));
	return { grid: trimmedGrid, placements };
};

export class CrossWord extends PureComponent {
	constructor(props) {
		super(props);
		const { config } = this.props;
		const { words } = config;
		this.wordPairs = words;
		const { grid, placements } = generateSimpleCrossword(this.wordPairs);
		this.state = ({
			selected: null,
			activeClueIndex: null,
			grid,
			placements,
			filled: createEmptyGrid(grid.length),
			...config
		});
	}

	handleChange = (e, row, col) => {
		const { placements } = this.state;
		const clueIndex = placements.findIndex(p => {
			if (p.dir === 'across') return p.row === row && col >= p.col && col < p.col + p.word.length;
			if (p.dir === 'down') return p.col === col && row >= p.row && row < p.row + p.word.length;
			return false;
		});
		if (clueIndex !== -1) {
			const placement = placements[clueIndex];
			const selected = [];
			for (let i = 0; i < placement.word.length; i++) {
				selected.push({
					row: placement.dir === 'across' ? placement.row : placement.row + i,
					col: placement.dir === 'across' ? placement.col + i : placement.col
				});
			}
			this.setState({ selected, activeClueIndex: clueIndex });
		}

		const val = e.target.value.slice(-1).toLowerCase();
		this.setState(prev => {
			const filled = prev.filled.map(r => [...r]);
			filled[row][col] = val;
			return { filled };
		});
	};

	getClues() {
		return this.wordPairs.map(([word, clue]) => ({ word, clue }));
	}

	render = () => {

		const {
			grid,
			filled,
			htmlContent,
			placements,
			// instructionsText,
			// instructionsTextHTML,
		} = this.state;
		const cellSize = 32;
		const clues = this.getClues();
		const numberedCells = new Map();
		placements.forEach((p, i) => {
			numberedCells.set(`${p.row},${p.col}`, i + 1);
		});
		// console.log("instructionsText", instructionsText);
		return (
			<div>
				<div className={`crossword-container`}>
					<div className={`instructions`}>
						{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}
					</div>
					<table className={`board`} style={{ borderCollapse: 'collapse' }}>
						<tbody>
							{grid.map((row, rIdx) => (
								<tr key={rIdx}>
									{row.map((cell, cIdx) => {

										const number = numberedCells.get(`${rIdx},${cIdx}`);
										return (
											<td
												key={cIdx}
												style={{
													width: cellSize,
													height: cellSize,
													border: cell ? '1px solid var(--border)' : '1px solid var(--foreground)',
													backgroundColor: cell ? 'var(--background)' : 'var(--muted)',
													textAlign: 'center',
													padding: 0,
													position: 'relative'
												}}
											>
												{number && (
													<div className="text-muted-foreground" style={{ position: 'absolute', top: 1, left: 2, fontSize: 'calc(var(--font-size-sm) * 0.625)' }}>{number}</div>
												)}
												{cell ? (
													<input data-row={rIdx} data-col={cIdx}
														type="text"
														maxLength={1}
														value={filled[rIdx][cIdx] ?? ''}
														onChange={e => this.handleChange(e, rIdx, cIdx)}
														onKeyUp={e => {
															const val = e.target.value;
															if (val && val.length === 1) {
																const dir = this.state.placements.find(p => {
																	return p.row === rIdx && p.col <= cIdx && p.col + p.word.length > cIdx && p.dir === 'across';
																}) ? 'across' : 'down';
																const nextRow = dir === 'across' ? rIdx : rIdx + 1;
																const nextCol = dir === 'across' ? cIdx + 1 : cIdx;
																const nextInput = document.querySelector(
																	`input[data-row='${nextRow}'][data-col='${nextCol}']`
																);
																if (nextInput) nextInput.focus();
															}
														}}
														style={{
															width: '100%',
															height: '100%',
															border: 'none',
															textAlign: 'center',
															fontSize: 'var(--font-size-sm)',
															backgroundColor:
															(filled[rIdx][cIdx] || '').toLowerCase() ===
															(grid[rIdx][cIdx] || '').toLowerCase()
																? 'color-mix(in oklab, var(--chart-2) 25%, transparent)'
																: filled[rIdx][cIdx]
																	? 'color-mix(in oklab, var(--destructive) 20%, transparent)'
																	: 'transparent'
														}}
													/>
												) : null}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
					<div className={`clues`} >
						<h4>Clues</h4>
						<ol>
							{placements.map((placement, i) => {
								const clue = clues.find(c => c.word === placement.word);
								if (!clue) return null;
								return (
									<li key={i}>
										{clue.clue} ({placement.dir})
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</div>
		);
	};
}
