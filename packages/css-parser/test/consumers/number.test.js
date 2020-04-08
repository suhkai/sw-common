// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeNumber = require('../../lib/tokenizer/consumers/number');

describe('consume numbers', () => {
  [
    { i: '123', o: { id: 10, start: 0, end: 2 } },
    { i: '+123.4', o: { id: 10, start: 0, end: 5 } },
    { i: '+45E9.4', o: { id: 10, start: 0, end: 6 } },
    { i: 'Abc', o: undefined },
    { i: '-+34', o: undefined },
    { i: '0.34', o: { id: 10, start: 0, end: 3 } },
    { i: '+45E-9.4', o:{ id: 10, start: 0, end: 7 } },
  ].forEach(d => {
    it(`consume ${d.i}`, () => {
      const endinc = consumeNumber(d.i);
      if (d.o) {
        expect(endinc).to.deep.equal(d.o);
      }
    });
  })
});
