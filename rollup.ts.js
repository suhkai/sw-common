//node
const path = require('path');
const fs = require('fs');
const rmdirRecursive = require('rmdir-recursive');
//rollup and plugins
const rollup = require('rollup');
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
    cache: true,
    //inlineDynamicImports,
    manualChunks: {
        vendor: ['classnames'],
        react:['react']
        },
    //onwarn,
    //preserveModules,
    //strictDeprecations,
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
        bundle: './src/primer.ts',
    }

};

const outputOptions = {
    output: {
        format: 'cjs',
        dir: 'dist',
        entryFileNames: '[name]-[hash]-[format].js',
        name: 'mybundle', //Access the exports of the bundle
        sourcemap: true,
    }
}

async function build() {
    // clean out dist directory
    const t1 = new Date(); 
    rmdirRecursive('./dist');
    const bundle = await rollup.rollup(inputOptions);
    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const {
        output
    } = await bundle.generate(outputOptions);
    /*for (const chunkAsset of output) {

        if (chunkAsset.type === 'chunk') {
            console.log('Asset-code', chunkAsset.code);
            console.log('Asset-modules', chunkAsset.modules);
        }
    }*/
    await bundle.write(outputOptions);
    const d = new Date()-t1;
    console.log(`build took ${d/1000} sec`)
}
build();