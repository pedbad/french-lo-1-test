# Component Tree Standard

## Purpose
This document is the single source of truth for component directory structure, file naming, and import/export conventions.

Use this before any component move, rename, or new component creation.

## Canonical Tree (Current + Target)

```text
src/components/
|- ui/                     # shadcn/Radix primitives only
|- exercises/              # exercise engines + LO-specific exercise modules
|  |- <engine-name>/
|  |- <lo-slug>/          # only when exercise is LO-specific
|- custom/                 # custom non-exercise authored blocks
|  |- grammar/
|  |- pronunciation/
|  |- misc/
|  |- registry.js
|- content/                # domain barrel for content-oriented shared components
|- layout/                 # domain barrel for header/footer/nav/page shell
|- media/                  # domain barrel for audio/image/icon shared components
|- feedback/               # domain barrel for cross-cutting feedback/system components
|- <feature folders>       # shared app components (header/footer/section/etc.)
|- index.js                # root barrel exports domain barrels
```

## Naming Rules

1. Folder names
- lowercase only
- kebab-case for multi-word folders

2. React component files
- PascalCase
- one primary component per file
- filename matches exported component name

3. Non-component helper files
- camelCase
- examples:
  - `instructionCues.js`
  - `exerciseActionButtonVariants.js`
  - `registry.js`

4. LO-specific naming
- use LO slug names, not numeric LO ids (`lo1`, `LO2`, etc.)
- examples:
  - `current-location/`
  - `first-contact-grammar.jsx`

## Ownership Rules

1. `ui/`
- only low-level shadcn/Radix wrappers and variants.
- do not place app business logic here.

2. `exercises/`
- reusable engines live at root of `exercises/`.
- LO-specific exercise components live under `exercises/<lo-slug>/`.
- if an LO-specific exercise becomes reusable, move it back to `exercises/<engine>/`.

3. `custom/`
- only custom authored content renderers (grammar/pronunciation/misc).
- registry mapping remains explicit in `custom/registry.js`.

## Import Rules

1. Import grouping order
- external packages
- alias imports (`@/...`)
- relative imports

2. Barrel policy
- allow/maintain domain barrels (`components/content/index.js`, `components/layout/index.js`, `components/media/index.js`, `components/feedback/index.js`, `components/exercises/index.js`, `components/custom/index.js`).
- keep root barrel as domain-level export aggregator; avoid re-expanding it into a long per-component export list.

3. Path consistency
- prefer alias paths (`@/components/...`) over deep relative chains.

## Migration Rules

1. Any move/rename commit must include:
- runtime reference updates
- build validation (`yarn build`)
- docs update if path contracts changed

2. A migration is complete only when:
- old path is removed
- no runtime references remain (`rg` check)

3. Do not mix architecture changes with behavior changes in the same commit unless unavoidable.

## Exceptions

1. Legacy modules
- if a legacy folder cannot be migrated immediately, keep it unchanged and mark it explicitly in a TODO/checklist doc.

2. Transitional exports
- temporary aliases are allowed only for staged migrations and must have a removal task.

## Enforcement Checklist

- [ ] New folders are lowercase/kebab-case.
- [ ] New component files are PascalCase.
- [ ] New helpers are camelCase.
- [ ] LO-specific components use slugs, not numeric ids.
- [ ] No orphaned legacy paths after migration.
- [ ] `yarn build` passes.
