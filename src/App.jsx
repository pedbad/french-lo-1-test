import {
	Accordion,
	AppAccordionArticle,
	AccordionArticle,
	AnswerTable,
	AudioClip,
	Blanks,
	Congratulate,
	DropDowns,
	ErrorLog,
	Explanation,
	Figure,
	Flag,
	Footer,
	Header,
	HeroSection,
	Info,
	Jigsaw,
	LandingPage,
	MainMenu,
	MemoryMatchGame,
	ModalLinkDialog,
	Monologue,
	PhraseTable,
	RadioQuiz,
	ReadAloud,
	Section,
	SequenceOrder,
	Sortable,
	WordGrid,
	WordParts,
} from "./components";
import {
	handleModalLinkClick,
	handleResponse,
	isTouchChrome,
	playAudioLink,
	speak,
} from "./utility";
import{
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";

import { AllCustomComponentsFR, Grammar1Body, Grammar2Body } from "./components/CustomComponents_FR/index.js";
import DOMPurify from "dompurify";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";


const splitDisplayTitle = (value) => {
	if (typeof value !== "string") return null;

	const title = value.trim();
	if (!title) return null;

	// Keep split rules explicit and conservative so hyphenated words
	// (for example "café-crème") are not treated as title separators.
	const splitPatterns = [
		/:\s+/, // "Main: sub"
		/\s+—\s+/, // "Main — sub"
		/\s+–\s+/, // "Main – sub"
		/\s+\|\s+/, // "Main | sub"
		/\s+-\s+/, // "Main - sub"
	];

	for (const pattern of splitPatterns) {
		const match = title.match(pattern);
		if (!match || match.index === undefined) continue;

		const { index } = match;
		const [separator] = match;
		const main = title.slice(0, index).trim();
		const sub = title.slice(index + separator.length).trim();
		if (!main || !sub) continue;

		return { main, sub };
	}

	return null;
};

export default class App extends React.Component {
	constructor(props) {
		super(props);

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const languageCode = urlParams.get("lang");

		this.state = {
			dark: false,
			dialogContent: "",
			errors: [],
			languageCode: languageCode,
			showDialog: false,
			showModalLinkDialog: false,
			modalLinkDialogTitle: "",
			modalLinkDialogContentHTML: "",
			modalLinkDialogContent: null,
		};

		// this.loadConfig = this.loadConfig.bind(this);
		// this.loadIndex = this.loadIndex.bind(this);
		// this.hideDialog = this.hideDialog.bind(this);
		// this.hideSpeechError = this.hideSpeechError.bind(this);
		// this.initialiseSpeeches = this.initialiseSpeeches.bind(this);
		// this.initialiseSynth = this.initialiseSynth.bind(this);
		// this.renderComponent = this.renderComponent.bind(this);
		// this.selectLearningObject = this.selectLearningObject.bind(this);
		// this.toggleDark = this.toggleDark.bind(this);

		window.refs = [];
		this.autoComponentIdCounter = 0;
	}

	clearError = (index) => {
		const { errors } = this.state;
		errors.splice(index, 1);
		this.setState({
			errors: errors,
		});
	};

	clearLog = () => {
		this.setState({
			errors: [],
		});
	};

	componentDidMount = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const { languageCode } = this.state;

		// lo is a 1-based "ID" in your URLs (e.g. ?lo=1). -1 means landing page.
		const loParamRaw = urlParams.get("lo");
		const loId = loParamRaw !== null ? parseInt(loParamRaw, 10) : NaN;
		const isValidLoId = Number.isInteger(loId) && loId >= 1;

		const currentLearningObject = isValidLoId ? loId : -1;

		// Always load the index so the menu/landing page can render
		if (languageCode) {
			this.loadIndex(currentLearningObject, languageCode);
		}

		// Only load a config when we have a valid LO id
		let configPromise;
		if (isValidLoId && languageCode) {
			configPromise = this.loadConfig(
				`./src/learningObjectConfigurations/${languageCode}/${loId}.json`,
				loId
			);
			this.initialiseModalLinks();

			configPromise.then(this.initialiseSynth);
		} else {
			// No valid lo: ensure we're in landing page mode (and clear config)
			this.setState({ currentLearningObject: -1, config: null });
		}

		if (sessionStorage.getItem(`dark`)) {
			const dark = JSON.parse(sessionStorage.getItem(`dark`));
			if (dark) this.setDark(true);
		}

	};

	componentDidUpdate = () => {
		this.initialiseModalLinks();
	};

	expandAllAccordions = () => {
    console.log("expandAllAccordions"); // eslint-disable-line
		const closedArticles = document.querySelectorAll(
			"section.accordion-article:not(.expanded)"
		);
		const closedArrows = document.querySelectorAll(
			"div.arrow:not(.expanded)"
		);
		closedArticles.forEach((closedArticle) => {
			closedArticle.classList.add("expanded");
		});
		closedArrows.forEach((closedArrow) => {
			closedArrow.classList.add("expanded");
		});
	};

	hideDialog = () => {
		this.setState({
			dialogContent: "",
			showDialog: false,
		});
	};

	hideSpeechError = () => {
		this.setState({
			dialogContent: "",
			showSpeechError: false,
		});
	};

	showModalLinkDialog = (title, contentHTML, content) => {
		this.setState({
			showModalLinkDialog: true,
			modalLinkDialogTitle: title || "",
			modalLinkDialogContentHTML: contentHTML || "",
			modalLinkDialogContent: content || null,
		});
	};

	hideModalLinkDialog = () => {
		this.setState({
			showModalLinkDialog: false,
			modalLinkDialogTitle: "",
			modalLinkDialogContentHTML: "",
			modalLinkDialogContent: null,
		});
	};

	findModalLinkContent = (targetId) => {
		const { config } = this.state;
		const modalContentMap = {
			madame: {
				title: "1. Forms of address and politeness",
				content: <Grammar1Body highlightIntro />,
			},
			mademoiselle: {
				title: "1. Forms of address and politeness",
				content: <Grammar1Body highlightIntro />,
			},
			tuvous: {
				title: "2. The \"tu\" vs \"vous\" distinction",
				content: <Grammar2Body highlightIntro />,
			},
			toi: {
				title: "2. The \"tu\" vs \"vous\" distinction",
				content: <Grammar2Body highlightIntro />,
			},
		};

		if (modalContentMap[targetId]) return modalContentMap[targetId];
		if (!config) {
			return {
				title: "Not found",
				contentHTML: "<p>Content not loaded.</p>",
			};
		}

		const entries = new Map();

		const addEntry = (item) => {
			if (!item || typeof item !== "object") return;
			const {id} = item;
			const contentHTML =
				item.infoTextHTML ||
				item.informationTextHTML ||
				item.informationText ||
				"";
			if (!id || !contentHTML) return;
			const rawTitle = item.titleText || item.titleTextHTML || "Explanation";
			const title = rawTitle.replace(/<[^>]*>/g, "");
			entries.set(id, { title, contentHTML });
		};

		Object.values(config).forEach((section) => {
			if (!section || typeof section !== "object") return;
			addEntry(section);
			if (Array.isArray(section.content)) {
				section.content.forEach((contentItem) => {
					const componentConfig = contentItem
						? Object.values(contentItem)[0]
						: null;
					addEntry(componentConfig);
				});
			}
		});

		if (entries.has(targetId)) return entries.get(targetId);

		const targetEl =
			document.getElementById(targetId) ||
			document.querySelector(`.modal-link-target[data-modal-target="${targetId}"]`);
		if (targetEl) {
			const container = targetEl.closest("p, li, div, section") || targetEl;
			return {
				title: targetId,
				contentHTML: container.outerHTML,
			};
		}

		return {
			title: "Not found",
			contentHTML: `<p>Explanation for "${targetId}" not found.</p>`,
		};
	};

	initialiseModalLinks = () => {
		// `modal-link` is reserved for content links that open the modal dialog.
		// Main navigation uses `nav-scroll-link` and handles scroll behavior in MainMenu.
		const anchors = document.querySelectorAll(".modal-link");
		anchors.forEach((anchor) => {
			// console.log("anchor", anchor);
			if (anchor.setup) {
				// do nothing
				// console.log("already set up");
			} else {
				anchor.addEventListener("click", (e) =>
					handleModalLinkClick(e, {
						mode: "modal",
						findModalLinkContent: this.findModalLinkContent,
						showModalLinkDialog: this.showModalLinkDialog,
					})
				);
			}
			anchor.setup = true;
		});
		const targets = document.querySelectorAll(".modal-link-target");
		targets.forEach((target) => {
			if (target.setup) {
				// do nothing
			} else {
				target.addEventListener("click", (e) => e.preventDefault());
			}
			target.setup = true;
		});
	};

	initialiseSpeeches = (synth, targetLanguageCode, voices) => {
		const speeches = document.querySelectorAll(".speak");
		speeches.forEach((speech) => {
			if (targetLanguageCode && synth && voices && voices.length >= 1) {
        console.error("There's a '.speak' that I missed"); // eslint-disable-line
				if (
					speech.setup !== true &&
          speech.getAttribute("setup") !== true
				) {
					speech.setAttribute("aria-label", "Non-selectable text");
					speech.setAttribute("setup", "true");
					speech.addEventListener("click", (e) =>
						speak(e, synth, targetLanguageCode, voices)
					);
					speech.setup = true;
				}
			}
		});

		const audioLinks = document.querySelectorAll(".audio-link");
		audioLinks.forEach((audioLink) => {
			if (audioLink.setup !== true && audioLink.getAttribute("setup") !== true) {
				const soundFile = audioLink.getAttribute("sound-file");
				if (soundFile !== null) {
					audioLink.setAttribute("setup", "true");
					audioLink.addEventListener("click", () =>
						playAudioLink(soundFile)
					);
					audioLink.setup = true;
				}
			}
		});
	};

	initialiseSynth = () => {
		const { targetLanguageCode } = this.state;
		const synth = window.speechSynthesis;

		const mediaContent = window
			.getComputedStyle(document.body, "::before")
			.getPropertyValue("content");

		const isFirefox = /firefox/i.test(navigator.userAgent);

		const sortVoices = (voices) =>
			voices.sort((a, b) =>
				a.lang.localeCompare(b.lang, undefined, { sensitivity: "base" })
			);

		const filterVoicesByLang = (voices, lang) =>
			voices.filter((voice) => voice.lang === lang);

		const enableSpeech = (voices) => {
			const filteredVoices = filterVoicesByLang(
				sortVoices(voices),
				targetLanguageCode
			);
			this.initialiseSpeeches(synth, targetLanguageCode, filteredVoices);
			document.documentElement.classList.add("can-speak");
			this.setState({ showSpeechError: false });
		};

		if (isFirefox) {
			setTimeout(() => {
				const voices = synth.getVoices();
				enableSpeech(voices);
			}, 1000);
		}

		synth.onvoiceschanged = () => {
			if (
				(mediaContent[1] === "S" || mediaContent[1] === "M") &&
        isTouchChrome()
			) {
				// Chrome touch workaround, do nothing
			} else {
				const voices = synth.getVoices();
				enableSpeech(voices);
			}
		};
	};

	loadConfig = (configFile, learningObjectConfigFile) => {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");

		const requestOptions = {
			headers: headers,
			method: "GET",
			redirect: "follow",
		};

		return new Promise((resolve, reject) => {
			fetch(`${configFile}`, requestOptions)
				.then(handleResponse)
				.then((res) => {
					const { settings } = res;
					delete res["settings"];
					const {
						class: configClass,
						targetLanguageCode,
					} = settings;
					if (configClass)
						document
							.getElementsByTagName("html")[0]
							.classList.add(configClass);

					const currentLearningObject = learningObjectConfigFile;

					this.setState(
						{
							config: { ...res },
							currentLearningObject: currentLearningObject,
							settings: { ...settings },
							targetLanguageCode,
						},
						() => resolve({ targetLanguageCode })
					);
				})
				.catch((error) => {
					const action = `Loading configuration`;
					this.logError(action, error);
					reject();
				});
		});
	};

	loadIndex = (currentLearningObject, languageCode) => {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");

		const requestOptions = {
			headers: headers,
			method: "GET",
			redirect: "follow",
		};

		fetch(`./src/index-${languageCode}.json`, requestOptions)
			.then(handleResponse)
			.then((res) => {
				const { learningObjects, title: siteTitle } = res;

				// Translate LO "id" (1-based) to array index (0-based)
				const loIndex = currentLearningObject >= 1 ? currentLearningObject - 1 : -1;

				let title, titleShort;
				if (loIndex >= 0 && learningObjects[loIndex]) {
					({ title, titleShort = '' } = learningObjects[loIndex]);
					document.title = title;
				}

				this.setState({
					currentLearningObject: currentLearningObject, // store ID or -1
					learningObjects: learningObjects,
					siteTitle: siteTitle,
					title: title,
					titleShort: titleShort,
				});
			})
			.catch((error) => {
				const action = `Loading index`;
				this.logError(action, error);
			});
	};

	logError = (action, ...params) => {
		const { errors, refreshErrorLog } = this.state;
		if (params.length === 1) {
			const [error] = params;
			const {
				detail,
				error_code: errorCode,
				error_message: errorMessage,
				message,
				status,
				statusText = "",
			} = error;
			let Message = "";
			let Status = "";
			if (errorCode && errorMessage) {
				Message += errorMessage;
				Status += errorCode;
			}
			if (status) Status = status;
			if (message) Message += message;
			if (detail) Message += detail;

			errors.push({
				action: action,
				message: Message,
				statusCode: Status,
				statusText: statusText,
			});
		} else {
			const [statusCode = "", statusText = "", message = ""] = params;

			errors.push({
				action: action,
				message: message,
				statusCode: statusCode,
				statusText: statusText,
			});
		}

		this.setState({
			errors: errors,
			refreshErrorLog: !refreshErrorLog,
			showSpinner: false,
		});
	};

	setDark = (dark) => {
		if (typeof document === "undefined") return;
		document.documentElement.classList.toggle("dark", dark);
	};

	toggleDark = () => {

		let dark = false;

		if (sessionStorage.getItem(`dark`)) dark = JSON.parse(sessionStorage.getItem(`dark`));

		if (typeof document !== "undefined") {
			document.documentElement.classList.add("no-theme-transition");
			window.setTimeout(() => {
				document.documentElement.classList.remove("no-theme-transition");
			}, 200);
		}

		this.setDark(!dark);
		// const html = document.getElementsByName('html');
		// const cl = html.classList;

		// console.log("html", html, cl);
		this.setState({ dark: !dark },
			sessionStorage.setItem('dark', !dark)
		);
	};

	normaliseContentItems = (content = []) => {
		// Supports BOTH:
		// 1) New format: [{ id, component, ... }, ...]
		// 2) Old format: [{ someKey: { id, component, ... } }, ...]
		// Also tolerates accidental nulls.
		return (content || [])
			.map((item) => {
				if (!item) return null;

				// New format: looks like a config object already
				if (item.component) return item;

				// Old format wrapper: { "jigsaw1": { component:"Jigsaw", ... } }
				const keys = Object.keys(item);
				const values = Object.values(item);
				if (keys.length === 1 && values.length === 1 && values[0]?.component) {
					const cfg = values[0];
					if (!cfg.id) cfg.id = keys[0];
					return cfg;
				}

				return null;
			})
			.filter(Boolean);
	};

	getResolvedComponentId = (id, component) => {
		if (typeof id === "string" && id.trim() !== "") {
			return id.trim();
		}

		const safeComponent =
			typeof component === "string" && component.trim() !== ""
				? component.trim()
				: "component";
		this.autoComponentIdCounter += 1;
		return `auto-${safeComponent}-${this.autoComponentIdCounter}`;
	};


	/**
	 * renderComponentForTab
	 * Returns "bare" content for a component (no AccordionArticle / Section wrapper)
	 * so that we can render it as a tab panel inside a Group.
	*/
	renderComponentForTab = (value) => {
		const {
			component,
			id: valueId,
			infoText,
			infoTextHTML,
			// titleText = "",
			// titleTextHTML = "",
		} = value;
		const id = this.getResolvedComponentId(valueId, component);

		const { languageCode } = this.state;

		switch (component) {
			case "AnswerTable":
				return (
					<AnswerTable
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "Blanks":
				return (
					<Blanks
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "DropDowns":
				return (
					<DropDowns
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "Explanation":
				return (
					<>
						<Info informationText={infoText} informationTextHTML={infoTextHTML} />
						<Explanation
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</>
				);
			case "Jigsaw":
				return (
					<Jigsaw
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "MemoryMatchGame":
				return (
					<MemoryMatchGame
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "Monologue":
				return (
					<Monologue
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "PhraseTable":
				return (
					<PhraseTable
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
						languageCode={languageCode}
					/>
				);
			case "RadioQuiz":
				return (
					<RadioQuiz
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "ReadAloud":
				return (
					<ReadAloud
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "SequenceOrder":
				return (
					<SequenceOrder
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "Sortable":
				return (
					<Sortable
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "WordGrid":
				return (
					<WordGrid
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			case "WordParts":
				return (
					<WordParts
						config={value}
						logError={this.logError}
						showDialog={this.showDialog}
					/>
				);
			default: {
				let CustomComponent;
				switch (languageCode) {
					case "fr":
						CustomComponent = AllCustomComponentsFR[component];
						break;
					default:
						CustomComponent = AllCustomComponentsFR[component];
						break;
				}
				if (CustomComponent) {
					return (
						<>
							<Info
								informationText={infoText}
								informationTextHTML={infoTextHTML}
							/>
							<CustomComponent id={id} showDialog={this.showDialog} />
						</>
					);
				}
				return (
					<p>Component {component} not implemented</p>
				);
			}
		}
	};

	render = () => {
		const {
			config,
			currentLearningObject,
			dialogContent,
			errors,
			languageCode,
			learningObjects = [],
			refreshErrorLog,
			showDialog = false,
			showModalLinkDialog = false,
			modalLinkDialogTitle = "",
			modalLinkDialogContentHTML = "",
			settings,
			showSpeechError = false,
			siteTitle,
		} = this.state;
		const articles = [];
		this.autoComponentIdCounter = 0;
		let intro, introHTML, informationHTML;
		if (settings) {
			({ intro, introHTML, informationHTML } = settings);
		}

		if (config) {
			for (const [/* key */, value] of Object.entries(config)) {
				const { component } = value;
				if (component) {
					this.renderComponent(value, articles);
				}
			}
		}

		let title, titleShort;
		const loIndex = currentLearningObject >= 1 ? currentLearningObject - 1 : -1;
		if (loIndex >= 0 && learningObjects[loIndex]) {
			({ title = "", titleShort = '' } =
        learningObjects[loIndex] || {});
		}

		let targetLanguageCode = "";
		if (settings) {
			({ targetLanguageCode } = settings);
			this.targetLanguageCode = targetLanguageCode;
		}

		return (
			<>
				{/* Provide Radix tooltips once at the app root for consistent behavior. */}
				<TooltipProvider delayDuration={300}>
					<div
						className={`app ${this.targetLanguageCode ? this.targetLanguageCode : ""}`}
						key={`languageDiv`}
					>


						<span
							aria-hidden="true"
							className={`modal-link-target`}
							id="modal-link-top"
							style={{ "position": "absolute", "top": "-4rem" }}
							tabIndex="-1"
						/>
						<ErrorLog
							dialog={this.dialog}
							errors={errors}
							clearLog={this.clearLog}
							clearError={this.clearError}
							refreshErrorLog={refreshErrorLog}
						/>
						<ModalLinkDialog
							open={showModalLinkDialog}
							title={modalLinkDialogTitle}
							contentHTML={modalLinkDialogContentHTML}
							content={this.state.modalLinkDialogContent}
							onClose={this.hideModalLinkDialog}
						/>

						<MainMenu
							config={config}
							title={titleShort !== '' ? titleShort : title}
							toggleDark={this.toggleDark}
						/>

						<Congratulate
							className={`${showDialog ? "show" : ""}`}
							enabled={settings ? settings.showCongratulations : null}
							hideDialog={this.hideDialog}
							id="congratulate-success"
							content={dialogContent}
						/>
						<Congratulate
							className={`${showSpeechError ? "show" : ""}`}
							enabled={true}
							hideDialog={this.hideSpeechError}
							id="SpeechSynthesisError"
							content={`This browser cannot perform speech synthesis. Please use a larger device and a browser such as Chrome`}
						/>

						{languageCode !== undefined ? (
							<>

								<div id="hero">
									<img
										alt="French Basic banner illustration"
										className="hero-image"
										decoding="async"
										fetchPriority="high"
										loading="eager"
										src="images/fr_banner.svg"
									/>
									<h2 className="hero-title text-stroke-chart-3">{siteTitle}</h2>
								</div>
								<main id="content" key="content">
									<h1>
										{(() => {
											const parts = splitDisplayTitle(title);
											if (!parts) return title;

											return (
												<>
													<span className="title-main">
														{parts.main} —
													</span>
													<span className="title-sub">
														{parts.sub}
													</span>
												</>
											);
										})()}
									</h1>
									{(() => {
										const introLayout = introHTML
											? { paragraphHTML: introHTML }
											: intro
												? { paragraph: intro }
												: null;
										if (introLayout) {
											introLayout.image = {
												src: "images/first-contact.svg",
												alt: "Learners greeting illustration"
											};
											introLayout.stackOnDesktop = true;
										}
										return (introLayout || informationHTML) ? (
											<HeroSection
												config={{
													id: "intro-section",
													expandable: false,
													heroSection: true,
													transparentCard: true,
													instructionsLayout: introLayout || undefined,
													informationTextHTML: informationHTML,
													stackInfo: true,
												}}
												id="LO-intro-section"
												target="intro"
												title="Introduction"
											/>
										) : null;
									})()}



									{currentLearningObject !== -1 ? (
										<Accordion id={`accordion1`} key={`accordion1`}>
											{articles}
										</Accordion>
									) : null}
									{learningObjects.length > 0 &&
                currentLearningObject === -1 ? (
											<LandingPage
												languageCode={languageCode}
												learningObjects={learningObjects}
											/>
										) : null}
								</main>
							</>
						) : (
							<div className={`no-config`}>
								<h1>No configuration parameter given of the form</h1>
								<h2>{`${window.location.host}${window.location.pathname}?lang=fr&lo=3`}</h2>
								<p>
                Where &apos;3&apos; in this example is the learning object
                number or index. If absent, but language is the landing
                page is shown
								</p>
							</div>
						)}
						<Footer />
					</div>
				</TooltipProvider>
			</>
		);
	};

	renderComponent = (value, articles) => {
		const {
			id: valueId,
			component,
			infoText,
			infoTextHTML,
			titleText = "",
			titleTextHTML = "",
		} = value;
		const { expandable = true } = value;

		const { currentLearningObject, languageCode } = this.state;
		const id = this.getResolvedComponentId(valueId, component);
		const compoundID = `LO${currentLearningObject}-${id}`;

		switch (component) {
				case "AnswerTable": {
					articles.push(
						<AppAccordionArticle
							config={value}
							id={`${compoundID}-Accordion`}
							key={`${compoundID}-Accordion`}
							target={id}
							title={titleText}
							titleHTML={titleTextHTML}
						>
							<AnswerTable
								config={value}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						</AppAccordionArticle>
					);
					break;
				}
			case "Blanks": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<Blanks
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "DropDowns": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<DropDowns
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "Explanation": {
				if (expandable) {
					articles.push(
						<AccordionArticle
							config={value}
							id={`${compoundID}-Accordion`}
							key={`${compoundID}-Accordion`}
							ref={(AccordionArticle) => {
								window.refs.push(AccordionArticle);
							}}
							target={id}
							title={titleText}
							titleHTML={titleTextHTML}
						>
							<Explanation
								config={value}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						</AccordionArticle>
					);
				} else {
					articles.push(
						<Section
							config={value}
							id={`${compoundID}-Section`}
							key={`${compoundID}-Section`}
							target={id}
							title={titleText}
							titleHTML={titleTextHTML}
						>
							<Explanation
								config={value}
								logError={this.logError}
								showDialog={this.showDialog}
							/>
						</Section>
					);
				}
				break;
			}
			case "Group": {
				const renderedGroupContent = [];
				const { content: groupContent = [] } = value;
				const { id: groupId, displayAsTabs = false } = value;

				if (!displayAsTabs) {
					// Children as sub-accordions/sections
					this.normaliseContentItems(groupContent).forEach((v) => {
						this.renderComponent(v, renderedGroupContent);
					});

					if (expandable) {
						articles.push(
							<AccordionArticle
								config={value}
								className={`group`}
								id={`${compoundID}-Group-Accordion`}
								key={`${compoundID}-Group-Accordion`}
								ref={(AccordionArticle) => {
									window.refs.push(AccordionArticle);
								}}
								target={groupId}
								title={titleText}
								titleHTML={titleTextHTML}
							>
								<Info
									informationText={infoText}
									informationTextHTML={infoTextHTML}
								/>
								{renderedGroupContent}
							</AccordionArticle>
						);
					} else {
						const GroupSectionComponent = value.heroSection ? HeroSection : Section;
						articles.push(
							<GroupSectionComponent
								config={value}
								className={`group`}
								id={`${compoundID}-Group-Section`}
								key={`${compoundID}-Group-Section`}
								target={groupId}
								title={titleText}
								titleHTML={titleTextHTML}
							>
								<Info
									informationText={infoText}
									informationTextHTML={infoTextHTML}
								/>
								{renderedGroupContent}
							</GroupSectionComponent>
						);
					}
				} else {
					// children rendered as tabs
					const tabItems = [];
					let defaultTabValue = null;

					this.normaliseContentItems(groupContent).forEach((v, index) => {
						const childId = v.id || `child-${index}`;
						const tabValue = childId;
						if (defaultTabValue === null) defaultTabValue = tabValue;

						const tabLabel =
							v.menuText ||
							v.titleText ||
							(typeof v.titleTextHTML === "string"
								? v.titleTextHTML.replace(/<[^>]+>/g, "")
								: "") ||
							childId;

						const contentNode = this.renderComponentForTab(v);

						tabItems.push({
							content: contentNode,
							label: tabLabel,
							value: tabValue,
						});
					});


					const outerWrapper = (inner) =>
						expandable ? (
							<AccordionArticle
								config={value}
								className={`group`}
								id={`${compoundID}-Group-Accordion`}
								key={`${compoundID}-Group-Accordion`}
								ref={(AccordionArticle) => {
									window.refs.push(AccordionArticle);
								}}
								target={groupId}
								title={titleText}
								titleHTML={titleTextHTML}
							>
								<Info
									informationText={infoText}
									informationTextHTML={infoTextHTML}
								/>
								{inner}
							</AccordionArticle>
						) : (
							(() => {
								const GroupSectionComponent = value.heroSection ? HeroSection : Section;
								return (
									<GroupSectionComponent
										config={value}
										className={`group`}
										id={`${compoundID}-Group-Section`}
										key={`${compoundID}-Group-Section`}
										target={groupId}
										title={titleText}
										titleHTML={titleTextHTML}
									>
										<Info
											informationText={infoText}
											informationTextHTML={infoTextHTML}
										/>
										{inner}
									</GroupSectionComponent>
								);
							})()
						);

					articles.push(
						outerWrapper(
							<Tabs
								className="w-full overflow-hidden rounded-xl border border-border/45 bg-card/80"
								defaultValue={defaultTabValue || (tabItems[0] && tabItems[0].value)}
							>
								<TabsList className="flex h-auto w-full flex-col items-stretch justify-start gap-0 overflow-visible rounded-lg border border-border/35 bg-muted/20 p-1 min-[1170px]:flex-wrap min-[1170px]:flex-row min-[1170px]:gap-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:bg-muted/35 min-[1170px]:p-0">
									{tabItems.map((item) => (
										<TabsTrigger
											className="w-full cursor-pointer justify-start rounded-md border border-transparent !px-4 !py-2 text-left !text-[calc(var(--font-size-sm)*1.2)] !leading-tight font-medium text-foreground/90 transition-colors data-[state=active]:bg-card data-[state=active]:text-[var(--chart-3)] data-[state=active]:font-bold data-[state=active]:border-border/45 data-[state=active]:border-l-4 data-[state=active]:border-l-[var(--chart-3)] min-[1170px]:shrink-0 min-[1170px]:w-auto min-[1170px]:justify-center min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:border-r min-[1170px]:border-border/45 min-[1170px]:!min-h-[3.8rem] min-[1170px]:!px-6 min-[1170px]:!py-3 min-[1170px]:!text-[calc(var(--font-size-sm)*1.4)] min-[1170px]:text-center min-[1170px]:data-[state=active]:relative min-[1170px]:data-[state=active]:z-20 min-[1170px]:data-[state=active]:translate-y-[2px] min-[1170px]:data-[state=active]:bg-muted/25 min-[1170px]:data-[state=active]:shadow-none min-[1170px]:data-[state=active]:border-t-2 min-[1170px]:data-[state=active]:border-l-2 min-[1170px]:data-[state=active]:border-r-2 min-[1170px]:data-[state=active]:border-b-2 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--foreground)_24%,var(--border))] min-[1170px]:data-[state=active]:!border-b-[color-mix(in_oklab,var(--muted)_25%,var(--card))]"
											key={item.value}
											value={item.value}
										>
											{item.label}
										</TabsTrigger>
									))}
								</TabsList>
								{tabItems.map((item) => (
									<TabsContent
										className="mt-2 rounded-lg border border-[color-mix(in_oklab,var(--foreground)_18%,var(--border))] bg-muted/20 p-4 data-[state=inactive]:hidden data-[state=active]:block min-[1170px]:mt-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:bg-muted/25 min-[1170px]:data-[state=active]:border-2 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--foreground)_24%,var(--border))]"
										key={item.value}
										value={item.value}
										forceMount
									>
										{item.content}
									</TabsContent>
								))}
							</Tabs>
						)
					);
				}

				break;
			}
			case "Jigsaw": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<Jigsaw
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "MemoryMatchGame": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<MemoryMatchGame
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "Monologue": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<Monologue
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "PhraseTable": {
				if (expandable) {
					articles.push(
						<AccordionArticle
							config={value}
							id={`${compoundID}-Accordion`}
							key={`${compoundID}-Accordion`}
							ref={(AccordionArticle) => {
								window.refs.push(AccordionArticle);
							}}
							target={id}
							title={titleText}
							titleHTML={titleTextHTML}
						>
							<PhraseTable
								config={value}
								logError={this.logError}
								showDialog={this.showDialog}
								languageCode={languageCode}
							/>
						</AccordionArticle>
					);
				} else {
					articles.push(
						<Section
							config={value}
							id={`${compoundID}-Section`}
							key={`${compoundID}-Section`}
							target={id}
							title={titleText}
							titleHTML={titleTextHTML}
						>
							<PhraseTable
								config={value}
								logError={this.logError}
								showDialog={this.showDialog}
								languageCode={languageCode}
							/>
						</Section>
					);
				}
				break;
			}
			case "RadioQuiz": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<RadioQuiz
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "ReadAloud": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<ReadAloud
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "SequenceOrder": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<SequenceOrder
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "Section": {
				const renderedSectionContent = [];
				const { content: sectionContent = [] } = value;

				this.normaliseContentItems(sectionContent).forEach((v) => {
					this.renderComponent(v, renderedSectionContent);
				});

				const SectionComponent = value.heroSection ? HeroSection : Section;
				articles.push(
					<SectionComponent
						config={value}
						id={`${compoundID}-Section-Section`}
						key={`${compoundID}-Section-Section`}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						{renderedSectionContent}
					</SectionComponent>
				);
				break;
			}
			case "Sortable": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<Sortable
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "WordGrid": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<WordGrid
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			case "WordParts": {
				articles.push(
					<AccordionArticle
						config={value}
						id={`${compoundID}-Accordion`}
						key={`${compoundID}-Accordion`}
						ref={(AccordionArticle) => {
							window.refs.push(AccordionArticle);
						}}
						target={id}
						title={titleText}
						titleHTML={titleTextHTML}
					>
						<WordParts
							config={value}
							logError={this.logError}
							showDialog={this.showDialog}
						/>
					</AccordionArticle>
				);
				break;
			}
			default: {
				let CustomComponent;
				switch (languageCode) {
					case "fr":
						CustomComponent = AllCustomComponentsFR[component];
						break;
					default:
						CustomComponent = AllCustomComponentsFR[component];
						break;
				}
				if (CustomComponent) {
					if (expandable) {
						articles.push(
							<AccordionArticle
								config={value}
								id={`${compoundID}-Accordion`}
								key={`${compoundID}-Accordion`}
								ref={(AccordionArticle) => {
									window.refs.push(AccordionArticle);
								}}
								target={id}
								title={titleText}
								titleHTML={titleTextHTML}
							>
								<Info
									informationText={infoText}
									informationTextHTML={infoTextHTML}
								/>
								<CustomComponent id={id} showDialog={this.showDialog} />
							</AccordionArticle>
						);
					} else {
						articles.push(
							<Section
								config={value}
								id={`${compoundID}-Section`}
								key={`${compoundID}-Section`}
								target={id}
								title={titleText}
								titleHTML={titleTextHTML}
							>
								<CustomComponent id={id} showDialog={this.showDialog} />
							</Section>
						);
					}
				} else if (component.slice(0, 4) === "HIDE") {
					// do nothing
				} else {
					articles.push(
						<p key={`notImplemented${id}`}>
              Component {component} not implemented
						</p>
					);
				}
			}
		}
	};

	selectLearningObject = (index) => {
		this.setState({
			currentLearningObject: index,
		});
		sessionStorage.setItem("currentLearningObject", index);
	};

	showDialog = (content) => {
		this.setState({
			dialogContent: content,
			showDialog: true,
		});
	};
}
