import {
  AudioClip,
  CircularAudioProgressAnimatedSpeakerDisplay,
  SequenceAudioController,
} from "@/components/media";
import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { DraggableWordTile } from './DraggableWordTile';
import { ProgressDots } from "@/components/exercises/ProgressDots";
import { Info } from "@/components/content";
import { resolveAsset } from '@/utils/assets';
import { shuffleArray } from '@/utils/collections';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DOMPurify from "dompurify";
import { CircleAlert } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { useExerciseAudio } from "@/hooks/useExerciseAudio";

const BLANKS_TARGET_BOARD_TEXT_CLASS = "text-[length:calc(var(--font-size-sm)*1.2)] font-bold";
const BLANKS_TARGET_TABLE_TEXT_CLASS = "text-base";
const BLANKS_CONTENT_FLOW_CLASS = "leading-[var(--line-height-app)]";
const BLANKS_WORDS_CONTAINER_FLOW_CLASS = "leading-[calc(var(--font-size-sm)*0.5)] sm:leading-[calc(var(--font-size-sm)*3.5)]";
const BLANKS_PHRASE_ROWS_FLOW_CLASS = "leading-[calc(var(--font-size-sm)*2.6)]";
const BLANKS_DROP_TARGET_CLASS = "blanks-drop-slot";
const INVALID_DROP_HINT_DURATION_MS = 1800;

// Pure DOM helpers (were instance arrow methods; no instance state).
const getTileKey = (tileEl) => tileEl?.classList?.[0]; // "word{index}"
const getWordKeyFromEl = (el) => Array.from(el?.classList || []).find((c) => /^word\d+$/.test(c));
const isInteractiveElement = (target) =>
  target.closest(".sequence-audio-controller") ||
  target.closest("input") ||
  target.closest("button") ||
  target.closest("select") ||
  target.closest("textarea");

// Lazy-init seed (was the constructor). Builds wordTiles + nToPlace + words from
// the four blanksType config branches, then spreads config and the audio fields.
// `words` is copied (not the config ref) so the `phrases` branch push() does not
// mutate the incoming config — behaviour-identical because phrases configs carry
// no pre-existing words array.
const getInitialState = (config = {}) => {
  const { answers, blanksType, id, items, pictures, questions } = config;
  const words = Array.isArray(config.words) ? [...config.words] : [];

  let wordTiles = [];
  let nToPlace = 0;
  let mixer = [];

  switch (blanksType) {
    case 'phrases': {
      let wordTileIndex = 0;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const phraseSplit = item.text.match(/\[[^\]]+\]|\S+/g);
        for (let j = 0; j < phraseSplit.length; j++) {
          if (phraseSplit[j][0] === '[') {
            const cleaned = phraseSplit[j].replace('[', '').replace(']', '');
            wordTiles.push(
              <DraggableWordTile className={`blank draggable`} index={wordTileIndex} key={`${id}word${wordTileIndex + 1}`}>
                {cleaned}
              </DraggableWordTile>
            );
            wordTileIndex++;
            words.push(cleaned);
            nToPlace++;
          }
        }
      }
      wordTiles = shuffleArray(wordTiles);
      break;
    }
    case 'group-table': {
      nToPlace = words.length;
      for (let i = 0; i < nToPlace; i++) {
        wordTiles.push(
          <DraggableWordTile className={`blank draggable visiblekey-${id}word${i}`} index={i} key={`${id}word${i}`}>
            {words[i]}
          </DraggableWordTile>
        );
      }
      wordTiles = shuffleArray(wordTiles);
      break;
    }
    case 'table': {
      nToPlace = words.length;
      for (let i = 0; i < nToPlace; i++) {
        wordTiles.push(
          <DraggableWordTile className={`blank draggable`} index={i} key={`${id}word${i}`}>
            {words[i]}
          </DraggableWordTile>
        );
      }
      wordTiles = shuffleArray(wordTiles);
      break;
    }
    case "pictures-answers": {
      nToPlace = pictures.length;
      for (let i = 0; i < nToPlace; i++) mixer.push([i, answers[i]]);
      mixer = shuffleArray(mixer);
      for (let i = 0; i < nToPlace; i++) {
        wordTiles.push(
          <DraggableWordTile className={`blank draggable`} index={mixer[i][0]} key={`${id}word${i}`}>
            {mixer[i][1]}
          </DraggableWordTile>
        );
      }
      break;
    }
    case "questions-answers": {
      nToPlace = questions.length;
      for (let i = 0; i < nToPlace; i++) mixer.push([i, answers[i]]);
      mixer = shuffleArray(mixer);
      for (let i = 0; i < nToPlace; i++) {
        wordTiles.push(
          <DraggableWordTile className={`blank draggable`} index={mixer[i][0]} key={`${id}word${i}`}>
            {mixer[i][1]}
          </DraggableWordTile>
        );
      }
      break;
    }
    default:
      break;
  }

  return {
    ...config,
    id,
    assignedCount: 0,
    margin: 20,
    nToPlace,
    showHints: false,
    showInvalidDropHint: false,
    slotWidthPx: null,
    wordTiles,
    words,
  };
};

