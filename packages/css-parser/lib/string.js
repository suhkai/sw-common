'use strict'
const { STRING, BADSTRING } = require('./tokens');
const { isWS } = require('./checks-and-definitions');

// § 4.3.5. Consume a string token
// https://www.w3.org/TR/css-syntax-3/#consume-string-token

module.exports = function (iterator) {
    const step = iterator.peek();
    let cp = step.value;
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


'use strict';

const { isEscapeStart } = require('../checks-and-definitions');
const { STRING, BADSTRING } = require('../tokens');
const consumeEscaped = require('./escape');

// § 4.3.5. Consume a string token
// https://www.w3.org/TR/css-syntax-3/#consume-string-token
module.exports = function consumeStringToken(str, ecp /* ending code point */, start = 0, end = str.length - 1, advance = () => { }) {
    // Repeatedly consume the next input code point from the stream:
    let rc;
    let i = start;
    for (; i <= end; i++) {
        let c = str[i];
        if (i > start && c !== '\u000a') {
            advance(str, i - 1)
        }
        if (ecp === c) {
            rc = { id: STRING, start, end: i };
            return rc;
        }
        if (i === end) {
            // This is a parse error. Reconsume the current input code point,
            rc = { id: STRING, start, end: i }; // this is a parse error but just return string token, maybe emit a warning somehow
            return rc;
        }
        if (c === '\u000a') {
            return { id: BADSTRING, start, end: i };
        }
        if (c === '\u005C') {
            // If the next input code point is EOF, do nothing.
            if (isEscapeStart(c, str[i + 1])) {
                i = consumeEscaped(str, i, end, advance);
                continue
            }
        }
        // consume code point
    }
}