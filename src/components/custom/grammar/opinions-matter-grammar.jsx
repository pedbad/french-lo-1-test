import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class LO7Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo7-grammar-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li><p>French like all languages borrows words from other languages. In the greater majority of cases, borrowed nouns are masculine. e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le cricket.mp3`}><strong>le cricket</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le judo.mp3`}><strong>le judo</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le shopping.mp3`}><strong>le shopping</strong></AudioClip>.
							Almost all ball sports are borrowed words, and these are all masculine.</p></li>
						<li><p>Word for word translation often works very well, but sometimes being aware of some seemingly small differences is essential. e.g.
								In English, we say, 'I like football' or 'I don't like swimming'. In French, we say '
						<AudioClip className={`link`} soundFile={`sounds/fr/J'aime le football.mp3`}>J'aime <em>le</em> football</AudioClip>' or '
						<AudioClip className={`link`} soundFile={`sounds/fr/Je n'aime pas la natation.mp3`}>Je n'aime pas <em>la</em> natation</AudioClip>'.
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

