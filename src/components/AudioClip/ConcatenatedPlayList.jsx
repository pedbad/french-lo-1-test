// ConcatenatedPlaylist.jsx
import React from 'react';
import { concatAudioFiles } from '../../audioutility';

export class ConcatenatedPlaylist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			audioUrl: null,
			loading: false,
			error: null,
		};
		this.audioRef = React.createRef();
	}

	componentDidMount() {
		this.buildAudio();
	}

	componentDidUpdate(prevProps) {
		const { sources, pauseSeconds } = this.props;
		if (
			sources !== prevProps.sources ||
      pauseSeconds !== prevProps.pauseSeconds
		) {
			this.buildAudio();
		}
	}

	componentWillUnmount() {
		const { audioUrl } = this.state;
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
	}

	async buildAudio() {
		const { sources, pauseSeconds = 0.5 } = this.props;

		if (!sources || !sources.length) {
			this.setState({
				audioUrl: null,
				error: null,
				loading: false,
			});
			return;
		}

		// Clean up old URL if any
		if (this.state.audioUrl) {
			URL.revokeObjectURL(this.state.audioUrl);
		}

		this.setState({
			error: null,
			loading: true,
		});

		try {
			const { audioUrl } = await concatAudioFiles(sources, pauseSeconds);
			this.setState({
				audioUrl,
				loading: false
			});
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Failed to build concatenated audio', err);
			this.setState({
				error: 'Could not build audio playlist.',
				loading: false,
			});
		}
	}

	render() {
		const {
			audioUrl,
			error,
			loading,
		} = this.state;

		return (
			<div className="concatenated-playlist">
				{loading && <div>Building audio…</div>}
				{error && <div className="error">{error}</div>}
				{audioUrl && (
					<audio
						ref={this.audioRef}
						controls
						loop={false}
						src={audioUrl}
						// optional: auto play once ready
						// autoPlay
					/>
				)}
			</div>
		);
	}
}
