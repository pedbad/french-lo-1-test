import { Info } from "@/components/content";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { AudioClip } from "@/components/media";
import { IconButton } from "@/components/media";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { resolveAsset } from "@/utils/assets";
import { shuffleArray } from "@/utils/collections";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

const LINE_MATCH_IMAGE_TILE_CLASS = [
	"relative aspect-square min-h-[4rem] w-[4rem] overflow-hidden rounded-lg",
	"border border-[oklch(from_var(--brand-primary)_l_c_h_/_0.92)]",
	"bg-[color-mix(in_oklab,var(--brand-primary)_15%,var(--card))]",
	"shadow-[0_6px_14px_color-mix(in_oklab,var(--chart-3)_20%,transparent)]",
	"min-[1400px]:min-h-[5rem] min-[1400px]:w-[5rem]",
].join(" ");
const LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS = "min-h-[4.5rem] min-[1400px]:min-h-[5.5rem]";

const LINE_MATCH_SELECT_TRIGGER_CLASS = "w-full min-h-10 text-[var(--font-size-sm)] md:text-base";

const LINE_MATCH_CONNECTOR_STROKE = "var(--chart-5)";
const LINE_MATCH_CONNECTOR_GLOW = "color-mix(in oklab, var(--chart-5) 26%, transparent)";

/*
 * IMAGE ALT TEXT POLICY — IMPORTANT (accessibility + pedagogy)
 * ─────────────────────────────────────────────────────────────
 * LineMatch is a picture-to-word matching exercise. The student sees an image
 * and must identify the correct French label for it. Using item.label as img
 * alt text is EDUCATIONALLY WRONG: a screen reader user would hear the French
 * answer immediately, bypassing the exercise entirely.
 *
 * Correct alt text priority:
 *   1. item.alt        — an explicit descriptive label set in the config
 *                        (e.g. "Illustration of a bathroom")
 *   2. item.localLanguage — the English translation/description if provided
 *   3. ""              — decorative fallback; omit from the accessibility tree
 *                        when no description is available rather than revealing
 *                        the answer.
 *
 * To add proper alt text, set "alt" or "localLanguage" on each item in the
 * lo-config JSON. Do NOT fall back to item.label here.
 */
const LINE_MATCH_CORRECT_STROKE = "var(--chart-2)";
const LINE_MATCH_CORRECT_GLOW = "color-mix(in oklab, var(--chart-2) 28%, transparent)";
const LINE_MATCH_RECOIL_STROKE = "var(--destructive)";
const LINE_MATCH_RECOIL_GLOW = "color-mix(in oklab, var(--destructive) 24%, transparent)";
const LINE_MATCH_DESKTOP_BREAKPOINT = 980;
const LINE_MATCH_RECOIL_DURATION_MS = 380;

const buildRound = (config = {}) => {
	const { items = [], sampleSize = 6 } = config;
	const normalizedItems = Array.isArray(items) ? items.filter(Boolean) : [];
	if (normalizedItems.length === 0) {
		return { sampledItems: [], wordBank: [] };
	}

	const sampledItems = shuffleArray([...normalizedItems]).slice(0, sampleSize);
	const wordBank = shuffleArray([...sampledItems]);

	return { sampledItems, wordBank };
};

export class LineMatch extends React.PureComponent {
	constructor(props) {
		super(props);
		this.desktopStageRef = React.createRef();
		this.resizeObserver = null;
		this.measureFrame = null;
		this.recoilFrame = null;
		this.sourceNodeMap = new Map();
		this.targetNodeMap = new Map();
		this.state = {
			...buildRound(props.config),
			activeSourceId: null,
			activeTargetId: null,
			checkedResults: {},
			connectorLayout: null,
			desktopConnections: {},
			hasChecked: false,
			isDesktopViewport: false,
			mobileValues: {},
			nCorrect: 0,
			recoilProgress: 1,
			recoilingConnections: [],
			usedShowAnswer: false,
		};
	}

