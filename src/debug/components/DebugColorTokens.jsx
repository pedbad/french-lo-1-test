import { Badge } from '@/components/ui/badge';
import React from 'react';

const COLOR_PATTERN = /(oklch|rgb|hsl|#|color-mix|linear-gradient|radial-gradient|conic-gradient)/i;
const CHANNEL_RGB_PATTERN = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;
const MAX_RESOLVE_DEPTH = 10;
const USED_BADGE_CLASS = 'border-emerald-500/70 bg-transparent text-emerald-700 dark:text-emerald-300';
const UNUSED_BADGE_CLASS = 'border-amber-500/70 bg-transparent text-amber-700 dark:text-amber-300';
const SOURCE_TEXT_MODULES = import.meta.glob('/src/**/*.{js,jsx,ts,tsx,css,scss}', {
	eager: true,
	import: 'default',
	query: '?raw',
});

function getTokenMap(scopeClassName) {
	const probe = document.createElement('div');
	if (scopeClassName) probe.className = scopeClassName;
	probe.setAttribute('aria-hidden', 'true');
	probe.style.position = 'absolute';
	probe.style.left = '-9999px';
	probe.style.top = '-9999px';
	document.body.appendChild(probe);

	const styles = getComputedStyle(probe);
	const map = new Map();
	for (let index = 0; index < styles.length; index += 1) {
		const name = styles.item(index);
		if (name && name.startsWith('--')) {
			map.set(name, styles.getPropertyValue(name).trim());
		}
	}

	document.body.removeChild(probe);
	return map;
}

function resolveValueString(value, tokenMap, depth = 0, resolving = new Set()) {
	if (!value || depth > MAX_RESOLVE_DEPTH) return value || '';

	return value.replace(/var\((--[\w-]+)\)/g, (match, tokenName) => {
		if (resolving.has(tokenName)) return match;
		const tokenValue = tokenMap.get(tokenName);
		if (!tokenValue) return match;
		const nextResolving = new Set(resolving);
		nextResolving.add(tokenName);
		return resolveValueString(tokenValue, tokenMap, depth + 1, nextResolving);
	});
}

function toRenderableColor(value) {
	const trimmed = (value || '').trim();
	if (!trimmed) return '';
	if (CHANNEL_RGB_PATTERN.test(trimmed)) {
		return `rgb(${trimmed} / 1)`;
	}
	return trimmed;
}

function isColorLike(value) {
	const trimmed = (value || '').trim();
	if (!trimmed) return false;
	return CHANNEL_RGB_PATTERN.test(trimmed) || COLOR_PATTERN.test(trimmed);
}

function collectColorRows() {
	const lightMap = getTokenMap('');
	const darkMap = getTokenMap('dark');
	const allNames = new Set([...lightMap.keys(), ...darkMap.keys()]);
	const rows = [];

	Array.from(allNames)
		.sort((left, right) => left.localeCompare(right))
		.forEach((token) => {
			const lightRaw = resolveValueString(lightMap.get(token) || '', lightMap).trim();
			const darkRaw = resolveValueString(darkMap.get(token) || '', darkMap).trim();
			if (!isColorLike(lightRaw) && !isColorLike(darkRaw)) return;

			rows.push({
				darkRaw,
				darkSwatch: toRenderableColor(darkRaw),
				lightRaw,
				lightSwatch: toRenderableColor(lightRaw),
				token,
			});
		});

	return rows;
}

function getTokenUsageCounts(tokenNames) {
	const counts = new Map(tokenNames.map((token) => [token, 0]));
	const tokenReferencePattern = /var\(\s*(--[\w-]+)\s*[,)]/g;

	Object.entries(SOURCE_TEXT_MODULES).forEach(([sourcePath, sourceText]) => {
		if (sourcePath.startsWith('/src/debug/')) return;
		if (typeof sourceText !== 'string') return;
		tokenReferencePattern.lastIndex = 0;
		let match = tokenReferencePattern.exec(sourceText);
		while (match) {
			const token = match[1];
			if (counts.has(token)) {
				counts.set(token, (counts.get(token) || 0) + 1);
			}
			match = tokenReferencePattern.exec(sourceText);
		}
	});

	return counts;
}

function Swatch({ value }) {
	return (
		<span
			aria-hidden="true"
			className="h-9 w-9 shrink-0 rounded border border-border/70 shadow-sm"
			style={{ background: value || 'transparent' }}
		/>
	);
}

export function DebugColorTokens() {
	const [rows, setRows] = React.useState([]);
	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		try {
			const baseRows = collectColorRows();
			const usageCounts = getTokenUsageCounts(baseRows.map((row) => row.token));
			setRows(baseRows.map((row) => ({
				...row,
				usageCount: usageCounts.get(row.token) || 0,
			})));
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(`Failed to collect color tokens: ${error?.message || error}`);
		}
	}, []);

	const usedCount = rows.filter((row) => row.usageCount > 0).length;
	const unusedCount = rows.length - usedCount;

	return (
		<section aria-labelledby="sandbox-color-tokens">
			<h2 id="sandbox-color-tokens">Color Tokens (Light + Dark)</h2>
			<p className="mb-3 text-base text-[var(--muted-foreground)]">
				Debug inventory of app color token names and resolved values in both themes.
			</p>
			<p className="mb-3 text-sm text-[var(--muted-foreground)]">
				Usage is source-reference based (`var(--token)` across `src/`, excluding `src/debug/`).
			</p>
			{errorMessage ? (
				<p className="mb-3 text-base text-[var(--destructive)]">{errorMessage}</p>
			) : null}
			<div className="rounded-xl border border-border bg-card p-3">
				<p className="mb-2 text-base font-semibold">
					{`Total color tokens detected: ${rows.length}`}
				</p>
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`Used: ${usedCount}`}</Badge>
					<Badge className={`text-sm font-medium ${UNUSED_BADGE_CLASS}`} variant="outline">{`Unused: ${unusedCount}`}</Badge>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-base">
						<thead>
							<tr className="border-b border-border/70 text-left">
								<th className="px-2 py-2 font-semibold">Token</th>
								<th className="px-2 py-2 font-semibold">Light</th>
								<th className="px-2 py-2 font-semibold">Dark</th>
								<th className="px-2 py-2 font-semibold">Usage</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr className="border-b border-border/40 align-top" key={row.token}>
									<td className="px-2 py-2">
										<code>{row.token}</code>
									</td>
									<td className="px-2 py-2">
										<div className="flex items-start gap-2">
											<Swatch value={row.lightSwatch} />
											<code className="break-all">{row.lightRaw || '(unset)'}</code>
										</div>
									</td>
									<td className="px-2 py-2">
										<div className="flex items-start gap-2">
											<Swatch value={row.darkSwatch} />
											<code className="break-all">{row.darkRaw || '(unset)'}</code>
										</div>
									</td>
									<td className="px-2 py-2">
										<Badge
											className={`text-sm font-medium ${row.usageCount > 0 ? USED_BADGE_CLASS : UNUSED_BADGE_CLASS}`}
											variant="outline"
										>
											{row.usageCount > 0 ? `Used (${row.usageCount})` : 'Unused (0)'}
										</Badge>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
