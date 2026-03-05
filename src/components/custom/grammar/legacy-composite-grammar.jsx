import { AccordionArticle } from "@/components/Accordion";
import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PhraseTable } from "@/components/PhraseTable";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class LO2Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo2-grammar-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<AccordionArticle
					className={`mb-2`}
					config={{}}
					expandedByDefault
					id={id ? `${id}VerbsInFrench` : `LO2GrammarVerbsInFrench`}
					title={`1. Verbs in French`}
				>
					<Info>
						<p>In this section, you will practise the present tense of <em className={`grammar-term-em`}>être</em> so you can introduce yourself and others accurately.</p>
						<ul>
							<li>Match each French form to its English meaning.</li>
							<li>Notice how pronouns change the verb form.</li>
							<li>Use these patterns in later grammar and exercise tasks.</li>
						</ul>
					</Info>
					<div className={`panel standard-table`}>
						<p>There are many irregular verbs in French. The verb <AudioClip className={`link`} soundFile={`audio/lo2/vocabulary/011-etre.mp3`}><strong><em className={`grammar-term-em`}>être</em></strong></AudioClip> meaning <strong>to be</strong> is one of these. In fact, it has been
							described as the most irregular of all the irregulars! It is worth studying this verb now, not only for this reason,
							but because it occurs so frequently, and It will also enable you to master the subject pronouns.</p>
						<p><AudioClip className={`link`} soundFile={`audio/lo2/vocabulary/011-etre.mp3`}><strong><em className={`grammar-term-em`}>Être</em></strong></AudioClip> to be</p>
						<div className={`relative w-full overflow-auto`}>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>je suis</TableCell>
										<TableCell>I am</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/005-je-suis.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>tu es</TableCell>
										<TableCell>you are</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/017-tu-es.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell><a className={`modal-link`} href={`#content`} data-modal-target={`subject-pronouns-il`}>il</a> est</TableCell>
										<TableCell>he is, it is</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/003-il-est.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell><a className={`modal-link`} href={`#content`} data-modal-target={`subject-pronouns-elle`}>elle</a> est</TableCell>
										<TableCell>she is, it is</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/001-elle-est.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>nous sommes</TableCell>
										<TableCell>we are</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/016-nous-sommes.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>vous êtes</TableCell>
										<TableCell>you are</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/024-vous-etes.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell><a className={`modal-link`} href={`#content`} data-modal-target={`subject-pronouns-ils`}>ils</a> sont</TableCell>
										<TableCell>they are</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/004-ils-sont.mp3`} /></TableCell>
									</TableRow>
									<TableRow>
										<TableCell><a className={`modal-link`} href={`#content`} data-modal-target={`subject-pronouns-elles`}>elles</a> sont</TableCell>
										<TableCell>they are</TableCell>
										<TableCell><AudioClip className={`compact`} soundFile={`audio/lo2/grammar/grammar-and-usage/002-elles-sont.mp3`} /></TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				</AccordionArticle>
				<AccordionArticle
					className={`mb-2`}
					config={{}}
					id={id ? `${id}GrammaticalGenders` : `LO2GrammarGrammaticalGenders`}
					title={`2. Grammatical genders`}
				>
					<Info>
						<p>This section helps you recognise noun gender and choose the correct article in context.</p>
						<ul>
							<li>Identify masculine and feminine noun patterns.</li>
							<li>Use <em className={`grammar-term-em`}>un/une</em> and <em className={`grammar-term-em`}>le/la/l&apos;</em> appropriately.</li>
							<li>Apply article choice when nouns begin with a vowel or silent <em className={`grammar-term-em`}>h</em>.</li>
						</ul>
					</Info>
					<div className={`panel`}>
						<p>(I think this lends itself to illustration/pic ?)</p>
						<p>All French nouns have gender, not just people or animals but inanimate objects too.
							There are just two genders in French called masculine and feminine.
							This simply means that all nouns belong in one category or the other.
							Males e.g. father, uncle etc are masculine nouns and females e.g. mother, aunt etc are feminine nouns.
							Other nouns have intrinsic gender. This is not related to their owner, characteristics, manufacturer etc.
							It is possible to identify the gender of some nouns by their endings. (A list of these endings to be added/ linked)</p>
						<p>The pronoun <strong>iel</strong> is a gender-neutral singular pronoun, similar in concept to the English singular "they," used for someone who doesn't identify strictly as masculine or feminine. Keep in mind that verbs and adjectives still need to agree in French grammar, so usage can be more complex.</p>
						<p>The gender of the noun has implications for some grammatical features. e.g.</p>
						<h4>a. The indefinite article</h4>
						<p>There are two ways of saying 'a' in French:&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/020-un.mp3`}><strong>un</strong></AudioClip> for masculine nouns e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/018-un-homme.mp3`}><strong>un</strong> homme</AudioClip> (a man),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/019-un-metier.mp3`}><strong>un</strong> métier</AudioClip> (a profession/occupation) and&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/023-une.mp3`}><strong>une</strong></AudioClip> for a feminine noun e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/021-une-femme.mp3`}><strong>une</strong> femme</AudioClip> (a woman),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/022-une-profession.mp3`}><strong>une</strong> profession</AudioClip> (a profession).</p>
						<h4>b. The definite article</h4>
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
				</AccordionArticle>
				<AccordionArticle
					className={`mb-0`}
					config={{}}
					id={id ? `${id}SubjectPronouns` : `LO2GrammarSubjectPronouns`}
					target={`subject-pronouns`}
					title={`3. Subject pronouns.`}
				>
					<Info>
						<p>In this section, you will clarify how French subject pronouns map to people and grammatical gender.</p>
						<ul>
							<li>Distinguish singular and plural pronouns clearly.</li>
							<li>Understand when to use <em className={`grammar-term-em`}>il/elle</em> and <em className={`grammar-term-em`}>ils/elles</em>.</li>
							<li>Recognise the role of <em className={`grammar-term-em`}>iel</em> as a gender-neutral singular pronoun.</li>
						</ul>
					</Info>
					<div className={`panel`}>
						<ul>
							<li><strong>Il</strong> is used to replace a masculine noun.</li>
							<li><strong>Elle</strong> is used to replace a feminine noun.</li>
							<li><strong>Ils</strong> is used to replace more than one masculine noun or a mixture of masculine and feminine nouns.</li>
							<li><strong>Elles</strong> is used to replace more than one feminine noun.</li>
							<li><strong>iel</strong> is a gender-neutral singular pronoun.</li>
						</ul>
					</div>
				</AccordionArticle>
			</div>
		);
	};
}

