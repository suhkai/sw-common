'use strict';
const constants = require('./const');
const TYPE = constants.TYPE;

const consumeStringToken = require('../tokenizer/consumers/string');
const consumeName = require('../tokenizer/consumers/name');
const consumeNumber = require('../tokenizer/consumers/number');
const consumeIdentLikeToken = require('../tokenizer/consumers/ident');

const { isName, isEscapeStart, isNumberStart, isIdStart, isBOM, isNL, isCRLF, isWS } = require('./checks-and-definitions');
const { findWhiteSpaceEnd } = require('./utils');
const tk = require('./tokens')

module.exports = function* tokenize(src = '') {
    let col = 1
    let row = 1
    let i = 0;

    let end = src.length -1;

    function createRange() {
        const s = { col, row };
        return function () {
            return {
                s,
                e: { col, row }
            }
        }
    }

    function advance(str, start) {
        if (isCRLF(str[start], str[start + 1])) {
            row += 1;
            col = 1;
            return start +2;
        }
        if (isNL(str[start])) {
            row += 1
            col = 1;
            return start + 1;
        }
        col++;
        return start+1;
    }

    function consumeWhileTrue(func, start = 0, ) {
        const range = createRange()
        while (start <= end) {
            if (func(src[start]) === false) break;
            if (start === end) {
              return [range(), start+1]  
            }
            const s2 = advance(src, start)
            start = s2;
        }
        return [range(), start]
    }

    function searchUntil(search, start = 0, range, length = search.length ) {
        while (src.startsWith(search, start) === false && start <= end) {
            let start2 = advance(src, start);
            start = start2;
        }
        if (src.startsWith(search, start)) {
            col += length -1;
            const loc = range();
            col++;
            return [loc, start + length];
        }
        return [range(), end +1];
    }

    if (isBOM(src[0])) {
        yield {
            id: tk.BOM,
            loc: {
                s: { col, row },
                e: { col, row }
            }
        }
        i = advance(src, 0)
    }
    while (i <= end) {
        const _1 = src[i];
        const _2 = src[i + 1];
        const _3 = src[i + 2];
        // https://drafts.csswg.org/css-syntax-3/#consume-token
        // § 4.3.1. Consume a token
        // 1.consume comments
        if (_1 === '\u002f' && _2 == '\u002a') {
            // find next "*/"
            const range = createRange()
            col += 2;
            let [loc, next] = searchUntil('*/', i + 2, range);
            yield { id: tk.COMMENT, loc };
            i=next;
            
        }
  
        if (isWS(_1)) {
            const [loc, next] = consumeWhileTrue(isWS, i)
            yield { id: tk.WS, loc };
            i = next;
        }

        /*let code = src[i];
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
            // correct for ("")
            tok.start--;
            tok.end++;
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
            // correct for ("")
            tok.start--;
            tok.end++;
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
            if (tok) {
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

        yield { id: TYPE.Delim, start: i, end: i };*/
       
    }
}

