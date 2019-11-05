
const isObject = require('./isObject');

const scalars = [
    'string',
    'number',
    'symbol',
    'boolean'
];

// isXXXX

const isScalar = s => {
    return scalars.includes(typeof s);
}

const isClass = c => {
    return typeof c === 'function' && c.toString().startsWith('class');
}

const isFunction = f => {
    return typeof f === 'function' && f.toString().startsWith('function');
}

const isArray = Array.isArray;

// equalXXXX

const equalSimple = (a, b) => a === b;

const equalArray = (arr1, arr2) => {
    // for every part in arr1, there is something in arr2

    if (arr1.length !== arr2.length) return false;
    
    const ac2 = arr2.slice(0);

    for (let i = 0; i < arr1.length; i++) {
        const foundIdx = ac2.findIndex( v => equal(v, arr1[i]));
        if (foundIdx >= 0){
            ac2.splice(foundIdx, 1);
        }
    }
    if (ac2.length) return false;

    const ac1 = arr1.slice(0);

    for (let i = 0; i < arr2.length; i++) {
        const foundIdx = ac1.findIndex( v => equal(v, arr2[i]));
        if (foundIdx >= 0){
            ac1.splice(foundIdx,1);
        }
    }
    if (ac1.length) return false;

    return true;
}

const equalFunction = (f1, f2) => {
    return f1.toString() === f2.toString();
}

const equalClass = (c1, c2) => {
    return c1.toString() === c2.toString();
}

function equalprops(a, b, selector) {
    const aS = selector(a);
    const bS = selector(b);
    if (aS.length !== bS.length) {
        return false;
    }
    if (!equalArray(aS, bS)) {
        return false;
    }
    for (const s of aS) {
        const v1 = a[s];
        const v2 = b[s];
        if (!equal(v1, v2)) {
            return false;
        }
    }
    return true;
}

const equalObject = (a, b) => {
    // lets to symbolsfor (const a )
    if (!equalprops(a, b, Object.getOwnPropertyNames)) {
        return false;
    }
    if (!equalprops(a, b, Object.getOwnPropertySymbols)) {
        return false;
    }
    return true;
}

function equal(a, b) {
    if (isScalar(a) && isScalar(b)) {
        return equalSimple(a, b);
    }
    if (isArray(a) && isArray(b)) {
        return equalArray(a, b);
    }
    if (isFunction(a) && isFunction(b)) {
        return equalFunction(a, b);
    }
    if (isObject(a) && isObject(b)) {
        return equalObject(a, b);
    }
    if (isClass(a) && isClass(b)) {
        return equalClass(a, b);
    }
    if (a === null && a === b) {
        return true;
    }
    if (a === undefined && a === b) {
        return true;
    }
    return false;
}

module.exports = equal;