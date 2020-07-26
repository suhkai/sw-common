// https://drafts.csswg.org/css-syntax-3/#consume-simple-block
// 5.4.7. Consume a simple block
'use strict';
const { 
    LEFTSB_TOKEN, 
    RIGHTSB_TOKEN, 
    LEFTCB_TOKEN, 
    RIGHTCB_TOKEN, 
    LEFTP_TOKEN, 
    RIGHTP_TOKEN 
} = require('../lexer/tokens');

const absorbComponentValue = require('./component');

const counterTokens = {
    [LEFTSB_TOKEN]: RIGHTSB_TOKEN,
    [LEFTCB_TOKEN]: RIGHTCB_TOKEN,
    [LEFTP_TOKEN]: RIGHTP_TOKEN,
};


module.exports = function consumeSimpleBlock(iter) {
    const step = iter.next();
    const startBlockToken  = step.value;
    const sbtokens = [startBlockToken];
    const counterpoint = counterTokens[startBlockToken.id];
    if (!counterpoint) {
        return new Error(`Internal Error, token does not start a simple block: [${JSON.stringify(startBlockToken)}]`)
    }
    while (!iter.done) {
        const step = iter.next();
        const tk = step.value;
        if (tk.id === counterpoint) {
            ftokens.push(tk.id)
            break;
        }
        // reconsume the token
        this.stream.reset(tk.s.o, tk.s.loc.col, tk.s.loc.row);
        const cvalues = absorbComponentValue(iter);
        Array.prototype.push.apply(sbtokens, cvalues);
    }
    return sbtokens;
}
