import React from 'react';
import { DebugColorTokens } from './components/DebugColorTokens';
import { DebugFontTokens } from './components/DebugFontTokens';
import { Info } from '../components/Info';
import { IconButton } from '../components/IconButton';
import { InstructionCallout } from '../components/InstructionCallout';
import { LearningObjectStructureSummary } from './components/LearningObjectStructureSummary';
import { INSTRUCTION_TEXT_CLASS } from '../components/Section/instructions-media';
import { exerciseActionButtonVariants } from "@/components/exerciseActionButtonVariants";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

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

const DEBUG_MENU_ITEMS = [
	{ href: "#sandbox-validation-quickstart", label: "Quickstart" },
	{ href: "#sandbox-typography", label: "Typography" },
	{ href: "#sandbox-instruction-callout", label: "Instruction" },
	{ href: "#sandbox-link-tokens", label: "Links" },
	{ href: "#sandbox-info", label: "Info" },
	{ href: "#sandbox-buttons", label: "Buttons" },
	{ href: "#sandbox-color-tokens", label: "Colors" },
	{ href: "#sandbox-font-tokens", label: "Fonts" },
	{ href: "#sandbox-svg-assets-anchor", label: "SVG Assets" },
	{ href: "#sandbox-lo-structure", label: "LO Structure" },
];

