'use strict'
const { STRING, BADSTRING } = require('./tokens');
const { isNL, isEscapeStart } = require('./checks-and-definitions');
const escape = require('./escape');

// § 4.3.5. Consume a string token
// https://www.w3.org/TR/css-syntax-3/#consume-string-token
module.exports = function (iter) {
    const step = iter.peek();
    let f = step.value;
    iter.next();
    const start = { loc: { col: f.col, row: f.row }, o: f.o }
    let end;
    let prev;
    const replacements = [];
    let type = STRING;
    while (!step.done) {
        prev = step.value;
        if (prev.d === '\\'){
            iter.next();
            const _2 = step.value;
            if (isEscapeStart(prev,_2)){
                const replace = escape(prev, iter);
                replacements.push([prev,replace]);
                continue;
            }
            prev = step.value;
        }
        if (prev.d === f.d){
            end = { loc: { col: prev.col, row: prev.row } , o:prev.o };
            iter.next();
            break;
        }
        if (isNL(prev.d)){
            end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
            type = BADSTRING;
            iter.next();
            break;
        }
        iter.next();
    }
    if (!end) { //We hit the end of the stream
        end = { loc: { col: prev.col, row: prev.row }, o: prev.o };
    }
    // replace shit
    let d = iter.slice(start.o, end.o + 1).split(''); // every char s
    replacements.reverse()
    for( const [_1,replace]  of replacements){
        //{ s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
        d.splice(_1.o, replace.o+1-_1.o, replace.s)
    }
    return { id: type, value: d.join(''), s: start, e:end };
};
