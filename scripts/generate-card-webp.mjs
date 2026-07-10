// Rasterizes the 15 learning-object intro SVG illustrations to WebP siblings.
//
// Why: each intro SVG is a 200–700 KB detailed vector (~5.5 MB total). They are
// rendered small — as landing-page cards (aspect-[3/2], object-cover, ~350–500 px
// wide) and as an LO-page intro card image. A rasterized WebP at 1200 px wide is
// visually indistinguishable at those sizes but ~10× smaller, which is the dominant
// Lighthouse performance lever for the landing page.
//
// The .webp files are written next to their .svg source and committed to the repo.
// Both `src/index-fr.json` (landing cards) and `src/lo-config/*.json` (LO hero)
// reference the .webp. Re-run with `yarn assets:webp` if the source SVGs change.

import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");

// The 15 landing-card / LO-hero intro illustrations, relative to public/.
const CARDS = [
  "img/lo1/first-contact.svg",
  "img/lo2/about-me.svg",
  "img/lo3/origins-and-languages.svg",
  "img/lo4/current-location.svg",
  "img/lo5/house-and-home.svg",
  "img/lo6/family-friends-neighbours.svg",
  "img/lo7/opinions-matter.svg",
  "img/lo8/free-time.svg",
  "img/lo9/phoning-in-france.svg",
  "img/lo10/making-arrangements.svg",
  "img/lo11/out-and-about-cafe.svg",
  "img/lo12/out-and-about-shopping.svg",
  "img/lo13/daily-routine.svg",
  "img/lo14/studying-at-university.svg",
  "img/lo15/planning-a-holiday.svg",
];

const TARGET_WIDTH = 800; // cards render ~340px; 800px keeps 2× DPR headroom
const DENSITY = 300; // rasterize SVG at high DPI before downscaling for sharp edges
const QUALITY = 78;

let totalSvg = 0;
let totalWebp = 0;

for (const rel of CARDS) {
  const svgPath = path.join(PUBLIC, rel);
  if (!existsSync(svgPath)) {
    console.error(`MISSING source: ${rel}`);
    process.exitCode = 1;
    continue;
  }
  const webpPath = svgPath.replace(/\.svg$/, ".webp");
  const svgBuf = await readFile(svgPath);

  const info = await sharp(svgBuf, { density: DENSITY })
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(webpPath);

  const svgKb = svgBuf.length / 1024;
  const webpKb = info.size / 1024;
  totalSvg += svgKb;
  totalWebp += webpKb;
  console.log(
    `${rel.padEnd(42)} ${svgKb.toFixed(0).padStart(4)} KB svg -> ` +
      `${webpKb.toFixed(0).padStart(3)} KB webp (${info.width}x${info.height})`,
  );
}

console.log(
  `\nTOTAL ${totalSvg.toFixed(0)} KB svg -> ${totalWebp.toFixed(0)} KB webp ` +
    `(${(100 - (totalWebp / totalSvg) * 100).toFixed(1)}% smaller)`,
);
