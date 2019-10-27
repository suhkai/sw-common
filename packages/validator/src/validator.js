'use strict';

function convertToNumber(str) {
        if (typeof str !== 'number') {
                const n = parseFloat(str);
                if (isNaN(n)) {
                        return [null, `cannot convert to number`]
                }
                return [n, null];
        }
        return [str, null]; // already a number
}

function convertToBoolean(str) {
        if (typeof str === 'boolean') {
                return [str, null];
        }
        if (typeof str === 'string') {
                let f = str.match(/^(FALSE|TRUE)$/i);
                if (f === null) {
                        return [null, `cannot convert to boolean`]
                }
                f = str.toLocaleLowerCase();
                if (f === 'true') return [true, null];
                return [false, null];
        }
        return [null, `cannot convert to boolean for other then string type`];
}

function isInt(i) {
        if (typeof i !== 'number') {
                return [null, 'not a number'];
        }
        if (Number.isInteger(i)) {
                return [i, null];
        }
        return [null, 'not an integer']
}

function createRangeCheck(m, n) {
        // both should be of type number
        m = m === undefined || m === null ? -Infinity : m;
        n = n === undefined || n === null ? Infinity : n;
        if (typeof n !== 'number') {
                const type = typeof n;
                throw new TypeError(`upper boundery n:<${type}>${n} MUST be of type number`);
        }
        if (typeof m !== 'number') {
                const type = typeof m;
                throw new TypeError(`lower boundery m:<${type}>${m} MUST be of type number`);
        }
        if (isNaN(n)) {
                throw new TypeError(`upper boundery n is a NaN`);
        }
        if (isNaN(m)) {
                throw new TypeError(`lower boundery m is a NaN`);
        }
        if (m > n) {
                throw new TypeError(`lower boundery m:${m} should be lower then upper boundery n:${n}`)
        }
        return function isInRange(i) {
                if (typeof i !== 'number'){
                        return [null, `${i} is not a number`];
                }
                if (i >= m && i <= n) {
                        return [i, null];

                }
                return [null, `${i} is not between ${m} and ${n} inclusive`];
        };
}

function createStringLengthRangeCheck(m, n) {
        m = m === undefined || m === null ? -Infinity : m;
        n = n === undefined || n === null ? Infinity : n;
        if (typeof n !== 'number') {
                const type = typeof n;
                throw new TypeError(`upper boundery n:<${type}>${n} MUST be of type number`);
        }
        if (typeof m !== 'number') {
                const type = typeof m;
                throw new TypeError(`lower boundery m:<${type}>${m} MUST be of type number`);
        }
        if (isNaN(n)) {
                throw new TypeError(`upper boundery n is a NaN`);
        }
        if (isNaN(m)) {
                throw new TypeError(`lower boundery m is a NaN`);
        }
        if (m > n) {
                throw new TypeError(`lower boundery m:${m} should be lower then upper boundery n:${n}`);
        }
        if (m < 0) {
                throw new TypeError(`lower boundery m:${m} should be >= 0`);
        }
        return function isInRange(str) {
                if (typeof str !== 'string'){
                        return [null, `string of length:${str.length} is not between ${m} and ${n} inclusive`];        
                }
                if (str.length >= m && str.length <= n) {
                        return [str, null];
                }
                return [null, `string of length:${str.length} is not between ${m} and ${n} inclusive`];
        }
}

function fullTypeArrayCheck(_type, arr) {
        if (!Array.isArray(arr)) {
                return [null, `collection is not a array ${arr}`];
        }
        if (arr.length === 0) {
                return [null, 'collection is not an empty array'];
        }
        let error = false;
        for (const elt of arr) {
                if (typeof elt !== _type) {
                        error = true;
                        break;
                }
        }
        if (error) {
                return [null, 'not all elements were strings'];
        }
        return [arr, null];
}

const isNumberArray = collection => fullTypeArrayCheck('number', collection);
const isBooleanArray = collection => fullTypeArrayCheck('boolean', collection);
const isStringArray = collection => fullTypeArrayCheck('string', collection);

function createCollectionChecker(type, collection) {
        const [enums, errMsg] = fullTypeArrayCheck(type, collection);
        if (errMsg) {
                throw new TypeError(errMsg);
        }
        //
        return function (str) {
                const typeStr = typeof str;
                if (typeStr !== type) {
                        return [null, `value is not of type ${type}`];
                }
                for (const elt of collection) {
                        if (elt === str) {
                                return [str, null];
                        }
                }
                return [null, 'value is not part of the colelection'];
        };
}

const isObject = o => typeof o === 'object' && o !== null && !Array.isArray(o);

module.exports = {
        // helper
        createCollectionChecker,
        isStringArray,
        isBooleanArray,
        isNumberArray,
        isInt,
        isObject,
        // forcers
        convertToNumber,
        convertToBoolean,
        // checkers
        createStringLengthRangeCheck,
        createRangeCheck,
}
