'use strict';
const { isWS } = require('./checks-and-definitions');
const consumeName = require('./name')
const { FUNCTION, IDENT } = require('./tokens');
const absorbWS = require('./white-space')
const absorbURL = require('./url');


// 4.3.4. Consume an ident-like token
// https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token

module.exports = function identLike(iter) {
    const step = iter.peek();
    const name = consumeName(iter);
    /* Consume a name, and let string be the result.
            1. If 
                    string’s value is an ASCII case-insensitive match for "url",
                    AND 
                    the next input code point is U+0028 LEFT PARENTHESIS ((), 
                consume it. 
            2.  While the next two input code points are whitespace, consume the next input code point. 
            3.  If the next one or two input code points are 
                    U+0022 QUOTATION MARK ("), 
                    U+0027 APOSTROPHE ('), 
                    or whitespace followed by 
                        U+0022 QUOTATION MARK (") or
                        U+0027 APOSTROPHE ('), 
                then create a <function-token> with its value set to string and return it. 
            4.  Otherwise, consume a url token, and return it.
    */

    /* REMARKS:
        according to above spec a url(     'somedata'    ) would be a URL token ( but a bad url token )
    */

    let cp = step.value;
    if (name.value.toLowerCase() === 'url' && cp && cp.d === '(') {
        iter.next() // consume '(' token
        // optional
        if (step.value && isWS(step.value.d)){
            absorbWS(iter,3); // maxium of 3 spaces to absorb
        }
        if (step.value && (step.value.d === '\'' || step.value.d === '"')){
            // create function token
            //   reset to 1 cp beyond '('
            iter.reset(cp.o, cp.col, cp.row);
            iter.next();
            return {
                id: FUNCTION,
                d: name.value + '(',
                s: name.s,
                e: { o: cp.o, loc: { col: cp.col, row: cp.row } }
            }
        }
        // anything elseis url token or url-bad token
        return absorbURL(name, iter);
    }

    // function token
    if (cp && cp.d === '(') {
        iter.next();
        return {
            id: FUNCTION,
            d: name.value + '(',
            s: name.s,
            e: { o: cp.o, loc: { col: cp.col, row: cp.row } }
        };
    }
    // vanilla ident token
    return {
        id: IDENT,
        d: name.value,
        s: name.s,
        e: name.e
    }
}
