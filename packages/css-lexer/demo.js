'use strict';
// node
const path = require('path');
const fs = require('fs').promises

// 3rd party
require('colors');

// api
const CachedStringIterator = require('./lib/lexer/cachedStringiterator');
const CachedIterator = require('./lib/lexer/cachedIterator');
const tokens = require('./lib/lexer/tokenizer');
const tokenizer = require('./lib/lexer/tokenizer')
const atrule = require('./lib/parser/atrule');
const component = require('./lib/parser/component');
const cssFunction = require('./lib/parser/function');
const rule = require('./lib/parser/rule');
const simpleBlock = require('./lib/parser/simple-block')


//start
async function run() {
    // first argument is the file
    const [fileName] = process.argv.slice(2, 3);
    if (typeof fileName !== 'string'){
        throw new Error(`No filename specified as first argument`);
    }
    const fullPathName = path.resolve(fileName);
    const stat = fs.stat()
    console.log(fullPathName);

}

run().then(() => undefined).catch(err => console.log(`${String(err)}`.red))