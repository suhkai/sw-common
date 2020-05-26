// § 4.3.7. Consume an escaped code point
// the token it emit is an internal substitution token
// https://www.w3.org/TR/css-syntax-3/#consume-escaped-code-point
'use strict'
const { STRING, BADSTRING } = require('./tokens');
const { isWS, isEscapeStart, isHexDigit  } = require('./checks-and-definitions');
const maxAllowed = parseInt('0x10FFFF');

module.exports = function consumeEscaped(_1, iterator) {
    const step = iterator.peek();
    //_1 is the '\' token and the currect cp is a valid escape
    if (step.done){
        return { s: '\ufffd', loc: { col: _1.col, row: _1.row }, o:_1.o }
    }
    let _2 = step.value;
    if (!isHexDigit(_2.d)) {
       return { s: _2.d, loc: { col: _2.col, row: _2.row }, o:_2.o };
    }
    let dg = '';
    let last;
    while (!step.done && dg.length <= 6 && isHexDigit(step.value.d)) {
        dg = dg + step.value.d
        last = step.value
        iterator.next();
    }
    if (step.value && isWS(step.value.d)){ // consume optional whitespace
        last = step.value;
        iterator.next()
    }
    const cp = parseInt(`0x${dg}`)
    if (cp > maxAllowed){
        return { s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
    }
    return { s: String.fromCodePoint(cp), loc: { col: last.col, row: last.row }, o:last.o }
};
