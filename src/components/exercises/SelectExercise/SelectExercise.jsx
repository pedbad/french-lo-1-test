import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { AudioClip, IconButton } from "@/components/media";
import { CircularAudioProgressAnimatedSpeakerDisplay } from "@/components/AudioClip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DOMPurify from "dompurify";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";
import { resolveAsset } from "@/utils/assets";

const SELECT_EXERCISE_TRIGGER_CLASS = "w-full min-h-10 text-[var(--font-size-sm)] md:text-base";
const SELECT_EXERCISE_INLINE_TRIGGER_CLASS = "inline-flex min-h-9 w-auto max-w-full align-middle text-[var(--font-size-sm)] md:text-base";
const SELECT_EXERCISE_INLINE_PASSAGE_TRIGGER_CLASS = "inline-flex h-8 w-auto max-w-full px-2 align-middle text-[var(--font-size-sm)] leading-[var(--line-height-app)]";
const SELECT_EXERCISE_PLACEHOLDER_TEXT = "Select answer";
const SELECT_EXERCISE_PASSAGE_ACCENTS = {
	blue: "var(--poem-accent-blue)",
	green: "var(--poem-accent-green)",
	indigo: "var(--poem-accent-indigo)",
	orange: "var(--poem-accent-orange)",
	red: "var(--poem-accent-red)",
	violet: "var(--poem-accent-violet)",
	yellow: "var(--poem-accent-yellow)",
};

export class SelectExercise extends React.PureComponent {
	constructor(props) {
		super(props);

		const initialItems = props?.config?.items || [];

		this.state = {
			...props.config,
			activeRowIndex: -1,
			checkedResults: {},
			hasChecked: false,
			masterPlayState: "stopped",
			nCorrect: 0,
			rowAudioStatus: {},
			rowProgress: {},
			shuffledItems: this.buildPreparedItems(initialItems, props?.config),
			values: {},
		};

		this.blanksMeta = [];
		this.nToSolve = 0;
		this.rowAudioRefs = {};
		this.sequenceRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			const nextItems = this.props?.config?.items || [];
			this.setState({
				...this.props.config,
				activeRowIndex: -1,
				checkedResults: {},
				hasChecked: false,
				masterPlayState: "stopped",
				nCorrect: 0,
				rowAudioStatus: {},
				rowProgress: {},
				shuffledItems: this.buildPreparedItems(nextItems, this.props?.config),
				values: {},
			});
			this.blanksMeta = [];
			this.nToSolve = 0;
			this.rowAudioRefs = {};
		}
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

	getSelectOptionTextLength = (value = "") => {
		const normalized = this.decodeHtmlEntities(`${value}`)
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		return normalized.length;
	};

	getInlineSelectTriggerStyle = (blankIndex, { passage = false } = {}) => {
		const meta = this.blanksMeta[blankIndex];
		const optionLengths = (meta?.options || []).map((option) =>
			this.getSelectOptionTextLength(option)
		);
		const placeholderLength = this.getSelectOptionTextLength(SELECT_EXERCISE_PLACEHOLDER_TEXT);
		const fallbackLength = passage ? 10 : 12;
		const longestOptionLength = optionLengths.length > 0
			? Math.max(...optionLengths)
			: fallbackLength;
		const extraChars = passage ? 2 : 3;
		const minChars = placeholderLength + extraChars;
		const maxChars = passage ? 18 : 30;
		const targetChars = Math.min(
			maxChars,
			Math.max(minChars, longestOptionLength + extraChars)
		);

		return {
			maxWidth: "100%",
			width: `${targetChars}ch`,
		};
	};

