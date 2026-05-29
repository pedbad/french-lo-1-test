# Theme Architecture — Style System Guide

This document explains how CSS, Tailwind, and shadcn interact in this project,
what the current state of the style system is, and the baby-step plan to unify it.
It also defines the token naming convention for all future Language Centre projects.

---

## 1. How the Style System Works

### The Big Picture

```
┌──────────────────────────────────────────────────────────────┐
│                        YOUR BROWSER                          │
│  Sees ONE compiled CSS file + React components in the DOM    │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │  compiled output
┌──────────────────────────────────────────────────────────────┐
│                         VITE BUILD                           │
│  Reads src/index.css → runs Tailwind v4 compiler             │
│  Output: dist/src/main.css                                   │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │  source
┌──────────────────────────────────────────────────────────────┐
│                      src/index.css                           │
│              (the single CSS entry point)                    │
│                                                              │
│  @import "tailwindcss"          ← pulls in Tailwind v4       │
│  @config "../tailwind.config.js"← your Tailwind config       │
│  @plugin "tailwindcss-animate"  ← animation plugin          │
│  @layer base { :root { ... } }  ← your CSS variables        │
│  @layer components { ... }      ← your component classes    │
│  @layer utilities { ... }       ← utility overrides         │
└──────────────────────────────────────────────────────────────┘
```

### How Tailwind v4 Works

This project uses **Tailwind v4**, which is different from v3.

In v4, Tailwind is imported directly into CSS (not a PostCSS plugin).
It scans your JSX/TSX/JS source files at build time, finds every class name
used, and generates only the CSS rules that are actually needed.

```
src/index.css
    │
    ├── @import "tailwindcss"
    │       └── scans src/**/*.{jsx,tsx,js,ts} for class names
    │           generates: .bg-background { background-color: var(--background) }
    │                      .text-foreground { color: var(--foreground) }
    │                      ... only classes you actually use
    │
    └── @config "../tailwind.config.js"
            └── extends Tailwind's theme:
                - custom colour aliases (background, foreground, text.*, border.*)
                - custom font families (sans, heading, mono)
                - custom font sizes mapped to CSS variables
                - animation keyframes
```

### How shadcn Fits In

shadcn is **not an installed library**. It is a code generator.
When you run `npx shadcn add button`, it copies source files into
`src/components/ui/`. You own those files completely — you can edit them freely.

```
shadcn CLI
    │
    └── copies source into src/components/ui/
            ├── button.jsx        ← you own this
            ├── dialog.jsx        ← you own this
            └── ...

Each component uses:
    ┌─────────────────────────────────────────────────────┐
    │  Radix UI primitive  — behaviour (keyboard, ARIA)   │
    │  Tailwind classes    — visual styling               │
    │  cn() utility        — merges class names safely    │
    │  CSS variables       — --primary, --background, etc.│
    └─────────────────────────────────────────────────────┘
```

A shadcn `Button` looks like this internally:

```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 ...">
```

`bg-primary` → Tailwind resolves → `background-color: var(--primary)` →
browser reads `--primary` from `:root` → `oklch(0.205 0 0)` (near-black in light).

### The Full Style Resolution Chain

When a component renders, here is what happens for every colour:

```
JSX: className="bg-primary text-foreground border-border"
         │
         ▼
Tailwind generates:
    .bg-primary      { background-color: var(--primary) }
    .text-foreground { color: var(--foreground) }
    .border-border   { border-color: var(--border) }
         │
         ▼
Browser resolves CSS variables from :root (src/index.css):
    --primary    = oklch(0.205 0 0)   ← near-black  (light mode)
    --foreground = oklch(0.145 0 0)   ← near-black  (light mode)
    --border     = oklch(0.922 0 0)   ← light grey  (light mode)
         │
         ▼
.dark class present on <html>?
    --primary    = oklch(0.922 0 0)   ← near-white  (dark mode)
    --foreground = oklch(0.985 0 0)   ← near-white  (dark mode)
```

