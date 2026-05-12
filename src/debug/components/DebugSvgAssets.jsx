import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	ArrowLeftRight,
	ArrowUpDown,
	BadgeQuestionMark,
	BookOpenText,
	Check,
	ChevronDown,
	ChevronUp,
	CircleAlert,
	CircleCheck,
	CircleX,
	Eye,
	EyeOff,
	Facebook,
	Info as InfoIcon,
	Instagram,
	Linkedin,
	Mars,
	MessageCircleMore,
	SquareDashedMousePointer,
	Venus,
	Volume1,
	X,
	Youtube,
} from 'lucide-react';
import franceTelephoneMapUrl from '@/assets/lo9/france-telephone-area-codes.svg';
import React from 'react';

const USED_BADGE_CLASS = 'border-emerald-500/70 bg-transparent text-emerald-700 dark:text-emerald-300';
const MISSING_BADGE_CLASS = 'border-amber-500/70 bg-transparent text-amber-700 dark:text-amber-300';
const SRC_PREVIEW_URL_BY_PATH = {
	'/src/assets/lo9/france-telephone-area-codes.svg': franceTelephoneMapUrl,
};

/*
Why manifest-based:
- The previous runtime source scanner used `import.meta.glob(...?raw)` in the browser.
- In this project/base-path setup that caused intermittent dev-module fetch failures.
- A static manifest keeps debug sandbox reliable while still showing real app SVG usage.

Refresh command:
Use ripgrep to list `.svg` references under `src/`, then update this manifest.
*/
const SVG_USAGE_MANIFEST = [
	{
		path: '/img/shared/icons/cross.svg',
		referenceCount: 1,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/book-open-text-outline.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/book-open-text.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/circle-check.svg',
		referenceCount: 4,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/eye.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/message-square-warning.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/reset.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/shared/icons/tortoise.svg',
		referenceCount: 1,
		sources: ['/src/components/exercises/ProgressDots/ProgressDots.jsx'],
	},
	{
		path: '/img/shared/icons/volume-1.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/common/branding/fr-banner.svg',
		referenceCount: 1,
		sources: ['/src/App.jsx'],
	},
	{
		path: '/img/lo1/first-contact.svg',
		referenceCount: 2,
		sources: ['/src/App.jsx', '/src/lo-config/first-contact.json'],
	},
	{
		path: '/img/lo2/about-me.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/about-me.json'],
	},
	{
		path: '/img/lo3/origins-and-languages.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/origins-and-languages.json'],
	},
	{
		path: '/img/lo4/current-location.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/current-location.json'],
	},
	{
		path: '/img/lo5/house-and-home.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/house-and-home.json'],
	},
	{
		path: '/img/lo6/family-friends-neighbours.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/family-friends.json'],
	},
	{
		path: '/img/lo7/opinions-matter.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/athletics.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/basketball.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/dancing.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/flower.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/football.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/forest.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/knitting.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/rain.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/shopping.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/singing.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/sleeping.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/snow.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/sun.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/table-football.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo7/exercises/vocabulary/tree.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/opinions-matter.json'],
	},
	{
		path: '/img/lo8/free-time.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/athletics.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/basketball.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/dancing.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/flower.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/football.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/forest.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/knitting.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/rain.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/shopping.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/singing.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/sleeping.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/snow.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/sun.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/table-football.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo8/exercises/vocabulary/tree.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/free-time.json'],
	},
	{
		path: '/img/lo9/phoning-in-france.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/phoning-in-france.json'],
	},
	{
		path: '/img/lo10/making-arrangements.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/making-arrangements.json'],
	},
	{
		path: '/img/lo11/out-and-about-cafe.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/going-to-a-cafe.json'],
	},
	{
		path: '/img/lo12/out-and-about-shopping.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/shopping-in-the-market.json'],
	},
	{
		path: '/img/lo13/daily-routine.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/daily-routine.json'],
	},
	{
		path: '/img/lo14/studying-at-university.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/studying-at-university.json'],
	},
	{
		path: '/img/lo15/planning-a-holiday.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/planning-a-holiday.json'],
	},
	{
		path: '/img/shared/grammar.svg',
		referenceCount: 15,
		sources: [
			'/src/lo-config/about-me.json',
			'/src/lo-config/current-location.json',
			'/src/lo-config/daily-routine.json',
			'/src/lo-config/family-friends.json',
			'/src/lo-config/first-contact.json',
			'/src/lo-config/free-time.json',
			'/src/lo-config/going-to-a-cafe.json',
			'/src/lo-config/house-and-home.json',
			'/src/lo-config/making-arrangements.json',
			'/src/lo-config/opinions-matter.json',
			'/src/lo-config/origins-and-languages.json',
			'/src/lo-config/phoning-in-france.json',
			'/src/lo-config/planning-a-holiday.json',
			'/src/lo-config/shopping-in-the-market.json',
			'/src/lo-config/studying-at-university.json',
		],
	},
	{
		path: '/img/shared/self-study.svg',
		referenceCount: 6,
		sources: [
			'/src/lo-config/about-me.json',
			'/src/lo-config/current-location.json',
			'/src/lo-config/family-friends.json',
			'/src/lo-config/first-contact.json',
			'/src/lo-config/house-and-home.json',
			'/src/lo-config/origins-and-languages.json',
		],
	},
	{
		path: '/src/assets/lo9/france-telephone-area-codes.svg',
		referenceCount: 1,
		sources: ['/src/components/custom/grammar/phoning-in-france-regions-map.jsx'],
	},
	{
		path: '/src/components/ErrorLog/copy.svg',
		referenceCount: 1,
		sources: ['/src/index.css'],
	},
	{
		path: '/src/components/ErrorLog/upArrow.svg',
		referenceCount: 1,
		sources: ['/src/index.css'],
	},
	{
		path: '/src/components/ErrorLog/whiteCross.svg',
		referenceCount: 1,
		sources: ['/src/index.css'],
	},
].sort((left, right) => left.path.localeCompare(right.path));

