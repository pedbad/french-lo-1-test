# Table Audit Pass

Last updated: 2026-02-16
Repo: `/Users/ped/Sites/french/french-lo-1`

## Why This File Exists

WAVE and validator runs flagged layout-table and heading issues during the accessibility pass.
This document records what was fixed, why it was fixed, and the repeatable audit checklist for future work.

## What Was Fixed In The Last Two WAVE Issues

1. `Possible heading`
- Issue: hero title text looked like a heading but was rendered as non-heading text.
- Fix: switched hero title back to a semantic heading element in `/Users/ped/Sites/french/french-lo-1/src/App.jsx`.
- Why: heading-like content should use heading tags so assistive technology receives correct document structure.

2. `Layout table`
- Issue: at least one rendered table had no header cells and was interpreted as layout-only.
- Fix: added semantic table structure to Error Log in `/Users/ped/Sites/french/french-lo-1/src/components/ErrorLog/ErrorLog.jsx`:
  - added `TableCaption`
  - added `TableHeader` with `TableHead` cells.
- Additional mitigations applied:
  - layout/puzzle tables marked presentational in:
    - `/Users/ped/Sites/french/french-lo-1/src/components/WordGrid/WordGrid.jsx`
    - `/Users/ped/Sites/french/french-lo-1/src/components/CrossWord/CrossWord.jsx`
    - `/Users/ped/Sites/french/french-lo-1/src/components/ConnectFour/ConnectFour.jsx`
  - data table semantics strengthened in:
    - `/Users/ped/Sites/french/french-lo-1/src/components/PhraseTable/PhraseTable.jsx`

3. `Layout table` in LO1 pronunciation exercise (`WordParts`)
- Issue: `WordParts` (for example `1. Identify pronunciation features`) used a non-data `<table>` for row alignment, which still triggers layout-table alerts.
- Fix: replaced the layout table with semantic row containers (`.word-parts-grid` / `.word-parts-row`) in:
  - `/Users/ped/Sites/french/french-lo-1/src/components/WordParts/WordParts.jsx`
  - `/Users/ped/Sites/french/french-lo-1/src/index.css`
- Why: this removes layout-table markup entirely while preserving interaction behavior and visual structure.

## Important Triage Note (Avoid False Diagnosis)

WAVE snippets that show `chrome-extension://.../table_layout.svg` are extension overlay artifacts, not app source markup.
Use those snippets to find nearby DOM, but verify against actual project-rendered elements.

## Table Audit Checklist (What To Check And Why)

1. Inventory every rendered `<table>` in `src/components`.
- Why: hidden/conditional tables often get missed and still trigger alerts.

2. Classify each table as `Data` or `Layout`.
- Why: the remediation is different and should be explicit.

3. If `Data`, require all of:
- caption (`<caption>` or `TableCaption`)
- header cells (`<th>`/`TableHead`)
- header scope (`scope="col"`/`scope="row"` where relevant)
- logical row/column reading order.
- Why: ensures WCAG info/relationship semantics and predictable screen-reader navigation.

4. If `Layout`, replace with flex/grid where feasible.
- Why: tables for visual layout create unnecessary table-navigation overhead for assistive technology.

5. If immediate replacement is not feasible, apply temporary mitigation:
- `role="presentation"` on the table.
- Why: reduces table-announcement noise while migration is in progress.

6. Check empty or hidden tables (`tbody` present, no meaningful header/content).
- Why: these are common layout-table alerts.

7. Check interactive controls inside table cells.
- Why: keyboard order and focus behavior can still be broken even when table semantics are correct.

8. Validate in clean environment:
- build + preview output
- incognito profile with extensions disabled
- W3C textarea validation and WAVE scan.
- Why: avoids dev-server and extension-injected noise.

## Quick Commands

```bash
# List table usage in source
rg -n "<table|<Table>|TableHead|TableHeader|TableCaption" src/components src/App.jsx

# Build production output before validation
yarn build
```

## Definition Of Done For Table Pass

1. No layout tables remain unless explicitly temporary and marked `role="presentation"`.
2. Every data table has caption + header semantics.
3. No new WAVE `Layout table` alerts attributable to app DOM.
4. Behavior and visual parity are unchanged after refactor.
