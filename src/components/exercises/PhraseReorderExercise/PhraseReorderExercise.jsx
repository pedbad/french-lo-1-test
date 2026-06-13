// PhraseReorderExercise.jsx
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { Info } from "@/components/content";
import { AudioClip, IconButton } from "@/components/media";
import { SortableWordCard } from "@/components/exercises/SortableWordCard/SortableWordCard";
import { captureFlipPositions, playFlipAnimation } from "@/utils/reorderAnimation";
import { shuffleArray } from "@/utils/collections";
import { useLayoutEffect, useReducer, useRef } from "react";

// Map config.phrases -> [{ lang2, id }], shuffled unless shuffleOnLoad === false.
// Pure module fn (was the getInitialLang2 instance method). Used by the lazy
// init seed, reset, AND the config-identity reset effect.
const getInitialLang2 = (config) => {
  if (!config || !config.phrases) return [];

  // phrases: [ [foreignLanguage, lang2, audio], ... ]
  const lang2Items = config.phrases.map((phrase, index) => {
    if (Array.isArray(phrase)) {
      return {
        lang2: phrase[1],
        id: String(index), // used for correctness
      };
    }
    // fallback if you move to object form
    return {
      lang2: phrase.lang2,
      id: String(index),
    };
  });

  // Default: shuffle unless explicitly disabled
  const shouldShuffle =
    config.shuffleOnLoad === undefined ? true : !!config.shuffleOnLoad;

  if (shouldShuffle) {
    shuffleArray(lang2Items);
  }

  return lang2Items;
};

