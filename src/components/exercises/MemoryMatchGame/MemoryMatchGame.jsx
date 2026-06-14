// React component for bilingual memory matching game
import { Card } from "@/components/exercises/MemoryMatchGame/Card";
import { ProgressDots } from "@/components/exercises/ProgressDots/ProgressDots";
import { ExerciseFooter } from "@/components/exercises/shared/ExerciseFooter";
import { Info } from "@/components/content";
import { captureFlipPositions, playFlipAnimation } from "@/utils/reorderAnimation";
import DOMPurify from "dompurify";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { resolveAsset } from "@/utils/assets";
import AudioManager from "@/audio/AudioManager";
import { MEMORY_CARD_TRANSITION_TIME_MS } from "@/constants/layout";

const FINISH_UP_FALLBACK_MS = 2000; // Chrome doesn't fire onended — fallback timer.

const toMemoryCardSlug = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getShuffledDeck = (cards, nCards) => {
  cards = cards.sort(() => Math.random() - 0.5);
  cards = cards.slice(0, nCards);
  const imageCards = cards.map((obj, idx) => ({
    classNameSlug: toMemoryCardSlug(obj.localLanguage),
    content: obj.localLanguage,
    id: `${idx}b`,
    image: obj.image,
    localLanguage: obj.localLanguage,
    match: obj.foreignLanguage,
    type: 'image',
  }));
  const textCards = cards.map((obj, idx) => ({
    audio: obj.audio,
    classNameSlug: toMemoryCardSlug(obj.localLanguage),
    content: obj.foreignLanguage,
    id: `${idx}a`,
    image: `img-${idx}`,
    localLanguage: obj.localLanguage,
    match: obj.localLanguage,
    type: 'text',
  }));
  const combined = [...imageCards, ...textCards];
  return combined.sort(() => Math.random() - 0.5);
};

const getResetState = (cards, nPairsToPlay) => ({
  beenFlipped: [],
  cards: getShuffledDeck(cards, nPairsToPlay),
  flipped: [],
  matched: [],
  nPairs: 0,
  nTries: 0,
  startTime: undefined,
  timeReport: '',
});

const getSolvedCards = (cards = []) => {
  const pairMap = new Map();
  cards.forEach((card) => {
    const pairId = card.id.slice(0, -1);
    const existing = pairMap.get(pairId) || {};
    if (card.id.endsWith('a')) existing.text = card;
    if (card.id.endsWith('b')) existing.image = card;
    pairMap.set(pairId, existing);
  });

  const orderedPairs = Array.from(pairMap.entries())
    .sort(([pairA], [pairB]) => Number(pairA) - Number(pairB))
    .map(([, pair]) => pair)
    .filter((pair) => pair.text && pair.image);

  const solved = [];
  for (let index = 0; index < orderedPairs.length; index += 2) {
    const leftPair = orderedPairs[index];
    const rightPair = orderedPairs[index + 1];

    solved.push(leftPair.text, leftPair.image);
    if (rightPair) solved.push(rightPair.image, rightPair.text);
  }

  return solved;
};

// Merge reducer: each dispatch is a partial state patch (8+ interdependent
// fields, so useReducer over many useState calls per the migration plan).
const reducer = (state, patch) => ({ ...state, ...patch });

