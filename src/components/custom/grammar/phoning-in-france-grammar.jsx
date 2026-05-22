import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";
import { playAudioLink } from "@/utils/audioPlayback";
import { PhoningInFranceRegionsMap } from "./phoning-in-france-regions-map";

export class PhoningInFranceGrammarTelephoneNumbers extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div id={id || undefined}>
				<h3>1. Telephone numbers in France</h3>
				{/* id="RegionalTelephoneMap" required — all map CSS is scoped to this id */}
				<div id="RegionalTelephoneMap">
					<div className="lo9-figure-container">
						<PhoningInFranceRegionsMap />
					</div>
					<div className="mt-4">
						<Info variant="warning">
							{/* h4→p: heading inside an Info box is redundant */}
							<p>
								<strong>NB</strong> Within France, telephone numbers usually have
								ten digits. For landlines, the first two digits are the area code.
							</p>
							{/* p→div: short <p> triggers WAVE "possible heading" */}
							<div>
								Mobile numbers usually begin with <strong>06</strong> or{" "}
								<strong>07</strong>.
							</div>
							<p>
								Telephone numbers are normally spoken in two-digit groups, for
								example{" "}
								<AudioClip
									className="link"
									soundFile="audio/lo9/grammar/telephone-regions/006-example-mobile-number.mp3"
								>
									07 11 15 22 55
								</AudioClip>
							</p>
						</Info>
					</div>
				</div>
			</div>
		);
	};
}

export class PhoningInFranceGrammarBienForConfirmation extends PureComponent {
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
		const confirmationRows = [
			{
				english: "This is 06 22 14 66 33, isn&apos;t it?",
				french: "C&apos;est bien le 06 22 14 66 33 ?",
				soundFile: "audio/lo9/grammar/bien-for-confirmation/002-cest-bien-le-06-22-14-66-33.mp3",
			},
			{
				english: "That&apos;s right. / It is indeed.",
				french: "C&apos;est bien ça !",
				soundFile: "audio/lo9/grammar/bien-for-confirmation/003-cest-bien-ca.mp3",
			},
			{
				english: "You are Madame Galipot, aren&apos;t you?",
				french: "Vous êtes bien Madame Galipot ?",
				soundFile: "audio/lo9/grammar/bien-for-confirmation/004-vous-etes-bien-madame-galipot.mp3",
			},
			{
				english: "That&apos;s right. / I am indeed.",
				french: "C&apos;est bien ça !",
				soundFile: "audio/lo9/grammar/bien-for-confirmation/003-cest-bien-ca.mp3",
			},
		];

		return (
			<div id={id || undefined}>
				<h3>2. Using <em>bien</em> for confirmation</h3>
				<p>
					<AudioClip
						className="link"
						soundFile="audio/lo9/grammar/bien-for-confirmation/001-bien.mp3"
					>
						<strong>Bien</strong>
					</AudioClip>
					{" "}usually means <strong>well</strong> or <strong>good</strong>.
					On the telephone, however, it can also help to check whether
					information is correct, a bit like <strong>isn&apos;t it?</strong> or
					<strong> that&apos;s right</strong>.
				</p>
				<Table className="grammar-audio-table" variant="learning">
					<TableHeader className="sr-only">
						<TableRow><TableHead>French</TableHead><TableHead>English</TableHead></TableRow>
					</TableHeader>
					<TableBody>
						{confirmationRows.map((row, index) => (
							<TableRow
								className="cursor-pointer has-audio-row"
								key={`${id || "lo9-grammar2"}-row-${index}`}
								onClick={(event) => this.handleRowClick(row.soundFile, event)}
							>
								<TableCell>
									<AudioClip className="link" soundFile={row.soundFile}>
										<span dangerouslySetInnerHTML={{ __html: row.french }} />
									</AudioClip>
								</TableCell>
								<TableCell>
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
