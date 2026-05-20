import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class CurrentLocationPronunciationNasalInAin extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<p>Another nasal vowel sound in French: <AudioClip className={`super-compact`} soundFile={`/audio/lo4/pronunciation/demystify/001-ain.mp3`}/> (<strong>in / ain</strong>). This is how the letters <strong>-in-</strong> are pronounced <strong>when they end a word or occur before a consonant</strong>.</p>
				<p>The tongue and the mouth all have work to do in its production whilst air passes through nose and mouth. Listen to these examples:</p>
				<div className={`mb-0 ml-2 space-y-1`}>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/002-singapour.mp3`}>S<strong>in</strong>gapour</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/003-inde.mp3`}><strong>In</strong>de</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/004-indien.mp3`}><strong>in</strong>dien</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/005-finlande.mp3`}>F<strong>in</strong>lande</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/006-jardin.mp3`}>jard<strong>in</strong></AudioClip></div>
				</div>
			</div>
		);
	};
}

export class CurrentLocationPronunciationRelatedSpellings extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<Info variant="warning">
					<h4 className="m-0 mb-1 text-[var(--font-size-base)] font-semibold"><strong>NB</strong> This is a useful sound to practise as the following are also pronounced in the same way when they end a word or occur before a consonant:</h4>
					<div><strong>ain</strong>, <strong>aim</strong>, <strong>ein</strong>, <strong>im</strong>, <strong>ym</strong>, <strong>yn</strong>, <strong>eim</strong>.</div>
				</Info>
				<div className={`mb-0 ml-2 space-y-1`}>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/007-marocain.mp3`}>maroc<strong>ain</strong></AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/008-faim.mp3`}>f<strong>aim</strong></AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/009-peinture.mp3`}>p<strong>ein</strong>ture</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/010-impossible.mp3`}><strong>im</strong>possible</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/011-symbole.mp3`}>s<strong>ym</strong>bole</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/012-lynx.mp3`}>l<strong>yn</strong>x</AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/013-reims.mp3`}>R<strong>eim</strong>s</AudioClip></div>
				</div>
			</div>
		);
	};
}

export class CurrentLocationPronunciationFinalEnEns extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<p>When the letters <strong>en</strong> or <strong>ens</strong> end a word, this is also pronounced (ain). Listen to these examples:</p>
				<div className={`mb-0 ml-2 space-y-1`}>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/014-australien.mp3`}>australi<strong>en</strong></AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/015-europ-eeneurop-en.mp3`}>europé<strong>en</strong></AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/016-ghan-eensghan-ens.mp3`}>ghané<strong>ens</strong></AudioClip></div>
					<div><AudioClip className={`link`} soundFile={`/audio/lo4/pronunciation/demystify/017-indiens.mp3`}>indi<strong>ens</strong></AudioClip></div>
				</div>
			</div>
		);
	};
}
