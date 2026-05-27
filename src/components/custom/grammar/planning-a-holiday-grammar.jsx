import { AudioClip } from "@/components/AudioClip";
import { Info } from "@/components/Info";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { playAudioLink } from "@/utils/audioPlayback";
import { Info as InfoIcon } from "lucide-react";
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
	<Table aria-label="French and English" className="grammar-audio-table" variant="learning">
		<TableHeader className="sr-table-head">
			<TableRow>
				<TableHead scope="col">French</TableHead>
				<TableHead scope="col">English</TableHead>
			</TableRow>
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

export class PlanningAHolidayGrammarWeather extends PureComponent {
	render = () => {
		const { id } = this.props;
		const faireRows = [
			{
				english: "It's hot.",
				french: <strong>Il fait chaud.</strong>,
				soundFile: "audio/lo15/grammar/weather/002-il-fait-chaud.mp3",
			},
			{
				english: "The weather's bad.",
				french: <strong>Il fait mauvais.</strong>,
				soundFile: "audio/lo15/grammar/weather/007-il-fait-mauvais.mp3",
			},
			{
				english: "It's cold.",
				french: <strong>Il fait froid.</strong>,
				soundFile: "audio/lo15/grammar/weather/009-il-fait-froid.mp3",
			},
			{
				english: "The weather's good.",
				french: <strong>Il fait beau.</strong>,
				soundFile: "audio/lo15/grammar/weather/010-il-fait-beau.mp3",
			},
		];
		const ilYAWeatherRows = [
			{
				english: "It's windy.",
				french: <strong>Il y a du vent.</strong>,
				soundFile: "audio/lo15/grammar/weather/004-il-y-a-du-vent.mp3",
			},
			{
				english: "It's sunny.",
				french: <strong>Il y a du soleil.</strong>,
				soundFile: "audio/lo15/grammar/weather/008-il-y-a-du-soleil.mp3",
			},
		];
		const otherWeatherRows = [
			{
				english: "It's raining.",
				french: <strong>Il pleut.</strong>,
				soundFile: "audio/lo15/grammar/weather/005-il-pleut.mp3",
			},
			{
				english: "It's snowing.",
				french: <strong>Il neige.</strong>,
				soundFile: "audio/lo15/grammar/weather/006-il-neige.mp3",
			},
		];

		return (
			<div
				className="lo15-grammar1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel1` : undefined} key={`${id}Panel1`}>
					<p>
						Weather phrases are a good example of why French cannot always be translated
						word for word. English often uses <strong>to be</strong>, but French usually
						uses verbs such as{" "}
						<AudioClip className="link" soundFile="audio/lo15/grammar/weather/001-faire.mp3">
							<strong>faire</strong>
						</AudioClip>{" "}
						or the phrase{" "}
						<AudioClip className="link" soundFile="audio/lo15/grammar/weather/003-il-y-a.mp3">
							<strong>il y a</strong>
						</AudioClip>
						.
					</p>
					<h4 className="mb-3 mt-5 text-base font-semibold">
						Weather expressions with <em>faire</em>
					</h4>
					<AudioTable rows={faireRows} tableId={`${id || "lo15-grammar1"}-faire`} />
					<h4 className="mb-3 mt-5 text-base font-semibold">
						Weather expressions with <em>il y a</em>
					</h4>
					<AudioTable rows={ilYAWeatherRows} tableId={`${id || "lo15-grammar1"}-ilya`} />
					<h4 className="mb-3 mt-5 text-base font-semibold">Other weather verbs</h4>
					<AudioTable rows={otherWeatherRows} tableId={`${id || "lo15-grammar1"}-verbs`} />
				</div>
			</div>
		);
	};
}

export class PlanningAHolidayGrammarAllerNearFuture extends PureComponent {
	render = () => {
		const { id } = this.props;
		const allerRows = [
			{
				english: "I go / am going",
				french: <strong>je vais</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/002-je-vais.mp3",
			},
			{
				english: "you go / are going",
				french: <strong>tu vas</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/003-tu-vas.mp3",
			},
			{
				english: "he / she goes / is going",
				french: <strong>il / elle va</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/004-il-va-elle-va.mp3",
			},
			{
				english: "we go / are going",
				french: <strong>nous allons</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/005-nous-allons.mp3",
			},
			{
				english: "you go / are going",
				french: <strong>vous allez</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/006-vous-allez.mp3",
			},
			{
				english: "they go / are going",
				french: <strong>ils / elles vont</strong>,
				soundFile: "audio/lo15/grammar/aller-near-future/007-ils-vont-elles-vont.mp3",
			},
		];
		const futureRows = [
			{
				english: "I'm going to spend my holidays in France.",
				french: <strong>Je vais passer mes vacances en France.</strong>,
				soundFile:
					"audio/lo15/grammar/aller-near-future/010-je-vais-passer-mes-vacances-en-france.mp3",
			},
			{
				english: "My sister is going to be 20 next week.",
				french: <strong>Ma sœur va avoir 20 ans la semaine prochaine.</strong>,
				soundFile:
					"audio/lo15/grammar/aller-near-future/011-ma-soeur-va-avoir-20-ans-la-semaine-prochaine.mp3",
			},
		];

		return (
			<div
				className="lo15-grammar2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div className="panel" id={id ? `${id}Panel2` : undefined} key={`${id}Panel2`}>
					<p>
						The verb{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo15/grammar/aller-near-future/001-aller.mp3"
						>
							<strong>aller</strong>
						</AudioClip>{" "}
						means <strong>to go</strong>, and it is especially useful when you talk
						about holiday plans.
					</p>
					<AudioTable
						rows={allerRows}
						tableId={`${id || "lo15-grammar2"}-forms`}
					/>
					<Info variant="warning">
						<p>
							<strong>NB</strong> In its literal meaning, you might hear{" "}
							<AudioClip
								className="link"
								soundFile="audio/lo15/grammar/aller-near-future/008-je-vais-en-ville.mp3"
							>
								<strong>Je vais en ville</strong>
							</AudioClip>
							. The same verb also appears in everyday greetings such as{" "}
							<AudioClip
								className="link"
								soundFile="audio/lo15/grammar/aller-near-future/009-comment-ca-va.mp3"
							>
								<strong>Comment ça va&nbsp;?</strong>
							</AudioClip>
							.
						</p>
						<p>
							<InfoIcon
								aria-hidden="true"
								className="mr-1 inline h-[1em] w-[1em] align-[-0.125em]"
							/>
							<strong>Rule</strong> To form the near future, use a present-tense form
							of <strong>aller</strong> followed by an infinitive:{" "}
							<strong>je vais + passer</strong>, <strong>elle va + visiter</strong>,{" "}
							<strong>nous allons + voyager</strong>.
						</p>
					</Info>
					<h4 className="mb-3 mt-5 text-base font-semibold">Near future</h4>
					<AudioTable
						rows={futureRows}
						tableId={`${id || "lo15-grammar2"}-future`}
					/>
				</div>
			</div>
		);
	};
}
