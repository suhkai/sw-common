const http = require('http');

function setHeader(headers, name = 'content-type', value = 'application/json') {
    const contentTypeKey = Object.keys(headers).find(key => key.toLowerCase() === name.toLowerCase());
    if (contentTypeKey) {
        delete headers[contentTypeKey];
    }
    http.headers    
    headers[name] = value; 
    return headers;
}
/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 An HTTP header consists of its case-insensitive name followed by a colon (:), then by its value. Whitespace before the value is ignored.
 */
module.exports = setHeader;