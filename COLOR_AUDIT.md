# Color Audit

Date: 2026-02-11  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Why we are doing this audit
You decided that color should follow the same architecture as typography:

1. Canonical colors in `src/index.css` tokens.
2. Tailwind/shadcn consume those tokens.
3. SCSS color literals are removed (or reduced to tightly controlled exceptions).

The audit is needed because today color ownership is split across tokens, SCSS literals, inline styles, and component-level overrides. Without a full inventory, migration risks visual regressions.

## Scope
This audit checked:
- Color token definitions in `src/index.css`.
- Tailwind mapping in `tailwind.config.js`.
- Literal color usage (`#hex`, `rgb/rgba`, `hsl/hsla`, `oklch`) across `src/**` and `tailwind.config.js`.
- Token usage via `var(--...)` across SCSS/CSS/JSX.

## Executive Summary
- Tokenized color foundation exists and is strong.
- Tailwind mapping already consumes tokenized colors.
- Literal color usage still exists in multiple files, including high-impact areas.
- Result: color behavior can still be inconsistent and harder to maintain than necessary.

### Key metrics
- Literal color matches (`#hex`, `rgb(a)`, `hsl(a)`, `oklch`) non-commented: **148**
- Token usage matches (`var(--...)`) non-commented: **350**

Interpretation:
- Token usage is dominant (good).
- Literal color debt is still significant and should be reduced systematically.

## Canonical color token source
Primary color token definitions are in:
- `src/index.css` (light + dark token sets)

Raw extraction: see Appendix A.

## Tailwind/shadcn mapping status
Tailwind mapping to tokenized colors exists in:
- `tailwind.config.js`

Raw extraction: see Appendix B.

## Highest color hotspot files (literal color density)
Top files with literal color usage:

```text
   9 src/App.scss
   6 src/components/MemoryMatchGame/Card/Card.scss
   6 src/components/MainMenu/MainMenu.scss
   2 src/styles/_mixins.module.scss
   2 src/components/Sortable/Sortable.scss
   2 src/components/Info/Info.scss
   2 src/components/Congratulate/Congratulate.scss
   2 src/components/Blanks/Blanks.scss
   2 src/components/Accordion/Accordion.scss
   1 src/styles/_colours.module.scss
   1 src/components/WordParts/WordParts.scss
   1 src/components/SequenceAudioController/SequenceAudioController.scss
   1 src/components/MemoryMatchGame/MemoryMatchGame.scss
   1 src/components/LandingPage/LandingPage.scss
   1 src/components/ErrorLog/ErrorLog.scss
   1 src/components/AudioClip/AudioClip.scss
```

## Notable mixed-ownership examples
1. `src/App.scss`
- Contains both token usage (`var(--...)`) and literal `oklch(...)`/fallback literals.

2. `src/components/MainMenu/MainMenu.scss`
- Mostly tokenized, but includes direct `oklch(...)` and literal alpha styles.

3. `src/components/AudioClip/AudioClip.scss`
- Mix of tokens, gradients, and literal `oklch(...)`.

4. `tailwind.config.js`
- Mostly tokenized mapping (good), but has hardcoded highlight flash colors in keyframes.

## Initial migration priority (color)
1. Keep all canonical values in `src/index.css`.
2. Keep Tailwind mapping token-driven.
3. Replace literal colors in high-impact files first:
   - `src/App.scss`
   - `src/components/MainMenu/MainMenu.scss`
   - `src/components/Footer/Footer.scss`
   - `src/components/AudioClip/AudioClip.scss`
4. Then clean component-by-component by hotspot ranking.

