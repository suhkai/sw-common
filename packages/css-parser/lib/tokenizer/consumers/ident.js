
const consumeName = require('./name');

// § 4.3.4. Consume an ident-like token
// https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token
module.exports = function consumeIdentLikeToken(src, start, end) {

    let i = consumeName(src, start, end);

    const name = src.slice(start, i + 1);

    if (name.toLowerCase().startsWith('url(')){
        return consumeUrl(src,start);
    }
    if  (src[i] === '\u0028'){
        return consumeFunction(src, start); // can be "calc", "rgb" etc
    }  
    // just a regular token
    return { id: TYPE.Ident, start, end: i };
}