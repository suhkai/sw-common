const { resolve } = require('path');
const parser = require('@babel/parser');
const core = require("@babel/core");

core.transform("code", {
    presets: ["@babel/preset-typescript"],
});
/*babel.transformFile(resolve('./src/main-blb.js'), (err, result) => {
    console.log(err);
    console.log(Object.getOwnPropertyNames(result));
    console.log(result.code)
});*/

const code1 = `
    const cb=1;
    import { b } from './something-else';
    function abc(){
        return (<div className="some" >
        hello world
        </div>);
    }
    function klm(a: number): numberx {
        return a+1;
    }
`;

const ast1 = parser.parse(code1, {
    allowImportExportEverywhere: false,
    sourceType: 'module',
    sourceFilename: 'helper.js',
    plugins: ['jsx', 'typescript']
});

console.log(ast1);