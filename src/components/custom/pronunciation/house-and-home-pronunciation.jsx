import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class HouseAndHomePronunciationNasalAn extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div className={`lo5-demystify1-container container`} id={id || undefined}>
				<div className={`panel pronunciation-panel`} id={id ? `${id}Panel1` : undefined}>
					<h3>1. Nasal sound: an</h3>
					<div className={`pronunciation-content`}>
						<div className={`pronunciation-text`}>
							<h4 className="pronunciation-sub-label">How to pronounce:</h4>
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
								<strong>en</strong>, and <strong>em</strong> are often pronounced. Listen to these examples and repeat them aloud:
							</p>
							<div className={`mb-0 ml-2 space-y-1`}>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/002-blanc.mp3`}>blanc</AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/003-chambre.mp3`}>chambre</AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/004-dans.mp3`}>dans</AudioClip></div>
							</div>
						</div>
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
			<div className={`lo5-demystify2-container container`} id={id || undefined}>
				<div className={`panel pronunciation-panel`} id={id ? `${id}Panel2` : undefined}>
					<h3>2. Related spellings</h3>
					<div className={`pronunciation-content`}>
						<div className={`pronunciation-text`}>
							{/* <p>→<div>: short label triggers WAVE "possible heading" */}
							<div>Here are more words to practise with the same sound:</div>
							<div className={`mb-0 ml-2 space-y-1`}>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/005-enfant.mp3`}>enfant</AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/006-ensemble.mp3`}>ensemble</AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo5/pronunciation/demystify/007-centre.mp3`}>centre</AudioClip></div>
							</div>
							<div className="mt-3">
								<Info variant="warning">
									{/* h4→p: heading inside an Info box is redundant; the box
									    already provides the "note" context */}
									<p>
										<strong>NB</strong> The same nasal sound can appear in several spellings,
										including <strong>an</strong>, <strong>am</strong>, <strong>en</strong>, and{" "}
										<strong>em</strong>.
									</p>
								</Info>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
