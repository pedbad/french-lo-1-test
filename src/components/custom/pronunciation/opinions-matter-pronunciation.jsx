import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class OpinionsMatterPronunciation extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo7-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p>Words that are borrowed from another language tend to retain much of the pronunciation of their language of origin. Here are some examples:</p>
					<p>
						<AudioClip className={`link`} soundFile={`sounds/fr/le cricket.mp3`}>le cricket</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le tennis (f).mp3`}>le tennis</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le foot.mp3`}>le foot</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le shopping.mp3`}>le shopping</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le bowling.mp3`}>le bowling</AudioClip>,&nbsp;
						<AudioClip className={`link`} soundFile={`sounds/fr/le week-end.mp3`}>le week-end</AudioClip></p>
					<p>(despite what you will have learnt previously, the final consonant is sounded here)</p>
				</div>
			</div>
		);
	};
}

