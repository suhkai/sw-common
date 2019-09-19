//node
const path = require('path');
const fs = require('fs');
const rmdirRecursive = require('rmdir-recursive');
//rollup and plugins
const { rollup, watch } = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const node_builtins = require('rollup-plugin-node-builtins');
const node_resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const {
    uglify
} = require('rollup-plugin-uglify');
// babel
const {
    DEFAULT_EXTENSIONS
} = require('@babel/core');

//typescript
const tsc = require('typescript');

//misc
const colors = require('colors');
const glob = require('glob');

const {
    resolve,
    dirname
} = path;

const inputOptions = {
    // advanced input options
    external: ['react'],

    //cache: true,
    //inlineDynamicImports,
    /*
    manualChunks: {
        vendor: ['classnames'],
        react: ['react']
    }
    */
    onwarn: (warning, warn) => {
        // console.log('ipt-options-onwarn', warning, warning.toString());
        warn(warning);
    },
    //preserveModules: true,
    strictDeprecations: true, // below is deprecated and would throw an error 
    // deprecated
    treeshake: {
        pureExternalModules: true
    },
    context: 'self',

    // TODO: I AM HERE
    moduleContext: id => {
        console.log(`inp-opts-moduleContext ${id}`.red);
        return 'hello' + Math.trunc(Math.random(1) * 10);
    },
    preserveSymlinks: true,
    shimMissingExports: true,
    treeshake: {
        annotations: true, // got it
        propertyReadSideEffects: false, // got it
        tryCatchDeoptimization: false, // = false will treeshake within try{} catch{} blocks.
        unknownGlobalSideEffects: false // understood, the last explenation was not completely correct.
    },
    //chunkGroupingSize:, set max size (bytes) to chunk 
    //experimentalCacheExpiry: default 10, after 10 builds purge cache,
    //experimentalOptimizeChunks:, // autogroup chunks to have minimul *number* of chunks
    //experimentalTopLevelAwait:, 
    perf: true,
    plugins: [
        typescript({
            typescript: tsc,
            declaration: true,
            sourceMap: true,
            useTsconfigDeclarationDir: true
        }),
        babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            sourceMaps: true,
            exclude: 'node_modules/**',
            babelrc: false,
            configFile: false,
            sourceMaps: true,
            presets: [
                // "minify",
                [
                    "@babel/env",
                    {
                        targets: {
                            edge: "17",
                            firefox: "60",
                            chrome: "67",
                            safari: "11.1",
                            ie: "11",
                            esmodules: true,
                        },
                        useBuiltIns: false
                    }
                ]
            ],
        }),
        node_resolve(),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**', // Default: undefined
            //exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
            // these values can also be regular expressions
            // include: /node_modules/
            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
            extensions: ['.js'], // Default: [ '.js' ]
            // if true then uses of `global` won't be dealt with by this plugin
            ignoreGlobal: false, // Default: false
            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: true, // Default: true
            // explicitly specify unresolvable named exports
            // (see below for more details)
            // can also be a function
            namedExports: {
                'react': ['createElement', 'Component']
            }, // Default: undefined
            // sometimes you have to leave require statements
            // unconverted. Pass an array containing the IDs
            // or a `id => boolean` function. Only use this
            // option if you know what you're doing!
            ignore: ['conditional-runtime-dependency']
        }),
        //uglify({})
    ],
    input: {
        bundle: resolve('./es6.js'),
    }

};

const outputOptions = [
    {
        output: {
            //amd", "cjs", "esm", "iife", "system", "umd".
            format: 'umd',
            dir: 'dist',
            //entryFileNames: '[name]-[hash]-[format].js',
            entryFileNames: '[name]-[format]-[hash].js',
            assetFileNames: '[name]-[hash].[ext]',
            name: 'mybundle1', //Access the exports of the bundle
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

async function build() {
    // clean out dist directory
    const t1 = new Date();
    rmdirRecursive('./dist');
    const bundle = await rollup(inputOptions);
    console.log('does have getTimings', bundle.getTimings());
    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    for (let i = 0; i < outputOptions.length; i++) {
        const oo = outputOptions[i];
        const {
            output
        } = await bundle.generate(oo.output);
        /*
        for (const chunkAsset of output) {
            if (chunkAsset.type === 'chunk') {
                console.log('Asset-code', chunkAsset.code);
                console.log('Asset-modules', chunkAsset.modules);
            }
        }
        */
        await bundle.write(oo.output);
    }
    //const d = new Date() - t1;
    //console.log(`build took ${d / 1000} sec`)
    
}
build();

/*
 // core output options
xx    dir,
xx    file,
xx    format, // required
xx    globals,
xx    name,

    // advanced output options
xx   assetFileNames,
xx    banner,
xx    chunkFileNames,
xx    compact,
xx    entryFileNames,
xx    extend,
xx    footer,
xx?   interop,
xx    intro,
xx    outro,
xx    paths,
xx  sourcemap,
xx    sourcemapExcludeSources,
xx    sourcemapFile,
xx    sourcemapPathTransform, no idea why orignial sources in map files are "../es6.js"

    // danger zone
xx    amd.id,
xx    amd.define
xx    dynamicImportFunction,
xx    esModule,
xx    exports,
xx    externalLiveBindings,
xx    freeze,
xx    indent,
xx    namespaceToStringTag,
xx    noConflict,
xx    preferConst,
xx    strict
*/