	componentDidMount() {
		if (typeof window !== "undefined") {
			window.addEventListener("resize", this.handleWindowResize);
		}

		if (typeof ResizeObserver !== "undefined" && this.desktopStageRef.current) {
			this.resizeObserver = new ResizeObserver(() => {
				this.scheduleConnectorMeasurement();
			});
			this.resizeObserver.observe(this.desktopStageRef.current);
		}

		this.updateViewportMode();
		this.scheduleConnectorMeasurement();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config !== this.props.config) {
			this.setState({
				...buildRound(this.props.config),
				activeSourceId: null,
				activeTargetId: null,
				checkedResults: {},
				connectorLayout: null,
				desktopConnections: {},
				hasChecked: false,
				isDesktopViewport: this.getIsDesktopViewport(),
				mobileValues: {},
				nCorrect: 0,
				recoilProgress: 1,
				recoilingConnections: [],
				usedShowAnswer: false,
			});
			this.stopRecoilAnimation();
			return;
		}

		this.scheduleConnectorMeasurement();
	}

	componentWillUnmount() {
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", this.handleWindowResize);
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		if (typeof window !== "undefined" && this.measureFrame) {
			window.cancelAnimationFrame(this.measureFrame);
		}

		this.stopRecoilAnimation();
	}

	getItemKey = (item, index) => item.id || item.label || `item-${index}`;

	getIsDesktopViewport = () =>
		typeof window !== "undefined" && window.innerWidth >= LINE_MATCH_DESKTOP_BREAKPOINT;

	getCorrectCount = (checkedResults = {}) =>
		Object.values(checkedResults).filter(Boolean).length;

	updateViewportMode = () => {
		const isDesktopViewport = this.getIsDesktopViewport();
		this.setState((prevState) =>
			prevState.isDesktopViewport === isDesktopViewport
				? null
				: { isDesktopViewport },
		);
	};

	handleWindowResize = () => {
		this.updateViewportMode();
		this.scheduleConnectorMeasurement();
	};

	invalidateCheckedResultForSources = (sources = [], prevState) => {
		if (!prevState.hasChecked || sources.length === 0) return null;

		const checkedResults = {
			...prevState.checkedResults,
		};
		let changed = false;

		sources.forEach((sourceId) => {
			if (Object.prototype.hasOwnProperty.call(checkedResults, sourceId)) {
				delete checkedResults[sourceId];
				changed = true;
			}
		});

		if (!changed) return null;

		return {
			checkedResults,
			hasChecked: true,
			nCorrect: this.getCorrectCount(checkedResults),
			usedShowAnswer: false,
		};
	};

	handleMobileValueChange = (itemKey, value) => {
		this.setState((prevState) => {
			const mobileValues = {
				...prevState.mobileValues,
				[itemKey]: value,
			};
			const invalidated = this.invalidateCheckedResultForSources([itemKey], prevState);

			return {
				mobileValues,
				...(invalidated || {}),
			};
		});
	};

	handleSourceActivate = (sourceId) => {
		this.setState((prevState) => {
			if (prevState.activeTargetId) {
				return this.buildConnectionUpdate(sourceId, prevState.activeTargetId, prevState);
			}

			return {
				activeSourceId: prevState.activeSourceId === sourceId ? null : sourceId,
				activeTargetId: null,
			};
		});
	};

	handleTargetActivate = (targetId) => {
		this.setState((prevState) => {
			const { activeSourceId, desktopConnections } = prevState;
			if (activeSourceId) {
				return this.buildConnectionUpdate(activeSourceId, targetId, prevState);
			}

			return {
				activeSourceId: null,
				activeTargetId: prevState.activeTargetId === targetId ? null : targetId,
			};
		});
	};

	buildConnectionUpdate = (sourceId, targetId, prevState) => {
		const nextConnections = { ...prevState.desktopConnections };
		const affectedSources = [sourceId];

		Object.keys(nextConnections).forEach((existingSourceId) => {
			if (nextConnections[existingSourceId] === targetId && existingSourceId !== sourceId) {
				delete nextConnections[existingSourceId];
				affectedSources.push(existingSourceId);
			}
		});

		nextConnections[sourceId] = targetId;
		const invalidated = this.invalidateCheckedResultForSources(affectedSources, prevState);

		return {
			activeSourceId: null,
			activeTargetId: null,
			desktopConnections: nextConnections,
			...(invalidated || {}),
		};
	};

	buildTargetSourceMap = (desktopConnections) =>
		Object.entries(desktopConnections).reduce((accumulator, [sourceId, targetId]) => {
			accumulator[targetId] = sourceId;
			return accumulator;
		}, {});

	setSourceNode = (itemKey, node) => {
		if (node) {
			this.sourceNodeMap.set(itemKey, node);
		} else {
			this.sourceNodeMap.delete(itemKey);
		}
	};

	setTargetNode = (itemKey, node) => {
		if (node) {
			this.targetNodeMap.set(itemKey, node);
		} else {
			this.targetNodeMap.delete(itemKey);
		}
	};

	scheduleConnectorMeasurement = () => {
		if (typeof window === "undefined") return;
		if (this.measureFrame) {
			window.cancelAnimationFrame(this.measureFrame);
		}
		this.measureFrame = window.requestAnimationFrame(() => {
			this.measureFrame = null;
			this.updateConnectorLayout();
		});
	};

	updateConnectorLayout = () => {
		const stage = this.desktopStageRef.current;
		if (!stage) return;

		const stageRect = stage.getBoundingClientRect();
		const nextSourcePoints = {};
		const nextTargetPoints = {};

		this.sourceNodeMap.forEach((node, itemKey) => {
			const rect = node.getBoundingClientRect();
			nextSourcePoints[itemKey] = {
				x: Math.round((rect.left + rect.width / 2 - stageRect.left) * 10) / 10,
				y: Math.round((rect.top + rect.height / 2 - stageRect.top) * 10) / 10,
			};
		});

		this.targetNodeMap.forEach((node, itemKey) => {
			const rect = node.getBoundingClientRect();
			nextTargetPoints[itemKey] = {
				x: Math.round((rect.left + rect.width / 2 - stageRect.left) * 10) / 10,
				y: Math.round((rect.top + rect.height / 2 - stageRect.top) * 10) / 10,
			};
		});

		const nextLayout = {
			height: Math.round(stageRect.height),
			sourcePoints: nextSourcePoints,
			targetPoints: nextTargetPoints,
			width: Math.round(stageRect.width),
		};

		this.setState((prevState) =>
			JSON.stringify(prevState.connectorLayout) === JSON.stringify(nextLayout)
				? null
				: { connectorLayout: nextLayout },
		);
	};

	buildConnectorPath = (sourcePoint, targetPoint) => {
		const horizontalDistance = Math.max(48, Math.abs(targetPoint.x - sourcePoint.x) * 0.36);
		return [
			`M ${sourcePoint.x} ${sourcePoint.y}`,
			`C ${sourcePoint.x + horizontalDistance} ${sourcePoint.y},`,
			`${targetPoint.x - horizontalDistance} ${targetPoint.y},`,
			`${targetPoint.x} ${targetPoint.y}`,
		].join(" ");
	};

	stopRecoilAnimation = () => {
		if (typeof window !== "undefined" && this.recoilFrame) {
			window.cancelAnimationFrame(this.recoilFrame);
		}
		this.recoilFrame = null;
	};

	startRecoilAnimation = () => {
		if (typeof window === "undefined") return;
		this.stopRecoilAnimation();

		const startedAt = window.performance.now();
		const step = (now) => {
			const elapsed = now - startedAt;
			const nextProgress = Math.min(1, elapsed / LINE_MATCH_RECOIL_DURATION_MS);

			this.setState({
				recoilProgress: nextProgress,
			});

			if (nextProgress < 1) {
				this.recoilFrame = window.requestAnimationFrame(step);
				return;
			}

			this.recoilFrame = null;
			this.setState({
				recoilProgress: 1,
				recoilingConnections: [],
			});
		};

		this.recoilFrame = window.requestAnimationFrame(step);
	};

	handleCheckAnswers = () => {
		let nextIncorrectConnections = [];
		this.setState((prevState) => {
			const checkedResults = {};
			const nextDesktopConnections = {};
			const nextMobileValues = { ...prevState.mobileValues };
			nextIncorrectConnections = [];

			prevState.sampledItems.forEach((item, index) => {
				const itemKey = this.getItemKey(item, index);
				if (prevState.isDesktopViewport) {
					const selectedTargetId = prevState.desktopConnections[itemKey];
					if (!selectedTargetId) return;
					const isCorrect = selectedTargetId === itemKey;
					checkedResults[itemKey] = isCorrect;
					if (isCorrect) {
						nextDesktopConnections[itemKey] = selectedTargetId;
					} else {
						nextIncorrectConnections.push({
							sourceId: itemKey,
							targetId: selectedTargetId,
						});
					}
				} else {
					const selectedValue = prevState.mobileValues[itemKey];
					if (!selectedValue) return;
					const isCorrect = selectedValue === itemKey;
					checkedResults[itemKey] = isCorrect;
					if (!isCorrect) {
						delete nextMobileValues[itemKey];
					}
				}
			});

			return {
				activeSourceId: null,
				activeTargetId: null,
				checkedResults,
				desktopConnections: prevState.isDesktopViewport ? nextDesktopConnections : prevState.desktopConnections,
				hasChecked: true,
				mobileValues: prevState.isDesktopViewport ? prevState.mobileValues : nextMobileValues,
				nCorrect: this.getCorrectCount(checkedResults),
				recoilProgress: nextIncorrectConnections.length > 0 ? 0 : 1,
				recoilingConnections: prevState.isDesktopViewport ? nextIncorrectConnections : [],
				usedShowAnswer: false,
			};
		}, () => {
			if (nextIncorrectConnections.length > 0 && this.state.isDesktopViewport) {
				this.startRecoilAnimation();
			}
		});
	};

	handleReset = () => {
		this.stopRecoilAnimation();
		this.setState((prevState) => ({
			...buildRound(this.props.config),
			activeSourceId: null,
			activeTargetId: null,
			checkedResults: {},
			connectorLayout: null,
			desktopConnections: {},
			hasChecked: false,
			mobileValues: {},
			nCorrect: 0,
			recoilProgress: 1,
			recoilingConnections: [],
			usedShowAnswer: false,
			isDesktopViewport: prevState.isDesktopViewport,
		}));
	};

	handleShowAnswers = () => {
		this.stopRecoilAnimation();
		this.setState((prevState) => {
			const checkedResults = {};
			const nextDesktopConnections = {};
			const nextMobileValues = {};

			prevState.sampledItems.forEach((item, index) => {
				const itemKey = this.getItemKey(item, index);
				checkedResults[itemKey] = true;
				nextDesktopConnections[itemKey] = itemKey;
				nextMobileValues[itemKey] = itemKey;
			});

			return {
				activeSourceId: null,
				activeTargetId: null,
				checkedResults,
				desktopConnections: nextDesktopConnections,
				hasChecked: true,
				mobileValues: nextMobileValues,
				nCorrect: prevState.sampledItems.length,
				recoilProgress: 1,
				recoilingConnections: [],
				usedShowAnswer: true,
			};
		});
	};

	renderDesktopConnectors = (
		connectorLayout,
		desktopConnections,
		checkedResults,
		recoilingConnections,
		recoilProgress,
	) => {
		if (!connectorLayout) return null;

		const paths = Object.entries(desktopConnections)
			.map(([sourceId, targetId]) => {
				const sourcePoint = connectorLayout.sourcePoints[sourceId];
				const targetPoint = connectorLayout.targetPoints[targetId];
				if (!sourcePoint || !targetPoint) return null;
				const isCorrect = checkedResults[sourceId] === true;
				return {
					d: this.buildConnectorPath(sourcePoint, targetPoint),
					id: `${sourceId}-${targetId}`,
					isCorrect,
				};
			})
			.filter(Boolean);

		const recoilPaths = recoilingConnections
			.map(({ sourceId, targetId }) => {
				const sourcePoint = connectorLayout.sourcePoints[sourceId];
				const targetPoint = connectorLayout.targetPoints[targetId];
				if (!sourcePoint || !targetPoint) return null;
				const animatedTargetPoint = {
					x: targetPoint.x + ((sourcePoint.x - targetPoint.x) * recoilProgress),
					y: targetPoint.y + ((sourcePoint.y - targetPoint.y) * recoilProgress),
				};
				return {
					d: this.buildConnectorPath(sourcePoint, animatedTargetPoint),
					id: `${sourceId}-${targetId}`,
				};
			})
			.filter(Boolean);

		if (paths.length === 0 && recoilPaths.length === 0) return null;

		return (
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
				height={connectorLayout.height}
				viewBox={`0 0 ${connectorLayout.width} ${connectorLayout.height}`}
				width={connectorLayout.width}
			>
				{paths.map((path) => (
					<g key={`line-match-connector-${path.id}`}>
						<path
							d={path.d}
							fill="none"
							stroke={path.isCorrect ? LINE_MATCH_CORRECT_GLOW : LINE_MATCH_CONNECTOR_GLOW}
							strokeLinecap="round"
							strokeWidth="9"
						/>
						<path
							d={path.d}
							fill="none"
							stroke={path.isCorrect ? LINE_MATCH_CORRECT_STROKE : LINE_MATCH_CONNECTOR_STROKE}
							strokeLinecap="round"
							strokeWidth="4"
						/>
					</g>
				))}
				{recoilPaths.map((path) => (
					<g key={`line-match-recoil-${path.id}`}>
						<path
							d={path.d}
							fill="none"
							stroke={LINE_MATCH_RECOIL_GLOW}
							strokeLinecap="round"
							strokeWidth="9"
						/>
						<path
							d={path.d}
							fill="none"
							stroke={LINE_MATCH_RECOIL_STROKE}
							strokeLinecap="round"
							strokeWidth="4"
						/>
					</g>
				))}
			</svg>
		);
	};

	render = () => {
		const { config = {} } = this.props;
		const { suppressInfo = false } = this.props;
		const {
			cheatText = "Show answer",
			informationText,
			informationTextHTML,
			instructionsText,
			instructionsTextHTML,
		} = config;
		const resolvedInfoTextHTML = informationTextHTML || instructionsTextHTML;
		const resolvedInfoText = informationText || instructionsText;
		const {
			activeSourceId,
			activeTargetId,
			checkedResults,
			connectorLayout,
			desktopConnections,
			hasChecked,
			isDesktopViewport,
			sampledItems,
			wordBank,
			mobileValues,
			nCorrect,
			recoilProgress,
			recoilingConnections,
		} = this.state;
		const connectedSourcesByTarget = this.buildTargetSourceMap(desktopConnections);
		const totalItems = sampledItems.length;
		const answeredCount = isDesktopViewport
			? Object.keys(desktopConnections).length
			: Object.keys(mobileValues).length;
		const canCheck = answeredCount > 0;
		const showReset = answeredCount > 0 || hasChecked;
		const hasAnyIncorrect = hasChecked && nCorrect < totalItems;

		if (sampledItems.length === 0) {
			return <div>No configuration provided for LineMatch.</div>;
		}

		return (
			<div className="space-y-4">
				{!suppressInfo && (resolvedInfoText || resolvedInfoTextHTML) ? (
					<Info informationText={resolvedInfoText} informationTextHTML={resolvedInfoTextHTML} />
				) : null}

				<div className="rounded-xl border border-border/70 bg-card p-4">
					<div className="space-y-5 min-[980px]:hidden">
						<section className="space-y-3">
							<ol className="space-y-4">
								{sampledItems.map((item, index) => {
									const itemKey = this.getItemKey(item, index);
									const rowHasResult = hasChecked && Object.prototype.hasOwnProperty.call(checkedResults, itemKey);
									const rowIsCorrect = checkedResults[itemKey] === true;
									return (
										<li className="rounded-xl border border-border/70 bg-background/55 p-3" key={`line-match-mobile-picture-${itemKey}`}>
											<div className="flex items-center gap-3">
												<div className="shrink-0">
													{item.audio ? (
														<AudioClip className="link" soundFile={item.audio}>
															<span className="sr-only">Listen to {item.label}</span>
														</AudioClip>
													) : null}
												</div>
												<div className={LINE_MATCH_IMAGE_TILE_CLASS}>
													<img
														alt={item.alt || item.localLanguage || "" /* see IMAGE ALT TEXT POLICY at top of file */}
														className="h-full w-full object-contain"
														loading="lazy"
														src={resolveAsset(item.image)}
													/>
												</div>
												<div className="min-w-0 flex-1">
													<Select
														onValueChange={(value) => this.handleMobileValueChange(itemKey, value)}
														value={mobileValues[itemKey] || ""}
													>
														<SelectTrigger className={LINE_MATCH_SELECT_TRIGGER_CLASS}>
															<SelectValue placeholder="Choose the matching word" />
														</SelectTrigger>
														<SelectContent>
															{wordBank.map((option, optionIndex) => {
																const optionKey = this.getItemKey(option, optionIndex);
																return (
																	<SelectItem
																		key={`line-match-mobile-option-${optionKey}`}
																		value={optionKey}
																	>
																		{option.label}
																	</SelectItem>
																);
															})}
														</SelectContent>
													</Select>
												</div>
												<span
													aria-hidden="true"
													className={`inline-flex min-h-10 w-10 shrink-0 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--chart-2)]" : "text-[var(--destructive)]") : "invisible"}`}
												>
													{rowIsCorrect ? (
														<CircleCheck className="h-8 w-8" />
													) : (
														<CircleX className="h-8 w-8" />
													)}
												</span>
											</div>
										</li>
									);
								})}
							</ol>
						</section>
					</div>

					<div className="relative hidden min-[980px]:block" ref={this.desktopStageRef}>
						{this.renderDesktopConnectors(
							connectorLayout,
							desktopConnections,
							checkedResults,
							recoilingConnections,
							recoilProgress,
						)}

						<div className="space-y-4 min-[980px]:grid min-[980px]:grid-cols-[minmax(0,1fr)_minmax(16rem,18rem)] min-[980px]:gap-6 min-[980px]:space-y-0">
							<section className="relative z-10 space-y-3">
								<ol className="space-y-3">
									{sampledItems.map((item, index) => {
										const itemKey = this.getItemKey(item, index);
										const isActive = activeSourceId === itemKey;
										const connectedTargetId = desktopConnections[itemKey];
										const isCorrect = checkedResults[itemKey] === true;
										const pictureStatusText = isCorrect
											? "Matched"
											: connectedTargetId
												? "Connected"
												: isActive
													? "Selected"
													: item.localLanguage || "";
										const pictureCardLayoutClass = pictureStatusText
											? "min-w-[10.5rem] justify-end"
											: "justify-center";
										return (
											<li className="flex items-center" key={`line-match-picture-${itemKey}`}>
												<div
													className={`flex ${LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS} ${pictureCardLayoutClass} cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 shadow-[0_2px_6px_color-mix(in_oklab,var(--chart-3)_12%,transparent)] transition ${isCorrect ? "border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_10%,var(--background))]" : isActive ? "border-[color-mix(in_oklab,var(--chart-5)_54%,var(--foreground))] bg-[color-mix(in_oklab,var(--chart-5)_10%,var(--background))]" : connectedTargetId ? "border-[color-mix(in_oklab,var(--edu-warn)_42%,var(--foreground))] bg-[color-mix(in_oklab,var(--edu-warn)_8%,var(--background))]" : "border-border/70 bg-background/60 hover:bg-[rgb(var(--color-primary-200)_/_0.42)]"}`}
													onClick={() => this.handleSourceActivate(itemKey)}
												>
													{pictureStatusText ? (
														<div className="min-w-[4.5rem] text-right text-xs leading-tight text-muted-foreground">
															{pictureStatusText}
														</div>
													) : null}
													<button
														className={`${LINE_MATCH_IMAGE_TILE_CLASS} cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_color-mix(in_oklab,var(--chart-3)_22%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--chart-5)_44%,transparent)] ${isCorrect ? "border-[var(--chart-2)]" : isActive ? "border-[color-mix(in_oklab,var(--chart-5)_54%,var(--foreground))]" : connectedTargetId ? "border-[color-mix(in_oklab,var(--edu-warn)_42%,var(--foreground))]" : ""}`}
														onClick={(event) => {
															event.stopPropagation();
															this.handleSourceActivate(itemKey);
														}}
														type="button"
													>
														<img
															alt={item.alt || item.localLanguage || "" /* see IMAGE ALT TEXT POLICY at top of file */}
															className="h-full w-full object-contain"
															loading="lazy"
															src={resolveAsset(item.image)}
														/>
													</button>
													<button
														aria-label={`Select picture ${index + 1} as connection source`}
														className={`inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition ${isCorrect ? "border-[var(--chart-2)] bg-[var(--chart-2)] ring-2 ring-[color-mix(in_oklab,var(--chart-2)_28%,transparent)]" : isActive ? "border-[var(--chart-5)] bg-[color-mix(in_oklab,var(--chart-5)_28%,var(--background))] ring-2 ring-[color-mix(in_oklab,var(--chart-5)_40%,transparent)]" : connectedTargetId ? "border-[var(--edu-warn)] bg-[var(--edu-warn)]" : "border-[color-mix(in_oklab,var(--chart-3)_72%,var(--foreground))] bg-background"}`}
														onClick={(event) => {
															event.stopPropagation();
															this.handleSourceActivate(itemKey);
														}}
														ref={(node) => this.setSourceNode(itemKey, node)}
														type="button"
													/>
												</div>
											</li>
										);
									})}
								</ol>
							</section>

							<section className="relative z-10 space-y-3">
								<ol className="space-y-3">
									{wordBank.map((item, index) => {
										const targetId = this.getItemKey(item, index);
										const connectedSourceId = connectedSourcesByTarget[targetId];
										const isCorrect = connectedSourceId && checkedResults[connectedSourceId] === true;
										const isActiveTarget = activeTargetId === targetId;
										return (
											<li
												className={`flex ${LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS} cursor-pointer items-center gap-3 rounded-lg border px-3 shadow-[0_2px_6px_color-mix(in_oklab,var(--chart-3)_14%,transparent)] transition ${isCorrect ? "border-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_16%,var(--card))]" : isActiveTarget ? "border-[var(--chart-5)] bg-[color-mix(in_oklab,var(--chart-5)_10%,var(--card))]" : connectedSourceId ? "border-[var(--edu-warn)] bg-[color-mix(in_oklab,var(--edu-warn)_12%,var(--card))]" : "border-[rgb(var(--color-primary-400)_/_0.92)] bg-[rgb(var(--color-primary-200)_/_0.78)]"}`}
												key={`line-match-word-${targetId}`}
												onClick={() => this.handleTargetActivate(targetId)}
											>
												<button
													aria-label={`Connect selected picture to ${item.label}`}
													className={`inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition ${isCorrect ? "border-[var(--chart-2)] bg-[var(--chart-2)]" : connectedSourceId ? "border-[var(--edu-warn)] bg-[var(--edu-warn)]" : isActiveTarget ? "border-[var(--chart-5)] bg-[color-mix(in_oklab,var(--chart-5)_28%,var(--background))] ring-2 ring-[color-mix(in_oklab,var(--chart-5)_40%,transparent)]" : activeSourceId ? "border-[var(--chart-5)] bg-[color-mix(in_oklab,var(--chart-5)_20%,var(--background))]" : "border-[color-mix(in_oklab,var(--chart-3)_72%,var(--foreground))] bg-background"}`}
													onClick={(event) => {
														event.stopPropagation();
														this.handleTargetActivate(targetId);
													}}
													ref={(node) => this.setTargetNode(targetId, node)}
													type="button"
												/>
												<div
													className="min-w-0 text-left"
													onClick={(event) => {
														event.stopPropagation();
													}}
												>
													{item.audio ? (
														<AudioClip className="link" soundFile={item.audio}>
															<strong>{item.label}</strong>
														</AudioClip>
													) : (
														<strong>{item.label}</strong>
													)}
												</div>
												<div className="ml-auto min-w-[3rem] text-right text-xs leading-tight text-muted-foreground">
													{isCorrect ? "Matched" : connectedSourceId ? "Connected" : isActiveTarget ? "Selected" : ""}
												</div>
											</li>
										);
									})}
								</ol>
							</section>
						</div>
					</div>

					<div className="exercise-divider" data-orientation="horizontal" role="none" />
					<ProgressDots correct={nCorrect} total={totalItems} />
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
									visible: showReset,
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
								disabled={!canCheck}
								onClick={this.handleCheckAnswers}
								theme="check"
							>
								<span className="exercise-icon-button-label">Check answers</span>
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
