import './AudioClip.scss';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import React from 'react';
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

		const root = getComputedStyle(document.documentElement);
		let compactDimension = root.getPropertyValue('--compact-dimension').trim();
		compactDimension = parseInt(compactDimension, 10);

		if (isNaN(compactDimension) || !this.circleRef.current) return;

		const size = compactDimension;
		const strokeWidth = 2;
		const radius = (size - strokeWidth) / 2;

		const circumference = 2 * Math.PI * radius;
		const ratio = duration > 0 ? progress / duration : 0;

		const offset = circumference * (1 - ratio);
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
		} = this.props;

		const strokeWidth = 2;
		const arcStrokeWidth = 1.2;
		const bgColour = 'var(--border)';

		const root = getComputedStyle(document.documentElement);
		let compactDimension = root.getPropertyValue('--compact-dimension').trim();
		compactDimension = parseInt(compactDimension, 10);

		if (isNaN(compactDimension)) return null;

		const size = compactDimension;
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;

		const tooltipText = title || (status === 'playing' ? 'Click to pause' : 'Click to play');

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						aria-label={tooltipText}
						className={`audio-container ${inline ? 'inline' : ''} super-compact-speaker circular-audio-progress-speaker ${status} ${className}`}
						onClick={handleClick}
						role="button"
					>
						<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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

							{/* Speaker */}
							<path
								fill="currentColor"
								d="m 13.43611,6.201 a 0.705,0.705 0 0 0 -1.203,-0.498 L 8.8491185,9.086 a 1.4,1.4 0 0 1 -0.997,0.413 H 5.4361182 a 1,1 0 0 0 -1,1 v 6 a 1,1 0 0 0 1,1 h 2.4160003 a 1.4,1.4 0 0 1 0.997,0.413 l 3.3829915,3.384 a 0.705,0.705 0 0 0 1.204,-0.499 z"
							/>

							{/* Arcs */}
							<path
								className="speaker-arc speaker-arc1"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth={arcStrokeWidth}
								vectorEffect="non-scaling-stroke"
								d="m 15.19902,17.870116 c 1.839235,-0.04527 3.312505,-1.987363 3.314457,-4.369171 -0.0012,-2.382542 -1.474655,-4.3257717 -3.314457,-4.371061"
							/>
							<path
								className="speaker-arc speaker-arc2"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth={arcStrokeWidth}
								vectorEffect="non-scaling-stroke"
								d="m 15.19902,17.870116 c 1.839235,-0.04527 3.312505,-1.987363 3.314457,-4.369171 -0.0012,-2.382542 -1.474655,-4.3257717 -3.314457,-4.371061"
							/>
						</svg>
					</span>
				</TooltipTrigger>
				<TooltipContent className="bg-[var(--footer-background)] text-foreground">
					{tooltipText}
				</TooltipContent>
			</Tooltip>
		);
	};
}
