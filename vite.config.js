import { createLogger, defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const logger = createLogger();
const loggerWarn = logger.warn;

logger.warn = (msg, options) => {
	// Ignore 'esbuild css minify thing is not a known CSS property'
	if (msg.includes('esbuild css minify') && msg.includes(' is not a known CSS property')) return;
	loggerWarn(msg, options);
};

export default defineConfig(({ command }) => ({
	assetsInclude: [
		'**/*.mp3',
		'**/*.jpg',
		'**/*.otf',
		'**/*.svg',
		'**/*.ttf'
	],
	base: command === 'build' ? `./` : `/projects/richard/`,
	build: {
		assetsDir: "src",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				assetFileNames: `src/[name].[ext]`,
				chunkFileNames: `src/[name].js`,
				entryFileNames: `src/[name].js`
			}
		}
	},
	customLogger: logger,
	plugins: [
		{
			buildStart() {
				const src = path.resolve('dist/index.html');
				const backup = path.resolve('.vite-index-backup.html');
				if (fs.existsSync(src)) {
					fs.copyFileSync(src, backup);
				}
			},
			closeBundle() {
				const dest = path.resolve('dist/index.html');
				const backup = path.resolve('.vite-index-backup.html');
				if (fs.existsSync(backup)) {
					fs.copyFileSync(backup, dest);
					fs.unlinkSync(backup);
				}
			},
			name: 'preserve-dist-index'
		},
		react(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					dest: './src/learningObjectConfigurations/fr', // destination inside dist/
					src: 'src/learningObjectConfigurations/fr/*.json' // path to your file
				},
				{
					dest: './src', // destination inside dist/
					src: 'src/index*.json' // path to your file
				},
				{
					dest: '/sounds',
					src: './public/sounds'
				},
				{
					dest: '/images',
					src: './public/images'
				},
				{
					dest: '/fonts',
					src: './public/fonts'
				}
			]
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
		},
	}
}));
