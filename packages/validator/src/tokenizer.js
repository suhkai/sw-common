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
    PREDICATE: '\0x05',
    PREDICATE_REGEXP: '\0x05'
};

// there should be a list of "absorbers" things like
// default
//  absorber for clauses
//    absorber for keys within clauses
//    absorber for value within clauses
//  all these absorbers emit token streams, any absorber token bust be "globally unique"

const absorbers = {
    where: {
        order: 1,
        fn: (str, i) => {
            let b = i;
            // must start with '[' and end with ']', also note, '[' ']' are special chars used by regexp so we use "zoning/scoping" to analyse correctly.
            if (str[b] !== '[') {
                return undefined;
            }
            b++;
            if (str[b] === '/') { // absorb regexp
                // find the combination /] but not \\/]  there will never be a regexp class like ..\\/] (outside of a regexp class ofc its possible)
                //  because '/' is not escaped in a regexp.
                b++;
                while (!(str[b] === ']' && str[b - 1] == '/' && str[b - 2] !== '\\')) {
                    b++;
                }
                if (str[b] === ']') {
                    return { token: tokens.PREDICATE_REGEXP, start: i, end: b, value: new RegExp(str.slice(i + 1, b)) };
                }
                // this is an error 
                throw new TypeError(`there is no closing "/]" for the predicate with a regexp ${str.slice(i, b)}`);
            }
            // absorb "normal" string
            while (!(str[b] === ']' && str[b - 1] !== '\\')) {
                b++;
            }
            // check if the last one is indeed ']'
            if (str[b] === ']') {
                return { token: tokens.PREDICATE, start: i, end: b, value: str.slice(i + 1, b) };
            }
            throw new TypeError(`there is no closing "]" for the predicate ${str.slice(i, b)}`);
        }
    },
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

const getTokens = path => Array.from(tokenGenerator(path));

// 
// make this more general so use an absorber and arbitraty start and stop indexes
//
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
            case tokens.PREDICATE:
            case tokens.PATHPART:
                add(resolved, inst);
                break;
            case tokens.PARENT:
                goUp(resolved);
                break;
            case tokens.CURRENT:
                break; // skip
            default:
                throw new TypeError(`internal error: wrong path token "${int.value}"`);
        }
    }
    return resolved;
}

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
    getTokens
};

