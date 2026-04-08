import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class FreeTimeGrammarAdjectiveAgreement extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo8-grammar1-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						Some adjectives ending in <strong>f</strong> change to <strong>-ve</strong>
						{" "}in the feminine form, for example{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/adjective-agreement/001-sportif.mp3"
						>
							sport<strong>if</strong>
						</AudioClip>
						{" "}and{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/adjective-agreement/002-actif.mp3"
						>
							act<strong>if</strong>
						</AudioClip>
						.
					</p>
					<p>
						Compare these two examples:
					</p>
					<p>
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/adjective-agreement/003-mon-frere-est-sportif.mp3"
						>
							Mon frère est sport<strong>if</strong>.
						</AudioClip>
						{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/adjective-agreement/004-ma-soeur-est-sportive.mp3"
						>
							Ma sœur est sporti<strong>ve</strong>.
						</AudioClip>
					</p>
				</div>
			</div>
		);
	};
}

export class FreeTimeGrammarFaireAndPartitives extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo8-grammar2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						The verb{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/faire-and-partitives/001-faire.mp3"
						>
							<strong>faire</strong>
						</AudioClip>
						{" "}means both <strong>to do</strong> and <strong>to make</strong>. It is very
						common and irregular, so it is worth learning well.
					</p>
					<p>Here it is in the present tense:</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/002-je-fais.mp3"
									>
										je <strong>fais</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I do / make</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/003-tu-fais.mp3"
									>
										tu <strong>fais</strong>
									</AudioClip>
								</TableCell>
								<TableCell>you do / make</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/004-il-elle-fait.mp3"
									>
										il / elle <strong>fait</strong>
									</AudioClip>
								</TableCell>
								<TableCell>he / she / it does / makes</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/005-nous-faisons.mp3"
									>
										nous <strong>faisons</strong>
									</AudioClip>
								</TableCell>
								<TableCell>we do / make</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/006-vous-faites.mp3"
									>
										vous <strong>faites</strong>
									</AudioClip>
								</TableCell>
								<TableCell>you do / make</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/007-ils-elles-font.mp3"
									>
										ils / elles <strong>font</strong>
									</AudioClip>
								</TableCell>
								<TableCell>they do / make</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<p>
						When you talk about activities after <strong>faire</strong>, French usually
						needs a partitive article:
						{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/faire-and-partitives/008-du.mp3"
						>
							<strong>du</strong>
						</AudioClip>
						{" "}for masculine nouns,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/faire-and-partitives/009-de-la.mp3"
						>
							<strong>de la</strong>
						</AudioClip>
						{" "}for feminine nouns,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/faire-and-partitives/010-de-l.mp3"
						>
							<strong>de l&apos;</strong>
						</AudioClip>
						{" "}before a vowel or silent <strong>h</strong>, and{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/faire-and-partitives/011-des.mp3"
						>
							<strong>des</strong>
						</AudioClip>
						{" "}for plurals.
					</p>
					<p>Here are some examples:</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/012-je-fais-de-la-gymnastique.mp3"
									>
										<strong>Je fais de la gymnastique</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I do gymnastics</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/013-je-fais-du-jardinage.mp3"
									>
										<strong>Je fais du jardinage</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I do gardening</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/faire-and-partitives/014-je-fais-des-gateaux.mp3"
									>
										<strong>Je fais des gâteaux</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I make cakes</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}

export class FreeTimeGrammarJouerPatterns extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo8-grammar3-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel3` : undefined}
					key={`${id}Panel3`}
				>
					<p>
						The regular <strong>-er</strong> verb{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
						>
							<strong>jouer</strong>
						</AudioClip>
						{" "}is useful when talking about hobbies and games.
					</p>
					<p>
						After{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
						>
							<strong>jouer</strong>
						</AudioClip>
						, you use <strong>jouer de</strong> plus the partitive article for musical
						instruments:
					</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/jouer-patterns/002-je-joue-du-piano.mp3"
									>
										<strong>Je joue du piano</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I play the piano</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/jouer-patterns/003-je-joue-de-la-clarinette.mp3"
									>
										<strong>Je joue de la clarinette</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I play the clarinet</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<p>
						When you use{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
						>
							<strong>jouer</strong>
						</AudioClip>
						{" "}for ball games and table games, you use{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/004-jouer-a.mp3"
						>
							<strong>jouer à</strong>
						</AudioClip>
						. This becomes{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/005-jouer-au.mp3"
						>
							<strong>jouer au</strong>
						</AudioClip>
						{" "}for masculine nouns,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/006-jouer-a-la.mp3"
						>
							<strong>jouer à la</strong>
						</AudioClip>
						{" "}for feminine nouns,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/007-jouer-a-l.mp3"
						>
							<strong>jouer à l&apos;</strong>
						</AudioClip>
						{" "}before a vowel or silent <strong>h</strong>, and{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/jouer-patterns/008-jouer-aux.mp3"
						>
							<strong>jouer aux</strong>
						</AudioClip>
						{" "}for plurals.
					</p>
					<p>For example:</p>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/jouer-patterns/009-je-joue-au-football.mp3"
									>
										<strong>Je joue au football</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I play football</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo8/grammar/jouer-patterns/010-je-joue-a-la-petanque.mp3"
									>
										<strong>Je joue à la pétanque</strong>
									</AudioClip>
								</TableCell>
								<TableCell>I play pétanque</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}

export class FreeTimeGrammarNounEndings extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo8-grammar4-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel4` : undefined}
					key={`${id}Panel4`}
				>
					<p>
						Some word endings can help you guess noun gender. Many nouns ending in
						<strong> -tion</strong> or <strong>-ie</strong> are feminine:
					</p>
					<p>
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/001-laction.mp3"
						>
							l&apos;action
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/002-la-nation.mp3"
						>
							la nation
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/003-la-natation.mp3"
						>
							la natation
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/004-la-biologie.mp3"
						>
							la biologie
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/005-la-geographie.mp3"
						>
							la géographie
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/006-la-sociologie.mp3"
						>
							la sociologie
						</AudioClip>
						.
					</p>
					<p>Many nouns ending in <strong>-isme</strong> are masculine:</p>
					<p>
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/007-lathletisme.mp3"
						>
							l&apos;athlétisme
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/008-lexistentialisme.mp3"
						>
							l&apos;existentialisme
						</AudioClip>
						,{" "}
						<AudioClip
							className="link"
							soundFile="audio/lo8/grammar/noun-endings/009-le-socialisme.mp3"
						>
							le socialisme
						</AudioClip>
						.
					</p>
				</div>
			</div>
		);
	};
}
