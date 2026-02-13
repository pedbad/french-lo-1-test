# Typography Unification Plan

Date: 2026-02-11  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Decisions Confirmed
1. Canonical brand fonts remain: **OpenSans + Feijoa**.
   - `--font-sans` => OpenSans
   - `--font-heading` => Feijoa
   - `--font-mono` => JetBrains Mono
2. End state: **single source of truth via `src/index.css` tokens + Tailwind/shadcn utilities**.
3. SCSS typography should be removed as much as possible (target: near-zero, ideally none except justified exceptions).
4. Migration approach: **visual parity first** (no intentional redesign during migration).
5. Execution scope: **high-impact first**, then broader cleanup.
6. Add guardrails: **pre-commit + CI check** to block new hardcoded typography in SCSS.

## Why Inter / Space Grotesk / JetBrains Mono exist now
These likely came from a newer Tailwind/shadcn token setup (`src/index.css` + `tailwind.config.js`) while legacy SCSS still uses self-hosted OpenSans/Feijoa.  
Result: two active font systems are present, causing mixed behavior and unclear ownership.

Decision update:
- Keep **JetBrains Mono** for mono.
- Replace tokenized sans/heading families with **OpenSans/Feijoa** so Tailwind/shadcn and legacy styling align.

## Current Baseline (from audit)
See: `/Users/ped/Sites/french/french-lo-1-test/TYPOGRAPHY_AUDID.md`

- Hardcoded SCSS/CSS `font-size/line-height` matches: 82
- Token-based SCSS/CSS `font-size/line-height` matches: 19
- JSX Tailwind `text-*` matches: 33
- Font systems split between legacy SCSS families and tokenized font families

## Target End State
1. `src/index.css` holds canonical typography tokens and canonical font-family tokens.
2. `tailwind.config.js` maps utilities to those tokens.
3. Component text scale/weight/family is applied via utilities (or thin semantic classes backed by utilities).
4. SCSS handles layout/spacing/states only (not text scale/family), except explicit allowlisted exceptions.
5. Pre-commit and CI prevent reintroduction of hardcoded SCSS typography.

---

## Phase Plan (Baby Steps)

## Phase 0: Safety setup
Goal: avoid regressions while migrating.

Actions:
1. Keep `TYPOGRAPHY_AUDID.md` as baseline inventory.
2. Capture visual baseline screenshots (desktop + mobile + dark mode) for:
   - hero
   - main content section text
   - instruction blocks
   - info panel
   - modal content
   - nav/footer
3. Do not combine typography changes with unrelated style changes in same commit.

Validation:
- `yarn lint`
- manual visual check of above areas

Commit suggestion:
- `docs: freeze typography baseline and migration scope`

---

## Phase 1: Canonical font tokens aligned to brand fonts
Goal: make tokenized font families reflect OpenSans + Feijoa.

Actions:
1. In `src/index.css`, change:
   - `--font-sans` => OpenSans family token
   - `--font-heading` => Feijoa family token
   - `--font-mono` => JetBrains Mono
2. Ensure these tokens point to existing loaded faces from `src/App.scss` `@font-face` declarations (or move `@font-face` later to a dedicated font file).
3. Keep visual parity: do not alter size scale in this phase.

Validation:
- typography looks unchanged in baseline areas
- no layout shifts from font-family fallback changes

Commit suggestion:
- `style(tokens): align font-family tokens to OpenSans and Feijoa`

---

## Phase 2: High-impact typography ownership migration
Goal: remove conflicting text-size ownership in known hotspots first.

Priority order:
1. `src/App.scss` instruction/content typography blocks
2. `src/components/Section/instructions-media.jsx`
3. `src/components/Info/Info.scss`
4. `src/components/ModalLinkDialog/ModalLinkDialog.jsx`

For each target area:
1. Replace SCSS `font-size/line-height/font-family` usage with utility classes or semantic utility wrappers.
2. Keep values equivalent (visual parity).
3. Remove now-redundant SCSS typography declarations.
4. Test desktop/mobile/dark.

Validation per area:
- `yarn lint`
- manual compare against baseline screenshots
- check anchor scrolling/nav remains unchanged (non-typography behavior safety)

Commit suggestion pattern:
- `refactor(typography): migrate instructions text ownership`
- `refactor(typography): migrate info panel text ownership`
- `refactor(typography): migrate modal text ownership`