export function MemoryMatchGame({ config = {}, suppressInfo = false }) {
  const { htmlContent, id } = config;

  // Lazy initializer: getShuffledDeck runs ONCE per mount, not every render.
  const [state, dispatch] = useReducer(reducer, config, (cfg) => ({
    beenFlipped: [], // To have shade animations if/when flipping back
    cards: getShuffledDeck(cfg.cards, cfg.nPairsToPlay),
    flipped: [],
    matched: [],
    nPairs: 0,
    nTries: 0,
    startTime: undefined,
    timeReport: '',
  }));
  const { beenFlipped, cards, flipped, matched, nPairs, nTries } = state;

  const cardRefs = useRef(null);
  if (cardRefs.current === null) cardRefs.current = new Map();

  // Unmount safety for the deferred setState in handleClick (StrictMode-safe).
  const mountedRef = useRef(true);
  const timersRef = useRef([]);
  // FLIP positions captured in handleShowAnswers, played after the DOM reorders.
  const pendingFlipRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    const timers = timersRef;
    return () => {
      mountedRef.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // Runs after the show-answers reorder commits — equivalent to the old
  // setState(callback) timing. Guarded so it only fires for a pending FLIP.
  useLayoutEffect(() => {
    if (!pendingFlipRef.current) return;
    const before = pendingFlipRef.current;
    pendingFlipRef.current = null;
    playFlipAnimation({
      before,
      duration: 620,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      getElement: (cardId) => cardRefs.current.get(cardId),
      ids: cards.map((card) => card.id),
      stagger: 18,
    });
  }, [cards]);

  const setCardRef = (cardId, element) => {
    if (!cardId) return;
    if (element) cardRefs.current.set(cardId, element);
    else cardRefs.current.delete(cardId);
  };

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

    const startTime = state.startTime || new Date();
    const newFlipped = [...flipped, card.id];
    dispatch({
      beenFlipped: [...beenFlipped, card.id],
      flipped: newFlipped,
      startTime,
    });

    if (newFlipped.length !== 2) return;

    const nextTries = nTries + 1;
    const [first, second] = newFlipped;
    const firstCard = cards.find((c) => c.id === first);
    const secondCard = cards.find((c) => c.id === second);

    if (firstCard.match === secondCard.content) {
      const { audio: soundFile } = { ...firstCard, ...secondCard };
      const nextPairs = nPairs + 1;
      let finishedUp = false;
      const finishUp = () => {
        if (finishedUp || !mountedRef.current) return;
        finishedUp = true;
        if (nextPairs === cards.length / 2) {
          const diffMs = new Date() - startTime; // milliseconds
          const totalSeconds = Math.floor(diffMs / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          const timeReport = minutes !== 0
            ? ` Completed in ${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds > 1 ? 's' : ''}.`
            : ` Completed in ${seconds} second${seconds > 1 ? 's' : ''}.`;
          dispatch({ timeReport });
        }
      };
      AudioManager.play(resolveAsset(`${soundFile}`), { onEnded: finishUp });
      timersRef.current.push(setTimeout(finishUp, FINISH_UP_FALLBACK_MS));
      dispatch({
        matched: [...matched, firstCard.id, secondCard.id],
        nPairs: nextPairs,
        nTries: nextTries,
      });
    }

    timersRef.current.push(setTimeout(() => {
      if (!mountedRef.current) return;
      dispatch({ flipped: [], nTries: nextTries });
    }, MEMORY_CARD_TRANSITION_TIME_MS));
  };

  const handleReset = () => {
    dispatch(getResetState(config.cards, config.nPairsToPlay));
  };

  const handleShowAnswers = () => {
    const idsBefore = cards.map((card) => card.id);
    const before = captureFlipPositions(idsBefore, (cardId) => cardRefs.current.get(cardId));
    const solvedCards = getSolvedCards(cards);
    const solvedIds = solvedCards.map((card) => card.id);

    pendingFlipRef.current = before;
    dispatch({
      beenFlipped: solvedIds,
      cards: solvedCards,
      flipped: [],
      matched: solvedIds,
      nPairs: solvedCards.length / 2,
      startTime: undefined,
      timeReport: '',
    });
  };

  const {
    informationText,
    informationTextHTML,
    instructionsText,
    instructionsTextHTML,
  } = config;
  const resolvedInfoTextHTML = informationTextHTML || instructionsTextHTML;
  const resolvedInfoText = informationText || instructionsText;
  const hasInstructionContent = Boolean(resolvedInfoText || resolvedInfoTextHTML);
  const hasInfo = !suppressInfo && hasInstructionContent;
  return (
    <div className="memory-match-game-container relative" id={`${id}`}>
      {hasInfo ? (
        <Info informationText={resolvedInfoText} informationTextHTML={resolvedInfoTextHTML} />
      ) : null}
      {htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

      <div className={`memory-match-game flex flex-col items-center ${hasInstructionContent ? "pt-8" : ""}`}>
        <div className={`memory-map-container num${cards.length}cards w-full`}>
          <div className="cards mx-auto grid w-full max-w-[30.24rem] grid-cols-2 gap-3 text-[length:calc(var(--font-size-sm)*0.8)] md:max-w-[31.68rem] md:grid-cols-4 xl:max-w-[37.44rem] xl:text-[length:calc(var(--font-size-sm)*0.9)] 2xl:text-sm">
            {cards.map(card => (
              <Card
                card={card}
                cardRef={(element) => setCardRef(card.id, element)}
                className={`${card.classNameSlug || ""} ${beenFlipped.includes(card.id) || matched.includes(card.id) ? 'been-flipped' : ''} ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
                handleClick={handleClick}
                key={`card${card.id}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="exercise-divider mt-6" data-orientation="horizontal" role="none" />
      <ProgressDots correct={nPairs} total={cards.length / 2} />
      <div className="exercise-divider mt-4" data-orientation="horizontal" role="none" />
      <ExerciseFooter
        onReset={handleReset}
        onShowAnswers={handleShowAnswers}
        showAnswers={(nTries - nPairs) >= 2}
        showAnswersLabel="Show answer"
        showReset={nTries >= 1}
      />
    </div>
  );
}
