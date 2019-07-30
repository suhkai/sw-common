'use strict'



const isString = (s: any) => typeof s === 'string';

const isNumeric = (s: any) => {
    if (typeof s === 'string') {
        try {
            return Number.parseFloat(s) !== NaN
        }
        catch (e) {
            return false;
        }
    }
    return typeof s === 'number';
}

const toNumber = (s: any) => {
    if (typeof s === 'string') {
        switch (s.toLocaleLowerCase()) {
            case '+infinity':
            case 'infinity':
                return Infinity;
            case '-infinity':
                return -Infinity;
            default:
                return Number.parseFloat(s);
        }
    }
    if (typeof s === 'number') {
        return s;
    }
    return NaN;
}

const isInteger = Number.isInteger;
const isFinite = Number.isFinite;
const isNaN = Number.isNaN;

//max
const createMax = (max: number) => (s: number) => s < max;
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

const tokes = {
    'obj': {},
    'nonew': {}

}

function primer() {/* noop primer  */ console.log('function is called'); return { obj: {} }; }

export type Primer = () => ({ obj: {} })

const $start = Symbol('start');

function createValidatorProxy() {
    const handler: ProxyHandler<any> = {
        getPrototypeOf() {
            console.log('get prototypeof activated');
            return { a: 1, b: 2 };
        },
        get(target, prop, receiver) {
            console.log(`prop:${String(prop)}`);
            return assembler;
        },
        set(target, s: string, value: any, receiver){
            throw new TypeError(`not possible to assign a value to a validation rung [${s}]`);
        },
        apply(target, thisArg, argumentList) {
            //console.log(`thisArg:${thisArg}`)
            console.log(`argumentList ${Array.from(Object.entries(argumentList)).map(String).join('|')}`);
            // do nothing
            return assembler;
        }
    };
    const assembler = new Proxy(primer.bind(handler), handler);
    /* maybe do some tests here */
    return assembler;
}


function rootProxy(){
    const handler: ProxyHandler<any> = {
        getPrototypeOf() {
            console.log('get prototypeof activated');
            return { a: 1, b: 2 };
        },
        get(target, prop: string, receiver) {
            console.log(`prop:${String(prop)}`);
            const assembler = createValidatorProxy(); // first prop
            return assembler[prop];
        },
        apply(target, thisArg, argumentList) {
            // root proxy cannot be called
            throw new Error('No validator defined');
        }
    };
    const rootAssembly = new Proxy(primer.bind(handler), handler);
    /* maybe do some tests here */
    return rootAssembly;
}

/*
 connectors
 name
 type
 port:
 host:M
 port
*/

export default rootProxy();

