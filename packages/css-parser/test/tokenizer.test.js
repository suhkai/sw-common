// describe it expect
const chai = require('chai');
const { expect } = chai;
const tokenizer = require('../lib/tokenizer');

describe('tokenizer', () => {
    it('css file starts with BOM', () => {
        const data = '\uFFFE\r\n\n\n/* a comment ';
        const res = Array.from(tokenizer(data));
        console.log(JSON.stringify(res,null, 4))
        console.log(data);
    });

});