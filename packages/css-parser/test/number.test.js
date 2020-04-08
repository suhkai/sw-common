// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeNumber = require('../lib/tokenizer/consumers/number');

describe('consume numbers', () => {
  [
    { i: '123', o: 3 },
    { i: '+123.4', o: 3 },
    { i: '+45E9.4', o: 4 },
    { i: 'Abc', o: -1, },
    { i: '-+34' }
  ].forEach(d => {
    it(`consume ${d.i}`, () => {
      const endinc = consumeNumber(d.i);
      if (d.o) {
        expect(endinc).to.equal(d.o);
      }
      else {
        console.log(d.i.slice(0, endinc + 1), endinc)
      }
    });
  })
});
