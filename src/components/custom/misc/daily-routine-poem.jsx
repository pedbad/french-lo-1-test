import { SequenceAudioController } from "@/components/SequenceAudioController";
import { RadioQuiz } from "@/components/exercises/RadioQuiz";
import { Info } from "@/components/Info";
import { resolveAsset } from "@/utils/assets";
import { Component } from "react";

export class DailyRoutineASummersDay extends Component {
	render = () => {
		const {
			id,
			logError,
			showDialog,
		} = this.props;

		const RQConfig = {
			"component": "RadioQuiz",
			"id": "L13SummersDayRadioQuiz",
			"options": [
				"Vrai",
				"Faux"
			],
			"phrases": [
				[
					"Véronique se lève vers 7 heures le week-end.",
					1,
					"Véronique se lève vers 6 heures le week-end.",
					""
				],
				[
					"Elle se promène en ville.",
					1,
					"Elle se promène dans le village.",
					""
				],
				[
					"Elle aime être dehors quand il fait beau.",
					0,
					"",
					""
				],
				[
					"Après sa promenade, Véronique prend un bain.",
					1,
					"Elle prend une douche rapide.",
					""
				],
				[
					"Elle prend un bol de yaourt.",
					1,
					"Elle prend un bol de céréales.",
					""
				],
				[
					"Elle boit du café-crème.",
					0,
					"",
					""
				],
				[
					"Dans le jardin il y a deux arbres.",
					1,
					"Dans le jardin il y a trois arbres.",
					""
				],
				[
					"Véronique passe une heure dans le jardin.",
					1,
					"Véronique passe la matinée entière dans le jardin.",
					""
				],
				[
					"Elle passe l'après-midi avec ses parents.",
					1,
					"Elle passe l'après-midi avec ses amis.",
					""
				],
				[
					"Parfois, ils vont en ville.",
					0,
					"",
					""
				],
				[
					"Elle dîne dans la salle à manger.",
					1,
					"Elle dîne dans le jardin ou sur le balcon.",
					""
				],
				[
					"Le soir, elle se détend.",
					0,
					"",
					""
				]
			],
		};

		return (
			<div
				className="panel space-y-4"
				id={id ? `${id}Panel` : undefined}
				key={`${id}CustomComponent`}
			>
				<div className="space-y-3">
					<Info informationTextHTML="<p>Listen to Véronique describing a typical summer&apos;s day. Then decide whether the following statements are true (<em>vrai</em>) or false (<em>faux</em>).</p>" />
					<div className="w-full space-y-1">
						<SequenceAudioController sources={[resolveAsset("audio/lo13/exercises/015-a-summers-day.mp3")]} />
					</div>
				</div>
				<RadioQuiz
					config={RQConfig}
					logError={logError}
					showDialog={showDialog}
				/>
			</div>
		);
	};
}
