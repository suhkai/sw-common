const createRangeCheck = require('../createRangeCheck');

const { features } = require('./dictionary');
const { isFunction } = require('../equals');

features.set('function', {
    factory: 0,
    name: 'function',
    fn: isFunction
});