/**
 * ExerciseShowcase — dev-only page listing every exercise type with a minimal
 * French fixture so new contributors can see each component at a glance.
 *
 * Audio: 4 generic clips in public/audio/showcase/ — not shared with lesson audio.
 * long.mp3 (single-audio exercises), short-a/b/c.mp3 (per-item audio, rotated).
 *
 * Route: /exercise-showcase.html  (VITE_INCLUDE_DEBUG=true or DEV mode)
 */
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BackToTopButton } from '@/components/layout/page-shell/BackToTopButton';
import {
  DictationExercise,
  DraggableFillGaps,
  InlineChoiceGroup,
  InlineTypedGapExercise,
  LineMatch,
  MemoryMatchGame,
  PhraseReorderExercise,
  RadioQuiz,
  SelectExercise,
  TypedTransformExercise,
  WordOrderExercise,
  WordSpotExercise,
} from '@/components/exercises';

// ---------------------------------------------------------------------------
// Fixtures — all audio paths resolve to public/audio/showcase/
// ---------------------------------------------------------------------------

const A = (name) => `audio/showcase/${name}`;
const IMG = 'favicon.svg';

const SELECT_CONFIG = {
  id: 'showcase-select',
  informationText: 'Select the correct verb form for each gap.',
  renderInlineChoices: false,
  shuffleItems: false,
  items: [
    { text: 'Je [*vais|vas|va|allons] à Paris.', audio: A('short-b.mp3') },
    { text: 'Tu [vais|*vas|va|allons] au cinéma ?', audio: A('short-a.mp3') },
    { text: "Elle [vais|vas|*va|allons] à l'école.", audio: A('short-c.mp3') },
  ],
  titleText: 'SelectExercise',
};

const SELECT_INLINE_CONFIG = {
  id: 'showcase-select-inline',
  informationText: 'Complete each sentence by selecting the missing word.',
  renderInlineChoices: true,
  shuffleItems: false,
  items: [
    { text: "Bonjour ! Je [*m'appelle|s'appelle|t'appelle] Marie." },
    { text: 'Il [vais|vas|*va] à la boulangerie.' },
    { text: 'Nous [vais|vas|va|*allons] au marché.' },
  ],
  titleText: 'SelectExercise (inline choices)',
};

const WORD_ORDER_CONFIG = {
  id: 'showcase-wordorder',
  informationTextHTML: 'Listen to the audio, then drag the word cards to match the order you hear.',
  cheatText: 'Show answer',
  blanksType: 'table',
  words: ['bonjour', 'mon', 'prénom', 'non', 'bon', 'son'],
  soundFile: A('long.mp3'),
  titleText: 'WordOrderExercise',
};

const DRAGGABLE_CONFIG = {
  id: 'showcase-draggable',
  informationText: 'Drag each missing word into the correct gap.',
  blanksType: 'phrases',
  showRowAudio: false,
  items: [
    {
      text: "Je suis très [sportif]. J'aime [le foot] mais je n'aime pas [du tout] le rugby.",
    },
  ],
  titleText: 'DraggableFillGaps',
};

const RADIO_QUIZ_CONFIG = {
  id: 'showcase-radioquiz',
  informationText: 'Listen to the audio, then decide whether each statement is true or false.',
  options: ['Vrai', 'Faux'],
  soundFile: A('long.mp3'),
  phrases: [
    ['Marie se lève à 7 heures.', 1, 'Marie se lève à 6 heures.', ''],
    ['Elle aime le café le matin.', 0, '', ''],
    ['Elle travaille à Paris.', 0, '', ''],
  ],
  titleText: 'RadioQuiz',
};

const LINE_MATCH_CONFIG = {
  id: 'showcase-linematch',
  informationText: 'Match each French greeting to its English translation.',
  cheatText: 'Show answer',
  sampleSize: 4,
  items: [
    { id: 'bonjour', label: 'bonjour', image: IMG, audio: A('short-a.mp3') },
    { id: 'merci', label: 'merci', image: IMG, audio: A('short-b.mp3') },
    { id: 'au-revoir', label: 'au revoir', image: IMG, audio: A('short-c.mp3') },
    { id: 'sil-vous-plait', label: "s'il vous plaît", image: IMG, audio: A('short-a.mp3') },
    { id: 'excusez-moi', label: 'excusez-moi', image: IMG, audio: A('short-b.mp3') },
    { id: 'oui', label: 'oui', image: IMG, audio: A('short-c.mp3') },
  ],
  titleText: 'LineMatch',
};