// Swap two items by id. Returns null on a no-op (was the swapById instance
// method); handlers treat null as "no reorder".
const swapById = (items, draggingId, targetId) => {
  const fromIndex = items.findIndex((item) => item.id === draggingId);
  const toIndex = items.findIndex((item) => item.id === targetId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
  const next = [...items];
  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
  return next;
};

// Lazy-init seed for useReducer + the config-identity reset effect (was the
// constructor state and the componentDidUpdate config-reset branch — identical
// shape, all 10 fields).
const getInitialState = (config = {}) => ({
  checkedCorrectCount: 0,
  draggingId: null,
  dropTargetId: null,
  failCount: 0,
  hasReordered: false,
  hasSubmittedCheck: false,
  lang2Items: getInitialLang2(config),
  lastResult: null,
  rowStatuses: new Array(
    config && config.phrases ? config.phrases.length : 0
  ).fill(null), // "correct" | "incorrect" | null
  usedShowAnswer: false,
});

// Merge reducer: each dispatch is a partial state patch. A function patch
// receives the latest state (prev-state handlers). A patch resolving to
// null/undefined is a no-op: the reducer returns the SAME state reference so
// useReducer bails out of the re-render.
const reducer = (state, patch) => {
  const update = typeof patch === "function" ? patch(state) : patch;
  return update ? { ...state, ...update } : state;
};

export function PhraseReorderExercise({ config = {}, suppressInfo = false }) {
  const [state, dispatch] = useReducer(reducer, config, getInitialState);
  const {
    checkedCorrectCount,
    draggingId,
    dropTargetId,
    failCount,
    hasReordered,
    hasSubmittedCheck,
    lang2Items,
    usedShowAnswer,
  } = state;

  // DOM refs for FLIP geometry (was this.cardRefs = new Map()).
  const cardRefs = useRef(null);
  if (cardRefs.current === null) cardRefs.current = new Map();

  // Touch-pointer drag tracking (was this.pointerId).
  const pointerId = useRef(null);

  // FLIP positions + per-handler options captured in a handler, played after
  // the lang2Items reorder commits — equivalent to the old setState(callback)
  // timing. ONLY reset + autoSolve stash here; drop/pointerUp reorder without
  // stashing, so the effect sees null and bails (no FLIP), matching the class
  // (those handlers had no setState callback).
  const pendingFlipRef = useRef(null);

  useLayoutEffect(() => {
    if (!pendingFlipRef.current) return;
    const { before, options } = pendingFlipRef.current;
    pendingFlipRef.current = null;
    playFlipAnimation({
      before,
      getElement: (id) => cardRefs.current.get(id),
      ids: lang2Items.map((item) => item.id),
      ...options,
    });
  }, [lang2Items]);

  const setCardRef = (itemId, element) => {
    if (itemId === undefined || itemId === null) return;
    if (element) cardRefs.current.set(itemId, element);
    else cardRefs.current.delete(itemId);
  };

  /* ----------------------------- Touch / pointer reorder ----------------------------- */

  const handlePointerDown = (index) => (e) => {
    // Only activate for touch/pen (leave mouse to native DnD)
    if (e.pointerType === "mouse") return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    pointerId.current = e.pointerId;

    const nextDraggingId = lang2Items[index]?.id ?? null;
    dispatch({
      draggingId: nextDraggingId,
      dropTargetId: null,
      lastResult: null,
      hasSubmittedCheck: false,
      rowStatuses: state.rowStatuses.map(() => null),
    });
  };

  const handlePointerMove = (e) => {
    if (pointerId.current !== e.pointerId) return;
    if (!draggingId) return;

    // Find which sortable tile we're currently over
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const tile = el?.closest?.("[data-sortable-tile='1']");
    const targetId = tile?.getAttribute?.("data-item-id") ?? null;
    dispatch((prev) => ({
      dropTargetId: targetId && targetId !== prev.draggingId ? targetId : null,
    }));
  };

  const handlePointerUp = (e) => {
    if (pointerId.current !== e.pointerId) return;

    pointerId.current = null;
    dispatch((prev) => {
      const next = prev.draggingId && prev.dropTargetId
        ? swapById(prev.lang2Items, prev.draggingId, prev.dropTargetId)
        : null;
      if (!next) return { draggingId: null, dropTargetId: null };
      return {
        checkedCorrectCount: 0,
        draggingId: null,
        dropTargetId: null,
        hasReordered: true,
        hasSubmittedCheck: false,
        lang2Items: next,
      };
    });
  };

  /* ----------------------------- Drag & drop (lang2 only) ----------------------------- */

  const handleDragStart = (id) => (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);

    dispatch({
      draggingId: id,
      dropTargetId: null,
      lastResult: null,
      hasSubmittedCheck: false,
      rowStatuses: state.rowStatuses.map(() => null),
    });
  };

  const handleDragEnter = (targetId) => (event) => {
    event.preventDefault();
    dispatch((prev) => ({
      dropTargetId: prev.draggingId && prev.draggingId !== targetId ? targetId : null,
    }));
  };

  const handleDragOver = (event) => {
    // Required so that drop/enter events behave as expected
    event.preventDefault();
  };

  const handleDrop = (targetId) => (event) => {
    event.preventDefault();
    dispatch((prev) => {
      const next = prev.draggingId && targetId
        ? swapById(prev.lang2Items, prev.draggingId, targetId)
        : null;
      if (!next) return { draggingId: null, dropTargetId: null };
      return {
        checkedCorrectCount: 0,
        draggingId: null,
        dropTargetId: null,
        hasReordered: true,
        hasSubmittedCheck: false,
        lang2Items: next,
      };
    });
  };

  const handleDragEnd = () => {
    dispatch({ draggingId: null, dropTargetId: null });
  };

  /* -------------------------------- Controls -------------------------------- */

  const reset = () => {
    const phrasesLen =
      config && config.phrases ? config.phrases.length : 0;
    const idsBefore = lang2Items.map((item) => item.id);
    const before = captureFlipPositions(idsBefore, (id) => cardRefs.current.get(id));

    pendingFlipRef.current = {
      before,
      options: { duration: 460, fromOpacity: 0.96, stagger: 22, toOpacity: 1 },
    };
    dispatch({
      checkedCorrectCount: 0,
      draggingId: null,
      dropTargetId: null,
      failCount: 0,
      hasReordered: false,
      hasSubmittedCheck: false,
      lang2Items: getInitialLang2(config),
      lastResult: null,
      rowStatuses: new Array(phrasesLen).fill(null),
      usedShowAnswer: false,
    });
  };

  const checkAnswer = () => {
    if (!config || !config.phrases) return;

    const expectedIds = config.phrases.map((_, index) => String(index));

    const rowStatuses = lang2Items.map((item, index) =>
      item.id === expectedIds[index] ? "correct" : "incorrect"
    );

    const isAllCorrect = rowStatuses.every((status) => status === "correct");
    const correctCount = rowStatuses.filter((status) => status === "correct").length;

    dispatch((prev) => ({
      checkedCorrectCount: correctCount,
      failCount: isAllCorrect ? prev.failCount : prev.failCount + 1,
      hasSubmittedCheck: true,
      lastResult: isAllCorrect ? "correct" : "incorrect",
      rowStatuses,
    }));
  };

  const autoSolve = () => {
    if (!config || !config.phrases) return;
    const idsBefore = lang2Items.map((item) => item.id);
    const before = captureFlipPositions(idsBefore, (id) => cardRefs.current.get(id));
    const nextItems = config.phrases.map((phrase, index) => {
      if (Array.isArray(phrase)) {
        return {
          id: String(index),
          lang2: phrase[1],
        };
      }
      return {
        id: String(index),
        lang2: phrase.lang2,
      };
    });
    pendingFlipRef.current = { before, options: { duration: 460 } };
    dispatch({
      checkedCorrectCount: config.phrases.length,
      draggingId: null,
      dropTargetId: null,
      hasReordered: true,
      hasSubmittedCheck: true,
      lang2Items: nextItems,
      lastResult: "correct",
      rowStatuses: new Array(config.phrases.length).fill("correct"),
      usedShowAnswer: true,
    });
  };

  /* ---------------------------------- Render ---------------------------------- */

  const { cheatText = "Show answer" } = config;

  if (!config || !config.phrases) {
    return <div>No configuration provided for PhraseReorderExercise.</div>;
  }

  const prompt = config.informationText || "";

  const {
    phrases, id,
    informationText,
    informationTextHTML
  } = config;

  let allLang1Blank = true;
  phrases.forEach((phrase) => {
    if (phrase[0] !== "") allLang1Blank = false;
  });

  const expectedIds = phrases.map((_, index) => String(index));
  const liveCorrectCount = lang2Items.reduce((count, item, index) => (
    item.id === expectedIds[index] ? count + 1 : count
  ), 0);
  const correctCount = hasSubmittedCheck ? checkedCorrectCount : 0;
  const total = phrases.length;
  const isComplete = total > 0 && liveCorrectCount === total;
  const showReveal = failCount >= 2 || usedShowAnswer;
  const showReset = hasReordered || failCount >= 1 || isComplete || usedShowAnswer;

  return (
    <div className="w-full sortable space-y-4 [&>svg]:h-6 [&>svg]:w-6">
      {prompt ? <p className="text-sm">{prompt}</p> : null}

      <div className="space-y-3">
        {!suppressInfo && (informationText || informationTextHTML) ? (
          <Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML} />
        ) : null}
        <div className="mx-auto mt-2 w-[80%]">
          {phrases.map((phrase, index) => {
            let foreignLanguage = "";
            let audio = null;

            if (Array.isArray(phrase)) {
              // [foreignLanguage, lang2, audio]
              [foreignLanguage, , audio] = phrase;
            } else {
              foreignLanguage = phrase.original;
              ({ audio } = phrase);
            }

            const lang2Item = lang2Items[index];
            const isDragging =
              lang2Item &&
              lang2Item.id === draggingId;

            return (
              <div
                key={index}
                className={`grid ${allLang1Blank ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]" } gap-3 items-center py-1`}
              >
                {/* LEFT: Audio */}
                <div className="flex items-center justify-center pr-2">
                  {audio && (
                    <AudioClip className={`super-compact-speaker`} soundFile={audio} />
                  )}
                </div>

                {/* MIDDLE: lang1 phrase */}
                {allLang1Blank ? null : <div className="flex items-center text-sm">
                  <span>{foreignLanguage}</span>
                </div>}

                {/* RIGHT: Sortable lang2 phrase + tick/cross */}
                <SortableWordCard
                  className="cursor-ns-resize touch-none"
                  data-sortable-tile="1"
                  data-index={index}
                  data-item-id={lang2Item?.id || ""}
                  data-dragging={isDragging ? "true" : undefined}
                  direction="vertical"
                  /* Desktop HTML5 drag */
                  draggable
                  isDragging={isDragging}
                  isDropTarget={dropTargetId === lang2Item?.id && !isDragging}
                  label={lang2Item ? lang2Item.lang2 : ""}
                  ref={(element) => setCardRef(lang2Item?.id, element)}
                  onDragStart={
                    lang2Item
                      ? handleDragStart(lang2Item.id)
                      : undefined
                  }
                  onDragEnter={
                    lang2Item
                      ? handleDragEnter(lang2Item.id)
                      : undefined
                  }
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(lang2Item?.id)}
                  onDragEnd={handleDragEnd}

                  /* Mobile / touch: pointer-driven reorder */
                  onPointerDown={handlePointerDown(index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  showIndex
                  slotLabel={index + 1}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="exercise-divider" role="none" data-orientation="horizontal" />
        <ProgressDots correct={correctCount} total={total} />
        <div className="exercise-divider" role="none" data-orientation="horizontal" />
      </div>

      <div className="exercise-actions-row">
        {showReveal ? (
          <IconButton
            ariaLabel={cheatText}
            className={exerciseActionButtonVariants({ tone: "warn" })}
            onClick={autoSolve}
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
            onClick={reset}
            theme="reset"
            variant="default"
          >
            <span className="exercise-icon-button-label">Reset</span>
          </IconButton>
        ) : null}
        <IconButton
          ariaLabel="Check answers"
          className={exerciseActionButtonVariants({ tone: "primary" })}
          theme="check"
          onClick={checkAnswer}
          variant="default"
        >
          <span className="exercise-icon-button-label">Check answers</span>
        </IconButton>
      </div>
    </div>
  );
}
