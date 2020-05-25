'use strict'
module.exports = {
    BOM: 1,
    COMMENT: 2,
    WS: 3,
    BADSTRING: 4,
    STRING: 5,
    HASH: 6,
    // start numeric token group
    NUMBER: 7,
    PERCENTAGE: 8,
    DIMENSION: 9,
    // end numeric token group
    DELIM: 10,
    CDC: 11,
    CDO: 12,
    // ident-like
    FUNCTION: 13,
    IDENT: 14,
    URL: 15,
    BAD_URL: 16,
    // end of ident-like tokens
    COLON: 17,
    SEMICOLON: 18,
    ATTOKEN: 19,
    LEFTSB_TOKEN: 20,
    RIGHTSB_TOKEN: 21,
    LEFTCB_TOKEN: 22,
    RIGHTCB_TOKEN: 23,
}