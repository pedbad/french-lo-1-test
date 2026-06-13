import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { AudioClip, IconButton } from "@/components/media";
import { CircularAudioProgressAnimatedSpeakerDisplay } from "@/components/AudioClip";
import DOMPurify from "dompurify";
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { Fragment, useEffect, useReducer, useRef } from "react";
import { resolveAsset } from "@/utils/assets";
import { shuffleArray } from "@/utils/collections";
import { parseChoiceBlank, parseSentence } from "@/utils/exerciseParsing";
import { useExerciseAudio } from "@/hooks/useExerciseAudio";

const INLINE_CHOICE_TABLE_TEXT_CLASS = "text-sm md:text-base";

const prepareExerciseItems = (items = [], options = {}) => {
  const {
    sampleSize,
    shuffleItems = false,
  } = options;

  let prepared = [...items];
  if (shuffleItems) {
    prepared = shuffleArray(prepared);
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

const getResetState = (config = {}) => ({
  activeItems: prepareExerciseItems(config?.items || [], config),
  checkedResults: {},
  hasChecked: false,
  nCorrect: 0,
  rowAudioStatus: {},
  values: {},
});

// Merge reducer: each dispatch is a partial state patch (interdependent answer
// fields, so useReducer over many useState calls per the migration plan).
// A function patch receives the latest state — used by handlers that read
// previous state (choice edits, reset, row-audio status). (Master-player audio
// state moved to the shared useExerciseAudio hook in Phase 6.)
const reducer = (state, patch) => ({
  ...state,
  ...(typeof patch === "function" ? patch(state) : patch),
});

export function InlineChoiceGroup({ config = {} }) {
  const {
    cheatText = "Show answer",
    footnote,
    footnoteHTML,
    htmlContent = "",
    id = "",
    listenDescriptionText,
    soundFile,
    useSequenceAudioController = false,
  } = config;

  const [state, dispatch] = useReducer(reducer, config, getResetState);
  const {
    activeItems = [],
    checkedResults = {},
    hasChecked = false,
    nCorrect = 0,
    rowAudioStatus = {},
    values = {},
  } = state;

  // Master-player audio state (SequenceAudioController) lives in a shared hook.
  const {
    activeRowIndex,
    masterPlayState,
    rowProgress,
    handleMasterTrackChange,
    handleMasterPlayStateChange,
    handleMasterTime,
    handleMasterStopped,
  } = useExerciseAudio(config);

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

  const handleChoiceChange = (blankIndex, value) => {
    dispatch((prevState) => {
      const nextValues = {
        ...prevState.values,
        [blankIndex]: value,
      };

      // Editing after check should only invalidate the edited blank, not all blanks.
      if (prevState.hasChecked) {
        const nextCheckedResults = {
          ...prevState.checkedResults,
        };
        delete nextCheckedResults[blankIndex];

        return {
          values: nextValues,
          hasChecked: true,
          checkedResults: nextCheckedResults,
          nCorrect: Object.values(nextCheckedResults).filter(Boolean).length,
        };
      }

      return { values: nextValues };
    });
  };

  const handleChoiceKeyDown = (blankIndex, currentOptionIndex, optionsLength, event) => {
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
    handleChoiceChange(blankIndex, String(nextIndex));
  };

  const handleCheckAnswers = () => {
    const nextCheckedResults = {};
    for (let i = 0; i < nToSolveRef.current; i += 1) {
      const winner = blanksMetaRef.current[i]?.winner;
      nextCheckedResults[i] = parseInt(values[i], 10) === winner;
    }

    dispatch({
      checkedResults: nextCheckedResults,
      hasChecked: true,
      nCorrect: Object.values(nextCheckedResults).filter(Boolean).length,
    });
  };

  const handleReset = () => {
    dispatch((prevState) => {
      const sourceItems = config?.items || [];
      const parsedSampleSize = Number.parseInt(config?.sampleSize, 10);
      const hasSampleSize = Number.isFinite(parsedSampleSize) && parsedSampleSize > 0;
      const sampleOnReset = config?.sampleOnReset !== undefined ? Boolean(config.sampleOnReset) : true;
      const shouldRefreshItemSet = Boolean(config?.shuffleItems) || (hasSampleSize && sampleOnReset);

      return {
        activeItems: shouldRefreshItemSet
          ? prepareExerciseItems(sourceItems, config)
          : (prevState.activeItems || []),
        checkedResults: {},
        hasChecked: false,
        nCorrect: 0,
        rowAudioStatus: {},
        values: {},
      };
    });
  };

  const handleShowAnswers = () => {
    const nextValues = {};
    const nextCheckedResults = {};
    for (let i = 0; i < nToSolveRef.current; i += 1) {
      const winner = blanksMetaRef.current[i]?.winner;
      nextValues[i] = String(winner);
      nextCheckedResults[i] = true;
    }

    dispatch({
      checkedResults: nextCheckedResults,
      hasChecked: true,
      nCorrect: nToSolveRef.current,
      values: nextValues,
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
			targetNode.closest("button, [role='radio'], .audio-container, .audio-link")
    ) {
      return;
    }

    triggerRowAudio(rowIndex);
  };

  const renderChoiceGroup = (blankIndex) => {
    const meta = blanksMetaRef.current[blankIndex];
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
            const baseClasses = "inline-flex min-h-8 items-center rounded-lg border px-2.5 py-1 text-sm leading-[var(--line-height-app)] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out select-none";
            let stateClasses = "border-border/70 bg-background text-foreground hover:-translate-y-[1px] hover:border-[var(--ex-neutral)] hover:bg-[color-mix(in_oklab,var(--ex-neutral)_10%,transparent)] hover:shadow-[0_2px_8px_color-mix(in_oklab,var(--ex-neutral)_14%,transparent)]";

            if (isSelected && isCorrectSelection) {
              stateClasses = "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_20%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--edu-affirm)_35%,transparent)]";
            } else if (isSelected && isIncorrectSelection) {
              stateClasses = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_30%,transparent)]";
            } else if (isSelected) {
              stateClasses = "border-[color-mix(in_oklab,var(--ex-revealed)_58%,var(--border))] bg-[color-mix(in_oklab,var(--ex-revealed)_26%,transparent)] text-foreground font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ex-revealed)_34%,transparent)]";
            }

            return (
              <button
                aria-checked={isSelected}
                className={`${baseClasses} ${stateClasses} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2`}
                key={`inline-choice-${id}-${blankIndex}-${optionIndex}`}
                onClick={() => handleChoiceChange(blankIndex, String(optionIndex))}
                onKeyDown={(event) =>
                  handleChoiceKeyDown(blankIndex, optionIndex, meta.options.length, event)
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

  const renderSentence = (segments) => {
    return segments.map((segment) => {
      if (segment.type === "choice") {
        return renderChoiceGroup(segment.blankIndex);
      }
      return <Fragment key={segment.key}>{segment.value}</Fragment>;
    });
  };

  // blanksMeta/nToSolve are rebuilt every render while parsing sentences (the
  // same render-time mutation the class did via instance fields).
  blanksMetaRef.current = [];
  nToSolveRef.current = 0;

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
    const isActive = activeRowIndex === i;
    const status = isActive
      ? (masterPlayState === "playing" ? "playing" : "stopped")
      : "stopped";
    const rowVisualStatus = useMasterRowAudio ? status : rowAudioStatus[i];
    const prog = rowProgress[i] || { currentTime: 0, duration: 0 };

    if (!phraseText) {
      rows.push(
        <div aria-hidden="true" className="spacer h-3" key={`row-${i}`} />
      );
      continue;
    }

    const { nextBlankIndex, segments } = parseSentence(phraseText, {
      startBlankIndex: blankCursor,
      blanksMeta: blanksMetaRef.current,
      parseBlank: parseChoiceBlank,
    });
    blankCursor = nextBlankIndex;
    const rowBlankIndices = segments
      .filter((segment) => segment.type === "choice")
      .map((segment) => segment.blankIndex);
    const rowAttempted = rowBlankIndices.some((idx) => {
      const rawValue = values[idx];
      return rawValue !== undefined && rawValue !== null && rawValue !== "";
    });
    const rowResultValues = rowBlankIndices.map((idx) => checkedResults[idx]);
    const rowFullyChecked =
			rowBlankIndices.length > 0 &&
			rowResultValues.every((result) => typeof result === "boolean");
    const rowIsCorrect =
			hasChecked &&
			rowAttempted &&
			rowFullyChecked &&
			rowResultValues.every((result) => result === true);
    const rowHasResult = hasChecked && rowAttempted && rowFullyChecked;

    rows.push(
      <div className="border-b py-2 transition-colors hover:bg-muted/50" key={`row-${i}`} role="listitem">
        <div
          className={`m-0 flex items-start gap-2 leading-[var(--line-height-app)] ${item.audio ? "cursor-pointer" : ""} ${rowVisualStatus === "playing" ? "text-[var(--edu-affirm)]" : ""}`}
          onClick={item.audio ? (event) => handleSentenceClick(i, event) : undefined}
        >
          {item.audio ? (
            <span
              className={`inline-flex shrink-0 self-start ${rowBlankIndices.length > 0 ? "pt-[15px]" : "pt-0.5"}`}
              ref={(el) => {
                if (el) {
                  rowAudioRefs.current[i] = el;
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
                  className="super-compact-speaker"
                  id={`inlineChoiceRowAudio-${i}`}
                  onStatusChange={(nextStatus) => handleRowAudioStatusChange(i, nextStatus)}
                  soundFile={resolveAsset(item.audio)}
                />
              )}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">{renderSentence(segments)}</div>
          {rowHasResult ? (
            <span
              aria-hidden="true"
              className={`inline-flex shrink-0 items-center justify-center pt-0.5 ${rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]"}`}
            >
              {<ResultIcon isCorrect={rowIsCorrect} />}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  nToSolveRef.current = blankCursor;
  const hasSelections = Object.keys(values).length > 0;
  const hasAnyIncorrect = hasChecked && nCorrect < nToSolveRef.current;

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

      <div className={`${INLINE_CHOICE_TABLE_TEXT_CLASS} w-full [&>:last-child]:border-b-0`} role="list">
        {rows}
      </div>

      <div className="exercise-divider" data-orientation="horizontal" role="none" />
      <ProgressDots correct={nCorrect} total={nToSolveRef.current} />
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
