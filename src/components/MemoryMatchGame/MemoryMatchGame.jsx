// React component for bilingual memory matching game
import "./MemoryMatchGame.scss";
import {
	Card,
	// Congratulate,
	IconButton
} from "../../components";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import React from "react";
import {resolveAsset} from "../../utility";
import Variables from "../../styles/_variables.module.scss";

const getShuffledDeck = (cards, nCards) => {
	cards = cards.sort(() => Math.random() - 0.5);
	cards = cards.slice(0, nCards);
	const imageCards = cards.map((obj, idx) => ({
		content: obj.localLanguage,
		id: `${idx}b`,
		image: obj.image,
		localLanguage: obj.localLanguage,
		match: obj.foreignLanguage,
		type: 'image',
	}));
	const textCards = cards.map((obj, idx) => ({
		audio: obj.audio,
		content: obj.foreignLanguage,
		id: `${idx}a`,
		image: `img-${idx}`,
		localLanguage: obj.localLanguage,
		match: obj.localLanguage,
		type: 'text',
	}));
	const combined = [...imageCards, ...textCards];
	return combined.sort(() => Math.random() - 0.5);
};

export class MemoryMatchGame extends React.PureComponent {
	constructor(props) {
		super(props);
		const {
			cards,
			nPairsToPlay,
		} = this.props.config;

		this.state = ({
			...this.props.config,
			beenFlipped:[], // To have shade animations if/when flipping back
			cards: getShuffledDeck(cards, nPairsToPlay),
			flipped: [],
			matched: [],
			nPairs: 0,
			nTries: 0,
		});
		// this.handleClick = this.handleClick.bind(this);
		// this.handleReset = this.handleReset.bind(this);
		// this.handleShuffle = this.handleShuffle.bind(this);
	}

	handleClick = (card) => {
		const {
			beenFlipped,
			cards,
			// congratulationsText,
			flipped,
			matched,
		} = this.state;
		let{
			nPairs,
			nTries,
			startTime,
		} = this.state;
		if (!startTime)	startTime = new Date();

		// const { showDialog } = this.props;
		if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

		// const tadaAudio = new Audio(resolveAsset('/sounds/tada.mp3'));

		const newFlipped = [...flipped, card.id];
		beenFlipped.push(card.id);
		let { memoryCardTransitionTime } = Variables;
		memoryCardTransitionTime = parseInt(memoryCardTransitionTime.replace('s', '')) * 1000;
		this.setState({
			beenFlipped: beenFlipped,
			flipped: newFlipped,
			startTime: startTime,
		}, () => {
			if (newFlipped.length === 2) {
				nTries++;
				const [first, second] = newFlipped;
				const firstCard = cards.find(c => c.id === first);
				const secondCard = cards.find(c => c.id === second);

				if (firstCard.match === secondCard.content) {
					const { audio: soundFile } = { ...firstCard, ...secondCard };
					const sound = new Audio(resolveAsset(`${soundFile}`));
					nPairs++;
					let timeReport = '';
					let finishedUp = false;
					const finishUp = () => {
						// console.log("Finish up");
						if (finishedUp) return;
						finishedUp = true;
						if (nPairs === cards.length / 2) {
							const endTime = new Date();
							const diffMs = endTime - startTime; // milliseconds
							const totalSeconds = Math.floor(diffMs / 1000);
							const minutes = Math.floor(totalSeconds / 60);
							const seconds = totalSeconds % 60;
							if (minutes !== 0) {
								timeReport = ` Completed in ${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds > 1 ? 's' : ''}.`;
							} else {
								timeReport = ` Completed in ${seconds} second${seconds > 1 ? 's' : ''}.`;
							}
							this.setState({
								timeReport: timeReport,
							});// , () => {
							// tadaAudio.play();
							// 	showDialog(congratulationsText);
							// });
						}
					};
					sound.onended = () => finishUp();
					setTimeout(finishUp, 2000); // Fallback as Chrome doesn't fire onended event :-()

					// console.log("soundFile", soundFile);
					sound.play();
					matched.push(firstCard.id, secondCard.id);
					this.setState({
						matched: matched,
						nPairs,
						nTries,
					});
				}
				setTimeout(() =>
					this.setState({
						flipped: [],
						nTries: nTries,
					}), memoryCardTransitionTime);
			}
		});
	};

	handleReset = () => {
		// console.log("RESET!");
		this.setState({
			matched: [],
			startTime: undefined,
			timeReport: '',
		});
	};

	handleShuffle = () => {
		// console.log("Shuffle!");

		const {
			cards,
			nPairsToPlay,
		} = this.props.config;

		this.setState({
			flipped: [],
			matched: [],
			startTime: undefined,
			timeReport: '',
		}, () => {
			this.setState({
				cards: getShuffledDeck(cards, nPairsToPlay)
			});
		});
	};

	render = () => {
		const {
			beenFlipped,
			cards,
			descriptionText,
			flipped,
			htmlContent,
			id,
			// instructionsText,
			// instructionsTextHTML,
			matched,
			nPairs,
			nTries,
			timeReport = '',
		} = this.state;
		const sortedMatches = cards.filter(card =>
			matched.includes(card.id)
		);
		sortedMatches.sort((a, b) => {
			if (a.id < b.id) {
				return -1;
			}
			if (a.id > b.id) {
				return 1;
			}
			return 0;
		});
		return (
			<div id={`${id}`} className={`memory-match-game-container`}>
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

				<div className={`memory-match-game`}>
					<p className='clue'>{descriptionText}&nbsp;</p>

					<div
						className={`memory-map-container num${cards.length}cards`}
					>
						{/* dirty max-height, but the container won't shrink down for the scaled down content :-( */}
						<h2 className="text-base">Cards</h2>
						<h2 className="text-base">Matched&nbsp;pairs</h2>
						<div className="cards">
							{cards.map(card => (
								<Card
									card={card}
									className={`${card.localLanguage} ${beenFlipped.includes(card.id) || matched.includes(card.id) ? 'been-flipped' : ''} ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
									handleClick={this.handleClick}
									key={`card${card.id}`}
								/>
							))}
						</div>
						<div className={`matches-container`}>{/* To force align top */}
							<div className="matches">
								{sortedMatches.map(card =>
									matched.includes(card.id) ?
										(
											<div key={`enclosingDivMatchedCard${card.id}`}>
												<Card
													card={card}
													className={`${card.type} ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
													handleClick={this.handleClick}
													key={`matchedCard${card.id}`}
												/>
											</div>
										) : null
								)}
							</div>
						</div>
					</div>
					<p>{`${nTries} tries. ${nPairs} matched.${timeReport}`}</p>

				</div>
				<div className={`help`}>
					<IconButton className={`hidden-help`} onClick={this.handleReset} theme={`reset`} >Reset</IconButton>
					<IconButton className={`shuffle`} onClick={this.handleShuffle} theme={`shuffle`}>Shuffle</IconButton>
				</div>
			</div>
		);
	};
}
