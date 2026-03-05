# Color Migration Strategy

Date: 2026-02-11

## Goal
Unify color ownership to a single source of truth:
- Canonical color tokens in `src/index.css`
- Tailwind/shadcn consume tokens via `tailwind.config.js`
- SCSS literals removed (or minimized with explicit allowlist)

## Why this migration is needed
Current state has mixed color ownership:
1. Tokenized colors in `index.css`
2. Tailwind utility mapping in `tailwind.config.js`
3. Remaining literal colors in SCSS/JSX/config

This mixed model causes drift, makes dark-mode consistency harder, and increases risk when changing brand palette.

## Design principles
1. Token-first: define values once in `index.css`.
2. Utility-first consumption: use Tailwind/shadcn classes backed by tokens.
3. SCSS should express structure/layout/states, not raw color values.
4. Preserve visual parity during migration.
5. Migrate in small, reversible PRs.

## Canonical token model
### Keep in `src/index.css`
- Base semantic tokens (`--background`, `--foreground`, `--primary`, `--muted`, etc.)
- RGB utility tokens (`--color-*`) for Tailwind alpha support
- App-specific tokens (`--page-background`, `--hero-title-color`, `--footer-background`, pedagogical tokens)

### Keep in `tailwind.config.js`
- Color palette mappings to tokenized `rgb(var(--...)/<alpha-value>)`

### Remove over time from SCSS
- `#hex`, `rgb(a)`, `hsl(a)`, `oklch(...)` literals outside token definition layer
- Literal fallback colors where token fallback is available

## Baby-step migration method
1. Select one component area.
2. Replace literal values with semantic token equivalents.
3. Keep visual output unchanged.
4. Verify desktop/mobile/dark mode.
5. Commit that area only.

## Mapping guidance
When replacing literals, prefer semantic tokens over direct chart tokens unless color is intentionally semantic for pedagogy.

Examples:
- Text default -> `var(--foreground)`
- Subtle text -> `var(--muted-foreground)`
- Card backgrounds -> `var(--card)` / `var(--muted)`
- Borders -> `var(--border)`
- Brand accents -> `var(--primary)`
- Status/pedagogical cues -> `--ped-*` or intentional `--chart-*`

## Exception policy
Allowed temporary exceptions:
1. Canvas drawing code requiring runtime color calculation.
2. Gradient/math edge cases where tokenization is not yet practical.
3. Third-party style integration constraints.

Every exception should be documented in allowlist with reason.

## Validation checklist per step
- `yarn lint`
- Visual compare against baseline
- Light and dark mode check
- Hero/nav/footer check for regression
- Modal and interactive components check

## Guardrail recommendation
Add a color guard script to catch new literal colors in SCSS/CSS/JSX outside allowlist. Use both:
- pre-commit hook
- CI gate

## Deliverables for this strategy
1. `COLOR_AUDIT.md` (inventory)
2. `COLOR_PLAN.md` (execution schedule)
3. guard script + allowlist + docs updates (implementation phase)
