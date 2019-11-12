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

// returns final path form path1 (relative) and path2 (always absolute)
function join(path1, path2){

}

function reference(path) {
    //validation
    if (typeof path !== 'string') {
        throw new TypeError(`argument path must be of type string: ${JSON.stringify(path)}`);
    }

    if (path === ''){
        throw new TypeError(`argument must be an actual path: ${JSON.stringify(path)}`)
    }

    const inst = Array.from(tokenGenerator(path));
    
    while (inst.length){
        const lastToken = inst[inst.length-1].token;
        if (lastToken !== tokens.SLASH){
            break;
        }
        inst.pop();
    };

    // remove double '//' -> '/'
    for (let i = inst.length -1 ; i > 0;){
       if (inst[i].token === tokens.SLASH){
            if (inst[i].token === token.SLASH){
                inst.splice(i,1);
                continue;
            }
       }
       i--;
    }

    if (inst.length === 0){
        throw new TypeError(`${String(path)} is an invalid path name.`)
    }

    const isAbsolute = inst[0].token === tokens.SLASH;

    // at this point we have a valid path 
    // contains
    // minor matchType = "any" "in" "exact"
    return function (matchType) {
        //
        // context has 2 props
        // "location" (tokenArray) (value copy) and "root" (object)
        //  
        return function pick(data, context) {
            // relative 

        }
    }
}

module.exports = {
    tokenGenerator
};

