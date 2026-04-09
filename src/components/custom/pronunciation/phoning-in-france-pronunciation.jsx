import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class PhoningInFrancePronunciationNumbers extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo9-pronunciation1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						You might not expect to hear the final consonant in these number words,
						but they are important exceptions in French.
					</p>
					<p>Listen and repeat:</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/001-cinq.mp3"
							>
								cinq
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/002-six.mp3"
							>
								six
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/003-sept.mp3"
							>
								sept
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/004-huit.mp3"
							>
								huit
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/005-neuf.mp3"
							>
								neuf
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/numbers/006-dix.mp3"
							>
								dix
							</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export class PhoningInFrancePronunciationFinalConsonants extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo9-pronunciation2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						When <AudioClip className="link" soundFile="audio/lo9/pronunciation/numbers/002-six.mp3"><strong>six</strong></AudioClip>,
						{" "}<AudioClip className="link" soundFile="audio/lo9/pronunciation/numbers/004-huit.mp3"><strong>huit</strong></AudioClip>,
						{" "}or <AudioClip className="link" soundFile="audio/lo9/pronunciation/numbers/006-dix.mp3"><strong>dix</strong></AudioClip>
						{" "}are followed by a word starting with a consonant, the final consonant is
						not pronounced.
					</p>
					<p>For example:</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/001-six-villages.mp3"
							>
								six villages
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/002-huit-villes.mp3"
							>
								huit villes
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/003-dix-pays.mp3"
							>
								dix pays
							</AudioClip>
						</div>
					</div>
					<p>
						When the next word begins with a vowel, the final consonant is sounded
						more clearly.
					</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/004-six-enfants.mp3"
							>
								six enfants
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/005-huit-etudiants.mp3"
							>
								huit étudiants
							</AudioClip>
						</div>
						<div>
							<AudioClip
								className="link"
								soundFile="audio/lo9/pronunciation/final-consonants/006-dix-eleves.mp3"
							>
								dix élèves
							</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
