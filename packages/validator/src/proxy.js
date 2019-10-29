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

features.set('object', {
    // x->2, object 
    // 2->1, call object({...})
    // 1->0, you finalized with "open" or "closed",
    factory: 2,
    name: 'object',
    fn: function (props) {
        // must be an object
        if (!isObject(props)) {
            const errMsg = `specify a JS object with validators to verify an object`;
            throw new TypeError(errMsg);
        }
        const descr = {
            strings: Object.getOwnPropertyNames(props),
            symbols: Object.getOwnPropertySymbols(props)
        };
        const propCount = descr.strings.length + descr.symbols.length;
        if (propCount === 0) {
            const errMsg = `the JS validator object does not have any properties defined`;
            throw new TypeError(errMsg);
        }
        const nonFunctions = descr.filter(f => typeof props[f] !== 'function');
        if (nonFunctions.length){
            const errMsg = `the JS validator object does not have any properties defined`;
            throw new TypeError(errMsg);
        }
        // all ok with the object
        return function sealing(propName) {
            if (propName !== 'open' && propName !== 'closed') {
                const errMsg = `object must be closed by "open" or "closed" modofifier, not with "${propName}"`;
                throw new TypeError(errMsg);
            }
            // all ok with the modifiers
            return function validateObject(obj) { // Return dummy validator
                if (propName === 'closed'){
                    const _symbols = Object.getOwnPropertySymbols(obj);
                    const _strings = Object.getOwnPropertyNames(obj);
                    // no strings outside the one form props
                    const forbiddenStrings = _strings.filter(f=>{
                        return descr.strings.includes(f) === false;
                    });
                    // symbols are converted to strings!!
                    const forbiddenSymbols = _symbols.filter(f=>{
                        return descr.symbols.includes(f) === false;
                    }).map(String);
                    
                    if (forbiddenStrings.length + forbiddenSymbols.length){
                        const stringProps = forbiddenStrings.length ?  `stringprops:[${forbiddenStrings.join('|')}]`: '';
                        const symbolProps = forbiddenSymbols.length ? `symbolsprops:[${forbiddenSymbols.join('|')}]`: ''; 
                        const errMsg = `The validating object schema is closed. Forbidden properties: ${stringProps} ${symbolProps}`;
                        return [null, errMsg];
                    }
                }
                // 2. Check if any of the props arent defined then check if they are optional, if they are not
                // collect errors
                const shouldBeManditory = [];
                // handle symbols
                for (const symb of descr.symbols){
                    if (!(symb in obj)){
                        shouldBeManditory.push(`${String(symb)} is manditory but absent from the object`);
                    }
                }
                for (const props of descr.strings){
                    if (!(props in obj)){
                        shouldBeManditory.push(`"${props}" is manditory but absent from the object`);
                    }
                }
                if (shouldBeManditory.length){
                    return [null, shouldBeManditory.join('|')];
                }
                // TODO: need to make loop over all validators while making a path, how do we do symbols??? there is no structure behind symbols
                for (const symb of descr.symbols){
                    if (!(symb in obj)){
                        shouldBeManditory.push(`${String(symb)} is manditory but absent from the object`);
                    }
                }
                // 3. now we check the values of the props by calling the validators with the values
                // 4. the stored values are returned, the data is immutable, return new data object, (this makes transformations possible)
                // should it be 
                return [obj, null];
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
                if (prop === Symbol.for('optional')) {
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