export class LO3Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-grammar-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p><strong>1. A bit about verbs in French:</strong></p>
					<p>There are three groups of verbs in French. The biggest of these is called the&nbsp;
						<strong>-er</strong> group, simply because the infinitive ends with the letters&nbsp;
						<strong>-er</strong>.&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/056-parler.mp3`}>Parler</AudioClip> (to speak),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/019-habiter.mp3`}>habiter</AudioClip> (to live),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/004-chanter.mp3`}>chanter</AudioClip> (to sing),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/007-danser.mp3`}>danser</AudioClip> (to dance) are examples of <strong>-er</strong> verbs.</p>
					<p><strong>NB</strong> There is only <strong>ONE present tense</strong> in French, so you translate je parle either as 'I speak' or 'I am speaking'
						depending on the context.</p>
					<Table variant="learning">
						<thead>
							<TableRow>
								<th>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/056-parler.mp3`}>parler</AudioClip></th>
								<th>to speak</th>
							</TableRow>
						</thead>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/030-je-parle.mp3`}>je parle</AudioClip></TableCell>
								<TableCell>I speak / am speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/059-tu-parles.mp3`}>tu parles</AudioClip></TableCell>
								<TableCell>you speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/023-il-parle.mp3`}>il parle</AudioClip></TableCell>
								<TableCell>he / it speaks / is speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/010-elle-parle.mp3`}>elle parle</AudioClip></TableCell>
								<TableCell>she / it speaks / is speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/053-nous-parlons.mp3`}>nous parlons</AudioClip></TableCell>
								<TableCell>we speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/shared/064-vous-parlez.mp3`}>vous parlez</AudioClip></TableCell>
								<TableCell>you speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/shared/026-ils-parlent.mp3`}>ils parlent</AudioClip></TableCell>
								<TableCell>they speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/013-elles-parlent.mp3`}>elles parlent</AudioClip></TableCell>
								<TableCell>they speak / are speaking</TableCell>
							</TableRow>
						</TableBody>
					</Table><p><strong>venir</strong> is a common irregular verb.</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/063-venir-de.mp3`}><strong>venir de</strong></AudioClip> to come from</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/046-je-viens.mp3`}>je viens</AudioClip> (de Marseille)
								</TableCell>
								<TableCell>I come (from Marseille)...</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/060-tu-viens.mp3`}>tu viens</AudioClip>
								</TableCell>
								<TableCell>you come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/024-il-vient.mp3`}>il vient</AudioClip>
								</TableCell>
								<TableCell>he/it comes</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/011-elle-vient.mp3`}>elle vient</AudioClip>
								</TableCell>
								<TableCell>she/it comes</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/055-nous-venons.mp3`}>nous venons</AudioClip>
								</TableCell>
								<TableCell>we come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/065-vous-venez.mp3`}>vous venez</AudioClip>
								</TableCell>
								<TableCell>you come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/027-ils-viennent.mp3`}>ils viennent</AudioClip>
								</TableCell>
								<TableCell>they come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/015-elles-viennent.mp3`}>elles viennent</AudioClip>
								</TableCell>
								<TableCell>they come</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div
					className={`panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p><strong>2 De</strong></p>
					<p><strong>NB</strong> The word <strong>de</strong> occurs in French with a variety of meanings. Here it means from, and it's followed by a place name. Look at the following examples illustrating the forms:</p>
					<p>Je viens <span className="ped-neg"><strong>de</strong></span> Paris (for towns, cities, villages)</p>
					<p>Je viens <span className="ped-affirm"><strong>de</strong></span> Belgique (for feminine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-neutral"><strong>d'</strong></span>Angleterre (for all singular place names beginning with a vowel or mute h)</p>
					<p>Je viens <span className="ped-accent"><strong>du</strong></span> Canada (for masculine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-warn"><strong>des</strong></span> Seychelles (for plural countries)</p>
				</div>
				<div
					className={`panel`}
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<p><strong>3 Feminine forms of professions and adjectives</strong></p>
					<p>When describing a female or any feminine noun, you will often see the addition of a letter or letters to the original masculine
						noun or adjective.</p>
					<ul>
						<li>If the ending is <strong>e</strong> there is no addition: both masculine and feminine are the the same e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/003-celibataire.mp3`}>célibataire</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/047-journaliste.mp3`}>journaliste</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/058-serbe.mp3`}>serbe</AudioClip> etc.
						</li>
						<li>If the last letter is a consonant, then generally <strong>e</strong>{' '}is added to form the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/017-etudiant.mp3`}>étudiant</AudioClip> (m)&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/018-etudiante.mp3`}>étudiante</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/005-chinois.mp3`}>chinois</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/006-chinoise.mp3`}>chinoise</AudioClip> (f) <strong>NB</strong>&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/052-medecin.mp3`}>médecin</AudioClip> is an exception -&nbsp;
							this is for both a male and female doctor.
						</li>
						<li>If the final letter is <strong>é</strong>, then an <strong>e</strong>{' '}is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/050-marie.mp3`}>marié</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/051-mariee.mp3`}>mariée</AudioClip> (f)
						</li>
						<li>If the ending is <strong>en</strong>, <strong>ne</strong>{' '}is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/028-informaticien.mp3`}>informaticien</AudioClip> (m) /&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/029-informaticienne.mp3`}>informaticienne</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/001-australien.mp3`}>australien</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/002-australienne.mp3`}>australienne</AudioClip> (f)
						</li>
					</ul>
				</div>
			</div>
		);
	};
}

