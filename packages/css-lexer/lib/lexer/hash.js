//https://www.w3.org/TR/css-syntax-3/#consume-token
// -> see consume hash section under this link

'use strict'
const { HASH } = require('./tokens');
const { isIdStart } = require('./checks-and-definitions');
const absorbName = require('./name');

// flag:
// - "unrestrictive"
// - "id"
//


module.exports = function hash(_1, iter) {
    const step = iter.peek();
    const _2 = step.value;
    iter.next();
    const _3 = step.value;
    iter.next();
    const _4 = step.value;
    iter.reset(_2.o, _2.col, _2.row);
    let flag = 'unrestricted' // or 'id'
    if (isIdStart(_2, _3, _4)) {
        flag = 'id';
    }
    const name = absorbName(iter);
    const start = { loc: { col: _1.col, row: _1.row }, o: _1.o };
    return { id: HASH, flag, value: name.value, s: start, e: name.e };
};
