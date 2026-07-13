// Batch Lighthouse ACCESSIBILITY audit of every LO page against the local prod
// preview. LO pages are addressed by `?lo=<slug>` (App.jsx resolves ?lo by slug).
//
// Usage:
//   1. yarn build && yarn preview --port 4199 --strictPort   (in another shell)
//   2. node scripts/lighthouse-lo-batch.mjs [baseURL]
//
// Writes a compact summary JSON to scratchpad/full report dir and prints a table.
// Costs local compute only — no agent tokens per page.

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:4199/";
const OUT_DIR = process.argv[3] || "/tmp/lh-lo";

// slug list mirrors src/index-fr.json (landing + LO routing key)
const SLUGS = [
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
];

const CATEGORIES = ["accessibility"];

await mkdir(OUT_DIR, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const opts = {
  port: chrome.port,
  onlyCategories: CATEGORIES,
  output: "json",
  logLevel: "error",
  // desktop-ish; a11y is viewport-independent but keep it deterministic
  formFactor: "desktop",
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
};

const rows = [];
const failureTally = new Map(); // auditId -> {title, pages:Set}

for (const slug of SLUGS) {
  const url = `${BASE}?lo=${encodeURIComponent(slug)}`;
  try {
    const { lhr } = await lighthouse(url, opts);
    const cat = lhr.categories.accessibility;
    const score = cat.score == null ? null : Math.round(cat.score * 100);

    const failed = cat.auditRefs
      .map((ref) => lhr.audits[ref.id])
      .filter((a) => a && a.score !== null && a.score < 1)
      .map((a) => ({
        id: a.id,
        title: a.title,
        nodes: a.details?.items?.length ?? 0,
      }));

    for (const f of failed) {
      if (!failureTally.has(f.id)) failureTally.set(f.id, { title: f.title, pages: new Set() });
      failureTally.get(f.id).pages.add(slug);
    }

    rows.push({ slug, score, failed });
    await writeFile(path.join(OUT_DIR, `${slug}.json`), JSON.stringify(lhr));
    console.log(`${slug.padEnd(24)} a11y=${String(score).padStart(3)}  fails=${failed.length}`);
  } catch (err) {
    rows.push({ slug, score: null, failed: [], error: String(err?.message || err) });
    console.log(`${slug.padEnd(24)} ERROR ${err?.message || err}`);
  }
}

await chrome.kill();

// shared-across-pages failure summary
const shared = [...failureTally.entries()]
  .map(([id, v]) => ({ id, title: v.title, pageCount: v.pages.size, pages: [...v.pages] }))
  .sort((a, b) => b.pageCount - a.pageCount);

const summary = { base: BASE, categories: CATEGORIES, rows, shared };
await writeFile(path.join(OUT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));

console.log("\n=== SCORES ===");
for (const r of rows) console.log(`${r.slug.padEnd(24)} ${r.score == null ? "ERR" : r.score}`);
console.log("\n=== FAILING AUDITS (by page count) ===");
for (const s of shared) console.log(`${String(s.pageCount).padStart(2)}/15  ${s.id} — ${s.title}`);
console.log(`\nSummary: ${path.join(OUT_DIR, "_summary.json")}`);
