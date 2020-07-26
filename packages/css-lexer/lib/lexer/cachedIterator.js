'use strict'
// this iterator is wrap around a tokeniterator and lazy evaluate the token stream

const Iterator = require('./Iterator');

module.exports = class CachedIterator extends Iterator {

    constructor(iterable) {
        super(iterable);
    }
    slice(a, b) {
        this._grow(b - 1);
        return this._cache.slice(a, b).map((t, i) => ({ d: t, o: (i + a) }));
    }
    next() {
        super.next();
        const data = this._cache;
        if (this._cursor <= data.length - 1) {
            this._value = data[++this._cursor];
        }
        return this._createStep();
    }
}