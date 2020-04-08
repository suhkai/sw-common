// § 4.3.5. Consume a string token
module.exports = function consumeStringToken(endingCodePoint) {
  // This algorithm may be called with an ending code point, which denotes the code point
  // that ends the string. If an ending code point is not specified,
  // the current input code point is used.
  if (!endingCodePoint) {
      endingCodePoint = getCharCode(offset++);
  }

  // Initially create a <string-token> with its value set to the empty string.
  type = TYPE.String;

  // Repeatedly consume the next input code point from the stream:
  for (; offset < source.length; offset++) {
      var code = source.charCodeAt(offset);

      switch (charCodeCategory(code)) {
          // ending code point
          case endingCodePoint:
              // Return the <string-token>.
              offset++;
              return;

          // EOF
          case charCodeCategory.Eof:
              // This is a parse error. Return the <string-token>.
              return;

          // newline
          case charCodeCategory.WhiteSpace:
              if (isNewline(code)) {
                  // This is a parse error. Reconsume the current input code point,
                  // create a <bad-string-token>, and return it.
                  offset += getNewlineLength(source, offset, code);
                  type = TYPE.BadString;
                  return;
              }
              break;

          // U+005C REVERSE SOLIDUS (\)
          case 0x005C:
              // If the next input code point is EOF, do nothing.
              if (offset === source.length - 1) {
                  break;
              }

              var nextCode = getCharCode(offset + 1);

              // Otherwise, if the next input code point is a newline, consume it.
              if (isNewline(nextCode)) {
                  offset += getNewlineLength(source, offset + 1, nextCode);
              } else if (isValidEscape(code, nextCode)) {
                  // Otherwise, (the stream starts with a valid escape) consume
                  // an escaped code point and append the returned code point to
                  // the <string-token>’s value.
                  offset = consumeEscaped(source, offset) - 1;
              }
              break;

          // anything else
          // Append the current input code point to the <string-token>’s value.
      }
  }
}