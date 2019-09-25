'use strict';
const {
    resolve
} = require('path');

require('colors');
const tsc = require('typescript');
const typescript = require('rollup-plugin-typescript2');
const node_resolve = require('rollup-plugin-node-resolve');
const convertCommonJS_to_ES6 = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');


//extraction
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { builtinModules } = require('module');

const entry = resolve('./src/index.ts');

console.log(entry);

function plugins() {
    const rc = [
        typescript({
            tsconfigDefaults: {},
            tsconfig: require.resolve('../../tsconfig.json'),
            tsconfigOverride: {
                declaration: false
            },
            typescript: tsc,
            sourceMap: true,
        }),
        babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            sourceMaps: true,
            exclude: 'node_modules/**', // no node_modules should be transpiled
            babelrc: false,
            configFile: false,
            sourceMaps: true,
            presets: ["@babel/preset-env"]
        }),
        // how to resolve modules imported from in /node_modules
        node_resolve({
            mainFields: ['main'],
            preferBuiltins: true
        }),
        convertCommonJS_to_ES6({
            include: /node_modules/,
            //namedExports: { 'sqlite3': ['verbose'] },  
        }),
        uglify({ toplevel: true, compress: true })
    ];
    return rc;
}

const { devDependencies, dependencies } = require('../../package.json');

module.exports = function () {
    return {
        preserveModules: true,
        external: (id, parentId, resolved) => {
            //if (id === 'sqlite3') return false;
            if (resolved) { console.log('WHY IS THIS RESOLVED??'.red, id, parentId); return false; }
            if (id in devDependencies || id in dependencies) return true;
            if (builtinModules.includes(id)) return true;
            return false;
        },
        cache: false,
        strictDeprecations: true, // do not use deprecated options 
        context: 'self',
        treeshake: {
            annotations: true, // 
            propertyReadSideEffects: false, // got it
            tryCatchDeoptimization: false, // = false will treeshake within try{} catch{} blocks.
            unknownGlobalSideEffects: false // understood, the last explenation was not completely correct.
        },
        perf: true, // collect build metrics
        plugins: plugins(),
        input: {
            storage: entry,
        }
    };
};