# docs/archive

This folder contains documentation for work that has been **completed and closed**. Files are kept here rather than deleted so that the reasoning behind past decisions, migration strategies, and implementation history remain accessible for future reference.

## Why archive rather than delete?

- Decisions made during a refactor often explain why the codebase looks the way it does. Losing that context forces future developers to reverse-engineer intent.
- Migration maps record exactly which files were moved, renamed, or rewritten — useful if an audio path or component reference ever needs tracing back to its origin.
- Completed checklists serve as evidence of what was tested and signed off, which matters for QA accountability.

## Structure

```
docs/archive/
  audio/          Migration maps and blocker logs for the audio path migration (LO2–LO15).
                  All open audio work is now tracked in docs/audio/AUDIO_SIGN_OFF.md.
  components/     Completed component refactor plans — utility refactor, dropdowns-to-SelectExercise.
  navigation/     Original navigation refactor plan (executed May 2026).
  styling/        Completed SCSS-to-Tailwind migration plans and typography migration history.
```

## How to use this folder

- **Reading** — fine to read any file here for context or historical reference.
- **Editing** — do not update archived files. If a completed task needs revisiting, create a new active doc in the appropriate `docs/` subfolder.
- **Moving files here** — only move a file once all checklist items are ticked and the work has been verified in production or signed off by the team. Add a one-line note to `CHANGES.md` when archiving.

## Active documentation

For work in progress, see the parent `docs/` subfolders:

| Folder | What it tracks |
|---|---|
| `docs/audio/` | NFC/NFD audio path policy; ongoing audio issue notes |
| `docs/components/` | Accordion QA, AnswerTable refactor, component naming |
| `docs/grammar/` | Grammar section architecture and task checklists |
| `docs/navigation/` | Navigation change log and open checklist items |
| `docs/process/` | Future project blueprints, JSON config audit, branching strategy |
| `docs/pronunciation/` | Pronunciation section architecture and task checklists |
| `docs/styling/` | Tailwind reference, colour migration policy |
| `docs/a11y/` | Accessibility audits, semantic DOM, table audits |
| `docs/audio/AUDIO_SIGN_OFF.md` | Single source of truth for all outstanding audio work |
| `docs/process/INFORMATION_CONFIG_ISSUES.md` | Config schema debt tracking |
| `docs/deployment/DEPLOYMENT.md` | Deployment instructions and checklist |
