const rollup = require('rollup');
const {
    resolve
} = require('path');
const colors = require('colors');
const node_builtins = require('rollup-plugin-node-builtins');
//const builtins = require('builtin-modules');
console.log(resolve('./math.js'));

function delay(t) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), t);
    });
}

function myExample() {
    return {
        name: 'my-example', // this name will show up in warnings and errors
        resolveId(source) {
            console.log(`plgin-resolveId ${source}`.red);
            if (source === './doest-exist') {
                return {
                    id: resolve('./dyn2.js'),
                    external: false
                };
            }
            return null;
        },
        load(id) {
            console.log(`plgin-load ${id}`.red);
            return null; // other ids should be handled as usually
        },
        augmentChunkHash(chunkInfo) {
            console.log(`augmentChunkHash`.red);
        },
        banner() {
            return '/*MY FIRST PLUGIN*/';
        },
        buildStart() {
            console.log('BUILD_START'.red);
        },
        buildEnd(err) {
            console.log('buildEnd:'.red);
            err && console.log(String(err).red);
        },
        generateBundle(options, bundle, isWrite) {
            console.log('GENERATE BUNDLE OPTIONS>>', options);
            console.log('GENERATE BUNDLE BUNDLE>>', bundle);
            for (const chunk in bundle) {
                chunk.code && console.log(chunk.code);
            }
        }
        // TODO: https://rollupjs.org/guide/en/#plugin-development
        // I am at "intro"
        ,
        intro: async function () {
            //await delay(1000);
            return '\'hello world\';';
        },
        load(id) {
            //throw new Error('reached here');
            console.log(this.getModuleInfo(id));
            console.log(`plg-load [${id}]`.red);
            return null;
        },
        options(io) {
            // console.log(`plg-options ${JSON.stringify(Object.entries(io))}`.red);
            return null;
        },
        outputOptions(oo) {
            console.log(`plg-options-out`.red);
            return null;
        },
        outro: '/*HELLO THIS IS A TEST*/',
        renderChunk(code, ci, oo) {
            console.log('plg-renderChunk'.red);
            return null;
        },
        renderStart() {
            console.log('plg-renderStart'.red);
        },
        resolveDynamicImport(specifier, importer) {
            console.log(`plg-resolveDynamicImport ${specifier}<-${importer}`.red);
            return resolve('./dyn.js');
        },
        // cant make it work below
        resolveFileUrl(chunkId, file, format, modId, refId, relPath) {
            console.log(`plg-resolveFileUrl`.red);
            throw new Error('stop here');
            return null;
        },
        resolveImportMeta(property, info) {
            console.log(`plg-resolveImportMeta ${property}->${JSON.stringify(info,null,4)}`.red);
            
            return null;
        }
        //next: transform(){...}

    };
}

// rollup.config.js

const inputOptions = {
    plugins: [myExample(), /*node_builtins()*/ ],
    // core input options
    //xx  external,
    //xx  input, // required
    //xx  plugins,
    //  
    //  
    //  // advanced input options
    //  cache,
    //  inlineDynamicImports,
    //  manualChunks,
    //  onwarn,
    //  preserveModules,
    //  strictDeprecations,
    //
    //  // danger zone
    //  acorn,
    //  acornInjectPlugins,
    //  context,
    //  moduleContext,
    //  preserveSymlinks,
    //  shimMissingExports,
    //  treeshake,
    //
    //  // experimental
    //  chunkGroupingSize,
    //  experimentalCacheExpiry,
    //  experimentalOptimizeChunks,
    //  experimentalTopLevelAwait,
    //  perf
    external: (id, parentId, isResolved) => {
        console.log(`external args: ${id}, ${parentId}, ${isResolved}`);
        return false;
        //if (id === './math') return false;
        //return true;
    },
    input: {
        bundle: 'es6.js',
    }

};

const outputOptions = {
    // core output options
    //xx  dir,
    //xx  file,
    //xx  format, // required
    //xx  globals,
    //xx  name,

    //advanced output options
    //assetFileNames,
    //banner,
    //chunkFileNames,
    //compact,
    //entryFileNames,
    //extend,
    //externalLiveBindings,
    //footer,
    //interop,
    //xx intro,
    //outro,
    //paths,
    //sourcemap,
    //sourcemapExcludeSources,
    //sourcemapFile,
    //sourcemapPathTransform,

    // danger zone
    //amd,
    //dynamicImportFunction,
    //esModule,
    //exports,
    //freeze,
    //indent,
    //namespaceToStringTag,
    //noConflict,
    //preferConst,
    //strict
    output: {
        format: 'commonjs',
        dir: 'dist',
        entryFileNames: '[name]-[hash]-[format].js',
        name: 'mybundle' //Access the exports of the bundle
    },
    globals: {
        [resolve('./math.js')]: 'window.LIB'
    }
}

async function build() {
    const bundle = await rollup.rollup(inputOptions);
    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const {
        output
    } = await bundle.generate(outputOptions);
    for (const chunkAsset of output) {

        if (chunkAsset.type === 'chunk') {
            console.log('Asset-code', chunkAsset.code);
            console.log('Asset-modules', chunkAsset.modules);
        }
    }
    await bundle.write(outputOptions);
}

build();