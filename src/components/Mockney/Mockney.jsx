import './Mockney.scss';
import {
	isTouchChrome,
	speak,
} from '../../utility';
import React, { createRef, PureComponent } from 'react';

export class Mockney extends PureComponent {
	constructor(props) {
		super(props);

		const { config } = this.props;

		const translations = [

			[' baby', " basin of gravy"],
			[' gravy', " army and navy"],
			[' money', " bees and honey"],
			[' stairs', " apples and pairs"],
			[' wife', " trouble and strife"],
			[" party", " gay and hearty"],
			["advice", "lump of ice"],
			[" bank", " rattle and clank"],
			[" bar", " near and far"],
			[" beak", " once a week"],
			[" bike", " clever mike"],
			[" bombs", " derry and toms"],
			[" breath", " true till death"],
			[" breeches", " rank and riches"],
			[" broke", " coals and coke"],
			[" cadge", " coat and badge"],
			[" cake", " give and take"],
			[" chair", " lion's lair"],
			[" copper", " bottle and stopper"],
			[" dice", " rats and mice"],
			[" drink", " tumble down the sink"],
			[" egg", " borrow and beg"],
			[" fag", " oily rag"],
			[" flowers", " early hours"],
			[" fool", " lump of school"],
			[" free", " yet to be"],
			[" hide", " duck and dive"],
			[" kid", " dustbin lid"],
			[" married", " cut and carried"],
			[" matches", " cuts and scratches"],
			[" milk", " satin and silk"],
			["morning", "day's a-dawning"],
			[" noise", " box of toys"],
			[" on the knocker", " mozzle and brocha"],
			[" park", " light and dark"],
			[" pension", " stand to attention"],
			[" pissed", " scotch mist"],
			[" poor", " on the floor"],
			[" puff", " collar and cuff"],
			[" rain", " pleasure and pain"],
			[" scotch", " pimple and blotch"],
			[" snout", " in and out"],
			["soup", "loop the loop"],
			["suitcase", "crowded space"],
			[" tale", " weep and wail"],
			[" the head", " lump of lead"],
			[" toast", " pig and roast"],
			[" track", " tick tack"],
			[" water", " fisherman's daughter"],
			[" arse", " khyber pass"],
			[" beers", " britney spears"],
			["believe", "adam and eve"],
			["bottle", "aristotle"],
			[" eye", " mince pie"],
			[" fart", " raspberry tart"],
			[" feet", " plates of meat"],
			[" for ", " fer "],
			[" found", " farnd"],
			[" friend", " china"],
			[" hat", " titfer"],
			[" head", " loaf of bread"],
			[" jewellery", " tomfoolery"],
			[" laugh", "turkish bath"],
			[" lie", " porky"],
			[" lies", " porkies"],
			[" look", " butchers"],
			[" mate", " china"],
			[" neck", " gregory peck"],
			[" pissed", " brahms and liszt"],
			[" pub", " rub-a-dub-dub"],
			[" road", " frog and toad"],
			[" skint", " brassic"],
			[" starving", " hank marvin"],
			[" suit", " whistle and flute"],
			[" sweetheart", " treacle"],
			[" teeth", " hampstead heath"],
			[" telephone", " dog and bone"],
			[" time", " bird lime"],
			[" tit", " thruppenny"],
			[" tits", " thruppenies"],
			[" titty", " bristol city"],
			[" wig", " syrup of figs"],
			[" thousand", " farsand"],
			[" pounds", " parnd"],
			[" £1000 ", " bag of sand "],
			[" grand", " bag of sand"],
			[" £100 ", " ton "],
			[" 100 pounds", " century"],
			[" £10 ", " cock and hen "],
			[" tenner", " cockle"],
			[" £1 ", " lost and found "],
			[" 1 pound", " lost and found"],
			[" 20 pounds ", "score"],
			[" £20 ", " score "],
			[" £25 ", " pony "],
			[" 25 pounds ", "pony"],
			[" 500 pounds", " monkey"],
			[" £500", " monkey"],
			[" £50", " bullseye"],
			[" 50 pounds", " bullseye"],
			[" £5 ", " lady godiva "],
			[" 5 pounds", " lady godiva"],
			[" bet", " jumbo jet"],
			[" cash", " bangers and mash"],
			[" dole", " old king cole"],
			[" earner", " bunsen burner"],
			[" shilling", " able and willing"],
			[" with ", " wiv "],
			["tt", "'"],
			[' h', " '"],
			// [' the ', " ve "],
			['think', 'fink'],
			['ing ', "in' "],
			['sly ', "s "],
		];

		this.state = ({
			translations: translations,
			...config
		});

		// this.handleChange = this.handleChange.bind(this);
		// this.handleSpeak = this.handleSpeak.bind(this);
		// this.initialiseSynth = this.initialiseSynth.bind(this);
		this.mockneyRef = createRef();
	}

