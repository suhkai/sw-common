const fs = require('fs');
const filename = "es6.js";
const source = fs.readFileSync(filename, "utf8");
const babel = require('@babel/core');

// Load and compile file normally, but skip code generation.
const { ast } = babel.transformSync(source, { filename, ast: true, code: false });

// Minify the file in a second pass and generate the output code here.
const { code, map } = babel.transformFromAstSync(ast, source, {
    filename,
    presets: [
        "minify",
        [
            "@babel/preset-env",
            {
                targets: {
                    edge: "17",
                    firefox: "60",
                    chrome: "67",
                    safari: "11.1",
                    ie:"11"
                    //esmodules: true,
                },
               corejs: 'core-js@3',
               useBuiltIns: "usage"
            }]],
    babelrc: false,
    configFile: false,
});
console.log(code);