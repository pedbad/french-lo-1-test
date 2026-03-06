import { AudioClip } from "@/components/AudioClip";
import { Attribution } from "@/components/Attribution";
import { Figure } from "@/components/Figure";
import { RadioQuiz } from "@/components/RadioQuiz";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class GoingToACafeGrammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo11-grammar-container container`}
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
							<p>To express what you would like <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais.mp3`}><strong>Je voudrais</strong></AudioClip> is
								the form of verb that you use. e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais une glace.mp3`}><strong>Je voudrais
									une glace</strong></AudioClip> I'd like an ice-cream.
								This is the present conditional of the verb <AudioClip className={`link`} soundFile={`sounds/fr/vouloir.mp3`}><strong>vouloir</strong></AudioClip>.
								To express what you would like to do, you add another verb in the infinitive form.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais aller au marché demain.mp3`}><strong>Je voudrais aller au
									marché demain</strong></AudioClip>. I'd like
								to go to the market tomorrow.<br /><br />

								You can see the forms for all the persons of the verb below:</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais.mp3`}><strong>je voudrais</strong></AudioClip></TableCell>
										<TableCell>I would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu voudrais.mp3`}><strong>tu voudrais</strong></AudioClip></TableCell>
										<TableCell>you would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il voudrais. Elle voudrais.mp3`}><strong>il / elle voudrait</strong></AudioClip></TableCell>
										<TableCell>he / she would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous voudrions.mp3`}><strong>nous voudrions</strong></AudioClip></TableCell>
										<TableCell>we would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous voudriez.mp3`}><strong>vous voudriez</strong></AudioClip></TableCell>
										<TableCell>you would like</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils voudraient. elles voudraient.mp3`}><strong>ils / elles voudraient</strong></AudioClip></TableCell>
										<TableCell>they would like</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><strong>prendre</strong></AudioClip> is a frequently occurring irregular
								verb. It means <strong>to take</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je prends le bus pour aller au centre-ville.mp3`}><strong>Je prends le bus pour aller au centre-ville</strong></AudioClip>.
								I take the bus to go to the town centre.
							<AudioClip className={`link`} soundFile={`sounds/fr/Prenez la première rue à droite !.mp3`}><strong>Prenez la première rue à droite !</strong></AudioClip> Take the first
								turning on the
								right! <AudioClip className={`link`} soundFile={`sounds/fr/Il prend une douche.mp3`}><strong>Il prend une douche</strong></AudioClip>. He's taking a shower.</p>
							<p>NB In English we say: <em><strong>I'm having</strong> a coffee</em> or <em><strong>I have</strong> breakfast at 8 o'clock</em>. In French, it is incorrect to use <strong>avoir</strong> in
								this context, you use <AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><strong>prendre</strong></AudioClip> instead
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je prends un café.mp3`}><strong>Je prends un café</strong></AudioClip> or <AudioClip className={`link`} soundFile={`sounds/fr/Je prends mon petit déjeuner à huit heures.mp3`}><strong>Je prends mon petit déjeuner à huit heures</strong></AudioClip>.</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/prendre.mp3`}><strong>Prendre</strong></AudioClip></p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je prends.mp3`}><strong>je prends</strong></AudioClip></TableCell>
										<TableCell> I take / have - I am taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu prends.mp3`}><strong>tu prends</strong></AudioClip></TableCell>
										<TableCell> you take / have - you are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il prend. elle prend.mp3`}><strong>il / elle prend</strong></AudioClip></TableCell>
										<TableCell>He / she takes / has – he/she is taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous prenons.mp3`}><strong>nous prenons</strong></AudioClip></TableCell>
										<TableCell>we take / have - we are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous prenez.mp3`}><strong>vous prenez</strong></AudioClip></TableCell>
										<TableCell>you take / have - you are taking / having</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils prennent. elles prennent.mp3`}><strong>ils / elles prennent</strong></AudioClip></TableCell>
										<TableCell>they take / have - they are taking / having</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li><p><strong>Flavours, filling and toppings</strong></p>
							<p>To describe the flavours, filling and toppings of food stuffs, you use the preposition <strong>à</strong> with the definite article: <strong>au</strong>, <strong>à la</strong>, <strong>à l'</strong>, <strong>aux</strong> e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Pour moi un sandwich au fromage.mp3`}><strong>Pour moi un sandwich au fromage</strong></AudioClip></TableCell>
										<TableCell>A cheese sandwich for me.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je voudrais une glace à la vanille.mp3`}><strong>Je voudrais une glace à la vanille</strong></AudioClip></TableCell>
										<TableCell>I'd like a vanilla ice-cream.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/J'aime la sauce à l'orange.mp3`}><strong>J'aime la sauce à l'orange</strong></AudioClip></TableCell>
										<TableCell>I like the orange sauce.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous prenez une omelette aux champignons.mp3`}><strong>Vous prenez une omelette aux champignons ?</strong></AudioClip></TableCell>
										<TableCell>Are you having a mushroom omelette?</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>In French there are some pronouns called <strong>disjunctive pronouns</strong> (or <strong>stressed pronouns</strong>). They are listed below.
								They are the pronouns which are used after prepositions such as <AudioClip className={`link`} soundFile={`sounds/fr/pour.mp3`}><strong>pour</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/avec.mp3`}><strong>avec</strong></AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/sans.mp3`}><strong>sans</strong></AudioClip> etc. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Pour moi un café s'il vous plait.mp3`}><strong>Pour moi un café s'il vous plait</strong></AudioClip></TableCell>
										<TableCell>A coffee for me please.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Les enfants ne veulent pas jouer au football sans lui.mp3`}><strong>Les enfants ne veulent pas jouer au football sans lui</strong></AudioClip></TableCell>
										<TableCell>The children don't want to play football without him.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je travaille avec eux.mp3`}><strong>Je travaille avec eux</strong></AudioClip></TableCell>
										<TableCell>I work with them.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<br/>
							<Table>
								<thead>
									<TableRow><th>Subject pronouns&nbsp;&nbsp;&nbsp;</th><th>Disjunctive pronouns</th></TableRow>
								</thead>
								<TableBody>
									<TableRow>
										<TableCell>je</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/moi.mp3`}><strong>moi</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>tu</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/toi.mp3`}><strong>toi</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>il</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/lui.mp3`}><strong>lui</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>elle</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle.mp3`}><strong>elle</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>nous</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous.mp3`}><strong>nous</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>vous</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous.mp3`}><strong>vous</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ils</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/eux.mp3`}><strong>eux</strong></AudioClip></TableCell>
									</TableRow>
									<TableRow>
										<TableCell>elles</TableCell>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elles.mp3`}><strong>elles</strong></AudioClip></TableCell>
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
