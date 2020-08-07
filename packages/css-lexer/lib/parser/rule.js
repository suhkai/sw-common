// 5.4.3. Consume a qualified rule
// https://drafts.csswg.org/css-syntax-3/#consume-qualified-rule

'use strict';
const absorbBlock = require('./simple-block');
const { RIGHTSB_TOKEN } = require('../lexer/tokens')
const absorbComponentValue = require('./component');


module.exports = function consumeQualifiedRule(iter) {
    const prelude = [];
    let block;
    while (!iter.done) {
        const step = iter.next();
        const tk = step.value;
        if (tk.id === WS || tk.id === COMMENT){ // skip it
            continue;
        }
        if (tk.id === RIGHTSB_TOKEN) {
            block = absorbBlock(tk, iter);
            break;
        }
        this.stream.reset(tk.s.o, tk.s.loc.col, tk.s.loc.row);
        const cvalues = absorbComponentValue(iter);
        Array.prototype.push.apply(prelude, cvalues);
    }
    return { prelude, block }
}