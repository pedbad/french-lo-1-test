import React from "react";
import { stopAllAudioPlayback } from "../../utility";

export class SequenceAudioController extends React.Component {
	constructor(props) {
		super(props);

		this.audioRef = React.createRef();

		// Not in state: avoids rerenders while we fill it
		this.durations = []; // seconds per track (index -> number)

		// Instance flags (not state) so we don't rerender during pointer interactions
		this.isScrubbing = false;

		this.state = {
			clipDuration: 0,
			clipTime: 0, // current track time
			currentIndex: 0,
			masterDuration: 0,
			masterTime: 0, // overall sequence time
			playSequence: false,
			playState: "stopped", // "playing" | "paused" | "stopped"
			scrubTime: null, // transient UI-only MASTER time while scrubbing
			volume: 1,
		};
	}

	componentDidMount() {
		const audio = this.audioRef.current;
		audio.addEventListener("timeupdate", this.handleTimeUpdate);
		audio.addEventListener("ended", this.handleEnded);
		audio.addEventListener("loadedmetadata", this.handleLoadedMetadata);

		this.preloadDurations();
	}

	componentWillUnmount() {
		const audio = this.audioRef.current;
		audio.removeEventListener("timeupdate", this.handleTimeUpdate);
		audio.removeEventListener("ended", this.handleEnded);
		audio.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
	}

	emitPlayState = () => {
		if (this.props.onPlayStateChange) {
			this.props.onPlayStateChange(this.state.playState);
		}
	};

	/* ---------- Duration preload (optional) ---------- */

	preloadDurations = () => {
		const { sources = [] } = this.props;
		if (!sources.length) return;

		const loads = sources.map((src, i) => {
			return new Promise((resolve) => {
				const a = new Audio();
				a.preload = "metadata";
				a.src = src;

				const done = () => {
					const d = Number.isFinite(a.duration) ? a.duration : 0;
					this.durations[i] = d;
					resolve(d);
				};

				a.addEventListener("loadedmetadata", done, { once: true });
				a.addEventListener("error", () => resolve(0), { once: true });
			});
		});

		Promise.all(loads).then(() => {
			const sum = this.durations.reduce((acc, d) => acc + (d || 0), 0);

			// Never allow preload to shrink an already-better duration
			this.setState((prev) => ({
				masterDuration: Math.max(prev.masterDuration || 0, sum || 0),
			}));
		});
	};

	/* ---------- Helpers for master timeline ---------- */

	getMasterTime = (index, clipTime) => {
		let t = 0;
		for (let i = 0; i < index; i++) t += this.durations[i] || 0;
		return t + (clipTime || 0);
	};

	computeMasterDuration = () => {
		const { sources = [] } = this.props;
		let sum = 0;
		for (let i = 0; i < sources.length; i++) sum += this.durations[i] || 0;
		return sum;
	};

	hasUnknownDurations = () => {
		const { sources = [] } = this.props;
		for (let i = 0; i < sources.length; i++) {
			if (!(this.durations[i] > 0)) return true; // 0, NaN, undefined
		}
		return false;
	};

	/**
	 * IMPORTANT:
	 * If any durations are still unknown (0), the raw computed masterDuration
	 * will be too small and the scrubber may "hit the end" early.
	 * So while there are unknowns, we *never shrink* masterDuration.
	 */
	getSafeMasterDuration = () => {
		const sum = this.computeMasterDuration();
		if (!this.hasUnknownDurations()) return sum;

		// While incomplete, keep the best (largest) duration we've ever had.
		return Math.max(this.state.masterDuration || 0, sum || 0);
	};

	// Map a master time (seconds) to { index, offsetSeconds }
	locateMasterTime = (masterTime) => {
		const { sources = [] } = this.props;
		let t = masterTime;

		for (let i = 0; i < sources.length; i++) {
			const d = this.durations[i] || 0;

			// if duration unknown (0), treat as "current bucket" to avoid NaNs
			if (d <= 0) return { index: i, offset: Math.max(0, t) };

			if (t <= d || i === sources.length - 1) {
				return { index: i, offset: Math.max(0, Math.min(t, d)) };
			}

			t -= d;
		}
		return { index: 0, offset: 0 };
	};

	/* ---------- Events up to Blanks ---------- */

	emitTrackChange = (index) => {
		if (this.props.onTrackChange) this.props.onTrackChange(index);
	};

	emitStopped = () => {
		if (this.props.onStopped) this.props.onStopped(this.state.currentIndex);
	};

	/* ---------- Master control ---------- */

