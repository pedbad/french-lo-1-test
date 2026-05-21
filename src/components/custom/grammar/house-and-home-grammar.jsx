import { AudioClip } from "@/components/AudioClip";
import { PureComponent } from "react";

export class HouseAndHomeGrammarThirdPersonForms extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-grammar1-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						In French there are some verbs and expressions which are used only in the third
						person singular: <strong>il</strong>.
					</p>
					<p>
						<strong>Il y a</strong> means <strong>there is</strong> or <strong>there are</strong>.
					</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/001-il-y-a-un-petit-jardin-devant-la-maison.mp3`}>
							Il y a un petit jardin devant la maison
						</AudioClip>.
						{" "}There is a small garden in front of the house.
					</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/002-il-y-a-trois-chambres-au-premier-etage.mp3`}>
							Il y a trois chambres au premier étage
						</AudioClip>.
						{" "}There are three bedrooms on the first floor.
					</p>
					<p>Here are a few more examples of verbs which work in the same way:</p>
					<p>
						From the verb{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/003-pleuvoir.mp3`}>
							<strong>pleuvoir</strong>
						</AudioClip>
						:
					</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/004-il-pleut.mp3`}>
							<strong>Il pleut</strong>
						</AudioClip>
						{" "}e.g.{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/005-il-pleut-aujourdhui.mp3`}>
							<strong>Il pleut</strong> aujourd'hui
						</AudioClip>
						{" "}It's raining today.
					</p>
					<p>
						From the verb{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/006-neiger.mp3`}>
							<strong>neiger</strong>
						</AudioClip>
						:
					</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/007-il-neige.mp3`}>
							<strong>Il neige</strong>
						</AudioClip>
						{" "}e.g.{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/008-il-neige-en-hiver.mp3`}>
							<strong>Il neige</strong> en hiver
						</AudioClip>
						{" "}It snows in the winter.
					</p>
					<p>
						From the verb{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/009-falloir.mp3`}>
							<strong>falloir</strong>
						</AudioClip>
						:
					</p>
					<p>
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/010-il-faut.mp3`}>
							<strong>Il faut</strong>
						</AudioClip>
						{" "}e.g.{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/011-il-faut-ecouter.mp3`}>
							<strong>Il faut</strong> écouter
						</AudioClip>
						{" "}It's necessary / you need to listen.
					</p>
				</div>
			</div>
		);
	};
}

export class HouseAndHomeGrammarAdjectivalAgreement extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`lo5-grammar2-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						Some adjectives end in <strong>-eux</strong> for the masculine singular, for
						example{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/012-spacieux.mp3`}>
							<strong>spacieux</strong>
						</AudioClip>
						{" "}and{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/013-lumineux.mp3`}>
							<strong>lumineux</strong>
						</AudioClip>.
					</p>
					<p>
						There is no change for the masculine plural. The feminine form is made by
						removing the <strong>x</strong> and replacing it with <strong>-se</strong>:
						{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/014-spacieuse.mp3`}>
							<strong>spacieuse</strong>
						</AudioClip>
						{" "}and{" "}
						<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/015-lumineuse.mp3`}>
							<strong>lumineuse</strong>
						</AudioClip>.
						{" "}To form the feminine plural, add <strong>s</strong>.
					</p>
					{/* <p>→<div>: short text triggers WAVE "possible heading" */}
					<div>Look at these examples:</div>
					{/* ul/li: bold text mid-sentence avoids WAVE possible-heading;
					    li picks up font-size-base from #content :where(p, li, …) */}
					<ul className="list-none p-0 mt-1 space-y-1">
						<li>
							<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/016-le-salon-est-spacieux.mp3`}>
								Le salon est spaci<strong>eux</strong>
							</AudioClip>.
						</li>
						<li>
							<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/017-la-cuisine-est-spacieuse.mp3`}>
								La cuisine est spaci<strong>euse</strong>
							</AudioClip>.
						</li>
						<li>
							<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/018-les-appartements-sont-spacieux.mp3`}>
								Les appartements sont spaci<strong>eux</strong>
							</AudioClip>.
						</li>
						<li>
							<AudioClip className={`link`} soundFile={`audio/lo5/grammar/grammar-and-usage/019-les-chambres-sont-spacieuses.mp3`}>
								Les chambres sont spaci<strong>euses</strong>
							</AudioClip>.
						</li>
					</ul>
				</div>
			</div>
		);
	};
}
