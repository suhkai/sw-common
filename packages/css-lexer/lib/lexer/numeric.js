// https://www.w3.org/TR/css-syntax-3/#consume-numeric-token

// NOTE: this is not the same as https://www.w3.org/TR/css-syntax-3/#consume-a-number
// NOTE: this is not the same as https://www.w3.org/TR/css-syntax-3/#consume-a-number
'use strict'
const consumeNumber = require('./number');
const { PERCENTAGE , DIMENSION } = require('./tokens');
const { isIdStart } = require('./checks-and-definitions');
const absorbName = require('./name');
// already checked that consuming a number will be successfull
module.exports = function(iter){
    const step = iter.peek();
    const number = consumeNumber(iter);
    
    if (!step.done){
        const _1 = step.value;
        iter.next();
        const _2 = step.value;
        iter.next();
        const _3 = step.value;
        iter.reset(_1.o,_1.col, _1.row);
        // dimension token?
        if (isIdStart(_1,_2,_3)){
          const name  = absorbName(iter);
          number.id = DIMENSION;
          number.dimension = name.value;
          number.neo = number.e.o;
          number.dso = name.s.o;
          number.e = name.e;
          return number;
        }
        //percentage?
        if (step.value.d === '%'){
            let perc = step.value;
            number.d += '%';
            number.id  = PERCENTAGE;
            let end = { loc: { col: perc.col, row: perc.row, o: perc.o } };
            number.e = end;
            iter.next();
            return number;
        }
    }
    return number;
}