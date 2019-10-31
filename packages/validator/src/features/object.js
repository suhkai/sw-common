const { features } = require('./dictionary');

features.set('object', {
    factory: 2,
    name: 'object',
    fn: function (schema) {
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
