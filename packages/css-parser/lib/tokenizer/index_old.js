var TokenStream = require('../common/TokenStream');
var adoptBuffer = require('../common/adopt-buffer');

var constants = require('./const');
var TYPE = constants.TYPE;

var charCodeDefinitions = require('./definitions');
var isNewline = charCodeDefinitions.isNewline;
var isName = charCodeDefinitions.isName;
var isValidEscape = charCodeDefinitions.isValidEscape;
var isNumberStart = charCodeDefinitions.isNumberStart;
var isIdentifierStart = charCodeDefinitions.isIdentifierStart;
var charCodeCategory = charCodeDefinitions.charCodeCategory;
var isBOM = charCodeDefinitions.isBOM;

var utils = require('./utils');
var cmpStr = utils.cmpStr;
var getNewlineLength = utils.getNewlineLength;
var findWhiteSpaceEnd = utils.findWhiteSpaceEnd;
var consumeEscaped = utils.consumeEscaped;
var consumeName = utils.consumeName;
var consumeNumber = utils.consumeNumber;
var consumeBadUrlRemnants = utils.consumeBadUrlRemnants;

var OFFSET_MASK = 0x00FFFFFF;
var TYPE_SHIFT = 24;

function* tokenize(src) {
    //start
    //start
    //start
    //start

    if (!stream) {
        stream = new TokenStream();
    }

    // ensure source is a string
    source = String(source || '');

    var sourceLength = source.length;
    var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1); // +1 because of eof-token
    var balance = adoptBuffer(stream.balance, sourceLength + 1);
    var tokenCount = 0;
    var start = isBOM(getCharCode(0));
    var offset = start;
    var balanceCloseType = 0;
    var balanceStart = 0;
    var balancePrev = 0;

    // https://drafts.csswg.org/css-syntax-3/#consume-token
    // § 4.3.1. Consume a token
    while (offset < sourceLength) {
        var code = source.charCodeAt(offset);
        var type = 0;

        balance[tokenCount] = sourceLength;
        // top level
        switch (charCodeCategory(code)) {
            // whitespace
            case charCodeCategory.WhiteSpace:
                // Consume as much whitespace as possible. Return a <whitespace-token>.
                type = TYPE.WhiteSpace;
                offset = findWhiteSpaceEnd(source, offset + 1);
                break;

            // U+0022 QUOTATION MARK (")
            case 0x0022:
                // Consume a string token and return it.
                consumeStringToken();
                break;

            // U+0023 NUMBER SIGN (#)
            case 0x0023:
                // If the next input code point is a name code point or the next two input code points are a valid escape, then:
                if (isName(getCharCode(offset + 1)) || isValidEscape(getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // Create a <hash-token>.
                    type = TYPE.Hash;

                    // If the next 3 input code points would start an identifier, set the <hash-token>’s type flag to "id".
                    // if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                    //     // TODO: set id flag
                    // }

                    // Consume a name, and set the <hash-token>’s value to the returned string.
                    offset = consumeName(source, offset + 1);

                    // Return the <hash-token>.
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+0027 APOSTROPHE (')
            case 0x0027:
                // Consume a string token and return it.
                consumeStringToken();
                break;

            // U+0028 LEFT PARENTHESIS (()
            case 0x0028:
                // Return a <(-token>.
                type = TYPE.LeftParenthesis;
                offset++;
                break;

            // U+0029 RIGHT PARENTHESIS ())
            case 0x0029:
                // Return a <)-token>.
                type = TYPE.RightParenthesis;
                offset++;
                break;

            // U+002B PLUS SIGN (+)
            case 0x002B:
                // If the input stream starts with a number, ...
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // ... reconsume the current input code point, consume a numeric token, and return it.
                    consumeNumericToken();
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+002C COMMA (,)
            case 0x002C:
                // Return a <comma-token>.
                type = TYPE.Comma;
                offset++;
                break;

            // U+002D HYPHEN-MINUS (-)
            case 0x002D:
                // If the input stream starts with a number, reconsume the current input code point, consume a numeric token, and return it.
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    consumeNumericToken();
                } else {
                    // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
                    if (getCharCode(offset + 1) === 0x002D &&
                        getCharCode(offset + 2) === 0x003E) {
                        type = TYPE.CDC;
                        offset = offset + 3;
                    } else {
                        // Otherwise, if the input stream starts with an identifier, ...
                        if (isIdentifierStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                            // ... reconsume the current input code point, consume an ident-like token, and return it.
                            consumeIdentLikeToken();
                        } else {
                            // Otherwise, return a <delim-token> with its value set to the current input code point.
                            type = TYPE.Delim;
                            offset++;
                        }
                    }
                }
                break;

            // U+002E FULL STOP (.)
            case 0x002E:
                // If the input stream starts with a number, ...
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // ... reconsume the current input code point, consume a numeric token, and return it.
                    consumeNumericToken();
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+002F SOLIDUS (/)
            case 0x002F:
                // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A ASTERISK (*),
                if (getCharCode(offset + 1) === 0x002A) {
                    // ... consume them and all following code points up to and including the first U+002A ASTERISK (*)
                    // followed by a U+002F SOLIDUS (/), or up to an EOF code point.
                    type = TYPE.Comment;
                    offset = source.indexOf('*/', offset + 2) + 2;
                    if (offset === 1) {
                        offset = source.length;
                    }
                } else {
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+003A COLON (:)
            case 0x003A:
                // Return a <colon-token>.
                type = TYPE.Colon;
                offset++;
                break;

            // U+003B SEMICOLON (;)
            case 0x003B:
                // Return a <semicolon-token>.
                type = TYPE.Semicolon;
                offset++;
                break;

            // U+003C LESS-THAN SIGN (<)
            case 0x003C:
                // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), ...
                if (getCharCode(offset + 1) === 0x0021 &&
                    getCharCode(offset + 2) === 0x002D &&
                    getCharCode(offset + 3) === 0x002D) {
                    // ... consume them and return a <CDO-token>.
                    type = TYPE.CDO;
                    offset = offset + 4;
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+0040 COMMERCIAL AT (@)
            case 0x0040:
                // If the next 3 input code points would start an identifier, ...
                if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                    // ... consume a name, create an <at-keyword-token> with its value set to the returned value, and return it.
                    type = TYPE.AtKeyword;
                    offset = consumeName(source, offset + 1);
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+005B LEFT SQUARE BRACKET ([)
            case 0x005B:
                // Return a <[-token>.
                type = TYPE.LeftSquareBracket;
                offset++;
                break;

            // U+005C REVERSE SOLIDUS (\)
            case 0x005C:
                // If the input stream starts with a valid escape, ...
                if (isValidEscape(code, getCharCode(offset + 1))) {
                    // ... reconsume the current input code point, consume an ident-like token, and return it.
                    consumeIdentLikeToken();
                } else {
                    // Otherwise, this is a parse error. Return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+005D RIGHT SQUARE BRACKET (])
            case 0x005D:
                // Return a <]-token>.
                type = TYPE.RightSquareBracket;
                offset++;
                break;

            // U+007B LEFT CURLY BRACKET ({)
            case 0x007B:
                // Return a <{-token>.
                type = TYPE.LeftCurlyBracket;
                offset++;
                break;

            // U+007D RIGHT CURLY BRACKET (})
            case 0x007D:
                // Return a <}-token>.
                type = TYPE.RightCurlyBracket;
                offset++;
                break;

            // digit
            case charCodeCategory.Digit:
                // Reconsume the current input code point, consume a numeric token, and return it.
                consumeNumericToken();
                break;

            // name-start code point
            case charCodeCategory.NameStart:
                // Reconsume the current input code point, consume an ident-like token, and return it.
                consumeIdentLikeToken();
                break;

            // EOF
            case charCodeCategory.Eof:
                // Return an <EOF-token>.
                break;

            // anything else
            default:
                // Return a <delim-token> with its value set to the current input code point.
                type = TYPE.Delim;
                offset++;
        }

        switch (type) {
            case balanceCloseType:
                balancePrev = balanceStart & OFFSET_MASK;
                balanceStart = balance[balancePrev];
                balanceCloseType = balanceStart >> TYPE_SHIFT;
                balance[tokenCount] = balancePrev;
                balance[balancePrev++] = tokenCount;
                for (; balancePrev < tokenCount; balancePrev++) {
                    if (balance[balancePrev] === sourceLength) {
                        balance[balancePrev] = tokenCount;
                    }
                }
                break;

            case TYPE.LeftParenthesis:
            case TYPE.Function:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightParenthesis;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;

            case TYPE.LeftSquareBracket:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightSquareBracket;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;

            case TYPE.LeftCurlyBracket:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightCurlyBracket;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;
        }

        offsetAndType[tokenCount++] = (type << TYPE_SHIFT) | offset;
    }

    // done
    // done
    // done
    // done


    // finalize buffers
    offsetAndType[tokenCount] = (TYPE.EOF << TYPE_SHIFT) | offset; // <EOF-token>
    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength; // prevents false positive balance match with any token
    while (balanceStart !== 0) {
        balancePrev = balanceStart & OFFSET_MASK;
        balanceStart = balance[balancePrev];
        balance[balancePrev] = sourceLength;
    }

    // update stream
    stream.source = source;
    stream.firstCharOffset = start;
    stream.offsetAndType = offsetAndType;
    stream.tokenCount = tokenCount;
    stream.balance = balance;
    stream.reset();
    stream.next();

    return stream;
}

// extend tokenizer with constants
Object.keys(constants).forEach(function(key) {
    tokenize[key] = constants[key];
});

// extend tokenizer with static methods from utils
Object.keys(charCodeDefinitions).forEach(function(key) {
    tokenize[key] = charCodeDefinitions[key];
});
Object.keys(utils).forEach(function(key) {
    tokenize[key] = utils[key];
});

module.exports = tokenize;
