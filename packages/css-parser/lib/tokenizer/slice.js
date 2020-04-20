'use strict';
module.exports = function slice(src, s, e) {
  if (e=== undefined) e = src.length;
  if (s=== undefined) s = 0;
  const rc = new Array({length: e-s});
  for (let i = s; i < e; i++){
    rc[i-s] = src[i];
  }
  return rc.join('');
};
