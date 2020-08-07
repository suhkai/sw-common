'use strict';
const { isWS, isNoPrint, isEscapeStart } = require('./checks-and-definitions');
const consumeName = require('./name')
const { URL, BAD_URL } = require('./tokens');
const absorbWS = require('./white-space')
const consumeEscape = require('./escape');



// 4.3.4. Consume an ident-like token
// https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token

module.exports = function url(name, iter) {
    // name is "url" string
    // "(" is already absorbed
    const step = iter.peek();
    let type = URL;
    let end;
    let prev = step.value;

    const replacements = [];

    // https://www.w3.org/TR/css-syntax-3/#consume-remnants-of-bad-url
    //4.3.14. Consume the remnants of a bad url
    function absorbBadUrl() {
        let prev = step.value;
        for(;;) {
          if (step.done){
            end = { o: prev.o, loc:{ col: prev.col, row: prev.row }};
            break;
          }
          if (step.value.d === ')'){
              prev = step.value;
              end = { o: prev.o, loc:{ col: prev.col, row: prev.row }};
              iter.next();
              break;
          }
          const sc = step.value;
          if (sc && sc.d === '\\') {
            iter.next();
            const _2 = step.value;
            if (isEscapeStart(sc, _2)) {
                const replace = consumeEscape(sc, iter);
                replacements.push([sc, replace]);
                prev = replace;
                continue;
            }
            else {
                iter.reset(sc.o, sc.col, sc.row);
            }
          }
          prev = step.value;
          iter.next()
        }
        let d = iter.slice(name.s.o, end.o + 1); // every char s
        replacements.reverse()
        for (const [_, replace] of replacements) {
            //{ s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
            d.splice(_.o - name.s.o, replace.o + 1 - _.o, replace.s)
        }
        return { id: BAD_URL, d: d.join(''), s: name.s, e: end };
    }

    if (step.value && isWS(step.value.d)) {
        prev = absorbWS(iter).e;
    }

    for(;;) {
        if (step.value && step.value.d === ')') {
            // end url token
            prev = step.value;
            iter.next();
            end = { o: prev.o, loc: { col: prev.col, row: prev.row } };
            break;
        }
        if (step.done) {
            end = { o: prev.o, loc: { col: prev.col, row: prev.row } };
            break;
        }
        if (isWS(step.value.d)) {
            prev = absorbWS(iter).e;
            if (step.done) {
                end = { o: prev.o, loc: { col: prev.loc.col, row: prev.loc.row } };
                break;
            }
            if (step.value.d === ')') {
                prev = step.value;
                iter.next();
                end = { o: prev.o, loc: { col: prev.col, row: prev.row } };
                break;
            }
            return absorbBadUrl();
        }
        const sc = step.value;
        if (sc && sc.d === '"' || sc.d === '\'' || sc.d === '(' || sc.d === '' || isNoPrint(sc.d)) {
            return absorbBadUrl();
        }
        // escape ??
        if (sc && sc.d === '\\') {
            iter.next();
            const _2 = step.value;
            if (isEscapeStart(sc, _2)) {
                const replace = consumeEscape(sc, iter);
                replacements.push([sc, replace]);
                prev = replace;
                continue;
            }
            else {
                iter.reset(sc.o, sc.col, sc.row);
                return absorbBadUrl()
            }
        }
        prev = step.value;
        iter.next();
    }
    // replace escaped
    let d = iter.slice(name.s.o, end.o + 1); // every char s
    replacements.reverse()
    for (const [_, replace] of replacements) {
        //{ s: '\uFFFD' , loc: { col: last.col, row: last.row }, o:last.o };
        d.splice(_.o - name.s.o, replace.o + 1 - _.o, replace.s)
    }
    return { id: URL, d: d.join(''), s: name.s, e: end };
}