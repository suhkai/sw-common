'use strict';
const lex = require('css-lexer');
const fs = require('fs').promises;
const { resolve, extname } = require('path');

async function init() {
    const [fileName] = process.argv.slice(2, 3);
    if (!fileName) {
        throw new Error('No file name as first argument')
    }
    const file = resolve(fileName) + (extname(fileName) ? '' : '.css');
    const data = await fs.readFile(file, { encoding: 'utf8' });
    // create string iterator
    const strIter = new lex.Preprocessor(data[Symbol.iterator]());
    const tokenIter = new lex.CachedIterator(lex.tokenizer(strIter));
    const strCursor = strIter.peek();
    const tokCursor = tokenIter.peek();
    // absorbline
    let prevRow = 1;
    const line = [];
    console.log(lex.tokenMap)
    do {
        tokenIter.next();
        line.push(tokCursor.value);
        if (tokCursor.value.d.e.loc.row !== prevRow) {
            prevRow = tokCursor.value.d.e.loc.row;
            const text = line.map(({ d: { d } }) => d === undefined ? ' ': d).join('');
            console.log(text);
            line.splice(0);
        }
    } while (!tokCursor.done)
}

init().catch(err => console.log(err));




