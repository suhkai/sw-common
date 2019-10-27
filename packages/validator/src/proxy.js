
'use strict';

function primer() {/* noop primer  */
    console.log('function is called');
}

const features = new Map();

features.set('range', {
    factory: true,
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

features.set('optional', {
    factory: false,
    name: 'optional',
    fn: function optional(d) {
        if (d === undefined || d === null) {
            return [true, null, true]; // 3rd option of "true" terminates the chain of validations
        }
        return [d, null];
    }
});

function createValidatorFactory() {
    function createHandler(parentHandler, parentAssembler) {
        let propContext;
        const handler = {
            get: function (target /* the primer, or fn in the chain */, prop, receiver /* Proxy */) {
                if (prop === Symbol.toPrimitive) {
                    return this[prop];
                }
                if (propContext !== undefined) {
                    const erMsg = `[${propContext.name}] <- this feautere is not fully configured, call it as a function (with or without arguments as needed)`;
                    throw new TypeError(erMsg);
                }
                const found = features.get(prop);
                if (!found) {
                    const erMsg = `[${String(prop)}] <- this validator feature is unknown`;
                    throw new TypeError(erMsg);
                }
                if (found.factory === true) {
                    propContext = found; // park if or next
                    return receiver;
                }
                return new Proxy(found.fn, createHandler(this, receiver)); // create parent-child-chain of handlers for callback
            },
            apply: function (target /* the primer, or fn in the chain */, thisArg /* the proxy object */, argumentList) {
                if (propContext && typeof propContext === 'object') {
                    const temp = { ...propContext, fn: propContext.fn(...argumentList), factory: false };
                    propContext = undefined;
                    const assembly = new Proxy(temp.fn, createHandler(this, thisArg)); // create parent-child-chain of handlers for callback
                    return assembly;
                }
                if (parentAssembler === rootAssembler) {
                    const result = target(...argumentList); // for debugging a seperate rc
                    return result;
                }
                const [data, err, final] = parentAssembler(...argumentList);
                if (err || final) {// imediatly stop
                    return [data, err || null, final || null];
                }
                const result2 = target(...argumentList);
                return result2;
                //}
            },
            [Symbol.toPrimitive]: function (/*hint*/) {
                return 'Object [validator]'; // generate a usefull DAG overview
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

const validator1 = validatorFactory.optional.range(-100, 100)
const validator2 = validatorFactory.range(-100, 100)

const validator3 = validator1.range(-2, 2);

console.log('>>', validator1(4));
console.log('>>', validator1());
console.log('>>', validator1(1))
console.log('>>', validator3(99));
console.log('>>', validator2());
console.log(String(validator2))

