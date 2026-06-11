import { useRef, useState } from 'react';
import {
  AudioClip,
  IconButton,
} from '../';
import { resolveAsset } from '../../utils/assets';
import { highlightTextDiff } from '../../utils/exerciseDiff';
import DOMPurify from "dompurify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TypedAnswerField(props) {
  const {
    compact = false,
    config,
    comparisonOptions,
  } = props;

  // Source of display fields: spread from config when present, else the
  // individual props (mirrors the original constructor seeding).
  const source = config
    ? { ...config, compact }
    : { compact, content: props.content, soundFile: props.soundFile };

  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const nCorrectRef = useRef(0);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleReset = () => {
    setShowResult(false);
    setUserInput("");
  };

  const handleValidation = () => {
    setShowResult(true);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const countCorrect = () => {
    nCorrectRef.current += 1;
  };

  const {
    content,
    htmlContent,
    id,
    soundFile,
  } = source;

  let text = userInput;
  if (showResult) text = highlightTextDiff(userInput, content, countCorrect, false, comparisonOptions);

  if (compact) {
    const compactId = props.id;
    return (
      <>
        <div className={`typed-answer-field-container compact`} id={`typed-answer-field-${compactId}`}>
          {showResult ?
            (<div className={`comparison-result compact`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></div>)
            :
            (
              <form onKeyPress={handleKeyPress}>
                <Input
                  id={`typed-answer-field-${compactId}-text`}
                  name={`typed-answer-field-${compactId}-text`}
                  onChange={handleChange}
                  placeholder={`type your answer`}
                  type='text'
                  value={userInput}
                />
                <IconButton
                  className={`sm`}
                  onClick={handleValidation}
                  theme="check"
                  type="submit"
                >Check</IconButton>
              </form>
            )
          }
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`typed-answer-field-container`} id={`${id}`}>
        {htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

        <AudioClip soundFile={resolveAsset(soundFile)} label={``} />
        {showResult ?
          (<div className={`result comparison-result`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></div>)
          :
          (
            <>
              <Textarea
                onChange={handleChange}
                placeholder={`type your answer`}
                value={userInput}
              ></Textarea>
            </>
          )
        }
      </div>
      <div className={`help`}>
        <IconButton className={`hidden-help`} onClick={handleReset} theme={`reset`} >Reset</IconButton>
        <IconButton
          className={null}
          onClick={handleValidation}
          type={`submit`}
          theme={`check`}
        >Check</IconButton>
      </div>
    </>
  );
}
