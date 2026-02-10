import './CustomComponents_FR.scss';
import '../RadioQuiz/RadioQuiz.scss';
import {
	Attribution,
	AudioClip,
	Figure,
	Info,
	RadioQuiz
} from '..';
import { Component, PureComponent } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	// TableHead,
	// TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	resolveAsset,
} from '../../utility';

// This was intended as a way to allow custom content to be included in a config.json file.
// However, it's hard to work with a single line of HTML (as used in the Explanation component) and although I've used it elsewhere too, dangerouslySetInnerHTML
// is not a recommended practise. So as an alternative, I created CustomComponents where a custom component can be made as a more
// readable JSX content with images and individual styling, it can still be accessed by using a config.json tag such as:
// "explanation1": {
// 	"component": "LO9Grammar", // There must be a CustomComponet with this name present. "LO9" is the learning object, "Grammar" aludes to the section within the page.
// 	"id": "LO9Grammar", // Good practise to have the ID match the component name
// 	"titleText": "Grammar and Usage"
// },

export class LO1Grammar1 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo1-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent1`}
				>
					<h3>1. Forms of address and politeness</h3>
					<p>You will learn:</p>
					<ul><li>When to use Monsieur, Madame, and Mademoiselle.</li><li>Abbreviations: M., Mme., Mlle.</li></ul>

					<p><span className={`special-anchor-target`} id={`madame`} name={`madame`}>In French there is no equivalent to the English Ms.
						To be politically correct a woman is addressed as <AudioClip className={`link`} soundFile={`/sounds/fr/Madame.mp3`}><b>Madame</b></AudioClip> regardless of her marital status unless she is unmarried and specifies that she wishes to be addressed as&nbsp;
					</span><span className={`special-anchor-target`} id={`mademoiselle`} name={`mademoiselle`} ><AudioClip className={`link`} soundFile={`/sounds/fr/Mademoiselle.mp3`}><b>Mademoiselle</b></AudioClip>. <b>Mademoiselle</b> is otherwise reserved
						for a teenage girl.</span></p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Abbreviations:</TableCell>
								<TableCell>Monsieur - <b>M</b>.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Madame - <b>Mme</b>.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Mademoiselle - <b>Mlle</b>.</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}

export class LO1Grammar2 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo2-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel2` : ''}`}
					key={`${id}CustomComponent2`}
				>
					<h3>2. The “tu” vs “vous” distinction</h3>
					<p>You will learn:</p>
					<ul>
						<li>How to use <i>tu</i> with friends, family, and children.</li>
						<li>How to use <i>vous</i> formally or when speaking to several people.</li>
						<li>How <i>toi</i> replaces <i>tu</i> in responses (<i>Et toi ?</i>).</li>
					</ul>
					<p><span className={`special-anchor-target`} id={`tuvous`} name={`tuvous`}>2&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/tu.mp3`}><b>Tu</b></AudioClip> and&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><b>vous</b></AudioClip>&nbsp;both mean 'you'.</span></p>
					<p><b>Tu</b> is used when addressing one person and is familiar. That means you use it when speaking to your partner, a relative, a friend,
						a classmate or a child etc. <span className={`special-anchor-target`} id={`toi`} name={`toi`} >When returning question i.e. when you ask 'and you?' you use the
						form&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/toi.mp3`}><b>toi</b></AudioClip> instead of&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/tu.mp3`}><b>tu:</b></AudioClip>&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Je m'appelle Michel et toi.mp3`}><b>Je m'appelle Michel, et toi ?</b></AudioClip></span></p>
					<p>You use <AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><b>vous</b></AudioClip> when addressing an adult that you don't know e.g.
						a shop assistant, bus driver, waiting staff etc or an adult to whom you wish to show a degree of distance or respect e.g. your professor,
						a health professional, a legal advisor, an acquaintance of your parents etc.</p>
					<p><b>Vous</b> is also used when addressing more than one person
						whatever your relationship to them.</p>
				</div>
			</div>
		);
	};
}

export class LO1Demystify1 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo1-demystify1-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<Info>
					<p>In this part, you'll focus on mastering the French nasal sounds found in words like bonjour and bonsoir.
						You'll learn how airflow through your nose and mouth creates this unique sound in French.</p>
				</Info>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}Panel`}
				>
					<h3>1. Nasal vowels: "on / om"</h3>
					{/* <img src={resolveAsset(`images/nose-pinch.png`)} title={`Speak while pinching your nose`} /> */}
					<div className={`text`}>
						<p>1 <AudioClip className={`link`} soundFile={`sounds/fr/on om.mp3`} ><b>-on</b> / <b>om</b></AudioClip></p>
						<p>In French there are some sounds known as nasal vowels: o followed by n or m is one of these. (sound file -on)
						In this first topic you will have encountered this sound in the words <AudioClip className={`link`} soundFile={`sounds/fr/Bonjour.mp3`} >bonjour</AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/Bonsoir.mp3`} >bonsoir</AudioClip>.
						The sound is created as air comes through both nose and mouth. If you have a slight cold or pinch your nose you will be able to produce the sound without difficulty!</p>
					</div>
				</div>
			</div>
		);
	};
}
export class LO1Demystify2 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo1-demystify2-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<Info>
					<p>Here, you'll practise producing the French <AudioClip className={`link`} soundFile={`sounds/fr/r.mp3`} ><i>r</i></AudioClip>, which is formed at the back of the throat - quite different from the English r. You'll learn to feel the vibration when pronouncing it and recognise it in words like <i>bonjour</i>, <i>bonsoir</i>, and <i>au revoir</i>.</p>
				</Info>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel2` : ''}`}
					key={`${id}Panel2`}
				>
					<h3>2. The French "<AudioClip className={`link`} soundFile={`sounds/fr/r.mp3`} >r</AudioClip>"</h3>
					<p>The letter <AudioClip className={`link`} soundFile={`sounds/fr/r.mp3`} ><b>r</b></AudioClip> in French can prove tricky to begin with, so it's worth practising it right way.
						It isn't the same sound as in English formed at the front of the mouth nor is it the rolled r of Spanish.
						It is formed in the throat. If you clear your throat first thing in the morning or when you are about to make an announcement,
						the French <AudioClip className={`link`} soundFile={`sounds/fr/r.mp3`} ><b>r</b></AudioClip> is made in that very place. If you place your fingers on your neck, you should feel a very slight vibration.
						You will have encountered this sound in the words <AudioClip className={`link`} soundFile={`sounds/fr/Bonjour.mp3`} >bonjou<b>r</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Bonsoir.mp3`} >bonsoi<b>r</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Au revoir.mp3`} >au <b>r</b>evoi<b>r</b></AudioClip>.</p>
					<p>It is worth noting that the pronunciation of the letter <b>r</b> may vary across the French speaking world.</p>
				</div>
			</div>
		);
	};
}

export class LO1Demystify3 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo1-demystify3-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<Info>
					<p>In this section, you'll learn how to pronounce oi as in moi, toi, and au revoir. You'll also become familiar with this common sound pattern across many French words.</p>
				</Info>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}Panel`}
				>
					<h3>3. The sound "<AudioClip className={`link`} soundFile={`sounds/fr/oi.mp3`} >oi</AudioClip>"</h3>
					<p>It is worth being aware of this sound as the letter combination <b>oi</b> appears in many French words e.g. <AudioClip className={`link`} soundFile={`sounds/fr/moi.mp3`} >m<b>oi</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/toi.mp3`} >t<b>oi</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Au revoir.mp3`} >au rev<b>oi</b>r</AudioClip>
					</p>
				</div>
			</div>
		);
	};
}

export class LO1Demystify4 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo1-demystify4-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<Info>
					<p>Finally, you'll find out why the letter <i>h</i> is never pronounced in French. You'll see examples like homme, horrible, and horizon, where the <i>h</i> remains completely silent.</p>
				</Info>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}Panel`}
				>
					<img
						alt="lady with finger to lips.Shh"
						src={resolveAsset('images/shh.jpg')}
						style={{
							border: '1px solid color-mix(in oklab, var(--border) 60%, transparent)',
							verticalAlign: 'middle',
						}}
						title="lady with finger to lips.Shh" />
					<div className={`text`}>
						<h3>4. The silent "h"</h3>
						<p>The letter <b>h</b> occurs in French words, but is never aspirated e.g. <AudioClip className={`link`} soundFile={`sounds/fr/homme.mp3`} >
							<b>h</b>omme</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/horrible.mp3`} >
							<b>h</b>orrible</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/horizon.mp3`} >
							<b>h</b>orizon</AudioClip>.</p>
					</div>
				</div>
			</div>
		);
	};
}
export class LO2Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo2-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p><b>1. Verbs in French</b></p>
					<p>There are many irregular verbs in French. The verb <AudioClip className={`link`} soundFile={`sounds/fr/être.mp3`}><b>être</b></AudioClip> meaning <b>to be</b> is one of these. In fact, it has been
						described as the most irregular of all the irregulars! It is worth studying this verb now, not only for this reason,
						but because it occurs so frequently, and It will also enable you to master the subject pronouns.</p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/être.mp3`}><b>Être</b></AudioClip> to be</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>je suis</TableCell>
								<TableCell>I am</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/je suis.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>tu es</TableCell>
								<TableCell>you are</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/tu es.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell><a className={`special-anchor`} href={`#subject-pronouns`}>il</a> est</TableCell>
								<TableCell>he is, it is</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/il est.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell><a className={`special-anchor`} href={`#subject-pronouns`}>elle</a> est</TableCell>
								<TableCell>she is, it is</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/elle est.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>nous sommes</TableCell>
								<TableCell>we are</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/nous sommes.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>vous êtes</TableCell>
								<TableCell>you are</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/vous êtes.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell><a className={`special-anchor`} href={`#subject-pronouns`}>ils</a> sont</TableCell>
								<TableCell>they are</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/ils sont.mp3`} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell><a className={`special-anchor`} href={`#subject-pronouns`}>elles</a> sont</TableCell>
								<TableCell>they are</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={`sounds/fr/elles sont.mp3`} /></TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<hr />
				</div>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel2` : ''}`}
					key={`${id}Panel2`}
				>
					<p><b>2. Grammatical genders</b> ( I think this lends itself to illustration/pic ?)</p>
					<p>All French nouns have gender, not just people or animals but inanimate objects too.
						There are just two genders in French called masculine and feminine.
						This simply means that all nouns belong in one category or the other.
						Males e.g. father, uncle etc are masculine nouns and females e.g. mother, aunt etc are feminine nouns.
						Other nouns have intrinsic gender. This is not related to their owner, characteristics, manufacturer etc.
						It is possible to identify the gender of some nouns by their endings. (A list of these endings to be added/ linked)</p>
					<p>The pronoun <b>iel</b> is a gender-neutral singular pronoun, similar in concept to the English singular "they," used for someone who doesn't identify strictly as masculine or feminine. Keep in mind that verbs and adjectives still need to agree in French grammar, so usage can be more complex.</p>
					<p>The gender of the noun has implications for some grammatical features. e.g.</p>
					<p>a. The indefinite article:</p>
					<p>There are two ways of saying 'a' in French:&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/un.mp3`}><b>un</b></AudioClip> for masculine nouns e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/un homme.mp3`}><b>un</b> homme</AudioClip> (a man),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/un métier.mp3`}><b>un</b> métier</AudioClip> (a profession/occupation) and&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une.mp3`}><b>une</b></AudioClip> for a feminine noun e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une femme.mp3`}><b>une</b> femme</AudioClip> (a woman),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une profession.mp3`}><b>une</b> profession</AudioClip> (a profession).</p>
					<p>b. The definite article:</p>
					<p>For singular nouns, to say 'the' you use&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le.mp3`}><b>le</b></AudioClip> for masculine nouns e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le professeur.mp3`}><b>le</b> professeur</AudioClip> (the [male] teacher),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le jour.mp3`}><b>le</b> jour</AudioClip> (the day). For feminine nouns you say&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la.mp3`}><b>la</b></AudioClip> e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la professeure.mp3`}><b>la</b> professeure</AudioClip> (the [female] teacher),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la nuit.mp3`}><b>la</b> nuit</AudioClip> (the night).
						When the singular noun begins with a vowel or mute h, then you use&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'.mp3`}><b>l'</b></AudioClip> regardless of gender e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'appartement.mp3`}><b>l'</b>appartement</AudioClip> (m) (the flat),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'école.mp3`}><b>l'</b>école</AudioClip> (f) (the school),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'homme.mp3`}><b>l'</b>homme</AudioClip> (the man).</p>
				</div>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel3` : ''}`}
					key={`${id}Panel3`}
				>
					<p><a className={`special-anchor-target`} id={`subject-pronouns`} name={`subject-pronouns`} ><b>3. Subject pronouns</b>.</a></p>
					<ul>
						<li><b>Il</b> is used to replace a masculine noun.</li>
						<li><b>Elle</b> is used to replace a feminine noun.</li>
						<li><b>Ils</b> is used to replace more than one masculine noun or a mixture of masculine and feminine nouns.</li>
						<li><b>Elles</b> is used to replace more than one feminine noun.</li>
						<li><b>iel</b> is a gender-neutral singular pronoun.</li>
					</ul>
				</div>
			</div>
		);
	};
}

export class LO2Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo2-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p>1 Silent letters at the end of a word&nbsp;
						<img
							src={resolveAsset(`images/shh.jpg`)}
							className={`lo2-demystify-shh`}
							alt={`lady with finger to lips. Shh`}
							style={{ border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)" }}
							title={`lady with finger to lips. Shh`}
						/></p>
					<p>The consonants <b>d</b>, <b>g</b>, <b>p</b>, <b>s</b>, <b>t</b>, <b>x</b>, <b>z</b> are silent when they are the last letter of the word.
						Listen to the following examples.</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/grand.mp3`} alt={`grand`}>gran<b>d</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/rond.mp3`} alt={`rond`}>ron<b>d</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/long.mp3`} alt={`long`}>lon<b>g</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/trop.mp3`} alt={`trop`}>tro<b>p</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/depuis.mp3`} alt={`depuis`}>depui<b>s</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/pas.mp3`} alt={`pas`}>pa<b>s</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/petit.mp3`} alt={`petit`}>peti<b>t</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Salut.mp3`} alt={`salut`}>salu<b>t</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/gâteaux.mp3`} alt={`gâteaux`}>gâteau<b>x</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/appelez.mp3`} alt={`appelez`}>appele<b>z</b></AudioClip></p>
					<p>The letter <b>e</b> is not pronounced at the end of a word:</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/Je m'appelle.mp3`} alt={`Je m'appelle`}>Je m'appell<b>e</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/bibliothécaire.mp3`} alt={`bibliothécaire`}>bibliothécair<b>e</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/célibataire.mp3`} alt={`célibataire`}>célibatair<b>e</b></AudioClip></p>
					<p><b>NB</b> 2-letter words ending in <b>e</b> are exceptions:</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/ce.mp3`}>ce</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}>de</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/je.mp3`}>je</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le.mp3`}>le</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/me.mp3`}>me</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/ne.mp3`}>ne</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/se.mp3`}>se</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/te.mp3`}>te</AudioClip></p><hr /><p>2 <b>Th</b></p>&nbsp;
					<p>In French the letters <b>th</b> are pronounced <b>t</b>. e.g.
						<AudioClip className={`link`} soundFile={`sounds/fr/Thomas.mp3`} alt={`Thomas`}><b>Thomas</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/thé.mp3`} alt={`thé`}><b>thé</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/théologie.mp3`} alt={`théologie`}><b>théologie</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/maths.mp3`} alt={`maths`}><b>maths</b></AudioClip></p>
				</div>
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
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p><b>1. A bit about verbs in French:</b></p>
					<p>There are three groups of verbs in French. The biggest of these is called the&nbsp;
						<b>-er</b> group, simply because the infinitive ends with the letters&nbsp;
						<b>-er</b>.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/parler.mp3`}>Parler</AudioClip> (to speak),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/habiter.mp3`}>habiter</AudioClip> (to live),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/chanter.mp3`}>chanter</AudioClip> (to sing),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/danser.mp3`}>danser</AudioClip> (to dance) are examples of <b>-er</b> verbs.</p>
					<p><b>NB</b> There is only <b>ONE present tense</b> in French, so you translate je parle either as 'I speak' or 'I am speaking'
						depending on the context.</p>
					<Table>
						<thead>
							<TableRow>
								<th>
									<AudioClip className={`link`} soundFile={`sounds/fr/parler.mp3`}>parler</AudioClip></th>
								<th>to speak</th>
							</TableRow>
						</thead>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/je parle.mp3`}>je parle</AudioClip></TableCell>
								<TableCell>I speak / am speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/tu parles.mp3`}>tu parles</AudioClip></TableCell>
								<TableCell>you speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/il parle.mp3`}>il parle</AudioClip></TableCell>
								<TableCell>he / it speaks / is speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/elle parle.mp3`}>elle parle</AudioClip></TableCell>
								<TableCell>she / it speaks / is speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/nous parlons.mp3`}>nous parlons</AudioClip></TableCell>
								<TableCell>we speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/vous parlez.mp3`}>vous parlez</AudioClip></TableCell>
								<TableCell>you speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/ils parlent.mp3`}>ils parlent</AudioClip></TableCell>
								<TableCell>they speak / are speaking</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/elles parlent.mp3`}>elles parlent</AudioClip></TableCell>
								<TableCell>they speak / are speaking</TableCell>
							</TableRow>
						</TableBody>
					</Table><p><b>venir</b> is a common irregular verb.</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/venir de.mp3`}><b>venir de</b></AudioClip> to come from</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/je viens.mp3`}>je viens</AudioClip> (de Marseille)
								</TableCell>
								<TableCell>I come (from Marseille)...</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/tu viens.mp3`}>tu viens</AudioClip>
								</TableCell>
								<TableCell>you come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/il vient.mp3`}>il vient</AudioClip>
								</TableCell>
								<TableCell>he/it comes</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/elle vient.mp3`}>elle vient</AudioClip>
								</TableCell>
								<TableCell>she/it comes</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/nous venons.mp3`}>nous venons</AudioClip>
								</TableCell>
								<TableCell>we come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/vous venez.mp3`}>vous venez</AudioClip>
								</TableCell>
								<TableCell>you come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/ils viennent.mp3`}>ils viennent</AudioClip>
								</TableCell>
								<TableCell>they come</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip className={`link`} soundFile={`sounds/fr/elles viennent.mp3`}>elles viennent</AudioClip>
								</TableCell>
								<TableCell>they come</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel2` : ''}`}
					key={`${id}Panel2`}
				>
					<p><b>2 De</b></p>
					<p><b>NB</b> The word <b>de</b> occurs in French with a variety of meanings. Here it means from, and it's followed by a place name. Look at the following examples illustrating the forms:</p>
					<p>Je viens <span className="ped-neg"><b>de</b></span> Paris (for towns, cities, villages)</p>
					<p>Je viens <span className="ped-affirm"><b>de</b></span> Belgique (for feminine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-neutral"><b>d'</b></span>Angleterre (for all singular place names beginning with a vowel or mute h)</p>
					<p>Je viens <span className="ped-accent"><b>du</b></span> Canada (for masculine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-warn"><b>des</b></span> Seychelles (for plural countries)</p>
				</div>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel3` : ''}`}
					key={`${id}Panel3`}
				>
					<p><b>3 Feminine forms of professions and adjectives</b></p>
					<p>When describing a female or any feminine noun, you will often see the addition of a letter or letters to the original masculine
						noun or adjective.</p>
					<ul>
						<li>If the ending is <b>e</b> there is no addition: both masculine and feminine are the the same e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/célibataire.mp3`}>célibataire</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/journaliste.mp3`}>journaliste</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/serbe.mp3`}>serbe</AudioClip> etc.
						</li>
						<li>If the last letter is a consonant, then generally <b>e</b> is added to form the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/étudiant.mp3`}>étudiant</AudioClip> (m)&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/étudiante.mp3`}>étudiante</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/chinois.mp3`}>chinois</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/chinoise.mp3`}>chinoise</AudioClip> (f) <b>NB</b>&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/médecin.mp3`}>médecin</AudioClip> is an exception -&nbsp;
							this is for both a male and female doctor.
						</li>
						<li>If the final letter is <b>é</b>, then an <b>e</b> is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/marié.mp3`}>marié</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/mariée.mp3`}>mariée</AudioClip> (f)
						</li>
						<li>If the ending is <b>en</b>, <b>ne</b> is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/informaticien.mp3`}>informaticien</AudioClip> (m) /&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/informaticienne.mp3`}>informaticienne</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/australien.mp3`}>australien</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/australienne.mp3`}>australienne</AudioClip> (f)
						</li>
					</ul>
				</div>
			</div>
		);
	};
}

export class LO3Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p><b>To sound or not to sound?</b><img
						src={resolveAsset('/images/shh.jpg')}
						style={{
							border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
							float: 'right',
							marginLeft: '20px',
							verticalAlign: 'top'
						}}
						alt={`lady with finger to lips. Shh`}
						title={`lady with finger to lips. Shh`} /></p>
					<ol>
						<li><p>The third person verb ending <b>ent</b> is never pronounced. e.g.
							<AudioClip className={`link`} soundFile={`sounds/fr/ils parlent.mp3`}>Ils parl<b>ent</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/elles chantent.mp3`}>elles chant<b>ent</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/ils dansent.mp3`}>ils dans<b>ent</b></AudioClip>. </p>
						</li>
						<li>
							<p>Usually, the consonants <b>d</b>, <b>g</b>, <b>p</b>, <b>s</b>, <b>t</b>, <b>x</b>, <b>z</b> are silent when they are the last letter of the word.
								However, these are sounded when the next word begins with a vowel or mute h. This is known as making a liaison. </p>
							<p>Compare these:&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/les professeurs.mp3`}>les professeurs</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/les étudiants.mp3`}>le<b>s é</b>tudiants</AudioClip> –&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/il est français.mp3`}>il est français</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/il est anglais.mp3`}>il es<b>t a</b>nglais</AudioClip> -&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/un grand poète.mp3`}>un grand poète</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/un grand homme.mp3`}>un gran<b>d ho</b>mme</AudioClip></p>
						</li>
						<li>
							<p>The sound : <b>'eh'</b></p>
							<p>Listen to the following:
								<AudioClip className={`link`} soundFile={`sounds/fr/vous parlez.mp3`}>vous parl<b>ez</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/il est américain.mp3`}>il <b>est</b> am<b>é</b>ricain</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/et.mp3`}><b>et</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/je suis ghanéenne.mp3`}>je suis ghan<b>é</b>enne</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/elle est mariée.mp3`}>elle <b>est</b> mari<b>ée</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/nous sommes fiancés.mp3`}>nous sommes fianc<b>és</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/elles sont fatiguées.mp3`}>elles sont fatigu<b>ées</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/écouter.mp3`}><b>é</b>cout<b>er</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/regarder.mp3`}>regard<b>er</b></AudioClip></p>
							<p>You will notice that&nbsp;
								<b>-et</b>, <b>-ez</b>, <b>é</b>, <b>-ée</b>, <b>-és</b>, <b>-ées</b> and also <b>-er</b> as an infinitive ending are
							all pronounced the same, as are the words <b>est</b> and <b>es</b>.
							</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class LO4Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo4-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p><b>How to pronounce:</b></p>
					<p>another nasal vowel. This is the sound <AudioClip className={`super-compact`} soundFile={`sounds/fr/ain.mp3`}/>&nbsp;
						which is how the letters <b>-in-</b> are pronounced <b>when they end a word or occur before a consonant</b> as in these examples:&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Singapour.mp3`}>S<b>in</b>gapour</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Inde.mp3`}><b>In</b>de</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/indien.mp3`}><b>in</b>dien</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Finlande.mp3`}>F<b>in</b>lande</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/jardin.mp3`}>jard<b>in</b></AudioClip>. The tongue and the mouth all have work to do in its production whilst air passes through nose and mouth.</p>
					<p><b>NB</b> This is a useful sound to practise as the following are also pronounced in the same way <b>when they end a word or occur before a consonant:</b></p>
					<p><b>ain</b>, <b>aim</b>, <b>ein</b>, <b>im</b>, <b>ym</b>, <b>yn</b>, <b>eim</b>.</p>
					<p>Here are some examples of words containing the sound to practise:</p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/marocain.mp3`}>maroc<b>ain</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/faim.mp3`}>f<b>aim</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/peinture.mp3`}>p<b>ein</b>ture</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/impossible.mp3`}><b>im</b>possible</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/symbole.mp3`}>s<b>ym</b>bole</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/lynx.mp3`}>l<b>yn</b>x</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Reims.mp3`}>R<b>eim</b>s</AudioClip>.</p>
					<p>When the letters <b>en</b> or <b>ens</b> end a word this also pronounced (ain) </p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/australien.mp3`}>australi<b>en</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/européen.mp3`}>europé<b>en</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/ghanéens.mp3`}>ghané<b>ens</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/indiens.mp3`}>indi<b>ens</b></AudioClip>.</p>
				</div>
			</div>
		);
	};
}

export class LO4EX1 extends PureComponent{
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo4-ex1`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel1` : ''}`}
					key={`${id}Panel1`}
				>
					<p>Listen to the following nonsense rhyme. You should be able to identify numerous examples of the sound&nbsp;
						<AudioClip className={`super-compact`} soundFile={`sounds/fr/ain.mp3`}/>.
						Read the nonsense rhyme out loud to practise the Pronunciation</p>
					<div className={`two-columns`}>
						<p><b>Tu aimes… ?</b>&nbsp;<AudioClip className={`compact`} soundFile={`sounds/fr/nonsense-rhyme.mp3`}/><br/>
					Tu aimes Quent<b>in</b> ?<br/>
					Je n'aime pas Quent<b>in</b>, <br/>
					Il lit T<b>in</b>t<b>in</b> ! <br/>
					Tu aimes Mart<b>in</b> ?<br/>
					Je n'aime pas Mart<b>in</b> !<br/>
					Il boit du v<b>in</b> ! <br/>
					Tu aimes Corent<b>in</b> ?<br/>
					J'aime bi<b>en</b> Corent<b>in</b> !<br/>
					Il a un beau jard<b>in</b>.<br/>
					Tu aimes Dami<b>en</b> ?<br/>
					Je n'aime pas Dami<b>en</b>.<br/>
					Il ne se lave pas les ma<b>in</b>s! <br/>
					Tu aimes Sébasti<b>en</b> ?<br/>
					Oh, j'adore Sébasti<b>en</b> !<br/>
							C'est mon vois<b>in</b> !<br /><br />
							&copy; Jacqueline Rosen
						</p>
						<img src={`images/love.png`} alt={`love`} title={`love`}/>
					</div>
				</div>
			</div>
		);
	};

}

