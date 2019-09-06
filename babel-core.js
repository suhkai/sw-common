const { resolve } = require('path');
const babel = require('babel-core');
babel.transformFile(resolve('./src/main-blb.js'), (err, result) => {
    console.log(err);
    console.log(Object.getOwnPropertyNames(result));
    console.log(result.code)
});