import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { TypedAnswerField } from "@/components/content";
import { AudioClip, IconButton } from "@/components/media";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import { CircleCheck, CircleX, Mars, Venus } from "lucide-react";
import React from "react";
import {
	resolveAsset,
} from "@/utils/assets";
import { stopAllAudioPlayback } from "@/utils/audioPlayback";
import { highlightTextDiff } from "@/utils/exerciseDiff";

// Shared runtime for typed-response table exercises.
// This is the compatibility layer used by:
// - TypedTransformExercise (semantic)
// - DictationExercise (semantic)
//
// TODO(component-split): once TypedTransformExercise and DictationExercise
// have distinct scoring/normalization rules, move shared UI-only parts into a
// base renderer and keep separate behavior controllers.
export class TextEntryExerciseRuntime extends React.PureComponent {
	constructor(props) {
		super(props);
		this.audioTriggerRefs = {};
		this.state = {
			...props.config,
			checkedResults: {},
			diffResults: {},
			hasChecked: false,
			nCorrect: 0,
			values: {},
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			this.setState({
				...this.props.config,
				checkedResults: {},
				diffResults: {},
				hasChecked: false,
				nCorrect: 0,
				values: {},
			});
		}
	}

	extractExpectedAnswer = (value = "") => {
		const match = `${value}`.match(/\[([^\]]+)\]/);
		if (!match) return "";
		return match[1].trim();
	};

	normalizeForDictationCompare = (text = "") => {
		return `${text}`
			.normalize("NFC")
			.replace(/[’`´ʻʼ]/g, "'")
			.replace(/[.,!?;:…]/g, " ")
			.replace(/[«»“”„"]/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	};

	isAnswerCorrect = (userValue = "", expected = "") => {
		const { comparisonOptions = {} } = this.props;
		const { comparisonMode = "strict" } = comparisonOptions;

		if (comparisonMode === "dictation") {
			return this.normalizeForDictationCompare(userValue) === this.normalizeForDictationCompare(expected);
		}

		return `${userValue}`.trim() === `${expected}`.trim();
	};

	handleInputChange = (index, userValue) => {
		this.setState((prevState) => {
			const values = {
				...prevState.values,
				[index]: userValue,
			};

			if (!prevState.hasChecked) return { values };

			const checkedResults = {
				...prevState.checkedResults,
			};
			delete checkedResults[index];

			return {
				values,
				checkedResults,
				diffResults: prevState.diffResults,
				nCorrect: Object.values(checkedResults).filter(Boolean).length,
			};
		});
	};

	handleCheckAnswers = () => {
		const {
			phrases = [],
			values = {},
		} = this.state;

		const checkedResults = {};
		const diffResults = {};
		const nextValues = {
			...values,
		};
		for (let i = 0; i < phrases.length; i += 1) {
			const expected = this.extractExpectedAnswer(phrases[i]?.[1] || "");
			if (!expected) continue;

			const userValue = values[i];
			if (userValue === undefined || userValue === null || `${userValue}`.trim() === "") continue;
			const trimmedUserValue = `${userValue}`.trim();
			nextValues[i] = trimmedUserValue;
			checkedResults[i] = this.isAnswerCorrect(trimmedUserValue, expected);
			diffResults[i] = highlightTextDiff(
				trimmedUserValue,
				expected,
				() => {},
				false,
				this.props.comparisonOptions || {}
			);
		}

		this.setState({
			checkedResults,
			diffResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
			values: nextValues,
		});
	};

	handleInputKeyDown = (index, event) => {
		if (event.key !== "Enter" && event.key !== "NumpadEnter") return;
		event.preventDefault();
		const latestValue = event.currentTarget?.value ?? "";
		this.setState((prevState) => ({
			values: {
				...prevState.values,
				[index]: latestValue,
			},
		}), this.handleCheckAnswers);
	};

	handleShowAnswers = () => {
		const {
			phrases = [],
		} = this.state;

		const values = {};
		const checkedResults = {};
		const diffResults = {};
		for (let i = 0; i < phrases.length; i += 1) {
			const expected = this.extractExpectedAnswer(phrases[i]?.[1] || "");
			if (!expected) continue;
			values[i] = expected;
			checkedResults[i] = true;
			diffResults[i] = highlightTextDiff(
				expected,
				expected,
				() => {},
				false,
				this.props.comparisonOptions || {}
			);
		}

		this.setState({
			checkedResults,
			diffResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
			values,
		});
	};

	handleReset = () => {
		stopAllAudioPlayback();
		this.setState({
			checkedResults: {},
			diffResults: {},
			hasChecked: false,
			nCorrect: 0,
			values: {},
		});
	};

	setAudioTriggerRef = (rowIndex, node) => {
		if (!node) {
			delete this.audioTriggerRefs[rowIndex];
			return;
		}

		this.audioTriggerRefs[rowIndex] = node;
	};

	handlePromptAudioClick = (rowIndex, soundFile, event) => {
		event.preventDefault();
		event.stopPropagation();

		const triggerHost = this.audioTriggerRefs[rowIndex];
		const trigger = triggerHost?.querySelector(
			"button.audio-container, button.audio-link, .audio-container, .audio-link"
		);

		if (trigger instanceof HTMLElement) {
			trigger.click();
			return;
		}

		if (!soundFile) {
			return;
		}
	};

	renderPromptText = (promptText, soundFile, rowIndex) => {
		if (!soundFile) {
			return promptText;
		}

		return (
			<button
				type="button"
				className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-fs-sm leading-[var(--line-height-app)] text-foreground transition-colors duration-150 hover:text-[var(--edu-affirm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base"
				onClick={(event) => this.handlePromptAudioClick(rowIndex, soundFile, event)}
			>
				{promptText}
			</button>
		);
	};

	render = () => {
		const {
			audioClipClassName = "compact",
			audioColumnPosition = "right",
			comparisonOptions = undefined,
			useGlobalActions = false,
		} = this.props;
		const {
			checkedResults = {},
			compoundID,
			cheatText = "Show answers",
			diffResults = {},
			header,
			hasChecked = false,
			htmlContent,
			id = [],
			nCorrect = 0,
			phrases = [],
			values = {},
		} = this.state;
		const hasNonEmptyPromptColumn = phrases.some((phrase) => `${phrase?.[0] || ""}`.trim() !== "");
		const shouldInlineAudioWithPrompt = useGlobalActions && hasNonEmptyPromptColumn;

		const expectedByRow = phrases.map((phrase) => this.extractExpectedAnswer(phrase?.[1] || ""));
		const nPhrases = expectedByRow.filter(Boolean).length;

		let longestRow = 0;
		for (let i = 0; i < phrases.length; i += 1) {
			if (phrases[i].length > longestRow) longestRow = phrases[i].length;
		}

		const headerCells = [];
		if (header) {
			let headerOrder = header;
			if (shouldInlineAudioWithPrompt && header.length >= 2) {
				headerOrder = [header[0], header[1], ...header.slice(3)];
			}
			if (
				longestRow > 2 &&
				audioColumnPosition === "left" &&
				!shouldInlineAudioWithPrompt &&
				header.length >= 3
			) {
				headerOrder = [header[2], header[0], header[1], ...header.slice(3)];
			}

			for (let i = 0; i < headerOrder.length; i += 1) {
				let headerLabel = headerOrder[i];
				if (shouldInlineAudioWithPrompt && i < 2) {
					const lowerLabel = `${headerOrder[i]}`.toLowerCase();
					if (lowerLabel.includes("mascul")) {
						headerLabel = (
							<span className="inline-flex items-center gap-1.5">
								<Mars aria-hidden="true" className="h-4 w-4" />
								<span>{headerOrder[i]}</span>
							</span>
						);
					} else if (lowerLabel.includes("fem")) {
						headerLabel = (
							<span className="inline-flex items-center gap-1.5">
								<Venus aria-hidden="true" className="h-4 w-4" />
								<span>{headerOrder[i]}</span>
							</span>
						);
					}
				}
				headerCells.push(<TableHead key={`header-cell-${i}`}>{headerLabel}</TableHead>);
			}
		}

		const rows = [];
		for (let i = 0; i < phrases.length; i += 1) {
			const phrase = phrases[i];
			const soundCellIndex = 2;
			const soundFile = longestRow > soundCellIndex ? resolveAsset(`${phrase[soundCellIndex]}`) : null;
			const cells = [];

			if (phrase[0] === "" && phrase.length === 1) {
				rows.push(
					<TableRow className="spacer" key={`row${i}`}>
						<TableCell colSpan={longestRow} key={`cell-of-row-${i}`} />
					</TableRow>
				);
				continue;
			}

			if (phrase[0] !== "") {
				const promptCellClassName = useGlobalActions
					? (shouldInlineAudioWithPrompt ? "align-top w-[34%]" : "align-top")
					: undefined;
				const promptContent = this.renderPromptText(phrase[0], soundFile, i);
				cells.push(
					<TableCell className={promptCellClassName} key={`row${i}cell0`}>
						{shouldInlineAudioWithPrompt && soundFile ? (
							<div className="inline-flex items-center gap-2">
								<span ref={(node) => this.setAudioTriggerRef(i, node)}>
									<AudioClip className={audioClipClassName} label="" soundFile={soundFile} />
								</span>
								{promptContent}
							</div>
						) : (
							promptContent
						)}
					</TableCell>
				);
			}

			if (phrase[1] !== "" && !useGlobalActions) {
				const parts = [];
				const regex = /\[([^\]]+)\]/g;
				let lastIndex = 0;
				let match;
				let typedAnswerFieldIndex = 0;

				while ((match = regex.exec(phrase[1])) !== null) {
					if (match.index > lastIndex) {
						parts.push(phrase[1].slice(lastIndex, match.index));
					}

					parts.push(
						<TypedAnswerField
							key={`TypedAnswerField${i}-${typedAnswerFieldIndex}`}
							compact={true}
							comparisonOptions={comparisonOptions}
							id={`TypedAnswerField${i}-${typedAnswerFieldIndex}`}
							content={match[1]}
						/>
					);

					typedAnswerFieldIndex += 1;
					({ lastIndex } = regex);
				}

				if (lastIndex < phrase[1].length) {
					parts.push(phrase[1].slice(lastIndex));
				}

				cells.push(
					<TableCell key={`row${i}cell1`}>
						<span className="inline-typed-answer">{parts}</span>
					</TableCell>
				);
			}

			if (phrase[1] !== "" && useGlobalActions) {
				const rowHasResult = hasChecked && Object.prototype.hasOwnProperty.call(checkedResults, i);
				const rowHasDiff = hasChecked && Object.prototype.hasOwnProperty.call(diffResults, i);
				const rowIsCorrect = rowHasResult && checkedResults[i] === true;
				const userValue = values[i] || "";

				const inputToneClass = rowHasResult
					? (rowIsCorrect
						? "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_16%,transparent)]"
						: "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]")
					: userValue
						? "border-[var(--ex-neutral)] bg-[color-mix(in_oklab,var(--ex-neutral)_10%,transparent)]"
						: "border-border";
				const answerCellClassName = useGlobalActions
					? (shouldInlineAudioWithPrompt ? "align-top w-[66%]" : "align-top")
					: undefined;

				cells.push(
					<TableCell className={answerCellClassName} key={`row${i}cell1`}>
						<div className="space-y-1.5">
							<div className="grid w-full grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-2">
								<Input
									aria-label={`Item ${i + 1}: type your answer`}
									className={`min-h-10 text-fs-sm md:text-base ${inputToneClass}`}
									onChange={(event) => this.handleInputChange(i, event.target.value)}
									onKeyDown={(event) => this.handleInputKeyDown(i, event)}
									placeholder="Type your answer"
									type="text"
									value={userValue}
								/>
								<span
									aria-hidden="true"
									className={`inline-flex h-10 w-10 shrink-0 items-center justify-center transition-opacity duration-200 ${rowHasResult ? "opacity-100" : "opacity-0"} ${rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]"}`}
								>
									{rowIsCorrect ? <CircleCheck className="h-9 w-9" /> : <CircleX className="h-9 w-9" />}
								</span>
							</div>
							<div className="min-h-8">
								{rowHasDiff && diffResults[i] ? (
									<div
										className="comparison-result compact"
										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(diffResults[i]) }}
									/>
								) : null}
							</div>
						</div>
					</TableCell>
				);
			}

			if (longestRow > 2 && !shouldInlineAudioWithPrompt && soundFile) {
				const audioCell = (
					<TableCell
						className={useGlobalActions ? "align-top w-14" : undefined}
						key={`row${i}cell${soundCellIndex}`}
					>
						<div className={useGlobalActions ? "flex min-h-10 items-center" : undefined}>
							<span ref={(node) => this.setAudioTriggerRef(i, node)}>
								<AudioClip className={audioClipClassName} label="" soundFile={soundFile} />
							</span>
						</div>
					</TableCell>
				);

				if (audioColumnPosition === "left") {
					cells.unshift(audioCell);
				} else {
					cells.push(audioCell);
				}
			}

			rows.push(
				<TableRow key={`${compoundID}-row${i}`} visible-key={`${id}-row${i}`}>
					{cells}
				</TableRow>
			);
		}

		const hasAnyAttempt = Object.keys(values).some((key) => `${values[key]}`.trim() !== "");
		const hasAnyIncorrect = hasChecked && nCorrect < nPhrases;

		return (
			<div
				className="answer-table-container container"
				id={id || undefined}
				key={`${id}PhraseTable`}
			>
				{htmlContent ? <div className="html-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

				<Table className={useGlobalActions ? "table-fixed" : undefined}>
					{!header && (
						/* colgroup sets column widths for table-fixed independently of any header row */
						<colgroup>
							{longestRow > 2 && !shouldInlineAudioWithPrompt && <col style={{ width: "3.5rem" }} />}
							{hasNonEmptyPromptColumn && <col style={{ width: "34%" }} />}
							<col />
						</colgroup>
					)}
					{header ? (
						<TableHeader>
							<TableRow>{headerCells}</TableRow>
						</TableHeader>
					) : (
						/* zero-height th row satisfies WAVE "layout table"; widths come from colgroup above */
						<TableHeader>
							<TableRow style={{ height: 0 }}>
								{longestRow > 2 && !shouldInlineAudioWithPrompt && (
									<TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Audio</TableHead>
								)}
								{hasNonEmptyPromptColumn && (
									<TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Prompt</TableHead>
								)}
								<TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Answer</TableHead>
							</TableRow>
						</TableHeader>
					)}
					<TableBody>{rows}</TableBody>
				</Table>

				{useGlobalActions ? (
					<>
						<div className="exercise-divider" data-orientation="horizontal" role="none" />
						<ProgressDots correct={nCorrect} total={nPhrases} />
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
										visible: hasAnyAttempt || hasChecked,
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
					</>
				) : (
					<p>{nCorrect} correct out of {nPhrases}.</p>
				)}
			</div>
		);
	};
}
