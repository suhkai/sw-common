
'use strict';
const { isDigit, //
    isUppercaseLetter, //
    isWhiteSpace
 } = require('./definitions');

function getCharCode(source, offset) {
    return offset < source.length ? source.charCodeAt(offset) : 0;
}

function getNewlineLength(source, offset, code) {
    if (code === 13 /* \r */ && getCharCode(source, offset + 1) === 10 /* \n */) {
        return 2;
    }

    return 1;
}

function cmpChar(testStr, offset, referenceCode) {
    var code = testStr.charCodeAt(offset);

    // code.toLowerCase() for A..Z
    if (isUppercaseLetter(code)) {
        code = code | 32;
    }

    return code === referenceCode;
}

function cmpStr(testStr, start, end, referenceStr) {
    if (end - start !== referenceStr.length) {
        return false;
    }

    if (start < 0 || end > testStr.length) {
        return false;
    }

    for (var i = start; i < end; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i - start);

        // testCode.toLowerCase() for A..Z
        if (isUppercaseLetter(testCode)) {
            testCode = testCode | 32;
        }

        if (testCode !== referenceCode) {
            return false;
        }
    }

    return true;
}

function findWhiteSpaceStart(source, offset) {
    for (; offset >= 0; offset--) {
        if (!isWhiteSpace(source.charCodeAt(offset))) {
            break;
        }
    }

    return offset + 1;
}

// skip over white space
function findWhiteSpaceEnd(src, start = 0, end = src.length - 1) {
    let i = start;
    do {
        if (!isWhiteSpace(src[i])) {
            i--;
            break;
        };
        i++;
    } while (i <= end)
    if (i < start) {
        return start;
    }
    if (i > end) {
        return end;
    }
    return i;
}

function findDecimalNumberEnd(source, offset) {
    for (; offset < source.length; offset++) {
        if (!isDigit(source.charCodeAt(offset))) {
            break;
        }
    }
    return offset;
}

// §4.3.12. Consume a number
function consumeNumber(source, offset) {
    var code = source.charCodeAt(offset);

    // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
    // consume it and append it to repr.
    if (code === 0x002B || code === 0x002D) {
        code = source.charCodeAt(offset += 1);
    }

    // 3. While the next input code point is a digit, consume it and append it to repr.
    if (isDigit(code)) {
        offset = findDecimalNumberEnd(source, offset + 1);
        code = source.charCodeAt(offset);
    }

    // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
    if (code === 0x002E && isDigit(source.charCodeAt(offset + 1))) {
        // 4.1 Consume them.
        // 4.2 Append them to repr.
        code = source.charCodeAt(offset += 2);

        // 4.3 Set type to "number".
        // TODO

        // 4.4 While the next input code point is a digit, consume it and append it to repr.

        offset = findDecimalNumberEnd(source, offset);
    }

    // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
    // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
    if (cmpChar(source, offset, 101 /* e */)) {
        var sign = 0;
        code = source.charCodeAt(offset + 1);

        // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
        if (code === 0x002D || code === 0x002B) {
            sign = 1;
            code = source.charCodeAt(offset + 2);
        }

        // ... followed by a digit
        if (isDigit(code)) {
            // 5.1 Consume them.
            // 5.2 Append them to repr.

            // 5.3 Set type to "number".
            // TODO

            // 5.4 While the next input code point is a digit, consume it and append it to repr.
            offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
        }
    }

    return offset;
}



module.exports = {
    consumeNumber: consumeNumber,

    cmpChar: cmpChar,
    cmpStr: cmpStr,

    getNewlineLength: getNewlineLength,
    findWhiteSpaceStart: findWhiteSpaceStart,
    findWhiteSpaceEnd
};
