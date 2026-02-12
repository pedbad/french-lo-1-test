// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Helper to map CSS variables:
 *   --color-primary-50, --color-primary-100, etc.
 * into Tailwind color scales like primary-50, primary-100...
 */
const buildPalette = (token) => ({
	100: `rgb(var(--color-${token}-100) / <alpha-value>)`,
	200: `rgb(var(--color-${token}-200) / <alpha-value>)`,
	300: `rgb(var(--color-${token}-300) / <alpha-value>)`,
	400: `rgb(var(--color-${token}-400) / <alpha-value>)`,
	50: `rgb(var(--color-${token}-50) / <alpha-value>)`,
	DEFAULT: `rgb(var(--color-${token}-400) / <alpha-value>)`,
});

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
		"bg-amber-300/90",
		"text-lg",
		"font-semibold",
		"text-amber-950",
		"ring-2",
		"ring-amber-400/80",
		"animate-highlight-flash",
	],
	theme: {
		extend: {
			animation: {
				"highlight-flash": "highlight-flash 1.2s ease 0s 3",
			},
			colors: {
				background: 'rgb(var(--color-surface-base) / <alpha-value>)',
				border: {
					DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
					default: 'rgb(var(--color-border-default) / <alpha-value>)',
					strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
					subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
				},
				foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
				primary: buildPalette('primary'),
				secondary: buildPalette('secondary'),
				surface: {
					base: 'rgb(var(--color-surface-base) / <alpha-value>)',
					elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
					overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
				},
				tertiary: buildPalette('tertiary'),
				text: {
					disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
					primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
					tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
				},
			},
			// Merge fonts with shadcn's expectations
			fontFamily: {
				heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
				mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
				// shadcn expects a sensible `sans` base it can use
				sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				'2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-2xl)' }],
				'3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-3xl)' }],
				base: ['var(--font-size-base)', { lineHeight: 'var(--body-line-height)' }],
				lg: ['var(--font-size-lg)', { lineHeight: '1.8' }],
				sm: ['var(--font-size-sm)', { lineHeight: '1.5' }],
				xl: ['var(--font-size-xl)', { lineHeight: '1.9' }],
				xs: ['var(--font-size-xs)', { lineHeight: '1.4' }],
			},
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
