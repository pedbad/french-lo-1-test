import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						In French, the gender of the noun has implications for the <strong>possessive
						adjectives</strong>.
						{" "}There are two ways of saying <strong>my</strong> for singular nouns in French:
						{" "}
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
						, and <strong>ma</strong> for feminine nouns, for example{" "}
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
						.
					</p>
					<p>Here is a complete list of the possessive adjectives:</p>
					<Table>
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
									<span className="ped-warn text-base font-bold leading-none">*</span>
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
							<span className="ped-warn text-base font-bold">*</span>{" "}
							All of these can mean <strong>his</strong> or <strong>her</strong>. The gender
							of the noun, not the owner, is the factor to consider.
						</p>
					</Info>
				</div>
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
				<div
					className={`panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p><strong>Verbs in French continued</strong></p>
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
					<Table>
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
					<Table>
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
			</div>
		);
	};
}
