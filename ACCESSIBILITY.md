# Accessibility (WAVE) Compliance

This file tracks the ongoing accessibility audit and fixes for all learning objects (LOs).
Checks are carried out using the [WAVE browser extension](https://wave.webaim.org/extension/).

---

## Why

WAVE was reporting two categories of alerts across the pronunciation and grammar sections:

- **Possible heading** — short `<p>` elements (especially those starting with `<strong>`, ending in a colon, or standing alone on one line) that visually look like headings but are not marked up as heading elements.
- **Skipped heading level** — a heading jumps from `<h2>` to `<h4>` without an `<h3>` in between, which breaks the document outline for screen readers.

---

## How to audit an LO with WAVE

### The problem with tabs and accordions

WAVE only analyses what is **in the DOM at the time it runs**. In this app, inactive tab panels are present in the DOM but hidden with CSS (`display: none` or `visibility: hidden`). WAVE skips hidden elements, so alerts inside inactive tabs are invisible unless you force everything visible first.

### Step-by-step audit process

1. **Open the LO** in Chrome/Firefox at `http://localhost:5173/<slug>/`
2. **Disable all CSS** so every tab panel and accordion is forced visible:
   - Chrome: open DevTools → three-dot menu → **More tools → Coverage** (or use the Command menu `⌘⇧P` → "Disable JavaScript" won't help — you want CSS). Easiest method: install the **Web Developer** browser extension → **CSS → Disable All Styles**.
   - Alternative: in the browser console run:
     ```js
     document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.disabled = true);
     ```
   - With CSS off, all tab panels, accordions, and hidden sections become visible as plain unstyled HTML.
3. **Run WAVE** (click the extension icon). All alerts across every tab and section will now be reported in one pass.
4. **Note the alert count and types** before touching any code.
5. **Re-enable CSS** (reload the page), fix the issues in the source files, reload and re-run WAVE to confirm 0 alerts.

### What to look for

| WAVE alert | Typical cause in this codebase | Fix |
|---|---|---|
| Possible heading | Short `<p>` starting with `<strong>`, or ending in a colon | Convert to `<h3>`/`<h4>`, or merge into adjacent paragraph |
| Possible heading | `<p><strong>How to pronounce:</strong></p>` | `<h4>How to pronounce:</h4>` |
| Possible heading | `<p><strong>NB</strong> …</p>` inside `<Info>` box | `<h4 className="…"><strong>NB</strong> …</h4>` |
| Skipped heading level | h2 → h4 with no h3 between | Add missing `<h3>` section heading inside tab panel |
| Possible heading | Mobile card `<p>Form:</p>`, `<p>Examples:</p>` etc. | Change `<p>` → `<div>` |

---

## Heading hierarchy pattern (all LOs)

Every pronunciation section follows this structure:

```
h2  Pronunciation Focus          ← section title (rendered by the shell)
  h3  1. <tab title>             ← content heading inside each tab panel
    h4  How to pronounce:        ← sub-label where present
    h4  NB …                     ← NB/warning sub-label where present
  h3  2. <tab title>
    h4  NB …
```

Tab labels in the UI (the clickable tabs) are **not** headings — they are navigation elements. The `h3` inside the tab panel is the document heading and must be kept even though it repeats the tab label text.

Short standalone `<p>` elements that would trigger WAVE (e.g. "Listen to the following:", "Compare these:") are merged into the preceding paragraph.

The same `h3` / `h4` pattern applies to grammar sections.

---

## Status by LO

| LO  | Slug                    | Grammar | Pronunciation | Notes |
|-----|-------------------------|---------|---------------|-------|
| LO1 | `first-contact`         | ✅ done  | ✅ done        | Reference implementation — untouched during a11y work |
| LO2 | `about-me`              | ✅ done  | ✅ done        | h3 headings restored; letter card labels → h4 |
| LO3 | `origins-and-languages` | ✅ done  | ✅ done        | h3 headings restored; short intro paragraphs merged |
| LO4 | `current-location`      | ✅ done  | ✅ done        | h3 headings restored; NB → h4; inline audio icon fixed |
| LO5 | `house-and-home`        | ✅ done  | ✅ done        | h3 headings added; "How to pronounce:" → h4; NB → h4 |
| LO6 | `free-time`             | ⬜ todo  | ⬜ todo        | |
| LO7 | `family-friends`        | ⬜ todo  | ⬜ todo        | |
| LO8 | `shopping`              | ⬜ todo  | ⬜ todo        | |
| LO9 | `making-arrangements`   | ⬜ todo  | ⬜ todo        | |
| LO10 | `opinions-matter`      | ⬜ todo  | ⬜ todo        | |
| LO11 | `phoning-in-france`    | ⬜ todo  | ⬜ todo        | |
| LO12–LO15 | remaining LOs   | ⬜ todo  | ⬜ todo        | |

---

## Files changed per LO

### LO2 — About Me
- `src/components/custom/pronunciation/about-me-pronunciation.jsx`
  - Restored `<h3>1. Silent letters at the end of a word</h3>`
  - Restored `<h3>2. The French "th"</h3>`
  - Letter card labels: `<h3>` → `<h4>`
  - NB box label: `<p><strong>NB</strong>` → `<h4>`

### LO3 — Origins and Languages
- `src/components/custom/pronunciation/origins-and-languages-pronunciation.jsx`
  - Restored `<h3>1. Silent -ent endings</h3>`
  - Restored `<h3>2. Final consonants and liaison</h3>`
  - Restored `<h3>3. The sound "eh"</h3>`
  - Merged short standalone paragraphs into preceding sentences

### LO4 — Current Location
- `src/components/custom/grammar/current-location-grammar.jsx`
  - Mobile card labels: `<p>` → `<div>` (eliminated 23 possible-heading alerts)
- `src/components/custom/pronunciation/current-location-pronunciation.jsx`
  - Restored `<h3>1. The nasal sound "in / ain"</h3>`
  - Added `<h4>How to pronounce:</h4>`
  - Restored `<h3>2. Related spellings with the same sound</h3>`
  - NB: `<h3>` → `<h4>`
  - Restored `<h3>3. Final "en / ens" with the same sound</h3>`
  - Fixed inline audio clip (`inline` prop) so icon flows within paragraph text

### LO5 — House and Home
- `src/components/custom/pronunciation/house-and-home-pronunciation.jsx`
  - Removed legacy container/panel wrapper divs
  - Added `<h3>1. Nasal sound: an</h3>`
  - `<p><strong>How to pronounce:</strong></p>` → `<h4>How to pronounce:</h4>`
  - Merged "Listen to these examples…" into preceding paragraph
  - Added `<h3>2. Related spellings</h3>`
  - NB: `<p><strong>NB</strong>` → `<h4>`