## Appendix A: Token definitions in index.css
```text
18:		--color-primary-50: 239 246 255;
19:		--color-primary-100: 219 234 254;
20:		--color-primary-200: 191 219 254;
21:		--color-primary-300: 147 197 253;
22:		--color-primary-400: 96 165 250;
24:		--color-secondary-50: 249 250 251;
25:		--color-secondary-100: 243 244 246;
26:		--color-secondary-200: 229 231 235;
27:		--color-secondary-300: 209 213 219;
28:		--color-secondary-400: 156 163 175;
30:		--color-tertiary-50: 245 243 255;
31:		--color-tertiary-100: 237 233 254;
32:		--color-tertiary-200: 221 214 254;
33:		--color-tertiary-300: 196 181 253;
34:		--color-tertiary-400: 167 139 250;
36:		--color-surface-base: 255 229 169;
37:		--color-surface-elevated: 249 250 251;
38:		--color-surface-overlay: 15 23 42;
40:		--color-text-primary: 15 23 42;
41:		--color-text-secondary: 71 85 105;
42:		--color-text-tertiary: 100 116 139;
43:		--color-text-disabled: 148 163 184;
45:		--color-border-subtle: 226 232 240;
46:		--color-border-default: 203 213 225;
47:		--color-border-strong: 148 163 184;
49:		--color-traffic-red: 239 68 68;
50:		--color-traffic-amber: 245 158 11;
51:		--color-traffic-green: 34 197 94;
68:		--background: oklch(1 0 0);
69:		--foreground: oklch(0.145 0 0);
74:		--primary: oklch(0.205 0 0);
76:		--secondary: oklch(0.97 0 0);
78:		--muted: oklch(0.97 0 0);
80:		--accent: oklch(0.97 0 0);
82:		--destructive: oklch(0.577 0.245 27.325);
83:		--border: oklch(0.922 0 0);
84:		--input: oklch(0.922 0 0);
85:		--ring: oklch(0.708 0 0);
86:		--chart-1: oklch(0.646 0.222 41.116);
87:		--chart-2: oklch(0.6 0.118 184.704);
88:		--chart-3: oklch(0.398 0.07 227.392);
89:		--chart-4: oklch(0.828 0.189 84.429);
90:		--chart-5: oklch(0.769 0.188 70.08);
91:		--sidebar: oklch(0.985 0 0);
92:		--sidebar-foreground: oklch(0.145 0 0);
93:		--sidebar-primary: oklch(0.205 0 0);
94:		--sidebar-primary-foreground: oklch(0.985 0 0);
95:		--sidebar-accent: oklch(0.97 0 0);
96:		--sidebar-accent-foreground: oklch(0.205 0 0);
97:		--sidebar-border: oklch(0.922 0 0);
98:		--sidebar-ring: oklch(0.708 0 0);
101:		--page-background: oklch(0.976 0.023 90.7);
102:		--hero-title-color: oklch(0.612 0.130 160.6);
103:		--footer-background: oklch(0.851 0.089 178.8);
104:		--accordion-mist: oklch(0.9330 0.0055 183.0);
105:		--accordion-hover-text: oklch(0.145 0 0);
108:		--ped-affirm: var(--chart-2);
109:		--ped-warn: var(--chart-1);
118:		--color-primary-50: 15 118 220;
119:		--color-primary-100: 14 165 233;
120:		--color-primary-200: 59 130 246;
121:		--color-primary-300: 96 165 250;
122:		--color-primary-400: 147 197 253;
124:		--color-secondary-50: 15 23 42;
125:		--color-secondary-100: 30 41 59;
126:		--color-secondary-200: 51 65 85;
127:		--color-secondary-300: 71 85 105;
128:		--color-secondary-400: 148 163 184;
130:		--color-tertiary-50: 49 46 129;
131:		--color-tertiary-100: 79 70 229;
132:		--color-tertiary-200: 124 58 237;
133:		--color-tertiary-300: 167 139 250;
134:		--color-tertiary-400: 196 181 253;
136:		--color-surface-base: 15 23 42;
137:		--color-surface-elevated: 30 41 59;
138:		--color-surface-overlay: 8 47 73;
140:		--color-text-primary: 226 232 240;
141:		--color-text-secondary: 203 213 225;
142:		--color-text-tertiary: 148 163 184;
143:		--color-text-disabled: 100 116 139;
145:		--color-border-subtle: 51 65 85;
146:		--color-border-default: 71 85 105;
147:		--color-border-strong: 148 163 184;
149:		--color-traffic-red: 248 113 113;
150:		--color-traffic-amber: 251 191 36;
151:		--color-traffic-green: 74 222 128;
167:		--background: oklch(0.145 0 0);
168:		--foreground: oklch(0.985 0 0);
173:		--primary: oklch(0.922 0 0);
175:		--secondary: oklch(0.269 0 0);
177:		--muted: oklch(0.269 0 0);
179:		--accent: oklch(0.269 0 0);
181:		--destructive: oklch(0.704 0.191 22.216);
182:		--border: oklch(1 0 0 / 10%);
183:		--input: oklch(1 0 0 / 15%);
184:		--ring: oklch(0.556 0 0);
185:		--chart-1: oklch(0.488 0.243 264.376);
186:		--chart-2: oklch(0.696 0.17 162.48);
187:		--chart-3: oklch(0.769 0.188 70.08);
188:		--chart-4: oklch(0.627 0.265 303.9);
189:		--chart-5: oklch(0.645 0.246 16.439);
190:		--sidebar: oklch(0.205 0 0);
191:		--sidebar-foreground: oklch(0.985 0 0);
192:		--sidebar-primary: oklch(0.488 0.243 264.376);
193:		--sidebar-primary-foreground: oklch(0.985 0 0);
194:		--sidebar-accent: oklch(0.269 0 0);
195:		--sidebar-accent-foreground: oklch(0.985 0 0);
196:		--sidebar-border: oklch(1 0 0 / 10%);
197:		--sidebar-ring: oklch(0.556 0 0);
200:		--page-background: var(--background);
201:		--hero-title-color: oklch(0.612 0.130 160.6);
202:		--footer-background: var(--sidebar);
203:		--accordion-mist: oklch(0.9330 0.0055 183.0);
204:		--accordion-hover-text: oklch(0.145 0 0);
211:		background-color: rgb(var(--color-surface-base) / 1);
214:		background-color: rgb(var(--color-surface-elevated) / 1);
217:		background-color: rgb(var(--color-surface-overlay) / 1);
220:		color: rgb(var(--color-text-primary) / 1);
223:		color: rgb(var(--color-text-secondary) / 1);
226:		color: rgb(var(--color-text-tertiary) / 1);
229:		border-color: rgb(var(--color-border-subtle) / 1);
232:		border-color: rgb(var(--color-border-default) / 1);
235:		border-color: rgb(var(--color-border-strong) / 1);
263:		background-color: var(--page-background) !important;
269:		-webkit-text-stroke: 1px var(--chart-3);
270:		text-stroke: 1px var(--chart-3);
289:	--color-background: var(--background);
290:	--color-foreground: var(--foreground);
291:	--color-card: var(--card);
292:	--color-card-foreground: var(--card-foreground);
293:	--color-popover: var(--popover);
294:	--color-popover-foreground: var(--popover-foreground);
295:	--color-primary: var(--primary);
296:	--color-primary-foreground: var(--primary-foreground);
297:	--color-secondary: var(--secondary);
298:	--color-secondary-foreground: var(--secondary-foreground);
299:	--color-muted: var(--muted);
300:	--color-muted-foreground: var(--muted-foreground);
301:	--color-accent: var(--accent);
302:	--color-accent-foreground: var(--accent-foreground);
303:	--color-destructive: var(--destructive);
304:	--color-border: var(--border);
305:	--color-input: var(--input);
306:	--color-ring: var(--ring);
307:	--color-chart-1: var(--chart-1);
308:	--color-chart-2: var(--chart-2);
309:	--color-chart-3: var(--chart-3);
310:	--color-chart-4: var(--chart-4);
311:	--color-chart-5: var(--chart-5);
312:	--color-sidebar: var(--sidebar);
313:	--color-sidebar-foreground: var(--sidebar-foreground);
314:	--color-sidebar-primary: var(--sidebar-primary);
315:	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
316:	--color-sidebar-accent: var(--sidebar-accent);
317:	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
318:	--color-sidebar-border: var(--sidebar-border);
319:	--color-sidebar-ring: var(--sidebar-ring);
```

## Appendix B: Tailwind color mapping references
```text
9:const buildPalette = (token) => ({
42:			colors: {
43:				background: 'rgb(var(--color-surface-base) / <alpha-value>)',
44:				border: {
50:				foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
51:				primary: buildPalette('primary'),
52:				secondary: buildPalette('secondary'),
53:				surface: {
58:				tertiary: buildPalette('tertiary'),
59:				text: {
```

