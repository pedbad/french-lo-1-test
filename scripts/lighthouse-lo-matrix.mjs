// WIDE Lighthouse matrix audit of every LO page against the local prod preview.
// Extends lighthouse-lo-batch.mjs (which only did desktop / light / default-state
// a11y) to close the coverage gap: theme x viewport x interacted-state, and adds
// the seo + best-practices categories.
//
// Scenarios per LO (?lo=<slug>):
//   1. desktop-light  navigation  [accessibility, seo, best-practices]
//   2. desktop-dark   navigation  [accessibility, best-practices]
//   3. mobile-light   navigation  [accessibility, seo, best-practices]
//   4. mobile-dark    navigation  [accessibility, best-practices]
//   5. interacted     snapshot    [accessibility, best-practices]
//        (clicks the first interactive controls to reveal selected/feedback DOM
//         states, then snapshots the live a11y tree — catches states that a cold
//         navigation never renders.)
//
// Dark theme = `.dark` class on <html>, driven by sessionStorage.dark (App.jsx).
// We seed sessionStorage before each navigation so the load paints in that theme.
//
// Usage:
//   1. yarn build && yarn preview --port 4199 --strictPort   (another shell)
//   2. node scripts/lighthouse-lo-matrix.mjs [baseURL] [outDir]
//
// Local compute only. Read <outDir>/_summary.json.

import { navigation, snapshot } from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import puppeteer from "puppeteer-core";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:4199/";
const OUT_DIR = process.argv[3] || "/tmp/lh-lo-matrix";

// slug list mirrors src/index-fr.json (landing + LO routing key)
const ONLY = process.env.ONLY_SLUG;
const SLUGS = (ONLY ? [ONLY] : [
  "first-contact",
  "about-me",
  "origins-and-languages",
  "current-location",
  "house-and-home",
  "family-friends",
  "opinions-matter",
  "free-time",
  "phoning-in-france",
  "making-arrangements",
  "going-to-a-cafe",
  "shopping-in-the-market",
  "daily-routine",
  "studying-at-university",
  "planning-a-holiday",
]);

const DESKTOP_SCREEN = { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false };
const MOBILE_SCREEN = { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false };
const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const cfg = (cats, { mobile }) => ({
  extends: "lighthouse:default",
  settings: {
    onlyCategories: cats,
    formFactor: mobile ? "mobile" : "desktop",
    screenEmulation: mobile ? MOBILE_SCREEN : DESKTOP_SCREEN,
    ...(mobile ? { emulatedUserAgent: MOBILE_UA } : {}),
  },
});

const SCENARIOS = [
  { key: "desktop-light", mode: "navigation", dark: false, mobile: false, cats: ["accessibility", "seo", "best-practices"] },
  { key: "desktop-dark", mode: "navigation", dark: true, mobile: false, cats: ["accessibility", "best-practices"] },
  { key: "mobile-light", mode: "navigation", dark: false, mobile: true, cats: ["accessibility", "seo", "best-practices"] },
  { key: "mobile-dark", mode: "navigation", dark: true, mobile: true, cats: ["accessibility", "best-practices"] },
  { key: "interacted", mode: "snapshot", dark: false, mobile: false, cats: ["accessibility", "best-practices"] },
];

// Seed the theme flag on the origin so the subsequent load paints in that theme.
async function seedTheme(page, dark) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate((d) => {
    if (d) sessionStorage.setItem("dark", "true");
    else sessionStorage.removeItem("dark");
  }, dark);
}

// Best-effort: reveal interacted DOM states. Click the first few enabled
// interactive controls inside the exercise region, tolerate any that throw.
async function interact(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const sel = [
      "main button:not([disabled])",
      'main [role="button"]',
      'main [role="radio"]',
      'main input[type="radio"]',
      "main [role=\"checkbox\"]",
    ].join(",");
    const els = Array.from(document.querySelectorAll(sel)).slice(0, 4);
    for (const el of els) {
      try {
        el.click();
        await wait(120);
      } catch {
        /* ignore */
      }
    }
    await wait(300);
  });
}

