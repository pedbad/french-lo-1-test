# AGENTS.md

## Project overview
This is a React + Vite French learning object app. It uses React 19, Vite 6, Tailwind CSS, and a set of UI utilities (Radix UI, Headless UI, shadcn).

## Key scripts
- `yarn dev` / `yarn start`: run the dev server
- `yarn build`: build for production
- `yarn preview`: preview production build
- `yarn lint`: run ESLint

## Repo layout
- `src/App.jsx`: main app component
- `src/main.jsx`: app entry point
- `src/components/`: UI components (lowercase for Linux-safe imports)
- `src/styles/`: styling assets
- `src/learningObjectConfigurations/`: learning object JSON configs
- `src/index-fr.json`: menu index file for learning object configs
- `public/`: static assets

## Learning object configuration
- `src/index-fr.json` references the configuration files in `src/learningObjectConfigurations/fr/`.
- Configuration files in `src/learningObjectConfigurations/fr/` define component layout and phrases.

## Tooling
- Vite + React SWC plugin
- Tailwind CSS v4
- ESLint

## Notes
- Yarn is the expected package manager.
- Styling single source of truth lives in `src/index.css` via shadcn tokens + custom theme tokens (`--page-background`, `--hero-title-color`, `--footer-background`).
- Tailwind utilities consume these tokens via `tailwind.config.js`; shadcn components live in `src/components/ui/`.
- SCSS is still present for legacy/component styling (e.g. `src/App.scss` and component SCSS files), so both Tailwind and SCSS currently affect UI.
- Vite already copies `public/` assets during build. Do not add `viteStaticCopy` targets for `public/fonts`, `public/images`, or `public/sounds` (it causes duplicated `dist` trees).
- Typography guard policy (`scripts/check-typography-guard.sh`):
  - blocks new literal `font-size` values with `px/rem/em`
  - blocks new literal `line-height` values with `px/rem/em`
  - allows tokenized `font-family: var(--font-...)`
  - blocks literal `font-family` declarations
- Color guard policy (`scripts/check-color-guard.sh`):
  - blocks new hex color literals outside allowlisted files
  - blocks new named color literals outside allowlisted files
  - blocks new color functions without token indirection (`rgb/hsl/oklch` without `var(--...)`)
  - allows tokenized color usage via `var(--...)`
  - allowlist is maintained in `scripts/color-allowlist.txt` (`src/index.css` is currently allowlisted)
- Local quality gates:
  - staged checks: `yarn check:typography` and `yarn check:color`
  - branch checks: `yarn check:typography:branch` and `yarn check:color:branch`
  - recommended pre-push: `yarn prepush:local`
- Theme toggling briefly disables CSS transitions (`html.no-theme-transition`) to avoid flicker during light/dark switches.
- WordParts includes a circle-based progress indicator and inline icon guidance (Show answer/Reset) powered by CSS-masked SVGs.
- Modal links open shadcn/Radix dialogs. The dialog accepts React content (not just HTML strings) so `AudioClip` components can render; for key grammar links the modal renders React content from `src/components/CustomComponents_FR/CustomComponents_FR.jsx` so audio clips work and text stays in sync with the on-page content.
- In rendered JSX content, use semantic emphasis tags (`<strong>`, `<em>`) instead of presentational (`<b>`, `<i>`).
- For sentence text containing inline components (for example `AudioClip`), use explicit React spaces (`{' '}`) where needed rather than relying on incidental whitespace collapse behavior.
- Audio playback is globally single-active: when a new clip starts, all other currently playing clips are paused (`stopAllAudioPlayback` + `trackFloatingAudio` in `src/utility.js`, used by `AudioClip`, `SequenceAudioController`, and `playAudioLink`).
- LO1 exercise naming has been refactored to behavior-based ids in `src/learningObjectConfigurations/fr/1.json`:
  - `listeningOrder1`
  - `listeningOrder2`
  - `listeningOrder3`
- LO1 audio files are being consolidated under `public/audio/lo1/<section>/...` (for exercises: `public/audio/lo1/exercises/...`) instead of legacy `public/sounds/fr/...`.
- For new/migrated audio assets, use ASCII-safe filenames (no accented characters) to avoid cross-platform Unicode normalization issues.
- Listening order UI conventions:
  - `SequenceOrder` is used for continuous single-track order tasks.
  - `Sortable` is used for per-row/per-item clip matching tasks.
  - `SortableWordCard` provides shared draggable card visuals across both.
  - `ProgressDots` is the shared circle-based progress indicator for exercise components.
