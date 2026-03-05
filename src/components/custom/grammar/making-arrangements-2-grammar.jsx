import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class L15Grammar extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo15-grammar-container container`}
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
							<p>There are some words and phrases that cannot be translated literally from English to French.
							This happens when talking about the weather: in English we use the verb <strong>to be</strong> e.g: It's hot. It's windy etc.
							</p>
							<p>In French we do not use <strong>to be</strong>. The verb <AudioClip className={`link`} soundFile={`sounds/fr/faire.mp3`}><strong>faire</strong></AudioClip> is
								often used in this context e.g <AudioClip className={`link`} soundFile={`sounds/fr/Il fait chaud.mp3`}><strong>Il fait chaud</strong></AudioClip>. It's hot.
								The phrase <AudioClip className={`link`} soundFile={`sounds/fr/Il y a.mp3`}><strong>Il y a</strong></AudioClip> is used in some cases
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Il y a du vent.mp3`}><strong>Il y a du vent</strong></AudioClip>. It's windy.</p>
						</li>
						<li>
							<p>The verb <AudioClip className={`link`} soundFile={`sounds/fr/aller.mp3`}><strong>aller</strong></AudioClip> is a very useful verb. It has three uses.
								Firstly, there is the literal meaning to go e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je vais en ville.mp3`}><strong>Je vais
									en ville</strong></AudioClip>.
								I'm going into town.
								Secondly, it's used when asking after someone e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Comment ça va.mp3`}><strong>Comment ça va ?</strong></AudioClip> How are you?
								And thirdly, it is conjugated in the present tense and followed by another verb in its infinitive form to construct the near future.
								e.g. <AudioClip className={`link`} soundFile={`sounds/fr/Je vais passer mes vacances en France.mp3`}><strong>Je vais passer mes vacances en France</strong></AudioClip>. I am going to spend my holidays in France.
							<AudioClip className={`link`} soundFile={`sounds/fr/Ma sœur va avoir 20 ans la semaine prochaine.mp3`}><strong>Ma sœur va avoir 20 ans la semaine prochaine</strong></AudioClip>. My sister is going to be 20 next week.</p>
						</li>
					</ol>
				</div>
			</div>
		);
	};
}

