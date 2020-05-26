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

// https://drafts.csswg.org/css-syntax-3/#consume-function
module.exports = function consumeSimpleBlock(startBlockToken, iter) {
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
        }
        // returns an array
        const cvalue = absorbComponentValue(iter);
        Array.prototype.apply(sbtokens, cvalues);
    }
    return sbtokens;
}
