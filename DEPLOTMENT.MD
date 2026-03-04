# DEPLOTMENT.MD

## Goal
Deploy the built app under Apache with path-based LO URLs, for example:

- `/projects/french-basic/first-contact/`
- `/projects/french-basic/current-location/`

while keeping SPA routing and static assets working.

## 1) Build locally

```bash
rm -rf dist
yarn build
```

## 2) Upload to server

Upload the **contents of `dist/`** into your Apache docroot folder for this app.

Example target:

- `/var/www/html/projects/french-basic/`

After upload, this folder should include at least:

- `index.html`
- `src/main.js`
- `src/main.css`
- `src/index-fr.json`
- `src/learningObjectConfigurations/fr/*.json`
- `img/`
- `audio/`

## 3) Apache rewrite config (required for SPA routes)

Create/update `.htaccess` in your app folder (same level as `index.html`):

```apache
RewriteEngine On
RewriteBase /projects/french-basic/

# Do NOT rewrite real files/directories (assets, json, js, css, audio, images)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# SPA fallback for slug routes like /first-contact/
RewriteRule ^ index.html [L]
```

Notes:

- `mod_rewrite` must be enabled.
- VirtualHost must allow `.htaccess` overrides (`AllowOverride All`) or these rules must be moved into server config.

## 4) Optional legacy query handling (`?lo=...`)

Your app already canonicalizes query URLs in runtime JS.
If you want server-side redirects too, keep it simple unless you can maintain a slug map in Apache config.

Minimal example (only numeric `lo`, no slug map):

```apache
# Optional: redirect only legacy query presence to app root
RewriteCond %{QUERY_STRING} (^|&)lo= [NC]
RewriteRule ^$ /projects/french-basic/ [R=302,L]
```

Prefer keeping app-level canonicalization unless you have full rewrite-map support.

## 5) Verify after deploy

Open and confirm these return expected content:

1. `/projects/french-basic/` -> landing page
2. `/projects/french-basic/first-contact/` -> LO1
3. `/projects/french-basic/src/main.js` -> JavaScript file (not HTML)
4. `/projects/french-basic/src/index-fr.json` -> JSON
5. `/projects/french-basic/src/learningObjectConfigurations/fr/1.json` -> JSON

## 6) Quick troubleshooting

- Error: `Unexpected token '<' ... not valid JSON`
  - A JSON/JS request is being rewritten to HTML.
  - Check rewrite order and ensure real files are excluded before SPA fallback.

- Blank page with no UI
  - Confirm `index.html` references existing `./src/main.js` and `./src/main.css`.
  - Confirm both files exist on server at the expected paths.

- Route works on local but not server
  - Check `RewriteBase` matches real mount path.
  - Confirm `.htaccess` is applied (`AllowOverride All`).

## 7) If app is deployed under a different folder

The build is portable (`VITE_BASE_PATH` default is `./`), so you can deploy under any folder.
Only update `RewriteBase` in `.htaccess` to match that folder.
