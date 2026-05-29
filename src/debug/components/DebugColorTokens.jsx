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

/* ── Token classification ─────────────────────────────────────────────────── */

const SHADCN_TOKEN_NAMES = new Set([
	'--background', '--foreground',
	'--card', '--card-foreground',
	'--popover', '--popover-foreground',
	'--primary', '--primary-foreground',
	'--secondary', '--secondary-foreground',
	'--muted', '--muted-foreground',
	'--accent', '--accent-foreground',
	'--destructive',
	'--border', '--input', '--ring',
	'--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
	'--sidebar', '--sidebar-foreground',
	'--sidebar-primary', '--sidebar-primary-foreground',
	'--sidebar-accent', '--sidebar-accent-foreground',
	'--sidebar-border', '--sidebar-ring',
]);

// Tailwind's --color-* aliases mirror shadcn tokens and are consumed via
// utility class names, not var() references. They add noise without useful
// information, so they are excluded from the debug display entirely.
function classifyToken(name) {
	if (name.startsWith('--color-')) return null;
	if (SHADCN_TOKEN_NAMES.has(name)) return 'shadcn';
	return 'custom';
}

const GROUPS = [
	{
		id: 'shadcn',
		label: 'shadcn System Tokens',
		sourceFile: 'src/styles/tokens.css — Section A',
		description: 'Tokens shadcn/ui components reference directly by these exact names. Do not rename.',
		headerColor: 'bg-[color-mix(in_oklab,var(--chart-1)_12%,var(--card))] border-[color-mix(in_oklab,var(--chart-1)_40%,var(--border))]',
		badgeColor: 'border-orange-400/70 bg-transparent text-orange-700 dark:text-orange-300',
	},
	{
		id: 'custom',
		label: 'Custom Design Tokens',
		sourceFile: 'theme-lc-french.css + tokens.css — Sections B–F',
		description: 'Brand scale (--brand-*), UI role tokens, educational states (--edu-*), exercise interaction (--ex-*), depth shadows (--shadow-*), component tokens, and content accent palette.',
		headerColor: 'bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] border-[color-mix(in_oklab,var(--brand-primary)_40%,var(--border))]',
		badgeColor: 'border-teal-500/70 bg-transparent text-teal-700 dark:text-teal-300',
	},
];

/* ── Core utilities (unchanged) ───────────────────────────────────────────── */

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
		.sort((a, b) => a.localeCompare(b))
		.forEach((token) => {
			const lightRaw = resolveValueString(lightMap.get(token) || '', lightMap).trim();
			const darkRaw = resolveValueString(darkMap.get(token) || '', darkMap).trim();
			if (!isColorLike(lightRaw) && !isColorLike(darkRaw)) return;

			rows.push({
				darkRaw,
				darkSwatch: toRenderableColor(darkRaw),
				group: classifyToken(token),
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

/* ── Sub-components ───────────────────────────────────────────────────────── */

function Swatch({ value }) {
	return (
		<span
			aria-hidden="true"
			className="h-9 w-9 shrink-0 rounded border border-border/70 shadow-sm"
			style={{ background: value || 'transparent' }}
		/>
	);
}

function TokenTable({ rows }) {
	return (
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
	);
}

function TokenGroup({ group, rows }) {
	const [open, setOpen] = React.useState(group.id === 'custom');
	const usedCount = rows.filter((r) => r.usageCount > 0).length;

	return (
		<div className={`rounded-xl border ${group.headerColor} overflow-hidden`}>
			<button
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
				onClick={() => setOpen((v) => !v)}
				type="button"
			>
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="text-base font-semibold">{group.label}</span>
					<code className="text-sm text-[var(--muted-foreground)]">{group.sourceFile}</code>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Badge className={`text-sm font-medium ${group.badgeColor}`} variant="outline">
						{`${rows.length} tokens`}
					</Badge>
					<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">
						{`${usedCount} used`}
					</Badge>
					<span aria-hidden="true" className="text-[var(--muted-foreground)]">{open ? '▲' : '▼'}</span>
				</div>
			</button>

			{open && (
				<div className="border-t border-border/40 bg-card px-4 pb-4 pt-3">
					<p className="mb-3 text-sm text-[var(--muted-foreground)]">{group.description}</p>
					<TokenTable rows={rows} />
				</div>
			)}
		</div>
	);
}

/* ── Main export ──────────────────────────────────────────────────────────── */

export function DebugColorTokens() {
	const [rowsByGroup, setRowsByGroup] = React.useState({ custom: [], shadcn: [] });
	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		try {
			const baseRows = collectColorRows();
			const usageCounts = getTokenUsageCounts(baseRows.map((row) => row.token));
			const withCounts = baseRows
				.filter((row) => row.group !== null)
				.map((row) => ({ ...row, usageCount: usageCounts.get(row.token) || 0 }));

			setRowsByGroup({
				custom: withCounts.filter((r) => r.group === 'custom'),
				shadcn: withCounts.filter((r) => r.group === 'shadcn'),
			});
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(`Failed to collect color tokens: ${error?.message || error}`);
		}
	}, []);

	const allRows = [...rowsByGroup.shadcn, ...rowsByGroup.custom];
	const totalUsed = allRows.filter((r) => r.usageCount > 0).length;

	return (
		<section aria-labelledby="sandbox-color-tokens">
			<h2 id="sandbox-color-tokens">Color Tokens — by source</h2>
			<p className="mb-4 text-base text-[var(--muted-foreground)]">
				Tokens are grouped by their source file, matching the four-layer token architecture. Each group is collapsed by default except Custom Design Tokens.
			</p>
			{errorMessage ? (
				<p className="mb-3 text-base text-[var(--destructive)]">{errorMessage}</p>
			) : null}
			<div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
				<span className="text-base font-semibold">Total:</span>
				<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`${totalUsed} used`}</Badge>
				<Badge className={`text-sm font-medium ${UNUSED_BADGE_CLASS}`} variant="outline">{`${allRows.length - totalUsed} unused`}</Badge>
				<span className="text-sm text-[var(--muted-foreground)]">{`across ${allRows.length} color tokens`}</span>
			</div>
			<div className="flex flex-col gap-3">
				{GROUPS.map((group) => (
					<TokenGroup
						group={group}
						key={group.id}
						rows={rowsByGroup[group.id] || []}
					/>
				))}
			</div>
		</section>
	);
}
