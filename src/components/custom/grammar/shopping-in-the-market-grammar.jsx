import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class L12Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;

		return (
			<div
				className={`lo12-grammar-container container`}
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
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><strong>aller</strong></AudioClip> is a
								frequently occurring irregular verb meaning 'to go'.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je vais.mp3`}>je vais</AudioClip></TableCell><TableCell>I go / am going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu vas.mp3`}>tu vas</AudioClip></TableCell><TableCell>you go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il va, elle va.mp3`}>il / elle va</AudioClip></TableCell><TableCell>he /she/ it goes / is going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous allons.mp3`}>nous allons</AudioClip></TableCell><TableCell>we go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous allez.mp3`}>vous allez</AudioClip></TableCell><TableCell>you go / are going</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils vont, elles vont.mp3`}>ils / elles vont</AudioClip></TableCell><TableCell>they go / are going</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p>e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je vais en ville.mp3`}>Je vais en ville</AudioClip>.</TableCell><TableCell>I'm going into town.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Mélanie va au marché le mardi.mp3`}>Mélanie va au marché le mardi</AudioClip>.</TableCell><TableCell>Mélanie goes to the market on Tuesdays.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<p><strong>NB</strong>: The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><strong>aller</strong></AudioClip> is also the verb used when
								asking how someone is. English uses the verb 'to be' to ask after someone. In French, it is incorrect to use <strong>être</strong> in
								this context. You use <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><strong>aller</strong></AudioClip> instead. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Comment ça va.mp3`}>Comment ça va ?</AudioClip></TableCell>
										<TableCell>How are you? / How's it going?</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous allez bien.mp3`}>Vous allez bien ?</AudioClip></TableCell>
										<TableCell>Are you well?</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The little words <strong>de</strong>, <strong>d'</strong>, <strong>du</strong>, <strong>de la</strong>, <strong>de l'</strong> and <strong>des</strong> occur often in French and can sometimes
								cause confusion.
								You may find it useful to study the following explanations to gain some clarity.</p>
							<ul>
								<li>You will probably already have encountered examples of some of these meaning 'from'
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je viens de France.mp3`}><strong>Je
									viens <strong>de</strong> France</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/elle vient du Canada.mp3`}><strong>elle
										vient <strong>du</strong> Canada</strong></AudioClip> etc.</li>
								<li>These words have other meanings too, so it is important to bear the context in mind. e.g.</li>
							</ul>
							<p>To express <strong>non-specific quantities</strong> you use partitive articles: <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><strong>de</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><strong>d'</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><strong>du</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><strong>de la</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><strong>de l'</strong></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><strong>des</strong></AudioClip> (often translated as 'some').
								<br/><br/>For masculine nouns you use <strong>du</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/du fromage.mp3`}><strong>du</strong> fromage</AudioClip> - some cheese
								<br/>For feminine nouns you use <strong>de la</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de la bière.mp3`}><strong>de la</strong> bière</AudioClip> - some beer
								<br/>For nouns beginning with a vowel you use <strong>de l'</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de l'eau.mp3`}><strong>de l'</strong>eau</AudioClip> - some water
								<br/>For plurals you use <strong>des</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/des cerises.mp3`}><strong>des</strong> cerises</AudioClip> - some cherries</p>

							<ul>
								<li> When describing <strong>specific quantities</strong> of
							something <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><strong>de</strong></AudioClip> is used meaning <strong>'of'</strong>.
							Before a vowel <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><strong>d'</strong></AudioClip> is used. e.g.

								<Table>
									<TableBody>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/un kilo de pommes.mp3`}>un kilo de pommes</AudioClip>
											</TableCell>
											<TableCell>
											a kilo of apples
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une barquette de fraises.mp3`}>une barquette de fraises</AudioClip>
											</TableCell>
											<TableCell>
											a punnet of strawberries
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une tasse de thé.mp3`}>une tasse de thé</AudioClip>
											</TableCell>
											<TableCell>
											a cup of tea
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/200 grammes d'amandes.mp3`}>200 grammes d'amandes</AudioClip>
											</TableCell>
											<TableCell>
											200 grams of almonds
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>
												<AudioClip className={`link`} soundFile={`sounds/fr/une bouteille d'eau minérale.mp3`}>une bouteille d'eau minérale</AudioClip>
											</TableCell>
											<TableCell>
											a bottle of mineral water
											</TableCell>
										</TableRow>
									</TableBody>
								</Table><br/>
								</li>
								<li>The forms <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><strong>d'</strong></AudioClip> or <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><strong>d'</strong></AudioClip> are also used after a <strong>negation</strong>:<br/><br/>
									e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai du pain.mp3`}><strong>J'ai du pain</strong></AudioClip>. I have (some) bread
									BUT after the negation <AudioClip className={`link`} soundFile={`sounds/fr/Je n'ai pas de pain.mp3`}><strong>Je n'ai pas de pain</strong></AudioClip>. I don't have
									any bread. <AudioClip className={`link`} soundFile={`sounds/fr/Il veut de l'eau.mp3`}><strong>Il veut de l'eau</strong></AudioClip>. He
									wants (some) mineral water. BUT after the negation <AudioClip className={`link`} soundFile={`sounds/fr/Il ne veut pas d'eau minérale.mp3`}><strong>Il ne veut pas d'eau minérale</strong></AudioClip>. He doesn't want any water.</li>

								{/* <li>
									<p>To express <strong>non-specific quantities</strong> you use the following: <AudioClip className={`link`} soundFile={`sounds/fr/de.mp3`}><strong>de</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/d'.mp3`}><strong>d'</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><strong>du</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><strong>de la</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><strong>de l'</strong></AudioClip> and <AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><strong>des</strong></AudioClip> all of which mean 'some'.
										<br/>For masculine nouns you use <strong>du</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/du fromage.mp3`}><strong>du</strong> fromage</AudioClip> - some cheese
										<br/>For feminine nouns you use <strong>de la</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de la bière.mp3`}><strong>de la</strong> bière</AudioClip> - some beer
										<br/>For nouns beginning with a vowel you use <strong>de l'</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/de l'eau.mp3`}><strong>de l'</strong>eau</AudioClip> - some water
										<br/>For plurals you use <strong>des</strong> e.g. <AudioClip className={`link`} soundFile={`sounds/fr/des cerises.mp3`}><strong>des</strong> cerises</AudioClip> - some cherries</p>
								</li> */}
							</ul>
						</li>
						<li>
							<p>The plural of French nouns is generally formed by adding an <strong>s</strong>. There are some exceptions to this rule, and these include
								adding an <strong>x</strong> instead of an <strong>s</strong> to nouns ending in <strong>-eau</strong>. e.g.
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un couteau.mp3`}><strong>un couteau</strong></AudioClip> a knife- <AudioClip className={`link`} soundFile={`sounds/fr/des couteaux.mp3`}><strong>des couteaux</strong></AudioClip> some knives,
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un gâteau.mp3`}><strong>un gâteau</strong></AudioClip> a cake- <AudioClip className={`link`} soundFile={`sounds/fr/des gâteaux.mp3`}><strong>des gâteaux</strong></AudioClip> some cakes,
							<br/><AudioClip className={`link`} soundFile={`sounds/fr/un poireau.mp3`}><strong>un poireau</strong></AudioClip> a leek- <AudioClip className={`link`} soundFile={`sounds/fr/des poireaux.mp3`}><strong>des poireaux</strong></AudioClip> some leeks</p>

						</li>
					</ol>
				</div>
			</div>
		);
	};
}

