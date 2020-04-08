'use strict';
// § 4.3.7. Consume an escaped code point
module.exports = function consumeEscaped(src, start, end) {
  // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
  // that the next input code point has already been verified to be part of a valid escape.
  let i = start + 2;

  // hex digit
  if (isHexDigit(src[i-1])) {
      // Consume as many hex digits as possible, but no more than 6.
      for (var maxOffset = Math.min(end, i + 5); i < maxOffset; i++) {
          if (!isHexDigit(src[i])) {
              break;
          }
      }
      // If the next input code point is whitespace, consume it as well.
      if (isWhiteSpace(src[i+1])) {
          i++;
      }
  }
  return i;
};
