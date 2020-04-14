'use strict';

const { isHexDigit, isWhiteSpace } = require('../definitions');
// § 4.3.7. Consume an escaped code point
module.exports = function consumeEscaped(src, start = 0, end = src.length-1) {
  // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
  // that the next input code point has already been verified to be part of a valid escape.
  // checked first with "isValidEscape"
  let i = start + 1;
  // hex digit
  if (isHexDigit(src[i])) {
      // Consume as many hex digits as possible, but no more than 6.
      for (var maxOffset = Math.min(end, i + 5); i <= maxOffset; i++) {
          if (!isHexDigit(src[i])) {
             break;
          }
      }
      if (i!==maxOffset){
        i--;
      }
      // If the next input code point is whitespace, consume it as well.
      if (isWhiteSpace(src[i+1])) {
          i++;
      }
  }
  return i;
};
