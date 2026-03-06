import { AudioClip } from "@/components/AudioClip";
import { Figure } from "@/components/Figure";
import { PureComponent } from "react";

export class FreeTimePronunciation extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo8-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p>How to pronounce: <strong>–tion</strong> in French. In this combination the letter t is pronounced as if it were an s.
Here are some examples of words containing or ending <strong>–tion</strong>. </p>
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
