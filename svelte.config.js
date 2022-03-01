import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				viteCommonjs()
			],
			optimizeDeps: {
				esbuildOptions: {
					plugins: [esbuildCommonjs(["inkjs"])],
				}
			},
			include: ["inkjs"]
		}
	}
};

export default config;
