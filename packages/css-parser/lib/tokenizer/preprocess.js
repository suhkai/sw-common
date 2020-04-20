'use strict';

function defaultHandler() {
  return {
    getPrototypeOf: () => { }, //there is no prototype
    setPrototypeOf: () => false, // cannot set prototype
    isExtensible: () => false, // not extendable
    preventExtensions: () => true, // prevent extensions
    getOwnPropertyDescriptor: () => undefined, // no property descriptor in format {...}
    defineProperty: () => false,// definitions always fail, in strict mode will throw a TypedError exception
    has: () => false, // has no properties via "in"
    get: () => undefined, // "override" most likely
    set: () => false, // setting failed and in strict mode will though prototype exception
    deleteProperty: () => false, // deletions not possible
    ownKeys: () => [], // no keys
    apply: () => { throw new TypeError(`Validator not finalized`); }, // "override" most likely
    construct: () => { } // return emoty object
  };
}

/*
3.3. Preprocessing the input stream:
The input stream consists of the code points pushed into it as the input byte stream is decoded.

Before sending the input stream to the tokenizer, implementations must make the following code point substitutions:

Replace any U+000D CARRIAGE RETURN (CR) code points, U+000C FORM FEED (FF) code points, or pairs of U+000D CARRIAGE RETURN (CR) followed by U+000A LINE FEED (LF), by a single U+000A LINE FEED (LF) code point.
Replace any U+0000 NULL or surrogate code points with U+FFFD REPLACEMENT CHARACTER (�).
*/

//            x 
// 0yy00000yy0000yy  <- raw
// 0123456789abcefg  <- index of raw
// 0y00000y0000y     <- run-time virtual overlaw
//        x          <- position in virtual space, need to map back to real space

const map = {
  '\u000c': '\u000a',
  '\u0000': '\ufffd',
  '\u000d': '\u000a'
};


module.exports = function createPreprocessorOverlay(str) {
  if (typeof str !== 'string') {
    throw new Error('source must be of type string');
  }
  if (str.length === 0) {
    throw new Error('source must NOT be an empty string');
  }
  // 2 pass "compiler"
  // 1st pass, get the counts
  let twosL = 0;
  let i = 0;
  let twos;
  for (; i < str.length; i++) {
    if (str[i] === '\u000D' && str[i + 1] === '\u000A') {
      twosL++;
    }
  }

  if (twosL) {
    twos = new Uint32Array(twosL); // bloody fast
    let tc = 0;
    i = 0;
    for (; i < str.length; i++) {
      if (str[i] === '\u000D' && str[i + 1] === '\u000A') {
        twos[tc++] = i;
      }
    }
  }

  return new Proxy(()=>{}, Object.assign(defaultHandler(), {
    get(target/* not needed in this case */, _prop, /*receiver: Proxy */) {
      if (_prop === 'length'){
        return str.length - twosL;
      }
      let prop = Number.parseInt(_prop, 10);
      if (!Number.isInteger(prop) || prop >= str.length || prop < 0) {
        return undefined;
      }
      let rawC;
      if (!twosL) {
        rawC = str[prop];
        return map[rawC] || rawC;
      }
      let i = 0;
      let real = prop;
      if (real < twos[0]){// shortcut
        rawC = str[prop];
        return map[rawC] || rawC;
      }
      if (real > twos[twos.length - 1]){
        rawC = str[prop + twosL];
        return map[rawC] || rawC;
      }
      while (real > twos[i]) { // need to make corrections
        i++;
        real++;
      }
      if (real >= str.length){
        return
      }
      if (real === twos[i]) {
        return '\u000a';
      }
      rawC = str[real];
      return map[rawC] || rawC;
    },
    // for debugging remove later
    apply (target /* the primer, or fn in the chain */, thisArg /* the proxy object */, argumentList) {
      return twos; // for debugging
    }  
  }
  ));
}
