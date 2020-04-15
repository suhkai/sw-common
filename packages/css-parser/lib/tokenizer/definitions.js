'use strict';

var EOF = '\0'; // some mobile browsers (iphone) dont like "const"

// https://drafts.csswg.org/css-syntax-3/
// § 4.2. Definitions

// digit
// A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9).
function isDigit(code) {
  return code >= '\u0030' && code <= '\u0039';
}

// hex digit
// A digit, or a code point between U+0041 LATIN CAPITAL LETTER A (A) and U+0046 LATIN CAPITAL LETTER F (F),
// or a code point between U+0061 LATIN SMALL LETTER A (a) and U+0066 LATIN SMALL LETTER F (f).
function isHexDigit(code) {
  return (
    isDigit(code) || // 0 .. 9
    (code >= '\u0041' && code <= '\u0046') || // A .. F
    (code >= '\u0061' && code <= '\u0066')    // a .. f
  );
}

// uppercase letter
// A code point between U+0041 LATIN CAPITAL LETTER A (A) and U+005A LATIN CAPITAL LETTER Z (Z).
function isUppercaseLetter(code) {
  return code >= '\u0041' && code <= '\u005A';
}

// lowercase letter
// A code point between U+0061 LATIN SMALL LETTER A (a) and U+007A LATIN SMALL LETTER Z (z).
function isLowercaseLetter(code) {
  return code >= '\u0061' && code <= '\u007A';
}

// letter
// An uppercase letter or a lowercase letter.
function isLetter(code) {
  return isUppercaseLetter(code) || isLowercaseLetter(code);
}

// non-ASCII code point
// A code point with a value equal to or greater than U+0080 <control>.
function isNonAscii(code) {
  return code >= '\u0080';
}

// name-start code point
// A letter, a non-ASCII code point, or U+005F = LOW LINE (_).
function isNameStart(code) {
  return isLetter(code) || isNonAscii(code) || code === '\u005F';
}

// name code point
// A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).
function isName(code) {
  return isNameStart(code) || isDigit(code) || code === '\u002D';
}

// non-printable code point
// A code point between U+0000 NULL and U+0008 BACKSPACE, or U+000B LINE TABULATION,
// or a code point between U+000E SHIFT OUT and U+001F INFORMATION SEPARATOR ONE, or U+007F DELETE.
function isNonPrintable(code) {
  return (
    (code >= '\u0000' && code <= '\u0008') ||
    (code === '\u000B') ||
    (code >= '\u000E' && code <= '\u001F') ||
    (code === '\u007F')
  );
}

// newline
// U+000A LINE FEED. Note that U+000D CARRIAGE RETURN and U+000C FORM FEED are not included in this definition,
// as they are converted to U+000A LINE FEED during preprocessing.
function isNewline(code) {
  return code === '\u000A';
}

// whitespace
// A newline, U+0009 CHARACTER TABULATION, or U+0020 SPACE.
function isWhiteSpace(code) {
  return isNewline(code) || code === '\u0020' || code === '\u0009';
}



// § 4.3.8. Check if two code points are a valid escape
function isValidEscape(first, second) {
  // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
  if (first !== '\u005C') {
    return false;
  }

  // Otherwise, if the second code point is a newline or EOF, return false.
  if (!second || isNewline(second) || second === EOF) {
    return false;
  }

  // Otherwise, return true.
  return true;
}

// § 4.3.9. Check if three code points would start an identifier
function isIdentifierStart(first, second, third) {
  // Look at the first code point:

  // U+002D HYPHEN-MINUS
  if (first === '\u002D') {
    // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
    // or the second and third code points are a valid escape, return true. Otherwise, return false.
    return (
      isNameStart(second) ||
      second === '\u002D' ||
      isValidEscape(second, third)
    );
  }

  // name-start code point
  if (isNameStart(first)) {
    // Return true.
    return true;
  }

  // U+005C REVERSE SOLIDUS (\)
  if (first === '\u005C') {
    // If the first and second code points are a valid escape, return true. Otherwise, return false.
    return isValidEscape(first, second);
  }

  // anything else
  // Return false.
  return false;
}

// § 4.3.10. Check if three code points would start a number
function isNumberStart(first, second, third) {
  // Look at the first code point:

  // U+002B PLUS SIGN (+)
  // U+002D HYPHEN-MINUS (-)
  if (first === '\u002B' || first === '\u002D') {
    // If the second code point is a digit, return true.
    if (isDigit(second)) {
      return 2;
    }

    // Otherwise, if the second code point is a U+002E FULL STOP (.)
    // and the third code point is a digit, return true.
    // Otherwise, return false.
    return second === '\u002E' && isDigit(third) ? 3 : 0;
  }

  // U+002E FULL STOP (.)
  if (first === '\u002E') {
    // If the second code point is a digit, return true. Otherwise, return false.
    return isDigit(second) ? 2 : 0;
  }

  // digit
  if (isDigit(first)) {
    // Return true.
    return 1;
  }

  // anything else
  // Return false.
  return 0;
}

//
// Misc
//

// detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
function isBOM(code) {
  // UTF-16BE
  if (code === '\uFEFF') {
    return 1;
  }

  // UTF-16LE
  if (code === '\uFFFE') {
    return 1;
  }

  return 0;
}

// Fast code category
//
// https://drafts.csswg.org/css-syntax/#tokenizer-definitions
// > non-ASCII code point
// >   A code point with a value equal to or greater than U+0080 <control>
// > name-start code point
// >   A letter, a non-ASCII code point, or U+005F LOW LINE (_).
// > name code point
// >   A name-start code point, a digit, or U+002D HYPHEN-MINUS (-)
// That means only ASCII code points has a special meaning and we define a maps for 0..127 codes only
var CATEGORY = new Array(128);

function charCodeCategory(code) {
  return code < '\u0080' ? CATEGORY[code] : charCodeCategory.NameStart;
};

charCodeCategory.Eof = '\u0080';
charCodeCategory.WhiteSpace = '\u0082';
charCodeCategory.Digit = '\u0083';
charCodeCategory.NameStart = '\u0084';
charCodeCategory.NonPrintable = '\u0085';

for (var i = 0; i < CATEGORY.length; i++) {
  switch (true) {
    case isWhiteSpace(i):
      CATEGORY[i] = charCodeCategory.WhiteSpace;
      break;

    case isDigit(i):
      CATEGORY[i] = charCodeCategory.Digit;
      break;

    case isNameStart(i):
      CATEGORY[i] = charCodeCategory.NameStart;
      break;

    case isNonPrintable(i):
      CATEGORY[i] = charCodeCategory.NonPrintable;
      break;

    default:
      CATEGORY[i] = i || charCodeCategory.Eof;
  }
}

module.exports = {
  isDigit, //
  isHexDigit, //
  isUppercaseLetter, //
  isLowercaseLetter, //
  isLetter, //
  isNonAscii, //
  isNameStart, //
  isName, //
  isNonPrintable, //
  isNewline,
  isWhiteSpace,
  isValidEscape,
  isIdentifierStart: isIdentifierStart,
  isNumberStart: isNumberStart,
  //
  isBOM: isBOM,
  charCodeCategory
};
