# Typography Audit

Note: This is a historical baseline snapshot (2026-02-11) captured before the typography migration was completed. Current runtime typography uses semantic `--line-height-*` tokens.

Date: 2026-02-11
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Scope
This audit checks where typography is currently controlled across:
- Token source (`src/index.css`)
- Tailwind mapping (`tailwind.config.js`)
- SCSS/CSS declarations (`font-size`, `line-height`)
- JSX Tailwind text utilities (`text-*` classes)

## Executive Summary
- Token definitions exist in one place: `src/index.css` (`--font-size-*`, `--line-height-body` and related semantic line-height tokens).
- Tailwind `fontSize` is mapped to those tokens in `tailwind.config.js`.
- Typography ownership is still split because many SCSS files set hardcoded sizes/line-heights.
- JSX also uses direct utility scales (`text-sm`, `text-base`, etc.), including shadcn UI files.

### Key metrics
- Hardcoded `font-size/line-height` in SCSS/CSS (non-commented): **82** matches.
- Token-based `font-size/line-height` in SCSS/CSS (non-commented): **19** matches.
- JSX lines using Tailwind `text-*` utilities: **33** matches.

## Source-of-Truth Check
Canonical typography tokens are present at:
- `src/index.css:53` to `src/index.css:63`

Tailwind mapping to those tokens is present at:
- `tailwind.config.js:73` to `tailwind.config.js:80`

This confirms the token + mapping foundation exists. The remaining issue is mixed consumption in SCSS + JSX.

## Highest-Risk Typography Hotspots
### 1) Main content instruction sizing
- `src/App.scss:592` to `src/App.scss:598`
- Uses `font-size: var(--font-size-sm)` for `.instructions`.

### 2) InstructionsMedia default style
- `src/components/Section/instructions-media.jsx:4` to `src/components/Section/instructions-media.jsx:7`
- Uses inline `fontSize: 'var(--font-size-sm)'`.

### 3) Info panel text hierarchy
- `src/components/Info/Info.scss:20` and `src/components/Info/Info.scss:49`
- Uses smaller token values for container and list text.

### 4) Modal copy on small screens
- `src/components/ModalLinkDialog/ModalLinkDialog.jsx:30` and `src/components/ModalLinkDialog/ModalLinkDialog.jsx:35`
- Uses `text-base sm:text-lg`, which is intentionally smaller on mobile.

## Distribution of Hardcoded Typography (non-commented)
By file count of hardcoded `font-size/line-height`:

```text
  23 src/App.scss
   7 src/components/MemoryMatchGame/Card/Card.scss
   7 src/components/Blanks/Blanks.scss
   6 src/styles/_mixins.module.scss
   5 src/components/DropDowns/DropDowns.scss
   4 src/components/Footer/Footer.scss
   3 src/components/WordParts/WordParts.scss
   3 src/components/Jigsaw/Jigsaw.scss
   3 src/components/Congratulate/Congratulate.scss
   2 src/components/WordGrid/WordGrid.scss
   2 src/components/RadioQuiz/RadioQuiz.scss
   2 src/components/Form/Select/Select.scss
   2 src/components/ErrorLog/ErrorLog.scss
   2 src/components/CustomComponents_FR/CustomComponents_FR.scss
   2 src/components/CrossWord/CrossWord.scss
   2 src/components/Blanks/Word/Word.scss
   1 src/styles/_variables.module.scss
   1 src/components/TreasureGrid/TreasureGrid.scss
   1 src/components/SequenceAudioController/SequenceAudioController.scss
   1 src/components/ReadAloud/ReadAloud.scss
   1 src/components/MemoryMatchGame/MemoryMatchGame.scss
   1 src/components/Header/Header.scss
   1 src/components/Attribution/Attribution.scss
```

## Distribution of Token-Based Typography in SCSS (non-commented)
By file count of `font-size: var(--font-size-*)` or `line-height: var(--...)`:

```text
   8 src/App.scss
   7 src/components/Info/Info.scss
   3 src/components/MainMenu/MainMenu.scss
   1 src/components/Accordion/Accordion.scss
```

## Distribution of Tailwind Typography Utilities in JSX
By file count of `text-*` utility usage:

