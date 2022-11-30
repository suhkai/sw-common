#!/usr/bin/env node
// @ts-check

import { mkdirSync, readFileSync, rmdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, relative, dirname, isAbsolute } from 'node:path';
import ts from 'typescript';
import { parse } from 'acorn';
import jxpath from '@mangos/jxpath';
import { generate } from 'escodegen';

const DIR = './dist';
const DIR_COMMONJS = './dist/commonjs';
const DIR_ESM = './dist/esm';

// Delete and recreate the output directory.
try {
  rmdirSync(DIR, { recursive: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
mkdirSync(DIR_COMMONJS, { recursive: true });
mkdirSync(DIR_ESM, { recursive: true });
// Read the TypeScript config file.
const { config } = ts.readConfigFile('tsconfig.json', (fileName) =>
  readFileSync(fileName).toString(),
);

const sourceDir = join('src');
const sourceFile = join('src', 'index.ts');

// Build CommonJS module.
compile([sourceFile], DIR_COMMONJS, {
  module: ts.ModuleKind.CommonJS,
  declaration: false,
  allowSyntheticDefaultImports: false,
});

// Build an ES2015 module and type declarations.

compile([sourceFile], DIR_ESM, {
  module: ts.ModuleKind.ES2020,
  declaration: true,
  declarationDir: './types', // this becomes ./dist/types
});

/**
 * Compiles files to JavaScript.
 *
 * @param {string[]} files
 * @param {ts.CompilerOptions} options
 */
function compile(files, targetDIR, options) {
  const compilerOptions = { ...config.compilerOptions, ...options };
  const host = ts.createCompilerHost(compilerOptions);

  host.writeFile = (fileName, contents) => {
    const isDts = fileName.endsWith('.d.ts');
    const relativeToSourceDir = relative(sourceDir, fileName);
    const subDir = join(targetDIR, dirname(relativeToSourceDir));

    mkdirSync(subDir, { recursive: true });
    let path = join(targetDIR, relativeToSourceDir);

    if (!isDts) {
      const astTree = parse(contents, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ranges: true,
        locations: false,
      });

      switch (compilerOptions.module) {
        case ts.ModuleKind.CommonJS: {
          // Adds backwards-compatibility for Node.js.
          // eslint-disable-next-line no-param-reassign
          // contents += `module.exports = exports;\n`;
          // Use the .cjs file extension.
          const selectedNodes = jxpath(
            '/**/[type=CallExpression]/callee/[type=Identifier]/[name=require]/../arguments/[type=Literal]/',
            astTree,
          );
          // loop over all .js and change then

          for (const node of selectedNodes) {
            node.value = node.value.replace(/\..?js/, '.cjs');
            node.raw = node.raw.replace(/\..?js/, '.cjs');
          }
          contents = generate(astTree);
          //console.log(Array.from(data));

          // with jxpath we wcould do like this
          //  /**/[type=CallExpression]/callee/[type=Identifier]/[name=require]/../arguments/[type=Literal]/[value=something.js]

          /*Node {
            type: 'CallExpression',
            start: 10,
            end: 33,
            callee: Node { type: 'Identifier', start: 10, end: 17, name: 'require' },
            arguments: [
              Node {
                type: 'Literal',
                start: 18,
                end: 32,
                value: 'something.js',
                raw: "'something.js'"
              }
            ],
            optional: false
          }
          */

          path = path.replace(/\.js$/, '.cjs');
          break;
        }
        case ts.ModuleKind.ES2020: {
          const selectedNodes = jxpath(
            '/**/[type=ImportDeclaration]/source/',
            astTree,
          );
          for (const node of selectedNodes) {
            node.value = node.value.replace(/\..?js/, '.mjs');
            node.raw = node.raw.replace(/\..?js/, '.mjs');
          }
          contents = generate(astTree);
          // Use the .mjs file extension.
          path = path.replace(/\.js$/, '.mjs');
          break;
        }
        default:
          throw Error('Unhandled module type');
      }
    }

    // writeFile from "fs/promises"
    writeFile(path, contents)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Built', path);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }; // host.writeFile function definition end

  const program = ts.createProgram(files, compilerOptions, host);

  program.emit();
}
