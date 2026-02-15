# DOM Semantic Audit

Last updated: 2026-02-15  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Goal
Define and validate a cleaner semantic DOM structure for the learning object page:

```html
<main>
  <section id="dialogues">...</section>
  <section id="vocabulary">...</section>
  <section id="grammar">...</section>
  <section id="pronunciation">...</section>
  <section id="exercises">...</section>
</main>
```

Inside each top-level section, accordion items should be semantic content units (`article`) when they are standalone learning units.

## Current State (Observed)
1. Main content root already exists:
  - `/Users/ped/Sites/french/french-lo-1-test/src/App.jsx` uses `<main id="content">`.
2. Top-level LO blocks are currently rendered through `Section`/`HeroSection`, but these wrappers are `<div className="section">`, not `<section>`.
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Section/Section.jsx`
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/HeroSection/HeroSection.jsx`
3. Accordion item wrapper currently renders as `<article class="accordion-article">`.
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/Accordion/AccordionArticle.jsx`
4. Navigation currently targets heading IDs (`#modal-link-*`), not top-level section IDs.
  - `/Users/ped/Sites/french/french-lo-1-test/src/components/MainMenu/MainMenu.jsx`

## Current DOM Snapshot (First 3 Levels Inside `main`)

This is the current rendered structure for LO1 (simplified tree):

```text
main#content
|- h1
|  |- span.title-main
|  |- span.title-sub
|- div#LO-intro-section.section.hero-section
|  |- div.w-full.sortable.mt-6
|- div#accordion1.accordion
   |- div#LO1-dialogues-Group-Section.section
   |- div#LO1-vocabulary-Section.section
   |- div#LO1-grammar-Group-Section.section
   |- div#LO1-pronunciation-Group-Section.section
   |- div#LO1-exercises-Group-Section.section
```

This `div#accordion1.accordion` wrapper is the key bad structure:
1. It is named like one accordion widget, but it actually wraps all major learning-object sections.
2. It hides semantic meaning for top-level content areas that should be section landmarks.

## Current Page-Top Structure (Observed)

```text
body
|- a.skip-link[href="#content"]
|- div.app
   |- span#modal-link-top.modal-link-target (hidden anchor)
   |- header#mainMenu.main-menu
   |  |- nav[aria-label="Main"]                      (Radix NavigationMenu root)
   |  |- div.mobile-menu[role="region"][aria-label="Main navigation mobile"]
   |- div#hero
   |  |- img.hero-image[alt=""][aria-hidden="true"]
   |  |- p.hero-title
   |- main#content
      |- h1
```

Key observations:
1. Primary navigation landmark duplication has been resolved (one semantic nav landmark for the shared IA).
2. Hero heading-order issue has been resolved (hero title is non-heading text; page title remains the `h1` inside `main`).
3. Hero remains outside `main` intentionally, classified as decorative page chrome in this app.

## Why This Is A Problem
1. `#accordion1` is a misleading top-level name.
2. It is not a single accordion item; it is the thematic container for all major sections.
3. Top-level thematic blocks are currently `div.section` instead of semantic `section`.
4. Section header content (title + instructions) is not consistently represented as semantic section headers.
5. Hero placement is no longer treated as a semantic defect in this project because hero content is intentionally decorative.

## Does Your Target Make Sense?
Yes. It is cleaner and more semantic.

Recommended hierarchy:
1. `main` as the unique page content landmark.
2. Top-level thematic blocks (`dialogues`, `vocabulary`, `grammar`, `pronunciation`, `exercises`) as `section` with stable IDs.
3. Accordion child units as:
  - `article` for standalone units (e.g., one exercise block, one dialogue block).
  - `section` for structural wrappers (e.g., container `Group` nodes that only aggregate child items).

## "Self-Contained / Standalone" Definition
Use `article` when a panel can stand alone outside its parent context with its own heading and meaningful content.

Use `section` when the node is primarily a grouping wrapper for other units.

For LO1:
1. Top-level blocks (`dialogues`, `grammar`, `exercises`, etc.) are thematic groups: `section` is correct.
2. Leaf accordion panels like `PhraseTable1`, `WordParts`, `Blanks`, `SequenceOrder`, `Sortable` are good `article` candidates.

## Inconsistencies To Fix
1. Top-level content wrappers are `div.section`, not `section`.
2. Main thematic container is currently `<div class="accordion" id="accordion1">`, which is misleading:
  - it is not one accordion widget.
  - it is the container for all major page sections (dialogues, vocabulary, grammar, pronunciation, exercises).
  - semantically it should be a neutral sections wrapper (or direct section siblings under `main`), not named as a single accordion.
