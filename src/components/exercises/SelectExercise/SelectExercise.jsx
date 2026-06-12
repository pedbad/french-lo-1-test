import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
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
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { Fragment, useEffect, useReducer, useRef } from "react";
import { shuffleArray } from "@/utils/collections";
import { decodeHtmlEntities } from "@/utils/htmlUtils";
import { parseChoiceBlank, parseSentence } from "@/utils/exerciseParsing";
import { resolveAsset } from "@/utils/assets";

const SELECT_EXERCISE_TRIGGER_CLASS = "w-full min-h-10 text-sm md:text-base";
const SELECT_EXERCISE_INLINE_TRIGGER_CLASS = "inline-flex min-h-9 w-auto max-w-full align-middle text-sm md:text-base";
const SELECT_EXERCISE_INLINE_PASSAGE_TRIGGER_CLASS = "inline-flex h-8 w-auto max-w-full px-2 align-middle text-sm leading-[var(--line-height-app)]";
const SELECT_EXERCISE_PLACEHOLDER_TEXT = "Select answer";
const SELECT_EXERCISE_PASSAGE_ACCENTS = {
  blue: "var(--content-accent-blue)",
  green: "var(--content-accent-green)",
  indigo: "var(--content-accent-indigo)",
  orange: "var(--content-accent-orange)",
  red: "var(--content-accent-red)",
  violet: "var(--content-accent-violet)",
  yellow: "var(--content-accent-yellow)",
};

const getSelectOptionTextLength = (value = "") => {
  const normalized = decodeHtmlEntities(`${value}`)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.length;
};

const shuffleItemText = (text = "") => {
  if (!text.includes("[")) return text;

  return text.replace(/\[([^\]]+)\]/g, (_match, group) => {
    const options = group.split("|").map((option) => option.trim());
    const shuffled = shuffleArray(options);
    return `[${shuffled.join("|")}]`;
  });
};

const buildShuffledItems = (items = []) => {
  return items.map((item) => {
    if (!item || typeof item !== "object") return item;
    if (!item.text || typeof item.text !== "string") return item;
    return {
      ...item,
      text: shuffleItemText(item.text),
    };
  });
};

const buildPreparedItems = (items = [], config = {}) => {
  const withShuffledChoices = buildShuffledItems(items);
  const shouldShuffleItems = Boolean(config?.shuffleItems);
  const sampleSize = Number.isInteger(config?.sampleSize) ? config.sampleSize : null;
  const orderedItems = shouldShuffleItems
    ? shuffleArray(withShuffledChoices)
    : withShuffledChoices;

  if (sampleSize && sampleSize > 0) {
    return orderedItems.slice(0, sampleSize);
  }

  return orderedItems;
};

const renderSentenceWithoutChoices = (segments) => {
  return segments
    .filter((segment) => segment.type === "text")
    .map((segment) => segment.value)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
};

const getInlinePassageLineStyle = (accentKey) => {
  const accentColor = accentKey ? SELECT_EXERCISE_PASSAGE_ACCENTS[accentKey] : null;
  if (!accentColor) return {};

  return {
    accentColor,
    lineStyle: {
      boxShadow: `inset 0 1px 0 color-mix(in oklab, ${accentColor} 10%, transparent)`,
    },
  };
};

const getResetState = (config = {}) => ({
  activeRowIndex: -1,
  checkedResults: {},
  hasChecked: false,
  masterPlayState: "stopped",
  nCorrect: 0,
  rowAudioStatus: {},
  rowProgress: {},
  shuffledItems: buildPreparedItems(config?.items || [], config),
  values: {},
});

// Merge reducer: each dispatch is a partial state patch (9 interdependent
// fields, so useReducer over many useState calls per the migration plan).
// A function patch receives the latest state — used by the audio progress
// handlers, which can fire faster than renders flush.
const reducer = (state, patch) => ({
  ...state,
  ...(typeof patch === "function" ? patch(state) : patch),
});

