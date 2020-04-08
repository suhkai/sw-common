
'use strict';

module.exports = {
    diff: true,
    bail: true,
    sort: true,
    exit: true,
    colors: true,
    'full-trace': true,
    recursive: true,
    extension: ['.js'],
    opts: false,
    bail: true,
    reporter: 'spec',
    'check-leaks': true,
    package: './package.json',
    //slow: 75,
    timeout: 0,
    color: true,
    ui: 'bdd'
};
