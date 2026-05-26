import { ProgressDots } from "@/components/exercises/ProgressDots";
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { AudioClip, IconButton } from "@/components/media";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { resolveAsset } from "@/utils/assets";
import DOMPurify from "dompurify";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

export class RadioQuiz extends React.Component {
	constructor(props) {
		super(props);
		const { phrases = [] } = props.config || {};

		this.state = {
			...props.config,
			checkedResults: {},
			hasChecked: false,
			nCorrect: 0,
			selectedOptions: Array.from({ length: phrases.length }, () => null),
			showExplanation: {},
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			const { phrases = [] } = this.props.config || {};
			this.setState({
				...this.props.config,
				checkedResults: {},
				hasChecked: false,
				nCorrect: 0,
				selectedOptions: Array.from({ length: phrases.length }, () => null),
				showExplanation: {},
			});
		}
	}

	handleChoiceChange = (rowNum, optionIndex) => {
		this.setState((prevState) => {
			const selectedOptions = [...(prevState.selectedOptions || [])];
			selectedOptions[rowNum] = optionIndex;

			if (!prevState.hasChecked) {
				return { selectedOptions };
			}

			const checkedResults = {
				...prevState.checkedResults,
			};
			delete checkedResults[rowNum];

			const showExplanation = {
				...prevState.showExplanation,
			};
			delete showExplanation[rowNum];

			return {
				checkedResults,
				hasChecked: true,
				nCorrect: Object.values(checkedResults).filter(Boolean).length,
				selectedOptions,
				showExplanation,
			};
		});
	};

	handleCheckAnswers = () => {
		const { onComplete = () => {} } = this.props;
		const { phrases = [], selectedOptions = [] } = this.state;
		const checkedResults = {};
		const showExplanation = {};

		for (let i = 0; i < phrases.length; i += 1) {
			const answerIndex = phrases[i][1];
			const selectedOption = selectedOptions[i];
			if (selectedOption === null || selectedOption === undefined) {
				continue;
			}

			const isCorrect = selectedOption === answerIndex;
			checkedResults[i] = isCorrect;
			if (!isCorrect && phrases[i][2]) {
				showExplanation[i] = true;
			}
		}

		const nCorrect = Object.values(checkedResults).filter(Boolean).length;
		const allCorrect = phrases.length > 0 && nCorrect === phrases.length;

		this.setState(
			{
				checkedResults,
				hasChecked: true,
				nCorrect,
				showExplanation,
			},
			() => {
				if (allCorrect) {
					onComplete();
				}
			}
		);
	};

	handleReset = () => {
		const { onReset = () => {} } = this.props;
		const { phrases = [] } = this.state;
		this.setState(
			{
				checkedResults: {},
				hasChecked: false,
				nCorrect: 0,
				selectedOptions: Array.from({ length: phrases.length }, () => null),
				showExplanation: {},
			},
			() => {
				onReset();
			}
		);
	};

	handleShowAnswers = () => {
		const { onComplete = () => {} } = this.props;
		const { phrases = [] } = this.state;
		const selectedOptions = phrases.map((phrase) => phrase[1]);
		const checkedResults = {};

		for (let i = 0; i < phrases.length; i += 1) {
			checkedResults[i] = true;
		}

		this.setState(
			{
				checkedResults,
				hasChecked: true,
				nCorrect: phrases.length,
				selectedOptions,
				showExplanation: {},
			},
			() => {
				onComplete();
			}
		);
	};

