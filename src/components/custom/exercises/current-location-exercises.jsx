import { SequenceAudioController } from "@/components/SequenceAudioController";
import { exerciseActionButtonVariants } from "@/components/exerciseActionButtonVariants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveAsset } from "@/utils/assets";
import { BookOpenText, Eye, EyeOff } from "lucide-react";
import { PureComponent } from "react";

export class CurrentLocationNasalRhymeExercise extends PureComponent{
	constructor(props) {
		super(props);
		this.state = {
			showNasalHighlights: false,
		};
	}

	toggleNasalHighlights = () => {
		this.setState((prev) => ({
			showNasalHighlights: !prev.showNasalHighlights,
		}));
	};

	render = () => {
		const { id } = this.props;
		const { showNasalHighlights } = this.state;
		return (
			<div
				className={`lo4-ex1`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<div>
						<div className="mb-3">
							<SequenceAudioController sources={[resolveAsset(`/audio/lo4/exercises/lo4exercise1/001-nonsense-rhyme.mp3`)]} />
						</div>
						{/* Use poem semantics so assistive tech gets title, lines, and attribution structure instead of a single paragraph with <br>. */}
						<Card className="border-border/70 bg-[color-mix(in_oklab,var(--card)_86%,var(--muted)_14%)] shadow-sm">
							<CardContent className="p-4 sm:p-5">
								<article
									aria-labelledby={id ? `${id}-poem-title` : undefined}
									className={showNasalHighlights ? "[&_strong]:font-semibold [&_strong]:text-[var(--modal-link-hover)]" : "[&_strong]:font-normal [&_strong]:text-inherit"}
								>
									<div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/70 pb-2">
										<h4 className="m-0 flex items-center gap-2 text-[var(--font-size-lg)]" id={id ? `${id}-poem-title` : undefined}>
											<BookOpenText aria-hidden="true" className="h-5 w-5 text-[var(--chart-3)]" />
											<span>Tu aimes… ?</span>
										</h4>
										<p className="m-0 text-xs text-muted-foreground" aria-label="Poem attribution">&copy; Jacqueline Rosen</p>
									</div>
									<div className="space-y-2.5">
										<p className="m-0 rounded-md bg-muted/35 px-4 py-2.5 leading-8">
											<span className="block">Tu aimes Quent<strong>in</strong> ?</span>
											<span className="block">Je n&apos;aime pas Quent<strong>in</strong>,</span>
											<span className="block">Il lit T<strong>in</strong>t<strong>in</strong> !</span>
										</p>
										<p className="m-0 rounded-md bg-muted/35 px-4 py-2.5 leading-8">
											<span className="block">Tu aimes Mart<strong>in</strong> ?</span>
											<span className="block">Je n&apos;aime pas Mart<strong>in</strong> !</span>
											<span className="block">Il boit du v<strong>in</strong> !</span>
										</p>
										<p className="m-0 rounded-md bg-muted/35 px-4 py-2.5 leading-8">
											<span className="block">Tu aimes Corent<strong>in</strong> ?</span>
											<span className="block">J&apos;aime bi<strong>en</strong> Corent<strong>in</strong> !</span>
											<span className="block">Il a un beau jard<strong>in</strong>.</span>
										</p>
										<p className="m-0 rounded-md bg-muted/35 px-4 py-2.5 leading-8">
											<span className="block">Tu aimes Dami<strong>en</strong> ?</span>
											<span className="block">Je n&apos;aime pas Dami<strong>en</strong>.</span>
											<span className="block">Il ne se lave pas les ma<strong>in</strong>s!</span>
										</p>
										<p className="m-0 rounded-md bg-muted/35 px-4 py-2.5 leading-8">
											<span className="block">Tu aimes Sébasti<strong>en</strong> ?</span>
											<span className="block">Oh, j&apos;adore Sébasti<strong>en</strong> !</span>
											<span className="block">C&apos;est mon vois<strong>in</strong> !</span>
										</p>
									</div>
									<div className="mt-3 flex justify-end">
										<Button
											aria-pressed={showNasalHighlights}
											className={`${exerciseActionButtonVariants({ tone: "warn" })} cursor-pointer hover:cursor-pointer`}
											onClick={this.toggleNasalHighlights}
											type="button"
										>
											{showNasalHighlights ? (
												<EyeOff aria-hidden="true" className="h-4 w-4" />
											) : (
												<Eye aria-hidden="true" className="h-4 w-4" />
											)}
											<span className="exercise-icon-button-label">
												{showNasalHighlights ? "Hide answer" : "Show answer"}
											</span>
										</Button>
									</div>
								</article>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	};

}