const MEMORY_MATCH_CONFIG = {
  id: 'showcase-memory',
  informationTextHTML: 'Match each French word to the correct English translation.',
  nPairsToPlay: 4,
  cards: [
    { foreignLanguage: 'la fleur', localLanguage: 'flower', image: IMG, audio: A('short-a.mp3') },
    { foreignLanguage: 'la forêt', localLanguage: 'forest', image: IMG, audio: A('short-b.mp3') },
    { foreignLanguage: "l'arbre", localLanguage: 'tree', image: IMG, audio: A('short-c.mp3') },
    { foreignLanguage: 'le babyfoot', localLanguage: 'table football', image: IMG, audio: A('short-a.mp3') },
  ],
  titleText: 'MemoryMatchGame',
};

const DICTATION_CONFIG = {
  id: 'showcase-dictation',
  informationText: 'Listen and type what you hear.',
  phrases: [
    ['', '[Salut, ça va ?]', A('short-a.mp3')],
    ['', '[Ça va, merci !]', A('short-b.mp3')],
    ['', '[Je m\'appelle Camille.]', A('short-c.mp3')],
  ],
  titleText: 'DictationExercise',
};

const INLINE_CHOICE_CONFIG = {
  id: 'showcase-inlinechoice',
  informationText: 'Listen and select the word you hear.',
  shuffleItems: false,
  items: [
    { text: '[*bonjour|bonsoir]', audio: A('short-a.mp3') },
    { text: '[bonsoir|*bonjour]', audio: A('short-b.mp3') },
    { text: '[salut|*au revoir]', audio: A('short-c.mp3') },
  ],
  titleText: 'InlineChoiceGroup',
};

const INLINE_TYPED_GAP_CONFIG = {
  id: 'showcase-inlinetypedgap',
  informationText: 'Use the English prompt and audio to complete each French sentence.',
  useSequenceAudioController: false,
  items: [
    {
      prompt: 'How are you?',
      text: "Comment [t'appelles]-[tu] ?",
      audio: A('short-a.mp3'),
    },
    {
      prompt: 'What is your name?',
      text: 'Je [m\'appelle] [Max].',
      audio: A('short-b.mp3'),
    },
  ],
  titleText: 'InlineTypedGapExercise',
};

const PHRASE_REORDER_CONFIG = {
  id: 'showcase-phrasereorder',
  shuffleOnLoad: true,
  informationText: 'Listen to each audio clip, then drag the matching word into the correct position.',
  phrases: [
    ['', 'homme', A('short-a.mp3')],
    ['', 'hôtel', A('short-b.mp3')],
    ['', 'hôpital', A('short-c.mp3')],
    ['', 'horrible', A('short-a.mp3')],
  ],
  titleText: 'PhraseReorderExercise',
};

const TYPED_TRANSFORM_CONFIG = {
  id: 'showcase-typedtransform',
  informationText: 'Listen and write what you hear.',
  phrases: [
    ['', '[Salut, ça va ?]', A('short-a.mp3')],
    ['', '[Salut ! Ça va ! Et toi ?]', A('short-b.mp3')],
  ],
  titleText: 'TypedTransformExercise',
};

const WORD_SPOT_CONFIG = {
  id: 'showcase-wordspot',
  informationText: 'Select the part of each word that contains the target sound.',
  items: [
    { text: 'b[on]j[ou][r] m[on] ché[r]i', audio: A('short-a.mp3') },
    { text: 'b[on]s[oi][r] m[on] am[ou][r]', audio: A('short-b.mp3') },
    { text: 'au [r]ev[oi][r] ma ché[r]ie', audio: A('short-c.mp3') },
  ],
  titleText: 'WordSpotExercise',
};

// ---------------------------------------------------------------------------
// Showcase entry (label + component)
// ---------------------------------------------------------------------------

