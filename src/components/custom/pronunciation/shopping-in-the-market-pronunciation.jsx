import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class ShoppingInTheMarketPronunciation extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo12-demystify-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<h3>
						How to pronounce:{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/015-u.mp3">
							<strong>u</strong>
						</AudioClip>{" "}
						and{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/016-ou.mp3">
							<strong>ou</strong>
						</AudioClip>
					</h3>
					<p>
						To the untrained ear these sounds may not sound very different, but it is
						worthwhile practising them as on occasions the wrong pronunciation could lead
						to confusion.
					</p>
					<p>
						Here are some examples. Listen to each pair. You should hear that they sound
						different
					</p>
					<p>
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/007-tout.mp3">
							<strong>tout</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/001-tu.mp3">
							<strong>tu</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/008-nous.mp3">
							<strong>nous</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/009-nu.mp3">
							<strong>nu (naked)</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/011-pour.mp3">
							<strong>pour</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/004-pur.mp3">
							<strong>pur (pure)</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/grammar/018-du.mp3">
							<strong>du</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo12/pronunciation/012-doux.mp3">
							<strong>doux (gentle/sweet)</strong>
						</AudioClip>
					</p>
				</div>
			</div>
		);
	};
}
