//§ 3.3 preporcessing
// returns instructions to preprocessing
module.exports = function* preprocessDetectReplacements(str, start, stop) {
  for (let i = start; i <= stop; i++) {
    switch (str[i]) {
      case '\u000c':
        yield { s: i, e: i, r: '\u0009' };
        break;
      case '\u0000':
        yield { s: i, e: i, r: '\ufffd' }
        break;
      case '\u000d':
        if (str[i + 1] === '\u000a') {
          yield { s: i, e: i + 1, r: '\u0009' }
          break;
        }
        yield { s: i, e: i, r: '\u0009' };
    }
  }
};