

const createRangeCheck = require('../createRangeCheck');
const { features } = require('./dictionary');

features.set('bool', {
    factory: 0,
    name: 'bool',
    fn: a => typeof a === 'boolean'
});

