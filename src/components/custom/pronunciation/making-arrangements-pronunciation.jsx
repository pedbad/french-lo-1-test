import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class MakingArrangementsPronunciationUiSound extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo10-pronunciation1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						In words like <strong>aujourd&apos;hui</strong> and <strong>bruit</strong>,
						the letters <strong>ui</strong> combine into one distinctive French sound.
					</p>
					<p>Listen and repeat these examples:</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo10/pronunciation/ui-sound/001-aujourdhui.mp3"
							>
								aujourd&apos;hui
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/002-bruit.mp3">
								bruit
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/003-ensuite.mp3">
								ensuite
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/004-gratuit.mp3">
								gratuit
							</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export class MakingArrangementsPronunciationMoreUiWords extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo10-pronunciation2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>Practise the same sound in a few more useful words:</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/005-minuit.mp3">
								minuit
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/006-nuit.mp3">
								nuit
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/007-puis.mp3">
								puis
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo10/pronunciation/ui-sound/008-suis.mp3">
								suis
							</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
