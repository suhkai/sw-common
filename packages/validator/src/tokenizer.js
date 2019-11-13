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
    PATHPART: '\x01',
    SLASH: '\x02',
    PARENT: '\x03',
    CURRENT: '\x04'
};

const absorbers = {
    pathpart: {
        order: 99,
        fn: (str, i) => {
            let b = i;
            while (str[b] && !(str[b] === '/' && str[b - 1] !== '\\')) {
                b++;
            };
            if (b === i) {
                return undefined;
            }
            return { token: tokens.PATHPART, start: i, end: b - 1, value: descape(str.slice(i, b)) };
        }
    },
    slash: {
        order: 0,
        fn: (str, i) => {
            if (str[i] === '/' && str[i - 1] !== '\\') {
                return { token: tokens.SLASH, start: i, end: i, value: str.slice(i, i + 1) };
            }
        }
    },
    dotpaths: {
        order: 1,
        fn: (str, i) => {
            let b = i;
            while (str[b] === '.') {
                b++;
            };
            if (b === i) {
                return undefined;
            }
            const len = b - i;
            switch (len) {
                case 1:
                    return { token: tokens.CURRENT, start: i, end: b - 1, value: str.slice(i, b) };
                case 2:
                    return { token: tokens.PARENT, start: i, end: b - 1, value: str.slice(i, b) };
                default:
                    return undefined;
            }
        }
    }
};


function orderAbsorbers() {
    const orderedAbsorbers = Object.values(absorbers).sort((a, b) => {
        return a.order - b.order;
    });
    return function () {
        return orderedAbsorbers;
    }
}

const getOrderedAbsorbers = orderAbsorbers();

function tokenize(str, i) {
    for (const fnCtx of getOrderedAbsorbers()) {
        const token = fnCtx.fn(str, i);
        if (token) return token;
    }
}

function* tokenGenerator(path) {
    for (let i = 0; i < path.length;) {
        const token = tokenize(path, i);
        if (!token) {
            throw new TypeError(`Tokenisation process failed for ${path}`);
        }
        i = token.end + 1; // advance
        yield token;
    }
}


const isAbsolute = t =>  t[0].token === tokens.SLASH;

function escape(str){ // normal -> human interface
    return str.replace('/','\\/');
}

function descape(str){ // human interface -> normal
    return str.replace(/\\\//g,'/');
}

function resolve(from, to){
    if (isAbsolute(to)){
        return to;
    }
    if (!isAbsolute(from)){
        throw new TypeError(`Internal error, object location path must be absolute`);
    }
    const resolved = from.slice();
    for(const inst of to){
        switch(inst.token){
            case tokens.SLASH: // we dont care about this, as its just like a "space" between words
                break;
            case tokens.PATHPART:
                // TODO:
                break;  
            case tokens.PARENT:
                // TODO
                break;
            case tokens.CURRENT:
                break;
            default:
        }
    }
    return resolved;
}



module.exports = {
    tokenGenerator,
    tokens
};

