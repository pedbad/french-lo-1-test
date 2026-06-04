# Tailwind CSS v4 Compliance — French LO Project

Rules, known debt, and fixed violations for this codebase.
For the full v4 reference see the global skill: `~/.claude/skills/tailwind.md`.

---

## Golden Rules

1. **Never use `!` (important)** — always a band-aid. Find the unlayered rule and layer it.
2. **All hand-written CSS must live in a `@layer`** — unlayered CSS beats every Tailwind utility.
3. **Never reuse layout-specific IDs/classes in a different context** — causes a cascade of overrides.
4. **CSS variable utilities**: use `text-(--token)` not `text-[var(--token)]` (both work, parens is idiomatic v4).
5. **Reusable component classes**: prefer `@utility` over `@layer components`.

---

## Cascade Layer Fix Pattern

When a utility "doesn't work":
```css
/* Before (unlayered — beats utilities) */
#content h2 { color: var(--foreground); }

/* After (layered — utilities win) */
@layer base {
  #content h2 { color: var(--foreground); }
}
```

---

## Fixes Applied (session 2026-06)

| Rule | Location | Fix |
|---|---|---|
| `#content :where(p,li,td,th…) { font-size }` | `src/index.css` | Wrapped in `@layer base` |
| `#content a { color }` | `src/index.css` | Wrapped in `@layer base` |
| `#content h1/h2/h3/h4 { color }` | `src/index.css` | Wrapped in `@layer base` |
| `!` band-aids × 5 in landing header | `LandingPage.jsx` | Replaced `id="hero"` / `.hero-title` with clean classes |
| `!text-[var()]` / `!m-0` on card h3 | `LandingPage.jsx` | Removed — layered rules let utilities win cleanly |

---

## Known Debt (not yet fixed)

| Issue | Scale | Risk | Action |
|---|---|---|---|
| Unlayered `#content .<class>` rules | ~61 | **Low** — class-scoped, won't hijack arbitrary utilities | Layer on demand (only when you add a utility to that specific class and it loses) |
| Unlayered bare-element rules | ✅ 0 | Fixed | `p/li/td`, `a`, `h1-h4` all layered |
| Hardcoded `px`/`rem` values | ~116 | Low | Consider `@theme` tokens only where values are reused |
| `!list-none !p-0` in grammar custom components | 3 | Low | Find + layer the `ul` rule when editing those components |
| `text-[var(--font-size-*)]` arbitrary sizes (now `length:`-hinted) | 41 | Low (works) | Migrate type scale to `@theme` `text-fs-*`; needs per-usage audit vs raw `text-base` (collision) |

### Why the 61 class-scoped rules are low risk

The 3 rules we fixed (`#content :where(p,li,td)`, `#content a`, `#content h1-h4`) were dangerous because they targeted **bare HTML elements** — any utility on any `<p>` or `<h2>` anywhere inside `#content` silently lost.

The remaining 61 target **specific component classes** (`.information`, `.inline-icon-*`, `.word-spot-container`, `.intro`, etc.). A utility on `<div className="text-brand">` won't match `#content .information` unless it also carries that class. So there's no silent utility loss unless you're adding utilities *to those specific classes* — in which case just layer that one rule at that moment.

**The fix-on-demand rule:** if `yarn dev` + DevTools shows a utility losing, check if the winning rule is unlayered, wrap it. Don't pre-emptively layer all 61.

### Future projects: how to avoid this debt entirely

In new projects — no layering debt from day one:

```css
/* ✅ Everything in a layer from the start */
@import "tailwindcss";

@layer base {
  /* Element defaults that authored content (no classes) should inherit */
  #content :where(p, li, td, th) { font-size: var(--font-size-base); }
  #content a { color: var(--primary); text-decoration: underline; }
  #content :where(h1,h2,h3,h4) { color: var(--foreground); }
}

@layer components {
  /* Component classes */
  .information { ... }
  .inline-icon { ... }
}

@utility skip-link { ... }   /* Custom utilities */
```

Result: utilities always win, zero `!` needed anywhere.

---

## How to Fix the Remaining `!` Violations

