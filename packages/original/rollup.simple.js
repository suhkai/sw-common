const plugin = require('./plugin');
const rmdirRecursive = require('rmdir-recursive');
const { rollup, watch } = require('rollup');
const { resolve } = require('path');

// array, can have multiple outputs for single input
const oo = [{
    output:{
        format: 'iife'
    },
    dir: './dist',
    banner: '/* banner comment */',
    assetFileNames:'[name]-[hash].[ext]',
    chunkFileNames:'[name]-[hash].js',
    entryFileNames:'[name]-entry-[hash].js'
}];

const io = {
    input: {
        //1:'./lm'
        bundle: resolve('./es7.js'),
    },
    plugins: [plugin({ dir: './dist'})]
};


async function build() {
    // clean out dist directory
    const t1 = new Date();
    //rmdirRecursive('./dist');
    const bundle = await rollup(io);
    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    for (let i = 0; i < oo.length; i++) {
        const o = oo[i];
        const {
            output
        } = await bundle.generate(o);
        console.log(output);
        await bundle.write(o);
    }
}
build();