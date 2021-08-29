import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

console.log(node);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	//compilerOptions: null,
	//extensions:['.svelte'],

	kit: {
		//https://kit.svelte.dev/docs#configuration
		// adapter: node({ out: 'my-output-directory' }), // typo in err message it says "adaptor"
		adapter: node(),
		amp: false,
		appDir: '_app',
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker.ts',
			template: 'src/app.html'
		},
		floc: false,
		//host: null,
		//hostHeader: null,
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
		//paths: {
		//	assets: '',
		//	base: '/example'
		//},

		// hydrate the <div id="svelte"> element in src/app.html
	
		target: '#svelte',



	},
    // Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
};

export default config;
