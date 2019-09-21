const iife = {
    format: 'iife',
    dir: 'dist',
    entryFileNames: '[name]-[format]-[hash].js',
    name: 'boot-loader',
    sourcemap: true,
    compact: false,
    extend: true,
    externalLiveBindings: true,
    freeze: true,
    noConflict: true,
    globals: {
        preact: 'window.preact'
    },
    exports: 'named',
    interop: false,
    sourcemap: true,
    sourcemapExcludeSources: true,
    strict: false
};

module.exports = {
    iife
};