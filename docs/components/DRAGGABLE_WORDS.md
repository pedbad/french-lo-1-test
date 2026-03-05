# Draggable Words: Migration Plan (SCSS → Tailwind + shadcn)

## Goal
Make draggable word tiles easier to maintain by moving visual styling into Tailwind/shadcn variants while keeping the existing drag logic intact.

## Baby‑step plan (low risk)
1. Freeze behavior: do not change drag logic, only styling and class structure.
2. Introduce a `DraggableTile` wrapper using shadcn `Button`.
3. Define tokenized Tailwind styles for the tile state (`tile`, `tile-dragging`, `tile-placed`) using `@apply`.
4. Swap the `Word` component to render a shadcn `Button` instead of a raw `<div>`.
5. Map drag state to Tailwind classes (e.g. `dragging` → `tile-dragging`).
6. Remove `Word.scss` once parity is reached.
7. Reduce `Blanks.scss` to only layout concerns that haven’t moved to Tailwind yet.

## Can we have a “primary draggable button”?
Yes. Add a custom shadcn `Button` variant (e.g. `variant="tile"`) or a tokenized Tailwind class (e.g. `.btn-tile-primary`) to keep the draggable tiles consistent everywhere.

## Why this helps
- Styling becomes centralized in tokens/Tailwind instead of scattered SCSS.
- Debugging is faster (one variant or class).
- Reuse is easier across other drag/drop activities.

## Draft prompt for future work
```
Please refactor the draggable word tiles in Blanks/Word to use shadcn Button variants and Tailwind utilities instead of SCSS. Keep the drag logic unchanged, map drag states to Tailwind classes, and delete the legacy SCSS once parity is reached.
```

## Tailwind-only animation proposal (optional)
If we want to avoid custom SCSS for drag states, we can prototype a Tailwind-first approach:
1. Add `animate-[drag-pulse_0.6s_ease-in-out_infinite]` or use Tailwind’s built-in `animate-pulse` for dragging state.
2. Use conditional class names for `dragging`, `placed`, `returning`, `highlight` (e.g., `bg-[var(--chart-2)]/20`, `ring-2 ring-[var(--chart-2)]`).
3. For any missing animations, define a small `@keyframes` in `src/index.css` and reference it via Tailwind’s arbitrary `animate-[...]` syntax.
4. Keep transforms in Tailwind (`translate-x`, `translate-y`) where possible, but allow inline style for absolute drag position.

Prototype example:
```
<Button
  variant="tile"
  className={cn(
    "transition-colors",
    dragging && "animate-pulse ring-2 ring-[var(--chart-2)]",
    placed && "bg-[var(--chart-2)] text-[var(--primary-foreground)]"
  )}
>
  {children}
</Button>
```
