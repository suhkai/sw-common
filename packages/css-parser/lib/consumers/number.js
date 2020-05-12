'use strict'

const { isDigit } = require('../checks-and-definitions')
const { TYPE } = require('../const');

function findDecimalNumberEnd(src, start, end) {
  let i;
  for (i = start; i <= end; i++) {
    if (isDigit(src[i])) {
      continue;
    }
    break;
  }
  if (i > end) {
    i = end;
  } else {
    i--;
  }
  return i;
}

function consumeSignFixedFloat(src, start, end) {
  let i = start;
  // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
  // consume it and append it to repr.
  if (src[i] === '\u002b' || src[i] === '\u002d') {
    i++
  }
  if (!isDigit(src[i])) {
    return -1;
  }
  i = findDecimalNumberEnd(src, i, end);
  if (src[i + 1] === '\u002E' && isDigit(src[i + 2])) {
    // 4.1 Consume them.
    // 4.2 Append them to repr.
    // 4.3 Set type to "number".
    i = findDecimalNumberEnd(src, i + 2, end);
  }
  return i;
}


// §4.3.12. Consume a number
module.exports = function consumeNumber(src = '', start = 0, end = src.length - 1) {
  let i = consumeSignFixedFloat(src, start, end);
  if (i === -1) return undefined;
  if (i === end) return { id: TYPE.Number, start: start, end: i };

  // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
  // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
  if (src[i + 1] === '\u0045' /*e*/ || src[i + 1] === '\u0065') {
    const i2 = consumeSignFixedFloat(src, i + 2, end);
    if (i2 >= 0) {
      i = i2;
    }
  }
  return { id: TYPE.Number, start: start, end: i };
}