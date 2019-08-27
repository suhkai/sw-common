'use strict'

// collection of primitive checks
const isJSString = (s: any): s is string => typeof s === 'string';
const isJSNumber = (s: any): s is number => typeof s === 'number';

const notANumber = (s: any): [null, TypeError] => ([null, new TypeError(`not a number; [${String(s)}]`)]);
const NumberNotSmaller = (s: number, limit: number): [null, TypeError] => ([null, new TypeError(`[${String(s)}] not smaller then ${limit}`)]);
const NumberNotLarger = (s: number, limit: number): [null, TypeError] => ([null, new TypeError(`[${String(s)}] not larger then ${limit}`)]);

const isNumeric = (s: any) => {
    if (typeof s !== 'number') {
        try {
            const found = Number.parseFloat(String(s));
            return found !== NaN ? [found, null] : notANumber(s);
        }
        catch (e) {
            return notANumber(s);
        }
    }
    return [s, null];
}

const isInteger = Number.isInteger;
const isFinite = Number.isFinite;
const isNaN = Number.isNaN;

//max
const createMax = (max: number) => (s: any) => {
    if (!isJSNumber(s)) {
        return notANumber(s);
    }
    return s < max ? [s, null] : NumberNotSmaller(s, max);
}
//min
const createMin = (min: number) => (s: any) => {
    if (!isJSNumber(s)) {
        return notANumber(s);
    }
    return s > min ? [s, null] : NumberNotLarger(s, min);
}

const passThrough = (s: any) => {
    return [s, null];
}
//maxInc
const createMaxInclusive = (max: number) => (s: number) => s <= max;
//minInc
const createMinInclusive = (min: number) => (s: number) => s >= min;
//regexp
const createRegExp = (regexp: RegExp) => (s: string) => regexp.test(String(s));
const required = (s: any) => s !== undefined;
const isObject = (s: any) => typeof s === 'object' && s !== null;

// object level
const contrainedObject = (o: string[], propList: string[]) => {
    // not interested in prototype properties, this is json validation
    const props = Object.keys(o).sort();
    propList.sort();
    dedup(propList);
    //todo use fast difference
};

// note: dedup must be sorted
const dedup = (a: any) => {
    for (let i = 0; i < a.length;) {
        let j = i + 1;
        // look ahead
        while (a[i] === a[j]) { j++ };
        // if there were equals j > i+1
        if (j > i + 1) {
            a.splice(i, j - i - 1);
        }
        i++;
    }
};

// a and b are "sorted" somehow, will abort on first difference
// a and b are not necessarily dedooped
const isDiff = (a: any[], b: any[]) => {
    let c1 = 0;
    let c2 = 0;
    // I leave below as documentation, the different length by themselves
    // is not proof that there are differences for example a = [1,2,3], b =[1,2,2,2,3]
    // clearly "a" and "b" contain the same elements
    while (c1 < a.length && c2 < b.length) {
        if (a[c1] !== b[c1]) return true;
        while (a[c1] === a[c1 + 1] && c1 < a.length) { c1++; }
        while (b[c2] === b[c2 + 1] && c2 < b.length) { c2++; }
    }
    return false;
};

const allowed = (actual: any[], allowed: any[]) => {
    for (const elt of actual) {
        if (allowed.includes(elt)) {
            continue;
        }
        return false;
    }
    return true;
};


const tokens = {
    'numeric': {
        validator: isNumeric,
        stages: 1
    },
    'max': {
        validator: createMax,
        stages: 2
    },
    'min': {
        validator: createMin,
        stages: 2
    }
};

type Validator<T, S> = (s: T) => [S | null, TypeError];

function primer() {/* noop primer  */ console.log('function is called'); return { obj: {} }; }

export type Primer = () => ({ obj: {} })

const $start = Symbol('start');


function createValidatorProxy<T, S>(prevProxy: any, validator: Validator<T, S>) {
    let staged: undefined | {
        name: string;
        validator: Validator<T, S>
    };
    const handler: ProxyHandler<any> = {
        get(target: Validator<T, S>, prop: string, receiver) {
            if (!isJSString(prop)) {
                throw new TypeError(`[${String(prop)}] must be a string`);
            }
            if (staged) {
                throw new TypeError(`[${String(prop)}] validator must be finalized`);
            }
            // lookup propName
            if ((<any>tokens)[prop] === undefined) {
                throw new TypeError(`[${String(prop)}] validator is unknown`);
            }
            const token = (<any>tokens)[prop];
            if (token.stages === 1) {
                return createValidatorProxy(receiver, token.validator);
            }
            staged = token;
            return receiver;
        },
        set() {
            throw new TypeError('Using validators it the wrong way, you cannot assign a value to a validation step');
        },
        apply(target, thisArg /* this is the proxy */, argumentList) {
            // either we are executing the created validator or finalizing the creation of a validator
            if (staged) {
                prevProxy;
                assembler;
                const createdValidator = (<any>staged.validator)(...argumentList);
                staged = undefined; // clear it again
                return createValidatorProxy(thisArg, createdValidator);
            }
            // we are actually validating
            let fnArg = argumentList[0];
            if (prevProxy !== undefined){
                const [answer, error] =  prevProxy(fnArg);
                if (error){
                    return [answer, error];
                }
                fnArg = answer;
            }
            return target(fnArg);
        }
    };
    const assembler = new Proxy(validator, handler);
    /* maybe do some tests here */
    return assembler;
}

const bootStrap = createValidatorProxy(undefined, <any>passThrough);

export default bootStrap;
