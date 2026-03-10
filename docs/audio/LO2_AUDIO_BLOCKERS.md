# LO2 Audio Blockers

## Context

This file records the LO2 audio blockers found during migration from `sounds/fr/...` to `audio/lo2/...`, plus the implemented resolution.

Primary migration references:
- `AUDIO_LO2_MIGRATION_MAP.md`
- `AUDIO_TODO.md`

## Remaining blockers (initial state)

The following legacy refs were initially unresolved:

1. `sounds/fr/Salut.mp3`
2. `sounds/fr/Je m&apos;appelle.mp3`
3. `sounds/fr/Je m'appelle.mp3`

### Where they appeared

- `src/lo-config/about-me.json`
  - pronunciation HTML block:
    - `/sounds/fr/Salut.mp3`
    - `/sounds/fr/Je m&apos;appelle.mp3`
- `src/components/custom/pronunciation/about-me-pronunciation.jsx`
  - pronunciation block:
    - `sounds/fr/Salut.mp3`
    - `sounds/fr/Je m'appelle.mp3`

## Why they were unresolved

- No exact `public/sounds/fr/Salut.mp3` source file exists.
- No exact `public/sounds/fr/Je m'appelle.mp3` source file exists.
- `Je m&apos;appelle.mp3` is an entity-encoded source reference and not a literal filename on disk.

## Validation run before resolution

- `yarn check:audio-unicode` passed
- `yarn build` passed

## Important note (non-LO2 scope)

There was also a non-LO2 usage of `Je m'appelle.mp3` in:
- historical monolith `src/components/CustomComponents_FR/CustomComponents_FR.jsx` line ~2203

During this pass, that non-LO2 usage was explicitly redirected to an LO1 canonical file:
- `audio/lo1/vocabulary/022-je-mappelle.mp3`

## Blocker resolution implemented

For LO2-only blockers, fallback files were created under LO2 paths:

- `public/audio/lo2/pronunciation/demystify/016-salut.mp3`
  - seeded from `public/audio/lo1/vocabulary/004-salut.mp3`
- `public/audio/lo2/pronunciation/demystify/006-je-m-appelle.mp3`
  - seeded from `public/audio/lo1/vocabulary/022-je-mappelle.mp3`

Then all remaining LO2 references were rewritten to these LO2 targets in:
- `src/lo-config/about-me.json`
- `src/components/custom/pronunciation/about-me-pronunciation.jsx`

## Current status

- LO2 blocker count: `0`
- No remaining LO2 references to:
  - `sounds/fr/Salut.mp3`
  - `sounds/fr/Je m&apos;appelle.mp3`
  - `sounds/fr/Je m'appelle.mp3`
