# JSON Config Refactor Audit

## Purpose
Provide a repeatable audit method for `src/lo-config/*.json` so we can:

- identify keys actually consumed by runtime
- remove dead/legacy keys safely
- normalize naming conventions to reduce drift

This file starts with LO1 (`1.json`) findings and serves as the baseline for auditing all remaining LO configs.

## Runtime Contract (Current)

Primary loader/normalizer:
- `src/App.jsx`

Current behavior:
- LO config files are loaded from `/src/lo-config/<file>.json`
- legacy aliases are normalized:
  - `infoTextHTML` -> `informationTextHTML`
  - `infoText` -> `informationText`
  - PhraseTable `instructionsTextHTML`/`instructionsText` can be lifted to `informationTextHTML`/`informationText`

Implication:
- alias keys still work, but they are technical debt and should be migrated to canonical keys in config.

## LO1 Audit (`src/lo-config/1.json`)

### Confirmed dead/legacy keys (safe removal candidates)

1. `settings.flag`
- Location: `src/lo-config/1.json:4`
- Reason: no current app render path consumes it.

2. `settings.targetLanguage`
- Location: `src/lo-config/1.json:6`
- Reason: runtime uses `targetLanguageCode`; this string is unused.

3. `dialogues.instructionsTextHTMLOld`
- Location: `src/lo-config/1.json:14`
- Reason: no runtime reader for `*Old` keys.

4. `phrases4.instructionsTextHTMLXXX`
- Location: `src/lo-config/1.json:466`
- Reason: non-schema debug/test key, never consumed.

### Naming drift (works via compatibility, should normalize)

1. `infoTextHTML` still used in grammar nodes
- Locations:
  - `src/lo-config/1.json:304`
  - `src/lo-config/1.json:312`
- Current status: works via alias normalization.
- Target: use `informationTextHTML` directly in config.

### Content style drift (editorial consistency)

1. `Enchanté.e` notation
- Location: `src/lo-config/1.json:290`
- Drift: notation differs from `(e)` style used in other units.
- Action: decide one project-wide convention and normalize.

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

## Recommended Rollout

1. Audit each LO config file against runtime usage.
2. Apply dead-key removal + canonical-key normalization in small batches.
3. Build + smoke test each batch.
4. Record decisions in `CHANGES.md`.

## Future Files To Audit

- `src/lo-config/2.json`
- `src/lo-config/3.json`
- `src/lo-config/4.json`
- ... through `src/lo-config/15.json`
- `src/lo-config/demo.json`
- `src/lo-config/answer.json`
- `src/lo-config/summer.json`
