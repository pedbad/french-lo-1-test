// SVG optimization config. Lossless-leaning: keep viewBox (needed for the
// responsive object-cover card/hero images) and preserve IDs referenced by
// gradients/clip-paths. Run: yarn svgo -rf public/img
export default {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Removing viewBox breaks scaling for our width/height-less inline
          // and object-cover SVGs — keep it.
          removeViewBox: false,
          // Gradients/clip-paths reference IDs; don't let cleanup rename/drop
          // them and orphan a fill.
          cleanupIds: false,
        },
      },
    },
  ],
};
