import { Info } from "@/components/content";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { AudioClip } from "@/components/media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveAsset } from "@/utils/assets";
import { shuffleArray } from "@/utils/collections";
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { useCallback, useEffect, useReducer, useRef } from "react";

const LINE_MATCH_IMAGE_TILE_CLASS = [
  "relative aspect-square min-h-[4rem] w-[4rem] overflow-hidden rounded-lg",
  "border border-[oklch(from_var(--brand-primary)_l_c_h_/_0.92)]",
  "bg-[color-mix(in_oklab,var(--brand-primary)_15%,var(--card))]",
  "shadow-[0_6px_14px_color-mix(in_oklab,var(--ex-neutral)_20%,transparent)]",
  "min-[1400px]:min-h-[5rem] min-[1400px]:w-[5rem]",
].join(" ");
const LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS = "min-h-[4.5rem] min-[1400px]:min-h-[5.5rem]";

const LINE_MATCH_SELECT_TRIGGER_CLASS = "w-full min-h-10 text-sm md:text-base";

const LINE_MATCH_CONNECTOR_STROKE = "var(--ex-active)";
const LINE_MATCH_CONNECTOR_GLOW = "color-mix(in oklab, var(--ex-active) 26%, transparent)";

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
const LINE_MATCH_CORRECT_STROKE = "var(--edu-affirm)";
const LINE_MATCH_CORRECT_GLOW = "color-mix(in oklab, var(--edu-affirm) 28%, transparent)";
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

// Full reset payload (was constructor state + componentDidUpdate config reset).
// Lazy-init seed for useReducer and the config-identity reset effect.
const getResetState = (config = {}) => ({
  ...buildRound(config),
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
});

// Merge reducer: each dispatch is a partial state patch (12 interdependent
// fields). A function patch receives the latest state (used by handlers that
// read previous state). A patch that resolves to null/undefined is a no-op:
// the reducer returns the SAME state reference so useReducer bails out of the
// re-render — this preserves the class's `setState(prev => null)` behaviour used
// by the viewport and connector-layout measurements (without it, the
// measure-after-every-render effect would loop forever).
const reducer = (state, patch) => {
  const update = typeof patch === "function" ? patch(state) : patch;
  return update ? { ...state, ...update } : state;
};

const getItemKey = (item, index) => item.id || item.label || `item-${index}`;

const getIsDesktopViewport = () =>
  typeof window !== "undefined" && window.innerWidth >= LINE_MATCH_DESKTOP_BREAKPOINT;

const getCorrectCount = (checkedResults = {}) =>
  Object.values(checkedResults).filter(Boolean).length;

const invalidateCheckedResultForSources = (sources = [], prevState) => {
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
    nCorrect: getCorrectCount(checkedResults),
    usedShowAnswer: false,
  };
};

const buildConnectionUpdate = (sourceId, targetId, prevState) => {
  const nextConnections = { ...prevState.desktopConnections };
  const affectedSources = [sourceId];

  Object.keys(nextConnections).forEach((existingSourceId) => {
    if (nextConnections[existingSourceId] === targetId && existingSourceId !== sourceId) {
      delete nextConnections[existingSourceId];
      affectedSources.push(existingSourceId);
    }
  });

  nextConnections[sourceId] = targetId;
  const invalidated = invalidateCheckedResultForSources(affectedSources, prevState);

  return {
    activeSourceId: null,
    activeTargetId: null,
    desktopConnections: nextConnections,
    ...(invalidated || {}),
  };
};

const buildTargetSourceMap = (desktopConnections) =>
  Object.entries(desktopConnections).reduce((accumulator, [sourceId, targetId]) => {
    accumulator[targetId] = sourceId;
    return accumulator;
  }, {});

const buildConnectorPath = (sourcePoint, targetPoint) => {
  const horizontalDistance = Math.max(48, Math.abs(targetPoint.x - sourcePoint.x) * 0.36);
  return [
    `M ${sourcePoint.x} ${sourcePoint.y}`,
    `C ${sourcePoint.x + horizontalDistance} ${sourcePoint.y},`,
    `${targetPoint.x - horizontalDistance} ${targetPoint.y},`,
    `${targetPoint.x} ${targetPoint.y}`,
  ].join(" ");
};

