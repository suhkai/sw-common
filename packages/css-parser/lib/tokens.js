'use strict'
module.exports = {
    BOM: 1,
    COMMENT: 2,
    WS:3,
    BADSTRING:4,
    STRING:5,
    HASH: 6,
    // start numeric token group
    NUMBER: 7,
    PERCENTAGE: 8,
    DIMENSION: 9,
    // end numeric token group
    DELIM: 10,
    CDC:11,
    CDO:12,
    // ident-like
    FUNCTION:13,
    IDENT:14,
    URL:15,
    BAD_URL:16
    // end of ident-like tokens
}