import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { AudioClip } from "@/components/media";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import { Mars, Venus } from "lucide-react";
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { useEffect, useReducer, useRef } from "react";
import {
  resolveAsset,
} from "@/utils/assets";
import AudioManager from "@/audio/AudioManager";
import { normalizeForDictation } from "@/utils/answerNormalize";
import { highlightTextDiff } from "@/utils/exerciseDiff";

// Shared runtime for typed-response table exercises.
// Used by TypedTransformExercise and DictationExercise — both render a graded
// table: per-row Input + diff + shared ExerciseFooter (Check / Reset /
// Show answers) + ProgressDots.
//
// TODO(component-split): once TypedTransformExercise and DictationExercise
// have distinct scoring/normalization rules, move shared UI-only parts into a
// base renderer and keep separate behavior controllers.

// Merge reducer (carried Phase 5 pattern): supports function patches
// (setState(prev => …)) and bails out on null/undefined to preserve no-op
// state identity.
function reducer(state, patch) {
  const next = typeof patch === "function" ? patch(state) : patch;
  if (next === null || next === undefined) return state;
  return { ...state, ...next };
}

// Lazy init / full config-reset seed: spread config + clear check fields.
function getResetState(config) {
  return {
    ...config,
    checkedResults: {},
    diffResults: {},
    hasChecked: false,
    nCorrect: 0,
    values: {},
  };
}

// Field extraction (NOT grade-normalization): pull the bracketed answer out of
// phrases[i][1]. Kept inline per migration decision — trivial single capture.
function extractExpectedAnswer(value = "") {
  const match = `${value}`.match(/\[([^\]]+)\]/);
  if (!match) return "";
  return match[1].trim();
}

