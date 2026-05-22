import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/content";
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

const AudioTable = ({ headers, rows, tableId }) => (
	<Table className="grammar-audio-table" variant="learning">
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

export class ShoppingInTheMarketGrammarAller extends PureComponent {
	render = () => {
		const { id } = this.props;
		const allerRows = [
			{
				english: "I go / am going",
				french: <>je vais</>,
				soundFile: "audio/lo12/grammar/001-je-vais.mp3",
			},
			{
				english: "you go / are going",
				french: <>tu vas</>,
				soundFile: "audio/lo12/grammar/002-tu-vas.mp3",
			},
			{
				english: "he / she goes / is going",
				french: <>il / elle va</>,
				soundFile: "audio/lo12/grammar/003-il-va-elle-va.mp3",
			},
			{
				english: "we go / are going",
				french: <>nous allons</>,
				soundFile: "audio/lo12/grammar/004-nous-allons.mp3",
			},
			{
				english: "you go / are going",
				french: <>vous allez</>,
				soundFile: "audio/lo12/grammar/005-vous-allez.mp3",
			},
			{
				english: "they go / are going",
				french: <>ils / elles vont</>,
				soundFile: "audio/lo12/grammar/006-ils-vont-elles-vont.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>1. Using <em>aller</em> to talk about where you go</h3>
				<p>
					The verb{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/007-aller.mp3">
						<strong>aller</strong>
					</AudioClip>{" "}
					means <strong>to go</strong> and is used all the time when talking about
					where you shop or where you are going. Here are the present-tense forms:
				</p>
				<AudioTable rows={allerRows} tableId={id || "lo12-grammar1"} />
				<p>
					In context, you might hear{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/008-je-vais-en-ville.mp3">
						<strong>Je vais en ville</strong>
					</AudioClip>{" "}
					or{" "}
					<AudioClip
						className="link"
						soundFile="audio/lo12/grammar/009-melanie-va-au-marche-le-mardi.mp3"
					>
						<strong>Mélanie va au marché le mardi</strong>
					</AudioClip>
					.
				</p>
				<div className="mt-3">
					<Info variant="warning">
						{/* h4→p: heading inside an Info box is redundant */}
						<p>
							<strong>NB</strong>{" "}French uses{" "}
							<AudioClip className="link" soundFile="audio/lo12/grammar/007-aller.mp3">
								<strong>aller</strong>
							</AudioClip>
							{" "}— not <strong>être</strong> — when asking how someone is. This is a
							common source of confusion for learners and worth remembering. For example:{" "}
							<AudioClip className="link" soundFile="audio/lo12/grammar/010-comment-ca-va.mp3">
								<strong>Comment ça va&nbsp;?</strong>
							</AudioClip>{" "}
							and{" "}
							<AudioClip className="link" soundFile="audio/lo12/grammar/011-vous-allez-bien.mp3">
								<strong>Vous allez bien&nbsp;?</strong>
							</AudioClip>
							.
						</p>
					</Info>
				</div>
			</div>
		);
	};
}

export class ShoppingInTheMarketGrammarPartitivesAndQuantities extends PureComponent {
	render = () => {
		const { id } = this.props;
		const partitiveRows = [
			{
				english: "some cheese",
				french: <>du fromage</>,
				soundFile: "audio/lo12/grammar/012-du-fromage.mp3",
			},
			{
				english: "some beer",
				french: <>de la bière</>,
				soundFile: "audio/lo12/grammar/013-de-la-biere.mp3",
			},
			{
				english: "some water",
				french: <>de l&apos;eau</>,
				soundFile: "audio/lo12/grammar/027-de-leau.mp3",
			},
			{
				english: "some cherries",
				french: <>des cerises</>,
				soundFile: "audio/lo12/grammar/014-des-cerises.mp3",
			},
		];
		const quantityRows = [
			{
				english: "a kilo of apples",
				french: <>un kilo de pommes</>,
				soundFile: "audio/lo12/grammar/015-un-kilo-de-pommes.mp3",
			},
			{
				english: "a punnet of strawberries",
				french: <>une barquette de fraises</>,
				soundFile: "audio/lo12/grammar/016-une-barquette-de-fraises.mp3",
			},
			{
				english: "a cup of tea",
				french: <>une tasse de thé</>,
				soundFile: "audio/lo12/grammar/017-une-tasse-de-the.mp3",
			},
			{
				english: "200 grams of almonds",
				french: <>200 grammes d&apos;amandes</>,
				soundFile: "audio/lo12/grammar/028-200-grammes-damandes.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>2. Partitives, quantities, and negation with <em>de</em></h3>
				<p>
					The little words{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/021-de.mp3">
						<strong>de</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/030-d.mp3">
						<strong>d&apos;</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/018-du.mp3">
						<strong>du</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/019-de-la.mp3">
						<strong>de la</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/029-de-l.mp3">
						<strong>de l&apos;</strong>
					</AudioClip>
					, and{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/020-des.mp3">
						<strong>des</strong>
					</AudioClip>
					{" "}occur often in French and can sometimes cause confusion. You may find it
					useful to study the following explanations to gain some clarity.
				</p>
				<p>
					You will probably already have encountered some of these meaning <strong>from</strong>,
					for example: <em>Je viens de France</em>, <em>elle vient du Canada</em>.
				</p>
				<div className="mt-3">
					<Info variant="warning">
						{/* h4→p: heading inside an Info box is redundant */}
						<p>
							<strong>NB</strong> These words have other meanings too, so it is important to bear the context in mind.
						</p>
					</Info>
				</div>
				<p>
					When talking about non-specific quantities, French uses partitive articles:{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/018-du.mp3">
						<strong>du</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/019-de-la.mp3">
						<strong>de la</strong>
					</AudioClip>
					,{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/029-de-l.mp3">
						<strong>de l&apos;</strong>
					</AudioClip>
					, and{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/020-des.mp3">
						<strong>des</strong>
					</AudioClip>
					.
				</p>
				<AudioTable rows={partitiveRows} tableId={id || "lo12-grammar2-partitives"} />
				<p>
					After a specific quantity, use{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/021-de.mp3">
						<strong>de</strong>
					</AudioClip>{" "}
					or{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/030-d.mp3">
						<strong>d&apos;</strong>
					</AudioClip>
					:
				</p>
				<AudioTable rows={quantityRows} tableId={id || "lo12-grammar2-quantities"} />
				<p>
					The same{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/021-de.mp3">
						<strong>de</strong>
					</AudioClip>{" "}
					or{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/030-d.mp3">
						<strong>d&apos;</strong>
					</AudioClip>{" "}
					appears after a negation:
				</p>
				<Table className="grammar-audio-table" variant="learning">
					<TableHeader>
						<TableRow>
							<TableHead scope="col">French</TableHead>
							<TableHead scope="col">Meaning</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow
							className="cursor-pointer has-audio-row"
							onClick={(event) => handleAudioRowClick("audio/lo12/grammar/033-je-nai-pas-de-fromage.mp3", event)}
						>
							<TableCell>
								<AudioClip className="link" soundFile="audio/lo12/grammar/033-je-nai-pas-de-fromage.mp3">
									Je n&apos;ai pas de fromage.
								</AudioClip>
							</TableCell>
							<TableCell>I haven&apos;t got any cheese.</TableCell>
						</TableRow>
						<TableRow
							className="cursor-pointer has-audio-row"
							onClick={(event) =>
								handleAudioRowClick("audio/lo12/grammar/031-je-nai-pas-de-pain.mp3", event)
							}
						>
							<TableCell>
								<AudioClip
									className="link"
									soundFile="audio/lo12/grammar/031-je-nai-pas-de-pain.mp3"
								>
									Je n&apos;ai pas de pain.
								</AudioClip>
							</TableCell>
							<TableCell>I don&apos;t have any bread.</TableCell>
						</TableRow>
						<TableRow
							className="cursor-pointer has-audio-row"
							onClick={(event) =>
								handleAudioRowClick(
									"audio/lo12/grammar/032-il-ne-veut-pas-deau-minerale.mp3",
									event,
								)
							}
						>
							<TableCell>
								<AudioClip
									className="link"
									soundFile="audio/lo12/grammar/032-il-ne-veut-pas-deau-minerale.mp3"
								>
									Il ne veut pas d&apos;eau minérale.
								</AudioClip>
							</TableCell>
							<TableCell>He doesn&apos;t want any mineral water.</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	};
}

export class ShoppingInTheMarketGrammarPluralForms extends PureComponent {
	render = () => {
		const { id } = this.props;
		const pluralRows = [
			{
				english: "a knife / some knives",
				french: (
					<>
						un couteau / des couteaux
					</>
				),
				soundFile: "audio/lo12/grammar/022-des-couteaux.mp3",
			},
			{
				english: "a cake / some cakes",
				french: (
					<>
						un gâteau / des gâteaux
					</>
				),
				soundFile: "audio/lo12/grammar/023-des-gateaux.mp3",
			},
			{
				english: "a leek / some leeks",
				french: (
					<>
						un poireau / des poireaux
					</>
				),
				soundFile: "audio/lo12/grammar/024-des-poireaux.mp3",
			},
			{
				english: "a cabbage / some cabbages",
				french: (
					<>
						un chou / des choux
					</>
				),
				soundFile: "audio/lo12/grammar/025-chou-choux.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>3. Nouns ending in <em>x</em> in the plural</h3>
				<p>
					Most French nouns form the plural by adding <strong>s</strong>. One useful
					exception is that many nouns ending in <strong>-eau</strong> or{" "}
					<strong>-au</strong> take <strong>x</strong>{" "}instead. A small number of
					nouns ending in <strong>-ou</strong> also take <strong>x</strong>{" "}—
					including <em>chou</em> (cabbage), giving <em>des choux</em>.
				</p>
				<AudioTable
					headers={["French", "Meaning"]}
					rows={pluralRows}
					tableId={id || "lo12-grammar3"}
				/>
				<p>
					This is why you say{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/026-poireau-poireaux.mp3">
						<strong>un poireau / des poireaux</strong>
					</AudioClip>{" "}
					and{" "}
					<AudioClip className="link" soundFile="audio/lo12/grammar/025-chou-choux.mp3">
						<strong>un chou / des choux</strong>
					</AudioClip>
					.
				</p>
			</div>
		);
	};
}
