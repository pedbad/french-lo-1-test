import './AudioClip.scss';
import { CircularAudioProgressAnimatedSpeakerDisplay } from '.';
import React from 'react';
import {
	resolveAsset,
	stopAllAudioPlayback,
	trackFloatingAudio,
} from '../../utility';


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

	notePlaying = (e, useRef) => {
		// console.log("notePlaying");
		e.preventDefault();
		e.stopPropagation();
		// useRef is true when the player is an audio control
		if (useRef) {
			stopAllAudioPlayback(this.audioRef.current);
			this.initialiseProgress(this.audioRef.current);
		}
		this.setState({
			status: 'playing'
		});
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
				this.setState({
					status: 'playing'
				});
				if (!soundFileAudio) {
					this.playSound(e);
					break;
				}
				stopAllAudioPlayback(soundFileAudio);
				soundFileAudio.play().catch(() => {
					this.setState({ status: 'stopped' });
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
			this.setState({
				progress: 0,
				status: 'stopped',
			});
		};
		soundFileAudio.play().catch(() => {
			this.setState({
				progress: 0,
				status: 'stopped',
			});
		});
		this.setState({
			soundFileAudio: soundFileAudio,
			status: 'playing'
		});
	};

	pause = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { soundFileAudio } = this.state;
		this.setState({
			status: 'paused'
		});
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
					id={id}
					key={id}
					soundFile={soundFile}
				>{children}</LinkAudioProgress>
			);
		} else if (classes.includes('super-compact')) {
			return (
				<CircularAudioProgress
					id={id}
					inline={inline}
					key={id}
					soundFile={soundFile}
				/>
			);
		} else if (classes.includes('super-compact-speaker')) {
			return (
				<CircularAudioProgressAnimatedSpeaker
					id={id}
					inline={inline}
					key={id}
					soundFile={soundFile}
				/>
			);
		} else if (classes.includes('compact')) {
			return (
				<audio
					className={`${className ? className : ''}`}
					controls
					id={id}
					key={id}
					onPlay={(e) => this.notePlaying(e, true)}
					ref={this.audioRef}
				><source src={soundFile} /></audio>
			);
		} else {
			if (listenText !== '') {
				return (
					<label className='audio-clip' htmlFor={`${id}`}>{listenText}{listenText === '' ? '' : ':'}&nbsp;
						<audio
							className={`${className ? className : ''}`}
							controls
							id={`${id}`}
							key={id}
							onPlay={(e) => this.notePlaying(e, true)}
							ref={this.audioRef}
						><source src={soundFile}
							/></audio>
					</label>
				);
			} else {
				return (
					<div className={`audio-clip`}><audio
						className={`${className ? className : ''}`}
						controls
						id={id}
						key={id}
						onPlay={(e) => this.notePlaying(e, true)}
						ref={this.audioRef}
					><source src={soundFile} /></audio></div>
				);
			}
		}
	};
}

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
		const compactDimension = 27;
		const size = compactDimension;

		const circumference = Math.PI * size;
		const offset = circumference * (1 - (progress / duration || 0));
		if (this.circleRef.current) {
			this.circleRef.current.style.strokeDashoffset = offset;
		}
	};

	render = () => {
		const strokeWidth = 2;
		const bgColour = 'var(--border)'; // Keep ring subtle in both light and dark themes.

		const inline = this.props;

		const root = getComputedStyle(document.documentElement);
		let compactDimension = root.getPropertyValue('--compact-dimension').trim();
		compactDimension = parseInt(compactDimension);
		const size = compactDimension;
		const radius = (size - strokeWidth) / 2;

		const circumference = Math.PI * size;
		const { status = 'stopped' } = this.state;
		if (isNaN(size)){
			return null;
		} else {
			return (
				<button
					type="button"
					className={`audio-container ${inline ? 'inline' : ''} super-compact circular-audio-progress ${status}`}
					onClick={this.handleClick}
					ref={this.audioRef}
					aria-label={`${status !== 'playing' ? 'Click to play' : 'Click to pause'}`}
				>
					<svg
						fill="none"
						width={size}
						height={size}>
						{/* Background ring */}
						<circle
							cx={size / 2}
							cy={size / 2}
							r={radius}
							stroke={bgColour}
							strokeWidth={strokeWidth}
							fill="none"
						/>
						{/* Progress ring */}
						<circle
							ref={this.circleRef}
							cx={size / 2}
							cy={size / 2}
							r={radius}
							stroke="currentColor"
							strokeWidth={strokeWidth}
							fill="none"
							strokeDasharray={circumference}
							strokeDashoffset={circumference}
							transform={`rotate(-90 ${size / 2} ${size / 2})`}
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
		const { inline } = this.props;
		const { status = 'stopped', progress = 0, duration = 0 } = this.state;

		return (
			<span
				// Keep these wrappers if you still rely on ref/onPlay here.
				// If you don't need them, you can drop the wrapper and pass everything straight through.
				onPlay={(e) => this.notePlaying(e, false)}
				ref={this.audioRef}
			>
				<CircularAudioProgressAnimatedSpeakerDisplay
					inline={inline}
					status={status}
					progress={progress}
					duration={duration}
					handleClick={this.handleClick}
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
		const { children } = this.props;
		const { status = 'stopped', progress = 0, duration = 0 } = this.state;

		return (
			<button
				type="button"
				className={`audio-link ${status}`}
				onClick={this.handleClick}
				ref={this.linkRef}
				aria-label={`${status !== 'playing' ? 'Click to play' : 'Click to pause'}`}>
				<CircularAudioProgressAnimatedSpeakerDisplay
					inline={true}
					status={status}
					progress={progress}
					duration={duration}
					interactive={false}
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
