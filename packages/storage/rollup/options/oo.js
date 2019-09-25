const cjs = {
    format: 'cjs',
    dir: 'dist',
    entryFileNames: '[name]-[format]-[hash].js',
    name: 'storage',
    sourcemap: true,
    compact: false,
    extend: true,
    externalLiveBindings: true,
    freeze: true,
    noConflict: true,
    exports: 'named',
    interop: false,
    sourcemap: true,
    sourcemapExcludeSources: true,
    strict: false
};

module.exports = {
    cjs
};