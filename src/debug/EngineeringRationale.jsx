import React from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  ExternalLink,
  GitCompareArrows,
  Scale,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const repoCommitUrl = (hash) => `https://github.com/pedbad/french-lo-1-test/commit/${hash}`;

const rationaleCards = [
  {
    id: 'css-cascade-layers',
    title: 'CSS Cascade Layers',
    commit: '626dfbe713f3f125b105cfa432bed4c36bf6f353',
    problem:
      'Unlayered ID-scoped CSS sat above Tailwind utilities, so component classes could silently lose and developers reached for important modifiers.',
    benefit:
      'Tailwind utilities can override authored-content defaults without special cases.',
    tradeoff:
      'Developers need to understand Tailwind v4 layer order, not only selector specificity.',
    before: `#content a {
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
}`,
    after: `@layer base {
  #content a {
    color: var(--primary);
    cursor: pointer;
    text-decoration: underline;
  }
}`,
    why:
      'Authored lesson content still gets default link styling, while component UI can use normal Tailwind utilities without fighting unlayered CSS.',
  },
  {
    id: 'audio-manager',
    title: 'Audio Playback Ownership',
    commit: 'dee169639dbaf1ef99fa4340846637adbae8fc38',
    problem:
      'AudioClip, sequence playback, row links, and custom grammar widgets could create independent audio objects, allowing overlapping playback.',
    benefit:
      'One active audio policy is enforced through AudioManager for every playback path.',
    tradeoff:
      'Audio code must route through the singleton instead of creating unmanaged Audio instances.',
    before: `function playRegionAudio(soundFile) {
  const audio = new Audio(resolveAsset(soundFile));
  trackFloatingAudio(audio);
  stopAllAudioPlayback(audio);
  audio.play().catch(() => {});
}`,
    after: `function playRegionAudio(soundFile) {
  AudioManager.play(resolveAsset(soundFile));
}`,
    why:
      'The global policy moved from scattered conventions into one API, which made overlap bugs easier to prevent and test.',
  },
  {
    id: 'config-schema',
    title: 'Config Schema Cleanup',
    commit: 'cc684d9d99ff7f7df36f1c5688f06af2b93bd11b',
    problem:
      'Configs used multiple aliases for instructional copy, and App.jsx had to normalize legacy keys at runtime.',
    benefit:
      'Course authors now have one contract for guidance text: informationText and informationTextHTML.',
    tradeoff:
      'Existing LO JSON needed a migration pass plus a guard script to prevent drift returning.',
    before: `{
  "instructionsText": "Match each question with the correct answer.",
  "informationTextHTML": "Play each audio clip and choose the text option..."
}`,
    after: `{
  "informationText": "Match each question with the correct answer.",
  "informationTextHTML": "Play each audio clip and choose the text option..."
}`,
    why:
      'The runtime no longer depends on hidden compatibility lifting for normal authored content, and review can focus on one canonical schema.',
  },
  {
    id: 'semantic-sections',
    title: 'Semantic Lesson Structure',
    commit: 'eff63592fdbd64e96d431c3ba7156c26eb976412',
    problem:
      'A wrapper named accordion contained all major lesson areas, which blurred page structure and made accessibility checks harder.',
    benefit:
      'Top-level learning areas now render as real section landmarks with stable IDs.',
    tradeoff:
      'Scroll, nav highlight, and modal extraction code had to be checked against the new DOM shape.',
    before: `{currentLearningObject !== -1 ? (
  <div className="accordion" id="accordion1" key="accordion1">
    {articles}
  </div>
) : null}`,
    after: `<section
  aria-labelledby={headingId}
  className="lo-top-section"
  id={semanticSectionId}
  key={\`top-section-\${semanticSectionId}\`}
>
  {renderedTopLevelContent}
</section>`,
    why:
      'The DOM now matches the instructional model: introduction, dialogues, vocabulary, grammar, pronunciation, and exercises are document sections.',
  },
  {
    id: 'accordion-article',
    title: 'Accordion Leaf Semantics',
    commit: 'bb9f39f5d454481e30e47182563b75f076cef760',
    problem:
      'Accordion leaves were rendered as sections even when they were standalone pieces inside an existing lesson section.',
    benefit:
      'Accordion content now has a clearer document hierarchy: section for the area, article for the leaf.',
    tradeoff:
      'Selectors and fallback modal extraction had to include article containers.',
    before: `<section
  aria-labelledby={headingId}
  className={\`accordion-article \${expanded ? "expanded" : ""}\`}
>
  ...
</section>`,
    after: `<article
  aria-labelledby={headingId}
  className={\`accordion-article \${expanded ? "expanded" : ""}\`}
>
  ...
</article>`,
    why:
      'This separates grouping structure from standalone accordion content, which is easier for screen readers and future maintainers.',
  },
  {
    id: 'behavior-names',
    title: 'Behavior-First Component Names',
    commit: '4d162b52efe61e346bc8f700d7589429e9c0312b',
    problem:
      'Legacy names such as Blanks described implementation history rather than the learner interaction.',
    benefit:
      'Config is easier to read because component names describe what learners actually do.',
    tradeoff:
      'Renaming touched config, imports, docs, and lesson-owned asset paths.',
    before: `{
  "phrases2": {
    "component": "Blanks",
    "audio": "audio/lo1/exercises/phrases2/001-coucou..."
  }
}`,
    after: `{
  "phrases2": {
    "component": "DraggableFillGaps",
    "audio": "audio/lo1/exercises/draggableFillGaps2/001-coucou..."
  }
}`,
    why:
      'A new developer can infer the exercise behavior from the JSON without knowing the original component lineage.',
  },
  {
    id: 'exercise-tokens',
    title: 'Stable Exercise Tokens',
    commit: 'b2d707d6742c040efc8a42f121778bf5f8872f25',
    problem:
      'Exercise UI used shadcn chart tokens for non-chart roles, and those tokens changed visual meaning in dark mode.',
    benefit:
      'Exercise state colors now use pinned semantic tokens such as ex-neutral, ex-active, and edu-affirm.',
    tradeoff:
      'The token vocabulary is larger and must be named carefully.',
    before: `style={{
  color: "var(--chart-3)",
  opacity: filled ? 1 : 0.35,
}}`,
    after: `style={{
  color: "var(--ex-neutral)",
  opacity: filled ? 1 : 0.35,
}}`,
    why:
      'A chart palette is allowed to remap for data visualization. Exercise states need stable learning semantics across light and dark mode.',
  },
  {
    id: 'grammar-label',
    title: 'Grammar Labels and WAVE Fixes',
    commit: '3995f118ddae4912800c6b6c5b847ebe1a5f98a4',
    problem:
      'Short labels before tables were inconsistently authored as headings, paragraphs, and divs, causing heading-outline and font-size drift.',
    benefit:
      'GrammarLabel gives those labels one semantic and visual contract.',
    tradeoff:
      'Authors must use a small shared component instead of ad hoc tags.',
    before: `<h4 className="mb-3 text-base font-semibold">
  Here are two common examples:
</h4>`,
    after: `<GrammarLabel>Here are two common examples:</GrammarLabel>`,
    why:
      'These labels are not document headings. The shared component keeps body sizing stable and avoids WAVE possible-heading alerts.',
  },
];

