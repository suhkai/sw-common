module.exports = function createIterator(data) {

    let cursor = -1;
    let col = 1;
    let row = 1;

    return {
        [Symbol.iterator]: function () { return this },
        next() {
            let value;
            if (cursor <= data.length - 1) {
                if (cursor >= 0) {
                    if (data[cursor] === '\r' && data[cursor + 1] === '\n') {
                        cursor += 2;
                        col = 1;
                        row += 1;
                    } else if (data[cursor + 1] !== '\n' && data[cursor] === '\r') {
                        cursor++;
                        col = 1;
                        row += 1;
                    } else if (data[cursor] === '\u000c') {
                        row += 1;
                        col = 1;
                        cursor++;
                    } else if (data[cursor] === '\n') {
                        row += 1;
                        col = 1;
                        cursor++;
                    }
                    else {
                        col++;
                        cursor++;
                    }
                }
                else {
                    cursor++;
                }
                value = data[cursor];
                if (value === '\r' || value === '\u000c') {
                    value = '\n'
                }
            }
            return Object.defineProperties(Object.create(null), {
                value: {
                    get: () => {
                        if (cursor <= data.length - 1) {
                            return { d: value, col, row, o: cursor };
                        }
                        return undefined;
                    }
                },
                done: {
                    get: () => cursor > data.length - 1
                }
            });
        },
        reset(i = 0, c = !i ? 1 : undefined, l = !i ? 1 : undefined) {
            if (i >= data.length || i < 0) {
                throw new Error(`index out of bounds of data length, len=${data.length} i=${i}`)
            }
            if (c) col = c;
            if (l) row = l;
            if (data[i] === '\n' && data[i - 1] === '\r') { // one step back
                i--;
            }
            cursor = i - 1
        },
        peek() {
            let value;
            if (cursor > data.length - 1) {
                return { done: true, value: undefined }
            }
            value = data[cursor];
            if (value === '\r' || value === '\u000c') {
                value = '\n'
            }
            return {
                value: { d: value, col, row, o: cursor },
                done
            }
        }
    }
}