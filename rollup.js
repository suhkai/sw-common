const rollup = require('rollup');


const inputOptions = {
  
// core input options
//xx  external,
//xx  input, // required
//  plugins,
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
//intro,
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
        format: 'iife',
        dir:'dist',
        entryFileNames: '[name]-[hash]-[format].js',
        name: 'mybundle' //Access the exports of the bundle
    }
}

async function build() {
    const bundle = await rollup.rollup(inputOptions);
    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const { output } = await bundle.generate(outputOptions);
    for (const chunkAsset of output) {

        if (chunkAsset.type === 'chunk') {
            console.log('Asset-code', chunkAsset.code);
            console.log('Asset-modules', chunkAsset.modules);
        }
    }
    await bundle.write(outputOptions);

}

build();