'use strict'
module.exports = class Iterator {
    constructor(iterable) {
        this._cache = [];
        this._data = iterable;
        this[Symbol.iterator] = () => this;
        this._cursor = -1;
        this._value = undefined;
        this._ended = false;
    }
    _grow(n) {
        if (this._ended) {
            return;
        }
        if ((this._cache.length - 1) < n) {
            let diff = n - (this._cache.length - 1);
            for (; diff > 0; diff--) {
                const step = this._data.next();
                if (step.done) {
                    this._ended = true;
                    break;
                }

                this._cache.push(step.value);
            }
        }
    }

    _createValue() {
        return { d: this._value, o: this._cursor }
    }

    _createStep() {
        return Object.defineProperties(Object.create(null), {
            value: {
                get: () => {
                    if (this._cursor === -1) {
                        return undefined;
                    }
                    if (this._cursor <= this._cache.length - 1) {
                        return this._createValue();
                    }
                    return undefined;
                }
            },
            done: {
                get: () => this._cursor > this._cache.length - 1
            }
        });
    }
    next() {
        this._grow(this._cursor + 2);
    }
    peek() {
        return this._createStep();
    }
    reset(i = 0) {
        this._grow(i);
        if (i >= this._cache.length || i < 0) {
            this._cursor = this._cache.length;
            this._value = undefined;
            return;
        }
        this._cursor = i;
        this._value = this._cache[i];
    }
}