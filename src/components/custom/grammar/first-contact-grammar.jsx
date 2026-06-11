import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { memo } from "react";

const highlightClass = "modal-highlight-flash font-semibold text-[var(--edu-accent)]";

export const FirstContactGrammarFormsOfAddress = memo(function FirstContactGrammarFormsOfAddress({ id }) {
  return (
    <div id={id || undefined}>
      <h3>1. Forms of address and politeness</h3>
      <Grammar1Body />
    </div>
  );
});

export const Grammar1Body = ({ highlightIntro = false, showInfoBox = false } = {}) => {
  const abbreviationsList = (
    <>
      {/* Replaced a table with a definition list for clearer HTML5 term/definition semantics (also reused by modal content so AudioClip stays React-rendered). */}
      <dl className="abbreviations abbreviations-inline">
        <dt>Abbreviations</dt>
        <dd>
					Monsieur — <strong>M</strong>. · Madame — <strong>Mme</strong>. · Mademoiselle — <strong>Mlle</strong>.
        </dd>
      </dl>
    </>
  );

  return (
    <>
      <p><span className={`modal-link-target ${highlightIntro ? highlightClass : ""}`} id={`madame`}>In French there is no equivalent to the English Ms.
				To be politically correct a woman is addressed as <AudioClip className={`link`} soundFile={`audio/lo1/grammar/titles/001-madame.mp3`}><strong>Madame</strong></AudioClip>{" "}regardless of her marital status unless she is unmarried and specifies that she wishes to be addressed as&nbsp;
      </span><span className={`modal-link-target`} id={`mademoiselle`} ><AudioClip className={`link`} soundFile={`audio/lo1/grammar/titles/002-mademoiselle.mp3`}><strong>Mademoiselle</strong></AudioClip>. <strong>Mademoiselle</strong> is otherwise reserved
				for a teenage girl.</span></p>
      {showInfoBox ? <Info>{abbreviationsList}</Info> : abbreviationsList}
    </>
  );
};

export const FirstContactGrammarTuVous = memo(function FirstContactGrammarTuVous({ id }) {
  return (
    <div id={id || undefined}>
      <h3>2. The "<em className={`grammar-term-em`}>tu</em>" vs "<em className={`grammar-term-em`}>vous</em>" distinction</h3>
      <Grammar2Body />
    </div>
  );
});

export const Grammar2Body = ({ highlightIntro = false } = {}) => (
  <>
    <div><span className={`modal-link-target ${highlightIntro ? highlightClass : ""}`} id={`tuvous`}>
      <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/001-tu.mp3`}><strong><em className={`grammar-term-em`}>Tu</em></strong></AudioClip>{' '}
			and{' '}
      <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/002-vous.mp3`}><strong><em className={`grammar-term-em`}>vous</em></strong></AudioClip>{' '}
			both mean 'you'.</span></div>
    <p><strong>Tu</strong> is used when addressing one person and is familiar. That means you use it when speaking to your partner, a relative, a friend,
			a classmate or a child etc. <span className={`modal-link-target`} id={`toi`} >When returning question i.e. when you ask 'and you?' you use the
		form&nbsp;
    <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/003-toi.mp3`}><strong>toi</strong></AudioClip> instead of&nbsp;
    <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/001-tu.mp3`}><strong>tu:</strong></AudioClip>&nbsp;
    <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/004-je-mappelle-michel-et-toi.mp3`}><strong>Je m'appelle Michel, et toi ?</strong></AudioClip></span></p>
    <p>You use <AudioClip className={`link`} soundFile={`audio/lo1/grammar/tu-vous/002-vous.mp3`}><strong>vous</strong></AudioClip> when addressing an adult that you don't know e.g.
			a shop assistant, bus driver, waiting staff etc or an adult to whom you wish to show a degree of distance or respect e.g. your professor,
			a health professional, a legal advisor, an acquaintance of your parents etc.</p>
    <p><strong>Vous</strong> is also used when addressing more than one person
			whatever your relationship to them.</p>
  </>
);
