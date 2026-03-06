import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class HouseAndHomeGrammar extends PureComponent{
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-grammar-container container`}
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
							<p>In French there are some verbs which are <strong>only ever used in the third person singular: il</strong>.</p>
							<p><strong>Il y a</strong> meaning 'there is' or 'there are' is one of these. <br/>e.g. </p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/Il y a un petit jardin devant la maison.mp3`} alt="centre">Il y a un petit jardin devant la maison</AudioClip>.
								There is a small garden in front of the house.<br />
							<AudioClip className={`link`} soundFile={`sounds/fr/Il y a trois chambres au premier étage.mp3`} alt="centre">Il y a trois chambres au premier étage</AudioClip>.
								There are three bedrooms on the first floor.</p>
							<p>Here are a few more examples of verbs which work in the same way:</p>
							<p>From the verb <AudioClip className={`link`} soundFile={`sounds/fr/pleuvoir.mp3`}><strong>pleuvoir</strong></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il pleut.mp3`}><strong>Il pleut</strong></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il pleut aujourd'hui.mp3`}><strong>Il pleut</strong> aujourd'hui</AudioClip> It's raining today. <br />
								From the verb <AudioClip className={`link`} soundFile={`sounds/fr/neiger.mp3`}><strong>neiger</strong></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il neige.mp3`}><strong>Il neige</strong></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il neige en hiver.mp3`}><strong>Il neige</strong> en hiver</AudioClip> It snows in the winter.<br />
								From the verb <AudioClip className={`link`} soundFile={`sounds/fr/falloir.mp3`}><strong>falloir</strong></AudioClip>:
								<AudioClip className={`link`} soundFile={`sounds/fr/Il faut.mp3`}><strong>Il faut</strong></AudioClip> - e.g.&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/Il faut écouter.mp3`}><strong>Il faut</strong> écouter</AudioClip> It's necessary / you need to listen. </p>
						</li><li>
							<p><strong>More about adjectival agreement</strong>. Some adjectives end -eux e.g. <AudioClip className={`link`} soundFile={`sounds/fr/spacieux.mp3`}><strong>spacieux</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/lumineux.mp3`}><strong>lumineux</strong></AudioClip>.</p>
							<p>There is no change for the masculine plural.<br />The feminine form of the adjective is formed by removing the x and replacing with -se i.e.
								<AudioClip className={`link`} soundFile={`sounds/fr/spacieuse.mp3`}><strong>spacieuse</strong></AudioClip>,&nbsp;
								<AudioClip className={`link`} soundFile={`sounds/fr/lumineuse.mp3`}><strong>lumineuse</strong></AudioClip>.<br />
								To form the feminine plural an s is added to this. Look at these examples:</p>
							<p><AudioClip className={`link`} soundFile={`sounds/fr/Le salon est spacieux.mp3`}>Le salon est spaci<strong>eux</strong></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/La cuisine est spacieuse.mp3`}>La cuisine est spaci<strong>euse</strong></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/Les appartements sont spacieux.mp3`}>Les appartements sont spaci<strong>eux</strong></AudioClip>.<br />
								<AudioClip className={`link`} soundFile={`sounds/fr/Les chambres sont spacieuses.mp3`}>Les chambres sont spaci<strong>euses</strong></AudioClip>.</p>
						</li></ol>
				</div>
			</div>
		);
	};
}

