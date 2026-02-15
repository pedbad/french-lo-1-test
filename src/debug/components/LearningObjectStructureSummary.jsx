import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const ACCORDION_BY_DEFAULT_COMPONENTS = new Set([
	'AnswerTable',
	'Blanks',
	'DropDowns',
	'Jigsaw',
	'MemoryMatchGame',
	'Monologue',
	'RadioQuiz',
	'ReadAloud',
	'SequenceOrder',
	'Sortable',
	'WordGrid',
	'WordParts',
	'ConnectFour',
	'CrossWord',
	'TreasureGrid',
]);

const CONTAINER_COMPONENTS = new Set(['Group', 'Section']);

const EXERCISE_COMPONENTS = new Set([
	'AnswerTable',
	'Blanks',
	'ConnectFour',
	'CrossWord',
	'DropDowns',
	'Jigsaw',
	'MemoryMatchGame',
	'Monologue',
	'RadioQuiz',
	'ReadAloud',
	'SequenceOrder',
	'Sortable',
	'TreasureGrid',
	'WordGrid',
	'WordParts',
]);

function stripMarkup(value) {
	if (typeof value !== 'string') return '';
	return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeContentItems(content) {
	if (!Array.isArray(content)) return [];
	const normalized = [];
	content.forEach((item) => {
		if (!item || typeof item !== 'object') return;
		if (typeof item.component === 'string') {
			normalized.push(item);
			return;
		}
		Object.values(item).forEach((candidate) => {
			if (candidate && typeof candidate === 'object' && typeof candidate.component === 'string') {
				normalized.push(candidate);
			}
		});
	});
	return normalized;
}

function getNodeTitle(node, fallback = '') {
	return stripMarkup(node?.menuText || node?.titleText || node?.titleTextHTML || node?.id || fallback);
}

function getRenderContainer(component, expandable = true) {
	if (component === 'Section') return 'section';
	if (component === 'Group') return expandable ? 'accordion' : 'section';
	if (component === 'Explanation' || component === 'PhraseTable') {
		return expandable ? 'accordion' : 'section';
	}
	if (ACCORDION_BY_DEFAULT_COMPONENTS.has(component)) return 'accordion';
	return expandable ? 'accordion' : 'section';
}

function collectAccordionTitles(node, fallbackTitle = '') {
	if (!node || typeof node !== 'object') return [];
	const component = node.component;
	if (typeof component !== 'string') return [];
	const expandable = node.expandable !== false;
	const container = getRenderContainer(component, expandable);
	const currentTitle = getNodeTitle(node, fallbackTitle || component);
	const childTitles = normalizeContentItems(node.content).flatMap((child, index) =>
		collectAccordionTitles(child, `${currentTitle || component} item ${index + 1}`));
	if (container === 'accordion' && currentTitle) {
		return [currentTitle, ...childTitles];
	}
	return childTitles;
}

function collectComponentTypes(node) {
	if (!node || typeof node !== 'object') return [];
	const component = node.component;
	const childTypes = normalizeContentItems(node.content).flatMap((child) => collectComponentTypes(child));
	if (typeof component === 'string' && !CONTAINER_COMPONENTS.has(component)) {
		return [component, ...childTypes];
	}
	return childTypes;
}

function countExerciseItems(node) {
	if (!node || typeof node !== 'object') return 0;
	const component = node.component;
	const selfCount = EXERCISE_COMPONENTS.has(component) ? 1 : 0;
	const childrenCount = normalizeContentItems(node.content)
		.reduce((total, child) => total + countExerciseItems(child), 0);
	return selfCount + childrenCount;
}

function toUnique(values) {
	const seen = new Set();
	const ordered = [];
	values.forEach((value) => {
		if (!value || seen.has(value)) return;
		seen.add(value);
		ordered.push(value);
	});
	return ordered;
}

function getSectionSummaries(config) {
	if (!config || typeof config !== 'object') return [];
	const sections = [];
	Object.entries(config).forEach(([key, value]) => {
		if (!value || typeof value !== 'object' || typeof value.component !== 'string') return;
		const sectionTitle = getNodeTitle(value, key);
		const sectionComponent = value.component;
		const topLevelContent = normalizeContentItems(value.content).map((item, index) => ({
			component: item.component,
			title: getNodeTitle(item, `${sectionTitle} item ${index + 1}`),
		}));
		const accordionTitles = toUnique(collectAccordionTitles(value, sectionTitle));
		const contentTypes = toUnique(collectComponentTypes(value));
		const isExerciseSection = /exercise/i.test(key) || /exercise/i.test(sectionTitle);
		const exerciseTypes = isExerciseSection
			? contentTypes.filter((component) => EXERCISE_COMPONENTS.has(component))
			: [];
		const exerciseItemCount = isExerciseSection ? countExerciseItems(value) : 0;
		sections.push({
			key,
			sectionTitle,
			sectionComponent,
			topLevelContent,
			accordionTitles,
			contentTypes,
			exerciseItemCount,
			exerciseTypes,
		});
	});
	return sections;
}

function getLearningObjectBadge(file, index) {
	if (file === 'demo') return 'Demo';
	if (file === 'answer') return 'Answer';
	if (/^\d+$/.test(file)) return `LO ${file.padStart(2, '0')}`;
	return `LO ${index + 1}`;
}

export function LearningObjectStructureSummary({ appHrefBase, languageCode = 'fr', learningObjects = [] }) {
	const [configByFile, setConfigByFile] = React.useState(() => new Map());
	const [loadError, setLoadError] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const defaultAppHrefBase = React.useMemo(() => `${window.location.origin}${import.meta.env.BASE_URL}`, []);
	const resolvedAppHrefBase = appHrefBase || defaultAppHrefBase;

	React.useEffect(() => {
		let cancelled = false;
		const loadConfigs = async () => {
			setLoading(true);
			setLoadError('');
			const nextMap = new Map();
			const files = learningObjects
				.map((learningObject) => String(learningObject?.file ?? ''))
				.filter(Boolean);

			const results = await Promise.all(files.map(async (file) => {
				const configUrl = `./src/learningObjectConfigurations/fr/${file}.json`;
				try {
					const response = await fetch(configUrl);
					if (!response.ok) {
						throw new Error(`HTTP ${response.status}`);
					}
					const config = await response.json();
					return { config, file };
				} catch (error) {
					return { error, file };
				}
			}));

			let firstErrorMessage = '';
			results.forEach(({ config, error, file }) => {
				if (config && typeof config === 'object') {
					nextMap.set(file, config);
				}
				if (error && !firstErrorMessage) {
					firstErrorMessage = `Failed to load one or more LO config files (for example LO ${file}).`;
				}
			});

			if (!cancelled) {
				setConfigByFile(nextMap);
				setLoadError(firstErrorMessage);
				setLoading(false);
			}
		};

		loadConfigs().catch((error) => {
			if (!cancelled) {
				setLoadError(`Failed to load LO summary data: ${error?.message || error}`);
				setLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [learningObjects]);

	const summaries = React.useMemo(() => {
		return learningObjects.map((learningObject, index) => {
			const file = String(learningObject?.file ?? '');
			const title = learningObject?.titleShort || learningObject?.title || `LO ${file || index + 1}`;
			const config = configByFile.get(file);
			return {
				badge: getLearningObjectBadge(file, index),
				file,
				href: `${resolvedAppHrefBase}?lang=${languageCode}&lo=${file}`,
				title,
				sections: getSectionSummaries(config),
			};
		});
	}, [configByFile, learningObjects, languageCode, resolvedAppHrefBase]);

	return (
		<section aria-labelledby="sandbox-lo-structure">
			<h2 id="sandbox-lo-structure">Learning Object Index + Structure</h2>
			<p className="mb-3 text-sm text-[var(--muted-foreground)]">
				Each row pairs an LO link (left) with its structure accordion (right).
			</p>
			{loading ? (
				<p className="mb-3 text-sm text-[var(--muted-foreground)]">Loading LO structure data…</p>
			) : null}
			{loadError ? (
				<p className="mb-3 text-sm text-[var(--destructive)]">{loadError}</p>
			) : null}
			<div className="space-y-3">
				{summaries.map((summary) => (
					<div className="rounded-xl border border-border bg-card p-3" key={`lo-summary-${summary.file}`}>
						<div className="grid gap-3 min-[1180px]:grid-cols-[17.5rem,1fr] min-[1180px]:items-start">
							<a
								aria-label={`Open ${summary.badge}: ${summary.title}`}
								className="inline-flex min-h-16 w-full flex-col justify-center rounded-lg border border-[color-mix(in_oklab,var(--primary)_75%,var(--foreground))] bg-[var(--primary)] px-3 py-2 text-left text-[var(--primary-foreground)] no-underline shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] visited:text-[var(--primary-foreground)]"
								href={summary.href}
							>
								<span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] opacity-85">{summary.badge}</span>
								<span className="mt-1 text-sm font-bold leading-tight">{summary.title}</span>
							</a>
							<Accordion
								collapsible
								className="rounded-lg border border-border/70 px-3"
								type="single"
							>
								<AccordionItem className="border-none" value={`${summary.file}-structure`}>
									<AccordionTrigger className="text-base font-semibold min-[1180px]:text-lg hover:no-underline">
										{`Structure: ${summary.sections.length} section${summary.sections.length === 1 ? '' : 's'}`}
									</AccordionTrigger>
									<AccordionContent>
										{summary.sections.length === 0 ? (
											<p className="mt-1 text-base text-[var(--destructive)]">No section data found for this LO.</p>
										) : (
											<ol className="mt-2 list-decimal space-y-4 pl-6">
												{summary.sections.map((section) => (
													<li className="rounded-lg border border-border/70 p-3" key={`${summary.file}-${section.key}`}>
														<h3 className="text-lg font-semibold leading-snug">{section.sectionTitle}</h3>
														<ol className="mt-2 list-decimal space-y-2 pl-6 text-base leading-relaxed">
															<li>
																<span className="font-semibold">Section component:</span>{' '}
																<code>{section.sectionComponent}</code>
															</li>
															<li>
																<span className="font-semibold">Content component types ({section.contentTypes.length}):</span>
																{section.contentTypes.length > 0 ? (
																	<ol className="mt-1 list-decimal space-y-1 pl-6">
																		{section.contentTypes.map((componentType) => (
																			<li key={`${summary.file}-${section.key}-content-type-${componentType}`}>{componentType}</li>
																		))}
																	</ol>
																) : (
																	<span> None</span>
																)}
															</li>
															<li>
																<span className="font-semibold">Top-level content entries ({section.topLevelContent.length}):</span>
																{section.topLevelContent.length > 0 ? (
																	<ol className="mt-1 list-decimal space-y-1 pl-6">
																		{section.topLevelContent.map((item, contentIndex) => (
																			<li key={`${summary.file}-${section.key}-top-content-${contentIndex}`}>
																				{`${item.title} (${item.component})`}
																			</li>
																		))}
																	</ol>
																) : (
																	<span> None</span>
																)}
															</li>
															<li>
																<span className="font-semibold">Accordion titles ({section.accordionTitles.length}):</span>
																{section.accordionTitles.length > 0 ? (
																	<ol className="mt-1 list-decimal space-y-1 pl-6">
																		{section.accordionTitles.map((title, titleIndex) => (
																			<li key={`${summary.file}-${section.key}-accordion-title-${titleIndex}`}>{title}</li>
																		))}
																	</ol>
																) : (
																	<span> None</span>
																)}
															</li>
															{section.exerciseItemCount > 0 ? (
																<li>
																	<span className="font-semibold">Exercise entries:</span>{' '}
																	{section.exerciseItemCount}
																</li>
															) : null}
															{section.exerciseTypes.length > 0 ? (
																<li>
																	<span className="font-semibold">Exercise component types ({section.exerciseTypes.length}):</span>
																	<ol className="mt-1 list-decimal space-y-1 pl-6">
																		{section.exerciseTypes.map((exerciseType) => (
																			<li key={`${summary.file}-${section.key}-exercise-type-${exerciseType}`}>{exerciseType}</li>
																		))}
																	</ol>
																</li>
															) : null}
														</ol>
													</li>
												))}
											</ol>
										)}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
