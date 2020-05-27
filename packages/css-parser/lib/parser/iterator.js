'use strict'
// this iterator is wrap around a tokeniterator and lazy evaluate the token stream
// this is an iterator produced by a generator,
module.exports = function createIterator(tkIter) {

    const data = [];
    let cursor = -1;
    let ended = false;
    let value;


    // n elements inclusive
    function grow(n) {
        if (ended) {
            return;
        }
        if ((data.length - 1) < n) {
            let diff = n - (data.length - 1);
            for (; diff > 0; diff--) {
                const step = tkIter.next();
                if (step.done) {
                    ended = true;
                    break;
                }
                data.push(step.value);
            }
        }
    }
    function createStep() {
        return Object.defineProperties(Object.create(null), {
            value: {
                get: () => {
                    if (cursor === -1) {
                        return undefined;
                    }
                    if (cursor <= data.length - 1) {
                        return { d: value, o: cursor };
                    }
                    return undefined;
                }
            },
            done: {
                get: () => cursor > data.length - 1
            }
        });
    }

    return {
        [Symbol.iterator]: function () { return this },
        slice(a, b) {
            grow(b - 1);
            return data.slice(a, b).map((t, i) => ({ d: t, o: (i + a) }));
        },
        next() {
            grow(cursor + 1);
            if (cursor <= data.length - 1) {
                value = data[++cursor];
            }
            return createStep();
        },
        reset(i = 0) {
            grow(i);
            if (i >= data.length || i < 0) {
                cursor = data.length;
                value = undefined;
                return;
            }
            cursor = i;
            value = data[cursor]
        },
        peek() {
            return createStep();
        }
    }
}