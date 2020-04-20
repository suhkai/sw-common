module.exports = function indexOf(src, value, offset = 0) {
  let cnt = value.length - 1;
  for (let i = offset; i < src.length; i++) {
      if (src[value.length - 1 - cnt] === value[value.length - 1 - cnt]){
          cnt--;
          if (cnt < 0){
              return i - value.length - 1;
          }
          continue;
      }
      cnt = value.length - 1; // reset
  }
  return -1;
};