### The cn() Utility

Every shadcn component uses a `cn()` helper (`src/lib/utils.js`):

```js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

This lets you safely override shadcn defaults from outside:

```jsx
<Button className="bg-[var(--brand-primary)]">   // overrides bg-primary cleanly
```

`tailwind-merge` ensures conflicting Tailwind classes don't stack —
the last one wins cleanly without specificity fights.

---

## 2. Where Your Tokens Currently Live

All tokens are in one big `:root` block in `src/index.css`.
Four unrelated groups share the same space:

```
src/index.css  @layer base  :root {

  ┌─ shadcn defaults (System B — oklch) ───────────────────────┐
  │  --primary: oklch(0.205 0 0)                                │
  │  --background: oklch(1 0 0)                                 │
  │  --card, --popover, --muted, --accent ...                   │
  │  --chart-1 ... --chart-5                                    │
  │  --destructive, --border, --input, --ring                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─ Legacy RGB system (System A) ─────────────────────────────┐
  │  --color-primary-400: 96 165 250    ← generic blue          │
  │  --color-surface-base: 255 229 169  ← warm cream            │
  │  --color-text-primary: 15 23 42     ← dark slate            │
  │  --color-border-subtle, --color-border-default ...          │
  └─────────────────────────────────────────────────────────────┘

  ┌─ Brand tokens (no system — mixed in by hand) ───────────────┐
  │  --page-background: oklch(0.976 0.023 90.7)  ← warm cream   │
  │  --hero-title-color: oklch(0.612 0.130 160.6) ← brand teal  │
  │  --footer-background: oklch(0.851 0.089 178.8)              │
  └─────────────────────────────────────────────────────────────┘

  ┌─ Educational semantic tokens ───────────────────────────────┐
  │  --edu-affirm: var(--chart-2)      ← green                  │
  │  --edu-warn:   var(--chart-1)      ← amber                  │
  │  --edu-neg:    var(--destructive)  ← red                    │
  │  --edu-neutral, --edu-accent                                 │
  └─────────────────────────────────────────────────────────────┘
}
```

---

## 3. Current Drift Problems

### Problem 1 — Two parallel colour systems that never meet

System A (RGB triples) and System B (shadcn oklch) coexist but never reference
each other. `bg-background` in a shadcn component resolves differently from
`bg-background` mapped in tailwind.config.js because they point to different
variables. Currently they happen to look similar — but they are two separate
definitions of the same concept.

### Problem 2 — `--primary` is not your brand primary

shadcn's `--primary` = near-black (light) / near-white (dark).
Your brand primary (Language Centre teal-green) lives at `--hero-title-color`.
When a developer writes `text-primary` they get near-black, not brand teal.
The real brand colour is named after where it is used, not what it is.

### Problem 3 — `--color-primary-*` is generic blue, not LC brand

The "primary" colour scale (`--color-primary-400: 96 165 250`) is Tailwind's
default blue. It drives the nav active/highlight state. Your brand colour is
teal-green, not blue. The nav currently uses an off-brand colour.

### Problem 4 — `--chart-*` doing semantic work (fragile)

```css
--edu-affirm: var(--chart-2);   /* fragile: shadcn owns this value */
--edu-warn:   var(--chart-1);   /* already broke: remapped to blue in dark */
```

shadcn already remapped `--chart-1` to blue in dark mode, forcing a patch.
If shadcn updates chart colours again, your feedback colours shift silently.

### Problem 5 — Safelist hardcodes bypass the token system

```js
safelist: ["bg-amber-300/90", "text-amber-950", "ring-amber-400/80" ...]
```

Raw Tailwind palette classes. Disconnected from `--edu-warn`. If the brand
warn colour changes, these don't update.

### Problem 6 — `highlight-flash` keyframe has hardcoded RGB

```js
backgroundColor: "rgb(252 211 77 / 0.9)"   // should be var(--edu-warn)
```

Animation colour is disconnected from the token system.

---

## 4. Token Naming Convention (All Future Projects)

Use four clear layers. Each layer has a fixed prefix so any developer
immediately knows what layer a token belongs to.

### Layer 1 — `--palette-*` Raw colour values

Actual colour values. Named by hue and shade. Never used directly
in components — only referenced by higher layers.
The designer provides these values.

```css
--palette-teal-50:   oklch(0.97  0.02  178);
--palette-teal-300:  oklch(0.78  0.07  170);
--palette-teal-500:  oklch(0.612 0.130 160.6);
--palette-teal-700:  oklch(0.44  0.10  165);

