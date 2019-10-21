'use strict';
const path = require('path');

module.exports = function stripAbsolutePath(fullPath) {

    const {
      root,
      dir,
      base,
      ext,
      name
    } = path.parse(fullPath);
  
    // if there is a root, correct the dir for this
    let dir2 = dir;
    if (root && dir.startsWith(root)) {
      dir2 = dir.slice(root.length);
    }
  
    const corrected = path.format({
      root: '',
      dir: dir2,
      base,
      ext,
      name
    });
    return corrected;
  }