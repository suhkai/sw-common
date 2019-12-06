'use strict';

const isObject = require('../isObject');
const isArray = Array.isArray;
const regxpNormalisation = /^\(([^\)\(]*)\)\s*=>\s*/;

const scalars = [
    'string',
    'number',
    'symbol',
    'boolean'
];

function equalprops(a, b, selector) {
    const aS = selector(a);
    const bS = selector(b);
    if (aS.length !== bS.length) {
        return false;
    }
    if (!equalArray(aS, bS, equal)) {
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
};


function isScalar(s) {
    return scalars.includes(typeof s);
};

function equalFunction(f1, f2) {
    const str1 = f1.toString().replace(regxpNormalisation,'$1=>');
    const str2 = f2.toString().replace(regxpNormalisation,'$1=>');
    return str1 === str2;
};

function isFunction(f){
    if (typeof f === 'function') {
        const str = f.toString();
        if (str.startsWith('function') || /^\(([^\)\(]*)\)\s*=>\s*/.test(str)) {
            return true;
        }
    }
    return false;
};

function isClass(c) {
    return typeof c === 'function' && c.toString().startsWith('class');
};

function equalClass(c1, c2) {
    return c1.toString() === c2.toString();
};

function equalObject(a, b){
    // lets to symbolsfor (const a )
    if (!equalprops(a, b, Object.getOwnPropertyNames)) {
        return false;
    }
    if (!equalprops(a, b, Object.getOwnPropertySymbols)) {
        return false;
    }
    return true;
};

function equalArray(arr1, arr2){
    // for every part in arr1, there is something in arr2

    if (arr1.length !== arr2.length) return false;

    const ac2 = arr2.slice(0);

    for (let i = 0; i < arr1.length; i++) {
        const foundIdx = ac2.findIndex(v => equal(v, arr1[i]));
        if (foundIdx >= 0) {
            ac2.splice(foundIdx, 1);
        }
    }
    if (ac2.length) return false;

    const ac1 = arr1.slice(0);

    for (let i = 0; i < arr2.length; i++) {
        const foundIdx = ac1.findIndex(v => equal(v, arr2[i]));
        if (foundIdx >= 0) {
            ac1.splice(foundIdx, 1);
        }
    }
    if (ac1.length) return false;

    return true;
};

function equalSimple(a, b){
    return a === b;
};

function equal(a, b) {
    if (isScalar(a) && isScalar(b)) {
        return equalSimple(a, b);
    }
    if (isArray(a) && isArray(b)) {
        return equalArray(a, b, equal);
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

module.exports = {
    equalObject,
    equals: equal,
    equalSimple,
    equalArray,
    equalClass,
    isClass,
    isFunction,
    equalFunction,
    isScalar,
    equalprops
};

