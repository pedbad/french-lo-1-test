import "./Jigsaw.scss";
import {
	arrayIncludesObject,
	resolveAsset,
} from "../../utility";
import {
	AudioClip,
	IconButton,
	Piece,
} from "../../components";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import {
	mouseRelativeTo,
} from "../../mouseUtility";
import React from "react";
import Variables from "../../styles/_variables.module.scss";

const JIGSAW_CLUE_TEXT_CLASS = "text-[1.4rem] font-bold";
const JIGSAW_TIME_TEXT_CLASS = "text-[2rem]";
const JIGSAW_CANVAS_TEXT_CLASS = "leading-[1.4em]";

export class Jigsaw extends React.PureComponent {

	// Contains a location for unplaced pieces and a target to drag them to.
	// config is passed from the parent so that multiple exercises are possible.
	// config.json enables the text to be changed for different languages/content.
	// correct.jpg and incorrect.jpg can be changed out.
	// The pieces are randomised from the correct image and from the incorrect image.
	// The point is for the student to read the description of the final puzzle image and choose pieces accordingly.

	constructor(props) {
		super(props);

		// Import some variables from scss (they are also used in other scss files and so should never get out of step unlike duplicated variables).
		const piecesPerBoard = parseInt(Variables.piecesPerBoard);
		const boardWidth = parseInt(Variables.boardWidth);
		const boardHeight = parseInt(Variables.boardHeight);
		const tabSize = parseInt(Variables.tabSize);
		const tileSize = parseInt(Variables.tileSize);
		const jigsawBorderWidth = parseInt(Variables.jigsawBorderWidth);

		// We will use Pieces to build up our JSX for the pieces
		const Pieces = [];
		const usedSpaces = []; // So we can track where pieces have been randomised to and therefore not get conflicts

		// Initial x,y
		let r = Math.random();
		let x = parseInt(r * boardWidth);
		r = Math.random();
		let y = parseInt(r * boardHeight);

		const { correctImage, incorrectImage } = this.props.config;

		for (let i = 1; i <= piecesPerBoard * 2; i++) {
			// Keep trying again if the space is taken
			while (arrayIncludesObject({ x: x, y: y }, usedSpaces)) {
				r = Math.random();
				x = parseInt(r * boardWidth * 2);
				r = Math.random();
				y = parseInt(r * boardHeight);
			}

			// Found an empty space
			usedSpaces.push({ x: x, y: y }); // Stop it being reused

			// Add the piece
			// correctx and correcty are valid place where the piece can be placed in the puzzle
			Pieces.push(<Piece
				index={i}
				correctImage={correctImage}
				correctx={(i - 1) % boardWidth}
				correcty={parseInt((i - 1) / boardWidth)}
				correctSet={i <= piecesPerBoard}
				handleMouseDown={this.handleMouseDown}
				handleMouseMove={this.handleMouseMove}
				handleMouseUp={this.handleMouseUp}
				incorrectImage={incorrectImage}
				x={x * tileSize}
				y={y * tileSize}
				key={`Piece${i}`}
			/>);
		}

		// Grab some items from the DOM
		this.congratulationsRef = React.createRef();
		this.jigsawRef = React.createRef();
		this.targetRef = React.createRef();

		const { config } = props;

		this.state = ({
			...config,
			Pieces: Pieces,
			jigsawBorderWidth: jigsawBorderWidth,
			margin: tileSize / 4,
			piecesPerBoard: piecesPerBoard,
			tabSize: tabSize,
			tileSize: tileSize,
		});

		// this.autoSolve = this.autoSolve.bind(this);
		// this.handleHints = this.handleHints.bind(this);
		// this.handleMouseDown = this.handleMouseDown.bind(this);
		// this.handleMouseMove = this.handleMouseMove.bind(this);
		// this.handleMouseUp = this.handleMouseUp.bind(this);
		// this.handleReset = this.handleReset.bind(this);
		// this.inLimits = this.inLimits.bind(this);

	}

	componentDidMount = () => {

		// Deduce the scale in use for this media break
		const jigsaw = this.jigsawRef.current;
		this.scale = jigsaw.getBoundingClientRect().width / jigsaw.offsetWidth;

	};

	autoSolve = () => {

		// User has had enough, solve it
		// console.log("autoSolve");
		const {
			jigsawBorderWidth,
			correctImage,
			incorrectImage,
			Pieces,
			tabSize,
			tileSize,
		} = this.state;
		const targetTray = this.targetRef.current;

		const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
		const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);

