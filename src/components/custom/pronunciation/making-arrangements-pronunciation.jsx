import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class MakingArrangementsPronunciation extends PureComponent {
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
					<p><strong>How to pronounce</strong>: <strong>ui</strong></p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/aujourd'hui.mp3`}><strong>aujourd'hui</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/bruit.mp3`}><strong>bruit</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/ensuite.mp3`}><strong>ensuite</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/gratuit.mp3`}><strong>gratuit</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/minuit.mp3`}><strong>minuit</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nuit.mp3`}><strong>nuit</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/puis.mp3`}><strong>puis</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/suis.mp3`}><strong>suis</strong></AudioClip></p>
				</div>
			</div>
		);
	};
}

