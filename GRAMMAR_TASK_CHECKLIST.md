# Grammar Task Checklist (LO2)

## Baseline Audit
- [ ] Capture current LO2 grammar screenshots (desktop/mobile) for before/after comparison.
- [ ] Record current accessibility alerts specific to LO2 grammar.
- [ ] Confirm current modal behavior for `#subject-pronouns` links (`il`, `elle`, `ils`, `elles`).

## Config Refactor
- [ ] Update LO2 grammar config in `src/learningObjectConfigurations/fr/2.json` from single component to grouped grammar items.
- [ ] Keep section id/menu/title unchanged (`id: grammar`, `menuText: Grammar`, `titleText: Grammar and Usage`).
- [ ] Add section-level instructional framing for parity with LO1 (if approved).

## Component Refactor
- [ ] Split `LO2Grammar` into focused components (`LO2Grammar1`, `LO2Grammar2`, `LO2Grammar3`) in `src/components/CustomComponents_FR/CustomComponents_FR.jsx`.
- [ ] Preserve existing content order and audio references.
- [ ] Ensure each subsection remains independently maintainable.

## Accessibility / Semantics
- [ ] Replace pseudo heading paragraphs (`<p><strong>...`) with semantic headings.
- [ ] Confirm list structures use semantic list tags.
- [ ] Review and improve table semantics in conjugation content.
- [ ] Re-run WAVE checks for LO2 grammar and confirm reduction in "Possible heading" alerts.

## Modal Links
- [ ] Add explicit modal mapping for `subject-pronouns` target in app modal resolver.
- [ ] Implement modal body content:
  - [ ] Il is used to replace a masculine noun.
  - [ ] Elle is used to replace a feminine noun.
  - [ ] Ils is used to replace more than one masculine noun or a mixture of masculine and feminine nouns.
  - [ ] Elles is used to replace more than one feminine noun.
  - [ ] iel is a gender-neutral singular pronoun.
- [ ] Apply existing highlight style conventions used in LO1 modal content.

## Audio Consistency
- [ ] Verify grammar audio uses standardized `AudioClip` interaction classes/components.
- [ ] Identify any legacy inline audio-link usage in LO2 grammar/pronunciation for future normalization.

## QA
- [ ] Check LO2 grammar layout parity with LO1 visual rhythm (accordion/card spacing, alert behavior, typography).
- [ ] Validate no regressions in LO1 grammar modal behavior.
- [ ] Validate no regressions in unrelated exercise components.
- [ ] Build verification: `yarn build`.

## Documentation
- [ ] Update `README.md` status after implementation.
- [ ] Add concrete completed-task notes to `CHANGES.md`.
- [ ] Mark completed items in this checklist.

