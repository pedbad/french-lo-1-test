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
	Check,
	ChevronDown,
	ChevronUp,
	CircleAlert,
	CircleCheck,
	CircleX,
	Facebook,
	Info as InfoIcon,
	Instagram,
	Linkedin,
	MessageCircleMore,
	SquareDashedMousePointer,
	Volume1,
	X,
	Youtube,
} from 'lucide-react';
import copyIconUrl from '@/components/ErrorLog/copy.svg';
import upArrowIconUrl from '@/components/ErrorLog/upArrow.svg';
import whiteCrossIconUrl from '@/components/ErrorLog/whiteCross.svg';
import React from 'react';

const USED_BADGE_CLASS = 'border-emerald-500/70 bg-transparent text-emerald-700 dark:text-emerald-300';
const MISSING_BADGE_CLASS = 'border-amber-500/70 bg-transparent text-amber-700 dark:text-amber-300';
const SRC_PREVIEW_URL_BY_PATH = {
	'/src/components/ErrorLog/copy.svg': copyIconUrl,
	'/src/components/ErrorLog/upArrow.svg': upArrowIconUrl,
	'/src/components/ErrorLog/whiteCross.svg': whiteCrossIconUrl,
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
		path: '/images/cross.svg',
		referenceCount: 1,
		sources: ['/src/index.css'],
	},
	{
		path: '/img/lo1/first-contact.svg',
		referenceCount: 2,
		sources: ['/src/App.jsx', '/src/lo-config/first-contact.json'],
	},
	{
		path: '/img/common/branding/fr-banner.svg',
		referenceCount: 1,
		sources: ['/src/App.jsx'],
	},
	{
		path: '/img/shared/grammar.svg',
		referenceCount: 1,
		sources: ['/src/lo-config/first-contact.json'],
	},
	{
		path: '/images/icons/circle-check.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/images/icons/eye.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/images/icons/message-square-warning.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
	},
	{
		path: '/images/icons/reset.svg',
		referenceCount: 2,
		sources: ['/src/index.css'],
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
		name: 'ArrowLeftRight',
		component: ArrowLeftRight,
		sources: ['/src/components/SortableWordCard/SortableWordCard.jsx'],
	},
	{
		name: 'ArrowUpDown',
		component: ArrowUpDown,
		sources: ['/src/components/SortableWordCard/SortableWordCard.jsx'],
	},
	{
		name: 'Check',
		component: Check,
		sources: ['/src/components/ui/select.jsx'],
	},
	{
		name: 'ChevronDown',
		component: ChevronDown,
		sources: [
			'/src/components/ui/accordion.jsx',
			'/src/components/ui/navigation-menu.jsx',
			'/src/components/ui/select.jsx',
		],
	},
	{
		name: 'ChevronUp',
		component: ChevronUp,
		sources: ['/src/components/ui/select.jsx'],
	},
	{
		name: 'CircleAlert',
		component: CircleAlert,
		sources: ['/src/components/DraggableFillGaps/DraggableFillGapsRuntime.jsx', '/src/components/Info/Info.jsx'],
	},
	{
		name: 'CircleCheck',
		component: CircleCheck,
		sources: ['/src/components/Info/Info.jsx', '/src/components/InlineChoiceGroup/InlineChoiceGroup.jsx'],
	},
	{
		name: 'CircleX',
		component: CircleX,
		sources: ['/src/components/Info/Info.jsx', '/src/components/InlineChoiceGroup/InlineChoiceGroup.jsx'],
	},
	{
		name: 'Facebook',
		component: Facebook,
		sources: ['/src/components/Footer/FooterSocialLinks.jsx'],
	},
	{
		name: 'Info',
		component: InfoIcon,
		sources: ['/src/components/Info/Info.jsx'],
	},
	{
		name: 'Instagram',
		component: Instagram,
		sources: ['/src/components/Footer/FooterSocialLinks.jsx'],
	},
	{
		name: 'Linkedin',
		component: Linkedin,
		sources: ['/src/components/Footer/FooterSocialLinks.jsx'],
	},
	{
		name: 'MessageCircleMore',
		component: MessageCircleMore,
		sources: ['/src/components/MainMenu/MainMenu.jsx'],
	},
	{
		name: 'SquareDashedMousePointer',
		component: SquareDashedMousePointer,
		sources: ['/src/components/DraggableFillGaps/DraggableWordTile/DraggableWordTile.jsx'],
	},
	{
		name: 'Volume1',
		component: Volume1,
		sources: ['/src/components/AudioCueIcon.jsx'],
	},
	{
		name: 'X',
		component: X,
		sources: ['/src/components/Footer/FooterSocialLinks.jsx', '/src/components/ui/dialog.jsx'],
	},
	{
		name: 'Youtube',
		component: Youtube,
		sources: ['/src/components/Footer/FooterSocialLinks.jsx'],
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
