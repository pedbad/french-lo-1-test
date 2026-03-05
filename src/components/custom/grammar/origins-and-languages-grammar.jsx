import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PureComponent } from "react";

const isInteractiveTarget = (target) =>
	target instanceof Element &&
	Boolean(target.closest("button, a, input, select, textarea, label, [role='button']"));

const playAudioFromTableRow = (event) => {
	const target = event.target;
	if (isInteractiveTarget(target)) return;

	const row = target instanceof Element ? target.closest("tr") : null;
	if (!(row instanceof HTMLTableRowElement)) return;

	const audioTrigger = row.querySelector("button.audio-link, .audio-container");
	if (audioTrigger instanceof HTMLElement) {
		audioTrigger.click();
	}
};

export class LO3Grammar1 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-grammar1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p><strong>There are three groups of verbs in French.</strong> The biggest of these is called the <strong>-er</strong>{' '}group, simply because the infinitive ends with the letters&nbsp;
						<strong>-er</strong>.&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/056-parler.mp3`}>Parler</AudioClip> (to speak),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/019-habiter.mp3`}>habiter</AudioClip> (to live),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/004-chanter.mp3`}>chanter</AudioClip> (to sing),&nbsp;
						<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/007-danser.mp3`}>danser</AudioClip> (to dance) are examples of <strong>-er</strong> verbs.</p>
					<div className="mt-3">
						<Info
							variant="warning"
							informationTextHTML="<p><strong>NB</strong> There is only <strong>ONE present tense</strong> in French, so you translate <strong>je parle</strong> either as 'I speak' or 'I am speaking' depending on the context.</p>"
						/>
					</div>
					<div className="mt-3">
						<Table className="grammar-audio-table">
							<thead>
								<TableRow>
									<th>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/056-parler.mp3`}>parler</AudioClip></th>
									<th>to speak</th>
								</TableRow>
							</thead>
							<TableBody onClick={playAudioFromTableRow}>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/030-je-parle.mp3`}>je parle</AudioClip></TableCell>
									<TableCell>I speak / am speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/059-tu-parles.mp3`}>tu parles</AudioClip></TableCell>
									<TableCell>you speak / are speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/023-il-parle.mp3`}>il parle</AudioClip></TableCell>
									<TableCell>he / it speaks / is speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/010-elle-parle.mp3`}>elle parle</AudioClip></TableCell>
									<TableCell>she / it speaks / is speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/053-nous-parlons.mp3`}>nous parlons</AudioClip></TableCell>
									<TableCell>we speak / are speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/shared/064-vous-parlez.mp3`}>vous parlez</AudioClip></TableCell>
									<TableCell>you speak / are speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/shared/026-ils-parlent.mp3`}>ils parlent</AudioClip></TableCell>
									<TableCell>they speak / are speaking</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/013-elles-parlent.mp3`}>elles parlent</AudioClip></TableCell>
									<TableCell>they speak / are speaking</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<Separator className="my-4" />
					<p><strong>venir</strong> is a common irregular verb.</p>
					<div className="mt-3">
						<Table className="grammar-audio-table">
							<thead>
								<TableRow>
									<th>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/063-venir-de.mp3`}><strong>venir de</strong></AudioClip>
									</th>
									<th>to come from</th>
								</TableRow>
							</thead>
							<TableBody onClick={playAudioFromTableRow}>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/046-je-viens.mp3`}>je viens</AudioClip> (de Marseille)
									</TableCell>
									<TableCell>I come (from Marseille)...</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/060-tu-viens.mp3`}>tu viens</AudioClip>
									</TableCell>
									<TableCell>you come</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/024-il-vient.mp3`}>il vient</AudioClip>
									</TableCell>
									<TableCell>he/it comes</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/011-elle-vient.mp3`}>elle vient</AudioClip>
									</TableCell>
									<TableCell>she/it comes</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/055-nous-venons.mp3`}>nous venons</AudioClip>
									</TableCell>
									<TableCell>we come</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/065-vous-venez.mp3`}>vous venez</AudioClip>
									</TableCell>
									<TableCell>you come</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/027-ils-viennent.mp3`}>ils viennent</AudioClip>
									</TableCell>
									<TableCell>they come</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/015-elles-viennent.mp3`}>elles viennent</AudioClip>
									</TableCell>
									<TableCell>they come</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		);
	};
}

export class LO3Grammar2 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-grammar2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<div className="-mt-1 mb-3">
						<Info
							variant="warning"
							informationTextHTML="<p><strong>NB</strong> The word <strong>de</strong> occurs in French with a variety of meanings. Here it means <strong>from</strong>, and it's followed by a place name.</p>"
						/>
					</div>
					<p>Look at the following examples illustrating the forms:</p>
					<p>Je viens <span className="ped-neg"><strong>de</strong></span> Paris (for towns, cities, villages)</p>
					<p>Je viens <span className="ped-affirm"><strong>de</strong></span> Belgique (for feminine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-neutral"><strong>d'</strong></span>Angleterre (for all singular place names beginning with a vowel or mute h)</p>
					<p>Je viens <span className="ped-accent"><strong>du</strong></span> Canada (for masculine countries and regions beginning with a consonant)</p>
					<p>Je viens <span className="ped-warn"><strong>des</strong></span> Seychelles (for plural countries)</p>
				</div>
			</div>
		);
	};
}

export class LO3Grammar3 extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo3-grammar3-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<p>When describing a female or any feminine noun, you will often see the addition of a letter or letters to the original masculine
						noun or adjective.</p>
					<ul>
						<li>If the ending is <strong>e</strong>{' '}there is no addition: both masculine and feminine are the the same e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/003-celibataire.mp3`}>célibataire</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/047-journaliste.mp3`}>journaliste</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/058-serbe.mp3`}>serbe</AudioClip> etc.
						</li>
						<li>If the last letter is a consonant, then generally <strong>e</strong>{' '}is added to form the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/017-etudiant.mp3`}>étudiant</AudioClip> (m)&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/018-etudiante.mp3`}>étudiante</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/005-chinois.mp3`}>chinois</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/006-chinoise.mp3`}>chinoise</AudioClip> (f)
						</li>
					</ul>
					<div className="mt-3 mb-3">
						<Info variant="warning">
							<strong>NB</strong>{' '}
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/052-medecin.mp3`}>
								<em className={`grammar-term-em`}>médecin</em>
							</AudioClip>{' '}
							is an exception: it is used for both a male and a female doctor.
						</Info>
					</div>
					<ul>
						<li>If the final letter is <strong>é</strong>, then an <strong>e</strong>{' '}is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/050-marie.mp3`}>marié</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/051-mariee.mp3`}>mariée</AudioClip> (f)
						</li>
						<li>If the ending is <strong>en</strong>, <strong>ne</strong>{' '}is added for the feminine e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/028-informaticien.mp3`}>informaticien</AudioClip> (m) /&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/029-informaticienne.mp3`}>informaticienne</AudioClip> (f),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/001-australien.mp3`}>australien</AudioClip> (m),&nbsp;
							<AudioClip className={`link`} soundFile={`audio/lo3/grammar/grammar-and-usage/002-australienne.mp3`}>australienne</AudioClip> (f)
						</li>
					</ul>
				</div>
			</div>
		);
	};
}
