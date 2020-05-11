// describe it expect
const chai = require('chai');
const { expect } = chai;
const tokenizer = require('../lib/tokenizer');

describe('tokenizer', () => {
    it('css file starts with BOM', () => {
        const data = '\uFFFE\r\n\n\n/* a comment ';
        const res = Array.from(tokenizer(data));
        console.log(res.map( t => data.slice(t.s,t.e+1)));

    });
    it('css file starts with BOM', () => {
        const data = '\uFFFE\r\n\n\n/* a comment */ "hello"';
        const res = Array.from(tokenizer(data));
        console.log(res.map( t => data.slice(t.s,t.e+1)));
        

    });
    it('css file starts with BOM', () => {
        const data = '\uFFFE\r\n\n\n/* a comment */ "hello';
        const res = Array.from(tokenizer(data));
        console.log(res.map( t => data.slice(t.s,t.e+1)));

        //console.log(data);
    });
    it('css file starts with BOM', () => {
        const data = '\uFFFE\r\n\n\n/* a comment */ "hello\n"dzze"';
        const res = Array.from(tokenizer(data));
        console.log(res.map( t => data.slice(t.s,t.e+1)));
        

    });

});