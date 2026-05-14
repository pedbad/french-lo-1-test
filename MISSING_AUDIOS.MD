# Missing Audio Placeholders

## Status

1 known missing audio placeholder — see active entries below.

## Active (file wired in code, not yet recorded)

- LO9 Grammar — Telephone regions map, mobile legend entry
  - Runtime path: `audio/lo9/grammar/telephone-regions/007-mobile-06-07.mp3`
  - Wired in: `src/components/custom/grammar/phoning-in-france-regions-map.jsx` (`LEGEND_ITEMS`, `06 / 07` entry)
  - Content needed: *zéro six, zéro sept* (the two mobile prefixes spoken aloud)
  - Effect until resolved: the `06 / 07 Mobile (nationwide)` legend button renders correctly but produces no audio when clicked.

## Recently Resolved

- LO2 Grammar and Usage - Subject pronouns (Accordion 3)
  - Runtime path: `audio/lo2/grammar/grammar-and-usage/025-iel.mp3`
  - Current source location: `src/components/custom/grammar/about-me-grammar.jsx` (`AboutMeSubjectPronounsBody`)
  - File exists at: `public/audio/lo2/grammar/grammar-and-usage/025-iel.mp3`

Add new entries here only when a runtime audio reference is intentionally wired before the corresponding file exists.
