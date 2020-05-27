// §4.3.12. Consume a number
// isNumberStart makes a lot of sanity checks before trying to consume a number

'use strict'
const { isDigit } = require('./checks-and-definitions');
const { NUMBER } = require('./tokens');

function consumeDigits(iter) {
    const step = iter.peek();
    let prev;
    while (!step.done) {
        if (!isDigit(step.value.d)) {
            break;
        }
        prev = step.value;
        iter.next();
    }
    return prev;
}


module.exports = function consumeNumber(iter) {
    const step = iter.peek();
    const _1 = step.value;
    const start = { loc: {  col: _1.col, row: _1.row } , o: _1.o,};
    let last
    //2
    let type = 'integer'
    if (_1.d === '+' || _1.d === '-') {
        iter.next();
    }
    //3
    last = consumeDigits(iter);
    //4
    if (!step.done) {
        if (step.value.d === '.') {
            const r1 = step.value;
            iter.next();
            const r2 = step.value;
            if (r2 && isDigit(r2.d)) {
                last = consumeDigits(iter);
                type = 'number'
            }
            else {
                iter.reset(r1.o, r1.col, r1.row);
            }
        }
    }
    //5
    if (!step.done) {
        const _i1 = step.value;
        if (_i1.d === 'E' || _i1.d === 'e') {
            iter.next();
            let _i2 = step.value;
            if (_i2.d === '+' || _i2.d === '-') {
                iter.next();
                _i2 = step.value;
            }
            if (_i2 && isDigit(_i2.d)) {
                last = consumeDigits(iter);
                type = 'number'
            }
            else {
                // this is an error // reset back to 'E' , 'e' position
                iter.reset(_i1.o, _i1.col, _i1.row);
            }
        }
    }
    return { id: NUMBER, type, d: iter.slice(_1.o, last.o + 1), s: start, e: { loc: {  col: last.col, row: last.row,  }, o: last.o } };
}
