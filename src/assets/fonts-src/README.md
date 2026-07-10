# Font source files (not shipped)

Original `.otf`/`.ttf` masters. **Not served** — they live outside `public/` on
purpose so Vite does not copy them into `dist/`. The site loads the `.woff2`
siblings in `public/fonts/` instead (~70% smaller, format-only repackage).

## Regenerate the woff2 files

Requires `fonttools` + `brotli` (`pip install fonttools brotli`). Full-glyph
repackage (no subsetting — keeps all glyphs and layout features):

```sh
for f in Feijoa-Bold.otf Feijoa-Medium.otf Feijoa-MediumItalic.otf \
         OpenSans-Regular.ttf OpenSans-Bold.ttf OpenSans-SemiBold.ttf; do
  pyftsubset "src/assets/fonts-src/$f" \
    --unicodes='*' --layout-features='*' --glyph-names \
    --flavor=woff2 --output-file="public/fonts/${f%.*}.woff2"
done
```

If you ever subset (smaller still, ~85%), confirm the Feijoa (Klim) licence
permits it first. OpenSans is Apache-2.0.
