import React from "react";
import { IconButton } from "../IconButton";
import { ProgressDots } from "../ProgressDots";
import { SequenceAudioController } from "../SequenceAudioController";
import { SortableWordCard } from "../SortableWordCard/SortableWordCard";
import { resolveAsset, shuffleArray } from "../../utility";
import { captureFlipPositions, playFlipAnimation } from "../../utils/reorderAnimation";

const buildTokens = (words = []) =>
	words.map((label, index) => ({
		id: `token-${index}`,
		label,
		order: index,
	}));

const swap = (items, fromIndex, toIndex) => {
	if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;
	const next = [...items];
	[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
	return next;
};

export class SequenceOrder extends React.PureComponent {
	constructor(props) {
		super(props);
		const { config = {} } = props;
		const { words = [] } = config;
		const expectedTokens = buildTokens(words);
		const shuffledTokens = shuffleArray([...expectedTokens]);

		this.state = {
			checkResult: null,
			draggingId: null,
			dropTargetId: null,
			expectedTokens,
			failedChecks: 0,
			hasReordered: false,
			usedShowAnswer: false,
			userTokens: shuffledTokens,
		};

		this.cardRefs = new Map();
	}

	setCardRef = (tokenId, element) => {
		if (element) this.cardRefs.set(tokenId, element);
		else this.cardRefs.delete(tokenId);
	};

	handleDragStart = (event, tokenId) => {
		// Keep drag semantics as "move" to avoid OS/browser copy (+) cursor.
		if (event?.dataTransfer) {
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("text/plain", tokenId);
		}
		this.setState({ draggingId: tokenId, checkResult: null });
	};

	handleDragOver = (event) => {
		event.preventDefault();
		if (event?.dataTransfer) {
			event.dataTransfer.dropEffect = "move";
		}
	};

	handleDragEnter = (targetId) => {
		this.setState({ dropTargetId: targetId });
	};

	handleDrop = (event, targetId) => {
		event.preventDefault();
		const idsBefore = this.state.userTokens.map((token) => token.id);
		const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));

		this.setState((prev) => {
			if (!prev.draggingId || prev.draggingId === targetId) {
				return { draggingId: null, dropTargetId: null };
			}
			const fromIndex = prev.userTokens.findIndex((token) => token.id === prev.draggingId);
			const toIndex = prev.userTokens.findIndex((token) => token.id === targetId);
			if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
				return { draggingId: null, dropTargetId: null };
			}
			return {
				hasReordered: true,
				draggingId: null,
				dropTargetId: null,
				userTokens: swap(prev.userTokens, fromIndex, toIndex),
			};
		}, () => {
			playFlipAnimation({
				before,
				duration: 260,
				getElement: (id) => this.cardRefs.get(id),
				ids: this.state.userTokens.map((token) => token.id),
			});
		});
	};

	handleDragEnd = () => {
		this.setState({ draggingId: null, dropTargetId: null });
	};

	handleCheckAnswers = () => {
		this.setState((prev) => {
			let correctCount = 0;
			const total = prev.expectedTokens.length;
			for (let i = 0; i < total; i++) {
				if (prev.userTokens[i]?.id === prev.expectedTokens[i]?.id) correctCount += 1;
			}
			const isComplete = correctCount === total;
			return {
				checkResult: {
					correctCount,
					isComplete,
					total,
				},
				failedChecks: isComplete ? prev.failedChecks : prev.failedChecks + 1,
			};
		});
	};

	handleReset = () => {
		const idsBefore = this.state.userTokens.map((token) => token.id);
		const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));

		this.setState((prev) => ({
			checkResult: null,
			draggingId: null,
			dropTargetId: null,
			failedChecks: 0,
			hasReordered: false,
			usedShowAnswer: false,
			userTokens: shuffleArray([...prev.expectedTokens]),
		}), () => {
			playFlipAnimation({
				before,
				duration: 460,
				fromOpacity: 0.96,
				getElement: (id) => this.cardRefs.get(id),
				ids: this.state.userTokens.map((token) => token.id),
				stagger: 22,
				toOpacity: 1,
			});
		});
	};

	handleShowAnswer = () => {
		const idsBefore = this.state.userTokens.map((token) => token.id);
		const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));

		this.setState((prev) => ({
			checkResult: {
				correctCount: prev.expectedTokens.length,
				isComplete: true,
				total: prev.expectedTokens.length,
			},
			draggingId: null,
			dropTargetId: null,
			failedChecks: prev.failedChecks,
			hasReordered: true,
			usedShowAnswer: true,
			userTokens: [...prev.expectedTokens],
		}), () => {
			playFlipAnimation({
				before,
				duration: 460,
				getElement: (id) => this.cardRefs.get(id),
				ids: this.state.userTokens.map((token) => token.id),
			});
		});
	};

	render = () => {
		const { config = {} } = this.props;
		const {
			cheatText = "Show answer",
			soundFile,
		} = config;
		const { checkResult, draggingId, dropTargetId, failedChecks, hasReordered, userTokens, usedShowAnswer } = this.state;
		const canCheck = userTokens.length > 0;
		const total = userTokens.length;
		const correctCount = checkResult?.correctCount || 0;
		const showReveal = failedChecks >= 2 || usedShowAnswer;
		const showReset = hasReordered || failedChecks >= 1 || usedShowAnswer || Boolean(checkResult?.isComplete);

		return (
			<div className="space-y-4">
				{soundFile ? (
					<div className="space-y-1">
						<SequenceAudioController sources={[resolveAsset(soundFile)]} />
					</div>
				) : null}

				<div className="rounded-xl border border-border/70 bg-card p-3">
					<div className="space-y-2 min-[1200px]:hidden">
						{userTokens.map((token, index) => {
							const isDragging = draggingId === token.id;
							const isDropTarget = dropTargetId === token.id && !isDragging;
							return (
								<SortableWordCard
									direction="vertical"
									draggable
									isDragging={isDragging}
									isDropTarget={isDropTarget}
									key={token.id}
									label={token.label}
									onDragEnd={this.handleDragEnd}
									onDragEnter={() => this.handleDragEnter(token.id)}
									onDragOver={this.handleDragOver}
									onDrop={(event) => this.handleDrop(event, token.id)}
									onDragStart={(event) => this.handleDragStart(event, token.id)}
									ref={(element) => this.setCardRef(token.id, element)}
									showIndex
									slotLabel={index + 1}
								/>
							);
						})}
					</div>

					<div className="hidden min-[1200px]:block">
						<div
							className="grid gap-2 [grid-template-columns:repeat(var(--token-count),minmax(5.5rem,1fr))] min-[1200px]:max-[1399px]:[grid-template-columns:repeat(var(--token-count),minmax(5.6rem,1fr))] min-[1400px]:[grid-template-columns:repeat(var(--token-count),minmax(7rem,1fr))]"
							style={{ "--token-count": userTokens.length }}
						>
							{userTokens.map((token, index) => {
								const isDragging = draggingId === token.id;
								const isDropTarget = dropTargetId === token.id && !isDragging;
								return (
									<SortableWordCard
										direction="horizontal"
										draggable
										isDragging={isDragging}
										isDropTarget={isDropTarget}
										key={token.id}
										label={token.label}
										onDragEnd={this.handleDragEnd}
										onDragEnter={() => this.handleDragEnter(token.id)}
										onDragOver={this.handleDragOver}
										onDrop={(event) => this.handleDrop(event, token.id)}
										onDragStart={(event) => this.handleDragStart(event, token.id)}
										ref={(element) => this.setCardRef(token.id, element)}
										showIndex
										size="square"
										slotLabel={index + 1}
										stacked
									/>
								);
							})}
						</div>
					</div>
				</div>

				<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />
				<ProgressDots correct={correctCount} total={total} />
				<div className="shrink-0 bg-border-subtle h-px w-full my-3" role="none" data-orientation="horizontal" />

					<div className="flex flex-wrap justify-end gap-2">
						{showReveal ? (
							<IconButton
								ariaLabel={cheatText}
								className="btn-ped-warn exercise-icon-button"
								onClick={this.handleShowAnswer}
								theme="eye"
								title={cheatText}
								variant="default"
							>
								<span className="exercise-icon-button-label">{cheatText}</span>
							</IconButton>
						) : null}
						{showReset ? (
							<IconButton
								ariaLabel="Reset"
								className="btn-chart-2 exercise-icon-button"
								onClick={this.handleReset}
								theme="reset"
								title="Reset"
								variant="default"
							>
								<span className="exercise-icon-button-label">Reset</span>
							</IconButton>
						) : null}
						<IconButton
							ariaLabel="Check answers"
							className="btn-hero-title exercise-icon-button"
							disabled={!canCheck}
							onClick={this.handleCheckAnswers}
							theme="check"
							title="Check answers"
							variant="default"
						>
							<span className="exercise-icon-button-label">Check answers</span>
						</IconButton>
					</div>
			</div>
		);
	};
}