const renderDesktopConnectors = (
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
        d: buildConnectorPath(sourcePoint, targetPoint),
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
        d: buildConnectorPath(sourcePoint, animatedTargetPoint),
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

export function LineMatch({ config = {}, suppressInfo = false }) {
  const [state, dispatch] = useReducer(reducer, config, getResetState);
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
  } = state;

  // Instance fields that do not drive rendering → refs.
  const desktopStageRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const measureFrameRef = useRef(null);
  const recoilFrameRef = useRef(null);
  const sourceNodeMapRef = useRef(null);
  if (sourceNodeMapRef.current === null) sourceNodeMapRef.current = new Map();
  const targetNodeMapRef = useRef(null);
  if (targetNodeMapRef.current === null) targetNodeMapRef.current = new Map();

  const setSourceNode = (itemKey, node) => {
    if (node) {
      sourceNodeMapRef.current.set(itemKey, node);
    } else {
      sourceNodeMapRef.current.delete(itemKey);
    }
  };

  const setTargetNode = (itemKey, node) => {
    if (node) {
      targetNodeMapRef.current.set(itemKey, node);
    } else {
      targetNodeMapRef.current.delete(itemKey);
    }
  };

  const updateConnectorLayout = useCallback(() => {
    const stage = desktopStageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const nextSourcePoints = {};
    const nextTargetPoints = {};

    sourceNodeMapRef.current.forEach((node, itemKey) => {
      const rect = node.getBoundingClientRect();
      nextSourcePoints[itemKey] = {
        x: Math.round((rect.left + rect.width / 2 - stageRect.left) * 10) / 10,
        y: Math.round((rect.top + rect.height / 2 - stageRect.top) * 10) / 10,
      };
    });

    targetNodeMapRef.current.forEach((node, itemKey) => {
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

    dispatch((prevState) =>
      JSON.stringify(prevState.connectorLayout) === JSON.stringify(nextLayout)
        ? null
        : { connectorLayout: nextLayout },
    );
  }, []);

  const scheduleConnectorMeasurement = useCallback(() => {
    if (typeof window === "undefined") return;
    if (measureFrameRef.current) {
      window.cancelAnimationFrame(measureFrameRef.current);
    }
    measureFrameRef.current = window.requestAnimationFrame(() => {
      measureFrameRef.current = null;
      updateConnectorLayout();
    });
  }, [updateConnectorLayout]);

  const updateViewportMode = useCallback(() => {
    const nextIsDesktopViewport = getIsDesktopViewport();
    dispatch((prevState) =>
      prevState.isDesktopViewport === nextIsDesktopViewport
        ? null
        : { isDesktopViewport: nextIsDesktopViewport },
    );
  }, []);

  const stopRecoilAnimation = useCallback(() => {
    if (typeof window !== "undefined" && recoilFrameRef.current) {
      window.cancelAnimationFrame(recoilFrameRef.current);
    }
    recoilFrameRef.current = null;
  }, []);

  const startRecoilAnimation = useCallback(() => {
    if (typeof window === "undefined") return;
    stopRecoilAnimation();

    const startedAt = window.performance.now();
    const step = (now) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min(1, elapsed / LINE_MATCH_RECOIL_DURATION_MS);

      dispatch({ recoilProgress: nextProgress });

      if (nextProgress < 1) {
        recoilFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      recoilFrameRef.current = null;
      dispatch({
        recoilProgress: 1,
        recoilingConnections: [],
      });
    };

    recoilFrameRef.current = window.requestAnimationFrame(step);
  }, [stopRecoilAnimation]);

  // Mount/unmount (was componentDidMount + componentWillUnmount). StrictMode
  // double-fires in dev: setup adds the listener/observer, cleanup removes them
  // and cancels frames, so it is idempotent.
  useEffect(() => {
    const handleWindowResize = () => {
      updateViewportMode();
      scheduleConnectorMeasurement();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowResize);
    }

    let observer = null;
    if (typeof ResizeObserver !== "undefined" && desktopStageRef.current) {
      observer = new ResizeObserver(() => {
        scheduleConnectorMeasurement();
      });
      observer.observe(desktopStageRef.current);
      resizeObserverRef.current = observer;
    }

    updateViewportMode();
    scheduleConnectorMeasurement();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowResize);
      }
      if (observer) {
        observer.disconnect();
      }
      resizeObserverRef.current = null;
      if (typeof window !== "undefined" && measureFrameRef.current) {
        window.cancelAnimationFrame(measureFrameRef.current);
      }
      stopRecoilAnimation();
    };
  }, [scheduleConnectorMeasurement, updateViewportMode, stopRecoilAnimation]);

  // Re-measure connectors after every committed render (was the
  // componentDidUpdate fall-through). No dep array on purpose: any layout-
  // affecting state change must trigger a re-measure. The no-op reducer bail-out
  // above stops this from looping once the layout is stable.
  useEffect(() => {
    scheduleConnectorMeasurement();
  });

  const handleMobileValueChange = (itemKey, value) => {
    dispatch((prevState) => {
      const nextMobileValues = {
        ...prevState.mobileValues,
        [itemKey]: value,
      };
      const invalidated = invalidateCheckedResultForSources([itemKey], prevState);

      return {
        mobileValues: nextMobileValues,
        ...(invalidated || {}),
      };
    });
  };

  const handleSourceActivate = (sourceId) => {
    dispatch((prevState) => {
      if (prevState.activeTargetId) {
        return buildConnectionUpdate(sourceId, prevState.activeTargetId, prevState);
      }

      return {
        activeSourceId: prevState.activeSourceId === sourceId ? null : sourceId,
        activeTargetId: null,
      };
    });
  };

  const handleTargetActivate = (targetId) => {
    dispatch((prevState) => {
      if (prevState.activeSourceId) {
        return buildConnectionUpdate(prevState.activeSourceId, targetId, prevState);
      }

      return {
        activeSourceId: null,
        activeTargetId: prevState.activeTargetId === targetId ? null : targetId,
      };
    });
  };

  const handleCheckAnswers = () => {
    const nextCheckedResults = {};
    const nextDesktopConnections = {};
    const nextMobileValues = { ...mobileValues };
    const nextIncorrectConnections = [];

    sampledItems.forEach((item, index) => {
      const itemKey = getItemKey(item, index);
      if (isDesktopViewport) {
        const selectedTargetId = desktopConnections[itemKey];
        if (!selectedTargetId) return;
        const isCorrect = selectedTargetId === itemKey;
        nextCheckedResults[itemKey] = isCorrect;
        if (isCorrect) {
          nextDesktopConnections[itemKey] = selectedTargetId;
        } else {
          nextIncorrectConnections.push({
            sourceId: itemKey,
            targetId: selectedTargetId,
          });
        }
      } else {
        const selectedValue = mobileValues[itemKey];
        if (!selectedValue) return;
        const isCorrect = selectedValue === itemKey;
        nextCheckedResults[itemKey] = isCorrect;
        if (!isCorrect) {
          delete nextMobileValues[itemKey];
        }
      }
    });

    dispatch({
      activeSourceId: null,
      activeTargetId: null,
      checkedResults: nextCheckedResults,
      desktopConnections: isDesktopViewport ? nextDesktopConnections : desktopConnections,
      hasChecked: true,
      mobileValues: isDesktopViewport ? mobileValues : nextMobileValues,
      nCorrect: getCorrectCount(nextCheckedResults),
      recoilProgress: nextIncorrectConnections.length > 0 ? 0 : 1,
      recoilingConnections: isDesktopViewport ? nextIncorrectConnections : [],
      usedShowAnswer: false,
    });

    if (nextIncorrectConnections.length > 0 && isDesktopViewport) {
      startRecoilAnimation();
    }
  };

  const handleReset = () => {
    stopRecoilAnimation();
    dispatch((prevState) => ({
      ...getResetState(config),
      isDesktopViewport: prevState.isDesktopViewport,
    }));
  };

  const handleShowAnswers = () => {
    stopRecoilAnimation();
    dispatch((prevState) => {
      const nextCheckedResults = {};
      const nextDesktopConnections = {};
      const nextMobileValues = {};

      prevState.sampledItems.forEach((item, index) => {
        const itemKey = getItemKey(item, index);
        nextCheckedResults[itemKey] = true;
        nextDesktopConnections[itemKey] = itemKey;
        nextMobileValues[itemKey] = itemKey;
      });

      return {
        activeSourceId: null,
        activeTargetId: null,
        checkedResults: nextCheckedResults,
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

  const {
    cheatText = "Show answer",
    informationText,
    informationTextHTML,
    instructionsText,
    instructionsTextHTML,
  } = config;
  const resolvedInfoTextHTML = informationTextHTML || instructionsTextHTML;
  const resolvedInfoText = informationText || instructionsText;

  const connectedSourcesByTarget = buildTargetSourceMap(desktopConnections);
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
                const itemKey = getItemKey(item, index);
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
                          onValueChange={(value) => handleMobileValueChange(itemKey, value)}
                          value={mobileValues[itemKey] || ""}
                        >
                          <SelectTrigger className={LINE_MATCH_SELECT_TRIGGER_CLASS}>
                            <SelectValue placeholder="Choose the matching word" />
                          </SelectTrigger>
                          <SelectContent>
                            {wordBank.map((option, optionIndex) => {
                              const optionKey = getItemKey(option, optionIndex);
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
                        className={`inline-flex min-h-10 w-10 shrink-0 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]") : "invisible"}`}
                      >
                        {<ResultIcon isCorrect={rowIsCorrect} size="sm" />}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <div className="relative hidden min-[980px]:block" ref={desktopStageRef}>
          {renderDesktopConnectors(
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
                  const itemKey = getItemKey(item, index);
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
                        className={`flex ${LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS} ${pictureCardLayoutClass} cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 shadow-[0_2px_6px_color-mix(in_oklab,var(--ex-neutral)_12%,transparent)] transition ${isCorrect ? "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_10%,var(--background))]" : isActive ? "border-[color-mix(in_oklab,var(--ex-active)_54%,var(--foreground))] bg-[color-mix(in_oklab,var(--ex-active)_10%,var(--background))]" : connectedTargetId ? "border-[color-mix(in_oklab,var(--edu-warn)_42%,var(--foreground))] bg-[color-mix(in_oklab,var(--edu-warn)_8%,var(--background))]" : "border-border/70 bg-background/60 hover:bg-[color-mix(in_oklab,var(--brand-primary)_12%,transparent)]"}`}
                        onClick={() => handleSourceActivate(itemKey)}
                      >
                        {pictureStatusText ? (
                          <div className="min-w-[4.5rem] text-right text-xs leading-tight text-muted-foreground">
                            {pictureStatusText}
                          </div>
                        ) : null}
                        <button
                          className={`${LINE_MATCH_IMAGE_TILE_CLASS} cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_color-mix(in_oklab,var(--ex-neutral)_22%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--ex-active)_44%,transparent)] ${isCorrect ? "border-[var(--edu-affirm)]" : isActive ? "border-[color-mix(in_oklab,var(--ex-active)_54%,var(--foreground))]" : connectedTargetId ? "border-[color-mix(in_oklab,var(--edu-warn)_42%,var(--foreground))]" : ""}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSourceActivate(itemKey);
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
                          className={`inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition ${isCorrect ? "border-[var(--edu-affirm)] bg-[var(--edu-affirm)] ring-2 ring-[color-mix(in_oklab,var(--edu-affirm)_28%,transparent)]" : isActive ? "border-[var(--ex-active)] bg-[color-mix(in_oklab,var(--ex-active)_28%,var(--background))] ring-2 ring-[color-mix(in_oklab,var(--ex-active)_40%,transparent)]" : connectedTargetId ? "border-[var(--edu-warn)] bg-[var(--edu-warn)]" : "border-[color-mix(in_oklab,var(--ex-neutral)_72%,var(--foreground))] bg-background"}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSourceActivate(itemKey);
                          }}
                          ref={(node) => setSourceNode(itemKey, node)}
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
                  const targetId = getItemKey(item, index);
                  const connectedSourceId = connectedSourcesByTarget[targetId];
                  const isCorrect = connectedSourceId && checkedResults[connectedSourceId] === true;
                  const isActiveTarget = activeTargetId === targetId;
                  return (
                    <li
                      className={`flex ${LINE_MATCH_DESKTOP_ROW_HEIGHT_CLASS} cursor-pointer items-center gap-3 rounded-lg border px-3 shadow-[0_2px_6px_color-mix(in_oklab,var(--ex-neutral)_14%,transparent)] transition ${isCorrect ? "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_16%,var(--card))]" : isActiveTarget ? "border-[var(--ex-active)] bg-[color-mix(in_oklab,var(--ex-active)_10%,var(--card))]" : connectedSourceId ? "border-[var(--edu-warn)] bg-[color-mix(in_oklab,var(--edu-warn)_12%,var(--card))]" : "border-[oklch(from_var(--brand-primary)_l_c_h_/_0.92)] bg-[color-mix(in_oklab,var(--brand-primary)_25%,var(--card))]"}`}
                      key={`line-match-word-${targetId}`}
                      onClick={() => handleTargetActivate(targetId)}
                    >
                      <button
                        aria-label={`Connect selected picture to ${item.label}`}
                        className={`inline-flex h-5 w-5 shrink-0 rounded-full border-2 transition ${isCorrect ? "border-[var(--edu-affirm)] bg-[var(--edu-affirm)]" : connectedSourceId ? "border-[var(--edu-warn)] bg-[var(--edu-warn)]" : isActiveTarget ? "border-[var(--ex-active)] bg-[color-mix(in_oklab,var(--ex-active)_28%,var(--background))] ring-2 ring-[color-mix(in_oklab,var(--ex-active)_40%,transparent)]" : activeSourceId ? "border-[var(--ex-active)] bg-[color-mix(in_oklab,var(--ex-active)_20%,var(--background))]" : "border-[color-mix(in_oklab,var(--ex-neutral)_72%,var(--foreground))] bg-background"}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTargetActivate(targetId);
                        }}
                        ref={(node) => setTargetNode(targetId, node)}
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

        <ExerciseFooter
          checkDisabled={!canCheck}
          onCheck={handleCheckAnswers}
          onReset={handleReset}
          onShowAnswers={handleShowAnswers}
          showAnswers={hasAnyIncorrect}
          showAnswersLabel={cheatText}
          showReset={showReset}
        />
      </div>
    </div>
  );
}
