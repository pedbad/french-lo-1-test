import './WordParts.scss';
import {
	AudioClip,
	IconButton,
	Info,
	ProgressDots,
} from '..';
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import React from 'react';

const WORD_PARTS_TEXT_CLASS = "text-[calc(var(--font-size-base)*1.15)] leading-[var(--line-height-wordparts-mobile)] md:text-[calc(var(--font-size-xl)*1.5)] md:leading-[var(--line-height-wordparts)]";

export class WordParts extends React.PureComponent {

	// Table of phrases with translatiopns column and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);
		this.state = ({
			...props.config,
			failCount: 0,
		});

		// this.autoSolve = this.autoSolve.bind(this);
		// this.handlePartWordClick = this.handlePartWordClick.bind(this);
		// this.handlePartWordError = this.handlePartWordError.bind(this);
		// this.handleReset = this.handleReset.bind(this);

	}

	autoSolve = () => {
		// console.log("autoSolve");
		const {
			id = [],
			nPlaced = 0,
		} = this.state;

		if (nPlaced < this.nToSolve) {
			const targets = document.querySelectorAll(`#${id} span.target`);
			// const wofAudio = new Audio(resolveAsset('/sounds/wheel-of-fortune.mp3'));

			// wofAudio.play();

			for (let i = 0; i < targets.length; i++) {
				targets[i].classList.add('animate');
			}
			this.setState({
				complete: true,
				nPlaced: this.nToSolve
			});

		}
	};

	handlePartWordClick = (e) => {
		// const tadaAudio = new Audio(resolveAsset('/sounds/tada.mp3'));

		// const wofAudio = new Audio(resolveAsset('/sounds/wheel-of-fortune.mp3'));
		// console.log("handlePartWordClick");
		// wofAudio.play();
		// const {
		// 	congratulationsText,
		// } = this.state;
		let {
			nPlaced = 0,
		} = this.state;
		if (e.target.classList.contains("animate") || e.target.classList.contains("error")) return;
		e.target.classList.add("animate");
		nPlaced++;
		if (nPlaced === this.nToSolve){

			// Last piece of the jigsaw placed
			// const { showDialog } = this.props;
			// showDialog(congratulationsText);
			// tadaAudio.play();
			this.setState({
				complete: true,
			});
		}
		this.setState({
			nPlaced: nPlaced
		});
	};

	handlePartWordError = (e) => {
		// console.log("handlePartWordError");
		// const errorAudio = new Audio(resolveAsset('/sounds/error.mp3')); // error);
		let { failCount } = this.state;
		// errorAudio.play();
		e.target.classList.add("error");

		failCount++;
		this.setState({
			failCount: failCount
		});
	};

	handleReset = () => {
		// console.log("handleReset");
		const spans = document.querySelectorAll(".word-parts-container table span");
		spans.forEach((span) => {
			span.classList.remove('animate');
			span.classList.remove('error');
		});
		this.setState({
			complete: false,
			failCount: 0,
			nPlaced: 0,
		});
	};

	render = () => {
		const {
			config
		} = this.props;
		const {
			informationText,
			informationTextHTML,
		} = config;
		const {
			cheatText,
			complete = false,
			failCount = 0,
			htmlContent,
			id = [],
			items,
			nPlaced = 0,
		} = this.state;

		const phraseList = [];
		let nToSolve = 0;

		const reg = /(\[.*?\])/;
		for (let i = 0; i < items.length; i++) {

			// const phraseSplit = phrases[i].replace(/ /g, '\u00a0\u00a0').split(reg);
			const phraseSplit = items[i].text.split(reg);

			const phrase = [];
			for (let j = 0; j < phraseSplit.length; j++) {
				const part = phraseSplit[j];

				if (!part) continue;

				if (part[0] === '[') {
					// target word
					const cleaned = part.slice(1, -1);
					nToSolve++;
					phrase.push(
						<span
							className="target"
							onClick={this.handlePartWordClick}
							key={`${id}-phraseSpan${i}-${j}`}
						>
							{cleaned}
						</span>
					);
				} else {
					// split normal text into words + spaces
					const tokens = part.split(/(\s+)/);
					tokens.forEach((token, k) => {
						if (!token) return;

						if (token.trim() === "") {
							// spacing span
							phrase.push(
								<span
									className="word-space"
									key={`${id}-phraseSpace${i}-${j}-${k}`}
								>
									{" "}
								</span>
							);
						} else {
							phrase.push(
								<span
									onClick={this.handlePartWordError}
									key={`${id}-phraseText${i}-${j}-${k}`}
								>
									{token}
								</span>
							);
						}
					});
				}
			}

			phraseList.push(
				<p>{ phrase }</p>
			);
		}

		const rows = [];
		for (let i = 0; i < items.length; i++){
			const phrase = items[i].text;
			const cells = [];
			if (phrase[0] === '' && phrase.length === 1) {
				// blank row
				rows.push(
					<tr className={`spacer`} key={`row${i}`}>
						<td colSpan={3}></td>
					</tr>
				);
			} else {
				const soundFile = `${items[i].audio}`;
				cells.push(
					<td key={`row${i}cell1`}>
						<AudioClip className={`super-compact-speaker`} soundFile={soundFile} />
					</td>
				);

				cells.push(
					<td key={`row${i}cell2`}>
						{phraseList[i]}
					</td>
				);

				rows.push(
					<tr key={`row${i}`}>
						{cells}
					</tr>
				);
			}
		}
		this.nToSolve = nToSolve;
		return (
			<div
				className={`word-parts-container container`}
				id={`${id ? id : ''}`}
				key={`${id}WordParts`}
			>
				{!this.props.suppressInfo && (informationText || informationTextHTML) ? (
					<Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML}/>
				) : null}
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}


				<table className={WORD_PARTS_TEXT_CLASS}>
					<tbody>
						{rows}
					</tbody>
				</table>

				<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />
				<ProgressDots correct={nPlaced} total={nToSolve} />
				<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />

					<div className='help'>
						<IconButton
							ariaLabel={cheatText}
							className={`wordparts-reveal btn-ped-warn hidden-help max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11 ${failCount >= 2 ? 'show' : ''}`}
							disabled={nPlaced === this.nToSolve}
							onClick={this.autoSolve}
							theme={`eye`}
							title={cheatText}
							variant="default"
						>
							<span className="hidden min-[560px]:inline">{cheatText}</span>
						</IconButton>
						<IconButton
							ariaLabel="Reset"
							className={`wordparts-reset hidden-help max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11 ${nPlaced >= 1 || failCount >= 1 || complete ? 'show' : ''}`}
							onClick={this.handleReset}
							theme={`reset`}
							title="Reset"
							variant="outline"
						>
							<span className="hidden min-[560px]:inline">Reset</span>
						</IconButton>
					</div>
			</div>
		);
	};
}
