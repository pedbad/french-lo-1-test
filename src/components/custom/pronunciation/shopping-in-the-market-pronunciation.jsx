import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class L12Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo12-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p>How to pronounce: <AudioClip className={`link`} soundFile={`sounds/fr/u.mp3`}><strong>u</strong></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/ou.mp3`}><strong>ou</strong></AudioClip></p>
					<p>To the untrained ear these sounds may not sound very different, but it is worthwhile practising them as on occasions the
						wrong pronunciation could lead to confusion.</p>
					<p>Here are some examples. Listen to each pair. You should hear that they sound different</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/tout.mp3`}><strong>tout</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/tu.mp3`}><strong>tu</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><strong>nous</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/nu.mp3`}><strong>nu (naked)</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/pour.mp3`}><strong>pour</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/pur.mp3`}><strong>pur (pure)</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><strong>du</strong></AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/doux.mp3`}><strong>doux (gentle/sweet)</strong></AudioClip></p>

				</div>
			</div>
		);
	};
}

