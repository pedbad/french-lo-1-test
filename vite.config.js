import { createLogger, defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
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

export default defineConfig(() => {
	const includeDebug = process.env.VITE_INCLUDE_DEBUG === 'true';
	const htmlInputs = {
		main: path.resolve(projectRoot, 'index.html'),
		...(includeDebug ? { debugSandbox: path.resolve(projectRoot, 'debug-sandbox.html') } : {}),
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
					chunkFileNames: `src/[name].js`,
					entryFileNames: `src/[name].js`
				}
			}
		},
		customLogger: logger,
		plugins: [
			react(),
			tailwindcss(),
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
		}
	});
});
