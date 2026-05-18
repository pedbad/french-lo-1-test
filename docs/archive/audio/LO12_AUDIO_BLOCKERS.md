# LO12 Audio Migration Blockers

## Status

Outstanding audio items are tracked in the single source of truth: `/AUDIO_SIGN_OFF.md`

## Notes

- LO12 audio refs in config, grammar, and pronunciation otherwise resolve under `public/audio/lo12/...`.
- The original teacher-authored pronunciation examples were restored; temporary substitute words are no longer used.
- `u.mp3` and `ou.mp3` were copied into `public/audio/lo12/pronunciation/` so the restored pronunciation introduction remains functional.
- Follow-up cleanup is complete: `public/sounds/fr` has been removed after
  confirming no runtime refs remain.
