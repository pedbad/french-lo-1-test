import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { PureComponent } from "react";

export class AboutMePronunciationSilentE extends PureComponent {
	render = () => {
		const { id } = this.props;
		const silentExamples = [
			{
				ending: `d`,
				label: <>gran<strong>d</strong></>,
				alt: `grand`,
				soundFile: `audio/lo2/pronunciation/demystify/005-grand.mp3`,
			},
			{
				ending: `d`,
				label: <>ron<strong>d</strong></>,
				alt: `rond`,
				soundFile: `audio/lo2/pronunciation/demystify/015-rond.mp3`,
			},
			{
				ending: `g`,
				label: <>lon<strong>g</strong></>,
				alt: `long`,
				soundFile: `audio/lo2/pronunciation/demystify/009-long.mp3`,
			},
			{
				ending: `p`,
				label: <>tro<strong>p</strong></>,
				alt: `trop`,
				soundFile: `audio/lo2/pronunciation/demystify/022-trop.mp3`,
			},
			{
				ending: `s`,
				label: <>depui<strong>s</strong></>,
				alt: `depuis`,
				soundFile: `audio/lo2/vocabulary/007-depuis.mp3`,
			},
			{
				ending: `s`,
				label: <>pa<strong>s</strong></>,
				alt: `pas`,
				soundFile: `audio/lo2/pronunciation/demystify/013-pas.mp3`,
			},
			{
				ending: `t`,
				label: <>peti<strong>t</strong></>,
				alt: `petit`,
				soundFile: `audio/lo2/pronunciation/demystify/014-petit.mp3`,
			},
			{
				ending: `t`,
				label: <>salu<strong>t</strong></>,
				alt: `salut`,
				soundFile: `audio/lo2/pronunciation/demystify/016-salut.mp3`,
			},
			{
				ending: `x`,
				label: <>gâteau<strong>x</strong></>,
				alt: `gâteaux`,
				soundFile: `audio/lo2/pronunciation/demystify/004-gateaux.mp3`,
			},
			{
				ending: `z`,
				label: <>appele<strong>z</strong></>,
				alt: `appelez`,
				soundFile: `audio/lo2/pronunciation/demystify/001-appelez.mp3`,
			},
		];
		const endingOrder = [`d`, `g`, `p`, `s`, `t`, `x`, `z`];
		const groupedByEnding = endingOrder
			.map((ending) => ({
				ending,
				items: silentExamples.filter((item) => item.ending === ending),
			}))
			.filter((group) => group.items.length > 0);
		return (
			<div className={`lo2-demystify1-container container`} id={id || undefined}>
				<div className={`panel pronunciation-panel`} id={id ? `${id}Panel1` : undefined}>
					{/* Tab 1 covers silent letters as a category — no single word represents
					    the topic, so the h3 stays as plain text (deliberate deviation from
					    LO1's AudioClip-in-h3 pattern; documented per LO1 reference standard). */}
					<h3>1. Silent letters at the end of a word</h3>
					<div className={`pronunciation-content`}>
						<div className={`pronunciation-text`}>
							<p>The consonants <strong>d</strong>, <strong>g</strong>, <strong>p</strong>, <strong>s</strong>, <strong>t</strong>, <strong>x</strong>, <strong>z</strong> are silent when they are the last letter of the word.
								Listen to the following examples.</p>
							<div className={`grid grid-cols-2 gap-2 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-7 min-[1200px]:mb-5`}>
								{groupedByEnding.map((group) => (
									<div className={`flex flex-col gap-1.5 rounded-lg border border-border bg-muted/40 p-2.5`} key={`ending-${group.ending}`}>
										<h4 className={`m-0 pb-1.5 border-b border-border text-xl font-bold text-foreground leading-none`}>
											{group.ending}
										</h4>
										<div className={`space-y-1`}>
											{group.items.map((item) => (
												<div key={item.soundFile}>
													<AudioClip className={`link`} soundFile={item.soundFile} alt={item.alt}>{item.label}</AudioClip>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
							<p>The letter <strong>e</strong> is not pronounced at the end of a word:</p>
							<div className={`mb-3 ml-2 space-y-1 min-[1200px]:mb-5`}>
								<div><AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3`} alt={`Je m'appelle`}>Je m'appell<strong>e</strong></AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo2/vocabulary/004-bibliothecaire.mp3`} alt={`bibliothécaire`}>bibliothécair<strong>e</strong></AudioClip></div>
								<div><AudioClip className={`link`} soundFile={`audio/lo2/vocabulary/005-celibataire.mp3`} alt={`célibataire`}>célibatair<strong>e</strong></AudioClip></div>
							</div>
							<Info variant="warning">
								{/* p→div: <p><strong>NB</strong>...</p> ending with colon triggers WAVE "possible heading" */}
							<div style={{ fontSize: "var(--font-size-base)" }}><strong>NB</strong> 2-letter words ending in <strong>e</strong> are exceptions:</div>
								<div>
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/002-ce.mp3`}>ce</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/003-de.mp3`}>de</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/008-je.mp3`}>je</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/015-le.mp3`}>le</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/011-me.mp3`}>me</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/012-ne.mp3`}>ne</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/017-se.mp3`}>se</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/018-te.mp3`}>te</AudioClip>
								</div>
							</Info>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

export class AboutMePronunciationFrenchTh extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div className={`lo2-demystify2-container container`} id={id || undefined}>
				<div className={`panel pronunciation-panel`} id={id ? `${id}Panel2` : undefined}>
					<h3>2. The French &quot;<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/019-the.mp3`}>th</AudioClip>&quot;</h3>
					<div className={`pronunciation-content`}>
						<div className={`pronunciation-text`}>
							<p>In French the letters <strong>th</strong> are pronounced <strong>t</strong>. e.g.
								<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/021-thomas.mp3`} alt={`Thomas`}><strong>Thomas</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/019-the.mp3`} alt={`thé`}><strong>thé</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/020-theologie.mp3`} alt={`théologie`}><strong>théologie</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`audio/lo2/pronunciation/demystify/010-maths.mp3`} alt={`maths`}><strong>maths</strong></AudioClip></p>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
