// 1.token  '/'
// 2.token name [anything not '/']
// 3.you can have escaped \/ this is allowed,  '/' does appear as object property names in rollup "bundle" object.
// AST
// root -> starts with / (or not)
// (root=/)pathelement|path-devider=/ (not escaped)/finalprop
// ast will be an array of 
//  { root->"/" or emoty,
//    pathElts: [] array of path pathelts either names (nothingthing goes that is allowed )
//    see path elts more as navigation instructions 
//  target prop is 


// emits tokens
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
// [Symbol.iterator] -> A zero arguments function that returns an object, conforming to the iterator protocol.

const tokens = {
    NOTSLASH: '\x01',
    SLASH: '\x02'
};

const recognizes = {
    NOTSHLASH: a => a !== '/',
    SLASH: a => a === '/'
};

function* tokenGenerator(path) {
    let partialToken;

    // NOTE: please not the '<=' in the second equality condition, this is on purpose!!
    for (let i = 0; i <= path.length; i++) {
        if (path[i] === '/') {
            if (path[i - 1] === '\\') {
                continue;
            }
            // where we processing a token before this?
            if (partialToken) { // finish it and emit
                partialToken.end = i - 1;
                yield partialToken;
            }
            partialToken = {
                start: i,
                end: i,
                token: tokens.SLASH
            };
            if (i === path.length - 1) {
                yield partialToken;
                return;
            }
            yield partialToken;
            partialToken = undefined;
            continue;

        }
        if (!partialToken) {
            partialToken = {
                start: i,
                token: tokens.NOTSLASH
            };
        }
        if (i === path.length) { //EOL, finalize any token you are working on and finalize
            partialToken.end = i - 1;
            yield partialToken;
            return;
        }
        // nothing to do here, if it is not a '/' then nothing happened
    }
    throw new Error(`Internal tokenizer error you should not be here parsing: [${path}]`);
}

module.exports = {
    tokenGenerator
};