  // § 4.3.4. Consume an ident-like token
  module.exports = function consumeIdentLikeToken() {
    const nameStartOffset = offset;

    // Consume a name, and let string be the result.
    offset = consumeName(source, offset);

    // If string’s value is an ASCII case-insensitive match for "url",
    // and the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
    if (cmpStr(source, nameStartOffset, offset, 'url') && getCharCode(offset) === 0x0028) {
        // While the next two input code points are whitespace, consume the next input code point.
        offset = findWhiteSpaceEnd(source, offset + 1);

        // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('),
        // or whitespace followed by U+0022 QUOTATION MARK (") or U+0027 APOSTROPHE ('),
        // then create a <function-token> with its value set to string and return it.
        if (getCharCode(offset) === 0x0022 ||
            getCharCode(offset) === 0x0027) {
            type = TYPE.Function;
            offset = nameStartOffset + 4;
            return;
        }

        // Otherwise, consume a url token, and return it.
        consumeUrlToken();
        return;
    }

    // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
    // Create a <function-token> with its value set to string and return it.
    if (getCharCode(offset) === 0x0028) {
        type = TYPE.Function;
        offset++;
        return;
    }

    // Otherwise, create an <ident-token> with its value set to string and return it.
    type = TYPE.Ident;
}