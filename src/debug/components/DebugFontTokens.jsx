import { Badge } from '@/components/ui/badge';
import React from 'react';

const USED_BADGE_CLASS = 'border-emerald-500/70 bg-transparent text-emerald-700 dark:text-emerald-300';
const UNUSED_BADGE_CLASS = 'border-amber-500/70 bg-transparent text-amber-700 dark:text-amber-300';
const SOURCE_TEXT_MODULES = import.meta.glob('/src/**/*.{js,jsx,ts,tsx,css,scss}', {
	eager: true,
	import: 'default',
	query: '?raw',
});
const FONTS_CSS_MODULE = import.meta.glob('/src/styles/fonts.css', {
	eager: true,
	import: 'default',
	query: '?raw',
});

function getFontTokenMap() {
	const styles = getComputedStyle(document.documentElement);
	const map = new Map();
	for (let index = 0; index < styles.length; index += 1) {
		const token = styles.item(index);
		if (!token) continue;
		if (!/^--font-(?!size)/.test(token)) continue;
		map.set(token, styles.getPropertyValue(token).trim());
	}
	return map;
}

function getTokenUsageCounts(tokens) {
	const counts = new Map(tokens.map((token) => [token, 0]));
	const tokenReferencePattern = /var\(\s*(--font-(?!size)[\w-]+)\s*[,)]/g;

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

function parseFontFaceFamilies() {
	const fontsCssRaw = Object.values(FONTS_CSS_MODULE)[0];
	if (typeof fontsCssRaw !== 'string') return [];

	const families = [];
	const pattern = /font-family\s*:\s*["']?([^;"'\n]+)["']?\s*;/g;
	let match = pattern.exec(fontsCssRaw);
	while (match) {
		const family = match[1].trim();
		if (family && !families.includes(family)) {
			families.push(family);
		}
		match = pattern.exec(fontsCssRaw);
	}
	return families;
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countLiteralReferences(term) {
	if (!term) return 0;
	const pattern = new RegExp(escapeRegex(term), 'gi');
	let total = 0;

	Object.entries(SOURCE_TEXT_MODULES).forEach(([sourcePath, sourceText]) => {
		if (sourcePath.startsWith('/src/debug/')) return;
		if (sourcePath === '/src/styles/fonts.css') return;
		if (typeof sourceText !== 'string') return;
		const matches = sourceText.match(pattern);
		if (matches) {
			total += matches.length;
		}
	});

	return total;
}

export function DebugFontTokens() {
	const [tokenRows, setTokenRows] = React.useState([]);
	const [faceRows, setFaceRows] = React.useState([]);
	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		try {
			const tokenMap = getFontTokenMap();
			const tokens = Array.from(tokenMap.keys()).sort((left, right) => left.localeCompare(right));
			const tokenUsageCounts = getTokenUsageCounts(tokens);
			const nextTokenRows = tokens.map((token) => ({
				token,
				usageCount: tokenUsageCounts.get(token) || 0,
				value: tokenMap.get(token) || '',
			}));
			setTokenRows(nextTokenRows);

			const tokenRowsByFamily = new Map();
			const families = parseFontFaceFamilies();
			families.forEach((family) => {
				const matchingTokens = nextTokenRows
					.filter((row) => row.value.toLowerCase().includes(family.toLowerCase()))
					.map((row) => row.token);
				tokenRowsByFamily.set(family, matchingTokens);
			});

			const nextFaceRows = families.map((family) => {
				const viaTokens = tokenRowsByFamily.get(family) || [];
				const viaTokenUsageCount = viaTokens.reduce((total, token) => {
					const tokenRow = nextTokenRows.find((row) => row.token === token);
					return total + (tokenRow?.usageCount || 0);
				}, 0);
				const directUsageCount = countLiteralReferences(family);
				return {
					directUsageCount,
					family,
					totalUsage: viaTokenUsageCount + directUsageCount,
					viaTokens,
					viaTokenUsageCount,
				};
			});
			setFaceRows(nextFaceRows);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(`Failed to collect font token data: ${error?.message || error}`);
		}
	}, []);

	const usedTokens = tokenRows.filter((row) => row.usageCount > 0).length;
	const unusedTokens = tokenRows.length - usedTokens;
	const usedFaces = faceRows.filter((row) => row.totalUsage > 0).length;
	const unusedFaces = faceRows.length - usedFaces;

	return (
		<section aria-labelledby="sandbox-font-tokens">
			<h2 id="sandbox-font-tokens">Font Tokens + Font Faces</h2>
			<p className="mb-3 text-base text-[var(--muted-foreground)]">
				Debug inventory of font tokens and declared `@font-face` families, with used/unused status.
			</p>
			{errorMessage ? (
				<p className="mb-3 text-base text-[var(--destructive)]">{errorMessage}</p>
			) : null}

			<div className="rounded-xl border border-border bg-card p-3">
				<p className="mb-2 text-base font-semibold">{`Font tokens detected: ${tokenRows.length}`}</p>
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`Used: ${usedTokens}`}</Badge>
					<Badge className={`text-sm font-medium ${UNUSED_BADGE_CLASS}`} variant="outline">{`Unused: ${unusedTokens}`}</Badge>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-base">
						<thead>
							<tr className="border-b border-border/70 text-left">
								<th className="px-2 py-2 font-semibold">Token</th>
								<th className="px-2 py-2 font-semibold">Resolved Stack</th>
								<th className="px-2 py-2 font-semibold">Usage</th>
							</tr>
						</thead>
						<tbody>
							{tokenRows.map((row) => (
								<tr className="border-b border-border/40 align-top" key={row.token}>
									<td className="px-2 py-2"><code>{row.token}</code></td>
									<td className="px-2 py-2"><code className="break-all">{row.value || '(unset)'}</code></td>
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

			<div className="mt-4 rounded-xl border border-border bg-card p-3">
				<p className="mb-2 text-base font-semibold">{`@font-face families detected: ${faceRows.length}`}</p>
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<Badge className={`text-sm font-medium ${USED_BADGE_CLASS}`} variant="outline">{`Used: ${usedFaces}`}</Badge>
					<Badge className={`text-sm font-medium ${UNUSED_BADGE_CLASS}`} variant="outline">{`Unused: ${unusedFaces}`}</Badge>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-base">
						<thead>
							<tr className="border-b border-border/70 text-left">
								<th className="px-2 py-2 font-semibold">Family</th>
								<th className="px-2 py-2 font-semibold">Bound Tokens</th>
								<th className="px-2 py-2 font-semibold">Usage</th>
							</tr>
						</thead>
						<tbody>
							{faceRows.map((row) => (
								<tr className="border-b border-border/40 align-top" key={row.family}>
									<td className="px-2 py-2"><code>{row.family}</code></td>
									<td className="px-2 py-2">
										{row.viaTokens.length > 0 ? row.viaTokens.map((token) => <code className="mr-2" key={`${row.family}-${token}`}>{token}</code>) : 'None'}
									</td>
									<td className="px-2 py-2">
										<Badge
											className={`text-sm font-medium ${row.totalUsage > 0 ? USED_BADGE_CLASS : UNUSED_BADGE_CLASS}`}
											variant="outline"
										>
											{row.totalUsage > 0
												? `Used (${row.totalUsage})`
												: 'Unused (0)'}
										</Badge>
										<p className="mt-1 text-sm text-[var(--muted-foreground)]">
											{`via tokens: ${row.viaTokenUsageCount}, direct refs: ${row.directUsageCount}`}
										</p>
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
