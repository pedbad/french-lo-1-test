import { AudioClip } from "@/components/AudioClip";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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

const AudioTable = ({ rows, tableId, headers }) => (
	<Table variant="learning">
		{headers ? (
			<TableHeader>
				<TableRow>
					{headers.map((header) => (
						<TableHead key={`${tableId}-${header}`} scope="col">
							{header}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
		) : null}
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

export class GoingToACafeGrammarConditionalVouloir extends PureComponent {
	render = () => {
		const { id } = this.props;
		const vouloirRows = [
			{
				english: "I would like",
				french: <>je voudrais</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/005-je-voudrais.mp3",
			},
			{
				english: "you would like",
				french: <>tu voudrais</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/006-tu-voudrais.mp3",
			},
			{
				english: "he / she would like",
				french: <>il / elle voudrait</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/007-il-elle-voudrait.mp3",
			},
			{
				english: "we would like",
				french: <>nous voudrions</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/008-nous-voudrions.mp3",
			},
			{
				english: "you would like",
				french: <>vous voudriez</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/009-vous-voudriez.mp3",
			},
			{
				english: "they would like",
				french: <>ils / elles voudraient</>,
				soundFile: "audio/lo11/grammar/conditional-vouloir/010-ils-elles-voudraient.mp3",
			},
		];

		return (
			<div
				className="lo11-grammar1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel1` : undefined} key={`${id}Panel1`}>
					<p>
						To express what you would like, use{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/conditional-vouloir/001-je-voudrais.mp3"
						>
							<strong>Je voudrais</strong>
						</AudioClip>
						. For example,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/conditional-vouloir/002-je-voudrais-une-glace.mp3"
						>
							<strong>Je voudrais une glace</strong>
						</AudioClip>{" "}
						means “I&apos;d like an ice-cream.”
					</p>
					<p>
						This is the present conditional of{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/conditional-vouloir/003-vouloir.mp3"
						>
							<strong>vouloir</strong>
						</AudioClip>
						. To say what you would like to do, add an infinitive afterwards, as in{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/conditional-vouloir/004-je-voudrais-aller-au-marche-demain.mp3"
						>
							<strong>Je voudrais aller au marché demain</strong>
						</AudioClip>
						.
					</p>
					<p>Here are the conditional forms:</p>
					<AudioTable rows={vouloirRows} tableId={id || "lo11-grammar1"} />
				</div>
			</div>
		);
	};
}

export class GoingToACafeGrammarPrendre extends PureComponent {
	render = () => {
		const { id } = this.props;
		const prendreRows = [
			{
				english: "I take / have",
				french: <>je prends</>,
				soundFile: "audio/lo11/grammar/prendre/008-je-prends.mp3",
			},
			{
				english: "you take / have",
				french: <>tu prends</>,
				soundFile: "audio/lo11/grammar/prendre/009-tu-prends.mp3",
			},
			{
				english: "he / she takes / has",
				french: <>il / elle prend</>,
				soundFile: "audio/lo11/grammar/prendre/010-il-elle-prend.mp3",
			},
			{
				english: "we take / have",
				french: <>nous prenons</>,
				soundFile: "audio/lo11/grammar/prendre/011-nous-prenons.mp3",
			},
			{
				english: "you take / have",
				french: <>vous prenez</>,
				soundFile: "audio/lo11/grammar/prendre/012-vous-prenez.mp3",
			},
			{
				english: "they take / have",
				french: <>ils / elles prennent</>,
				soundFile: "audio/lo11/grammar/prendre/013-ils-elles-prennent.mp3",
			},
		];

		return (
			<div
				className="lo11-grammar2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel2` : undefined} key={`${id}Panel2`}>
					<p>
						The verb{" "}
						<AudioClip className="link" soundFile="audio/lo11/grammar/prendre/001-prendre.mp3">
							<strong>prendre</strong>
						</AudioClip>{" "}
						is very common. It often means <strong>to take</strong>, for example{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/prendre/002-je-prends-le-bus-pour-aller-au-centre-ville.mp3"
						>
							<strong>Je prends le bus pour aller au centre-ville</strong>
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/prendre/003-prenez-la-premiere-rue-a-droite.mp3"
						>
							<strong>Prenez la première rue à droite&nbsp;!</strong>
						</AudioClip>
						, and{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/prendre/004-il-prend-une-douche.mp3"
						>
							<strong>Il prend une douche</strong>
						</AudioClip>
						.
					</p>
					<p>
						In café French, do <strong>not</strong> use <strong>avoir</strong> for
						food and drink. Use{" "}
						<AudioClip className="link" soundFile="audio/lo11/grammar/prendre/001-prendre.mp3">
							<strong>prendre</strong>
						</AudioClip>{" "}
						instead, as in{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/prendre/006-je-prends-un-cafe.mp3"
						>
							<strong>Je prends un café</strong>
						</AudioClip>{" "}
						or{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo11/grammar/prendre/007-je-prends-mon-petit-dejeuner-a-huit-heures.mp3"
						>
							<strong>Je prends mon petit déjeuner à huit heures</strong>
						</AudioClip>
						.
					</p>
					<p>
						<AudioClip className="link" soundFile="audio/lo11/grammar/prendre/001-prendre.mp3">
							<strong>Prendre</strong>
						</AudioClip>
					</p>
					<AudioTable rows={prendreRows} tableId={id || "lo11-grammar2"} />
				</div>
			</div>
		);
	};
}

export class GoingToACafeGrammarFlavoursWithA extends PureComponent {
	render = () => {
		const { id } = this.props;
		const flavourRows = [
			{
				english: "A cheese sandwich for me.",
				french: <>Pour moi un sandwich au fromage.</>,
				soundFile: "audio/lo11/grammar/flavours-with-a/001-pour-moi-un-sandwich-au-fromage.mp3",
			},
			{
				english: "I&apos;d like a vanilla ice-cream.",
				french: <>Je voudrais une glace à la vanille.</>,
				soundFile: "audio/lo11/grammar/flavours-with-a/002-je-voudrais-une-glace-a-la-vanille.mp3",
			},
			{
				english: "I like the orange sauce.",
				french: <>J&apos;aime la sauce à l&apos;orange.</>,
				soundFile: "audio/lo11/grammar/flavours-with-a/003-j-aime-la-sauce-a-l-orange.mp3",
			},
			{
				english: "Are you having a mushroom omelette?",
				french: <>Vous prenez une omelette aux champignons&nbsp;?</>,
				soundFile: "audio/lo11/grammar/flavours-with-a/004-vous-prenez-une-omelette-aux-champignons.mp3",
			},
		];

		return (
			<div
				className="lo11-grammar3-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel3` : undefined} key={`${id}Panel3`}>
					<p>
						To describe flavours, fillings, and toppings, French often uses the
						preposition <strong>à</strong> with the article:
						{" "}<strong>au</strong>, <strong>à la</strong>, <strong>à l&apos;</strong>,
						and <strong>aux</strong>.
					</p>
					<p>Compare these examples:</p>
					<AudioTable rows={flavourRows} tableId={id || "lo11-grammar3"} />
				</div>
			</div>
		);
	};
}

export class GoingToACafeGrammarDisjunctivePronouns extends PureComponent {
	render = () => {
		const { id } = this.props;
		const exampleRows = [
			{
				english: "A coffee for me please.",
				french: <>Pour moi un café s&apos;il vous plaît.</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/004-pour-moi-un-cafe-s-il-vous-plait.mp3",
			},
			{
				english: "The children don&apos;t want to play football without him.",
				french: <>Les enfants ne veulent pas jouer au football sans lui.</>,
				soundFile:
					"audio/lo11/grammar/disjunctive-pronouns/005-les-enfants-ne-veulent-pas-jouer-au-football-sans-lui.mp3",
			},
			{
				english: "I work with them.",
				french: <>Je travaille avec eux.</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/006-je-travaille-avec-eux.mp3",
			},
		];

		const pronounRows = [
			{
				english: "je",
				french: <>moi</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/007-moi.mp3",
			},
			{
				english: "tu",
				french: <>toi</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/008-toi.mp3",
			},
			{
				english: "il",
				french: <>lui</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/009-lui.mp3",
			},
			{
				english: "elle",
				french: <>elle</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/010-elle.mp3",
			},
			{
				english: "nous",
				french: <>nous</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/011-nous.mp3",
			},
			{
				english: "vous",
				french: <>vous</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/012-vous.mp3",
			},
			{
				english: "ils",
				french: <>eux</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/013-eux.mp3",
			},
			{
				english: "elles",
				french: <>elles</>,
				soundFile: "audio/lo11/grammar/disjunctive-pronouns/014-elles.mp3",
			},
		];

		return (
			<div
				className="lo11-grammar4-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel4` : undefined} key={`${id}Panel4`}>
					<p>
						French also has <strong>disjunctive</strong> or <strong>stressed</strong>
						pronouns. They are used after prepositions such as{" "}
						<AudioClip className="link" soundFile="audio/lo11/grammar/disjunctive-pronouns/001-pour.mp3">
							<strong>pour</strong>
						</AudioClip>
						,{" "}
						<AudioClip className="link" soundFile="audio/lo11/grammar/disjunctive-pronouns/002-avec.mp3">
							<strong>avec</strong>
						</AudioClip>
						, and{" "}
						<AudioClip className="link" soundFile="audio/lo11/grammar/disjunctive-pronouns/003-sans.mp3">
							<strong>sans</strong>
						</AudioClip>
						.
					</p>
					<p>Look at these examples:</p>
					<AudioTable rows={exampleRows} tableId={`${id || "lo11-grammar4"}-examples`} />
					<p className="mt-4">Here is the full pronoun set:</p>
					<AudioTable
						rows={pronounRows}
						tableId={`${id || "lo11-grammar4"}-pronouns`}
						headers={["Subject pronoun", "Disjunctive pronoun"]}
					/>
				</div>
			</div>
		);
	};
}