const LUCIDE_USAGE_MANIFEST = [
	{
		component: ArrowLeftRight,
		name: 'ArrowLeftRight',
		sources: ['/src/components/exercises/SortableWordCard/SortableWordCard.jsx'],
	},
	{
		component: ArrowUpDown,
		name: 'ArrowUpDown',
		sources: ['/src/components/exercises/SortableWordCard/SortableWordCard.jsx'],
	},
	{
		component: BadgeQuestionMark,
		name: 'BadgeQuestionMark',
		sources: ['/src/components/exercises/MemoryMatchGame/Card/Card.jsx'],
	},
	{
		component: BookOpenText,
		name: 'BookOpenText',
		sources: ['/src/components/exercises/current-location/nasal-rhyme-exercise.jsx'],
	},
	{
		component: Check,
		name: 'Check',
		sources: ['/src/components/ui/select.jsx'],
	},
	{
		component: ChevronDown,
		name: 'ChevronDown',
		sources: [
			'/src/components/ui/accordion.jsx',
			'/src/components/ui/navigation-menu.jsx',
			'/src/components/ui/select.jsx',
		],
	},
	{
		component: ChevronUp,
		name: 'ChevronUp',
		sources: ['/src/components/ui/select.jsx'],
	},
	{
		component: CircleAlert,
		name: 'CircleAlert',
		sources: ['/src/components/exercises/DraggableFillGaps/DraggableFillGapsRuntime.jsx', '/src/components/Info/Info.jsx'],
	},
	{
		component: CircleCheck,
		name: 'CircleCheck',
		sources: [
			'/src/components/Info/Info.jsx',
			'/src/components/exercises/InlineChoiceGroup/InlineChoiceGroup.jsx',
			'/src/components/exercises/InlineTypedGapExercise/InlineTypedGapExercise.jsx',
			'/src/components/exercises/LineMatch/LineMatch.jsx',
			'/src/components/exercises/RadioQuiz/RadioQuiz.jsx',
			'/src/components/exercises/SelectExercise/SelectExercise.jsx',
			'/src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx',
		],
	},
	{
		component: CircleX,
		name: 'CircleX',
		sources: [
			'/src/components/Info/Info.jsx',
			'/src/components/exercises/InlineChoiceGroup/InlineChoiceGroup.jsx',
			'/src/components/exercises/InlineTypedGapExercise/InlineTypedGapExercise.jsx',
			'/src/components/exercises/LineMatch/LineMatch.jsx',
			'/src/components/exercises/RadioQuiz/RadioQuiz.jsx',
			'/src/components/exercises/SelectExercise/SelectExercise.jsx',
			'/src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx',
		],
	},
	{
		component: Eye,
		name: 'Eye',
		sources: ['/src/components/exercises/current-location/nasal-rhyme-exercise.jsx'],
	},
	{
		component: EyeOff,
		name: 'EyeOff',
		sources: ['/src/components/exercises/current-location/nasal-rhyme-exercise.jsx'],
	},
	{
		component: Facebook,
		name: 'Facebook',
		sources: ['/src/components/layout/page-shell/Footer/FooterSocialLinks.jsx'],
	},
	{
		component: InfoIcon,
		name: 'Info',
		sources: [
			'/src/components/Info/Info.jsx',
			'/src/components/custom/grammar/planning-a-holiday-grammar.jsx',
		],
	},
	{
		component: Instagram,
		name: 'Instagram',
		sources: ['/src/components/layout/page-shell/Footer/FooterSocialLinks.jsx'],
	},
	{
		component: Linkedin,
		name: 'Linkedin',
		sources: ['/src/components/layout/page-shell/Footer/FooterSocialLinks.jsx'],
	},
	{
		component: Mars,
		name: 'Mars',
		sources: ['/src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx'],
	},
	{
		component: MessageCircleMore,
		name: 'MessageCircleMore',
		sources: ['/src/components/layout/page-shell/MainMenu/MainMenu.jsx'],
	},
	{
		component: SquareDashedMousePointer,
		name: 'SquareDashedMousePointer',
		sources: ['/src/components/exercises/DraggableFillGaps/DraggableWordTile/DraggableWordTile.jsx'],
	},
	{
		component: Venus,
		name: 'Venus',
		sources: ['/src/components/exercises/TextEntryExerciseRuntime/TextEntryExerciseRuntime.jsx'],
	},
	{
		component: Volume1,
		name: 'Volume1',
		sources: ['/src/components/AudioCueIcon.jsx'],
	},
	{
		component: X,
		name: 'X',
		sources: ['/src/components/layout/page-shell/Footer/FooterSocialLinks.jsx', '/src/components/ui/dialog.jsx'],
	},
	{
		component: Youtube,
		name: 'Youtube',
		sources: ['/src/components/layout/page-shell/Footer/FooterSocialLinks.jsx'],
	},
].sort((left, right) => left.name.localeCompare(right.name));

