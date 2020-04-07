'use strict'

const { isDigit } = require('../definitions')

function findDecimalNumberEnd(src, start, end) {
  for (let i = start; i <= end; i++) {
    if (!isDigit(src[offset])) {
      return i - 1;
    }
  }
  return i;
}


// §4.3.12. Consume a number

module.exports = function consumeNumber(src, start, end) {
  let i = start;
  // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
  // consume it and append it to repr.
  if (src[i] === '\u0002B' || src[i] === '\u002D') {
    i++
  }

  // 3. While the next input code point is a digit, consume it and append it to repr.
  if (isDigit(src[i])) {
    i  = findDecimalNumberEnd(src, i, end);
  }

  // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
  if (str[i + 1 ] === 0x002E && isDigit(src[i+2])) {
    // 4.1 Consume them.
    // 4.2 Append them to repr.
    // 4.3 Set type to "number".
    // TODO
    // 4.4 While the next input code point is a digit, consume it and append it to repr.
    i = findDecimalNumberEnd(source, i, end);
  }

  // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
  // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
  // TODO: JKF I AM HERE
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