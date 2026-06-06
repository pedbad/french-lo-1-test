// React component for bilingual memory matching game
import { Card } from "@/components/exercises/MemoryMatchGame/Card";
import { ProgressDots } from "@/components/exercises/ProgressDots/ProgressDots";
import { exerciseActionButtonVariants } from "@/components/exercises/shared/exerciseActionButtonVariants";
import { Info } from "@/components/content";
import { IconButton } from "@/components/media";
import { captureFlipPositions, playFlipAnimation } from "@/utils/reorderAnimation";
import DOMPurify from "dompurify";
import React from "react";
import { resolveAsset } from "@/utils/assets";
import { MEMORY_CARD_TRANSITION_TIME_MS } from "@/constants/layout";

const toMemoryCardSlug = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

export class MemoryMatchGame extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      cards,
      nPairsToPlay,
    } = this.props.config;

    this.state = ({
      ...this.props.config,
      beenFlipped:[], // To have shade animations if/when flipping back
      cards: getShuffledDeck(cards, nPairsToPlay),
      flipped: [],
      matched: [],
      nPairs: 0,
      nTries: 0,
    });
    this.cardRefs = new Map();
  }

  setCardRef = (cardId, element) => {
    if (!cardId) return;
    if (element) this.cardRefs.set(cardId, element);
    else this.cardRefs.delete(cardId);
  };

  getSolvedCards = (cards = []) => {
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

  handleClick = (card) => {
    const {
      beenFlipped,
      cards,
      flipped,
      matched,
    } = this.state;
    let{
      nPairs,
      nTries,
      startTime,
    } = this.state;
    if (!startTime)	startTime = new Date();

    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    beenFlipped.push(card.id);
    const memoryCardTransitionTime = MEMORY_CARD_TRANSITION_TIME_MS;
    this.setState({
      beenFlipped: beenFlipped,
      flipped: newFlipped,
      startTime: startTime,
    }, () => {
      if (newFlipped.length === 2) {
        nTries++;
        const [first, second] = newFlipped;
        const firstCard = cards.find(c => c.id === first);
        const secondCard = cards.find(c => c.id === second);

        if (firstCard.match === secondCard.content) {
          const { audio: soundFile } = { ...firstCard, ...secondCard };
          const sound = new Audio(resolveAsset(`${soundFile}`));
          nPairs++;
          let timeReport = '';
          let finishedUp = false;
          const finishUp = () => {
            // console.log("Finish up");
            if (finishedUp) return;
            finishedUp = true;
            if (nPairs === cards.length / 2) {
              const endTime = new Date();
              const diffMs = endTime - startTime; // milliseconds
              const totalSeconds = Math.floor(diffMs / 1000);
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;
              if (minutes !== 0) {
                timeReport = ` Completed in ${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds > 1 ? 's' : ''}.`;
              } else {
                timeReport = ` Completed in ${seconds} second${seconds > 1 ? 's' : ''}.`;
              }
              this.setState({
                timeReport: timeReport,
              });
            }
          };
          sound.onended = () => finishUp();
          setTimeout(finishUp, 2000); // Fallback as Chrome doesn't fire onended event :-()

          // console.log("soundFile", soundFile);
          sound.play();
          matched.push(firstCard.id, secondCard.id);
          this.setState({
            matched: matched,
            nPairs,
            nTries,
          });
        }
        setTimeout(() =>
          this.setState({
            flipped: [],
            nTries: nTries,
          }), memoryCardTransitionTime);
      }
    });
  };

  handleReset = () => {
    const {
      cards,
      nPairsToPlay,
    } = this.props.config;

    this.setState(getResetState(cards, nPairsToPlay));
  };

  handleShowAnswers = () => {
    const { cards } = this.state;
    const idsBefore = cards.map((card) => card.id);
    const before = captureFlipPositions(idsBefore, (id) => this.cardRefs.get(id));
    const solvedCards = this.getSolvedCards(cards);
    const matched = solvedCards.map((card) => card.id);

    this.setState({
      beenFlipped: matched,
      cards: solvedCards,
      flipped: [],
      matched,
      nPairs: solvedCards.length / 2,
      startTime: undefined,
      timeReport: '',
    }, () => {
      playFlipAnimation({
        before,
        duration: 620,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        getElement: (id) => this.cardRefs.get(id),
        ids: this.state.cards.map((card) => card.id),
        stagger: 18,
      });
    });
  };

  render = () => {
    const { config = {}, suppressInfo = false } = this.props;
    const {
      beenFlipped,
      cards,
      flipped,
      htmlContent,
      id,
      // instructionsText,
      // instructionsTextHTML,
      matched,
      nPairs,
      nTries,
    } = this.state;
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
                  cardRef={(element) => this.setCardRef(card.id, element)}
                  className={`${card.classNameSlug || ""} ${beenFlipped.includes(card.id) || matched.includes(card.id) ? 'been-flipped' : ''} ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
                  handleClick={this.handleClick}
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
          onReset={this.handleReset}
          onShowAnswers={this.handleShowAnswers}
          showAnswers={(nTries - nPairs) >= 2}
          showAnswersLabel="Show answer"
          showReset={nTries >= 1}
        />
      </div>
    );
  };
}
