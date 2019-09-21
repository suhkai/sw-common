const inputOptions = require('./rollup/options/io');

const isProduction = process.argv.includes('--prod') !== 0;

console.log(inputOptions(isProduction));