## Appendix C: Full literal color matches (non-commented)
```text
tailwind.config.js:10:	100: `rgb(var(--color-${token}-100) / <alpha-value>)`,
tailwind.config.js:11:	200: `rgb(var(--color-${token}-200) / <alpha-value>)`,
tailwind.config.js:12:	300: `rgb(var(--color-${token}-300) / <alpha-value>)`,
tailwind.config.js:13:	400: `rgb(var(--color-${token}-400) / <alpha-value>)`,
tailwind.config.js:14:	50: `rgb(var(--color-${token}-50) / <alpha-value>)`,
tailwind.config.js:15:	DEFAULT: `rgb(var(--color-${token}-400) / <alpha-value>)`,
tailwind.config.js:43:				background: 'rgb(var(--color-surface-base) / <alpha-value>)',
tailwind.config.js:45:					DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
tailwind.config.js:46:					default: 'rgb(var(--color-border-default) / <alpha-value>)',
tailwind.config.js:47:					strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
tailwind.config.js:48:					subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
tailwind.config.js:50:				foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
tailwind.config.js:54:					base: 'rgb(var(--color-surface-base) / <alpha-value>)',
tailwind.config.js:55:					elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
tailwind.config.js:56:					overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
tailwind.config.js:60:					disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
tailwind.config.js:61:					primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
tailwind.config.js:62:					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
tailwind.config.js:63:					tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
tailwind.config.js:85:						backgroundColor: "rgb(252 211 77 / 0.9)",
tailwind.config.js:86:						boxShadow: "0 0 0 0 rgb(251 191 36 / 0.4)",
tailwind.config.js:89:						backgroundColor: "rgb(251 191 36 / 0.95)",
tailwind.config.js:90:						boxShadow: "0 0 0 6px rgb(251 191 36 / 0.35)",
src/App.scss:148:		color: oklch(0.646 0.222 41.116);
src/App.scss:243:	color: var(--primary-foreground, #fff);
src/App.scss:393:	--hero-banner-title-color: oklch(0.398 0.07 227.392);
src/App.scss:610:			background: var(--muted); //#f9f9f9;
src/App.scss:751:			border: 4px solid $background-colour; //white; // #e3e2fd;
src/App.scss:780:	color: oklch(0.646 0.222 41.116);
src/App.scss:781:	text-decoration-color: color-mix(in oklab, oklch(0.646 0.222 41.116) 60%, transparent);
src/App.scss:785:	color: oklch(0.646 0.222 41.116);
src/App.scss:786:	text-decoration-color: color-mix(in oklab, oklch(0.646 0.222 41.116) 60%, transparent);
src/components/Sortable/Sortable.scss:14:	background-color: rgb(var(--color-surface-elevated, var(--color-surface-base)) / 1);
src/components/Sortable/Sortable.scss:15:	border-color: rgb(var(--color-border-default) / 1);
src/components/ErrorLog/ErrorLog.scss:128:			background-color: var(--card); // rgba(255, 0, 0, 0.05);
src/components/Info/Info.scss:11:	background-color: rgb(var(--color-primary-50) / 1);
src/components/Info/Info.scss:18:	border: 2px solid rgb(var(--color-primary-400) / 1);
src/components/MainMenu/MainMenu.scss:89:		color: rgb(var(--color-text-secondary));
src/components/MainMenu/MainMenu.scss:93:			color: rgb(var(--color-text-primary));
src/components/MainMenu/MainMenu.scss:136:			background-color: oklch(0 0 0 / 0.06);
src/components/MainMenu/MainMenu.scss:155:				border-bottom: 1px solid oklch(0 0 0 / 0.06);
src/components/MainMenu/MainMenu.scss:175:			color: rgb(var(--color-text-secondary));
src/components/MainMenu/MainMenu.scss:179:				color: rgb(var(--color-text-primary));
src/components/MemoryMatchGame/MemoryMatchGame.scss:16:$none: rgba(#fff, 0);
src/components/MemoryMatchGame/Card/Card.scss:9:$none: rgba(#fff, 0);
src/components/MemoryMatchGame/Card/Card.scss:260:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.3);
src/components/MemoryMatchGame/Card/Card.scss:263:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.4);
src/components/MemoryMatchGame/Card/Card.scss:267:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.3);
src/components/MemoryMatchGame/Card/Card.scss:276:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //blue; //rgba(255, 0, 0, 0.4);
src/components/MemoryMatchGame/Card/Card.scss:280:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //blue; //rgba(255, 0, 0, 0.3);
src/components/AudioClip/AudioClip.scss:54:		color: oklch(0.646 0.222 41.116);
src/components/Congratulate/Congratulate.scss:13:	background-color: color-mix(in oklab, var(--foreground) 25%, transparent); //rgba(255, 0, 0, 0.2);
src/components/Congratulate/Congratulate.scss:45:	box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
src/components/Flag/Flag.jsx:75:						? `hsla(${foregroundToken}, 0.25)`
src/components/Flag/Flag.jsx:76:						: 'rgba(0, 0, 0, 0.25)';
src/components/Flag/Flag.jsx:120:							? `hsla(${backgroundToken}, ${0.15 * light})`
src/components/Flag/Flag.jsx:121:							: `rgba(255, 255, 255, ${0.15 * light})`;
src/components/Flag/Flag.jsx:125:							? `hsla(${foregroundToken}, ${0.1 * (1 - light)})`
src/components/Flag/Flag.jsx:126:							: `rgba(0, 0, 0, ${0.1 * (1 - light)})`;
src/components/WordParts/WordParts.scss:40:		color: var(--primary-foreground, #fff);
src/components/LandingPage/LandingPage.scss:16:		border: 1px solid rgb(var(--color-border-subtle) / 1);
src/styles/_mixins.module.scss:9:	/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#00087c+0,0003d3+51,00087c+100 */
src/styles/_mixins.module.scss:20:	$light-color: round(((red(#ffffff) * 299) + (green(#ffffff) * 587) + (blue(#ffffff) * 114)) / 1000);
src/styles/_colours.module.scss:28:$french-article-base-background: var(--card); //#eceeff;
src/index.css:68:		--background: oklch(1 0 0);
src/index.css:69:		--foreground: oklch(0.145 0 0);
src/index.css:70:		--card: oklch(1 0 0);
src/index.css:71:		--card-foreground: oklch(0.145 0 0);
src/index.css:72:		--popover: oklch(1 0 0);
src/index.css:73:		--popover-foreground: oklch(0.145 0 0);
src/index.css:74:		--primary: oklch(0.205 0 0);
src/index.css:75:		--primary-foreground: oklch(0.985 0 0);
src/index.css:76:		--secondary: oklch(0.97 0 0);
src/index.css:77:		--secondary-foreground: oklch(0.205 0 0);
src/index.css:78:		--muted: oklch(0.97 0 0);
src/index.css:79:		--muted-foreground: oklch(0.556 0 0);
src/index.css:80:		--accent: oklch(0.97 0 0);
src/index.css:81:		--accent-foreground: oklch(0.205 0 0);
src/index.css:82:		--destructive: oklch(0.577 0.245 27.325);
src/index.css:83:		--border: oklch(0.922 0 0);
src/index.css:84:		--input: oklch(0.922 0 0);
src/index.css:85:		--ring: oklch(0.708 0 0);
src/index.css:86:		--chart-1: oklch(0.646 0.222 41.116);
src/index.css:87:		--chart-2: oklch(0.6 0.118 184.704);
src/index.css:88:		--chart-3: oklch(0.398 0.07 227.392);
src/index.css:89:		--chart-4: oklch(0.828 0.189 84.429);
src/index.css:90:		--chart-5: oklch(0.769 0.188 70.08);
src/index.css:91:		--sidebar: oklch(0.985 0 0);
src/index.css:92:		--sidebar-foreground: oklch(0.145 0 0);
src/index.css:93:		--sidebar-primary: oklch(0.205 0 0);
src/index.css:94:		--sidebar-primary-foreground: oklch(0.985 0 0);
src/index.css:95:		--sidebar-accent: oklch(0.97 0 0);
src/index.css:96:		--sidebar-accent-foreground: oklch(0.205 0 0);
src/index.css:97:		--sidebar-border: oklch(0.922 0 0);
src/index.css:98:		--sidebar-ring: oklch(0.708 0 0);
src/index.css:101:		--page-background: oklch(0.976 0.023 90.7);
src/index.css:102:		--hero-title-color: oklch(0.612 0.130 160.6);
src/index.css:103:		--footer-background: oklch(0.851 0.089 178.8);
src/index.css:104:		--accordion-mist: oklch(0.9330 0.0055 183.0);
src/index.css:105:		--accordion-hover-text: oklch(0.145 0 0);
src/index.css:167:		--background: oklch(0.145 0 0);
src/index.css:168:		--foreground: oklch(0.985 0 0);
src/index.css:169:		--card: oklch(0.205 0 0);
src/index.css:170:		--card-foreground: oklch(0.985 0 0);
src/index.css:171:		--popover: oklch(0.205 0 0);
src/index.css:172:		--popover-foreground: oklch(0.985 0 0);
src/index.css:173:		--primary: oklch(0.922 0 0);
src/index.css:174:		--primary-foreground: oklch(0.205 0 0);
src/index.css:175:		--secondary: oklch(0.269 0 0);
src/index.css:176:		--secondary-foreground: oklch(0.985 0 0);
src/index.css:177:		--muted: oklch(0.269 0 0);
src/index.css:178:		--muted-foreground: oklch(0.708 0 0);
src/index.css:179:		--accent: oklch(0.269 0 0);
src/index.css:180:		--accent-foreground: oklch(0.985 0 0);
src/index.css:181:		--destructive: oklch(0.704 0.191 22.216);
src/index.css:182:		--border: oklch(1 0 0 / 10%);
src/index.css:183:		--input: oklch(1 0 0 / 15%);
src/index.css:184:		--ring: oklch(0.556 0 0);
src/index.css:185:		--chart-1: oklch(0.488 0.243 264.376);
src/index.css:186:		--chart-2: oklch(0.696 0.17 162.48);
src/index.css:187:		--chart-3: oklch(0.769 0.188 70.08);
src/index.css:188:		--chart-4: oklch(0.627 0.265 303.9);
src/index.css:189:		--chart-5: oklch(0.645 0.246 16.439);
src/index.css:190:		--sidebar: oklch(0.205 0 0);
src/index.css:191:		--sidebar-foreground: oklch(0.985 0 0);
src/index.css:192:		--sidebar-primary: oklch(0.488 0.243 264.376);
src/index.css:193:		--sidebar-primary-foreground: oklch(0.985 0 0);
src/index.css:194:		--sidebar-accent: oklch(0.269 0 0);
src/index.css:195:		--sidebar-accent-foreground: oklch(0.985 0 0);
src/index.css:196:		--sidebar-border: oklch(1 0 0 / 10%);
src/index.css:197:		--sidebar-ring: oklch(0.556 0 0);
src/index.css:201:		--hero-title-color: oklch(0.612 0.130 160.6);
src/index.css:203:		--accordion-mist: oklch(0.9330 0.0055 183.0);
src/index.css:204:		--accordion-hover-text: oklch(0.145 0 0);
src/index.css:211:		background-color: rgb(var(--color-surface-base) / 1);
src/index.css:214:		background-color: rgb(var(--color-surface-elevated) / 1);
src/index.css:217:		background-color: rgb(var(--color-surface-overlay) / 1);
src/index.css:220:		color: rgb(var(--color-text-primary) / 1);
src/index.css:223:		color: rgb(var(--color-text-secondary) / 1);
src/index.css:226:		color: rgb(var(--color-text-tertiary) / 1);
src/index.css:229:		border-color: rgb(var(--color-border-subtle) / 1);
src/index.css:232:		border-color: rgb(var(--color-border-default) / 1);
src/index.css:235:		border-color: rgb(var(--color-border-strong) / 1);
src/components/Accordion/Accordion.scss:190:		outline: 2px solid rgb(var(--color-border-subtle) / 0.5);
src/components/Accordion/Accordion.scss:191:		background-color: rgb(var(--color-secondary-100) / 0.5);
src/components/SequenceAudioController/SequenceAudioController.scss:9:	background: var(--muted); //#f9f9f9;
src/components/Blanks/Blanks.scss:143:				background: var(--muted); //#f9f9f9;
src/components/Blanks/Blanks.scss:235:		background: var(--muted); //#f9f9f9; //red; // hsl(0deg, 0%, 90%);
```

