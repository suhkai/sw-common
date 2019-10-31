'use strict';

const {
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
} = require('./validator');

const $optional = Symbol.for('optional');

function sanitizeFileName(name) {
    return name.replace(/[\0?*+]/g, '_');
}

//https://stackoverflow.com/questions/1976007/what-characters-are-forbidden-in-windows-and-linux-directory-names
// not really windows friendly path fragging, use path.parse and path.format and examine the 'root' element
function isPlainPathFragment(name) {
    // not starting with "/", "./", "../"
    return (
        name[0] !== '/' &&
        !(name[0] === '.' && (name[1] === '/' || name[1] === '.')) &&
        sanitizeFileName(name) === name
    );
}

function primer() {
    /* noop primer  */
    console.log('function is called');
}

const features = new Map();

features.set('range', {
    factory: 1,
    name: 'range',
    fn: function createRange(a, b) {
        return function checkRange(data) {
            if (data >= a && data <= b) {
                return [data, null];
            }
            return [null, `value out of bounds`];
        };
    }
});

const alphabet = Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i));

function randomString(length = 4) {

    const _alphabet = alphabet.slice();
    for (let i = 0; i < 26 - length; i++) {
        const idx = Math.trunc(Math.random() * _alphabet.length);
        _alphabet.splice(idx, 1);
    }
    return _alphabet;
}

features.set('object', {
    // x->2, object 
    // 2->1, call object({...})
    // 1->0, you finalized with "open" or "closed",
    factory: 2,
    name: 'object',
    fn: function (schema) {
        const prefix = randomString()
        // must be an object
        if (!isObject(schema)) {
            const errMsg = `specify a JS object with validators to verify an object`;
            throw new TypeError(errMsg);
        }
        const props = {
            strings: Object.getOwnPropertyNames(schema),
            symbols: Object.getOwnPropertySymbols(schema)
        };
        const propCount = props.strings.length + props.symbols.length;
        if (propCount === 0) {
            const errMsg = `the JS validator object does not have any properties defined`;
            throw new TypeError(errMsg);
        }
        const nonFunctions = descr.filter(f => typeof props[f] !== 'function');
        if (nonFunctions.length) {
            const errMsg = `the JS validator object does not have any properties defined`;
            throw new TypeError(errMsg);
        }
        // all ok with the object
        return function sealing(openOrClosed) {
            if (openOrClosed !== 'open' && openOrClosed !== 'closed') {
                const errMsg = `object must be closed by "open" or "closed" modofifier, not with "${openOrClosed}"`;
                throw new TypeError(errMsg);
            }
            // split object in symbol and normal strings
            function copyObject(o) {
                const symbolObj = {};
                const stringObj = {};

                for (const prop in o) {
                    if (typeof prop === 'string') {
                        stringObj[prop] = o[prop];
                    }
                    else if (typeof prop === 'symbol') {
                        symbolObj[`${String(prop)}`] = o[prop];
                    }
                }
                return { symbolObj, stringObj };
            }

            function checkMissingProps(partition, data, errors) {
                for (const key of props[partition]) {
                    if (!(key in data)) {
                        if (schema[key][$optional] === false) {
                            errors.push(`${String(key)} is manditory but absent from the object`);
                        }
                    }
                }
                return errors
            }

            function deepValidate(partition, data, ctx) {
                const errors = [];
                for (const key of descr[partition]) {
                    const value = data[key];
                    if (value === undefined) {
                        continue; // skip it
                    }
                    const [result, err, final] = schema[key](value, { data: ctx.data, location: `${ctx.location}/${key}` });
                    if (!err) {
                        data[key] = result; // allow for transforms
                        continue;
                    }
                    errors.push(err);
                }
                return [errors.length ? undefined : data, errors.length ? errors.join('|') : undefined, undefined];
            }
            //
            return function validateObject(obj, ctx = { data: obj, location: '' }) { // Return dummy validator
                // validation for optional and missing props etc
                const errors = [];
                
                if (openOrClosed === 'closed') {
                    for (const propKey in obj) {
                        if (!(propKey in schema)) {
                            errors.push(`${String(propKey)} this property is not allowed`);
                        }
                    }
                    if (errors.length) {
                        const errMsg = `The validating object schema is closed. Forbidden properties: [${errors.join('|')}]`;
                        return [null, errMsg, null];
                    }
                }

                checkMissingProps('string', obj, errors);
                checkMissingProps('symbol', obj, errors);

                if (errors.length) {
                    return [null, errors.join('|'), null];
                }
                // deep validation
                const [result1, errors1] = deepValidate('string', obj, ctx);
                if (errors1) {
                    return [undefined, errors1, undefined];
                }
                const [result2, errors2] = deepValidate('symbol', result1, ctx);
                if (errors2) {
                    return [undefined, errors2, undefined];
                }
                // all done
                return [result2, undefined, undefined]
            }
        };
    }
});