	render = () => {
		const {
			cheatText = "Show answer",
			htmlContent,
			id = "",
			listenDescriptionText,
			nCorrect = 0,
			options = [],
			phrases = [],
			selectedOptions = [],
			checkedResults = {},
			hasChecked = false,
			showExplanation = {},
			soundFile,
			useSequenceAudioController = false,
		} = this.state;

		const rows = phrases.map((phraseRow, rowIndex) => {
			const phrase = phraseRow[0];
			const answerIndex = phraseRow[1];
			const explanation = phraseRow[2];
			const soundFile = phraseRow[3];
			const selectedOption = selectedOptions[rowIndex];
			const rowResult = checkedResults[rowIndex];
			const rowHasResult = typeof rowResult === "boolean";
			const rowIsCorrect = rowHasResult && rowResult === true;

			return (
				<div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-sm" key={`radio-${id}-${rowIndex}`}>
					<div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
						<div className="min-w-0 flex-1 text-left">
							{/* p→div: each quiz statement is a short <p> that WAVE flags as "possible heading" */}
							<div className="m-0 text-[var(--font-size-base)] leading-[var(--line-height-body)] text-foreground">{phrase}</div>
							{showExplanation[rowIndex] && explanation ? (
								<div className="mt-2 text-sm leading-[var(--line-height-body)] text-muted-foreground">{explanation}</div>
							) : null}
						</div>

						<div className="flex flex-wrap items-center gap-2 xl:max-w-[42%] xl:justify-end">
							<div
								aria-label={`Choose whether statement ${rowIndex + 1} is true or false`}
								className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-sm"
								role="radiogroup"
							>
								{options.map((option, optionIndex) => {
									const isSelected = selectedOption === optionIndex;
									const isCorrectSelection = rowHasResult && isSelected && optionIndex === answerIndex;
									const isIncorrectSelection = rowHasResult && isSelected && optionIndex !== answerIndex;
									const baseClasses = "inline-flex min-h-8 items-center rounded-lg border px-2.5 py-1 text-[var(--font-size-sm)] leading-[var(--line-height-app)] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out select-none";
									let stateClasses = "border-border/70 bg-background text-foreground hover:-translate-y-[1px] hover:border-[var(--chart-3)] hover:bg-[color-mix(in_oklab,var(--chart-3)_10%,transparent)] hover:shadow-[0_2px_8px_color-mix(in_oklab,var(--chart-3)_14%,transparent)]";

									if (isCorrectSelection) {
										stateClasses = "border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_20%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--chart-2)_35%,transparent)]";
									} else if (isIncorrectSelection) {
										stateClasses = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_30%,transparent)]";
									} else if (isSelected) {
										stateClasses = "border-[color-mix(in_oklab,var(--chart-4)_58%,var(--border))] bg-[color-mix(in_oklab,var(--chart-4)_26%,transparent)] text-foreground font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--chart-4)_34%,transparent)]";
									}

									return (
										<button
											aria-checked={isSelected}
											className={`${baseClasses} ${stateClasses} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2`}
											key={`radio-choice-${id}-${rowIndex}-${optionIndex}`}
											onClick={() => this.handleChoiceChange(rowIndex, optionIndex)}
											role="radio"
											tabIndex={isSelected || (selectedOption === null && optionIndex === 0) ? 0 : -1}
											type="button"
										>
											{option}
										</button>
									);
								})}
							</div>
							{soundFile ? (
								<div className="shrink-0">
									<AudioClip className="super-compact" soundFile={soundFile} />
								</div>
							) : null}
							<span
								aria-hidden="true"
								className={`inline-flex h-10 w-10 shrink-0 items-center justify-center ${rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]"}`}
								style={{ visibility: rowHasResult ? "visible" : "hidden" }}
							>
								{rowIsCorrect ? <CircleCheck className="h-10 w-10" /> : <CircleX className="h-10 w-10" />}
							</span>
						</div>
					</div>
				</div>
			);
		});

		const hasSelections = selectedOptions.some((value) => value !== null && value !== undefined);
		const hasAnyIncorrect = hasChecked && nCorrect < phrases.length;

		return (
			<div className="radio-quiz-container container w-full max-w-none px-0" id={id || undefined} key={`${id}PhraseTable`}>
				{htmlContent ? <div className="html-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

				{listenDescriptionText && soundFile ? (
					useSequenceAudioController ? (
						<div className="space-y-1">
							<SequenceAudioController sources={[resolveAsset(soundFile)]} />
						</div>
					) : (
						<AudioClip
							id={`listen-${id}`}
							listenText={listenDescriptionText}
							soundFile={soundFile}
						/>
					)
				) : null}

				<div className="space-y-3">{rows}</div>

				<div className="exercise-divider" data-orientation="horizontal" role="none" />
				<ProgressDots correct={nCorrect} total={phrases.length} />
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
								visible: hasSelections || hasChecked,
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
			</div>
		);
	};
}
