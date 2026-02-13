// DropDowns.jsx
import "./DropDowns.scss";
import {
	AudioClip,
	IconButton,
} from "..";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import React from "react";
import { resolveAsset } from "../../utility";

const DROPDOWN_TRIGGER_TEXT_CLASS = "min-w-[9rem] p-0 text-[var(--font-size-sm)] leading-[1.4rem] md:min-w-[12rem] md:p-1 md:text-[1.2rem]";
const DROPDOWNS_TABLE_TEXT_CLASS = "text-[var(--font-size-sm)] md:text-base";

export class DropDowns extends React.PureComponent {
	// Table of phrases with dropdowns and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);

		this.state = {
			...props.config,
			failCount: 0,
			nCorrect: 0,
			solved: [], // per-select: 1 = correct, -1 = incorrect, undefined/0 = untouched
			values: [], // per-select current value (string index)
		};

		this.nToSolve = 0;
		this.correctValues = []; // filled during render/parse
	}

	// In case config changes while the component is mounted
	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			this.setState({
				...this.props.config,
				failCount: 0,
				nCorrect: 0,
				solved: [],
				values: [],
			});
			this.nToSolve = 0;
			this.correctValues = [];
		}
	}

	handleReset = () => {
		this.setState({
			failCount: 0,
			nCorrect: 0,
			solved: [], // per-select; empty = untouched
			values: [], // all selects back to placeholder
		});
	};

	// value: string (index of selected option)
	// winner: number (index of correct option)
	// selectIndex: global index of this particular <Select> across all phrases
	handleSelectChange = (value, winner, selectIndex) => {
		const {
			failCount,
			solved = [],
			values = [],
		} = this.state;

		const newSolved = [...solved];
		const newValues = [...values];

		newValues[selectIndex] = value;

		let newFailCount = failCount;

		if (parseInt(value, 10) === winner) {
			// Correct answer
			if (newSolved[selectIndex] === -1) {
				// Previously wrong, now corrected
				newFailCount = Math.max(0, failCount - 1);
			}
			newSolved[selectIndex] = 1;
		} else {
			// Incorrect answer
			if (newSolved[selectIndex] !== -1) {
				newFailCount = failCount + 1;
			}
			newSolved[selectIndex] = -1;
		}

		const newNCorrect = newSolved.filter((s) => s === 1).length;

		this.setState({
			failCount: newFailCount,
			nCorrect: newNCorrect,
			solved: newSolved,
			values: newValues,
		});
	};

	/**
   * Parse a single phrase string with bracketed [options]
   *
   * startIndex: the current global count of selects before this phrase
   * Returns:
   *   segments      → array of JSX/text pieces to render inside <p>
   *   selectIndices → the global select indices belonging to this phrase
   *   nSelects      → updated total select count after this phrase
   */
	parseBracketedOptions = (startIndex, str) => {
		const { id, values = [] } = this.state;

		const regex = /\[([^\]]+)\]/g;
		const segments = [];
		const selectIndices = [];

		let lastIndex = 0;
		let match;
		let nSelects = startIndex;

		while ((match = regex.exec(str)) !== null) {
			// Text before the current match
			if (match.index > lastIndex) {
				segments.push(str.slice(lastIndex, match.index));
			}

			// Parse options: [opt | *correctOpt | opt]
			const options = match[1].split("|").map((opt) => opt.trim());
			const winner = options.findIndex((opt) => opt.startsWith("*"));
			const cleanOptions = options.map((opt) =>
				opt.startsWith("*") ? opt.substring(1) : opt
			);

			const selectIndex = nSelects;
			const selectId = `${id}select${selectIndex}`;
			const currentValue = values[selectIndex] ?? "";

			// Store the winning value for autoSolve
			if (winner >= 0) {
				this.correctValues[selectIndex] = String(winner);
			} else {
				this.correctValues[selectIndex] = ""; // no explicit winner
			}

			segments.push(
				<span
					className="inline-block"
					id={selectId}
					key={selectId}
				>
					<Select
						value={currentValue}
						onValueChange={(value) =>
							this.handleSelectChange(value, winner, selectIndex)
						}
					>
						<SelectTrigger className={DROPDOWN_TRIGGER_TEXT_CLASS}>
							<SelectValue placeholder="Select answer" />
						</SelectTrigger>
						<SelectContent>
							{cleanOptions.map((opt, i) => (
								<SelectItem
									key={`${selectId}-opt-${i}`}
									value={String(i)}
									className={`${i === winner ? "hint " : ""}text-[var(--font-size-sm)] md:text-[1.2rem]`}
								>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</span>
			);

			selectIndices.push(selectIndex);
			nSelects++;

			({ lastIndex } = regex);// .lastIndex;
		}

		// Trailing text after the last match
		if (lastIndex < str.length) {
			segments.push(str.slice(lastIndex));
		}

		return {
			nSelects,
			segments,
			selectIndices,
		};
	};

	// Fill in all correct answers using the winners stored during parsing
	autoSolve = () => {
		const correctValues = this.correctValues || [];

		const solved = correctValues.map((v) =>
			v !== "" && v !== undefined ? 1 : 0
		);

		const nCorrect = solved.filter((s) => s === 1).length;

		this.setState({
			// You can decide whether to reset failCount here or not:
			failCount: 0,
			nCorrect,
			solved,
			values: correctValues,
		});
	};

	render = () => {
		const {
			// audio,
			cheatText,
			// complete = false,
			failCount = 0,
			footnote,
			footnoteHTML,
			htmlContent = "",
			id = [],
			listenDescriptionText,
			nCorrect = 0,
			items = [],
			// phrasesHTML = "",
			soundFile,
			solved = [],
		} = this.state;

		let content;
		this.nToSolve = 0;
		this.correctValues = []; // reset before we re-parse in this render

		if (items.length > 0) {
			// Build phrases -> JSX and track which selects belong to each phrase
			const phraseList = []; // per row: JSX segments array
			const phraseSelectIndices = []; // per row: array of select indices

			let nSelects = 0;

			for (let i = 0; i < items.length; i++) {
				const {text} = items[i];

				if (!text) {
					// spacer row → keep indices aligned
					phraseList.push(null);
					phraseSelectIndices.push([]);
					continue;
				}

				const {
					segments,
					selectIndices,
					nSelects: updatedNSelects,
				} = this.parseBracketedOptions(nSelects, text);

				phraseList.push(segments);
				phraseSelectIndices.push(selectIndices);
				nSelects = updatedNSelects;
			}


			this.nToSolve = nSelects;

			// Build table rows
			const rows = [];

			for (let i = 0; i < items.length; i++) {
				const phrase = items[i].text;
				const cells = [];
				// console.log("phrase", phrase[0]);// , phrase.length);
				if (!phrase) {
					// blank row
					rows.push(
						<TableRow className="spacer" key={`row${i}`}>
							<TableCell colSpan={3}></TableCell>
						</TableRow>
					);
				} else {
					// Determine row status based on its selects
					const indices = phraseSelectIndices[i] || [];
					let rowStatus = "";

					if (indices.length > 0) {
						const statuses = indices.map((idx) => solved[idx]);
						if (statuses.length && statuses.every((s) => s === 1)) {
							rowStatus = "correct";
						} else if (statuses.some((s) => s === -1)) {
							rowStatus = "incorrect";
						}
					}

					cells.push(
						<TableCell key={`row${i}cell1`}>
							<p key={`p-${i}`} className={rowStatus}>
								{phraseList[i]}
								{/* Tick / cross icons – shown/hidden via CSS on .correct / .incorrect */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									className="tick"
								>
									<path
										fill="currentColor"
										d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 352 512"
									className="cross"
								>
									<path
										fill="currentColor"
										d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
									/>
								</svg>
							</p>
						</TableCell>
					);

					if (items[i].audio){// audio && audio[i]) {
						const soundFile = resolveAsset(`${items[i].audio}`);

						cells.push(
							<TableCell key={`row${i}cell2`} className={`audioCell`}>
								<AudioClip
									className="super-compact-speaker"
									id={`row${i}cell2AudioClip`}
									soundFile={soundFile}
								/>
							</TableCell>
						);
					}

					rows.push(
						<TableRow key={`row${i}`}>
							{cells}
						</TableRow>
					);
				}
			}

			content = (
				<Table className={DROPDOWNS_TABLE_TEXT_CLASS}>
					<TableBody>{rows}</TableBody>
				</Table>
			);
		}

		return (
			<div
				className="drop-downs-container container"
				id={`${id ? id : ""}`}
				key={`${id}DropDowns]`}
			>
				{htmlContent && htmlContent !== "" ? (
					<div
						className="html-content"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
					/>
				) : null}

				{listenDescriptionText && soundFile ? (
					<AudioClip
						id={`listen-${id}`}
						listenText={listenDescriptionText}
						soundFile={soundFile}
					/>
				) : null}

				{content}


				<p key={`p-n-of-m`}>
					<span className="n-placed">{nCorrect}</span> correct out of{" "}
					{`${this.nToSolve}`}
				</p>
					<div className="help">
						<IconButton
							ariaLabel={cheatText}
							className={`hidden-help max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11 ${failCount >= 1 ? "show" : ""}`}
							onClick={this.autoSolve}
							theme={`eye`}
							title={cheatText}
						>
							<span className="hidden min-[560px]:inline">{cheatText}</span>
						</IconButton>
						<IconButton
							ariaLabel="Reset"
							className={`hidden-help max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11 ${nCorrect >= 1 || failCount >= 1 ? "show" : ""}`}
							onClick={this.handleReset}
							theme={`reset`}
							title="Reset"
						>
							<span className="hidden min-[560px]:inline">Reset</span>
						</IconButton>
					</div>

				{footnote ? (
					<p key={`p-footnote`} className="footnote">
						{footnote}
					</p>
				) : null}

				{footnoteHTML ? (
					<p
						key={`p-footnote-html`}
						className="footNote"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(footnoteHTML) }}
					/>
				) : null}
			</div>
		);
	};
}
