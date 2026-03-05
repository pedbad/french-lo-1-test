import { AudioClip } from "@/components/AudioClip";
import { Figure } from "@/components/Figure";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class LO8Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo8-grammar-container container`}
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
							More about adjectives: There are some adjectives ending in <strong>f</strong>, e.g. <AudioClip className={`link`} soundFile={`sounds/fr/sportif.mp3`}>sport<strong>if</strong></AudioClip>, <AudioClip className={`link`} soundFile={`sounds/fr/actif.mp3`}>act<strong>if</strong></AudioClip>.
							The feminine form of such words ends in <strong>-ve</strong>.
							e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Mon frère est sportif.mp3`}>Mon frère est sport<strong>if</strong></AudioClip>. <AudioClip className={`link`} soundFile={`sounds/fr/Ma sœur est sportive.mp3`}>Ma sœur est sporti<strong>ve</strong></AudioClip>.
						</li>
						<li><br/>
							<ol type="i">
								<li>The verb <AudioClip className={`link`} soundFile={`sounds/fr/faire.mp3`}><strong>faire</strong></AudioClip>, meaning both 'to make' and 'to do',
									is a frequently occurring very irregular verb. Here it is conjugated in the present tense:<br />
								<Table>
									<TableBody>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais.mp3`}>je <strong>fais</strong></AudioClip></TableCell>
											<TableCell>I do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu fais.mp3`}>tu <strong>fais</strong></AudioClip></TableCell>
											<TableCell>You do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il fait. elle fait.mp3`}>il / elle <strong>fait</strong></AudioClip></TableCell>
											<TableCell>He / she / it does / makes</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous faisons.mp3`}>nous <strong>faisons</strong></AudioClip></TableCell>
											<TableCell>We do / make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous faites.mp3`}>vous <strong>faites</strong></AudioClip></TableCell>
											<TableCell>You do /make</TableCell>
										</TableRow>
										<TableRow>
											<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils font. elles font.mp3`}>ils / elles <strong>font</strong></AudioClip></TableCell>
											<TableCell>They do /make</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								</li>
								<li>
									In English you can express what you do or make simply by adding the activity after the verb e.g. 'I do gymnastics' or
									'I do gardening' or 'I make cakes'. In French, you also need something called the partitive article:&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/du.mp3`}><strong>du</strong></AudioClip> for masculine nouns,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/de la.mp3`}><strong>de la</strong></AudioClip> for feminine nouns,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/de l'.mp3`}><strong>de l'</strong></AudioClip> before a vowel or silent h and&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/des.mp3`}><strong>des</strong></AudioClip>&nbsp;
									for plurals.<br/>
									The partitive is usually translated by "some" or "any," i.e an unspecified amount, or is often left out entirely as in the examples below. <br/>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais de la gymnastique.mp3`}><strong>Je fais de la gymnastique</strong></AudioClip></TableCell>
												<TableCell> I do gymnastics</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/je fais du jardinage.mp3`}><strong>Je fais du jardinage</strong></AudioClip></TableCell>
												<TableCell>I do gardening</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je fais des gâteaux.mp3`}><strong>Je fais des gâteaux</strong></AudioClip></TableCell>
												<TableCell>I make cakes</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</li>
							</ol>
						</li>
						<li>
							<br/>
							<ol type="i">
								<li>
									The regular <strong>-er</strong> verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><strong>jouer</strong></AudioClip> meaning to play is useful when talking about pastimes.
									You use the partitive article after the verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><strong>jouer</strong></AudioClip> when speaking about playing a musical instrument:<br />
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue du piano.mp3`}><strong>Je joue du piano</strong></AudioClip></TableCell>
												<TableCell>I play the piano</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue de la clarinette.mp3`}><strong>Je joue de la clarinette</strong></AudioClip></TableCell>
												<TableCell>I play the clarinet</TableCell>
											</TableRow>
										</TableBody>
									</Table>

								</li>
								<li>
									When you use the verb <AudioClip className={`link`} soundFile={`sounds/fr/jouer.mp3`}><strong>jouer</strong></AudioClip> in the context of a ball game or tabletop game you can't use the partitive article nor can you use the definite article.<br />
									You use <AudioClip className={`link`} soundFile={`sounds/fr/jouer à.mp3`}><strong>jouer à</strong></AudioClip>.
									If the activity is masculine it's <AudioClip className={`link`} soundFile={`sounds/fr/jouer au.mp3`}><strong>jouer au</strong></AudioClip>, if feminine, <AudioClip className={`link`} soundFile={`sounds/fr/jouer à la.mp3`}><strong>jouer à la</strong></AudioClip>,
									if starting with a vowel or silent h then <AudioClip className={`link`} soundFile={`sounds/fr/jouer à l'.mp3`}><strong>jouer à l'</strong></AudioClip> and for plurals <AudioClip className={`link`} soundFile={`sounds/fr/jouer aux.mp3`}><strong>jouer aux</strong></AudioClip>. e.g.
									<Table>
										<TableBody>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue au football.mp3`}><strong>Je joue au football</strong></AudioClip></TableCell>
												<TableCell> I play football</TableCell>
											</TableRow>
											<TableRow>
												<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/Je joue à la pétanque.mp3`}><strong>Je joue à la pétanque</strong></AudioClip></TableCell>
												<TableCell> I play pétanque</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</li>
							</ol>
						</li>
						<li>
							The ending of a noun often helps you to know its gender. For example, all nouns ending <strong>-tion</strong> or <strong>-ie</strong> are feminine.<br />
							e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'action (f).mp3`}>l'action</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la nation (f).mp3`}>la nation</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la natation (f).mp3`}>la natation</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la biologie.mp3`}>la biologie</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la géographie.mp3`}>la géographie</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/la sociologie.mp3`}>la sociologie</AudioClip><br/>
							<br/>
							All nouns ending <strong>-isme</strong> are masculine.<br/>
							e.g.&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'athlétisme.mp3`}>l'athlétisme</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/l'existentialisme.mp3`}>l'existentialisme</AudioClip>,&nbsp;
							<AudioClip className={`link`} soundFile={`sounds/fr/le socialisme.mp3`}>le socialisme</AudioClip>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}
