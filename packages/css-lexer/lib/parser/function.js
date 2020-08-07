'use strict';
const { LEFTCB_TOKEN } = require('../lexer/tokens')

// https://drafts.csswg.org/css-syntax-3/#consume-function
module.exports = function consumeFunction(funcToken, iter){
    const ftokens = [funcToken];
    while(!iter.done){  
        const step = iter.next();
        const tk = step.value;
        if (tk.id === LEFTCB_TOKEN){
            ftokens.push(tk.id)
        }
    }
    return ftokens;
}

