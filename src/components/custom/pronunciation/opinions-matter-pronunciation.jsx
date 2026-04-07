import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class OpinionsMatterPronunciationBorrowedWords extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo7-pronunciation1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						Words that are borrowed from another language tend to retain much of the
						pronunciation of their language of origin. Here are some examples:
					</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-cricket.mp3">
								le cricket
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-tennis.mp3">
								le tennis
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-foot.mp3">
								le foot
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-shopping.mp3">
								le shopping
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-bowling.mp3">
								le bowling
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-week-end.mp3">
								le week-end
							</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export class OpinionsMatterPronunciationFinalConsonants extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo7-pronunciation2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel pronunciation-panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>Listen again to these examples:</p>
					<div className="mb-0 ml-2 space-y-1">
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-cricket.mp3">
								le cricke<strong>t</strong>
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-foot.mp3">
								le foo<strong>t</strong>
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-shopping.mp3">
								le shoppin<strong>g</strong>
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-bowling.mp3">
								le bowlin<strong>g</strong>
							</AudioClip>
						</div>
						<div>
							<AudioClip className="link" soundFile="audio/lo7/pronunciation/le-week-end.mp3">
								le week-en<strong>d</strong>
							</AudioClip>
						</div>
					</div>
					<div className="mt-4">
						<Info variant="warning">
						<p>
							<strong>NB</strong> Despite what you may have learnt previously, the
							final consonant is sounded here.
						</p>
						</Info>
					</div>
				</div>
			</div>
		);
	};
}
