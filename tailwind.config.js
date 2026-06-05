// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind v4 does automatic source detection, so this is optional.
  // You *can* keep a content array if you want, but it's not required.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  safelist: [
    "rounded-md",
    "px-1",
    "text-lg",
    "font-semibold",
    "ring-2",
  ],
  theme: {
    extend: {
      animation: {
        "highlight-flash": "highlight-flash 1.2s ease 0s 3",
      },
      colors: {
        // Colours now point at shadcn / brand tokens using CSS relative
        // colour syntax so opacity modifiers (e.g. /70) keep working.
        background: 'oklch(from var(--background) l c h / <alpha-value>)',
        border: {
          DEFAULT: 'oklch(from var(--border) l c h / <alpha-value>)',
          default: 'oklch(from var(--border) l c h / <alpha-value>)',
          strong:  'oklch(from var(--ring) l c h / <alpha-value>)',
          subtle:  'oklch(from var(--border) l c h / <alpha-value>)',
        },
        foreground: 'oklch(from var(--foreground) l c h / <alpha-value>)',
        surface: {
          base:     'oklch(from var(--background) l c h / <alpha-value>)',
          elevated: 'oklch(from var(--card) l c h / <alpha-value>)',
          overlay:  'oklch(from var(--foreground) l c h / <alpha-value>)',
        },
        text: {
          disabled:  'oklch(from var(--muted-foreground) l c h / 0.55)',
          primary:   'oklch(from var(--foreground) l c h / <alpha-value>)',
          secondary: 'oklch(from var(--muted-foreground) l c h / <alpha-value>)',
          tertiary:  'oklch(from var(--muted-foreground) l c h / 0.8)',
        },
      },
      // Merge fonts with shadcn's expectations
      fontFamily: {
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
        // shadcn expects a sensible `sans` base it can use
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      // fontSize migrated to CSS-first @theme in src/index.css (v4 idiomatic;
      // each size paired with its line-height via --text-{n}--line-height).
      keyframes: {
        "highlight-flash": {
          "0%, 100%": {
            backgroundColor: "rgb(252 211 77 / 0.9)",
            boxShadow: "0 0 0 0 rgb(251 191 36 / 0.4)",
          },
          "50%": {
            backgroundColor: "rgb(251 191 36 / 0.95)",
            boxShadow: "0 0 0 6px rgb(251 191 36 / 0.35)",
          },
        },
      },
      // If you later want shadcn-style radii:
      // borderRadius: {
      //   lg: "var(--radius-lg)",
      //   md: "var(--radius-md)",
      //   sm: "var(--radius-sm)",
      // },
    },
  },
};
