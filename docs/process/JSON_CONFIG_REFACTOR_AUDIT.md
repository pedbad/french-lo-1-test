# JSON Config Refactor Audit

## Purpose
Provide a repeatable audit method for `src/lo-config/*.json` so we can:

- identify keys actually consumed by runtime
- remove dead/legacy keys safely
- normalize naming conventions to reduce drift

This file starts with LO1 (`first-contact.json`) findings and serves as the baseline for auditing all remaining LO configs.

## Runtime Contract (Current)

Primary loader/normalizer:
- `src/App.jsx`

Current behavior:
- LO config files are loaded from `/src/lo-config/<slug>.json`
- legacy aliases are normalized:
  - `infoTextHTML` -> `informationTextHTML`
  - `infoText` -> `informationText`
  - PhraseTable `instructionsTextHTML`/`instructionsText` can be lifted to `informationTextHTML`/`informationText`

Implication:
- alias keys still work, but they are technical debt and should be migrated to canonical keys in config.

## Mapping Decision (Locked)

We will move from numeric `file` mapping to **slug-only mapping** with a strict migration rule:

- config filename must match slug (`src/lo-config/<slug>.json`)
- index entries should use `slug` as the single source of truth for config lookup
- do **not** keep dual fallback support (`file` + `slug`) during migration

Reason:
- dual support increases drift risk between URL route, index metadata, and config file naming.

## LO1 Audit (`src/lo-config/first-contact.json`)

### Confirmed dead/legacy keys (safe removal candidates)

1. `settings.flag`
- Location: `src/lo-config/first-contact.json:4`
- Reason: no current app render path consumes it.

2. `settings.targetLanguage`
- Location: `src/lo-config/first-contact.json:6`
- Reason: runtime uses `targetLanguageCode`; this string is unused.

3. `dialogues.instructionsTextHTMLOld`
- Location: `src/lo-config/first-contact.json:14`
- Reason: no runtime reader for `*Old` keys.

4. `phrases4.instructionsTextHTMLXXX`
- Location: `src/lo-config/first-contact.json:466`
- Reason: non-schema debug/test key, never consumed.

### Naming drift (works via compatibility, should normalize)

1. `infoTextHTML` still used in grammar nodes
- Locations:
  - `src/lo-config/first-contact.json:304`
  - `src/lo-config/first-contact.json:312`
- Current status: works via alias normalization.
- Target: use `informationTextHTML` directly in config.

### Content style drift (editorial consistency)

1. `Enchanté.e` notation
- Location: `src/lo-config/first-contact.json:290`
- Drift: notation differs from `(e)` style used in other units.
- Action: decide one project-wide convention and normalize.

## Content Notation Standard (Locked)

To prevent cross-LO editorial drift, all `src/lo-config/*.json` must follow:

1. Gender-inclusive compact forms:
- use `(e)` only
- examples: `marié(e)`, `étudiant(e)`, `né(e)`, `stressé(e)`
- do not use `.e` forms

2. Optional plural forms:
- use `(s)` directly attached to the word
- examples: `horse(s)`, `lecture(s)`
- do not use `word (s)` style

3. Spacing hygiene:
- no double spaces introduced around converted forms
- no trailing spaces in phrase strings

## Project-Wide JSON Refactor Rules

1. Keep canonical keys only:
- `informationText`, `informationTextHTML`
- `instructionsText`, `instructionsTextHTML`
- remove alias keys once migrated

2. Remove known dead key patterns:
- `*Old`
- ad-hoc test suffix keys (e.g. `*XXX`)

3. Keep only active settings keys:
- retain `targetLanguageCode` when speech depends on it
- remove `targetLanguage`/`flag` if not consumed by runtime

4. Keep behavior unchanged during cleanup:
- no component switching during key cleanup pass
- refactor key names/unused fields first

5. Keep notation standardized:
- enforce `(e)` / `(s)` conventions in learner-facing phrase text
- reject mixed notation during review (`.e`, `word (s)`)

## Recommended Rollout

1. Audit each LO config file against runtime usage.
2. For each LO touched:
   - rename config file to slug immediately
   - update index entry to slug-only mapping for that LO immediately
   - remove dead/legacy keys in the same pass
3. Build + LO smoke test after each LO migration.
4. Record decisions and migrated files in `CHANGES.md`.

## Future Files To Audit

- `src/lo-config/about-me.json`
- `src/lo-config/origins-and-languages.json`
- `src/lo-config/current-location.json`
- ... through all LO slug files in `src/lo-config/`
- `src/lo-config/demo.json`
- `src/lo-config/answer-table-test.json`
