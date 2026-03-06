import { AudioClip } from "@/components/AudioClip";
import { Figure } from "@/components/Figure";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class DailyRoutineGrammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo13-grammar-container container`}
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
							<p>The French subject pronoun <AudioClip className={`link`} soundFile={`sounds/fr/on.mp3`}><strong>on</strong></AudioClip> literally
								means <strong>'one'</strong> but is generally translated as <strong>they</strong>, <strong>you</strong>, <strong>people</strong> and is very often used instead
								of <AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><strong>nous</strong></AudioClip> to mean <strong>we</strong> in spoken French.</p>
							<p>It is always used with the third
								person singular of the verb.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/On parle français ici.mp3`}><strong>On parle français ici</strong></AudioClip>. French is spoken here.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/On va au cinéma.mp3`}><strong>On va au cinéma ?</strong></AudioClip> Are we going / Shall we go to the cinema?</p>
						</li>
						<li>
							<p>In French there are some verbs called <strong>reflexive verbs</strong>. These are verbs where the subject and object are the same.
								You can recognise a reflexive verb in the infinitive form by the word se in front of the
								verb e,g. <AudioClip className={`link`} soundFile={`sounds/fr/se laver.mp3`}><strong>se laver</strong></AudioClip> - to
									wash (oneself), <AudioClip className={`link`} soundFile={`sounds/fr/se reposer.mp3`}><strong>se reposer</strong></AudioClip> -
										to rest (oneself). Some reflexive verbs are regular verbs and some are irregular.</p>
							<p>Reflexive verbs always have a reflexive pronoun (<AudioClip className={`link`} soundFile={`sounds/fr/me.mp3`}><strong>me</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/te.mp3`}><strong>te</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/se.mp3`}><strong>se</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><strong>nous</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><strong>vous</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/se.mp3`}><strong>se</strong></AudioClip>) between the subject and the verb.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je me lave.mp3`}><strong>Je me lave</strong></AudioClip> - I wash myself / I have a
									wash. <AudioClip className={`link`} soundFile={`sounds/fr/Elle se repose.mp3`}><strong>Elle se repose</strong></AudioClip> – she's resting herself / she's having a rest.</p>

							<p>Here is an example of a reflexive verb in the present tense:</p>

							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/se reposer.mp3`}><strong>se reposer</strong></AudioClip></TableCell><TableCell>to rest (oneself)</TableCell>
									</TableRow>
									<TableRow><TableCell>&nbsp;</TableCell></TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je me repose.mp3`}><strong>je me repose</strong></AudioClip></TableCell><TableCell>I rest / I am resting (myself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu te reposes.mp3`}><strong>tu te reposes</strong></AudioClip></TableCell><TableCell>you rest / you are resting (yourself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il se repose.mp3`}><strong>il se repose</strong></AudioClip></TableCell><TableCell>he rests / he is resting (himself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Elle se repose.mp3`}><strong>elle se repose</strong></AudioClip></TableCell><TableCell>she rests / she is resting (herself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on se repose.mp3`}><strong>on se repose</strong></AudioClip></TableCell><TableCell>people /we rest / we are resting (themselves / ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous nous reposons.mp3`}><strong>nous nous reposons</strong></AudioClip></TableCell><TableCell>we rest / we are resting (ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous vous reposez.mp3`}><strong>vous vous reposez</strong></AudioClip></TableCell><TableCell>you rest / you are resting (yourself / yourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils se reposent, elles se reposent.mp3`}><strong>ils / elles se reposent</strong></AudioClip></TableCell><TableCell>they rest / theyare resting (themselves)</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p>If the verb begins with a vowel, then the reflexive pronouns are <strong>s'</strong>, <strong>t'</strong>, <strong>s'</strong>, <strong>nous</strong>, <strong>vous</strong>, <strong>s'</strong>. Below is
								the verb <AudioClip className={`link`} soundFile={`sounds/fr/s'appeler.mp3`}><strong>s'appeler</strong></AudioClip> - to be called which illustrates this.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`audio/lo1/vocabulary/022-je-mappelle.mp3`}><strong>je m'appelle</strong></AudioClip></TableCell><TableCell>I am called (I call myself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu t'appelles.mp3`}><strong>tu t'appelles</strong></AudioClip></TableCell><TableCell>you are called (you call yourself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il s'appelle.mp3`}><strong>il s'appelle</strong></AudioClip></TableCell><TableCell>he is called (he calls himself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle s'appelle.mp3`}><strong>elle s'appelle</strong></AudioClip></TableCell><TableCell>she is called (she calls herself)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/on s'appelle.mp3`}><strong>on s'appelle</strong></AudioClip></TableCell><TableCell>they / we are called (they call themselves / we call ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous nous appelons.mp3`}><strong>nous nous appelons</strong></AudioClip></TableCell><TableCell>we are called (we call ourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous vous appelez.mp3`}><strong>vous vous appelez</strong></AudioClip></TableCell><TableCell>you are called (you call yourself / yourselves)</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils s'appellent, elles s'appellent.mp3`}><strong>ils / elles s'appellent</strong></AudioClip></TableCell><TableCell>they / are called (they call themselves)</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}
