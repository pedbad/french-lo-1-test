import { AudioClip } from "@/components/AudioClip";
import { SequenceAudioController } from "@/components/SequenceAudioController";
import { resolveAsset } from "@/utils/assets";
import { Component } from "react";

export class DailyRoutineASummersDay extends Component {

	constructor(props) {
		super(props);
		const rowsAnswered = new Array(12).fill(false);
		const userChose = new Array(12);
		this.state = ({
			allAnswered: false,
			nCorrect: 0,
			rowsAnswered: rowsAnswered,
			// test: false,
			userChose: userChose,
		});
		// this.answerRow = this.answerRow.bind(this);
	}

	isTrue = (entry) => {
		// console.log("isTrue", entry, index);
		return entry === true;
	};

	answerRow = (rowNum, answer, correct) => {
		const {
			rowsAnswered,
			userChose
		} = this.state;
		let {
			allAnswered,
			nCorrect,
		} = this.state;
		const { showDialog } = this.props;

		rowsAnswered[rowNum] = true;
		userChose[rowNum] = answer;
		if (correct) nCorrect++;
		allAnswered = rowsAnswered.every(this.isTrue);
		this.setState({
			allAnswered: allAnswered,
			nCorrect: nCorrect,
			rowsAnswered: rowsAnswered,
			userChose: userChose
		});

		if (allAnswered && nCorrect === 12)showDialog("Félicitations !");
	};

	handleChange = (e) => {
		if (e.target.id === 'testTrue') {
			this.setState({
				test: true,
			});
		} else {
			this.setState({
				test: false,
			});
		}
	};

	render = () => {
		const {
			id,
			logError,
			showDialog,
		} = this.props;
		const {
			allAnswered,
		} = this.state;

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
				className={`panel`}
				id={id ? `${id}Panel` : undefined}
				key={`${id}CustomComponent`}
			>
				<img src={resolveAsset(`images/girl_breakfast.png`)} title={`Girl having breakfast in the garden`} />
				<div className={`instructions`}>
					<p className={`instruction`}>Listen to Véronique describing a typical summer's day. Then decide whether the following statements are true (vrai) of false (faux).</p>
					<AudioClip className={``} soundFile={`sounds/fr/LO13EX4.mp3`} />

					<div id={`${id}passage`} className={`passage ${allAnswered ? 'show' : 'hide'}`}>
						<p>En été, je me lève vers six heures le week-end, je m'habille et je me promène dans le village. J'aime être dehors quand il fait beau.
							Puis, après, je prends une douche rapide et je prépare mon petit déjeuner. Je prends un bol de céréales et je bois deux tasses
							de café-crème.
							J'ai un grand jardin avec beaucoup de fleurs et trois arbres et j'aime faire du jardinage. Souvent, je passe la matinée entière
							dans le jardin.
							Je passe l'après-midi avec des amis. Parfois, nous allons en ville, parfois nous restons simplement à la maison. S'il fait chaud,
							je dîne dans le jardin ou sur le balcon. Le soir, je me détends.
						</p>
					</div>
				</div>
				<RadioQuiz
					config={RQConfig}
					logError={logError}
					showDialog={showDialog}
					onComplete={() => this.setState({allAnswered: true})}
				/>
			</div>
		);
	};
}

