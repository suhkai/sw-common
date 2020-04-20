'use strict';
const constants = require('./const');
const TYPE = constants.TYPE;

const consumeStringToken = require('../tokenizer/consumers/string');
const consumeName = require('../tokenizer/consumers/name');
const consumeNumber = require('../tokenizer/consumers/number');
const consumeIdentLikeToken = require('../tokenizer/consumers/ident');
const indexOf = require('./indexOf');

const charCodeDefinitions = require('./definitions');
const isName = charCodeDefinitions.isName;
const isValidEscape = charCodeDefinitions.isValidEscape;
const isNumberStart = charCodeDefinitions.isNumberStart;
const isIdentifierStart = charCodeDefinitions.isIdentifierStart;
const charCodeCategory = charCodeDefinitions.charCodeCategory;
const isBOM = charCodeDefinitions.isBOM;

const { findWhiteSpaceEnd } = require('./utils');




module.exports = function* tokenize(src = '') {
    //start
    //ensure source is a string
    let end = src.length;
    let start = isBOM(src[0]) ? 1 : 0;
    let i = start;
    // https://drafts.csswg.org/css-syntax-3/#consume-token
    // § 4.3.1. Consume a token
    while (i <= end) {
        let code = src[i];
        let cat = charCodeCategory(code);
        if (cat === charCodeCategory.WhiteSpace) {
            // Consume as much whitespace as possible. Return a <whitespace-token>.
            const ti = findWhiteSpaceEnd(src, i, end)
            yield { id: TYPE.WhiteSpace, start: i, end: ti };
            i = ti + 1;
            continue;
        }

        // https://www.w3.org/TR/css-syntax-3/#consume-string-token
        // U+0022 QUOTATION MARK (")
        if (code === '\u0022') {
            const tok = consumeStringToken(src, code, i + 1, end);
            yield tok;
            i = tok.end + 1;
            continue;
        }

        // U+0023 NUMBER SIGN (#)
        if (code === '\u0023') {
            if (isValidEscape(src[i + 1], src[i + 2]) || isName(src[i + 1])) {
                const it = consumeName(src, i + 1, end);
                const tok = { id: TYPE.Hash, start: i, end: it };
                if (isIdentifierStart(src[i + 1], src[i + 2], src[i + 3])) {
                    tok.type = 'id';
                }
                yield tok;
                i = it + 1;
                continue;
            }
            else {
                yield {
                    id: TYPE.Delim,
                    start: i,
                    end: i
                }
                i++;
                continue;
            }
        }

        // https://www.w3.org/TR/css-syntax-3/#consume-string-token
        // U+0027 APOSTROPHE (')
        if (code === '\u0027') {
            const tok = consumeStringToken(src, code, i + 1, end);
            yield tok;
            i = tok.end + 1;
            continue;
        }
        // U+0028 LEFT PARENTHESIS  "("
        if (code === '\u0028') {
            const tok = { id: TYPE.LeftParenthesis, start: i, end: i };
            yield tok;
            i++;
            continue;
        }
        // U+0029 LEFT PARENTHESIS  ")"
        if (code === '\u0029') {
            const tok = { id: TYPE.RightParenthesis, start: i, end: i };
            yield tok;
            i++;
            continue;
        }
        // U+002B PLUS SIGN (+)
        if (code === '\u002B') {
            const tok = consumeNumber(src, i, end);
            if (tok) {
                yield tok;
                i = tok.end + 1;
                continue;
            }

            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;

        }
        // U+002C COMMA (,)
        if (code === '\u002C') {
            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;
        }
        // U+002D HYPHEN-MINUS (-)
        if (code === '\u002d') {
            const tok = consumeNumber(src, i, end);
            if (tok) {
                yield tok;
                i = tok.end + 1;
                continue;
            }
            else {
                if (src[i + 1] === '\u002d' && src[i + 2] === '\u003e') {
                    const tok = { id: TYPE.CDC, start: i, end: i + 2 };
                    i += 3;
                    continue;
                }
                if (isIdentifierStart(src[i + 1], src[i + 2], src[i + 3])) {
                    const tok = consumeIdentLikeToken(src, i, end);
                    yield tok;
                    i = tok.end + 1;
                    continue;
                }
                yield { id: TYPE.Delim, start: i, end: i };
                i++;
                continue;
            }
        }
        // U+002E FULL STOP (.)
        if (code === '\u002e') {
            if (isNumberStart(code, src[i + 1], src[i + 2])) {
                const tok = consumeNumber(src, i, end);
                if (tok) {
                    yield tok;
                    i = tok.end + 1;
                    continue;
                }
            }
            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;
        }
        // U+002F SOLIDUS (/)
        if (code === '\u002f') {
            // is '*'
            if (src[i + 1] === '\u002a') {
                // find next "*/"
                let endIdx = indexOf(src, '*/', i + 2);
                if (endIdx === -1) {
                    endIdx = end - 1; // aborb everything i guess
                }
                yield { id: TYPE.Comment, start: i, end: endIdx + 1 };
                i = endIdx + 2;
                continue;
            }
            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;
        }
        // U+003A COLON (:)
        if (code === '\u003a') {
            yield { id: TYPE.Colon, start: i, end: i };
            i++;
            continue;
        }
        // ';'
        if (code === '\u003B') {
            yield { id: TYPE.Semicolon, start: i, end: i };
            i++;
            continue;
        }
        //// U+003C LESS-THAN SIGN (<)
        if (code === '\u003c') {
            // <!-- ?  // this is from css 2.1
            if (src[i + 1] === '\u0021' && src[i + 2] === '\u002d' && src[i + 3] === '\u002d') {
                yield { id: TYPE.CDO, start: i, end: i + 3 };
                i += 4;
                continue;
            }
            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;
        }
        //// U+0040 COMMERCIAL AT (@)
        if (code === '\u0040') {
            if (isIdentifierStart(src[i + 1], src[i + 2], src[i + 3])) {
                const tok = consumeIdentLikeToken(src, i, end);
                tok.id = TYPE.AtKeyword;
                yield tok;
                i = tok.end + 1;
                continue;
            }
            // If the next 3 input code points would start an identifier, ...
            yield { id: TYPE.Delim, start: i, end: i };
            i++;
            continue;
        }
        // U+005B LEFT SQUARE BRACKET ([)
        if (code === '\u005B') {
            yield { id: TYPE.LeftSquareBracket, start: i, end: i };
            i++;
            continue;
        }

        // U+005C REVERSE SOLIDUS (\)
        if (code === '\u005C') {
            if (isValidEscape(code, src[i + 1])) {
                const tok = consumeIdentLikeToken(src, i, end);
                yield tok;
                i = tok.end + 1;
                continue;
            }
            yield { id: TYPE.LeftSquareBracket, start: i, end: i };
            i++;
            continue;
        }

        // U+005D RIGHT SQUARE BRACKET (])
        if (code === '\u005D') {
            yield { id: TYPE.RightSquareBracket, start: i, end: i };
            i++;
            continue;
        }

        // U+007B LEFT CURLY BRACKET ({)
        if (code === '\u007b') {
            yield { id: TYPE.LeftCurlyBracket, start: i, end: i };
            i++;
            continue;
        }

        // U+007B LEFT CURLY BRACKET (})
        if (code === '\u007d') {
            yield { id: TYPE.RightCurlyBracket, start: i, end: i };
            i++;
            continue;
        }

        if (cat === charCodeCategory.Digit) {
            // Reconsume the current input code point, consume a numeric token, and return it.
            const tok = consumeNumber(src, i, end);
            if (tok){
                yield tok;
                i = tok.end + 1;
                continue;
            }
            console.log('should not happen');
        }

        // name-start code point
        if (cat === charCodeCategory.NameStart) {
            const tok = consumeIdentLikeToken(src, i, end);
            yield tok;
            i = tok.end + 1;
            continue;
        }

        yield { id: TYPE.Delim, start: i, end: i };
        i++;
    }
}

