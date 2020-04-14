'use strict';

const escape = require('./escape');
const { isValidEscape, isName } = require('../definitions');

// §4.3.11. Consume a name
// Note: This algorithm does not do the verification of the first few code points that are necessary
// to ensure the returned code points would constitute an <ident-token>. If that is the intended use,
// ensure that the stream starts with an identifier before calling this algorithm.
module.exports = function consumeName(src, start = 0, end = src.length - 1) {
  // Let result initially be an empty string.
  // Repeatedly consume the next input code point from the stream:
  let i = start;
  do {
    if (isName(src[i])) {
      i++;
      continue;
    }
    // the stream starts with a valid escape
    if (isValidEscape(src[i], src[i + 1])) {
      // Consume an escaped code point. Append the returned code point to result.
      i = escape(src, i, end) + 1;
      continue;
    }
    // anything else
    // Reconsume the current input code point. Return result.
    i--;
    break;
  } while (i <= end)
  if (i < start) {
    i = start;
  }
  return i;

}