export class LO5Grammar extends PureComponent{
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>In French there are some verbs which are <b>only ever used in the third person singular: il</b>.</p>
							<p><b>Il y a</b> meaning 'there is' or 'there are' is one of these. <br/>e.g. </p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/Il y a un petit jardin devant la maison.mp3`} alt="centre">Il y a un petit jardin devant la maison</AudioClip>.
								There is a small garden in front of the house.<br />
							<AudioClip className={`link`} soundFile={`sounds/fr/Il y a trois chambres au premier étage.mp3`} alt="centre">Il y a trois chambres au premier étage</AudioClip>.
								There are three bedrooms on the first floor.</p>
							<p>Here are a few more examples of verbs which work in the same way:</p>
							<p>From the verb <AudioClip className={`link`} soundFile={`sounds/fr/pleuvoir.mp3`}><b>pleuvoir</b></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il pleut.mp3`}><b>Il pleut</b></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il pleut aujourd'hui.mp3`}><b>Il pleut</b> aujourd'hui</AudioClip> It's raining today. <br />
								From the verb <AudioClip className={`link`} soundFile={`sounds/fr/neiger.mp3`}><b>neiger</b></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il neige.mp3`}><b>Il neige</b></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il neige en hiver.mp3`}><b>Il neige</b> en hiver</AudioClip> It snows in the winter.<br />
								From the verb <AudioClip className={`link`} soundFile={`sounds/fr/falloir.mp3`}><b>falloir</b></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il faut.mp3`}><b>Il faut</b></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il faut écouter.mp3`}><b>Il faut</b> écouter</AudioClip> It's necessary / you need to listen. </p>
						</li><li>
							<p><b>More about adjectival agreement</b>. Some adjectives end -eux e.g. <AudioClip className={`link`} soundFile={`sounds/fr/spacieux.mp3`}><b>spacieux</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/lumineux.mp3`}><b>lumineux</b></AudioClip>.</p>
							<p>There is no change for the masculine plural.<br />The feminine form of the adjective is formed by removing the x and replacing with -se i.e.
								<AudioClip className={`link`} soundFile={`sounds/fr/spacieuse.mp3`}><b>spacieuse</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/lumineuse.mp3`}><b>lumineuse</b></AudioClip>.<br />
								To form the feminine plural an s is added to this. Look at these examples:</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/Le salon est spacieux.mp3`}>Le salon est spaci<b>eux</b></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/La cuisine est spacieuse.mp3`}>La cuisine est spaci<b>euse</b></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/Les appartements sont spacieux.mp3`}>Les appartements sont spaci<b>eux</b></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/Les chambres sont spacieuses.mp3`}>Les chambres sont spaci<b>euses</b></AudioClip>.</p>
						</li></ol>
				</div>
			</div>
		);
	};
}

export class LO5Demystify extends PureComponent{
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p><b>How to pronounce:</b></p>
					<p>the third of the nasal vowels, <AudioClip
						className={`super-compact`}
						inline={true}
						soundFile={`sounds/fr/an_rerecorded.mp3`} /> which is how the letters an, am, en and em are pronounced.
						Listen to the following examples:</p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/blanc.mp3`}>blanc</AudioClip>&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/chambre.mp3`}>chambre</AudioClip>&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dans.mp3`}>dans</AudioClip>&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/enfant.mp3`}>enfant</AudioClip>&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/ensemble.mp3`}>ensemble</AudioClip>&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/centre.mp3`}>centre</AudioClip></p>
				</div>
			</div>
		);
	};
}

export class LO6Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p>In French, the gender of the noun has implications for the <b>possessive adjectives</b>.
						There are two ways of saying 'my' for singular nouns in French: <AudioClip className={`link`} soundFile={`sounds/fr/mon.mp3`} ><b>mon</b></AudioClip> for masculine nouns e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mon frère.mp3`} ><b>mon</b> frère</AudioClip> (my brother),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mon jardin.mp3`} ><b>mon</b> jardin</AudioClip> (my garden) and <b>ma</b> for feminine nouns e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/ma femme.mp3`} ><b>ma</b> femme</AudioClip> (my wife),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/ma maison.mp3`} ><b>ma</b> maison</AudioClip> (my house). It is important to remember that the gender of the noun itself is what matters here,
						and not the gender of the 'owner'. There is only one way of saying 'my' for plural nouns: e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mes oncles.mp3`} ><b>mes</b> oncles</AudioClip> (my uncles),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mes tantes.mp3`} ><b>mes</b> tantes</AudioClip> (my aunts).<br />
						Here is a complete list of the possessive adjectives.</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/mon.mp3`} >mon</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ma.mp3`} >ma</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/mes.mp3`} >mes</AudioClip></TableCell>
								<TableCell>my</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ton.mp3`} >ton</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ta.mp3`} >ta</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/tes.mp3`} >tes</AudioClip></TableCell>
								<TableCell>your (sing)</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/son.mp3`} >son</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/sa.mp3`} >sa</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ses.mp3`} >ses</AudioClip> *</TableCell>
								<TableCell>his / her</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/notre.mp3`} >notre</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/nos.mp3`} >nos</AudioClip> (pl)</TableCell>
								<TableCell>our</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/votre.mp3`} >votre</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/vos.mp3`} >vos</AudioClip> (pl)</TableCell>
								<TableCell>your (formal, pl)</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/leur.mp3`} >leur</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/leurs.mp3`} >leurs</AudioClip> (pl)</TableCell>
								<TableCell>their</TableCell>
							</TableRow></TableBody></Table><p className={`footnote`}>(*NB all of these can mean his or her as the gender of the noun and not the owner is the factor to consider.)</p>
					<p><b>2 Verbs in French continued</b></p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/avoir.mp3`} ><b>Avoir</b></AudioClip> is one of the many irregular verbs in French.
						It means <b>to have</b>.
						e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai une soeur.mp3`} >J'ai une soeur</AudioClip> - I have a sister.</p>
					<p>It occurs very frequently and so is worth memorising if possible.</p>
					<Table>
						<thead>
							<TableRow>
								<th>Avoir</th>
								<th>to have</th>
							</TableRow>
						</thead>
						<TableBody>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/j'ai.mp3`}>j'ai</AudioClip></TableCell>
								<TableCell>I have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu as.mp3`}>tu as</AudioClip></TableCell>
								<TableCell>you have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il a.mp3`}>il a</AudioClip></TableCell>
								<TableCell>he has, it has</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle a.mp3`}>elle a</AudioClip></TableCell>
								<TableCell>she has, it has</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous avons.mp3`}>nous avons</AudioClip></TableCell>
								<TableCell>we have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous avez.mp3`}>vous avez</AudioClip></TableCell>
								<TableCell>you have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils ont.mp3`}>ils ont</AudioClip></TableCell>
								<TableCell>they have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elles ont.mp3`}>elles ont</AudioClip></TableCell>
								<TableCell>they have</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<p>The verb <b>avoir</b> occurs in some expressions when in English the
						verb <b>to be</b> or sometimes <b>to feel</b> would be used. Here are some of these expressions:</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell><b>avoir … ans</b></TableCell>
								<TableCell>to be … years old</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai 25 ans.mp3`}><b>J'ai 25 ans.</b></AudioClip></TableCell>
								<TableCell>I'm 25 years old.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><b>avoir soif </b></TableCell>
								<TableCell>to be thirsty</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai soif.mp3`}><b>J'ai soif. </b></AudioClip></TableCell>
								<TableCell>I'm thirsty.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><b>avoir faim </b></TableCell>
								<TableCell>to be hungry</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Elle a faim.mp3`}><b>Elle a faim.</b></AudioClip></TableCell>
								<TableCell>She's hungry.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><b>avoir peur </b></TableCell>
								<TableCell>to be frightened</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Il a peur.mp3`}><b>Il a peur.</b></AudioClip></TableCell>
								<TableCell>He's frightened.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><b>avoir froid</b></TableCell>
								<TableCell>to be / feel cold</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Tu as froid.mp3`}><b>Tu as froid ?</b></AudioClip></TableCell>
								<TableCell>Are you / do you feel cold?</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><b>avoir chaud</b></TableCell>
								<TableCell>to be / feel hot</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Vous avez chaud.mp3`}><b>Vous avez chaud ?</b></AudioClip></TableCell>
								<TableCell>Are you hot / do you feel hot?</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}

export class LO6Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p><b>How to pronounce double l in French:</b></p>
					<p><b>Double l</b> is sometimes mispronounced by learners of French, but the following rules should help to avoid this problem.</p>
					<p>1 after the vowels <b>a, e, o</b> and <b>u</b>, <AudioClip className={`link`} soundFile={`sounds/fr/ll-a.mp3`}><b>double l</b></AudioClip> is pronounced <b>l</b>. e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une balle.mp3`}><b>une balle</b></AudioClip> (a ball),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Elle est belle.mp3`}><b>Elle est belle</b></AudioClip>. (She is beautiful.)&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Elle est folle.mp3`}><b>Elle est folle</b></AudioClip>. (She is crazy.)&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une bulle.mp3`}><b>une bulle</b></AudioClip> (a bubble).&nbsp;
							There are no exceptions here!</p>
					<p>2i after the vowel <b>i</b>,&nbsp;<AudioClip className={`link`} soundFile={`sounds/fr/ll-b.mp3`}><b>double l</b></AudioClip> is pronounced as though it were a letter <b>"y"</b> in English. e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une fille.mp3`}><b>une fille</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une famille.mp3`}><b>une famille</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/un billet.mp3`}><b>un billet</b></AudioClip> (a ticket)</p>
					<p>2ii if the vowel <b>i</b> is preceded by another vowel, the same rule applies and <AudioClip className={`link`} soundFile={`sounds/fr/ll-b.mp3`}><b>double l</b></AudioClip> is pronounced as though it were
						a letter <b>"y"</b> in English. e.g. <AudioClip className={`link`} soundFile={`sounds/fr/une bouteille.mp3`}><b>une bouteille</b></AudioClip> (a bottle),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/une feuille.mp3`}><b>une feuille</b></AudioClip> (a leaf).</p>
					<p><b className="ped-neg">NB</b> There are a few exceptions when <AudioClip className={`link`} soundFile={`sounds/fr/ll-a.mp3`}><b>double l</b></AudioClip> follows <b>i</b>.
						The most common are : <AudioClip className={`link`} soundFile={`sounds/fr/la ville.mp3`}><b>la ville</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/le village.mp3`}><b>le village</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/la villa.mp3`}><b>la villa</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mille.mp3`}><b>mille</b></AudioClip> (a thousand),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/un million.mp3`}><b>un million</b></AudioClip> (a million),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/un milliard.mp3`}><b>un milliard</b></AudioClip> (a billion),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/tranquille.mp3`}><b>tranquille</b></AudioClip> (quiet),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Lille.mp3`}><b>Lille</b></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Gilles.mp3`}><b>Gilles</b></AudioClip>.
						The best thing to do is to learn these off by heart.</p>
				</div>
			</div>
		);
	};
}

export class LO7Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo7-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li><p>French like all languages borrows words from other languages. In the greater majority of cases, borrowed nouns are masculine. e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le cricket.mp3`}><b>le cricket</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le judo.mp3`}><b>le judo</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le shopping.mp3`}><b>le shopping</b></AudioClip>.
							Almost all ball sports are borrowed words, and these are all masculine.</p></li>
						<li><p>Word for word translation often works very well, but sometimes being aware of some seemingly small differences is essential. e.g.
								In English, we say, 'I like football' or 'I don't like swimming'. In French, we say '
						<AudioClip className={`link`} soundFile={`sounds/fr/J'aime le football.mp3`}>J'aime <i>le</i> football</AudioClip>' or '
						<AudioClip className={`link`} soundFile={`sounds/fr/Je n'aime pas la natation.mp3`}>Je n'aime pas <i>la</i> natation</AudioClip>'.
								i.e. in French, a definite article (le, la, l', les) is required.</p></li><li><p>To say what you like/ dislike doing you use&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/J'aime.mp3`}>J'aime</AudioClip> plus an infinitive. e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/J'aime danser.mp3`}>J'aime danser</AudioClip>: I like to dance / I like dancing.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/Je n'aime pas regarder la télévision.mp3`}>Je n'aime pas regarder la télévision</AudioClip>:
								I don't like to watch the television / I don't like watching the television.</p></li>
						<li>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/Quel.mp3`}>Quel</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/quelle.mp3`}>quelle</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/quels.mp3`}>quels</AudioClip> and&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/quelles.mp3`}>quelles</AudioClip> are known as interrogative adjectives and they mean
								'which' or 'what'. They work like adjectives, and agree with the noun that follows, hence the four forms.</p>
							<ul>
								<li><AudioClip className={`link`} soundFile={`sounds/fr/Quel.mp3`}>Quel</AudioClip> is used for a masculine singular noun e.g.
									<AudioClip className={`link`} soundFile={`sounds/fr/Quel est ton pays préféré.mp3`}>Quel est ton pays préféré ?</AudioClip> Which is your
									favourite country?</li><li><AudioClip className={`link`} soundFile={`sounds/fr/quelle.mp3`}>Quelle</AudioClip> is used for a feminine singular
									noun e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Quelle est ta couleur préférée.mp3`}>Quelle est ta couleur préférée ?</AudioClip>
									Which is your favourite colour?</li><li><AudioClip className={`link`} soundFile={`sounds/fr/quels.mp3`}>Quels</AudioClip> is used for
									masculine plural noun e.g.
								<AudioClip className={`link`} soundFile={`sounds/fr/Quels sont tes passe-temps préférés.mp3`}>Quels sont tes passe-temps préférés ?</AudioClip>
									Which are your favourite pastimes?</li><li><AudioClip className={`link`} soundFile={`sounds/fr/quelles.mp3`}>Quelles</AudioClip> is used for
									feminine plural nouns e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Quelles langues parlez-vous.mp3`}>Quelles langues
									parlez-vous ?</AudioClip> Which languages do you speak?
								</li>
							</ul>
						</li>
					</ol >
				</div>
			</div>
		);
	};
}

export class LO7Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo7-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p>Words that are borrowed from another language tend to retain much of the pronunciation of their language of origin. Here are some examples:</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/le cricket.mp3`}>le cricket</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le tennis (f).mp3`}>le tennis</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le foot.mp3`}>le foot</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le shopping.mp3`}>le shopping</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le bowling.mp3`}>le bowling</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le week-end.mp3`}>le week-end</AudioClip></p>
					<p>(despite what you will have learnt previously, the final consonant is sounded here)</p>
				</div>
			</div>
		);
	};
}

export class LO8Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo8-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							More about adjectives: There are some adjectives ending in <b>f</b>, e.g. <AudioClip className={`link`} soundFile={`sounds/fr/sportif.mp3`}>sport<b>if</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/actif.mp3`}>act<b>if</b></AudioClip>.
							The feminine form of such words ends in <b>-ve</b>.
							e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Mon frère est sportif.mp3`}>Mon frère est sport<b>if</b></AudioClip>. <AudioClip className={`link`} soundFile={`sounds/fr/Ma sœur est sportive.mp3`}>Ma sœur est sporti<b>ve</b></AudioClip>.
						</li>
						<li><br/>
							<ol type="i">
								<li>The verb <AudioClip className={`link`} soundFile={`sounds/fr/faire.mp3`}><b>faire</b></AudioClip>, meaning both 'to make' and 'to do',
									is a frequently occurring very irregular verb. Here it is conjugated in the present tense:<br />
								<Table>
									<TableBody>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais.mp3`}>je <b>fais</b></AudioClip></TableCell>
											<TableCell>I do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu fais.mp3`}>tu <b>fais</b></AudioClip></TableCell>
											<TableCell>You do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il fait. elle fait.mp3`}>il / elle <b>fait</b></AudioClip></TableCell>
											<TableCell>He / she / it does / makes</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous faisons.mp3`}>nous <b>faisons</b></AudioClip></TableCell>
											<TableCell>We do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous faites.mp3`}>vous <b>faites</b></AudioClip></TableCell>
											<TableCell>You do /make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils font. elles font.mp3`}>ils / elles <b>font</b></AudioClip></TableCell>
											<TableCell>They do /make</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								</li>
								<li>
									In English you can express what you do or make simply by adding the activity after the verb e.g. 'I do gymnastics' or
									'I do gardening' or 'I make cakes'. In French, you also need something called the partitive article:&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><b>du</b></AudioClip> for masculine nouns,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><b>de la</b></AudioClip> for feminine nouns,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><b>de l'</b></AudioClip> before a vowel or silent h and&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><b>des</b></AudioClip>&nbsp;
									for plurals.<br/>
									The partitive is usually translated by "some" or "any," i.e an unspecified amount, or is often left out entirely as in the examples below. <br/>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais de la gymnastique.mp3`}><b>Je fais de la gymnastique</b></AudioClip></TableCell>
												<TableCell> I do gymnastics</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais du jardinage.mp3`}><b>Je fais du jardinage</b></AudioClip></TableCell>
												<TableCell>I do gardening</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je fais des gâteaux.mp3`}><b>Je fais des gâteaux</b></AudioClip></TableCell>
												<TableCell>I make cakes</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</li>
							</ol>
						</li>
						<li>
							<br/>
							<ol type="i">
								<li>
									The regular <b>-er</b> verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><b>jouer</b></AudioClip> meaning to play is useful when talking about pastimes.
									You use the partitive article after the verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><b>jouer</b></AudioClip> when speaking about playing a musical instrument:<br />
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue du piano.mp3`}><b>Je joue du piano</b></AudioClip></TableCell>
												<TableCell>I play the piano</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue de la clarinette.mp3`}><b>Je joue de la clarinette</b></AudioClip></TableCell>
												<TableCell>I play the clarinet</TableCell>
											</TableRow>
										</TableBody>
									</Table>

								</li>
								<li>
									When you use the verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><b>jouer</b></AudioClip> in the context of a ball game or tabletop game you can't use the partitive article nor can you use the definite article.<br />
									You use <AudioClip className={`link`} soundFile={`sounds/fr/jouer à.mp3`}><b>jouer à</b></AudioClip>.
									If the activity is masculine it's <AudioClip className={`link`} soundFile={`sounds/fr/jouer au.mp3`}><b>jouer au</b></AudioClip>, if feminine, <AudioClip className={`link`} soundFile={`sounds/fr/jouer à la.mp3`}><b>jouer à la</b></AudioClip>,
									if starting with a vowel or silent h then <AudioClip className={`link`} soundFile={`sounds/fr/jouer à l'.mp3`}><b>jouer à l'</b></AudioClip> and for plurals <AudioClip className={`link`} soundFile={`sounds/fr/jouer aux.mp3`}><b>jouer aux</b></AudioClip>. e.g.
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue au football.mp3`}><b>Je joue au football</b></AudioClip></TableCell>
												<TableCell> I play football</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue à la pétanque.mp3`}><b>Je joue à la pétanque</b></AudioClip></TableCell>
												<TableCell> I play pétanque</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</li>
							</ol>
						</li>
						<li>
							The ending of a noun often helps you to know its gender. For example, all nouns ending <b>-tion</b> or <b>-ie</b> are feminine.<br />
							e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'action (f).mp3`}>l'action</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la nation (f).mp3`}>la nation</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la natation (f).mp3`}>la natation</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la biologie.mp3`}>la biologie</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la géographie.mp3`}>la géographie</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la sociologie.mp3`}>la sociologie</AudioClip><br/>
							<br/>
							All nouns ending <b>-isme</b> are masculine.<br/>
							e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'athlétisme.mp3`}>l'athlétisme</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'existentialisme.mp3`}>l'existentialisme</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le socialisme.mp3`}>le socialisme</AudioClip>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class LO8Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo8-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p>How to pronounce: <b>–tion</b> in French. In this combination the letter t is pronounced as if it were an s.
Here are some examples of words containing or ending <b>–tion</b>. </p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/l'action.mp3`}>l'action</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'attention.mp3`}>l'attention</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'équitation.mp3`}>l'équitation</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/l'exposition.mp3`}>l'exposition</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la natation.mp3`}>la natation</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la nation.mp3`}>la nation</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la nationalité.mp3`}>la nationalité</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/la situation.mp3`}>la situation</AudioClip></p>
				</div>
			</div>
		);
	};
}

