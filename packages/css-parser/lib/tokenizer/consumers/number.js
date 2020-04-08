'use strict'

var { isDigit } = require('../definitions')

function findDecimalNumberEnd(src, start, end) {
  let i;
  for (i = start; i <= end; i++) {
    if (!isDigit(src[i])) {
      return i - 1;
    }
  }
  return i;
}


// §4.3.12. Consume a number
module.exports = function consumeNumber(src = '', start = 0, end = src.length - 1) {
  let i = start;
  // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
  // consume it and append it to repr.
  if (src[i] === '\u002B' || src[i] === '\u002D') {
    i++
  }

  // 3. While the next input code point is a digit, consume it and append it to repr.
  if (isDigit(src[i])) {
    i = findDecimalNumberEnd(src, i, end);
  }
  else {
    return -1
  }

  // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
  if (src[i + 1] === '\u002E' && isDigit(src[i + 2])) {
    // 4.1 Consume them.
    // 4.2 Append them to repr.
    // 4.3 Set type to "number".
    // TODO
    i = findDecimalNumberEnd(src, i, end);
  }

  if (i === end) return i;

  // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
  // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
  if (src[i + 1] === '\u0045' /*e*/ || src[i + 1] === '\u0065') {
    var sign = 0;
    i++; // advance
    // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
    if (src[i + 1] === '\u002d' || src[i + 1] === '\u002b') {
      sign = 1;
      i++;
    }
    // ... followed by a digit
    if (isDigit(src[i + 1])) {
      // 5.1 Consume them.
      // 5.2 Append them to repr.

      // 5.3 Set type to "number".
      // TODO

      // 5.4 While the next input code point is a digit, consume it and append it to repr.
      i = findDecimalNumberEnd(src, i + 1, end);
    }
  }
  return i;
}