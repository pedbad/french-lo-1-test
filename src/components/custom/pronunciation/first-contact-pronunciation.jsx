import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class FirstContactPronunciationNasalOnOm extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<>
				<Info>
					<p>In this part, you'll focus on mastering the French nasal sounds found in words like bonjour and bonsoir.
						You'll learn how airflow through your nose and mouth creates this unique sound in French.</p>
				</Info>
				<div
					className={`lo1-demystify1-container container`}
					id={id || undefined}
					key={`${id}CustomComponent`}
				>
					<div
						className={`panel pronunciation-panel`}
						id={id ? `${id}Panel` : undefined}
						key={`${id}Panel`}
					>
						<h3>1. Nasal vowel: "<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation1/001-on-om.mp3`}>on / om</AudioClip>"</h3>
						<div className={`pronunciation-content`}>
							<div className={`text pronunciation-text`}>
								<p>In French, <strong>on</strong> and <strong>om</strong> represent the same nasal vowel sound.
							In this first topic you will have encountered this sound in the words <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation1/002-bonjour.mp3`} >bonjour</AudioClip> and <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation1/003-bonsoir.mp3`} >bonsoir</AudioClip>.
							The sound is created as air comes through both nose and mouth. If you have a slight cold or pinch your nose you will be able to produce the sound without difficulty!</p>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
}

export class FirstContactPronunciationFrenchR extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<>
				<Info>
					<p>Here, you'll practise producing the French <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/001-r.mp3`} ><em>r</em></AudioClip>, which is formed at the back of the throat - quite different from the English r. You'll learn to feel the vibration when pronouncing it and recognise it in words like <em>bonjour</em>, <em>bonsoir</em>, and <em>au revoir</em>.</p>
				</Info>
				<div
					className={`lo1-demystify2-container container`}
					id={id || undefined}
					key={`${id}CustomComponent`}
				>
					<div
						className={`panel pronunciation-panel`}
						id={id ? `${id}Panel2` : undefined}
						key={`${id}Panel2`}
					>
						<h3>2. The French "<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/001-r.mp3`} >r</AudioClip>"</h3>
						<div className="pronunciation-content">
							<div className="pronunciation-text">
								<p>The letter <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/001-r.mp3`} ><strong>r</strong></AudioClip> in French can prove tricky to begin with, so it's worth practising it right way.
								It isn't the same sound as in English formed at the front of the mouth nor is it the rolled r of Spanish.
								It is formed in the throat. If you clear your throat first thing in the morning or when you are about to make an announcement,
								the French <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/001-r.mp3`} ><strong>r</strong></AudioClip> is made in that very place. If you place your fingers on your neck, you should feel a very slight vibration.
								You will have encountered this sound in the words <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/002-bonjour.mp3`} >bonjour</AudioClip>, <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/003-bonsoir.mp3`} >bonsoir</AudioClip>, <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation2/004-au-revoir.mp3`} >au revoir</AudioClip>.</p>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
}
export class FirstContactPronunciationOiSound extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<>
				<Info>
					<p>This section helps you hear and pronounce the French <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/001-oi.mp3`} ><em>oi</em></AudioClip> sound, as in words like <em>moi</em>, <em>toi</em>, and <em>bonsoir</em>. You'll notice it sounds like "wah" in English and appears in many common expressions.</p>
				</Info>
				<div
					className={`lo1-demystify3-container container`}
					id={id || undefined}
					key={`${id}CustomComponent`}
				>
					<div
						className={`panel pronunciation-panel`}
						id={id ? `${id}Panel3` : undefined}
						key={`${id}Panel3`}
					>
						<h3>3. The sound "<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/001-oi.mp3`} >oi</AudioClip>"</h3>
						<div className={`pronunciation-content`}>
							<div className={`text pronunciation-text`}>
								<p>You have probably already deduced that in French <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/001-oi.mp3`} ><strong>oi</strong></AudioClip> sounds like "wah" in English. Here are some examples:
									<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/002-moi.mp3`} >moi</AudioClip>,
									<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/003-toi.mp3`} >toi</AudioClip>,
									<AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation3/004-bonsoir.mp3`} >bonsoir</AudioClip>.</p>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
}
export class FirstContactPronunciationSilentH extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<>
				<Info>
					<p>Finally, you'll find out why the letter <em>h</em> is never pronounced in French. You'll see examples like <em>homme</em>, <em>horrible</em>, and <em>horizon</em>, where the <em>h</em> remains completely silent.</p>
				</Info>
				<div
					className={`lo1-demystify4-container container`}
					id={id || undefined}
					key={`${id}CustomComponent`}
				>
					<div
						className={`panel pronunciation-panel`}
						id={id ? `${id}Panel4` : undefined}
						key={`${id}Panel4`}
					>
						<h3>4. The silent "h"</h3>
						<div className={`pronunciation-content`}>
							<div className={`text pronunciation-text`}>
								<p>The letter <strong>h</strong> occurs in French words, but is never aspirated e.g. <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation4/001-homme.mp3`} >
									<strong>h</strong>omme</AudioClip>, <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation4/002-horrible.mp3`} >
									<strong>h</strong>orrible</AudioClip>, <AudioClip className={`link`} soundFile={`audio/lo1/pronunciation/pronunciation4/003-horizon.mp3`} >
									<strong>h</strong>orizon</AudioClip>.</p>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
}
