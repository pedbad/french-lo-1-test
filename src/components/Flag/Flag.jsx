import React, { createRef, PureComponent } from 'react';

export class Flag extends PureComponent {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();
		this.flagLoaded = false;
		this.totalFrames = 60;
		this.frameIndex = 0;
		this.filmCanvas = null;
		this.filmCtx = null;
		this.usingCachedFrames = false;
		this.time = 0;
	}

	componentDidMount = () => {
		this.loadFlag();
	};

	componentDidUpdate = () => {
		this.loadFlag();
	};

	loadFlag = () => {
		if (this.flagLoaded) return;

		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		const DPR = window.devicePixelRatio || 1;
		const image = new Image();

		image.onload = () => {
			const { width, height } = image;
			const amplitude = 8;
			const shadowBuffer = this.props.shadow ? 20 : 0;
			const totalWidth = width + shadowBuffer * 2;
			const totalHeight = height + amplitude * 2 + shadowBuffer * 2;

			canvas.width = totalWidth * DPR;
			canvas.height = totalHeight * DPR;
			canvas.style.width = `${totalWidth}px`;
			canvas.style.height = `${totalHeight}px`;
			ctx.setTransform(DPR, 0, 0, DPR, shadowBuffer, shadowBuffer);

			// Set up visible film strip canvas
			this.filmCanvas = document.createElement('canvas');
			this.filmCanvas.width = width * this.totalFrames;
			this.filmCanvas.height = height + amplitude * 2;
			this.filmCtx = this.filmCanvas.getContext('2d');

			// Debug visibility
			this.filmCanvas.style.position = 'absolute';
			this.filmCanvas.style.top = '0';
			this.filmCanvas.style.left = '0';
			this.filmCanvas.style.zIndex = '1000';
			// document.body.appendChild(this.filmCanvas);

			const offCanvas = document.createElement('canvas');
			offCanvas.width = width;
			offCanvas.height = height;
			const offCtx = offCanvas.getContext('2d');
			offCtx.drawImage(image, 0, 0);

			// Pull theme tokens once to keep canvas lighting aligned with the active palette.
			const rootStyles = getComputedStyle(document.documentElement);
			const foregroundRgb = rootStyles.getPropertyValue('--color-text-primary').trim().replace(/\s+/g, ', ');
			const backgroundRgb = rootStyles.getPropertyValue('--color-surface-base').trim().replace(/\s+/g, ', ');

			const draw = () => {
				const { fix, shadow: showDropShadow } = this.props;

				if (showDropShadow) {
					ctx.shadowColor = `rgba(${foregroundRgb}, 0.25)`;
					ctx.shadowBlur = 8;
					ctx.shadowOffsetX = 8;
					ctx.shadowOffsetY = 6;
				} else {
					ctx.shadowColor = 'transparent';
					ctx.shadowBlur = 0;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
				}

				ctx.clearRect(-shadowBuffer, -shadowBuffer, totalWidth, totalHeight);

				const modHeight = height;
				const modAmplitude = amplitude;

				if (!this.usingCachedFrames) {
					// Full render
					for (let x = 0; x < width; x++) {
						let waveOffset;
						switch (fix) {
							case 'left':
								waveOffset = Math.sin(((x - this.time) * 0.05) - (this.time * 0.05)) * amplitude * x / width;
								break;
							case 'right':
								waveOffset = Math.sin(((x - this.time) * 0.05) - (this.time * 0.05)) * amplitude * (width - x) / width;
								break;
							case 'top':
								waveOffset = 0;
								break;
							default:
								waveOffset = Math.sin(((x - this.time) * 0.05) - (this.time * 0.05)) * amplitude;
						}

						const light = Math.sin(((x - this.time) * 0.05 - (this.time * 0.05)) + Math.PI / 2) * 0.5 + 0.5;
						ctx.globalAlpha = 1;

						ctx.drawImage(
							offCanvas,
							x, 0, 1, modHeight,
							x, waveOffset + modAmplitude, 1, modHeight
						);

						ctx.fillStyle = `rgba(${backgroundRgb}, ${0.15 * light})`;
						ctx.fillRect(x, waveOffset + modAmplitude, 1, modHeight);

						ctx.fillStyle = `rgba(${foregroundRgb}, ${0.1 * (1 - light)})`;
						ctx.fillRect(x, waveOffset + modAmplitude, 1, modHeight);
					}

					// Save current frame to film strip
					if (this.frameIndex < this.totalFrames) {
						this.filmCtx.drawImage(
							canvas,
							shadowBuffer, shadowBuffer,
							width, modHeight + modAmplitude * 2,
							this.frameIndex * width, 0,
							width, modHeight + modAmplitude * 2
						);
						this.frameIndex++;
					}
					if (this.frameIndex === this.totalFrames) {
						this.usingCachedFrames = false; // true; for now to test on phones.
					}
				} else {
					const currentFrame = Math.floor(this.time % this.totalFrames);
					ctx.drawImage(
						this.filmCanvas,
						currentFrame * width, 0,
						width, height + amplitude * 2,
						0, 0,
						width, height + amplitude * 2
					);
				}

				this.time = (this.time + 1) % this.totalFrames;
				requestAnimationFrame(draw);
			};

			draw();
		};

		image.src = this.props.flag;
		this.flagLoaded = true;
	};

	render = () => {
		const { shadow } = this.props;
		const flagContainerClass = shadow
			? "relative overflow-visible before:content-[''] before:absolute before:inset-0 before:bg-[url('/images/flagpole.png')] before:bg-no-repeat before:z-0 before:h-[200%] before:bg-[length:14.4%] before:top-[8.1px] before:left-[-9px]"
			: "relative overflow-visible before:content-[''] before:absolute before:inset-0 before:bg-[url('/images/flagpole.png')] before:bg-no-repeat before:z-0 before:h-[200%] before:bg-[length:16.4%] before:top-[-6.2px] before:left-[-26.1px]";
		return (
			<div className={flagContainerClass}>
				<canvas className="relative z-[1001] mt-[19px] block" ref={this.canvasRef} />
			</div>
		);
	};
}
