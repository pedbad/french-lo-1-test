# Handover — Lighthouse audit improvements (french-lo-1)

## Context
Repo: `/Users/ped/Sites/french/french-lo-1` (React + Vite, `.jsx`, yarn).
Live site: `https://lcitc.langcen.cam.ac.uk/french/french-basic/` (password-protected — agent cannot reach it; user must run live audits).
Branch in progress: `fix/a11y-contrast-landmark` (2 commits pushed, tree clean).

## Audit tooling that works
- Lighthouse via **chrome-devtools MCP** `lighthouse_audit` — covers **Accessibility, SEO, Best Practices, Agentic Browsing** (NOT Performance score).
- Performance/CLS via **chrome-devtools MCP** `performance_start_trace` (reload+autoStop) — gives Core Web Vitals + insight sets.
- Audit LOCAL prod build, not dev: `yarn build` → `yarn preview --port 4199 --strictPort` → `new_page`/`navigate_page` to `http://localhost:4199/` → `lighthouse_audit`.
- Port 5173 is held by a DIFFERENT project (`/Users/ped/Sites/lc-base-template`). Always confirm the served `<title>` is "University of Cambridge Language Centre..." before trusting an audit.
- COST: each build+preview+audit cycle ≈ $7–10. Batch all edits, run ONE verify audit at the end. Extract failing-audit detail from the report.json (path printed by the tool) with a node one-liner instead of re-auditing.

## Local scores (desktop, prod build) — ALL 100 as of 2026-07-10
| Category | Score | Notes |
|---|---|---|
| Accessibility | 100 | DONE (was 96 local / 69 live) |
| Best Practices | 100 | local; live showed 92 (live-only causes) |
| SEO | 100 | DONE — was 92; robots.txt added |
| Agentic Browsing | 100 | DONE — was 37; CLS 0 + llms.txt added |
| Performance (CLS) | CLS 0.00 | DONE — was 0.616; verified cold perf trace |

## DONE (this branch)
1. **Accessibility 96→100** (commit ae8713c): landing-card contrast.
   - `src/components/layout/page-shell/LandingPage/LandingPage.jsx:170` — dropped `/90` opacity on card description (`text-muted-foreground`, 3.89→4.73:1).
   - `LandingPage.jsx:175` — "Start Learning" label: `text-(--brand-primary)/50` (1.82:1) → `text-(--brand-primary-text)` (7.3:1); removed failing hover color-shift.
   - `src/styles/theme-lc-french.css` — added mode-aware `--brand-primary-text` token (light = `var(--brand-quaternary)` deep teal; dark = `var(--brand-primary)`). Defined via `var()` only → passes color guard.
2. **Font preload** (commit 1a0eac4): 3 `rel=preload` links in `index.html` head (Feijoa-Medium/Bold, OpenSans-Regular, `crossorigin`, `%BASE_URL%`). Perf win but did NOT change CLS.

## DONE (2026-07-10 session 2)

### CLS 0.616 → 0.00 (commit f98070a) — ROOT CAUSE FOUND & FIXED
- **Cause**: `App.jsx` render guards used `currentLearningObject !== -1`. On
  mount that value is `undefined` (index JSON not yet fetched), so the FIRST
  paint rendered the LO **hero scaffold** (dimensionless banner SVG). When the
  index resolved and the route became `-1`, the scaffold was swapped for the
  LandingPage — a ~0.62 shift of all in-viewport content.
- **Fix**: gate hero/LO scaffold on a real id (`>= 1`); render landing only at
  `=== -1`; `<main>` stays empty while unresolved. Added `min-h-screen` to
  `<main>` so the footer starts below the fold during async load.
- **Verified**: cold `performance_start_trace` on local prod build → CLS 0.00,
  LayoutShifts/CLSCulprits insight no longer present. LCP 407ms.
- Fonts & landing cards were correctly ruled out earlier; the culprit was the
  App-level route-readiness gate, not LandingPage.jsx itself.

### SEO 92 → 100 + Agentic 37 → 100 (commit 83e7e8c)
- Added `public/robots.txt` (allow-all + sitemap ref) — fixes `robots-txt`.
- Added `public/llms.txt` (H1 + summary + lesson link, llmstxt.org) — fixes
  `llms-txt`. Both copied to dist root, served at site root (curl-confirmed).
- `<meta name="description">` confirmed surviving the build (dist/index.html).
- **Local desktop lighthouse now 100 across Accessibility / Best Practices /
  SEO / Agentic Browsing; CLS 0.00.**

## REMAINING WORK (LIVE-ONLY — behind password, user must run)

### Best Practices 92 (live only)
- Local is 100; live deducts 8. Needs live console/network inspection (behind password). User should run DevTools Lighthouse on live, or share the live console errors + the failing BP audit ids.

## Guards (must pass before commit)
- `yarn check:color:branch` — blocks hex/oklch/named-color literals outside allowlist (`src/index.css`, `DebugSandbox.jsx`, `tailwind.config.js`). `var(--token)` refs always allowed → prefer token references for any color change.
- `yarn check:a11y:branch`, `yarn check:typography:branch`, `yarn check:scss:branch`.

## Key facts
- Base path: `vite.config` base = `VITE_BASE_PATH || './'`. Vite DOES rebase root-absolute CSS `url("/fonts/...")` → `<base>/fonts/...` in built CSS. No 404 bug there.
- Token sources: `src/styles/tokens.css` (shadcn light/dark), `src/styles/theme-lc-french.css` (brand teal). `--muted-foreground` light = `oklch(0.556 0 0)` = 4.73:1 on white at full opacity.
- Contrast math node snippet (oklch→sRGB→WCAG ratio) was used this session; recompute if changing tokens.

## Next session
All local audits are 100 and CLS is 0. Only live-only items remain (Best
Practices 92 on the password-protected server). User must run DevTools
Lighthouse on the live URL and paste the failing audit ids + console errors,
then the fixes can be scoped from there. Consider opening a PR for
`fix/a11y-contrast-landmark` → `main`.
