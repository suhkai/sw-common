const { charCodeCategory, isValidEscape } = require('../definitions');
const { TYPE } = require('../const');
const consumeEscaped = require('./escape');

// § 4.3.5. Consume a string token
module.exports = function consumeStringToken(str, ecp /* ending code point */, start = 0, end = str.length - 1) {
    // Repeatedly consume the next input code point from the stream:
    let i = start;
    let type = TYPE.String;
    for (; i <= end; i++) {
        let c = str[i];
        if (ecp === c) {
            return { id: TYPE.String, start, end: i - 1 };
        }
        if (i === end) {
            // This is a parse error. Reconsume the current input code point,
            return { id: TYPE.String, start, end: i }; // this is a parse error but just return string token, maybe emit a warning somehow
        }
        if (c === '\u000a') {
            return { id: TYPE.BadString, start, end: i - 1 };
        }
        if (c === '\u005C') {
            // If the next input code point is EOF, do nothing.
            if (isValidEscape(c, str[i + 1])) {
                i = consumeEscaped(str, i, end);
                continue
            }
        }
        // consume code point
    }
}