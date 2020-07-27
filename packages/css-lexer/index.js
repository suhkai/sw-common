const CachedStringIterator = require('./lib/lexer/cachedStringiterator');
const CachedIterator = require('./lib/lexer/cachedIterator');
const tokens = require('./lib/lexer/tokenizer');
const tokenizer = require('./lib/lexer/tokenizer')
const atrule = require('./lib/parser/atrule');
const component = require('./lib/parser/component');
const cssFunction = require('./lib/parser/function');
const rule = require('./lib/parser/rule');
const simpleBlock = require('./lib/parser/simple-block')

module.exports = {
    lexer: {
        StringIterator: CachedStringIterator,
        CachedIterator,
        tokenMap: tokens,
        tokenizer
    },
    recognizers: {
        atrule,
        component,
        cssFunction,
        rule,
        simpleBlock
    }
}