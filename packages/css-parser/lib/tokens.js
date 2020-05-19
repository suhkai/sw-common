'use strict'
module.exports = {
    BOM: 1,
    COMMENT: 2,
    WS:3,
    BADSTRING:4,
    STRING:5,
    HASH: 6,
    NUMBER: 7,
    DELIM: 8,
    CDC:9,
    CDO:10,
    // ident-like
    FUNCTION:11,
    IDENT:12,
    URL:13,
    BAD_URL:14
    // end of ident-like tokens
}