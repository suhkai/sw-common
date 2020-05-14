'use strict'
const { WS } = require('./tokens')
const { isWS } = require('./checks-and-definitions')
module.exports = function (iterator) {
    const step = iterator.peek();
    let prev = step.value;
    iterator.next();
    const start = { loc: { col: prev.col, row: prev.row }, o: prev.o }
    let end;
    while (!step.done) {
        const _1 = step.value;
        if (!isWS(_1.d)){
            end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
            break;
        }
        prev = _1;
        iterator.next();
    }
    if (!end) { // we hit the end of the stream
        end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
    }
    return { id: WS, s: start, e:end };
};
