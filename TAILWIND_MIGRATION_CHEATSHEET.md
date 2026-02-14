# Tailwind Migration Cheatsheet

Last updated: 2026-02-14  
Repo: `/Users/ped/Sites/french/french-lo-1-test`

## Purpose

Use this file when converting legacy SCSS into Tailwind + tokens in JSX.

Goals:
1. Keep styles co-located with components.
2. Keep semantic tokens as single source of truth.
3. Avoid creating new SCSS drift during migration.

## Core Rule

Prefer:
1. tokenized utility classes in JSX
2. `cn()`/`cva` for variants
3. `src/index.css` layered global styles only when truly global

Avoid:
1. new `.scss` files
2. new `import './*.scss'` in components
3. broad `!important` overrides

## Maintenance Rationale (For Legacy + New Developers)

Use this rule of thumb:
1. Tokens define design decisions.
2. Utilities apply those decisions.
3. `cn()`/`cva` defines state and variant behavior.

Why this is best practice for maintenance:
1. One source of truth: reduces copy/paste class divergence.
2. Lower regression risk: fewer files touched per styling change.
3. Better review quality: intent-focused diffs instead of long class-string diffs.
4. Easier handover: new contributors follow a predictable pattern.

Concrete example from this repo:
1. Exercise action buttons moved from repeated per-component class strings to shared `cva` variants in `src/components/exerciseActionButtonVariants.js`.
2. Result: color/state/visibility rules are edited once and reused everywhere.

## Common SCSS -> Tailwind Mappings

1. Layout/flex

SCSS:
```scss
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: center;
```

Tailwind:
```jsx
className="flex flex-row justify-end items-center"
```

2. Sizing/spacing

SCSS:
```scss
padding: 1rem;
margin-top: 1rem;
width: calc(100% - 2rem);
```

Tailwind:
```jsx
className="p-4 mt-4 w-[calc(100%-2rem)]"
```

3. Border reset

SCSS:
```scss
border: none;
margin: 0;
padding: 0;
```

Tailwind:
```jsx
className="border-none m-0 p-0"
```

4. Nested SVG styling

SCSS:
```scss
.icon-button {
  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: none;
    stroke: currentColor;
  }
}
```

Tailwind:
```jsx
className="icon-button [&_svg]:w-5 [&_svg]:h-5 [&_svg]:fill-none [&_svg]:stroke-current"
```

5. Hover/focus states

SCSS:
```scss
&:hover { color: var(--foreground); }
```

Tailwind:
```jsx
className="text-muted-foreground hover:text-foreground"
```

6. Breakpoints/media queries

SCSS:
```scss
@media (min-width: 768px) { font-size: ... }
```

Tailwind:
```jsx
className="text-[calc(var(--font-size-base)*0.95)] md:text-[calc(var(--font-size-base)*1.1)]"
```

## Variant and Conditional Patterns (`cn` / `cva`)

1. Conditional classes

```jsx
className={cn(
  "base classes",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 pointer-events-none"
)}
```

2. Variant map (`cva`)

```jsx
const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-sm",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-[color-mix(in_oklab,var(--chart-2)_20%,transparent)] text-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);
```

3. Real project pattern: shared exercise action button variants

Why:
1. Avoid repeated class strings (`btn-ped-warn`, `hidden-help`, `show`, `exercise-icon-button`) across many components.
2. Keep behavior/style composition in one file for easier refactor safety.

Implementation:
1. Define variants once in `src/components/exerciseActionButtonVariants.js`.
2. Consume in components with explicit intent:

```jsx
className={exerciseActionButtonVariants({
  tone: "warn",
  progressive: true,
  visible: failCount >= 2,
})}
```

Result:
1. Safer edits (one source for variant composition rules).
2. Less SCSS drift and fewer per-component class divergences.

## Token Usage Rules (Project-Specific)

1. Use semantic token variables from `src/index.css`.
2. Prefer utility classes that already map to tokens (`text-foreground`, `bg-card`, `border-border`).
3. For custom values, use tokenized arbitrary values:
```jsx
className="text-[calc(var(--font-size-sm)*1.2)]"
```
4. Do not introduce hardcoded literal typography/color where guardrails block it.

## Animation Migration

1. If animation is component-global and reused: add to `tailwind.config.js` (`theme.extend.keyframes`/`animation`).
2. If animation is truly global: keep in `src/index.css` under explicit layer control.
3. Do not leave new keyframes in new SCSS files.

## Real Examples Already Migrated

1. `src/components/TopButton/TopButton.scss` removed:
- SCSS container flex moved to `className="flex justify-end"`.

2. `src/components/Explanation/Panel/Panel.scss` removed:
- `padding`, `margin-top`, `width` moved to `className="p-4 mt-4 w-[calc(100%-2rem)]"`.

3. `src/components/IconButton/IconButton.scss` removed:
- nested `svg` rules moved to arbitrary descendant utilities (`[&_svg]:...`).

4. `src/components/Form/FieldSet/FieldSet.scss` removed:
- fieldset layout reset moved to utility classes in JSX.

## Migration PR Checklist

1. Remove SCSS import from component.
2. Port style behavior to tokenized Tailwind classes.
3. Delete SCSS file.
4. Verify:
   - `yarn build`
   - `yarn check:scss:branch`
   - visual sanity for touched component
5. Update:
   - `SCSS_TO_TAILWIND_REFACTOR_PLAN.md`
   - `TASKS_COMPLETED.md`
