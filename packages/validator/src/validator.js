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

function createRangeCheck(n, m) {
        // both should be of type number
        m = m || Infinity;
        n = n || -Infinity;
        if (!(typeof n === 'number' && typeof m === 'number')) {
                return new TypeError(`n:${n} and m:${m} are not of type number`);
        }
        if (isNaN(n)) {
                return new TypeError(`n is a NaN`);
        }
        if (isNaN(m)) {
                return new TypeError(`m is a NaN`);
        }
        if (n > m) {
                throw new TypeError(`n:${n} should be smaller then m:${m}`)
        }
        return function isInRange(i) {
                if (i >= n && i <= m) {
                        return [i, null];

                }
                return [null, `${i} is not between ${n} and ${m} inclusive`];
        };
}

function createStringLengthRangeCheck(n, m) {
        // both should be of type number
        // both should be of type number
        m = m || Infinity;
        n = n || 0;
        if (!(typeof n === 'number' && typeof m === 'number')) {
                return new TypeError(`n:${n} and m:${m} are not of type number`);
        }
        if (isNaN(n)) {
                return new TypeError(`n is a NaN`);
        }
        if (isNaN(m)) {
                return new TypeError(`m is a NaN`);
        }
        if (n > m) {
                throw new TypeError(`n:${n} should be smaller then m:${m}`);
        }
        if (n < 0) {
                throw new TypeError(`n:${n} should not be smaller then 0`);
        }
        if (m < 0) {
                throw new TypeError(`m:${n} should not be smaller then 0`);
        }
        return function isInRange(str) {
                if (str.length >= n && str.length <= m) {
                        return [str, null];
                }
                return [null, `string of length:${str.length} is not between ${n} and ${m} inclusive`];
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

const stringSchredder = /^string(\{[^{}]+\})?(\[[^[\]]*\])?$/;
// check for pattern number{...}[...]
const numberSchredder = /^number(\{[^{}]+\})?(\[[^[\]]*\])?$/;
// check for pattern boolean{...}[...]
const booleanSchredder = /^boolean(\{[^{}]+\})?(\[[^[\]]*\])?$/;

const dummy = () => {};

const mapV = new Map([
        [stringSchredder, dummy],
        [numberSchredder, dummy],
        [booleanSchredder, dummy]
]);

function createValidator(instr) {
        // check for pattern string{...}[...]
        const tokensNzer = [stringSchredder, numberSchredder, booleanSchredder];
        for (const [pattern, fn] of tokensNzer) {
                const shredded = instr.match(pattern);
                if (shredded){
                        return fn(inst, pattern);
                }
        }
        throw new TypeError(`validator pattern not recognized ${inst}`);
}

module.exports = {
        // helpers
        createValidator,
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
