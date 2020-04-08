const { charCodeCategory, isValidEscape } = require('../definitions');
const { TYPE } = require('../const');
const consumeEscaped = require('./escape');

// § 4.3.5. Consume a string token
module.exports = function consumeStringToken(src = '', start = 0, end = src.length - 1, endingCodePoint = '"') {
    // Repeatedly consume the next input code point from the stream:
    let i = start;
    let type = TYPE.String;
    outer:
    for (; i <= end; i++) {
        var c = src[i];
        switch (true) {
            // ending code point
            case c === endingCodePoint:
                // Return the <string-token>.
                break outer;
            case charCodeCategory(c) === charCodeCategory.WhiteSpace:
                if (c === '\u000A') {
                    // This is a parse error. Reconsume the current input code point,
                    // create a <bad-string-token>, and return it.
                    i++
                    type = TYPE.BadString;
                    break outer;
                }
                break;
            // U+005C REVERSE SOLIDUS (\)
            case c === '\u005C':
                // If the next input code point is EOF, do nothing.
                if (i === end) {
                    break;
                }
                if (src[i + 1] === '\u000A') {
                    i++;
                } else if (isValidEscape(c, str[i + 1])) {
                    // Otherwise, (the stream starts with a valid escape) consume
                    // an escaped code point and append the returned code point to
                    // the <string-token>’s value.
                    i = consumeEscaped(src, i);
                }
                break;

            // anything else
            // Append the current input code point to the <string-token>’s value.
        }
    }
    return { id: type, start, end: i }
}