// Sortable.jsx
import './Sortable.scss';
import {
	AudioClip,
	IconButton,
	Info,
} from "../../components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";


export class Sortable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			draggingId: null,
			lang2Items: this.getInitialLang2(props.config),
			lastResult: null,
			rowStatuses: new Array(
				props.config && props.config.phrases
					? props.config.phrases.length
					: 0
			).fill(null) // "correct" | "incorrect" | null
		};
	}

	componentDidUpdate(prevProps) {
		// If a different config is passed in, reset the state
		if (prevProps.config !== this.props.config) {
			const phrasesLen =
				this.props.config && this.props.config.phrases
					? this.props.config.phrases.length
					: 0;

			this.setState({
				draggingId: null,
				lang2Items: this.getInitialLang2(this.props.config),
				lastResult: null,
				rowStatuses: new Array(phrasesLen).fill(null),
			});
		}
	}
	// inside class Sortable
	dragIndex = null;
	pointerId = null;

	getIndexFromElement = (el) => {
		const idx = el?.getAttribute?.("data-index");
		return idx === null ? -1 : Number(idx);
	};

	handlePointerDown = (index) => (e) => {
		// Only activate for touch/pen (leave mouse to native DnD)
		if (e.pointerType === "mouse") return;

		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);

		this.pointerId = e.pointerId;
		this.dragIndex = index;

		const draggingId = this.state.lang2Items[index]?.id ?? null;
		this.setState({
			draggingId,
			lastResult: null,
			rowStatuses: this.state.rowStatuses.map(() => null)
		});
	};

	handlePointerMove = (e) => {
		if (this.pointerId !== e.pointerId) return;
		if (this.dragIndex === null) return;

		// Find which sortable tile we're currently over
		const el = document.elementFromPoint(e.clientX, e.clientY);
		const tile = el?.closest?.("[data-sortable-tile='1']");
		if (!tile) return;

		const toIndex = this.getIndexFromElement(tile);
		const fromIndex = this.dragIndex;

		if (toIndex < 0 || toIndex === fromIndex) return;

		const newItems = this.state.lang2Items.slice();
		const [moved] = newItems.splice(fromIndex, 1);
		newItems.splice(toIndex, 0, moved);

		this.dragIndex = toIndex;
		this.setState({ lang2Items: newItems });
	};

	handlePointerUp = (e) => {
		if (this.pointerId !== e.pointerId) return;

		this.pointerId = null;
		this.dragIndex = null;
		this.setState({ draggingId: null });
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
			lastResult: null,
			rowStatuses: this.state.rowStatuses.map(() => null)
		});
	};

	handleDragEnter = (targetId) => (event) => {
		event.preventDefault();

		const { draggingId, lang2Items } = this.state;
		if (!draggingId || draggingId === targetId) return;

		const newItems = lang2Items.slice();
		const fromIndex = newItems.findIndex((item) => item.id === draggingId);
		const toIndex = newItems.findIndex((item) => item.id === targetId);

		if (fromIndex === -1 || toIndex === -1) return;

		const [movedItem] = newItems.splice(fromIndex, 1);
		newItems.splice(toIndex, 0, movedItem);

		this.setState({ lang2Items: newItems });
	};

	handleDragOver = (event) => {
		// Required so that drop/enter events behave as expected
		event.preventDefault();
	};

	handleDragEnd = () => {
		this.setState({ draggingId: null });
	};

	/* -------------------------------- Controls -------------------------------- */

	reset = () => {
		const { config } = this.props;
		const phrasesLen =
			config && config.phrases ? config.phrases.length : 0;

		this.setState({
			draggingId: null,
			lang2Items: this.getInitialLang2(config),
			lastResult: null,
			rowStatuses: new Array(phrasesLen).fill(null)
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
			draggingId: null,
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

		this.setState({
			lastResult: isAllCorrect ? "correct" : "incorrect",
			rowStatuses
		});
	};

	/* -------------------------------- Feedback -------------------------------- */

	renderFeedback() {
		const { lastResult } = this.state;

		if (!lastResult) return null;

		const isCorrect = lastResult === "correct";

		return (
			<div
				className={
					`mt-3 text-sm font-medium ${
						isCorrect ? "text-primary" : "text-destructive"}`
				}
			>
				{isCorrect
					? "✅ Correct! Good job."
					: "❌ Not quite. Check the rows with a cross and try again."}
			</div>
		);
	}

	/* ---------------------------------- Render ---------------------------------- */

	render() {
		const { config } = this.props;
		const { lang2Items, draggingId, rowStatuses } = this.state;

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

							const status = rowStatuses[index]; // "correct" | "incorrect" | null

							return (
								<div
									key={index}
									className={`grid ${allLang1Blank ? "grid-cols-[auto_minmax(0,0.5fr)_auto]" : "grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto]" } gap-3 items-center py-1`}
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
									<div
										data-sortable-tile="1"
										data-index={index}
										data-dragging={isDragging ? "true" : undefined}
										className={
											`sortable-tile flex items-center justify-between text-sm font-medium cursor-ns-resize px-3 py-1 rounded-md border border-dashed border-border transition ${
												isDragging
													? "opacity-80 scale-[0.99]"
													: "hover:shadow-sm"
											}`
										}

										/* Desktop HTML5 drag */
										draggable
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
										onDragEnd={this.handleDragEnd}

										/* Mobile / touch: pointer-driven reorder */
										onPointerDown={this.handlePointerDown(index)}
										onPointerMove={this.handlePointerMove}
										onPointerUp={this.handlePointerUp}
										onPointerCancel={this.handlePointerUp}
									>
										{/* Handle + text */}
										<div className="flex items-center gap-2">
											<span className="text-slate-400 text-lg leading-none">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M12 2v20" />
													<path d="m8 18 4 4 4-4" />
													<path d="m8 6 4-4 4 4" />
												</svg>
											</span>
											<span>
												{lang2Item ? lang2Item.lang2 : ""}
											</span>
										</div>
									</div>
									{/* NEW: far-right narrow column with SVG tick/cross */}
									<div className="flex items-center justify-center w-6">
										{status === "correct" && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 512 512"
												className="tick w-4 h-4 text-primary"
											>
												<path
													fill="currentColor"
													d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
												/>
											</svg>
										)}
										{status === "incorrect" && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 352 512"
												className="cross w-4 h-4 text-destructive"
											>
												<path
													fill="currentColor"
													d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
												/>
											</svg>
										)}
									</div>								</div>
							);
						})}
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<IconButton theme={`check`} onClick={this.checkAnswer}>
							Check answer
						</IconButton>
						<IconButton theme={`reset`} onClick={this.reset}>
							Reset
						</IconButton>
						{/* <IconButton theme={`shuffle`} onClick={this.shuffleLang2}>
							Shuffle
						</IconButton> */}
					</div>

					{this.renderFeedback()}
				</CardContent>
			</Card>
		);
	}
}
