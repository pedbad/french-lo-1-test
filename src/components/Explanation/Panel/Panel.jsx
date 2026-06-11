import { memo } from 'react';
import { resolveAssetHTML } from '../../../utils/assets.js';

function PanelComponent({ className, content, id }) {
  return (
    <div
      className={`panel mt-4 w-[calc(100%-2rem)] p-4 ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: resolveAssetHTML(content) }}
      id={id ? `${id}Panel` : undefined}
    >
    </div>
  );
}

export const Panel = memo(PanelComponent);
