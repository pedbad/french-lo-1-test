# Deployment Guide

## Overview

This is a React + Vite SPA. The build system automatically generates a real
`index.html` for every learning object slug (e.g. `dist/first-contact/index.html`),
so Apache serves deep links without `mod_rewrite` or `.htaccess`.

There are **two servers**, each with a dedicated deployment script:

| Server | Purpose | App URL | Script |
|--------|---------|---------|--------|
| `lcdev` | Dev / staging | `/projects/french-basic/` | `1.deploy-lcdev-local.sh` |
| `lcitc` | Production (Mythic Beasts) | `/french/french-basic/` | `2.deploy-lcitc-remote.sh` |

Using the wrong script for the wrong server will break all assets — the page
loads blank and the browser console shows 404 errors for `.js` or `.css` files.

---

## Deploying to lcdev (dev/staging)

```bash
./1.deploy-lcdev-local.sh lcdev
```

What the script does:

- clones the latest repository into `/tmp/french-basic-build`
- installs dependencies with `bun install`
- builds with base path `/projects/french-basic/` (includes `debug-sandbox.html`)
- validates that all 15 learning-object route folders exist in `dist/`
- deploys to `/var/www/html/projects/french-basic/`

Expected URLs after deploy:

```
/projects/french-basic/
/projects/french-basic/first-contact/
/projects/french-basic/debug-sandbox.html
```

---

## Deploying to lcitc (production)

```bash
./2.deploy-lcitc-remote.sh
```

What the script does:

- uses the repo at `/tmp/french-basic-build`, pulls latest `main`
- installs dependencies with `bun install`
- builds with base path `/french/french-basic/`
- validates that no `/projects/french-basic/` paths remain in `dist/`
- validates that `debug-sandbox.html` is **not** in `dist/`
- validates that all 15 learning-object route folders exist in `dist/`
- rsyncs `dist/` to Mythic Beasts:
  `/home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic/`
- removes any stale remote `debug-sandbox.html`
- verifies the remote production HTML uses `/french/french-basic/`

Expected URLs after deploy:

```
/french/french-basic/
/french/french-basic/first-contact/
```

This URL must **not** exist in production:

```
https://lcitc.langcen.cam.ac.uk/french/french-basic/debug-sandbox.html
```

---

## Required tooling

Bun must be installed for the user running the scripts.

```bash
bun --version
```

If Bun is installed but not found by a script, add it to the non-interactive shell path:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

---

## Verification commands

### Before rsync — check the local production build

```bash
grep -R -n "/projects/french-basic/" /tmp/french-basic-build/dist
grep -R -n "/french/french-basic/" /tmp/french-basic-build/dist/index.html
test ! -e /tmp/french-basic-build/dist/debug-sandbox.html
```

Expected:
- first command prints nothing
- second command prints matching production asset paths
- third command exits silently

### After rsync — check the remote production files

```bash
ssh langcenmb@fentiger.mythic-beasts.com "grep -R -n '/projects/french-basic/' /home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic || true"
ssh langcenmb@fentiger.mythic-beasts.com "grep -n '/french/french-basic/' /home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic/index.html"
ssh langcenmb@fentiger.mythic-beasts.com "test ! -e /home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic/debug-sandbox.html"
```

---

## How slug routing works (no mod_rewrite needed)

The `generateSlugRoutes` Vite plugin in `vite.config.js` runs after every build.
It reads `src/index-fr.json` and copies `dist/index.html` to
`dist/<slug>/index.html` for each of the 15 learning objects.

When a user navigates to `/french/french-basic/first-contact/`, Apache finds the
real file `dist/first-contact/index.html` and serves it. React Router reads the
URL and renders the correct LO. No `.htaccess` or `mod_rewrite` required.

If you add a new LO in future, add its slug to `src/index-fr.json` — the next
build will automatically create its route directory, and the deployment script
will validate it is present before deploying.

---

## Legacy scripts — do not run

These scripts belong to the old wrapper/conversion deployment flow and must not
be used:

```
legacy.DO-NOT-RUN.clone-convert-copy-french-basic.sh
legacy.DO-NOT-RUN.combined-french-basic-deploy.sh
legacy.DO-NOT-RUN.convert-unit-routing.sh
legacy.DO-NOT-RUN.copy-fb-to-mythic-beasts-copy.sh
```

The current build already creates real `index.html` files for every
learning-object route. No separate wrapper-generation script is needed.

---

## Troubleshooting

**Production page is blank / assets 404**

View source and check the asset paths.

Wrong for lcitc:
```html
src="/projects/french-basic/src/main.js"
```

Correct for lcitc:
```html
src="/french/french-basic/src/main.js"
```

If the wrong path appears, rebuild with the production script and redeploy:
```bash
./2.deploy-lcitc-remote.sh
```

**`debug-sandbox.html` is accessible in production**

Remove it and verify:
```bash
ssh langcenmb@fentiger.mythic-beasts.com "rm -f /home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic/debug-sandbox.html"
ssh langcenmb@fentiger.mythic-beasts.com "test ! -e /home/langcenmb/www/lcitc.langcen.cam.ac.uk/french/french-basic/debug-sandbox.html"
```

**Deep link (`/first-contact/`) returns 404**

The slug directory was not generated. Rebuild — confirm `dist/first-contact/index.html`
exists before deploying. The deployment scripts validate this automatically.
