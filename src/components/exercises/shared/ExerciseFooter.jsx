import { IconButton } from "@/components/media";
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";

/**
 * Shared action-button footer used by all standard exercises.
 *
 * Renders up to three buttons in the canonical order:
 *   [Show Answers]  [Reset]  [Check answers]
 *
 * Visibility is controlled by the progressive/visible CSS pattern:
 * - Show Answers and Reset use `progressive: true` (hidden-help class) so they
 *   fade in smoothly when their visible condition becomes true.
 * - Check answers is always visible (progressive: false) since it is the primary
 *   call-to-action and should never be hidden.
 *
 * Props:
 *   onShowAnswers      — handler; required
 *   showAnswers        — boolean visibility condition for Show Answers button
 *   showAnswersLabel   — button label; defaults to "Show answers"
 *
 *   onReset            — handler; required
 *   showReset          — boolean visibility condition for Reset button
 *
 *   onCheck            — handler; omit (undefined) to hide the Check button entirely
 *                        (used by MemoryMatchGame which is self-marking)
 *   checkDisabled      — disables Check button while the exercise is incomplete
 *   checkLabel         — button label; defaults to "Check answers"
 *
 *   hints              — optional React node rendered above the button row
 *                        (used by DraggableFillGaps for its hints toggle)
 */
export function ExerciseFooter({
  checkDisabled = false,
  checkLabel = "Check answers",
  hints = null,
  onCheck,
  onReset,
  onShowAnswers,
  showAnswers = false,
  showAnswersLabel = "Show answers",
  showReset = false,
}) {
  return (
    <div className="exercise-help exercise-help-wrap">
      {hints}
      <div className="exercise-help-actions">
        <IconButton
          ariaLabel={showAnswersLabel}
          className={exerciseActionButtonVariants({
            progressive: true,
            tone: "warn",
            visible: showAnswers,
          })}
          onClick={onShowAnswers}
          theme="eye"
        >
          <span className="exercise-icon-button-label">{showAnswersLabel}</span>
        </IconButton>

        <IconButton
          ariaLabel="Reset"
          className={exerciseActionButtonVariants({
            progressive: true,
            tone: "neutral",
            visible: showReset,
          })}
          onClick={onReset}
          theme="reset"
        >
          <span className="exercise-icon-button-label">Reset</span>
        </IconButton>

        {onCheck !== null && onCheck !== undefined && (
          <IconButton
            ariaLabel={checkLabel}
            className={exerciseActionButtonVariants({
              align: "right",
              progressive: false,
              tone: "primary",
              visible: true,
            })}
            disabled={checkDisabled}
            onClick={onCheck}
            theme="check"
          >
            <span className="exercise-icon-button-label">{checkLabel}</span>
          </IconButton>
        )}
      </div>
    </div>
  );
}