```text
   6 src/components/Sortable/Sortable.jsx
   3 src/components/ui/select.jsx
   3 src/components/ModalLinkDialog/ModalLinkDialog.jsx
   2 src/components/ui/table.jsx
   2 src/components/ui/dialog.jsx
   2 src/components/ui/button.jsx
   2 src/components/Section/Section.jsx
   2 src/components/HeroSection/HeroSection.jsx
   1 src/components/ui/tooltip.jsx
   1 src/components/ui/textarea.jsx
   1 src/components/ui/tabs.jsx
   1 src/components/ui/navigation-menu.jsx
   1 src/components/ui/label.jsx
   1 src/components/ui/input.jsx
   1 src/components/ui/card.jsx
   1 src/components/Section/instructions-media.jsx
   1 src/components/MemoryMatchGame/Card/Card.jsx
   1 src/components/Footer/Footer.jsx
   1 src/App.jsx
```

## Font Family Audit
### Fonts declared via `@font-face` (self-hosted)
- `Feijoa Bold` from `/fonts/Feijoa-Bold.otf` (`src/App.scss:9`)
- `Feijoa Medium` from `/fonts/Feijoa-Medium.otf` (`src/App.scss:13`)
- `Feijoa Medium Italic` from `/fonts/Feijoa-MediumItalic.otf` (`src/App.scss:17`)
- `OpenSans Bold` from `/fonts/OpenSans-Bold.ttf` (`src/App.scss:21`)
- `OpenSans Regular` from `/fonts/OpenSans-Regular.ttf` (`src/App.scss:25`)
- `OpenSans SemiBold` from `/fonts/OpenSans-SemiBold.ttf` (`src/App.scss:29`)

### Font tokens configured in `index.css`
- `--font-sans: 'Inter'` (`src/index.css:14`)
- `--font-heading: 'Space Grotesk'` (`src/index.css:15`)
- `--font-mono: 'JetBrains Mono'` (`src/index.css:16`)

### Tailwind font-family mapping
- `sans -> var(--font-sans)` (`tailwind.config.js:71`)
- `heading -> var(--font-heading)` (`tailwind.config.js:68`)
- `mono -> var(--font-mono)` (`tailwind.config.js:69`)

### Active `font-family` declarations found in SCSS/CSS
- OpenSans family variants in:
  - `src/App.scss`
  - `src/components/Footer/Footer.scss`
  - `src/components/Social/Social.scss`
- Feijoa family variants in:
  - `src/App.scss`
- Generic/system families in:
  - `src/styles/_mixins.module.scss` (`Times New Roman`)
  - `src/components/MemoryMatchGame/MemoryMatchGame.scss` (`arial`)
  - `src/components/TreasureGrid/TreasureGrid.scss` (`sans-serif`)

### Important finding
- There are currently two competing font systems:
  1. Legacy/self-hosted fonts (Feijoa/OpenSans) applied directly in SCSS.
  2. Tokenized Tailwind fonts (Inter/Space Grotesk/JetBrains Mono) defined in `index.css` and `tailwind.config.js`.
- This split is a source-of-truth problem similar to font-size conflicts.

### Confirmed migration decision
- Canonical token mapping should be:
  - `--font-sans` => OpenSans
  - `--font-heading` => Feijoa
  - `--font-mono` => JetBrains Mono
- This aligns shadcn/Tailwind typography with brand fonts while keeping mono tokenized and easy to change later.

## Interpretation
- The project already has a tokenized typography foundation.
- The practical conflict comes from many hardcoded SCSS declarations still being active.
- Typography is currently governed by three active channels:
  1. tokenized values (`index.css`)
  2. utility mapping (`tailwind.config.js` + JSX classes)
  3. direct SCSS declarations (often hardcoded)

This is why text can shift unexpectedly after local edits even when token values are unchanged.

## Migration Priority (baby-step order)
1. Convert high-impact content blocks first:
   - `src/App.scss` instruction typography
   - `src/components/Section/instructions-media.jsx`
   - `src/components/Info/Info.scss`
   - `src/components/ModalLinkDialog/ModalLinkDialog.jsx`
2. Replace hardcoded SCSS typography with tokenized utility usage.
3. Keep SCSS for layout and spacing, not text scale.
4. Add a guardrail check to prevent new hardcoded `font-size/line-height` in SCSS.