const principleCards = [
  {
    title: 'Make Drift Expensive To Reintroduce',
    text:
      'The refactor is not just cleanup. Guard scripts, canonical schemas, and semantic tokens make old failure modes visible during review and CI.',
  },
  {
    title: 'Name Things By Their Job',
    text:
      'Names such as informationText, DraggableFillGaps, and ex-active describe intent. That reduces onboarding cost and makes config review less dependent on tribal knowledge.',
  },
  {
    title: 'Prefer One Owner Per Concern',
    text:
      'Audio playback belongs to AudioManager, grammar labels belong to GrammarLabel, and exercise colors belong to exercise tokens. Shared behavior should not be copied across 15 lessons.',
  },
];

const CodeBlock = ({ code, label }) => (
  <div className="min-w-0">
    <div className="mb-2 flex items-center gap-2">
      <Badge variant="outline">{label}</Badge>
    </div>
    <pre className="max-h-80 overflow-x-auto rounded-lg border border-border bg-muted/25 p-3 text-sm">
      <code>{code}</code>
    </pre>
  </div>
);

const EvidenceCard = ({ item }) => (
  <Card id={item.id} className="scroll-mt-24">
    <CardHeader className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="m-0 text-xl">{item.title}</CardTitle>
        <Button asChild size="sm" variant="outline">
          <a href={repoCommitUrl(item.commit)} rel="noreferrer" target="_blank">
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            Commit
          </a>
        </Button>
      </div>
      <p className="m-0 text-sm text-muted-foreground">{item.problem}</p>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck aria-hidden="true" className="h-4 w-4 text-[var(--edu-affirm)]" />
            Benefit
          </div>
          <p className="m-0 text-sm text-muted-foreground">{item.benefit}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Scale aria-hidden="true" className="h-4 w-4 text-[var(--ex-neutral)]" />
            Tradeoff
          </div>
          <p className="m-0 text-sm text-muted-foreground">{item.tradeoff}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={item.before} label="Before" />
        <CodeBlock code={item.after} label="After" />
      </div>
      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <CircleAlert aria-hidden="true" className="h-4 w-4 text-[var(--edu-warn)]" />
          Why this was better
        </div>
        <p className="m-0 text-sm text-muted-foreground">{item.why}</p>
      </div>
    </CardContent>
  </Card>
);

