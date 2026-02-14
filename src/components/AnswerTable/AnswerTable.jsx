import './AnswerTable.scss';
import {
	AudioClip,
	Monologue,
} from '..';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import React from 'react';
import {
	resolveAsset,
} from '../../utility';

export class AnswerTable extends React.PureComponent {

	// Table of phrases with translatiopns column and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);
		this.state = ({
			...props.config,
			nCorrect: 0,
		});
		// this.countCorrect = this.countCorrect.bind(this);
		// this.handleReset = this.handleReset.bind(this);
	}

	// nCorrect = 0;

	countCorrect = () => {
		// console.log("countCorrect");
		// const {
		// 	// congratulationsText,
		// 	// phrases,
		// } = this.state;
		let {
			nCorrect,
		} = this.state;
		// let newNCorrect = nCorrect;
		// const { showDialog } = this.props;
		// const tadaAudio = new Audio(resolveAsset('/sounds/tada.mp3'));

		nCorrect++;
		// if (nCorrect === phrases.length) {
		// 	// tadaAudio.play();
		// 	showDialog(congratulationsText);
		// }
		this.setState({
			nCorrect: nCorrect,
		});
	};

	handleReset = () => {
		// console.log("handleReset");
		this.setState({
			nCorrect: 0,
		});
	};

	render = () => {
		const {
			compoundID,
			header,
			htmlContent,
			id = [],
			// instructionsText,
			// instructionsTextHTML,
			nCorrect = 0,
			phrases,
		} = this.state;
		// const { id = '' } = config;
		const nPhrases = phrases.length;
		let longestRow = 0;
		for (let i = 0; i < phrases.length; i++) {
			if (phrases[i].length > longestRow)longestRow = phrases[i].length;
		}
		// console.log("longestRow", longestRow);
		const headerCells = [];

		if (header) {
			for(let i = 0; i < header.length; i++) {
				headerCells.push(<TableHead key={`header-cell-${i}`}>{header[i]}</TableHead>);
			}
		}
		const rows = [];
		for (let i = 0; i < phrases.length; i++){
			const phrase = phrases[i];
			const cells = [];
			if (phrase[0] === '' && phrase.length === 1) {
				// blank row
				rows.push(
					<TableRow className={`spacer`} key={`row${i}`}>
						<TableCell colSpan={longestRow} key={`cell-of-row-${i}`}></TableCell>
					</TableRow>
				);
			} else {
				if (phrase[0] !== '') {
					cells.push(
						<TableCell key={`row${i}cell0`}>
							{phrase[0]}
						</TableCell>
					);
				}
				if (phrase[1] !== '') {
					// const openIndex = phrase[1].indexOf('[');
					// const closeIndex = phrase[1].indexOf(']');

					const parts = [];
					const regex = /\[([^\]]+)\]/g;
					let lastIndex = 0;
					let match;
					let monologueIndex = 0;
					while ((match = regex.exec(phrase[1])) !== null) {
						if (match.index > lastIndex) {
							// console.log(10, phrase[1].slice(lastIndex, match.index));
							parts.push(phrase[1].slice(lastIndex, match.index));
						}
						// console.log(20, "monologue");

						parts.push(
							<Monologue
								key={`Monologue${i}-${monologueIndex}`}
								compact={true}
								id={`Monologue${i}-${monologueIndex}`}
								content={match[1]}
								countCorrect={this.countCorrect}
							/>
						);
						monologueIndex++;
						({ lastIndex } = regex);// .lastIndex;
						// console.log("lastIndex", lastIndex);
					}
					if (lastIndex < phrase[1].length) {
						// console.log(30, phrase[1].slice(lastIndex));

						parts.push(phrase[1].slice(lastIndex));
					}
					// console.log("1 cells.push");
					cells.push(
						<TableCell key={`row${i}cell1`}>
							<span className='inline-monologue'>{parts}</span>
						</TableCell>
					);
				}
				if (longestRow > 2) {
					const soundCellIndex = 2;
					const soundFile = resolveAsset(`${phrase[soundCellIndex]}`);
					// console.log("2 cells.push");
					cells.push(
						<TableCell key={`row${i}cell${soundCellIndex}`}>
							<AudioClip className={`compact`} label={""} soundFile={soundFile} />
						</TableCell>
					);
				}
				// console.log("rows.push");
				rows.push(
					<TableRow key={`${compoundID}-row${i}`} visible-key={`${id}-row${i}`}>
						{cells}
					</TableRow>
				);
			}
		}

		return (
			<div
				className={`answer-table-container container`}
				id={id || undefined}
				key={`${id}PhraseTable`}
			>
				{htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}
				<Table>
					{header ?
						<TableHeader>
							<TableRow>
								{headerCells}
							</TableRow>
						</TableHeader> : null}
					<TableBody>
						{rows}
					</TableBody>
				</Table>
				<p>{nCorrect} correct out of {nPhrases}.</p>
			</div>
		);
	};
}
