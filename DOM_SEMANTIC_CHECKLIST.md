# DOM Semantic Refactor Checklist

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Structure Checks
- [x] Exactly one `<main>` in page content.
- [x] Legacy top-level wrapper `<div id="accordion1" class="accordion">` no longer exists.
- [x] Top-level thematic sections exist as real `<section>` elements with IDs:
  - `dialogues`
  - `vocabulary`
  - `grammar`
  - `pronunciation`
  - `exercises`
- [x] Page title remains:
  - `<h1><span class="title-main">First Contact —</span><span class="title-sub">greetings, farewells and social niceties</span></h1>`
- [x] Each top-level section has an accessible heading.
- [x] Each top-level section has a semantic `<header>` that contains:
  - section `h2`
  - section intro/instructions block
- [x] Leaf accordion panels are `<article>` (or justified as `<section>` if not standalone).
- [x] Group accordion wrappers render as semantic `<section>` containers.

## Navigation Checks
- [x] Exactly one primary nav landmark exists for the main IA.
- [x] Mobile menu remains responsive without introducing a second primary `<nav>` for the same links.
- [x] Top nav links target semantic top-level section hashes (`#introduction`, `#dialogues`, `#vocabulary`, `#grammar`, `#pronunciation`, `#exercises`).
- [ ] Top nav links scroll to the correct top-level section.
- [ ] Scroll spy/highlight still updates correctly while scrolling.
- [ ] Mobile menu links behave exactly like desktop links.
- [x] Legacy `#modal-link-*` nav hash compatibility is intentionally removed (explicit project decision).

## Hero + Heading Checks
- [x] Hero is explicitly treated as decorative page chrome and is intentionally outside `main`.
- [x] No hero `h2` appears before the page `h1`.
- [x] Intro section heading/instructions are grouped in a semantic section header.

## Accordion Behavior Checks
- [ ] First click opens panel.
- [ ] Second click closes panel.
- [ ] Multiple-open behavior still works where expected.
- [ ] Session persistence for open/closed state still works after refresh.
- [ ] Chevron size/style remains consistent between app and debug pages.

## Modal/Deep-Link Checks
- [ ] Content `.modal-link` opens modal content correctly.
- [ ] Nav links do not open modal (scroll only).
- [ ] Fallback content extraction works for targets inside `article` containers.

## Accessibility Checks
- [ ] Keyboard toggle works (`Enter`/`Space`) on accordion triggers.
- [ ] Focus order does not enter collapsed panel content.
- [ ] `aria-expanded` changes correctly.
- [ ] Landmark structure is valid (`header`, `main`, `footer`, nested sections/articles).
- [x] Heading order is logical (`h1` -> `h2` -> `h3`).

## Visual/Regression Checks
- [ ] No spacing/padding regressions in section cards.
- [ ] No accordion hover/open-state style regressions.
- [ ] No dark-mode regressions for section/accordion UI.
- [ ] No mobile layout regressions.

## Build/Quality Gates
- [x] `yarn build` passes.
- [x] Branch guards pass:
  - `yarn check:typography:branch`
  - `yarn check:color:branch`
  - `yarn check:a11y:branch`
  - `yarn check:scss:branch`
  - `yarn check:audio-unicode`
- [ ] `yarn prepush:local` passes.
- [ ] W3C validator run on preview HTML shows no new semantic/structure errors.
