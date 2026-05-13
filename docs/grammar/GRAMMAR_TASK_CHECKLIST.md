# Grammar Task Checklist (LO2)

> **Status: Core refactor complete (2026-05).** Remaining items are future improvements, not blockers.

## Baseline Audit
- [x] Config updated from single `LO2Grammar` component to grouped `Group` + focused sub-components.
- [x] Component split implemented in `src/components/custom/grammar/about-me-grammar.jsx`.
- [x] LO1 parity achieved — LO2 grammar renders via `AccordionArticle` with same hover/expand/card behavior.

## Config Refactor
- [x] Update LO2 grammar config in `src/lo-config/about-me.json` from single component to grouped grammar items.
- [x] Section id/menu/title unchanged (`id: grammar`, `menuText: Grammar`, `titleText: Grammar and Usage`).
- [x] Section-level instructional framing added for parity with LO1.

## Component Refactor
- [x] Split `LO2Grammar` into focused components (`AboutMeGrammarVerbs`, `AboutMeGrammarGenderAndArticles`, `AboutMeGrammarSubjectPronouns`).
- [x] Existing content order and audio references preserved.
- [x] Each subsection independently maintainable.
- [x] LO2 Grammar rendered via `AccordionArticle` (parity with LO1).
- [ ] **Future:** Introduce a shared shadcn-native lesson accordion wrapper (`LessonAccordion`) for long-term cross-LO reuse — not a current blocker.

## Accessibility / Semantics
- [ ] **Future improvement:** Replace any remaining pseudo heading paragraphs (`<p><strong>...`) with semantic headings.
- [ ] **Future improvement:** Re-run WAVE checks on LO2 grammar and confirm reduction in "Possible heading" alerts.

## Modal Links
- [ ] **Future improvement:** Add explicit modal mapping for `subject-pronouns` target in app modal resolver.
- [ ] **Future improvement:** Implement richer modal body content for il/elle/ils/elles/iel.

## Audio Consistency
- [x] Audio migration complete — all LO2 grammar audio uses `AudioClip` and migrated to `audio/lo2/` paths.

## QA
- [x] LO2 grammar layout parity with LO1 visual rhythm verified.
- [x] Build verification: `yarn build` passes.

## Documentation
- [x] `README.md` status updated.
- [x] `CHANGES.md` updated.
- [x] Checklist reflects final state.

## Carry-Forward Architecture Checks (Template for Future LOs)
- [ ] Verify LO grammar config shape parity against a known-good LO (prefer `Group` + grammar sub-items).
- [ ] Verify LO grammar uses shared app section/accordion pipeline.
- [ ] Verify instruction callout path parity (`InstructionCallout`/`InstructionsMedia`) and tokenized typography.
- [ ] Verify per-item grammar guidance uses consistent info-alert pattern.

## LO3 Consistency Pass (Completed)
- [x] Keep warning exception note adjacent to the exact related rule item (`médecin` case).
- [x] Keep `AudioClip` playable inside warning note content.
- [x] Remove inline-spacing merge artifacts by using explicit React spaces around inline emphasized tokens.
