'use strict';

const { TYPE } = require('../const');

// 5.4.8. Consume a function
// https://www.w3.org/TR/css-syntax-3/#consume-function
module.exports = function consumeFunction(src = '', start = 0, end = src.length - 1) {
    // assume already validated "fnName(" sequence
    // position of '(' token
    let i = start;
    for (; i <= end && src[i] !== '('; i++);
    for (; i <= end;) {
        // U+0029 RIGHT PARENTHESIS ())
        if (src[i] === '\u0029' || i === end) {
            return { id: TYPE.Function, start, end: i };
        }
        // no check for escaped chars in w3.org doc
        i++;
    }
}