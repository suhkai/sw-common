//https://drafts.csswg.org/css-syntax-3/#typedef-at-keyword-token

'use strict';
const { isEscapeStart, isName } = require('./checks-and-definitions');
const consumeName = require('./name');
const { ATTOKEN } = require('./tokens');

// consume name, this will be the "value" of the hash
// § 4.3.11. Consume a name
// https://www.w3.org/TR/css-syntax-3/#consume-a-name

module.exports = function atToken(iter) {
    const step = iter.peek();
    const _1 = step.value; // this is always an "@" guaranteed to be
    const start = { loc: { col: _1.col, row: _1.row}, o: _1.o  };
    iter.next();
    const name = consumeName(iter);
    return {
        id: ATTOKEN,
        d: name.value, // name is without "@" token
        s: start, // include at token value
        e: name.e
    }
};
