import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { AudioClip, IconButton } from "@/components/media";
import { CircularAudioProgressAnimatedSpeakerDisplay } from "@/components/AudioClip";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";
import { resolveAsset } from "@/utils/assets";

const INLINE_CHOICE_TABLE_TEXT_CLASS = "text-[var(--font-size-sm)] md:text-base";

export class InlineChoiceGroup extends React.PureComponent {
	constructor(props) {
		super(props);
		const sourceItems = props?.config?.items || [];

		this.state = {
			...props.config,
			activeRowIndex: -1,
			activeItems: this.prepareExerciseItems(sourceItems, props?.config || {}),
			checkedResults: {},
			hasChecked: false,
			masterPlayState: "stopped",
			nCorrect: 0,
			rowAudioStatus: {},
			rowProgress: {},
			values: {},
		};

		this.blanksMeta = [];
		this.nToSolve = 0;
		this.rowAudioRefs = {};
		this.sequenceRef = React.createRef();
	}

	decodeHtmlEntities = (value = "") => {
		const text = `${value}`;
		if (!text.includes("&")) {
			return text;
		}

		if (typeof document === "undefined") {
			return text.replaceAll("&apos;", "'");
		}

		const textarea = document.createElement("textarea");
		textarea.innerHTML = text;
		return textarea.value;
	};

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			const sourceItems = this.props?.config?.items || [];
			this.setState({
				...this.props.config,
				activeRowIndex: -1,
				activeItems: this.prepareExerciseItems(sourceItems, this.props?.config || {}),
				checkedResults: {},
				hasChecked: false,
				masterPlayState: "stopped",
				nCorrect: 0,
				rowAudioStatus: {},
				rowProgress: {},
				values: {},
			});
			this.blanksMeta = [];
			this.nToSolve = 0;
			this.rowAudioRefs = {};
		}
	}

	shuffleArray = (items = []) => {
		const shuffled = [...items];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}
		return shuffled;
	};

	prepareExerciseItems = (items = [], options = {}) => {
		const {
			sampleSize,
			shuffleItems = false,
		} = options;

		let prepared = [...items];
		if (shuffleItems) {
			prepared = this.shuffleArray(prepared);
		}

		const parsedSampleSize = Number.parseInt(sampleSize, 10);
		if (
			Number.isFinite(parsedSampleSize) &&
			parsedSampleSize > 0 &&
			parsedSampleSize < prepared.length
		) {
			prepared = prepared.slice(0, parsedSampleSize);
		}

		return prepared;
	};

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
					value: this.decodeHtmlEntities(text.slice(lastIndex, match.index)),
				});
			}

			const options = match[1].split("|").map((opt) => opt.trim());
			const winner = options.findIndex((opt) => opt.startsWith("*"));
			const cleanOptions = options.map((opt) =>
				this.decodeHtmlEntities(opt.startsWith("*") ? opt.substring(1) : opt)
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
				value: this.decodeHtmlEntities(text.slice(lastIndex)),
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

			// Editing after check should only invalidate the edited blank, not all blanks.
			if (prevState.hasChecked) {
				const checkedResults = {
					...prevState.checkedResults,
				};
				delete checkedResults[blankIndex];
				const nCorrect = Object.values(checkedResults).filter(Boolean).length;

				return {
					values,
					hasChecked: true,
					checkedResults,
					nCorrect,
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
		this.setState((prevState) => {
			const sourceItems = this.props?.config?.items || [];
			const parsedSampleSize = Number.parseInt(prevState.sampleSize, 10);
			const hasSampleSize = Number.isFinite(parsedSampleSize) && parsedSampleSize > 0;
			const sampleOnReset = prevState.sampleOnReset !== undefined ? Boolean(prevState.sampleOnReset) : true;
			const shouldRefreshItemSet = Boolean(prevState.shuffleItems) || (hasSampleSize && sampleOnReset);

			return {
				activeRowIndex: -1,
				activeItems: shouldRefreshItemSet
					? this.prepareExerciseItems(sourceItems, prevState)
					: (prevState.activeItems || []),
				checkedResults: {},
				hasChecked: false,
				masterPlayState: "stopped",
				nCorrect: 0,
				rowAudioStatus: {},
				rowProgress: {},
				values: {},
			};
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

	handleRowAudioStatusChange = (rowIndex, status) => {
		this.setState((prevState) => {
			const nextRowAudioStatus = {
				...prevState.rowAudioStatus,
			};
			nextRowAudioStatus[rowIndex] = status;

			if (status === "playing") {
				Object.keys(nextRowAudioStatus).forEach((key) => {
					const keyIndex = Number.parseInt(key, 10);
					if (keyIndex !== rowIndex && nextRowAudioStatus[keyIndex] === "playing") {
						nextRowAudioStatus[keyIndex] = "stopped";
					}
				});
			}

			return {
				rowAudioStatus: nextRowAudioStatus,
			};
		});
	};

	triggerRowAudio = (rowIndex) => {
		const rowAudioHost = this.rowAudioRefs[rowIndex];
		if (!rowAudioHost) return;
		const buttonEl = rowAudioHost.querySelector("button.audio-container");
		if (!buttonEl) return;
		buttonEl.click();
	};

	handleSentenceClick = (rowIndex, event) => {
		const targetNode = event?.target;
		if (
			targetNode instanceof Element &&
			targetNode.closest("button, [role='radio'], .audio-container, .audio-link")
		) {
			return;
		}

		this.triggerRowAudio(rowIndex);
	};

	handleMasterStopped = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
		this.setState((prevState) => ({
			activeRowIndex: -1,
			masterPlayState: "stopped",
			rowProgress: rowIndex >= 0 ? {
				...prevState.rowProgress,
				[rowIndex]: {
					currentTime: prevState.rowProgress[rowIndex]?.duration || 0,
					duration: prevState.rowProgress[rowIndex]?.duration || 0,
				},
			} : prevState.rowProgress,
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
		const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
		if (rowIndex < 0) return;

		this.setState((prevState) => ({
			rowProgress: {
				...prevState.rowProgress,
				[rowIndex]: {
					currentTime,
					duration,
				},
			},
		}));
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
							stateClasses = "border-[color-mix(in_oklab,var(--chart-4)_58%,var(--border))] bg-[color-mix(in_oklab,var(--chart-4)_26%,transparent)] text-foreground font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--chart-4)_34%,transparent)]";
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
			activeItems = [],
			listenDescriptionText,
			nCorrect = 0,
			rowAudioStatus = {},
			soundFile,
			useSequenceAudioController = false,
			values = {},
		} = this.state;

		this.blanksMeta = [];
		this.nToSolve = 0;

		const rows = [];
		let blankCursor = 0;
		const playlist = activeItems
			.map((item, index) => ({
				rowIndex: index,
				src: item?.audio ? resolveAsset(item.audio) : null,
			}))
			.filter((entry) => Boolean(entry.src));
		const rowToPlaylistIndex = {};
		playlist.forEach((entry, index) => {
			rowToPlaylistIndex[entry.rowIndex] = index;
		});

		for (let i = 0; i < activeItems.length; i += 1) {
			const item = activeItems[i];
			const phraseText = item?.text || "";
			const playlistIndex = rowToPlaylistIndex[i];
			const useMasterRowAudio = useSequenceAudioController && playlistIndex !== undefined;
			const isActive = this.state.activeRowIndex === i;
			const status = isActive
				? (this.state.masterPlayState === "playing" ? "playing" : "stopped")
				: "stopped";
			const rowVisualStatus = useMasterRowAudio ? status : rowAudioStatus[i];
			const prog = this.state.rowProgress[i] || { currentTime: 0, duration: 0 };

			if (!phraseText) {
				rows.push(
					<TableRow className="spacer" key={`row-${i}`}>
						<TableCell colSpan={1}></TableCell>
					</TableRow>
				);
				continue;
			}

			const { nextBlankIndex, segments } = this.parseSentence(phraseText, blankCursor);
			blankCursor = nextBlankIndex;
			const rowBlankIndices = segments
				.filter((segment) => segment.type === "choice")
				.map((segment) => segment.blankIndex);
			const rowAttempted = rowBlankIndices.some((idx) => {
				const rawValue = this.state.values[idx];
				return rawValue !== undefined && rawValue !== null && rawValue !== "";
			});
			const rowResultValues = rowBlankIndices.map((idx) => this.state.checkedResults[idx]);
			const rowFullyChecked =
				rowBlankIndices.length > 0 &&
				rowResultValues.every((result) => typeof result === "boolean");
			const rowIsCorrect =
				this.state.hasChecked &&
				rowAttempted &&
				rowFullyChecked &&
				rowResultValues.every((result) => result === true);
			const rowHasResult = this.state.hasChecked && rowAttempted && rowFullyChecked;

			rows.push(
				<TableRow key={`row-${i}`}>
					<TableCell className="align-top px-0 py-2">
						<div
							className={`m-0 flex items-start gap-2 leading-[var(--line-height-app)] ${item.audio ? "cursor-pointer" : ""} ${rowVisualStatus === "playing" ? "text-[var(--chart-2)]" : ""}`}
							onClick={item.audio ? (event) => this.handleSentenceClick(i, event) : undefined}
						>
							{item.audio ? (
								<span
									className={`inline-flex shrink-0 self-start ${rowBlankIndices.length > 0 ? "pt-[15px]" : "pt-0.5"}`}
									ref={(el) => {
										if (el) {
											this.rowAudioRefs[i] = el;
										}
									}}
								>
									{useMasterRowAudio ? (
										<CircularAudioProgressAnimatedSpeakerDisplay
											className="super-compact-speaker shrink-0"
											duration={prog.duration}
											handleClick={(event) => {
												event.preventDefault();
												event.stopPropagation();

												if (isActive) {
													this.sequenceRef.current?.toggle();
													return;
												}

												this.sequenceRef.current?.playItem(playlistIndex, {
													playSequence: false,
												});
											}}
											progress={prog.currentTime}
											status={status}
											title={isActive ? "Click to pause" : "Click to play"}
										/>
									) : (
										<AudioClip
											className="super-compact-speaker"
											id={`inlineChoiceRowAudio-${i}`}
											onStatusChange={(nextStatus) => this.handleRowAudioStatusChange(i, nextStatus)}
											soundFile={resolveAsset(item.audio)}
										/>
									)}
								</span>
							) : null}
							<div className="min-w-0 flex-1">{this.renderSentence(segments)}</div>
							{rowHasResult ? (
								<span
									aria-hidden="true"
									className={`inline-flex shrink-0 items-center justify-center pt-0.5 ${rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]"}`}
								>
									{rowIsCorrect ? (
										<CircleCheck className="h-10 w-10" />
									) : (
										<CircleX className="h-10 w-10" />
									)}
								</span>
							) : null}
						</div>
					</TableCell>
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

				{useSequenceAudioController && playlist.length > 0 ? (
					<SequenceAudioController
						ref={this.sequenceRef}
						onPlayStateChange={this.handleMasterPlayStateChange}
						onStopped={(playlistIndex) => this.handleMasterStopped(playlistIndex, playlist)}
						onTimeUpdate={(playlistIndex, clipTime, clipDuration) =>
							this.handleMasterTime(playlistIndex, clipTime, clipDuration, playlist)
						}
						onTrackChange={(playlistIndex) => this.handleMasterTrackChange(playlistIndex, playlist)}
						pauseSeconds={0.5}
						sources={playlist.map((entry) => entry.src)}
					/>
				) : null}

				{listenDescriptionText && soundFile && !(useSequenceAudioController && playlist.length > 0) ? (
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
