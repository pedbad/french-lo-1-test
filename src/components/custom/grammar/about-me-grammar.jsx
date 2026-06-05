import { AudioClip } from "@/components/AudioClip";
import { PhraseTable } from "@/components/PhraseTable";
import { PureComponent } from "react";

const highlightClass = "modal-highlight-flash font-semibold text-[var(--edu-accent)]";

export const AboutMeSubjectPronounsBody = ({ highlightTarget = "" } = {}) => {
  const isActive = (target) => highlightTarget === target;
  const highlight = (target) => (isActive(target) ? highlightClass : "");

  return (
    <>
      <div className={`space-y-2`}>
        {/* <p> → <div> throughout: WAVE flags short paragraphs starting with
				    bold text as "possible headings". These are definitional statements,
				    not headings, so <div> is the correct fix. */}
        <div>
          <span className={`modal-link-target ${highlight("subject-pronouns-il")}`} id={`subject-pronouns-il`}>
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/003-il-est.mp3`}><strong>Il</strong></AudioClip> is used to replace a masculine noun.
          </span>
        </div>
        <div>
          <span className={`modal-link-target ${highlight("subject-pronouns-elle")}`} id={`subject-pronouns-elle`}>
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/001-elle-est.mp3`}><strong>Elle</strong></AudioClip> is used to replace a feminine noun.
          </span>
        </div>
        <div>
          <span className={`modal-link-target ${highlight("subject-pronouns-ils")}`} id={`subject-pronouns-ils`}>
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/004-ils.mp3`}><strong>Ils</strong></AudioClip> is used to replace more than one masculine noun or a mixture of masculine and feminine nouns.
          </span>
        </div>
        <div>
          <span className={`modal-link-target ${highlight("subject-pronouns-elles")}`} id={`subject-pronouns-elles`}>
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/002-elles.mp3`}><strong>Elles</strong></AudioClip> is used to replace more than one feminine noun.
          </span>
        </div>
        <div>
          <span className={`modal-link-target ${highlight("subject-pronouns-iel")}`} id={`subject-pronouns-iel`}>
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/025-iel.mp3`}><strong>iel</strong></AudioClip> is a gender-neutral singular pronoun.
          </span>
        </div>
      </div>
    </>
  );
};

// LO2 grammar components deliberately omit an h3 inside the accordion panel body.
// The accordion header (rendered by AccordionArticle) already carries the section
// title as an h3, and the heading hierarchy is complete without a duplicate inside
// the panel. This differs from LO1 where content h3s are present but visually hidden
// via CSS — the LO1 approach was needed because LO1 custom components pre-dated the
// accordion header pattern. LO2 onwards should follow this cleaner approach.
export class AboutMeGrammarVerbs extends PureComponent {
  render = () => {
    const { id } = this.props;
    const tableId = id ? `${id}-verbs` : `AboutMeGrammarVerbs-verbs`;
    const tableConfig = {
      id: tableId,
      sortable: false,
      // Temporary spacing workaround: avoid nested `.container` horizontal padding
      // because this PhraseTable sits inside an already padded grammar accordion panel.
      // TODO: remove once PhraseTable adopts a first-class panel/layout spacing API.
      disableContainerPadding: true,
      phrases: [
        [
          "audio/lo2/vocabulary/011-etre.mp3",
          "être",
          "to be",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/005-je-suis.mp3",
          "je suis",
          "I am",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/017-tu-es.mp3",
          "tu es",
          "you are",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/003-il-est.mp3",
          "<a class='modal-link' href='#content' data-modal-target='subject-pronouns-il'>il</a> est",
          "he is, it is",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/001-elle-est.mp3",
          "<a class='modal-link' href='#content' data-modal-target='subject-pronouns-elle'>elle</a> est",
          "she is, it is",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/016-nous-sommes.mp3",
          "nous sommes",
          "we are",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/024-vous-etes.mp3",
          "vous êtes",
          "you are",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/004-ils.mp3",
          "<a class='modal-link' href='#content' data-modal-target='subject-pronouns-ils'>ils</a> sont",
          "they are",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/002-elles.mp3",
          "<a class='modal-link' href='#content' data-modal-target='subject-pronouns-elles'>elles</a> sont",
          "they are",
        ],
        [
          "audio/lo2/grammar/grammar-and-usage/025-iel.mp3",
          "<a class='modal-link' href='#content' data-modal-target='subject-pronouns-iel'>iel</a>",
          "is a gender-neutral singular pronoun",
        ],
      ],
    };
    return (
      <div className={`lo2-grammar1-container container`} id={id || undefined} key={`${id}CustomComponent`}>
        <div className={`panel`} id={id ? `${id}Panel1` : undefined} key={`${id}Panel1`}>
          <p>There are many irregular verbs in French. The verb <AudioClip className={`link`} soundFile={`audio/lo2/vocabulary/011-etre.mp3`}><strong><em className={`grammar-term-em`}>être</em></strong></AudioClip> meaning <strong>to be</strong> is one of these. In fact, it has been
						described as the most irregular of all the irregulars! It is worth studying this verb now, not only for this reason,
						but because it occurs so frequently, and It will also enable you to master the subject pronouns.</p>
          <PhraseTable config={tableConfig} targetLanguageCode={`fr`} />
        </div>
      </div>
    );
  };
}

export class AboutMeGrammarGenderAndArticles extends PureComponent {
  render = () => {
    const { id } = this.props;
    return (
      <div className={`lo2-grammar2-container container`} id={id || undefined} key={`${id}CustomComponent`}>
        <div className={`panel`} id={id ? `${id}Panel2` : undefined} key={`${id}Panel2`}>
          <p>All French nouns have gender, not just people or animals but inanimate objects too.
						There are just two genders in French called masculine and feminine.
						This simply means that all nouns belong in one category or the other.
						Males e.g. father, uncle etc are masculine nouns and females e.g. mother, aunt etc are feminine nouns.
						Other nouns have intrinsic gender. This is not related to their owner, characteristics, manufacturer etc.
						It is possible to identify the gender of some nouns by their endings. (A list of these endings to be added/ linked)</p>
          <p>The pronoun <strong>iel</strong> is a gender-neutral singular pronoun, similar in concept to the English singular "they," used for someone who doesn't identify strictly as masculine or feminine. Keep in mind that verbs and adjectives still need to agree in French grammar, so usage can be more complex.</p>
          <p>The gender of the noun has implications for some grammatical features. e.g.</p>
          <h4 className="grammar-sub-heading">a. The indefinite article</h4>
          <p>There are two ways of saying 'a' in French:&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/020-un.mp3`}><strong>un</strong></AudioClip> for masculine nouns e.g.&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/018-un-homme.mp3`}><strong>un</strong> homme</AudioClip> (a man),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/019-un-metier.mp3`}><strong>un</strong> métier</AudioClip> (a profession/occupation) and&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/023-une.mp3`}><strong>une</strong></AudioClip> for a feminine noun e.g.&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/021-une-femme.mp3`}><strong>une</strong> femme</AudioClip> (a woman),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/022-une-profession.mp3`}><strong>une</strong> profession</AudioClip> (a profession).</p>
          <h4 className="grammar-sub-heading">b. The definite article</h4>
          <p>For singular nouns, to say 'the' you use&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/015-le.mp3`}><strong>le</strong></AudioClip> for masculine nouns e.g.&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/014-le-professeur.mp3`}><strong>le</strong> professeur</AudioClip> (the [male] teacher),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/013-le-jour.mp3`}><strong>le</strong> jour</AudioClip> (the day). For feminine nouns you say&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/012-la.mp3`}><strong>la</strong></AudioClip> e.g.&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/011-la-professeure.mp3`}><strong>la</strong> professeure</AudioClip> (the [female] teacher),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/010-la-nuit.mp3`}><strong>la</strong> nuit</AudioClip> (the night).
						When the singular noun begins with a vowel or mute h, then you use&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/006-l.mp3`}><strong>l'</strong></AudioClip> regardless of gender e.g.&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/007-l-appartement.mp3`}><strong>l'</strong>appartement</AudioClip> (m) (the flat),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/008-l-ecole.mp3`}><strong>l'</strong>école</AudioClip> (f) (the school),&nbsp;
            <AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/009-l-homme.mp3`}><strong>l'</strong>homme</AudioClip> (the man).</p>
        </div>
      </div>
    );
  };
}

export class AboutMeGrammarSubjectPronouns extends PureComponent {
  render = () => {
    const { id } = this.props;
    return (
      <div className={`lo2-grammar3-container container`} id={id || undefined} key={`${id}CustomComponent`}>
        <div className={`panel`} id={id ? `${id}Panel3` : undefined} key={`${id}Panel3`}>
          <div className={`modal-link-target`} id={`subject-pronouns`} />
          <AboutMeSubjectPronounsBody />
        </div>
      </div>
    );
  };
}
