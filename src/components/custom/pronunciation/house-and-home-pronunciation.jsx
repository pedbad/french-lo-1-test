import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class HouseAndHomePronunciationNasalAn extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-pronunciation1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p><strong>How to pronounce:</strong></p>
					<p>
						The third of the nasal vowels is{" "}
						<AudioClip
							className={`link`}
							inline={true}
							soundFile={`audio/lo5/pronunciation/demystify/001-an.mp3`}
						>
							<strong>an</strong>
						</AudioClip>
						, which is how the letters <strong>an</strong>, <strong>am</strong>,{" "}
						<strong>en</strong>, and <strong>em</strong> are often pronounced.
					</p>
					<p>Listen to these examples and repeat them aloud:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/002-blanc.mp3`}>blanc</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/003-chambre.mp3`}>chambre</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/004-dans.mp3`}>dans</AudioClip></div>
					</div>
				</div>
			</div>
		);
	};
}

export class HouseAndHomePronunciationRelatedSpellings extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-pronunciation2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>Here are more words to practise with the same sound:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/005-enfant.mp3`}>enfant</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/006-ensemble.mp3`}>ensemble</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/007-centre.mp3`}>centre</AudioClip></div>
					</div>
					<Info variant="warning">
						<p>
							<strong>NB</strong> The same nasal sound can appear in several spellings,
							including <strong>an</strong>, <strong>am</strong>, <strong>en</strong>, and{" "}
							<strong>em</strong>.
						</p>
					</Info>
				</div>
			</div>
		);
	};
}
