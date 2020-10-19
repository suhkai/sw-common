const rollup = require('rollup');
const { terser } = require('rollup-plugin-terser')
const json = require('@rollup/plugin-json');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const   commonjs  = require('@rollup/plugin-commonjs');


const nodePolyfills  = require('rollup-plugin-node-polyfills');
const html = require('@rollup/plugin-html');

const fs = require('fs');

const path = require('path');

const inputOptions = {
    input: 'src/index.js',
    external: ['computations'],
    /*onwarn(warning, warn){
        console.log(JSON.stringify(warning));
        warn(warning);
    },*/
   
    plugins: [
        //html(),
        json(),
        resolve(),
        commonjs(),
        
      //  nodePolyfills()
    ]
};
let cnt = 0;
const outputOptions = {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
    name: 'somevar',
    exports: 'named',
    globals:{
        computations: 'globalThis.$$'
    },
    assetFileNames(info){
        //console.log(JSON.stringify(info));
        return 'assets/[name]-[hash][extname]';
    },
    banner: '/* some fuckin banner */',
    footer: '/* foot loose */',
    chunkFileNames(info){
        const { name, type} = info;
        console.log(JSON.stringify({ name, type }, null, 4));
        return '[name]-[hash].js';
    },
    entryFileNames(info){
        cnt++;
        //const { name, type} = info;
        console.log(JSON.stringify(info, null, 4));
        return '[name]-entry.js';
        
    },
    compact: false,
    extend: true,
    inlineDynamicImports: false,
    //interop: 'esModule',
    intro: "const env = 'production'",
    /*manualChunks(id) {
        if (id.includes('lodash')){
            return 'vender';
        }
    },*/
    preserveModules: true,
    preserveModulesRoot: './',
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