export class LO9Grammar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = ({
			...props.config,
			failCount: 0,
			// nPlaced: 0,
			// nToSolve: 0,
		});
		// this.handleClick = this.handleClick.bind(this);
	}

	handleClick = (e) => {
		// console.log("handleClick", e.target);
		let t = e.target;
		let id = t.getAttribute('id');
		while (id === null) {

			t = t.parentElement;
			id = t.getAttribute('id');

		}

		let audio;
		switch (id){
			default:
			case 'g01': {
				audio = new Audio(resolveAsset('sounds/fr/01.mp3'));
				break;
			}
			case 'g02': {
				audio = new Audio(resolveAsset('sounds/fr/02.mp3'));
				break;
			}
			case 'g03': {
				audio = new Audio(resolveAsset('sounds/fr/03.mp3'));
				break;
			}
			case 'g04': {
				audio = new Audio(resolveAsset('sounds/fr/04.mp3'));
				break;
			}
			case 'g05': {
				audio = new Audio(resolveAsset('sounds/fr/05.mp3'));
				break;
			}
		}
		audio.play();
	};

	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo9-grammar-container container`}
				id={`RegionalTelephoneMap`}
				key={`${id}CustomComponent`}
			>
				{/* <div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				> */}
				<p>Within France telephone numbers have 10 digits. For landlines the first two are the area code. These are:</p>
				<div className={`lo9-figure-container`} >
					<figure className="figure centre max1000">
						<div className="svg-container" title="Click to hear">
							<svg
								height="542.438"
								width="491.813"
								viewBox="0 0 542.438 491.813"
								xmlns="http://www.w3.org/2000/svg"
								className="zoomable-svg">
								<g id="g05" onClick={this.handleClick}>
									<path d="m199.12 474.01-1.937 1.03.344.032 3.312 5.469-2.156 1.969 1.563 2.343 2.343 3.5-1.937 2.531-3.125 7.032-5.281 4.5 1.375 2.75-1.188.781-2.906-.594-.813 6.438-1.562 1.187-.313 4.032.5-.282 3.313 1.969 3.906 2.938.375 2.343 3.125 2.532h2.563l6.437-2.75 2.719 3.125 3.719 1 1.375-2.344 1.75.781 3.78.25-.25-10.5h1.97l1.75.875 1.25-1.219-.188-1.937 2.469-1.438-.875-3.687-1.063-.906-2.125.718 1.063-1.781-.531-2.281-3.188-2.313.188-1.594 1.78-3 2.282-.875v-1.25l1.406-2.125.938-1.312-3.563-1.844h-4.781l-.719-1.437h-2.468l-.72-1.594h-2.28l-.72.719h-2.655l-.157-1.594-2.125-1.406.719-.719.344-1.75-.531-.531-1.063-2.844-2.312-.344-2.282-1.25.157-3.344z" className="land departement65" transform="translate(-27.84 -49.04)" />
									<path d="m192.058 474.353-2.812 1.594-5.657-.187-.531-.875-3.719 1.25-2.843.875-2.125-1.594-2.282.719-.718-.907h-2.813l-1.781.906-4.594-.187-2.469 1.938-4.437-.344-.875 1.25-1.063-.375 1.407-1.406-2.47-1.938-3 2.656-5.124.344-5.625-2.812-.813 1.437-4.5 5.469-3.5 1.375-2.531.375v2.156l2.344 2.156 3.5.188.187 2.531 2.75.219.782-1.781 3.718 1.562 2.344.594.563 2.344-1.344 1.187v3.688l-2.75 1.375-.188 1.75 1.75 1.968 3.125.969.594-2.937 1.75-1.938-.187 2.531 1.375 1.969h3.5l1.562 2.125 4.688.781 4.5 2.75h7.406l.406 4.094 5.063 3.906 1.968 2.344 2.157-1.156 1.937-.407.969.97 1.781-.97 3.406-1.875.313-4.03 1.562-1.188.813-6.438 2.906.594 1.188-.781-1.375-2.75 5.28-4.5 3.126-7.031 1.937-2.532-2.343-3.5-1.563-2.344 2.156-1.968-3.312-5.469-5.281-.375z" className="land departement64" transform="translate(-27.84 -49.04)" />
									<path d="m159.714 419.916-6.187 3.187-1.594.063-3.469 18.562-4.5 17.188-1.375 6.656-1.156 4.688-2.906 5 5.625 2.812 5.125-.344 3-2.656 2.469 1.938-1.407 1.406 1.063.375.875-1.25 4.437.344 2.469-1.938 4.594.188 1.781-.907h2.813l.718.906 2.282-.718 2.125 1.594 2.843-.875 3.719-1.25.531.875 5.657.187 2.812-1.594-1.375-2.406 1.375-3.719 1.938-2.531-.594-3.312 1.562-1.563-2.312-3.906 1.937-2.344 2.157-.406 1.937.781 2.75-2.344.969 2.938.969 1.375 2.156-.594-.188-2.531.625-1.375-.468-1.219.53-3.875 2.126-2.125-1.063-1.25-2.312-.187-2.656-1.032-3.875.344-.72-4.25-2.468-3-1.062-.344.375 3.531v1.063l-3.375.156-3.532-1.219-.718-4.437-2.47-2.656-1.75-.156-.187-1.594-1.937-1.25-3.188-.875.875-1.063v-1.062l-1.062-.875-1.219-1.063-3.562.531-2.094 1.75-1.438.188-2.281-1.594-3.375 1.406-1.594-1.062 1.438-1.75.156-2.312z" className="land departement40" transform="translate(-27.84 -49.04)" />
									<path d="m161.152 360.697-3.125 4.688-.969 16.406-2.531 16.594-1.781 12.875-.188 3.343 1.375-4.5 2.719-3.531 3.906 3.531.406 1.156 1.157 1.563-4.875.219-.782-1.188-1.937.781-.406 2.938-2.157 2.938v4.468l-.031.188 1.594-.063 6.187-3.187 3.344 1.219-.156 2.312-1.438 1.75 1.594 1.063 3.375-1.407 2.281 1.594 1.438-.187 2.094-1.75 3.562-.532 1.219 1.063 1.062.875v1.062l-.875 1.063 3.188.875 1.937 1.25.188 1.594 1.75.156 2.469 2.656.718 4.438 3.532 1.218 3.375-.156v-1.062l-.375-3.532 1.062.344 2 2.438 3.125-.5 1.438-1.407-.188-1.937-1.25-1.063.375-1.969h1.938l1.937-1.218-.875-1.781-.531-2.657 1.406-2.469 3-4.593 1.781-2.125 1.594-.531.344-1.75-2.125-.188-.875-1.937.687-1.938 2.5-.531 1.75-.531 2.063-.282-.125-.094-.156-3.875 1.937-1.406-2.469-1.594-2.468 3-6.032.188-.531-1.437-1.75-.875 1.406-1.782v-1.937l-.718-1.063v-1.062l1.78-1.063.532-3.156 1.063-2.844-1.063-1.594h-1.937l-1.032-1.218-1 2.094-1.937-1.375-2.75 1.375-2.344-.375-4.469-4.5-2.75-.188-.781-6.25-5.094-.594-.187-2.937-.969.969h-5.781l.281 1.25 1.375 5.656.375 5.656-.969 1.563-.968-4.688-2.75-10.719-9.97-9 .22-4.094z" className="land departement33" transform="translate(-27.84 -49.04)" />
									<path d="m229.746 355.947-1.75 3.125-2.75.375-.188 4.688-9.187 6.25-.188 6.843-3.531 3.5-1.938 1.781-3.906-.406-2.156 3.719-.563 1.219 1.032 1.219h1.937l1.063 1.593-1.063 2.844-.531 3.156-1.781 1.063v1.062l.718 1.063v1.937l-1.406 1.781 1.75.875.531 1.438 6.032-.187 2.468-3 2.469 1.593-1.937 1.406.156 3.875 2.844 1.97.343 3.687 3 1.062 1.782-1.594h3.875l2.125-1.75 1.25.188.343 1.406h3.907l.875-1.062 1.406.187 1.594 1.75v1.25l-1.407.875.532 1.25 1.937.156 2.469-2.28h2.125l1.406 1.593 3.063 1.281.187-.5 1.781-1.75.188-2.937 4.281-.375 2.75-3.906-1.187-.407-.188-2.125 3.313-.406.218-1.937 1.563-1 1.75-3.125-1.75-1.938v-2.156l1.344-1.156-1.75-2.75.187-4.282-4.281.188-1.75-1.188 1.562-1.937-2.156-1.75 1.563-1.969-1.563-.781v-2.719l3.906-3.531-2.156-1.75-1.156-2.938-4.125-.594-1.375-.968 2.937-1.375-.968-1.344-4.282-.594-1-3.906-6.25-.594-1.375 1.969-1.343.375-1.782-2.344.813-2.156-1-1.937z" className="land departement24" transform="translate(-27.84 -49.04)" />
									<path d="m215.152 408.853-2.063.281-1.75.532-2.5.531-.687 1.938.875 1.937 2.125.188-.344 1.75-1.594.53-1.781 2.126-3 4.594-1.406 2.468.531 2.656.875 1.782-1.937 1.219h-1.938l-.375 1.968 1.25 1.063.188 1.937-1.438 1.406-3.125.5.469.563.719 4.25 3.875-.344 2.656 1.031 2.312.188 1.063 1.25-2.125 2.125-.531 3.875.468 1.219.75-1.563 2.313 1.969 3.125-3.125 1.375 1.938 3.312-.594 3.532-.375 1.562-2.75 5.844-.563 2.937 2.906 1-.968 1.938-.594-.781-2.719 2.937-.781 3.719-.781-.813-2.344 1.188-1.375.969-3.719-2.157-2.344 1.375-4.468 2.938 1.75 4.312-.781-1.968-4.313-1.563-5.844 3.906-.187.782-2.063-3.063-1.281-1.406-1.594h-2.125l-2.469 2.281-1.937-.156-.532-1.25 1.407-.875v-1.25l-1.594-1.75-1.406-.187-.875 1.062h-3.907l-.343-1.406-1.25-.187-2.125 1.75h-3.875l-1.782 1.593-3-1.062-.343-3.688z" className="land departement47" transform="translate(-27.84 -49.04)" />
									<path d="m267.37 392.79-4.156 1.938-.593.094.125.188-1.344 1.156v2.156l1.75 1.938-1.75 3.125-1.563 1-.218 1.937-3.313.406.188 2.125 1.187.406-2.75 3.907-4.281.375-.188 2.937-1.781 1.75-.969 2.563-3.906.187 1.563 5.844 1.656 3.625 2.5-.094.156 1.031-1.406 1.594 1.062 2.125h1.594l1.75 1.938h1.594l1.25-1.406.344.375v1.75l.53 2.312 3.72.156 3-3.187 1.593-.156.532.875.875 1.937h1.437l.531-3.531 3 .375 1.75-2.125 2.844.687 4.25-1.937.031.375 1.375-1.438-1.781-2.656-.687-3.531 2.28-1.938 1.063.344 3.188-3.531 1.75.187.719-.906h3.53l1.25-1.406.345-1.094-1.594-.219 1.094-3.312-2.5-1.094 2.5-5.812-3.313-2.47-1.125-7.187-3.031-.812-2.219 2.187-1.094-1.937-3.312 3.312-2.219.281-3.844-5.5z" className="land departement46" transform="translate(-27.84 -49.04)" />
									<path d="m257.12 491.853-1.25.875-.53 1.063 2.468 1.781.719 1.25-.531 1.031-4.25.375-1.22 1.75.157.531 1.594.532.906 1.25-1.062 1.75-1.25-.156-1.938-1.782-2.312-.687-2.282.156-4.062 2.469.156 3.375 1.063.719-.688 2.625-4.625 1.25-1.75 2.125v3.53l.719 1.063-1.656 1.532 1.062.593 6.031 1.157h2.563l3.312 4.312 8.407-.406 3.312 5.281 2.938-1.187 8.593 1.187.625 3.594 6.063-1.407 2.219-1.937 3.312-.844.813-1.656 7.187-.531-4.406-5.25-3.594 1.937-6.344-5.25 1.375-1.937h4.969l-.562-4.688v-3.593l-.813-6.657-9.687-4.687.562-1.656-1.844-2.063-1.562.656-2.125.344-3.906-1.781-1.063-.344 1.594 1.938-.688 1.593-3.375-.344-.156-1.78-1.969-2.657z" className="land departement09" transform="translate(-27.84 -49.04)" />
									<path d="m227.777 447.353-5.844.563-1.562 2.75-3.532.375-3.312.594-1.375-1.938-3.125 3.125-2.313-1.969-1.375 2.938.188 2.531-2.156.594-.97-1.375-.968-2.938-2.75 2.344-1.937-.781-2.157.406-1.937 2.344 2.312 3.906-1.562 1.563.594 3.312-1.938 2.531-1.375 3.719 1.563 2.75 4.937.344 1.938-1.031h3l-.157 3.343 2.282 1.25 2.312.344 1.063 2.844.53.531-.343 1.75-.719.719 2.125 1.406.157 1.594h2.656l.719-.719h2.28l.72 1.594h2.468l.719 1.437h4.781l3.563 1.844.312-.437 1.938-1.063 3.531-4.594 6.563.531 2.812 1.938.906-1.25 1.407-4.219 1.75-4.062 3.718-1.594 1.782-.719-.532-1.594-1.781-.187-.687-1.75h-1.438l-2.281-2.312.156-1.594-3-3-.531-1.906-1.938.843-.531-1.062 1.25-1.938-1.437-1.406v-2.469l-1.22-1.25-3.905-.187v-2.281l2.125-1.594v-1.781l2.312-1.063-1.25-.687-1.406.687h-2.844l-.875-.812-.469.156-1 .969z" className="land departement32" transform="translate(-27.84 -49.04)" />
									<path d="m264.902 457.916-2.844 1.062-.875 1.406-1.062-1.218-1.938-.188-.375 1.781-1.219.5 1.75.907-1.218 1.937-4.438 1.25-1.937-2.312h-1.75l-1.438.875h-5.125l-.531.219.531 1.906 3 3-.156 1.594 2.281 2.312h1.438l.687 1.75 1.781.188.532 1.593-1.782.719-3.718 1.594-1.75 4.062-1.407 4.219-.906 1.25-2.812-1.937-6.563-.532-3.531 4.594-1.938 1.063-1.25 1.75-1.406 2.125v1.25l-2.281.875-1.781 3-.188 1.593 3.188 2.313.53 2.281-1.062 1.781 2.125-.719 1.063.907.875 3.687-2.469 1.438.188 1.937-1.25 1.219-1.75-.875h-1.97l.25 10.5 7.938.531.407-9.593 2.718.406 4.032 2.343 1.656-1.53-.719-1.063v-3.532l1.75-2.125 4.625-1.25.688-2.625-1.063-.718-.156-3.375 4.062-2.469 2.282-.156 2.312.687 1.938 1.781 1.25.157 1.062-1.75-.906-1.25-1.594-.531-.156-.532 1.219-1.75 4.25-.375.53-1.031-.718-1.25-2.469-1.781.532-1.063 1.25-.875 1.218.344 1.969 2.656.156 1.781 3.375.344.688-1.594-1.594-1.937 1.063.344 3.906 1.781 2.125-.344 1.562-.656-.375-.406 2.5-1.125.532-3.031 3.062-1.375-.844-1.938 2.782-2.5 1.375 2.5 4.125-1.375.78-.125.063-1.281v-2.5l-2.125.375-2.656-.719-2.312-2.812-.875-1.25-4.594-1.938-1.063-1.594 1.407-.531v-1.937l-1.407-1.594-1.781-2.844-.156-2.469-.531-.344-2.125-2.5-.875-2.625z" className="land departement31" transform="translate(-27.84 -49.04)" />
									<path d="m240.09 430.166-1.376 4.469 2.157 2.343-.97 3.719-1.187 1.375.813 2.344-3.719.781-2.937.781.78 2.719-1.468.438.875.812h2.844l1.406-.687 1.25.687-2.312 1.063v1.78l-2.125 1.594v2.282l3.906.187 1.219 1.25v2.469l1.437 1.406-1.25 1.938.531 1.062 2.469-1.062h5.125l1.438-.875h1.75l1.937 2.312 4.438-1.25 1.218-1.937-1.75-.906 1.219-.5.375-1.782 1.938.188 1.062 1.219.875-1.407 2.844-1.062 1.281.594 1-1.657-1.75-1.937h3.344l1.062-1.938 2.313-2.125h-2.313l.719-3 6-.719 2.313-1.406 2.812-1.062.906-.906-1.093-2.813 1.593-3.187-2.812-.188-.344-4.406-4.25 1.937-2.844-.687-1.75 2.125-3-.375-.531 3.531h-1.437l-.875-1.937-.532-.875-1.593.156-3 3.187-3.72-.156-.53-2.312v-1.75l-.344-.375-1.25 1.406h-1.594l-1.75-1.938h-1.594l-1.062-2.125 1.406-1.594-.156-1.03-2.5.093.312.688-4.312.78z" className="land departement82" transform="translate(-27.84 -49.04)" />
									<path d="m314.59 398.853-5.532 4.719v4.688h-1.375l-.562 4.406-1.375.562-1.094 2.469h-6.094l-.531-.812h-2.781l-1.657 2.75-.593-.063-.344 1.094-1.25 1.406h-3.531l-.72.906-1.75-.187-3.187 3.531-1.062-.344-2.281 1.938.687 3.531 1.781 2.656-1.375 1.438.313 4.031 2.812.188-1.593 3.187 1.25 3.188 1.593-.907.719 1.594 2.281-2.281 3.375-.188 3.344 2.469 5.844 1.063 2.125 3.718 3 1.406 1.594 4.063-.188 1.594 1.938 3.562v1.938l3.53 4.594 3.376 1.75 2.125-.532 1.062-1.406 1.594.375 3.656 2.344h4.969l-.281-5.781v-1.938h1.656l3.031 1.656h3.032l-.532-3.312 1.657-1.406 3.312-.532v-2.781l3.594-1.656-.844-3.844h-3.031l-2.75-.562-.563-2.22 2.219-.53v-2.782l2.188-1.937-1.657-.813-4.687.813.281-2.188-3.312-1.406-.844-6.625v-4.687l-2.75-1.938.281-3.875-5.812-7.156-.563-5.531h-1.906l-.844-5.532-3.875.563-.531-3.594z" className="land departement12" transform="translate(-27.84 -49.04)" />
									<path d="m290.714 442.353-3.375.188-2.281 2.281-.719-1.594-1.593.906-.157-.375-.906.907-2.812 1.062-2.313 1.406-6 .72-.719 3h2.313l-2.313 2.124-1.062 1.938h-3.344l1.75 1.937-1 1.656.313.125.875 2.625 2.125 2.5.53.344.157 2.469 1.781 2.844 1.407 1.594v1.937l-1.407.531 1.063 1.594 4.594 1.938.875 1.25 2.312 2.812 2.656.719 2.125-.375v2.5l-.062 1.281 1.156-.156-.281 1.375h3.875l3.594 1.125.28-3.594h1.657l6.063 1.094h5.812l4.406-1.375 1.125-3.594-3.031-2.781.813-2.75 1.656-2.469 2.75 1.906 7.187-2.469 1.125-2.218-3.656-2.344-1.594-.375-1.062 1.406-2.125.531-3.375-1.75-3.531-4.593v-1.938l-1.938-3.562.188-1.594-1.594-4.062-3-1.407-2.125-3.719-5.844-1.062z" className="land departement81" transform="translate(-27.84 -49.04)" />
									<path d="m169.214 316.103-2.75.188-5.968 3.625 1.437 1.312-3.125 2.531-.375 1.97-2.937.374-1.563-1.75-3.906-.375-.406-1.969-2.344-1.562-3.313 1.188 2.157 3.125h2.718l2.75 1.75 2.157 1.75 4.093-.188.782 1.75 2.718.594 1 2.719 1.75.78-.187 2.157-2.344-.375-.781 1.156 1.75 2.531-.969 4.313-2.344-.187.188 2.718.594.969h-2.75l-.375-1.562 1.75-2.344-.594-1.344-.969-.781-.406-4.688-3.313-.406-2.718-3.312-.407 6.843 4.5 3.313.375 3.719.782 4.28.406 4.313 2.344-.219 4.093 3.344 2.75 1.563.188 1.937 2.156.406 6.25 6.25 1.469 6.75h5.781l.969-.968.187 2.937 5.094.594.781 6.25 2.75.188 4.469 4.5 2.344.375 2.75-1.375 1.937 1.375 1.563-3.313 1.562-2.719-4.156-2.812-1.281-1.719-1.719-1.906-4.031.656-1.281-.656-.188-1.063 2.125-.844v-.406l-1.5-.437-1.062-.844 2.562-2.125v-1.5l-1.281-1.281.844-.844.437-2.125-1.5-1.469-1.281-2.125-2.313-2.125-1.718-1.062 1.5-1.719-.844-.187-.219-4.47-1.719-.656 2.344-1.25h2.781l1.25-1.062h2.344l.438 1.063 2.125.187 1.468-.625.438-4.031 1.687-6.156.063-.032-1.531-1.469-.438-2.125-2.75-1.28-3.625-2.532-4.469.406-2.75-3.594-4.031-.218-3.187-2.344v-1.281l-2.125-2.313-.094-2.875-2.938-2.187-3.718 1.562z" className="land departement17" transform="translate(-27.84 -49.04)" />
									<path d="m285.652 353.103-.844 2.125-3.187.625-1.25 2.125h-1.5l-2.125-.625-1.5 2.531-2.313.22-1.5 2.75h-1.906l-1.5 1.5-3.813-.438-1.281 2.125-1.469-.188-2.562 3.188-2.344-.875-1.094 2.219.844 2.156 2.156 1.75-3.906 3.531v2.719l1.563.781-1.563 1.969 2.156 1.75-1.562 1.937 1.75 1.188 4.281-.188-.187 4.281 1.625 2.563.593-.094 4.157-1.937 4.968 2.219 3.844 5.5 2.219-.282 3.312-3.312 1.094 1.937 2.219-2.187 3.031.812.094.656 2.531-1.78-.781-1.938-1.188-1.188 1.563-1.937h1.562l1-3.125.782-1.563-.594-3.531 2.531-3.5 3.531-2.156.188-5.469 1.75.969 1.969 2.156h1.937l1.188-1.375-.97-2.344.97-3.5-.594-3.312-1.188-1.375v-2.75l1.782-2.906-.407-2.75-.437-.438-1.969 1.531h-3.844l-1.25 1.906h-2.343l-1.907-1.906-.875-1.281h-4.875l-1.062-1.469z" className="land departement19" transform="translate(-27.84 -49.04)" />
									<path d="m276.027 313.353-1.156 3.125-3.532-.187-.781-.406-2.344.218-1.75-1.187-3.375 3.875.063 2.875-2.344 4.656.438 2.344 2.53.625 1.72 4.25 1.687 1.719-.625 8.062 3.594-1.062 1.5 1.906-2.344 1.906v1.938l1.906.187 3.407-.187 1.062-1.5h.844l-.406 2.562 2.75 1.25 2.562 1.719v1.062h-1.5l.438 2.531 1 .625.25-.406 3.187-.625.844-2.125h1.5l1.062 1.469h4.875l.875 1.281 1.907 1.906h2.343l1.25-1.906h3.844l1.969-1.531-4.063-4.062-.375-1.75 3.719-2.157 2.156-1.156.563-2.75 2.344-1.75-.782-3.719-1.562-1.937-.375-6.063-2.156-5.062-2.157-.781-1.562-2.75-1.375 1.75-1.344-1.75v-2.344l-2.344-3.313-6.437.781-3.719-.968z" className="land departement23" transform="translate(-27.84 -49.04)" />
									<path d="m259.433 316.29-1.75 1.75-4.906-.374-.563-.125-3.718.687-2.157 1.781v2.344l-4.281.188-2.531 2.937-1.563 1.156 1.344 1.563-.187 5.281-.97 1.75 1.563 1.75 2.719.219.594 2.719.187 1.75-3.5.781-1.75.594.375 4.875-2.343 1.562-1.97.594-.968 2.75-1.562.188-.657 2.968 4.563.156 1 1.938-.813 2.156 1.782 2.344 1.343-.375 1.375-1.969 6.25.594 1 3.906 4.282.594.968 1.344-2.937 1.375 1.375.969 4.125.593.312.781 1.094-2.218 2.344.875 2.562-3.188 1.469.188 1.281-2.125 3.813.437 1.5-1.5h1.906l1.5-2.75 2.313-.219 1.5-2.53 2.125.624h1.5l1-1.719-1-.625-.438-2.53h1.5v-1.063l-2.562-1.719-2.75-1.25.406-2.562h-.844l-1.062 1.5-3.407.187-1.906-.187v-1.938l2.344-1.906-1.5-1.906-3.594 1.062.625-8.062-1.687-1.72-1.72-4.25-2.53-.624-.438-2.344 2.344-4.656-.063-2.875-.531.625z" className="land departement87" transform="translate(-27.84 -49.04)" />
									<path d="m208.652 271.166-3.719 3.906-.937 1.625.312 4.813 1.688-.22.218 2.126.657 3.406 1.062 2.344-1.281 1.469.625 1.062-.844 1.5v.625l1.5 1.719v1.062l-.656 1.688-2.125 3.187 2.125.844.656 1.5-.875 2.313-.187 1.062-1.282 2.125v1.5l.844.219v4.469l1.5 1.062-.656 1.469.219 1.281 1.687 1.906.875-1.281v-1.062l1.688-.844 1.28.844v3.187l-1.28 1.5-1.063 2.531 1.469 2.344 3 .844-.656 1.937-2.782.469 2.563 3.125 3.406-.219 2.969-1.062 3 1.719 1.062-.844-.218-2.781 1.687-1.282 1.5 2.563 1.25 1.281 3.625-1.5 1.5-1.687h3.375l1.75.875.125-3.688-1.344-1.562 1.563-1.157 2.531-2.937 4.281-.188v-2.344l2.157-1.78 5.28-.97.376-2.937-2.125-1.156-1.188-4.094-3.125-.406-1.937-1.938-3.719-2.937.781-2.344v-3.719l-3.531-3.5-.375-2.75-3.344-3.5-1.156-4.687-1.375-.594-1.562-2.156-1.563.969.406 2.156-5.093 1.187h-5.844l.187-2.344v-3.718l-4.687-1.375v-2.344l-3.719-.781-.781-3.125z" className="land departement86" transform="translate(-27.84 -49.04)" />
									<path d="m226.183 330.353-1.687 1.281.218 2.782-1.062.844-3-1.72-2.969 1.063-3.406.219-2.563-3.125-.812.156-3.406 1.688-2.563.656v1.469l-1.469 1.719.407 1.062-1.907 1.063-1.687 6.156-.438 4.031-1.468.625-2.125-.187-.438-1.063h-2.344l-1.25 1.063h-2.781l-2.344 1.25 1.719.656.219 4.469.844.187-1.5 1.719 1.718 1.062 2.313 2.125 1.281 2.125 1.5 1.469-.437 2.125-.844.844 1.281 1.281v1.5l-2.562 2.125 1.062.844 1.5.437v.406l-2.125.844.188 1.063 1.28.656 4.032-.656 1.719 1.906 1.281 1.719 4.156 2.812.594-1 3.906.406 1.938-1.78 3.531-3.5.188-6.844 9.187-6.25.188-4.688 2.75-.375 1.75-3.125 1.093.031.657-2.969 1.562-.187.969-2.75 1.969-.594 2.343-1.562-.375-4.875 1.75-.594 3.5-.781-.187-1.75-.594-2.719-2.719-.219-1.562-1.75.969-1.75.062-1.594-1.75-.875h-3.375l-1.5 1.688-3.625 1.5-1.25-1.281z" className="land departement16" transform="translate(-27.84 -49.04)" />
									<path d="m201.62 274.885-5.28.187-4.876.969-5.281.406v2.719l-2.719 1.781-6.062-1.375-4.094 1.75 1.938 2.75v2.344l4.687 3.906-1.156 2.531 3.125 3.5-1.375 1.781 1.937 2.907.594 5.469-1.156 1.562 1.375 2.344-1.375 2.562.187 1.563 1.563-1.188 1.937 1.969-2.718 1.75-.97 1.156-2.155.594-2.532 1.188-.187-.157.094 2.875 2.125 2.313v1.281l3.187 2.344 4.031.219 2.75 3.593 4.469-.406 3.625 2.531 2.75 1.281.438 2.125 1.53 1.47 1.845-1.032-.407-1.062 1.469-1.72v-1.468l2.563-.656 3.406-1.688 3.594-.625.656-1.937-3-.844-1.469-2.344 1.063-2.531 1.28-1.5v-3.187l-1.28-.844-1.688.844v1.062l-.875 1.281-1.687-1.906-.22-1.281.657-1.469-1.5-1.062v-4.47l-.844-.218v-1.5l1.282-2.125.187-1.062.875-2.313-.656-1.5-2.125-.844 2.125-3.187.656-1.688v-1.062l-1.5-1.719v-.625l.844-1.5-.625-1.062 1.281-1.47-1.062-2.343-.657-3.406-.218-2.125-1.688.219-.312-4.813-.407.719-1.375-1.156z" className="land departement79" transform="translate(-27.84 -49.04)" />
									<text><tspan x="161" y="388">05</tspan></text>
								</g>
								<g id="g04" onClick={this.handleClick}>
									<path d="M465.24 534.434v2.157l1.969 1.375 3.313 1.937.218 1.563-1.969.593-3.125.594v1.344l1.157 1.187.219 3.907 4.28 1.375 1.563.375 1.375 2.156-.969 1.375-1.562.562-1.187 2.157-1.157 1.375.563 3.5 2.937-.188.781.594 2.75-1.375.782.781-1.375 2.938 1.375 1.375-2.344 1.75-1.562 3.5 4.28 1 6.063.562-2.531 2.938s-1.19-.46-1.719-.22c-.015.009-.048.023-.062.032l-.031.031-.032.032-.031.03c-.007.01-.025.022-.031.032-.003.005.002.026 0 .031-.005.011-.028.051-.031.063-.002.006.001.025 0 .031-.003.013-.03.05-.032.063v.062c0 .977-1.344 3.344-1.344 3.344l1.938 2.125 3.531 2.156 6.625 1.75 1.938.781 1.781.782-1.187 2.156 3.125-.188.593 1.375h3.125l.781-3.718-1.968-.407 2.75-2.906-.969-1 .188-1.75 3.53-1.937.188-2.157-2.344-.187-1.562 1.344v-1.938l3.125-.187.969-2.344.781-6.844-.594-2.937-.062-2.813-3.406 2.25-4.063.156-.344-2.812.531-.719-1.25-.875-.343-4.781-.531-.875h-2.125l-1.063-.875v-3.375l-1.406-.875-1.063-.531-2.125-2.657.156-1.593h-2.625l-.906-2.657h-3.719l-1.937-2.656.531-.875-1.219-.719-2.843.532-1.063-.688h-3.875l-.375-1.062-2.187-.407z" className="land departement2a" transform="translate(-27.84 -49.04)" />
									<path d="m497.865 495.372-2.937 1.969.406 1.937 1.563 1.969-1.75 1.344.78 1.562-1.187 1.375v1.75l1.969 1.781v2.72l-1.187 2.53-1.344.594-1.563-2.156-2.75.219-.594-.407h-2.343l-2.125 1.97-.813 3.312-5.062.968-3.906 3.313-.782 2.156-1.937-.187-1-1.188-.563 3.344-1.375.562-.406 3.125.594 1.375-2.156 1.563-.594 1.562 2.187.407.375 1.062h3.875l1.063.688 2.844-.532 1.218.72-.531.874 1.938 2.656h3.718l.906 2.657h2.625l-.156 1.593 2.125 2.657 1.063.53 1.406.876v3.375l1.063.875h2.125l.53.875.344 4.781 1.25.875-.53.719.343 2.812 4.063-.156 3.406-2.25-.125-5.781 4.687-6.625v-10.938l-1.937-3.718-.594-11.72-1.375-2.155-2.531-1.938-.406-7.25 1.187-3.312-1.562-5.282-.97-4.28-.812-1.188z" className="land departement2b" transform="translate(-27.84 -49.04)" />
									<path d="m399.62 455.385-5.468 3.125-1.406 10.5-5.782-.813-1.656 4.406 1.375 1.938-6.344 3.875-1.75 4.062 6.188.281 8.219.594 1.562 1.563h-2.937l-1.938 3.312 8.375 1.75 6.656-1.156-3.531-3.344 2.344-1.937 3.719 1.562 1.75 3.719 11.156.188 2.906-1.188.594 1.781-3.125 2.719 4.312.188-.781 1.968-1.187 1.375h9.562l4.688 1.563.468.625.188-3.875 1.406-1.594 1.781-1.062-.187-1.063-1.406-1.406h-1.407l-.906-1.063 1.594-1.437v-.531l-1.75-.875v-1.407l3.875.188.906-.719-3.375-3.187.188-3.72-2.125-1.75 1.75-3.53 4.25-2.844-3.188-2.125-2.281 1.781-5.313 1.219-4.25-.531-7.593-3.157-4.594.156-3.875-1.75-1.438-1.968-3-3.344-7.062-3z" className="land departement13" transform="translate(-27.84 -49.04)" />
									<path d="m406.902 426.822-2.75.219-2.125 3.312.562 3.5 3.313.406-.563 1.563-2.562.188-2.906 2.937-.782-.969.563-3.906-1.156-1.375-5.282.781-1.031 2.094.563.313 3.312 5.5v4.437l5.813 5.781v2.5l-2.25 1.281.156.063 7.062 3 3 3.344 1.438 1.969 3.875 1.75 4.594-.157 7.593 3.156 4.25.532 5.313-1.219 2.187-1.719.282-1.469-4.063-4.593h-4.437v-1.594l1.593-1.781v-1.938l-3.531-1.75-.344-2.844 1.938-.875v-2.468l-2.125-.375-.156-2.656-.032-.188-1.781-.125-2.937-2.156-.782-2.531-5.468-.407-4.094-.375-.406-2.344 1.375-2.937-2.532 2.156-3.906-.406-.781-1.375 2.719-3.687z" className="land departement84" transform="translate(-27.84 -49.04)" />
									<path d="m477.683 458.666-2.969.125-1.406 1.437-5.312-.187-4.594 3.344-3.156-2.125-4.97 1.593-.874 1.781-3.531 2.657-6.375-4.25-5.157 1.687-.25 1.375.094-.062 3.188 2.125-4.25 2.844-1.75 3.53 2.125 1.75-.188 3.72 3.375 3.187-.906.719-3.875-.188v1.406l1.75.875v.532l-1.594 1.437.906 1.063h1.407l1.406 1.406.187 1.063-1.781 1.062-1.406 1.594-.188 3.875.532.719 3.5 1.562.968 3.906 2.157.406 1.968-1.375 3.5-2.156 6.063.594-.188 1.563-1.968.968 4.687.219-1.156-1.187-.406-2.532 2.53-1.75 2.938.969 1.188.375.969 1.188 1.375-.97.375-2.562 1.562-1.344h4.094l1.187-1.78 2.719.78 3.125-1.343v-5.094l-4.094.188 3.125-1.938 1.563-2.156.406-3.125 5.656-.781 3.157-3.532-2.188-2.25v-1.25l-1.062-1.062 1.406-1.219-.344-1.969-2.312-.875h-1.22l-2.124-2.125-.375-3.719-2.281-1.062-2.313-.156-.875-2.125z" className="land departement83" transform="translate(-27.84 -49.04)" />
									<path d="m483.746 409.822-2.125 3.188-3 1.78-1.063 2.126-2.656.156v1.938l-.719 1.062-1.062 2.656-6.344-.156-3-1.594-1.969 1.406-3.687-.187-.907 1.25h.907l.53 3.344-.905.375-3.344-2.125v-1.25l-1.938-1.594h-1.062v1.781l-1.594.344-3.375 1.938-2.125 3.562-.531 1.75 1.25.344.187 2.844h-1.25l-1.937-1.782-1.063.188.532 1.594 3 3.343-1.938.719-1.406-.875h-3.563l-3 2.813-.031-.032-.125 1.156-1.156-1.375-1.563-1.375-1 2.938-1.75 1.563-.75-.063.032.188.156 2.656 2.125.375v2.469l-1.938.875.344 2.843 3.531 1.75v1.938l-1.593 1.781v1.594h4.437l4.063 4.594-.032.093 5.157-1.687 6.375 4.25 3.53-2.656.876-1.782 4.969-1.594 3.156 2.125 4.594-3.343 5.312.187 1.406-1.437 2.969-.125.063-.031-.72-1.782.876-1.062-.344-1.406h2.813l.718-.875 2.657-1.438 2.125 1.438 1.406-.907-3.344-3-3.562-3.344-1.22-.375-.187-2.656-2.125-3.156.719-4.594 1.063-2.5 1.937-1.594.188-2.468 2.656-1.406.406-.157v-3.781l2.75-.375-1.562-1.375-1.97-.594-.968-2.531.781-1.75 3.5-3.719-.562-2.75.5-.531z" className="land departement04" transform="translate(-27.84 -49.04)" />
									<path d="m483.808 427.353-.406.156-2.656 1.407-.188 2.469-1.937 1.593-1.063 2.5-.719 4.594 2.125 3.156.188 2.656 1.219.375 3.562 3.344 3.344 3-1.406.906-2.125-1.437-2.657 1.438-.718.875h-2.813l.344 1.406-.875 1.062.719 1.781-2.313 1.407.875 2.125 2.313.156 2.28 1.063.376 3.718 2.125 2.125h1.219l2.312.875.344 1.969-1.406 1.219 1.062 1.062v1.25l2.188 2.25.156-.187.187-4.469 3.907.781 1.375-1.781 1.968.406.188-6.062 4.5-.375 3.906-3.531h3.5l.188-2.157 3.53-2.125-1.968-4.5 2.938-2.531-.594-2.937 4.312-1.375 1.157-4.282-.563-2.937-1-1.75-.781-2.563-2.906.219-9.188 3.313h-2.937l-5.063-4.094-5.094-1.375h-2.937v-3.531l-4.094-2.532z" className="land departement06" transform="translate(-27.84 -49.04)" />
									<path d="m467.246 384.635-1.75.78-.407 2.938-3.5.406-.593-2.75-1.157-1.156-3.531.375-1.375 1.188-.781 4.094.594.968 4.093.406.782 2.532 1.562.781v4.281l-3.719-.187-1.562 1.75-4.469-.781-2.531 2.156-1.781-.781-2.532 1.968.969 1.75-1.562 1.563h-4.875v2.344l1.562.78-.594 1.376-3.312 1.344-4.094.406-1.187 3.719-.188 2.343 2.156 1.75-2.156 2.531-2.719-1.375-3.125-.187-.406 1.75 1.969 1.375-2.375 1.563.812 3.312 6.625 1.781 1.188 2.531 1.937.375-.656 6.094.031.031 3-2.812h3.563l1.406.875 1.938-.719-3-3.344-.532-1.593 1.063-.188 1.937 1.781h1.25l-.187-2.843-1.25-.344.531-1.75 2.125-3.562 3.375-1.938 1.594-.344v-1.781h1.062l1.938 1.594v1.25l3.344 2.125.906-.375-.531-3.344h-.907l.907-1.25 3.687.188 1.969-1.407 3 1.594 6.344.156 1.062-2.656.719-1.062v-1.938l2.656-.156 1.063-2.125 3-1.781 2.125-3.188 2.53.125 1.845-2 2.125.188v-1.75l-2.72-1.375-.593-5.657-2.156-.781-2.719.406-5.094-2.562-.781-5.844-2.906-.969-1-1.969-1.281-2.812z" className="land departement05" transform="translate(-27.84 -49.04)" />
									<path d="m340.683 397.728-5.469 1.969-1.562 3.5-3.5-2.344-2.75 8.594-2.813 6.469 4.094 5.031-.281 3.875 2.75 1.938v4.687l.844 6.625 3.312 1.406-.281 2.188 4.687-.813 1.657.813-1.032.906 6.032 4.031 5.156-1.062.875-1.25-.719-1.75 2.125-.531 3 2.812 5.125.531 2.313-3.531v-3l1.406-1.594-1.25-.344v-4.062l-2.813-3 2.313-.375 1.219-1.062.968-1.875-.968-.594.562-4.125-3.312-3.594-1.375-7.187-4.97-6.344-3.624.875-.781-2.719h-1.97l-.374 2.344-5.063 1.562z" className="land departement48" transform="translate(-27.84 -49.04)" />
									<path d="m321.527 293.447-2.719 3.5-1.562.188-1.75 1.78-1.97-2.156-5.25 5.282v3.125l.97.781.187 1.563-2.719 2.125-2.562-.782-4.875 1-2.531 2.906-.938 2 .156-.03 2.344 3.312v2.344l1.344 1.75 1.375-1.75 1.562 2.75 2.157.78 2.156 5.063.094 1.469 2.968 2.313 1.594-.72 1.25-3 1.219-.343v-1.594l2.125-.187.187 1.062 2.657-3h3l.53 1.063-1.405 1.937 2.093 2.313.375 1.406 4.938 2.844 6 .875 1.781-.188 2.656.531 2.282-1.406 1.78.875.345 2.469 2.312.531 3-.156.875 2.125 2.75 1.094.094-.969 4.687-.219-.375-11.125-1.375-2.719.563-2.156 3.25-.562.094-.219 4.093-3.125.188-7.625-1.375-1.937h-3.125l-1.156-1.563h-3.313l-.969-1.187v-2.938l-3.937-7.406-1.938-1.375-3.718 5.094-1.563.375-.594-2.532-1.75-.781-.781 1.563h-2.906l-.406-1.75-1.97 1.156-2.124 1.187-2.344-2.562-3.344-1.563-.187-2.531z" className="land departement03" transform="translate(-27.84 -49.04)" />
									<path d="m366.09 426.51-.97 1.875-1.218 1.062-2.313.375 2.813 3v4.063l1.25.343-1.406 1.594v3l-2.313 3.531-5.125-.531-3-2.812-2.125.53.719 1.75-.875 1.25-5.156 1.063-6.032-4.031-1.156 1.031v2.781l-2.219.532.563 2.219 2.75.562h3.031l.844 3.844-3.594 1.656v1.75l2.813.969v1.594l1.25.718 1.062-.906h1.406l.719 1.594h2.125l1.063-3.719h1.75l2.656-3.344 3.187.344.532 4.594 1.218 1.437 1.969-1.062 3.344 1.75 1.25 2.125 5.812 3.531 2.125 4.969v2.625l-3.718 2.125-2.407 2.156 3 .219v3.906l4.469-.219 2.406.125 1.75-4.062 6.344-3.875-1.375-1.938 1.656-4.406 5.782.813 1.406-10.5 7.719-4.407v-2.5l-5.813-5.781v-4.437l-3.312-5.5-6.907-3.875-.531 3.03-2.781.282-.813-3.031-2.781.531-.531 3.875-2.219-.812-4.687-3.063-2.22 1.125v-5.531z" className="land departement30" transform="translate(-27.84 -49.04)" />
									<path d="m294.152 483.947-.281 3.594-3.594-1.125h-3.875l.281-1.375-1.937.281-4.125 1.375-1.375-2.5-2.782 2.5.844 1.938-3.062 1.375-.532 3.03-2.5 1.126 2.219 2.469-.562 1.656 9.687 4.687.813 6.656v3.594l.562 4.688h-4.969l-1.375 1.937 6.344 5.25 3.594-1.937 4.406 5.25-.656.062.844.5 7.937-3.875-1.937-2.843-.157-3.344h18.532l-.344-2.5 4.25-2.282 4.937 3.875 2.563 1.188-.156-5.594.218-6.437-2.343.187-1.97-2.906 1.563-2.562 3.313 3.125 2.937-2.344 1.969-1.938.25-2.062-2.5-.094-.875-2.812-2.469-.188-2.312-3.375-1.781.188-2.094-1.25-.375-3-1.063.53.532 2.126h-2.47l-.187 3.531-3.687 1.25-1.781-3.719-2.47 1.594-2.124-1.594-1.063-2.469 1.782-2.125-.844-2.28-.219.062h-5.812l-6.063-1.094z" className="land departement11" transform="translate(-27.84 -49.04)" />
									<path d="m355.402 453.853-2.656 3.344h-1.75l-1.063 3.719h-2.125l-.719-1.594h-1.406l-1.062.906-1.25-.719v-1.593l-2.813-.969v1.031l-3.312.531-1.657 1.407.532 3.312h-3.032l-3.031-1.656h-1.656v1.938l.281 5.78h-4.969l-1.125 2.22-7.187 2.468-2.75-1.906-1.656 2.469-.813 2.75 3.031 2.781-1.125 3.594-4.187 1.312.844 2.281-1.782 2.125 1.063 2.47 2.125 1.593 2.469-1.594 1.78 3.719 3.688-1.25.188-3.531h2.469l-.532-2.125 1.063-.531.375 3 2.094 1.25 1.78-.188 2.313 3.375 2.469.188.875 2.812 2.5.094.125-1.063 7.031-2.156.782-1.75 5.468-.187 1.75-2.157 10.563-8.406 6.625-4.687 2.687.187 2.407-2.156 3.718-2.125v-2.625l-2.125-4.969-5.812-3.531-1.25-2.125-3.344-1.75-1.969 1.062-1.218-1.437-.532-4.594z" className="land departement34" transform="translate(-27.84 -49.04)" />
									<path d="m320.402 514.135-4.25 2.28.344 2.5h-18.532l.157 3.345 1.937 2.843-7.937 3.875-.844-.5-6.531.469-.813 1.656-3.312.844-2.22 1.938-6.062 1.406.344 2.062 2.938 2.75 5.843 1.563.188 3.5 3.125 2.75 2.344-.407 3.343-4.093 4.094-.782 6.438 2.157 5.468 4.687 1.563-1.968h1.375l1.375.968 1.156-.562.188-2.75 5.875-1.375 1.937-2.532 2.938-.968h4.093l2.563 2.718 3.125.22v-3.126l-1.563-2.156-2.75-1.187-.437-17.063-2.563-1.187z" className="land departement66" transform="translate(-27.84 -49.04)" />
									<path d="m305.746 369.197-.594 2.156.969 2.344-1.188 1.375h-1.937l-1.97-2.156-1.75-.969-.187 5.469-3.531 2.156-2.531 3.5.594 3.531-.782 1.563-1 3.125h-1.562l-1.563 1.937 1.188 1.188.781 1.937-2.531 1.781 1.031 6.532 3.313 2.469-2.5 5.812 2.5 1.094-1.094 3.312 2.187.281 1.657-2.75h2.78l.532.813h6.094l1.094-2.469 1.375-.562.562-4.406h1.375v-4.688l5.531-4.719.563.844.531 3.594 3.875-.563.844 5.531h1.906l.563 5.532 1.718 2.125 2.813-6.469 2.75-8.594 3.5 2.344 1.562-3.5 5-1.812v-1.657l-1.062-1.594-2.125-1.25 1.062-1.593-.906-.875 1.063-.344 1.25-1.062-2.125-.188-1.063-1.406-.344-3.719-1.25-1.25-.875-3.156h-4.437l-.875-2.5-1.406-.156-.72 1.406-2.812-.188-2.656-4.062-1.062-.156-2.125-1.063-1.25 1.219h-3.157l-1.593-3.344z" className="land departement15" transform="translate(-27.84 -49.04)" />
									<path d="m337.714 371.822-1.406.719v1.219l-2.125.187-1.937 1.594-3.532.531-.812 1.156.625.063.875 2.5h4.437l.875 3.156 1.25 1.25.344 3.719 1.063 1.406 2.125.188-1.25 1.062-1.063.344.906.875-1.062 1.594 2.125 1.25 1.062 1.593v1.656l.469-.156 3.531 9 5.063-1.562.375-2.344h1.969l.78 2.719 3.626-.875 4.5 5.75 2.812-4.469 5.063-3.719h4.687l1.563-4.875 3.125-.219.219-3.687h2.906l-.563-1.375-.781-2.531 1.156-1.969 2.75-1.156 1.157-4.688-2.532-2.937-3.125.187.375-3.719-6.25-2.718-2.125.187-4.312 3.531-3.938-1.28-.781.75-2.469-.72-1.75-1.78-1.062 2.124-3.031-.156-1.407-1.25-1.062 2.469-1.938-.875-1.25-2.313h-1.593l-1.407-1.219-2.125.875-2.468.188-1.407-.906-.875.531z" className="land departement43" transform="translate(-27.84 -49.04)" />
									<path d="m318.996 324.978-2.657 3-.187-1.062-2.125.187v1.594l-1.219.344-1.25 3-1.594.719-2.968-2.313.28 4.594 1.563 1.937.782 3.719-2.344 1.75-.563 2.75-2.156 1.156-3.719 2.156.375 1.75 4.5 4.5.407 2.75-1.782 2.907v2.75l1.188 1.375.594 3.312-.375 1.344 6 1.75 1.593 3.344h3.157l1.25-1.219 2.125 1.063 1.062.156 2.656 4.062 2.813.188.719-1.406.78.093.813-1.156 3.532-.531 1.937-1.594 2.125-.187v-1.22l1.406-.718.375.875.875-.531 1.407.906 2.468-.187 2.125-.875 1.407 1.218h1.593l1.25 2.313 1.938.875 1.062-2.469 1.407 1.25 3.03.156 1.063-2.125 1.75 1.781 2.469.72.781-.75-1.531-.5-.594-2.344 3.719-3.5-1.75-6.438-5.094-3.344-2.125-5.062-2.343-3.125.593-4.313 1.75-1.75-3.125-2.531.094-.781-2.75-1.094-.875-2.125-3 .156-2.312-.531-.344-2.469-1.781-.875-2.282 1.406-2.656-.53-1.781.187-6-.875-4.938-2.844-.375-1.406-2.093-2.313 1.406-1.937-.531-1.063z" className="land departement63" transform="translate(-27.84 -49.04)" />
									<path d="m403.183 308.072-2.156.219-1.375 2.531-3.688 14.438-.531 1.187-.375 4.563-1.062 1.468v6.594l-.625 1.5 3.812 2.313 1.5.218 2.344 2.125.406 3.406 2.563-.843 3.968 1.156.063-.75h1.906l2.75 2.563 2.563-1.282 1.28-3.812 1.282-1.5 1.688.219 1.687 1.5.875 2.75 7.844 9.562 2.344-1.687.406-3.625 2.562-.438v-6.375l1.282-1.062.406-5.72.5.407-.063-2.094-1.062-1.937.437-5.5 1.907 1.062 1.062-1.937 1.906-.625 1.969-1.563h-2.125v-3.719l2.344-1.375 3.5-.375.219-1.968-1.188-.781 2.938-3.72-.407-1.156-3.343-1.78-8.125 8.937h-5.657v-2.344l-3.125-1.562-3.718 4.093-2.938.406v-2.75l-2.531-1.156-3.906-5.469-3.532-1.375-1.156-2.53-1.969-.407-1.937 1.375-1.563.406z" className="land departement01" transform="translate(-27.84 -49.04)" />
									<path d="m417.808 344.166-1.281 1.5-1.281 3.812-2.563 1.281-2.75-2.562h-1.906l-.219 2.781 2.781 2.344-4.25 5.5-5.531 1.281-4.25 1.5 2.75 2.75.656 1.281-4.25 2.125-.437 6.157-.125.062 1.187 2.469 3.407 1.063 2.343-.844 2.75-1.906 3.625 2.968h2.969l2.125 2.969-.875 2.125.438 3-1.063 2.969.438 1.062 1.468-.437 3.407 1.062 4.468 1.281 1.907-1.28.843-1.47h.657l.187 15.907 1.063 1.062h2.78l2.532 1.5 1.906 1.5 1.938.188 1.25 1.062 3.531.406.25-.593-1.562-.781v-2.344h4.875l1.562-1.563-.969-1.75 2.532-1.969 1.78.782 2.532-2.156 4.469.78 1.562-1.75 3.719.188v-4.281l-1.562-.781-.782-2.531-4.093-.407-.594-.969.781-4.093 1.375-1.188-1.125-1.531-2.125-1.281-1.281 1.281.437-1.719v-1.687l-1.718-1.719.875-4.031 1.906-1.063-.219-2.75-4.031-4.031h-1.5l-1.063 1.469-2.531-3.375-1.5.187-1.281 2.781.875 1.688-.656.656-1.688-1.281-4.906-1.062-2.313-4.25v-1.72l-2.343-2.53-.25-1.094-7.813-9.531-.875-2.75-1.687-1.5z" className="land departement38" transform="translate(-27.84 -49.04)" />
									<path d="m466.027 311.666-4.469.781-4.312 3.5-1.157-1.75-2.156.188-1.969 4.312.219 1.75 2.125 1.75-3.906 2.563-2.531 2.343h-4.313l-1.969 1.563-1.906.625-1.062 1.937-1.907-1.062-.437 5.5 1.062 1.937.063 2.094 1.625 1.281v5.531l3.844.625 1.468 2.782 3.407.406.625-1.25h1.718l2.969 3.188 1.063 1.062 3.406-.656.844-1.688.843-3.406 1.907-1.5 1.5-4.437 1.906-1.282 1.5.406.406 1.282-1.062 1.281 1.906 2.344h3.187l1.938 3.187-.438 1.063 1.907-1.281 1.5-1.688 1.312.156.094-3.406 6.656-2.75.781-1.937-.406-4.313-4.281-4.469-1.375.781v-4.687l-3.719-1.781-.187-1.563 2.156-2.344v-2.718l-3.531-3.719-.188-2.531z" className="land departement74" transform="translate(-27.84 -49.04)" />
									<path d="m359.433 323.51-3.531.593-.563 2.156 1.375 2.72.375 11.124-4.687.219-.188 1.75 3.125 2.531-1.75 1.75-.593 4.313 2.343 3.125 2.125 5.062 5.094 3.344 1.75 6.438-3.719 3.5.594 2.343 5.469 1.781 4.312-3.53 2.125-.188 6.25 2.719-.375 3.718 3.125-.187 2.469 2.844 1.813-.5 3.375-.625.875-3.844 4.656-2.75.437-6.156.157-.094-2.282-.344-2.125.844-1.718-1.063 2.125-2.531-.625-1.906-6.594-1.063-5.531-5.094v-1.718l1.28-1.063v-1.469l-1.468-.875 1.25-1.906v-2.75l-2.531-2.344v-2.343l-1.719-1.688v-1.906l-.844-3.187 1.282-1.282.218-3.812h4.032l1.062-1.281-1.281-2.125v-1.907l-1.063-.844-.75 4h-2.156l-1.562 1.563-1.188-1.187-6.25-.97-2.344 1.376h-1.562l-.375-1.375-2.938-.594-.187-3.125z" className="land departement42" transform="translate(-27.84 -49.04)" />
									<path d="m391.652 320.79-2.125.188-1.781 1.75-1.157-1.562-1.75 1.562-2.375-1.562h-1.937l-.781.594-.407 2.25 1.063.843v1.906l1.281 2.125-1.062 1.282h-4.032l-.218 3.812-1.282 1.281.844 3.188v1.906l1.719 1.688v2.344l2.531 2.343v2.75l-1.25 1.906 1.469.875v1.47l-1.281 1.062v1.719l5.53 5.093 6.595 1.063.625 1.906-2.125 2.531 1.718 1.063 2.125-.844 2.282.344 4.093-2.031-.656-1.282-2.75-2.75 4.25-1.5 5.531-1.281 4.25-5.5-2.781-2.344.156-2.031-3.968-1.156-2.563.844-.406-3.407-2.344-2.125-1.5-.219-3.812-2.312.625-1.5v-6.594l1.062-1.469.375-4.562-.656 1.563-1.375-.188-.75-3.906z" className="land departement69" transform="translate(-27.84 -49.04)" />
									<path d="m436.902 339.29-.406 5.72-1.282 1.062v6.375l-2.562.438-.406 3.625-2.344 1.687-.031-.031.25 1.094 2.343 2.53v1.72l2.313 4.25 4.906 1.062 1.688 1.281.656-.656-.875-1.687 1.281-2.782 1.5-.187 2.531 3.375 1.063-1.469h1.5l4.031 4.031.219 2.75-1.906 1.063-.875 4.031 1.718 1.719v1.687l-.437 1.719 1.281-1.281 2.125 1.281 1.125 1.531 3.531-.375 1.157 1.156.593 2.75 3.5-.406.407-2.937 1.75-.781 3.75.187-.063-.125 5.844-2.344 2.156 1.375h2.156l.188-2.344 2.531-1.375.969-1.156 5.094-1.969.593-3.312-1-1.562 2.75-4.688-2.531-.969-.781-2.75-5.281-3.125s.315-5.987-.188-7.062a1 1 0 0 0-.062-.094l-.032-.031h-.031v-.031h-.094c-.781.195-3.687.406-3.687.406l-2.938-3.344.094-3.219-1.312-.156-1.5 1.688-1.907 1.28.438-1.062-1.938-3.187h-3.187l-1.906-2.344 1.062-1.281-.406-1.281-1.5-.407-1.906 1.281-1.5 4.438-1.907 1.5-.843 3.406-.844 1.688-3.406.656-1.063-1.062-2.969-3.188h-1.718l-.625 1.25-3.407-.406-1.468-2.781-3.844-.625v-5.532z" className="land departement73" transform="translate(-27.84 -49.04)" />
									<path d="m395.152 373.978-4.531 2.688-.875 3.844-3.375.625-1.813.5.063.093-1.157 4.688-2.75 1.156-1.156 1.969.781 2.531.563 1.375h-2.906l-.22 3.688-3.124.218-1.563 4.875h-4.687l-5.063 3.719-2.812 4.469.469.594 1.375 7.187 3.312 3.594-.562 4.125 4.156 2.5v5.531l2.219-1.125 4.687 3.063 2.219.812.531-3.875 2.781-.531.813 3.031 2.781-.281.531-3.031 6.344 3.562 1.031-2.094 2.688-.406.219-4.125-.625-.875-.844-.187v-1.5l.625-1.5-1.063-1.688.625-3.812 2.563-3v-4.22l-1.063-4.906 1.907-.406.437-2.125 1.906-3.625 1.063-2.75-1.688-4.25-1.062-3.406-1.5-5.937v-7.97l-1.063-.343z" className="land departement07" transform="translate(-27.84 -49.04)" />
									<path d="m404.84 374.76-2.75 1.906-2.344.844-2.344-.72v7.97l1.5 5.937 1.062 3.406 1.688 4.25-1.063 2.75-1.906 3.625-.437 2.125-1.907.406 1.063 4.907v4.219l-2.563 3-.625 3.812 1.063 1.688-.625 1.5v1.5l.844.187.625.875-.22 4.125 2.595-.375 1.156 1.375-.563 3.906.782.969 2.906-2.937 2.562-.188.563-1.562-3.313-.407-.562-3.5 2.125-3.312 2.75-.219 2.719 2.563-2.72 3.687.782 1.375 3.906.406 2.532-2.156-1.375 2.938.406 2.343 4.094.375 5.468.406.782 2.532 2.937 2.156 2.531.188 1.75-1.563 1-2.937 1.563 1.375 1.156 1.375.781-7.25-1.937-.375-1.188-2.532-6.625-1.781-.812-3.312 2.375-1.563-1.969-1.375.406-1.75 3.125.188 2.719 1.375 2.156-2.532-2.156-1.75.188-2.344 1.187-3.718 4.094-.406 3.312-1.344.344-.781-3.531-.407-1.25-1.062-1.938-.188-1.906-1.5-2.531-1.5h-2.781l-1.063-1.062-.187-15.906h-.657l-.843 1.468-1.907 1.281-4.468-1.28-3.407-1.063-1.468.437-.438-1.062 1.063-2.969-.438-3 .875-2.125-2.125-2.969h-2.969z" className="land departement26" transform="translate(-27.84 -49.04)" />
									<text><tspan x="345" y="384">04</tspan></text>
								</g>
								<g id="g03" onClick={this.handleClick}>
									<path d="m338.34 202.822-1.75 1.344-7.626-.375-3.5 1.75-1.375 2.937 1.563 1.75-2.344 2.75-1.781 2.125 3.531 3.344.969 3.125 2.562 2.719v3.531l-5.093 4.281 1.75 1.969-.375 2.906-2.75 1.969h-3.907l.594 2.156 2.531 3.5.594 3.125.594 2.156-1.156.344 2.468.563h1.844l.969-1.531h1.25l1.406 1.25-.281 1.562 1.281.844h1.813l2.53 1.687 1.126-.562 1.125.969 1.125-.282 1.937-1.25 1.844.563 1.25-.281v-3.5l.688.125.437 1.812 2.25 1.406v2.125l3.219.125 4.219 3.938 2.656.125-.156-1.25 1.125-1.688 1 1.25-.844 1.406.406 1.282 1.531-1h1.844l-.156 2.812 1.687 1.125 1.282-.562 3.125-2.125-.188-.406-1.844-1.125-.125-1.97 1.969-.968.844-1.125-.563-.969v-2.25l1.532-2.25 2.25-4.781.406-2.094 1.406-.562.156-.406-.718-.563v-1.687l2.25-1.688.562-2.812-.969-1.657h-1.562l-.406-.437v-2.375l1.968-1.406-.156-1.407-.281-1.406-1 2.156-1.375-.187-1.156-2.156-3.907 1.968-7.812-.406-.969-2.156-2.156-2.906-.375-3.532-3.125-3.719-1.969 1.376-3.531-2.72.594-5.28-5.063-5.282h-2.344z" className="land departement89" transform="translate(-27.84 -49.04)" />
									<path d="m443.402 220.978-3.688.594-.593 1.938-1.97 1.375-1.343-1.563-.969.594.75 1.156-1.937 1.188.594 1.562-2.157.781v2.531h-2.75l-.187 1.563-2.719.594.188 2.344 1.75.187-.97 1.156-.593 3.906h-1.75l-2.937 1.188-3.125-1.187-2.72 1.187v1.969l2.126.375 1.562 3.125.219 1.562-2.531 2.938-1.188.375-.781.969 2.156 1 .375 3.125 1.75.187.219 3.906.781.781.094.625 1.5.407 1.688 1.406h2.53l.97-.969 1.718.063 1.782.062 3.937-3.219h1.125l1.25-.968 4.063.125 3.093-2.531 2.25-.407.844-2.094 1.813-.562 1.812-3.094 2.531-1.969 2.657-.406 1.968 1.406 3.657-.437v-1.969l1.468-.844 1.157-1.593h2.25l1.25-1.313.468-3.125v-1.937l-.843-2.969v-2.5l1.53-1.125 1.813-.937-.187-.375-6.25-3.313-1.75-1.969-1.75-1.156-1.563.781-.218 1.156-1.563.97h-.969l-2.937-3.313h-4.094l-1.75 1.375-1.562.187-2.532-1.937.188-2.156z" className="land departement70" transform="translate(-27.84 -49.04)" />
									<path d="m383.277 222.728-.406 2.531-2.532 1.376-6.437.187.281 1.406.156 1.406-1.968 1.407v2.375l.406.437h1.562l.969 1.656-.562 2.813-2.25 1.688v1.687l.718.563-.156.406-1.406.562-.406 2.094-2.25 4.781-1.532 2.25v2.25l.563.969-.844 1.125-1.969.969.125 1.969 1.844 1.125.688 1.53-.282 2.126-.406 1.531.969 1.688 2.812.562 1.25 1.969v.844l-.843.28v2.032l.156.063 3.781 3.906 3.938-.125 3.5 2.656 2.53 1.844.126 2.375 2.656.562 2.25 1.813 5.906-2.094 4.063-1.281 1.812-.281.563-.813 1.969.125 1.53.969 2.25-.563 2.25-1.531 1.688.188.032-.188 1.343-.781-.187-1-.375-1.156.969-1.563 3.312-1.562v-1.563l1.188-1.562 1.156-1.563-.375-1.375.562-2.156.407-3.125h.78l-.187-1.156-.781-.782-.219-3.906-1.75-.187-.375-3.125-2.156-1 .781-.97 1.188-.374 2.531-2.938-.219-1.562-1.562-3.125-2.313-.406-.812 1.968-4.281.969-.407-.969-3.125-3.906-1.75.969-2.343-.188-.782-1.562-3.125.187-.187-3.312-1.75-1.188 2.531-2.719-4.5-6.062-3.5-3.719-3.125-1.75z" className="land departement21" transform="translate(-27.84 -49.04)" />
									<path d="m326.652 249.26-.969 1.53h-1.844l-2.468-.562-2.75.813.187 1.969 2.344 2.718v3.719l-1.75 2.531.562 2.344 3.532 2.75.187 2.719 1.969 4.125-.406 4.687 2.156 2.125-.594 5.094-.187 2.531.968 1.75-1.5 4.781.125 1.47 3.344 1.562 2.344 2.562 2.125-1.187 1.969-1.156.406 1.75h2.906l.781-1.563 1.75.781.594 2.531 1.563-.375 3.718-5.093 1.938 1.375.312.594 3.063-1.907 1.25.156.969 2.375 1.843-.28 1.407-1.407h1.812l1.406-1.812 1.407-.282.28-1 3.063.156.157-.718-1.407-1.25v-1.25l1.969-1.125v-.844l-1.844-1.125-.281-2.094.156-1.969-1.25-.843 1.094-1.531 1-.563.688-1.687-.97-.563-1.124-1.687 1.406-1.97 2.375-1.406h2.938v-2.218l.843-.281v-.844l-1.25-1.969-2.812-.562-.969-1.688.406-1.531.282-2.125-.5-1.125-3.125 2.125-1.282.562-1.687-1.125.156-2.812h-1.844l-1.531 1-.406-1.281.844-1.407-1-1.25-1.125 1.688.156 1.25-2.656-.125-4.22-3.938-3.218-.125v-2.125l-2.25-1.406-.437-1.812-.688-.125v3.5l-1.25.28-1.844-.562-1.937 1.25-1.125.281-1.125-.968-1.125.562-2.531-1.687h-1.813l-1.281-.844.281-1.562-1.406-1.25z" className="land departement58" transform="translate(-27.84 -49.04)" />
									<path d="M371.37 273.322v.188h-2.937l-2.375 1.406-1.406 1.969 1.125 1.687.969.563-.688 1.687-1 .563-1.094 1.53 1.25.844-.156 1.97.281 2.093 1.844 1.125v.844l-1.969 1.125v1.25l1.407 1.25-.157.719-3.062-.157-.281 1-1.407.281-1.406 1.813h-1.812l-1.407 1.406-1.843.281-.97-2.375-1.25-.156-3.062 1.906 3.625 6.813v2.938l.969 1.187h3.313l1.156 1.563h3.125l1.375 1.937-.188 7.625-4.093 3.125-.094.219.281-.031.594.187.187 3.125 2.938.594.375 1.375h1.562l2.344-1.375 6.25.969 1.188 1.187 1.562-1.562h2.156l1.157-6.25.78-.594h1.938l2.375 1.562 1.75-1.562 1.157 1.562 1.78-1.75 2.126-.187 1 3.125.75 3.906 1.375.188 1.187-2.75 3.688-14.438 1.375-2.531 2.156-.219 2.156 1.781 1.563-.406 1.937-1.375 1.969.406 1.156 2.531 1.125.438 5.125-.625 1.969-1.562-.781-1.188-2.344-.781-.219-2.719 1.969-1.375.781-3.312-1.75-3.125-1.187-1.563.594-.594v-1.937l-1.563-1-.406-1.563 4.5-.562.406-1.563h-1.375l-1.156-1.375h-2.156l-1.782-2.937-1.562-.188.187-2.344-1.687-.187-2.25 1.531-2.25.563-1.531-.969-1.97-.125-.562.813-1.812.28-4.063 1.282-5.906 2.094-2.25-1.813-2.656-.562-.125-2.375-2.531-1.844-3.5-2.656-3.938.125-3.781-3.906z" className="land departement71" transform="translate(-27.84 -49.04)" />
									<path d="m421.058 263.01.094.53h-.781l-.407 3.126-.562 2.156.375 1.375-1.156 1.563-1.188 1.562v1.563l-3.312 1.562-.97 1.563.376 1.156.187 1-1.343.781-.22 2.531 1.563.188 1.782 2.937h2.156l1.156 1.375h1.375l-.406 1.563-4.5.562.406 1.563 1.563 1v1.937l-.594.594 1.187 1.563 1.75 3.125-.781 3.312-1.969 1.375.219 2.719 2.344.781.781 1.188-1.969 1.562-5.125.625 2.407.938 3.906 5.468 2.531 1.156v2.75l2.938-.406 3.718-4.094 3.125 1.563v2.344h5.657l8.125-8.938-.344-.187.375-4.094 2.937-3.5-1.968-.781.187-1.188-2.375-.219-.156-1.406 1.531-1.531-.406-1.531-.844-1.969 3.5-1.125 1.281-1.812.282-2.25-2.813-2.688-1.969-.531-4.343-1.406v-3.938l-.282-2.937-3.5.28-5.468-1.843.843-1.937 1.25-2.97.438-1.937-1.406-1.844-2.532-1.687-.281-2.094.031-1.187-1.718-.063-.97.969h-2.53l-1.688-1.406z" className="land departement39" transform="translate(-27.84 -49.04)" />
									<path d="m357.277 144.79-2.344 1 .406 1.938h-4.125l-3.687 2.75v5.25l2.719 1.781.78 1.75-4.5.376-.562 1.78 1.75 1.157-.781 1.188-1.75.78.375 1.345h2.531l1 1.375-1.75 1.187-1.562 4.094-2.938 1.375-1 2.125-.968 1.187.218 1.156-1.562 1-.406 2.72 1.562.968.781 2.938-.968 1.75.593 1.375 2.907-.188v.969l.843-.188 3.375 3.563 4.75-.781 5.563-3.782h3.344l3.375-2.375 3.968-2.187 2.969.219.406 3.968 3.563 5.344h3.969l5.562-1.187 3.969 1.375 4.156-2.97.594-4.937 4.594-.781-.094-3.094-3.719-2.937-.406-1.563 1.375-2.344-1.188-.968 1.188-2.938 2.156-.969 1.563-4.874-3.125.187 1.75-1.937-1.375-4.313-1.344-2.937 1.75-1.563-1-.187-.25-1.344c-.04.006-.281.031-.281.031l-1.782-1.594-2 2h-.593l-.782-1-4.75-.187-.812 1.187h-1.375l-1.188-2.594h-2.593l-.594.594-2.563-.187-3.187-2.375-2.188-.594-.781-1.187-4.156-2.594-4.75-.125.062 1.781-1.375.375z" className="land departement51" transform="translate(-27.84 -49.04)" />
									<path d="m277.12 125.697-1.28 1.531-.782 1.938h1.563l-.782 1.969-.781 3.906 1.156 1.937v3.344h1.969l-.781 1.344-1.375 2.562-.563 1.75 1.75 1.563.563 4.5 1 1.562-1.375.375-1.75-.969-.313 2.313.125-.156.75 1.75 1.188 1.937 5.281.406 3.719-.406 2.531-1.937 3.125 1.937 1.563 1.188 2.343-.594 2.125-.969 4.125 2.156 4.282 2.532 1.375 1.375 2.343-1.563 1.938 1.156 1.187.97 1.75-.188 1.188-1.563 2.719 1.563 3.343-1.375 1.938.594 1.937-1.563 1.188-.594.375.281.406-2.656-1.406-1.594-2.375-1.593-1 1.594-.594.187-.187-2.969 1.78-.406-.405-2.75-2.375-.406 1.187-2 3.375-.781 1.188-4.75 1.78-.813-2.374-1.781.812-1.781.375-5.938-.812-4.594-4.125.406-2.781-.374-5.157 1.375-4.375 4.156-3.562-1.188-3.563-.375-2.781-2.781-4.969-1.406-6.718.594-1.782-1.375h-3.593l-2.563 1-1.187-.813v-2.156l-.407-.594z" className="land departement60" transform="translate(-27.84 -49.04)" />
									<path d="m289.152 54.135-10.813 2.062-8.593 6.625v26.375l-.063.781 3.031.719.969 2.156 2.344-.593 1.375-1.75 1.75.593 3.719 2.907 1.375-.563.968 2.344 3.5 1.562v1.938l2.563.969 2.531-.97 4.875-.593 1.188 1 2.343-1 1.157 1.969-2.907 1.937v2.75l.969.969.781-.187.563-1.563 1.781-1.187 1.75 1.374 4.094 1.376h1.75v-1.97l2.562 1.782.188 1.563-1.188 1.75 2.157-1.188 1.78-.781.75 1.375v1.375l2.938-1.563h4.688l.187.188 1.157-2.219-.594-1-1.781-.375h-1.97l-1.187-.406 1.969-1.188 1.781.188 1.782-.188.218-3.187 1.188-.781.187-1.782-2.187-1.406-2.563-.187-.593-.407 1.593-1.187.375-1.188-1.375-.968-2-2.407.219-1.187 2.563-1.188.406-1.375-1.781-.812-1-2.563-3.563-.406-3.562-.969-.407-3.968 2.563-1.594-.969-2h-2l-1.375 2.187-6.156-.375-4.969-1.218-2.75-2.97v-2.374l2.156-1-1.781-1.375-4.344-.188-2.593-6.562z" className="land departement62" transform="translate(-27.84 -49.04)" />
									<path d="m305.683 49.54-6.25 2.938-9.75 1.563-.531.094 3.719 5.906 2.593 6.562 4.344.188 1.781 1.375-2.156 1v2.375l2.75 2.969 4.969 1.218 6.156.375 1.375-2.187h2l.969 2-2.563 1.594.407 3.968 3.562.969 3.563.406 1 2.563 1.78.812-.405 1.375-2.563 1.188-.219 1.187 2 2.407 1.375.968-.375 1.188-1.593 1.187.593.407 2.563.187 2.187 1.406-.187 1.782-1.188.78-.218 3.188-1.782.188-1.781-.188-1.969 1.188 1.188.406h1.969l1.78.375.595 1-1.157 2.219 1.563 1.562 1.562.407 1.563-1h2.156l.594 1.187.781-.187 2.344-1.376 2.344 1.376 3.125-2.157h1.375l1.562 1.375 3.125-2.156 1.344.188 1.187.968 4.313.407.375 1.75 2.156-1.938h1.156l.782 2.531 3.718.969 1.063-.719h-.313l-.187-1.937 3.906-2.344-.594-3.719-3.718-.968.968-1v-2.72l2.938-2.156-.781-1.562-6.25-4.875-10.938.594-1.156 1.937h-1.375l.187-6.843-3.125-3.688-2.343.375-1.375-1.562-3.907 1.75-1.343-1.344-2.75-.406-.782-2.532-.187-7.812-1.75-.781-.219-1.188h-1.156l-.406-2.344-2.532.219-4.875 1.563-2.343 2.906h-2.344l-1.563-1.938-.593-2.156-1.938-2.156h-2.75l-1.156-2.125v-3.344l1.344-2.125-.782-2.937z" className="land departement59" transform="translate(-27.84 -49.04)" />
									<path d="m348.308 107.697-3.125 2.156-1.562-1.375h-1.375l-3.125 2.157-2.344-1.376-2.344 1.376-.781.187-.594-1.187h-2.156l-1.563 1h-.062l.469 2.75-2.563 2.78v2.563l-1.781 2 .406 2.375.969 3.969 1.187 6.75-.375 5.938-.812 1.78 2.375 1.782-1.781.813-1.188 4.75-3.375.78-1.187 2 2.375.407.406 2.75-1.781.406.187 2.969.594-.187 1-1.594 2.375 1.594 1.406 1.593-.406 2.656 1.781 1.282.594 4.312 5.25 5.063 1.75.594 1 2.343 3.281.688.406-.5 1-2.125 2.938-1.375 1.562-4.094 1.75-1.187-1-1.375h-2.531l-.375-1.344 1.75-.781.781-1.188-1.75-1.156.563-1.781 4.5-.375-.781-1.75-2.72-1.782v-5.25l3.688-2.75h4.125l-.406-1.937 2.344-1 3.312 2.156 1.375-.375-.187-6.656.594-2.344.78-2.719-2.562-1.375.594-1.562 3.719-.781v-2.532l2.937-1.562.782-2.344-.97-1.562.188-2.938 1.75-1.562-1.75-3.313.532-3.469h-3.97l-1.062.719-3.718-.969-.782-2.531h-1.156l-2.156 1.938-.375-1.75-4.313-.407-1.187-.968z" className="land departement02" transform="translate(-27.84 -49.04)" />
									<path d="m269.683 89.978-.531 6.438 4.312 3.906v1.969l-5.281-3.125-6.344 7.812 1.688.719 2.156-.187.969 1.937 8.594 8.406.593 3.5 1.938 3.532-.656.812h2.468l.407.594v2.156l1.187.813 2.563-1h3.593l1.782 1.375 6.718-.594 4.969 1.406 2.781 2.781 3.563.375 3.562 1.188 4.375-4.156 5.157-1.375 2.78.375 4.126-.407-.375-2.156-.969-3.969-.406-2.375 1.781-2v-2.562l2.563-2.781-.47-2.75-1.5-.407-1.75-1.75h-4.687l-2.937 1.563v-1.375l-.75-1.375-1.781.781-2.157 1.188 1.188-1.75-.188-1.563-2.562-1.781v1.969h-1.75l-4.094-1.376-1.75-1.374-1.781 1.187-.563 1.563-.781.187-.969-.969v-2.75l2.907-1.937-1.157-1.969-2.343 1-1.188-1-4.875.594-2.531.969-2.563-.97v-1.937l-3.5-1.562-.968-2.344-1.375.563-3.72-2.907-1.75-.593-1.374 1.75-2.344.593-.969-2.156z" className="land departement80" transform="translate(-27.84 -49.04)" />
									<path d="m387.527 101.322-1.969 2.906-1.75 1.782v4.093l-2.344 1.563-4.281 1.375-2.344.969-2.75-2.157h-3.718l-.532 3.469 1.75 3.313-1.75 1.562-.187 2.938.969 1.562-.782 2.344-2.937 1.562v2.531l-3.719.782-.594 1.562 2.563 1.375-.781 2.719-.594 2.344.125 4.875 4.75.125 4.156 2.594.781 1.187 2.188.594 3.187 2.375 2.563.187.594-.594h2.593l1.188 2.594h1.375l.812-1.187 4.75.187.782 1h.593l2-2 1.782 1.594s.24-.025.28-.031l-.124-.813 2.344-1.156 1.156-1.187-.75-1.938-.219-1.375 2.156-1.75.782-3.906-2.344-2.938.781-1.375 1.969-3.687.562.781h2.938l1.375 1.344 1.75-1.156 1.375-2.25-1.406-.22-.782-3.905-1.562-1.188-5.469-.594-.969-2.531-1.781-1.156-6.25-.781-.375-4.5.781-.782v-1.75l-3.125-1.968.594-2.157.781-1.937-1.375-1.188 2.157-1.937v-3.531l-.782-.563z" className="land departement08" transform="translate(-27.84 -49.04)" />
									<path d="m369.214 184.166-3.968 2.187-3.375 2.375h-3.344l-5.563 3.781-4.75.782-3.375-3.563-.843.188v.594l-2.72 1.156-.187 2.344-1.375 1.78-.781 3.907-.437 3.281 1.218 1h2.344l5.063 5.281-.594 5.282 3.531 2.719 1.969-1.375 3.125 3.718.375 3.531 2.156 2.907.969 2.156 7.812.406 3.907-1.969 1.156 2.157 1.375.187 1-2.156 6.437-.187 2.532-1.375.406-2.532h5.656l.781.438-.656-2.5-1.594-1 2.188-1.969 3.375-.219 1.187-1.781-.218-7.125-.782-4.156-3.375-1.188-3.562-4.969.187-2.968 1.032-2.156-1.813-.625-5.562 1.187h-3.97l-3.562-5.344-.406-3.969z" className="land departement10" transform="translate(-27.84 -49.04)" />
									<path d="m398.996 185.197-4.594.781-.594 4.938-4.156 2.969-2.156-.75-1.032 2.156-.187 2.969 3.562 4.968 3.375 1.188.782 4.156.218 7.125-1.187 1.781-3.375.219-2.188 1.969 1.594 1 .656 2.5 2.344 1.312 3.5 3.719 4.5 6.063-2.531 2.718 1.75 1.188.187 3.312 3.125-.187.782 1.562 2.343.188 1.75-.969 3.125 3.906.407.969 4.28-.969.813-1.969.188.032v-1.969l2.719-1.187 3.125 1.187 2.937-1.187h1.75l.594-3.907.969-1.156-1.75-.187-.188-2.344 2.719-.594.187-1.562h2.75v-2.532l2.157-.781-.594-1.562.594-.375-1.782-1.407-2.125.781v-4.093l-5.468-2.719 1.156-5.281 1.75-1.188-.563-1.75-2.562-.375-.563-2.562h-2.343l-2.75-3.688-3.125-.219-1.344-1.937 1.75-1.75-4.125-4.5-1.75-.594-4.688-2.344-2.531-2.718-4.094-.594z" className="land departement52" transform="translate(-27.84 -49.04)" />
									<path d="m500.62 157.76-3.718 1.03-1.719 3v2.938l-1.562 1.375h-1.375l-2.532-1.781-1.968 1.375h-2.344l-1.938-1.937-3.718-.594-2.157-.969-.781-2.937-1.75 1.937-.969 4.5-2.562.781v2.531l2.562 1.188 1.938 1.375-.781 1.75 1.78 1.156 3.126-2.344 5.437 3.126-2.312 4.312.187 1.375 1.563 1.563-1.188 4.093-3.906 3.906-2.156-.187 1.375 1.344-.781 3.531.78 5.281 3.72.969-.313.719 2.938-.156 1.718 2.093 1.532 1.906 3.843-.187 1.719 4.969 3 1.312-.031-.625 5.094-9.969-.594-5.656 2.344-7.625.593-6.656 5.063-3.687v-2.344l1.969-2.563h1.562l1.75-1.75-.375-3.312 1.75-4.688 2.719-.594-2.719-2.156-4.875-.562-4.312-2.156-2.938 1.75-1.562-1.75z" className="land departement67" transform="translate(-27.84 -49.04)" />
									<path d="m421.496 133.916-2.344 2.156-3.313.188-1.156 1.187h-.25l-.125 2.344 1.156 1.906-.406 1.156-.375 1.344.188.75.968-.75.938-1.719 1.937-.187 3.25-.969 1.719 1.344.75 1.531.594 1.719v1.719l.937.78v1.313l-.937 1.156-.188 2.5.75 1.157.188 1.531.187 2.469 1.157.969 1.718.75-.75 1.53 2.094 1.938-1.906 2.094.375 1.344 1.906.937v.969h-2.281l-.969 1.344.188.969 1.53 1.53-1.312 3.626-1.531 3.437.75 2.125v3.438l.781 1.719h1.125l.594.968h-1.719l-1.531.75v1.156l1.906 1.72v2.687l1.907-.594 2.875.188.187 3.062 1.156.406-1.343.938-.188.969 2.094.375 1.344 1.718 6.312-.375 1.344-2.5h2.875l1.156-.937 1.906 1.156 1.719-.594 2.5.188 2.094-.75 2.094-1.531 1.156 1.156.187-2.688 1.532-.594.78 2.5 2.282.188 2.313.594.937.187 3.281-1.531 1.719-1.156 1.531-1.906 3.063-1.157 2-.437-1.125-1.094 2.156.188.406-.407-2.312-.75-3.25-2.281-2.875-2.125h-3.438l-3.625-2.094-2.875-.187v-.781l-4.406-2.657-4.969-2.125h-2.5l-.937-2.656-3.844-4.812h-3.812l-1.532-2.094h-3.062l.187-3.063-4.031-2.5.188-2.469h2.125v-2.124l.75-1.532-1.72-1.719 1.532-2.656-1.156-3.062-.938-.781-2.5-5.344.969-1.531s-.08-1.258-.156-2.938h-2.625l-3.531-3.906z" className="land departement54" transform="translate(-27.84 -49.04)" />
									<path d="m485.496 202.01-2.938.156-1.844 4.156-2.343 4.688.593 2.937-1.937 4.5-3.344 2.906-.187 7.625-2.438 2.094.094.063.781 1.562 3.125.188 3.531 2.75.563 1.343-.188 2.344-.968 1.781.375 2.344 2.75-.406.593 2.156.969 4.156 2.313-.375-.407 2.125 1.375 1.188 7.219-.188 3.719-2.937.187-4.313 1.969-2.531-2.562-2.937-1.344-3.125 1.562-2.125v-4.907l.969-2.344v-3.906l1.75-2.531-1.937-2.719-.188-5.625-3-1.312-1.719-4.969-3.843.188-1.532-1.907z" className="land departement68" transform="translate(-27.84 -49.04)" />
									<path d="m410.027 132.01-1.375 2.25-1.75 1.156-1.375-1.344h-2.938l-.562-.781-1.969 3.687-.781 1.375 2.344 2.938-.782 3.906-2.156 1.75.219 1.375.75 1.938-1.156 1.187-2.344 1.156.375 2.156 1 .188-1.75 1.563 1.344 2.937 1.375 4.313-1.75 1.937 3.125-.187-1.563 4.875-2.156.968-1.188 2.938 1.188.969-1.375 2.343.406 1.563 3.719 2.937.187 6.844 4.094.594 2.531 2.719 4.688 2.343 1.75.594 4.125 4.5-.438.438 3.438-.438v-1.719l3.844-.781v-1.312h.937v1.125l3.063-.938 1.187-1.594-.219.063v-2.688l-1.906-1.719v-1.156l1.531-.75h1.719l-.594-.969h-1.125l-.781-1.718v-3.438l-.75-2.125 1.531-3.437 1.313-3.625-1.531-1.531-.188-.97.969-1.343h2.281v-.969l-1.906-.937-.375-1.344 1.906-2.094-2.094-1.937.75-1.531-1.718-.75-1.157-.97-.187-2.468-.188-1.531-.75-1.156.188-2.5.937-1.157v-1.312l-.937-.781v-1.72l-.594-1.718-.75-1.531-1.719-1.344-3.25.969-1.937.187-.938 1.719-.968.75-.188-.75.375-1.344.406-1.156-1.156-1.906.125-2.344h-.937l-.782-3.719-1.562-1.562z" className="land departement55" transform="translate(-27.84 -49.04)" />
									<path d="m442.996 135.885-2.938.187-2.344 1.969-.593.969h-3.313l-1.156-1.188h-.5c.077 1.68.156 2.938.156 2.938l-.969 1.53 2.5 5.345.938.78 1.156 3.063-1.531 2.656 1.719 1.72-.75 1.53v2.126h-2.125l-.188 2.468 4.031 2.5-.187 3.063h3.062l1.532 2.094h3.812l3.844 4.812.937 2.656h2.5l4.969 2.125 4.406 2.656v.782l2.875.187 3.625 2.094h3.438l2.875 2.125 3.25 2.281 2.312.75 3.5-3.5 1.188-4.094-1.563-1.562-.187-1.375 2.312-4.312-5.437-3.125-3.125 2.343-1.781-1.156.78-1.75-1.937-1.375-2.562-1.187v-2.532l2.562-.781.969-4.5 1.75-1.937.781 2.937 2.157.969 3.718.594 1.938 1.937h2.344l1.968-1.375 2.532 1.781h1.375l1.562-1.375v-2.937l1.719-3-.406.125-1.344-1.938-3.906-2.344-1.375-2.156-4.688.406-2.75 2.532-6.625.187-1.969-1.375c-.132-.24-1.093-1.935-1.937-2.406a2 2 0 0 0-.125-.062 1 1 0 0 0-.094-.032l-.062-.031h-.125c-.916 0-2.689-1.028-2.907-1.156l-2.75 1.156-.187 2.344-3.313.406-1.968-3.719-1.157-.406v-2.719l-2.75-1.187-.187-4.688-1.969-1.937-4.094-1.969h-1.937l-.594.406h-1.969z" className="land departement57" transform="translate(-27.84 -49.04)" />
									<path d="m478.902 191.416-2 .437-3.063 1.156-1.531 1.907-1.719 1.156-3.281 1.531-.937-.187-2.313-.594-2.281-.187-.781-2.5-1.532.593-.187 2.688-1.156-1.156-2.094 1.53-2.094.75-2.5-.187-1.719.594-1.906-1.156-1.156.937h-2.875l-1.344 2.5-6.312.375-1.344-1.719-2.094-.374.188-.97 1.343-.937-1.156-.406-.187-3.062-2.875-.188-1.688.531-1.187 1.594-3.063.938v-1.125h-.937v1.312l-3.844.781v1.719l-3.438.438-1.312 1.312 1.344 1.938 3.125.218 2.75 3.688h2.343l.563 2.562 2.562.375.563 1.75-1.75 1.188-1.156 5.281 5.468 2.719v4.094l2.125-.782 1.782 1.406 1.343-.812-.75-1.156.969-.594 1.344 1.563 1.969-1.375.593-1.938 3.688-.594 1 .781-.188 2.157 2.532 1.937 1.562-.187 1.75-1.375h4.094l2.937 3.312h.969l1.563-.969.218-1.156 1.563-.781 1.75 1.156 1.75 1.969 6.156 3.25 2.438-2.094.187-7.625 3.344-2.906 1.937-4.5-.593-2.937 2.343-4.688 2.157-4.875-3.72-.969-.78-5.281.78-3.531z" className="land departement88" transform="translate(-27.84 -49.04)" />

									<path d="m467.308 245.197-.187.219h-2.25l-1.157 1.594-1.468.843v1.969l-3.657.438-1.968-1.407-2.657.406-2.531 1.97-1.812 3.093-1.813.563-.844 2.093-2.25.406-3.093 2.532-4.063-.125-1.25.969h-1.125l-3.937 3.218-1.782-.062-.031 1.187.281 2.094 2.532 1.688 1.406 1.843-.438 1.938-1.25 2.969-.843 1.937 5.468 1.844 3.5-.281.282 2.937v3.938l4.343 1.406 1.969.531 2.813 2.688-.282 2.25-1.281 1.812-3.5 1.125.844 1.969.406 1.531-1.531 1.531.156 1.406 2.375.22.031-.188 12.094-11.344-.375-9.375 4.281-2.125 2.938-1.375 2.719-2.531.218-3.719 2.719-1.375 6.25-7.219-.969-2.344 2.157-.968 2.53-3.125-1.374-1.375-4.688.969-.187-.782 4.312-4.969z" className="land departement25" transform="translate(-27.84 -49.04)" />

									<path d="m471.34 231.51-1.813.937-1.531 1.125v2.5l.843 2.969v1.937l-.468 3.125-1.063 1.094 12.031 5.438.75-.875 2.594-.407-.969-4.156-.593-2.156-2.75.406-.375-2.344.968-1.781.188-2.344-.563-1.344-3.531-2.75-3.125-.187z" className="land departement90" transform="translate(-27.84 -49.04)" />
									<text><tspan x="355" y="184">03</tspan></text>
								</g>
								<g id="g02" onClick={this.handleClick}>
									<path d="m89.683 168.697-1.781 1.375-4.469.563-1 1.375-3.125-2.344-4.094 2.75 1.563 2.125-2.719 3.719-.125-.063-1.125 5.25 2.406.156-.156 2.094 1.781 1.125-1.625 1.625-1.125.813.157 1.906 2.437.812-2.281.656v2.407l1.469 1.937.312 5.656-.969.97.813 2.905 3.062.813.313 1.594 1.937.156 1.625-1.125.969.969 3.719 1.625 3.062-1.625.782-1.594 2.593-.187 2.907 2.593 2.75-.656 2.406 2.438h1.125l1.125 1.437h2.281l.781-1.125.969 2.094 2.438.969 3.062-1.938v-2.094l2.25-.812h1.438l1.78 3.25 3.876.312 1.937-2.437 2.094-4.5 2.75-.969 1.438-2.094 1.468 1.438 3.063-.625.969-8.875.968-3.563-.968-1.937-1.625-.625-1.094-5.906-1.25 1.406-3.719-.406-.375 2.156-2.344.187-.187-2.719-1.969-.593-1.375 1.562v-3.906l-2.344 1.75-3.5-.594-1.187 2.344-7.219 3.906v1.969h-1.562v-3.531l-4.094-1.938.375-3.531-3.688-2.719v-3.312l-2.75-.594.188-3.125-2.125-.187.187-2.157h-3.906l-.594 1.938z" className="land departement22" transform="translate(-27.84 -49.04)" />
									<path d="m158.433 275.04-1.125 2.094h-3.219l1.282 1.313-.97 3.219-2.905.969-1.125-.813.5-3.219-.813-1.781h-1.781l-1.281 1.438.625 4.53 1.468 2.094-1.468 1.625-2.72-.5-4.03-.968-1.125-3.063-2.594-.312-3.375-1.469-.813-1.937-3.687-2.407-5.813 7.5-.187 4.688 6.031 5.844-.187 1.75h1.75l3.718 11.156 3.907 1.937 3.906 3.906h4.5l1.75 3.907h4.312l1.938 2.937 4.312 2.156.188-2.75 1.094 1.032 5.968-3.625 2.75-.188 1.157 3.125 3.718-1.562 3.125 2.344 2.532-1.188 2.156-.594.969-1.156 2.718-1.75-1.937-1.969-1.563 1.188-.187-1.563 1.375-2.562-1.375-2.344 1.156-1.562-.594-5.47-1.937-2.906 1.375-1.78-3.125-3.5 1.156-2.532-4.687-3.906v-2.344l-1.938-2.75.375-.156-2.656-2.25h-5l-1.625-.969-2.25-.312-2.594-2.438z" className="land departement85" transform="translate(-27.84 -49.04)" />
									<path d="m139.464 122.978-.781 1.969 4.125 3.313v4.312l-1.562 1.938.968.968.594.406-.406 3.72 1.375 3.124 4.5 5.063.969 4.5.968 1.375v7.031l2.344 4.688v5.468l-2.531 5.063 2.719 7.031 4.312.969.375 1.969-2.125.968h-3.687l.593 2.469 1.157 3.719 3.343 2.937 1.563.375 1.562-2.125 1.75-.219 2.125-2.53 1.969 1.562h2.344l1.562.781v.375l3.313.406 1.969-1.562 2.906 1.187.062.125 3.344-2.844 1.125-3.718-.312-1.625.468-1.906-1.937-1.938-5-3.25-3.688-.312-3.718-4.688 3.062-1.125 1.281-2.406-1.593-1.469 1.437-1.281 1.438 1.125 2.593-1.594 1.625-2.594.625-2.562-1.125-2.281.657-.813-1.47-2.406 1.626-2.094-1.281-1.625-1.625 2.094-2.25-1.281-3.72-3.72-.155-1.593 1.125-1.125-.344-2.156-1.844.469-.187-4.688-5.094-6.031 1.562-3.906h2.157l-1.938-5.282-8.406-.406-4.5 3.125-5.063-3.312z" className="land departement50" transform="translate(-27.84 -49.04)" />
									<path d="m75.902 206.072-3.25 1.563H70.37l-2.407 1.937.157 1.438 1.437 3.718.813 2.906 5 .813 2.437 1.938.969-1.157 1.594 2.125-.813.969-.156 2.875h-1.438l-1.125 1.781h-2.281l-.937 3.844 2.187 3.5 3.125.781 1.156-1.75-.562 2.125 2.719 1.188 3.53 3.5 1.157 2.156-.375 2.531-.406 2.563 2.344 1.75 1.187-1.375-1.187-1.563v-3.5l2.343.563.782-2.344.593 1.375 2.532 2.156 1.187-1.969-1.187-2.718 2.156 2.937 2.719-.406-.563-1.375 2.531.594 1.938 2.344-.969 1.562-2.531-.781-2.938-1.375-1.562 1.969 2.344.78 1.75 2.72 10.562-.97 2.719.595-1.344 1.156.188 1.781.375.281.843-.156 1.75-1.75 1.157 1.344h3.125l3.718-1.938 5.469-2.156.188-5.469 1.156-.625-2.063-3.875 1.782-1.437-.313-.969-1.125-.656 1.75-.813 1.625-1.937-.156-1.938h-2.094l-.5-1.906 1.469-1.937-1.625-2.907-2.406-1.469h-2.75l-.97-.312v-1.281l1.438-1.313.813-3.219-.469-2.093-.656.812-3.875-.312-1.781-3.25h-1.438l-2.25.812v2.094l-3.062 1.938-2.438-.97-.969-2.093-.781 1.125h-2.281l-1.125-1.437h-1.125l-2.406-2.438-2.75.656-2.907-2.594-2.593.188-.782 1.594-3.062 1.625-3.719-1.625-.969-.969-1.625 1.125-1.937-.156-.313-1.594-3.062-.812z" className="land departement56" transform="translate(-27.84 -49.04)" />
									<path d="m60.558 174.54-2.125 2.345-2.344-.97-4.312.407-.781 1.938-2.532.593-.406-2.156-4.469.594v1.375l-3.125.187-1.375-.969-1.562.782-.406 2.344-5.25.187-2.75 3.313 2.343 1.75-3.125 2.562.969 1.75-.781 4.281 3.125.406 1.187-1.187.594.781 7.406-.969 4.875-3.5-4.281 4.094.375 1.938 3.906-1.75-.781 2.75 4.313.187-.188 1.156-4.687-.187-3.72-.969-4.5-2.156-2.718 3.125 3.5 1.188-.187 5.25.968-.782 2.157-3.312 4.093 2.344 1.969.406.781 3.125-1.187 2.125-2.531-.188h-2.344l-3.906.594-6.657.375-1.343 1.781 1.937 1.156 2.156-.187 1.75 1.563 2.532-.188 4.125 4.688.968 5.062-1.375 2.75 4.094.781 4.5-.219.969-1.75-1.75-2.343 1.75.781 1.781-.187 3.125 1.75 1.938-.375v-3.344l.78 3.344 2.532 4.093 5.469.375.219-1.156 1.343 1.938 3.344.593h2.531l.157.219.937-3.844h2.281l1.125-1.781h1.438l.156-2.875.813-.969-1.594-2.125-.969 1.156-2.437-1.937-5-.812-.813-2.907-1.437-3.719-.157-1.437 2.407-1.937h2.28l3.25-1.563-.687-2.469.969-.969-.312-5.656-1.47-1.937v-2.406l2.282-.657-2.437-.812-.157-1.906 1.125-.813 1.625-1.625-1.781-1.125.156-2.094-2.406-.156 1.125-5.25-3.219-1.875-5.468.188v3.906h-1.563l-.375-1.75-2.344.375z" className="land departement29" transform="translate(-27.84 -49.04)" />
									<path d="m136.152 181.385-1.875 2.125 1.094 5.906 1.625.625.968 1.937-.968 3.563-.97 8.875-3.062.625-1.468-1.438-1.438 2.094-2.75.969-2.094 4.5-1.281 1.625.469 2.094-.813 3.218-1.437 1.313v1.281l.969.313h2.75l2.406 1.468 1.625 2.906-1.469 1.938.5 1.906h2.094l.156 1.938-1.625 1.937-1.75.813 1.125.656.313.969-1.782 1.437 2.063 3.875 3.937-2.094 12.094-.593.781-2.156 1.969-1.938 4.281-.594.188-2.156 2.937.406 1.75 2.344 3.938.969.75-1.563 1-3.531 2.531-6.25 1.375-.781 3.313.406v-5.281l-1.375-1.375v-5.656l-.594-1.938v-3.125l1.969-1.969v-3.906l-.97-.781.188-5.469-1.562-.781h-2.344l-1.969-1.563-2.125 2.531-1.75.22-1.562 2.124-1.563-.375-3.343-2.937-1.157-3.719-.593-2.469h-9.594l-3.531-2.156 2.343-3.125z" className="land departement35" transform="translate(-27.84 -49.04)" />
									<path d="m152.777 231.322-.188 2.156-4.281.594-1.969 1.938-.781 2.156-12.094.594-5.093 2.718-.188 5.469-5.469 2.156-3.718 1.938h-3.125l-1.157-1.344-1.75 1.75-.843.156 1 .688-3.72 3.312.782.781.781 1.563-1.968 2.75 2.156 1.156 3.719.781.375-1.562 2.156 2.75h3.531l2.531-2.75h3.313l-3.5 1.75.187 1.969.782 1.75-2.157 2.156h-2.343l.406 2.938 4.281-.782 5.094 4.688-.25.312 3.687 2.406.813 1.938 3.375 1.469 2.594.312 1.125 3.063 4.03.969 2.72.5 1.468-1.625-1.468-2.094-.625-4.531 1.28-1.438h1.782l.813 1.781-.5 3.219 1.125.813 2.906-.97.969-3.218-1.282-1.312h3.219l1.125-2.094 1.125.156 2.594 2.438 1.875.25.062-2.032-1.625-2.094h-1.437l-.5.157-.969-.469.813-.812v-1.47l1.625-.468.968-2.25-.812-.812-.156-2.75h-2.094l-2.094-2.594v-1.906l2.25-1.157 4.031-.781 6.282.156 1.937-1.312-.656-4.031-2.906-2.72-3.532.47-.968-.813-.157-2.875 2.563-2.281-1.938-2.406-1.281-3.407-2.094-1.281v-2.25l-.218-.719-3.657-.906-1.75-2.344z" className="land departement44" transform="translate(-27.84 -49.04)" />
									<path d="m161.84 234.166-.438.875-.281-.063.218.719v2.25l2.094 1.281 1.281 3.406 1.938 2.407-2.563 2.281.157 2.875.968.813 3.532-.47 2.906 2.72.656 4.03-1.937 1.313-6.282-.156-4.031.781-2.25 1.156v1.907l2.094 2.594h2.094l.156 2.75.812.812-.968 2.25-1.625.469v1.469l-.813.812.969.469.5-.156h1.437l1.625 2.093-.062 2.031.375.063 1.625.969h5l2.656 2.25 3.719-1.594 6.062 1.375 2.719-1.781v-2.719l5.281-.406 4.875-.969 5.282-.187.593 1.375 1.375 1.156 1.344-2.344 3.719-3.906h1.5l2.219-8 3.125-3.719-.22-4.281 1.97-2.563v-1.156l-.97-1.187.626-1.282-2.656-1.031-8.22-5-7.593-2.25-2.906-.156v-1.938l-1.781-1.469h-1.907l-3.562-1.124-2.25 2.25-5.156.187-2.282-1.312-5.781-1.75-1.312 1.593-3.22-2.094h-2.905z" className="land departement49" transform="translate(-27.84 -49.04)" />
									<path d="m222.34 197.353-5.282.188-5.281 4.875-2.75-.156-3.656 1.187-1.125 1.938-.5 4.187.343 2.563-2.906 2.437-.812 1.594.656 1.469-.813 1.937.313.813-3.219.312-.469 1.438 1.438 3.562-.156.969-1.282 1.125-2.75.156-.343.969.656.969v5.812l-.625 1.469 1.75 1.437v1.938l2.906.156 7.594 2.25 8.219 5 2.656 1.031 1.312-2.625 3.907 2.75h2.156l-1.188-3.906 2.375 1.563 1.344-1.97 5.656-1.562-.968-2.344 1.375-1.75 2.937-1.156 2.719-3.531v-3.719h1.969l.78-2.719.188-4.093-1.937-1.781 1.562-2.72 2.313-2.937-2.719-1.937-2.531-.406-2.75-4.094h-.781l-.188 1.937-.187-1.344h-4.094l-1.969-2.937-3.312-1.187-.97-7.032z" className="land departement72" transform="translate(-27.84 -49.04)" />
									<path d="m202.402 191.885-1.938.187-.812 1.938-2.906 1.187-5.282-.781-5.281 3.125-1.937-1.375-2.938 1.969-2.156-1.563-1.375-2.344-2.906-1.187-1.97 1.562-3.312-.406-.187 5.094.969.781v3.906l-1.97 1.969v3.125l.595 1.938v5.656l1.375 1.375v5.281l-3.313-.406-1.375.781-2.531 6.25-1 3.531-.313.688 3.532.719h2.906l3.219 2.093 1.312-1.594 5.781 1.75 2.282 1.313 5.156-.187 2.25-2.25 3.562 1.125h1.907l.03.03.626-1.468v-5.812l-.656-.97.343-.968 2.75-.156 1.282-1.125.156-.969-1.438-3.562.469-1.438 3.219-.312-.313-.813.813-1.937-.656-1.47.812-1.593 2.906-2.437-.343-2.563.5-4.187 1.125-1.938 3.656-1.187-.563-.032-1-3.531-2.531-.969-.781-4.281z" className="land departement53" transform="translate(-27.84 -49.04)" />
									<path d="m222.558 143.26-4.562.812-7.438 4.313-8.375 3.312-6.656-3.719-16-2.344-3.719-1.937-5.781 1.469.344 2.156-1.125 1.125.156 1.594 3.719 3.719 2.25 1.28 1.625-2.093 1.28 1.625-1.624 2.094 1.469 2.406-.657.813 1.125 2.28-.625 2.563-1.625 2.594-2.593 1.594-1.438-1.125-1.437 1.281 1.593 1.469-1.281 2.406-3.062 1.125 3.718 4.688 3.688.312 2.844 1.844 3.937-1.188 2.906-3.375 4.032 1.125 3.53-2.437 2.126-.781 2.25 2.25 3.719-.657 3.218 1.781 4.032-1.28 3.687-2.75 2.438-2.75 1.625-.313.468 2.094 1.282-.313.156-1.469 3.719-.625 1.28.781 3.97-.874.656-1.907-.188-1.75-1.968-.781-.188-1.375 1.75-1.156.219-1.969-1.188-4.687-2.343-3.313 1.968-1.156v-.781l-1.968-.594z" className="land departement14" transform="translate(-27.84 -49.04)" />
									<path d="m226.746 170.135-3.97.875-1.28-.782-3.72.625-.155 1.469-1.282.313-.468-2.094-1.625.312-2.438 2.75-3.687 2.75-4.032 1.281-3.218-1.78-3.72.655-2.25-2.25-2.124.782-3.531 2.437-4.032-1.125-2.906 3.375-3.937 1.188 2.156 1.406 1.937 1.938-.468 1.906.312 1.625-1.125 3.719-3.344 2.843 1.313 2.219 2.156 1.563 2.938-1.97 1.937 1.376 5.281-3.125 5.282.781 2.906-1.187.812-1.938 1.938-.187 1.75 1.562.781 4.281 2.531.969 1 3.531 3.313.188 5.281-4.875 5.281-.188 1.563 2.125.969 7.031 3.312 1.188 1.969 2.938h4.094l.187 1.343.188-1.937h.78l2.75 4.094 2.126.343v-4.625l-1.344-1.781-.406-1.562 2.937-1.75 2.938-.594 1.937-2.344-.375-7.219-4.125-3.5-.187-3.344-3.5-2.343 1.375-1.938-.813-2.937-2.718-.969-1.97-1.969-1.155-2.719-5.47-.187-1.562-1.969z" className="land departement61" transform="translate(-27.84 -49.04)" />
									<path d="m267.058 171.572-1.187.969v3.125l-3.907 1.937v2.938l-1.156 1.375h-4.906l-2.313-.969-7.062 3.688h-2.719l-2.812 2.687.656.438.187 3.343 4.125 3.5.375 7.219-1.937 2.344-2.938.594-2.937 1.75.406 1.562 1.344 1.781v4.625l.406.063 2.719 1.937-1 1.25 1.937.969 3.094-.562h1.813l-.125.843-1.688.969 1.125.844h2.813l.968 2.25 1.688.969 1.25 2.812 4.344 1.125 2.687-.281 2.375-2.25 2.125.594.531-1.157-.125-1.25 1.125-.844 1.813 1.126 1.125-.844v-1.531l1.531-1 1.406.562 1.25 1.406 2.25-1.25h2.375l1.688-1.844 1-3.624 1.531-.282-.406-3.656 1.812-1.531-.562-1.125.219-.375-.532.062-.406-5.25-.406-.594-.375-2.53-4.094-.782-1.781-2.156-.563-4.313-2.343-.375-.407-2.156-2.718-1.937-1.375-3.344 1.375-2.344-1.375-1.562v-1.938l.78-2.156-1.562-1.563-.593-2.344z" className="land departement28" transform="translate(-27.84 -49.04)" />
									<path d="m261.84 106.978-1.282 1.563-8.375 6.437-14.844 3.719-9.781 3.5-8 4.313-4.687 7.03-.97 5.47 3.907 2.937 5.656 1.156-.906.156.031.157 4.375-.563 2.25-2.406 1.688-.406 1.937 3.375 2.688-.281 1.125 1.937 4.75-.281 4.781 3.375-3.094.969 2.25 1.687h1.407l1.25 2.688h2.25l.687-1.688-1.687-1.125 4.78-1.406 5.032-.563 1.281-3.656 2.375-2.094 4.5-.125 5.188 2.656 3.094.344.53-1.625 1.376-2.562.781-1.344h-1.969v-3.344l-1.156-1.937.781-3.906.782-1.97h-1.563l.781-1.937 1.938-2.343-1.938-3.532-.593-3.5-8.594-8.406-.969-1.937-2.156.187z" className="land departement76" transform="translate(-27.84 -49.04)" />
									<path d="m230.902 140.04-1.688.407-2.25 2.406-4.375.563.907 7.25 1.968.594v.78l-1.968 1.157 2.343 3.313 1.188 4.687-.219 1.969-1.75 1.156.188 1.375 1.968.781.188 1.75-1.563 4.5 1.563 1.969 5.469.188 1.156 2.718 1.969 1.969 2.718.969.813 2.937-1.375 1.938 2.844 1.906 2.812-2.687h2.719l7.062-3.688 2.313.969h4.906l1.156-1.375v-2.938l3.907-1.937v-3.125l1.062-.875-.094-.875 1-1-1.75-.375v-1.563l-1-1.562.782-.969 5.468-1.562 1.375-2.344 1.188-4.313 1.437-1.781.313-2.312 1.75.968 1.375-.375-1-1.562-.563-4.5-1.75-1.563.032-.125-3.094-.344-5.188-2.656-4.5.125-2.375 2.094-1.281 3.656-5.031.563-4.781 1.406 1.687 1.125-.687 1.688h-2.25l-1.25-2.688h-1.407l-2.25-1.687 3.094-.97-4.781-3.374-4.75.281-1.125-1.937-2.688.28z" className="land departement27" transform="translate(-27.84 -49.04)" />
									<path d="m232.09 242.353.374.875-5.656 1.563-1.344 1.969-2.375-1.563 1.188 3.906h-2.156l-3.907-2.75-1.937 3.906.969 1.188v1.156l-1.97 2.563.22 4.281-3.125 3.719-2.22 8h.25l.782 3.125 3.719.781v2.344l4.687 1.375v3.719l-.187 2.343h5.844l5.093-1.187-.406-2.156 1.563-.97 1.562 2.157 1.375.594 1.156 4.687 3.344 3.5.375 2.75 3.031 3 1.719-.156 2.125-1.969 1.531-7.969.969-2.812.719-3.5 3.094-1.125 2.093.406 1.407 1.281 1.53-2.53 1.407-1.282v-1.531l1.813-.125.437-1.844-1.562-2.094.25-.875-1.094-.937-2.938-4.344h-3.781l-1.125-1.687v-7.032l-1.531-4.062-.281-5.031-1.97-.157-2.25-1.687h-.562l-1.968 1.406-1.25-.844-.282-1.937 1.407-.719.125-.687-.813-.72z" className="land departement37" transform="translate(-27.84 -49.04)" />
									<path d="m293.62 205.947-2.53 2.344-5.72.5-.218.375.562 1.125-1.812 1.531.406 3.656-1.531.281-1 3.626-1.688 1.843h-2.375l-2.25 1.25-1.25-1.406-1.406-.562-1.531 1v1.53l-1.125.845-1.813-1.125-1.125.843.125 1.25-.531 1.156.406.126h1.657l-.125 1.125-1.125 1.937v1h1.125l.968 1.125.282 1.125-2.22 2.219 1.095 2.687v1.25l1.843 1.25 2.532.281 1.656 1.407.437 2.406 1.813 2.094 1.969-.563.843-1.812 3.094.406.688.719h1.968l.969-1.125 7.156.281 1.688 2.5 1.969.844 1.687 1.562 2.094-.281.562-.719h1.25l1.563 1.969 3.219.156.843 1.094 2.25 3.094.969.844 1.25-.125.156-2.813.563-.281.844.125 1.406 1.844.969.406 2-.813-.313-.344-.187-1.968 3.906-1.156-.594-2.157-.594-3.125-2.531-3.5-.594-2.156h3.907l2.75-1.969.375-2.906-1.75-1.969 5.093-4.281v-3.531l-2.562-2.719-.969-3.125-3.531-3.344-4.875 2.75-.375-1.562-2.156-.188-.594 1.563-1.938.375-5.281-.188-2.156 1.375-1.75-1.562 3.125-2.156-.188-3.313-2.343-1.187-1.97-2.938-5.25-.375z" className="land departement45" transform="translate(-27.84 -49.04)" />
									<path d="m274.62 266.916-1.25.437-2.53-.156-2.938 1-.688 1.531-.281-.562-3.375.156-1.687 1.406-1.97.281-.28.97 1.562 2.093-.437 1.844-1.813.125v1.531l-1.406 1.281-1.531 2.531-1.407-1.28-2.093-.407-3.094 1.125-.719 3.5-.969 2.813-1.531 7.968-2.125 1.969-1.719.156.5.5v3.719l-.781 2.344 3.719 2.937 1.937 1.938 3.125.406 1.188 4.094 2.125 1.156-.375 2.938-1.563.28.563.126 4.906.375 1.75-1.75 3.125 3.125 3.906-4.5 1.75 1.187 2.344-.219.781.407 3.532.187 1.156-3.125 9.781 1.188 3.719.969 1.687-.188.094-1.562 1.969-1.97-.406-1.687-1.125-2.219.406-.843.156-2.531.688-.844.156-.563-1.688-1.531-.562-1.969-2.656-1.406v-1.687l1.937-1.125v-1.125l-1.812-1.532-.563-.969 1.406-.718-.125-1.25 2.219-1.844-.125-.812h-1.812l-1.125-1.282v-.687l.968-1.688v-1.25l-2.25-2.969.438-2.656-1.281-.969-2.657.125-2.093.844-2.813-.406-1.406-1.125-.281-.844 2.25-1.844.156-2.218-2.969-1.688z" className="land departement36" transform="translate(-27.84 -49.04)" />
									<path d="m242.402 217.728-1.313 1.688-1.562 2.719 1.937 1.78-.187 4.095-.781 2.718h-1.97v3.719l-2.718 3.531-2.937 1.156-1.375 1.75.593 1.47 9.469.312.813.719-.125.687-1.407.719.282 1.937 1.25.844 1.968-1.406h.563l2.25 1.687 1.969.156.28 5.032 1.532 4.062v7.031l1.125 1.688h3.781l2.938 4.344 1.094.937.03-.094 1.97-.28 1.687-1.407 3.375-.156.281.562.688-1.531 2.937-1 2.532.156 1.25-.437 1.687 1.562 2.969 1.688 2.5-.156-.125-2.532 1.125-1.25 1.125-.125.969 1.094 3.937-.406 2.5-1.406-.281-.97-.688-.843.125-1.844 1.844-3.344 2.375-1v-2.093l.563-1.25-1.532-.563-1-2.125-2.531-.687-.125-.844 2.531-2.094 2.844-1.406-1.594-2.375-7.156-.281-.969 1.125h-1.968l-.688-.719-3.094-.406-.843 1.812-1.97.563-1.812-2.094-.437-2.406-1.656-1.406-2.532-.282-1.843-1.25v-1.25l-1.094-2.687 2.219-2.219-.282-1.125-.968-1.125h-1.125v-1l1.125-1.937.125-1.125h-1.657l-2.531-.72-2.375 2.25-2.687.282-4.344-1.125-1.25-2.812-1.688-.97-.968-2.25h-2.813l-1.125-.843 1.688-.969.125-.844h-1.813l-3.094.563z" className="land departement41" transform="translate(-27.84 -49.04)" />
									<path d="m295.433 246.322-2.844 1.406-2.531 2.094.125.844 2.531.687 1 2.125 1.532.563-.563 1.25v2.094l-2.375 1-1.844 3.343-.125 1.844.688.844.281.969-2.5 1.406-3.937.406-.97-1.094-1.124.125-1.125 1.25.125 2.531-2.5.157-.156 2.219-2.25 1.843.28.844 1.407 1.125 2.813.406 2.093-.844 2.657-.125 1.28.97-.437 2.656 2.25 2.968v1.25l-.968 1.688v.687l1.125 1.281h1.812l.125.813-2.219 1.844.125 1.25-1.406.719.563.968 1.812 1.531v1.125l-1.937 1.125v1.688l2.656 1.406.562 1.969 1.688 1.531-.156.563-.688.844-.156 2.53-.406.844 1.125 2.22.406 1.687-1.969 1.969-.094 1.562 4.594-.562.938-2 2.53-2.907 4.876-1 2.562.781 2.719-2.125-.187-1.562-.97-.781v-3.125l5.25-5.281 1.97 2.156 1.75-1.781 1.562-.188 2.719-3.5 4.5.375.062 1.063 1.5-4.782-.968-1.75.187-2.531.594-5.094-2.156-2.125.406-4.687-1.969-4.125-.187-2.719-3.532-2.75-.562-2.344 1.75-2.531v-3.719l-2.031-2.375-2 .813-.97-.406-1.405-1.844-.844-.125-.563.281-.156 2.813-1.25.125-.969-.844-2.25-3.094-.843-1.094-3.22-.156-1.562-1.969h-1.25l-.562.719-2.094.281-1.687-1.562-1.97-.844z" className="land departement18" transform="translate(-27.84 -49.04)" />
									<text><tspan x="139" y="198">02</tspan></text>
								</g>
								<g id="g01" onClick={this.handleClick}>
									<path d="m327.402 161.978-1.188.594-1.937 1.563-1.938-.594-3.343 1.375-2.72-1.563-1.187 1.563-1.75.187-1.187-.969-1.938-1.156-2.343 1.563-.094-.094-.844 5.406 1.156 6.875v4.594l-1.531 3.844.375 2.656-1.719 1.344.938 5.187-.75 1.125-.563 5.188 1.313 1.719-4.375 2.875v3.937l1.219 1.813 2.343 1.187.188 3.313-3.125 2.156 1.75 1.562 2.156-1.375 5.281.188 1.938-.375.594-1.563 2.156.188.375 1.562 4.875-2.75 1.781-2.125 2.344-2.75-1.563-1.75 1.375-2.937 3.5-1.75 7.625.375 1.75-1.344.157.156.437-3.281.781-3.906 1.375-1.781.188-2.344 2.719-1.156v-1.563l-2.907.188-.593-1.375.968-1.75-.781-2.938-1.562-.969.406-2.719 1.562-1-.218-1.156.562-.687-3.281-.688-1-2.344-1.75-.593-5.25-5.063-.594-4.312z" className="land departement77" transform="translate(-27.84 -49.04)" />
									<path d="m294.12 181.885-1.75.78-1.906.75-.375 2.126-2.875 1.344-.375 2.093 1.344 2.313-1.937 2.656h-2.844l1.125 1.719-1.344 1.531-.469 3.094.938.187.375 2.531.406.594.406 5.25 6.25-.562 2.532-2.344 2.156 1.75 5.25.375.75 1.125v-3.937l4.375-2.875-1.313-1.72.563-5.187.75-1.125-.938-5.187 1.719-1.344-.344-2.437-2.156-1h-3.625l-2.094-1.157-1.531.781z" className="land departement91" transform="translate(-27.84 -49.04)" />
									<path d="m275.464 155.166-1.562 1.937-1.188 4.313-1.312 2.219 4.75 2.125 3.625-.657 4.5 2.875 4.812.219 3.407 2.063.875 2.875-.032.062.375-.062 3.5-1.875 5.25-.344 2.875-1.313 1.844-1.312.594-3.844-1.281-1.281-4.282-2.531-4.125-2.157-2.125.969-2.343.594-1.563-1.188-3.125-1.937-2.531 1.937-3.719.406-5.281-.406-1.188-1.937z" className="land departement95" transform="translate(-27.84 -49.04)" />
									<path d="m271.402 163.635-.063.125-5.468 1.562-.782.969 1 1.562v1.563l1.75.375-1 1 .094.875.125-.094 1.938 1.938.593 2.343 1.563 1.563-.781 2.156v1.938l1.375 1.562-1.375 2.344 1.375 3.344 2.718 1.937.407 2.156 2.343.375.563 4.313 1.781 2.156 3.156.594.469-3.094 1.344-1.531-1.125-1.719h2.844l1.937-2.656-1.344-2.313.375-2.094 2.875-1.343.375-2.125 1.907-.75 1.75-.781.343.218v-.219l-1.75-1.968-1.093-2.969 1.75-3.812-.875-2.875-3.407-2.063-4.812-.219-4.5-2.875-3.625.656z" className="land departement78" transform="translate(-27.84 -49.04)" />
									<path d="m307.183 168.29-1.844 1.313-2.875 1.313-5.25.344.157.718.437.094.406.625-.406.875-.531.094.375.906 2.531-.031.813 1.25.156 1.75.875-.125.812-.656 1.219.062 1.531.875.875.969.407.187.25.469.968.25v-2.844l-1.156-6.875z" className="land departement93" transform="translate(-27.84 -49.04)" />
									<path d="m300.183 174.54-2.531.032-1.125.5-.469.625-1.031.063-.938 1.062.032.594.218.687 1.563.438 1.906.969 1.219.062.812-.219.844-.594.281.25 1.813.25.312-.656v-.656l-.312-.125-1.25.063.094.312-.22.188h-.405l.156-.407.062-.437h-.062l-.156-1.75z" className="land departement75" transform="translate(-27.84 -49.04)" />
									<path d="m297.214 171.26-3.5 1.875-.375.062-1.718 3.75 1.093 2.969 1.75 1.969v.218l2.719 1.906.656-.343-.5-.938.5-1.469-.312-.53.344-1.22h-.063l-1.906-.968-1.563-.438-.218-.687-.032-.594.938-1.062 1.031-.063.469-.625 1.125-.5-.375-.906.531-.094.406-.875-.406-.625-.437-.094z" className="land departement92" transform="translate(-27.84 -49.04)" />
									<path d="m302.84 176.76-.813.656-.813.125-.062.437-.156.406h.406l.219-.187-.094-.312 1.25-.063.312.125v.656l-.312.656-1.813-.25-.281-.25-.844.594-.812.219-1.156-.062-.344 1.218.312.531-.5 1.47.5.937.875-.438 2.094 1.156h3.625l2.156 1-.031-.218 1.531-3.844v-1.75l-.968-.25-.25-.469-.407-.187-.875-.969-1.531-.875z" className="land departement94" transform="translate(-27.84 -49.04)" />
									<text><tspan x="255" y="148">01</tspan></text>
								</g>
							</svg>
						</div>
						{/* </a> */}
						<figcaption>Telephone Regions of France</figcaption>
					</figure>
					{/* I removed this since unless the author is a cartographer, they have not attributed the source of their mapping data <Attribution>By <a href="//commons.wikimedia.org/wiki/User:Babsy" title="User:Babsy">Babsy</a> - <span className="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by/3.0" title="Creative Commons Attribution 3.0">CC BY 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=5173950">Link</a></Attribution> */}
				</div>
				<ol>
					<li>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Île-de-France</TableCell>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/01.mp3`}>01</AudioClip></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Northwest France</TableCell>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/02.mp3`}>02</AudioClip></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Northeast France</TableCell>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/03.mp3`}>03</AudioClip></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Southeast France</TableCell>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/04.mp3`}>04</AudioClip></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Southwest France</TableCell>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/05.mp3`}>05</AudioClip></TableCell>
								</TableRow>
							</TableBody>
						</Table>

						<p>Mobile numbers have the prefix 06 or 07.</p>
						<p>Telephone numbers are given in two-digit groups: e.g. <AudioClip className={`link`} soundFile={`sounds/fr/07 11 15 22 55.mp3`}>07 11 15 22 55</AudioClip></p>
					</li>
					<li>
						<p><AudioClip className={`link`} soundFile={`sounds/fr/bien.mp3`} ><b>Bien</b></AudioClip> is usually translated as 'well' or 'good'. However, here's an exception: It can sometimes be translated as 'isn't it', 'aren't you' etc or 'indeed' to verify something, as in the following examples:</p>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est bien le 06 22 14 66 33.mp3`} >C'est bien le 06 22 14 66 33 ?</AudioClip></TableCell>
									<TableCell>This is 06 22 14 66 33, isn't it?</TableCell>
								</TableRow>
								<TableRow>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est bien ça !.mp3`} >C'est bien ça !</AudioClip></TableCell>
									<TableCell>That's right / It is indeed.</TableCell>
								</TableRow>
								<TableRow className={`spacer`}><TableCell colSpan="2"></TableCell>
								</TableRow>
								<TableRow>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous êtes bien Madame Galipot.mp3`} >Vous êtes bien Madame Galipot ?</AudioClip></TableCell>
									<TableCell>You are Mme Galipot aren't you?</TableCell>
								</TableRow>
								<TableRow>
									<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est bien ça !.mp3`} >C'est bien ça !</AudioClip></TableCell>
									<TableCell>That's right / I am indeed.</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</li>
				</ol>
			</div>
			// </div>
		);
	};
}

export class LO9Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo9-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p><b>How to pronounce: 5, 6, 7, 8, 9, 10</b></p>
					<p>You would not expect to pronounce the final consonant of these words, but they are exceptions and are pronounced as followed: <AudioClip className={`link`} soundFile={`sounds/fr/cinq.mp3`} >cinq</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/six.mp3`} >six</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/sept.mp3`} >sept</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/huit.mp3`} >huit</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/neuf.mp3`} >neuf</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/dix.mp3`} >dix</AudioClip>.</p>
					<p>However, <b>NB</b>, when&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six.mp3`}><b>six</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit.mp3`}><b>huit</b></AudioClip> or&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix.mp3`}><b>dix</b></AudioClip> are followed by a word starting with a consonant,
						the final consonant of the number is <b>not</b> pronounced.</p>
					<p>e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six villages.mp3`}><b>six villages</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit villes.mp3`}><b>huit villes</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix pays.mp3`}><b>dix pays</b></AudioClip></p>
					<p>The last consonant of the number is pronounced as might be anticipated if the word following the number begins with a vowel.</p>
					<p>e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six enfants.mp3`}><b>six enfants</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit étudiants.mp3`}><b>huit étudiants</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix élèves.mp3`}><b>dix élèves</b></AudioClip>
					</p>
				</div>
			</div>
		);
	};
}

export class L10Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo10-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<div className={`two-columns`}>
								<img src={resolveAsset(`images/vouloir.jpg`)} title="vouloir" alt="A young girl points to the cake she wants"/>
								<div className={`text`}>
									<p>Using the verb <AudioClip className={`audio-link`} soundFile={`sounds/fr/vouloir.mp3`} >vouloir</AudioClip> meaning 'to want'</p>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je veux.mp3`} >je veux</AudioClip></TableCell>
												<TableCell>I want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu veux.mp3`} >tu veux</AudioClip></TableCell>
												<TableCell>you want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il veut. elle veut.mp3`} >il / elle veut</AudioClip></TableCell>
												<TableCell>he / she/ it wants</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Nous voulons.mp3`} >nous voulons</AudioClip></TableCell>
												<TableCell>we want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous voulez.mp3`} >vous voulez</AudioClip></TableCell>
												<TableCell>you want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ils veulent. Elles veulent.mp3`} >ils / elles veulent</AudioClip></TableCell>
												<TableCell>they want</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</div>

							<p>The verb vouloir is very frequently used together with another verb. This second verb is used in its infinitive form. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je veux aller au Canada.mp3`} >Je veux aller au Canada.</AudioClip></TableCell>
										<TableCell>I want to go to Canada.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ma copine veut étudier en France.mp3`} >Ma copine veut étudier en France.</AudioClip></TableCell>
										<TableCell>My girlfriend wants to study in France.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Mes amis veulent passer le week-end à Londres.mp3`} >Mes amis veulent passer le week-end à Londres.</AudioClip></TableCell>
										<TableCell>My friends want to spend the weekend in London.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The preposition à has a variety of meanings. It is used to mean <i>to the</i> or <i>in the</i> or <i>at the</i> before a common noun.&nbsp;
							You will see the following forms: <b>au</b> before a masculine noun,&nbsp;
							<b>à la</b> before a feminine noun, <b>à l'</b> before a noun beginning with a vowel or silent h and&nbsp;
							<b>aux</b> before a plural noun. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je travaille au laboratoire.mp3`} >Je travaille au laboratoire.</AudioClip></TableCell>
										<TableCell>I work / I am working at the laboratory.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu veux aller à la piscine.mp3`} >Tu veux aller à la piscine ?</AudioClip></TableCell>
										<TableCell>Do you want to go to the swimming pool?</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Elle veut aller à l'exposition.mp3`} >Elle veut aller à l'exposition.</AudioClip></TableCell>
										<TableCell>She wants to go to the exhibition.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/J'aime aller aux magasins.mp3`} >J'aime aller aux magasins.</AudioClip></TableCell>
										<TableCell>I like going to the shops.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class L10Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo9-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p><b>How to pronounce</b>: <b>ui</b></p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/aujourd'hui.mp3`}><b>aujourd'hui</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/bruit.mp3`}><b>bruit</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/ensuite.mp3`}><b>ensuite</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/gratuit.mp3`}><b>gratuit</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/minuit.mp3`}><b>minuit</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nuit.mp3`}><b>nuit</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/puis.mp3`}><b>puis</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/suis.mp3`}><b>suis</b></AudioClip></p>
				</div>
			</div>
		);
	};
}

export class L11Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo11-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>To express what you would like <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais.mp3`}><b>Je voudrais</b></AudioClip> is
								the form of verb that you use. e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais une glace.mp3`}><b>Je voudrais
									une glace</b></AudioClip> I'd like an ice-cream.
								This is the present conditional of the verb <AudioClip className={`link`} soundFile={`sounds/fr/vouloir.mp3`}><b>vouloir</b></AudioClip>.
								To express what you would like to do, you add another verb in the infinitive form.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais aller au marché demain.mp3`}><b>Je voudrais aller au
									marché demain</b></AudioClip>. I'd like
								to go to the market tomorrow.<br /><br />

								You can see the forms for all the persons of the verb below:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais.mp3`}><b>je voudrais</b></AudioClip></TableCell>
										<TableCell>I would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu voudrais.mp3`}><b>tu voudrais</b></AudioClip></TableCell>
										<TableCell>you would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il voudrais. Elle voudrais.mp3`}><b>il / elle voudrait</b></AudioClip></TableCell>
										<TableCell>he / she would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous voudrions.mp3`}><b>nous voudrions</b></AudioClip></TableCell>
										<TableCell>we would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous voudriez.mp3`}><b>vous voudriez</b></AudioClip></TableCell>
										<TableCell>you would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils voudraient. elles voudraient.mp3`}><b>ils / elles voudraient</b></AudioClip></TableCell>
										<TableCell>they would like</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><b>prendre</b></AudioClip> is a frequently occurring irregular
								verb. It means <b>to take</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je prends le bus pour aller au centre-ville.mp3`}><b>Je prends le bus pour aller au centre-ville</b></AudioClip>.
								I take the bus to go to the town centre.
							<AudioClip className={`link`} soundFile={`sounds/fr/Prenez la première rue à droite !.mp3`}><b>Prenez la première rue à droite !</b></AudioClip> Take the first
								turning on the
								right! <AudioClip className={`link`} soundFile={`sounds/fr/Il prend une douche.mp3`}><b>Il prend une douche</b></AudioClip>. He's taking a shower.</p>
							<p>NB In English we say: <i><b>I'm having</b> a coffee</i> or <i><b>I have</b> breakfast at 8 o'clock</i>. In French, it is incorrect to use <b>avoir</b> in
								this context, you use <AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><b>prendre</b></AudioClip> instead
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je prends un café.mp3`}><b>Je prends un café</b></AudioClip> or <AudioClip className={`link`} soundFile={`sounds/fr/Je prends mon petit déjeuner à huit heures.mp3`}><b>Je prends mon petit déjeuner à huit heures</b></AudioClip>.</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><b>Prendre</b></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je prends.mp3`}><b>je prends</b></AudioClip></TableCell>
										<TableCell> I take / have - I am taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu prends.mp3`}><b>tu prends</b></AudioClip></TableCell>
										<TableCell> you take / have - you are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il prend. elle prend.mp3`}><b>il / elle prend</b></AudioClip></TableCell>
										<TableCell>He / she takes / has – he/she is taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous prenons.mp3`}><b>nous prenons</b></AudioClip></TableCell>
										<TableCell>we take / have - we are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous prenez.mp3`}><b>vous prenez</b></AudioClip></TableCell>
										<TableCell>you take / have - you are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils prennent. elles prennent.mp3`}><b>ils / elles prennent</b></AudioClip></TableCell>
										<TableCell>they take / have - they are taking / having</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li><p><b>Flavours, filling and toppings</b></p>
							<p>To describe the flavours, filling and toppings of food stuffs, you use the preposition <b>à</b> with the definite article: <b>au</b>, <b>à la</b>, <b>à l'</b>, <b>aux</b> e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Pour moi un sandwich au fromage.mp3`}><b>Pour moi un sandwich au fromage</b></AudioClip></TableCell>
										<TableCell>A cheese sandwich for me.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais une glace à la vanille.mp3`}><b>Je voudrais une glace à la vanille</b></AudioClip></TableCell>
										<TableCell>I'd like a vanilla ice-cream.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/J'aime la sauce à l'orange.mp3`}><b>J'aime la sauce à l'orange</b></AudioClip></TableCell>
										<TableCell>I like the orange sauce.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous prenez une omelette aux champignons.mp3`}><b>Vous prenez une omelette aux champignons ?</b></AudioClip></TableCell>
										<TableCell>Are you having a mushroom omelette?</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>In French there are some pronouns called <b>disjunctive pronouns</b> (or <b>stressed pronouns</b>). They are listed below.
								They are the pronouns which are used after prepositions such as <AudioClip className={`link`} soundFile={`sounds/fr/pour.mp3`}><b>pour</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/avec.mp3`}><b>avec</b></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/sans.mp3`}><b>sans</b></AudioClip> etc. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Pour moi un café s'il vous plait.mp3`}><b>Pour moi un café s'il vous plait</b></AudioClip></TableCell>
										<TableCell>A coffee for me please.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Les enfants ne veulent pas jouer au football sans lui.mp3`}><b>Les enfants ne veulent pas jouer au football sans lui</b></AudioClip></TableCell>
										<TableCell>The children don't want to play football without him.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je travaille avec eux.mp3`}><b>Je travaille avec eux</b></AudioClip></TableCell>
										<TableCell>I work with them.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<br/>
							<Table>
								<thead>
									<TableRow><th>Subject pronouns&nbsp;&nbsp;&nbsp;</th><th>Disjunctive pronouns</th></TableRow>
								</thead>
								<TableBody>
									<TableRow>
										<TableCell>je</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/moi.mp3`}><b>moi</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>tu</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/toi.mp3`}><b>toi</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>il</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/lui.mp3`}><b>lui</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>elle</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle.mp3`}><b>elle</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>nous</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><b>nous</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>vous</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><b>vous</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ils</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/eux.mp3`}><b>eux</b></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>elles</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elles.mp3`}><b>elles</b></AudioClip></TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class L12Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;

		return (
			<div
				className={`lo12-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><b>aller</b></AudioClip> is a
								frequently occurring irregular verb meaning 'to go'.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je vais.mp3`}>je vais</AudioClip></TableCell><TableCell>I go / am going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu vas.mp3`}>tu vas</AudioClip></TableCell><TableCell>you go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il va, elle va.mp3`}>il / elle va</AudioClip></TableCell><TableCell>he /she/ it goes / is going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous allons.mp3`}>nous allons</AudioClip></TableCell><TableCell>we go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous allez.mp3`}>vous allez</AudioClip></TableCell><TableCell>you go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils vont, elles vont.mp3`}>ils / elles vont</AudioClip></TableCell><TableCell>they go / are going</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p>e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je vais en ville.mp3`}>Je vais en ville</AudioClip>.</TableCell><TableCell>I'm going into town.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Mélanie va au marché le mardi.mp3`}>Mélanie va au marché le mardi</AudioClip>.</TableCell><TableCell>Mélanie goes to the market on Tuesdays.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p><b>NB</b>: The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><b>aller</b></AudioClip> is also the verb used when
								asking how someone is. English uses the verb 'to be' to ask after someone. In French, it is incorrect to use <b>être</b> in
								this context. You use <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><b>aller</b></AudioClip> instead. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Comment ça va.mp3`}>Comment ça va ?</AudioClip></TableCell>
										<TableCell>How are you? / How's it going?</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous allez bien.mp3`}>Vous allez bien ?</AudioClip></TableCell>
										<TableCell>Are you well?</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The little words <b>de</b>, <b>d'</b>, <b>du</b>, <b>de la</b>, <b>de l'</b> and <b>des</b> occur often in French and can sometimes
								cause confusion.
								You may find it useful to study the following explanations to gain some clarity.</p>
							<ul>
								<li>You will probably already have encountered examples of some of these meaning 'from'
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je viens de France.mp3`}><b>Je
									viens <b>de</b> France</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/elle vient du Canada.mp3`}><b>elle
										vient <b>du</b> Canada</b></AudioClip> etc.</li>
								<li>These words have other meanings too, so it is important to bear the context in mind. e.g.</li>
							</ul>
							<p>To express <b>non-specific quantities</b> you use partitive articles: <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><b>de</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><b>d'</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><b>du</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><b>de la</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><b>de l'</b></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><b>des</b></AudioClip> (often translated as 'some').
								<br/><br/>For masculine nouns you use <b>du</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/du fromage.mp3`}><b>du</b> fromage</AudioClip> - some cheese
								<br/>For feminine nouns you use <b>de la</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de la bière.mp3`}><b>de la</b> bière</AudioClip> - some beer
								<br/>For nouns beginning with a vowel you use <b>de l'</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de l'eau.mp3`}><b>de l'</b>eau</AudioClip> - some water
								<br/>For plurals you use <b>des</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/des cerises.mp3`}><b>des</b> cerises</AudioClip> - some cherries</p>

							<ul>
								<li> When describing <b>specific quantities</b> of
							something <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><b>de</b></AudioClip> is used meaning <b>'of'</b>.
							Before a vowel <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><b>d'</b></AudioClip> is used. e.g.

								<Table>
									<TableBody>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/un kilo de pommes.mp3`}>un kilo de pommes</AudioClip>
											</TableCell>
											<TableCell>
											a kilo of apples
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une barquette de fraises.mp3`}>une barquette de fraises</AudioClip>
											</TableCell>
											<TableCell>
											a punnet of strawberries
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une tasse de thé.mp3`}>une tasse de thé</AudioClip>
											</TableCell>
											<TableCell>
											a cup of tea
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/200 grammes d'amandes.mp3`}>200 grammes d'amandes</AudioClip>
											</TableCell>
											<TableCell>
											200 grams of almonds
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une bouteille d'eau minérale.mp3`}>une bouteille d'eau minérale</AudioClip>
											</TableCell>
											<TableCell>
											a bottle of mineral water
											</TableCell>
										</TableRow>
									</TableBody>
								</Table><br/>
								</li>
								<li>The forms <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><b>d'</b></AudioClip> or <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><b>d'</b></AudioClip> are also used after a <b>negation</b>:<br/><br/>
									e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai du pain.mp3`}><b>J'ai du pain</b></AudioClip>. I have (some) bread
									BUT after the negation <AudioClip className={`link`} soundFile={`sounds/fr/Je n'ai pas de pain.mp3`}><b>Je n'ai pas de pain</b></AudioClip>. I don't have
									any bread. <AudioClip className={`link`} soundFile={`sounds/fr/Il veut de l'eau.mp3`}><b>Il veut de l'eau</b></AudioClip>. He
									wants (some) mineral water. BUT after the negation <AudioClip className={`link`} soundFile={`sounds/fr/Il ne veut pas d'eau minérale.mp3`}><b>Il ne veut pas d'eau minérale</b></AudioClip>. He doesn't want any water.</li>

								{/* <li>
									<p>To express <b>non-specific quantities</b> you use the following: <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><b>de</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><b>d'</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><b>du</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><b>de la</b></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><b>de l'</b></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><b>des</b></AudioClip> all of which mean 'some'.
										<br/>For masculine nouns you use <b>du</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/du fromage.mp3`}><b>du</b> fromage</AudioClip> - some cheese
										<br/>For feminine nouns you use <b>de la</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de la bière.mp3`}><b>de la</b> bière</AudioClip> - some beer
										<br/>For nouns beginning with a vowel you use <b>de l'</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de l'eau.mp3`}><b>de l'</b>eau</AudioClip> - some water
										<br/>For plurals you use <b>des</b> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/des cerises.mp3`}><b>des</b> cerises</AudioClip> - some cherries</p>
								</li> */}
							</ul>
						</li>
						<li>
							<p>The plural of French nouns is generally formed by adding an <b>s</b>. There are some exceptions to this rule, and these include
								adding an <b>x</b> instead of an <b>s</b> to nouns ending in <b>-eau</b>. e.g.
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un couteau.mp3`}><b>un couteau</b></AudioClip> a knife- <AudioClip className={`link`} soundFile={`sounds/fr/des couteaux.mp3`}><b>des couteaux</b></AudioClip> some knives,
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un gâteau.mp3`}><b>un gâteau</b></AudioClip> a cake- <AudioClip className={`link`} soundFile={`sounds/fr/des gâteaux.mp3`}><b>des gâteaux</b></AudioClip> some cakes,
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un poireau.mp3`}><b>un poireau</b></AudioClip> a leek- <AudioClip className={`link`} soundFile={`sounds/fr/des poireaux.mp3`}><b>des poireaux</b></AudioClip> some leeks</p>

						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class L12Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo12-demystify-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<p>How to pronounce: <AudioClip className={`link`} soundFile={`sounds/fr/u.mp3`}><b>u</b></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/ou.mp3`}><b>ou</b></AudioClip></p>
					<p>To the untrained ear these sounds may not sound very different, but it is worthwhile practising them as on occasions the
						wrong pronunciation could lead to confusion.</p>
					<p>Here are some examples. Listen to each pair. You should hear that they sound different</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/tout.mp3`}><b>tout</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/tu.mp3`}><b>tu</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><b>nous</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nu.mp3`}><b>nu (naked)</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/pour.mp3`}><b>pour</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/pur.mp3`}><b>pur (pure)</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><b>du</b></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/doux.mp3`}><b>doux (gentle/sweet)</b></AudioClip></p>

				</div>
			</div>
		);
	};
}

