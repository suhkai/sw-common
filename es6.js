console.log(this.document.body);
class Impure {
	constructor(a) {
		this.k = a;
	}
}

import('hello-world').then(({ default: _default }) => {
	console.log(_default);
});

const d = new Impure(a);

export { Impure, d };
export { createDocument } from 'react';
