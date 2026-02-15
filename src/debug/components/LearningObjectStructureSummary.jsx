import React from 'react';

const CONFIG_MODULES = import.meta.glob('../../learningObjectConfigurations/fr/*.json', { eager: true });

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

function getConfigByFileMap() {
	const map = new Map();
	Object.entries(CONFIG_MODULES).forEach(([path, module]) => {
		const match = path.match(/\/([^/]+)\.json$/);
		if (!match) return;
		const file = match[1];
		const data = module?.default ?? module;
		if (!data || typeof data !== 'object') return;
		map.set(file, data);
	});
	return map;
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
		sections.push({
			key,
			sectionTitle,
			sectionComponent,
			topLevelContent,
			accordionTitles,
			contentTypes,
			exerciseTypes,
		});
	});
	return sections;
}

export function LearningObjectStructureSummary({ learningObjects = [] }) {
	const configByFile = React.useMemo(() => getConfigByFileMap(), []);
	const summaries = React.useMemo(() => {
		return learningObjects.map((learningObject, index) => {
			const file = String(learningObject?.file ?? '');
			const title = learningObject?.titleShort || learningObject?.title || `LO ${file || index + 1}`;
			const config = configByFile.get(file);
			return {
				file,
				title,
				sections: getSectionSummaries(config),
			};
		});
	}, [configByFile, learningObjects]);

	return (
		<section aria-labelledby="sandbox-lo-structure">
			<h2 id="sandbox-lo-structure">Learning Object Structure Summary</h2>
			<p className="mb-3 text-sm text-[var(--muted-foreground)]">
				Debug-only overview of each LO: sections, accordion titles, and component types.
			</p>
			<div className="space-y-3">
				{summaries.map((summary) => (
					<details className="rounded-xl border border-border bg-card p-4" key={`lo-summary-${summary.file}`}>
						<summary className="cursor-pointer font-semibold">
							{`LO ${summary.file} - ${summary.title}`}
						</summary>
						{summary.sections.length === 0 ? (
							<p className="mt-3 text-sm text-[var(--destructive)]">No section data found for this LO.</p>
						) : (
							<div className="mt-3 space-y-4">
								{summary.sections.map((section) => (
									<div className="rounded-lg border border-border/70 p-3" key={`${summary.file}-${section.key}`}>
										<h3 className="text-base font-semibold">{section.sectionTitle}</h3>
										<p className="mt-1 text-sm">
											<span className="font-semibold">Section component:</span>{' '}
											<code>{section.sectionComponent}</code>
										</p>
										<p className="mt-1 text-sm">
											<span className="font-semibold">Content component types:</span>{' '}
											{section.contentTypes.length > 0 ? section.contentTypes.join(', ') : 'None'}
										</p>
										{section.topLevelContent.length > 0 ? (
											<p className="mt-1 text-sm">
												<span className="font-semibold">Top-level content:</span>{' '}
												{section.topLevelContent
													.map((item) => `${item.title} (${item.component})`)
													.join(' | ')}
											</p>
										) : null}
										<p className="mt-1 text-sm">
											<span className="font-semibold">Accordion titles:</span>{' '}
											{section.accordionTitles.length > 0 ? section.accordionTitles.join(' | ') : 'None'}
										</p>
										{section.exerciseTypes.length > 0 ? (
											<p className="mt-1 text-sm">
												<span className="font-semibold">Exercise component types:</span>{' '}
												{section.exerciseTypes.join(', ')}
											</p>
										) : null}
									</div>
								))}
							</div>
						)}
					</details>
				))}
			</div>
		</section>
	);
}
