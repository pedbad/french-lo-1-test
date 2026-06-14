import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { AudioClip, CircularAudioProgressAnimatedSpeakerDisplay } from "@/components/media";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { Fragment, useReducer, useRef } from "react";

import { commitCheck, countCorrect, getInitialScoringState } from "@/utils/exerciseScoring";
import { resolveAsset } from "@/utils/assets";
import { decodeHtmlEntities } from "@/utils/htmlUtils";
import { parseInputBlank, parseSentence } from "@/utils/exerciseParsing";
import { normalizeAnswer } from "@/utils/answerNormalize";
import AudioManager from "@/audio/AudioManager";
import { highlightTextDiff } from "@/utils/exerciseDiff";

const INLINE_TYPED_INPUT_BASE_CLASS =
	"mx-1 inline-flex h-9 min-h-9 rounded-lg border bg-background px-2.5 py-1 align-middle text-sm font-medium leading-[var(--line-height-app)] shadow-sm transition-[border-color,background-color,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:h-10 md:min-h-10 md:text-base";

// Full reset: re-spread config + clear all check/audio/value state.
// Used for both lazy init and the prevConfig-change reset effect.
function getResetState(config) {
  return {
    ...config,
    ...getInitialScoringState(),
    activeRowIndex: -1,
    diffResults: {},
    masterPlayState: "stopped",
    rowAudioStatus: {},
    rowProgress: {},
    values: {},
  };
}

// Merge reducer. Function patches read the latest state; null/undefined patches
// bail out to the same state ref (preserves setState(prev => null) no-ops).
function reducer(state, patch) {
  const next = typeof patch === "function" ? patch(state) : patch;
  if (next === null || next === undefined) return state;
  return { ...state, ...next };
}

function isAnswerCorrect(userValue = "", expected = "") {
  return normalizeAnswer(userValue) === normalizeAnswer(expected);
}