---

## Phase 3: shadcn and local component consistency pass
Goal: ensure local UI and shadcn wrappers use same typography model.

Actions:
1. Audit `src/components/ui/*.jsx` for text classes (`text-sm`, `text-base`, etc.).
2. Confirm each class maps to your token scale via `tailwind.config.js`.
3. Normalize local app components that override shadcn defaults with SCSS typography.
4. Keep only semantic, utility-driven text styles.

Validation:
- component library views (buttons/tabs/dialog/select/input/table/tooltip)
- responsive modal and nav readability

Commit suggestion:
- `refactor(typography): normalize shadcn and app utility text scales`

---

## Phase 4: Broader SCSS typography cleanup
Goal: systematically remove residual hardcoded typography outside hotspots.

Actions:
1. Work file-by-file from highest hardcoded count (from audit):
   - `src/App.scss`
   - `src/components/MemoryMatchGame/Card/Card.scss`
   - `src/components/Blanks/Blanks.scss`
   - `src/styles/_mixins.module.scss`
   - `src/components/DropDowns/DropDowns.scss`
   - etc.
2. Convert hardcoded `font-size`, `line-height`, `font-family` to token-driven utility usage.
3. If conversion is not practical, add temporary allowlist exception with explicit reason.

Validation:
- per-component smoke test
- keep PR small (1-3 components per PR)

Commit suggestion:
- `refactor(typography): remove hardcoded sizing from <component-group>`

---

## Phase 5: Guardrail enforcement (pre-commit + CI)
Goal: prevent typography drift back to SCSS hardcoding.

## 5A. Add guard script
Create: `scripts/check-typography-guard.sh`

Rules:
1. Fail on new SCSS/CSS declarations:
   - `font-size:` with px/rem/em literals
   - `line-height:` with px/rem/em literals
   - `font-family:` direct literal declarations
2. Allow `font-family` only when tokenized:
   - `font-family: var(--font-sans);`
   - `font-family: var(--font-heading);`
   - `font-family: var(--font-mono);`
3. Allowlist file for justified exceptions:
   - `scripts/typography-allowlist.txt`
4. Exclude comments from detection.

## 5B. Add package scripts
In `package.json` add:
- `"check:typography": "bash scripts/check-typography-guard.sh"`
- `"prepush:local": "yarn lint && yarn check:typography"`

This gives you a manual command before push:
- `yarn prepush:local`

## 5C. Add pre-commit hook
Recommended via Husky:
1. `yarn add -D husky`
2. `yarn husky init`
3. Edit `.husky/pre-commit` to run:
   - `yarn lint`
   - `yarn check:typography`

## 5D. Add CI check
In CI workflow add a typography job step:
- install deps
- run `yarn lint`
- run `yarn check:typography`

Rollout mode:
1. week 1: warning/report only (non-blocking)
2. week 2+: blocking, after allowlist is stable

Commit suggestion:
- `chore(typography): add pre-commit and CI guardrails`

---

## Phase 6: Documentation and team workflow
Goal: make this maintainable.

Actions:
1. Add short section to `README.md`:
   - typography source of truth policy
   - allowed vs forbidden typography patterns
   - local pre-push command (`yarn prepush:local`)
2. Keep `TYPOGRAPHY_AUDID.md` as historical baseline.
3. Update this plan with completion checklist.

Commit suggestion:
- `docs: add typography guardrail and local pre-push instructions`

---

## Working Rules During Migration
1. One component area per commit.
2. No color/layout redesign mixed with typography refactors.
3. Keep visual parity; any intentional size redesign happens later in a separate phase.
4. If regression appears, revert only the last typography commit and retry with smaller scope.

## Completion Checklist
- [ ] Brand fonts are tokenized and consumed via Tailwind mapping
- [ ] High-impact hotspots migrated and stable
- [ ] Hardcoded typography in SCSS substantially removed
- [ ] Exception allowlist is explicit and minimal
- [ ] Pre-commit hook active locally
- [ ] CI typography guard active
- [ ] README documents local pre-push workflow

## Immediate Next 3 Baby Steps
1. Align `--font-sans`/`--font-heading` tokens to OpenSans/Feijoa while preserving look.
2. Migrate instruction text ownership (`App.scss` + `instructions-media.jsx`) with parity checks.
3. Implement `check:typography` script + `yarn prepush:local` command before any larger cleanup.
