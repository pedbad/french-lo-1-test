# Deployment TODO

## Audit Status (2026-03-06)

This file has been re-audited against current repo state.

### Previous issue (absolute viteStaticCopy destinations)

The old issue in this file is no longer present.

Current `vite.config.js` copy targets are relative and limited to config JSON:
- `dest: './src/lo-config'` from `src/lo-config/*.json`
- `dest: './src'` from `src/index*.json`

No absolute filesystem copy destinations are used for `images/sounds/fonts`.

### Current deployment model (authoritative)

1. Build for Apache subpath using `VITE_BASE_PATH=/projects/french-basic/`
2. Deploy `dist/` contents to server directory
3. Use SPA rewrite fallback via `.htaccess`
4. Keep slug URLs (`/first-contact/`) working on direct load + refresh

### Current scripts (authoritative)

- `yarn build` -> portable build (relative base)
- `yarn build:server` -> fixed-path server build for `/projects/french-basic/`
- `yarn build:with-debug` -> portable build + debug page
- `yarn build:server:with-debug` -> fixed-path server build + debug page

---

## DevOps Instructions (Baby Steps)

### A. Build artifact generation

Run from repo root:

```bash
yarn install --frozen-lockfile
rm -rf dist
yarn build:server:with-debug
```

Expected outputs:
- `dist/index.html`
- `dist/src/main.js`
- `dist/src/main.css`
- `dist/debug-sandbox.html`
- `dist/.htaccess`
- `dist/src/index-fr.json`
- `dist/src/lo-config/*.json`

### B. Apache prerequisites

```bash
sudo a2enmod rewrite
sudo systemctl reload apache2
```

VirtualHost/Apache config must allow `.htaccess` for app directory:

```apache
<Directory /var/www/html/projects/french-basic>
    AllowOverride All
    Require all granted
</Directory>
```

### C. Deploy files

Deploy `dist/` contents to:
- `/var/www/html/projects/french-basic/`

Example:

```bash
rsync -av --delete dist/ /var/www/html/projects/french-basic/
sudo chown -R www-data:www-data /var/www/html/projects/french-basic
```

### D. Rewrite file to use

Use the repo-managed file:
- `public/.htaccess` (copied into `dist/.htaccess` during build)

Current content:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /projects/french-basic/

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]
```

---

## DevOps Test Checklist

- [ ] Home page loads: `/projects/french-basic/`
- [ ] Deep link loads directly: `/projects/french-basic/first-contact/`
- [ ] Refresh works on deep link (`/first-contact/`)
- [ ] Debug page loads: `/projects/french-basic/debug-sandbox.html`
- [ ] JSON returns JSON (not HTML):
  - `/projects/french-basic/src/index-fr.json`
  - `/projects/french-basic/src/lo-config/first-contact.json`
- [ ] Browser console has no `Unexpected token <`
- [ ] Browser network tab has no 404 for `main.js`, `main.css`, JSON, audio
- [ ] At least one LO audio clip plays successfully

---

## Troubleshooting Quick Checks

If deep links 404:
- verify `mod_rewrite` enabled
- verify `AllowOverride All`
- verify `.htaccess` exists beside deployed `index.html`

If console shows `Unexpected token <`:
- rebuild with `yarn build:server` or `yarn build:server:with-debug`
- confirm built `dist/index.html` has:
  - `/projects/french-basic/src/main.js`
  - `/projects/french-basic/src/main.css`
