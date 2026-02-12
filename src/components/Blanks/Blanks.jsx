import './Blanks.scss';
import {
	AudioClip,
	// ConcatenatedPlaylist,
	CircularAudioProgressAnimatedSpeakerDisplay,
	IconButton,
	Info,
	SequenceAudioController,
	Word,
} from '../../components';
import { resolveAsset, shuffleArray } from '../../utility';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import { Label } from "@/components/ui/label";
import React from 'react';
import { Switch } from "@/components/ui/switch";

const BLANKS_TARGET_BOARD_TEXT_CLASS = "text-[1.2rem] font-bold";
const BLANKS_TARGET_TABLE_TEXT_CLASS = "text-base";
const BLANKS_CONTENT_FLOW_CLASS = "leading-[1.4em]";
const BLANKS_WORDS_CONTAINER_FLOW_CLASS = "leading-[0.5rem] sm:leading-[3.5rem]";

export class Blanks extends React.Component {

	// Stores original "home" positions for each tile (coords relative to words-container)
	// Keyed by the first class on the tile: "word{index}"
	tileHomePositions = {};

	constructor(props) {
		super(props);

		this.sequenceRef = React.createRef();
		this.wordsContainerRef = React.createRef();

		const { config } = props;
		const { answers, blanksType, id, items, pictures, questions } = config;
		const { words = [] } = config;

		let wordTiles = [];
		let nToPlace = 0;
		let mixer = [];

		switch (blanksType) {
			case 'phrases': {
				let wordTileIndex = 0;
				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const phraseSplit = item.text.match(/\[[^\]]+\]|\S+/g);
					for (let j = 0; j < phraseSplit.length; j++) {
						if (phraseSplit[j][0] === '[') {
							const cleaned = phraseSplit[j].replace('[', '').replace(']', '');
							wordTiles.push(
								<Word className={`blank draggable`} index={wordTileIndex} key={`${id}word${wordTileIndex + 1}`}>
									{cleaned}
								</Word>
							);
							wordTileIndex++;
							words.push(cleaned);
							nToPlace++;
						}
					}
				}
				wordTiles = shuffleArray(wordTiles);
				break;
			}
			case 'group-table': {
				nToPlace = words.length;
				for (let i = 0; i < nToPlace; i++) {
					wordTiles.push(
						<Word className={`blank draggable visiblekey-${id}word${i}`} index={i} key={`${id}word${i}`}>
							{words[i]}
						</Word>
					);
				}
				wordTiles = shuffleArray(wordTiles);
				break;
			}
			case 'table': {
				nToPlace = words.length;
				for (let i = 0; i < nToPlace; i++) {
					wordTiles.push(
						<Word className={`blank draggable`} index={i} key={`${id}word${i}`}>
							{words[i]}
						</Word>
					);
				}
				wordTiles = shuffleArray(wordTiles);
				break;
			}
			case "pictures-answers": {
				nToPlace = pictures.length;
				for (let i = 0; i < nToPlace; i++) mixer.push([i, answers[i]]);
				mixer = shuffleArray(mixer);
				for (let i = 0; i < nToPlace; i++) {
					wordTiles.push(
						<Word className={`blank draggable`} index={mixer[i][0]} key={`${id}word${i}`}>
							{mixer[i][1]}
						</Word>
					);
				}
				break;
			}
			case "questions-answers": {
				nToPlace = questions.length;
				for (let i = 0; i < nToPlace; i++) mixer.push([i, answers[i]]);
				mixer = shuffleArray(mixer);
				for (let i = 0; i < nToPlace; i++) {
					wordTiles.push(
						<Word className={`blank draggable`} index={mixer[i][0]} key={`${id}word${i}`}>
							{mixer[i][1]}
						</Word>
					);
				}
				break;
			}
			default:
				break;
		}

		this.state = {
			...config,
			id,
			margin: 20,
			nToPlace,
			showHints: false,
			wordTiles,
			words,

			activeRowIndex: -1,
			masterPlayState: "stopped",
			rowProgress: {},
		};
	}

	componentDidMount() {
		document.addEventListener(
			"touchmove",
			(e) => {
				if (this.movingPiece) e.preventDefault();
			},
			{ passive: false }
		);
	}

	componentDidUpdate(prevProps) {
		const prevId = prevProps?.config?.id;
		const nextId = this.props?.config?.id;

		const idChanged = (prevId !== undefined && nextId !== undefined && prevId !== nextId);
		const configRefChanged = prevProps.config !== this.props.config;

		if (idChanged || configRefChanged) {
			this.tileHomePositions = {};
		}
	}

	// ---------- Helpers ----------

	getTileKey = (tileEl) => tileEl?.classList?.[0]; // "word{index}"

	getWordsContainerRect = () => {
		const wc = this.wordsContainerRef.current;
		return wc ? wc.getBoundingClientRect() : null;
	};

	getMouseInWordsContainer = (e) => {
		const r = this.getWordsContainerRect();
		if (!r) return { x: 0, y: 0 };
		return {
			x: e.clientX - r.left,
			y: e.clientY - r.top,
		};
	};

	ensureHomePositions = () => {
		if (!this.tileHomePositions || Object.keys(this.tileHomePositions).length === 0) {
			this.pinTiles();
		}
	};

	// ---------- Core actions ----------

	autoSolve = () => {
		const { id, nToPlace, firstMouseDown = true } = this.state;

		// Ensure tiles have been pinned to absolute positions so left/top animations work
		if (firstMouseDown) {
			this.setState({ firstMouseDown: false });

			const wc = this.wordsContainerRef.current;
			if (wc) {
			// Stable containing block for absolute children
				wc.style.position = "relative";

				// Freeze container size to prevent reflow after pinning
				const { width, height } = window.getComputedStyle(wc);
				wc.style.width = width;
				wc.style.height = height;
			}

			this.pinTiles(); // your two-pass pinning (records home positions too)
		}

		const wc = this.wordsContainerRef.current;
		if (!wc) return;

		const wcRect = wc.getBoundingClientRect();

		// Animate each still-draggable tile to its matching target and KEEP it visible.
		const tiles = document.querySelectorAll(`#${id} .words-container .word.draggable`);

		tiles.forEach((tile) => {
			const key = this.getTileKey(tile); // e.g. "word3"
			if (!key) return;

			const targetWord = document.querySelector(`#${id} .target.${key}`);
			if (!targetWord) return;

			const tRect = targetWord.getBoundingClientRect();

			// Convert viewport coords -> words-container coords
			const targetLeft = tRect.left - wcRect.left;
			const targetTop = tRect.top - wcRect.top;

			// Make sure it's visible and animatable
			tile.style.opacity = "1";
			tile.style.position = "absolute";

			// Apply transition (left/top driven by your CSS too, but inline is safest here)
			tile.style.transition = "left 1s, top 1s, box-shadow 1s, opacity 1s";
			tile.classList.add("returning");

			// Force reflow so the transition is applied
			void tile.offsetWidth;

			// Animate into place
			tile.style.left = `${targetLeft}px`;
			tile.style.top = `${targetTop}px`;

			const onDone = (e) => {
			// Only finalize once the movement finishes
				if (e.propertyName !== "left" && e.propertyName !== "top") return;

				tile.classList.remove("draggable");
				tile.classList.remove("dragging");
				tile.classList.add("placed");
				tile.classList.remove("returning");

				// Ensure it stays visible and can't be dragged again
				tile.style.opacity = "1";
				tile.style.pointerEvents = "none";

				tile.removeEventListener("transitionend", onDone);
			};

			tile.addEventListener("transitionend", onDone);
		});

		// Update completion state so Reset appears immediately
		this.setState({
			nPlaced: nToPlace,
			complete: true,
		});
	};

	handleToggle = (value) => {
		this.setState({ showHints: value });
	};

	handleMasterStopped = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;

		this.setState((prev) => ({
			activeRowIndex: -1,
			masterPlayState: "stopped",
			rowProgress: rowIndex >= 0 ? {
				...prev.rowProgress,
				[rowIndex]: {
					currentTime: 0,
					duration: prev.rowProgress[rowIndex]?.duration || 0
				},
			} : prev.rowProgress
		}));
	};

	handleMasterPlayStateChange = (playState) => {
		this.setState({ masterPlayState: playState });
	};

	handleMasterTrackChange = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
		this.setState({ activeRowIndex: rowIndex });
	};

	handleMasterTime = (playlistIndex, currentTime, duration, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex;
		if (rowIndex === undefined) return;

		this.setState((prev) => ({
			rowProgress: {
				...prev.rowProgress,
				[rowIndex]: { currentTime, duration },
			},
		}));
	};

	// ---------- Drag handling (now in words-container coordinate space) ----------

	handleMouseDown = (e) => {
		// Let interactive controls behave normally
		if (this.isInteractiveElement(e.target)) return;

		// Only left click for mouse (pointer events sometimes show button=0 always; keep permissive)
		if (e.button && e.button !== 0) return;

		e.preventDefault();
		e.stopPropagation();

		const { id, firstMouseDown = true } = this.state;

		if (firstMouseDown) {
			this.setState({ firstMouseDown: false });

			// Ensure stable containing block for absolute children
			if (this.wordsContainerRef.current) {
				this.wordsContainerRef.current.style.position = "relative";
			}

			// Fix container size (so reflow doesn’t change home coords)
			const { width, height } = window.getComputedStyle(this.wordsContainerRef.current);
			this.wordsContainerRef.current.style.width = width;
			this.wordsContainerRef.current.style.height = height;

			this.pinTiles();
		}

		let { target } = e;
		if (!target.classList.contains('draggable')) target = target.parentElement;

		if (target.classList.contains('word') && target.classList.contains('draggable')) {
			this.movingPiece = target;

			const cl = this.movingPiece.classList;
			const startWord = document.querySelector(`#${id} .words-container .draggable.${cl[0]}`);

			if (startWord) {
				// Starting point (home) in words-container coords
				const key = this.getTileKey(startWord);
				const home = this.tileHomePositions[key];
				if (home) {
					this.startX = parseFloat(home.left);
					this.startY = parseFloat(home.top);
				} else {
					// fallback
					this.startX = startWord.offsetLeft;
					this.startY = startWord.offsetTop;
				}

				// Place tile center under pointer in words-container coords
				const { x, y } = this.getMouseInWordsContainer(e);
				const rect = this.movingPiece.getBoundingClientRect();
				const left = x - rect.width / 2;
				const top = y - rect.height / 2;

				this.movingPiece.style.left = `${left}px`;
				this.movingPiece.style.top = `${top}px`;
				this.movingPiece.classList.add("dragging");
			}
		}
	};

	handleMouseMove = (e) => {
		if (this.isInteractiveElement(e.target)) return;

		if (this.movingPiece && this.movingPiece.classList.contains("dragging")) {
			e.preventDefault();

			const { x, y } = this.getMouseInWordsContainer(e);
			const rect = this.movingPiece.getBoundingClientRect();

			const left = x - rect.width / 2;
			const top = y - rect.height / 2;

			this.movingPiece.style.left = `${left}px`;
			this.movingPiece.style.top = `${top}px`;

			const { success, overTarget, targetWord } = this.inLimits();

			if (success) {
				this.movingPiece.classList.add('highlight', 'success');
				this.clearTargetHighlights();
				targetWord ? targetWord.classList.add('highlight') : null;
			} else if (overTarget) {
				this.movingPiece.classList.add('highlight');
				this.movingPiece.classList.remove('success');
				targetWord ? targetWord.classList.add('highlight') : null;
			} else {
				this.movingPiece.classList.remove('highlight', 'success');
				this.clearTargetHighlights();
			}
		}
	};

	handleMouseUp = (e) => {
		e.stopPropagation();

		const clickAudio = new Audio(resolveAsset('/sounds/click.mp3'));
		let { failCount = 0 } = this.state;

		if (this.movingPiece !== undefined) {
			const { nToPlace } = this.state;
			let { nPlaced = 0 } = this.state;

			const inLimitsResult = this.inLimits();
			this.movingPiece.classList.remove('highlight');

			if (inLimitsResult.success) {
				const { targetLeft, targetTop } = inLimitsResult;

				clickAudio.play();

				this.movingPiece.style.left = `${targetLeft}px`;
				this.movingPiece.style.top = `${targetTop}px`;

				this.movingPiece.classList.remove("dragging");
				this.movingPiece.classList.remove("returning");
				this.movingPiece.classList.add("placed");
				this.movingPiece.classList.remove("draggable");

				// keep it visible
				this.movingPiece.style.opacity = "1";

				this.movingPiece = undefined;

				nPlaced++;
				if (nPlaced === nToPlace) {
					this.setState({ complete: true });
				}
				this.setState({ nPlaced });
			}			else {
				this.movingPiece.classList.remove("dragging");
				this.movingPiece.classList.add("returning");

				this.movingPiece.style.left = `${this.startX}px`;
				this.movingPiece.style.top = `${this.startY}px`;

				failCount++;
				this.setState({ failCount });

				setTimeout(() => {
					if (this.movingPiece) {
						this.movingPiece.classList.remove("returning");
						this.movingPiece = undefined;
					}
				}, 1000);
			}
		}

		this.clearTargetHighlights();
	};

	clearTargetHighlights = () => {
		const { id } = this.state;
		const targetWords = document.querySelectorAll(`#${id} .target.word`);
		targetWords.forEach((tw) => tw.classList.remove('highlight'));
	};

	// ---------- Reset (no jump, no top-left flash) ----------

	handleReset = () => {
		const { id } = this.state;

		this.ensureHomePositions();

		const wc = this.wordsContainerRef.current;
		if (!wc) return;

		// container rect for freezing current positions
		const wcRect = wc.getBoundingClientRect();

		const tiles = document.querySelectorAll(`#${id} .words-container .word`);

		tiles.forEach((tile) => {
			const key = this.getTileKey(tile);
			const home = this.tileHomePositions[key];
			if (!home) return;

			// ✅ IMPORTANT: undo autoSolve "lock" + any leftover drag classes
			tile.style.pointerEvents = ""; // <— this fixes “not draggable after reset”
			tile.style.opacity = "1";
			tile.classList.remove("placed", "dragging", "returning", "highlight", "success");
			tile.classList.add("draggable");

			// Freeze current position using rects relative to words-container
			const r = tile.getBoundingClientRect();
			const curLeft = r.left - wcRect.left;
			const curTop = r.top - wcRect.top;

			// Lock at current spot with transitions off
			tile.style.transition = "none";
			tile.style.position = "absolute";
			tile.style.left = `${curLeft}px`;
			tile.style.top = `${curTop}px`;
			void tile.offsetWidth;

			// Animate home (CSS handles left/top transitions)
			tile.classList.add("returning");
			void tile.offsetWidth;

			tile.style.transition = ""; // allow CSS/inline transition rules
			void tile.offsetWidth;

			tile.style.left = home.left;
			tile.style.top = home.top;

			const onDone = (ev) => {
				if (ev.propertyName !== "left" && ev.propertyName !== "top") return;
				tile.classList.remove("returning");
				tile.removeEventListener("transitionend", onDone);
			};
			tile.addEventListener("transitionend", onDone);
		});

		// Restore word text in bank
		const objectSpans = document.querySelectorAll(`#${id} .words-container .blank span`);
		objectSpans.forEach((s) => { s.style.opacity = 1; });

		// Hide answers again
		// const targetSpans = document.querySelectorAll(`#${id} .target-board .blank span`);
		// targetSpans.forEach((s) => { s.style.opacity = 0; });

		this.clearTargetHighlights();

		this.setState(() => ({
			failCount: 0,
			matched: [],
			nPlaced: 0,
			complete: false,
		}));
	};

	// ---------- Target checking (now returns coords in words-container space) ----------

	inLimits = () => {
		const { id, margin } = this.state;

		const cl = this.movingPiece.classList;
		const targetWord = document.querySelector(`#${id} .target.${cl[0]}`);
		const targetSpan = document.querySelector(`#${id} .target.${cl[0]} span`);

		if (targetWord) {
			const targetRect = targetWord.getBoundingClientRect();
			const { left: tLeft, top: tTop, right: tRight, bottom: tBottom } = targetRect;

			const pieceRect = this.movingPiece.getBoundingClientRect();
			const { left: pLeft, top: pTop, right: pRight, bottom: pBottom } = pieceRect;

			const pieceMid = pLeft + (pRight - pLeft) / 2;

			if ((pieceMid >= tLeft) && (pieceMid <= tRight) && pTop >= tTop - margin && pBottom <= tBottom + margin) {
				// Convert viewport -> words-container coords
				const wcRect = this.getWordsContainerRect();
				if (!wcRect) return { success: false };

				const relativeLeft = targetRect.left - wcRect.left;
				const relativeTop = targetRect.top - wcRect.top;

				return {
					overTarget: true,
					success: true,
					targetLeft: relativeLeft,
					targetTop: relativeTop,
					targetSpan,
					targetWord,
				};
			}
		}

		// Over-any-target highlight (no snap)
		const targetWords = document.querySelectorAll(`#${id} .target.word`);
		const pieceRect = this.movingPiece.getBoundingClientRect();
		const { left: pLeft, top: pTop, right: pRight, bottom: pBottom } = pieceRect;

		for (let i = 0; i < targetWords.length; i++) {
			const tw = targetWords[i];
			const r = tw.getBoundingClientRect();

			const pieceMid = pLeft + (pRight - pLeft) / 2;
			if ((pieceMid >= r.left) && (pieceMid <= r.right) && pTop >= r.top - margin && pBottom <= r.bottom + margin) {
				return { overTarget: true, targetWord: tw };
			}
		}

		return { success: false };
	};

	isInteractiveElement = (target) => {
		return (
			target.closest(".sequence-audio-controller") ||
			target.closest("input") ||
			target.closest("button") ||
			target.closest("select") ||
			target.closest("textarea")
		);
	};

	// ✅ Two-pass pinning (prevents all tiles collapsing to one position)
	// Stores home positions in words-container coords
	pinTiles = () => {
		const { id } = this.state;

		const wc = this.wordsContainerRef.current;
		if (!wc) return;

		// Ensure stable containing block
		wc.style.position = "relative";

		const wcRect = wc.getBoundingClientRect();
		const tiles = document.querySelectorAll(`#${id} .words-container .word.draggable`);
		const coords = [];

		// PASS 1: measure while still in flow
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];
			const r = tile.getBoundingClientRect();

			const left = `${r.left - wcRect.left}px`;
			const top = `${r.top - wcRect.top}px`;

			coords.push({ left, top });

			const key = this.getTileKey(tile);
			if (key && !this.tileHomePositions[key]) {
				this.tileHomePositions[key] = { left, top };
			}
		}

		// PASS 2: apply after all measurements
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];
			tile.style.position = "absolute";
			tile.style.left = coords[i].left;
			tile.style.top = coords[i].top;
		}
	};

	render = () => {
		const {
			answers,
			blanksType = 'phrases',
			cheatText,
			complete = false,
			failCount,
			header = [],
			htmlContent,
			id = '',
			items,
			listenDescriptionText,
			nPlaced = 0,
			nToPlace,
			pictures,
			questions,
			showHints,
			showHintsText,
			soundFile,
			soundFiles = [],
			words = [],
		} = this.state;

		const { wordTiles } = this.state;
		const { config, logError } = this.props;
		const { informationText, informationTextHTML } = config;

		const phraseList = [];
		const tableRows = [];
		const headerCells = [];

		const playlist = (items || [])
			.map((it, idx) => ({
				rowIndex: idx,
				src: it && it.audio ? resolveAsset(`${it.audio}`) : null,
			}))
			.filter(x => !!x.src);

		const rowToPlaylistIndex = {};
		playlist.forEach((p, pi) => { rowToPlaylistIndex[p.rowIndex] = pi; });

		switch (blanksType) {
			case 'phrases': {
				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const isActive = this.state.activeRowIndex === i;
					const { masterPlayState } = this.state;
					const status = isActive ? (masterPlayState === "playing" ? "playing" : "stopped") : "stopped";
					const prog = this.state.rowProgress[i] || { currentTime: 0, duration: 0 };

					const phrase = [];
					const phraseSplit = item.text.match(/\[[^\]]+\]|\S+/g);

					for (let j = 0; j < phraseSplit.length; j++) {
						if (phraseSplit[j][0] === '[') {
							const cleaned = phraseSplit[j].replace('[', '').replace(']', '');

							let foundIndex;
							for (let k = 0; k < words.length; k++) {
								if (words[k] === cleaned) foundIndex = k;
							}

							phrase.push(
								<div className={`word${foundIndex} word blank target`} key={`phraseSpan${i}-${j}`}>
									<span>{cleaned}</span>
								</div>
							);
						} else {
							phrase.push(<span className='word' key={`phraseSpan${i}-${j}`}>{phraseSplit[j]} </span>);
						}
					}

					phraseList.push(
						<li key={`phrase${i}`}>
							<div className='phrase'>
								{item.audio ? (
									<CircularAudioProgressAnimatedSpeakerDisplay
										className={`super-compact-speaker`}
										status={status}
										progress={prog.currentTime}
										duration={prog.duration}
										handleClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											const pi = rowToPlaylistIndex[i];
											if (pi === undefined) return;

											if (isActive) this.sequenceRef.current?.toggle();
											else this.sequenceRef.current?.playItem(pi, { playSequence: false });
										}}
										title={isActive ? "Click to pause" : "Click to play"}
									/>
								) : null}
								{phrase}
							</div>
						</li>
					);
				}
				break;
			}

			case "table": {
				const nRows = parseInt(words.length / 2) + words.length % 2;
				for (let i = 1; i <= nRows; i++) {
					const phrase = words[i - 1].replace(/ /g, '\u00a0');
					tableRows.push(
						<TableRow key={`${id}row${i}`}>
							<TableCell>{i}.</TableCell>
							<TableCell>
								<Word className={`blank target`} index={i - 1} key={`${id}word${i}`}>{phrase}</Word>
							</TableCell>
							{i <= words.length / 2 ?
								<>
									<TableCell>{i + nRows}.</TableCell>
									<TableCell>
										<Word className={`blank target`} index={i - 1 + nRows} key={`${id}word${i + nRows}`}>
											{words[i - 1 + nRows]}
										</Word>
									</TableCell>
								</>
								: null}
						</TableRow>
					);
				}
				break;
			}

			case "questions-answers": {
				for (let i = 1; i <= questions.length; i++) {
					const sf = resolveAsset(`${soundFiles[i - 1]}`);
					tableRows.push(
						<TableRow key={`${id}row${i}`}>
							<TableCell><AudioClip className={`super-compact-speaker`} soundFile={sf} /></TableCell>
							<TableCell>{questions[i - 1]}</TableCell>
							<TableCell><Word className={`blank target`} index={i - 1} key={`${id}word${i}`}>{answers[i - 1]}</Word></TableCell>
						</TableRow>
					);
				}
				break;
			}

			case "group-table": {
				if (header) {
					for (let i = 0; i < header.length; i++) {
						headerCells.push(<TableHead key={`${id}header${i}`}>{header[i]}</TableHead>);
					}
				}
				for (let i = 1; i <= answers.length; i++) {
					tableRows.push(
						<TableRow key={`${id}row${i}`}>
							<TableCell>
								<Word className={`blank target`} index={words.indexOf(answers[i - 1][0])} key={`${id}word${i}`}>
									{answers[i - 1][0]}
								</Word>
							</TableCell>
							<TableCell>
								<Word className={`blank target`} index={words.indexOf(answers[i - 1][1])} key={`${id}word${i}`}>
									{answers[i - 1][1]}
								</Word>
							</TableCell>
						</TableRow>
					);
				}
				break;
			}

			case "pictures-answers": {
				for (let i = 1; i <= pictures.length; i++) {
					const sf = resolveAsset(`${soundFiles[i - 1]}`);
					tableRows.push(
						<TableRow key={`${id}row${i}`}>
							<TableCell><AudioClip className={`super-compact-speaker`} soundFile={sf} /></TableCell>
							<TableCell><img src={`${pictures[i - 1]}`} alt={`${answers[i - 1]}`} /></TableCell>
							<TableCell><Word className={`blank target`} index={i - 1} key={`${id}word${i}`}>{answers[i - 1]}</Word></TableCell>
						</TableRow>
					);
				}
				break;
			}

			default: {
				const action = "Not a valid type of Blanks";
				logError(action, { message: "Not a valid type of Blanks" });
			}
		}

		const { suppressInfo = false } = this.props;

		return (
			<div
				className={`blanks-container type-${blanksType} container ${complete ? 'complete' : ''}`}
				id={`${id ? id : ''}`}
				onPointerDown={this.handleMouseDown}
				onPointerMove={this.handleMouseMove}
				onPointerUp={this.handleMouseUp}
				onPointerCancel={this.handleMouseUp}
				key={`${id}Blanks`}
			>
				{!suppressInfo && (informationText || informationTextHTML) ? (
					<Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML} />
				) : null}
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

				{listenDescriptionText && soundFile ? (
					<AudioClip
						id={`${id}Audio`}
						listenText={listenDescriptionText}
						soundFile={soundFile}
					/>
				) : null}

				{blanksType === "phrases" && playlist.length > 0 ? (
					<SequenceAudioController
						ref={this.sequenceRef}
						sources={playlist.map(p => p.src)}
						pauseSeconds={0.5}
						onTrackChange={(playlistIndex) => this.handleMasterTrackChange(playlistIndex, playlist)}
						onTimeUpdate={(playlistIndex, clipTime, clipDuration) =>
							this.handleMasterTime(playlistIndex, clipTime, clipDuration, playlist)
						}
						onPlayStateChange={(playState) => this.handleMasterPlayStateChange(playState)}
						onStopped={(playlistIndex) => this.handleMasterStopped(playlistIndex, playlist)}
					/>
				) : null}

				<div className={`blanks ${BLANKS_CONTENT_FLOW_CLASS} ${showHints ? 'show-hints' : ''} ${blanksType} mb-8`}>
					<div className={`words-container ${BLANKS_WORDS_CONTAINER_FLOW_CLASS}`} ref={this.wordsContainerRef}>
						{wordTiles}
					</div>

					<div className={`target-board ${BLANKS_TARGET_BOARD_TEXT_CLASS}`}>
						{blanksType === 'phrases' ? (
							<ul>{phraseList}</ul>
						) : (
							<Table className={BLANKS_TARGET_TABLE_TEXT_CLASS}>
								{header.length > 0 ? (
									<TableHeader><TableRow>{headerCells}</TableRow></TableHeader>
								) : null}
								<TableBody>{tableRows}</TableBody>
							</Table>
						)}
					</div>
				</div>

				<p>{nPlaced} correct out of {nToPlace}</p>

				<div className='help'>
					<Switch
						aria-label="Show hints"
						id={`showHintsId-${id ? id : ''}`}
						checked={showHints}
						onCheckedChange={this.handleToggle}
					/>
					<Label htmlFor={`showHintsId-${id ? id : ''}`} className="cursor-pointer">
						{showHintsText}
					</Label>

					<IconButton
						className={`hidden-help ${failCount >= 2 ? 'show' : ''}`}
						onClick={this.autoSolve}
						theme={`eye`}
					>
						{cheatText}
					</IconButton>

					<IconButton
						className={`hidden-help ${nPlaced >= 1 || failCount >= 2 || complete ? 'show' : ''}`}
						onClick={this.handleReset}
						theme={`reset`}
					>
						Reset
					</IconButton>
				</div>
			</div>
		);
	};
}
