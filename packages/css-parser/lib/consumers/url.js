'use strict';
const { TYPE } = require('../const');
const { isWS, isEscapeStart, isNoPrint } = require('../checks-and-definitions');
const consumeEscaped = require('./escape');
const { findWhiteSpaceEnd } = require('../utils');

const badurl = {
    '\u0022': 1,  // "
    '\u0027': 2,  // '
    '\u0028': 3   // (
};

// § 4.3.14. Consume the remnants of a bad url
// ... its sole use is to consume enough of the input stream to reach a recovery point
// where normal tokenizing can resume.
function consumeBadUrlRemnants(src, start, end) {
    // Repeatedly consume the next input code point from the stream:
    let i = start; // start from error point
    for (; i <= end; i++) {
        const code = src[i];
        // U+0029 RIGHT PARENTHESIS ())
        // EOF
        if (code === '\u0029' || i === end) {
            // Return.
            return i;
        }
        // Consume an escaped code point.
        // Note: This allows an escaped right parenthesis ("\)") to be encountered
        // without ending the <bad-url-token>. This is otherwise identical to
        // the "anything else" clause.
        if (isEscapeStart(src[i], src[i + 1])) {
            i = consumeEscaped(src, i, end);
            continue;
        }
        // add char to bad url token
    }
}

// § 4.3.6. Consume a url token
// Note: This algorithm will start after "url(" from str
// This algorithm also assumes that it’s being called to consume an "unquoted" value, like url(foo).
// if the url string is quoted it will correct and return the value between (") or (') tokens
module.exports = function consumeUrlToken(src, start = 0, end = src.length - 1) {
    // Initially create a <url-token> with its value set to the empty string.
    // Consume as much whitespace as possible.
    let i = start + 4;// skip "url("

    for (; i <= end;) {
        if (isWS(src[i])) {
            i = findWhiteSpaceEnd(src, i) + 1;
            continue;
        }
        // next codepoint must NOT be an (") or (') token
        if (src[i] in badurl || isNoPrint(src[i])) {
            i = consumeBadUrlRemnants(src, i + 1, end);
            return { id: TYPE.BadUrl, start, end: i };
        }
        // U+0029 RIGHT PARENTHESIS ())
        if (src[i] === '\u0029' || i === end) {
            return { id: TYPE.Url, start, end: i };
        }
        // U+005C REVERSE SOLIDUS (\)
        if (src[i] === '\u005c') {
            if (isEscapeStart(src[i], src[i + 1])) {
                i = consumeEscaped(src, i, end) + 1;
                continue;
            }
            // not a valid escape, its a bad url
            i = consumeBadUrlRemnants(src, i + 1, end);
            return { id: TYPE.BadUrl, start, end: i };
        }
        // anything else
        // Append the current input code point to the <url-token>’s value.
        i++;
    }
}