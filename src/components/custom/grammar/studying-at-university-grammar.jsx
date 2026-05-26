import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { GrammarLabel } from "@/components/custom/grammar/GrammarLabel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { playAudioLink } from "@/utils/audioPlayback";
import { PureComponent } from "react";

const handleAudioRowClick = (soundFile, event) => {
	if (!soundFile) return;
	if (event?.defaultPrevented) return;

	const targetNode = event?.target;
	if (targetNode instanceof Element && targetNode.closest(".audio-link, .audio-container")) {
		return;
	}

	const rowEl = event?.currentTarget;
	const audioTrigger = rowEl?.querySelector("button.audio-link, .audio-container");
	if (audioTrigger) {
		audioTrigger.click();
		return;
	}

	playAudioLink(soundFile);
};

const AudioTable = ({ rows, tableId }) => (
	<Table className="grammar-audio-table" variant="learning">
		<TableHeader className="sr-only">
			<TableRow><TableHead>French</TableHead><TableHead>English</TableHead></TableRow>
		</TableHeader>
		<TableBody>
			{rows.map((row, index) => (
				<TableRow
					className="cursor-pointer has-audio-row"
					key={`${tableId}-row-${index}`}
					onClick={(event) => handleAudioRowClick(row.soundFile, event)}
				>
					<TableCell>
						<AudioClip className="link" soundFile={row.soundFile}>
							{row.french}
						</AudioClip>
					</TableCell>
					<TableCell>{row.english}</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

export class StudyingAtUniversityGrammarComme extends PureComponent {
	render = () => {
		const { id } = this.props;
		const commeRows = [
				{
					english: "What sports do you do?",
					french: (
						<>
							Qu&apos;est-ce que vous faites <strong>comme</strong>{" "}sports&nbsp;?
						</>
					),
					soundFile: "audio/lo14/grammar/using-comme/002-quest-ce-que-vous-faites-comme-sports.mp3",
				},
				{
					english: "What sort of music do you like?",
					french: (
						<>
							Qu&apos;est-ce que tu aimes <strong>comme</strong>{" "}musique&nbsp;?
						</>
					),
					soundFile: "audio/lo14/grammar/using-comme/003-quest-ce-que-tu-aimes-comme-musique.mp3",
				},
		];

		return (
			<div id={id || undefined}>
				<h3>1. Asking idiomatic questions with <em>comme</em></h3>
				<p>
					Some English questions translate literally into French, but others sound more
					natural with an idiomatic pattern. One useful example is the construction with{" "}
					<AudioClip
						className="link"
						soundFile="audio/lo14/grammar/using-comme/001-comme.mp3"
					>
						<strong>comme</strong>
					</AudioClip>
					.
				</p>
				<p>
					French often uses this pattern to ask what kind of studies, music, sport, or
					food someone is talking about. It is especially useful in questions such as{" "}
					<strong>Qu&apos;est-ce que tu fais comme études&nbsp;?</strong>
				</p>
				<AudioTable rows={commeRows} tableId={id || "lo14-grammar1"} />
			</div>
		);
	};
}

export class StudyingAtUniversityGrammarDevoir extends PureComponent {
	render = () => {
		const { id } = this.props;
		const exampleRows = [
			{
				english: "I have to leave at 3 o'clock.",
				french: (
					<>
						<strong>Je dois partir</strong> à trois heures.
					</>
				),
				soundFile: "audio/lo14/grammar/devoir/002-je-dois-partir-a-trois-heures.mp3",
			},
			{
				english: "They have to work very hard.",
				french: (
					<>
						<strong>Ils doivent travailler</strong> très dur.
					</>
				),
				soundFile: "audio/lo14/grammar/devoir/003-ils-doivent-travailler-tres-dur.mp3",
			},
		];
		const devoirRows = [
			{
				english: "I have to / I must",
				french: <strong>je dois</strong>,
				soundFile: "audio/lo14/grammar/devoir/004-je-dois.mp3",
			},
			{
				english: "you have to / you must",
				french: <strong>tu dois</strong>,
				soundFile: "audio/lo14/grammar/devoir/005-tu-dois.mp3",
			},
			{
				english: "he / she has to; he / she must",
				french: <strong>il / elle doit</strong>,
				soundFile: "audio/lo14/grammar/devoir/006-il-doit-elle-doit.mp3",
			},
			{
				english: "people / we have to; people / we must",
				french: <strong>on doit</strong>,
				soundFile: "audio/lo14/grammar/devoir/007-on-doit.mp3",
			},
			{
				english: "we have to / we must",
				french: <strong>nous devons</strong>,
				soundFile: "audio/lo14/grammar/devoir/008-nous-devons.mp3",
			},
			{
				english: "you have to / you must",
				french: <strong>vous devez</strong>,
				soundFile: "audio/lo14/grammar/devoir/009-vous-devez.mp3",
			},
			{
				english: "they have to / they must",
				french: <strong>ils / elles doivent</strong>,
				soundFile: "audio/lo14/grammar/devoir/010-ils-doivent-elles-doivent.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>2. Using <em>devoir</em> with an infinitive</h3>
				<p>
					The irregular verb{" "}
					<AudioClip className="link" soundFile="audio/lo14/grammar/devoir/001-devoir.mp3">
						<strong>devoir</strong>
					</AudioClip>{" "}
					means <strong>to have to</strong> or <strong>must</strong>. It is followed by
					another verb in the infinitive form.
				</p>
				<GrammarLabel>Here are two common examples:</GrammarLabel>
				<AudioTable rows={exampleRows} tableId={`${id || "lo14-grammar2"}-examples`} />
				<GrammarLabel className="mt-5">Present tense of <strong>devoir</strong>:</GrammarLabel>
				<AudioTable rows={devoirRows} tableId={id || "lo14-grammar2"} />
			</div>
		);
	};
}

export class StudyingAtUniversityGrammarPouvoir extends PureComponent {
	render = () => {
		const { id } = this.props;
		const pouvoirRows = [
			{
				english: "I am able to / I can / I may",
				french: <strong>je peux</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/002-je-peux.mp3",
			},
			{
				english: "you are able to / you can / you may",
				french: <strong>tu peux</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/003-tu-peux.mp3",
			},
			{
				english: "he is able to / he can / he may",
				french: <strong>il peut</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/004-il-peut.mp3",
			},
			{
				english: "she is able to / she can / she may",
				french: <strong>elle peut</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/005-elle-peut.mp3",
			},
			{
				english: "people / we are able to; can; may",
				french: <strong>on peut</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/006-on-peut.mp3",
			},
			{
				english: "we are able to / we can / we may",
				french: <strong>nous pouvons</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/007-nous-pouvons.mp3",
			},
			{
				english: "you are able to / you can / you may",
				french: <strong>vous pouvez</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/008-vous-pouvez.mp3",
			},
			{
				english: "they are able to / they can / they may",
				french: <strong>ils / elles peuvent</strong>,
				soundFile: "audio/lo14/grammar/pouvoir/009-ils-peuvent-elles-peuvent.mp3",
			},
		];

		const pouvoirExampleRows = [
				{
					english: "I can answer your question right away.",
					french: <strong>Je peux répondre à votre question tout de suite.</strong>,
					soundFile: "audio/lo14/grammar/pouvoir/010-je-peux-repondre-a-votre-question-tout-de-suite.mp3",
				},
				{
					english: "Can you open the window, please?",
					french: <strong>Vous pouvez ouvrir la fenêtre, s&apos;il vous plaît&nbsp;?</strong>,
					soundFile: "audio/lo14/grammar/pouvoir/011-vous-pouvez-ouvrir-la-fenetre-sil-vous-plait.mp3",
				},
			];

		return (
			<div id={id || undefined}>
				<h3>3. Using <em>pouvoir</em> with an infinitive</h3>
				<p>
					The irregular verb{" "}
					<AudioClip
						className="link"
						soundFile="audio/lo14/grammar/pouvoir/001-pouvoir.mp3"
					>
						<strong>pouvoir</strong>
					</AudioClip>{" "}
					means <strong>to be able to</strong>. Like <strong>devoir</strong>, it is
					usually followed by an infinitive.
				</p>
				<GrammarLabel>Here are two common examples:</GrammarLabel>
				<AudioTable rows={pouvoirExampleRows} tableId={`${id || "lo14-grammar3"}-examples`} />
				<GrammarLabel className="mt-5">Present tense of <strong>pouvoir</strong>:</GrammarLabel>
				<AudioTable rows={pouvoirRows} tableId={id || "lo14-grammar3"} />
			</div>
		);
	};
}

export class StudyingAtUniversityGrammarParticiples extends PureComponent {
	render = () => {
		const { id } = this.props;
		const presentRows = [
			{
				english: "It's tiring",
				french: <strong>C&apos;est fatigant</strong>,
				soundFile: "audio/lo14/grammar/participles/001-cest-fatigant.mp3",
			},
			{
				english: "It's motivating",
				french: <strong>C&apos;est motivant</strong>,
				soundFile: "audio/lo14/grammar/participles/002-cest-motivant.mp3",
			},
			{
				english: "It's interesting",
				french: <strong>C&apos;est intéressant</strong>,
				soundFile: "audio/lo14/grammar/participles/003-cest-interessant.mp3",
			},
		];
		const pastRows = [
			{
				english: "I am tired",
				french: <strong>Je suis fatigué / fatiguée</strong>,
				soundFile: "audio/lo14/grammar/participles/004-je-suis-fatigue.mp3",
			},
			{
				english: "The students are very motivated",
				french: <strong>Les étudiants sont très motivés</strong>,
				soundFile: "audio/lo14/grammar/participles/005-les-etudiants-sont-tres-motives.mp3",
			},
			{
				english: "He is fascinated",
				french: <strong>Il est fasciné</strong>,
				soundFile: "audio/lo14/grammar/participles/006-il-est-fascine.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>4. Present and past participles as adjectives</h3>
				<p>French has both present and past participles, and both can be used as adjectives.</p>
				<p>
					<strong>Present participles</strong> often end in <em>-ant</em>. In English,
					they often correspond to adjectives ending in <em>-ing</em>, such as
					&ldquo;interesting&rdquo; or &ldquo;tiring&rdquo;.
				</p>
				<AudioTable rows={presentRows} tableId={`${id || "lo14-grammar4"}-present`} />
				<p>
					<strong>Past participles</strong> of many <em>-er</em> verbs end in{" "}
					<strong>-é</strong>. They can also be used as adjectives, like
					&ldquo;tired&rdquo;, &ldquo;motivated&rdquo;, or &ldquo;fascinated&rdquo;.
				</p>
				<AudioTable rows={pastRows} tableId={`${id || "lo14-grammar4"}-past`} />
				<Info variant="warning">
					{/* h4→p: heading inside an Info box is redundant */}
					<p>
						<strong>NB</strong> When present or past participles are used as adjectives,
						they must agree in gender and number with the noun they describe.
					</p>
				</Info>
			</div>
		);
	};
}
