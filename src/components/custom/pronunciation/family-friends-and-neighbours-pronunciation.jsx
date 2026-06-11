import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { memo } from "react";

export const FamilyFriendsAndNeighboursPronunciationDoubleLlAsL = memo(function FamilyFriendsAndNeighboursPronunciationDoubleLlAsL({ id }) {
  return (
    <div className={`lo6-demystify1-container container`} id={id || undefined}>
      <div className={`panel pronunciation-panel`} id={id ? `${id}Panel1` : undefined}>
        <h3>1. Double ll pronounced l</h3>
        <div className={`pronunciation-content`}>
          <div className={`pronunciation-text`}>
            <h4 className="pronunciation-sub-label">How to pronounce double ll in French:</h4>
            <p><strong>Double ll</strong> is sometimes mispronounced by learners of French, but the following rules should help to avoid this problem.</p>
            <p>
								After the vowels <strong>a</strong>, <strong>e</strong>, <strong>o</strong>,
								and <strong>u</strong>,{" "}
              <AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/006-ll-a.mp3`}>
                <strong>double ll</strong>
              </AudioClip>
              {" "}is pronounced <strong>l</strong>. Listen to these examples:
            </p>
            <div className={`mb-0 ml-2 space-y-1`}>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/012-une-balle.mp3`}><strong>une balle</strong></AudioClip>{" "}(a ball)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/001-elle-est-belle.mp3`}><strong>Elle est belle.</strong></AudioClip>{" "}(She is beautiful.)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/002-elle-est-folle.mp3`}><strong>Elle est folle.</strong></AudioClip>{" "}(She is crazy.)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/014-une-bulle.mp3`}><strong>une bulle</strong></AudioClip>{" "}(a bubble)</div>
            </div>
            {/* <p>→<div>: short plain text triggers WAVE "possible heading" */}
            <div>There are no exceptions here!</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const FamilyFriendsAndNeighboursPronunciationDoubleLlAsY = memo(function FamilyFriendsAndNeighboursPronunciationDoubleLlAsY({ id }) {
  return (
    <div className={`lo6-demystify2-container container`} id={id || undefined}>
      <div className={`panel pronunciation-panel`} id={id ? `${id}Panel2` : undefined}>
        <h3>2. Double ll pronounced y</h3>
        <div className={`pronunciation-content`}>
          <div className={`pronunciation-text`}>
            <p>
								After the vowel <strong>i</strong>,{" "}
              <AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/007-ll-b.mp3`}>
                <strong>double ll</strong>
              </AudioClip>
              {" "}is pronounced like the English letter <strong>y</strong>. Listen to these examples:
            </p>
            <div className={`mb-0 ml-2 space-y-1`}>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/017-une-fille.mp3`}><strong>une fille</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/015-une-famille.mp3`}><strong>une famille</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/009-un-billet.mp3`}><strong>un billet</strong></AudioClip>{" "}(a ticket)</div>
            </div>
            <p>
								If the vowel <strong>i</strong> is preceded by another vowel, the same rule
								applies:
            </p>
            <div className={`mb-0 ml-2 space-y-1`}>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/013-une-bouteille.mp3`}><strong>une bouteille</strong></AudioClip>{" "}(a bottle)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/016-une-feuille.mp3`}><strong>une feuille</strong></AudioClip>{" "}(a leaf)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const FamilyFriendsAndNeighboursPronunciationExceptions = memo(function FamilyFriendsAndNeighboursPronunciationExceptions({ id }) {
  return (
    <div className={`lo6-demystify3-container container`} id={id || undefined}>
      <div className={`panel pronunciation-panel`} id={id ? `${id}Panel3` : undefined}>
        <h3>3. Exceptions</h3>
        <div className={`pronunciation-content`}>
          <div className={`pronunciation-text`}>
            <p>There are a few exceptions when double <strong>ll</strong> follows <strong>i</strong>. Here are some common ones to practise:</p>
            <div className={`mb-0 ml-2 space-y-1`}>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/004-la-ville.mp3`}><strong>la ville</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/005-le-village.mp3`}><strong>le village</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/003-la-villa.mp3`}><strong>la villa</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/008-mille.mp3`}><strong>mille</strong></AudioClip>{" "}(a thousand)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/011-un-million.mp3`}><strong>un million</strong></AudioClip>{" "}(a million)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/010-un-milliard.mp3`}><strong>un milliard</strong></AudioClip>{" "}(a billion)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/shared/004-tranquille.mp3`}><strong>tranquille</strong></AudioClip>{" "}(quiet)</div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/shared/003-lille.mp3`}><strong>Lille</strong></AudioClip></div>
              <div><AudioClip className={`link`} soundFile={`audio/lo6/shared/002-gilles.mp3`}><strong>Gilles</strong></AudioClip></div>
            </div>
            <div className="mt-3">
              <Info variant="warning">
                {/* h4→p: heading inside an Info box is redundant */}
                <p>
                  <strong>NB</strong> The best thing to do is to learn these common exception
										words by heart.
                </p>
              </Info>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
