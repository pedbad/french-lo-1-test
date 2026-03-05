import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class LO6Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p><strong>How to pronounce double l in French:</strong></p>
					<p><strong>Double l</strong> is sometimes mispronounced by learners of French, but the following rules should help to avoid this problem.</p>
					<p>1 after the vowels <strong>a, e, o</strong> and <strong>u</strong>, <AudioClip className={`link`} soundFile={`sounds/fr/ll-a.mp3`}><strong>double l</strong></AudioClip> is pronounced <strong>l</strong>. e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une balle.mp3`}><strong>une balle</strong></AudioClip> (a ball),&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Elle est belle.mp3`}><strong>Elle est belle</strong></AudioClip>. (She is beautiful.)&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/Elle est folle.mp3`}><strong>Elle est folle</strong></AudioClip>. (She is crazy.)&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une bulle.mp3`}><strong>une bulle</strong></AudioClip> (a bubble).&nbsp;
							There are no exceptions here!</p>
					<p>2i after the vowel <strong>i</strong>,&nbsp;<AudioClip className={`link`} soundFile={`sounds/fr/ll-b.mp3`}><strong>double l</strong></AudioClip> is pronounced as though it were a letter <strong>"y"</strong> in English. e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une fille.mp3`}><strong>une fille</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/une famille.mp3`}><strong>une famille</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/un billet.mp3`}><strong>un billet</strong></AudioClip> (a ticket)</p>
					<p>2ii if the vowel <strong>i</strong> is preceded by another vowel, the same rule applies and <AudioClip className={`link`} soundFile={`sounds/fr/ll-b.mp3`}><strong>double l</strong></AudioClip> is pronounced as though it were
						a letter <strong>"y"</strong> in English. e.g. <AudioClip className={`link`} soundFile={`sounds/fr/une bouteille.mp3`}><strong>une bouteille</strong></AudioClip> (a bottle),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/une feuille.mp3`}><strong>une feuille</strong></AudioClip> (a leaf).</p>
					<p><strong className="ped-neg">NB</strong> There are a few exceptions when <AudioClip className={`link`} soundFile={`sounds/fr/ll-a.mp3`}><strong>double l</strong></AudioClip> follows <strong>i</strong>.
						The most common are : <AudioClip className={`link`} soundFile={`sounds/fr/la ville.mp3`}><strong>la ville</strong></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/le village.mp3`}><strong>le village</strong></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/la villa.mp3`}><strong>la villa</strong></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mille.mp3`}><strong>mille</strong></AudioClip> (a thousand),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/un million.mp3`}><strong>un million</strong></AudioClip> (a million),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/un milliard.mp3`}><strong>un milliard</strong></AudioClip> (a billion),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/tranquille.mp3`}><strong>tranquille</strong></AudioClip> (quiet),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Lille.mp3`}><strong>Lille</strong></AudioClip>,&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/Gilles.mp3`}><strong>Gilles</strong></AudioClip>.
						The best thing to do is to learn these off by heart.</p>
				</div>
			</div>
		);
	};
}

