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