export function EngineeringRationale() {
  const debugSandboxUrl = new URL('debug-sandbox.html', window.location.href).href;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 p-6" id="engineering-rationale-page">
      <header className="space-y-5">
        <Button asChild variant="outline">
          <a href={debugSandboxUrl}>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Debug Sandbox
          </a>
        </Button>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Development only</Badge>
            <Badge variant="outline">Refactor evidence</Badge>
            <Badge variant="outline">Team handoff</Badge>
          </div>
          <h1 className="m-0">Engineering Rationale</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Why we refactored the French learning-object app, what changed, and how the
            changes reduce future project risk. The examples below are real before/after
            snippets from the repository history.
          </p>
        </div>
      </header>

      <section aria-labelledby="rationale-summary-heading">
        <Card>
          <CardHeader>
            <CardTitle id="rationale-summary-heading">What This Page Is For</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {principleCards.map((card) => (
              <div className="rounded-lg border border-border bg-muted/20 p-4" key={card.title}>
                <h2 className="m-0 text-base">{card.title}</h2>
                <p className="mb-0 mt-2 text-sm text-muted-foreground">{card.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="rationale-nav-heading">
        <Card>
          <CardHeader>
            <CardTitle id="rationale-nav-heading">Evidence Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {rationaleCards.map((item) => (
                <a
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`#${item.id}`}
                  key={item.id}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="rationale-evidence-heading" className="space-y-5">
        <div className="flex items-center gap-3">
          <GitCompareArrows aria-hidden="true" className="h-6 w-6 text-[var(--brand-primary)]" />
          <h2 id="rationale-evidence-heading" className="m-0">Evidence: Before and After</h2>
        </div>
        <Separator />
        <div className="space-y-6">
          {rationaleCards.map((item) => (
            <EvidenceCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section aria-labelledby="rationale-conclusion-heading">
        <Card>
          <CardHeader>
            <CardTitle id="rationale-conclusion-heading">Bottom Line</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="m-0 text-muted-foreground">
              The refactor traded short-term migration effort for lower long-term maintenance
              risk. The codebase now has clearer ownership boundaries for styling, schema,
              audio, accessibility, and exercise behavior. That makes the current French app
              more stable and gives future language projects a stronger starting point.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
