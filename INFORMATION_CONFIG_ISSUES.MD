# INFORMATION_CONFIG_ISSUES

## Problem Summary

Instructional content in this app is currently authored across multiple config keys that represent overlapping intent. Because those keys render through different component paths, visually similar content is styled differently. This is causing UI rendering drift.

## Why This Causes Drift

The same type of content (instructional guidance) appears in different fields:

- `informationTextHTML`
- `informationText`
- `instructionsTextHTML`
- `instructionsText`
- `infoTextHTML` (legacy)
- `infoText` (legacy)
- `informationHTML` (settings-level)

These fields are not rendered by a single component contract:

- Alert-style path: `src/components/Info/Info.jsx`
- Section instruction path: `src/components/Section/Section.jsx`
- Hero/intro instruction path: `src/components/HeroSection/HeroSection.jsx`

Result:

- Identical strings (for example: “Read each phrase, then play its audio clip...”) can render in different font sizes, spacing, and hierarchy depending on which field was used.
- Heading-like content such as “You will learn:” may appear larger/smaller depending on whether authored as `<h3>` in one field or plain text in another.
- Developers must remember multiple key conventions, increasing authoring mistakes and regressions.

## Why We Have So Many Similar Keys

These keys exist because the app evolved in phases, not from a single schema design:

1. `informationTextHTML` / `informationText`
- Added for reusable boxed info/guidance content rendered by the `Info` component.
- This became the closest thing to a standard “alert-style instructional text” field.

2. `instructionsTextHTML` / `instructionsText`
- Added for section-level instructions near section headers/content.
- Intended for plain instructional blocks, not always boxed alerts.

3. `infoTextHTML` / `infoText` (legacy)
- Earlier naming used in older LO config authoring.
- Still supported for backward compatibility, but semantically overlaps with `informationText*`.

4. `informationHTML` (settings-level)
- Top-level LO intro/overview content under `settings`.
- Not per-component; used for learning-object introduction cards/hero info.

In short: the keys reflect different historical authoring conventions plus backward compatibility.  
The problem is that overlapping intent (“instructional guidance text”) ended up spread across multiple key families.

## Concrete Symptoms Seen

- Intro info alert text and phrase-table guidance text are inconsistent in size.
- Pronunciation/grammar info blocks do not always match the same visual hierarchy.
- Same sentence appears in both alert and non-alert wrappers depending on JSON key choice.
- Grammar custom accordions could render duplicated alert boxes when both wrapper-level and child-level info paths were active.

## Root Cause

Primary: **configuration schema inconsistency** (multiple overlapping keys for the same intent).  
Secondary: **component branching** (different render components and wrappers for each key family).

## Recommended Target Model (Single Source of Truth)

Use one canonical field per intent:

1. `instructionsLayout` for section intro prose/layout (non-alert).
2. `informationTextHTML` for boxed instructional guidance (alert-style).

Deprecate for new authoring:

- `infoText`, `infoTextHTML`
- Using `instructionsText*` for alert-style guidance text

## Migration Strategy

### Phase 1: Runtime Compatibility Adapter

Add a normalization layer in app render prep to map legacy fields into canonical fields before component rendering:

- `infoTextHTML` -> `informationTextHTML`
- `infoText` -> `informationText`
- For components where boxed guidance is intended, map legacy `instructionsText*` to `informationTextHTML` as needed.

This preserves existing LO behavior while reducing drift immediately.

### Phase 2: Config Cleanup

Migrate LO JSON files to canonical keys only:

- Replace legacy key usage.
- Remove duplicated guidance across `instructions*` and `information*` on same nodes.
- Keep semantics clear: intro prose vs alert guidance.

### Phase 3: Guardrails

Add a config guard script and enforce it in pre-commit:

- Block new `infoText` / `infoTextHTML`.
- Block mixed `instructions*` + `information*` for same intent on same node.
- Optionally lint for required canonical fields by component type.

## Step-by-Step TODO

1. Audit all `src/learningObjectConfigurations/fr/*.json` for key usage and duplicates.
2. Implement normalization adapter in `src/App.jsx` before render dispatch.
3. Verify `Info` remains the single alert-style renderer for instructional guidance.
4. Batch-migrate LO JSON:
   - Batch A: LO1-LO5
   - Batch B: LO6-LO10
   - Batch C: LO11-LO15 + `demo.json`
5. Remove legacy branching paths once all config is migrated.
6. Add `yarn check:config-instruction-schema` script.
7. Add pre-commit hook entry for schema check.
8. Document authoring contract in `README.md`.
9. Run visual QA (desktop/mobile, light/dark) on all sections.
10. Run accessibility and W3C validation pass after migration.

## Latest Fixes (Current Branch)

- Removed duplicate info render injection in `src/App.jsx` for non-tab `Group` and expandable custom component paths.
- Kept tab-specific info rendering, but switched it to canonical keys first (`informationText*` with legacy fallback).
- Added explicit typography fallback rules for `.information .info-content` in `src/index.css` so React-children alerts (for example Pronunciation tab custom components) match config-HTML alert styling.

## Migration Checklist

- [ ] Canonical field contract approved (`instructionsLayout` vs `informationTextHTML`).
- [x] Runtime adapter added and tested.
- [x] Duplicate non-tab info render path removed (`App.jsx` single-owner behavior).
- [x] Alert typography parity fallback added for children-based info content.
- [ ] Legacy key mapping covered in adapter tests.
- [ ] LO JSON migration Batch A complete.
- [ ] LO JSON migration Batch B complete.
- [ ] LO JSON migration Batch C complete.
- [ ] No new `infoText*` keys in repo.
- [ ] Pre-commit schema guard enabled.
- [ ] README authoring rules updated.
- [ ] Visual parity sign-off complete.
- [ ] Accessibility/W3C validation sign-off complete.

## Definition of Done

- Instructional content renders with consistent typography and hierarchy regardless of section/component.
- Config authoring uses canonical keys only.
- Guardrails prevent regression into mixed/legacy instruction field usage.
