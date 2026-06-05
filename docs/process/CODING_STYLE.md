# Coding Style

## Indentation — 2 spaces

The project uses **2-space indentation everywhere** (JS, JSX, CSS, JSON, MD).

- Enforced by ESLint (`indent: ["error", 2]`) and documented for every editor via `.editorconfig` (`indent_style = space`, `indent_size = 2`).
- **Why spaces, not tabs:** matches shadcn/ui (ships 2-space) and Prettier defaults — the React-ecosystem mainstream. Avoids reformat churn every time a shadcn component is added.
- **Accessibility note:** source-code indentation is dev-facing only; it never reaches the browser, so this choice has **no effect on end-user accessibility** (WCAG/WAVE). The tabs-for-a11y argument applies only to developers reading source with assistive tech.

## Linting

- `yarn lint` (`eslint .`) gates PRs via `.github/workflows/pr-quality.yml`. **Errors block; warnings do not.**
- `no-console`: errors on `console.log`; **`console.warn` / `console.error` allowed** (legit diagnostics).
- Run `yarn lint --fix` to auto-resolve indentation/semicolons before committing.

## Known non-blocking warnings (tech debt, not gating)

- `sort-keys` (~134): object keys not alphabetical. Low value, high churn — candidate for disabling.
- `no-mixed-spaces-and-tabs` (~30): residual tabs in multiline strings/JSX the auto-fixer left.
- `prefer-destructuring`, `only-export-components`: minor, address opportunistically.
