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

| Issue | Scale | Notes |
|---|---|---|
| Unlayered `#content *` rules | ~61 remaining | Should be migrated to `@layer base` incrementally |
| Hardcoded `px`/`rem` values | ~116 | Most are intentional design values; consider `@theme` tokens where reused |
| `!list-none !p-0` in grammar custom components | 3 instances | Need to find and layer the conflicting `ul`/`li` rules |

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
- [ ] Never reuse a heavily-styled ID/class outside its intended context
- [ ] Run a quick grep before PRs: `grep -r "className.*!"` should return zero
