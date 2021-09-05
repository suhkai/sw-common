import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	//compilerOptions: null,
	//extensions:['.svelte'],
	kit: {
		//https://kit.svelte.dev/docs#configuration
		// adapter: node({ out: 'my-output-directory' }), // typo in err message it says "adaptor"
		adapter: node(),
		//adapter: staticAdapter(),
		amp: false,
		appDir: '_app',
		files: {
			assets: 'static',
			//hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker.ts',
			template: 'src/app.html'
		},
		floc: false,
		//host: ..., replaces value for "page.host" (from the url value of client) in "load" https://kit.svelte.dev/docs#loading
		//hostHeader: ... 
		//  if you are behind a reverse proxy, 
		//  use hostHeader: 'X-Forwarded-Host'
		hydrate: true,
		//We are not building a library
		// package: {
		// 	dir: 'package',
		// 	emitTypes: true,
		// 	exports: {
		// 		include: ['**'],
		// 		exclude: ['_*', '**/_*']
		// 	},
		// 	files: {
		// 		include: ['**'],
		// 		exclude: []
		// 	}
		// }
		paths: {
			// TODO: didnt get this to work yet
			// assets: '/x',

			// when using an adapter default (not adapter:node)
			// it will prefix all css, js, png urls with the "base"
			//base: '/output/client/_app'
		},
		prerender: {
			crawl: true,
			enabled: true,
			onError: 'continue',
			pages: ['*']
		},
		router: true,
		ssr: true,
		// hydrate the <div id="svelte"> element in src/app.html

		target: '#svelte',
		trailingSlash: 'never'
		//
		// vite: {...} config object for vitejs.dev
	},
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		replace: [['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)]],
	}),
};

export default config;
