import { AudioClip } from "@/components/AudioClip";
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

export class MakingArrangementsGrammarVouloir extends PureComponent {
	render = () => {
		const { id } = this.props;
		const vouloirRows = [
			{
				english: "I want",
				french: <>je veux</>,
				soundFile: "audio/lo10/grammar/vouloir/002-je-veux.mp3",
			},
			{
				english: "you want",
				french: <>tu veux</>,
				soundFile: "audio/lo10/grammar/vouloir/003-tu-veux.mp3",
			},
			{
				english: "he / she wants",
				french: <>il / elle veut</>,
				soundFile: "audio/lo10/grammar/vouloir/004-il-elle-veut.mp3",
			},
			{
				english: "we want",
				french: <>nous voulons</>,
				soundFile: "audio/lo10/grammar/vouloir/005-nous-voulons.mp3",
			},
			{
				english: "you want",
				french: <>vous voulez</>,
				soundFile: "audio/lo10/grammar/vouloir/006-vous-voulez.mp3",
			},
			{
				english: "they want",
				french: <>ils / elles veulent</>,
				soundFile: "audio/lo10/grammar/vouloir/007-ils-elles-veulent.mp3",
			},
		];

		const exampleRows = [
			{
				english: "I want to go to Canada.",
				french: <>Je veux aller au Canada.</>,
				soundFile: "audio/lo10/grammar/vouloir/008-je-veux-aller-au-canada.mp3",
			},
			{
				english: "My girlfriend wants to study in France.",
				french: <>Ma copine veut étudier en France.</>,
				soundFile: "audio/lo10/grammar/vouloir/009-ma-copine-veut-etudier-en-france.mp3",
			},
			{
				english: "My friends want to spend the weekend in London.",
				french: <>Mes amis veulent passer le week-end à Londres.</>,
				soundFile: "audio/lo10/grammar/vouloir/010-mes-amis-veulent-passer-le-week-end-a-londres.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>1. Using <em>vouloir</em> to make plans</h3>
				<p>
					Use{" "}
					<AudioClip className="link" soundFile="audio/lo10/grammar/vouloir/001-vouloir.mp3">
						<strong>vouloir</strong>
					</AudioClip>
					{" "}to say what someone wants to do. It is very common when inviting
					someone somewhere or agreeing on plans.
				</p>
				{/* p→div: short label triggers WAVE "possible heading" */}
				<GrammarLabel>Here is the present tense:</GrammarLabel>
				<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
					<TableHeader className="sr-table-head">
						<TableRow>
							<TableHead scope="col">French</TableHead>
							<TableHead scope="col">English</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{vouloirRows.map((row, index) => (
							<TableRow
								className="cursor-pointer has-audio-row"
								key={`${id || "lo10-grammar1"}-vouloir-row-${index}`}
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
				<p className="mt-4">
					After <strong>vouloir</strong>, the next verb stays in the infinitive.
				</p>
				<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
					<TableHeader className="sr-table-head">
						<TableRow>
							<TableHead scope="col">French</TableHead>
							<TableHead scope="col">English</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{exampleRows.map((row, index) => (
							<TableRow
								className="cursor-pointer has-audio-row"
								key={`${id || "lo10-grammar1"}-example-row-${index}`}
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
			</div>
		);
	};
}

export class MakingArrangementsGrammarPrepositionA extends PureComponent {
	render = () => {
		const { id } = this.props;
		const prepositionRows = [
			{
				english: "I work at the laboratory.",
				french: <>Je travaille au laboratoire.</>,
				soundFile: "audio/lo10/grammar/preposition-a/001-je-travaille-au-laboratoire.mp3",
			},
			{
				english: "Do you want to go to the swimming pool?",
				french: <>Tu veux aller à la piscine ?</>,
				soundFile: "audio/lo10/grammar/preposition-a/002-tu-veux-aller-a-la-piscine.mp3",
			},
			{
				english: "She wants to go to the exhibition.",
				french: <>Elle veut aller à l&apos;exposition.</>,
				soundFile: "audio/lo10/grammar/preposition-a/003-elle-veut-aller-a-l-exposition.mp3",
			},
			{
				english: "I like going to the shops.",
				french: <>J&apos;aime aller aux magasins.</>,
				soundFile: "audio/lo10/grammar/preposition-a/004-jaime-aller-aux-magasins.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>2. Using <em>à</em> with places</h3>
				<p>
					The preposition <strong>à</strong> often means <strong>to</strong>,
					{" "}<strong>at</strong>, or <strong>in</strong> before a common noun.
					French contracts it depending on the noun that follows:
					{" "}<strong>au</strong> before a masculine noun, <strong>à la</strong>
					{" "}before a feminine noun, <strong>à l&apos;</strong> before a vowel or
					silent <strong>h</strong>, and <strong>aux</strong> before a plural noun.
				</p>
				{/* p→div: short label triggers WAVE "possible heading" */}
				<GrammarLabel>Compare these examples:</GrammarLabel>
				<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
					<TableHeader className="sr-table-head">
						<TableRow>
							<TableHead scope="col">French</TableHead>
							<TableHead scope="col">English</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{prepositionRows.map((row, index) => (
							<TableRow
								className="cursor-pointer has-audio-row"
								key={`${id || "lo10-grammar2"}-row-${index}`}
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
			</div>
		);
	};
}
