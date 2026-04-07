import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class OpinionsMatterGrammarBorrowedNouns extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo7-grammar1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						French like all languages borrows words from other languages. In the greater
						majority of cases, borrowed nouns are masculine. e.g.{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/le-cricket.mp3">
							<strong>le cricket</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/le-judo.mp3">
							<strong>le judo</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/le-shopping.mp3">
							<strong>le shopping</strong>
						</AudioClip>
						. Almost all ball sports are borrowed words, and these are all masculine.
					</p>
				</div>
			</div>
		);
	};
}

export class OpinionsMatterGrammarLikesAndInfinitives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo7-grammar2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						Word for word translation often works very well, but sometimes being aware
						of some seemingly small differences is essential. e.g. In English, we say,
						{" "}&apos;I like football&apos; or &apos;I don&apos;t like swimming&apos;.
						In French, we say &apos;
						<AudioClip className="link" soundFile="audio/lo7/grammar/j-aime-le-football.mp3">
							J&apos;aime <em>le</em> football
						</AudioClip>
						&apos; or &apos;
						<AudioClip className="link" soundFile="audio/lo7/grammar/je-n-aime-pas-la-natation.mp3">
							Je n&apos;aime pas <em>la</em> natation
						</AudioClip>
						&apos;. i.e. in French, a definite article (le, la, l&apos;, les) is
						required.
					</p>
					<p>
						To say what you like/ dislike doing you use{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/j-aime.mp3">
							J&apos;aime
						</AudioClip>
						{" "}plus an infinitive. e.g.{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/j-aime-danser.mp3">
							J&apos;aime danser
						</AudioClip>
						: I like to dance / I like dancing.{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/je-n-aime-pas-regarder-la-television.mp3">
							Je n&apos;aime pas regarder la télévision
						</AudioClip>
						: I don&apos;t like to watch the television / I don&apos;t like watching
						the television.
					</p>
				</div>
			</div>
		);
	};
}

export class OpinionsMatterGrammarInterrogatives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo7-grammar3-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<p>
						<AudioClip className="link" soundFile="audio/lo7/grammar/quel.mp3">
							Quel
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/quelle.mp3">
							quelle
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/quels.mp3">
							quels
						</AudioClip>
						{" "}and{" "}
						<AudioClip className="link" soundFile="audio/lo7/grammar/quelles.mp3">
							quelles
						</AudioClip>
						{" "}are known as interrogative adjectives and they mean &apos;which&apos;
						or &apos;what&apos;. They work like adjectives, and agree with the noun
						that follows, hence the four forms.
					</p>
					<ul>
						<li>
							<AudioClip className="link" soundFile="audio/lo7/grammar/quel.mp3">
								Quel
							</AudioClip>
							{" "}is used for a masculine singular noun e.g.{" "}
							<AudioClip className="link" soundFile="audio/lo7/dialogues/quel-est-ton-pays-prefere.mp3">
								Quel est ton pays préféré ?
							</AudioClip>
							{" "}Which is your favourite country?
						</li>
						<li>
							<AudioClip className="link" soundFile="audio/lo7/grammar/quelle.mp3">
								Quelle
							</AudioClip>
							{" "}is used for a feminine singular noun e.g.{" "}
							<AudioClip className="link" soundFile="audio/lo7/dialogues/quelle-est-ta-couleur-preferee.mp3">
								Quelle est ta couleur préférée ?
							</AudioClip>
							{" "}Which is your favourite colour?
						</li>
						<li>
							<AudioClip className="link" soundFile="audio/lo7/grammar/quels.mp3">
								Quels
							</AudioClip>
							{" "}is used for masculine plural noun e.g.{" "}
							<AudioClip className="link" soundFile="audio/lo7/grammar/quels-sont-tes-passe-temps-preferes.mp3">
								Quels sont tes passe-temps préférés ?
							</AudioClip>
							{" "}Which are your favourite pastimes?
						</li>
						<li>
							<AudioClip className="link" soundFile="audio/lo7/grammar/quelles.mp3">
								Quelles
							</AudioClip>
							{" "}is used for feminine plural nouns e.g.{" "}
							<AudioClip className="link" soundFile="audio/lo7/grammar/quelles-langues-parlez-vous.mp3">
								Quelles langues parlez-vous ?
							</AudioClip>
							{" "}Which languages do you speak?
						</li>
					</ul>
				</div>
			</div>
		);
	};
}
