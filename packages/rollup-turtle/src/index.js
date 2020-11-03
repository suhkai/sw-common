'use strict';

import { add } from 'computations';

//import get  from 'lodash/get';

console.log(add(1, 2));

//console.log(get());


//import('./some.json').then(({default:defaultExp}) => console.log(defaultExp));
//let hello;
import { hello } from './some.json'

import { count, increment } from './incrementer.js';

console.log(count); // 0
increment();
console.log(count); // 1

export function dingbats(x, y, z) {
    console.log(hello);
    return add(add(x, y), z);

}

export default dingbats;