	shuffleArray = (values) => {
		const shuffled = [...values];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}
		return shuffled;
	};

	shuffleItemText = (text = "") => {
		if (!text.includes("[")) return text;

		return text.replace(/\[([^\]]+)\]/g, (_match, group) => {
			const options = group.split("|").map((option) => option.trim());
			const shuffled = this.shuffleArray(options);
			return `[${shuffled.join("|")}]`;
		});
	};

	buildShuffledItems = (items = []) => {
		return items.map((item) => {
			if (!item || typeof item !== "object") return item;
			if (!item.text || typeof item.text !== "string") return item;
			return {
				...item,
				text: this.shuffleItemText(item.text),
			};
		});
	};

	buildPreparedItems = (items = [], config = this.props?.config || {}) => {
		const withShuffledChoices = this.buildShuffledItems(items);
		const shouldShuffleItems = Boolean(config?.shuffleItems);
		const sampleSize = Number.isInteger(config?.sampleSize) ? config.sampleSize : null;
		const orderedItems = shouldShuffleItems
			? this.shuffleArray(withShuffledChoices)
			: withShuffledChoices;

		if (sampleSize && sampleSize > 0) {
			return orderedItems.slice(0, sampleSize);
		}

		return orderedItems;
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

	handleSelectChange = (blankIndex, value) => {
		this.setState((prevState) => {
			const values = {
				...prevState.values,
				[blankIndex]: value,
			};

			if (!prevState.hasChecked) {
				return { values };
			}

			const checkedResults = {
				...prevState.checkedResults,
			};
			delete checkedResults[blankIndex];

			return {
				values,
				checkedResults,
				hasChecked: true,
				nCorrect: Object.values(checkedResults).filter(Boolean).length,
			};
		});
	};

	handleCheckAnswers = () => {
		const checkedResults = {};
		for (let i = 0; i < this.nToSolve; i += 1) {
			const value = this.state.values[i];
			if (value === undefined || value === null || value === "") continue;
			const winner = this.blanksMeta[i]?.winner;
			checkedResults[i] = parseInt(value, 10) === winner;
		}

		this.setState({
			checkedResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
		});
	};

	handleReset = () => {
		const sourceItems = this.props?.config?.items || [];
		this.setState({
			checkedResults: {},
			hasChecked: false,
			nCorrect: 0,
			rowAudioStatus: {},
			shuffledItems: this.buildPreparedItems(sourceItems, this.props?.config),
			values: {},
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
					const keyIndex = parseInt(key, 10);
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
			targetNode.closest(
				"button, input, textarea, select, a, [role='combobox'], [role='listbox'], [role='option'], .audio-container, .audio-link"
			)
		) {
			return;
		}

		this.triggerRowAudio(rowIndex);
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

	handleMasterStopped = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
		this.setState((prev) => ({
			activeRowIndex: -1,
			masterPlayState: "stopped",
			rowProgress: rowIndex >= 0 ? {
				...prev.rowProgress,
				[rowIndex]: {
					currentTime: prev.rowProgress[rowIndex]?.duration || 0,
					duration: prev.rowProgress[rowIndex]?.duration || 0,
				},
			} : prev.rowProgress,
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
		this.setState((prev) => ({
			rowProgress: {
				...prev.rowProgress,
				[rowIndex]: {
					currentTime,
					duration,
				},
			},
		}));
	};

	renderSentenceWithoutChoices = (segments) => {
		return segments
			.filter((segment) => segment.type === "text")
			.map((segment) => segment.value)
			.join("")
			.replace(/\s+/g, " ")
			.trim();
	};

	renderInlineSelect = (blankIndex, localIndex, rowBlankIndices, triggerClassName = SELECT_EXERCISE_INLINE_TRIGGER_CLASS) => {
		const { id = "", values = {} } = this.state;
		const selectId = `${id}-select-${blankIndex}`;
		const meta = this.blanksMeta[blankIndex];
		const currentValue = values[blankIndex] ?? "";
		const isPassageTrigger = triggerClassName === SELECT_EXERCISE_INLINE_PASSAGE_TRIGGER_CLASS;
		const triggerStyle = this.getInlineSelectTriggerStyle(blankIndex, {
			passage: isPassageTrigger,
		});

		return (
			<span className="mx-1 inline-flex align-middle" key={selectId}>
				<label className="sr-only" htmlFor={selectId}>
					{`Select answer for blank ${blankIndex + 1}`}
				</label>
				<Select
					value={currentValue}
					onValueChange={(value) => this.handleSelectChange(blankIndex, value)}
				>
					<SelectTrigger className={triggerClassName} id={selectId} style={triggerStyle}>
						<SelectValue placeholder="Select answer" />
					</SelectTrigger>
					<SelectContent>
						{meta.options.map((option, optionIndex) => (
							<SelectItem
								className="text-[var(--font-size-sm)] md:text-base"
								key={`${selectId}-option-${optionIndex}`}
								value={String(optionIndex)}
							>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</span>
		);
	};

	getInlinePassageLineStyle = (accentKey) => {
		const accentColor = accentKey ? SELECT_EXERCISE_PASSAGE_ACCENTS[accentKey] : null;
		if (!accentColor) return {};

		return {
			accentColor,
			lineStyle: {
				boxShadow: `inset 0 1px 0 color-mix(in oklab, ${accentColor} 10%, transparent)`,
			},
		};
	};

	render = () => {
		const {
			cheatText = "Show answers",
			footnote,
			footnoteHTML,
			htmlContent = "",
			id = "",
			items = [],
			layoutMode = "rows",
			listenDescriptionText,
			renderInlineChoices = false,
			rowAudioStatus = {},
			shuffledItems = [],
			soundFile,
			useSequenceAudioController = false,
			values = {},
		} = this.state;

		this.blanksMeta = [];
		this.nToSolve = 0;

		const rows = [];
		const passageLines = [];
		let blankCursor = 0;

		const renderedItems = shuffledItems.length > 0 ? shuffledItems : items;
		const playlist = renderedItems
			.map((item, index) => ({
				rowIndex: index,
				src: item?.audio ? resolveAsset(item.audio) : null,
			}))
			.filter((entry) => Boolean(entry.src));
		const rowToPlaylistIndex = {};
		playlist.forEach((entry, index) => {
			rowToPlaylistIndex[entry.rowIndex] = index;
		});

		for (let i = 0; i < renderedItems.length; i += 1) {
			const item = renderedItems[i];
			const phraseText = item?.text || "";
			if (!phraseText) continue;
			const playlistIndex = rowToPlaylistIndex[i];
			const useMasterRowAudio = useSequenceAudioController && playlistIndex !== undefined;
			const isActive = this.state.activeRowIndex === i;
			const status = isActive
				? (this.state.masterPlayState === "playing" ? "playing" : "stopped")
				: "stopped";
			const prog = this.state.rowProgress[i] || { currentTime: 0, duration: 0 };

			const { nextBlankIndex, segments } = this.parseSentence(phraseText, blankCursor);
			const rowBlankIndices = segments
				.filter((segment) => segment.type === "choice")
				.map((segment) => segment.blankIndex);
			blankCursor = nextBlankIndex;

			const rowAttempted = rowBlankIndices.some((idx) => {
				const rawValue = this.state.values[idx];
				return rawValue !== undefined && rawValue !== null && rawValue !== "";
			});
			const rowResults = rowBlankIndices.map((idx) => this.state.checkedResults[idx]);
			const rowFullyChecked =
				rowBlankIndices.length > 0 &&
				rowResults.every((result) => typeof result === "boolean");
			const rowHasResult = this.state.hasChecked && rowAttempted && rowFullyChecked;
			const rowIsCorrect = rowHasResult && rowResults.every((result) => result === true);
			const rowHasChoices = rowBlankIndices.length > 0;

				if (layoutMode === "inline-passage") {
					const { accentColor, lineStyle } = this.getInlinePassageLineStyle(item?.passageAccent);
					const isPassageMeta = Boolean(item?.passageMeta);

					passageLines.push(
						/* <p>→<div>: short poem lines trigger WAVE "possible heading" alert */
						<div
							className={`relative m-0 overflow-hidden text-[var(--font-size-sm)] leading-[var(--line-height-app)] md:text-base ${
								isPassageMeta
									? "pt-1 text-right text-muted-foreground"
									: `rounded-lg border border-border/70 bg-background/80 px-3 py-2 shadow-sm ${
										item?.audio ? "cursor-pointer" : ""
									} ${
										isActive ? "text-[var(--chart-2)]" : rowBlankIndices.length === 0 ? "text-foreground/90" : ""
									}`
							}`}
							key={`select-passage-line-${id}-${i}`}
							onClick={item?.audio ? (event) => this.handleSentenceClick(i, event) : undefined}
							style={isPassageMeta ? undefined : lineStyle}
						>
						{accentColor && !isPassageMeta ? (
							<span
								aria-hidden="true"
								className="absolute inset-y-0 left-0 w-3"
								style={{ backgroundColor: accentColor }}
							/>
						) : null}
						<span
							className={`relative z-10 ${
								isPassageMeta
									? "block"
									: "grid grid-cols-[auto_minmax(0,1fr)_2.75rem] items-center gap-x-3 pl-2"
							}`}
						>
								{!isPassageMeta && item?.audio ? (
									<span
										className="inline-flex"
										ref={(el) => {
											if (el) this.rowAudioRefs[i] = el;
										}}
									>
										<CircularAudioProgressAnimatedSpeakerDisplay
											className="super-compact-speaker"
											duration={prog.duration}
											handleClick={(event) => {
												event.preventDefault();
												event.stopPropagation();

												const playlistIndex = rowToPlaylistIndex[i];
												if (playlistIndex === undefined) return;

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
									</span>
								) : null}
							<span className={`block min-w-0 ${isPassageMeta ? "" : "col-start-2"}`}>
								{segments.map((segment, segmentIndex) => {
									if (segment.type !== "choice") {
										return (
											<React.Fragment key={segment.key || `seg-${segmentIndex}`}>
												{segment.value}
											</React.Fragment>
										);
									}

									const blankIndex = segment.blankIndex;
									const localIndex = rowBlankIndices.indexOf(blankIndex);

									return this.renderInlineSelect(
										blankIndex,
										localIndex,
										rowBlankIndices,
										SELECT_EXERCISE_INLINE_PASSAGE_TRIGGER_CLASS
									);
								})}
							</span>
							{isPassageMeta ? null : (
								<span
									aria-hidden="true"
									className={`col-start-3 inline-flex min-h-10 w-11 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]") : "invisible"}`}
								>
									{rowBlankIndices.length > 0 ? (
										rowIsCorrect ? (
											<CircleCheck className="h-10 w-10" />
										) : (
											<CircleX className="h-10 w-10" />
										)
									) : null}
								</span>
							)}
						</span>
					</div>
				);
				continue;
			}

			rows.push(
				<div
					className={`rounded-xl border border-border/70 bg-card/60 ${
						rowHasChoices ? "p-3 md:p-4" : "px-3 py-2.5 md:px-4 md:py-3"
					} ${item.audio ? "cursor-pointer" : ""} ${
						item.audio && (useMasterRowAudio ? isActive : rowAudioStatus[i] === "playing")
							? "text-[var(--chart-2)]"
							: ""
					}`}
					key={`select-row-${id}-${i}`}
					onClick={item.audio ? (event) => this.handleSentenceClick(i, event) : undefined}
				>
					<div
						className={`grid grid-cols-[auto_minmax(0,1fr)_2.75rem] ${
							renderInlineChoices
								? "items-center gap-x-3"
								: rowHasChoices
									? "grid-rows-[auto_auto] items-start gap-x-3 gap-y-2"
									: "items-start gap-x-3"
						}`}
					>
						{item.audio ? (
							<span
								className={
									renderInlineChoices
										? "self-start pt-1"
										: rowHasChoices
											? "row-span-2 self-start pt-0.5"
											: "self-start pt-0.5"
								}
								ref={(el) => {
									if (el) this.rowAudioRefs[i] = el;
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
										className="super-compact-speaker shrink-0"
										id={`selectExerciseRowAudio-${i}`}
										onStatusChange={(nextStatus) => this.handleRowAudioStatusChange(i, nextStatus)}
										soundFile={resolveAsset(item.audio)}
									/>
								)}
							</span>
						) : null}

						{renderInlineChoices ? (
							<div className="col-start-2 min-w-0 text-[var(--font-size-sm)] leading-[var(--line-height-app)] md:text-base">
								{segments.map((segment, segmentIndex) => {
									if (segment.type !== "choice") {
										return (
											<React.Fragment key={segment.key || `seg-${segmentIndex}`}>
												{segment.value}
											</React.Fragment>
										);
									}

									const blankIndex = segment.blankIndex;
									const localIndex = rowBlankIndices.indexOf(blankIndex);

									return this.renderInlineSelect(
										blankIndex,
										localIndex,
										rowBlankIndices
									);
								})}
							</div>
						) : (
							<>
								{item.audio ? (
									<button
										aria-label={`Play audio for row ${i + 1}`}
										className={`col-start-2 row-start-1 m-0 min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-[var(--font-size-sm)] leading-[var(--line-height-app)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base ${rowAudioStatus[i] === "playing" ? "text-[var(--chart-2)]" : "text-foreground hover:text-[var(--chart-2)]"}`}
										onClick={() => this.triggerRowAudio(i)}
										type="button"
									>
										{this.renderSentenceWithoutChoices(segments)}
									</button>
								) : (
									/* p→div: short item text triggers WAVE "possible heading" */
									<div className="col-start-2 row-start-1 m-0 min-w-0 text-[var(--font-size-sm)] leading-[var(--line-height-app)] md:text-base">
										{this.renderSentenceWithoutChoices(segments)}
									</div>
								)}

								{rowHasChoices ? (
									<div className="col-start-2 row-start-2 min-w-0 space-y-2">
										{rowBlankIndices.map((blankIndex, localIndex) => {
											const selectId = `${id}-select-${blankIndex}`;
											const meta = this.blanksMeta[blankIndex];
											const currentValue = values[blankIndex] ?? "";

											return (
												<div className="w-full" key={selectId}>
													<label className="sr-only" htmlFor={selectId}>
														{`Select answer for blank ${blankIndex + 1}`}
													</label>
													<Select
														value={currentValue}
														onValueChange={(value) => this.handleSelectChange(blankIndex, value)}
													>
														<SelectTrigger className={SELECT_EXERCISE_TRIGGER_CLASS} id={selectId}>
															<SelectValue placeholder="Select answer" />
														</SelectTrigger>
														<SelectContent>
															{meta.options.map((option, optionIndex) => (
																<SelectItem
																	className="text-[var(--font-size-sm)] md:text-base"
																	key={`${selectId}-option-${optionIndex}`}
																	value={String(optionIndex)}
																>
																	{option}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											);
										})}
									</div>
								) : null}
							</>
						)}

						{rowHasChoices ? (
							<span
								aria-hidden="true"
								className={`col-start-3 ${renderInlineChoices ? "" : "row-start-2"} inline-flex min-h-10 w-11 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]") : "invisible"}`}
							>
								{rowIsCorrect ? (
									<CircleCheck className="h-10 w-10" />
								) : (
									<CircleX className="h-10 w-10" />
								)}
							</span>
						) : null}
					</div>
				</div>
			);
		}

		this.nToSolve = blankCursor;
		const nCorrect = this.state.nCorrect || 0;
		const hasSelections = Object.keys(values).length > 0;
		const hasAnyIncorrect = this.state.hasChecked && nCorrect < this.nToSolve;

		return (
			<div
				className="select-exercise-container container"
				id={`${id || ""}`}
				key={`${id}SelectExercise`}
			>
				{htmlContent ? (
					<div
						className="html-content"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
					/>
				) : null}

				{useSequenceAudioController && layoutMode !== "inline-passage" && playlist.length > 0 ? (
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

				{layoutMode === "inline-passage" && useSequenceAudioController && playlist.length > 0 ? (
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

				{layoutMode === "inline-passage" ? (
					<div className="rounded-xl border border-border/70 bg-card/60 p-4 text-left shadow-sm md:p-5">
						<div className="space-y-3">{passageLines}</div>
					</div>
				) : (
					<div className="space-y-3">{rows}</div>
				)}

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
