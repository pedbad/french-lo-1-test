import { AudioClip } from "@/components/AudioClip";
import { memo } from "react";

export const MakingArrangementsPronunciationUiSound = memo(function MakingArrangementsPronunciationUiSound({ id }) {
  return (
    <div className={`lo10-demystify1-container container`} id={id || undefined}>
      <div className={`panel pronunciation-panel`} id={id ? `${id}Panel1` : undefined}>
        <h3>1. The French ui sound</h3>
        <div className={`pronunciation-content`}>
          <div className={`pronunciation-text`}>
            <p>
								In words like <strong>aujourd&apos;hui</strong> and <strong>bruit</strong>,
								the letters <strong>ui</strong> combine into one distinctive French sound.
								Listen and repeat these examples:
            </p>
            <div className="mb-0 ml-2 space-y-1">
              <div>
                <AudioClip
                  className="link"
                  soundFile="audio/lo10/pronunciation/ui-sound/001-aujourdhui.mp3"
                >
										aujourd&apos;hui
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/002-bruit.mp3">
										bruit
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/003-ensuite.mp3">
										ensuite
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/004-gratuit.mp3">
										gratuit
                </AudioClip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const MakingArrangementsPronunciationMoreUiWords = memo(function MakingArrangementsPronunciationMoreUiWords({ id }) {
  return (
    <div className={`lo10-demystify2-container container`} id={id || undefined}>
      <div className={`panel pronunciation-panel`} id={id ? `${id}Panel2` : undefined}>
        <h3>2. More words with ui</h3>
        <div className={`pronunciation-content`}>
          <div className={`pronunciation-text`}>
            {/* <p>→<div>: short label triggers WAVE "possible heading" */}
            <div>Practise the same sound in a few more useful words:</div>
            <div className="mb-0 ml-2 space-y-1">
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/005-minuit.mp3">
										minuit
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/006-nuit.mp3">
										nuit
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/007-puis.mp3">
										puis
                </AudioClip>
              </div>
              <div>
                <AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/008-suis.mp3">
										suis
                </AudioClip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
