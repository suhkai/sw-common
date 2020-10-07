'use strict';

import add from  './utils';

console.log(add(1,2));

export function dingbats(x,y,z){
    add(add(x,y),z)
}

export default dingbats;
