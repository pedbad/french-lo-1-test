// audioUtils.js
export const audioBufferToWav = (audioBuffer) => {
	const numChannels = audioBuffer.numberOfChannels;
	const {sampleRate} = audioBuffer;
	const format = 1; // PCM
	const bitsPerSample = 16;

	const channelData = [];
	const length = audioBuffer.length * numChannels * (bitsPerSample / 8);

	for (let channel = 0; channel < numChannels; channel += 1) {
		channelData.push(audioBuffer.getChannelData(channel));
	}

	const buffer = new ArrayBuffer(44 + length);
	const view = new DataView(buffer);

	function writeString(offset, str) {
		for (let i = 0; i < str.length; i += 1) {
			view.setUint8(offset + i, str.charCodeAt(i));
		}
	}

	let offset = 0;

	// RIFF header
	writeString(offset, 'RIFF'); offset += 4;
	view.setUint32(offset, 36 + length, true); offset += 4; // file size - 8
	writeString(offset, 'WAVE'); offset += 4;

	// fmt chunk
	writeString(offset, 'fmt '); offset += 4;
	view.setUint32(offset, 16, true); offset += 4; // chunk size
	view.setUint16(offset, format, true); offset += 2; // format
	view.setUint16(offset, numChannels, true); offset += 2;
	view.setUint32(offset, sampleRate, true); offset += 4;
	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
	view.setUint32(offset, byteRate, true); offset += 4;
	const blockAlign = (numChannels * bitsPerSample) / 8;
	view.setUint16(offset, blockAlign, true); offset += 2;
	view.setUint16(offset, bitsPerSample, true); offset += 2;

	// data chunk
	writeString(offset, 'data'); offset += 4;
	view.setUint32(offset, length, true); offset += 4;

	// interleave channels & write samples
	const volume = 1;
	let sampleIndex = 0;

	while (sampleIndex < audioBuffer.length) {
		for (let ch = 0; ch < numChannels; ch += 1) {
			const sample = channelData[ch][sampleIndex] * volume;
			const clamped = Math.max(-1, Math.min(1, sample));
			const intSample = clamped < 0
				? clamped * 0x8000
				: clamped * 0x7fff;
			view.setInt16(offset, intSample, true);
			offset += 2;
		}
		sampleIndex += 1;
	}

	return new Blob([buffer], { type: 'audio/wav' });
};

export const concatAudioFiles = async (urls, pauseSeconds = 0.5) => {
	if (!urls || !urls.length) {
		throw new Error('No audio URLs provided');
	}

	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContextClass();

	// Load + decode all files
	const buffers = [];
	for (let i = 0; i < urls.length; i += 1) {
		const url = urls[i];
		const resp = await fetch(url);
		const arrayBuffer = await resp.arrayBuffer();
		const decoded = await audioContext.decodeAudioData(arrayBuffer);
		buffers.push(decoded);
	}

	// Assume all same sampleRate – usually true if from same source
	const [{sampleRate}] = buffers;
	const numChannels = Math.max(...buffers.map(b => b.numberOfChannels));
	const pauseSamples = Math.round(pauseSeconds * sampleRate);

	// Total length = sum(buffer.length) + pause between each (except last)
	let totalLength = 0;
	buffers.forEach((b, idx) => {
		totalLength += b.length;
		if (idx < buffers.length - 1) {
			totalLength += pauseSamples;
		}
	});

	const mergedBuffer = audioContext.createBuffer(
		numChannels,
		totalLength,
		sampleRate
	);

	let offset = 0;

	buffers.forEach((buffer, index) => {
		for (let ch = 0; ch < numChannels; ch += 1) {
			const targetData = mergedBuffer.getChannelData(ch);
			const sourceData =
        buffer.getChannelData(
        	ch < buffer.numberOfChannels ? ch : 0 // duplicate first channel if mono -> stereo, etc.
        );

			targetData.set(sourceData, offset);
		}

		offset += buffer.length;

		// add silence after each except last
		if (index < buffers.length - 1) {
			offset += pauseSamples; // this is already zero-filled
		}
	});

	const blob = audioBufferToWav(mergedBuffer);
	const url = URL.createObjectURL(blob);

	return {
		audioUrl: url,
		durationSeconds: mergedBuffer.length / sampleRate,
		sampleRate,
	};
};
