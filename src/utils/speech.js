export const speak = (e, synth, targetLanguageCode, voices, text) => {
	e.preventDefault();
	let utterThis;
	if (text !== undefined) {
		utterThis = new SpeechSynthesisUtterance(text);
	} else {
		let { target } = e;
		while (!target.classList.contains('speak')) target = target.parentNode;
		utterThis = new SpeechSynthesisUtterance(target.innerText);
	}
	utterThis.onend = () => {
		console.log('SpeechSynthesisUtterance.onend'); // eslint-disable-line
	};

	utterThis.onerror = () => {
		console.error('SpeechSynthesisUtterance.onerror'); // eslint-disable-line
	};

	utterThis.onpause = (event) => {
		const char = event.utterance.text.charAt(event.charIndex);
		console.log(`Speech paused at character ${event.charIndex} of "${event.utterance.text}", which is "${char}".`); // eslint-disable-line
	};

	utterThis.lang = targetLanguageCode;
	switch (targetLanguageCode) {
		case 'fr-FR': {
			utterThis.name = 'Google français';
			utterThis.voiceURI = 'Google français';
			break;
		}
		case 'de-DE': {
			utterThis.name = 'Google Deutsch';
			utterThis.voiceURI = 'Google Deutsch';
			break;
		}
		case 'es-ES': {
			utterThis.name = 'Google español';
			utterThis.voiceURI = 'Google español';
			break;
		}
		default: {
			utterThis.name = 'Google français';
			utterThis.voiceURI = 'Google français';
			break;
		}
	}
	[utterThis.voice] = voices;
	utterThis.pitch = 1;
	utterThis.rate = 1;
	synth.speak(utterThis);
};
