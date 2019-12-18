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
// 
// emits tokens
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
// [Symbol.iterator] -> A zero arguments function that returns an object, conforming to the iterator protocol.

const tokens = {
    PATHPART: '\x01',
    SLASH: '\x02',
    PARENT: '\x03',
    CURRENT: '\x04',
    //PREDICATE: '\0x05',
    //PREDICATE_ELT: '\0x06',
    PREDICATE_ELT_REGEXP: '\0x07',
    PREDICATE_ELT_LITERAL: '\0x08'
};

// there should be a list of "absorbers" things like
// default
//  absorber for clauses
//    absorber for keys within clauses
//    absorber for value within clauses
//  all these absorbers emit token streams, any absorber token bust be "globally unique"
//  For now how absorbers are hierarchicly linked is programmicly determined, but later do a more declerative way of doing things.
// 

function createRegExp(regexpText) {
    try {
        return [new RegExp(regexpText), undefined]
    }
    catch (err) {
        return [undefined, String(err)];
    }
}

const predicteElementAbsorber = [
    {
        name: 'clauseElt',
        order: 0,
        // generator
        *fn(str, start, end) {
            if (str[start] === '/') {
                // must end with '/' without previous '\\' of course
                for (let j = start+1; j <= end; j++) {
                    if (str[j] === '/' && str[j - 1] !== '\\') {
                        const [value, error] = createRegExp(str.slice(start, j + 1));
                        yield { error, value, token: tokens.PREDICATE_ELT_REGEXP, start, end: j };
                        return;
                    }
                }
                const value = str.slice(start, end+1);
                return { error: `no closing "/" found to end the regular expression ${value}`, token: tokens.PREDICATE_ELT_REGEXP, start, end, value };
            }
            // absorb till end or untill you see a '=' (not delimited with a "\")
            for (let j = start+1; j <= end; j++) {
                if (str[j] === '=' && str[j - 1] !== '\\') {
                    yield { value: str.slice(start, j), token: tokens.PREDICATE_ELT_LITERAL, start, end: j };
                    return;
                }
            }
            // all of it till the end
            yield { value: str.slice(start, end+1), token: tokens.PREDICATE_ELT_LITERAL, start, end };
            return;
        }
    }

];

const predicateAbsorber = [
    {
        name: 'clause',
        order: 0,
        // generator
        *fn(str, start, end) {
            if (!(str[start] === '[' && str[end] === ']')) {
                return undefined; // not a clause token
            }
            const firstToken = predicateElement(str, start, end);
            if (!firstToken) {
                return undefined;
            }
            yield firstToken;
            if (str[firstToken.end + 1] !== '=') {
                return undefined;
            }
            const lastToken = predicateElement(str, firstToken.end + 2, end);
            if (!lastToken) {
                return undefined;
            }
            return lastToken;
        }
    }
];

const rootAbsorber = [
    {
        name: 'pathpart',
        order: 99,
        *fn(str, i, end) {
            let b = i;
            while (str[b] && !(str[b] === '/' && str[b - 1] !== '\\')) {
                b++;
            };
            if (b === i) {
                return undefined;
            }
            const token = predicateTokenizer(str, i, b - 1);
            return token || { token: tokens.PATHPART, start: i, end: b - 1, value: descape(str.slice(i, b)) };
        }
    },
    {
        name: 'slash',
        order: 0,
        *fn(str, i) {
            if (str[i] === '/' && str[i - 1] !== '\\') {
                return ({ token: tokens.SLASH, start: i, end: i, value: str.slice(i, i + 1) });
            }
        }
    },
    {
        name: 'dots', // actually this is just an alternative to pathpart, but ok lets keep it seperate
        order: 1,
        *fn(str, i) {
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
];

function createTokenizer(absorber) {
    const sortedAbsorber = absorber.sort((a, b) => a.order - b.order);
    return function* tokenize(str, i, b) {
        let start = i;
        for (const fnCtx of sortedAbsorber) {
            for (const token of fnCtx.fn(str, start, b)) {
                start = token.end + 1; // new start
                yield token;
            };
        }
    }
}

const defaultTokenizer = createTokenizer(rootAbsorber);
const predicateTokenizer = createTokenizer(predicateAbsorber);
const predicateElement = createTokenizer(predicteElementAbsorber);

const getTokens = path => Array.from(tokenGenerator(path));
// 
// make this more general so use an absorber and arbitraty start and stop indexes
//
function* tokenGenerator(path) {
    const sequence = defaultTokenizer(path, 0, path.length);
    let i = 0;
    //let done;
    //let token;
    do {
        const { done, value } = sequence.next(i);
        if (!done) {
            i = token.end + 1;
        }
        yield token;
    } while (!done && token !== undefined);
}


const isAbsolute = t => t.length && t[0].token === tokens.SLASH;

function escape(str) { // normal -> human interface
    return str.replace('/', '\\/');
}

function descape(str) { // human interface -> normal
    return str.replace(/\\\//g, '/');
}

const lastToken = a => a[a.length - 1] || {};

function goUp(from) {
    if (from.length === 1 && from.token === tokens.SLASH) {
        return;
    }
    // protection
    while (from.length && from[from.length - 1].token === tokens.SLASH) {
        from.pop();
    }
    if (from.length > 0) {
        // stip trailing "/"
        while (lastToken(from).token === tokens.SLASH) {
            from.pop();
        }
        // strip a path name
        while (lastToken(from).token !== tokens.SLASH) {
            from.pop();
        }
        // strap the '/' 
        while (lastToken(from).token === tokens.SLASH) {
            from.pop();
        }
    }
    if (from.length === 0) {
        from.push({ token: tokens.SLASH, value: '/' })
        return;
    }
}

function add(from, token) {
    if (from.length === 0) {
        from.push({ token: tokens.SLASH, value: '/' });
    }
    if (from[from.length - 1].token !== tokens.SLASH) {
        from.push({ token: tokens.SLASH, value: '/' });
    }
    from.push(token);
}


// take this out of this module at some later point
function resolve(from, to) {
    if (isAbsolute(to)) {
        return to;
    }
    if (!isAbsolute(from)) {
        throw new TypeError(`Internal error, object location path must be absolute`);
    }
    const resolved = from.slice();
    for (const inst of to) {
        switch (inst.token) {
            case tokens.SLASH: // we dont care about this, as its just like a "space" between words
                break;
            case tokens.PARENT:
                goUp(resolved);
                break;
            case tokens.CURRENT:
                break; // skip
            default: // case tokens.PATHPART: and dynamic variants go here
                add(resolved, inst);
        }
    }
    return resolved;
}

// take this out of this module at some later point
function formatPath(tokens) {
    if (tokens.length === 0) return '';
    return tokens.map(t => t.value).join('');
}

module.exports = {
    tokenGenerator,
    tokens,
    resolve,
    formatPath,
    escape,
    getTokens,
    defaultTokenizer,
    predicateTokenizer,
    predicateElement
};