export class L13Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo13-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>The French subject pronoun <AudioClip className={`link`} soundFile={`sounds/fr/on.mp3`}><b>on</b></AudioClip> literally
								means <b>'one'</b> but is generally translated as <b>they</b>, <b>you</b>, <b>people</b> and is very often used instead
								of <AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><b>nous</b></AudioClip> to mean <b>we</b> in spoken French.</p>
							<p>It is always used with the third
								person singular of the verb.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/On parle français ici.mp3`}><b>On parle français ici</b></AudioClip>. French is spoken here.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/On va au cinéma.mp3`}><b>On va au cinéma ?</b></AudioClip> Are we going / Shall we go to the cinema?</p>
						</li>
						<li>
							<p>In French there are some verbs called <b>reflexive verbs</b>. These are verbs where the subject and object are the same.
								You can recognise a reflexive verb in the infinitive form by the word se in front of the
								verb e,g. <AudioClip className={`link`} soundFile={`sounds/fr/se laver.mp3`}><b>se laver</b></AudioClip> - to
									wash (oneself), <AudioClip className={`link`} soundFile={`sounds/fr/se reposer.mp3`}><b>se reposer</b></AudioClip> -
										to rest (oneself). Some reflexive verbs are regular verbs and some are irregular.</p>
							<p>Reflexive verbs always have a reflexive pronoun (<AudioClip className={`link`} soundFile={`sounds/fr/me.mp3`}><b>me</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/te.mp3`}><b>te</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/se.mp3`}><b>se</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><b>nous</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><b>vous</b></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/se.mp3`}><b>se</b></AudioClip>) between the subject and the verb.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je me lave.mp3`}><b>Je me lave</b></AudioClip> - I wash myself / I have a
									wash. <AudioClip className={`link`} soundFile={`sounds/fr/Elle se repose.mp3`}><b>Elle se repose</b></AudioClip> – she's resting herself / she's having a rest.</p>

							<p>Here is an example of a reflexive verb in the present tense:</p>

							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/se reposer.mp3`}><b>se reposer</b></AudioClip></TableCell><TableCell>to rest (oneself)</TableCell>
									</TableRow>
									<TableRow><TableCell>&nbsp;</TableCell></TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je me repose.mp3`}><b>je me repose</b></AudioClip></TableCell><TableCell>I rest / I am resting (myself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu te reposes.mp3`}><b>tu te reposes</b></AudioClip></TableCell><TableCell>you rest / you are resting (yourself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il se repose.mp3`}><b>il se repose</b></AudioClip></TableCell><TableCell>he rests / he is resting (himself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Elle se repose.mp3`}><b>elle se repose</b></AudioClip></TableCell><TableCell>she rests / she is resting (herself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on se repose.mp3`}><b>on se repose</b></AudioClip></TableCell><TableCell>people /we rest / we are resting (themselves / ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous nous reposons.mp3`}><b>nous nous reposons</b></AudioClip></TableCell><TableCell>we rest / we are resting (ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous vous reposez.mp3`}><b>vous vous reposez</b></AudioClip></TableCell><TableCell>you rest / you are resting (yourself / yourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils se reposent, elles se reposent.mp3`}><b>ils / elles se reposent</b></AudioClip></TableCell><TableCell>they rest / theyare resting (themselves)</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p>If the verb begins with a vowel, then the reflexive pronouns are <b>s'</b>, <b>t'</b>, <b>s'</b>, <b>nous</b>, <b>vous</b>, <b>s'</b>. Below is
								the verb <AudioClip className={`link`} soundFile={`sounds/fr/s'appeler.mp3`}><b>s'appeler</b></AudioClip> - to be called which illustrates this.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je m'appelle.mp3`}><b>je m'appelle</b></AudioClip></TableCell><TableCell>I am called (I call myself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu t'appelles.mp3`}><b>tu t'appelles</b></AudioClip></TableCell><TableCell>you are called (you call yourself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il s'appelle.mp3`}><b>il s'appelle</b></AudioClip></TableCell><TableCell>he is called (he calls himself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle s'appelle.mp3`}><b>elle s'appelle</b></AudioClip></TableCell><TableCell>she is called (she calls herself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on s'appelle.mp3`}><b>on s'appelle</b></AudioClip></TableCell><TableCell>they / we are called (they call themselves / we call ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous nous appelons.mp3`}><b>nous nous appelons</b></AudioClip></TableCell><TableCell>we are called (we call ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous vous appelez.mp3`}><b>vous vous appelez</b></AudioClip></TableCell><TableCell>you are called (you call yourself / yourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils s'appellent, elles s'appellent.mp3`}><b>ils / elles s'appellent</b></AudioClip></TableCell><TableCell>they / are called (they call themselves)</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class L13ASummersDay extends Component {

	constructor(props) {
		super(props);
		const rowsAnswered = new Array(12).fill(false);
		const userChose = new Array(12);
		this.state = ({
			allAnswered: false,
			nCorrect: 0,
			rowsAnswered: rowsAnswered,
			// test: false,
			userChose: userChose,
		});
		// this.answerRow = this.answerRow.bind(this);
	}

	isTrue = (entry) => {
		// console.log("isTrue", entry, index);
		return entry === true;
	};

	answerRow = (rowNum, answer, correct) => {
		const {
			rowsAnswered,
			userChose
		} = this.state;
		let {
			allAnswered,
			nCorrect,
		} = this.state;
		const { showDialog } = this.props;

		rowsAnswered[rowNum] = true;
		userChose[rowNum] = answer;
		if (correct) nCorrect++;
		allAnswered = rowsAnswered.every(this.isTrue);
		this.setState({
			allAnswered: allAnswered,
			nCorrect: nCorrect,
			rowsAnswered: rowsAnswered,
			userChose: userChose
		});

		if (allAnswered && nCorrect === 12)showDialog("Félicitations !");
	};

	handleChange = (e) => {
		if (e.target.id === 'testTrue') {
			this.setState({
				test: true,
			});
		} else {
			this.setState({
				test: false,
			});
		}
	};

	render = () => {
		const {
			id,
			logError,
			showDialog,
		} = this.props;
		const {
			allAnswered,
		} = this.state;

		const RQConfig = {
			"component": "RadioQuiz",
			"id": "L13SummersDayRadioQuiz",
			"options": [
				"Vrai",
				"Faux"
			],
			"phrases": [
				[
					"Véronique se lève vers 7 heures le week-end.",
					1,
					"Véronique se lève vers 6 heures le week-end.",
					""
				],
				[
					"Elle se promène en ville.",
					1,
					"Elle se promène dans le village.",
					""
				],
				[
					"Elle aime être dehors quand il fait beau.",
					0,
					"",
					""
				],
				[
					"Après sa promenade, Véronique prend un bain.",
					1,
					"Elle prend une douche rapide.",
					""
				],
				[
					"Elle prend un bol de yaourt.",
					1,
					"Elle prend un bol de céréales.",
					""
				],
				[
					"Elle boit du café-crème.",
					0,
					"",
					""
				],
				[
					"Dans le jardin il y a deux arbres.",
					1,
					"Dans le jardin il y a trois arbres.",
					""
				],
				[
					"Véronique passe une heure dans le jardin.",
					1,
					"Véronique passe la matinée entière dans le jardin.",
					""
				],
				[
					"Elle passe l'après-midi avec ses parents.",
					1,
					"Elle passe l'après-midi avec ses amis.",
					""
				],
				[
					"Parfois, ils vont en ville.",
					0,
					"",
					""
				],
				[
					"Elle dîne dans la salle à manger.",
					1,
					"Elle dîne dans le jardin ou sur le balcon.",
					""
				],
				[
					"Le soir, elle se détend.",
					0,
					"",
					""
				]
			],
		};

		return (
			<div
				className={`panel`}
				id={`${id ? `${id}Panel` : ''}`}
				key={`${id}CustomComponent`}
			>
				<img src={resolveAsset(`images/girl_breakfast.png`)} title={`Girl having breakfast in the garden`} />
				<div className={`instructions`}>
					<p className={`instruction`}>Listen to Véronique describing a typical summer's day. Then decide whether the following statements are true (vrai) of false (faux).</p>
					<AudioClip className={``} soundFile={`sounds/fr/LO13EX4.mp3`} />

					<div id={`${id}passage`} className={`passage ${allAnswered ? 'show' : 'hide'}`}>
						<p>En été, je me lève vers six heures le week-end, je m'habille et je me promène dans le village. J'aime être dehors quand il fait beau.
							Puis, après, je prends une douche rapide et je prépare mon petit déjeuner. Je prends un bol de céréales et je bois deux tasses
							de café-crème.
							J'ai un grand jardin avec beaucoup de fleurs et trois arbres et j'aime faire du jardinage. Souvent, je passe la matinée entière
							dans le jardin.
							Je passe l'après-midi avec des amis. Parfois, nous allons en ville, parfois nous restons simplement à la maison. S'il fait chaud,
							je dîne dans le jardin ou sur le balcon. Le soir, je me détends.
						</p>
					</div>
				</div>
				<RadioQuiz
					config={RQConfig}
					logError={logError}
					showDialog={showDialog}
					onComplete={() => this.setState({allAnswered: true})}
				/>
			</div>
		);
	};
}

export class L14Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo14-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>Sometimes literal translation works very well, but there are times when the rendering might not sound idiomatic.
								An example of this is when asking what people like, prefer, do etc. Using a construction
								with <AudioClip className={`link`} soundFile={`sounds/fr/comme.mp3`}><b>comme</b></AudioClip> is an idiomatic way of
								asking the question:</p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Qu'est-ce que vous faites comme sports.mp3`}>Qu'est-ce que vous faites <b>comme</b> sports ?</AudioClip></TableCell><TableCell>What sports do you do?</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Qu'est-ce que tu aimes comme musique.mp3`}>Qu'est-ce que tu aimes <b>comme</b> musique ?</AudioClip></TableCell><TableCell>What sort of music do you like?</TableCell></TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>The irregular verb <AudioClip className={`link`} soundFile={`sounds/fr/devoir.mp3`}><b>devoir</b></AudioClip> means "to have to." It is used together with another verb in its infinitive form.</p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je dois partir à trois heures.mp3`}><b>Je dois partir</b> à trois heures.</AudioClip></TableCell><TableCell>I have to leave at 3 o'clock.</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ils doivent travailler très dur.mp3`}><b>Ils doivent travailler</b> très dur.</AudioClip></TableCell><TableCell>They have to work hard.</TableCell></TableRow>
								</TableBody>
							</Table>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/devoir.mp3`}><b>devoir</b></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je dois.mp3`}>je dois</AudioClip></TableCell><TableCell>I have to / I must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu dois.mp3`}>tu dois</AudioClip></TableCell><TableCell>you have to / you must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il doit, elle doit.mp3`}>il / elle doit</AudioClip></TableCell><TableCell>he / she has to — he / she must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on doit.mp3`}>on doit</AudioClip></TableCell><TableCell>people / we have to — people / we must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous devons.mp3`}>nous devons</AudioClip></TableCell><TableCell>we have to — we must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous devez.mp3`}>vous devez</AudioClip></TableCell><TableCell>you have to / you must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils doivent, elles doivent.mp3`}>ils / elles doivent</AudioClip></TableCell><TableCell>they have to / they must</TableCell></TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>The irregular verb <AudioClip className={`link`} soundFile={`sounds/fr/pouvoir.mp3`}><b>pouvoir</b></AudioClip> means
								"to be able to." It is used together with another verb in its infinitive form.</p>
							<p>Je peux répondre à votre question tout de suite. — I can answer your question right away.
								Vous pouvez ouvrir la fenêtre, s'il vous plaît ? — Can you open the window, please?</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/pouvoir.mp3`}><b>pouvoir</b></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je peux.mp3`}>je peux</AudioClip></TableCell>
										<TableCell>I am able to / I can / I may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu peux.mp3`}>tu peux</AudioClip></TableCell>
										<TableCell>you are able to / you can / you may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il peut.mp3`}>il peut</AudioClip></TableCell>
										<TableCell>he is able to / he can / he may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle peut.mp3`}>elle peut</AudioClip></TableCell>
										<TableCell>she is able to / she can / she may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on peut.mp3`}>on peut</AudioClip></TableCell>
										<TableCell>people / we are able to / can / may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous pouvons.mp3`}>nous pouvons</AudioClip></TableCell>
										<TableCell>we are able to / we can / we may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous pouvez.mp3`}>vous pouvez</AudioClip></TableCell>
										<TableCell>you are able to / you can / you may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils peuvent, elles peuvent.mp3`}>ils / elles peuvent</AudioClip></TableCell>
										<TableCell>they are able to / they can / they may</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>In French there are present and past participles:</p>

							<p><strong>i. Present Participles</strong></p>

							<p>In English the present participle ends in <em>-ing</em> (e.g. interesting, encouraging).
								In French the present participle is the verb form that ends in <em>-ant</em>. Present participles can often be used as adjectives:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est fatigant.mp3`}>C'est fatigant</AudioClip></TableCell>
										<TableCell>It's tiring</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est motivant.mp3`}>C'est motivant</AudioClip></TableCell>
										<TableCell>It's motivating</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est intéressant.mp3`}>C'est intéressant</AudioClip></TableCell>
										<TableCell>It's interesting</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<p><strong>ii. Past Participles</strong><br/>
								Examples of past participles in English are: tired, motivated, fascinated.
								In French many past participles end in <b>-é</b>. These are the past participles of <b>-er</b> verbs. Past participles can often be used as adjectives:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je suis fatigué.mp3`}>Je suis fatigué.e</AudioClip></TableCell>
										<TableCell>I am tired</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Les étudiants sont très motivés.mp3`}>Les étudiants sont très motivés</AudioClip></TableCell>
										<TableCell>The students are very motivated</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il est fasciné.mp3`}>Il est fasciné</AudioClip></TableCell>
										<TableCell>He is fascinated</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<p><strong>NB:</strong> Present and past participles used as adjectives must agree in gender and number with the noun they are describing.</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class L15Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo15-grammar-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>There are some words and phrases that cannot be translated literally from English to French.
							This happens when talking about the weather: in English we use the verb <b>to be</b> e.g: It's hot. It's windy etc.
							</p>
							<p>In French we do not use <b>to be</b>. The verb <AudioClip className={`link`} soundFile={`sounds/fr/faire.mp3`}><b>faire</b></AudioClip> is
								often used in this context e.g <AudioClip className={`link`} soundFile={`sounds/fr/Il fait chaud.mp3`}><b>Il fait chaud</b></AudioClip>. It's hot.
								The phrase <AudioClip className={`link`} soundFile={`sounds/fr/Il y a.mp3`}><b>Il y a</b></AudioClip> is used in some cases
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Il y a du vent.mp3`}><b>Il y a du vent</b></AudioClip>. It's windy.</p>
						</li>
						<li>
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><b>aller</b></AudioClip> is a very useful verb. It has three uses.
								Firstly, there is the literal meaning to go e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je vais en ville.mp3`}><b>Je vais
									en ville</b></AudioClip>.
								I'm going into town.
								Secondly, it's used when asking after someone e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Comment ça va.mp3`}><b>Comment ça va ?</b></AudioClip> How are you?
								And thirdly, it is conjugated in the present tense and followed by another verb in its infinitive form to construct the near future.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je vais passer mes vacances en France.mp3`}><b>Je vais passer mes vacances en France</b></AudioClip>. I am going to spend my holidays in France.
							<AudioClip className={`link`} soundFile={`sounds/fr/Ma sœur va avoir 20 ans la semaine prochaine.mp3`}><b>Ma sœur va avoir 20 ans la semaine prochaine</b></AudioClip>. My sister is going to be 20 next week.</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

export class AudioClipSamples extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`audio-clip-samples-container container`}
				id={`${id ? id : ''}`}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={`${id ? `${id}Panel` : ''}`}
					key={`${id}CustomComponent`}
				>
					<h2>AudioClip Samples</h2>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>link:</TableCell>
								<TableCell><AudioClip className={`link`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>compact:</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>super-compact:</TableCell>
								<TableCell><AudioClip className={`super-compact`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>super-compact-speaker:</TableCell>
								<TableCell><AudioClip className={`super-compact-speaker`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>default:</TableCell>
								<TableCell><AudioClip className={``} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}
