import DOMPurify from "dompurify";
import { memo } from 'react';
import { Panel } from "./Panel";

// This was intended as a way to allow custom content to be included in a config.json file.
// However, it's hard to work with a single line of HTML and although I've used it elsewhere too, dangerouslySetInnerHTML
// is not a recommended practise. So as an alternative, I created CustomComponents where a custom component can be made as a more
// readable JSX content with images and individual styling, it can still be accessed by using a config.json tag such as:
// "customComponent1": {
// 	"component": "LO9Grammar", // There must be a CustomComponet with this name present. "LO9" is the learning object, "Grammar" aludes to the section within the page.
// 	"id": "LO9Grammar", // Good practise to have the ID match the component name
// 	"titleText": "Grammar and Usage"
// },
function ExplanationComponent({ config }) {
  const {
    content = [],
    htmlContent,
    id,
    panelClassName,
  } = config;

  return (
    <div
      className={`explanation-container standard-table container`}
      id={id || undefined}
    >
      {htmlContent ? <div className={`html-content`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> : null}

      {content.map((item, i) => (
        <Panel
          className={panelClassName}
          id={`${id}-${i}`}
          content={item}
          key={`${id}-Panel${i}`}
        />
      ))}
    </div>
  );
}

export const Explanation = memo(ExplanationComponent);
