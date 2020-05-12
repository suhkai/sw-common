'use strict';
const consumeName = require('./name');
const consumeUrl = require('./url');
const { TYPE } = require('../const');

// § 4.3.4. Consume an ident-like token
// https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token
module.exports = function consumeIdentLikeToken(src, start, end) {

    let i = consumeName(src, start, end);
    const name = src.slice(start, i + 1);

    if (name.toLowerCase() === 'url' && src[i+1] === '(') {
        return consumeUrl(src, start, end);
    }
    // is it '(' ?
    if (src[i + 1] === '\u0028') {
        return { id: TYPE.Function, start, end: i + 1 };
    }
    // just a regular token
    return { id: TYPE.Ident, start, end: i };
}