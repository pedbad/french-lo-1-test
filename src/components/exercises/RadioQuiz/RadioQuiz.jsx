import { ProgressDots } from "@/components/exercises/ProgressDots";
import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { AudioClip, IconButton } from "@/components/media";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { resolveAsset } from "@/utils/assets";
import DOMPurify from "dompurify";
import { ResultIcon } from "@/components/exercises/shared/ResultIcon";
import { useEffect, useReducer, useRef } from "react";

const getResetState = (phrases = []) => ({
  checkedResults: {},
  hasChecked: false,
  nCorrect: 0,
  selectedOptions: Array.from({ length: phrases.length }, () => null),
  showExplanation: {},
});

// Merge reducer: each dispatch is a partial state patch (5 interdependent
// fields, so useReducer over many useState calls per the migration plan).
const reducer = (state, patch) => ({ ...state, ...patch });

export function RadioQuiz({ config = {}, onComplete = () => {}, onReset = () => {} }) {
  const {
    cheatText = "Show answer",
    htmlContent,
    id = "",
    listenDescriptionText,
    options = [],
    phrases = [],
    soundFile,
    useSequenceAudioController = false,
  } = config;

  const [state, dispatch] = useReducer(reducer, phrases, getResetState);
  const { checkedResults, hasChecked, nCorrect, selectedOptions, showExplanation } = state;

  // Config-identity reset (was componentDidUpdate). Key-based remount is the
  // Phase 6 consolidation; the ref compare keeps the mount-time effect a no-op.
  const prevConfigRef = useRef(config);
  useEffect(() => {
    if (prevConfigRef.current !== config) {
      prevConfigRef.current = config;
      dispatch(getResetState(config.phrases));
    }
  }, [config]);

  const handleChoiceChange = (rowNum, optionIndex) => {
    const nextSelectedOptions = [...(selectedOptions || [])];
    nextSelectedOptions[rowNum] = optionIndex;

    if (!hasChecked) {
      dispatch({ selectedOptions: nextSelectedOptions });
      return;
    }

    const nextCheckedResults = { ...checkedResults };
    delete nextCheckedResults[rowNum];

    const nextShowExplanation = { ...showExplanation };
    delete nextShowExplanation[rowNum];

    dispatch({
      checkedResults: nextCheckedResults,
      hasChecked: true,
      nCorrect: Object.values(nextCheckedResults).filter(Boolean).length,
      selectedOptions: nextSelectedOptions,
      showExplanation: nextShowExplanation,
    });
  };

  const handleCheckAnswers = () => {
    const nextCheckedResults = {};
    const nextShowExplanation = {};

    for (let i = 0; i < phrases.length; i += 1) {
      const answerIndex = phrases[i][1];
      const selectedOption = selectedOptions[i];
      if (selectedOption === null || selectedOption === undefined) {
        continue;
      }

      const isCorrect = selectedOption === answerIndex;
      nextCheckedResults[i] = isCorrect;
      if (!isCorrect && phrases[i][2]) {
        nextShowExplanation[i] = true;
      }
    }

    const nextNCorrect = Object.values(nextCheckedResults).filter(Boolean).length;
    const allCorrect = phrases.length > 0 && nextNCorrect === phrases.length;

    dispatch({
      checkedResults: nextCheckedResults,
      hasChecked: true,
      nCorrect: nextNCorrect,
      showExplanation: nextShowExplanation,
    });

    if (allCorrect) {
      onComplete();
    }
  };

  const handleReset = () => {
    dispatch(getResetState(phrases));
    onReset();
  };

  const handleShowAnswers = () => {
    const nextCheckedResults = {};
    for (let i = 0; i < phrases.length; i += 1) {
      nextCheckedResults[i] = true;
    }

    dispatch({
      checkedResults: nextCheckedResults,
      hasChecked: true,
      nCorrect: phrases.length,
      selectedOptions: phrases.map((phrase) => phrase[1]),
      showExplanation: {},
    });

    onComplete();
  };

  const rows = phrases.map((phraseRow, rowIndex) => {
    const phrase = phraseRow[0];
    const answerIndex = phraseRow[1];
    const explanation = phraseRow[2];
    const soundFile = phraseRow[3];
    const selectedOption = selectedOptions[rowIndex];
    const rowResult = checkedResults[rowIndex];
    const rowHasResult = typeof rowResult === "boolean";
    const rowIsCorrect = rowHasResult && rowResult === true;

    return (
      <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-sm" key={`radio-${id}-${rowIndex}`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1 text-left">
            {/* p→div: each quiz statement is a short <p> that WAVE flags as "possible heading" */}
            <div className="m-0 text-base leading-[var(--line-height-body)] text-foreground">{phrase}</div>
            {showExplanation[rowIndex] && explanation ? (
              <div className="mt-2 text-sm leading-[var(--line-height-body)] text-muted-foreground">{explanation}</div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:max-w-[42%] xl:justify-end">
            <div
              aria-label={`Choose whether statement ${rowIndex + 1} is true or false`}
              className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-sm"
              role="radiogroup"
            >
              {options.map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex;
                const isCorrectSelection = rowHasResult && isSelected && optionIndex === answerIndex;
                const isIncorrectSelection = rowHasResult && isSelected && optionIndex !== answerIndex;
                const baseClasses = "inline-flex min-h-8 items-center rounded-lg border px-2.5 py-1 text-sm leading-[var(--line-height-app)] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out select-none";
                let stateClasses = "border-border/70 bg-background text-foreground hover:-translate-y-[1px] hover:border-[var(--ex-neutral)] hover:bg-[color-mix(in_oklab,var(--ex-neutral)_10%,transparent)] hover:shadow-[0_2px_8px_color-mix(in_oklab,var(--ex-neutral)_14%,transparent)]";

                if (isCorrectSelection) {
                  stateClasses = "border-[var(--edu-affirm)] bg-[color-mix(in_oklab,var(--edu-affirm)_20%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--edu-affirm)_35%,transparent)]";
                } else if (isIncorrectSelection) {
                  stateClasses = "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_30%,transparent)]";
                } else if (isSelected) {
                  stateClasses = "border-[color-mix(in_oklab,var(--ex-revealed)_58%,var(--border))] bg-[color-mix(in_oklab,var(--ex-revealed)_26%,transparent)] text-foreground font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ex-revealed)_34%,transparent)]";
                }

                return (
                  <button
                    aria-checked={isSelected}
                    className={`${baseClasses} ${stateClasses} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2`}
                    key={`radio-choice-${id}-${rowIndex}-${optionIndex}`}
                    onClick={() => handleChoiceChange(rowIndex, optionIndex)}
                    role="radio"
                    tabIndex={isSelected || (selectedOption === null && optionIndex === 0) ? 0 : -1}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {soundFile ? (
              <div className="shrink-0">
                <AudioClip className="super-compact" soundFile={soundFile} />
              </div>
            ) : null}
            <span
              aria-hidden="true"
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center ${rowIsCorrect ? "text-[var(--edu-affirm)]" : "text-[var(--destructive)]"}`}
              style={{ visibility: rowHasResult ? "visible" : "hidden" }}
            >
              {<ResultIcon isCorrect={rowIsCorrect} />}
            </span>
          </div>
        </div>
      </div>
    );
  });

  const hasSelections = selectedOptions.some((value) => value !== null && value !== undefined);
  const hasAnyIncorrect = hasChecked && nCorrect < phrases.length;

  return (
    <div className="radio-quiz-container container w-full max-w-none px-0" id={id || undefined} key={`${id}PhraseTable`}>
      {htmlContent ? <div className="html-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

      {listenDescriptionText && soundFile ? (
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
      <ProgressDots correct={nCorrect} total={phrases.length} />
      <div className="exercise-divider" data-orientation="horizontal" role="none" />

      <ExerciseFooter
        onCheck={handleCheckAnswers}
        onReset={handleReset}
        onShowAnswers={handleShowAnswers}
        showAnswers={hasAnyIncorrect}
        showAnswersLabel={cheatText}
        showReset={hasSelections || hasChecked}
      />
    </div>
  );
}
