'use strict';

const { features } = require('./features/dictionary');
const $optional = Symbol.for('optional');
const $marker = Symbol.for('ladybug');
function primer() {
    /* noop primer  */
    console.log('function is called');
}
const excludeSymbols = [
    Symbol.for('nodejs.util.inspect.custom'),
];

function createValidatorFactory() {
    function createHandler(parentHandler, parentAssembler) {
        let propContext;
        let optional = false;
        const handler = Objec.freeze({
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
            },
            [$marker]: true
        });
        return handler;
    }
    // bootstrap
    const rootAssembler = new Proxy(primer, createHandler());
    /* maybe do some tests here */
    return rootAssembler;
}

function addFeature(feature) {
    // check the options,
    if (!isObject(feature)) {
        throw new TypeError(`feature should be a js object`);
    }
    if (typeof feature.name !== 'string') {
        throw new TypeError(`feature must have name of type string`);
    }
    // names are restructed javascript var names [0-1A-Za-z$_]
    if (/^[0-1A-Za-z$_]+$/.test(feature.name)) {
        throw new TypeError(`"name" value must be a string naming a javascript identifier`);
    }
    feature.factory = feature.factory || 0;
    if (feature.factory){
        if (typeof feature.factory !== 'number'){
            throw new TypeError(`"factory" property wants `);
        }
    }
    if (typeof feature.fn !== 'function'){
        throw new TypeError(`"fn" is missing you must specify a validator function`);
    }
    // all typechecks ok
    if (features.has(feature.name)){
        throw new TypeError(`a feature with the name ${feature.name} is already registered, register under a different name`);
    }
    features.set(feature.name, feature);
    return true;
}

function removeFeature(featureName) {
    return features.delete(featureName);
}

modules.exports = { V: createValidatorFactory(), addFeature, removeFeature };