features.set('transformIfString', {
    factory: 2,
    name: 'object',
    fn: function (data) {
        if (typeof data === 'string') {

        }
        if (isObject(data)) {
            return [data, null, null];
        }

    }
});

const excludeSymbols = [
    Symbol.for('nodejs.util.inspect.custom'),
];

function createValidatorFactory() {
    function createHandler(parentHandler, parentAssembler) {
        let propContext;
        let optional = false;
        const handler = {
            get: function (target /* the primer, or fn in the chain */, prop, receiver /* Proxy */) {
                // completling partials
                if (propContext && propContext.factory) {
                    propContext.fn = propContext.fn(prop); // this could throw
                    propContext.factory--;
                    if (propContext.factory === 0) {
                        const assembly = new Proxy(propContext.fn, createHandler(this, receiver)); // create parent-child-chain of handlers for callback
                        propContext = undefined;
                        return assembly;
                    }
                    return receiver;
                }
                if (propContext && propContext.factory === 0) {
                    const erMsg = `[${propContext.name}] <- this feautere is not fully configured, call it as a function (with or without arguments as needed)`;
                    throw new TypeError(erMsg);
                }
                if (prop === Symbol.toPrimitive) {
                    return this[prop];
                }
                if (excludeSymbols.includes(prop)) {
                    return undefined;
                }
                if (prop === $optional) {
                    return optional;
                }
                if (optional) { // closed!!
                    throw new TypeError(`this validator has been finalized, extend with property "internal"`);
                }
                if (prop === 'optional' && parentAssembler === undefined) {
                    throw new TypeError(`to early to specify "optional" marker, there is no validator`);
                }
                // this is akin to setting it
                if (prop === 'optional' && optional === false) {
                    optional = true;
                    return receiver;
                }
                const found = features.get(prop);
                if (!found) {
                    const erMsg = `[${String(prop)}] <- this validator feature is unknown`;
                    throw new TypeError(erMsg);
                }
                if (found.factory > 0) {
                    propContext = found; // park if or next
                    return receiver;
                }
                return new Proxy(found.fn, createHandler(this, receiver)); // create parent-child-chain of handlers for callback
            },
            set: function () {
                throw new TypeError(`cannot use assignment in this context`);
            },
            apply: function (target /* the primer, or fn in the chain */, thisArg /* the proxy object */, argumentList) {
                if (propContext && propContext.factory > 0) {
                    // must have a proxyt otherwise raise error
                    if (!thisArg) {
                        throw new TypeError(`finalizing a validator "${propContext.name}" must be done immediatly on creation`);
                    }
                    const temp = {
                        ...propContext,
                        fn: propContext.fn(...argumentList) // this can throw!!
                    };
                    temp.factory--;
                    if (temp.factory > 0) {
                        propContext = temp;
                        return thisArg;
                    }
                    propContext = undefined;
                    const assembly = new Proxy(temp.fn, createHandler(this, thisArg)); // create parent-child-chain of handlers for callback
                    return assembly;
                }
                //
                // actual calling the validator
                //
                if (parentAssembler === rootAssembler) {
                    const result = target(...argumentList); // for debugging a seperate rc
                    return result;
                }
                const [data, err, final] = parentAssembler(...argumentList);
                if (err || final) { // imediatly stop
                    return [data, err || null, final || null];
                }
                const result2 = target(...argumentList);
                return result2;
                //}
            },
            [Symbol.toPrimitive]: function ( /*hint*/) {
                return 'Object [validator]'; // TODO: replace this string by a usefull DAG
            }
        };
        return handler;
    }
    // bootstrap
    const rootAssembler = new Proxy(primer, createHandler());
    /* maybe do some tests here */
    return rootAssembler;
}

const validatorFactory = createValidatorFactory();

//const validator1 = validatorFactory.optional.range(-100, 100);// must throw
//const validator2 = validatorFactory.range(-100, 100);// should be ok
//const validator3 = validator2.range(-2, 2); // should be ok
//const validator4 = validatorFactory.object({})(); // should raise error, not finalized

const validator5 = validatorFactory.object({ a: () => [true] }).open; // should finalize
console.log(typeof validator5);

//console.log('>>', validator1(4));
//console.log('>>', validator1());
//console.log('>>', validator1(1))
//console.log('>>', validator3(99));
//console.log('>>', validator2());
//console.log(String(validator2))