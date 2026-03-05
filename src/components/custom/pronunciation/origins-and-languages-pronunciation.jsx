import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";
import { resolveAsset } from "@/utils/assets";

export class LO3Pronunciation1 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-pronunciation1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<h3>1. Silent <em>-ent</em> endings</h3>
					<p>The third person verb ending <strong>ent</strong> is never pronounced. For example:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/shared/026-ils-parlent.mp3`}>Ils parl<strong>ent</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/012-elles-chantent.mp3`}>elles chant<strong>ent</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/025-ils-dansent.mp3`}>ils dans<strong>ent</strong></AudioClip></div>
					</div>
				</div>
			</div>
		);
	};
}

export class LO3Pronunciation2 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-pronunciation2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<h3>2. Final consonants and liaison</h3>
					<p>Usually, the consonants <strong>d</strong>, <strong>g</strong>, <strong>p</strong>, <strong>s</strong>, <strong>t</strong>, <strong>x</strong>, <strong>z</strong> are silent when they are the last letter of the word. However, these are sounded when the next word begins with a vowel or mute <strong>h</strong>. This is known as making a liaison.</p>
					<p>Compare these:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div>
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/049-les-professeurs.mp3`}>les professeurs</AudioClip> /{' '}
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/048-les-etudiants.mp3`}>le<strong>s é</strong>tudiants</AudioClip>
						</div>
						<div>
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/022-il-est-francais.mp3`}>il est français</AudioClip> /{' '}
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/021-il-est-anglais.mp3`}>il es<strong>t a</strong>nglais</AudioClip>
						</div>
						<div>
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/062-un-grand-poete.mp3`}>un grand poète</AudioClip> /{' '}
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/061-un-grand-homme.mp3`}>un gran<strong>d ho</strong>mme</AudioClip>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export class LO3Pronunciation3 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-pronunciation3-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel pronunciation-panel`}
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<h3>3. The sound "eh"</h3>
					<p>Listen to the following:</p>
					<div className={`mb-0 ml-2 space-y-1`}>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/shared/064-vous-parlez.mp3`}>vous parl<strong>ez</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/020-il-est-americain.mp3`}>il <strong>est</strong> am<strong>é</strong>ricain</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/016-et.mp3`}><strong>et</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/034-je-suis-ghaneenne.mp3`}>je suis ghan<strong>é</strong>enne</AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/009-elle-est-mariee.mp3`}>elle <strong>est</strong> mari<strong>ée</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/054-nous-sommes-fiances.mp3`}>nous sommes fianc<strong>és</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/014-elles-sont-fatiguees.mp3`}>elles sont fatigu<strong>ées</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/008-ecouter.mp3`}><strong>é</strong>cout<strong>er</strong></AudioClip></div>
						<div><AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/057-regarder.mp3`}>regard<strong>er</strong></AudioClip></div>
					</div>
					<p>You will notice that <strong>-et</strong>, <strong>-ez</strong>, <strong>é</strong>, <strong>-ée</strong>, <strong>-és</strong>, <strong>-ées</strong> and also <strong>-er</strong> as an infinitive ending are all pronounced the same, as are the words <strong>est</strong> and <strong>es</strong>.</p>
				</div>
			</div>
		);
	};
}

export class LO3Demystify extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-demystify-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p><strong>To sound or not to sound?</strong><img
						src={resolveAsset('/images/shh.jpg')}
						style={{
							border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
							float: 'right',
							marginLeft: '20px',
							verticalAlign: 'top'
						}}
						alt={`lady with finger to lips. Shh`}
						title={`lady with finger to lips. Shh`} /></p>
					<ol>
						<li><p>The third person verb ending <strong>ent</strong> is never pronounced. e.g.
							<AudioClip className={`link`} soundFile={`audio/lo3/shared/026-ils-parlent.mp3`}>Ils parl<strong>ent</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/012-elles-chantent.mp3`}>elles chant<strong>ent</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/025-ils-dansent.mp3`}>ils dans<strong>ent</strong></AudioClip>. </p>
						</li>
						<li>
							<p>Usually, the consonants <strong>d</strong>, <strong>g</strong>, <strong>p</strong>, <strong>s</strong>, <strong>t</strong>, <strong>x</strong>, <strong>z</strong> are silent when they are the last letter of the word.
								However, these are sounded when the next word begins with a vowel or mute h. This is known as making a liaison. </p>
							<p>Compare these:&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/049-les-professeurs.mp3`}>les professeurs</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/048-les-etudiants.mp3`}>le<strong>s é</strong>tudiants</AudioClip> –&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/022-il-est-francais.mp3`}>il est français</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/021-il-est-anglais.mp3`}>il es<strong>t a</strong>nglais</AudioClip> -&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/062-un-grand-poete.mp3`}>un grand poète</AudioClip> /&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/061-un-grand-homme.mp3`}>un gran<strong>d ho</strong>mme</AudioClip></p>
						</li>
						<li>
							<p>The sound : <strong>'eh'</strong></p>
							<p>Listen to the following:
								<AudioClip className={`link`} soundFile={`audio/lo3/shared/064-vous-parlez.mp3`}>vous parl<strong>ez</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/020-il-est-americain.mp3`}>il <strong>est</strong> am<strong>é</strong>ricain</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/016-et.mp3`}><strong>et</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/034-je-suis-ghaneenne.mp3`}>je suis ghan<strong>é</strong>enne</AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/009-elle-est-mariee.mp3`}>elle <strong>est</strong> mari<strong>ée</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/054-nous-sommes-fiances.mp3`}>nous sommes fianc<strong>és</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/014-elles-sont-fatiguees.mp3`}>elles sont fatigu<strong>ées</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/008-ecouter.mp3`}><strong>é</strong>cout<strong>er</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo3/pronunciation/demystify/057-regarder.mp3`}>regard<strong>er</strong></AudioClip></p>
							<p>You will notice that&nbsp;
								<strong>-et</strong>, <strong>-ez</strong>, <strong>é</strong>, <strong>-ée</strong>, <strong>-és</strong>, <strong>-ées</strong> and also <strong>-er</strong> as an infinitive ending are
							all pronounced the same, as are the words <strong>est</strong> and <strong>es</strong>.
							</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