export function SelectExercise({ config = {} }) {
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
    soundFile,
    useSequenceAudioController = false,
  } = config;

  const [state, dispatch] = useReducer(reducer, config, getResetState);
  const { hasChecked, rowAudioStatus, shuffledItems, values } = state;

  const blanksMetaRef = useRef([]);
  const nToSolveRef = useRef(0);
  const rowAudioRefs = useRef({});
  const sequenceRef = useRef(null);

  // Config-identity reset (was componentDidUpdate). Key-based remount is the
  // Phase 6 consolidation; the ref compare keeps the mount-time effect a no-op.
  const prevConfigRef = useRef(config);
  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      blanksMetaRef.current = [];
      nToSolveRef.current = 0;
      rowAudioRefs.current = {};
      dispatch(getResetState(config));
    }
  }, [config]);

  const getInlineSelectTriggerStyle = (blankIndex, { passage = false } = {}) => {
    const meta = blanksMetaRef.current[blankIndex];
    const optionLengths = (meta?.options || []).map((option) =>
      getSelectOptionTextLength(option)
    );
    const placeholderLength = getSelectOptionTextLength(SELECT_EXERCISE_PLACEHOLDER_TEXT);
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

  const handleSelectChange = (blankIndex, value) => {
    dispatch((prevState) => {
      const nextValues = {
        ...prevState.values,
        [blankIndex]: value,
      };

      if (!prevState.hasChecked) {
        return { values: nextValues };
      }

      const checkedResults = {
        ...prevState.checkedResults,
      };
      delete checkedResults[blankIndex];

      return {
        values: nextValues,
        checkedResults,
        hasChecked: true,
        nCorrect: Object.values(checkedResults).filter(Boolean).length,
      };
    });
  };

  const handleCheckAnswers = () => {
    const checkedResults = {};
    for (let i = 0; i < nToSolveRef.current; i += 1) {
      const value = values[i];
      if (value === undefined || value === null || value === "") continue;
      const winner = blanksMetaRef.current[i]?.winner;
      checkedResults[i] = parseInt(value, 10) === winner;
    }

    dispatch({
      checkedResults,
      hasChecked: true,
      nCorrect: Object.values(checkedResults).filter(Boolean).length,
    });
  };

  const handleReset = () => {
    dispatch({
      checkedResults: {},
      hasChecked: false,
      nCorrect: 0,
      rowAudioStatus: {},
      shuffledItems: buildPreparedItems(config?.items || [], config),
      values: {},
    });
  };

  const handleRowAudioStatusChange = (rowIndex, status) => {
    dispatch((prevState) => {
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

  const triggerRowAudio = (rowIndex) => {
    const rowAudioHost = rowAudioRefs.current[rowIndex];
    if (!rowAudioHost) return;
    const buttonEl = rowAudioHost.querySelector("button.audio-container");
    if (!buttonEl) return;
    buttonEl.click();
  };

  const handleSentenceClick = (rowIndex, event) => {
    const targetNode = event?.target;
    if (
      targetNode instanceof Element &&
      targetNode.closest(
        "button, input, textarea, select, a, [role='combobox'], [role='listbox'], [role='option'], .audio-container, .audio-link"
      )
    ) {
      return;
    }

    triggerRowAudio(rowIndex);
  };

  const handleShowAnswers = () => {
    const nextValues = {};
    const checkedResults = {};

    for (let i = 0; i < nToSolveRef.current; i += 1) {
      const winner = blanksMetaRef.current[i]?.winner;
      nextValues[i] = String(winner);
      checkedResults[i] = true;
    }

    dispatch({
      checkedResults,
      hasChecked: true,
      nCorrect: nToSolveRef.current,
      values: nextValues,
    });
  };

  const handleMasterStopped = (playlistIndex, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
    dispatch((prev) => ({
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

  const handleMasterPlayStateChange = (playState) => {
    dispatch({ masterPlayState: playState });
  };

  const handleMasterTrackChange = (playlistIndex, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
    dispatch({ activeRowIndex: rowIndex });
  };

  const handleMasterTime = (playlistIndex, currentTime, duration, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex ?? -1;
    if (rowIndex < 0) return;
    dispatch((prev) => ({
      rowProgress: {
        ...prev.rowProgress,
        [rowIndex]: {
          currentTime,
          duration,
        },
      },
    }));
  };

  const renderInlineSelect = (blankIndex, localIndex, rowBlankIndices, triggerClassName = SELECT_EXERCISE_INLINE_TRIGGER_CLASS) => {
    const selectId = `${id}-select-${blankIndex}`;
    const meta = blanksMetaRef.current[blankIndex];
    const currentValue = values[blankIndex] ?? "";
    const isPassageTrigger = triggerClassName === SELECT_EXERCISE_INLINE_PASSAGE_TRIGGER_CLASS;
    const triggerStyle = getInlineSelectTriggerStyle(blankIndex, {
      passage: isPassageTrigger,
    });

    return (
      <span className="mx-1 inline-flex align-middle" key={selectId}>
        <label className="sr-only" htmlFor={selectId}>
          {`Select answer for blank ${blankIndex + 1}`}
        </label>
        <Select
          value={currentValue}
          onValueChange={(value) => handleSelectChange(blankIndex, value)}
        >
          <SelectTrigger className={triggerClassName} id={selectId} style={triggerStyle}>
            <SelectValue placeholder="Select answer" />
          </SelectTrigger>
          <SelectContent>
            {meta.options.map((option, optionIndex) => (
              <SelectItem
                className="text-sm md:text-base"
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

  // blanksMeta / nToSolve are rebuilt on every render while the rows are
  // walked, exactly as the class version did via instance fields.
  blanksMetaRef.current = [];

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
    const isActive = state.activeRowIndex === i;
    const status = isActive
      ? (state.masterPlayState === "playing" ? "playing" : "stopped")
      : "stopped";
    const prog = state.rowProgress[i] || { currentTime: 0, duration: 0 };

    const { nextBlankIndex, segments } = parseSentence(phraseText, {
      startBlankIndex: blankCursor,
      blanksMeta: blanksMetaRef.current,
      parseBlank: parseChoiceBlank,
    });
    const rowBlankIndices = segments
      .filter((segment) => segment.type === "choice")
      .map((segment) => segment.blankIndex);
    blankCursor = nextBlankIndex;

    const rowAttempted = rowBlankIndices.some((idx) => {
      const rawValue = state.values[idx];
      return rawValue !== undefined && rawValue !== null && rawValue !== "";
    });
    const rowResults = rowBlankIndices.map((idx) => state.checkedResults[idx]);
    const rowFullyChecked =
      rowBlankIndices.length > 0 &&
      rowResults.every((result) => typeof result === "boolean");
    const rowHasResult = state.hasChecked && rowAttempted && rowFullyChecked;
    const rowIsCorrect = rowHasResult && rowResults.every((result) => result === true);
    const rowHasChoices = rowBlankIndices.length > 0;

    if (layoutMode === "inline-passage") {
      const { accentColor, lineStyle } = getInlinePassageLineStyle(item?.passageAccent);
      const isPassageMeta = Boolean(item?.passageMeta);

      passageLines.push(
        /* <p>→<div>: short poem lines trigger WAVE "possible heading" alert */
        <div
          className={`relative m-0 overflow-hidden text-sm leading-[var(--line-height-app)] md:text-base ${
            isPassageMeta
              ? "pt-1 text-right text-muted-foreground"
              : `rounded-lg border border-border/70 bg-background/80 px-3 py-2 shadow-sm ${
                item?.audio ? "cursor-pointer" : ""
              } ${
                isActive ? "text-[var(--edu-affirm)]" : rowBlankIndices.length === 0 ? "text-foreground/90" : ""
              }`
          }`}
          key={`select-passage-line-${id}-${i}`}
          onClick={item?.audio ? (event) => handleSentenceClick(i, event) : undefined}
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
                  if (el) rowAudioRefs.current[i] = el;
                }}
              >
                <CircularAudioProgressAnimatedSpeakerDisplay
                  className="super-compact-speaker"
                  duration={prog.duration}
                  handleClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const targetPlaylistIndex = rowToPlaylistIndex[i];
                    if (targetPlaylistIndex === undefined) return;

                    if (isActive) {
                      sequenceRef.current?.toggle();
                      return;
                    }

                    sequenceRef.current?.playItem(targetPlaylistIndex, {
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
                    <Fragment key={segment.key || `seg-${segmentIndex}`}>
                      {segment.value}
                    </Fragment>
                  );
                }

                const {blankIndex} = segment;
                const localIndex = rowBlankIndices.indexOf(blankIndex);

                return renderInlineSelect(
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
                className={`col-start-3 inline-flex min-h-10 w-11 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]") : "invisible"}`}
              >
                {rowBlankIndices.length > 0 ? (
                  <ResultIcon isCorrect={rowIsCorrect} />
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
            ? "text-[var(--edu-affirm)]"
            : ""
        }`}
        key={`select-row-${id}-${i}`}
        onClick={item.audio ? (event) => handleSentenceClick(i, event) : undefined}
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
                if (el) rowAudioRefs.current[i] = el;
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
                      sequenceRef.current?.toggle();
                      return;
                    }

                    sequenceRef.current?.playItem(playlistIndex, {
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
                  onStatusChange={(nextStatus) => handleRowAudioStatusChange(i, nextStatus)}
                  soundFile={resolveAsset(item.audio)}
                />
              )}
            </span>
          ) : null}

          {renderInlineChoices ? (
            <div className="col-start-2 min-w-0 text-sm leading-[var(--line-height-app)] md:text-base">
              {segments.map((segment, segmentIndex) => {
                if (segment.type !== "choice") {
                  return (
                    <Fragment key={segment.key || `seg-${segmentIndex}`}>
                      {segment.value}
                    </Fragment>
                  );
                }

                const {blankIndex} = segment;
                const localIndex = rowBlankIndices.indexOf(blankIndex);

                return renderInlineSelect(
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
                  className={`col-start-2 row-start-1 m-0 min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm leading-[var(--line-height-app)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base ${rowAudioStatus[i] === "playing" ? "text-[var(--edu-affirm)]" : "text-foreground hover:text-[var(--edu-affirm)]"}`}
                  onClick={() => triggerRowAudio(i)}
                  type="button"
                >
                  {renderSentenceWithoutChoices(segments)}
                </button>
              ) : (
              /* p→div: short item text triggers WAVE "possible heading" */
                <div className="col-start-2 row-start-1 m-0 min-w-0 text-sm leading-[var(--line-height-app)] md:text-base">
                  {renderSentenceWithoutChoices(segments)}
                </div>
              )}

              {rowHasChoices ? (
                <div className="col-start-2 row-start-2 min-w-0 space-y-2">
                  {rowBlankIndices.map((blankIndex) => {
                    const selectId = `${id}-select-${blankIndex}`;
                    const meta = blanksMetaRef.current[blankIndex];
                    const currentValue = values[blankIndex] ?? "";

                    return (
                      <div className="w-full" key={selectId}>
                        <label className="sr-only" htmlFor={selectId}>
                          {`Select answer for blank ${blankIndex + 1}`}
                        </label>
                        <Select
                          value={currentValue}
                          onValueChange={(value) => handleSelectChange(blankIndex, value)}
                        >
                          <SelectTrigger className={SELECT_EXERCISE_TRIGGER_CLASS} id={selectId}>
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {meta.options.map((option, optionIndex) => (
                              <SelectItem
                                className="text-sm md:text-base"
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
              className={`col-start-3 ${renderInlineChoices ? "" : "row-start-2"} inline-flex min-h-10 w-11 items-center justify-center ${rowHasResult ? (rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]") : "invisible"}`}
            >
              {<ResultIcon isCorrect={rowIsCorrect} />}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  nToSolveRef.current = blankCursor;
  const nToSolve = blankCursor;
  const nCorrect = state.nCorrect || 0;
  const hasSelections = Object.keys(values).length > 0;
  const hasAnyIncorrect = state.hasChecked && nCorrect < nToSolve;

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
          ref={sequenceRef}
          onPlayStateChange={handleMasterPlayStateChange}
          onStopped={(playlistIndex) => handleMasterStopped(playlistIndex, playlist)}
          onTimeUpdate={(playlistIndex, clipTime, clipDuration) =>
            handleMasterTime(playlistIndex, clipTime, clipDuration, playlist)
          }
          onTrackChange={(playlistIndex) => handleMasterTrackChange(playlistIndex, playlist)}
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
          ref={sequenceRef}
          onPlayStateChange={handleMasterPlayStateChange}
          onStopped={(playlistIndex) => handleMasterStopped(playlistIndex, playlist)}
          onTimeUpdate={(playlistIndex, clipTime, clipDuration) =>
            handleMasterTime(playlistIndex, clipTime, clipDuration, playlist)
          }
          onTrackChange={(playlistIndex) => handleMasterTrackChange(playlistIndex, playlist)}
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
      <ProgressDots correct={nCorrect} total={nToSolve} />
      <div className="exercise-divider" data-orientation="horizontal" role="none" />

      <ExerciseFooter
        onCheck={handleCheckAnswers}
        onReset={handleReset}
        onShowAnswers={handleShowAnswers}
        showAnswers={hasAnyIncorrect}
        showAnswersLabel={cheatText}
        showReset={hasSelections || hasChecked}
      />

      {footnote ? <p className="footnote">{footnote}</p> : null}
      {footnoteHTML ? (
        <p
          className="footNote"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(footnoteHTML) }}
        />
      ) : null}
    </div>
  );
}
