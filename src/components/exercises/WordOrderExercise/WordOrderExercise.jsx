import { IconButton } from "@/components/IconButton";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { SortableWordCard } from "@/components/exercises/SortableWordCard/SortableWordCard";
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { resolveAsset } from "@/utils/assets";
import { shuffleArray } from "@/utils/collections";
import { captureFlipPositions, playFlipAnimation } from "@/utils/reorderAnimation";
import { useLayoutEffect, useReducer, useRef } from "react";

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

// Lazy-init seed for useReducer (was the constructor's this.state).
const getInitialState = (config = {}) => {
  const { words = [] } = config;
  const expectedTokens = buildTokens(words);
  return {
    checkResult: null,
    draggingId: null,
    dropTargetId: null,
    expectedTokens,
    failedChecks: 0,
    hasReordered: false,
    usedShowAnswer: false,
    userTokens: shuffleArray([...expectedTokens]),
  };
};

// Merge reducer: each dispatch is a partial state patch (8 interdependent
// fields). A function patch receives the latest state (used by the prev-state
// handlers). A patch resolving to null/undefined is a no-op: the reducer
// returns the SAME state reference so useReducer bails out of the re-render.
const reducer = (state, patch) => {
  const update = typeof patch === "function" ? patch(state) : patch;
  return update ? { ...state, ...update } : state;
};

export function WordOrderExercise({ config = {} }) {
  const [state, dispatch] = useReducer(reducer, config, getInitialState);
  const {
    checkResult,
    draggingId,
    dropTargetId,
    failedChecks,
    hasReordered,
    userTokens,
    usedShowAnswer,
  } = state;

  // DOM refs for FLIP geometry (was this.cardRefs = new Map()).
  const cardRefs = useRef(null);
  if (cardRefs.current === null) cardRefs.current = new Map();

  // FLIP positions + per-handler options captured in a handler, played after
  // the userTokens reorder commits — equivalent to the old setState(callback)
  // timing (proven in MemoryMatchGame.jsx). useLayoutEffect measures the
  // committed DOM before paint.
  const pendingFlipRef = useRef(null);

  useLayoutEffect(() => {
    if (!pendingFlipRef.current) return;
    const { before, options } = pendingFlipRef.current;
    pendingFlipRef.current = null;
    playFlipAnimation({
      before,
      getElement: (id) => cardRefs.current.get(id),
      ids: userTokens.map((token) => token.id),
      ...options,
    });
  }, [userTokens]);

  const setCardRef = (tokenId, element) => {
    if (element) cardRefs.current.set(tokenId, element);
    else cardRefs.current.delete(tokenId);
  };

  const handleDragStart = (event, tokenId) => {
    // Keep drag semantics as "move" to avoid OS/browser copy (+) cursor.
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", tokenId);
    }
    dispatch({ draggingId: tokenId, checkResult: null });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (event?.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragEnter = (targetId) => {
    dispatch({ dropTargetId: targetId });
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    // Decide the reorder from committed state so the pending FLIP is stashed
    // only when userTokens actually changes (the layout effect keys on it).
    if (!draggingId || draggingId === targetId) {
      dispatch({ draggingId: null, dropTargetId: null });
      return;
    }
    const fromIndex = userTokens.findIndex((token) => token.id === draggingId);
    const toIndex = userTokens.findIndex((token) => token.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      dispatch({ draggingId: null, dropTargetId: null });
      return;
    }

    const idsBefore = userTokens.map((token) => token.id);
    const before = captureFlipPositions(idsBefore, (id) => cardRefs.current.get(id));
    pendingFlipRef.current = { before, options: { duration: 260 } };
    dispatch({
      hasReordered: true,
      draggingId: null,
      dropTargetId: null,
      userTokens: swap(userTokens, fromIndex, toIndex),
    });
  };

  const handleDragEnd = () => {
    dispatch({ draggingId: null, dropTargetId: null });
  };

  const handleCheckAnswers = () => {
    dispatch((prev) => {
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

  const handleReset = () => {
    const idsBefore = userTokens.map((token) => token.id);
    const before = captureFlipPositions(idsBefore, (id) => cardRefs.current.get(id));
    pendingFlipRef.current = {
      before,
      options: { duration: 460, fromOpacity: 0.96, stagger: 22, toOpacity: 1 },
    };
    dispatch((prev) => ({
      checkResult: null,
      draggingId: null,
      dropTargetId: null,
      failedChecks: 0,
      hasReordered: false,
      usedShowAnswer: false,
      userTokens: shuffleArray([...prev.expectedTokens]),
    }));
  };

  const handleShowAnswer = () => {
    const idsBefore = userTokens.map((token) => token.id);
    const before = captureFlipPositions(idsBefore, (id) => cardRefs.current.get(id));
    pendingFlipRef.current = { before, options: { duration: 460 } };
    dispatch((prev) => ({
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
    }));
  };

  const { cheatText = "Show answer", soundFile } = config;
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
                onDragEnd={handleDragEnd}
                onDragEnter={() => handleDragEnter(token.id)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, token.id)}
                onDragStart={(event) => handleDragStart(event, token.id)}
                ref={(element) => setCardRef(token.id, element)}
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
                  onDragEnd={handleDragEnd}
                  onDragEnter={() => handleDragEnter(token.id)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, token.id)}
                  onDragStart={(event) => handleDragStart(event, token.id)}
                  ref={(element) => setCardRef(token.id, element)}
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

      <div className="exercise-divider" role="none" data-orientation="horizontal" />
      <ProgressDots correct={correctCount} total={total} />
      <div className="exercise-divider" role="none" data-orientation="horizontal" />

      <div className="exercise-actions-row">
        {showReveal ? (
          <IconButton
            ariaLabel={cheatText}
            className={exerciseActionButtonVariants({ tone: "warn" })}
            onClick={handleShowAnswer}
            theme="eye"
            variant="default"
          >
            <span className="exercise-icon-button-label">{cheatText}</span>
          </IconButton>
        ) : null}
        {showReset ? (
          <IconButton
            ariaLabel="Reset"
            className={exerciseActionButtonVariants({ tone: "neutral" })}
            onClick={handleReset}
            theme="reset"
            variant="default"
          >
            <span className="exercise-icon-button-label">Reset</span>
          </IconButton>
        ) : null}
        <IconButton
          ariaLabel="Check answers"
          className={exerciseActionButtonVariants({ tone: "primary" })}
          disabled={!canCheck}
          onClick={handleCheckAnswers}
          theme="check"
          variant="default"
        >
          <span className="exercise-icon-button-label">Check answers</span>
        </IconButton>
      </div>
    </div>
  );
}