## Appendix A: Full Hardcoded Typography Matches (non-commented)
```text
src/styles/_mixins.module.scss:56:			line-height: 2rem;
src/styles/_mixins.module.scss:103:				font-size: 1rem;
src/styles/_mixins.module.scss:104:				line-height: 20px;
src/styles/_mixins.module.scss:128:	font-size: 16px;
src/styles/_mixins.module.scss:163:			font-size: 0.7rem; //1rem;
src/styles/_mixins.module.scss:170:				font-size: 1rem;
src/styles/_variables.module.scss:62:$header-footer-font-size: 0.8rem;
src/App.scss:38:	font-size: 16px;
src/App.scss:74:	font-size: 3rem;
src/App.scss:78:	font-size: 2.5rem;
src/App.scss:82:	font-size: 2rem;
src/App.scss:86:	font-size: 1.75rem;
src/App.scss:90:	font-size: 1.5rem;
src/App.scss:94:	font-size: 1.25rem;
src/App.scss:106:		font-size: 0.75rem;
src/App.scss:322:	font-size: 40px;
src/App.scss:325:	line-height: 60px;
src/App.scss:362:	line-height: 1.4em;
src/App.scss:426:		font-size: clamp(4rem, 7.25vw, 5.75rem);
src/App.scss:443:			font-size: clamp(2.4rem, 7.5vw, 3.1rem);
src/App.scss:448:			font-size: clamp(1.6rem, 5.2vw, 2.1rem);
src/App.scss:452:			font-size: 1.6em;
src/App.scss:455:			font-size: 0.9em;
src/App.scss:460:		font-size: 1.8rem;
src/App.scss:463:		font-size: 1.8rem;
src/App.scss:602:		font-size: 0.8rem;
src/App.scss:697:			font-size: clamp(2.2rem, 4vw, 3rem);
src/App.scss:714:			font-size: clamp(2.4rem, 4vw, 3.5rem);
src/App.scss:735:		line-height: 1.6em;
src/App.scss:765:			font-size: 3rem;
src/components/ErrorLog/ErrorLog.scss:89:		font-size: 0.8rem;
src/components/ErrorLog/ErrorLog.scss:126:		font-size: 0.8rem;
src/components/CrossWord/CrossWord.scss:34:		font-size: 2rem;
src/components/CrossWord/CrossWord.scss:93:			font-size: 1rem;
src/components/Header/Header.scss:10:	line-height: 3rem;
src/components/ReadAloud/ReadAloud.scss:37:		font-size: 1.2rem;
src/components/RadioQuiz/RadioQuiz.scss:171:			font-size: 0.8rem;
src/components/RadioQuiz/RadioQuiz.scss:180:				font-size: 1rem;
src/components/WordGrid/WordGrid.scss:61:			font-size: 1rem;
src/components/WordGrid/WordGrid.scss:120:		font-size: 1.4rem;
src/components/WordParts/WordParts.scss:83:		font-size: 1.4rem;
src/components/WordParts/WordParts.scss:136:			font-size: 1.2rem;
src/components/WordParts/WordParts.scss:160:			font-size: 1.4rem;
src/components/DropDowns/DropDowns.scss:79:				font-size: 0.8rem;
src/components/DropDowns/DropDowns.scss:80:				line-height: 1.4rem;
src/components/DropDowns/DropDowns.scss:107:		font-size: 1.4rem;
src/components/DropDowns/DropDowns.scss:162:			font-size: 1rem;
src/components/DropDowns/DropDowns.scss:168:					font-size: 1.2rem;
src/components/TreasureGrid/TreasureGrid.scss:44:	font-size: 1.2rem;
src/components/Jigsaw/Jigsaw.scss:19:		line-height: 1.4em;
src/components/Jigsaw/Jigsaw.scss:46:		font-size: 1.4rem;
src/components/Jigsaw/Jigsaw.scss:87:		font-size: 2rem;
src/components/Footer/Footer.scss:109:			line-height: 26px; /* 162.5% */
src/components/Footer/Footer.scss:110:			font-size: 16px;
src/components/Footer/Footer.scss:139:				font-size: 16px;
src/components/Footer/Footer.scss:142:				font-size: 12px;
src/components/Blanks/Word/Word.scss:37:	font-size: 1.2rem;
src/components/Blanks/Word/Word.scss:39:	line-height: 1.4rem;
src/components/Form/Select/Select.scss:41:		font-size: 1rem;
src/components/Form/Select/Select.scss:54:		font-size: 1rem;
src/components/Blanks/Blanks.scss:45:		line-height: 1.4em;
src/components/Blanks/Blanks.scss:57:		line-height: 0.5rem;
src/components/Blanks/Blanks.scss:99:		font-size: 1.4rem;
src/components/Blanks/Blanks.scss:179:				line-height: 2.6rem;
src/components/Blanks/Blanks.scss:240:		font-size: 1.2rem;
src/components/Blanks/Blanks.scss:310:				font-size: 1rem;
src/components/Blanks/Blanks.scss:356:		line-height: 3.5rem;
src/components/Congratulate/Congratulate.scss:32:	line-height: 60px;
src/components/Congratulate/Congratulate.scss:87:		font-size: 80px;
src/components/Congratulate/Congratulate.scss:88:		line-height: 90px;
src/components/MemoryMatchGame/MemoryMatchGame.scss:51:		font-size: 1rem;
src/components/SequenceAudioController/SequenceAudioController.scss:28:			font-size: 1rem;
src/components/MemoryMatchGame/Card/Card.scss:191:			font-size: 0.8rem;
src/components/MemoryMatchGame/Card/Card.scss:199:			font-size: 0.6rem;
src/components/MemoryMatchGame/Card/Card.scss:207:				font-size: 0.8rem;
src/components/MemoryMatchGame/Card/Card.scss:212:				font-size: 0.7rem;
src/components/MemoryMatchGame/Card/Card.scss:224:				font-size: 0.9rem;
src/components/MemoryMatchGame/Card/Card.scss:231:				font-size: 0.8rem;
src/components/MemoryMatchGame/Card/Card.scss:243:				font-size: 1rem;
src/components/Attribution/Attribution.scss:6:	font-size: 0.5rem;
src/components/CustomComponents_FR/CustomComponents_FR.scss:119:				font-size: 74.6667px;
src/components/CustomComponents_FR/CustomComponents_FR.scss:141:				font-size: 40px;
```

