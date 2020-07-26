// 5.4.6. Consume a component value
// https://drafts.csswg.org/css-syntax-3/#consume-component-value

'use strict';

const {
    LEFTSB_TOKEN,
    LEFTCB_TOKEN,
    LEFTP_TOKEN,
    RIGHTP_TOKEN,
    FUNCTION,
    WS,
    COMMENT
} = require('../lexer/tokens');

const absorbSimpleBlock = require('./simple-block');
const absorbFunction = require('./function');

module.exports = function consumeComponentValue(iter) {
    const cvalue = [];
    while (!iter.done) {
        const step = iter.next();
        const tk = step.value;
        if (tk.id === LEFTSB_TOKEN || tk.id === LEFTCB_TOKEN || tk.id === LEFTP_TOKEN || tk.id === RIGHTP_TOKEN) {
            this.stream.reset(tk.s.o, tk.s.loc.col, tk.s.loc.row);
            const blockTokens = absorbSimpleBlock(iter);
            Array.prototype.push.apply(cvalue, blockTokens);
            continue;
        }
        if (tk.id === FUNCTION) {
            const ftokens = absorbFunction(tk, iter); // dont roll back efficiency
            Array.prototype.push.apply(cvalue, ftokens);
            continue;
        }
        if (tk.id === WS || tk.id === COMMENT) {
            cvalue.push(tk);
            continue;
        }
        cvalue.push(tk);
        break;
    }
    return cvalue;
}
