import { AudioClip } from "@/components/media";
import { cn } from "@/lib/utils";
import { MEMORY_CARD_FLIP_DURATION_MS } from "@/constants/layout";
import { resolveAsset } from "@/utils/assets";
import { BadgeQuestionMark } from "lucide-react";
import React from 'react';

export class Card extends React.PureComponent {
	handleKeyDown = (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		this.props.handleClick(this.props.card);
	};

	render = () => {

		const {
			card,
			cardRef,
			className,
			handleClick,
			id,
		} = this.props;
		const classTokens = new Set((className || "").split(/\s+/).filter(Boolean));
		const isFlipped = classTokens.has('flipped');
		const isMatched = classTokens.has('matched');
		const isRevealed = isFlipped || isMatched;
		const tiltClass = isMatched
			? "[transform:translateY(-1px)_rotateY(0deg)_rotateX(0deg)]"
			: isRevealed
				? "[transform:translateY(-2px)_rotateY(0deg)_rotateX(0deg)]"
				: card.type === 'image'
					? "[transform:translateY(0px)_rotateY(-14deg)_rotateX(0deg)] hover:[transform:translateY(-2px)_rotateY(-9deg)_rotateX(0deg)]"
					: "[transform:translateY(0px)_rotateY(14deg)_rotateX(0deg)] hover:[transform:translateY(-2px)_rotateY(9deg)_rotateX(0deg)]";
		const flipClass = isRevealed
			? "[transform:rotateY(180deg)]"
			: "[transform:rotateY(0deg)]";
		const stateClass = isMatched
			? "border-[color-mix(in_oklab,var(--chart-2)_58%,var(--border))] bg-[color-mix(in_oklab,var(--chart-2)_8%,var(--card))] shadow-[0_10px_22px_color-mix(in_oklab,var(--chart-2)_18%,transparent)]"
			: isRevealed
				? "border-border-subtle bg-card shadow-[0_6px_14px_color-mix(in_oklab,var(--chart-3)_12%,transparent)]"
				: "border-[rgb(var(--color-primary-400)_/_0.92)] bg-[rgb(var(--color-primary-200)_/_0.78)] shadow-[0_6px_14px_color-mix(in_oklab,var(--chart-3)_20%,transparent)] hover:border-[rgb(var(--color-primary-400)_/_1)] hover:bg-[rgb(var(--color-primary-300)_/_0.9)] hover:shadow-[0_10px_22px_color-mix(in_oklab,var(--chart-3)_28%,transparent)]";

		return (
			<div
				key={id}
				className={cn(
					"memory-card group relative aspect-square w-full select-none",
					className
				)}
				ref={cardRef}
			>
				<div
					className={cn(
						"relative h-full w-full cursor-pointer overflow-hidden rounded-xl border p-0 text-center font-bold text-card-foreground [perspective:1200px] [transform-style:preserve-3d] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						tiltClass,
						stateClass
					)}
					aria-label="Click to flip"
					onClick={() => handleClick(card)}
					onKeyDown={this.handleKeyDown}
					role="button"
					tabIndex={0}
					title="Click to flip"
				>
					<div
						className={cn(
							"relative h-full w-full rounded-[inherit] [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(0.22,0.9,0.25,1)] will-change-transform",
							flipClass
						)}
						style={{ transitionDuration: `${MEMORY_CARD_FLIP_DURATION_MS}ms` }}
					>
						<div
							aria-hidden="true"
							className="absolute inset-0 grid h-full w-full place-items-center overflow-hidden rounded-[inherit] bg-[linear-gradient(160deg,rgb(var(--color-primary-50)_/_0.98),rgb(var(--color-primary-200)_/_0.92))] text-[rgb(var(--color-text-secondary)_/_1)] shadow-[inset_0_1px_0_rgb(var(--color-primary-50)_/_0.85),inset_0_-12px_18px_rgb(var(--color-primary-300)_/_0.16)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)]"
						>
							<div className="absolute inset-[8%] rounded-[calc(var(--radius)-0.1rem)] border border-[rgb(var(--color-primary-400)_/_0.26)] opacity-80" />
							<div className="absolute left-[14%] top-[10%] h-8 w-8 rounded-full bg-white/45 blur-xl" />
							<BadgeQuestionMark
								aria-hidden="true"
								className="relative z-[1] h-10 w-10"
								strokeWidth={1}
								style={{ color: "var(--chart-3)" }}
							/>
						</div>
						<div className="absolute inset-0 flex h-full w-full rounded-[inherit] bg-[linear-gradient(180deg,rgb(var(--color-background)_/_1),rgb(var(--color-primary-50)_/_0.42))] p-2 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)]">
							<div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-[calc(var(--radius)-0.15rem)] bg-card/92 px-1 shadow-[inset_0_1px_0_rgb(var(--color-primary-50)_/_0.7)]">
								{card.type === 'text' ? (
									<AudioClip className="link memory-card-audio-link inline-flex items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-[calc(var(--font-size-sm)*0.92)] font-semibold leading-none" soundFile={`${card.audio}`} title={`Listen to ${card.content}`}>
										<span>{card.content}</span>
									</AudioClip>
								) : (
									<div
										className="memory-card-image h-full w-full bg-contain bg-center bg-no-repeat"
										style={{ backgroundImage: `url(${resolveAsset(card.image)})` }}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