## Appendix B: Full Token-Based Typography Matches (non-commented)
```text
src/App.scss:492:		font-size: var(--font-size-base);
src/App.scss:493:		line-height: var(--body-line-height);
src/App.scss:497:		font-size: var(--font-size-base);
src/App.scss:498:		line-height: var(--body-line-height);
src/App.scss:539:			font-size: var(--font-size-lg);
src/App.scss:542:			font-size: var(--font-size-xl);
src/App.scss:593:		font-size: var(--font-size-sm);
src/App.scss:594:		line-height: var(--body-line-height);
src/components/Info/Info.scss:20:	font-size: var(--font-size-sm);
src/components/Info/Info.scss:21:	line-height: var(--body-line-height);
src/components/Info/Info.scss:25:		font-size: var(--font-size-base);
src/components/Info/Info.scss:49:			font-size: var(--font-size-sm);
src/components/Info/Info.scss:50:			line-height: var(--body-line-height);
src/components/Info/Info.scss:54:				font-size: var(--font-size-base);
src/components/Info/Info.scss:59:				font-size: var(--font-size-sm);
src/components/Accordion/Accordion.scss:9:$header-font-size: var(--font-size-lg);
src/components/MainMenu/MainMenu.scss:75:		font-size: var(--font-size-xl);
src/components/MainMenu/MainMenu.scss:88:		font-size: var(--font-size-lg);
src/components/MainMenu/MainMenu.scss:174:			font-size: var(--font-size-lg);
```