	toggleMasterPlay = () => {
		const audio = this.audioRef.current;
		const { playState } = this.state;

		if (playState === "paused") {
			stopAllAudioPlayback(audio);
			audio.play();
			this.setState(
				{
					playSequence: true,
					playState: "playing",
				},
				this.emitPlayState
			);
			return;
		}

		if (playState === "stopped") {
			this.playItem(0, { playSequence: true });
			return;
		}

		audio.pause();
		this.setState({ playState: "paused" }, this.emitPlayState);
	};

	toggle = () => {
		const { playState } = this.state;
		const audio = this.audioRef.current;

		if (playState === "playing") {
			audio.pause();
			this.setState({ playState: "paused" }, this.emitPlayState);
		} else if (playState === "paused") {
			stopAllAudioPlayback(audio);
			audio.play();
			this.setState({ playState: "playing" }, this.emitPlayState);
		} else {
			this.toggleMasterPlay();
		}
	};

	/* ---------- Public API (called by Blanks) ---------- */

	playItem = (index, opts = {}) => {
		const { sources = [] } = this.props;
		const src = sources[index];
		if (!src) return;

		const { playSequence = false, offset = 0 } = opts;

		const audio = this.audioRef.current;
		audio.src = src;
		audio.load();

		const start = () => {
			try {
				audio.currentTime = offset || 0;
			// eslint-disable-next-line no-unused-vars
			} catch (e) {
				// ignore
			}

			const shouldPlay = opts.autoplay !== false;
			if (shouldPlay) {
				stopAllAudioPlayback(audio);
				audio.play().catch(console.error); // eslint-disable-line
			}

			const d = Number.isFinite(audio.duration)
				? audio.duration
				: this.durations[index] || 0;

			this.durations[index] = d;

			const masterDuration = this.getSafeMasterDuration();
			const masterTime = this.getMasterTime(index, audio.currentTime);

			this.setState(
				{
					clipDuration: d,
					clipTime: audio.currentTime,
					currentIndex: index,
					masterDuration,
					masterTime,
					playSequence,
					playState: shouldPlay ? "playing" : "paused",
				},
				this.emitPlayState
			);

			this.emitTrackChange(index);
		};

		if (Number.isFinite(audio.duration) && audio.duration > 0) {
			start();
		} else {
			audio.addEventListener("loadedmetadata", start, { once: true });
		}
	};

	// Seek in master timeline (overall sequence)
	seekMaster = (masterTime) => {
		const { playState, playSequence } = this.state;
		const { index, offset } = this.locateMasterTime(masterTime);
		const autoplay = playState === "playing";

		this.playItem(index, { autoplay, offset, playSequence });
	};

	setVolume = (volume) => {
		this.audioRef.current.volume = volume;
		this.setState({ volume });
	};

	/* ---------- Internal handlers ---------- */

	handleLoadedMetadata = () => {
		const audio = this.audioRef.current;
		const { currentIndex } = this.state;

		const d = Number.isFinite(audio.duration) ? audio.duration : 0;
		this.durations[currentIndex] = d;

		const masterDuration = this.getSafeMasterDuration();
		const masterTime = this.getMasterTime(currentIndex, audio.currentTime);

		this.setState({
			clipDuration: d,
			masterDuration,
			masterTime,
		});
	};

	handleTimeUpdate = () => {
		if (this.isScrubbing) return; // ✅ critical: stop flicker + stop tile jump

		const audio = this.audioRef.current;
		const { currentIndex } = this.state;

		const clipTime = audio.currentTime;
		const clipDuration = audio.duration || 0;

		const masterTime = this.getMasterTime(currentIndex, clipTime);
		const masterDuration = this.getSafeMasterDuration();

		this.setState({
			clipDuration,
			clipTime,
			masterDuration,
			masterTime,
		});

		if (this.props.onTimeUpdate) {
			this.props.onTimeUpdate(
				currentIndex,
				clipTime,
				clipDuration,
				masterTime,
				masterDuration
			);
		}
	};

	handleEnded = () => {
		const { pauseSeconds = 0, sources = [] } = this.props;
		const { currentIndex, playSequence } = this.state;

		if (!playSequence) {
			this.setState({ playState: "stopped" }, () => {
				this.emitPlayState();
				this.emitStopped();
			});
			return;
		}

		const nextIndex = currentIndex + 1;

		if (nextIndex >= sources.length) {
			this.setState({ playState: "stopped" }, () => this.emitStopped());
			return;
		}

		setTimeout(() => {
			this.playItem(nextIndex, { playSequence: true });
		}, pauseSeconds * 1000);
	};

	/* ---------- Scrubber (Pointer events = mouse + touch, no duplication) ---------- */

