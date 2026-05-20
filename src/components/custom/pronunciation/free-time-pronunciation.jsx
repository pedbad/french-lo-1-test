import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class FreeTimePronunciationTionSound extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>1. The French -tion sound</h3>
				<p>
					In many French words ending in <strong>-tion</strong>, the <strong>t</strong>
					{" "}is pronounced more like an <strong>s</strong> sound. Listen to these examples:
				</p>
				<div className="mb-0 ml-2 space-y-1">
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/001-laction.mp3"
						>
							l&apos;action
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/002-lattention.mp3"
						>
							l&apos;attention
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/003-lequitation.mp3"
						>
							l&apos;équitation
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/004-lexposition.mp3"
						>
							l&apos;exposition
						</AudioClip>
					</div>
				</div>
			</div>
		);
	};
}

export class FreeTimePronunciationMoreTionWords extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>2. More words with -tion</h3>
				<p>Here are a few more familiar words with the same sound to practise:</p>
				<div className="mb-0 ml-2 space-y-1">
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/005-la-natation.mp3"
						>
							la natation
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/006-la-nation.mp3"
						>
							la nation
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/007-la-nationalite.mp3"
						>
							la nationalité
						</AudioClip>
					</div>
					<div>
						<AudioClip
							className="link"
							soundFile="audio/lo8/pronunciation/tion-sound/008-la-situation.mp3"
						>
							la situation
						</AudioClip>
					</div>
				</div>
			</div>
		);
	};
}
