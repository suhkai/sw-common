

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import url from 'rollup-plugin-url';
import assets from 'postcss-assets';

console.log(assets({
  //loadPaths: ['node_modules/', 'src/'],
  cachebuster: true,
  relative: true
}));


const plugins = [
  url({
    limit: 0, // inline files < 10k, copy files > 10k
    include: ["node_modules/@easyfonts/saira-typeface/fonts/*.woff2"], // defaults to .svg, .png, .jpg and .gif files
    emitFiles: true // defaults to true
  }),
  postcss({
    modules: true,
    extract: true,
    extensions: ['.css', '.woff2'],
    plugins: [
      simplevars(),
      nested(),
      cssnext({ warnForDuplicates: false, }),
      cssnano(),
      assets({
        loadPaths: ['node_modules/', 'src/'],
        cachebuster: true,
        relative: true
      })
    ],
  }),
  nodeResolve({
    module: false,
    jsnext: true,
    main: true,
    browser: true,
    preferBuiltins: false
  }),
  commonjs({
    include: 'node_modules/**',
    ignoreGlobals: false,
  }),
  typescript({
    typescript: require('typescript'),
  }),
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

export default {
  input: 'src/primer.ts',
  output: [{
    dir: 'dist',
    format: 'iife'
  }],
  //sourceMap: 'inline',
  plugins
}