const EXERCISES = [
  {
    label: 'SelectExercise',
    description: 'Dropdown select per row — learner picks correct option from a menu.',
    render: () => <SelectExercise config={SELECT_CONFIG} />,
  },
  {
    label: 'SelectExercise (inline)',
    description: 'Same component with renderInlineChoices — select appears mid-sentence.',
    render: () => <SelectExercise config={SELECT_INLINE_CONFIG} />,
  },
  {
    label: 'WordOrderExercise',
    description: 'Draggable word tiles — learner arranges to match audio playback order.',
    render: () => <WordOrderExercise config={WORD_ORDER_CONFIG} />,
  },
  {
    label: 'DraggableFillGaps',
    description: 'Drag word tiles from a bank into bracketed gaps within a passage.',
    render: () => <DraggableFillGaps config={DRAGGABLE_CONFIG} />,
  },
  {
    label: 'RadioQuiz',
    description: 'True/false (or multi-option) comprehension quiz driven by sequence audio.',
    render: () => <RadioQuiz config={RADIO_QUIZ_CONFIG} />,
  },
  {
    label: 'LineMatch',
    description: 'Draw lines connecting left-column items to right-column matches.',
    render: () => <LineMatch config={LINE_MATCH_CONFIG} />,
  },
  {
    label: 'MemoryMatchGame',
    description: 'Flip-card memory game matching French to English (or image).',
    render: () => <MemoryMatchGame config={MEMORY_MATCH_CONFIG} />,
  },
  {
    label: 'DictationExercise',
    description: 'Full dictation — learner types the complete spoken phrase.',
    render: () => <DictationExercise config={DICTATION_CONFIG} />,
  },
  {
    label: 'InlineChoiceGroup',
    description: 'Click to select correct word from an inline pair — no dropdown.',
    render: () => <InlineChoiceGroup config={INLINE_CHOICE_CONFIG} />,
  },
  {
    label: 'InlineTypedGapExercise',
    description: 'Type missing words directly inline within a fixed sentence structure.',
    render: () => <InlineTypedGapExercise config={INLINE_TYPED_GAP_CONFIG} />,
  },
  {
    label: 'PhraseReorderExercise',
    description: 'Drag labelled audio cards into the correct listening order.',
    render: () => <PhraseReorderExercise config={PHRASE_REORDER_CONFIG} />,
  },
  {
    label: 'TypedTransformExercise',
    description: 'Listen to audio and type a transformed version of what you hear.',
    render: () => <TypedTransformExercise config={TYPED_TRANSFORM_CONFIG} />,
  },
  {
    label: 'WordSpotExercise',
    description: 'Click on bracketed phonetic segments within words to identify target sounds.',
    render: () => <WordSpotExercise config={WORD_SPOT_CONFIG} />,
  },
];

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

export function ExerciseShowcase() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const stored = sessionStorage.getItem('dark');
    const initial = stored !== null ? JSON.parse(stored) : document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', initial);
    setIsDarkMode(initial);
  }, []);

  React.useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, []);

  const handleThemeToggle = (checked) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('no-theme-transition');
    window.setTimeout(() => document.documentElement.classList.remove('no-theme-transition'), 200);
    document.documentElement.classList.toggle('dark', checked);
    sessionStorage.setItem('dark', JSON.stringify(checked));
    setIsDarkMode(checked);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 p-6" id="exercise-showcase-page">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="m-0">Exercise Showcase</h1>
              <p className="m-0 mt-1 text-sm text-muted-foreground">
                Dev-only. One exercise type per section, minimal French fixture.
                Audio files are isolated in <code className="rounded bg-muted px-1 py-0.5 text-xs">public/audio/showcase/</code>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`${import.meta.env.BASE_URL}debug-sandbox.html`}
                className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground/80 no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                ← Debug Sandbox
              </a>
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
          </div>

          {/* Quick-jump nav */}
          <nav aria-label="Exercise types" className="mt-4">
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              {EXERCISES.map((ex) => (
                <li key={ex.label}>
                  <a
                    href={`#showcase-${ex.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="inline-flex h-8 items-center rounded-md bg-muted px-3 text-xs font-medium text-foreground/80 no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {ex.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {EXERCISES.map((ex) => {
          const anchorId = `showcase-${ex.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          return (
            <section key={ex.label} aria-labelledby={`${anchorId}-heading`} id={anchorId}>
              <div className="mb-3">
                <h2 id={`${anchorId}-heading`} className="m-0 text-xl">
                  {ex.label}
                </h2>
                <p className="m-0 mt-1 text-sm text-muted-foreground">{ex.description}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <ExerciseErrorBoundary label={ex.label}>
                  {ex.render()}
                </ExerciseErrorBoundary>
              </div>
              <BackToTopButton />
            </section>
          );
        })}
      </main>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Error boundary — one broken fixture never crashes the whole page
// ---------------------------------------------------------------------------

// Intentionally a class: React error boundaries (getDerivedStateFromError /
// componentDidCatch) have no functional/hook equivalent (React 19 included). This is
// the sole remaining class component in the codebase — a deliberate exception to the
// class→functional migration, NOT pending conversion. See
// docs/process/CLASS_TO_FUNCTIONAL_MIGRATION.md.
class ExerciseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <strong>{this.props.label}</strong> failed to render:{' '}
          {this.state.error?.message || String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}
