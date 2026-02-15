import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const SOURCE_TEXT_MODULES = import.meta.glob('/src/**/*.{js,jsx,ts,tsx,css,scss,json}', {
	eager: true,
	import: 'default',
	query: '?raw',
});
const SVG_REFERENCE_PATTERN = /url\(\s*['"]?([^'"()\s]+\.svg(?:[?#][^'")\s]*)?)['"]?\s*\)|['"`]([^'"`\n\r]*\.svg(?:[?#][^'"`\n\r]*)?)['"`]/gi;
const USED_BADGE_CLASS = 'border-emerald-500/70 bg-transparent text-emerald-700 dark:text-emerald-300';
const UNUSED_BADGE_CLASS = 'border-amber-500/70 bg-transparent text-amber-700 dark:text-amber-300';

function getSourceDirectory(sourcePath) {
	const lastSlash = sourcePath.lastIndexOf('/');
	if (lastSlash < 0) return '/';
	return sourcePath.slice(0, lastSlash + 1);
}

function toDisplayPath(pathValue) {
	return pathValue.replace(/^\/public\//, '/').replace(/^\/src\//, '/src/');
}

function normalizeReference(rawReference, sourcePath) {
	if (!rawReference) return '';
	const trimmed = rawReference.trim();
	if (!trimmed || trimmed.startsWith('data:')) return '';
	if (trimmed.includes('${')) return '';

	const withoutQuery = trimmed.replace(/[?#].*$/, '');
	if (!withoutQuery.toLowerCase().endsWith('.svg')) return '';

	if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) {
		return withoutQuery;
	}
	if (withoutQuery.startsWith('/')) {
		return toDisplayPath(withoutQuery);
	}
	if (withoutQuery.startsWith('@/')) {
		return toDisplayPath(`/src/${withoutQuery.slice(2)}`);
	}
	if (withoutQuery.startsWith('./') || withoutQuery.startsWith('../')) {
		try {
			const absolute = new URL(withoutQuery, `http://localhost${getSourceDirectory(sourcePath)}`).pathname;
			return toDisplayPath(absolute);
		} catch {
			return '';
		}
	}
	if (/^[a-zA-Z0-9_-]+\//.test(withoutQuery)) {
		return toDisplayPath(`/${withoutQuery}`);
	}
	return toDisplayPath(`/${withoutQuery}`);
}

function collectSvgReferences() {
	const entriesByPath = new Map();

	Object.entries(SOURCE_TEXT_MODULES).forEach(([sourcePath, sourceText]) => {
		if (sourcePath.startsWith('/src/debug/')) return;
		if (typeof sourceText !== 'string') return;

		SVG_REFERENCE_PATTERN.lastIndex = 0;
		let match = SVG_REFERENCE_PATTERN.exec(sourceText);
		while (match) {
			const rawReference = match[1] || match[2] || '';
			const normalizedPath = normalizeReference(rawReference, sourcePath);
			if (normalizedPath) {
				const existing = entriesByPath.get(normalizedPath) || {
					path: normalizedPath,
					referenceCount: 0,
					sources: new Set(),
				};
				existing.referenceCount += 1;
				existing.sources.add(sourcePath);
				entriesByPath.set(normalizedPath, existing);
			}
			match = SVG_REFERENCE_PATTERN.exec(sourceText);
		}
	});

	return Array.from(entriesByPath.values())
		.map((entry) => ({
			...entry,
			sources: Array.from(entry.sources).sort((left, right) => left.localeCompare(right)),
		}))
		.sort((left, right) => left.path.localeCompare(right.path));
}

export function DebugSvgAssets() {
	const [rows, setRows] = React.useState([]);
	const [errorMessage, setErrorMessage] = React.useState('');
	const [brokenPaths, setBrokenPaths] = React.useState(() => new Set());

	React.useEffect(() => {
		try {
			setRows(collectSvgReferences());
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(`Failed to collect SVG asset references: ${error?.message || error}`);
		}
	}, []);

	const missingCount = rows.filter((row) => brokenPaths.has(row.path)).length;
	const existingCount = rows.length - missingCount;

	return (
		<section aria-labelledby="sandbox-svg-assets">
			<h2 id="sandbox-svg-assets">SVG Assets Referenced in App Source</h2>
			<p className="mb-3 text-base text-[var(--muted-foreground)]">
				Source-reference inventory of SVG paths used across `src/` (excluding `src/debug/`). Found/missing
				status is determined by runtime image loading in this debug page.
			</p>
			{errorMessage ? (
				<p className="mb-3 text-base text-[var(--destructive)]">{errorMessage}</p>
			) : null}
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`Found: ${existingCount}`}</Badge>
				<Badge className={`text-sm font-medium ${UNUSED_BADGE_CLASS}`} variant="outline">{`Missing: ${missingCount}`}</Badge>
				<Badge className="text-sm font-medium" variant="outline">{`Total: ${rows.length}`}</Badge>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{rows.map((row) => {
					const isBroken = brokenPaths.has(row.path);
					const isMissing = isBroken;
					return (
						<Card className="overflow-hidden" key={row.path}>
							<CardHeader className="px-4 pb-2 pt-4">
								<CardTitle className="break-all text-sm">
									<code>{row.path}</code>
								</CardTitle>
								<CardDescription className="text-xs">
									{`References: ${row.referenceCount} · Files: ${row.sources.length}`}
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
													if (previous.has(row.path)) return previous;
													const next = new Set(previous);
													next.add(row.path);
													return next;
												});
											}}
											src={row.path}
										/>
									)}
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										className={`text-xs font-medium ${isMissing ? UNUSED_BADGE_CLASS : USED_BADGE_CLASS}`}
										variant="outline"
									>
										{isMissing ? 'Missing' : 'Found'}
									</Badge>
								</div>
								<details className="rounded-md border border-border/70 p-2 text-xs">
									<summary className="cursor-pointer font-semibold">
										{`Source files (${row.sources.length})`}
									</summary>
									<ol className="mt-2 list-decimal space-y-1 pl-4">
										{row.sources.map((sourcePath) => (
											<li className="break-all" key={`${row.path}-${sourcePath}`}>
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
		</section>
	);
}
