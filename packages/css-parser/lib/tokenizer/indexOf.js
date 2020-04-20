'use strict';
module.exports = function indexOf(src, value, offset = 0) {
  let cnt = value.length - 1;
  let length = src.length;
  for (let i = offset; i < length;) {
    if (src[value.length - 1 - cnt + i] === value[value.length - 1 - cnt]) {
      cnt--;
      if (cnt < 0) {
        return i;
      }
      continue;
    }
    i++;
    cnt = value.length - 1; // reset
  }
  return -1;
};
