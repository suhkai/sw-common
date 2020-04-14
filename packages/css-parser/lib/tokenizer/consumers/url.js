 
    // § 4.3.6. Consume a url token
    // Note: This algorithm will start after "url(" from str
    // This algorithm also assumes that it’s being called to consume an "unquoted" value, like url(foo).
    // if the url string is quoted it will correct and return the value between (") or (') tokens
    module.exports = function consumeUrlToken(src, start, end) {
      // Initially create a <url-token> with its value set to the empty string.
      type = TYPE.Url;

      // Consume as much whitespace as possible.
      offset = findWhiteSpaceEnd(source, offset);

      // Repeatedly consume the next input code point from the stream:
      for (; offset < source.length; offset++) {
          var code = source.charCodeAt(offset);

          switch (charCodeCategory(code)) {
              // U+0029 RIGHT PARENTHESIS ())
              case 0x0029:
                  // Return the <url-token>.
                  offset++;
                  return;

              // EOF
              case charCodeCategory.Eof:
                  // This is a parse error. Return the <url-token>.
                  return;

              // whitespace
              case charCodeCategory.WhiteSpace:
                  // Consume as much whitespace as possible.
                  offset = findWhiteSpaceEnd(source, offset);

                  // If the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
                  // consume it and return the <url-token>
                  // (if EOF was encountered, this is a parse error);
                  if (getCharCode(offset) === 0x0029 || offset >= source.length) {
                      if (offset < source.length) {
                          offset++;
                      }
                      return;
                  }

                  // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
                  // and return it.
                  offset = consumeBadUrlRemnants(source, offset);
                  type = TYPE.BadUrl;
                  return;

              // U+0022 QUOTATION MARK (")
              // U+0027 APOSTROPHE (')
              // U+0028 LEFT PARENTHESIS (()
              // non-printable code point
              case 0x0022:
              case 0x0027:
              case 0x0028:
              case charCodeCategory.NonPrintable:
                  // This is a parse error. Consume the remnants of a bad url,
                  // create a <bad-url-token>, and return it.
                  offset = consumeBadUrlRemnants(source, offset);
                  type = TYPE.BadUrl;
                  return;

              // U+005C REVERSE SOLIDUS (\)
              case 0x005C:
                  // If the stream starts with a valid escape, consume an escaped code point and
                  // append the returned code point to the <url-token>’s value.
                  if (isValidEscape(code, getCharCode(offset + 1))) {
                      offset = consumeEscaped(source, offset) - 1;
                      break;
                  }

                  // Otherwise, this is a parse error. Consume the remnants of a bad url,
                  // create a <bad-url-token>, and return it.
                  offset = consumeBadUrlRemnants(source, offset);
                  type = TYPE.BadUrl;
                  return;

              // anything else
              // Append the current input code point to the <url-token>’s value.
          }
      }
  }