import {
	AudioClip,
	IconButton,
	ProgressDots,
} from "..";
import { exerciseActionButtonVariants } from "@/components/exerciseActionButtonVariants";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import React from "react";
import { resolveAsset } from "../../utility";

const INLINE_CHOICE_TABLE_TEXT_CLASS = "text-[var(--font-size-sm)] md:text-base";

export class InlineChoiceGroup extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			...props.config,
			checkedResults: {},
			hasChecked: false,
			nCorrect: 0,
			values: {},
		};

		this.blanksMeta = [];
		this.nToSolve = 0;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			this.setState({
				...this.props.config,
				checkedResults: {},
				hasChecked: false,
				nCorrect: 0,
				values: {},
			});
			this.blanksMeta = [];
			this.nToSolve = 0;
		}
	}

	parseSentence = (text, startBlankIndex) => {
		const segments = [];
		const regex = /\[([^\]]+)\]/g;
		let blankIndex = startBlankIndex;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				segments.push({
					key: `text-${blankIndex}-${lastIndex}`,
					type: "text",
					value: text.slice(lastIndex, match.index),
				});
			}

			const options = match[1].split("|").map((opt) => opt.trim());
			const winner = options.findIndex((opt) => opt.startsWith("*"));
			const cleanOptions = options.map((opt) =>
				opt.startsWith("*") ? opt.substring(1) : opt
			);

			this.blanksMeta[blankIndex] = {
				options: cleanOptions,
				winner,
			};

			segments.push({
				blankIndex,
				key: `choice-${blankIndex}`,
				type: "choice",
			});

			blankIndex += 1;
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < text.length) {
			segments.push({
				key: `tail-${blankIndex}-${lastIndex}`,
				type: "text",
				value: text.slice(lastIndex),
			});
		}

		return { nextBlankIndex: blankIndex, segments };
	};

	getCorrectCountFromValues = (values) => {
		let correct = 0;
		for (let i = 0; i < this.nToSolve; i += 1) {
			const winner = this.blanksMeta[i]?.winner;
			if (winner === -1) continue;
			if (parseInt(values[i], 10) === winner) {
				correct += 1;
			}
		}
		return correct;
	};

	handleChoiceChange = (blankIndex, value) => {
		this.setState((prevState) => {
			const values = {
				...prevState.values,
				[blankIndex]: value,
			};

			// Editing an answer returns the row to "pending" state (amber selection only)
			// until the learner explicitly presses "Check answers" again.
			if (prevState.hasChecked) {
				return {
					values,
					hasChecked: false,
					checkedResults: {},
					nCorrect: 0,
				};
			}

			return { values };
		});
	};

	handleChoiceKeyDown = (blankIndex, currentOptionIndex, optionsLength, event) => {
		if (optionsLength <= 0) return;
		let nextIndex = null;

		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				nextIndex = (currentOptionIndex + 1) % optionsLength;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				nextIndex = (currentOptionIndex - 1 + optionsLength) % optionsLength;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = optionsLength - 1;
				break;
			case " ":
			case "Enter":
				nextIndex = currentOptionIndex;
				break;
			default:
				return;
		}

		event.preventDefault();
		this.handleChoiceChange(blankIndex, String(nextIndex));
	};

	handleCheckAnswers = () => {
		const checkedResults = {};
		for (let i = 0; i < this.nToSolve; i += 1) {
			const winner = this.blanksMeta[i]?.winner;
			checkedResults[i] = parseInt(this.state.values[i], 10) === winner;
		}

		this.setState({
			checkedResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
		});
	};

	handleReset = () => {
		this.setState({
			checkedResults: {},
			hasChecked: false,
			nCorrect: 0,
			values: {},
		});
	};

	handleShowAnswers = () => {
		const values = {};
		const checkedResults = {};
		for (let i = 0; i < this.nToSolve; i += 1) {
			const winner = this.blanksMeta[i]?.winner;
			values[i] = String(winner);
			checkedResults[i] = true;
		}

		this.setState({
			checkedResults,
			hasChecked: true,
			nCorrect: this.nToSolve,
			values,
		});
	};

	renderChoiceGroup = (blankIndex) => {
		const { checkedResults = {}, hasChecked = false, values = {} } = this.state;
		const meta = this.blanksMeta[blankIndex];
		if (!meta) return null;

		const selectedValue = values[blankIndex] ?? "";
		const selectedIndex = selectedValue === "" ? -1 : parseInt(selectedValue, 10);
		const isCorrectSelection = checkedResults[blankIndex] === true;
		const isIncorrectSelection = hasChecked && checkedResults[blankIndex] === false;

		return (
			<span
				className="mx-1 inline-flex align-middle"
				key={`group-${blankIndex}`}
			>
				<div
					aria-label={`Choose answer for blank ${blankIndex + 1}`}
					className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-sm"
					role="radiogroup"
				>
					{meta.options.map((option, optionIndex) => {
						const isSelected = selectedIndex === optionIndex;
						const baseClasses = "inline-flex min-h-8 items-center rounded-lg border px-2.5 py-1 text-[var(--font-size-sm)] leading-[var(--line-height-app)] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out select-none";
						let stateClasses = "border-border/70 bg-background text-foreground hover:-translate-y-[1px] hover:border-[var(--chart-3)] hover:bg-[color-mix(in_oklab,var(--chart-3)_10%,transparent)] hover:shadow-[0_2px_8px_color-mix(in_oklab,var(--chart-3)_14%,transparent)]";

						if (isSelected && isCorrectSelection) {
							stateClasses = "border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_20%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--chart-2)_35%,transparent)]";
						} else if (isSelected && isIncorrectSelection) {
							stateClasses = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_30%,transparent)]";
						} else if (isSelected) {
							stateClasses = "border-[var(--ped-warn)] bg-[color-mix(in_oklab,var(--ped-warn)_38%,transparent)] text-foreground font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ped-warn)_65%,transparent),0_0_0_2px_color-mix(in_oklab,var(--ped-warn)_28%,transparent)]";
						}

						return (
							<button
								aria-checked={isSelected}
								className={`${baseClasses} ${stateClasses} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2`}
								key={`inline-choice-${this.state.id}-${blankIndex}-${optionIndex}`}
								onClick={() => this.handleChoiceChange(blankIndex, String(optionIndex))}
								onKeyDown={(event) =>
									this.handleChoiceKeyDown(blankIndex, optionIndex, meta.options.length, event)
								}
								role="radio"
								tabIndex={isSelected || selectedIndex === -1 && optionIndex === 0 ? 0 : -1}
								type="button"
							>
								{option}
							</button>
						);
					})}
				</div>
			</span>
		);
	};

	renderSentence = (segments) => {
		return segments.map((segment) => {
			if (segment.type === "choice") {
				return this.renderChoiceGroup(segment.blankIndex);
			}
			return <React.Fragment key={segment.key}>{segment.value}</React.Fragment>;
		});
	};

	render = () => {
		const {
			cheatText = "Show answer",
			footnote,
			footnoteHTML,
			htmlContent = "",
			id = "",
			items = [],
			listenDescriptionText,
			nCorrect = 0,
			soundFile,
			values = {},
		} = this.state;

		this.blanksMeta = [];
		this.nToSolve = 0;

		const rows = [];
		let blankCursor = 0;

		for (let i = 0; i < items.length; i += 1) {
			const item = items[i];
			const phraseText = item?.text || "";

			if (!phraseText) {
				rows.push(
					<TableRow className="spacer" key={`row-${i}`}>
						<TableCell colSpan={3}></TableCell>
					</TableRow>
				);
				continue;
			}

			const { nextBlankIndex, segments } = this.parseSentence(phraseText, blankCursor);
			blankCursor = nextBlankIndex;

			rows.push(
				<TableRow key={`row-${i}`}>
					<TableCell>
						<div className="m-0 leading-[var(--line-height-app)]">
							{this.renderSentence(segments)}
						</div>
					</TableCell>
					{item.audio ? (
						<TableCell className="audioCell">
							<AudioClip
								className="super-compact-speaker"
								id={`inlineChoiceRowAudio-${i}`}
								soundFile={resolveAsset(item.audio)}
							/>
						</TableCell>
					) : null}
				</TableRow>
			);
		}

		this.nToSolve = blankCursor;
		const hasSelections = Object.keys(values).length > 0;
		const hasAnyIncorrect = this.state.hasChecked && nCorrect < this.nToSolve;

		return (
			<div
				className="inline-choice-group-container container"
				id={`${id || ""}`}
				key={`${id}InlineChoiceGroup`}
			>
				{htmlContent ? (
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

				<Table className={INLINE_CHOICE_TABLE_TEXT_CLASS}>
					<TableBody>{rows}</TableBody>
				</Table>

				<div className="exercise-divider" data-orientation="horizontal" role="none" />
				<ProgressDots correct={nCorrect} total={this.nToSolve} />
				<div className="exercise-divider" data-orientation="horizontal" role="none" />

				<div className="exercise-help exercise-help-wrap">
					<div className="exercise-help-actions">
						<IconButton
							ariaLabel={cheatText}
							className={exerciseActionButtonVariants({
								progressive: true,
								tone: "warn",
								visible: hasAnyIncorrect,
							})}
							onClick={this.handleShowAnswers}
							theme="eye"
						>
							<span className="exercise-icon-button-label">{cheatText}</span>
						</IconButton>

						<IconButton
							ariaLabel="Reset"
							className={exerciseActionButtonVariants({
								progressive: true,
								tone: "neutral",
								visible: hasSelections || this.state.hasChecked,
							})}
							onClick={this.handleReset}
							theme="reset"
						>
							<span className="exercise-icon-button-label">Reset</span>
						</IconButton>

						<IconButton
							ariaLabel="Check answers"
							className={exerciseActionButtonVariants({
								align: "right",
								progressive: false,
								tone: "primary",
								visible: true,
							})}
							onClick={this.handleCheckAnswers}
							theme="check"
						>
							<span className="exercise-icon-button-label">Check answers</span>
						</IconButton>
					</div>
				</div>

				{footnote ? <p className="footnote">{footnote}</p> : null}
				{footnoteHTML ? (
					<p
						className="footNote"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(footnoteHTML) }}
					/>
				) : null}
			</div>
		);
	};
}