export function TextEntryExerciseRuntime({
  config,
  comparisonOptions = undefined,
  audioClipClassName = "compact",
  audioColumnPosition = "right",
}) {
  const [state, dispatch] = useReducer(reducer, config, getResetState);
  // DOM node map for prompt-audio click delegation (no audio state).
  const audioTriggerRefs = useRef({});
  const prevConfigRef = useRef(config);

  // Config-reset: full state reset when the config prop identity changes.
  // (Matches the class componentDidUpdate — does NOT clear audioTriggerRefs.)
  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      dispatch(getResetState(config));
    }
  }, [config]);

  const isAnswerCorrect = (userValue = "", expected = "") => {
    const { comparisonMode = "strict" } = comparisonOptions || {};

    if (comparisonMode === "dictation") {
      return normalizeForDictation(userValue) === normalizeForDictation(expected);
    }

    return `${userValue}`.trim() === `${expected}`.trim();
  };

  const handleInputChange = (index, userValue) => {
    dispatch((prevState) => {
      const values = {
        ...prevState.values,
        [index]: userValue,
      };

      if (!prevState.hasChecked) return { values };

      const checkedResults = {
        ...prevState.checkedResults,
      };
      delete checkedResults[index];

      return {
        values,
        checkedResults,
        diffResults: prevState.diffResults,
        nCorrect: Object.values(checkedResults).filter(Boolean).length,
      };
    });
  };

  const handleCheckAnswers = () => {
    const {
      phrases = [],
      values = {},
    } = state;

    const checkedResults = {};
    const diffResults = {};
    const nextValues = {
      ...values,
    };
    for (let i = 0; i < phrases.length; i += 1) {
      const expected = extractExpectedAnswer(phrases[i]?.[1] || "");
      if (!expected) continue;

      const userValue = values[i];
      if (userValue === undefined || userValue === null || `${userValue}`.trim() === "") continue;
      const trimmedUserValue = `${userValue}`.trim();
      nextValues[i] = trimmedUserValue;
      checkedResults[i] = isAnswerCorrect(trimmedUserValue, expected);
      diffResults[i] = highlightTextDiff(
        trimmedUserValue,
        expected,
        () => {},
        false,
        comparisonOptions || {}
      );
    }

    dispatch({
      checkedResults,
      diffResults,
      hasChecked: true,
      nCorrect: Object.values(checkedResults).filter(Boolean).length,
      values: nextValues,
    });
  };

  const handleInputKeyDown = (index, event) => {
    if (event.key !== "Enter" && event.key !== "NumpadEnter") return;
    // Enter advances to the next answer field instead of submitting the whole
    // exercise. (Submitting on Enter caused accidental early reveal of all answers.)
    event.preventDefault();
    const latestValue = event.currentTarget?.value ?? "";
    dispatch((prevState) => ({
      values: {
        ...prevState.values,
        [index]: latestValue,
      },
    }));
    const { compoundID = "" } = state;
    const nextInput = document.getElementById(`${compoundID}-answer-${index + 1}`);
    if (nextInput) {
      nextInput.focus();
    } else {
      event.currentTarget.blur();
    }
  };

  const handleShowAnswers = () => {
    const {
      phrases = [],
    } = state;

    const values = {};
    const checkedResults = {};
    const diffResults = {};
    for (let i = 0; i < phrases.length; i += 1) {
      const expected = extractExpectedAnswer(phrases[i]?.[1] || "");
      if (!expected) continue;
      values[i] = expected;
      checkedResults[i] = true;
      diffResults[i] = highlightTextDiff(
        expected,
        expected,
        () => {},
        false,
        comparisonOptions || {}
      );
    }

    dispatch({
      checkedResults,
      diffResults,
      hasChecked: true,
      nCorrect: Object.values(checkedResults).filter(Boolean).length,
      values,
    });
  };

  const handleReset = () => {
    AudioManager.stopAll();
    dispatch({
      checkedResults: {},
      diffResults: {},
      hasChecked: false,
      nCorrect: 0,
      values: {},
    });
  };

  const setAudioTriggerRef = (rowIndex, node) => {
    if (!node) {
      delete audioTriggerRefs.current[rowIndex];
      return;
    }

    audioTriggerRefs.current[rowIndex] = node;
  };

  const handlePromptAudioClick = (rowIndex, soundFile, event) => {
    event.preventDefault();
    event.stopPropagation();

    const triggerHost = audioTriggerRefs.current[rowIndex];
    const trigger = triggerHost?.querySelector(
      "button.audio-container, button.audio-link, .audio-container, .audio-link"
    );

    if (trigger instanceof HTMLElement) {
      trigger.click();
      return;
    }

    if (!soundFile) {
      return;
    }
  };

  const renderPromptText = (promptText, soundFile, rowIndex) => {
    if (!soundFile) {
      return promptText;
    }

    return (
      <button
        type="button"
        className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm leading-[var(--line-height-app)] text-foreground transition-colors duration-150 hover:text-[var(--edu-affirm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 md:text-base"
        onClick={(event) => handlePromptAudioClick(rowIndex, soundFile, event)}
      >
        {promptText}
      </button>
    );
  };

  const {
    checkedResults = {},
    compoundID,
    cheatText = "Show answers",
    diffResults = {},
    header,
    hasChecked = false,
    htmlContent,
    id = [],
    nCorrect = 0,
    phrases = [],
    values = {},
  } = state;
  const hasNonEmptyPromptColumn = phrases.some((phrase) => `${phrase?.[0] || ""}`.trim() !== "");
  const shouldInlineAudioWithPrompt = hasNonEmptyPromptColumn;

  const expectedByRow = phrases.map((phrase) => extractExpectedAnswer(phrase?.[1] || ""));
  const nPhrases = expectedByRow.filter(Boolean).length;

  let longestRow = 0;
  for (let i = 0; i < phrases.length; i += 1) {
    if (phrases[i].length > longestRow) longestRow = phrases[i].length;
  }

  const headerCells = [];
  if (header) {
    let headerOrder = header;
    if (shouldInlineAudioWithPrompt && header.length >= 2) {
      headerOrder = [header[0], header[1], ...header.slice(3)];
    }
    if (
      longestRow > 2 &&
				audioColumnPosition === "left" &&
				!shouldInlineAudioWithPrompt &&
				header.length >= 3
    ) {
      headerOrder = [header[2], header[0], header[1], ...header.slice(3)];
    }

    for (let i = 0; i < headerOrder.length; i += 1) {
      let headerLabel = headerOrder[i];
      if (shouldInlineAudioWithPrompt && i < 2) {
        const lowerLabel = `${headerOrder[i]}`.toLowerCase();
        if (lowerLabel.includes("mascul")) {
          headerLabel = (
            <span className="inline-flex items-center gap-1.5">
              <Mars aria-hidden="true" className="h-4 w-4" />
              <span>{headerOrder[i]}</span>
            </span>
          );
        } else if (lowerLabel.includes("fem")) {
          headerLabel = (
            <span className="inline-flex items-center gap-1.5">
              <Venus aria-hidden="true" className="h-4 w-4" />
              <span>{headerOrder[i]}</span>
            </span>
          );
        }
      }
      headerCells.push(<TableHead key={`header-cell-${i}`}>{headerLabel}</TableHead>);
    }
  }

  const rows = [];
  for (let i = 0; i < phrases.length; i += 1) {
    const phrase = phrases[i];
    const soundCellIndex = 2;
    const soundFile = longestRow > soundCellIndex ? resolveAsset(`${phrase[soundCellIndex]}`) : null;
    const cells = [];

    if (phrase[0] === "" && phrase.length === 1) {
      rows.push(
        <TableRow className="spacer" key={`row${i}`}>
          <TableCell colSpan={longestRow} key={`cell-of-row-${i}`} />
        </TableRow>
      );
      continue;
    }

    if (phrase[0] !== "") {
      const promptCellClassName = shouldInlineAudioWithPrompt ? "align-top w-[34%]" : "align-top";
      const promptContent = renderPromptText(phrase[0], soundFile, i);
      cells.push(
        <TableCell className={promptCellClassName} key={`row${i}cell0`}>
          {shouldInlineAudioWithPrompt && soundFile ? (
            <div className="inline-flex items-center gap-2">
              <span ref={(node) => setAudioTriggerRef(i, node)}>
                <AudioClip className={audioClipClassName} label="" soundFile={soundFile} />
              </span>
              {promptContent}
            </div>
          ) : (
            promptContent
          )}
        </TableCell>
      );
    }

    if (phrase[1] !== "") {
      const rowHasResult = hasChecked && Object.prototype.hasOwnProperty.call(checkedResults, i);
      const rowHasDiff = hasChecked && Object.prototype.hasOwnProperty.call(diffResults, i);
      const rowIsCorrect = rowHasResult && checkedResults[i] === true;
      const userValue = values[i] || "";

      const inputToneClass = rowHasResult
        ? (rowIsCorrect
          ? "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_16%,transparent)]"
          : "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]")
        : userValue
          ? "border-[var(--ex-neutral)] bg-[color-mix(in_oklab,var(--ex-neutral)_10%,transparent)]"
          : "border-border";
      const answerCellClassName = shouldInlineAudioWithPrompt ? "align-top w-[66%]" : "align-top";

      cells.push(
        <TableCell className={answerCellClassName} key={`row${i}cell1`}>
          <div className="space-y-1.5">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-2">
              <Input
                aria-label={`Item ${i + 1}: type your answer`}
                className={`min-h-10 text-sm md:text-base ${inputToneClass}`}
                id={`${compoundID}-answer-${i}`}
                onChange={(event) => handleInputChange(i, event.target.value)}
                onKeyDown={(event) => handleInputKeyDown(i, event)}
                placeholder="Type your answer"
                type="text"
                value={userValue}
              />
              <span
                aria-hidden="true"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center transition-opacity duration-200 ${rowHasResult ? "opacity-100" : "opacity-0"} ${rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]"}`}
              >
                {<ResultIcon isCorrect={rowIsCorrect} size="md" />}
              </span>
            </div>
            <div className="min-h-8">
              {rowHasDiff && diffResults[i] ? (
                <div
                  className="comparison-result compact"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(diffResults[i]) }}
                />
              ) : null}
            </div>
          </div>
        </TableCell>
      );
    }

    if (longestRow > 2 && !shouldInlineAudioWithPrompt && soundFile) {
      const audioCell = (
        <TableCell
          className="align-top w-14"
          key={`row${i}cell${soundCellIndex}`}
        >
          <div className="flex min-h-10 items-center">
            <span ref={(node) => setAudioTriggerRef(i, node)}>
              <AudioClip className={audioClipClassName} label="" soundFile={soundFile} />
            </span>
          </div>
        </TableCell>
      );

      if (audioColumnPosition === "left") {
        cells.unshift(audioCell);
      } else {
        cells.push(audioCell);
      }
    }

    rows.push(
      <TableRow key={`${compoundID}-row${i}`} visible-key={`${id}-row${i}`}>
        {cells}
      </TableRow>
    );
  }

  const hasAnyAttempt = Object.keys(values).some((key) => `${values[key]}`.trim() !== "");
  const hasAnyIncorrect = hasChecked && nCorrect < nPhrases;

  return (
    <div
      className="answer-table-container container"
      id={id || undefined}
      key={`${id}PhraseTable`}
    >
      {htmlContent ? <div className="html-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

      <Table className="table-fixed">
        {!header && (
        /* colgroup sets column widths for table-fixed independently of any header row */
          <colgroup>
            {longestRow > 2 && !shouldInlineAudioWithPrompt && <col style={{ width: "3.5rem" }} />}
            {hasNonEmptyPromptColumn && <col style={{ width: "34%" }} />}
            <col />
          </colgroup>
        )}
        {header ? (
          <TableHeader>
            <TableRow>{headerCells}</TableRow>
          </TableHeader>
        ) : (
        /* zero-height th row satisfies WAVE "layout table"; widths come from colgroup above */
          <TableHeader>
            <TableRow style={{ height: 0 }}>
              {longestRow > 2 && !shouldInlineAudioWithPrompt && (
                <TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Audio</TableHead>
              )}
              {hasNonEmptyPromptColumn && (
                <TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Prompt</TableHead>
              )}
              <TableHead scope="col" style={{ height: 0, padding: 0, overflow: "hidden", border: "none" }}>Answer</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>{rows}</TableBody>
      </Table>

      <div className="exercise-divider" data-orientation="horizontal" role="none" />
      <ProgressDots correct={nCorrect} total={nPhrases} />
      <div className="exercise-divider" data-orientation="horizontal" role="none" />
      <ExerciseFooter
        onCheck={handleCheckAnswers}
        onReset={handleReset}
        onShowAnswers={handleShowAnswers}
        showAnswers={hasAnyIncorrect}
        showAnswersLabel={cheatText}
        showReset={hasAnyAttempt || hasChecked}
      />
    </div>
  );
}
