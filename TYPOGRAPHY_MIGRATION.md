# Typography Migration Plan

## Why this exists
This project currently has typography defined in multiple places:

- `src/index.css` (design tokens like `--font-size-*`, `--body-line-height`)
- `tailwind.config.js` (Tailwind `fontSize` mapping to tokens)
- SCSS files (`src/App.scss`, component `*.scss`) with direct `font-size` and `line-height`
- JSX class strings (`text-sm`, `text-base`, `sm:text-lg`, etc.)

When these overlap, the final rendered font size depends on cascade/specificity/order, not one clear system. That is the root of the "fonts changed unexpectedly" issue.

## Problem statement (single source of truth)
Typography is not broken because of one bad line. It is fragile because ownership is split.

Current pattern:

1. Token values exist in `index.css`.
2. Tailwind utilities map to those tokens.
3. Some SCSS still hardcodes sizes or uses token vars directly.
4. Some components use Tailwind text utilities in JSX.

Result:

- A change in SCSS can override utility classes.
- A change in utility classes can bypass SCSS assumptions.
- Regressions are hard to predict and hard to review.

## Target architecture
Use one typography source of truth:

1. **Token source**: `src/index.css`
2. **Token consumption via utilities**: `tailwind.config.js` -> `text-*` utilities
3. **Component usage**: JSX utility classes (including shadcn components)
4. **SCSS role**: layout/spacing/visual structure only; avoid typography definitions

In short: **tokens in `index.css`, usage through Tailwind/shadcn classes, minimal SCSS typography**.

Confirmed font-token direction:
- `--font-sans` => OpenSans
- `--font-heading` => Feijoa
- `--font-mono` => JetBrains Mono

## Migration principles
- Make small, reversible changes.
- Touch only a few components per PR.
- Keep visual QA after every change.
- Never mix "cleanup" + "retheme" + "typography rewrite" in one commit.

## Definition of done
Typography is considered migrated when:

1. All semantic text scales are tokenized in `index.css`.
2. Tailwind `fontSize` uses those tokens.
3. Most component SCSS has no `font-size`/`line-height` rules.
4. JSX/shadcn components apply text scale via Tailwind classes or shared semantic classes.
5. A guardrail prevents reintroducing ad-hoc SCSS typography.

---

## Step-by-step baby migration plan

### Phase 0: Baseline and safety net
Goal: freeze current behavior and make regressions visible.

1. Create a quick typography inventory:
   - `rg -n "font-size|line-height|letter-spacing|font-weight" src --glob "*.scss" --glob "*.css" --glob "*.jsx"`
2. Capture screenshots of key pages/sections (desktop + mobile + dark mode).
3. Record current key text blocks and expected size hierarchy:
   - Hero title
   - Main section headings (`h1/h2/h3`)
   - Body paragraph/list text
   - Instruction blocks
   - Modal text
   - Navigation labels

Deliverable:
- A baseline note (can be added to this file later).

### Phase 1: Lock token vocabulary (no visual changes intended)
Goal: ensure token set is complete and stable.

In `src/index.css` keep a clear scale:

- `--font-size-xs`
- `--font-size-sm`
- `--font-size-base`
- `--font-size-lg`
- `--font-size-xl`
- `--font-size-2xl`
- `--font-size-3xl`
- `--body-line-height`
- heading line-height tokens (`--line-height-2xl`, `--line-height-3xl`)

Rules:
- Do not change token numeric values in this phase unless intentionally rebranding typography.
- Keep light/dark values identical unless there is a strong reason.

Deliverable:
- Commit with token cleanup only.

### Phase 2: Confirm Tailwind mapping to tokens
Goal: make utility classes guaranteed to use token values.

In `tailwind.config.js`:
- Ensure `theme.extend.fontSize` maps each size key to `var(--font-size-*)`.
- Ensure line heights point to tokenized values where appropriate.

Example intent:
- `text-sm` -> `var(--font-size-sm)`
- `text-base` -> `var(--font-size-base)`
- `text-lg` -> `var(--font-size-lg)`

Deliverable:
- Commit with mapping validation only (no component rewrites yet).

### Phase 3: Migrate one high-impact area at a time
Goal: reduce conflict surface safely.

Start with components where regressions were seen:

1. `src/App.scss` instructions block
2. `src/components/Section/instructions-media.jsx`
3. `src/components/Info/Info.scss`
4. `src/components/ModalLinkDialog/ModalLinkDialog.jsx`

Per component workflow:

1. Replace SCSS typography with utility classes in JSX where possible.
2. If SCSS is still needed, use token vars only (no raw px/rem literals).
3. Remove duplicate/conflicting font rules.
4. Verify desktop/mobile/dark mode.
5. Commit only that component group.

Deliverable:
- 1 small commit per component/feature area.

### Phase 4: Introduce semantic typography helpers (optional but recommended)
Goal: avoid repeated utility strings and encode intent.

Define a minimal semantic layer (class names, not new values), e.g.:
- `.type-body`
- `.type-body-strong`
- `.type-heading-2`
- `.type-caption`

Each semantic helper should map to existing tokens/utilities. This helps shadcn and custom components stay aligned without rewriting utility strings everywhere.

Deliverable:
- Small helper layer + targeted adoption.

### Phase 5: Remove residual SCSS typography
Goal: finish deconfliction.

1. Search remaining SCSS typography declarations.
2. Keep only exception cases (third-party widgets, canvas/SVG overlays, legacy fixed-ratio UI).
3. Document each exception in this file.

Deliverable:
- SCSS typography reduced to justified exceptions only.

### Phase 6: Add guardrails
Goal: stop drift back to mixed ownership.

Add a lightweight check in CI (or pre-commit):
- Fail if new `font-size:` or `line-height:` is introduced in SCSS outside allowlisted files.

Example approach:
- Script using `rg` to detect forbidden declarations.
- Maintain an allowlist for genuine exceptions.

Deliverable:
- Automated check + short docs.

---

## Practical "prompt" you can reuse
Use this prompt in future coding sessions:

> Audit typography ownership in this repo. Keep `src/index.css` as the only typography token source, keep `tailwind.config.js` as the mapping layer, and migrate typography usage away from SCSS toward Tailwind/shadcn utilities. Work in baby steps: one component area per commit, no visual redesign, preserve current look. For each step: list conflicts found, apply minimal edits, and verify desktop/mobile/dark mode impact. Do not touch unrelated layout/colors.

---

## Current known conflict hotspots (from latest audit)
- `src/App.scss` instruction typography block
- `src/components/Section/instructions-media.jsx` default instruction style
- `src/components/Info/Info.scss` text hierarchy
- `src/components/ModalLinkDialog/ModalLinkDialog.jsx` mobile text scale

These are the best first targets for controlled migration.

## Rollback strategy
If a step introduces visual regressions:

1. Revert only that commit.
2. Re-run with smaller scope.
3. Add a before/after screenshot checklist for the exact component before retrying.

## What not to do
- Do not run a full "global typography cleanup" in one PR.
- Do not change token values and component usage in the same commit.
- Do not mix nav/footer/banner redesign with typography migration.
- Do not remove SCSS typography wholesale without per-component validation.

## Recommended commit sequence
1. `docs: add typography migration plan`
2. `style(tokens): normalize typography tokens in index.css`
3. `style(tailwind): align fontSize mapping to tokens`
4. `refactor(typography): migrate instructions typography`
5. `refactor(typography): migrate info panel typography`
6. `refactor(typography): migrate modal typography`
7. `chore(ci): add guardrail against new scss font-size rules`

This sequence is low-risk, reviewable, and easy to bisect.