export function InlineTypedGapExercise({ config }) {
  const [state, dispatch] = useReducer(reducer, config, getResetState);

  // blanksMeta / nToSolve are render-derived (rebuilt every render in the body)
  // but ALSO read by handlers — mirror into refs so handlers see the latest.
  const blanksMetaRef = useRef([]);
  const nToSolveRef = useRef(0);
  const rowAudioRefs = useRef({});
  const sequenceRef = useRef(null);

  const handleInputChange = (blankIndex, userValue) => {
    dispatch((prevState) => {
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
        nCorrect: countCorrect(checkedResults),
      };
    });
  };

  const handleInputKeyDown = (event, blankIndex) => {
    if (event.key !== "Enter" && event.key !== "NumpadEnter") return;
    // Enter advances to the next blank instead of submitting the whole exercise.
    // (Submitting on Enter caused accidental early reveal of all answers.)
    event.preventDefault();
    const id = state.id || "";
    const nextInput = document.getElementById(`${id}-inline-typed-gap-${blankIndex + 1}`);
    if (nextInput) {
      nextInput.focus();
    } else {
      event.target.blur();
    }
  };

  const handleCheckAnswers = () => {
    const values = state.values || {};
    const checkedResults = {};
    const diffResults = {};
    const nToSolve = nToSolveRef.current;
    const blanksMeta = blanksMetaRef.current;

    for (let i = 0; i < nToSolve; i += 1) {
      const userValue = values[i] || "";
      // Only assess blanks the student actually filled in; leave empties unmarked.
      if (userValue.trim() === "") continue;
      const expected = blanksMeta[i]?.expected || "";
      checkedResults[i] = isAnswerCorrect(userValue, expected);
      diffResults[i] = highlightTextDiff(
        normalizeAnswer(userValue),
        normalizeAnswer(expected),
        () => {},
        false,
      );
    }

    dispatch({
      ...commitCheck(checkedResults),
      diffResults,
    });
  };

  const handleShowAnswers = () => {
    const values = {};
    const checkedResults = {};
    const diffResults = {};
    const nToSolve = nToSolveRef.current;
    const blanksMeta = blanksMetaRef.current;

    for (let i = 0; i < nToSolve; i += 1) {
      values[i] = blanksMeta[i]?.expected || "";
      checkedResults[i] = true;
      diffResults[i] = highlightTextDiff(
        blanksMeta[i]?.expected || "",
        blanksMeta[i]?.expected || "",
        () => {},
        false,
      );
    }

    dispatch({
      values,
      ...commitCheck(checkedResults),
      diffResults,
    });
  };

  const handleReset = () => {
    AudioManager.stopAll();
    dispatch({
      ...getInitialScoringState(),
      activeRowIndex: -1,
      diffResults: {},
      masterPlayState: "stopped",
      rowAudioStatus: {},
      rowProgress: {},
      values: {},
    });
  };

  const setAudioTriggerRef = (rowIndex, node) => {
    if (!node) {
      delete rowAudioRefs.current[rowIndex];
      return;
    }

    rowAudioRefs.current[rowIndex] = node;
  };

  const handlePromptAudioClick = (rowIndex, playlistIndex, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (playlistIndex !== undefined) {
      if (state.activeRowIndex === rowIndex) {
        sequenceRef.current?.toggle();
        return;
      }

      sequenceRef.current?.playItem(playlistIndex, {
        playSequence: false,
      });
      return;
    }

    const rowAudioHost = rowAudioRefs.current[rowIndex];
    const buttonEl = rowAudioHost?.querySelector("button.audio-container, button.audio-link");
    if (!buttonEl) return;
    buttonEl.click();
  };

  const handleRowAudioStatusChange = (rowIndex, nextStatus) => {
    dispatch((prevState) => ({
      rowAudioStatus: {
        ...prevState.rowAudioStatus,
        [rowIndex]: nextStatus,
      },
    }));
  };

  const handleMasterPlayStateChange = (nextState) => {
    dispatch({
      masterPlayState: nextState,
    });
  };

  const handleMasterTrackChange = (playlistIndex, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex;
    if (rowIndex === undefined) return;
    dispatch({
      activeRowIndex: rowIndex,
    });
  };

  const handleMasterStopped = (playlistIndex, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex;
    if (rowIndex === undefined) return;
    dispatch((prevState) => ({
      activeRowIndex: prevState.activeRowIndex === rowIndex ? -1 : prevState.activeRowIndex,
    }));
  };

  const handleMasterTime = (playlistIndex, clipTime, clipDuration, playlist) => {
    const rowIndex = playlist[playlistIndex]?.rowIndex;
    if (rowIndex === undefined) return;

    dispatch((prevState) => ({
      rowProgress: {
        ...prevState.rowProgress,
        [rowIndex]: {
          currentTime: clipTime,
          duration: clipDuration,
        },
      },
    }));
  };

  const renderInlineInput = (blankIndex) => {
    const { checkedResults = {}, diffResults = {}, hasChecked = false, id = "", values = {} } = state;
    const meta = blanksMetaRef.current[blankIndex];
    if (!meta) return null;

    const value = values[blankIndex] ?? "";
    const result = checkedResults[blankIndex];
    const diffHtml = diffResults[blankIndex];
    let stateClassName = "border-border text-foreground";

    if (hasChecked && result === true) {
      stateClassName = "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_16%,transparent)] text-foreground";
    } else if (hasChecked && result === false) {
      stateClassName = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-foreground";
    } else if (value.trim() !== "") {
      stateClassName = "border-[var(--ex-neutral)] bg-[color-mix(in_oklab,var(--ex-neutral)_10%,transparent)] text-foreground";
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
          onChange={(event) => handleInputChange(blankIndex, event.target.value)}
          onKeyDown={(event) => handleInputKeyDown(event, blankIndex)}
          placeholder="Type your answer"
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

  const renderSentence = (segments) => {
    const rendered = [];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type === "input") {
        rendered.push(
          <Fragment key={segment.key}>
            {renderInlineInput(segment.blankIndex)}
          </Fragment>
        );
        const meta = blanksMetaRef.current[segment.blankIndex];
        if (meta?.placeholder) {
          const next = segments[i + 1];
          if (next?.type === "text") {
            rendered.push(<Fragment key={next.key}>{next.value}</Fragment>);
            i++;
          }
          rendered.push(
            <em key={`hint-${segment.blankIndex}`} className="text-muted-foreground whitespace-nowrap text-sm"> ({meta.placeholder})</em>
          );
        }
      } else {
        rendered.push(<Fragment key={segment.key}>{segment.value}</Fragment>);
      }
    }
    return rendered;
  };

  const {
    cheatText = "Show answers",
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
  } = state;

  // Render-derived: rebuilt every render, mirrored into refs for handlers.
  const blanksMeta = [];
  blanksMetaRef.current = blanksMeta;

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

    const { nextBlankIndex, segments } = parseSentence(phraseText, {
      startBlankIndex: blankCursor,
      blanksMeta,
      parseBlank: parseInputBlank,
    });
    const rowBlankIndices = segments
      .filter((segment) => segment.type === "input")
      .map((segment) => segment.blankIndex);
    const rowWidthCh = Math.max(
      18,
      ...rowBlankIndices.map((blankIndex) => blanksMeta[blankIndex]?.widthCh || 0),
    );
    rowBlankIndices.forEach((blankIndex) => {
      if (blanksMeta[blankIndex]) {
        blanksMeta[blankIndex].widthCh = rowWidthCh;
      }
    });
    blankCursor = nextBlankIndex;

    const rowHasResult =
				state.hasChecked &&
				rowBlankIndices.length > 0 &&
				rowBlankIndices.every((idx) => typeof state.checkedResults[idx] === "boolean");
    const rowIsCorrect = rowHasResult && rowBlankIndices.every((idx) => state.checkedResults[idx] === true);
    const playlistIndex = rowToPlaylistIndex[i];
    const useMasterRowAudio = useSequenceAudioController && playlistIndex !== undefined;
    const isActive = state.activeRowIndex === i;
    const status = isActive
      ? (state.masterPlayState === "playing" ? "playing" : "stopped")
      : "stopped";
    const prog = state.rowProgress[i] || { currentTime: 0, duration: 0 };
    const promptText = decodeHtmlEntities(item?.prompt || "");

    rows.push(
      <div
        className={`rounded-xl border border-border/70 bg-card/60 p-3 shadow-sm md:p-4 ${
          isActive ? "text-[var(--edu-affirm)]" : ""
        }`}
        key={`inline-typed-gap-row-${id}-${i}`}
      >
        <div className="flex items-start gap-3">
          {item?.audio ? (
            <span
              className="shrink-0 pt-0.5"
              ref={(node) => setAudioTriggerRef(i, node)}
            >
              {useMasterRowAudio ? (
                <CircularAudioProgressAnimatedSpeakerDisplay
                  className="super-compact-speaker shrink-0"
                  duration={prog.duration}
                  handleClick={(event) => handlePromptAudioClick(i, playlistIndex, event)}
                  progress={prog.currentTime}
                  status={status}
                  title={isActive ? "Click to pause" : "Click to play"}
                />
              ) : (
                <AudioClip
                  className="super-compact-speaker shrink-0"
                  id={`inlineTypedGapRowAudio-${i}`}
                  onStatusChange={(nextStatus) => handleRowAudioStatusChange(i, nextStatus)}
                  soundFile={resolveAsset(item.audio)}
                />
              )}
            </span>
          ) : null}

          <div className="min-w-0 flex-1">
            {promptText ? (
              item?.audio ? (
                <button
                  className={`m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm leading-[var(--line-height-app)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base ${
                    isActive || rowAudioStatus[i] === "playing"
                      ? "text-[var(--edu-affirm)]"
                      : "text-foreground hover:text-[var(--edu-affirm)]"
                  }`}
                  onClick={(event) => handlePromptAudioClick(i, playlistIndex, event)}
                  type="button"
                >
                  {promptText}
                </button>
              ) : (
                <p className="m-0 text-sm leading-[var(--line-height-app)] text-foreground md:text-base">
                  {promptText}
                </p>
              )
            ) : null}

            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-x-3">
              <div className="min-w-0 text-sm leading-[var(--line-height-app)] text-foreground md:text-base">
                {renderSentence(segments)}
              </div>
              <span
                aria-hidden="true"
                className={`inline-flex min-h-10 w-11 items-center justify-center ${
                  rowHasResult ? (rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]") : "invisible"
                }`}
              >
                {<ResultIcon isCorrect={rowIsCorrect} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  nToSolveRef.current = blankCursor;
  const nToSolve = blankCursor;
  const hasAnyAttempt = Object.keys(values).some((key) => `${values[key]}`.trim() !== "");
  const hasAnyIncorrect = state.hasChecked && nCorrect < nToSolve;

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

      <div className="space-y-3">{rows}</div>

      <div className="exercise-divider" data-orientation="horizontal" role="none" />
      <ProgressDots correct={nCorrect} total={nToSolve} />
      <div className="exercise-divider" data-orientation="horizontal" role="none" />

      <ExerciseFooter
        onCheck={handleCheckAnswers}
        onReset={handleReset}
        onShowAnswers={handleShowAnswers}
        showAnswers={hasAnyIncorrect}
        showAnswersLabel={cheatText}
        showReset={hasAnyAttempt || state.hasChecked}
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
