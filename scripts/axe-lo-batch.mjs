// Full-ruleset axe-core audit of every LO page — the automated arm of the
// "manual pass". axe-core covers more WCAG rules than Lighthouse's a11y subset,
// and we run it in light, dark, and interacted states.
//
// Usage:
//   1. yarn build && yarn preview --port 4199 --strictPort
//   2. node scripts/axe-lo-batch.mjs [baseURL] [outDir]
//
// Local compute only. Read <outDir>/_axe-summary.json.

import * as chromeLauncher from "chrome-launcher";
import puppeteer from "puppeteer-core";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve("axe-core/axe.min.js");
const AXE_SRC = await readFile(AXE_PATH, "utf8");

const BASE = process.argv[2] || "http://localhost:4199/";
const OUT_DIR = process.argv[3] || "/tmp/axe-lo";

const SLUGS = [
  "first-contact", "about-me", "origins-and-languages", "current-location",
  "house-and-home", "family-friends", "opinions-matter", "free-time",
  "phoning-in-france", "making-arrangements", "going-to-a-cafe",
  "shopping-in-the-market", "daily-routine", "studying-at-university",
  "planning-a-holiday",
];

const STATES = [
  { key: "light", dark: false, interact: false },
  { key: "dark", dark: true, interact: false },
  { key: "interacted", dark: false, interact: true },
];

const AXE_OPTS = { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } };

async function interact(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const sel = 'main button:not([disabled]),main [role="button"],main [role="radio"],main input[type="radio"],main [role="checkbox"]';
    const els = Array.from(document.querySelectorAll(sel)).slice(0, 4);
    for (const el of els) {
      try { el.click(); await wait(120); } catch { /* ignore */ }
    }
    await wait(300);
  });
}

await mkdir(OUT_DIR, { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
const browser = await puppeteer.connect({ browserURL: `http://localhost:${chrome.port}`, defaultViewport: { width: 1350, height: 940 } });

const rows = [];
// tally: `${state}::${ruleId}::${impact}` -> {state, id, impact, help, pages:Set, nodes}
const tally = new Map();

for (const slug of SLUGS) {
  const url = `${BASE}?lo=${encodeURIComponent(slug)}`;
  for (const st of STATES) {
    const page = await browser.newPage();
    try {
      await page.goto(BASE, { waitUntil: "domcontentloaded" });
      await page.evaluate((d) => { if (d) sessionStorage.setItem("dark", "true"); else sessionStorage.removeItem("dark"); }, st.dark);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      if (st.interact) await interact(page);
      await page.evaluate(AXE_SRC);
      const results = await page.evaluate(async (opts) => await window.axe.run(document, opts), AXE_OPTS);

      const violations = results.violations.map((v) => ({
        id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
      rows.push({ slug, state: st.key, violations });
      for (const v of violations) {
        const k = `${st.key}::${v.id}::${v.impact}`;
        if (!tally.has(k)) tally.set(k, { state: st.key, id: v.id, impact: v.impact, help: v.help, pages: new Set(), nodes: 0 });
        const t = tally.get(k);
        t.pages.add(slug);
        t.nodes += v.nodes;
      }
      console.log(`${slug.padEnd(22)} ${st.key.padEnd(11)} violations=${violations.length}`);
    } catch (err) {
      rows.push({ slug, state: st.key, violations: [], error: String(err?.message || err) });
      console.log(`${slug.padEnd(22)} ${st.key.padEnd(11)} ERROR ${err?.message || err}`);
    } finally {
      await page.close().catch(() => {});
    }
  }
}

await browser.disconnect();
await chrome.kill();

const shared = [...tally.values()]
  .map((v) => ({ state: v.state, id: v.id, impact: v.impact, help: v.help, pageCount: v.pages.size, totalNodes: v.nodes, pages: [...v.pages] }))
  .sort((a, b) => b.pageCount - a.pageCount || b.totalNodes - a.totalNodes);

const summary = { base: BASE, states: STATES.map((s) => s.key), axeOpts: AXE_OPTS, shared, rows };
await writeFile(path.join(OUT_DIR, "_axe-summary.json"), JSON.stringify(summary, null, 2));

console.log("\n=== AXE VIOLATIONS (state :: rule :: impact — pages/nodes) ===");
if (shared.length === 0) console.log("  none — clean across all states");
for (const s of shared) {
  console.log(`${String(s.pageCount).padStart(2)}/15 x${String(s.totalNodes).padStart(3)}n  [${s.state}] ${s.impact}: ${s.id} — ${s.help}`);
}
console.log(`\nSummary: ${path.join(OUT_DIR, "_axe-summary.json")}`);
