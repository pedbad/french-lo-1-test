import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { AudioClip, CircularAudioProgressAnimatedSpeakerDisplay, IconButton } from "@/components/media";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";
import { resolveAsset } from "@/utils/assets";
import { stopAllAudioPlayback } from "@/utils/audioPlayback";
import { highlightTextDiff } from "@/utils/exerciseDiff";

const INLINE_TYPED_INPUT_BASE_CLASS =
	"mx-1 inline-flex h-9 min-h-9 rounded-lg border bg-background px-2.5 py-1 align-middle text-[var(--font-size-sm)] font-medium leading-[var(--line-height-app)] shadow-sm transition-[border-color,background-color,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:h-10 md:min-h-10 md:text-base";

export class InlineTypedGapExercise extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			...props.config,
			activeRowIndex: -1,
			checkedResults: {},
			diffResults: {},
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

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			this.setState({
				...this.props.config,
					activeRowIndex: -1,
					checkedResults: {},
					diffResults: {},
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

	normalizeAnswer = (value = "") => {
		return `${value}`
			.normalize("NFC")
			.replace(/[’`´ʻʼ]/g, "'")
			.replace(/\s+/g, " ")
			.trim();
	};

	isAnswerCorrect = (userValue = "", expected = "") => {
		return this.normalizeAnswer(userValue) === this.normalizeAnswer(expected);
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

			const rawToken = this.decodeHtmlEntities(match[1].trim());
			const [rawExpected, rawPlaceholder] = rawToken.split("::");
			const expected = (rawExpected || "").trim();
			const placeholder = (rawPlaceholder || "").trim();
			this.blanksMeta[blankIndex] = {
				expected,
				placeholder,
				widthCh: Math.max(expected.length, placeholder.length, 6) + 2,
			};

			segments.push({
				blankIndex,
				key: `input-${blankIndex}`,
				type: "input",
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

	handleInputChange = (blankIndex, userValue) => {
		this.setState((prevState) => {
			const values = {
				...prevState.values,
				[blankIndex]: userValue,
			};

			if (!prevState.hasChecked) return { values };

				const checkedResults = {
					...prevState.checkedResults,
				};
				const diffResults = {
					...prevState.diffResults,
				};
				delete checkedResults[blankIndex];
				delete diffResults[blankIndex];

				return {
					values,
					checkedResults,
					diffResults,
					nCorrect: Object.values(checkedResults).filter(Boolean).length,
				};
			});
	};

	handleInputKeyDown = (event) => {
		if (event.key !== "Enter" && event.key !== "NumpadEnter") return;
		event.preventDefault();
		this.handleCheckAnswers();
	};

	handleCheckAnswers = () => {
		const { values = {} } = this.state;
		const checkedResults = {};
		const diffResults = {};

		for (let i = 0; i < this.nToSolve; i += 1) {
			const userValue = values[i] || "";
			const expected = this.blanksMeta[i]?.expected || "";
			checkedResults[i] = this.isAnswerCorrect(userValue, expected);
			diffResults[i] = highlightTextDiff(
				this.normalizeAnswer(userValue),
				this.normalizeAnswer(expected),
				() => {},
				false,
			);
		}

		this.setState({
			checkedResults,
			diffResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
		});
	};

	handleShowAnswers = () => {
		const values = {};
		const checkedResults = {};
		const diffResults = {};

		for (let i = 0; i < this.nToSolve; i += 1) {
			values[i] = this.blanksMeta[i]?.expected || "";
			checkedResults[i] = true;
			diffResults[i] = highlightTextDiff(
				this.blanksMeta[i]?.expected || "",
				this.blanksMeta[i]?.expected || "",
				() => {},
				false,
			);
		}

		this.setState({
			values,
			checkedResults,
			diffResults,
			hasChecked: true,
			nCorrect: Object.values(checkedResults).filter(Boolean).length,
		});
	};

	handleReset = () => {
		stopAllAudioPlayback();
		this.setState({
			activeRowIndex: -1,
			checkedResults: {},
			diffResults: {},
			hasChecked: false,
			masterPlayState: "stopped",
			nCorrect: 0,
			rowAudioStatus: {},
			rowProgress: {},
			values: {},
		});
	};

	setAudioTriggerRef = (rowIndex, node) => {
		if (!node) {
			delete this.rowAudioRefs[rowIndex];
			return;
		}

		this.rowAudioRefs[rowIndex] = node;
	};

	handlePromptAudioClick = (rowIndex, playlistIndex, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (playlistIndex !== undefined) {
			if (this.state.activeRowIndex === rowIndex) {
				this.sequenceRef.current?.toggle();
				return;
			}

			this.sequenceRef.current?.playItem(playlistIndex, {
				playSequence: false,
			});
			return;
		}

		const rowAudioHost = this.rowAudioRefs[rowIndex];
		const buttonEl = rowAudioHost?.querySelector("button.audio-container, button.audio-link");
		if (!buttonEl) return;
		buttonEl.click();
	};

	handleRowAudioStatusChange = (rowIndex, nextStatus) => {
		this.setState((prevState) => ({
			rowAudioStatus: {
				...prevState.rowAudioStatus,
				[rowIndex]: nextStatus,
			},
		}));
	};

	handleMasterPlayStateChange = (nextState) => {
		this.setState({
			masterPlayState: nextState,
		});
	};

	handleMasterTrackChange = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex;
		if (rowIndex === undefined) return;
		this.setState({
			activeRowIndex: rowIndex,
		});
	};

	handleMasterStopped = (playlistIndex, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex;
		if (rowIndex === undefined) return;
		this.setState((prevState) => ({
			activeRowIndex: prevState.activeRowIndex === rowIndex ? -1 : prevState.activeRowIndex,
		}));
	};

	handleMasterTime = (playlistIndex, clipTime, clipDuration, playlist) => {
		const rowIndex = playlist[playlistIndex]?.rowIndex;
		if (rowIndex === undefined) return;

		this.setState((prevState) => ({
			rowProgress: {
				...prevState.rowProgress,
				[rowIndex]: {
					currentTime: clipTime,
					duration: clipDuration,
				},
			},
		}));
	};

	renderInlineInput = (blankIndex) => {
		const { checkedResults = {}, diffResults = {}, hasChecked = false, id = "", values = {} } = this.state;
		const meta = this.blanksMeta[blankIndex];
		if (!meta) return null;

		const value = values[blankIndex] ?? "";
		const result = checkedResults[blankIndex];
		const diffHtml = diffResults[blankIndex];
		const placeholderText = meta.placeholder || "Type your answer";
		let stateClassName = "border-border text-foreground";

		if (hasChecked && result === true) {
			stateClassName = "border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_16%,transparent)] text-foreground";
		} else if (hasChecked && result === false) {
			stateClassName = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-foreground";
		} else if (value.trim() !== "") {
			stateClassName = "border-[var(--chart-3)] bg-[color-mix(in_oklab,var(--chart-3)_10%,transparent)] text-foreground";
		}

		return (
			<span
				className="mx-1 inline-flex max-w-full flex-col align-middle"
				key={`inline-typed-gap-input-${blankIndex}`}
			>
				<Input
					aria-label={`Type answer ${blankIndex + 1}`}
					className={`${INLINE_TYPED_INPUT_BASE_CLASS} ${stateClassName}`}
					id={`${id}-inline-typed-gap-${blankIndex}`}
					onChange={(event) => this.handleInputChange(blankIndex, event.target.value)}
					onKeyDown={this.handleInputKeyDown}
					placeholder={placeholderText}
					style={{ width: `${meta.widthCh}ch`, maxWidth: "100%" }}
					type="text"
					value={value}
				/>
				{diffHtml ? (
					<div
						className="comparison-result compact mt-1 max-w-full"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(diffHtml) }}
					/>
				) : null}
			</span>
		);
	};

	renderSentence = (segments) => {
		return segments.map((segment) => {
			if (segment.type === "input") {
				return (
					<React.Fragment key={segment.key}>
						{this.renderInlineInput(segment.blankIndex)}
					</React.Fragment>
				);
			}

			return <React.Fragment key={segment.key}>{segment.value}</React.Fragment>;
		});
	};

	render = () => {
		const {
			cheatText = "Show answers",
			diffResults = {},
			footnote,
			footnoteHTML,
			htmlContent = "",
			id = "",
			items = [],
			listenDescriptionText,
			nCorrect = 0,
			rowAudioStatus = {},
			soundFile,
			useSequenceAudioController = false,
			values = {},
		} = this.state;

		this.blanksMeta = [];
		this.nToSolve = 0;

		const playlist = items
			.map((item, index) => ({
				rowIndex: index,
				src: item?.audio ? resolveAsset(item.audio) : null,
			}))
			.filter((entry) => Boolean(entry.src));

		const rowToPlaylistIndex = {};
		playlist.forEach((entry, index) => {
			rowToPlaylistIndex[entry.rowIndex] = index;
		});

		const rows = [];
		let blankCursor = 0;
		for (let i = 0; i < items.length; i += 1) {
			const item = items[i];
			const phraseText = item?.text || "";
			if (!phraseText) continue;

			const { nextBlankIndex, segments } = this.parseSentence(phraseText, blankCursor);
			const rowBlankIndices = segments
				.filter((segment) => segment.type === "input")
				.map((segment) => segment.blankIndex);
			const rowWidthCh = Math.max(
				18,
				...rowBlankIndices.map((blankIndex) => this.blanksMeta[blankIndex]?.widthCh || 0),
			);
			rowBlankIndices.forEach((blankIndex) => {
				if (this.blanksMeta[blankIndex]) {
					this.blanksMeta[blankIndex].widthCh = rowWidthCh;
				}
			});
			blankCursor = nextBlankIndex;

			const rowHasResult =
				this.state.hasChecked &&
				rowBlankIndices.length > 0 &&
				rowBlankIndices.every((idx) => typeof this.state.checkedResults[idx] === "boolean");
			const rowIsCorrect = rowHasResult && rowBlankIndices.every((idx) => this.state.checkedResults[idx] === true);
			const playlistIndex = rowToPlaylistIndex[i];
			const useMasterRowAudio = useSequenceAudioController && playlistIndex !== undefined;
			const isActive = this.state.activeRowIndex === i;
			const status = isActive
				? (this.state.masterPlayState === "playing" ? "playing" : "stopped")
				: "stopped";
			const prog = this.state.rowProgress[i] || { currentTime: 0, duration: 0 };
			const promptText = this.decodeHtmlEntities(item?.prompt || "");

			rows.push(
				<div
					className={`rounded-xl border border-border/70 bg-card/60 p-3 shadow-sm md:p-4 ${
						isActive ? "text-[var(--chart-2)]" : ""
					}`}
					key={`inline-typed-gap-row-${id}-${i}`}
				>
					<div className="flex items-start gap-3">
						{item?.audio ? (
							<span
								className="shrink-0 pt-0.5"
								ref={(node) => this.setAudioTriggerRef(i, node)}
							>
								{useMasterRowAudio ? (
									<CircularAudioProgressAnimatedSpeakerDisplay
										className="super-compact-speaker shrink-0"
										duration={prog.duration}
										handleClick={(event) => this.handlePromptAudioClick(i, playlistIndex, event)}
										progress={prog.currentTime}
										status={status}
										title={isActive ? "Click to pause" : "Click to play"}
									/>
								) : (
									<AudioClip
										className="super-compact-speaker shrink-0"
										id={`inlineTypedGapRowAudio-${i}`}
										onStatusChange={(nextStatus) => this.handleRowAudioStatusChange(i, nextStatus)}
										soundFile={resolveAsset(item.audio)}
									/>
								)}
							</span>
						) : null}

						<div className="min-w-0 flex-1">
							{promptText ? (
								item?.audio ? (
									<button
										className={`m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-[var(--font-size-sm)] leading-[var(--line-height-app)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base ${
											isActive || rowAudioStatus[i] === "playing"
												? "text-[var(--chart-2)]"
												: "text-foreground hover:text-[var(--chart-2)]"
										}`}
										onClick={(event) => this.handlePromptAudioClick(i, playlistIndex, event)}
										type="button"
									>
										{promptText}
									</button>
								) : (
									<p className="m-0 text-[var(--font-size-sm)] leading-[var(--line-height-app)] text-foreground md:text-base">
										{promptText}
									</p>
								)
							) : null}

							<div className="mt-2 grid grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-x-3">
								<div className="min-w-0 text-[var(--font-size-sm)] leading-[var(--line-height-app)] text-foreground md:text-base">
									{this.renderSentence(segments)}
								</div>
								<span
									aria-hidden="true"
									className={`inline-flex min-h-10 w-11 items-center justify-center ${
										rowHasResult ? (rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]") : "invisible"
									}`}
								>
									{rowIsCorrect ? <CircleCheck className="h-10 w-10" /> : <CircleX className="h-10 w-10" />}
								</span>
							</div>
						</div>
					</div>
				</div>
			);
		}

		this.nToSolve = blankCursor;
		const hasAnyAttempt = Object.keys(values).some((key) => `${values[key]}`.trim() !== "");
		const hasAnyIncorrect = this.state.hasChecked && nCorrect < this.nToSolve;

		return (
			<div
				className="inline-typed-gap-exercise-container container"
				id={id || undefined}
				key={`${id}InlineTypedGapExercise`}
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

				<div className="space-y-3">{rows}</div>

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
								visible: hasAnyAttempt || this.state.hasChecked,
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