## Appendix D: Full token usage matches (non-commented)
```text
tailwind.config.js:10:	100: `rgb(var(--color-${token}-100) / <alpha-value>)`,
tailwind.config.js:11:	200: `rgb(var(--color-${token}-200) / <alpha-value>)`,
tailwind.config.js:12:	300: `rgb(var(--color-${token}-300) / <alpha-value>)`,
tailwind.config.js:13:	400: `rgb(var(--color-${token}-400) / <alpha-value>)`,
tailwind.config.js:14:	50: `rgb(var(--color-${token}-50) / <alpha-value>)`,
tailwind.config.js:15:	DEFAULT: `rgb(var(--color-${token}-400) / <alpha-value>)`,
tailwind.config.js:43:				background: 'rgb(var(--color-surface-base) / <alpha-value>)',
tailwind.config.js:45:					DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
tailwind.config.js:46:					default: 'rgb(var(--color-border-default) / <alpha-value>)',
tailwind.config.js:47:					strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
tailwind.config.js:48:					subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
tailwind.config.js:50:				foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
tailwind.config.js:54:					base: 'rgb(var(--color-surface-base) / <alpha-value>)',
tailwind.config.js:55:					elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
tailwind.config.js:56:					overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
tailwind.config.js:60:					disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
tailwind.config.js:61:					primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
tailwind.config.js:62:					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
tailwind.config.js:63:					tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
src/App.scss:40:	background: var(--background);
src/App.scss:98:	border: 1px solid var(--destructive);
src/App.scss:159:					color: var(--primary);
src/App.scss:243:	color: var(--primary-foreground, #fff);
src/App.scss:252:		background-color: color-mix(in oklab, var(--ring) 0%, transparent);
src/App.scss:255:		background-color: var(--ring);
src/App.scss:258:		background-color: color-mix(in oklab, var(--ring) 0%, transparent);
src/App.scss:264:		background-color: color-mix(in oklab, var(--ring) 0%, transparent);
src/App.scss:265:		color: var(--foreground);
src/App.scss:268:		background-color: var(--ring);
src/App.scss:271:		background-color: color-mix(in oklab, var(--ring) 0%, transparent);
src/App.scss:320:	color: var(--primary);
src/App.scss:470:	color: var(--foreground);
src/App.scss:521:		background-color: var(--chart-2);
src/App.scss:534:		color: var(--foreground);
src/App.scss:564:		color: var(--muted-foreground);
src/App.scss:573:		border-color: var(--border);
src/App.scss:608:			border: 1px solid var(--border);
src/App.scss:610:			background: var(--muted); //#f9f9f9;
src/App.scss:617:			color: var(--primary);
src/components/Sortable/Sortable.scss:13:	color: var(--foreground);
src/components/Sortable/Sortable.scss:14:	background-color: rgb(var(--color-surface-elevated, var(--color-surface-base)) / 1);
src/components/Sortable/Sortable.scss:15:	border-color: rgb(var(--color-border-default) / 1);
src/components/Sortable/Sortable.scss:20:	background-color: var(--accordion-mist);
src/components/Sortable/Sortable.scss:21:	color: var(--accordion-hover-text);
src/components/Sortable/Sortable.scss:22:	border-color: var(--accordion-hover-text);
src/components/Sortable/Sortable.scss:26:	color: var(--foreground);
src/components/Sortable/Sortable.scss:31:	color: var(--accordion-hover-text);
src/components/ErrorLog/ErrorLog.scss:9:$header-colour: var(--muted-foreground);
src/components/ErrorLog/ErrorLog.scss:23:	box-shadow: 0 0 4px color-mix(in oklab, var(--border) 70%, transparent);
src/components/ErrorLog/ErrorLog.scss:78:			background: var(--destructive);
src/components/ErrorLog/ErrorLog.scss:90:		background-color: var(--muted);
src/components/ErrorLog/ErrorLog.scss:130:				background-color: color-mix(in oklab, var(--destructive) 4%, var(--card));
src/components/Header/Header.scss:7:	color: var(--primary-foreground);
src/components/Header/Header.scss:25:	box-shadow: 0 8px 8px color-mix(in oklab, var(--foreground) 20%, transparent);
src/components/Monologue/Monologue.scss:31:		border-color: var(--border);
src/components/Monologue/Monologue.scss:32:		box-shadow: 0 1px 2px color-mix(in oklab, var(--foreground) 20%, transparent);
src/components/LearningObjectMenu/LearningObjectMenu.scss:39:				color: var(--primary-foreground);
src/components/LearningObjectMenu/LearningObjectMenu.scss:50:			background-color: var(--primary);
src/components/LearningObjectMenu/LearningObjectMenu.scss:64:			color: var(--primary-foreground);
src/components/SequenceAudioController/SequenceAudioController.scss:7:	border: 1px solid var(--border);
src/components/SequenceAudioController/SequenceAudioController.scss:9:	background: var(--muted); //#f9f9f9;
src/components/SequenceAudioController/SequenceAudioController.scss:25:		color: var(--foreground);
src/components/Form/Select/Select.scss:13:		background: var(--background);
src/components/Form/Select/Select.scss:16:		border: 1px solid var(--border);
src/components/AudioClip/AudioClip.jsx:253:		const bgColour = 'var(--border)'; // Keep ring subtle in both light and dark themes.
src/components/WordParts/WordParts.scss:11:			border: 1px solid color-mix(in oklab, var(--destructive) 20%, transparent);
src/components/WordParts/WordParts.scss:38:		border-color: var(--chart-2);
src/components/WordParts/WordParts.scss:39:		background-color: var(--chart-2);
src/components/WordParts/WordParts.scss:40:		color: var(--primary-foreground, #fff);
src/components/WordParts/WordParts.scss:43:		background-color: color-mix(in oklab, var(--chart-2) 85%, transparent);
src/components/WordParts/WordParts.scss:104:		box-shadow: 4px 4px 4px color-mix(in oklab, var(--foreground) 20%, transparent);
src/components/WordParts/WordParts.scss:108:		box-shadow: 4px -4px 4px color-mix(in oklab, var(--foreground) 20%, transparent);
src/components/WordParts/WordParts.scss:112:		box-shadow: 4px 4px 4px color-mix(in oklab, var(--foreground) 20%, transparent);
src/components/WordParts/WordParts.scss:117:		background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/WordParts/WordParts.scss:120:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/WordParts/WordParts.scss:123:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/WordParts/WordParts.scss:127:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/WordParts/WordParts.scss:130:		background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/AudioClip/AudioClip.scss:26:			-3px -3px 3px color-mix(in oklab, var(--foreground) 40%, transparent),
src/components/AudioClip/AudioClip.scss:27:			-3px 3px 3px color-mix(in oklab, var(--foreground) 40%, transparent),
src/components/AudioClip/AudioClip.scss:28:			3px 3px 3px color-mix(in oklab, var(--background) 40%, transparent),
src/components/AudioClip/AudioClip.scss:29:			3px -3px 3px color-mix(in oklab, var(--background) 40%, transparent);
src/components/AudioClip/AudioClip.scss:49:	color: var(--chart-2);
src/components/AudioClip/AudioClip.scss:51:		color: var(--chart-2);
src/components/AudioClip/AudioClip.scss:70:		background-color: var(--primary);
src/components/AudioClip/AudioClip.scss:88:		color: var(--chart-2);
src/components/AudioClip/AudioClip.scss:127:		fill: linear-gradient(0deg, var(--destructive) 0%, var(--chart-2) 48%, var(--foreground) 48%);
src/components/AudioClip/AudioClip.scss:131:		fill: linear-gradient(0deg, var(--destructive) 0%, var(--chart-2) 90%, var(--foreground) 90%);
src/components/WordParts/WordParts.jsx:252:									className={`h-[1.125rem] w-[1.125rem] sm:h-[1.5rem] sm:w-[1.5rem] rounded-full border ${filled ? "bg-[var(--chart-2)] border-[var(--chart-2)]" : "bg-transparent border-[color-mix(in_oklab,var(--foreground)_35%,transparent)]"}`}
src/components/AudioClip/CircularAudioProgressAnimatedSpeakerDisplay.jsx:56:		const bgColour = 'var(--border)';
src/components/AudioClip/CircularAudioProgressAnimatedSpeakerDisplay.jsx:133:				<TooltipContent className="bg-[var(--footer-background)] text-foreground">
src/components/Footer/Footer.scss:9:	background-color: var(--footer-background);
src/components/Footer/Footer.scss:11:		color: var(--foreground);
src/components/Footer/Footer.scss:63:				color: var(--foreground);
src/components/Footer/Footer.scss:69:					color: var(--chart-3);
src/components/Footer/Footer.scss:71:					filter: drop-shadow(0 4px 10px color-mix(in oklab, var(--chart-3) 35%, transparent));
src/components/Footer/Footer.scss:112:			color: color-mix(in oklab, var(--foreground) 85%, transparent);
src/components/Footer/Footer.scss:116:					color: var(--primary);
src/components/Footer/Footer.scss:125:			color: var(--foreground);
src/components/Footer/Footer.scss:133:				color: var(--primary);
src/components/Footer/Footer.scss:135:					color: var(--primary);
src/components/Footer/Footer.scss:167:	background-color: var(--sidebar);
src/components/Footer/Footer.scss:170:			color: var(--chart-4);
src/components/Footer/Footer.scss:171:			filter: drop-shadow(0 4px 10px color-mix(in oklab, var(--chart-4) 35%, transparent));
src/components/Form/RadioC/RadioC.scss:222:		border-color: var(--foreground);
src/components/Form/RadioC/RadioC.scss:235:			background-color: var(--foreground);
src/components/Form/TristateCheckBox/TristateCheckBox.scss:13:	background-color: var(--background);
src/components/Form/TristateCheckBox/TristateCheckBox.scss:17:		background-color: var(--foreground);
src/components/Form/TristateCheckBox/TristateCheckBox.scss:23:			background: var(--background);
src/components/DropDowns/DropDowns.scss:10:			border: 1px solid color-mix(in oklab, var(--destructive) 20%, transparent);
src/components/DropDowns/DropDowns.scss:17:		background-color: color-mix(in oklab, var(--chart-2) 10%, transparent);
src/components/DropDowns/DropDowns.scss:36:						color: var(--destructive);
src/components/DropDowns/DropDowns.scss:43:					color: var(--chart-2);
src/components/DropDowns/DropDowns.scss:87:				border-color: var(--border);
src/components/LandingPage/LandingPage.scss:16:		border: 1px solid rgb(var(--color-border-subtle) / 1);
src/components/LandingPage/LandingPage.scss:19:		background: var(--primary);
src/components/LandingPage/LandingPage.scss:20:		background: linear-gradient(180deg, var(--primary) 0%, var(--destructive) 100%);
src/components/LandingPage/LandingPage.scss:23:			background: linear-gradient(180deg, var(--destructive) 0%, var(--primary) 100%);
src/components/LandingPage/LandingPage.scss:38:				color: var(--primary-foreground);
src/components/MainMenu/MainMenu.scss:16:	background-color: var(--background);
src/components/MainMenu/MainMenu.scss:17:	color: var(--foreground);
src/components/MainMenu/MainMenu.scss:18:	border-bottom: 1px solid var(--border);
src/components/MainMenu/MainMenu.scss:54:				border-bottom-color: var(--primary);
src/components/MainMenu/MainMenu.scss:57:					color: var(--chart-3);
src/components/MainMenu/MainMenu.scss:77:		color: var(--foreground);
src/components/MainMenu/MainMenu.scss:89:		color: rgb(var(--color-text-secondary));
src/components/MainMenu/MainMenu.scss:93:			color: rgb(var(--color-text-primary));
src/components/MainMenu/MainMenu.scss:142:		border-top: 1px solid var(--border);
src/components/MainMenu/MainMenu.scss:143:		background-color: var(--background);
src/components/MainMenu/MainMenu.scss:163:						color: var(--chart-3);
src/components/MainMenu/MainMenu.scss:166:					border-left: 2px var(--chart-3) solid;
src/components/MainMenu/MainMenu.scss:175:			color: rgb(var(--color-text-secondary));
src/components/MainMenu/MainMenu.scss:179:				color: rgb(var(--color-text-primary));
src/components/MainMenu/MainMenu.scss:193:			color: var(--hero-title-color);
src/components/MainMenu/MainMenu.scss:197:			border-left-color: var(--hero-title-color);
src/components/Form/Progress/Progress.scss:9:	background: var(--muted);
src/components/Form/Progress/Progress.scss:29:			-1px -1px 0 var(--background),
src/components/Form/Progress/Progress.scss:30:			-1px 1px 0 var(--background),
src/components/Form/Progress/Progress.scss:31:			1px 1px 0 var(--background),
src/components/Form/Progress/Progress.scss:32:			1px -1px 0 var(--background);
src/components/Form/Progress/Progress.scss:40:		box-shadow: 1px 0 4px color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/Form/Progress/Progress.scss:53:				color-mix(in oklab, var(--foreground) 20%, transparent) 0%,
src/components/Form/Progress/Progress.scss:56:				color-mix(in oklab, var(--background) 50%, transparent) 70%,
src/components/Congratulate/Congratulate.scss:13:	background-color: color-mix(in oklab, var(--foreground) 25%, transparent); //rgba(255, 0, 0, 0.2);
src/components/Congratulate/Congratulate.scss:64:		border: var(--primary) 4px outset;
src/components/Congratulate/Congratulate.scss:72:			background-color: var(--primary);
src/components/PhraseTable/PhraseTable.scss:18:			background-color: color-mix(in oklab, var(--muted) 70%, transparent);
src/components/PhraseTable/PhraseTable.scss:19:			color: var(--chart-2);
src/components/PhraseTable/PhraseTable.jsx:205:							<TooltipContent className="bg-[var(--footer-background)] text-foreground">
src/components/PhraseTable/PhraseTable.jsx:223:								<TooltipContent className="bg-[var(--footer-background)] text-foreground">
src/components/PhraseTable/PhraseTable.jsx:241:								<TooltipContent className="bg-[var(--footer-background)] text-foreground">
src/components/RadioQuiz/RadioQuiz.scss:71:				border-color: var(--border);
src/components/RadioQuiz/RadioQuiz.scss:76:					background: var(--muted);
src/components/RadioQuiz/RadioQuiz.scss:79:						var(--muted) 0%,
src/components/RadioQuiz/RadioQuiz.scss:80:						var(--muted) 30%,
src/components/RadioQuiz/RadioQuiz.scss:81:						var(--background) 31%,
src/components/RadioQuiz/RadioQuiz.scss:82:						var(--background) 100%
src/components/RadioQuiz/RadioQuiz.scss:100:					background-color: var(--muted);
src/components/RadioQuiz/RadioQuiz.scss:114:					border-color: var(--foreground);
src/components/RadioQuiz/RadioQuiz.scss:129:						border-color: var(--foreground);
src/components/RadioQuiz/RadioQuiz.scss:133:						background-color: var(--background);
src/components/RadioQuiz/RadioQuiz.scss:146:			color: var(--foreground);
src/components/RadioQuiz/RadioQuiz.scss:161:					border-left: 1px solid var(--destructive);
src/components/WordGrid/WordGrid.jsx:434:					stroke="var(--ring)"
src/components/WordGrid/WordGrid.jsx:486:										stroke="var(--primary)"
src/components/Jigsaw/Piece/Piece.scss:14:				background: var(--chart-2);
src/components/Jigsaw/Piece/Piece.scss:15:				background: radial-gradient(circle, var(--chart-2) 0%, transparent 100%);
src/components/Jigsaw/Piece/Piece.scss:27:				background: var(--destructive);
src/components/Jigsaw/Piece/Piece.scss:28:				background: radial-gradient(circle, var(--destructive) 0%, transparent 100%);
src/components/Jigsaw/Piece/Piece.scss:45:	background-color: var(--chart-2);
src/components/Jigsaw/Piece/Piece.scss:124:				background-color: var(--destructive);
src/components/WordGrid/WordGrid.scss:34:			background: var(--muted);
src/components/WordGrid/WordGrid.scss:37:				color-mix(in oklab, var(--muted) 85%, var(--background)) 0%,
src/components/WordGrid/WordGrid.scss:38:				color-mix(in oklab, var(--muted) 70%, var(--background)) 50%,
src/components/WordGrid/WordGrid.scss:39:				color-mix(in oklab, var(--muted) 85%, var(--background)) 73%,
src/components/WordGrid/WordGrid.scss:40:				color-mix(in oklab, var(--muted) 70%, var(--background)) 77%,
src/components/WordGrid/WordGrid.scss:41:				var(--muted) 100%
src/components/WordGrid/WordGrid.scss:57:			border: 1px solid var(--border);
src/components/WordGrid/WordGrid.scss:67:				-1px -1px 0 color-mix(in oklab, var(--foreground) 25%, transparent) inset,
src/components/WordGrid/WordGrid.scss:68:				0 0 3px color-mix(in oklab, var(--border) 60%, transparent) inset,
src/components/WordGrid/WordGrid.scss:69:				4px 4px 2px color-mix(in oklab, var(--background) 85%, transparent) inset,
src/components/WordGrid/WordGrid.scss:70:				2px 2px 2px color-mix(in oklab, var(--foreground) 25%, transparent) inset,
src/components/WordGrid/WordGrid.scss:71:				-2px -2px 2px color-mix(in oklab, var(--foreground) 25%, transparent) inset;
src/components/Accordion/Accordion.scss:122:			color: var(--foreground);
src/components/Accordion/Accordion.scss:124:				background-color: var(--accordion-mist);
src/components/Accordion/Accordion.scss:125:				color: var(--accordion-hover-text);
src/components/Accordion/Accordion.scss:127:					color: var(--accordion-hover-text) !important;
src/components/Accordion/Accordion.scss:151:				background-color: var(--accordion-mist);
src/components/Accordion/Accordion.scss:152:				color: var(--accordion-hover-text);
src/components/Accordion/Accordion.scss:154:					color: var(--accordion-hover-text) !important;
src/components/Accordion/Accordion.scss:190:		outline: 2px solid rgb(var(--color-border-subtle) / 0.5);
src/components/Accordion/Accordion.scss:191:		background-color: rgb(var(--color-secondary-100) / 0.5);
src/components/MemoryMatchGame/MemoryMatchGame.scss:12:			border: 1px solid color-mix(in oklab, var(--destructive) 20%, transparent);
src/components/MemoryMatchGame/MemoryMatchGame.scss:17:$blue: var(--primary);
src/components/MemoryMatchGame/MemoryMatchGame.scss:49:		color: var(--primary-foreground);
src/components/MemoryMatchGame/MemoryMatchGame.scss:130:			background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/MemoryMatchGame/MemoryMatchGame.scss:133:			background-color: color-mix(in oklab, var(--destructive) 30%, transparent);
src/components/MemoryMatchGame/MemoryMatchGame.scss:136:			background-color: color-mix(in oklab, var(--destructive) 40%, transparent);
src/components/MemoryMatchGame/MemoryMatchGame.scss:140:			background-color: color-mix(in oklab, var(--destructive) 30%, transparent);
src/components/MemoryMatchGame/MemoryMatchGame.scss:143:			background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/Jigsaw/Jigsaw.scss:29:			background: var(--muted);
src/components/Jigsaw/Jigsaw.scss:76:		background: var(--muted);
src/components/Jigsaw/Jigsaw.scss:77:		border: ($border-width * 1px) var(--border) ridge;
src/styles/_media-queries.scss:101:	background: color-mix(in oklab, var(--destructive) 50%, transparent);
src/styles/_media-queries.scss:102:	color: var(--foreground);
src/styles/_mixins.module.scss:12:		color-mix(in oklab, var(--primary) 85%, black) 0%,
src/styles/_mixins.module.scss:13:		var(--primary) 51%,
src/styles/_mixins.module.scss:14:		color-mix(in oklab, var(--primary) 85%, black) 100%
src/styles/_mixins.module.scss:136:		background: var(--muted);
src/styles/_mixins.module.scss:139:			color-mix(in oklab, var(--muted) 85%, var(--background)) 0%,
src/styles/_mixins.module.scss:140:			var(--background) 50%,
src/styles/_mixins.module.scss:141:			color-mix(in oklab, var(--muted) 85%, var(--background)) 73%,
src/styles/_mixins.module.scss:142:			var(--background) 77%,
src/styles/_mixins.module.scss:143:			var(--muted) 100%
src/styles/_mixins.module.scss:148:			border: 1px solid var(--border);
src/styles/_mixins.module.scss:228:	background-color: var(--muted);
src/styles/_mixins.module.scss:229:	color: var(--muted-foreground);
src/styles/_colours.module.scss:5:$background-colour: var(--background);
src/styles/_colours.module.scss:7:$button-grey: var(--muted);
src/styles/_colours.module.scss:9:$disabled-background: var(--muted);
src/styles/_colours.module.scss:11:$disabled-foreground: var(--muted-foreground);
src/styles/_colours.module.scss:13:$button-border: var(--border);
src/styles/_colours.module.scss:14:$button-highlight: var(--ring);
src/styles/_colours.module.scss:17:$nav-tab-border: var(--border);
src/styles/_colours.module.scss:18:$correct-border: var(--chart-2);
src/styles/_colours.module.scss:19:$correct-background: color-mix(in oklab, var(--chart-2) 20%, transparent);
src/styles/_colours.module.scss:21:$incorrect-border: var(--destructive);
src/styles/_colours.module.scss:22:$incorrect-background: color-mix(in oklab, var(--destructive) 20%, transparent);
src/styles/_colours.module.scss:26:$french-home: var(--primary);
src/styles/_colours.module.scss:27:$french-button: var(--primary);
src/styles/_colours.module.scss:30:$french-congratulate: var(--primary);
src/styles/_colours.module.scss:32:$body-back: var(--background);
src/styles/_colours.module.scss:37:$highlight: var(--ring);
src/styles/_colours.module.scss:38:$text: var(--foreground);
src/styles/_colours.module.scss:45:	highlight: var(--ring);
src/components/CrossWord/CrossWord.scss:37:		border: 1px solid var(--border);
src/components/CrossWord/CrossWord.scss:75:			border: 1px solid var(--border);
src/components/CrossWord/CrossWord.jsx:248:													border: cell ? '1px solid var(--border)' : '1px solid var(--foreground)',
src/components/CrossWord/CrossWord.jsx:249:													backgroundColor: cell ? 'var(--background)' : 'var(--muted)',
src/components/CrossWord/CrossWord.jsx:287:																? 'color-mix(in oklab, var(--chart-2) 25%, transparent)'
src/components/CrossWord/CrossWord.jsx:289:																	? 'color-mix(in oklab, var(--destructive) 20%, transparent)'
src/index.css:108:		--ped-affirm: var(--chart-2);
src/index.css:109:		--ped-warn: var(--chart-1);
src/index.css:110:		--ped-neg: var(--destructive);
src/index.css:111:		--ped-neutral: var(--muted-foreground);
src/index.css:112:		--ped-accent: var(--primary);
src/index.css:200:		--page-background: var(--background);
src/index.css:202:		--footer-background: var(--sidebar);
src/index.css:211:		background-color: rgb(var(--color-surface-base) / 1);
src/index.css:214:		background-color: rgb(var(--color-surface-elevated) / 1);
src/index.css:217:		background-color: rgb(var(--color-surface-overlay) / 1);
src/index.css:220:		color: rgb(var(--color-text-primary) / 1);
src/index.css:223:		color: rgb(var(--color-text-secondary) / 1);
src/index.css:226:		color: rgb(var(--color-text-tertiary) / 1);
src/index.css:229:		border-color: rgb(var(--color-border-subtle) / 1);
src/index.css:232:		border-color: rgb(var(--color-border-default) / 1);
src/index.css:235:		border-color: rgb(var(--color-border-strong) / 1);
src/index.css:263:		background-color: var(--page-background) !important;
src/index.css:269:		-webkit-text-stroke: 1px var(--chart-3);
src/index.css:270:		text-stroke: 1px var(--chart-3);
src/index.css:289:	--color-background: var(--background);
src/index.css:290:	--color-foreground: var(--foreground);
src/index.css:295:	--color-primary: var(--primary);
src/index.css:296:	--color-primary-foreground: var(--primary-foreground);
src/index.css:297:	--color-secondary: var(--secondary);
src/index.css:298:	--color-secondary-foreground: var(--secondary-foreground);
src/index.css:299:	--color-muted: var(--muted);
src/index.css:300:	--color-muted-foreground: var(--muted-foreground);
src/index.css:301:	--color-accent: var(--accent);
src/index.css:302:	--color-accent-foreground: var(--accent-foreground);
src/index.css:303:	--color-destructive: var(--destructive);
src/index.css:304:	--color-border: var(--border);
src/index.css:305:	--color-input: var(--input);
src/index.css:306:	--color-ring: var(--ring);
src/index.css:307:	--color-chart-1: var(--chart-1);
src/index.css:308:	--color-chart-2: var(--chart-2);
src/index.css:309:	--color-chart-3: var(--chart-3);
src/index.css:310:	--color-chart-4: var(--chart-4);
src/index.css:311:	--color-chart-5: var(--chart-5);
src/index.css:312:	--color-sidebar: var(--sidebar);
src/index.css:313:	--color-sidebar-foreground: var(--sidebar-foreground);
src/index.css:314:	--color-sidebar-primary: var(--sidebar-primary);
src/index.css:315:	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
src/index.css:316:	--color-sidebar-accent: var(--sidebar-accent);
src/index.css:317:	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
src/index.css:318:	--color-sidebar-border: var(--sidebar-border);
src/index.css:319:	--color-sidebar-ring: var(--sidebar-ring);
src/components/CustomComponents_FR/CustomComponents_FR.scss:19:		border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.scss:44:			border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.scss:71:			border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.scss:88:		border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.scss:121:				fill: var(--background);
src/components/CustomComponents_FR/CustomComponents_FR.scss:135:				stroke: color-mix(in oklab, var(--background) 30%, transparent);
src/components/CustomComponents_FR/CustomComponents_FR.scss:144:				fill: var(--chart-1);
src/components/CustomComponents_FR/CustomComponents_FR.scss:150:				fill: var(--chart-2);
src/components/CustomComponents_FR/CustomComponents_FR.scss:156:				fill: var(--destructive);
src/components/CustomComponents_FR/CustomComponents_FR.scss:162:				fill: var(--chart-2);
src/components/CustomComponents_FR/CustomComponents_FR.scss:168:				fill: var(--chart-4);
src/components/CustomComponents_FR/CustomComponents_FR.scss:190:			border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.scss:251:		border: 1px solid var(--border);
src/components/ReadAloud/ReadAloud.scss:60:			border: 1px solid var(--border);
src/components/CustomComponents_FR/CustomComponents_FR.jsx:234:							border: '1px solid color-mix(in oklab, var(--border) 60%, transparent)',
src/components/CustomComponents_FR/CustomComponents_FR.jsx:389:							style={{ border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)" }}
src/components/CustomComponents_FR/CustomComponents_FR.jsx:630:							border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
src/components/MemoryMatchGame/Card/Card.scss:10:$blue: var(--primary);
src/components/MemoryMatchGame/Card/Card.scss:72:			color-mix(in oklab, var(--card) 90%, var(--muted)) 100%
src/components/MemoryMatchGame/Card/Card.scss:75:		border: 1px solid var(--border);
src/components/MemoryMatchGame/Card/Card.scss:76:		box-shadow: 2px 2px 2px color-mix(in oklab, var(--foreground) 60%, transparent);
src/components/MemoryMatchGame/Card/Card.scss:141:			border: $card-back-border-width solid var(--background);
src/components/MemoryMatchGame/Card/Card.scss:173:			box-shadow: 2px -2px 2px color-mix(in oklab, var(--foreground) 60%, transparent); //0.2);
src/components/MemoryMatchGame/Card/Card.scss:257:		background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/MemoryMatchGame/Card/Card.scss:260:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.3);
src/components/MemoryMatchGame/Card/Card.scss:263:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.4);
src/components/MemoryMatchGame/Card/Card.scss:267:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //red; //rgba(255, 0, 0, 0.3);
src/components/MemoryMatchGame/Card/Card.scss:270:		background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/MemoryMatchGame/Card/Card.scss:276:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //blue; //rgba(255, 0, 0, 0.4);
src/components/MemoryMatchGame/Card/Card.scss:280:		background-color: color-mix(in oklab, var(--foreground) 40%, transparent); //blue; //rgba(255, 0, 0, 0.3);
src/components/MemoryMatchGame/Card/Card.scss:283:		background-color: color-mix(in oklab, var(--destructive) 0%, transparent);
src/components/Info/Info.scss:8:$info-blue: var(--primary);
src/components/Info/Info.scss:11:	background-color: rgb(var(--color-primary-50) / 1);
src/components/Info/Info.scss:18:	border: 2px solid rgb(var(--color-primary-400) / 1);
src/components/Info/Info.scss:34:		background-color: var(--foreground);
src/components/Info/Info.scss:40:		color: var(--background);
src/components/Blanks/Word/Word.scss:23:	background: radial-gradient(circle, var(--chart-2) 0%, transparent 100%);
src/components/Blanks/Word/Word.scss:34:	background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 65%, black), var(--primary));
src/components/Blanks/Word/Word.scss:35:	color: var(--primary-foreground);
src/components/Blanks/Word/Word.scss:117:			box-shadow: 8px 8px 8px color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/Social/Social.scss:24:				color: var(--foreground);
src/components/Social/Social.scss:28:					color: var(--primary);
src/components/Blanks/Blanks.scss:15:	color: var(--primary-foreground);
src/components/Blanks/Blanks.scss:71:				box-shadow: 1px 1px 1px color-mix(in oklab, var(--foreground) 30%, transparent);
src/components/Blanks/Blanks.scss:141:				border: 1px solid var(--border);
src/components/Blanks/Blanks.scss:143:				background: var(--muted); //#f9f9f9;
src/components/Blanks/Blanks.scss:155:			box-shadow: 8px 8px 8px color-mix(in oklab, var(--foreground) 40%, transparent);
src/components/Blanks/Blanks.scss:222:			border: 1px solid var(--border);
src/components/Blanks/Blanks.scss:235:		background: var(--muted); //#f9f9f9; //red; // hsl(0deg, 0%, 90%);
src/components/Blanks/Blanks.scss:236:		border: 1px solid var(--border);
src/components/Blanks/Blanks.scss:252:			border: dashed 1px color-mix(in oklab, var(--border) 80%, transparent);
src/components/Blanks/Blanks.scss:256:				background: radial-gradient(circle, var(--chart-2) 0%, transparent 100%);
src/components/Blanks/Blanks.scss:303:				-3px -3px 3px color-mix(in oklab, var(--foreground) 40%, transparent),
src/components/Blanks/Blanks.scss:304:				-3px 3px 3px color-mix(in oklab, var(--foreground) 40%, transparent),
src/components/Blanks/Blanks.scss:305:				3px 3px 3px color-mix(in oklab, var(--background) 40%, transparent),
src/components/Blanks/Blanks.scss:306:				3px -3px 3px color-mix(in oklab, var(--background) 40%, transparent);
src/components/Blanks/Blanks.scss:315:				border: 1px solid var(--border);
src/components/TreasureGrid/TreasureGrid.scss:24:	background-color: var(--muted);
src/components/TreasureGrid/TreasureGrid.scss:25:	border: 2px solid var(--border);
src/components/TreasureGrid/TreasureGrid.scss:34:	background-color: var(--accent);
src/components/TreasureGrid/TreasureGrid.scss:38:	background-color: color-mix(in oklab, var(--chart-2) 25%, var(--card));
src/components/TreasureGrid/TreasureGrid.scss:39:	border-color: var(--chart-2);
src/components/TreasureGrid/TreasureGrid.scss:47:	color: var(--foreground);
```
