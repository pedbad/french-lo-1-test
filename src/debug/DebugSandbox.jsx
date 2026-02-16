import React from 'react';
import { DebugColorTokens } from './components/DebugColorTokens';
import { DebugFontTokens } from './components/DebugFontTokens';
import { Info } from '../components/Info';
import { LearningObjectStructureSummary } from './components/LearningObjectStructureSummary';

/*
Keep debug fixtures self-contained.
Using an in-file list avoids additional module resolution edge cases for this
standalone debug entry while still rendering all LO links for navigation checks.
*/
const DEBUG_LEARNING_OBJECTS = [
	{ file: '1', titleShort: 'First Contact' },
	{ file: '2', titleShort: 'About me' },
	{ file: '3', titleShort: 'Origins and Languages' },
	{ file: '4', titleShort: 'Current location' },
	{ file: '5', titleShort: 'House and Home' },
	{ file: '6', titleShort: 'Family, friends and neighbours' },
	{ file: '7', titleShort: 'Opinions matter' },
	{ file: '8', titleShort: 'Free Time' },
	{ file: '9', titleShort: 'Phoning in France' },
	{ file: '10', titleShort: 'Making Arrangements' },
	{ file: '11', titleShort: 'Going to a cafe' },
	{ file: '12', titleShort: 'Shopping in the market' },
	{ file: '13', titleShort: 'Daily routine' },
	{ file: '14', titleShort: 'Studying at university' },
	{ file: '15', titleShort: 'Making Arrangements' },
	{ file: 'demo', titleShort: 'Sample components' },
	{ file: 'answer', titleShort: 'Answer table test' },
];

export function DebugSandbox() {
	const [DebugSvgAssetsComponent, setDebugSvgAssetsComponent] = React.useState(null);
	const [svgAssetsLoadError, setSvgAssetsLoadError] = React.useState('');
	const previewUrl = `${window.location.origin}/projects/french-basic/?lang=fr&lo=1`;
	const chromeIncognitoCommand = `open -na "Google Chrome" --args --incognito --disable-extensions "${previewUrl}"`;

	React.useEffect(() => {
		let mounted = true;
		import('./components/DebugSvgAssets')
			.then((module) => {
				if (!mounted) return;
				setDebugSvgAssetsComponent(() => module.DebugSvgAssets);
				setSvgAssetsLoadError('');
			})
			.catch((error) => {
				if (!mounted) return;
				setSvgAssetsLoadError(error?.message || String(error));
			});

		return () => {
			mounted = false;
		};
	}, []);

	/*
	Why this file exists:
	- Debug/sample UI used to be rendered inside App.jsx and only hidden with CSS.
	- Hidden debug DOM still ships in the main app output, pollutes HTML validation,
	  and makes production markup harder to reason about.
	- Keeping these examples in a dedicated dev-only sandbox preserves developer tooling
	  without mixing test scaffolding into user-facing DOM.

	Structure guidance:
	- This sandbox is currently small, so fixtures remain in this single file.
	- If debug UI grows, move debug-only fixtures into `src/debug/components/`
	  and keep them out of app-wide component barrels/exports.
	- Production app trees (`App.jsx`, route pages) must not import sandbox-only components.
	*/
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 p-6" id="debug-sandbox-page">
			<header className="space-y-2">
				<h1>Debug Sandbox (Development Only)</h1>
				<p>
					This page is intentionally separated from the production app tree. Use it for
					typography and component visual checks only.
				</p>
			</header>

			<section aria-labelledby="sandbox-validation-quickstart">
				<h2 id="sandbox-validation-quickstart">Validation Quickstart</h2>
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<p className="m-0 text-sm text-muted-foreground">
						Use this flow before W3C validation to avoid stale cache/extension noise.
					</p>
					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
							<h3 className="m-0 text-base">1) Clean build + preview</h3>
							<pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{`rm -rf dist
yarn build
yarn preview`}</code>
							</pre>
						</div>
						<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
							<h3 className="m-0 text-base">2) Incognito without extensions</h3>
							<pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{chromeIncognitoCommand}</code>
							</pre>
							<p className="mb-0 mt-3 text-sm text-muted-foreground">
								If results still look old, hard refresh in Chrome: <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>.
							</p>
						</div>
					</div>
					<div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-4">
						<h3 className="m-0 text-base">3) Validate output</h3>
						<p className="mb-0 mt-2 text-sm">
							Open the preview page, copy page source/outer HTML, then validate at{' '}
							<a
								className="font-semibold text-[var(--chart-3)] underline underline-offset-4"
								href="https://validator.w3.org/nu/#textarea"
								rel="noreferrer"
								target="_blank"
							>
								W3C Validator (textarea mode)
							</a>
							.
						</p>
					</div>
				</div>
			</section>

			<section aria-labelledby="sandbox-typography">
				<h2 id="sandbox-typography">Typography Samples</h2>
				<div className="rounded-xl border border-border bg-card p-4">
					<h1>Heading 1 Feijoa Bold</h1>
					<h2>Heading 2 Feijoa Medium</h2>
					<h3>Heading 3 Feijoa Medium</h3>
					<h4>Heading 4 Feijoa Medium</h4>
					<h5>Heading 5 OpenSans SemiBold</h5>
					<h6>Heading 6 OpenSans SemiBold</h6>
					<p>Bodycopy, Hyperlinks Opensans Regular</p>
					<figure className="mt-4">
						<img
							alt="eLearning logo"
							src="favicon.svg"
							style={{ width: '60px' }}
						/>
						<figcaption>Captions Opensans Regular</figcaption>
					</figure>
				</div>
			</section>

			<section aria-labelledby="sandbox-info">
				<h2 id="sandbox-info">Info Variants</h2>
				<div className="space-y-4 rounded-xl border border-border bg-card p-4">
					<Info
						informationText="Info alert: use this for neutral guidance and learning instructions."
						variant="info"
					/>
					<Info
						informationText="Success alert: action completed successfully and the learner can proceed."
						variant="success"
					/>
					<Info
						informationText="Warning alert: something needs attention before continuing."
						variant="warning"
					/>
					<Info
						informationText="Danger alert: an error occurred and requires correction."
						variant="danger"
					/>
				</div>
			</section>

			<DebugColorTokens />
			<DebugFontTokens />
			{DebugSvgAssetsComponent ? (
				<DebugSvgAssetsComponent />
			) : svgAssetsLoadError ? (
				<section aria-labelledby="sandbox-svg-assets-error">
					<h2 id="sandbox-svg-assets-error">SVG Assets Referenced in App Source</h2>
					<p className="rounded-xl border border-[var(--destructive)]/40 bg-card p-4 text-[var(--destructive)]">
						{`SVG inventory failed to load: ${svgAssetsLoadError}`}
					</p>
				</section>
			) : (
				<section aria-labelledby="sandbox-svg-assets-loading">
					<h2 id="sandbox-svg-assets-loading">SVG Assets Referenced in App Source</h2>
					<p className="rounded-xl border border-border bg-card p-4 text-[var(--muted-foreground)]">
						Loading SVG inventory...
					</p>
				</section>
			)}

			<LearningObjectStructureSummary
				appHrefBase={`${window.location.origin}${import.meta.env.BASE_URL}`}
				languageCode="fr"
				learningObjects={DEBUG_LEARNING_OBJECTS}
			/>
		</main>
	);
}
