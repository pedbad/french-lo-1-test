import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class FamilyFriendsAndNeighboursPronunciationDoubleLlAsL extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-pronunciation1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p><strong>How to pronounce double ll in French:</strong></p>
					<p>
						After the vowels <strong>a</strong>, <strong>e</strong>, <strong>o</strong>,
						and <strong>u</strong>,{" "}
						<AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/ll-a.mp3`}>
							<strong>double ll</strong>
						</AudioClip>
						{" "}is pronounced <strong>l</strong>.
					</p>
					<p>Listen to these examples:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-balle.mp3`}><strong>une balle</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/elle-est-belle.mp3`}><strong>Elle est belle</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/elle-est-folle.mp3`}><strong>Elle est folle</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-bulle.mp3`}><strong>une bulle</strong></AudioClip></div>
					</div>
					<p>There are no exceptions here.</p>
				</div>
			</div>
		);
	};
}

export class FamilyFriendsAndNeighboursPronunciationDoubleLlAsY extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-pronunciation2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						After the vowel <strong>i</strong>,{" "}
						<AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/ll-b.mp3`}>
							<strong>double ll</strong>
						</AudioClip>
						{" "}is pronounced like the English letter <strong>y</strong>.
					</p>
					<p>Listen to these examples:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-fille.mp3`}><strong>une fille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-famille.mp3`}><strong>une famille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/un-billet.mp3`}><strong>un billet</strong></AudioClip></div>
					</div>
					<p>
						If the vowel <strong>i</strong> is preceded by another vowel, the same rule
						applies:
					</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-bouteille.mp3`}><strong>une bouteille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/une-feuille.mp3`}><strong>une feuille</strong></AudioClip></div>
					</div>
				</div>
			</div>
		);
	};
}

export class FamilyFriendsAndNeighboursPronunciationExceptions extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-pronunciation3-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<p>There are a few exceptions when double <strong>ll</strong> follows <strong>i</strong>.</p>
					<p>Here are some common ones to practise:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/la-ville.mp3`}><strong>la ville</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/le-village.mp3`}><strong>le village</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/la-villa.mp3`}><strong>la villa</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/mille.mp3`}><strong>mille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/un-million.mp3`}><strong>un million</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/pronunciation/un-milliard.mp3`}><strong>un milliard</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/shared/tranquille.mp3`}><strong>tranquille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/shared/lille.mp3`}><strong>Lille</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo6/shared/gilles.mp3`}><strong>Gilles</strong></AudioClip></div>
					</div>
					<Info variant="warning">
						<p>
							<strong>NB</strong> The best thing to do is to learn these common exception
							words by heart.
						</p>
					</Info>
				</div>
			</div>
		);
	};
}
