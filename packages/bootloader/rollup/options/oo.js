
const umd = {
        output: {
            //amd", "cjs", "esm", "iife", "system", "umd".
            format: 'umd',
            dir: 'dist',
            entryFileNames: '[name]-[format]-[hash].js',
            name: 'BOOT', //Access the exports of the bundle
            sourcemap: true,
            banner: '/* THIS IS A BANNER */',
            footer: '/* THIS IS A FOOTER */',
            //chunkFileNames: understood
            compact: false,
            extend: true, // very clear why its needed, extend a global by using several bundles
            externalLiveBindings: true,
            freeze: true,
            noConflict: true,
            preferConst: true, // doesnt work this is babels job
            globals: {
                react: 'Reacty'
            },
            exports: 'named',
            dynamicImportFunction: 'hello-world',
            amd: {
                id: 'my-bundle',
                define:'no-way-dude'
            },
            interop:false,
            // doesnt make sense with cjs,esm, system
            paths: function (id){
                const map = {
                    react:'http://some-place'
                }
                console.log(`output.path.${this.format}->${id}`.red);
                return map[id];
            },
            sourcemap: true,
            sourcemapExcludeSources: true,
            strict: false
        },

    },
    {
        output:
        {
            //amd", "cjs", "esm", "iife", "system", "umd".
            format: 'cjs',
            dir: 'dist',
            //-> entryFileNames: '[name]-[hash]-[format].js',
            entryFileNames: '[name]-[format].js',
            name: 'mybundle1', //Access the exports of the bundle
            sourcemap: true,
            compact: false,
            //externalLiveBindings: true,// only for "external" imports that are re-exported
            freeze: true,
            indent: true,
            // namespaceToStringTag: // understood
            noConflict: true,
            globals: {
                react: 'Reactz'
            },
            esModule: false,
            exports: 'auto',
            dynamicImportFunction: 'hello-world',
            interop:true,
            intro: 'const ENV = "production";',
            outro: 'const ENV2 = "prod2";',
            paths: function (id){
                const map = {
                    react:'http://some-place'
                }
                console.log(`output.path.${this.format}->${id}`.red);
                return map[id];
            },
            sourcemapExcludeSources: true,
            //sourcemapFile: -> this property only works when the outout is specified by 'file' ??
            sourcemapPathTransform: function(relativePath) { // --> this is given relative to the output of the 'dist
                // not sure why src/es6 being outputted to map is argumented here as "../es6.js"
                console.log(`relativePath-${this.format}->[${relativePath}]`.red);
                return `spark://${path.basename(relativePath)}`;
            },
            strict: false
        },

    }
];

moule.exports = function(isProd){

};