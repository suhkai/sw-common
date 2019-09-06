import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import builtins from 'builtin-modules';
import { uglify } from "rollup-plugin-uglify";
import { DEFAULT_EXTENSIONS } from '@babel/core';

const extensions = [
  ...DEFAULT_EXTENSIONS,
  '.ts',
  '.tsx'
];

const plugins = [
  //uglify(),
  nodeResolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    },
    mainFields: ['browser'],
    //
    //
    //
    preferBuiltins: true
  }),
  commonjs({
    include: 'node_modules/**',
    //ignoreGlobals: false,
  }),
  typescript({
    typescript: require('typescript'),
  }),
  babel({
    extensions,
    //include: ['src/**/*'],
    /*presets: [
      ["@babel/env", {
        "useBuiltIns": "usage",
        "corejs": {
          version: 3,
          proposals: true
        }
      }],
      ["@babel/preset-typescriptxx"],
    ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
      "@babel/plugin-transform-async-to-generator",
      // 😠 😠😠😠
      // below plugin helps resolve this safari issue((
      // see link https://stackoverflow.com/questions/33878586/safari-babel-webpack-const-declarations-are-not-supported-in-strict-mode
      "@babel/plugin-transform-block-scoping"
    ]*/
  }),
  //uglify(),

];

export default {
  input: 'src/primer.ts',
  external: builtins,
  output: [{
    file: 'dist/primer.js',
    format: 'iife' // immediatly invoked function
  }],
  plugins
}