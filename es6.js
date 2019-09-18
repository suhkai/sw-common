import re from 'react';
import { hello, world } from './slain.js'

console.log(re, hello, world);
/*
rendered it will look like this
(function (re) {
	'use strict';

	re = re && re.hasOwnProperty('default') ? re['default'] : re;

	console.log(re);

}(Reactx));
//# sourceMappingURL=bundle-2738170c-iife.js.map
*/
let v= 0
/*#__PURE__*/ function dosome(){
	v++;
}

function doother(){
	/*@__PURsqsdE__*/ dosome();
	return 1;
}

/*#__PURE__*/ console.log('side-effect');
const az = /*@__PURE__*/ doother();



console.log(this.document.body,v);

class Impure {
	constructor(a) {
		this.k = a;
	}
}

/*@__PURE__*/new Impure(a);
new Impure(a);