const { basename } = require('path');
const fs = require('fs');

//3rd party, NOT required for node >= v12.0.0
const rmdirRecursiveSync = require('rmdir-recursive').sync;
const colors = require('colors');

//rollup
const { rollup, watch } = require('rollup');

//build
const inputOptions = require('./rollup/options/io');
const { iife } = require('./rollup/options/oo');

//init
const isProduction = process.argv.includes('--prod') !== 0;
const io = inputOptions(isProduction);
async function build() {
    
    const t1 = new Date();
    rmdirRecursiveSync('./dist');
    const bundle = await rollup(io);
    //console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const { output } = await bundle.generate(iife);
    for(const chunk of output){
        for (const [entry, value] of Object.entries(chunk.modules)){
            console.log(`emitted ${basename(entry)}\t\t${value.renderedLength} bytes`.green);
        }
    }
    //console.log(output);
    //await bundle.write(iife);
    const d = new Date() - t1;
    console.log(`build took ${d / 1000} sec`.green);
}

build().catch(err => {

    console.log(String(err).red);
});