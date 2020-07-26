'use strict'

const Iterator = require('./Iterator');

module.exports = class CachedStringIterator extends Iterator {

    constructor(iterator) {
        super(iterator);
        this._col = 1;
        this._row = 1;
    }
    _createValue() {
        return { d: this._value, col: this._col, row: this._row, o: this._cursor };
    }
    _setCursor(c, cc, r) {
        c !== undefined && (this._cursor = c);
        cc !== undefined && (this._col = cc);
        r != undefined && (this._row = r);
    }
    slice(a, b) {
        this._grow(b - 1)
        return this._cache.slice(a, b);
    }
    next() {
        super.next();
        const c = this._cursor;
        const data = this._cache;
        if (c <= data.length - 1) {
            if (c >= 0) {
                if (data[c] === '\r' && data[c + 1] === '\n') {
                    this._setCursor(c + 2, 1, this._row + 1);
                } else if (data[c + 1] !== '\n' && data[c] === '\r') {
                    this._setCursor(c + 1, 1, this._row + 1);
                } else if (data[c] === '\u000c') {
                    this._setCursor(c + 1, 1, this._row + 1);
                } else if (data[c] === '\n') {
                    this._setCursor(c + 1, 1, this._row + 1);
                }
                else {
                    this._setCursor(c + 1, this._col+1);
                }
            }
            else {
                this._setCursor(c + 1);
            }
            this._value = data[this._cursor];
            if (this._value === '\r' || this._value === '\u000c') {
                this._value = '\n'
            }
        }
        return this._createStep();
    }
    reset(i = 0, c = !i ? 1 : undefined, l = !i ? 1 : undefined) {
        super.reset(i);
        if (this._value === undefined) {
            return;
        }
        const data = this._cache;
        let tvalue;
        if (c) this._col = c;
        if (l) this._row = l;
        if (data[i] === '\n' && data[i - 1] === '\r') { // one step back
            i--;
            tvalue = '\n'
        }
        else if (data[i] === '\r' || data[i] === '\u000c') {
            tvalue = '\n'
        }
        this._cursor = i;
        this._value = tvalue || data[this._cursor]
    }
}