// Merge reducer: each dispatch is a partial state patch. A function patch
// receives the latest state (handlers that read previous state — failCount,
// audio progress). A patch that resolves to null/undefined is a no-op: the
// reducer returns the SAME state reference so useReducer bails out of the
// re-render (used by the slot-width measurement to avoid redundant updates).
const reducer = (state, patch) => {
  const update = typeof patch === "function" ? patch(state) : patch;
  return update ? { ...state, ...update } : state;
};

export function DraggableFillGapsRuntime({ config = {}, suppressInfo = false }) {
  const [state, dispatch] = useReducer(reducer, config, getInitialState);

  // Master-player audio (activeRowIndex / masterPlayState / rowProgress + the four
  // handleMaster* handlers) is owned by the shared hook (Phase 6). The per-row
  // click path is not used by this component (no rowAudioStatus).
  const {
    activeRowIndex,
    masterPlayState,
    rowProgress,
    handleMasterTrackChange,
    handleMasterPlayStateChange,
    handleMasterTime,
    handleMasterStopped,
  } = useExerciseAudio();

  // Instance fields → refs (mutable, non-render).
  // Original "home" positions per tile, keyed by "word{index}" (geometry cache).
  const tileHomePositionsRef = useRef({});
  // Current placement { [tileKey]: targetKey } — the answer map; assignedCount mirrors its size.
  const tileAssignmentsRef = useRef({});
  // Active-drag scratch.
  const movingPieceRef = useRef(undefined);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const activePointerIdRef = useRef(undefined);
  // DOM refs (were React.createRef).
  const sequenceRef = useRef(null);
  const wordsContainerRef = useRef(null);
  // Timer/frame ids.
  const slotMeasureRafRef = useRef(null);
  const invalidDropHintTimeoutRef = useRef(null);
  // Guards deferred dispatches against StrictMode double-fire / unmount.
  const mountedRef = useRef(true);

  // ---------- Slot-width measurement ----------

  const updateSlotWidthFromDraggables = useCallback(() => {
    dispatch((prev) => {
      const { firstMouseDown = true, id, slotWidthPx } = prev;
      if (!id) return null;
      if (!firstMouseDown) return null;

      const draggableSpans = document.querySelectorAll(`#${id} .words-container .word span`);
      let maxWidth = 0;

      draggableSpans.forEach((span) => {
        const w = span.getBoundingClientRect().width;
        if (w > maxWidth) maxWidth = w;
      });

      if (maxWidth <= 0) return null;

      // Keep slots slightly wider than the longest draggable word chip.
      const bufferedWidth = Math.ceil(maxWidth + 14);
      if (slotWidthPx === bufferedWidth) return null;
      return { slotWidthPx: bufferedWidth };
    });
  }, []);

  const scheduleSlotWidthMeasure = useCallback(() => {
    if (slotMeasureRafRef.current) cancelAnimationFrame(slotMeasureRafRef.current);
    slotMeasureRafRef.current = requestAnimationFrame(updateSlotWidthFromDraggables);
  }, [updateSlotWidthFromDraggables]);

  // Mount/unmount (was componentDidMount + componentWillUnmount). The class added
  // the touchmove listener anonymously and never removed it (latent leak); here it
  // is named and cleaned up alongside the resize listener. StrictMode-safe:
  // setup + cleanup are idempotent and mountedRef is re-armed each mount.
  useEffect(() => {
    mountedRef.current = true;

    const handleTouchMove = (e) => {
      if (movingPieceRef.current) e.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", scheduleSlotWidthMeasure);
    scheduleSlotWidthMeasure();

    return () => {
      mountedRef.current = false;
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      window.removeEventListener("resize", scheduleSlotWidthMeasure);
      if (invalidDropHintTimeoutRef.current) clearTimeout(invalidDropHintTimeoutRef.current);
      if (slotMeasureRafRef.current) cancelAnimationFrame(slotMeasureRafRef.current);
    };
  }, [scheduleSlotWidthMeasure]);

  // ---------- Helpers ----------

  const getWordsContainerRect = () => {
    const wc = wordsContainerRef.current;
    return wc ? wc.getBoundingClientRect() : null;
  };

  const getMouseInWordsContainer = (e) => {
    const r = getWordsContainerRect();
    if (!r) return { x: 0, y: 0 };
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
    };
  };

  const ensureHomePositions = () => {
    if (!tileHomePositionsRef.current || Object.keys(tileHomePositionsRef.current).length === 0) {
      pinTiles();
    }
  };

  const assignTileToTarget = (tileKey, targetKey) => {
    tileAssignmentsRef.current[tileKey] = targetKey;
    dispatch({ assignedCount: Object.keys(tileAssignmentsRef.current).length });
  };

  const unassignTile = (tileKey) => {
    if (tileKey && tileAssignmentsRef.current[tileKey]) {
      delete tileAssignmentsRef.current[tileKey];
      dispatch({ assignedCount: Object.keys(tileAssignmentsRef.current).length });
    }
  };

  const returnTileToHome = (tileEl) => {
    if (!tileEl) return;
    const tileKey = getTileKey(tileEl);
    const home = tileHomePositionsRef.current[tileKey];
    if (!home) return;

    tileEl.classList.remove("dragging", "highlight", "success", "placed");
    tileEl.classList.add("draggable", "returning");
    tileEl.style.pointerEvents = "";
    tileEl.style.opacity = "1";
    tileEl.style.left = home.left;
    tileEl.style.top = home.top;
    setTimeout(() => tileEl.classList.remove("returning"), 220);
  };

  const evictExistingOccupant = (targetKey, exceptTileKey) => {
    const { id } = state;
    const occupantEntry = Object.entries(tileAssignmentsRef.current).find(
      ([tileKey, currentTarget]) => currentTarget === targetKey && tileKey !== exceptTileKey
    );
    if (!occupantEntry) return;
    const [occupantTileKey] = occupantEntry;
    const occupantTile = document.querySelector(`#${id} .words-container .word.${occupantTileKey}`);
    returnTileToHome(occupantTile);
    unassignTile(occupantTileKey);
  };

  const handleCheckAnswers = () => {
    const { id, nToPlace } = state;
    ensureHomePositions();

    let correctCount = 0;
    let hadWrong = false;

    for (const [tileKey, targetKey] of Object.entries(tileAssignmentsRef.current)) {
      const tile = document.querySelector(`#${id} .words-container .word.${tileKey}`);
      if (!tile) continue;

      if (tileKey === targetKey) {
        correctCount++;
        tile.classList.remove("dragging", "returning", "highlight", "success");
        tile.classList.remove("draggable");
        tile.classList.add("placed");
        tile.style.pointerEvents = "none";
        tile.style.opacity = "1";
      } else {
        hadWrong = true;
        returnTileToHome(tile);
        delete tileAssignmentsRef.current[tileKey];
      }
    }

    dispatch((prev) => ({
      assignedCount: Object.keys(tileAssignmentsRef.current).length,
      nPlaced: correctCount,
      complete: correctCount === nToPlace,
      failCount: hadWrong ? (prev.failCount || 0) + 1 : (prev.failCount || 0),
    }));
  };

  // ---------- Core actions ----------

  const autoSolve = () => {
    const { id, nToPlace, firstMouseDown = true } = state;

    // Ensure tiles have been pinned to absolute positions so left/top animations work
    if (firstMouseDown) {
      dispatch({ firstMouseDown: false });

      const wc = wordsContainerRef.current;
      if (wc) {
        // Stable containing block for absolute children
        wc.style.position = "relative";

        // Freeze container size to prevent reflow after pinning
        const { width, height } = window.getComputedStyle(wc);
        wc.style.width = width;
        wc.style.height = height;
      }

      pinTiles(); // your two-pass pinning (records home positions too)
    }

    const wc = wordsContainerRef.current;
    if (!wc) return;

    const wcRect = wc.getBoundingClientRect();

    // Animate each still-draggable tile to its matching target and KEEP it visible.
    const tiles = document.querySelectorAll(`#${id} .words-container .word.draggable`);

    tiles.forEach((tile) => {
      const key = getTileKey(tile); // e.g. "word3"
      if (!key) return;

      const targetWord = document.querySelector(`#${id} .target.${key}`);
      if (!targetWord) return;

      const tRect = targetWord.getBoundingClientRect();

      // Convert viewport coords -> words-container coords
      const targetLeft = tRect.left - wcRect.left;
      const targetTop = tRect.top - wcRect.top;

      // Make sure it's visible and animatable
      tile.style.opacity = "1";
      tile.style.position = "absolute";

      // Apply transition (left/top driven by your CSS too, but inline is safest here)
      tile.style.transition = "left 1s, top 1s, box-shadow 1s, opacity 1s";
      tile.classList.add("returning");

      // Force reflow so the transition is applied
      void tile.offsetWidth;

      // Animate into place
      tile.style.left = `${targetLeft}px`;
      tile.style.top = `${targetTop}px`;

      const onDone = (e) => {
        // Only finalize once the movement finishes
        if (e.propertyName !== "left" && e.propertyName !== "top") return;

        tile.classList.remove("draggable");
        tile.classList.remove("dragging");
        tile.classList.add("placed");
        tile.classList.remove("returning");

        // Ensure it stays visible and can't be dragged again
        tile.style.opacity = "1";
        tile.style.pointerEvents = "none";

        tile.removeEventListener("transitionend", onDone);
      };

      tile.addEventListener("transitionend", onDone);
    });

    // Update completion state so Reset appears immediately
    dispatch({
      nPlaced: nToPlace,
      complete: true,
    });
  };

  const handleToggle = (value) => {
    dispatch({ showHints: value });
  };

  // ---------- Drag handling (now in words-container coordinate space) ----------

  const handleMouseDown = (e) => {
    // Let interactive controls behave normally
    if (isInteractiveElement(e.target)) return;

    // Only left click for mouse (pointer events sometimes show button=0 always; keep permissive)
    if (e.button && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const { id, firstMouseDown = true } = state;

    if (firstMouseDown) {
      dispatch({ firstMouseDown: false });

      // Ensure stable containing block for absolute children
      if (wordsContainerRef.current) {
        wordsContainerRef.current.style.position = "relative";
      }

      // Fix container size (so reflow doesn’t change home coords)
      const { width, height } = window.getComputedStyle(wordsContainerRef.current);
      wordsContainerRef.current.style.width = width;
      wordsContainerRef.current.style.height = height;

      pinTiles();
    }

    let { target } = e;
    if (!target.classList.contains('draggable')) target = target.parentElement;

    if (target.classList.contains('word') && target.classList.contains('draggable')) {
      // Keep receiving pointer events even if the pointer leaves the container.
      if (typeof e.pointerId === "number" && e.currentTarget?.setPointerCapture) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
          activePointerIdRef.current = e.pointerId;
        } catch {
          // no-op: some browsers can reject pointer capture in edge cases
        }
      }

      movingPieceRef.current = target;

      const cl = movingPieceRef.current.classList;
      const startWord = document.querySelector(`#${id} .words-container .draggable.${cl[0]}`);

      if (startWord) {
        // Starting point (home) in words-container coords
        const key = getTileKey(startWord);
        const home = tileHomePositionsRef.current[key];
        if (home) {
          startXRef.current = parseFloat(home.left);
          startYRef.current = parseFloat(home.top);
        } else {
          // fallback
          startXRef.current = startWord.offsetLeft;
          startYRef.current = startWord.offsetTop;
        }

        // Place tile center under pointer in words-container coords
        const { x, y } = getMouseInWordsContainer(e);
        const rect = movingPieceRef.current.getBoundingClientRect();
        const left = x - rect.width / 2;
        const top = y - rect.height / 2;

        movingPieceRef.current.style.left = `${left}px`;
        movingPieceRef.current.style.top = `${top}px`;
        movingPieceRef.current.classList.add("dragging");
        movingPieceRef.current.style.zIndex = '9999';
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isInteractiveElement(e.target)) return;

    if (movingPieceRef.current && movingPieceRef.current.classList.contains("dragging")) {
      e.preventDefault();

      const { x, y } = getMouseInWordsContainer(e);
      const rect = movingPieceRef.current.getBoundingClientRect();

      const left = x - rect.width / 2;
      const top = y - rect.height / 2;

      movingPieceRef.current.style.left = `${left}px`;
      movingPieceRef.current.style.top = `${top}px`;

      const { success, overTarget, targetWord } = inLimits();

      if (success) {
        movingPieceRef.current.classList.add('highlight', 'success');
        clearTargetHighlights();
        targetWord ? targetWord.classList.add('highlight') : null;
      } else if (overTarget) {
        movingPieceRef.current.classList.add('highlight');
        movingPieceRef.current.classList.remove('success');
        targetWord ? targetWord.classList.add('highlight') : null;
      } else {
        movingPieceRef.current.classList.remove('highlight', 'success');
        clearTargetHighlights();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (
      typeof activePointerIdRef.current === "number" &&
      e.currentTarget?.releasePointerCapture
    ) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {
        // no-op
      }
      activePointerIdRef.current = undefined;
    }

    e.stopPropagation();

    const clickAudio = new Audio(resolveAsset('/audio/ui/click.mp3'));
    const { showHints = false } = state;

    if (movingPieceRef.current !== undefined) {
      const inLimitsResult = inLimits();
      movingPieceRef.current.classList.remove('highlight');
      movingPieceRef.current.style.zIndex = '';

      if (inLimitsResult.overTarget) {
        const { targetLeft, targetTop, targetWord, success } = inLimitsResult;
        const tileKey = getTileKey(movingPieceRef.current);
        const targetKey = getWordKeyFromEl(targetWord);
        if (!tileKey || !targetKey) {
          returnTileToHome(movingPieceRef.current);
          movingPieceRef.current = undefined;
          clearTargetHighlights();
          return;
        }

        // In hint mode, reject incorrect slot immediately and make it obvious why.
        if (showHints && !success) {
          const droppedTile = movingPieceRef.current;
          unassignTile(tileKey);
          droppedTile.classList.remove("dragging");
          droppedTile.classList.add("returning");
          droppedTile.style.left = `${startXRef.current}px`;
          droppedTile.style.top = `${startYRef.current}px`;

          dispatch((prev) => ({ failCount: (prev.failCount || 0) + 1 }));
          triggerInvalidDropFeedback(droppedTile, targetWord);

          setTimeout(() => {
            droppedTile.classList.remove("returning");
          }, 350);

          movingPieceRef.current = undefined;
          clearTargetHighlights();
          return;
        }

        // One tile per target: replace existing occupant.
        evictExistingOccupant(targetKey, tileKey);

        clickAudio.play();

        movingPieceRef.current.style.left = `${targetLeft}px`;
        movingPieceRef.current.style.top = `${targetTop}px`;

        movingPieceRef.current.classList.remove("dragging");
        movingPieceRef.current.classList.remove("returning");
        movingPieceRef.current.classList.remove("placed");
        movingPieceRef.current.classList.add("draggable");

        movingPieceRef.current.style.opacity = "1";
        movingPieceRef.current.style.pointerEvents = "";

        assignTileToTarget(tileKey, targetKey);
        movingPieceRef.current = undefined;
      } else {
        const tileKey = getTileKey(movingPieceRef.current);
        const droppedTile = movingPieceRef.current;
        unassignTile(tileKey);
        droppedTile.classList.remove("dragging");
        droppedTile.classList.add("returning");

        droppedTile.style.left = `${startXRef.current}px`;
        droppedTile.style.top = `${startYRef.current}px`;

        dispatch((prev) => ({ failCount: (prev.failCount || 0) + 1 }));
        triggerInvalidDropFeedback(droppedTile, null);

        setTimeout(() => {
          droppedTile.classList.remove("returning");
        }, 350);
        movingPieceRef.current = undefined;
      }
    }

    clearTargetHighlights();
  };

  const triggerInvalidDropFeedback = (tileEl, targetEl) => {
    if (tileEl) {
      tileEl.classList.remove("invalid-drop");
      void tileEl.offsetWidth;
      tileEl.classList.add("invalid-drop");
      setTimeout(() => tileEl.classList.remove("invalid-drop"), 380);
    }

    if (targetEl) {
      targetEl.classList.remove("invalid-target");
      void targetEl.offsetWidth;
      targetEl.classList.add("invalid-target");
      setTimeout(() => targetEl.classList.remove("invalid-target"), 420);
    }

    if (invalidDropHintTimeoutRef.current) clearTimeout(invalidDropHintTimeoutRef.current);
    dispatch({ showInvalidDropHint: true });
    invalidDropHintTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      dispatch({ showInvalidDropHint: false });
    }, INVALID_DROP_HINT_DURATION_MS);
  };

  const clearTargetHighlights = () => {
    const { id } = state;
    const targetWords = document.querySelectorAll(`#${id} .target.word`);
    targetWords.forEach((tw) => tw.classList.remove('highlight'));
  };

  // ---------- Reset (no jump, no top-left flash) ----------

  const handleReset = () => {
    const { id } = state;

    ensureHomePositions();

    const wc = wordsContainerRef.current;
    if (!wc) return;

    // container rect for freezing current positions
    const wcRect = wc.getBoundingClientRect();

    const tiles = document.querySelectorAll(`#${id} .words-container .word`);

    tiles.forEach((tile) => {
      const key = getTileKey(tile);
      const home = tileHomePositionsRef.current[key];
      if (!home) return;

      // ✅ IMPORTANT: undo autoSolve "lock" + any leftover drag classes
      tile.style.pointerEvents = ""; // <— this fixes “not draggable after reset”
      tile.style.opacity = "1";
      tile.classList.remove("placed", "dragging", "returning", "highlight", "success");
      tile.classList.add("draggable");

      // Freeze current position using rects relative to words-container
      const r = tile.getBoundingClientRect();
      const curLeft = r.left - wcRect.left;
      const curTop = r.top - wcRect.top;

      // Lock at current spot with transitions off
      tile.style.transition = "none";
      tile.style.position = "absolute";
      tile.style.left = `${curLeft}px`;
      tile.style.top = `${curTop}px`;
      void tile.offsetWidth;

      // Animate home (CSS handles left/top transitions)
      tile.classList.add("returning");
      void tile.offsetWidth;

      tile.style.transition = ""; // allow CSS/inline transition rules
      void tile.offsetWidth;

      tile.style.left = home.left;
      tile.style.top = home.top;

      const onDone = (ev) => {
        if (ev.propertyName !== "left" && ev.propertyName !== "top") return;
        tile.classList.remove("returning");
        tile.removeEventListener("transitionend", onDone);
      };
      tile.addEventListener("transitionend", onDone);
    });

    // Restore word text in bank
    const objectSpans = document.querySelectorAll(`#${id} .words-container .blank span`);
    objectSpans.forEach((s) => { s.style.opacity = 1; });

    // Hide answers again
    // const targetSpans = document.querySelectorAll(`#${id} .target-board .blank span`);
    // targetSpans.forEach((s) => { s.style.opacity = 0; });

    clearTargetHighlights();
    tileAssignmentsRef.current = {};

    dispatch(() => ({
      assignedCount: 0,
      failCount: 0,
      matched: [],
      nPlaced: 0,
      complete: false,
    }));
  };

  // ---------- Target checking (returns coords in words-container space) ----------

  const inLimits = () => {
    const { id, margin } = state;

    // Over-any-target highlight (no snap)
    const targetWords = document.querySelectorAll(`#${id} .target.word`);
    const pieceRect = movingPieceRef.current.getBoundingClientRect();
    const { left: pLeft, top: pTop, right: pRight, bottom: pBottom } = pieceRect;
    const movingKey = getTileKey(movingPieceRef.current);

    for (let i = 0; i < targetWords.length; i++) {
      const tw = targetWords[i];
      const r = tw.getBoundingClientRect();

      const pieceMid = pLeft + (pRight - pLeft) / 2;
      if ((pieceMid >= r.left) && (pieceMid <= r.right) && pTop >= r.top - margin && pBottom <= r.bottom + margin) {
        const wcRect = getWordsContainerRect();
        if (!wcRect) return { overTarget: true, targetWord: tw };
        const targetLeft = r.left - wcRect.left + (r.width - pieceRect.width) / 2;
        const targetTop = r.top - wcRect.top + (r.height - pieceRect.height) / 2;
        return {
          overTarget: true,
          success: getWordKeyFromEl(tw) === movingKey,
          targetWord: tw,
          targetLeft,
          targetTop,
        };
      }
    }

    return { success: false };
  };

  // ✅ Two-pass pinning (prevents all tiles collapsing to one position)
  // Stores home positions in words-container coords
  const pinTiles = () => {
    const { id } = state;

    const wc = wordsContainerRef.current;
    if (!wc) return;

    // Ensure stable containing block
    wc.style.position = "relative";

    const wcRect = wc.getBoundingClientRect();
    const tiles = document.querySelectorAll(`#${id} .words-container .word.draggable`);
    const coords = [];

    // PASS 1: measure while still in flow
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const r = tile.getBoundingClientRect();

      const left = `${r.left - wcRect.left}px`;
      const top = `${r.top - wcRect.top}px`;

      coords.push({ left, top });

      const key = getTileKey(tile);
      if (key && !tileHomePositionsRef.current[key]) {
        tileHomePositionsRef.current[key] = { left, top };
      }
    }

    // PASS 2: apply after all measurements
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      tile.style.position = "absolute";
      tile.style.left = coords[i].left;
      tile.style.top = coords[i].top;
    }
  };

  // ---------- Render ----------

  const {
    assignedCount = 0,
    answers,
    blanksType = 'phrases',
    cheatText,
    complete = false,
    failCount,
    header = [],
    htmlContent,
    id = '',
    items,
    listenDescriptionText,
    nPlaced = 0,
    nToPlace,
    pictures,
    questions,
    showHints,
    showHintsText,
    showInvalidDropHint = false,
    showRowAudio = true,
    soundFile,
    soundFiles = [],
    slotWidthPx,
    words = [],
    wordTiles,
  } = state;

  const { informationText, informationTextHTML } = config;

  const phraseList = [];
  const tableRows = [];
  const headerCells = [];
  let tableCaption = "";

  const playlist = (items || [])
    .map((it, idx) => ({
      rowIndex: idx,
      src: it && it.audio ? resolveAsset(`${it.audio}`) : null,
    }))
    .filter(x => !!x.src);

  const rowToPlaylistIndex = {};
  playlist.forEach((p, pi) => { rowToPlaylistIndex[p.rowIndex] = pi; });
  const slotSourceWords = blanksType === "questions-answers" || blanksType === "pictures-answers"
    ? answers || []
    : words || [];
  const largestSlotChars = slotSourceWords.reduce((max, value) => {
    if (value === null || value === undefined) return max;
    const normalized = String(value)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return Math.max(max, normalized.length);
  }, 0);
  const slotCharWidth = Math.min(16, Math.max(4, largestSlotChars));
  const targetBoardStyle = {
    "--blanks-slot-ch": slotCharWidth,
    "--blanks-slot-px": slotWidthPx ? `${slotWidthPx}px` : undefined,
  };

  switch (blanksType) {
    case 'phrases': {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isActive = activeRowIndex === i;
        const status = isActive ? (masterPlayState === "playing" ? "playing" : "stopped") : "stopped";
        const prog = rowProgress[i] || { currentTime: 0, duration: 0 };

        const phrase = [];
        const phraseSplit = item.text.match(/\[[^\]]+\]|\S+/g);

        for (let j = 0; j < phraseSplit.length; j++) {
          if (phraseSplit[j][0] === '[') {
            const cleaned = phraseSplit[j].replace('[', '').replace(']', '');

            let foundIndex;
            for (let k = 0; k < words.length; k++) {
              if (words[k] === cleaned) foundIndex = k;
            }

            phrase.push(
              <DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={foundIndex} key={`phraseSpan${i}-${j}`}>
                {cleaned}
              </DraggableWordTile>
            );
          } else {
            phrase.push(<span className='word' key={`phraseSpan${i}-${j}`}>{phraseSplit[j]} </span>);
          }
        }

        phraseList.push(
          <li key={`phrase${i}`}>
            <div className='phrase'>
              {showRowAudio && item.audio ? (
                <CircularAudioProgressAnimatedSpeakerDisplay
                  className={`super-compact-speaker`}
                  status={status}
                  progress={prog.currentTime}
                  duration={prog.duration}
                  handleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const pi = rowToPlaylistIndex[i];
                    if (pi === undefined) return;

                    if (isActive) sequenceRef.current?.toggle();
                    else sequenceRef.current?.playItem(pi, { playSequence: false });
                  }}
                  title={isActive ? "Click to pause" : "Click to play"}
                />
              ) : null}
              {phrase}
            </div>
          </li>
        );
      }
      break;
    }

    case "table": {
      tableCaption = "Fill in the gaps answer grid";
      headerCells.push(<TableHead key={`${id}header-left-number`} scope="col">No.</TableHead>);
      headerCells.push(<TableHead key={`${id}header-left-answer`} scope="col">Answer slot</TableHead>);
      headerCells.push(<TableHead key={`${id}header-right-number`} scope="col">No.</TableHead>);
      headerCells.push(<TableHead key={`${id}header-right-answer`} scope="col">Answer slot</TableHead>);
      const nRows = parseInt(words.length / 2) + words.length % 2;
      for (let i = 1; i <= nRows; i++) {
        const phrase = words[i - 1].replace(/ /g, ' ');
        tableRows.push(
          <TableRow key={`${id}row${i}`}>
            <TableCell>{i}.</TableCell>
            <TableCell>
              <DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={i - 1} key={`${id}word${i}`}>{phrase}</DraggableWordTile>
            </TableCell>
            {i <= words.length / 2 ?
              <>
                <TableCell>{i + nRows}.</TableCell>
                <TableCell>
                  <DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={i - 1 + nRows} key={`${id}word${i + nRows}`}>
                    {words[i - 1 + nRows]}
                  </DraggableWordTile>
                </TableCell>
              </>
              : null}
          </TableRow>
        );
      }
      break;
    }

    case "questions-answers": {
      tableCaption = "Question and answer drop targets";
      headerCells.push(<TableHead key={`${id}header-audio`} scope="col">Audio</TableHead>);
      headerCells.push(<TableHead key={`${id}header-question`} scope="col">Question</TableHead>);
      headerCells.push(<TableHead key={`${id}header-answer`} scope="col">Answer slot</TableHead>);
      for (let i = 1; i <= questions.length; i++) {
        const sf = resolveAsset(`${soundFiles[i - 1]}`);
        tableRows.push(
          <TableRow key={`${id}row${i}`}>
            <TableCell><AudioClip className={`super-compact-speaker`} soundFile={sf} /></TableCell>
            <TableCell>{questions[i - 1]}</TableCell>
            <TableCell><DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={i - 1} key={`${id}word${i}`}>{answers[i - 1]}</DraggableWordTile></TableCell>
          </TableRow>
        );
      }
      break;
    }

    case "group-table": {
      tableCaption = "Grouped answer drop targets";
      if (header) {
        for (let i = 0; i < header.length; i++) {
          headerCells.push(<TableHead key={`${id}header${i}`} scope="col">{header[i]}</TableHead>);
        }
      } else {
        headerCells.push(<TableHead key={`${id}header0`} scope="col">Left group</TableHead>);
        headerCells.push(<TableHead key={`${id}header1`} scope="col">Right group</TableHead>);
      }
      for (let i = 1; i <= answers.length; i++) {
        tableRows.push(
          <TableRow key={`${id}row${i}`}>
            <TableCell>
              <DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={words.indexOf(answers[i - 1][0])} key={`${id}word${i}`}>
                {answers[i - 1][0]}
              </DraggableWordTile>
            </TableCell>
            <TableCell>
              <DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={words.indexOf(answers[i - 1][1])} key={`${id}word${i}`}>
                {answers[i - 1][1]}
              </DraggableWordTile>
            </TableCell>
          </TableRow>
        );
      }
      break;
    }

    case "pictures-answers": {
      tableCaption = "Picture and answer drop targets";
      headerCells.push(<TableHead key={`${id}header-audio`} scope="col">Audio</TableHead>);
      headerCells.push(<TableHead key={`${id}header-picture`} scope="col">Picture</TableHead>);
      headerCells.push(<TableHead key={`${id}header-answer`} scope="col">Answer slot</TableHead>);
      for (let i = 1; i <= pictures.length; i++) {
        const sf = resolveAsset(`${soundFiles[i - 1]}`);
        tableRows.push(
          <TableRow key={`${id}row${i}`}>
            <TableCell><AudioClip className={`super-compact-speaker`} soundFile={sf} /></TableCell>
            <TableCell><img src={`${pictures[i - 1]}`} alt={`${answers[i - 1]}`} /></TableCell>
            <TableCell><DraggableWordTile className={`blank target ${BLANKS_DROP_TARGET_CLASS}`} index={i - 1} key={`${id}word${i}`}>{answers[i - 1]}</DraggableWordTile></TableCell>
          </TableRow>
        );
      }
      break;
    }

    default: {
      console.error("Not a valid type of Blanks");
    }
  }

  return (
    <div
      className={`blanks-container type-${blanksType} container ${complete ? 'complete' : ''}`}
      id={id || undefined}
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      onPointerCancel={handleMouseUp}
      key={`${id}Blanks`}
    >
      {!suppressInfo && (informationText || informationTextHTML) ? (
        <Info className={`text`} id={`info-${id}`} informationText={informationText} informationTextHTML={informationTextHTML} />
      ) : null}
      {htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

      {listenDescriptionText && soundFile ? (
        <AudioClip
          id={`${id}Audio`}
          listenText={listenDescriptionText}
          soundFile={soundFile}
        />
      ) : null}

      {blanksType === "phrases" && playlist.length > 0 ? (
        <SequenceAudioController
          ref={sequenceRef}
          sources={playlist.map(p => p.src)}
          pauseSeconds={0.5}
          onTrackChange={(playlistIndex) => handleMasterTrackChange(playlistIndex, playlist)}
          onTimeUpdate={(playlistIndex, clipTime, clipDuration) =>
            handleMasterTime(playlistIndex, clipTime, clipDuration, playlist)
          }
          onPlayStateChange={(playState) => handleMasterPlayStateChange(playState)}
          onStopped={(playlistIndex) => handleMasterStopped(playlistIndex, playlist)}
        />
      ) : null}

      <div className={`blanks ${BLANKS_CONTENT_FLOW_CLASS} ${showHints ? 'show-hints' : ''} ${blanksType} mb-8`}>
        <Card className="blanks-words-shell w-full max-w-[72rem] border-border/55 bg-muted/25 shadow-sm">
          <CardContent className="p-2 min-[420px]:p-3 sm:p-4">
            <div className={`words-container ${BLANKS_WORDS_CONTAINER_FLOW_CLASS}`} ref={wordsContainerRef}>
              {wordTiles}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`target-board ${BLANKS_TARGET_BOARD_TEXT_CLASS} w-full max-w-[72rem] border-border/55 bg-card/60 shadow-sm`}
          style={targetBoardStyle}
        >
          <CardContent className="p-2 min-[420px]:p-3 sm:p-4">
            {blanksType === 'phrases' ? (
              <ul className={BLANKS_PHRASE_ROWS_FLOW_CLASS}>{phraseList}</ul>
            ) : (
              <Table className={BLANKS_TARGET_TABLE_TEXT_CLASS}>
                {tableCaption ? <TableCaption className="sr-only">{tableCaption}</TableCaption> : null}
                {headerCells.length > 0 ? (
                  <TableHeader><TableRow>{headerCells}</TableRow></TableHeader>
                ) : null}
                <TableBody>{tableRows}</TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="exercise-divider" role="none" data-orientation="horizontal" />
      <ProgressDots correct={nPlaced} total={nToPlace} />
      <div className="exercise-divider" role="none" data-orientation="horizontal" />

      <ExerciseFooter
        hints={
          <div className="exercise-help-hints">
            <Switch
              aria-label="Show hints"
              id={id ? `showHintsId-${id}` : undefined}
              aria-labelledby={id ? `showHintsLabel-${id}` : undefined}
              checked={showHints}
              onCheckedChange={handleToggle}
            />
            <span id={id ? `showHintsLabel-${id}` : undefined} className="text-sm font-medium leading-none cursor-pointer">
              {showHintsText}
            </span>
            {/* Keep this as a polite inline hint (not shadcn <Alert role="alert">):
							    wrong-drop feedback can fire repeatedly during drag practice, and assertive
							    announcements would be overly interruptive for screen-reader users. */}
            <span
              className={`invalid-drop-hint border border-[color-mix(in_oklab,var(--destructive)_72%,var(--foreground))] bg-[color-mix(in_oklab,var(--destructive)_14%,var(--card))] text-[var(--destructive)] ${showInvalidDropHint ? 'show' : ''}`}
              aria-live="polite"
            >
              <CircleAlert aria-hidden="true" className="h-[1em] w-[1em]" />
              Try another slot
            </span>
          </div>
        }
        onShowAnswers={autoSolve}
        showAnswers={failCount >= 2}
        showAnswersLabel={cheatText}
        onReset={handleReset}
        showReset={nPlaced >= 1 || failCount >= 2 || complete}
        onCheck={handleCheckAnswers}
        checkDisabled={assignedCount < 1}
      />
    </div>
  );
}