	startScrub = (e) => {
		e.stopPropagation();
		this.isScrubbing = true;

		// Capture pointer so we still get the up event if the user drags off the control
		// eslint-disable-next-line eqeqeq
		if (e.currentTarget && e.pointerId != null) {
			try {
				e.currentTarget.setPointerCapture(e.pointerId);
			} catch {
				/* empty */
			}
		}

		// initialise scrub to current masterTime
		this.setState((prev) => ({ scrubTime: prev.masterTime }));
	};

	moveScrub = (e) => {
		e.stopPropagation();
	};

	changeScrub = (e) => {
		e.stopPropagation();
		const t = parseFloat(e.target.value);
		if (!Number.isFinite(t)) return;

		// UI-only while dragging
		this.setState({ scrubTime: t });
	};

	endScrub = (e) => {
		e.stopPropagation();

		// eslint-disable-next-line eqeqeq
		if (e.currentTarget && e.pointerId != null) {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch { /* empty */ }
		}

		this.isScrubbing = false;

		this.setState((prev) => {
			const commitTime = prev.scrubTime;

			// commit AFTER state clears scrubTime
			queueMicrotask(() => {
				// eslint-disable-next-line eqeqeq
				if (commitTime != null) {
					this.seekMaster(commitTime);
				}
			});

			return { scrubTime: null };
		});
	};

	/* ---------- Render ---------- */

	render() {
		const { masterTime, masterDuration, scrubTime, playState, volume } = this.state;

		const displayTime = scrubTime !== null ? scrubTime : masterTime;
		const sliderAccentStyle = { accentColor: "var(--footer-background)" };

		return (
			<div
				className="sequence-audio-controller relative mt-4 w-full rounded-[0.6rem] border border-[var(--border)] bg-[var(--muted)] p-2"
				onMouseDown={(e) => e.stopPropagation()}
				onTouchStart={(e) => e.stopPropagation()}
			>
				<audio ref={this.audioRef} />

				<div className="controls grid min-w-0 grid-cols-[0.1fr_2fr_0.1fr_1fr] [grid-template-rows:1fr] [grid-auto-flow:row] items-center gap-x-2 text-[var(--foreground)]">
					<button
						className={`play-pause justify-self-end cursor-pointer text-base`}
						onClick={this.toggleMasterPlay}
						title={playState === "playing" ? "Pause" : "Play"}
					>
						{playState === "playing" ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
								<path d="M.682.003H7v19.994H.682ZM13 .003h6.318v19.994H13z" style={{ fill: "currentColor" }} />
							</svg>
						) : (
							<svg width="16" height="16" viewBox="0 0 14 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path
									d="M12.8378 7.01827L2.19005 0.21473C1.32492 -0.337792 0 0.198383 0 1.56498V15.1688C0 16.3948 1.23114 17.1337 2.19005 16.519L12.8378 9.71877C13.7876 9.11394 13.7906 7.62311 12.8378 7.01827Z"
									fill="currentColor"
								/>
							</svg>
						)}
					</button>

					<input
						className={`play-scrubber min-w-0 w-full`}
						type="range"
						min="0"
						max={masterDuration || 0}
						step="0.01"
						value={displayTime}
						onPointerDown={this.startScrub}
						onPointerMove={this.moveScrub}
						onPointerUp={this.endScrub}
						onChange={this.changeScrub}
						style={sliderAccentStyle}
						title="Play progress"
					/>

					<svg className={`volume-icon justify-self-end`} width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.001 20">
						<path
							className="vol1"
							d="M98.024 132.952h3.269v2.513h-3.269z"
							style={{ fill: "currentColor", opacity: volume > 0.2 ? 1 : volume + 0.1 }}
							transform="translate(-95.102 -119.3)"
						/>
						<path
							className="vol2"
							d="M102.427 130.321h3.531v5.143h-3.531z"
							style={{ fill: "currentColor", opacity: volume > 0.4 ? 1 : volume + 0.1 }}
							transform="translate(-95.102 -119.3)"
						/>
						<path
							className="vol2"
							d="M107.025 127.282h3.4v8.182h-3.4z"
							style={{ fill: "currentColor", opacity: volume > 0.6 ? 1 : volume + 0.1 }}
							transform="translate(-95.102 -119.3)"
						/>
						<path
							className="vol3"
							d="M111.428 124.535h3.662v10.929h-3.662z"
							style={{ fill: "currentColor", opacity: volume > 0.8 ? 1 : volume + 0.1 }}
							transform="translate(-95.102 -119.3)"
						/>
					</svg>

					<input
						className={`volume-slider min-w-0 w-full`}
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						onChange={(e) => this.setVolume(parseFloat(e.target.value))}
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						style={sliderAccentStyle}
						title="Volume"
					/>
				</div>
			</div>
		);
	}
}