1. Find the offending element in DevTools → Styles panel
2. Look for the rule that wins — note if it has `@layer` prefix
3. If unlayered: find it in `src/index.css`, wrap in `@layer base`
4. Remove the `!` from the JSX

---

## What NOT to Do

```jsx
{/* ❌ band-aid — hides the real problem */}
<h2 className="text-brand!">

{/* ❌ reusing layout-specific IDs in a different context */}
<header id="hero" className="!mt-0 !aspect-auto !min-h-0 ...">

{/* ✅ correct — utility wins because the rule is layered */}
<h2 className="text-(--brand-quaternary)">

{/* ✅ correct — fresh class with no inherited baggage */}
<header className="border-b px-6 py-6">
```

---

## Future Projects Checklist

Before writing any CSS for a new React + Tailwind v4 + shadcn project:

- [ ] All custom CSS goes in `@layer base`, `@layer components`, or `@utility` — never unlayered
- [ ] No `!` utilities anywhere in JSX
- [ ] CSS variable tokens: `text-(--token)` syntax
- [ ] Register the type scale (font sizes) in `@theme` as named `text-fs-*` utilities — NEVER `text-[var(--font-size-*)]` (size-valued vars parse as color)
- [ ] Never reuse a heavily-styled ID/class outside its intended context
- [ ] Run a quick grep before PRs: `grep -r "className.*!"` should return zero

---

## Arbitrary font-size vars silently parsed as `color` (fixed 2026-06-04)

### Symptom
Landing intro `<p>` ignored `text-(--brand-quaternary)` and rendered near-black, while the sibling `<h2>` with the **same** color class rendered teal.

### Root cause
The `<p>` also carried `text-[var(--font-size-base)]`. In Tailwind v4 a bracket utility holding a **bare `var()`** is type-ambiguous — `text-[…]` can mean font-size OR color. Tailwind guessed **color** and emitted `color: var(--font-size-base)`. A length is an invalid color → the browser drops the declaration → the text falls back to inherited `--foreground` (near-black).

Wherever the intended color *was* foreground/black, the bug was **invisible**. It only surfaced where a custom color (brand teal, `--edu-affirm` hover green) shared the element. That is why it survived the "extensive" refactor: no build error, no console warning, no lint failure, visually identical on all default-colored text. A Tailwind-version check confirms v4 but cannot catch a semantic mis-parse.

### Stopgap fix (APPLIED — 41 sites, 19 files)
Add the `length:` data-type hint so Tailwind stops guessing:
```
text-[var(--font-size-base)]            ❌ ambiguous → parsed as color
text-[length:var(--font-size-base)]     ✅ forced to font-size
```
GOTCHA: the parens shorthand `text-(--font-size-base)` has the **same** ambiguity (also defaults to color). Any size-valued var needs the hint — `text-(length:--font-size-base)` or the bracket `length:` form. Rule #4 ("use `text-(--token)`") is for **color** tokens only.

### Proper fix (PENDING — see Known Debt)
Register the type scale in `@theme` and use named utilities — no brackets, no ambiguity:
```css
@theme {
  --text-fs-xs:   0.85rem;
  --text-fs-sm:   1rem;
  --text-fs-base: 1.15rem;
  --text-fs-lg:   1.35rem;
  --text-fs-xl:   1.6rem;
}
/* → text-fs-base, text-fs-lg, … */
```

### WHY IT IS NOT A MECHANICAL SWAP — name collision
The project scale does **not** match Tailwind defaults:

| token | project value | TW default same name |
|---|---|---|
| `--font-size-sm`   | **1rem**   | 0.875rem |
| `--font-size-base` | **1.15rem**| 1rem |
| `--font-size-lg`   | **1.35rem**| 1.125rem |

The codebase ALSO uses raw `text-base` / `md:text-base` (TW defaults) in many exercises. So you **cannot** name the tokens `--text-base`/`--text-sm`/`--text-lg` in `@theme` — that would silently resize every existing default `text-base` (1rem → 1.15rem) and regress dozens of components. Either:
- use a **distinct prefix** (`--text-fs-*`), OR
- first **audit and converge** every raw `text-base`/`text-sm`/`text-lg` usage onto the project scale, then claim the default names.

This audit is what makes it a planned, branch-based migration with in-browser verification — not a perl pass.
