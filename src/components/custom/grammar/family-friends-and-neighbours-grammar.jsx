import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";
import { playAudioLink } from "@/utils/audioPlayback";

export class FamilyFriendsAndNeighboursGrammarPossessives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-grammar1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<h3>1. Possessive adjectives</h3>
				<p>
					In French, the gender of the noun has implications for the <strong>possessive
					adjectives</strong>.{" "}
					There are two ways of saying <strong>my</strong> for singular nouns in French:{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mon.mp3`}>
						<strong>mon</strong>
					</AudioClip>
					{" "}for masculine nouns, for example{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mon-frere.mp3`}>
						<strong>mon</strong> frère
					</AudioClip>
					{" "}and{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mon-jardin.mp3`}>
						<strong>mon</strong> jardin
					</AudioClip>
					, and{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ma.mp3`}>
						<strong>ma</strong>
					</AudioClip>
					{" "}for feminine nouns, for example{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ma-femme.mp3`}>
						<strong>ma</strong> femme
					</AudioClip>
					{" "}and{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ma-maison.mp3`}>
						<strong>ma</strong> maison
					</AudioClip>
					.
				</p>
				<p>
					It is important to remember that the gender of the noun itself is what matters
					here, and not the gender of the owner. There is only one way of saying{" "}
					<strong>my</strong> for plural nouns, for example{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mes-oncles.mp3`}>
						<strong>mes</strong> oncles
					</AudioClip>
					{" "}and{" "}
					<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mes-tantes.mp3`}>
						<strong>mes</strong> tantes
					</AudioClip>
					. Here is a complete list of the possessive adjectives:
				</p>
				<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
					<TableHeader className="sr-table-head">
						<TableRow>
							<TableHead scope="col">French</TableHead>
							<TableHead scope="col">English</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mon.mp3`}>mon</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ma.mp3`}>ma</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/mes.mp3`}>mes</AudioClip>
							</TableCell>
							<TableCell>my</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ton.mp3`}>ton</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ta.mp3`}>ta</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/tes.mp3`}>tes</AudioClip>
							</TableCell>
							<TableCell>your (sing)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/son.mp3`}>son</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/sa.mp3`}>sa</AudioClip>,{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/ses.mp3`}>ses</AudioClip>{" "}
								<span className="edu-warn text-base font-bold leading-none">*</span>
							</TableCell>
							<TableCell>his / her</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/notre.mp3`}>notre</AudioClip> (sing),{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/nos.mp3`}>nos</AudioClip> (pl)
							</TableCell>
							<TableCell>our</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/votre.mp3`}>votre</AudioClip> (sing),{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/vos.mp3`}>vos</AudioClip> (pl)
							</TableCell>
							<TableCell>your (formal, pl)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/leur.mp3`}>leur</AudioClip> (sing),{" "}
								<AudioClip className={`link`} soundFile={`audio/lo6/grammar/leurs.mp3`}>leurs</AudioClip> (pl)
							</TableCell>
							<TableCell>their</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Info variant="warning">
					<p>
						<span className="edu-warn text-base font-bold">*</span>{" "}
						All of these can mean <strong>his</strong> or <strong>her</strong>. The gender
						of the noun, not the owner, is the factor to consider.
					</p>
				</Info>
			</div>
		);
	};
}

