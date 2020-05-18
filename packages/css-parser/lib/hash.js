'use strict'
const { HASH } = require('./tokens');
const { isNL, isEscapeStart, isIdStart, isName } = require('./checks-and-definitions');
const escape = require('./escape');

// flag:
// - "unrestrictive"
// - "id"
//



//https://www.w3.org/TR/css-syntax-3/#consume-token
// -> see consume hash section under this link
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

    const start = { loc: { col: _1.col, row: _1.row }, o: _1.o };
    // consume name, this will be the "value" of the hash
    // § 4.3.11. Consume a name
    // https://www.w3.org/TR/css-syntax-3/#consume-a-name
    const replacements = [];
    let prev = _1;
    let end;
    while (!step.done) {
        const _next = step.value;
        if (isName(_next.d)) {
            prev = _next;
            iter.next();
            continue;
        }
        // escape ??
        if (_next.d === '\\') {
            iter.next();
            const _2 = step.value;
            if (isEscapeStart(_next, _2)) {
                const replace = escape(_next, iter);
                replacements.push([_next, replace]);
                prev = _next;
                continue;
            }
            else {
                iter.reset(prev.o, prev.col, prev.row);
            }
        }
        end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
        break;
    }
    if (!end) {
        end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
    }
    // replace shit
    let d = iter.slice(_2.o, end.o + 1).split(''); // every char s
    replacements.reverse()
    for (const [_, replace] of replacements) {
        //{ s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
        d.splice(_.o - _2.o, replace.o + 1 - _.o, replace.s)
    }
    return { id: HASH, flag, value: d.join(''), s: start, e: end };
};