export function DebugSandbox() {
	const [DebugSvgAssetsComponent, setDebugSvgAssetsComponent] = React.useState(null);
	const [svgAssetsLoadError, setSvgAssetsLoadError] = React.useState('');
	const [isDarkMode, setIsDarkMode] = React.useState(() => {
		if (typeof document === "undefined") return false;
		return document.documentElement.classList.contains("dark");
	});
	const previewUrl = `${window.location.origin}/projects/french-basic/?lang=fr&lo=1`;
	const chromeIncognitoCommand = `open -na "Google Chrome" --args --incognito --disable-extensions "${previewUrl}"`;
	const chromeIncognitoCommandPowerShell = 'Start-Process "chrome.exe" "--incognito --disable-extensions `"https://lcdev.langcen.cam.ac.uk/projects/french-basic/?lang=fr&lo=1`""';

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

	React.useEffect(() => {
		if (typeof document === "undefined") return;
		const storedDark = sessionStorage.getItem("dark");
		const darkFromStorage = storedDark ? JSON.parse(storedDark) : null;
		const initialDark = typeof darkFromStorage === "boolean"
			? darkFromStorage
			: document.documentElement.classList.contains("dark");

		document.documentElement.classList.toggle("dark", initialDark);
		setIsDarkMode(initialDark);
	}, []);

	const handleThemeToggle = (checked) => {
		if (typeof document === "undefined") return;
		document.documentElement.classList.add("no-theme-transition");
		window.setTimeout(() => {
			document.documentElement.classList.remove("no-theme-transition");
		}, 200);

		document.documentElement.classList.toggle("dark", checked);
		sessionStorage.setItem("dark", JSON.stringify(checked));
		setIsDarkMode(checked);
	};

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
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h1 className="m-0">Debug Sandbox (Development Only)</h1>
					<div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2">
						<span className="text-sm text-muted-foreground">Light</span>
						<Switch
							aria-label="Toggle dark mode"
							checked={isDarkMode}
							onCheckedChange={handleThemeToggle}
						/>
						<span className="text-sm text-muted-foreground">Dark</span>
					</div>
				</div>
				<p>
					This page is intentionally separated from the production app tree. Use it for
					typography and component visual checks only.
				</p>
			</header>

			<div className="sticky top-3 z-40 rounded-xl border border-border bg-card/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/85">
				<NavigationMenu className="w-full max-w-full justify-start">
					<NavigationMenuList className="w-full justify-start gap-1 overflow-x-auto whitespace-nowrap px-1 py-0">
						{DEBUG_MENU_ITEMS.map((item) => (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuLink asChild>
									<a
										className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										href={item.href}
									>
										{item.label}
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<section aria-labelledby="sandbox-validation-quickstart">
				<h2 id="sandbox-validation-quickstart">Validation Quickstart</h2>
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<p className="m-0 text-sm text-muted-foreground">
						Use this flow before W3C validation to avoid stale cache/extension noise.
					</p>
					<div className="mt-4 grid gap-4">
						<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
							<h3 className="m-0 text-base">1) Clean build + preview</h3>
							<pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{`rm -rf dist
yarn build
yarn preview`}</code>
							</pre>
							<p className="mb-0 mt-3 text-sm text-muted-foreground">One-line command:</p>
							<pre className="mt-2 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{`rm -rf dist && yarn build && yarn preview`}</code>
							</pre>
						</div>
						<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
							<h3 className="m-0 text-base">2) Incognito without extensions</h3>
							<pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{chromeIncognitoCommand}</code>
							</pre>
							<p className="mb-0 mt-3 text-sm text-muted-foreground">PowerShell:</p>
							<pre className="mt-2 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-sm">
								<code>{chromeIncognitoCommandPowerShell}</code>
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
					<div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-4">
						<h3 className="m-0 text-base">4) Run WAVE extension checks</h3>
						<p className="mb-0 mt-2 text-sm">
							Use the browser extension on the same preview page (incognito with extensions disabled is preferred for cleaner results), and review errors/alerts with source context at{' '}
							<a
								className="font-semibold text-[var(--chart-3)] underline underline-offset-4"
								href="https://wave.webaim.org/"
								rel="noreferrer"
								target="_blank"
							>
								WAVE Web Accessibility Evaluation Tool
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

			<section aria-labelledby="sandbox-instruction-callout">
				<h2 id="sandbox-instruction-callout">Instruction Callout</h2>
				<div className="rounded-xl border border-border bg-card p-4">
					<InstructionCallout>
						<div className={`text section mt-0 ${INSTRUCTION_TEXT_CLASS}`}>
							This is the shared instructional text container used in the app. Its thick
							left border is tokenized as{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-sm">
								--instruction-callout-accent
							</code>
							, so the accent can be changed centrally without touching component markup.
							The token currently maps to a semantic warning accent mix in{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-sm">:root</code> and has
							a dark-mode override.
						</div>
					</InstructionCallout>
				</div>
			</section>

			<section aria-labelledby="sandbox-link-tokens">
				<h2 id="sandbox-link-tokens">Modal Link Tokens</h2>
				<div className="space-y-4 rounded-xl border border-border bg-card p-4">
					<p className="m-0 text-sm text-muted-foreground">
						Popup links use semantic tokens so state colors stay consistent in light and dark mode.
						Tokens:{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">--modal-link-accent</code>,{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">--modal-link-hover</code>,{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">--modal-link-visited</code>,{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">--modal-link-underline</code>,{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">--modal-link-underline-hover</code>.
					</p>
					<div className="flex flex-wrap items-center gap-5">
						<a className="token-link-preview" href="#sandbox-link-tokens">
							Default link (hover me)
						</a>
						<span className="token-link-preview token-link-preview--hover">Hover preview</span>
						<span className="token-link-preview token-link-preview--visited">Visited preview</span>
					</div>
					<div className="rounded-lg border border-border/70 bg-muted/20 p-3">
						<p className="m-0 text-sm text-muted-foreground">
							Semantic emphasis tokens:{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">--emphasis-strong-color</code>,{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">--emphasis-em-color</code>.
						</p>
						<p className="mt-2 mb-0 text-base">
							Sample: Use <strong>strong importance</strong> for key terms and <em>stress emphasis</em> for nuanced phrasing.
						</p>
					</div>
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

			<section aria-labelledby="sandbox-buttons">
				<h2 id="sandbox-buttons">Buttons (Current App Types)</h2>
				<div className="space-y-6 rounded-xl border border-border bg-card p-4">
					<div className="space-y-3">
						<h3 className="m-0 text-base">shadcn Button variants (app-facing set)</h3>
						<div className="flex flex-wrap items-center gap-2">
							<Button type="button" variant="secondary">Secondary</Button>
							<Button type="button" variant="outline">Outline</Button>
							<Button type="button" variant="ghost">Ghost</Button>
							<Button type="button" variant="destructive">Destructive</Button>
							<Button type="button" variant="link">Link</Button>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="m-0 text-base">shadcn Button sizes</h3>
						<div className="flex flex-wrap items-center gap-2">
							<Button size="sm" type="button">Small</Button>
							<Button size="default" type="button">Default</Button>
							<Button size="lg" type="button">Large</Button>
							<Button aria-label="Icon size sample" size="icon" type="button">
								☆
							</Button>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="m-0 text-base">IconButton themes used in app</h3>
						<div className="flex flex-wrap items-center gap-2">
							<IconButton theme="check" title="Check" variant="outline">Check</IconButton>
							<IconButton theme="reset" title="Reset" variant="outline">Reset</IconButton>
							<IconButton theme="eye" title="Show answer" variant="outline">Show answer</IconButton>
							<IconButton theme="shuffle" title="Shuffle" variant="outline">Shuffle</IconButton>
							<IconButton theme="natural" title="Semantic sort" variant="outline">Semantic</IconButton>
							<IconButton theme="alphabetic" title="Alphabetic sort" variant="outline">Alphabetic</IconButton>
							<IconButton theme="moon" title="Theme" variant="outline">Theme</IconButton>
							<IconButton theme="back" title="Back to top" variant="outline" />
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="m-0 text-base">Vocabulary sort buttons (exact live style)</h3>
						<div className="flex flex-wrap items-center gap-2">
							<IconButton
								className="vocab-sort-button btn-hero-title vocab-sort-button-active"
								theme="natural"
								size="lg"
								title="Vocabulary organised semantically"
								variant="default"
							>
								Semantic
							</IconButton>
							<IconButton
								className="vocab-sort-button btn-chart-2"
								theme="alphabetic"
								size="lg"
								title="Vocabulary organised alphabetically"
								variant="default"
							>
								Alphabetical
							</IconButton>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="m-0 text-base">Exercise action tones (cva contract)</h3>
						<p className="m-0 text-sm text-muted-foreground">
							The exercise action button contract is defined with{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">cva</code> in{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">
								src/components/exerciseActionButtonVariants.js
							</code>
							. Components choose semantic variants (for example{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">tone: "warn"</code>,{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">tone: "neutral"</code>,{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-xs">tone: "primary"</code>)
							instead of hardcoding long class strings in each exercise. This keeps styling
							consistent and makes future updates safer.
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<IconButton
								className={exerciseActionButtonVariants({ tone: "warn", visible: true })}
								theme="eye"
								title="Warn tone"
							>
								Show
							</IconButton>
							<IconButton
								className={exerciseActionButtonVariants({ tone: "neutral", visible: true })}
								theme="reset"
								title="Neutral tone"
							>
								Reset
							</IconButton>
							<IconButton
								className={exerciseActionButtonVariants({ tone: "primary", visible: true })}
								theme="check"
								title="Primary tone"
							>
								Check
							</IconButton>
						</div>
					</div>
				</div>
			</section>

			<DebugColorTokens />
			<DebugFontTokens />
			<div id="sandbox-svg-assets-anchor">
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
			</div>

			<LearningObjectStructureSummary
				appHrefBase={`${window.location.origin}${import.meta.env.BASE_URL}`}
				languageCode="fr"
				learningObjects={DEBUG_LEARNING_OBJECTS}
			/>
		</main>
	);
}
