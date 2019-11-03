const fullTypeArrayCheck = require('./array-type-check');

modules.exports = collection => fullTypeArrayCheck( n => typeof n, 'number', collection);