'use strict';
// code points
// code points
// code points
// https://drafts.csswg.org/css-syntax-3/
// § 4.2. Definitions

const isDigit = code => code >= '\u0030' && code <= '\u0039';

const isHexDigit = code => isDigit(code) ||
  (code >= '\u0041' && code <= '\u0046') || // A .. F
  (code >= '\u0061' && code <= '\u0066');    // a .. f

const isUpper = code => code >= '\u0041' && code <= '\u005A';

const isLower = code => code >= '\u0061' && code <= '\u007A';

const isLetter = code => isUpper(code) || isLower(code);

const isNonAscii = code => code >= '\u0080';

// the "name-start code point" and "identifier-start" code point are used interchangibly
// infact!! the intra-page links for all links with above names point to 
// https://drafts.csswg.org/css-syntax-3/#identifier-start-code-point

// the "identifier code point" and "name code point" are used interchangibly
// infact!! the intra-page links for all links with above names point to 
// https://drafts.csswg.org/css-syntax-3/#identifier-code-point

const isIdcStart = code => isLetter(code) || isNonAscii(code) || (code === '\u005F'); // 0x5f = (_)
const isNameStart = isIdcStart;

//https://drafts.csswg.org/css-syntax-3/#identifier-code-point
const isIdcp = code => isIdcStart(code) || isDigit(code) || (code === '\u002d'); //0x2d == '-'
const isName = isIdcp;

const isNoPrint = code =>
  code <= '\u0008' || // terminal control characters
  code === '\u000B' || // vertical tab
  (code >= '\u000E' && code <= '\u001F') || // data control
  code === '\u007F'; // delete

// we dont do preprocessing as described https://drafts.csswg.org/css-syntax-3/#input-preprocessing
// so absorb form-feed and line-feed and cr
const isNL = code =>
  code === '\u000D' || //CR
  code === '\u000C' ||// form feed             
  code === '\u000a'; // linefeed

const isWS = code => isNL(code) || code === '\u0020' || code === '\u0009'
const macp = code => code <= '\u10FFFF'

// checks
// checks
// checks

// https://drafts.csswg.org/css-syntax-3/#starts-with-a-valid-escape
// § 4.3.8. Check if two code points are a valid escape
function isEscapeStart(first, second) {
  if (first.d !== '\u005C') { /* (\) token */
    return false;
  }
  // Otherwise, if the second code point is a newline or EOF, return false.
  // checking for crlf makes no sense because cr part already results to false
  if (second && isNL(second.d)) {
    return false;
  }
  // Otherwise, return true.
  return true;
}

// https://drafts.csswg.org/css-syntax-3/#would-start-an-identifier
// § 4.3.9. Check if three code points would start an identifier
const isIdStart = (first, second, third) => {
  if (first && first.d === '\u002D') { // U+002D HYPHEN-MINUS
    // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
    // or the second and third code points are a valid escape, return true. Otherwise, return false.
    return (
      (second && isNameStart(second.d)) ||
      (second && second.d === '\u002D') || // '-' // yes a vendor prefix can have "--" like --moz-xyz
      isEscapeStart(second, third)
    );
  }
  // name-start code point
  if (first && isNameStart(first.d)) {
    // Return true.
    return true;
  }
  // U+005C REVERSE SOLIDUS (\)
  if (first && first.d === '\u005C') {
    // If the first and second code points are a valid escape, return true. Otherwise, return false.
    return isEscapeStart(first, second)
  }
  // anything else
  // Return false.
  return false
}

//https://drafts.csswg.org/css-syntax-3/#starts-with-a-number
// § 4.3.10. Check if three code points would start a number
// 
const isNumberStart = (first, second, third) => {
  // Look at the first code point:
  // U+002B PLUS SIGN (+)
  // U+002D HYPHEN-MINUS (-)
  if (first.d === '\u002B' || first.d === '\u002D') {
    // If the second code point is a digit, return true.
    if (second) {
      if (isDigit(second.d)) {
        return true;
      }
      // Otherwise, if the second code point is a U+002E FULL STOP (.)
      // and the third code point is a digit, return true.
      // Otherwise, return false.
      if (second.d === '.') {
        if (third) {
          if (isDigit(third.d)) {
            return true;
          }
        }
      }
    }
  }
  // U+002E FULL STOP (.)
  if (first.d === '.') {
    // If the second code point is a digit, return true. Otherwise, return false.
    if (second) {
      if (isDigit(second.d)) {
        return true;
      }
    }
  }
  // digit
  if (isDigit(first.d)) {
    // Return true.
    return true;
  }
  return false;
}

//
// Misc
//

// detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
const isBOM = code => {
  // UTF-16BE
  if (code === '\uFEFF') {
    return true;
  }
  // UTF-16LE
  if (code === '\uFFFE') {
    return true;
  }
  return false;
}

const nonPrintable =

  module.exports = {
    isDigit,
    isHexDigit,
    isUpper,
    isLower,
    isLetter,
    isNonAscii,
    isIdcStart,
    isIdcp,
    isName,
    isNoPrint,
    isNL,
    isWS,
    macp,
    isEscapeStart,
    isIdStart,
    isNumberStart,
    isBOM
  };