--palette-gold-50:   oklch(0.976 0.023  90.7);
--palette-gold-200:  oklch(0.930 0.055  88);
--palette-gold-400:  oklch(0.851 0.089 178.8);

--palette-neutral-50:  oklch(0.985 0 0);
--palette-neutral-900: oklch(0.145 0 0);
```

### Layer 2 — `--brand-*` Brand semantic tokens

Maps palette values to brand roles. One file per course/project.
The designer fills this in from the design spec.

```css
/* theme-lc-french.css — designer gives you this file */
[data-theme="lc-french"] {
  --brand-primary:        var(--palette-teal-500);
  --brand-primary-light:  var(--palette-teal-300);
  --brand-primary-dark:   var(--palette-teal-700);
  --brand-surface:        var(--palette-gold-50);
  --brand-surface-alt:    var(--palette-gold-200);
  --brand-footer:         var(--palette-gold-400);

  --brand-font-heading:       'Feijoa Medium', serif;
  --brand-font-heading-bold:  'Feijoa Bold', serif;
  --brand-font-body:          'OpenSans Regular', sans-serif;
  --brand-font-body-semi:     'OpenSans SemiBold', sans-serif;
  --brand-font-body-bold:     'OpenSans Bold', sans-serif;
}
```

### Layer 3 — UI role tokens

Maps brand tokens to UI component roles. Shared across all LOs.
The developer writes these. They never contain raw colour values.

```css
/* tokens.css — developer writes this, consumes brand layer */
:root {
  --page-background:    var(--brand-surface);
  --hero-title-color:   var(--brand-primary);
  --nav-active-color:   var(--brand-primary);
  --footer-background:  var(--brand-footer);

  --font-heading:       var(--brand-font-heading);
  --font-heading-bold:  var(--brand-font-heading-bold);
  --font-sans:          var(--brand-font-body);
  --font-sans-semi:     var(--brand-font-body-semi);
  --font-sans-bold:     var(--brand-font-body-bold);
}
```

### Layer 4 — `--edu-*` Educational semantic tokens

Describes the role of a colour in learning content. Course-neutral and
brand-neutral. Pinned to own fixed values — never references `--chart-*`.

```css
/* Educational state colours — never reference --chart-* directly */
--edu-affirm:  oklch(0.6   0.118 184.7);  /* correct / success / positive  */
--edu-warn:    oklch(0.646 0.222  41.1);  /* caution / hint / amber CTA     */
--edu-neg:     oklch(0.577 0.245  27.3);  /* wrong / error / negative       */
--edu-neutral: oklch(0.556 0     0);      /* secondary text / inactive      */
--edu-accent:  oklch(0.205 0     0);      /* highlighted term / emphasis    */
```

### Summary Table

| Prefix | Layer | Who sets it | Example |
|---|---|---|---|
| `--palette-*` | Raw values | Designer | `--palette-teal-500` |
| `--brand-*` | Brand semantic | Designer + dev | `--brand-primary` |
| *(no prefix)* | UI role | Developer | `--page-background` |
| `--edu-*` | Educational state | Developer | `--edu-warn` |
| `--primary` etc. | shadcn system | shadcn (do not rename) | `--primary` |

> **Rule:** Never use `--palette-*` tokens directly in a component.
> Always go through `--brand-*` or a named UI role token.
> Never use `--chart-*` tokens for semantic educational states — use `--edu-*`.

---

## 5. The Ideal Future File Structure

```
src/
  styles/
    palette-lc.css          ← Layer 1: empty placeholder — reserved for a future --palette-* system
    theme-lc-french.css     ← Layer 2: brand tokens (--brand-*); the ONLY file swapped to re-skin
    tokens.css              ← Layer 3: UI role tokens (shared, never raw values)
    fonts.css               ← @font-face declarations
  index.css                 ← entry point: @import all above + Tailwind
