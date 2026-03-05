import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class LO5Demystify extends PureComponent{
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p><strong>How to pronounce:</strong></p>
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

