https://hackernoon.com/building-and-publishing-a-module-with-typescript-and-rollup-js-faa778c85396
// ^this one looks good

// following https://github.com/Microsoft/TypeScript-Babel-Starter#using-rollup

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = ['.mjs', '.js', '.jsx', '.json', '.css', '.woff', '.woff2', '.ts', '.tsx'];

const plugins = [
  nodeResolve({
    module: true,
    jsnext: true,
    main: true,
    preferBuiltins: false
  }),
  commonjs({
    include: 'node_modules/**',
    ignoreGlobals: false,
  }),
  /*typescript({
    typescript: require('typescript'),
  }),*/
  babel({
    presets: [
      ["@babel/env", {
        "useBuiltIns": "usage",
        "corejs": {
          version: 3,
          proposals: true
        }
      }],
      "@babel/preset-typescript",
      // 'minify'
    ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
      "@babel/plugin-transform-async-to-generator",
      // 😠 😠😠😠
      // below plugin helps resolve this safari issue((
      // see link https://stackoverflow.com/questions/33878586/safari-babel-webpack-const-declarations-are-not-supported-in-strict-mode
      "@babel/plugin-transform-block-scoping"
    ]
  })
];
/*
options: {
  presets: [
    ["@babel/env", {
      "useBuiltIns": "usage",
      "corejs": {
        version: 3,
        proposals: true
      }
    }],
    "@babel/preset-typescript",
    // 'minify'
  ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
      "@babel/plugin-transform-async-to-generator",
      // 😠 😠😠😠
      // below plugin helps resolve this safari issue((
      // see link https://stackoverflow.com/questions/33878586/safari-babel-webpack-const-declarations-are-not-supported-in-strict-mode
      "@babel/plugin-transform-block-scoping"
    ]
}*/

export default {
  input: 'src/primer.ts',
  output: [{
    dir: 'dist',
    format: 'umd'
  }],
  plugins
}