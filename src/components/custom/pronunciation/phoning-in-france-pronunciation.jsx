import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class LO9Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo9-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p><strong>How to pronounce: 5, 6, 7, 8, 9, 10</strong></p>
					<p>You would not expect to pronounce the final consonant of these words, but they are exceptions and are pronounced as followed: <AudioClip className={`link`} soundFile={`sounds/fr/cinq.mp3`} >cinq</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/six.mp3`} >six</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/sept.mp3`} >sept</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/huit.mp3`} >huit</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/neuf.mp3`} >neuf</AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/dix.mp3`} >dix</AudioClip>.</p>
					<p>However, <strong>NB</strong>, when&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six.mp3`}><strong>six</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit.mp3`}><strong>huit</strong></AudioClip> or&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix.mp3`}><strong>dix</strong></AudioClip> are followed by a word starting with a consonant,
						the final consonant of the number is <strong>not</strong> pronounced.</p>
					<p>e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six villages.mp3`}><strong>six villages</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit villes.mp3`}><strong>huit villes</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix pays.mp3`}><strong>dix pays</strong></AudioClip></p>
					<p>The last consonant of the number is pronounced as might be anticipated if the word following the number begins with a vowel.</p>
					<p>e.g.&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/six enfants.mp3`}><strong>six enfants</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/huit étudiants.mp3`}><strong>huit étudiants</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/dix élèves.mp3`}><strong>dix élèves</strong></AudioClip>
					</p>
				</div>
			</div>
		);
	};
}

