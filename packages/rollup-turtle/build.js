const rollup = require('rollup');
const { terser } = require('rollup-plugin-terser')
const json = require('@rollup/plugin-json');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const   commonjs  = require('@rollup/plugin-commonjs');
const myPlugin = require('./src/plugin');

const nodePolyfills  = require('rollup-plugin-node-polyfills');
const html = require('@rollup/plugin-html');

const fs = require('fs');

const path = require('path');

const inputOptions = {
    input: 'src/index.js',
    external: ['computations'],
    plugins: [
        //html(),
        myPlugin(), // this plugin will be run first
        json(),
        //resolve(),
        //commonjs(),
        
        //myPlugin()
        
      //  nodePolyfills()
    ]
};
let cnt = 0;
const outputOptions = {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'iife',
    name: 'somevar',
    globals:{
        computations: 'globalThis.$$'
    },
    banner: '/* some fuckin banner */',
    footer: '/* foot loose */',
    compact: false,
    extend: true,
    exports: 'named',
    //inlineDynamicImports: false,
    //interop: 'esModule',
    intro: "const env = 'production'",
    /*manualChunks(id) {
        if (id.includes('lodash')){
            return 'vender';
        }
    },*/
    //reserveModules: true,
   // preserveModulesRoot: './',
    sourcemap: true,
};


async function build() {

    fs.rmdirSync('./dist', {recursive: true});
    const bundle = await rollup.rollup(inputOptions);
    console.log('----------------------------------------------')
    const { output: chunks } = await bundle.write(outputOptions);
    for (const chunk of chunks) {
        const { name, type, filename, map } = chunk;
        //console.log({ name, type, filename, map })
        //console.log(`${chunk.name}-${JSON.stringify(chunk.exports)}-${JSON.stringify(Object.keys(chunk.modules))}`);
    }
   
}


build()
    .catch(err => console.log(`Build failed because: ${String(err)}`))
    .then(()=> console.log(`Build ended ${cnt}`));