```

To re-skin for a new course (e.g. Spanish):
1. Designer provides 4 brand colour oklch values (primary, secondary, tertiary, quaternary) + any new font files
2. Developer creates `theme-lc-spanish.css` with those 4 `--brand-*` slots
3. Developer updates the `@import` in `index.css` to point to the new theme file
4. Zero component or token changes required

> `palette-lc.css` is **not** where the developer puts values. It is an intentionally empty
> placeholder reserved for a future `--palette-*` raw value system that has not yet been
> implemented. All brand colour values live directly in `theme-lc-[language].css`.

---

## 6. Baby Steps — Current Project Cleanup Checklist

Work through these in order. Each step is safe to commit independently.
Do not skip steps — each one unlocks the next.

### Step 1 — Pin `--edu-*` to own values, remove `--chart-*` dependency ✅ priority: high / risk: low

Currently `--edu-affirm`, `--edu-warn`, `--edu-neg` delegate to shadcn's
`--chart-*` tokens. shadcn already broke this once (chart-1 → blue in dark).

- [x] Replace `--edu-affirm: var(--chart-2)` with pinned oklch value
- [x] Replace `--edu-warn: var(--chart-1)` with pinned oklch value
- [x] Replace `--edu-neg: var(--destructive)` with pinned oklch value
- [x] Replace `--edu-neutral: var(--muted-foreground)` with pinned oklch value
- [x] Replace `--edu-accent: var(--primary)` with pinned oklch value
- [x] Remove the dark-mode `--edu-warn: var(--chart-5)` patch (no longer needed)
- [x] Update comments to reflect that edu tokens are now self-contained

> Values stay visually identical — this is a dependency cut, not a design change.

---

### Step 2 — Fix `highlight-flash` keyframe to use a token ✅ priority: high / risk: low

The flash animation uses hardcoded RGB amber, disconnected from `--edu-warn`.

- [x] Add `--highlight-active-bg` token to `:root` pointing at `--edu-warn`
- [x] Replace `rgb(252 211 77 / 0.9)` in keyframe with `var(--highlight-active-bg)`
- [x] Replace `rgb(251 191 36 / 0.4)` box-shadow with token equivalent
- [x] Update dark mode override for `--highlight-active-bg` if needed

> Completed as part of Step 1 (d641ea1). All flash keyframes (`anchor-flash`,
> `modal-highlight-flash`) already use `var(--edu-warn)` with `color-mix()`.
> No separate `--highlight-active-bg` intermediate token was needed — direct
> `var(--edu-warn)` references are cleaner. `--color-traffic-amber` is declared
> but unused and will be removed in Step 7 with the rest of the legacy RGB system.

---

### Step 3 — Fix safelist hardcodes ✅ priority: medium / risk: low

Safelist classes bypass the token system and will go stale.

- [x] Identify where `bg-amber-300/90`, `text-amber-950`, `ring-amber-400/80` are applied
- [x] Replace with token-based Tailwind classes or inline CSS variable references
- [x] Remove the raw palette entries from `tailwind.config.js` safelist

> `text-amber-950` was used in `ModalLinkDialog.jsx`, `about-me-grammar.jsx`,
> and `first-contact-grammar.jsx` — replaced with `text-[var(--edu-accent)]`.
> `bg-amber-300/90`, `ring-amber-400/80`, and `animate-highlight-flash` were
> dead (no production usage) — removed from safelist directly.
> Also removed dead `--color-traffic-*` variables (red/amber/green) that were
> declared since day one but never consumed by any component.

---

### Step 4 — Replace nav blue with brand teal ✅ priority: medium / risk: low-medium

The nav active/highlight state uses `--color-primary-400` (generic blue).
The brand colour is teal-green.

- [x] Identify all uses of `rgb(var(--color-primary-400))` in nav CSS
- [x] Add a named UI role token: `--nav-active-color`
- [x] Set `--nav-active-color: var(--hero-title-color)` (brand teal, for now)
- [x] Replace all `rgb(var(--color-primary-400))` nav references with `var(--nav-active-color)`
- [x] Verify nav active/hover state visually in light and dark mode

> 14 nav CSS references replaced across desktop hover/active, mobile highlight,
> and dark-mode overrides in `src/index.css`. `--nav-active-color` added to the
> custom accents block in `:root` (light mode only — dark mode inherits it naturally
> since `--hero-title-color` is the same in both modes). A "Nav Tokens" section
> was added to the debug sandbox above "Modal Link Tokens" to inspect the token
> chain (`--nav-active-color → --hero-title-color → oklch(0.612 0.130 160.6)`)
> without triggering the `.main-menu { position: fixed }` viewport escape.

---

### Step 5 — Introduce `--brand-*` tokens for the three core brand values ✅ priority: medium / risk: low

Give the three existing brand values proper names so they form a coherent layer.

- [x] Add `--brand-primary` to `theme-lc-french.css`
- [x] Add `--brand-secondary` (page surface), `--brand-tertiary` (footer), `--brand-quaternary` (deep variant) to `theme-lc-french.css`
- [x] Add `--brand-surface: var(--brand-secondary)` and `--brand-footer: var(--brand-tertiary)` role aliases to `tokens.css`
- [x] Update `--hero-title-color` / `--page-background` / `--footer-background` / `--nav-active-color` to reference brand tokens
- [x] Add matching dark mode overrides for `--brand-*` tokens in `theme-lc-french.css`

> Brand layer lives in `src/styles/theme-lc-french.css`. Four named slots:
> `--brand-primary` (teal), `--brand-secondary` (warm cream bg), `--brand-tertiary`
> (muted teal footer), `--brand-quaternary` (deep teal, reserved). Dark mode overrides
> `--brand-secondary` → `var(--background)` and `--brand-tertiary` → `var(--sidebar)`;
> primary and quaternary are unchanged. Role aliases `--brand-surface` and
> `--brand-footer` live in `tokens.css` so UI role tokens can resolve through them
> without raw values. All four UI role tokens cascade through the brand layer.

---

### Step 6 — Split `index.css` into separate files ✅ priority: medium / risk: medium

Move the four token groups out of one giant `:root` block into their own files.

- [x] Create `src/styles/palette-lc.css` — raw LC colour values (`--palette-*`)
- [x] Create `src/styles/theme-lc-french.css` — brand tokens (`--brand-*`)
- [x] Create `src/styles/tokens.css` — UI role tokens (no raw values)
- [x] Move `src/styles/fonts.css` content to align with new structure
- [x] Update `src/index.css` to `@import` the new files in order:
      palette → theme → tokens → fonts
- [x] Verify build passes and no visual change

> Three new files created under `src/styles/`. `index.css` now imports them in
> the correct cascade order: palette → theme → tokens → fonts. The entire `:root`
> and `.dark` token declaration blocks (≈12,000 chars) were removed from
> `index.css`; only utility classes and component styles remain there.
> `fonts.css` JS imports removed from `main.jsx` and `sandbox-main.jsx` —
> `index.css` is now the single CSS entry point for both app and debug builds.
> Build passes. Zero visual change.

---

### Step 7 — Retire `--color-primary-*` RGB system ✅ priority: medium / risk: medium

The legacy RGB triple system (`--color-primary-*`, `--color-surface-*`, etc.)
predates the brand token layer. Once Step 5 and 6 are done, replace it.

- [x] Audit all uses of `rgb(var(--color-*))` in `index.css`
- [x] Replace each with the equivalent brand or UI role token from Step 5/6
- [x] Remove legacy `--color-*` variable declarations
- [x] Update `tailwind.config.js` `buildPalette` references
- [x] Verify build and visual parity

> All nine utility class definitions updated to consume shadcn tokens directly
> (`var(--page-background)`, `var(--card)`, `var(--foreground)`, `var(--border)`, etc.).
> Five component CSS rules in `index.css` updated: accordion-card-content, pronunciation
> h3 border, abbreviations background, and `lo6-reference-audio-card` hover state.
> Five JSX files updated (`alert.jsx`, `SortableWordCard.jsx`, `Card.jsx` in
> MemoryMatchGame, `LineMatch.jsx`, `LandingPage.jsx`) — all `rgb(var(--color-*))` 
> arbitrary values replaced with `oklch(from var(--brand-primary) l c h / α)` for
> tinted borders/icons or `color-mix(in oklab, var(--brand-primary) X%, var(--card))`
> for surface fills. `src/styles/palette-lc.css` cleared to a comment-only file.
> `buildPalette` helper and `primary/secondary/tertiary` scales removed from
> `tailwind.config.js` — done as part of Step 8.

---

### Step 8 — Wire `tailwind.config.js` to token variables only ✅ priority: low / risk: medium

The Tailwind config should map to CSS variables, never to raw values.

- [x] Replace `buildPalette('primary')` with direct `--brand-primary` mappings
- [x] Remove or replace the `secondary` and `tertiary` buildPalette calls
- [x] Confirm all Tailwind colour aliases (`background`, `foreground`, etc.)
      point to the correct token variables from Step 6
- [x] Document in config comments which token each alias maps to

> Completed alongside Step 7. `buildPalette` function removed. `primary`,
> `secondary`, `tertiary` colour scales removed (no JSX used the generated
> `primary-50`, `primary-400` etc. Tailwind classes — all relied on arbitrary
> values which are now updated). All remaining colour aliases (`background`,
> `foreground`, `border.*`, `surface.*`, `text.*`) now use CSS relative colour
> syntax `oklch(from var(--TOKEN) l c h / <alpha-value>)` so opacity modifiers
> (e.g. `bg-surface-elevated/70`, `border-border-subtle/70`) continue to work.

---

### Step 9 — Document `--primary` vs `--brand-primary` ✅ priority: low / risk: none

shadcn's `--primary` (near-black) and your `--brand-primary` (teal) coexist.
Changing shadcn's `--primary` to match your brand teal is a large change
that affects every shadcn component. For now, document the intentional split.

- [x] Add a comment block in `index.css` (import-block header) explaining the separation:
      `--primary` = shadcn UI system (button fills, active controls)
      `--brand-primary` = Language Centre teal (hero, nav, footer accents)
- [x] Add item 21 to FUTURE_PROJECTS.md "What To Avoid": on new projects, override
      `--primary` to equal `var(--brand-primary)` from day one unless there is a deliberate
      reason to keep them different.

---

### Step 10 — Token naming audit: semantic --ex-*, --shadow-*, component tokens ✅

Systematic rename to eliminate raw `--chart-*` references from exercise code and
add purpose-built token groups for exercise interaction, depth, buttons, modal,
audio, and content accent colours.

- [x] Retire `--chart-2/3/4/5` from all exercise CSS and JSX; replaced with pinned `--ex-*` tokens.
      `shadcn` remaps chart-3 → amber-orange and chart-4 → vivid purple in dark mode —
      this caused visual bugs (shadow boxes turned orange; selected state turned purple).
- [x] Add **Section D** to `tokens.css`: `--ex-neutral`, `--ex-active`, `--ex-revealed`
      — pinned oklch in light and dark; dark overrides: neutral grey, warm gold, warm gold.
- [x] Add **depth shadow tokens**: `--shadow-sm/md/lg/xl` consuming `--ex-neutral`.
- [x] Expand accordion tokens: `--accordion-bg`, `--accordion-bg-hover`, `--accordion-border`,
      `--accordion-header-font`, `--accordion-text` (replaces lone `--accordion-mist`).
      `--accordion-mist` kept as deprecated alias pointing to `--accordion-bg`.
- [x] Add **Section E** (component tokens): buttons (`--btn-primary-*`, `--btn-secondary-*`),
      modal (`--modal-border`, `--modal-overlay`), audio (`--audio-track/fill/icon`),
      word typography (`--font-size-word-xs/sm/md/lg`).
- [x] Add **Section F** (content accent): `--content-accent-red/orange/yellow/green/blue/indigo/violet`
      replacing the old `--poem-accent-*` names. Backward-compat aliases kept.
- [x] Rename CSS classes in `index.css`:
      `.btn-chart-2` → `.btn-ex-affirm` (green affirm; uses `--edu-affirm`),
      `.btn-hero-title` → `.btn-ex-action` (warm gold action; uses `--ex-active`),
      `.text-stroke-chart-3` → `.text-stroke-neutral`.
- [x] Fix `--footer-hover-color` dark mode: was `var(--chart-4)` (purple) / `var(--chart-3)`
      (amber); now `var(--ex-active)` in both dark contexts.
- [x] Update `exerciseActionButtonVariants.js` tone mapping to new class names.
- [x] Update 21 files: `App.jsx`, 12 exercise components, 2 debug files, `index.css`,
      `theme-lc-french.css`, `tokens.css`, `exerciseActionButtonVariants.js`.

> **`--ex-neutral`** is the key fix: in dark mode it resolves to neutral grey
> `oklch(0.556 0 0)` instead of the amber-orange that `--chart-3` becomes.
> **`--ex-revealed`** (warm gold) fixes the dark-mode "selected" state that turned
> purple via `--chart-4`. **`--ex-active`** (warm amber-gold, same value in both
> modes) replaces `--chart-5` for drag handles and active connectors.
> The `--edu-affirm` token (pinned green, already existing) now handles all
> correct-state colouring previously done with `--chart-2` — same value, better name.

---

## 7. Designer Handoff Checklist (Future Projects)

When a designer provides specs for a new language course, they should supply:

```
Colours (all four slots are independent — they are not computed from each other):
  --brand-primary    main accent (nav active, hero title, exercise highlights): ______
  --brand-secondary  page background surface:                                   ______
  --brand-tertiary   footer surface:                                            ______
  --brand-quaternary deep variant / reserved (optional):                        ______

  Dark mode — only provide overrides where light value is unsuitable:
  --brand-primary in dark mode (if different):                                  ______
  --brand-secondary in dark mode (if different from shadcn --background):       ______
  --brand-tertiary in dark mode (if different from shadcn --sidebar):           ______

Fonts:
  Heading font name + weights:                 _____________
  Body font name + weights:                    _____________
  Monospace font (if any):                     _____________

Font sizes (or confirm use of existing scale):
  Base body size:                              _____________
  Heading sizes:                               _____________
```

Developer takes this sheet and populates:

1. **`src/styles/theme-lc-[course].css`** — four `--brand-*` oklch values (the only file that changes for a re-skin)
2. **`src/styles/fonts.css`** — new `@font-face` declarations if different fonts
3. `src/styles/palette-lc.css` — currently an empty placeholder; reserved for a future raw `--palette-*` system if needed

`tokens.css` defines the role aliases (`--brand-surface`, `--brand-footer`) and all UI role tokens — **never edit tokens.css for a re-skin**.

Zero component files change. The app repaints automatically.
