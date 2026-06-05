import {
  AudioClip,
  IconButton,
} from '../';
import { resolveAsset } from '../../utils/assets';
import { highlightTextDiff } from '../../utils/exerciseDiff';
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { Input } from "@/components/ui/input";
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
export class TypedAnswerField extends React.PureComponent {
  constructor(props) {
    super(props);

    const {
      compact = false,
      content,
      soundFile,
      config
    } = this.props;
    if (config) {
      this.state = ({
        ...props.config,
        compact: compact,
        showResult: false,
      });
    } else {
      this.state = ({
        compact: compact,
        content: content,
        showResult: false,
        soundFile: soundFile,
      });
    }

    // this.countCorrect = this.countCorrect.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleValidation = this.handleValidation.bind(this);
    // this.handleReset = this.handleReset.bind(this);
    // this.highlightTextDiff = this.highlightTextDiff.bind(this);

  }

  handleChange = (e) => {
    // console.log("handleChange");
    this.setState({userInput: e.target.value});
  };

  handleReset = () => {
    // console.log("handleReset");
    this.setState({
      showResult: false,
      userInput: "",
    });
  };

  handleValidation = () => {
    // console.log("handleValidation");
    this.setState({
      showResult: true,
    });
  };

  handleKeyPress = (e) => {
    // console.log("handleKeyPress");
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleValidation;
    }
  };

  countCorrect = () => {
    let {
      nCorrect,
    } = this.state;
    nCorrect++;
    this.setState({
      nCorrect: nCorrect,
    });
  };

  render = () => {
    const {
      compact,
      content,
      htmlContent,
      id,
      // instructionsText,
      // instructionsTextHTML,
      showResult = false,
      soundFile,
      userInput = ``,
    } = this.state;
    // const {
    // 	countCorrect
    // } = this.props;


    let text = userInput;
    const { comparisonOptions } = this.props;
    if (showResult) text = highlightTextDiff(userInput, content, this.countCorrect, false, comparisonOptions);

    if (compact) {
      const {
        id,
      } = this.props;

      return (
        <>

          <div className={`typed-answer-field-container compact` } id={`typed-answer-field-${id}`} >
            {showResult ?
              (<div className={`comparison-result compact`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></div>)
              :
              (
                <form onKeyPress={this.handleKeyPress}>
                  {compact ?
                    <Input
                      id={`typed-answer-field-${id}-text`}
                      name={`typed-answer-field-${id}-text`}
                      onChange={this.handleChange}
                      placeholder={`type your answer`}
                      type='text'
                      value={userInput}
                    />
                    :
                    <Textarea
                      onChange={this.handleChange}
                      placeholder={`type your answer`}
                      value={userInput}
                    ></Textarea>
                  }
                  <Button
                    className={`${compact ? 'sm' : null}`}
                    htmlFor={`typed-answer-field-${id}-text`}
                    onClick={this.handleValidation}
                    type={`submit`}
                  >Check</Button>
                </form>
              )
            }
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={`typed-answer-field-container`} id={`${id}`} key={`${id}`} >
            {/* <Button className={`reset btn`} onClick={this.handleReset}>Reset</Button> */}
            {htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

            <AudioClip soundFile={resolveAsset(soundFile)} label={``} />
            {showResult ?
              (<div className={`result comparison-result`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></div>)
              :
              (
                <>
                  <Textarea
                    onChange={this.handleChange}
                    placeholder={`type your answer`}
                    value={userInput}
                  ></Textarea>
                </>
              )
            }
          </div>
          <div className={`help`}>
            {!compact ? <IconButton className={`hidden-help`} onClick={this.handleReset} theme={`reset`} >Reset</IconButton> : null}
            <IconButton
              className={`${compact ? 'sm' : null}`}
              onClick={this.handleValidation}
              type={`submit`}
              theme={`check`}
            >Check</IconButton>
          </div>
        </>
      );

    }
  };
}