export class FamilyFriendsAndNeighboursGrammarAvoir extends PureComponent {
	handleRowClick = (soundFile, event) => {
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

	render = () => {
		const { id } = this.props;
		const avoirRows = [
			{
				english: "I have",
				french: "j&apos;ai",
				soundFile: "audio/lo6/grammar/j-ai.mp3",
			},
			{
				english: "you have",
				french: "tu as",
				soundFile: "audio/lo6/grammar/tu-as.mp3",
			},
			{
				english: "he has, it has",
				french: "il a",
				soundFile: "audio/lo6/grammar/il-a.mp3",
			},
			{
				english: "she has, it has",
				french: "elle a",
				soundFile: "audio/lo6/grammar/elle-a.mp3",
			},
			{
				english: "we have",
				french: "nous avons",
				soundFile: "audio/lo6/grammar/nous-avons.mp3",
			},
			{
				english: "you have",
				french: "vous avez",
				soundFile: "audio/lo6/grammar/vous-avez.mp3",
			},
			{
				english: "they have",
				french: "ils ont",
				soundFile: "audio/lo6/grammar/ils-ont.mp3",
			},
			{
				english: "they have",
				french: "elles ont",
				soundFile: "audio/lo6/grammar/elles-ont.mp3",
			},
		];
		const expressionRows = [
			{
				english: "I&apos;m 25 years old.",
				example: <strong>J&apos;ai 25 ans.</strong>,
				label: "avoir … ans",
				meaning: "to be … years old",
				soundFile: "audio/lo6/grammar/j-ai-25-ans.mp3",
			},
			{
				english: "I&apos;m thirsty.",
				example: <strong>J&apos;ai soif.</strong>,
				label: "avoir soif",
				meaning: "to be thirsty",
				soundFile: "audio/lo6/grammar/j-ai-soif.mp3",
			},
			{
				english: "She&apos;s hungry.",
				example: <strong>Elle a faim.</strong>,
				label: "avoir faim",
				meaning: "to be hungry",
				soundFile: "audio/lo6/grammar/elle-a-faim.mp3",
			},
			{
				english: "He&apos;s frightened.",
				example: <strong>Il a peur.</strong>,
				label: "avoir peur",
				meaning: "to be frightened",
				soundFile: "audio/lo6/grammar/il-a-peur.mp3",
			},
			{
				english: "Are you / do you feel cold?",
				example: <strong>Tu as froid ?</strong>,
				label: "avoir froid",
				meaning: "to be / feel cold",
				soundFile: "audio/lo6/grammar/tu-as-froid.mp3",
			},
			{
				english: "Are you hot / do you feel hot?",
				example: <strong>Vous avez chaud ?</strong>,
				label: "avoir chaud",
				meaning: "to be / feel hot",
				soundFile: "audio/lo6/grammar/vous-avez-chaud.mp3",
			},
		];

		return (
			<div
				className={`lo6-grammar2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<h3>2. The verb <em>avoir</em></h3>
				{/* h4→grammar-sub-heading: replaces old inline Tailwind style */}
				<h4 className="grammar-sub-heading">Verbs in French continued</h4>
				<p>
						<AudioClip className={`link`} soundFile={`audio/lo6/grammar/avoir.mp3`}>
							<strong>Avoir</strong>
						</AudioClip>
						{" "}is one of the many irregular verbs in French. It means <strong>to have</strong>,
						for example{" "}
						<AudioClip className={`link`} soundFile={`audio/lo6/grammar/j-ai-une-soeur.mp3`}>
							J'ai une soeur
						</AudioClip>
						{" "}meaning I have a sister.
					</p>
					<p>It occurs very frequently and so is worth memorising if possible.</p>
					<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
						<TableHeader className="sr-table-head">
							<TableRow>
								<TableHead scope="col">French</TableHead>
								<TableHead scope="col">English</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{avoirRows.map((row, index) => (
								<TableRow
									className="cursor-pointer has-audio-row"
									key={`${id || "lo6-grammar2"}-avoir-row-${index}`}
									onClick={(event) => this.handleRowClick(row.soundFile, event)}
								>
									<TableCell className="cursor-pointer">
										<AudioClip className="link" soundFile={row.soundFile}>
											<span dangerouslySetInnerHTML={{ __html: row.french }} />
										</AudioClip>
									</TableCell>
									<TableCell className="cursor-pointer">{row.english}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Separator className="my-4 bg-border-subtle" />
					<p>
						The verb <strong>avoir</strong> occurs in some expressions when in English the
						verb <strong>to be</strong> or sometimes <strong>to feel</strong> would be used.
						Here are some of these expressions:
					</p>
					<Table aria-label="Expression, meaning, example, and translation" className="grammar-audio-table">
						<TableHeader className="sr-table-head">
							<TableRow>
								<TableHead scope="col">Expression</TableHead>
								<TableHead scope="col">Meaning</TableHead>
								<TableHead scope="col">Example</TableHead>
								<TableHead scope="col">Translation</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{expressionRows.map((row, index) => (
								<TableRow
									className="cursor-pointer has-audio-row"
									key={`${id || "lo6-grammar2"}-expression-row-${index}`}
									onClick={(event) => this.handleRowClick(row.soundFile, event)}
								>
									<TableCell className="cursor-pointer"><strong>{row.label}</strong></TableCell>
									<TableCell className="cursor-pointer">{row.meaning}</TableCell>
									<TableCell className="cursor-pointer">
										e.g.{" "}
										<AudioClip className="link" soundFile={row.soundFile}>
											{row.example}
										</AudioClip>
									</TableCell>
									<TableCell className="cursor-pointer">
										<span dangerouslySetInnerHTML={{ __html: row.english }} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
			</div>
		);
	};
}

export class FamilyFriendsAndNeighboursDoubleLlPractice extends PureComponent {
	handleCardClick = (soundFile, event) => {
		if (!soundFile) return;
		if (event?.defaultPrevented) return;

		const targetNode = event?.target;
		if (targetNode instanceof Element && targetNode.closest(".audio-link, .audio-container")) {
			return;
		}

		const cardEl = event?.currentTarget;
		const audioTrigger = cardEl?.querySelector(".audio-container, button.audio-link");
		if (audioTrigger instanceof HTMLElement) {
			audioTrigger.click();
			return;
		}

		playAudioLink(soundFile);
	};

	handleCardKeyDown = (soundFile, event) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		this.handleCardClick(soundFile, event);
	};

	render = () => {
		const { id } = this.props;
		const practiceBlocks = [
			{
				audioFile: "audio/lo6/exercises/double-ll-rhyme-la-famille-de-camille.mp3",
				audioLabel: "La famille de Camille",
				lines: [
					<>La <strong>famille</strong> de <strong>Camille</strong> habite à Paris.</>,
					<>La <strong>fille</strong> de <strong>Camille</strong> est très <strong>gentille</strong>.</>,
					<>La <strong>fille</strong> de sa <strong>fille</strong> <strong>s'appelle Myrtille</strong>.</>,
					<><strong>Camille</strong> aime les <strong>tilleuls</strong> de <strong>Versailles</strong>.</>,
				],
				note: "les tilleuls - lime trees",
			},
			{
				audioFile: "audio/lo6/exercises/double-ll-rhyme-annabelle-a-une-petite-fille.mp3",
				audioLabel: "Annabelle a une petite-fille",
				lines: [
					<><strong>Annabelle</strong> a une <strong>petite-fille</strong>.</>,
					<><strong>Elle s'appelle Isabelle</strong>.</>,
					<><strong>Isabelle</strong> n'est pas <strong>belle</strong>.</>,
					<>Mais <strong>Isabelle</strong> est très <strong>gentille</strong>.</>,
					<><strong>Isabelle</strong> habite à <strong>Lille</strong>.</>,
					<><strong>Elle</strong> y habite avec <strong>Gilles</strong>.</>,
					<>Ce n'est pas très <strong>tranquille</strong>.</>,
					<>Mais <strong>quelle belle ville</strong>, la <strong>ville</strong> de <strong>Lille</strong>!</>,
				],
			},
		];

		return (
			<div
				className={`lo6-double-ll-practice-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="lo6-reference-texts">
					{practiceBlocks.map(({ audioFile, audioLabel, lines, note }, index) => (
						<article
							aria-label={`Play ${audioLabel}`}
							className="lo6-reference-block lo6-reference-audio-card"
							key={`${id || "doubleLlPractice"}-block-${index}`}
							onClick={(event) => this.handleCardClick(audioFile, event)}
							onKeyDown={(event) => this.handleCardKeyDown(audioFile, event)}
							role="button"
							tabIndex={0}
						>
							{/* <p>→<div>: WAVE flags <p> with bold content as possible heading */}
						<div className="lo6-reference-title">
								<span className="lo6-reference-audio-label">
									<AudioClip className="super-compact-speaker" soundFile={audioFile} />
									<strong>{audioLabel}</strong>
								</span>
								{note ? <small>{note}</small> : null}
							</div>
							{lines.map((line, lineIndex) => (
								<div className="lo6-reference-line" key={`${id || "doubleLlPractice"}-block-${index}-line-${lineIndex}`}>
									{line}
								</div>
							))}
						</article>
					))}
					{/* <p>→<div>: WAVE flags <p> with bold/short content as possible heading */}
					<div className="lo6-reference-meta">
						<small>&copy; Jacqueline Rosen</small>
					</div>
				</div>
				{/* <p>→<div>: WAVE flags short <p> as possible heading */}
				<div className="lo6-reading-meta">Try reading the rhymes aloud to practice your pronunciation.</div>
			</div>
		);
	};
}