		const newPieces = [];
		for (let i = 0; i < 40; i++) {
			const piece = Pieces[i];
			const { index, correctSet, correctx, correcty, x, y } = piece.props;
			if (i < 20) {
				let targetX, targetY;
				if (correctSet) {
					targetX = (correctx * (tileSize - tabSize * 2) - tabSize) + targetTrayX + jigsawBorderWidth;
					targetY = (correcty * (tileSize - tabSize * 2) - tabSize) + targetTrayY + jigsawBorderWidth;
				} else {
					targetX = x;
					targetY = y;
				}
				newPieces.push(<Piece
					index={index}
					className={'placed'}
					correctImage={correctImage}
					correctSet={correctSet}
					handleMouseDown={() => { }}
					handleMouseMove={() => { }}
					handleMouseUp={() => { }}
					incorrectImage={incorrectImage}
					correctx={correctx}
					correcty={correcty}
					x={targetX}
					y={targetY}
					key={`Piece${index}`} />);
			} else {
				newPieces.push(<Piece
					index={index}
					correctImage={correctImage}
					correctSet={correctSet}
					handleMouseDown={() => { }}
					handleMouseMove={() => { }}
					handleMouseUp={() => { }}
					incorrectImage={incorrectImage}
					correctx={correctx}
					correcty={correcty}
					x={x}
					y={y}
					key={`Piece${index}`} />);
			}
		}
		this.setState({
			Pieces: newPieces,
		});
	};

	handleHints = (e) => {
		// console.log("handleHints", e);
		e.stopPropagation();
		this.setState({showHints: e.target.checked});
	};

	handleMouseDown = (e) => {
		// console.log("handleMouseDown", e)
		let{
			startTime,
		} = this.state;
		if (!startTime) startTime = new Date();
		this.setState({ startTime });

		if (e.button && e.button !== 0) return;
		if (e.target.classList.contains('piece') && !e.target.classList.contains('placed')) { // Not context menu (right mouse)
			this.movingPiece = e.target;

			// Starting point in case we want to return it
			const style = window.getComputedStyle(this.movingPiece);
			this.startX = parseInt(style.left);
			this.startY = parseInt(style.top);

			e.target.classList.add("dragging");
		}
	};

	handleMouseMove = (e) => {
		// console.log("handleMouseMove",e)
		const { tileSize } = this.state;
		if (this.movingPiece && this.movingPiece.classList.contains("dragging")) {
			let { x: relMouseX, y: relMouseY } = mouseRelativeTo(e, '.jigsaw', this.scale);

			// Drag via centre of piece (not top left)
			relMouseX = parseInt(relMouseX - tileSize / 2);
			relMouseY = parseInt(relMouseY - tileSize / 2);

			this.movingPiece.style.left = `${relMouseX}px`;
			this.movingPiece.style.top = `${relMouseY}px`;

			if (relMouseY - this.startY > 100 && !this.movingPiece.classList.contains("correct-set")) {
				this.movingPiece.classList.add('wrong-set');
			} else {
				this.movingPiece.classList.remove('wrong-set');
			}

			if (this.inLimits())
				this.movingPiece.classList.add('highlight');
			else
				this.movingPiece.classList.remove('highlight');
		}
	};

	handleMouseUp = (e) => {
		// console.log("handleMouseUp", e)
		e.target.classList.remove("dragging");
		const targetTray = this.targetRef.current;
		// const tadaAudio = new Audio(resolveAsset('/sounds/tada.mp3'));
		const clickAudio = new Audio(resolveAsset('/sounds/click.mp3'));
		// const errorAudio = new Audio(resolveAsset('/sounds/error.mp3'));
		let {
			failCount = 0,
		} = this.state;

		// Check valid spot and valid set of tiles
		if (this.movingPiece !== undefined && !this.movingPiece.classList.contains('correct-set')) {
			// Not from the correct set of pieces
			// errorAudio.play();
			this.movingPiece.style.left = `${this.startX}px`;
			this.movingPiece.style.top = `${this.startY}px`;
			failCount++;
			this.setState({
				failCount: failCount
			});
		} else if (this.movingPiece !== undefined) {
			// Check to see if it is close enough to its intended position
			const {
				jigsawBorderWidth,
				// congratulationsText,
				piecesPerBoard,
				startTime,
				tabSize,
				tileSize,
			} = this.state;
			let {
				nPlaced = 0,
			} = this.state;
			const correctx = parseInt(this.movingPiece.getAttribute('correctx'));
			const correcty = parseInt(this.movingPiece.getAttribute('correcty'));
			const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
			const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);
			const targetX = (correctx * (tileSize - tabSize * 2) - tabSize);
			const targetY = (correcty * (tileSize - tabSize * 2) - tabSize);

			if (this.inLimits()) {
				// The eagle has landed
				clickAudio.play();
				this.movingPiece.style.left = `${targetX + targetTrayX + jigsawBorderWidth}px`;
				this.movingPiece.style.top = `${targetY + targetTrayY + jigsawBorderWidth}px`;
				this.movingPiece.classList.add("placed");
				nPlaced++;
				if (nPlaced === piecesPerBoard) {
					// Last piece of the jigsaw placed
					let timeReport = '';

					const endTime = new Date();
					const diffMs = endTime - startTime; // milliseconds
					const totalSeconds = Math.floor(diffMs / 1000);
					const minutes = Math.floor(totalSeconds / 60);
					const seconds = totalSeconds % 60;
					if (minutes !== 0) {
						timeReport = `Completed in ${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds > 1 ? 's' : ''}.`;
					} else {
						timeReport = `Completed in ${seconds} second${seconds > 1 ? 's' : ''}.`;
					}
					this.setState({
						timeReport: timeReport,
					});// , () => {
					// 	const { showDialog } = this.props;
					// 	showDialog(congratulationsText);
					// 	// tadaAudio.play();
					// });
				}
				this.setState({ nPlaced: nPlaced });
			} else {

				// Nowhere near!
				this.movingPiece.style.left = `${this.startX}px`;
				this.movingPiece.style.top = `${this.startY}px`;
				failCount++;
				this.setState({
					failCount: failCount
				});
				// errorAudio.play();
			}
		}
		if (this.movingPiece) {
			this.movingPiece.classList.remove('highlight');
			this.movingPiece.classList.remove('wrong-set');
		}
		this.movingPiece = undefined;
	};

	handleReset = () => {
		// console.log("RESET!");
		this.setState({
			matched: [],
			nPlaced: 0,
			timeReport: '',
		});
	};

	inLimits = () => {

		// Is the piece close to its target position? Enough to show hint highlight or snap it in?
		const {
			margin,
			tabSize,
			tileSize,
		} = this.state;
		const targetTray = this.targetRef.current;
		const correctx = parseInt(this.movingPiece.getAttribute('correctx'));
		const correcty = parseInt(this.movingPiece.getAttribute('correcty'));
		const targetTrayX = parseInt(window.getComputedStyle(targetTray).left);
		const targetTrayY = parseInt(window.getComputedStyle(targetTray).top);
		const targetX = (correctx * (tileSize - tabSize * 2) - tabSize);
		const targetY = (correcty * (tileSize - tabSize * 2) - tabSize);
		let { left, top } = this.movingPiece.style;
		left = parseInt(left);
		top = parseInt(top);
		if (Math.abs(left - targetTrayX - targetX) < margin && Math.abs(top - targetTrayY - targetY) < margin) {
			return true;
		}
		return false;
	};

	render = () => {
		const {
			cheatText,
			descriptionText,
			failCount,
			htmlContent,
			id,
			// instructionsText,
			// instructionsTextHTML,
			listenDescriptionText,
			Pieces,
			showHints = false,
			showHintsText,
			soundFile,
			timeReport = '',
		} = this.state;

		return (
			<div
				className='jigsaw-container container'
				id={`${id ? id : ''}`}
				key={`${id}Jigsaw`}
				onTouchStart={this.handleMouseDown}
				onTouchMove={this.handleMouseMove}
				onTouchEnd={this.handleMouseEnd}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
			>
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}
				<p className={`clue ${JIGSAW_CLUE_TEXT_CLASS}`}>{descriptionText}&nbsp;</p>

				<AudioClip
					id={`AudioClipFor${id ? id : ''}`}
					listenText={listenDescriptionText}
					soundFile={resolveAsset(soundFile)}
				/>

				<div
					className={`jigsaw ${JIGSAW_CANVAS_TEXT_CLASS} ${showHints ? 'show-hints' : ''}`}
					onTouchStart={this.handleMouseDown}
					onTouchMove={this.handleMouseMove}
					onTouchEnd={this.handleMouseEnd}
					onMouseDown={this.handleMouseDown}
					onMouseMove={this.handleMouseMove}
					onMouseUp={this.handleMouseUp}
					ref={this.jigsawRef}
				>
					{Pieces}
					<div
						className='target'
						onTouchStart={this.handleMouseDown}
						onTouchMove={this.handleMouseMove}
						onTouchEnd={this.handleMouseEnd}
						onMouseDown={this.handleMouseDown}
						onMouseMove={this.handleMouseMove}
						onMouseUp={this.handleMouseUp}
						ref={this.targetRef}
					>
					</div>
					<p className={`time-taken ${JIGSAW_TIME_TEXT_CLASS}`}>{timeReport}</p>
				</div>
				<div className='help'>
					<label className={`hidden-help ${failCount >= 2 ? 'show' : ''}`}>{showHintsText}: <input type='checkbox' onClick={this.handleHints} checked={showHints} /></label>
					<IconButton className={`hidden-help ${failCount >= 2 ? 'show' : ''}`} theme={`eye`} onClick={this.autoSolve}>{cheatText}</IconButton>
				</div>
			</div>
		);
	};
}
