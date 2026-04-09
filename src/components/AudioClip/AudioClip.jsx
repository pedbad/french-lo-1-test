import { CircularAudioProgressAnimatedSpeakerDisplay } from '.';
import React from 'react';
import {
	resolveAsset,
} from '../../utils/assets';
import {
	stopAllAudioPlayback,
	trackFloatingAudio,
} from '../../utils/audioPlayback';


export class AudioClip extends React.PureComponent {
	constructor(props) {
		super(props);
		// this.initialiseProgress = this.initialiseProgress.bind(this);
		// this.notePlaying = this.notePlaying.bind(this);
		// this.playSound = this.playSound.bind(this);
		this.state = ({
			status: 'stopped',
		});
		this.audioRef = React.createRef();
	}

	setPlaybackStatus = (nextStatus, extraState = {}) => {
		this.setState({
			...extraState,
			status: nextStatus,
		});

		const { onStatusChange } = this.props;
		if (typeof onStatusChange === "function") {
			onStatusChange(nextStatus);
		}
	};

	notePlaying = (e, useRef) => {
		// console.log("notePlaying");
		e.preventDefault();
		e.stopPropagation();
		// useRef is true when the player is an audio control
		if (useRef) {
			stopAllAudioPlayback(this.audioRef.current);
			this.initialiseProgress(this.audioRef.current);
		}
		this.setPlaybackStatus('playing');
	};

	handleClick = (e) => {
		// console.log("handleClick (only for super-compact and link)");
		e.preventDefault();
		e.stopPropagation();
		const {
			soundFileAudio,
			status = 'stopped',
		} = this.state;
		// console.log("soundFileAudio", soundFileAudio);
		switch (status) {
			case 'stopped':
				this.playSound(e);
				// soundFileAudio.play();
				break;
			case 'paused':
				this.setPlaybackStatus('playing');
				if (!soundFileAudio) {
					this.playSound(e);
					break;
				}
				stopAllAudioPlayback(soundFileAudio);
				soundFileAudio.play().catch(() => {
					this.setPlaybackStatus('stopped');
				});
				break;
			case 'playing':
				this.pause(e);
				break;
		}
	};

	initialiseProgress = (audio) => {
		// console.log("initialiseProgress", audio);
		if (!audio.setup) {
			audio.addEventListener('timeupdate', () => {
				const progress = (audio.currentTime / audio.duration) * 100;
				// console.log(`Playback progress: ${progress.toFixed(1)}%`);
				this.setState({progress:  `${progress.toFixed(1)}%`});
			});
		}
	};

	playSound = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { soundFile } = this.props;
		this.notePlaying(e, false);
		const soundFileAudio = new Audio(resolveAsset(soundFile));
		trackFloatingAudio(soundFileAudio);
		stopAllAudioPlayback(soundFileAudio);
		this.initialiseProgress(soundFileAudio);
		soundFileAudio.onended = () => {
			this.setPlaybackStatus('stopped', {
				progress: 0,
			});
		};
		soundFileAudio.onpause = () => {
			this.setPlaybackStatus('stopped');
		};
		soundFileAudio.play().catch(() => {
			this.setPlaybackStatus('stopped', {
				progress: 0,
			});
		});
		this.setState({
			soundFileAudio: soundFileAudio,
		});
		this.setPlaybackStatus('playing');
	};

	pause = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { soundFileAudio } = this.state;
		this.setPlaybackStatus('paused');
		soundFileAudio.pause();
	};

	render = () => {
		const {
			className = '',
			children,
			id,
			inline = false,
			listenText = '',
			soundFile,
		} = this.props;

		const classes = className.split(/\s+/);

		if (classes.includes('link')) {
			return (
				<LinkAudioProgress
					className={className}
					id={id}
					key={id}
					soundFile={soundFile}
				>{children}</LinkAudioProgress>
			);
		} else if (classes.includes('super-compact')) {
			return (
				<CircularAudioProgress
					className={className}
					id={id}
					inline={inline}
					key={id}
					size={this.props.size}
					soundFile={soundFile}
				/>
			);
		} else if (classes.includes('super-compact-speaker')) {
			return (
				<CircularAudioProgressAnimatedSpeaker
					className={className}
					id={id}
					inline={inline}
					key={id}
					size={this.props.size}
					soundFile={soundFile}
				/>
			);
		} else if (classes.includes('compact')) {
			return (
				<audio
					aria-label="Audio clip"
					className={`${className ? className : ''}`}
					controls
					id={id}
					key={id}
					onPlay={(e) => this.notePlaying(e, true)}
					ref={this.audioRef}
				><source src={resolveAsset(soundFile)} /></audio>
			);
		} else {
			if (listenText !== '') {
				return (
					<label className='audio-clip' htmlFor={`${id}`}>{listenText}{listenText === '' ? '' : ':'}&nbsp;
						<audio
							aria-label={listenText || "Audio clip"}
							className={`${className ? className : ''}`}
							controls
							id={`${id}`}
							key={id}
							onPlay={(e) => this.notePlaying(e, true)}
							ref={this.audioRef}
						><source src={resolveAsset(soundFile)}
							/></audio>
					</label>
				);
			} else {
				return (
					<div className={`audio-clip`}><audio
						aria-label="Audio clip"
						className={`${className ? className : ''}`}
						controls
						id={id}
						key={id}
						onPlay={(e) => this.notePlaying(e, true)}
						ref={this.audioRef}
					><source src={resolveAsset(soundFile)} /></audio></div>
				);
			}
		}
	};
}

