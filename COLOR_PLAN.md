# Color Unification Plan

Date: 2026-02-11

## Decision confirmed
Canonical colors will live in `src/index.css` tokens, with Tailwind/shadcn consuming those tokens. SCSS color literals will be removed as part of a baby-step migration.

## Why audit + migration + plan are required
Color affects almost every surface in the UI. A direct one-pass rewrite is high-risk.

This 3-doc approach is intentional:
1. **Audit** tells us exactly where colors are defined and consumed.
2. **Migration strategy** defines rules and end-state architecture.
3. **Execution plan** sequences safe, small changes with validation.

This reduces regression risk and prevents repeating the same inconsistency pattern seen in typography.

## End state
1. `src/index.css` is the only color value definition source.
2. `tailwind.config.js` maps utility colors to token values.
3. shadcn components use token-backed utilities.
4. Component SCSS avoids raw color values.
5. Color guardrails prevent new literal color drift.

---

## Phase 0: Baseline and safety
1. Keep `COLOR_AUDIT.md` as baseline.
2. Capture baseline screenshots for key pages in light/dark/mobile.
3. Freeze unrelated style changes while migrating colors.

Validation:
- `yarn lint`
- baseline visual checklist

---

## Phase 1: Token hygiene in index.css
1. Confirm every app semantic need has a token:
   - text, surface, border, accent, status, pedagogy
2. Remove duplicated/overlapping tokens where possible.
3. Keep light/dark parity intentional.

Validation:
- no visual changes expected

Commit:
- `style(colors): normalize canonical tokens in index.css`

---

## Phase 2: Tailwind/shadcn mapping lock
1. Ensure all utility color mappings reference tokens only.
2. Remove hardcoded color literals from `tailwind.config.js` where feasible.
   - If animation colors remain literal, create dedicated tokens and reference those.

Validation:
- utility classes render same colors

Commit:
- `style(colors): map tailwind and shadcn colors to tokens only`

---

## Phase 3: High-impact component migration first
Priority:
1. `src/App.scss`
2. `src/components/MainMenu/MainMenu.scss`
3. `src/components/Footer/Footer.scss`
4. `src/components/AudioClip/AudioClip.scss`

Per file workflow:
1. Replace literal colors with token usage.
2. Keep behavior and contrast unchanged.
3. Verify light/dark/mobile.
4. Commit one area at a time.

Commit pattern:
- `refactor(colors): migrate <component> to tokenized palette`

---

## Phase 4: Hotspot sweep by density
Use ranking from `COLOR_AUDIT.md` and migrate file groups in small PRs.

Recommended batches:
1. Learning interactions (`Blanks`, `WordParts`, `CrossWord`, `MemoryMatch`)
2. Shared styles (`_mixins.module.scss`, `_colours.module.scss`)
3. Remaining low-density components

Validation:
- per-batch smoke test
- contrast sanity check in dark mode

---

## Phase 5: Guardrails (pre-commit + CI)
## 5A. Guard script
Create `scripts/check-color-guard.sh`:
- Flags new color literals in SCSS/CSS/JSX/config:
  - `#hex`
  - `rgb()/rgba()`
  - `hsl()/hsla()`
  - `oklch()`
- Ignores allowlisted files/lines in `scripts/color-allowlist.txt`

## 5B. package.json scripts
Add:
- `"check:color": "bash scripts/check-color-guard.sh"`
- `"prepush:local": "yarn lint && yarn check:typography && yarn check:color"`

This lets you run locally before push:
- `yarn prepush:local`

## 5C. pre-commit hook
Via Husky, run on commit:
- `yarn lint`
- `yarn check:color`

## 5D. CI gate
Add CI step:
- `yarn check:color`

Rollout:
1. week 1 warning mode
2. week 2 blocking mode after allowlist stabilizes

---

## Phase 6: Documentation update
Update `README.md` with:
1. Color source-of-truth policy.
2. Allowed/forbidden color usage patterns.
3. Local pre-push command usage.

---

## Working rules
1. One component area per commit.
2. No visual redesign while migrating.
3. Keep contrast accessible in both themes.
4. If a regression appears, revert last color commit only.

## Completion checklist
- [ ] Color values centralized in `index.css`
- [ ] Tailwind/shadcn color mapping token-only
- [ ] High-impact files migrated
- [ ] Hotspot sweep completed
- [ ] Color guardrails active (pre-commit + CI)
- [ ] README updated with color policy

## Immediate next baby steps
1. Create `scripts/check-color-guard.sh` + allowlist file.
2. Replace hardcoded highlight colors in `tailwind.config.js` with tokens.
3. Start `App.scss` color literal migration with visual parity checks.
