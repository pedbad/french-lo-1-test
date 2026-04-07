import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import React from 'react';

const AUDIO_ICON_VIEWBOX_SIZE = 24;
const AUDIO_ICON_CENTER = AUDIO_ICON_VIEWBOX_SIZE / 2;
const AUDIO_ICON_RADIUS = 11;
const AUDIO_ICON_CIRCUMFERENCE = 2 * Math.PI * AUDIO_ICON_RADIUS;

export class CircularAudioProgressAnimatedSpeakerDisplay extends React.PureComponent {
	constructor(props) {
		super(props);
		this.circleRef = React.createRef();
	}

	componentDidMount() {
		this.updateCircleOffset();
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.progress !== this.props.progress ||
			prevProps.duration !== this.props.duration
		) {
			this.updateCircleOffset();
		}
	}

	updateCircleOffset = () => {
		const { progress = 0, duration = 0 } = this.props;
		if (!this.circleRef.current) return;
		const ratio = duration > 0 ? progress / duration : 0;
		const offset = AUDIO_ICON_CIRCUMFERENCE * (1 - ratio);
		this.circleRef.current.style.strokeDashoffset = offset;
	};

	render = () => {
		const {
			// progress = 0,
			// duration = 0,
			handleClick,
			status = 'stopped',
			inline = false,
			className = '',
			title,
			interactive = true,
		} = this.props;

		const strokeWidth = 1.8;
		const arcStrokeWidth = 1.2;
		const bgColour = 'var(--border)';

		const root = getComputedStyle(document.documentElement);
		let compactDimension = root.getPropertyValue('--compact-dimension').trim();
		compactDimension = parseInt(compactDimension, 10);
		const requestedSize = Number.parseInt(this.props.size, 10);
		if (Number.isFinite(requestedSize) && requestedSize > 0) {
			compactDimension = requestedSize;
		}

		if (isNaN(compactDimension)) return null;

		const size = compactDimension;

		const tooltipText = title || (status === 'playing' ? 'Click to pause' : 'Click to play');

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					{interactive ? (
						<button
							type="button"
							aria-label={tooltipText}
							className={`audio-container ${inline ? 'inline' : ''} super-compact-speaker circular-audio-progress-speaker ${status} ${className}`}
							onClick={handleClick}
							style={{ width: `${size}px`, height: `${size}px` }}
						>
							<svg className="pointer-events-none" width={size} height={size} viewBox={`0 0 ${AUDIO_ICON_VIEWBOX_SIZE} ${AUDIO_ICON_VIEWBOX_SIZE}`}>
								{/* Background ring */}
								<circle
									cx={AUDIO_ICON_CENTER}
									cy={AUDIO_ICON_CENTER}
									r={AUDIO_ICON_RADIUS}
									stroke={bgColour}
									strokeWidth={strokeWidth}
									fill="none"
								/>

								{/* Progress ring */}
								<circle
									ref={this.circleRef}
									cx={AUDIO_ICON_CENTER}
									cy={AUDIO_ICON_CENTER}
									r={AUDIO_ICON_RADIUS}
									stroke="currentColor"
									strokeWidth={strokeWidth}
									fill="none"
									strokeDasharray={AUDIO_ICON_CIRCUMFERENCE}
									strokeDashoffset={AUDIO_ICON_CIRCUMFERENCE}
									transform={`rotate(-90 ${AUDIO_ICON_CENTER} ${AUDIO_ICON_CENTER})`}
									style={{ transition: 'stroke-dashoffset 0.2s linear' }}
								/>

								{/* Speaker */}
								<path
									fill="currentColor"
									d="M10.4 8.1a.8.8 0 0 0-1.36-.57L6.2 10.35a1.15 1.15 0 0 1-.82.34H3.9a.9.9 0 0 0-.9.9v.82a.9.9 0 0 0 .9.9h1.48c.31 0 .61.12.82.34l2.84 2.82a.8.8 0 0 0 1.36-.57z"
								/>

								{/* Arcs */}
								<path
									className="speaker-arc speaker-arc1"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth={arcStrokeWidth}
									vectorEffect="non-scaling-stroke"
									d="M13.9 9.3a4.5 4.5 0 0 1 0 5.4"
								/>
								<path
									className="speaker-arc speaker-arc2"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth={arcStrokeWidth}
									vectorEffect="non-scaling-stroke"
									d="M16.2 7.3a7.5 7.5 0 0 1 0 9.4"
								/>
							</svg>
						</button>
					) : (
						<span
							aria-hidden="true"
							className={`audio-container ${inline ? 'inline' : ''} super-compact-speaker circular-audio-progress-speaker ${status} ${className}`}
							style={{ width: `${size}px`, height: `${size}px` }}
						>
							<svg className="pointer-events-none" width={size} height={size} viewBox={`0 0 ${AUDIO_ICON_VIEWBOX_SIZE} ${AUDIO_ICON_VIEWBOX_SIZE}`}>
								{/* Background ring */}
								<circle
									cx={AUDIO_ICON_CENTER}
									cy={AUDIO_ICON_CENTER}
									r={AUDIO_ICON_RADIUS}
									stroke={bgColour}
									strokeWidth={strokeWidth}
									fill="none"
								/>

								{/* Progress ring */}
								<circle
									ref={this.circleRef}
									cx={AUDIO_ICON_CENTER}
									cy={AUDIO_ICON_CENTER}
									r={AUDIO_ICON_RADIUS}
									stroke="currentColor"
									strokeWidth={strokeWidth}
									fill="none"
									strokeDasharray={AUDIO_ICON_CIRCUMFERENCE}
									strokeDashoffset={AUDIO_ICON_CIRCUMFERENCE}
									transform={`rotate(-90 ${AUDIO_ICON_CENTER} ${AUDIO_ICON_CENTER})`}
									style={{ transition: 'stroke-dashoffset 0.2s linear' }}
								/>

								{/* Speaker */}
								<path
									fill="currentColor"
									d="M10.4 8.1a.8.8 0 0 0-1.36-.57L6.2 10.35a1.15 1.15 0 0 1-.82.34H3.9a.9.9 0 0 0-.9.9v.82a.9.9 0 0 0 .9.9h1.48c.31 0 .61.12.82.34l2.84 2.82a.8.8 0 0 0 1.36-.57z"
								/>

								{/* Arcs */}
								<path
									className="speaker-arc speaker-arc1"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth={arcStrokeWidth}
									vectorEffect="non-scaling-stroke"
									d="M13.9 9.3a4.5 4.5 0 0 1 0 5.4"
								/>
								<path
									className="speaker-arc speaker-arc2"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth={arcStrokeWidth}
									vectorEffect="non-scaling-stroke"
									d="M16.2 7.3a7.5 7.5 0 0 1 0 9.4"
								/>
							</svg>
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent className="bg-[var(--footer-background)] text-foreground">
					{tooltipText}
				</TooltipContent>
			</Tooltip>
		);
	};
}