	componentDidMount = () => {
		// console.log("componentDidMount");
		this.initialiseSynth();
	};

	handleChange = (e) => {
		// console.log("handleChange");
		const mockney = this.translate(e.target.value);
		this.setState({
			mockney: mockney,
		});
	};

	handleSpeak = (e) => {
		// console.log("handleSpeak");
		const { mockney, synth, voices } = this.state;
		speak(e, synth, "en-GB", voices, mockney);
	};

	initialiseSynth = () => {
		// console.log("initialiseSynth");

		const synth = window.speechSynthesis;
		let voices = [];
		// console.log("synth", synth);
		const media = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content');
		// if ((media[1] === 'S' || media[1] === 'M') && isTouchChrome()) { // Until Chrome puts a stop to Context-search preventing click on text

		// this.logError('InitialiseSynth', {
		// 	message: 'Chrome cannot play back browser based sounds because of context search on text preventing click events. Please use a PC based browser.'
		// });
		// document.getElementById('SpeechSynthesisError').innerText = 'Chrome cannot play back browser based sounds because of context search on text preventing click events. Please use a PC based browser.';
		// }

		synth.onvoiceschanged = () => {
			// console.log("onvoiceschanged");
			// show speak highlighting

			if ((media[1] === 'S' || media[1] === 'M') && isTouchChrome()) { // Until Chrome puts a stop to Context-search preventing click on text
				// this.logError('InitialiseSynth', {
				// 	message: 'Chrome cannot play back browser based sounds because of context search on text preventing click events. Please use a PC based browser.'
				// });
				// document.getElementById('SpeechSynthesisError').innerText = 'Chrome cannot play back browser based sounds because of context search on text preventing click events. Please use a PC based browser.';
			}else{
				document.getElementsByTagName('html')[0].classList.add('can-speak');
				this.setState({
					showSpeechError: false,
				});

			}
			voices = synth.getVoices();
			// console.log("voices", voices);
			voices.sort(function (a, b) {
				const aname = a.name.toUpperCase();
				const bname = b.name.toUpperCase();

				if (aname < bname) {
					return -1;
				} else if (aname === bname) {
					return 0;
				} else {
					return +1;
				}
			});

			voices = voices.filter((s) => s.lang === "en-GB" && s.name.toLowerCase().includes(' male'));
			// this.initialiseSpeeches(synth, "en-GB", voices);
			this.setState({
				voices: voices,
			});

		};
		this.setState({
			synth: synth,
			voices: voices,
		});
	};

	translate = (english) => {
		const { translations } = this.state;
		let mockney = english.toLowerCase();
		for (let i = 0; i < translations.length; i++){
			mockney = mockney.replaceAll(translations[i][0], translations[i][1]);
		}
		return mockney;
	};

	render = () => {
		const {
			id,
			mockney = '',
		} = this.state;

		return (
			<div>
				<div className={`mockney-container`}>
					<h1>Translate to Mockney</h1>
					<textarea
						className={`mockney-english`}
						id={`${id}English`}
						onChange={this.handleChange}
						placeholder={`English`} />
					<textarea
						className={`mockney-mockney`}
						id={`${id}Mockney`}
						placeholder={`Mockney`}
						ref={this.mockneyRef}
						value={mockney}
						readOnly
					/>
					<button onClick={this.handleSpeak}>Read aloud</button>
				</div>
			</div>
		);
	};
}
