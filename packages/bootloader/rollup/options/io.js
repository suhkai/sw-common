'use strict';
const {
    resolve
} = require('path');

const color = require('colors');

const tsc = require('typescript');
const typescript = require('rollup-plugin-typescript2');

// for using modules from node_modules
const node_resolve = require('rollup-plugin-node-resolve');
//Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
const convertCommonJS_to_ES6 = require('rollup-plugin-commonjs');
// only use in production
const {
    uglify
} = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');

//extraction
const {
    DEFAULT_EXTENSIONS
} = require('@babel/core');

const entry = resolve('./src/boot.tsx');

function plugins(isProd) {
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
            exclude: 'node_modules/**',
            babelrc: false,
            configFile: false,
            sourceMaps: true,
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {
                            edge: "17",
                            firefox: "60",
                            chrome: "67",
                            safari: "11.1",
                            ie: "11",
                            esmodules: true,
                        },
                        useBuiltIns: false
                    }
                ]
            ],
            plugins: [
                ["@babel/plugin-transform-react-jsx", {
                    "pragma": "Preact.h", // default pragma is React.createElement
                    "pragmaFrag": "Preact.Fragment", // default is React.Fragment
                    "throwIfNamespace": false // defaults to true
                }]
            ]
        }),
        // how to resolve modules imported from in /node_modules
        node_resolve(),
        convertCommonJS_to_ES6({
            include: 'node_modules/**', // Default: undefined
        })
    ];
    if (isProd) {
        rc.push(uglify());
    }
    return rc;
}

module.exports = function () {
    return {
        external: ['preact'],
        strictDeprecations: true, // do not use deprecated options 
        context: 'self',
        treeshake: {
            annotations: true, // 
            propertyReadSideEffects: false, // got it
            tryCatchDeoptimization: false, // = false will treeshake within try{} catch{} blocks.
            unknownGlobalSideEffects: false // understood, the last explenation was not completely correct.
        },
        perf: true, // collect build metrics
        plugins: plugins(process.argv.includes('--prod')),
        input: {
            bootloader: entry,
        }
    };
};