const getCompactControlSize = (size, fallback) => {
	const parsedSize = Number.parseInt(size, 10);
	return Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : fallback;
};

class CircularAudioProgress extends AudioClip {
	constructor(props) {
		super(props);
		this.circleRef = React.createRef();

		this.state = ({
			duration: 0,
			progress: 0,
		});

		// this.pause = this.pause.bind(this);
	}

	componentDidMount = () => {
		const { soundFileAudio } = this.state;
		if (soundFileAudio !== undefined && soundFileAudio.setup !== true) {
			soundFileAudio.addEventListener('loadedmetadata', this.handleMetadataLoaded);
			soundFileAudio.addEventListener('timeupdate', this.handleTimeUpdate);
			soundFileAudio.setup = true;
		}
	};

	componentWillUnmount = () => {
		const { soundFileAudio } = this.state;
		if (soundFileAudio !== undefined && soundFileAudio.setup !== true) {
			soundFileAudio.removeEventListener('loadedmetadata', this.handleMetadataLoaded);
			soundFileAudio.removeEventListener('timeupdate', this.handleTimeUpdate);
			soundFileAudio.setup = true;
		}
	};

	componentDidUpdate(prevProps, prevState) {
		const { soundFileAudio } = this.state;
		if (soundFileAudio !== undefined && soundFileAudio.setup !== true) {
			soundFileAudio.addEventListener('loadedmetadata', this.handleMetadataLoaded);
			soundFileAudio.addEventListener('timeupdate', this.handleTimeUpdate);
			soundFileAudio.setup = true;
		}
		if (prevState.progress !== this.state.progress || prevState.duration !== this.state.duration) {
			this.updateCircleOffset();
		}
	}

	handleMetadataLoaded = () => {
		const {
			soundFileAudio,
		} = this.state;
		this.setState({ duration: soundFileAudio.duration });
	};

	handleTimeUpdate = () => {
		const {
			soundFileAudio,
		} = this.state;
		this.setState({ progress: soundFileAudio.currentTime });
	};

	updateCircleOffset = () => {
		const { progress, duration } = this.state;
		const { size } = this.props;
		const controlSize = getCompactControlSize(size, 27);

		const circumference = Math.PI * controlSize;
		const offset = circumference * (1 - (progress / duration || 0));
		if (this.circleRef.current) {
			this.circleRef.current.style.strokeDashoffset = offset;
		}
	};

