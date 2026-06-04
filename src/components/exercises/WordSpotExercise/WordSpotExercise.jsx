import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { Info } from "@/components/content";
import { AudioClip, IconButton } from "@/components/media";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import React from 'react';

const WORD_SPOT_TEXT_CLASS = "text-[length:calc(var(--font-size-base)*1.15)] leading-[var(--line-height-wordparts-mobile)] md:text-[length:calc(var(--font-size-xl)*1.5)] md:leading-[var(--line-height-wordparts)]";

export class WordSpotExercise extends React.PureComponent {

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
		let {
			nPlaced = 0,
		} = this.state;
		if (e.target.classList.contains("animate") || e.target.classList.contains("error")) return;
		e.target.classList.add("animate");
		nPlaced++;
		if (nPlaced === this.nToSolve){
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
		let { failCount } = this.state;
		e.target.classList.add("error");

		failCount++;
		this.setState({
			failCount: failCount
		});
	};

	handleReset = () => {
		const spans = document.querySelectorAll(".word-spot-container .word-spot-grid span, .word-spot-container table span");
		const active = Array.from(spans).filter((span) =>
			span.classList.contains('animate') || span.classList.contains('error')
		);

		if (active.length === 0) {
			this.setState({ complete: false, failCount: 0, nPlaced: 0 });
			return;
		}

		active.forEach((span) => {
			// Use the matching reverse keyframe so green resets green, red resets red.
			span.classList.add(span.classList.contains('error') ? 'resetting-error' : 'resetting');
		});

		setTimeout(() => {
			spans.forEach((span) => {
				span.classList.remove('animate', 'error', 'resetting', 'resetting-error');
			});
			this.setState({ complete: false, failCount: 0, nPlaced: 0 });
		}, 520);
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
				<div key={`${id}-phraseLine${i}`}>{ phrase }</div>
			);
		}

		const rows = [];
		for (let i = 0; i < items.length; i++){
			const phrase = items[i].text;
			const cells = [];
			if (phrase[0] === '' && phrase.length === 1) {
				// blank row
				rows.push(
					<div className="word-spot-row spacer" key={`row${i}`} aria-hidden="true" />
				);
			} else {
				const soundFile = `${items[i].audio}`;
				cells.push(
					<div className="word-spot-audio-cell" key={`row${i}cell1`}>
						<AudioClip className={`super-compact-speaker`} soundFile={soundFile} />
					</div>
				);

				cells.push(
					<div className="word-spot-text-cell" key={`row${i}cell2`}>
						{phraseList[i]}
					</div>
				);

				rows.push(
					<div className="word-spot-row" key={`row${i}`} role="listitem">
						{cells}
					</div>
				);
			}
		}
		this.nToSolve = nToSolve;
		return (
			<div
				className={`word-spot-container container`}
				id={id || undefined}
				key={`${id}WordParts`}
			>
				{!this.props.suppressInfo && (informationText || informationTextHTML) ? (
					<Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML}/>
				) : null}
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}


				<div className={`word-spot-grid ${WORD_SPOT_TEXT_CLASS}`} role="list" aria-label="Pronunciation feature lines">
					{rows}
				</div>

				<div className="exercise-divider" role="none" data-orientation="horizontal" />
				<ProgressDots correct={nPlaced} total={nToSolve} />
				<div className="exercise-divider" role="none" data-orientation="horizontal" />

				<div className="exercise-help exercise-help-end">
					<IconButton
						ariaLabel={cheatText}
						className={exerciseActionButtonVariants({
							progressive: true,
							role: "reveal",
							tone: "warn",
							visible: failCount >= 2,
						})}
						disabled={nPlaced === this.nToSolve}
						onClick={this.autoSolve}
						theme={`eye`}
						variant="default"
					>
						<span className="exercise-icon-button-label">{cheatText}</span>
					</IconButton>
					<IconButton
						ariaLabel="Reset"
						className={exerciseActionButtonVariants({
							progressive: true,
							role: "reset",
							tone: "neutral",
							visible: nPlaced >= 1 || failCount >= 1 || complete,
						})}
						onClick={this.handleReset}
						theme={`reset`}
						variant="outline"
					>
						<span className="exercise-icon-button-label">Reset</span>
					</IconButton>
				</div>
			</div>
		);
	};
}
