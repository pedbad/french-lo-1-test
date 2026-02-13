// Sortable.jsx
import './Sortable.scss';
import {
	AudioClip,
	IconButton,
	Info,
	ProgressDots,
} from "../../components";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { SortableWordCard } from "../SortableWordCard/SortableWordCard";
import { captureFlipPositions, playFlipAnimation } from "../../utils/reorderAnimation";


export class Sortable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checkedCorrectCount: 0,
			draggingId: null,
			dropTargetId: null,
			failCount: 0,
			hasReordered: false,
			hasSubmittedCheck: false,
			lang2Items: this.getInitialLang2(props.config),
			lastResult: null,
			usedShowAnswer: false,
			rowStatuses: new Array(
				props.config && props.config.phrases
					? props.config.phrases.length
					: 0
			).fill(null) // "correct" | "incorrect" | null
		};

		this.cardRefs = new Map();
	}

	componentDidUpdate(prevProps) {
		// If a different config is passed in, reset the state
		if (prevProps.config !== this.props.config) {
			const phrasesLen =
				this.props.config && this.props.config.phrases
					? this.props.config.phrases.length
					: 0;

			this.setState({
				checkedCorrectCount: 0,
				draggingId: null,
				dropTargetId: null,
				failCount: 0,
				hasReordered: false,
				hasSubmittedCheck: false,
				lang2Items: this.getInitialLang2(this.props.config),
				lastResult: null,
				rowStatuses: new Array(phrasesLen).fill(null),
				usedShowAnswer: false,
			});
		}
	}
	// inside class Sortable
	pointerId = null;

	setCardRef = (itemId, element) => {
		if (itemId === undefined || itemId === null) return;
		if (element) this.cardRefs.set(itemId, element);
		else this.cardRefs.delete(itemId);
	};

	swapById = (items, draggingId, targetId) => {
		const fromIndex = items.findIndex((item) => item.id === draggingId);
		const toIndex = items.findIndex((item) => item.id === targetId);
		if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
		const next = [...items];
		[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
		return next;
	};

	handlePointerDown = (index) => (e) => {
		// Only activate for touch/pen (leave mouse to native DnD)
		if (e.pointerType === "mouse") return;

		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);

		this.pointerId = e.pointerId;

		const draggingId = this.state.lang2Items[index]?.id ?? null;
		this.setState({
			draggingId,
			dropTargetId: null,
			lastResult: null,
			hasSubmittedCheck: false,
			rowStatuses: this.state.rowStatuses.map(() => null)
		});
	};

	handlePointerMove = (e) => {
		if (this.pointerId !== e.pointerId) return;
		if (!this.state.draggingId) return;

		// Find which sortable tile we're currently over
		const el = document.elementFromPoint(e.clientX, e.clientY);
		const tile = el?.closest?.("[data-sortable-tile='1']");
		const targetId = tile?.getAttribute?.("data-item-id") ?? null;
		this.setState((prev) => ({
			dropTargetId: targetId && targetId !== prev.draggingId ? targetId : null,
		}));
	};

	handlePointerUp = (e) => {
		if (this.pointerId !== e.pointerId) return;

		this.pointerId = null;
		this.setState((prev) => {
			const next = prev.draggingId && prev.dropTargetId
				? this.swapById(prev.lang2Items, prev.draggingId, prev.dropTargetId)
				: null;
			if (!next) return { draggingId: null, dropTargetId: null };
			return {
				checkedCorrectCount: 0,
				draggingId: null,
				dropTargetId: null,
				hasReordered: true,
				hasSubmittedCheck: false,
				lang2Items: next,
			};
		});
	};

	getInitialLang2(config) {
		if (!config || !config.phrases) return [];

		// phrases: [ [foreignLanguage, lang2, audio], ... ]
		const lang2Items = config.phrases.map((phrase, index) => {
			if (Array.isArray(phrase)) {
				return {
					lang2: phrase[1],
					id: String(index), // used for correctness
				};
			}
			// fallback if you move to object form
			return {
				lang2: phrase.lang2,
				id: String(index),
			};
		});

		// Default: shuffle unless explicitly disabled
		const shouldShuffle =
			config.shuffleOnLoad === undefined ? true : !!config.shuffleOnLoad;

		if (shouldShuffle) {
			this.shuffleArrayInPlace(lang2Items);
		}

		return lang2Items;
	}

	shuffleArrayInPlace(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	/* ----------------------------- Drag & drop (lang2 only) ----------------------------- */

	handleDragStart = (id) => (event) => {
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/plain", id);

		this.setState({
			draggingId: id,
			dropTargetId: null,
			lastResult: null,
			hasSubmittedCheck: false,
			rowStatuses: this.state.rowStatuses.map(() => null)
		});
	};

	handleDragEnter = (targetId) => (event) => {
		event.preventDefault();
		this.setState((prev) => ({
			dropTargetId: prev.draggingId && prev.draggingId !== targetId ? targetId : null,
		}));
	};

	handleDragOver = (event) => {
		// Required so that drop/enter events behave as expected
		event.preventDefault();
	};

	handleDrop = (targetId) => (event) => {
		event.preventDefault();
		this.setState((prev) => {
			const next = prev.draggingId && targetId
				? this.swapById(prev.lang2Items, prev.draggingId, targetId)
				: null;
			if (!next) return { draggingId: null, dropTargetId: null };
			return {
				checkedCorrectCount: 0,
				draggingId: null,
				dropTargetId: null,
				hasReordered: true,
				hasSubmittedCheck: false,
				lang2Items: next,
			};
		});
	};

	handleDragEnd = () => {
		this.setState({ draggingId: null, dropTargetId: null });
	};

	/* -------------------------------- Controls -------------------------------- */

	reset = () => {
		const { config } = this.props;
		const phrasesLen =
			config && config.phrases ? config.phrases.length : 0;
		const idsBefore = this.state.lang2Items.map((item) => item.id);
		const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));

		this.setState({
			checkedCorrectCount: 0,
			draggingId: null,
			dropTargetId: null,
			failCount: 0,
			hasReordered: false,
			hasSubmittedCheck: false,
			lang2Items: this.getInitialLang2(config),
			lastResult: null,
			rowStatuses: new Array(phrasesLen).fill(null),
			usedShowAnswer: false,
		}, () => {
			playFlipAnimation({
				before,
				duration: 460,
				fromOpacity: 0.96,
				getElement: (id) => this.cardRefs.get(id),
				ids: this.state.lang2Items.map((item) => item.id),
				stagger: 22,
				toOpacity: 1,
			});
		});
	};

	shuffleLang2 = () => {
		const { config } = this.props;
		if (!config || !config.phrases) return;

		const lang2Items = config.phrases.map((phrase, index) => {
			if (Array.isArray(phrase)) {
				return {
					lang2: phrase[1],
					id: String(index),
				};
			}
			return {
				lang2: phrase.lang2,
				id: String(index),
			};
		});

		this.shuffleArrayInPlace(lang2Items);

		this.setState({
			checkedCorrectCount: 0,
			draggingId: null,
			dropTargetId: null,
			hasReordered: true,
			hasSubmittedCheck: false,
			lang2Items,
			lastResult: null,
			rowStatuses: new Array(config.phrases.length).fill(null)
		});
	};

	checkAnswer = () => {
		const { config } = this.props;
		if (!config || !config.phrases) return;

		const { lang2Items } = this.state;
		const expectedIds = config.phrases.map((_, index) => String(index));

		const rowStatuses = lang2Items.map((item, index) =>
			item.id === expectedIds[index] ? "correct" : "incorrect"
		);

		const isAllCorrect = rowStatuses.every(
			(status) => status === "correct"
		);
		const checkedCorrectCount = rowStatuses.filter((status) => status === "correct").length;

		this.setState({
			checkedCorrectCount,
			failCount: isAllCorrect ? this.state.failCount : this.state.failCount + 1,
			hasSubmittedCheck: true,
			lastResult: isAllCorrect ? "correct" : "incorrect",
			rowStatuses
		});
	};

	autoSolve = () => {
		const { config } = this.props;
		if (!config || !config.phrases) return;
		const idsBefore = this.state.lang2Items.map((item) => item.id);
		const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));
		const lang2Items = config.phrases.map((phrase, index) => {
			if (Array.isArray(phrase)) {
				return {
					id: String(index),
					lang2: phrase[1],
				};
			}
			return {
				id: String(index),
				lang2: phrase.lang2,
			};
		});
		this.setState({
			checkedCorrectCount: config.phrases.length,
			draggingId: null,
			dropTargetId: null,
			hasReordered: true,
			hasSubmittedCheck: true,
			lang2Items,
			lastResult: "correct",
			rowStatuses: new Array(config.phrases.length).fill("correct"),
			usedShowAnswer: true,
		}, () => {
			playFlipAnimation({
				before,
				duration: 460,
				getElement: (id) => this.cardRefs.get(id),
				ids: this.state.lang2Items.map((item) => item.id),
			});
		});
	};

	/* ---------------------------------- Render ---------------------------------- */

	render() {
		const { config } = this.props;
		const { cheatText = "Show answer" } = config;
		const {
			checkedCorrectCount,
			lang2Items,
			draggingId,
			dropTargetId,
			failCount,
			hasReordered,
			hasSubmittedCheck,
			usedShowAnswer,
		} = this.state;

		if (!config || !config.phrases) {
			return <div>No configuration provided for Sortable.</div>;
		}

		// const title =
		// 	config.titleText ||
		// 	config.title ||
		// 	"Sortable activity";

		const prompt =
			config.instructionsText ||	"";

		const {
			phrases, id,
			informationText,
			informationTextHTML
		} = config;
		const { suppressInfo = false } = this.props;

		let allLang1Blank = true;
		phrases.forEach((phrase) => {
			// console.log("phrase[0]", phrase[0], phrase[0] === "");
			if (phrase[0] !== "") allLang1Blank = false;
		});

		// console.log("allLang1Blank", allLang1Blank);
		const expectedIds = phrases.map((_, index) => String(index));
		const liveCorrectCount = lang2Items.reduce((count, item, index) => (
			item.id === expectedIds[index] ? count + 1 : count
		), 0);
		const correctCount = hasSubmittedCheck ? checkedCorrectCount : 0;
		const total = phrases.length;
		const isComplete = total > 0 && liveCorrectCount === total;
		const showReveal = failCount >= 2 || usedShowAnswer;
		const showReset = hasReordered || failCount >= 1 || isComplete || usedShowAnswer;

		return (
			<Card className="w-full sortable pt-4">
				{/* <CardHeader>
					<CardTitle className="text-base font-semibold">
						{title}
					</CardTitle>
				</CardHeader> */}

				<CardContent>
					{prompt && (
						<p className="mb-4 text-sm">
							{prompt}
						</p>
					)}

					<div className="space-y-1">
						{!suppressInfo && (informationText || informationTextHTML) ? (
							<Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML}/>
						) : null}
						<div className="mx-auto w-[80%]">
							{phrases.map((phrase, index) => {
								let foreignLanguage = "";
								let audio = null;

								if (Array.isArray(phrase)) {
									// [foreignLanguage, lang2, audio]
									[foreignLanguage, , audio] = phrase;
								} else {
									foreignLanguage = phrase.original;
									({ audio } = phrase);
								}

								const lang2Item = lang2Items[index];
								const isDragging =
									lang2Item &&
									lang2Item.id === draggingId;

								return (
									<div
										key={index}
										className={`grid ${allLang1Blank ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]" } gap-3 items-center py-1`}
									>
										{/* LEFT: Audio */}
										<div className="flex items-center justify-center pr-2">
											{audio && (
												<AudioClip className={`super-compact-speaker`} soundFile={audio} />
											)}
										</div>

										{/* MIDDLE: lang1 phrase */}
										{allLang1Blank ? null : <div className="flex items-center text-sm">
											<span>{foreignLanguage}</span>
										</div>}

										{/* RIGHT: Sortable lang2 phrase + tick/cross */}
										<SortableWordCard
											className="cursor-ns-resize"
											data-sortable-tile="1"
											data-index={index}
											data-item-id={lang2Item?.id || ""}
											data-dragging={isDragging ? "true" : undefined}
											direction="vertical"
											/* Desktop HTML5 drag */
											draggable
											isDragging={isDragging}
											isDropTarget={dropTargetId === lang2Item?.id && !isDragging}
											label={lang2Item ? lang2Item.lang2 : ""}
											ref={(element) => this.setCardRef(lang2Item?.id, element)}
											onDragStart={
												lang2Item
													? this.handleDragStart(lang2Item.id)
													: undefined
											}
											onDragEnter={
												lang2Item
													? this.handleDragEnter(lang2Item.id)
													: undefined
											}
											onDragOver={this.handleDragOver}
											onDrop={this.handleDrop(lang2Item?.id)}
											onDragEnd={this.handleDragEnd}

											/* Mobile / touch: pointer-driven reorder */
											onPointerDown={this.handlePointerDown(index)}
											onPointerMove={this.handlePointerMove}
											onPointerUp={this.handlePointerUp}
											onPointerCancel={this.handlePointerUp}
											showIndex
											slotLabel={index + 1}
										/>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />
						<ProgressDots correct={correctCount} total={total} />
						<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />
					</div>

						<div className="flex flex-wrap justify-end gap-2">
							{showReveal ? (
								<IconButton
									ariaLabel={cheatText}
									className="btn-ped-warn max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11"
									onClick={this.autoSolve}
									theme="eye"
									title={cheatText}
									variant="default"
								>
									<span className="hidden min-[560px]:inline">{cheatText}</span>
								</IconButton>
							) : null}
							{showReset ? (
								<IconButton
									ariaLabel="Reset"
									className="btn-chart-2 max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11"
									onClick={this.reset}
									theme="reset"
									title="Reset"
									variant="default"
								>
									<span className="hidden min-[560px]:inline">Reset</span>
								</IconButton>
							) : null}
							<IconButton
								ariaLabel="Check answers"
								className="btn-hero-title max-[559px]:h-10 max-[559px]:w-10 max-[559px]:p-0 min-[420px]:max-[559px]:h-11 min-[420px]:max-[559px]:w-11"
								theme="check"
								onClick={this.checkAnswer}
								title="Check answers"
								variant="default"
							>
								<span className="hidden min-[560px]:inline">Check answers</span>
							</IconButton>
						</div>

				</CardContent>
			</Card>
		);
	}
}
