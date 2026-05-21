# Accessibility (WAVE) Compliance

This file tracks the ongoing accessibility audit and fixes for all learning objects (LOs).
Checks are carried out using the [WAVE browser extension](https://wave.webaim.org/extension/).

---

## Why

WAVE was reporting two categories of alerts across the pronunciation and grammar sections:

- **Possible heading** — short `<p>` elements (especially those starting with `<strong>`, ending in a colon, or standing alone on one line) that visually look like headings but are not marked up as heading elements.
- **Skipped heading level** — a heading jumps from `<h2>` to `<h4>` without an `<h3>` in between, which breaks the document outline for screen readers.

---

## Golden rule: teacher content is never sacrificed for WAVE compliance

**The teacher's words, sentences, and paragraph structures must be preserved exactly as written.** WAVE compliance is achieved by adding structural elements (headings, semantic tags) around or above the content — never by rewriting, reordering, or removing what the teacher wrote.

Acceptable fixes that do not alter teacher content:
- Adding an `<h3>` or `<h4>` heading above existing paragraphs
- Changing a `<p><strong>NB…</strong></p>` label to `<h4>NB…</h4>` (same words, better tag)
- Changing a `<p><strong>How to pronounce:</strong></p>` label to `<h4>How to pronounce:</h4>`
- Changing mobile card `<p>Form:</p>` labels to `<div>` (UI chrome, not teacher prose)
- **Merging two consecutive teacher sentences into one `<p>` is only acceptable if both sentences are present in full and the meaning is identical — no words added, removed, or reordered**

Not acceptable:
- Rewriting a teacher sentence to make it longer, shorter, or differently worded
- Removing a sentence because it happens to end with a colon
- Changing punctuation (e.g. colon → period) to trick WAVE
- Adding words the teacher did not write

If a teacher sentence genuinely triggers a WAVE "possible heading" alert and cannot be fixed without altering the wording, **accept the WAVE alert and document it as a known exception below** rather than changing the content.

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
| LO6 | `family-friends`        | ✅ done  | ✅ done        | h3 headings added (Double ll x3, grammar × 2); "How to pronounce:" → h4; NB → h4; "Verbs in French continued" → h4 |
| LO7 | `opinions-matter`       | ✅ done  | ✅ done        | h3 headings added (pronunciation × 2, grammar × 3); NB → h4; legacy wrappers removed |
| LO8 | `free-time`             | ⬜ todo  | ✅ done        | h3 headings added; short intro paragraphs merged in grammar (4 tabs) |
| LO9 | `phoning-in-france`     | ✅ done  | ✅ done        | h3 headings added (pronunciation × 2, grammar × 2); NB → h4; legacy wrappers removed; short paragraphs merged |
| LO10 | `making-arrangements`  | ⬜ todo  | ⬜ todo        | |
| LO11 | `going-to-a-cafe`      | ⬜ todo  | ⬜ todo        | |
| LO12 | `shopping-in-the-market` | ⬜ todo | ⬜ todo       | |
| LO13 | `daily-routine`        | ⬜ todo  | ⬜ todo        | |
| LO14 | `studying-at-university` | ⬜ todo | ⬜ todo       | |

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

### LO6 — Family & Friends (`family-friends`)
- `src/components/custom/pronunciation/family-friends-and-neighbours-pronunciation.jsx`
  - Removed legacy container/panel wrapper divs
  - Added `<h3>1. Double ll pronounced l</h3>`
  - `<p><strong>How to pronounce double ll in French:</strong></p>` → `<h4>` (same text, better tag)
  - Added `<h3>2. Double ll pronounced y</h3>`
  - Added `<h3>3. Exceptions</h3>`
  - NB: `<p><strong>NB</strong>` → `<h4>`
  - All teacher sentences preserved exactly

### LO6 — Family & Friends grammar update
- `src/components/custom/grammar/family-friends-and-neighbours-grammar.jsx`
  - Removed legacy lo6-grammar*-container/panel wrapper divs (Tab 1 and Tab 2)
  - Added `<h3>1. Possessive adjectives</h3>`
  - Merged "Here is a complete list of the possessive adjectives:" into preceding paragraph (all words preserved)
  - Added `<h3>2. The verb <em>avoir</em></h3>`
  - `<p><strong>Verbs in French continued</strong></p>` → `<h4>` (same words, better tag)
  - `FamilyFriendsAndNeighboursDoubleLlPractice` is used in exercises section — left unchanged

### LO7 — Opinions Matter (`opinions-matter`)
- `src/components/custom/pronunciation/opinions-matter-pronunciation.jsx`
  - Removed legacy container/panel wrapper divs
  - Added `<h3>1. Words borrowed from English</h3>`
  - Added `<h3>2. Sounded final consonants</h3>`
  - NB: `<p><strong>NB</strong>` → `<h4>`
  - "Listen again to these examples:" logged as known WAVE exception (no preceding sentence to merge with)
- `src/components/custom/grammar/opinions-matter-grammar.jsx`
  - Removed legacy container/panel wrapper divs
  - Added `<h3>1. Borrowed nouns and gender</h3>`
  - Added `<h3>2. Likes, dislikes, articles, and infinitives</h3>`
  - Added `<h3>3. Quel, quelle, quels, quelles</h3>`
  - All teacher sentences preserved exactly

### LO9 — Phoning in France (`phoning-in-france`)
- `src/components/custom/pronunciation/phoning-in-france-pronunciation.jsx`
  - Removed legacy lo9-pronunciation*-container/panel wrapper divs
  - Added `<h3>1. Numbers 5–10</h3>`
  - Merged "Listen and repeat:" into preceding paragraph (all words preserved)
  - Added `<h3>2. Final consonants in connected speech</h3>`
  - Merged "For example:" into preceding paragraph (all words preserved)
- `src/components/custom/grammar/phoning-in-france-grammar.jsx`
  - Removed legacy lo9-grammar*-container/panel wrapper divs
  - Fixed hardcoded `id="RegionalTelephoneMap"` → `id={id || undefined}`
  - Added `<h3>1. Telephone numbers in France</h3>`
  - NB: `<p><strong>NB</strong>` → `<h4>`
  - Added `<h3>2. Using <em>bien</em> for confirmation</h3>`
  - All teacher sentences preserved exactly

### LO8 — Free Time (`free-time`)
- `src/components/custom/pronunciation/free-time-pronunciation.jsx`
  - Removed legacy container/panel wrapper divs
  - Added `<h3>1. The French -tion sound</h3>`
  - Added `<h3>2. More words with -tion</h3>`
  - Teacher sentences preserved exactly
- `src/components/custom/grammar/free-time-grammar.jsx`
  - Merged short intro phrases into preceding paragraphs across all 4 grammar tabs

---

## Known WAVE exceptions (accepted, teacher content preserved)

These alerts are left in place because fixing them would require altering teacher content, which is not permitted.

| LO  | Location | Alert type | Teacher text | Reason accepted |
|-----|----------|------------|-------------|-----------------|
| LO6 | Pronunciation Tab 1 | Possible heading | "Listen to these examples:" | Short standalone sentence ending in colon; teacher wording retained |
| LO6 | Pronunciation Tab 2 | Possible heading (hidden) | "Practise a few more familiar words with the same sound:" | Teacher wording retained; hidden tab so low impact |
| LO7 | Pronunciation Tab 2 | Possible heading | "Listen again to these examples:" | Short standalone sentence ending in colon; no preceding paragraph to merge with; teacher wording retained |
