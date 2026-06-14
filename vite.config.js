import { createLogger, defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import fs from 'node:fs';
import process from 'node:process';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

const logger = createLogger();
const loggerWarn = logger.warn;
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

logger.warn = (msg, options) => {
  // Ignore 'esbuild css minify thing is not a known CSS property'
  if (msg.includes('esbuild css minify') && msg.includes(' is not a known CSS property')) return;
  loggerWarn(msg, options);
};

const basePath = process.env.VITE_BASE_PATH || './';

function generateSlugRoutes() {
  return {
    name: 'generate-slug-routes',
    closeBundle() {
      const indexJson = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'src/index-fr.json'), 'utf-8'));
      const template = fs.readFileSync(path.resolve(projectRoot, 'dist/index.html'), 'utf-8');
      for (const lo of indexJson.learningObjects) {
        const dir = path.resolve(projectRoot, 'dist', lo.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), template);
      }
    }
  };
}

export default defineConfig(() => {
  const includeDebug = process.env.VITE_INCLUDE_DEBUG === 'true';
  const htmlInputs = {
    main: path.resolve(projectRoot, 'index.html'),
    ...(includeDebug ? {
      debugSandbox: path.resolve(projectRoot, 'debug-sandbox.html'),
      engineeringRationale: path.resolve(projectRoot, 'engineering-rationale.html'),
      exerciseShowcase: path.resolve(projectRoot, 'exercise-showcase.html'),
    } : {}),
  };

  return ({
    assetsInclude: [
      '**/*.mp3',
      '**/*.jpg',
      '**/*.otf',
      '**/*.svg',
      '**/*.ttf'
    ],
    base: basePath,
    build: {
      assetsDir: "src",
      emptyOutDir: true,
      rollupOptions: {
        input: htmlInputs,
        output: {
          assetFileNames: `src/[name].[ext]`,
          // Filenames stay hash-free (server-embedded deploy). Code-split
          // exercise/custom chunks all have `index.js` entry points, which
          // collide under a bare [name] scheme (Rollup renames them index2,
          // index3, …). Name each after its parent directory instead so the
          // chunks are stable and descriptive (src/DraggableFillGaps.js, …).
          chunkFileNames: (chunkInfo) => {
            const facadeId = chunkInfo.facadeModuleId;
            if (facadeId) {
              const match = facadeId.match(/[\\/]([^\\/]+)[\\/]index\.[jt]sx?$/);
              if (match) return `src/${match[1]}.js`;
            }
            return `src/[name].js`;
          },
          entryFileNames: `src/[name].js`,
          // Peel large, stable vendors into their own chunks so no single chunk
          // trips the 500 kB warning and the framework/UI libs cache across
          // deploys. App-code lazy chunks (exercises, custom components) are
          // emitted automatically from the dynamic import() seams in App.jsx.
          // NOTE: filenames stay hash-free (src/[name].js) by the scheme above —
          // give each vendor chunk a unique, stable name to avoid collisions.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            // React + Radix share a dependency cycle at the chunk boundary
            // (Radix builds on React, React-DOM's reconciler re-enters shared
            // helpers Radix also uses), so splitting them apart produces a
            // circular-chunk warning. Keep the whole React/Radix UI runtime in
            // one framework chunk — it changes rarely and caches well together.
            if (
              /[\\/]react-dom[\\/]/.test(id) ||
              /[\\/]scheduler[\\/]/.test(id) ||
              /[\\/]react[\\/]/.test(id) ||
              id.includes('@radix-ui') ||
              id.includes('@floating-ui') ||
              id.includes('react-remove-scroll') ||
              id.includes('react-style-singleton') ||
              id.includes('use-sidecar') ||
              id.includes('use-callback-ref') ||
              id.includes('use-sync-external-store') ||
              id.includes('aria-hidden') ||
              id.includes('get-nonce')
            ) {
              return 'react-vendor';
            }
            if (id.includes('dompurify')) return 'dompurify';
            if (id.includes('lucide-react')) return 'icons';
            if (
              id.includes('tailwind-merge') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx')
            ) {
              return 'ui-utils';
            }
            return 'vendor';
          }
        }
      }
    },
    customLogger: logger,
    plugins: [
      react(),
      tailwindcss(),
      generateSlugRoutes(),
      viteStaticCopy({
        targets: [
          {
            dest: './src/lo-config', // destination inside dist/
            src: 'src/lo-config/*.json' // path to your file
          },
          {
            dest: './src', // destination inside dist/
            src: 'src/index*.json' // path to your file
          }
        ]
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "./src"),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      include: ['src/**/*.{test,spec}.{js,jsx}'],
      coverage: {
        provider: 'v8',
        reportsDirectory: './coverage',
        include: ['src/audio/**', 'src/utils/**'],
      },
    }
  });
});