3. Navigation and section activation logic are tied to `#modal-link-*` IDs on headings.
4. Accordion naming still includes legacy `accordion-article` class regardless of element tag.
5. Modal-link content extraction currently searches `closest("p, li, div, section")` and should include `article` if panels become articles.

## Recommended DOM Structure (Target)

Keep page title exactly as currently rendered:

```html
<h1>
  <span class="title-main">First Contact —</span>
  <span class="title-sub">greetings, farewells and social niceties</span>
</h1>
```

Then structure content as:

```html
<header id="mainMenu" class="main-menu">
  <nav aria-label="Main navigation">
    <!-- brand + desktop links + actions -->
  </nav>
  <div class="mobile-menu" role="region" aria-label="Main navigation mobile">
    <!-- same IA links, responsive panel only (not second nav landmark) -->
  </div>
</header>

<main id="content">
  <section id="introduction">
    <header>
      <h1>
        <span class="title-main">First Contact —</span>
        <span class="title-sub">greetings, farewells and social niceties</span>
      </h1>
      <div class="instructions ...">...</div>
    </header>
    <div class="section-body">
      <!-- hero artwork/text can live here as content -->
    </div>
  </section>

  <section id="dialogues">
    <header>
      <h2 class="modal-link-target" data-modal-target="dialogues" id="modal-link-dialogues">
        Dialogues
      </h2>
      <div class="instructions ...">...</div>
    </header>
    <div class="accordion">
      <article class="accordion-article">...</article>
      <article class="accordion-article">...</article>
    </div>
  </section>

  <section id="vocabulary">...</section>
  <section id="grammar">...</section>
  <section id="pronunciation">...</section>
  <section id="exercises">...</section>
</main>

<footer>...</footer>
```

Notes:
1. Top-level nav should target section IDs (`#dialogues`, `#vocabulary`, etc.).
2. During migration, keep `#modal-link-*` compatibility until nav and scroll-spy are fully moved.
3. Leaf accordion panels should be `article`; grouping wrappers remain `section`.
4. Section intro/instructions text belongs in the section header with the section title, not as detached content.
5. "Single nav landmark" means one semantic primary `<nav>` for this IA. Responsive mobile behavior still exists; only the mobile container should be non-`nav` (or a labeled region) to avoid duplicate landmarks for the same menu.
6. Hero is intentionally treated as decorative page chrome and stays outside `main`; keep hero text non-heading and image decorative.

## Recommended Full DOM Tree (Target)

```text
body
|- a.skip-link[href="#content"]                            (recommended)
|- header#mainMenu.main-menu
|  |- nav[aria-label="Main navigation"]                    (single primary nav landmark)
|  |- div.mobile-menu[role="region"][aria-label="Main navigation mobile"]
|- main#content
|  |- section#introduction
|  |  |- header
|  |  |  |- h1
|  |  |  |  |- span.title-main
|  |  |  |  |- span.title-sub
|  |  |  |- div.instructions
|  |  |- div.section-body
|  |- section#dialogues
|  |  |- header
|  |  |  |- h2#modal-link-dialogues.modal-link-target
|  |  |  |- div.instructions
|  |  |- div.accordion
|  |     |- article.accordion-article
|  |- section#vocabulary
|  |- section#grammar
|  |- section#pronunciation
|  |- section#exercises
|- footer
```

## Will DOM Refactor Break Styles Or JS?
It can, unless done with compatibility steps.

### Style Risk
1. Existing CSS heavily targets classes like `.accordion-article` and `.section`.
2. Changing tags is usually safe if class names remain stable.
3. Risk appears when selectors are tag-dependent or parent-child assumptions change.

### JS Risk
1. Main nav click + highlight logic expects `#modal-link-*` hashes and IDs.
2. Modal/deep-link targeting uses `.modal-link-target[data-modal-target=...]`.
3. Content extraction for modal fallback may miss new `article` containers if selector list is not updated.

### Accessibility/Structure Risk
1. Heading order can drift if top-level and panel heading levels are not explicitly normalized.
2. Landmark duplication can occur if multiple nested `main`/improper sectioning is introduced.

## Safe Refactor Principles
1. Keep existing classes during semantic tag swaps (class stability first).
2. Introduce top-level section IDs while preserving current `#modal-link-*` compatibility during transition.
3. Update JS selectors to include `article` where container lookup is used.
4. Migrate in small batches and verify nav scroll, active-state highlight, modal links, and accordion behavior after each batch.

## Decision
Proceed with semantic refactor using:
1. `main > section#dialogues|vocabulary|grammar|pronunciation|exercises`
2. Accordion leaf panels as `article` (wrapper/group nodes remain `section`)
3. Backward-compatible ID/link strategy during rollout to avoid regressions.
