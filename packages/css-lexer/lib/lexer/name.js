// consume name, this will be the "value" of the hash
// § 4.3.11. Consume a name
// https://www.w3.org/TR/css-syntax-3/#consume-a-name

'use strict';
const { isEscapeStart, isName } = require('./checks-and-definitions');
const consumeEscape = require('./escape');



module.exports = function name(iter) {
    const step = iter.peek();
    const _1 = step.value;
    const start = { loc: { col: _1.col, row: _1.row}, o: _1.o  };
    const replacements = [];
    let prev = _1;
    let end;
    while (!step.done) {
        const _next = step.value;
        if (isName(_next.d)) {
            prev = _next;
            iter.next();
            continue;
        }
        // consumeEscape ??
        if (_next.d === '\\') {
            iter.next();
            const _2 = step.value;
            if (isEscapeStart(_next, _2)) {
                const replace = consumeEscape(_next, iter);
                replacements.push([_next, replace]);
                prev = replace;
                continue;
            }
            else {
                iter.reset(prev.o, prev.col, prev.row);
            }
        }
        end = { loc: { col: prev.col, row: prev.row } ,  o: prev.o  };
        break;
    }
    if (!end) {
        end = { loc: { col: prev.col, row: prev.row },  o: prev.o  };
    }
    // replace escaped
    let d = iter.slice(_1.o, end.o + 1); // every char s
    replacements.reverse()
    for (const [_, replace] of replacements) {
        //{ s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
        d.splice(_.o - _1.o, replace.o + 1 - _.o, replace.s)
    }
    return { value: d.join(''), s: start, e: end };
}