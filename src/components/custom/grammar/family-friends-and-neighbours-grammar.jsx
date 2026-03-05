import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class LO6Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo6-grammar-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<p>In French, the gender of the noun has implications for the <strong>possessive adjectives</strong>.
						There are two ways of saying 'my' for singular nouns in French: <AudioClip className={`link`} soundFile={`sounds/fr/mon.mp3`} ><strong>mon</strong></AudioClip> for masculine nouns e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mon frère.mp3`} ><strong>mon</strong> frère</AudioClip> (my brother),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mon jardin.mp3`} ><strong>mon</strong> jardin</AudioClip> (my garden) and <strong>ma</strong> for feminine nouns e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/ma femme.mp3`} ><strong>ma</strong> femme</AudioClip> (my wife),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/ma maison.mp3`} ><strong>ma</strong> maison</AudioClip> (my house). It is important to remember that the gender of the noun itself is what matters here,
						and not the gender of the 'owner'. There is only one way of saying 'my' for plural nouns: e.g.&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mes oncles.mp3`} ><strong>mes</strong> oncles</AudioClip> (my uncles),&nbsp;
					<AudioClip className={`link`} soundFile={`sounds/fr/mes tantes.mp3`} ><strong>mes</strong> tantes</AudioClip> (my aunts).<br />
						Here is a complete list of the possessive adjectives.</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/mon.mp3`} >mon</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ma.mp3`} >ma</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/mes.mp3`} >mes</AudioClip></TableCell>
								<TableCell>my</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ton.mp3`} >ton</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ta.mp3`} >ta</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/tes.mp3`} >tes</AudioClip></TableCell>
								<TableCell>your (sing)</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/son.mp3`} >son</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/sa.mp3`} >sa</AudioClip>,&nbsp;
									<AudioClip className={`link`} soundFile={`sounds/fr/ses.mp3`} >ses</AudioClip> *</TableCell>
								<TableCell>his / her</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/notre.mp3`} >notre</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/nos.mp3`} >nos</AudioClip> (pl)</TableCell>
								<TableCell>our</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/votre.mp3`} >votre</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/vos.mp3`} >vos</AudioClip> (pl)</TableCell>
								<TableCell>your (formal, pl)</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/leur.mp3`} >leur</AudioClip> (sing), <AudioClip className={`link`} soundFile={`sounds/fr/leurs.mp3`} >leurs</AudioClip> (pl)</TableCell>
								<TableCell>their</TableCell>
							</TableRow></TableBody></Table><p className={`footnote`}>(*NB all of these can mean his or her as the gender of the noun and not the owner is the factor to consider.)</p>
					<p><strong>2 Verbs in French continued</strong></p>
					<p><AudioClip className={`link`} soundFile={`sounds/fr/avoir.mp3`} ><strong>Avoir</strong></AudioClip> is one of the many irregular verbs in French.
						It means <strong>to have</strong>.
						e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai une soeur.mp3`} >J'ai une soeur</AudioClip> - I have a sister.</p>
					<p>It occurs very frequently and so is worth memorising if possible.</p>
					<Table>
						<thead>
							<TableRow>
								<th>Avoir</th>
								<th>to have</th>
							</TableRow>
						</thead>
						<TableBody>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/j'ai.mp3`}>j'ai</AudioClip></TableCell>
								<TableCell>I have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/tu as.mp3`}>tu as</AudioClip></TableCell>
								<TableCell>you have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/il a.mp3`}>il a</AudioClip></TableCell>
								<TableCell>he has, it has</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elle a.mp3`}>elle a</AudioClip></TableCell>
								<TableCell>she has, it has</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/nous avons.mp3`}>nous avons</AudioClip></TableCell>
								<TableCell>we have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/vous avez.mp3`}>vous avez</AudioClip></TableCell>
								<TableCell>you have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/ils ont.mp3`}>ils ont</AudioClip></TableCell>
								<TableCell>they have</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><AudioClip className={`link`} soundFile={`sounds/fr/elles ont.mp3`}>elles ont</AudioClip></TableCell>
								<TableCell>they have</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<p>The verb <strong>avoir</strong> occurs in some expressions when in English the
						verb <strong>to be</strong> or sometimes <strong>to feel</strong> would be used. Here are some of these expressions:</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell><strong>avoir … ans</strong></TableCell>
								<TableCell>to be … years old</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai 25 ans.mp3`}><strong>J'ai 25 ans.</strong></AudioClip></TableCell>
								<TableCell>I'm 25 years old.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><strong>avoir soif </strong></TableCell>
								<TableCell>to be thirsty</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/J'ai soif.mp3`}><strong>J'ai soif. </strong></AudioClip></TableCell>
								<TableCell>I'm thirsty.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><strong>avoir faim </strong></TableCell>
								<TableCell>to be hungry</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Elle a faim.mp3`}><strong>Elle a faim.</strong></AudioClip></TableCell>
								<TableCell>She's hungry.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><strong>avoir peur </strong></TableCell>
								<TableCell>to be frightened</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Il a peur.mp3`}><strong>Il a peur.</strong></AudioClip></TableCell>
								<TableCell>He's frightened.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><strong>avoir froid</strong></TableCell>
								<TableCell>to be / feel cold</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Tu as froid.mp3`}><strong>Tu as froid ?</strong></AudioClip></TableCell>
								<TableCell>Are you / do you feel cold?</TableCell>
							</TableRow>
							<TableRow>
								<TableCell><strong>avoir chaud</strong></TableCell>
								<TableCell>to be / feel hot</TableCell>
								<TableCell>e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Vous avez chaud.mp3`}><strong>Vous avez chaud ?</strong></AudioClip></TableCell>
								<TableCell>Are you hot / do you feel hot?</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}

