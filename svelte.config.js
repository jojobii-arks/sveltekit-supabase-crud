import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		paths: {
			base: process.env.NODE_ENV ? '' : '/sveltekit-supabase-crud'
		},
		appDir: 'internal'
	}
};

export default config;