	render = () => {
		const strokeWidth = 2;
		const bgColour = 'var(--border)'; // Keep ring subtle in both light and dark themes.

		const {
			className = '',
			inline = false,
			size,
		} = this.props;

		const root = getComputedStyle(document.documentElement);
		let compactDimension = root.getPropertyValue('--compact-dimension').trim();
		compactDimension = parseInt(compactDimension, 10);
		const controlSize = getCompactControlSize(size, compactDimension);
		const radius = (controlSize - strokeWidth) / 2;

		const circumference = Math.PI * controlSize;
		const { status = 'stopped' } = this.state;
		if (isNaN(controlSize)){
			return null;
		} else {
			return (
				<button
					type="button"
					className={`audio-container ${inline ? 'inline' : ''} super-compact circular-audio-progress ${status} ${className}`.trim()}
					onClick={this.handleClick}
					ref={this.audioRef}
					aria-label={`${status !== 'playing' ? 'Click to play' : 'Click to pause'}`}
					style={{ height: `${controlSize}px`, width: `${controlSize}px` }}
				>
					<svg
						fill="none"
						width={controlSize}
						height={controlSize}
						className="pointer-events-none">
						{/* Background ring */}
						<circle
							cx={controlSize / 2}
							cy={controlSize / 2}
							r={radius}
							stroke={bgColour}
							strokeWidth={strokeWidth}
							fill="none"
						/>
						{/* Progress ring */}
						<circle
							ref={this.circleRef}
							cx={controlSize / 2}
							cy={controlSize / 2}
							r={radius}
							stroke="currentColor"
							strokeWidth={strokeWidth}
							fill="none"
							strokeDasharray={circumference}
							strokeDashoffset={circumference}
							transform={`rotate(-90 ${controlSize / 2} ${controlSize / 2})`}
							style={{ transition: 'stroke-dashoffset 0.2s linear' }}
						/>
						<path fill="currentColor" d="m18.64 13.5-5.14 3.448-5.14 3.447V6.604l5.14 3.447z" className="play" />

						<path fill="currentColor" className="pause" d="M6.501 6.617h4.611v13.765H6.501zM14.966 6.617h4.611v13.765h-4.611z"/>
					</svg>
				</button>
			);
		}
	};
}

class CircularAudioProgressAnimatedSpeaker extends CircularAudioProgress {
	render = () => {
		const { className = '', inline, size, title } = this.props;
		const { status = 'stopped', progress = 0, duration = 0 } = this.state;

		return (
			<span
				// Keep these wrappers if you still rely on ref/onPlay here.
				// If you don't need them, you can drop the wrapper and pass everything straight through.
				onPlay={(e) => this.notePlaying(e, false)}
				ref={this.audioRef}
			>
				<CircularAudioProgressAnimatedSpeakerDisplay
					className={className}
					size={size}
					inline={inline}
					status={status}
					progress={progress}
					duration={duration}
					handleClick={this.handleClick}
					title={title}
				/>
			</span>
		);
	};
}

class LinkAudioProgress extends CircularAudioProgress {
	constructor(props) {
		super(props);
		this.linkRef = React.createRef();

		this.state = ({
			duration: 0,
			progress: 0,
		});

	}

	componentDidUpdate() {
		const { soundFileAudio } = this.state;
		if (soundFileAudio !== undefined && soundFileAudio.setup !== true) {
			soundFileAudio.addEventListener('loadedmetadata', this.handleMetadataLoaded);
			soundFileAudio.addEventListener('timeupdate', this.handleTimeUpdate);
			soundFileAudio.setup = true;
		}
	}

	render = () => {
		const { children, className = '', size, title } = this.props;
		const { status = 'stopped', progress = 0, duration = 0 } = this.state;
		const tooltipText = title || (status !== 'playing' ? 'Click to play' : 'Click to pause');

		return (
			<button
				type="button"
				className={`audio-link ${status} ${className}`.trim()}
				onClick={this.handleClick}
				ref={this.linkRef}
				aria-label={tooltipText}>
				<CircularAudioProgressAnimatedSpeakerDisplay
					className={className}
					inline={true}
					status={status}
					progress={progress}
					duration={duration}
					interactive={false}
					size={size}
					title={tooltipText}
				/>
				{/* Simple compact link SVG speaker icon <svg xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /></svg> */}
				<span className="audio-link-text">{children}</span>
			</button>
		);
	};
}
