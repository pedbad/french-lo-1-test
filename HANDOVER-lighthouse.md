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

## LIVE AUDIT FINDINGS (2026-07-10 session 2 — real prod build)
Audited `https://lcitc.langcen.cam.ac.uk/french/french-basic/` (the STALE
pre-CLS/pre-SEO deploy): Perf **59**, A11y **96**, BP **96**, SEO **63**;
FCP 3.4s, LCP 5.2s, TBT 0ms, **CLS 0.298**.

CRITICAL AUDIT-TARGET LESSON: `localhost:5173` is the Vite DEV server —
unminified, unbundled, 15 MB, LCP 60s+. NEVER audit it. Audit the prod build
only: `localhost:4199` (preview) or live. Extensions also poison audits — use
Incognito. Prod `main.js` is ~474 KB minified (confirmed on live).

### 1. CLS 0.298 — ALREADY FIXED, needs redeploy
- Live culprit = footer `<div class="footer-container">` (0.298), pushed down
  by late-arriving landing content. The `min-h-screen` on <main> (commit
  f98070a) fixes it — local prod trace verified CLS 0.00. Redeploy to ship it.

### 2. ~6 MB oversized LO SVGs — BIGGEST REMAINING LEVER (deferred)
- The 15 card illustrations are 200–700 KB each (~6 MB). svgo lossless pass
  (commit eb11382) only recovered 6.5% — they are heavy detailed vectors.
- REAL FIX: rasterize to WebP at rendered size (~600px, cards are aspect-[3/2]
  object-cover). Expect ~6 MB → ~0.5 MB, the dominant LCP/payload win. Needs
  `sharp` + an asset/build step + updating the img `src` refs. Not yet done.

### 3. No cache headers + HTTP/1.1 — SERVER/DEVOPS, not code
- Every asset shows `Cache TTL: None` → 7,670 KiB of repeat-visit savings.
  Enable `Cache-Control`/mod_expires on the Mythic Beasts Apache vhost.
- Site is served over HTTP/1.1 (no multiplexing). Enable HTTP/2. Both are
  Apache config on the server, outside this repo.

### 4. Best Practices 92 / image-dimension audit (low value)
- BP 96 live (was noted 92) — minor; run DevTools Lighthouse on live for the
  exact failing ids if chasing 100.
- "Image elements without width/height" is UNSCORED and landing cards already
  reserve space via aspect-[3/2]; footer/hero dims skipped (cosmetic, risks
  distorting CSS-sized logos).

### 5. Fonts — future
- Feijoa-Medium/Bold .otf (228/175 KB) + OpenSans .ttf (128 KB), render-path.
  Convert to woff2 + subset for a smaller, faster font payload.

## Guards (must pass before commit)
- `yarn check:color:branch` — blocks hex/oklch/named-color literals outside allowlist (`src/index.css`, `DebugSandbox.jsx`, `tailwind.config.js`). `var(--token)` refs always allowed → prefer token references for any color change.
- `yarn check:a11y:branch`, `yarn check:typography:branch`, `yarn check:scss:branch`.

## Key facts
- Base path: `vite.config` base = `VITE_BASE_PATH || './'`. Vite DOES rebase root-absolute CSS `url("/fonts/...")` → `<base>/fonts/...` in built CSS. No 404 bug there.
- Token sources: `src/styles/tokens.css` (shadcn light/dark), `src/styles/theme-lc-french.css` (brand teal). `--muted-foreground` light = `oklch(0.556 0 0)` = 4.73:1 on white at full opacity.
- Contrast math node snippet (oklch→sRGB→WCAG ratio) was used this session; recompute if changing tokens.

## Next session — priority order
1. REDEPLOY (`./2.deploy-lcitc-remote.sh`) so the CLS fix + robots.txt +
   llms.txt reach live, then re-audit the PROD build (4199 or live) in
   Incognito. Expect Perf ~90, SEO/Agentic 100, CLS 0.
2. WebP conversion of the 15 LO card SVGs (finding #2) — biggest perf lever.
3. Hand devops the cache-header + HTTP/2 asks (finding #3).
4. Optional: font woff2/subset (#5).
