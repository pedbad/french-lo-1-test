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

## Fixes Applied (session 2026-06-15)

Targeted follow-up: the **bare-element rules nested inside a content class** —
distinct from pure class rules, these still silently hijack a utility placed on
that element (e.g. `<p className="text-…">` inside `.info-content`). Layered the
ones in the primary content flow; pure class-scoped + exercise-internal rules
left fix-on-demand per the guidance below.

| Rule | Location | Fix |
|---|---|---|
| `#content .information .info-content` element defaults (`ul` / `:is(p,div,li,h3,h4)` / `ul li` / `::before`) | `src/index.css` | Wrapped cluster in `@layer base` |
| `#content .intro h2` / `#content .intro p` | `src/index.css` | Wrapped in `@layer base` |
| `#content .section h2` | `src/index.css` | Wrapped in `@layer base` |

Net: unlayered `#content` rule-blocks **75 → 66**. Visual no-op (no current
utility competes); verified on LO1 light + dark.

---

## Known Debt (not yet fixed)

| Issue | Scale | Risk | Action |
|---|---|---|---|
| Unlayered `#content .<class>` rules (pure class-scoped) | ~50 | **Low** — class selectors won't hijack arbitrary utilities | Layer on demand (only when you add a utility to that specific class and it loses) |
| Unlayered global bare-element rules | ✅ 0 | Fixed | `p/li/td`, `a`, `h1-h4` all layered |
| Unlayered bare-element-in-class rules | partial | Low | Primary-content ones (`.info-content`, `.intro`, `.section h2`) layered 2026-06-15; remaining are exercise/LO-internal (radio2, doubleLl, lo6-reference, word-spot) — layer when touching that component |
| Hardcoded `px`/`rem` values | ~116 | Low | Consider `@theme` tokens only where values are reused |
| `!list-none !p-0` in grammar custom components | 3 | Low | Find + layer the `ul` rule when editing those components |
| ~~Type scale split between config and prefixed `@theme`~~ | — | — | ✅ **RESOLVED** — scale unified in CSS `@theme` (`--text-*` + line-height companions); `text-*` already mapped to project tokens via `@config`, so no prefix needed |
| Tailwind v4 auto-scans `docs/*.md` and tries to compile the documented-broken `text-[var(--font-size-base)]` example → build warning `Unexpected token Delim('*')` | 3 docs | Low (not emitted to dist) | Add `@source not "docs/**"` (or fence examples so the scanner skips them) |

### Why the remaining class-scoped rules are low risk

The global rules we fixed first (`#content :where(p,li,td)`, `#content a`, `#content h1-h4`) were dangerous because they targeted **bare HTML elements** — any utility on any `<p>` or `<h2>` anywhere inside `#content` silently lost.

The remaining ~50 target **specific component classes** (`.inline-icon-*`, `.word-spot-container`, `.instruction-callout`, `.modal-link`, etc.). A utility on `<div className="text-brand">` won't match `#content .inline-icon` unless it also carries that class. So there's no silent utility loss unless you're adding utilities *to those specific classes* — in which case just layer that one rule at that moment.

A narrower middle category is **bare-element rules nested inside a class** (`.info-content p`, `.intro h2`, `.section h2`): a utility on that element *inside that container* does lose. The primary-content ones were layered 2026-06-15 (see Fixes Applied); the rest are exercise/LO-internal and rarely receive utilities, so they stay fix-on-demand.

**The fix-on-demand rule:** if `yarn dev` + DevTools shows a utility losing, check if the winning rule is unlayered, wrap it. Don't pre-emptively layer the whole backlog.

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
- [ ] Type scale lives in `@theme` as `--text-{n}` + `--text-{n}--line-height`; use plain `text-*`. NEVER `text-[var(--font-size-*)]` (size-valued vars parse as color). If a `@config` tailwind.config.js already maps `theme.fontSize`, THAT is the scale — don't add a parallel prefixed one
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

### Final fix (APPLIED 2026-06-04 — branch `refactor/type-scale-collapse`)
Earlier passes introduced a *prefixed* scale (`text-fs-*`, then renamed `text-content-*`) to dodge a feared collision with Tailwind's default `text-*` sizes. **That collision never existed.** `tailwind.config.js` (loaded via `@config` at the top of `index.css`) already remapped `theme.fontSize` so `text-xs … text-3xl` resolved to the project `--font-size-*` tokens. So `text-base` was already **1.15rem (project)**, never the 0.875/1rem TW default. The prefix was guarding a non-problem — the result of grepping only `.css` and missing the JS config.

Final design — **one scale, no prefix, CSS-first**:
- Moved the `fontSize` map out of `tailwind.config.js` into CSS `@theme`, pairing each size with its line-height via the v4 `--text-{n}--line-height` companion key.
- Collapsed all 39 prefixed utilities (13 files) back to plain `text-*`.
- The ~20 `text-[length:calc(var(--font-size-*) * N)]` multiplier sites stay as-is (already `length:`-hinted, no named equivalent).

```css
@theme {
  --text-xs:                var(--font-size-xs);
  --text-xs--line-height:   var(--line-height-xs);
  --text-sm:                var(--font-size-sm);
  --text-sm--line-height:   var(--line-height-sm);
  --text-base:              var(--font-size-base);
  --text-base--line-height: var(--line-height-body);
  --text-lg:                var(--font-size-lg);
  --text-lg--line-height:   var(--line-height-lg);
  --text-xl:                var(--font-size-xl);
  --text-xl--line-height:   var(--line-height-xl);
  --text-2xl:               var(--font-size-2xl);
  --text-2xl--line-height:  var(--line-height-2xl);
  --text-3xl:               var(--font-size-3xl);
  --text-3xl--line-height:  var(--line-height-3xl);
}
/* Use plain text-xs … text-3xl everywhere. */
```

**LESSON:** before assuming a `@theme` name would collide with a Tailwind default, check whether a `@config "…/tailwind.config.js"` is already remapping that name. Missing the JS config produced two superseded refactors (`fs-` and `content-` prefixes) before this single-scale collapse.
