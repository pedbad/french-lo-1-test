import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { resolveAsset } from "@/utils/assets";
import { PureComponent } from "react";

export class L10Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo10-grammar-container container`}
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
							<div className={`two-columns`}>
								<img src={resolveAsset(`images/vouloir.jpg`)} alt="A young girl points to the cake she wants"/>
								<div className={`text`}>
									<p>Using the verb <AudioClip className={`audio-link`} soundFile={`sounds/fr/vouloir.mp3`} >vouloir</AudioClip> meaning 'to want'</p>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je veux.mp3`} >je veux</AudioClip></TableCell>
												<TableCell>I want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu veux.mp3`} >tu veux</AudioClip></TableCell>
												<TableCell>you want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Il veut. elle veut.mp3`} >il / elle veut</AudioClip></TableCell>
												<TableCell>he / she/ it wants</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Nous voulons.mp3`} >nous voulons</AudioClip></TableCell>
												<TableCell>we want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Vous voulez.mp3`} >vous voulez</AudioClip></TableCell>
												<TableCell>you want</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ils veulent. Elles veulent.mp3`} >ils / elles veulent</AudioClip></TableCell>
												<TableCell>they want</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</div>

							<p>The verb vouloir is very frequently used together with another verb. This second verb is used in its infinitive form. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je veux aller au Canada.mp3`} >Je veux aller au Canada.</AudioClip></TableCell>
										<TableCell>I want to go to Canada.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Ma copine veut étudier en France.mp3`} >Ma copine veut étudier en France.</AudioClip></TableCell>
										<TableCell>My girlfriend wants to study in France.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Mes amis veulent passer le week-end à Londres.mp3`} >Mes amis veulent passer le week-end à Londres.</AudioClip></TableCell>
										<TableCell>My friends want to spend the weekend in London.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</li>
						<li>
							<p>The preposition à has a variety of meanings. It is used to mean <em>to the</em> or <em>in the</em> or <em>at the</em> before a common noun.&nbsp;
							You will see the following forms: <strong>au</strong> before a masculine noun,&nbsp;
							<strong>à la</strong> before a feminine noun, <strong>à l'</strong> before a noun beginning with a vowel or silent h and&nbsp;
							<strong>aux</strong> before a plural noun. e.g.</p>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je travaille au laboratoire.mp3`} >Je travaille au laboratoire.</AudioClip></TableCell>
										<TableCell>I work / I am working at the laboratory.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Tu veux aller à la piscine.mp3`} >Tu veux aller à la piscine ?</AudioClip></TableCell>
										<TableCell>Do you want to go to the swimming pool?</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Elle veut aller à l'exposition.mp3`} >Elle veut aller à l'exposition.</AudioClip></TableCell>
										<TableCell>She wants to go to the exhibition.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/J'aime aller aux magasins.mp3`} >J'aime aller aux magasins.</AudioClip></TableCell>
										<TableCell>I like going to the shops.</TableCell>
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