function toPreviewUrl(path) {
	const srcMapped = SRC_PREVIEW_URL_BY_PATH[path];
	if (srcMapped) return srcMapped;
	if (path.startsWith('/')) {
		return `${import.meta.env.BASE_URL}${path.slice(1)}`;
	}
	return path;
}

export function DebugSvgAssets() {
	const [brokenPaths, setBrokenPaths] = React.useState(() => new Set());

	const missingCount = SVG_USAGE_MANIFEST.filter((entry) => brokenPaths.has(entry.path)).length;
	const foundCount = SVG_USAGE_MANIFEST.length - missingCount;

	return (
		<section aria-labelledby="sandbox-svg-assets">
			<h2 id="sandbox-svg-assets">SVG Assets Referenced in App Source</h2>
			<p className="mb-3 text-base text-[var(--muted-foreground)]">
				Manifest-based inventory of SVG paths referenced by production app source.
			</p>
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`Found: ${foundCount}`}</Badge>
				<Badge className={`text-sm font-medium ${MISSING_BADGE_CLASS}`} variant="outline">{`Missing: ${missingCount}`}</Badge>
				<Badge className="text-sm font-medium" variant="outline">{`Total: ${SVG_USAGE_MANIFEST.length}`}</Badge>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{SVG_USAGE_MANIFEST.map((entry) => {
					const isMissing = brokenPaths.has(entry.path);
					const previewUrl = toPreviewUrl(entry.path);
					return (
						<Card className="overflow-hidden" key={entry.path}>
							<CardHeader className="px-4 pb-2 pt-4">
								<CardTitle className="break-all text-sm">
									<code>{entry.path}</code>
								</CardTitle>
								<CardDescription className="text-xs">
									{`References: ${entry.referenceCount} · Files: ${entry.sources.length}`}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 px-4 pb-4 pt-0">
								<div className="flex min-h-24 items-center justify-center rounded-md border border-border/70 bg-[var(--muted)]/40 px-2 py-3">
									{isMissing ? (
										<span className="text-center text-xs text-[var(--destructive)]">Preview unavailable</span>
									) : (
										<img
											alt=""
											aria-hidden="true"
											className="max-h-16 max-w-full object-contain"
											loading="lazy"
											onError={() => {
												setBrokenPaths((previous) => {
													if (previous.has(entry.path)) return previous;
													const next = new Set(previous);
													next.add(entry.path);
													return next;
												});
											}}
											src={previewUrl}
										/>
									)}
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										className={`text-xs font-medium ${isMissing ? MISSING_BADGE_CLASS : USED_BADGE_CLASS}`}
										variant="outline"
									>
										{isMissing ? 'Missing' : 'Found'}
									</Badge>
								</div>
								<details className="rounded-md border border-border/70 p-2 text-xs">
									<summary className="cursor-pointer font-semibold">
										{`Source files (${entry.sources.length})`}
									</summary>
									<ol className="mt-2 list-decimal space-y-1 pl-4">
										{entry.sources.map((sourcePath) => (
											<li className="break-all" key={`${entry.path}-${sourcePath}`}>
												<code>{sourcePath}</code>
											</li>
										))}
									</ol>
								</details>
							</CardContent>
						</Card>
					);
				})}
			</div>
			<div className="mt-8">
				<h3 className="mb-2">Lucide Icons In Use</h3>
				<p className="mb-3 text-sm text-[var(--muted-foreground)]">
					Component-based icon inventory (not file-path SVG assets).
				</p>
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<Badge className="text-sm font-medium" variant="outline">{`Total: ${LUCIDE_USAGE_MANIFEST.length}`}</Badge>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{LUCIDE_USAGE_MANIFEST.map((entry) => {
						const IconComponent = entry.component;
						return (
							<Card className="overflow-hidden" key={entry.name}>
								<CardHeader className="px-4 pb-2 pt-4">
									<CardTitle className="break-all text-sm">
										<code>{entry.name}</code>
									</CardTitle>
									<CardDescription className="text-xs">
										{`Source files: ${entry.sources.length}`}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3 px-4 pb-4 pt-0">
									<div className="flex min-h-24 items-center justify-center rounded-md border border-border/70 bg-[var(--muted)]/40 px-2 py-3 text-[var(--chart-3)]">
										<IconComponent aria-hidden="true" className="h-10 w-10" />
									</div>
									<details className="rounded-md border border-border/70 p-2 text-xs">
										<summary className="cursor-pointer font-semibold">
											{`Source files (${entry.sources.length})`}
										</summary>
										<ol className="mt-2 list-decimal space-y-1 pl-4">
											{entry.sources.map((sourcePath) => (
												<li className="break-all" key={`${entry.name}-${sourcePath}`}>
													<code>{sourcePath}</code>
												</li>
											))}
										</ol>
									</details>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
