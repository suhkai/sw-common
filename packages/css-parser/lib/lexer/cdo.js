'use strict'
const { CDO } = require('./tokens');

module.exports = function composeCDOToken(_1, _2, _3) {
    if (_1 && _1.d === '<') {
        if (_2 && _2.d === '-') {
            if (_3 && _3.d === '-') {
                return {
                    id: CDO, 
                    d: '<--', 
                    s: { o:_1, loc:{ col:_1.col, row: _1.row}},
                    e: { o:_3, loc:{ col:_3.col, row: _3.row}}
                }
            }
        }
    }
    return
}