# Deployment TODO

## Problem: absolute `viteStaticCopy` destinations

In `vite.config.js`, `vite-plugin-static-copy` was configured with:

- `dest: '/images'`
- `dest: '/sounds'`
- `dest: '/fonts'`

These are absolute filesystem paths (root-level), not paths inside the Vite build output directory.

## Why this is bad practice

- It makes build output environment-dependent and non-portable.
- It can fail with permission errors (`EPERM`) on normal developer machines and CI.
- It breaks the expectation that all deployable artifacts are under `dist/`.
- It can accidentally write outside the project build directory if permissions allow.

## Fix (best practice)

Use relative destinations so files are copied into `dist/`:

- `dest: 'images'`
- `dest: 'sounds'`
- `dest: 'fonts'`

This keeps static assets in `dist/images`, `dist/sounds`, and `dist/fonts`, which is correct for preview and deployment.