## Appendix C: Full JSX Tailwind `text-*` Matches
```text
src/components/Sortable/Sortable.jsx:253:					`mt-3 text-sm font-medium ${
src/components/Sortable/Sortable.jsx:300:					<CardTitle className="text-base font-semibold">
src/components/Sortable/Sortable.jsx:307:						<p className="mb-4 text-sm">
src/components/Sortable/Sortable.jsx:348:									{allLang1Blank ? null : <div className="flex items-center text-sm">
src/components/Sortable/Sortable.jsx:358:											`sortable-tile flex items-center justify-between text-sm font-medium cursor-ns-resize px-3 py-1 rounded-md border border-dashed border-border transition ${
src/components/Sortable/Sortable.jsx:388:											<span className="text-slate-400 text-lg leading-none">
src/components/Section/Section.jsx:86:						<CardTitle className="text-base [&_h2]:m-0">{/* font-semibold">*/}
src/components/Section/Section.jsx:135:									className={`pb-5 text-sm text-slate-500`}
src/components/Footer/Footer.jsx:86:						<p className="license text-footerText text-xs">
src/App.jsx:1207:											className="cursor-pointer rounded-none border-r border-border/60 px-4 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
src/components/Section/instructions-media.jsx:37:				<figcaption className="text-sm text-muted-foreground text-center">
src/components/ui/label.jsx:8:	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
src/components/ui/navigation-menu.jsx:36:	"group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
src/components/ui/dialog.jsx:54:		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
src/components/ui/dialog.jsx:63:		className={cn("text-sm text-muted-foreground", className)}
src/components/ui/table.jsx:9:			className={cn("w-full caption-bottom text-sm", className)}
src/components/ui/table.jsx:72:		className={cn("mt-4 text-sm text-muted-foreground", className)}
src/components/ui/select.jsx:17:			"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
src/components/ui/select.jsx:77:		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
src/components/ui/select.jsx:86:			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
src/components/ui/input.jsx:10:				"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
src/components/ui/tooltip.jsx:27:					"z-50 overflow-hidden rounded-md border border-border-subtle bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
src/components/ui/card.jsx:32:		className={cn("text-sm text-muted-foreground", className)}
src/components/ui/tabs.jsx:23:			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
src/components/ui/textarea.jsx:9:				"flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
src/components/ui/button.jsx:8:	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
src/components/ui/button.jsx:25:				sm: "h-8 rounded-md px-3 text-xs",
src/components/ModalLinkDialog/ModalLinkDialog.jsx:30:					<DialogTitle className="text-base sm:text-lg">
src/components/ModalLinkDialog/ModalLinkDialog.jsx:35:					<div className="space-y-3 text-base leading-relaxed text-foreground sm:text-lg">
src/components/ModalLinkDialog/ModalLinkDialog.jsx:40:						className="space-y-3 text-base leading-relaxed text-foreground sm:text-lg"
src/components/HeroSection/HeroSection.jsx:37:					<CardTitle className="text-base [&_h2]:m-0">
src/components/HeroSection/HeroSection.jsx:103:										<figcaption className="text-sm text-muted-foreground text-center">
src/components/MemoryMatchGame/Card/Card.jsx:40:					<span className="text-muted-foreground text-xl font-bold">?</span>
```

## Appendix D: Full `@font-face` + `font-family` Matches
```text
src/App.scss:9:@font-face {
src/App.scss:10:	font-family: "Feijoa Bold";
src/App.scss:13:@font-face {
src/App.scss:14:	font-family: "Feijoa Medium";
src/App.scss:17:@font-face {
src/App.scss:18:	font-family: "Feijoa Medium Italic";
src/App.scss:21:@font-face {
src/App.scss:22:	font-family: "OpenSans Bold";
src/App.scss:25:@font-face {
src/App.scss:26:	font-family: "OpenSans Regular";
src/App.scss:29:@font-face {
src/App.scss:30:	font-family: "OpenSans SemiBold";
src/App.scss:37:	font-family: "OpenSans Regular", sans-serif;
src/App.scss:46:	font-family: "Feijoa Bold", times-roman;
src/App.scss:51:	font-family: "Feijoa Medium", times-roman;
src/App.scss:55:	font-family: "OpenSans SemiBold", sans-serif;
src/App.scss:105:		font-family: "OpenSans Regular", sans-serif;
src/components/Footer/Footer.scss:13:		font-family: "OpenSans SemiBold", sans-serif;
src/components/Footer/Footer.scss:106:			font-family: "OpenSans Regular", sans-serif;
src/components/Footer/Footer.scss:114:				font-family: "OpenSans SemiBold", sans-serif;
src/components/Footer/Footer.scss:145:				font-family: "OpenSans Regular", sans-serif;
src/components/TreasureGrid/TreasureGrid.scss:9:	font-family: sans-serif;
src/components/MemoryMatchGame/MemoryMatchGame.scss:50:		font-family: arial;
src/styles/_mixins.module.scss:105:				font-family: "Times New Roman", Times, serif;
src/components/CustomComponents_FR/CustomComponents_FR.scss:120:				// font-family: Arial;
src/components/Social/Social.scss:12:		font-family: "OpenSans Regular", sans-serif;
```

## Appendix E: Font Token + Tailwind Font Mapping Matches
```text
14:		--font-sans: 'Inter';
15:		--font-heading: 'Space Grotesk';
16:		--font-mono: 'JetBrains Mono';
67:			fontFamily: {
68:				heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
69:				mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
71:				sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
```
