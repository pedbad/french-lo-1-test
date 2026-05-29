import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class OpinionsMatterGrammarBorrowedNouns extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>1. Borrowed nouns and gender</h3>
				<p>
					French like all languages borrows words from other languages. In the greater
					majority of cases, borrowed nouns are masculine. e.g.
				</p>
				<div className="mb-0 ml-2 space-y-1">
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/006-le-cricket.mp3">
							<strong>le cricket</strong>
						</AudioClip>
					</div>
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/007-le-judo.mp3">
							<strong>le judo</strong>
						</AudioClip>
					</div>
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/008-le-shopping.mp3">
							<strong>le shopping</strong>
						</AudioClip>
					</div>
				</div>
				<p>Almost all ball sports are borrowed words, and these are all masculine.
				</p>
			</div>
		);
	};
}

export class OpinionsMatterGrammarLikesAndInfinitives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>2. Likes, dislikes, articles, and infinitives</h3>
				<p>
					Word for word translation often works very well, but sometimes being aware
					of some seemingly small differences is essential. e.g. In English, we say,
					&apos;I like football&apos; or &apos;I don&apos;t like swimming&apos;.
					In French, we say:
				</p>
				<div className="mb-3 ml-2 space-y-1">
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/002-j-aime-le-football.mp3">
							J&apos;aime <em>le</em> football
						</AudioClip>
					</div>
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/004-je-n-aime-pas-la-natation.mp3">
							Je n&apos;aime pas <em>la</em> natation
						</AudioClip>
					</div>
				</div>
				<p>
					i.e. in French, a definite article (le, la, l&apos;, les) is required.
				</p>
				<p>
					To say what you like/ dislike doing you use{" "}
					<AudioClip className="link" soundFile="audio/lo7/grammar/003-j-aime.mp3">
						J&apos;aime
					</AudioClip>
					{" "}plus an infinitive. e.g.
				</p>
				<div className="mb-0 ml-2 space-y-1">
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/001-j-aime-danser.mp3">
							J&apos;aime danser
						</AudioClip>
						{" "}: I like to dance / I like dancing
					</div>
					<div>
						<AudioClip className="link" soundFile="audio/lo7/grammar/005-je-n-aime-pas-regarder-la-television.mp3">
							Je n&apos;aime pas regarder la télévision
						</AudioClip>
						{" "}: I don&apos;t like to watch the television / I don&apos;t like watching
						the television
					</div>
				</div>
			</div>
		);
	};
}

export class OpinionsMatterGrammarInterrogatives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>3. Quel, quelle, quels, quelles</h3>
				<p>
					<AudioClip className="link" soundFile="audio/lo7/grammar/009-quel.mp3">
						Quel
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo7/grammar/010-quelle.mp3">
						quelle
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo7/grammar/014-quels.mp3">
						quels
					</AudioClip>
					{" "}and{" "}
					<AudioClip className="link" soundFile="audio/lo7/grammar/012-quelles.mp3">
						quelles
					</AudioClip>
					{" "}are known as interrogative adjectives and they mean &apos;which&apos;
					or &apos;what&apos;. They work like adjectives, and agree with the noun
					that follows, hence the four forms.
				</p>
				<ul className="list-none space-y-2 pl-0">
					<li>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/grammar/009-quel.mp3">
								Quel
							</AudioClip>
							{" "}is used for a masculine singular noun e.g.
						</div>
						<div className="ml-4">
							<AudioClip className="link" soundFile="audio/lo7/dialogues/010-quel-est-ton-pays-prefere.mp3">
								Quel est ton pays préféré ?
							</AudioClip>
							{" "}Which is your favourite country?
						</div>
					</li>
					<li>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/grammar/010-quelle.mp3">
								Quelle
							</AudioClip>
							{" "}is used for a feminine singular noun e.g.
						</div>
						<div className="ml-4">
							<AudioClip className="link" soundFile="audio/lo7/dialogues/011-quelle-est-ta-couleur-preferee.mp3">
								Quelle est ta couleur préférée ?
							</AudioClip>
							{" "}Which is your favourite colour?
						</div>
					</li>
					<li>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/grammar/014-quels.mp3">
								Quels
							</AudioClip>
							{" "}is used for masculine plural noun e.g.
						</div>
						<div className="ml-4">
							<AudioClip className="link" soundFile="audio/lo7/grammar/013-quels-sont-tes-passe-temps-preferes.mp3">
								Quels sont tes passe-temps préférés ?
							</AudioClip>
							{" "}Which are your favourite pastimes?
						</div>
					</li>
					<li>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/grammar/012-quelles.mp3">
								Quelles
							</AudioClip>
							{" "}is used for feminine plural nouns e.g.
						</div>
						<div className="ml-4">
							<AudioClip className="link" soundFile="audio/lo7/grammar/011-quelles-langues-parlez-vous.mp3">
								Quelles langues parlez-vous ?
							</AudioClip>
							{" "}Which languages do you speak?
						</div>
					</li>
				</ul>
			</div>
		);
	};
}