function scoreOf(lhr, catId) {
  const c = lhr.categories[catId];
  if (!c || c.score == null) return null;
  return Math.round(c.score * 100);
}

function failsOf(lhr, catId) {
  const c = lhr.categories[catId];
  if (!c) return [];
  return c.auditRefs
    .map((ref) => lhr.audits[ref.id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative")
    .map((a) => ({ id: a.id, title: a.title, nodes: a.details?.items?.length ?? 0 }));
}

await mkdir(OUT_DIR, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});
const browser = await puppeteer.connect({
  browserURL: `http://localhost:${chrome.port}`,
  defaultViewport: null,
});

const rows = []; // {slug, scenario, cat, score, fails}
// tally key = `${scenario}::${cat}::${auditId}`
const tally = new Map();

function record(slug, scenario, cats, lhr) {
  for (const cat of cats) {
    const score = scoreOf(lhr, cat);
    const fails = failsOf(lhr, cat);
    rows.push({ slug, scenario, cat, score, fails });
    for (const f of fails) {
      const k = `${scenario}::${cat}::${f.id}`;
      if (!tally.has(k)) tally.set(k, { scenario, cat, id: f.id, title: f.title, pages: new Set() });
      tally.get(k).pages.add(slug);
    }
  }
}

for (const slug of SLUGS) {
  const url = `${BASE}?lo=${encodeURIComponent(slug)}`;
  for (const sc of SCENARIOS) {
    const page = await browser.newPage();
    try {
      if (sc.mobile) await page.setViewport({ width: MOBILE_SCREEN.width, height: MOBILE_SCREEN.height, deviceScaleFactor: MOBILE_SCREEN.deviceScaleFactor, isMobile: true, hasTouch: true });
      await seedTheme(page, sc.dark);

      let lhr;
      if (sc.mode === "navigation") {
        ({ lhr } = await navigation(page, url, { config: cfg(sc.cats, sc) }));
      } else {
        // snapshot: load the page ourselves, interact, then snapshot live DOM
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        await interact(page);
        ({ lhr } = await snapshot(page, { config: cfg(sc.cats, sc) }));
      }
      record(slug, sc.key, sc.cats, lhr);
      const parts = sc.cats.map((c) => `${c[0]}${c === "best-practices" ? "p" : ""}=${scoreOf(lhr, c)}`).join(" ");
      console.log(`${slug.padEnd(22)} ${sc.key.padEnd(14)} ${parts}`);
    } catch (err) {
      rows.push({ slug, scenario: sc.key, cat: null, score: null, fails: [], error: String(err?.message || err) });
      console.log(`${slug.padEnd(22)} ${sc.key.padEnd(14)} ERROR ${err?.message || err}`);
      if (process.env.DEBUG_STACK) console.error(err?.stack || err);
    } finally {
      await page.close().catch(() => {});
    }
  }
}

await browser.disconnect();
await chrome.kill();

const shared = [...tally.values()]
  .map((v) => ({ scenario: v.scenario, cat: v.cat, id: v.id, title: v.title, pageCount: v.pages.size, pages: [...v.pages] }))
  .sort((a, b) => b.pageCount - a.pageCount);

// per-LO score matrix: slug -> {scenario::cat: score}
const matrix = {};
for (const r of rows) {
  if (r.cat == null) continue;
  matrix[r.slug] ??= {};
  matrix[r.slug][`${r.scenario}::${r.cat}`] = r.score;
}

const summary = { base: BASE, scenarios: SCENARIOS.map((s) => s.key), matrix, shared, rows };
await writeFile(path.join(OUT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));

console.log("\n=== FAILING AUDITS (scenario :: category :: audit — pages) ===");
if (shared.length === 0) console.log("  none — clean across all scenarios");
for (const s of shared) {
  console.log(`${String(s.pageCount).padStart(2)}/15  [${s.scenario}/${s.cat}] ${s.id} — ${s.title}`);
}
console.log(`\nSummary: ${path.join(OUT_DIR, "_summary.json")}`);
