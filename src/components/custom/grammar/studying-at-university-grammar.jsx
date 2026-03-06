import { AudioClip } from "@/components/AudioClip";
import { Figure } from "@/components/Figure";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class StudyingAtUniversityGrammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo14-grammar-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<ol>
						<li>
							<p>Sometimes literal translation works very well, but there are times when the rendering might not sound idiomatic.
								An example of this is when asking what people like, prefer, do etc. Using a construction
								with <AudioClip className={`link`} soundFile={`sounds/fr/comme.mp3`}><strong>comme</strong></AudioClip> is an idiomatic way of
								asking the question:</p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Qu'est-ce que vous faites comme sports.mp3`}>Qu'est-ce que vous faites <strong>comme</strong> sports ?</AudioClip></TableCell><TableCell>What sports do you do?</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Qu'est-ce que tu aimes comme musique.mp3`}>Qu'est-ce que tu aimes <strong>comme</strong> musique ?</AudioClip></TableCell><TableCell>What sort of music do you like?</TableCell></TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>The irregular verb <AudioClip className={`link`} soundFile={`sounds/fr/devoir.mp3`}><strong>devoir</strong></AudioClip> means "to have to." It is used together with another verb in its infinitive form.</p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je dois partir à trois heures.mp3`}><strong>Je dois partir</strong> à trois heures.</AudioClip></TableCell><TableCell>I have to leave at 3 o'clock.</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ils doivent travailler très dur.mp3`}><strong>Ils doivent travailler</strong> très dur.</AudioClip></TableCell><TableCell>They have to work hard.</TableCell></TableRow>
								</TableBody>
							</Table>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/devoir.mp3`}><strong>devoir</strong></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je dois.mp3`}>je dois</AudioClip></TableCell><TableCell>I have to / I must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu dois.mp3`}>tu dois</AudioClip></TableCell><TableCell>you have to / you must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il doit, elle doit.mp3`}>il / elle doit</AudioClip></TableCell><TableCell>he / she has to — he / she must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on doit.mp3`}>on doit</AudioClip></TableCell><TableCell>people / we have to — people / we must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous devons.mp3`}>nous devons</AudioClip></TableCell><TableCell>we have to — we must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous devez.mp3`}>vous devez</AudioClip></TableCell><TableCell>you have to / you must</TableCell></TableRow>
									<TableRow><TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils doivent, elles doivent.mp3`}>ils / elles doivent</AudioClip></TableCell><TableCell>they have to / they must</TableCell></TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>The irregular verb <AudioClip className={`link`} soundFile={`sounds/fr/pouvoir.mp3`}><strong>pouvoir</strong></AudioClip> means
								"to be able to." It is used together with another verb in its infinitive form.</p>
							<p>Je peux répondre à votre question tout de suite. — I can answer your question right away.
								Vous pouvez ouvrir la fenêtre, s'il vous plaît ? — Can you open the window, please?</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/pouvoir.mp3`}><strong>pouvoir</strong></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je peux.mp3`}>je peux</AudioClip></TableCell>
										<TableCell>I am able to / I can / I may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu peux.mp3`}>tu peux</AudioClip></TableCell>
										<TableCell>you are able to / you can / you may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il peut.mp3`}>il peut</AudioClip></TableCell>
										<TableCell>he is able to / he can / he may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle peut.mp3`}>elle peut</AudioClip></TableCell>
										<TableCell>she is able to / she can / she may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on peut.mp3`}>on peut</AudioClip></TableCell>
										<TableCell>people / we are able to / can / may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous pouvons.mp3`}>nous pouvons</AudioClip></TableCell>
										<TableCell>we are able to / we can / we may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous pouvez.mp3`}>vous pouvez</AudioClip></TableCell>
										<TableCell>you are able to / you can / you may</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils peuvent, elles peuvent.mp3`}>ils / elles peuvent</AudioClip></TableCell>
										<TableCell>they are able to / they can / they may</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>

						<li>
							<p>In French there are present and past participles:</p>

							<p><strong>i. Present Participles</strong></p>

							<p>In English the present participle ends in <em>-ing</em> (e.g. interesting, encouraging).
								In French the present participle is the verb form that ends in <em>-ant</em>. Present participles can often be used as adjectives:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est fatigant.mp3`}>C'est fatigant</AudioClip></TableCell>
										<TableCell>It's tiring</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est motivant.mp3`}>C'est motivant</AudioClip></TableCell>
										<TableCell>It's motivating</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/C'est intéressant.mp3`}>C'est intéressant</AudioClip></TableCell>
										<TableCell>It's interesting</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<p><strong>ii. Past Participles</strong><br/>
								Examples of past participles in English are: tired, motivated, fascinated.
								In French many past participles end in <strong>-é</strong>. These are the past participles of <strong>-er</strong> verbs. Past participles can often be used as adjectives:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je suis fatigué.mp3`}>Je suis fatigué.e</AudioClip></TableCell>
										<TableCell>I am tired</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Les étudiants sont très motivés.mp3`}>Les étudiants sont très motivés</AudioClip></TableCell>
										<TableCell>The students are very motivated</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il est fasciné.mp3`}>Il est fasciné</AudioClip></TableCell>
										<TableCell>He is fascinated</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<p><strong>NB:</strong> Present and past participles used as adjectives must agree in gender and number with the noun they are describing.</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}
